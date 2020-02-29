import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserList, Repository } from '../model/entities';
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

  public searchUsers(pattern: string): Observable<UserList> {
    const url = this._githubApiUrl + 'search/users';
    const params = new HttpParams().set('q', pattern);
    return this.http.get<UserList>(url, { headers: this._headers, params });
  }

  public getRepositories(userLogin: string): Observable<Repository[]> {
    const url = `${this._githubApiUrl}users/${userLogin}/repos`;
    return this.http.get<Repository[]>(url, { headers: this._headers });
  }
}
