import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { RepoListComponent } from './components/search/repo-list/repo-list.component';
import { RepoDetailsComponent } from './components/search/repo-details/repo-details.component';


const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'repositories/:username', component: RepoListComponent },
  { path: 'repository/:id', component: RepoDetailsComponent },
  { path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  { path: '**', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
