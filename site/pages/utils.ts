// 根据所传入的路径生成对应的shadow selector
export const getShadowSelector = (path: string[]): HTMLElement | null =>
  path.slice(1).reduce(
    (pre, next) => {
      if (pre?.shadowRoot) {
        return pre?.shadowRoot?.querySelector(next) as HTMLElement;
      }
      return pre;
    },
    document.querySelector(path[0]) as HTMLElement,
  );
