import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatResponse, GenerateResponse, Ollama } from 'ollama/browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChromaClient, OllamaEmbeddingFunction } from 'chromadb';
import { uniqueId } from 'lodash-es';
import { PromptTemplate } from "@langchain/core/prompts";
import { LlamaService } from './llama.service';

interface Message {
  text: string;
  timestamp: string;
  duration: number;
}

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
  constructor(public service: LlamaService) {}

  promptForm = new FormGroup({
    query: new FormControl('', [Validators.required])
  });

  isWaiting = signal(false);
  messages = signal<Array<Message>>([]);

  ngOnInit(): void {
    this.service.setup();
  }

  ngOnDestroy(): void {
    this.service.llama.abort();
  }

  updateReplies(part: Message) {
    this.messages.update(values => {
      return [...values, part];
    });
  }

  async submit() {
    const queryInput = this.promptForm.get('query') as FormControl;
    const query = `${queryInput.value}`;
    this.isWaiting.set(true);
    queryInput.disable();
    const response = await this.service.query(query);
    queryInput?.setValue(null);
    queryInput?.enable();
    this.isWaiting.set(false);
    this.updateReplies({
      timestamp: new Date(response.created_at).toISOString(),
      duration: response.total_duration / 1000 / 1000 / 1000,
      text: response.response
    });
  }

}
