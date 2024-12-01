import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LlamaService } from '../llama.service';
import { Message } from '../constants/message';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { take } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
      MatButtonModule,
      MatCardModule,
      ReactiveFormsModule,
      MatInputModule,
      MatFormFieldModule,
      CommonModule,
      MatProgressBarModule,
    ],
    templateUrl: `./prompter.component.html`,
    styleUrl: './prompter.component.scss'
  })
export class PrompterComponent {
  constructor(public service: LlamaService) {}

  promptForm = new FormGroup({
    query: new FormControl('', [Validators.required])
  });

  isWaiting = signal(false);
  messages = signal<Array<Message>>([]);

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

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
    this.service.query(query).pipe(take(1)).subscribe((response: any) => {
      console.log(response);
      this.isWaiting.set(false);
      queryInput?.setValue(null);
      queryInput?.enable();
      this.updateReplies({
        timestamp: new Date(response.created_at).toISOString(),
        duration: response.eval_count / response.eval_duration * 10^9,
        text: response.response
      });
    }, () => {
      this.isWaiting.set(false);
    });
  }
}