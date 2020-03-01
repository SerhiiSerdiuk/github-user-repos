import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { DataService } from './data.service';
import { User, Repository, UserList, RepoReadMe } from '../model/entities';

describe('Service: Data', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('should get user', inject([DataService], (service: DataService) => {
    const testData: User = {
      login: 'userlogin',
      avatar_url: 'user_avatar_url',
      name: 'userName'
    };

    const testUrl = service.githubApiUrl + 'users/' + testData.login;
    service
      .getUser(testData.login)
      .subscribe(data => expect(data).toEqual(testData));

    const request = httpTestingController.expectOne(
      (req: HttpRequest<User>) =>
        req.url === testUrl &&
        req.headers.has('Accept') &&
        req.headers.get('Accept') === 'application/vnd.github.v3+json'
    );

    expect(request.request.method).toEqual('GET');
    request.flush(testData);
  }));

  it('should search users', inject([DataService], (service: DataService) => {
    const testData: UserList = {
      total_count: 2,
      incomplete_results: false,
      items: [
        {
          login: 'userlogin_1',
          avatar_url: 'user_avatar_url_1',
          name: 'userName_1'
        },
        {
          login: 'userlogin_2',
          avatar_url: 'user_avatar_url_2',
          name: 'userName_2'
        }
      ]
    };

    const testUrl = service.githubApiUrl + 'search/users';
    service.searchUsers('wanted').subscribe(data => {
      expect(data).toEqual(testData);
      expect(data.items.length).toBe(2);
      expect(data.items.length).not.toBe(1);
    });

    const request = httpTestingController.expectOne(
      (req: HttpRequest<UserList>) =>
        req.url === testUrl &&
        req.params.has('q') &&
        req.params.get('q') === 'wanted' &&
        req.headers.has('Accept') &&
        req.headers.get('Accept') === 'application/vnd.github.v3+json'
    );

    expect(request.request.method).toEqual('GET');
    request.flush(testData);
  }));

  it('should get README', inject([DataService], (service: DataService) => {
    const userLogin = 'userLoginName';
    const userRepo = 'repo_1';
    const testData: RepoReadMe = {
      download_url: 'download_url'
    };

    const testUrl = service.githubApiUrl + 'repos/userLoginName/repo_1/readme';
    service
      .getRepoReadMe(userLogin, userRepo)
      .subscribe(data => expect(data).toEqual(testData));

    const request = httpTestingController.expectOne(
      (req: HttpRequest<RepoReadMe>) =>
        req.url === testUrl &&
        req.headers.has('Accept') &&
        req.headers.get('Accept') === 'application/vnd.github.v3+json'
    );

    expect(request.request.method).toEqual('GET');
    request.flush(testData);
  }));

  it('should get repository', inject([DataService], (service: DataService) => {
    const userLogin = 'userLoginName';
    const testData: Repository = {
      name: 'repo_1',
      description: '',
      owner: { login: userLogin },
      updated_at: ''
    };

    const testUrl = service.githubApiUrl + 'repos/userLoginName/repo_1';
    service
      .getRepository(userLogin, testData.name)
      .subscribe(data => expect(data).toEqual(testData));

    const request = httpTestingController.expectOne(
      (req: HttpRequest<Repository>) =>
        req.url === testUrl &&
        req.headers.has('Accept') &&
        req.headers.get('Accept') === 'application/vnd.github.v3+json'
    );

    expect(request.request.method).toEqual('GET');
    request.flush(testData);
  }));

  it('should get repositories', inject(
    [DataService],
    (service: DataService) => {
      const userLogin = 'userLoginName';
      const testData: Repository[] = [
        {
          name: 'repo_1',
          description: '',
          owner: { login: userLogin },
          updated_at: ''
        },
        {
          name: 'repo_2',
          description: '',
          owner: { login: userLogin },
          updated_at: ''
        }
      ];

      const testUrl = service.githubApiUrl + 'users/userLoginName/repos';
      service.getRepositories(userLogin).subscribe(data => {
        expect(data).toEqual(testData);
        expect(data.length).toBe(2);
        expect(data.length).not.toBe(1);
      });

      const request = httpTestingController.expectOne(
        (req: HttpRequest<Repository[]>) =>
          req.url === testUrl &&
          req.headers.has('Accept') &&
          req.headers.get('Accept') === 'application/vnd.github.v3+json'
      );

      expect(request.request.method).toEqual('GET');
      request.flush(testData);
    }
  ));
});
