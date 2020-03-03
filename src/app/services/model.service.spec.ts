import { TestBed } from '@angular/core/testing';
import { addMatchers, initTestScheduler, cold } from 'jasmine-marbles';

import { ModelService } from './model.service';
import { DataService } from './data.service';
import { RepoReadMe, User, UserList, Repository } from '../model/entities';

describe('Service: Model', () => {
  let service: ModelService;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    const spyDataService = jasmine.createSpyObj<DataService>('DataService', [
      'getUser',
      'searchUsers',
      'getRepository',
      'getRepositories',
      'getRepoReadMe',
      'updateRepository'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ModelService,
        { provide: DataService, useValue: spyDataService }
      ]
    });

    service = TestBed.inject(ModelService);
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    initTestScheduler();
    addMatchers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUser should return stubbed user', () => {
    const expectedUser: User = { login: 'user_1', avatar_url: '', name: '' };
    const expectedUser$ = cold('a', { a: expectedUser });
    dataServiceSpy.getUser.and.returnValue(expectedUser$);
    const user$ = service.getUser('user_1');
    expect(user$).toBeObservable(expectedUser$);
  });

  it('searchUsers should return stubbed list of users', () => {
    const expectedUserList: UserList = {
      total_count: 1,
      incomplete_results: false,
      items: [{ login: 'user_1', avatar_url: '', name: '' }]
    };
    const expectedUserList$ = cold('a', { a: expectedUserList });
    dataServiceSpy.searchUsers.and.returnValue(expectedUserList$);
    const user1$ = service.searchUsers('user_1');
    const user2$ = service.searchUsers('user_2');
    expect(user1$).toBeObservable(expectedUserList$);
    expect(user2$).toBeObservable(expectedUserList$);
    expect(dataServiceSpy.searchUsers.calls.count()).toBe(2);
  });

  it('getRepository should return stubbed user', () => {
    const expectedRepo: Repository = {
      name: 'repo_1',
      description: '',
      updated_at: '',
      owner: { login: 'user_1' }
    };
    const expectedRepo$ = cold('a', { a: expectedRepo });
    dataServiceSpy.getRepository.and.returnValue(expectedRepo$);
    const repo1$ = service.getRepository('user_1', 'repo_1');
    const repo2$ = service.getRepository('user_1', 'repo_3');
    expect(repo1$).toBeObservable(expectedRepo$);
    expect(repo2$).toBeObservable(expectedRepo$);
    expect(dataServiceSpy.getRepository.calls.count()).toBe(2);
  });

  it('getRepositories should return stubbed list of users', () => {
    const expectedRepositories: Repository[] = [
      {
        name: 'repo_1',
        description: '',
        updated_at: '',
        owner: { login: 'user_1' }
      }
    ];
    const expectedRepositories$ = cold('a', { a: expectedRepositories });
    dataServiceSpy.getRepositories.and.returnValue(expectedRepositories$);
    const repositories1$ = service.getRepositories('user_1');
    expect(repositories1$).toBeObservable(expectedRepositories$);

    const repoMap = new Map().set('repo_1', expectedRepositories[0]);
    service.userRepositoriesMap.set('user_1', repoMap);
    service.getRepositories('user_1');
    expect(dataServiceSpy.getRepositories.calls.count()).toBe(
      1,
      'request to the server should be only one'
    );
  });

  it('getReadMe should return stubbed repository README response', () => {
    const expectedRepoReadMe: RepoReadMe = { download_url: 'readme_url' };
    const expectedRepoReadMe$ = cold('a', { a: expectedRepoReadMe });
    dataServiceSpy.getRepoReadMe.and.returnValue(expectedRepoReadMe$);
    const readMe$ = service.getReadMe('user', 'repo');
    expect(readMe$).toBeObservable(expectedRepoReadMe$);
  });

  it('getReadMe should return observable with null', () => {
    const expectedRepoReadMe: RepoReadMe | null = null;
    const expectedRepoReadMe$ = cold('(a|)', { a: expectedRepoReadMe });
    dataServiceSpy.getRepoReadMe.and.returnValue(expectedRepoReadMe$);

    const readMeWithoutUser$ = service.getReadMe(null, 'repo');
    expect(readMeWithoutUser$).toBeObservable(expectedRepoReadMe$);

    const readMeWithoutRepo$ = service.getReadMe('user', null);
    expect(readMeWithoutRepo$).toBeObservable(expectedRepoReadMe$);
  });

  it('should update repository description', () => {
    const userLogin = 'userLoginName';
    const initialRepo: Repository = {
      name: 'repo_1',
      description: 'description',
      owner: { login: userLogin },
      updated_at: new Date().toDateString()
    };
    const updatedRepo: Repository = {
      name: 'repo_1',
      description: 'new description',
      owner: { login: userLogin },
      updated_at: new Date().toDateString()
    };

    const expectedRepo$ = cold('a', { a: updatedRepo });
    dataServiceSpy.updateRepository.and.returnValue(expectedRepo$);
    const repo$ = service.updateRepositoryDescription(
      initialRepo.owner.login,
      initialRepo.name,
      updatedRepo.description
    );
    expect(repo$).toBeObservable(expectedRepo$);
  });
});
