// 防止相关事件执行两次，如：点击一个按钮，会先后触发 button 内部的 click 和 t-button 的 click 事件
export default function eventDispose(name: string, e: MouseEvent, fn: () => boolean): void {
  e.stopImmediatePropagation();
  if (fn()) {
    this.fire(name, { e, context: this });
  }
}
