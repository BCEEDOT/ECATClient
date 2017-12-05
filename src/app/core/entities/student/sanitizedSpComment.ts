import { EntityBase } from '../entitybase';
import { FacSpCommentFlag } from './facSpCommentFlag';
import { StudSpCommentFlag } from './studSpCommentFlag';
import { SpResult } from './spResult';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class SanitizedSpComment extends EntityBase {
   // Generated code. Do not place code below this line.
   id: string;
   recipientId: number;
   courseId: number;
   workGroupId: number;
   authorName: string;
   commentText: string;
   facFlag: FacSpCommentFlag;
   mpCommentFlagRecipient: string;
   flag: StudSpCommentFlag;
   result: SpResult;

   /// <code> Place custom code between <code> tags
   
   /// </code>

}

