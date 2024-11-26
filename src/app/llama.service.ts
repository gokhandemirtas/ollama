import { Injectable } from '@angular/core';
import { GenerateResponse, Ollama } from 'ollama/browser';
import { ChromaClient, OllamaEmbeddingFunction } from 'chromadb';
import { uniqueId } from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlamaService {
  model = 'llama3.2';
  collection!: any;
  llamaUrl = 'http://127.0.0.1:11434';
  chromaUrl = 'http://localhost:8000';
  llama: Ollama = new Ollama({ host: this.llamaUrl });
  chromaClient: ChromaClient = new ChromaClient({ path: this.chromaUrl });

  constructor(public http: HttpClient) {

  }

  loadDocs() {
    this.http.get<{
      response: Array<{
        metadata: any,
        pageContent: string,
      }>
    }>('http://localhost:3000/loaddocs').pipe(take(1)).subscribe(({ response }) => {
      response.map((doc) => {
        this.updateCollection(doc.pageContent, 'userprompt')
      });
    });
  }

  async setup() {
    const embeddingFunction = new OllamaEmbeddingFunction({
      url: `${this.llamaUrl}/api/embeddings`,
      model: 'nomic-embed-text'
    });
    this.chromaClient.heartbeat();

    this.chromaClient.getOrCreateCollection({
      name: 'remember',
      embeddingFunction
    }).then((collection: any) => {
      this.collection = collection;
    })
  }

  updateCollection(content: string, metadata: string){
    return this.collection.upsert({
      documents: [content],
      ids: [uniqueId('llm')],
      metadata
    });
  }

  async query(query: string): Promise<GenerateResponse> {
    return new Promise((resolve, reject) => {
      this.collection.query({
        queryTexts: query,
        nResults: 30,
      }).then((results: any) => {
        console.log(results);
        this.llama.generate(
          {
            model: this.model,
            prompt: `Only using this data: ${results.documents.join()}. Respond to this prompt: ${query}`
          }
        ).then((response) => {
          this.updateCollection(response.response, 'userprompt').then(() => {}, (err: any) => {
            console.log(err)
          });
          resolve(response);
        }).catch((err) => {
          reject(err)
        })
      });
    });
  }

  async resettah() {
    await this.chromaClient.reset();
  }
}