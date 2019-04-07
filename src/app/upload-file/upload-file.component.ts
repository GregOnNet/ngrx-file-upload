import { Component, OnInit, Inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromFileUploadActions from 'src/app/upload-file-store/actions';
import * as fromFileUploadSelectors from 'src/app/upload-file-store/selectors';
import * as fromFileUploadState from 'src/app/upload-file-store/state';
import { FileUpload } from '../upload-file-store/duck';
import { Duck } from '@co-it/ngrx-ducks';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  completed$: Observable<boolean>;
  progress$: Observable<number>;
  error$: Observable<string>;
  isInProgress$: Observable<boolean>;
  isReady$: Observable<boolean>;
  hasFailed$: Observable<boolean>;

  constructor(
    private store$: Store<fromFileUploadState.State>,
    @Inject(FileUpload) private fileUpload: Duck<FileUpload>
  ) {}

  ngOnInit() {
    this.completed$ = this.fileUpload.completed$;
    this.progress$ = this.fileUpload.progress$;
    this.error$ = this.fileUpload.error$;
    this.isInProgress$ = this.fileUpload.isInProgress$;
    this.isReady$ = this.fileUpload.isReady$;
    this.hasFailed$ = this.fileUpload.hasFailed$;
  }

  uploadFile(event: any) {
    const files: FileList = event.target.files;
    const file = files.item(0);

    this.store$.dispatch(
      new fromFileUploadActions.UploadRequestAction({
        file
      })
    );

    // clear the input form
    event.srcElement.value = null;
  }

  resetUpload() {
    this.store$.dispatch(new fromFileUploadActions.UploadResetAction());
  }

  cancelUpload() {
    this.store$.dispatch(new fromFileUploadActions.UploadCancelAction());
  }
}
