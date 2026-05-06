import { h } from 'omi';

const ENV = process.env.NODE_ENV;
if (
  ENV !== 'test' &&
  ENV !== 'production' &&
  typeof console !== 'undefined' &&
  console.warn && // eslint-disable-line no-console
  typeof window !== 'undefined'
) {
  // eslint-disable-next-line no-console
  console.warn('You are using a whole package of TDesign!');
}

(window as any).h = h;

export * from './index';
