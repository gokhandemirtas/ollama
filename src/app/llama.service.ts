import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ChromaClient, CollectionParams, OllamaEmbeddingFunction } from 'chromadb';
import { uniqueId } from 'lodash-es';
import { GenerateResponse, Ollama } from 'ollama/browser';
import { take } from 'rxjs';
import { Environment } from '../environment/environment.model';
import { ENVIRONMENT } from '../environment/environment.token';

@Injectable({
  providedIn: 'root',
})
export class LlamaService {
  constructor(public http: HttpClient, @Inject(ENVIRONMENT) public environment: Environment) {
    this.chromaClient = new ChromaClient({ path: this.environment.chromaUrl });
    this.llamaClient = new Ollama({ host: this.environment.ollamaUrl });
  }

  collection!: any;
  llamaClient!: Ollama;
  chromaClient!: ChromaClient;

  loadDocs() {
    this.http.get<{
      response: Array<{
        metadata: any,
        pageContent: string,
      }>
    }>(`${this.environment.apiUrl}/loaddocs`).pipe(take(1)).subscribe(({ response }) => {
      response.map((doc) => {
        this.updateCollection(doc.pageContent, 'userprompt')
      });
    });
  }

  async setup() {
    const embeddingFunction = new OllamaEmbeddingFunction({
      url: `${this.environment.ollamaUrl}/api/embeddings`,
      model: this.environment.embedderModel
    });
    this.chromaClient.heartbeat();

    this.chromaClient.getOrCreateCollection({
      name: this.environment.defaultCollection,
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
        this.llamaClient.generate(
          {
            model: this.environment.llmModel,
            prompt: `Only using this data: ${results.documents.join()}. Respond to this prompt: ${query}`
          }
        ).then((response) => {
          this.updateCollection(response.response, this.environment.defaultCollection).then(() => {}, (err: any) => {
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