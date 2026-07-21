import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

const webdriverUrl = process.env.CHROME86_WEBDRIVER_URL || 'http://127.0.0.1:4444/wd/hub';
const smokeHost = process.env.CHROME86_HOSTNAME || '127.0.0.1';
const timeoutMs = 30000;

const smokeHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/tdesign.css" />
  </head>
  <body>
    <t-dialog visible header="Chrome 86 Dialog">Dialog content</t-dialog>
    <t-chatbot></t-chatbot>
    <script>
      window.__chrome86Smoke = { done: false, errors: [], userAgent: navigator.userAgent };
      window.addEventListener('error', function (event) {
        window.__chrome86Smoke.errors.push(event.message || String(event.error || event));
      });
      window.addEventListener('unhandledrejection', function (event) {
        window.__chrome86Smoke.errors.push(String(event.reason || event));
      });
    </script>
    <script src="/tdesign.js"></script>
    <script>
      (async function () {
        var state = window.__chrome86Smoke;
        try {
          if (!/Chrome\\/86\\./.test(navigator.userAgent)) {
            throw new Error('Expected Chrome 86, got: ' + navigator.userAgent);
          }
          await customElements.whenDefined('t-dialog');
          await customElements.whenDefined('t-chatbot');
          state.done = true;
        } catch (error) {
          state.errors.push(error && error.message ? error.message : String(error));
          state.done = true;
        }
      })();
    </script>
  </body>
</html>`;

function startServer() {
  const server = createServer((request, response) => {
    if (request.url === '/tdesign.css') {
      response.writeHead(200, { 'content-type': 'text/css' });
      response.end(readFileSync('dist/tdesign.css'));
      return;
    }

    if (request.url === '/tdesign.js') {
      response.writeHead(200, { 'content-type': 'text/javascript' });
      response.end(readFileSync('dist/TDesign Web Components.js'));
      return;
    }

    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(smokeHtml);
  });

  return new Promise((resolve) => {
    server.listen(0, '0.0.0.0', () => resolve(server));
  });
}

async function webdriver(method, path, body) {
  const response = await fetch(`${webdriverUrl}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`${method} ${path} failed: ${JSON.stringify(data)}`);
  return data.value ?? data;
}

async function createSession() {
  const response = await fetch(`${webdriverUrl}/session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
    capabilities: {
      alwaysMatch: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless', '--disable-gpu', '--no-sandbox'],
        },
      },
    },
    }),
  });
  const data = await response.json();

  if (!response.ok) throw new Error(`POST /session failed: ${JSON.stringify(data)}`);
  return data.sessionId || data.value?.sessionId;
}

async function execute(sessionId, script) {
  return webdriver('POST', `/session/${sessionId}/execute/sync`, { script, args: [] });
}

async function waitForResult(sessionId) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const result = await execute(sessionId, 'return window.__chrome86Smoke || null;');
    if (result?.done) return result;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Chrome 86 smoke test timed out');
}

const server = await startServer();
let sessionId;

try {
  const { port } = server.address();
  sessionId = await createSession();
  await webdriver('POST', `/session/${sessionId}/url`, { url: `http://${smokeHost}:${port}` });

  const result = await waitForResult(sessionId);
  if (result.errors.length) throw new Error(result.errors.join('\n'));

  console.log(`Chrome 86 smoke test passed: ${result.userAgent}`);
} finally {
  if (sessionId) await webdriver('DELETE', `/session/${sessionId}`).catch(() => {});
  server.close();
}
