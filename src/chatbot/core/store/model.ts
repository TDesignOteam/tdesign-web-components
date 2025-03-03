import type { ModelServiceState } from '../type';
import ReactiveState from './reactiveState';

// 专注模型状态和运行时管理
export class ModelStore extends ReactiveState<ModelServiceState> {
  constructor(initialState?: Partial<ModelServiceState>) {
    super({
      currentModel: 'hunyuan',
      isLoading: false,
      error: null,
      config: {
        stream: true,
      },
      ...initialState,
    });
  }

  setCurrentModel(modelName: string) {
    this.setState((draft) => {
      draft.currentModel = modelName;
    });
  }

  setIsLoading(loading: boolean) {
    this.setState((draft) => {
      draft.isLoading = loading;
    });
  }

  setError(error: string | Error | null) {
    this.setState((draft) => {
      draft.error = error;
    });
  }
}
