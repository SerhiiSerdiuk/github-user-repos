import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { RepoListComponent } from './components/repo-list/repo-list.component';
import { RepoDetailsComponent } from './components/repo-details/repo-details.component';
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
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      loader: HttpClient
    }),
    AppRoutingModule,
    SharedModule
  ],
  providers: [DataService, ModelService],
  bootstrap: [AppComponent]
})
export class AppModule {}
