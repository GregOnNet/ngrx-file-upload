import {
  Ducksify,
  Action,
  DucksifiedAction,
  reducerFrom
} from '@co-it/ngrx-ducks';
import { State, UploadStatus } from './state';

@Ducksify<State>({
  initialState: { status: UploadStatus.Ready, error: null, progress: 0 }
})
export class FileUpload {
  @Action('[File Upload Form] Request')
  requestUpload(state: State, payload: { file: File }): State {
    return {
      ...state,
      status: UploadStatus.Requested,
      progress: null,
      error: null
    };
  }

  @Action('[File Upload API] Started')
  startUpload(state: State): State {
    return {
      ...state,
      status: UploadStatus.Started,
      progress: 0
    };
  }

  @Action('[File Upload API] Progress')
  progressUpload(state: State, payload: { progress: number }): State {
    return {
      ...state,
      progress: payload.progress
    };
  }

  @Action('[File Upload API] Completed')
  completeUpload(state: State): State {
    return {
      ...state,
      status: UploadStatus.Completed,
      progress: 100,
      error: null
    };
  }

  @Action('[File Upload Form] Cancel')
  cancel(state: State): State {
    return {
      ...state,
      status: UploadStatus.Ready,
      progress: null,
      error: null
    };
  }

  @Action('[File Upload Form] Reset')
  reset(state: State): State {
    return {
      ...state,
      status: UploadStatus.Ready,
      progress: null,
      error: null
    };
  }

  @Action('[File Upload API] Failure')
  failure(state: State, payload: { error: string }): State {
    return {
      ...state,
      status: UploadStatus.Failed,
      error: payload.error,
      progress: null
    };
  }
}

export function featureReducer(state: State, action: DucksifiedAction) {
  return reducerFrom(FileUpload)(state, action);
}
