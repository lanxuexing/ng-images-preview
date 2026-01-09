
import { Routes } from '@angular/router';
import { BasicExampleComponent } from './basic-example.component';
import { CustomExampleComponent } from './custom-example.component';

export const routes: Routes = [
    { path: '', redirectTo: 'basic', pathMatch: 'full' },
    { path: 'basic', component: BasicExampleComponent },
    { path: 'custom', component: CustomExampleComponent },
    { path: '**', redirectTo: 'basic' }
];
