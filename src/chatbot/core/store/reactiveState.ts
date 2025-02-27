import { enablePatches,produceWithPatches } from 'immer';

export type Subscriber<T> = (state: T, changes: string[]) => void;

// 启用immer的patch支持
enablePatches();

// 1. 自动化的细粒度变更检测
// 2. 支持路径级别的订阅优化
// 3. 更直观的状态操作方式
// 4. 更好的框架集成能力
// 5. 内置的批量更新优化（通过requestAnimationFrame）

// export class ReactiveState2<T extends object> {
//   private proxy: T;
//   private subscribers = new Set<Subscriber<T>>();
//   private changePaths = new Set<string>();

//   constructor(initialState: T) {
//     this.proxy = this.createProxy(initialState);
//   }

//   private createProxy(target: any, path?: string): any {
//     const handler: ProxyHandler<object> = {
//       get: (obj, prop) => {
//         const value = Reflect.get(obj, prop);
//         const fullPath = path ? `${path}.${String(prop)}` : String(prop);
//         if (typeof value === 'object' && value !== null) {
//           return this.createProxy(value, fullPath);
//         }
//         return value;
//       },
//       set: (obj, prop, value) => {
//         const fullPath = path ? `${path}.${String(prop)}` : String(prop);
//         const result = Reflect.set(obj, prop, value);
//         this.changePaths.add(fullPath);
//         this.notifySubscribers();
//         return result;
//       },
//     };
//     return new Proxy(target, handler);
//   }

//   // 合并短时间内的多次更新
//   private notifySubscribers() {
//     if (this.changePaths.size === 0) return;
//     const changedPaths = Array.from(this.changePaths);
//     this.changePaths.clear();

//     // 使用requestAnimationFrame批量处理
//     requestAnimationFrame(() => {
//       this.subscribers.forEach((sub) => {
//         sub(this.proxy, changedPaths);
//       });
//     });
//   }

//   public getState(): T {
//     return this.proxy;
//   }

//   public subscribe(subscriber: Subscriber<T>): () => void {
//     this.subscribers.add(subscriber);
//     return () => this.subscribers.delete(subscriber);
//   }
// }

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
