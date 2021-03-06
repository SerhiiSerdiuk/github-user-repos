import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserList, Repository, User, RepoReadMe } from '../model/entities';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _accessToken = '';
  public readonly githubApiUrl = 'https://api.github.com/';
  public readonly headers = new HttpHeaders({
    Accept: 'application/vnd.github.v3+json'
  });

  constructor(private http: HttpClient) {}

  public isAccessToken(): boolean {
    return !!this._accessToken;
  }

  public setAccessToken(token: string): void {
    this._accessToken = token;
  }

  public getUser(userLogin: string): Observable<User> {
    const url = this.githubApiUrl + 'users/' + userLogin;
    return this.http.get<User>(url, { headers: this.headers });
  }

  public searchUsers(pattern: string): Observable<UserList> {
    const url = this.githubApiUrl + 'search/users';
    const params = new HttpParams().set('q', pattern);
    return this.http.get<UserList>(url, { headers: this.headers, params });
  }

  public getRepository(
    userLogin: string,
    repoName: string
  ): Observable<Repository> {
    const url = `${this.githubApiUrl}repos/${userLogin}/${repoName}`;
    return this.http.get<Repository>(url, { headers: this.headers });
  }

  public getRepositories(userLogin: string): Observable<Repository[]> {
    const url = `${this.githubApiUrl}users/${userLogin}/repos`;
    return this.http.get<Repository[]>(url, { headers: this.headers });
  }

  public getRepoReadMe(
    userLogin: string,
    repoName: string
  ): Observable<RepoReadMe> {
    const url = `${this.githubApiUrl}repos/${userLogin}/${repoName}/readme`;
    return this.http.get<RepoReadMe>(url, { headers: this.headers });
  }

  public updateRepository(
    userLogin: string,
    repoName: string,
    repo: Partial<Repository>
  ): Observable<Repository> {
    if (!this._accessToken) {
      throw new Error('Access token does not set');
    }
    const headers = this.headers.set(
      'authorization',
      'token ' + this._accessToken
    );
    const url = `${this.githubApiUrl}repos/${userLogin}/${repoName}`;
    return this.http.patch<Repository>(encodeURI(url), repo, { headers });
  }
}
