import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, of } from 'rxjs';
import { UserList, Repository, User, RepoReadMe } from '../model/entities';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  public readonly userRepositoriesMap: Map<
    string,
    Map<string, Repository>
  > = new Map();
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

    const user =
      users && users.length ? users.find(u => u.login === userLogin) : null;

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

    if (this.userRepositoriesMap.has(userLogin)) {
      const repoMap = this.userRepositoriesMap.get(userLogin);
      return of(repoMap ? Array.from(repoMap.values()) : null);
    }

    return this.dataService.getRepositories(userLogin).pipe(
      tap(repositories => {
        if (repositories) {
          repositories.forEach(repo => {
            this._repositoriesMap.set(repo.owner.login + '/' + repo.name, repo);
          });
          this.userRepositoriesMap.set(userLogin, this._repositoriesMap);
        }
      })
    );
  }

  public getRepository(
    loginName: string | null,
    repoName: string | null
  ): Observable<Repository | null> {
    if (!loginName || !repoName) {
      return of(null);
    }
    const repo = this._repositoriesMap.get(loginName + '/' + repoName);
    return repo
      ? of(repo)
      : this.dataService.getRepository(loginName, repoName);
  }

  public getReadMe(
    loginName: string | null,
    repoName: string | null
  ): Observable<RepoReadMe | null> {
    if (!loginName || !repoName) {
      return of(null);
    }

    return this.dataService.getRepoReadMe(loginName, repoName);
  }

  public updateRepositoryDescription(
    userLogin: string,
    repoName: string,
    description: string
  ): Observable<Repository> {
    return this.dataService
      .updateRepository(userLogin, repoName, {
        description
      })
      .pipe(
        tap(repository => {
          if (!!repository) {
            this._repositoriesMap.set(userLogin + '/' + repoName, repository);
          }
        })
      );
  }

  public isAccessToken(): boolean {
    return this.dataService.isAccessToken();
  }

  public setAccessToken(token: string): void {
    this.dataService.setAccessToken(token);
  }
}
