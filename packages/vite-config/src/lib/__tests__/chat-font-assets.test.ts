import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build, type Plugin } from 'vite';
import { afterAll, beforeAll, expect, test } from 'vitest';

import { createEsmConfig, createIifeConfig, type LibViteOptions } from '../config';

const repoRoot = fileURLToPath(new URL('../../../../../', import.meta.url));
const fontStyle = resolve(repoRoot, 'packages/pro-components/chat/chat-message/style/cherry-icon-font.less');
const fontExtensions = ['eot', 'eot', 'woff2', 'woff', 'ttf', 'svg'];
const entryId = 'virtual:chat-font-fixture';
const options: LibViteOptions = {
  pkg: { name: '@tdesign/web-components-chat', version: '0.0.0' },
  packageDir: resolve(repoRoot, 'packages/tdesign-web-components-chat'),
  srcDir: resolve(repoRoot, 'packages/pro-components/chat'),
  iifeGlobalName: 'ChatFontFixture',
  pipeline: {},
};

let outputDir: string;
let esmEntry: string;

function fixturePlugin(source: string): Plugin {
  return {
    name: 'chat-font-fixture',
    resolveId: (id) => (id === entryId ? `\0${entryId}` : undefined),
    load: (id) => (id === `\0${entryId}` ? source : undefined),
  };
}

function getFontUrls(css: string): string[] {
  const fontFace = css.match(/@font-face\s*\{[^}]*\}/)?.[0];
  expect(fontFace).toBeDefined();
  const urls = Array.from(
    fontFace!.matchAll(/url\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/g),
    (match) => match[1] ?? match[2] ?? match[3],
  );
  expect(urls).toHaveLength(fontExtensions.length);
  return urls;
}

async function originalFont(index: number) {
  return readFile(resolve(repoRoot, `node_modules/cherry-markdown/dist/fonts/ch-icon.${fontExtensions[index]}`));
}

beforeAll(async () => {
  outputDir = await mkdtemp(resolve(tmpdir(), 'tdesign-chat-font-'));
  esmEntry = resolve(outputDir, 'font.mjs');
  const config = createEsmConfig(options);
  await build({
    ...config,
    configFile: false,
    plugins: [...config.plugins!, fixturePlugin(`export { default } from ${JSON.stringify(`${fontStyle}?inline`)};`)],
    build: {
      ...config.build,
      outDir: outputDir,
      sourcemap: false,
      rolldownOptions: {
        ...config.build?.rolldownOptions,
        input: entryId,
        output: { format: 'es', entryFileNames: 'font.mjs' },
      },
    },
  });
});

afterAll(async () => {
  if (outputDir) await rm(outputDir, { recursive: true, force: true });
});

test('ESM font URLs resolve to emitted files relative to the module', async () => {
  const { default: css } = await import(/* @vite-ignore */ pathToFileURL(esmEntry).href);
  const urls = getFontUrls(css);

  for (const [index, url] of urls.entries()) {
    expect(url).toMatch(/^file:/);
    expect(await readFile(fileURLToPath(url))).toEqual(await originalFont(index));
  }
  expect(new URL(urls[1]).hash).toBe('#iefix');
  expect(new URL(urls[5]).hash).toBe('#ch-icon');
});

test.each(['/', '/nested/app/', './'])('ESM fonts survive consumer rebundling with base %s', async (base) => {
  const consumerDir = resolve(outputDir, `consumer-${base === './' ? 'relative' : base === '/' ? 'root' : 'nested'}`);
  const result = await build({
    configFile: false,
    root: outputDir,
    base,
    logLevel: 'warn',
    plugins: [fixturePlugin(`export { default } from ${JSON.stringify(esmEntry)};`)],
    build: {
      outDir: consumerDir,
      emptyOutDir: true,
      assetsInlineLimit: 0,
      minify: false,
      rolldownOptions: {
        input: entryId,
        preserveEntrySignatures: 'strict',
        output: { format: 'es', entryFileNames: 'assets/app.mjs' },
      },
    },
  });
  if (!('output' in result)) throw new Error('Expected a single consumer build');
  const entry = result.output.find((item) => item.type === 'chunk' && item.isEntry);
  if (!entry || entry.type !== 'chunk') throw new Error('Missing consumer entry');
  const prefix = base === './' ? `${pathToFileURL(consumerDir).pathname}/` : base;
  const { default: css } = await import(/* @vite-ignore */ pathToFileURL(resolve(consumerDir, entry.fileName)).href);

  for (const [index, url] of getFontUrls(css).entries()) {
    const assetUrl = new URL(url);
    expect(assetUrl.pathname.startsWith(`${prefix}assets/`)).toBe(true);
    const fileName = assetUrl.pathname.slice(prefix.length);
    const asset = result.output.find((item) => item.type === 'asset' && item.fileName === fileName);
    if (!asset || asset.type !== 'asset') throw new Error(`Missing font asset: ${fileName}`);
    expect(Buffer.from(asset.source)).toEqual(await originalFont(index));
  }
});

test('IIFE fonts are self-contained when the script and page have different origins', async () => {
  const config = createIifeConfig(options);
  const result = await build({
    ...config,
    configFile: false,
    plugins: [...config.plugins!, fixturePlugin(`export { default } from ${JSON.stringify(`${fontStyle}?inline`)};`)],
    build: {
      ...config.build,
      write: false,
      sourcemap: false,
      lib: { entry: entryId, name: 'ChatFontFixture', formats: ['iife'], fileName: () => 'font.js' },
      rolldownOptions: { ...config.build?.rolldownOptions, input: entryId },
    },
  });
  const output = Array.isArray(result) ? result[0] : result;
  if (!('output' in output)) throw new Error('Expected an IIFE build result');
  const entry = output.output.find((item) => item.type === 'chunk' && item.isEntry);
  if (!entry || entry.type !== 'chunk') throw new Error('Missing IIFE entry');
  const context = {
    document: {
      baseURI: 'https://app.example.com/nested/page/',
      currentScript: { tagName: 'SCRIPT', src: 'https://cdn.example.com/package/dist/font.js' },
    },
    ChatFontFixture: '',
  };
  runInNewContext(entry.code, context);

  for (const [index, url] of getFontUrls(context.ChatFontFixture).entries()) {
    expect(url).toMatch(/^data:/);
    const response = await fetch(url);
    const actual = Buffer.from(await response.arrayBuffer());
    const expected = await originalFont(index);
    if (fontExtensions[index] === 'svg') {
      // Vite 在生成 SVG data URL 时会压缩空白并将双引号转为单引号。
      const normalized = expected.toString().trim().replace(/>\s+</g, '><').replace(/"/g, "'").replace(/\s+/g, ' ');
      expect(actual.toString() === normalized, 'SVG font content').toBe(true);
    } else {
      expect(actual.equals(expected), fontExtensions[index]).toBe(true);
    }
  }
});
