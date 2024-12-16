import htm from 'htm';
import { h, render } from 'omi';

declare global {
  interface Window {
    h: typeof h;
    jsx: (strings: TemplateStringsArray, ...values: any[]) => Omi.VNode<any> | Omi.VNode<any>[];
    render: typeof render;
  }
}
const jsx = htm.bind(window.h);

window.jsx = jsx;

window.render = render;

export default jsx;

export { render };
