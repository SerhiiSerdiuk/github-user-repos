import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, of } from 'rxjs';
import { UserList, Repository } from '../model/entities';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private _userRepositoriesMap: Map<string, Repository[]> = new Map();
  private _repositoriesMap: Map<string, Repository> = new Map();

  constructor(private dataService: DataService) {}

  public searchUsers(pattern: string): Observable<UserList> {
    return this.dataService.searchUsers(pattern);
  }

  public getRepositories(
    userLogin: string | null
  ): Observable<Repository[] | null> {
    if (!userLogin) {
      return of(null);
    }

    if (this._userRepositoriesMap.has(userLogin)) {
      return of(this._userRepositoriesMap.get(userLogin) || null);
    }

    return this.dataService.getRepositories(userLogin).pipe(
      tap(repositories => {
        if (repositories) {
          repositories.forEach(repo => {
            this._repositoriesMap.set(repo.owner.login + repo.name, repo);
          });
          this._userRepositoriesMap.set(userLogin, repositories);
        }
      })
    );
  }

  public getRepository(
    loginName: string | null,
    repoName: string | null
  ): Repository | null {
    if (!loginName || !repoName) {
      return null;
    }
    const repo = this._repositoriesMap.get(loginName + repoName);
    return repo ? repo : null;
  }
}
