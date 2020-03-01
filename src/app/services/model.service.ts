import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable, of } from 'rxjs';
import { UserList, Repository, User, RepoReadMe } from '../model/entities';
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

    const user =
      users && users.length ? users.find(u => u.login === userLogin) : null;

    // return of({
    //   login: 'SerhiiSerdiuk',
    //   name: 'Serhii Serdiuk',
    //   avatar_url: 'https://avatars1.githubusercontent.com/u/4322071?v=4'
    // });
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

    // return of([
    //   {
    //     name: 'repo 1',
    //     owner: {
    //       login: 'owner 1'
    //     },
    //     description: 'description',
    //     updated_at: '2019-12-22T20:10:08Z',
    //     stargazers_count: 2
    //   },
    //   {
    //     name: 'repo 2',
    //     owner: {
    //       login: 'owner 2'
    //     },
    //     description: 'description 2',
    //     updated_at: '2016-08-27T19:03:53Z',
    //     stargazers_count: 3
    //   }
    // ]);
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
  ): Observable<Repository | null> {
    if (!loginName || !repoName) {
      return of(null);
    }
    const repo = this._repositoriesMap.get(loginName + repoName);
    return repo ? of(repo) : this.dataService.getRepository(loginName, repoName);
    // return {
    //   name: 'repo 1',
    //   owner: {
    //     login: 'owner 1'
    //   },
    //   description: 'description',
    //   updated_at: '2019-12-22T20:10:08Z',
    //   stargazers_count: 2
    // };
  }

  public getReadMe(
    loginName: string | null,
    repoName: string | null
  ): Observable<RepoReadMe | null> {
    if (!loginName || !repoName) {
      return of(null);
    }
    // return of({
    //   name: 'README.md',
    //   path: 'README.md',
    //   sha: 'dac553362ad2ae4a52167e99b67f7e027acd9bb4',
    //   size: 1774,
    //   url:
    //     'https://api.github.com/repos/SerhiiSerdiuk/angular/contents/README.md?ref=master',
    //   html_url:
    //     'https://github.com/SerhiiSerdiuk/angular/blob/master/README.md',
    //   git_url:
    //     'https://api.github.com/repos/SerhiiSerdiuk/angular/git/blobs/dac553362ad2ae4a52167e99b67f7e027acd9bb4',
    //   download_url:
    //     'https://raw.githubusercontent.com/SerhiiSerdiuk/angular/master/README.md',
    //   type: 'file',
    //   content:
    //     'WyFbQ2lyY2xlQ0ldKGh0dHBzOi8vY2lyY2xlY2kuY29tL2doL2FuZ3VsYXIv\nYW5ndWxhci90cmVlL21hc3Rlci5zdmc/c3R5bGU9c2hpZWxkKV0oaHR0cHM6\nLy9jaXJjbGVjaS5jb20vZ2gvYW5ndWxhci93b3JrZmxvd3MvYW5ndWxhci90\ncmVlL21hc3RlcikKWyFbQnJvd3NlclN0YWNrIFN0YXR1c10oaHR0cHM6Ly93\nd3cuYnJvd3NlcnN0YWNrLmNvbS9hdXRvbWF0ZS9iYWRnZS5zdmc/YmFkZ2Vf\na2V5PUx6RjNSekJWVkd0NlZXRTJTMGhIYUM5dVlsbE9aejA5TFMxQlZqTlRj\nbEJLVjB4NGVWUmxjakE0UVZZMU0wTjNQVDA9LS1lYjRjZThjOGRjMmMxYzVi\nMmI1MzUyZDQ3M2VlMTJhNzNhYzIwZTA2KV0oaHR0cHM6Ly93d3cuYnJvd3Nl\ncnN0YWNrLmNvbS9hdXRvbWF0ZS9wdWJsaWMtYnVpbGQvTHpGM1J6QlZWR3Q2\nVldFMlMwaEhhQzl1WWxsT1p6MDlMUzFCVmpOVGNsQktWMHg0ZVZSbGNqQTRR\nVlkxTTBOM1BUMD0tLWViNGNlOGM4ZGMyYzFjNWIyYjUzNTJkNDczZWUxMmE3\nM2FjMjBlMDYpClshW0pvaW4gdGhlIGNoYXQgYXQgaHR0cHM6Ly9naXR0ZXIu\naW0vYW5ndWxhci9hbmd1bGFyXShodHRwczovL2JhZGdlcy5naXR0ZXIuaW0v\nSm9pbiUyMENoYXQuc3ZnKV0oaHR0cHM6Ly9naXR0ZXIuaW0vYW5ndWxhci9h\nbmd1bGFyP3V0bV9zb3VyY2U9YmFkZ2UmdXRtX21lZGl1bT1iYWRnZSZ1dG1f\nY2FtcGFpZ249cHItYmFkZ2UmdXRtX2NvbnRlbnQ9YmFkZ2UpClshW25wbSB2\nZXJzaW9uXShodHRwczovL2JhZGdlLmZ1cnkuaW8vanMvJTQwYW5ndWxhciUy\nRmNvcmUuc3ZnKV0oaHR0cHM6Ly93d3cubnBtanMuY29tL0Bhbmd1bGFyL2Nv\ncmUpCgoKIyBBbmd1bGFyCgpBbmd1bGFyIGlzIGEgZGV2ZWxvcG1lbnQgcGxh\ndGZvcm0gZm9yIGJ1aWxkaW5nIG1vYmlsZSBhbmQgZGVza3RvcCB3ZWIgYXBw\nbGljYXRpb25zIHVzaW5nIFR5cGVTY3JpcHQvSmF2YVNjcmlwdCBhbmQgb3Ro\nZXIgbGFuZ3VhZ2VzLgoKIyMgUXVpY2tzdGFydAoKW0dldCBzdGFydGVkIGlu\nIDUgbWludXRlc11bcXVpY2tzdGFydF0uCgojIyBDaGFuZ2Vsb2cKCltMZWFy\nbiBhYm91dCB0aGUgbGF0ZXN0IGltcHJvdmVtZW50c11bY2hhbmdlbG9nXS4K\nCiMjIFdhbnQgdG8gaGVscD8KCldhbnQgdG8gZmlsZSBhIGJ1ZywgY29udHJp\nYnV0ZSBzb21lIGNvZGUsIG9yIGltcHJvdmUgZG9jdW1lbnRhdGlvbj8gRXhj\nZWxsZW50ISBSZWFkIHVwIG9uIG91cgpndWlkZWxpbmVzIGZvciBbY29udHJp\nYnV0aW5nXVtjb250cmlidXRpbmddIGFuZCB0aGVuIGNoZWNrIG91dCBvbmUg\nb2Ygb3VyIGlzc3VlcyBpbiB0aGUgW2hvdGxpc3Q6IGNvbW11bml0eS1oZWxw\nXShodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2xhYmVscy9o\nb3RsaXN0JTNBJTIwY29tbXVuaXR5LWhlbHApLgoKW2Jyb3dzZXJzdGFja106\nIGh0dHBzOi8vd3d3LmJyb3dzZXJzdGFjay5jb20vYXV0b21hdGUvcHVibGlj\nLWJ1aWxkL0x6RjNSekJWVkd0NlZXRTJTMGhIYUM5dVlsbE9aejA5TFMxQlZq\nTlRjbEJLVjB4NGVWUmxjakE0UVZZMU0wTjNQVDA9LS1lYjRjZThjOGRjMmMx\nYzViMmI1MzUyZDQ3M2VlMTJhNzNhYzIwZTA2Cltjb250cmlidXRpbmddOiBo\ndHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvbWFzdGVy\nL0NPTlRSSUJVVElORy5tZApbcXVpY2tzdGFydF06IGh0dHBzOi8vYW5ndWxh\nci5pby9zdGFydApbY2hhbmdlbG9nXTogaHR0cHM6Ly9naXRodWIuY29tL2Fu\nZ3VsYXIvYW5ndWxhci9ibG9iL21hc3Rlci9DSEFOR0VMT0cubWQKW25nXTog\naHR0cHM6Ly9hbmd1bGFyLmlvCg==\n',
    //   encoding: 'base64',
    //   _links: {
    //     self:
    //       'https://api.github.com/repos/SerhiiSerdiuk/angular/contents/README.md?ref=master',
    //     git:
    //       'https://api.github.com/repos/SerhiiSerdiuk/angular/git/blobs/dac553362ad2ae4a52167e99b67f7e027acd9bb4',
    //     html: 'https://github.com/SerhiiSerdiuk/angular/blob/master/README.md'
    //   }
    // });
    return this.dataService.getRepoReadMe(loginName, repoName);
  }
}
