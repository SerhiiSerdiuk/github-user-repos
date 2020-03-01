import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { Repository, RepoReadMe } from '../../model/entities';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrls: ['./repo-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoDetailsComponent implements OnInit {
  public repository$: Observable<Repository | null>;
  public readMe$: Observable<RepoReadMe | null>;
  public description: string | null = null;
  public isEditModeOn = false;

  constructor(
    private route: ActivatedRoute,
    private modelService: ModelService
  ) {}

  ngOnInit() {
    const userLogin = this.route.snapshot.paramMap.get('user');
    const repoName = this.route.snapshot.paramMap.get('repo');
    this.repository$ = this.modelService.getRepository(userLogin, repoName);
    this.readMe$ = this.modelService.getReadMe(userLogin, repoName);
  }

  public downloadZip(userLogin: string, repoName: string): void {
    if (userLogin && repoName) {
      window.location.href = `https://github.com/${userLogin}/${repoName}/archive/master.zip`;
    }
  }

  public switchToEditMode(): void {
    this.isEditModeOn = !this.isEditModeOn;
  }

  public updateDescription(value: string): void {
    this.description = value;
  }

  public saveDescription(repository: Repository): void {
    this.switchToEditMode();
  }

  public cancelEditDescription(repository: Repository): void {
    if (this.description !== null) {
      this.description = repository.description;
    }
    this.switchToEditMode();
  }
}
