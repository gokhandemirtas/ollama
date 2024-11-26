import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LlamaService } from '../llama.service';

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
      MatIconModule
    ],
    templateUrl: './management.component.html',
    styleUrl: './management.component.scss'
  })
export class ManagementComponent implements OnInit {
  constructor(public service: LlamaService) {}

  collections = signal<Array<any>>([]);
  isWaiting = signal(false);

  fetchCollections() {
    this.isWaiting.set(true);
    this.service.chromaClient.listCollections().then((collections) => {
      this.collections.set(collections);
      this.isWaiting.set(false);
    }).catch(() => {
      this.isWaiting.set(false);
    });
  }

  deleteCollection(name: string) {
    this.isWaiting.set(true);
    this.service.chromaClient.deleteCollection({ name }).then(() => {
      this.fetchCollections();
    },() => {
      this.isWaiting.set(false);
    });
  }

  ngOnInit(): void {
    this.fetchCollections();
  }
}