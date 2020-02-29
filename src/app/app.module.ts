import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { RepoListComponent } from './components/search/repo-list/repo-list.component';
import { RepoDetailsComponent } from './components/search/repo-details/repo-details.component';
import { SharedModule } from './modules/shared/shared.module';
import { DataService } from './services/data.service';
import { ModelService } from './services/model.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    RepoListComponent,
    RepoDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    DataService,
    ModelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
