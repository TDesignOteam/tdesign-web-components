import debounce from 'lodash/debounce';

const toLowercaseSeparator = (key: string) => key.replace(/([A-Z])/g, '-$1').toLowerCase();

// style对象转字符串
export const getStyleStr = (style: Partial<CSSStyleDeclaration>): string =>
  Object.keys(style)
    .map((key: keyof CSSStyleSheet) => `${toLowercaseSeparator(key)}: ${style[key]};`)
    .join(' ');

const DEFAULT_OPTIONS = {
  debounceTime: 0,
  config: {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  } as MutationObserverInit,
};

export const createMutationObservable = (
  targetEl: HTMLElement | null,
  cb: MutationCallback,
  options = DEFAULT_OPTIONS,
) => {
  const { debounceTime, config } = options;
  const observer = new MutationObserver(debounceTime > 0 ? debounce(cb, debounceTime) : cb);

  const targetNode = targetEl || document.body;

  observer.observe(targetNode, config);

  return () => {
    observer.disconnect();
  };
};
