import type { MessageStatus,ModelServiceState } from '../type';
import ReactiveState from './reactiveState';

// 专注模型状态和运行时管理
export class ModelStore extends ReactiveState<ModelServiceState> {
  constructor(initialState?: ModelServiceState) {
    super({
      useSearch: false,
      useThink: false,
      model: '',
      ...initialState,
      status: 'idle',
    });
  }

  setModelStatus(status: MessageStatus) {
    this.setState((draft) => {
      draft.status = status;
    });
  }

  setCurrentModel(modelName: string) {
    this.setState((draft) => {
      draft.model = modelName;
    });
  }

  setUseThink(use: boolean) {
    this.setState((draft) => {
      draft.useThink = use;
    });
  }

  setUseSearch(use: boolean) {
    this.setState((draft) => {
      draft.useSearch = use;
    });
  }
}
