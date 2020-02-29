import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';

import { ModelService } from '../../services/model.service';
import { User, UserList } from '../../model/entities';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  public pattern: string;
  public users$: Observable<User[] | null>;
  public foundUsers$: Observable<UserList>;
  public isLoading = false;

  constructor(private modelService: ModelService, private router: Router) {}

  ngOnInit() {
    const lastSearchPattern = this.modelService.lastSearchPattern;
    if (lastSearchPattern) {
      this.search(lastSearchPattern);
    }
  }

  public search(pattern: string): void {
    if (pattern.trim()) {
      this.isLoading = true;
      this.foundUsers$ = this.modelService.searchUsers(pattern.trim());
      this.users$ = this.foundUsers$.pipe(
        pluck('items'),
        tap(() => {
          this.isLoading = false;
          this.pattern = '';
        })
      );
    } else {
      this.users$ = of(null);
    }
  }

  public selectUser(user: User): void {
    this._showUserRepositories(user.login);
  }

  private _showUserRepositories(userLogin: string): void {
    this.router.navigate(['/repositories', userLogin]);
  }
}
