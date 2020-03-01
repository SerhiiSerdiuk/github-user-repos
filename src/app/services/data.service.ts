import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserList, Repository, User, RepoReadMe } from '../model/entities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _githubApiUrl = 'https://api.github.com/';
  private _headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json'
  });

  constructor(private http: HttpClient) {}

  public getUser(userLogin: string): Observable<User> {
    const url = this._githubApiUrl + 'users/' + userLogin;
    return this.http.get<User>(url, { headers: this._headers });
  }

  public searchUsers(pattern: string): Observable<UserList> {
    const url = this._githubApiUrl + 'search/users';
    const params = new HttpParams().set('q', pattern);
    return this.http.get<UserList>(url, { headers: this._headers, params });
  }

  public getRepository(userLogin: string, repoName: string): Observable<Repository> {
    const url = `${this._githubApiUrl}repos/${userLogin}/${repoName}`;
    return this.http.get<Repository>(url, { headers: this._headers });
  }

  public getRepositories(userLogin: string): Observable<Repository[]> {
    const url = `${this._githubApiUrl}users/${userLogin}/repos`;
    return this.http.get<Repository[]>(url, { headers: this._headers });
  }

  public getRepoReadMe(userLogin: string, repoName: string): Observable<RepoReadMe> {
    const url = `${this._githubApiUrl}repos/${userLogin}/${repoName}/readme`;
    return this.http.get<RepoReadMe>(url, { headers: this._headers });
  }
}
