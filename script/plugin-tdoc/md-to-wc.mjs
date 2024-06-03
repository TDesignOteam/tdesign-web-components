import fs from 'fs';
import matter from 'gray-matter';
import esbuild from 'esbuild';
import { spawn } from 'node:child_process';
// import camelCase from 'camelcase';
// import { compileUsage } from '../../src/_common/docs/compile';

// import testCoverage from '../test-coverage';

// import { transformSync } from '@babel/core';

/**
 * 获取文件 git 最后更新时间
 * @param {string} file
 * @returns {Promise<number>}
 */

function getGitTimestamp(file) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['log', '-1', '--pretty="%ci"', file]);
    let output = '';
    child.stdout.on('data', (d) => {
      output += String(d);
    });
    child.on('close', () => {
      resolve(+new Date(output));
    });
    child.on('error', reject);
  });
}

export default async function mdToReact(options) {
  const mdSegment = await customRender(options);
  const { demoDefsStr, demoCodesDefsStr } = options;

  const reactSource = `
    import { h } from 'omi';
    import { signal, effect } from 'reactive-signal'
    import Prismjs from 'prismjs';
    import 'prismjs/components/prism-bash.js';
    ${demoDefsStr}
    ${demoCodesDefsStr}

    export default function TdDoc() {
      const isComponent  = ${mdSegment.isComponent};
      const mdSegment = ${JSON.stringify(mdSegment)};

      const docInfo = {
        title: \`${mdSegment.title}\`,
        desc:  \`${mdSegment.description}\`
      }

      const header = document.createElement('td-doc-header');
      header.slot = 'doc-header';
      header.docInfo = docInfo;
      header.spline = '${mdSegment.spline}';
      header.platform = 'web';
      // slot只作用一层的原因
      const headerWrapper = document.querySelector("router-view")?.shadowRoot?.querySelector("td-wc-content");
      const hasHeader = headerWrapper?.shadowRoot?.querySelector('td-doc-header');
      if(mdSegment.tdDocHeader && !hasHeader){
        headerWrapper?.append(header);
      }

      function useQuery() {
        return new URLSearchParams(window.location.search);
      }

      function isShow(currentTab) {
        return currentTab === tab.value ? { display: 'block' } : { display: 'none' };
      }

      let tabs = [];
      if (isComponent) {
        tabs = ${JSON.stringify(mdSegment.tdDocTabs)};
      }

      const query = useQuery();
      const tab = signal(query.get('tab') || 'demo');
      const tabRef = signal({});

      effect(() => {
        tabRef.value?.addEventListener?.('change', (event) => {
          tab.value = event.detail;
          const query = useQuery();
          console.log('query',query);
          if (query.get('tab') === event.detail) return;
          window.location.search = '?tab=' + event.detail;
        })
      })


      document.title = \`${mdSegment.title} | TDesign\`;

      Prismjs.highlightAll();

      return (
        <>
        {
          isComponent ? (
            <>
              <td-doc-tabs ref={(e) => {tabRef.value = e;tabRef.update();}} tabs={tabs} tab={tab.value}></td-doc-tabs>
              <div style={isShow('demo')} name="DEMO">
                ${mdSegment.demoMd}
                <td-contributors platform="web" framework="web-components" component-name="${
                  mdSegment.componentName
                }" ></td-contributors>
              </div>
              <div style={isShow('api')} name="API">
                ${mdSegment.apiMd}
              </div>
            </>
          ) : <div name="DOC" className="${mdSegment.docClass}">${mdSegment.docMd}</div>
        }
        <div style={{ marginTop: 48 }}>
          <td-doc-history time={${mdSegment.lastUpdated}} key={${mdSegment.lastUpdated}}></td-doc-history>
        </div>
        </>
      )
    }
  `;

  const result = esbuild.transformSync(reactSource, {
    loader: 'tsx',
    jsxFactory: 'h',
    jsxFragment: 'h.f',
  });

  return { code: result.code, map: result.map };
}

const DEAULT_TABS = [
  { tab: 'demo', name: '示例' },
  { tab: 'api', name: 'API' },
  { tab: 'design', name: '指南' },
];

// 解析 markdown 内容
async function customRender({ source, file, md }) {
  const { content, data } = matter(source);
  const lastUpdated = (await getGitTimestamp(file)) || Math.round(fs.statSync(file).mtimeMs);

  // md top data
  const pageData = {
    spline: '',
    toc: true,
    title: '',
    description: '',
    isComponent: false,
    tdDocHeader: true,
    tdDocTabs: DEAULT_TABS,
    apiFlag: /#+\s*API/,
    docClass: '',
    lastUpdated,
    ...data,
  };

  // md filename
  const reg = file.match(/src\/components\/(\w+-?\w+)\/(\w+-?\w+)\.md/);
  const componentName = reg && reg[1];

  // split md
  // eslint-disable-next-line prefer-const
  let [demoMd = '', apiMd = ''] = content.split(pageData.apiFlag);

  // fix table | render error
  demoMd = demoMd.replace(
    /`([^`\r\n]+)`/g,
    (str, codeStr) => `<td-code text="${codeStr.replace(/"/g, "'")}"></td-code>`,
  );

  const mdSegment = {
    ...pageData,
    componentName,
    usage: { importStr: '' },
    docMd: '<td-doc-empty></td-doc-empty>',
    demoMd: '<td-doc-empty></td-doc-empty>',
    apiMd: '<td-doc-empty></td-doc-empty>',
    designMd: '<td-doc-empty></td-doc-empty>',
  };

  // 渲染 live demo
  // if (pageData.usage && pageData.isComponent) {
  //   const usageObj = compileUsage({
  //     componentName,
  //     usage: pageData.usage,
  //     demoPath: path.posix.resolve(__dirname, `../../src/${componentName}/_usage/index.jsx`),
  //   });
  //   if (usageObj) {
  //     mdSegment.usage = usageObj;
  //     demoMd = `${usageObj.markdownStr} ${demoMd}`;
  //   }
  // }

  if (pageData.isComponent) {
    mdSegment.demoMd = md.render.call(
      md,
      `${pageData.toc ? '[toc]\n' : ''}${demoMd.replace(/<!--[\s\S]+?-->/g, '')}`,
    ).html;
    mdSegment.apiMd = md.render.call(
      md,
      `${pageData.toc ? '[toc]\n' : ''}${apiMd.replace(/<!--[\s\S]+?-->/g, '')}`,
    ).html;
  } else {
    mdSegment.docMd = md.render.call(
      md,
      `${pageData.toc ? '[toc]\n' : ''}${content.replace(/<!--[\s\S]+?-->/g, '')}`,
    ).html;
  }

  return mdSegment;
}
