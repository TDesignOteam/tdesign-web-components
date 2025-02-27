// // 基础Store抽象类
import ReactiveState, { Subscriber } from './reactiveState';

export abstract class BaseStore<T extends object> {
  protected state: ReactiveState<T>;

  constructor(initialState: T) {
    this.state = new ReactiveState(initialState);
  }

  getState(): Readonly<T> {
    return this.state.getState();
  }

  subscribe(handler: Subscriber<T>, paths?: string[]) {
    return this.state.subscribe((state, changedPaths) => {
      if (!paths || changedPaths.some((p) => paths.some((target) => p.startsWith(target)))) {
        handler(state, changedPaths);
      }
    });
  }

  protected setState(updater: (draft: T) => void, paths?: string[]) {
    this.state.setState(updater, paths);
  }
}
