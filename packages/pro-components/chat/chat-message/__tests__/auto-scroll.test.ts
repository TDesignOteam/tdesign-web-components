import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import AutoScroll from '../auto-scroll';

vi.mock('tdesign-icons-web-components/esm/components/check-circle', () => ({}));
vi.mock('tdesign-icons-web-components/esm/components/close-circle', () => ({}));
vi.mock('@tdesign/web-components-shared/_util/classname', () => ({ getClassPrefix: () => 't' }));
vi.mock('../../chatbot/style/auto-scroll.less', () => ({ default: '' }));
vi.mock('omi', () => ({
  Component: class {
    props = { maxHeight: 120 };
  },
  createRef: () => ({ current: null }),
  tag: () => (component: unknown) => component,
}));

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];

  observe = vi.fn();

  disconnect = vi.fn();

  constructor(public callback: () => void) {
    ResizeObserverMock.instances.push(this);
  }
}

function createScroll() {
  const component = new AutoScroll();
  const scroll = { scrollTop: 0, scrollHeight: 400, clientHeight: 120, scrollTo: vi.fn() };
  component['scrollRef'].current = scroll as unknown as HTMLDivElement;
  component['innerRef'].current = {} as HTMLDivElement;
  return { component, scroll };
}

beforeEach(() => {
  vi.useFakeTimers();
  ResizeObserverMock.instances = [];
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('auto-scroll cleanup', () => {
  test('can uninstall before ready initializes the observer', () => {
    const { component } = createScroll();

    expect(() => component.uninstall()).not.toThrow();
    expect(ResizeObserverMock.instances).toHaveLength(0);
  });

  test('disconnects the observer and cancels deferred initialization', () => {
    const { component } = createScroll();
    component.ready();
    const [observer] = ResizeObserverMock.instances;
    expect(observer.observe).toHaveBeenCalledWith(component['innerRef'].current);
    expect(vi.getTimerCount()).toBe(1);

    component.uninstall();

    expect(observer.disconnect).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
    vi.runAllTimers();
    expect(component['isAutoScrollEnabled']).toBe(false);
  });

  test('cancels trailing scroll checks before the scroll element is removed', () => {
    const { component, scroll } = createScroll();
    component.ready();
    vi.runAllTimers();
    component['handleScroll']();
    scroll.scrollTop = 10;
    component['handleScroll']();

    component.uninstall();
    component['scrollRef'].current = null;

    expect(() => vi.runAllTimers()).not.toThrow();
  });

  test('cancels trailing resize scrolls after uninstall', () => {
    const { component, scroll } = createScroll();
    component.ready();
    vi.runAllTimers();
    const [observer] = ResizeObserverMock.instances;
    observer.callback();
    scroll.scrollHeight = 500;
    observer.callback();
    expect(scroll.scrollTo).toHaveBeenCalledOnce();

    component.uninstall();
    vi.runAllTimers();

    expect(scroll.scrollTo).toHaveBeenCalledOnce();
  });

  test('can initialize scrolling again after reconnecting', () => {
    const { component, scroll } = createScroll();
    component.ready();
    component.uninstall();

    component.ready();
    vi.runAllTimers();
    const [previousObserver, currentObserver] = ResizeObserverMock.instances;
    currentObserver.callback();

    expect(previousObserver.disconnect).toHaveBeenCalledOnce();
    expect(currentObserver.observe).toHaveBeenCalledOnce();
    expect(scroll.scrollTo).toHaveBeenCalledWith({ top: 280, behavior: 'auto' });
    component.uninstall();
  });
});
