import { Component, Inject, OnInit } from '@angular/core';
import { Duck } from '@co-it/ngrx-ducks';
import { Observable } from 'rxjs';
import { FileUpload } from '../upload-file-store/duck';

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

  constructor(@Inject(FileUpload) private fileUpload: Duck<FileUpload>) {}

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

    this.fileUpload.requestUpload({ file });

    // clear the input form
    event.srcElement.value = null;
  }

  resetUpload() {
    this.fileUpload.reset();
  }

  cancelUpload() {
    this.fileUpload.cancel();
  }
}
