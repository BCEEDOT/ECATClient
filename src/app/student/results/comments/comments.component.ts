import { Component, OnInit, OnChanges, Input, AfterViewInit, AfterViewChecked, Output } from '@angular/core';

import { SpResult, SanitizedSpComment } from '../../../core/entities/student';
import { MpSpStatus } from '../../../core/common/mapStrings';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnChanges {

  comments: SanitizedSpComment[];
  memHasComments: boolean = false;
  selectedComment: SanitizedSpComment;

  @Input() memberResults: SpResult;

  ngOnChanges(): void {
    this.activate();
  }

  ngOnInit(): void {
    this.activate();
  }

  activate(): void {
    this.comments = this.memberResults.sanitizedComments;
    if (this.comments && this.comments.length > 0)
    {
      this.memHasComments = true;
    } else {
      this.memHasComments = false;
    }
  }

}
