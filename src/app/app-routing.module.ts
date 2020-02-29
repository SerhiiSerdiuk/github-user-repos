import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { RepoListComponent } from './components/repo-list/repo-list.component';
import { RepoDetailsComponent } from './components/repo-details/repo-details.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'repositories/:user', component: RepoListComponent },
  { path: 'repository/:user/:repo', component: RepoDetailsComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', redirectTo: '/search', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
