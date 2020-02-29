import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, of } from 'rxjs';
import { UserList, Repository, User } from '../model/entities';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private _userRepositoriesMap: Map<string, Repository[]> = new Map();
  private _repositoriesMap: Map<string, Repository> = new Map();
  private _foundUserListMap: Map<string, UserList> = new Map();
  private _lastSearchPattern: string;

  constructor(private dataService: DataService) {}

  public get lastSearchPattern(): string {
    return this._lastSearchPattern;
  }

  public getUser(userLogin: string | null): Observable<User | null> {
    if (!userLogin) {
      return of(null);
    }

    const users = Array.from(this._foundUserListMap)
      .map(([key, userLists]) => userLists.items)
      .reduce((acc, val) => acc.concat(val), []);

    const user = users && users.length ? users.find((u) => u.login === userLogin) : null;

    return user ? of(user) : this.dataService.getUser(userLogin);
  }

  public searchUsers(pattern: string): Observable<UserList> {
    const existingUserList = this._foundUserListMap.get(pattern);
    if (existingUserList) {
      return of(existingUserList);
    }

    return this.dataService.searchUsers(pattern).pipe(
      tap(userList => {
        if (userList) {
          this._foundUserListMap.set(pattern, userList);
          this._lastSearchPattern = pattern;
        }
      })
    );
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
