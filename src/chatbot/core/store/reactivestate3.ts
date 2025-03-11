import { deepEqual } from 'fast-equals';
import { atom, type MapStore } from 'nanostores';

type Path = string | string[];
type Subscriber<T> = (state: Readonly<T>) => void;

export default class ReactiveState<T extends object> {
  private store: MapStore<T>;

  private pathSubscribers = new Map<Path, Set<Subscriber<T>>>();

  constructor(initialState: T) {
    this.store = atom(initialState);
  }

  setState(updater: (draft: T) => void): void {
    // @ts-ignore
    this.store.set((current) => {
      const draft = structuredClone(current);
      updater(draft);
      return current; // deepEqual(current, draft) ? current : draft;
    });
  }

  subscribe(callback: Subscriber<T>, paths?: Path): () => void {
    if (!paths) {
      return this.store.subscribe(callback);
    }

    const pathSet = Array.isArray(paths) ? paths : [paths];
    const listener = (newState: T) => {
      if (this.shouldNotify(pathSet, newState)) {
        callback(newState);
      }
    };

    const unsubscribe = this.store.subscribe(listener);
    pathSet.forEach((p) => {
      const subs = this.pathSubscribers.get(p) || new Set();
      subs.add(callback);
      this.pathSubscribers.set(p, subs);
    });

    return () => {
      unsubscribe();
      pathSet.forEach((p) => {
        const subs = this.pathSubscribers.get(p);
        subs?.delete(callback);
        if (subs?.size === 0) {
          this.pathSubscribers.delete(p);
        }
      });
    };
  }

  getState(): Readonly<T> {
    return this.store.get();
  }

  private shouldNotify(paths: string[], newState: T): boolean {
    const oldState = this.store.get();
    return paths.some((path) => !deepEqual(this.getByPath(oldState, path), this.getByPath(newState, path)));
  }

  private getByPath(obj: any, path: string): unknown {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
}
