import { enablePatches, produceWithPatches } from 'immer';

export type Subscriber<T> = (state: T, changes: string[]) => void;

// 启用immer的patch支持
enablePatches();

export default class ReactiveState<T extends object> {
  private currentState: T;

  private subscribers = new Set<Subscriber<T>>();

  private pendingChanges: string[] = [];

  constructor(initialState: T) {
    this.currentState = initialState;
  }

  public setState(updater: (draft: T) => void, paths?: string[]): void {
    // 使用produceWithPatches来获取变更路径
    const [nextState, patches] = produceWithPatches(this.currentState, updater);

    // 从patches中提取变更路径或使用手动指定的路径
    const changes =
      paths ||
      patches.filter((p) => p.op === 'replace' || p.op === 'add' || p.op === 'remove').map((p) => p.path.join('.'));

    if (changes.length > 0) {
      this.pendingChanges.push(...changes);
      this.currentState = nextState;
      this.notifySubscribers();
    }
  }

  public getState(): T {
    return this.currentState;
  }

  public subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  private notifySubscribers() {
    if (this.pendingChanges.length === 0) return;

    const changedPaths = [...new Set(this.pendingChanges)]; // 去重
    this.pendingChanges = [];

    requestAnimationFrame(() => {
      this.subscribers.forEach((sub) => {
        sub(this.currentState, changedPaths);
      });
    });
  }
}
