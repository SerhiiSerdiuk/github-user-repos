import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';
import { Repository } from 'src/app/model/entities';

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrls: ['./repo-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoDetailsComponent implements OnInit {
  public repository: Repository | null;

  constructor(
    private route: ActivatedRoute,
    private modelService: ModelService
  ) {}

  ngOnInit() {
    const userLogin = this.route.snapshot.paramMap.get('user');
    const repoName = this.route.snapshot.paramMap.get('repo');
    this.repository = this.modelService.getRepository(userLogin, repoName);
  }
}
