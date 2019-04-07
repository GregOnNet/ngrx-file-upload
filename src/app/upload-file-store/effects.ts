import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Duck, whereType } from '@co-it/ngrx-ducks';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, takeUntil } from 'rxjs/operators';
import serializeError from 'serialize-error';
import { FileUploadService } from 'src/app/_services';
import { FileUpload } from './duck';

@Injectable()
export class UploadFileEffects {
  @Effect()
  uploadRequestEffect$ = this.actions$.pipe(
    whereType(this.fileUpload.requestUpload),
    concatMap(action =>
      this.fileUploadService.uploadFile(action.payload.file).pipe(
        takeUntil(this.actions$.pipe(whereType(this.fileUpload.cancel))),
        map(event => this.getActionFromHttpEvent(event)),
        catchError(error => of(this.handleError(error)))
      )
    )
  );

  constructor(
    private fileUploadService: FileUploadService,
    private actions$: Actions,
    @Inject(FileUpload) private fileUpload: Duck<FileUpload>
  ) {}

  private getActionFromHttpEvent(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent: {
        return this.fileUpload.startUpload.action();
      }
      case HttpEventType.UploadProgress: {
        return this.fileUpload.progressUpload.action({
          progress: Math.round((100 * event.loaded) / event.total)
        });
      }
      case HttpEventType.ResponseHeader:
      case HttpEventType.Response: {
        if (event.status === 200) {
          return this.fileUpload.completeUpload.action();
        } else {
          return this.fileUpload.failure.action({
            error: event.statusText
          });
        }
      }
      default: {
        return this.fileUpload.failure.action({
          error: `Unknown Event: ${JSON.stringify(event)}`
        });
      }
    }
  }

  private handleError(error: any) {
    const friendlyErrorMessage = serializeError(error).message;
    return this.fileUpload.failure.action({
      error: friendlyErrorMessage
    });
  }
}
