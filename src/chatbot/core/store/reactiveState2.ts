type Subscriber<T> = (state: Readonly<T>, changes: readonly string[]) => void;

const createProxy = <T extends object>(
  target: T,
  path: string[] = [],
  subscriptions: Set<string> = new Set(),
  handler: ReactiveState<any> = null,
): T =>
  new Proxy(target, {
    get(obj, prop) {
      const fullPath = [...path, prop.toString()];
      // 记录访问路径
      subscriptions.add(fullPath.join('.'));
      const value = obj[prop as keyof T];
      return value && typeof value === 'object' && !(value instanceof Date)
        ? createProxy(value, fullPath, subscriptions, handler)
        : value;
    },
    set(obj, prop, value) {
      const fullPath = [...path, prop.toString()].join('.');
      const prev = JSON.stringify(obj[prop as keyof T]);
      const next = JSON.stringify(value);

      if (prev !== next) {
        obj[prop as keyof T] = value;
        handler.recordChange(fullPath);
      }
      return true;
    },
  });

/**
 * 基于Proxy的响应式状态管理类
 * @template T 状态对象类型，必须为object类型
 */
export default class ReactiveState<T extends object> {
  private state: T;

  private proxy: T;

  private subscriptions = new Map<Subscriber<T>, Set<string>>();

  private changedPaths = new Set<string>();

  private notificationScheduled = false;

  constructor(initialState: T) {
    this.state = initialState;
    this.proxy = createProxy(this.state, [], new Set(), this);
  }

  /**
   * 记录变更路径并调度通知
   * @param path 变更路径
   */
  public recordChange(path: string) {
    this.changedPaths.add(path);
    this.scheduleNotification();
  }

  /**
   * 获取代理对象或克隆副本
   * @param cloned 是否返回克隆副本（默认false）
   * @returns 代理对象或克隆副本
   */
  public getState(cloned = false): Readonly<T> {
    return cloned ? this.safeClone(this.state) : this.proxy;
  }

  /**
   * 订阅状态变更
   * @param subscriber 订阅回调
   * @param paths 要监听的属性路径数组
   * @returns 取消订阅函数
   */
  public subscribe(subscriber: Subscriber<T>, paths?: string[]): () => void {
    const listenerPaths = new Set(paths || []);
    this.subscriptions.set(subscriber, listenerPaths);

    return () => {
      this.subscriptions.delete(subscriber);
    };
  }

  /**
   * 调度通知（使用微任务批量处理）
   */
  private scheduleNotification() {
    if (this.notificationScheduled) return;
    this.notificationScheduled = true;

    queueMicrotask(() => {
      const changed = [...this.changedPaths];
      this.changedPaths.clear();
      this.notificationScheduled = false;

      const frozenState = Object.freeze(this.safeClone(this.state));
      const frozenPaths = Object.freeze(changed);

      this.subscriptions.forEach((listenerPaths, handler) => {
        try {
          if (
            listenerPaths.size === 0 ||
            changed.some((path) =>
              [...listenerPaths].some(
                (target) =>
                  path.startsWith(target) || target.split('.').every((part, i) => path.split('.')[i] === part),
              ),
            )
          ) {
            handler(frozenState, frozenPaths);
          }
        } catch (error) {
          console.error('Subscriber error:', error);
        }
      });
    });
  }

  /**
   * 调试方法
   * @param label 调试标签
   * @returns 当前实例
   */
  public debug(label = 'State'): this {
    this.subscribe((state, paths) => {
      console.groupCollapsed(`%c${label} Update`, 'color: #4CAF50; font-weight: bold;');
      console.log('Changed Paths:', paths);
      console.log('New State:', state);
      console.groupEnd();
    });
    return this;
  }

  /**
   * 直接修改状态（兼容原有API）
   * @param updater 状态修改函数
   */
  public setState(updater: (draft: T) => void) {
    updater(this.proxy);
  }

  // 添加安全克隆方法
  private safeClone(obj: T): T {
    try {
      return structuredClone(obj);
    } catch (e) {
      console.warn('Structured clone failed, using JSON clone:', e);
      return JSON.parse(JSON.stringify(obj));
    }
  }
}
