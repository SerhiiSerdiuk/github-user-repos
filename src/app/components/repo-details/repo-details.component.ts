import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ModelService } from '../../services/model.service';
import { Repository, RepoReadMe } from '../../model/entities';
import { Observable, Subscription, of, throwError } from 'rxjs';
import { first, catchError, retry } from 'rxjs/operators';

interface RepoLocalStorageValue {
  [key: string]: {
    description: string;
  };
}

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrls: ['./repo-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoDetailsComponent implements OnInit, OnDestroy {
  private repositorySubscription: Subscription;
  public repository: Repository | null;
  public readMe$: Observable<RepoReadMe | null>;
  public isEditModeOn = false;
  public userLogin: string | null;
  public repoName: string | null;
  public warningMessage = '';
  public displayAccessDialog = false;
  public get description(): string | null {
    return this._description !== null
      ? this._description
      : this.repository
      ? this.repository.description
      : null;
  }
  public set description(value: string | null) {
    this._description = value;
    this._saveDescriptionInLocalStorage(value);
  }
  private _description: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private modelService: ModelService,
    private changeDetector: ChangeDetectorRef
  ) {}

  private handleError() {
    return (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.updateAccessToken('');
          setTimeout(() => {
            this.showAccessDialog();
            this.changeDetector.markForCheck();
          });
          return of(null);
        }
      }
      return throwError(err);
    };
  }

  private _getDescriptionFromLocalStorage(): string | null {
    if (this.userLogin && this.repoName) {
      const currentValueInStore = localStorage.getItem(this.userLogin);
      if (currentValueInStore) {
        const storeValue = JSON.parse(
          currentValueInStore
        ) as RepoLocalStorageValue;
        if (
          storeValue[this.repoName] &&
          storeValue[this.repoName].description
        ) {
          return storeValue[this.repoName].description;
        }
      }
    }
    return null;
  }

  private _saveDescriptionInLocalStorage(value: string | null): void {
    if (this.userLogin && this.repoName && value !== null) {
      const storageValue: RepoLocalStorageValue = {
        [this.repoName]: { description: value }
      };
      localStorage.setItem(this.userLogin, JSON.stringify(storageValue));
    }
  }

  private _removeDescriptionFromLocalStorage(): void {
    if (this.userLogin && this.repoName) {
      const currentValueInStore = localStorage.getItem(this.userLogin);
      if (currentValueInStore) {
        const storeValue = JSON.parse(
          currentValueInStore
        ) as RepoLocalStorageValue;
        if (storeValue[this.repoName]) {
          delete storeValue[this.repoName].description;
        }
        localStorage.setItem(this.userLogin, JSON.stringify(storeValue));
      }
    }
  }

  private _updateWarningMessage(): void {
    if (
      this.description &&
      this.repository &&
      this.repository.description !== this.description
    ) {
      this.warningMessage = 'The latest updates weren’t saved';
    } else {
      this.warningMessage = '';
    }
  }

  ngOnInit() {
    this.userLogin = this.route.snapshot.paramMap.get('user');
    this.repoName = this.route.snapshot.paramMap.get('repo');
    this.description = this._getDescriptionFromLocalStorage();
    this.readMe$ = this.modelService.getReadMe(this.userLogin, this.repoName);
    this.repositorySubscription = this.modelService
      .getRepository(this.userLogin, this.repoName)
      .subscribe(r => {
        this.repository = r;
        this.changeDetector.markForCheck();
        this._updateWarningMessage();
      });
  }

  ngOnDestroy() {
    if (this.repositorySubscription) {
      this.repositorySubscription.unsubscribe();
    }
  }

  public downloadZip(userLogin: string, repoName: string): void {
    if (userLogin && repoName) {
      window.location.href = `https://github.com/${userLogin}/${repoName}/archive/master.zip`;
    }
  }

  public switchEditMode(): void {
    this.isEditModeOn = !this.isEditModeOn;
  }

  public showAccessDialog(): void {
    this.displayAccessDialog = true;
  }

  public hideAccessDialog(): void {
    this.displayAccessDialog = false;
  }

  public updateAccessToken(token: string): void {
    this.modelService.setAccessToken(token);
    this.hideAccessDialog();
  }

  public saveDescription(): void {
    if (this.repository) {
      if (
        this.description &&
        this.description !== this.repository?.description
      ) {
        if (!this.modelService.isAccessToken()) {
          this.showAccessDialog();
        } else {
          this.modelService
            .updateRepositoryDescription(
              this.repository.owner.login,
              this.repository.name,
              this.description
            )
            .pipe(catchError(this.handleError()), first())
            .subscribe((repository: Repository | null) => {
              if (!!repository) {
                this.repository = repository;
                this.description = this.repository.description;
                this.changeDetector.markForCheck();
                this._updateWarningMessage();
                this.switchEditMode();
              }
            });
        }
      }
    }
  }

  public cancelEditDescription(): void {
    if (this.repository && this.description !== null) {
      this.description = this.repository.description;
      this._removeDescriptionFromLocalStorage();
    }
    this.switchEditMode();
    this._updateWarningMessage();
  }
}
