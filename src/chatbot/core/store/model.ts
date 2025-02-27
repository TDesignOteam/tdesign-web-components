import type { ModelServiceState } from '../type';
import { BaseStore } from './base';

// 专注模型状态和运行时管理
export class ModelStore extends BaseStore<ModelServiceState> {
  constructor(initialState?: Partial<ModelServiceState>) {
    super({
      currentModel: '',
      isLoading: false,
      error: null,
      availableModels: [],
      ...initialState,
    });
  }

  setCurrentModel(modelName: string) {
    this.setState(
      (draft) => {
        if (draft.availableModels.includes(modelName)) {
          draft.currentModel = modelName;
        }
      },
      ['currentModel'],
    );
  }

  setIsLoading(loading: boolean) {
    this.setState(
      (draft) => {
        draft.isLoading = loading;
      },
      ['isLoading'],
    );
  }

  setError(error: string | Error | null) {
    this.setState(
      (draft) => {
        draft.error = error;
      },
      ['error'],
    );
  }

  updateAvailableModels(models: string[]) {
    this.setState(
      (draft) => {
        draft.availableModels = models;
      },
      ['availableModels'],
    );
  }
}
