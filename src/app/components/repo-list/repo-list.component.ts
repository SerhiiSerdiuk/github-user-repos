import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModelService } from '../../services/model.service';
import { Repository } from '../../model/entities';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoListComponent implements OnInit {
  public repositories$: Observable<Repository[] | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService
  ) {}

  ngOnInit() {
    this.repositories$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.modelService.getRepositories(params.get('user'))
      )
    );
  }

  public selectRepository(repo: Repository): void {
    this._showRepository(repo.owner.login, repo.name);
  }

  private _showRepository(userLogin: string, repoName: string): void {
    this.router.navigate(['/repository', userLogin, repoName]);
  }
}
