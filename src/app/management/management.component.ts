import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';
import { LlamaService } from '../llama.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MetadataComponent } from './metadata.component';
import { UploadRequestPayload } from '../models/upload-request-payload';
import { take } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
      MatButtonModule,
      MatCardModule,
      ReactiveFormsModule,
      CommonModule,
      MatProgressBarModule,
      MatListModule,
      MatIconModule,
      MatSnackBarModule,
      MatFormFieldModule,
      MatInputModule,
      MetadataComponent
    ],
    templateUrl: './management.component.html',
    styleUrl: './management.component.scss'
  })
export class ManagementComponent implements OnInit {
  constructor(public service: LlamaService, public snackbar: MatSnackBar) {}

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  collections = signal<Array<any>>([]);
  isWaiting = signal(false);

  fileForm = new FormGroup({
    category: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  });

  selectedFile: File | null = null;

  fetchCollections() {
    this.isWaiting.set(true);
    this.service.getCollections().pipe(take(1)).subscribe((collections) => {
      this.collections.set(collections);
      this.isWaiting.set(false);
    }, () => {
      this.isWaiting.set(false);
    });
  }

  getCollection(name: string) {
    this.isWaiting.set(true);
    this.service.getCollection(name).pipe(take(1)).subscribe((response) => {
      this.snackbar.open(`Got: ${name} successfully`, 'Dismiss', { duration: 1000 });
      console.table(response);
      this.isWaiting.set(false);
    },() => {
      this.isWaiting.set(false);
    });
  }

  deleteCollection(name: string) {
    this.isWaiting.set(true);
    this.service.deleteCollection(name).pipe(take(1)).subscribe(() => {
      this.snackbar.open(`Deleted: ${name} successfully`, 'Dismiss', { duration: 1000 });
      this.fetchCollections();
    },() => {
      this.isWaiting.set(false);
    });
  }

  reset() {
    this.isWaiting.set(true);
    this.service.reset().pipe(take(1)).subscribe(() => {
      this.isWaiting.set(false);
      this.snackbar.open(`Resetted collection successfully`, 'Dismiss', { duration: 1000 });
    },() => {
      this.isWaiting.set(false);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    this.isWaiting.set(true);
    const { category, metadata } = this.fileForm.value as any;

    this.service.upload({
      category,
      metadata,
    }, this.selectedFile!).pipe(take(1)).subscribe(() => {
      this.isWaiting.set(false);
      this.snackbar.open(`Uploaded file successfully`, 'Dismiss', { duration: 1000 });
      this.fileForm.reset();
      this.selectedFile = null;
    },() => {
      this.isWaiting.set(false);
      this.fileForm.reset();
      this.selectedFile = null;
    });
  }

  ngOnInit(): void {
    this.fetchCollections();
  }
}
