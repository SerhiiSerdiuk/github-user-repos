import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { pluck } from 'rxjs/operators';

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

  constructor(private modelService: ModelService, private router: Router) {}

  ngOnInit() {}

  public search(): void {
    const pattern = this.pattern ? this.pattern.trim() : '';
    if (pattern) {
      this.foundUsers$ = this.modelService.searchUsers(pattern);
      this.users$ = this.foundUsers$.pipe(pluck('items'));
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
