import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { SelectItem } from 'primeng/api/selectitem';

import { ModelService } from '../../services/model.service';
import { Repository, User } from '../../model/entities';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoListComponent implements OnInit {
  public repositories$: Observable<Repository[] | null>;
  public user$: Observable<User | null>;
  public isLoading = false;

  public repoFormGroup = this.fb.group({ filter: '', sortBy: 'title' });
  public sortOptions: SelectItem[] = [
    { label: 'Title', value: 'title' },
    { label: 'Date', value: 'date' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService,
    private fb: FormBuilder
  ) {}

  private _filterRepositories(
    repositories: Repository[] | null,
    filter: string
  ): Repository[] | null {
    return repositories
      ? repositories.filter(r => r.name.includes(filter))
      : null;
  }

  private _sortRepositoriesByDate(
    repositories: Repository[] | null
  ): Repository[] | null {
    return repositories
      ? repositories.sort((r1, r2) => {
          const date1 = new Date(r1.updated_at).getTime();
          const date2 = new Date(r2.updated_at).getTime();
          return date1 - date2;
        })
      : null;
  }

  private _sortRepositoriesByTitle(
    repositories: Repository[] | null
  ): Repository[] | null {
    return repositories
      ? repositories.sort((r1, r2) => r1.name.localeCompare(r2.name))
      : null;
  }

  private _showRepository(userLogin: string, repoName: string): void {
    this.router.navigate(['/repository', userLogin, repoName]);
  }

  private _getUser(): Observable<User | null> {
    return this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.modelService.getUser(params.get('user'))
      )
    );
  }

  private _getRepositories(): Observable<Repository[] | null> {
    const formChanges$: Observable<{
      filter: string;
      sortBy: string;
    }> = this.repoFormGroup.valueChanges;

    return this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        combineLatest([
          formChanges$,
          this.modelService.getRepositories(params.get('user')).pipe(
            catchError(() => {
              this.isLoading = false;
              return of(null);
            }),
            tap(() => {
              this.isLoading = false;
            })
          )
        ]).pipe(
          map(([{ filter, sortBy }, repositories]) => {
            let newRepositories = repositories;
            if (filter) {
              newRepositories = this._filterRepositories(
                newRepositories,
                filter
              );
            }
            if (sortBy === 'date') {
              newRepositories = this._sortRepositoriesByDate(newRepositories);
            }
            if (sortBy === 'title') {
              newRepositories = this._sortRepositoriesByTitle(newRepositories);
            }
            return newRepositories;
          })
        )
      )
    );
  }

  ngOnInit() {
    this.isLoading = true;
    this.user$ = this._getUser();
    this.repositories$ = this._getRepositories();

    setTimeout(() => {
      this.repoFormGroup.updateValueAndValidity();
    });
  }

  public selectRepository(repo: Repository): void {
    this._showRepository(repo.owner.login, repo.name);
  }
}
