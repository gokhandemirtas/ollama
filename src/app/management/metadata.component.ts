import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metadata',
  standalone: true,
  imports: [MatChipsModule, MatFormFieldModule, CommonModule, MatIconModule],
  template: `
    <mat-form-field>
      <mat-label>Metadata</mat-label>
      <mat-chip-grid #chipGrid>
        @for (metadata of metadatas; track metadata) {
          <mat-chip-row
            (removed)="remove(metadata)"
            [editable]="false">
            {{ metadata.name }}
            <button matChipRemove>
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        }
        <input placeholder="Enter metadata"
          formControl="metadataControl"
          [matChipInputFor]="chipGrid"
          [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
          [matChipInputAddOnBlur]="true"
          (matChipInputTokenEnd)="add($event)"
          required />
      </mat-chip-grid>
    </mat-form-field>
  `,
})
export class MetadataComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  metadatas: Array<{ name: string }> = [];

  @Input('parentForm') parentForm!: FormGroup;

  metadataControl = new FormControl('null', Validators.required);

  ngOnInit(): void {
    this.parentForm.addControl('metadata', this.metadataControl);
  }

  getMetadatas() {
    return this.metadatas.map(item => item.name).join(', ');
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.metadatas.push({ name: value});
    }

    event.chipInput!.clear();
    event.chipInput.focus();
    this.metadataControl.setValue(this.getMetadatas());
  }

  remove(metadata: { name: string }): void {
    const index = this.metadatas.findIndex(item => item.name === metadata.name);

    if (index >= 0) {
      this.metadatas.splice(index, 1);
    }

    this.metadataControl.setValue(this.getMetadatas());
  }
}
