import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatResponse, Ollama } from 'ollama/browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChromaClient, OllamaEmbeddingFunction } from 'chromadb';
import { uniqueId } from 'lodash-es';

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
  title = 'ollama';

  promptForm = new FormGroup({
    query: new FormControl('', [Validators.required])
  })

  model = 'llama3.2';

  llama!: Ollama;

  collection!: any;

  llamaUrl = 'http://127.0.0.1:11434';

  isWaiting = signal(false);

  messages = signal<Array<Message>>([]);

  constructor() {}

  ngOnInit(): void {
    this.llama = new Ollama({ host: this.llamaUrl });
    this.createCollection();
  }

  async createCollection() {
    const chroma = new ChromaClient();
    const embeddingFunction = new OllamaEmbeddingFunction({
      url: `${this.llamaUrl}/api/embeddings`,
      model: 'nomic-embed-text'
    });
    const collection = await chroma.getOrCreateCollection({
      name: 'remember',
      embeddingFunction
    });
    this.collection = collection;
  }


  ngOnDestroy(): void {
    this.llama.abort();
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
    const response = await this.query(query);
    this.updateReplies({
      timestamp: new Date(response.created_at).toISOString(),
      duration: response.total_duration / 1000 / 1000 / 1000,
      text: response.message.content
    });
    queryInput?.setValue(null);
    queryInput?.enable();
    this.isWaiting.set(false);
    this.updateCollection(response.message.content).then(() => {}, (err) => {
      console.log(err)
    });

    this.collection.query({
      queryTexts: query,
      nResults: 5,
    }).then((response: any) => {
      console.log(response)
    });
  }

  async updateCollection(content: string){
    return await this.collection.upsert({
      documents: [content],
      ids: [uniqueId()],
    });
  }

  async query(query: string): Promise<ChatResponse> {
    return this.llama.chat({
      model: this.model,
      messages: [{ role: 'user', content: `${query}` }]
    });
  }
}
