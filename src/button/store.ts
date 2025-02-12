import { makeAutoObservable } from 'mobx';

export class Store {
  message = 'Initial message';

  constructor() {
    makeAutoObservable(this);
  }

  update = (props: Partial<Store>): void => {
    Object.assign(this, props);
  };
}

export const myStore = new Store();
