import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ollama } from 'ollama/browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatProgressBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ollama';

  promptForm = new FormGroup({
    query: new FormControl('', [Validators.required])
  })

  llama!: Ollama;

  responses: Array<{
    message: string;
    timestamp: string;
    duration: number;
  }> = [];

  isWaiting = signal(false);

  constructor() {}

  ngOnInit(): void {
    this.llama = new Ollama({ host: 'http://127.0.0.1:11434' });
  }

  ngOnDestroy(): void {
    this.llama.abort();
  }

  async query() {
    const queryInput = this.promptForm.get('query');
    this.isWaiting.set(true);
    queryInput?.disable();
    const response = await this.llama.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: `${queryInput!.value}` }],
      stream: true
    },);
    for await (const part of response) {
      console.log(part);
      if (part.done === true) {

        this.responses.push({
          timestamp: new Date(part.created_at).toISOString(),
          duration: part.total_duration / 1000 / 1000 / 1000,
          message: part.message.content
        });
        queryInput?.setValue(null);
        queryInput?.enable();
        this.isWaiting.set(false);
      }
    }
  }
}
