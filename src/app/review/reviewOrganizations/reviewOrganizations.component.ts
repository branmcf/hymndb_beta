import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SubmitService } from './../../services/submit.service';
import { ReviewService } from './../../services/review.service';
import { Resource } from './../../domain/submissions/submission';

@Component({
  selector: 'hymn-review-organizations',
  templateUrl: './reviewOrganizations.html',
})

export class ReviewOrganizationsComponent implements OnInit {
  resources: Resource[];
  id: number;

  constructor (private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService) {

      this.reviewService.getAllOrganizations().then(x => this.resources = x);
  }

  ngOnInit() {}
}
