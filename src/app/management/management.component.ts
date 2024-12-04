import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LlamaService } from '../llama.service';
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
      MatSnackBarModule
    ],
    templateUrl: './management.component.html',
    styleUrl: './management.component.scss'
  })
export class ManagementComponent implements OnInit {
  constructor(public service: LlamaService, public snackbar: MatSnackBar) {}

  collections = signal<Array<any>>([]);
  isWaiting = signal(false);

  fetchCollections() {
    this.isWaiting.set(true);
    this.service.getCollections().pipe(take(1)).subscribe((collections) => {
      this.collections.set(collections);
      this.isWaiting.set(false);
    });
  }

  getCollection(name: string = 'bla') {
    this.isWaiting.set(true);
    this.service.getCollection(name).pipe(take(1)).subscribe((response) => {
      this.snackbar.open(`Got: ${name} successfully`, 'Dismiss', { duration: 1000 });
      console.log(response);
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

  loadDocs() {
    this.isWaiting.set(true);
    this.service.loadDocs().pipe(take(1)).subscribe(() => {
      this.isWaiting.set(false);
      this.snackbar.open(`Loaded docs from bucket successfully`, 'Dismiss', { duration: 1000 });
    },() => {
      this.isWaiting.set(false);
    });
  }

  ngOnInit(): void {
    this.fetchCollections();
  }
}