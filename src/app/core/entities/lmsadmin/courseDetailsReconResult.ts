import { EntityBase } from "../entitybase";

import { GroupMemReconResult } from "./groupMemReconResult";
import { GroupReconResult } from "./groupReconResult";
import { MemReconResult } from "./memReconResult";

export class CourseDetailsReconResult extends EntityBase {
  // Generated code. Do not place code below this line.
  id: string;
  academyId: string;
  numAdded: number;
  numRemoved: number;

  /// <code> Place custom code between <code> tags
  groupReconResult: GroupReconResult;
  courseMemberReconResult: MemReconResult;
  groupMemReconResults: GroupMemReconResult[];
  hasToken: boolean;
  /// </code>
}
