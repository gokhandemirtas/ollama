import { Routes } from '@angular/router';
import { PrompterComponent } from './prompter/prompter.component';
import { ManagementComponent } from './management/management.component';

export const routes: Routes = [
  {
    path: 'prompt',
    loadComponent: () => PrompterComponent,
    pathMatch: 'full'
  },
  {
    path: 'manage',
    loadComponent: () => ManagementComponent,
    pathMatch: 'full'
  }
];
