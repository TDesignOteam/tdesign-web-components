import { isFunction, isString } from 'lodash-es';
import { computed, signal, SignalValue } from 'omi';

export const toSignal = <T extends Record<string, any>>(props: T) => {
  const reactiveObject: { [K in keyof T]?: SignalValue<T[K]> } = {};
  Object.keys(props).forEach((key) => {
    const propKey = key as keyof T;
    reactiveObject[propKey] = signal(props[propKey]);
  });
  return reactiveObject;
};

export const toRef = <T extends Record<string | symbol, any>>(props: SignalValue<T>) => {
  const reactiveObject: { [K in keyof T]?: SignalValue<T[K]> } = {};
  Object.keys(props.value).forEach((key) => {
    const propKey = key as keyof T;
    reactiveObject[propKey] = computed(() => props.value[propKey]);
  });
  return new Proxy(reactiveObject, {
    get(target, prop) {
      return target[prop] ? target[prop] : signal(undefined);
    },
  });
};

export const t = function <T>(pattern: T, ...args: any[]) {
  const [data] = args;
  if (isString(pattern)) {
    if (!data) return pattern;
    const regular = /\{\s*([\w-]+)\s*\}/g;
    const translated = pattern.replace(regular, (match, key) => {
      if (data) {
        return String(data[key]);
      }
      return '';
    });
    return translated;
  }
  if (isFunction(pattern)) {
    console.error('NOT IMPLEMENTED');
    // if (!args.length) return pattern(h);
    return '';
  }
  return '';
};
