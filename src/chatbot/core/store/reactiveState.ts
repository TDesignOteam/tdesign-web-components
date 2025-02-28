import { enablePatches, produceWithPatches } from 'immer';

/**
 * 状态订阅者回调函数类型
 * @template T 状态类型
 * @param state 只读的最新状态
 * @param changes 发生变更的路径数组（只读）
 */
export type Subscriber<T> = (state: Readonly<T>, changes: readonly string[]) => void;

// 启用immer的patch支持，用于追踪状态变更路径
enablePatches();

/**
 * 响应式状态管理类，提供高效的状态管理和变更追踪功能
 * @template T 状态对象类型，必须为object类型
 */
export default class ReactiveState<T extends object> {
  private currentState: T; // 当前状态（始终为冻结对象）

  private subscribers = new Set<Subscriber<T>>(); // 订阅者集合（使用Set保证唯一性）

  private pendingChanges: string[] = []; // 待处理的变更路径（自动去重）

  private notificationScheduled = false; // 通知调度锁（防止重复调度）

  /**
   * 初始化响应式状态
   * @param initialState 初始状态（会自动冻结）
   */
  constructor(initialState: T) {
    this.currentState = Object.freeze(initialState);
  }

  /**
   * 更新状态方法
   * @param updater 状态更新函数（使用immer的draft机制）
   * @param paths 可选的手动指定变更路径（自动模式会从immer patches中提取）
   */
  public setState(updater: (draft: T) => void, paths?: string[]): void {
    // 使用produceWithPatches来获取变更路径，生成新状态和变更记录
    const [nextState, patches] = produceWithPatches(this.currentState, updater);

    // 处理变更路径：优先使用手动指定路径，否则从patches中提取
    const changes =
      paths || patches.filter((p) => ['replace', 'add', 'remove'].includes(p.op)).map((p) => p.path.join('.'));

    if (changes.length > 0) {
      this.pendingChanges.push(...changes);
      this.currentState = Object.freeze(nextState) as T;
      this.scheduleNotification();
    }
  }

  /**
   * 获取当前状态
   * @param cloned 是否返回克隆副本（默认false）
   * @returns 当前状态的只读引用或克隆副本
   */
  public getState(cloned = false): Readonly<T> {
    return cloned ? structuredClone(this.currentState) : this.currentState;
  }

  /**
   * 订阅状态变更
   * @param subscriber 订阅回调函数
   * @returns 取消订阅的函数
   */
  public subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  /**
   * 调度通知（使用微任务批量处理）
   */
  private scheduleNotification() {
    if (this.notificationScheduled) return;
    this.notificationScheduled = true;

    // 使用微任务进行批处理，确保在同一个事件循环内的多次更新只会触发一次通知
    queueMicrotask(() => {
      // 去重变更路径并重置待处理队列
      const changedPaths = [...new Set(this.pendingChanges)];
      this.pendingChanges = [];
      this.notificationScheduled = false;

      // 冻结状态和路径数组，防止订阅者意外修改
      const frozenState = Object.freeze(this.currentState);
      const frozenPaths = Object.freeze(changedPaths);

      // 安全通知所有订阅者
      this.subscribers.forEach((sub) => {
        try {
          sub(frozenState, frozenPaths);
        } catch (error) {
          console.error('Subscriber error:', error);
        }
      });
    });
  }

  /**
   * 调试方法（开发时使用）
   * @param label 调试标签（默认'State'）
   * @returns 当前实例（支持链式调用）
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
}
