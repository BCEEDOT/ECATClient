import { Injectable } from "@angular/core";
import {
  EntityManager,
  Entity,
  EntityQuery,
  FetchStrategy,
  SaveOptions,
  EntityChangedEventArgs,
  EntityError
} from "breeze-client";
import { Subject } from "rxjs";

import { MpEntityError } from "../../core/common/mapStrings";
import { EmProviderService } from "../../core/services/em-provider.service";
import { DataContext } from "../../app-constants";

//@Injectable()
export class BaseDataContext {
  static shelveSets = {};
  //private static savedOrRejectedSubject = new Subject<SavedOrRejectedArgs>();

  _manager: EntityManager;

  entityChangedSubject: Subject<EntityChangedEventArgs>;

  constructor(
    private dataContext: DataContext,
    private _emProvider: EmProviderService
  ) {
    this.entityChangedSubject = new Subject<EntityChangedEventArgs>();
  }

  // static deleteShelveSet(key: string): void {
  //     delete UnitOfWork.shelveSets[key];
  // }

  protected get manager(): EntityManager {
    if (!this._manager) {
      this._manager = this._emProvider.getManager(this.dataContext);

      this._manager.entityChanged.subscribe(args => {
        this.entityChangedSubject.next(args);
      });
    }
    return this._manager;
  }

  get entityChanged() {
    return this.entityChangedSubject.asObservable();
  }

  protected queryFailed(error: any) {
    const msg = `Error querying data: ${
      error ? error.message || error.status : "Unknown Reason"
    }`;
    return Promise.reject(msg);
  }

  static get savedOrRejected() {
    //return UnitOfWork.savedOrRejectedSubject.asObservable();
    return null;
  }

  //modify has changes so that it checks against all managers?
  hasChanges(): boolean {
    return this.manager.hasChanges();
  }

  // clear(): void {
  //     this.manager.clear();
  // }

  // hasChangesChanged(): Observable<any> {
  //     return this.manager.hasChangesChanged.subscribe(eventArgs => {
  //         var data = {hasChanges: eventArgs.hasChanges}
  //     })
  // }

  getChanges(): Entity[] {
    return this.manager.getChanges();
  }

  namedCommit(selectedEntities: Entity[]) {
    return <any>this.manager
      .saveChanges(selectedEntities)
      .then(saveResult => {
        return saveResult.entities;
      })
      .catch(errors => {
        console.log(errors);
        console.log(errors.entityErrors);
        let message = this.processSaveErrors(errors);

        throw message;
      });
  }

  //This is save changes
  commit(): Promise<any> {
    //let saveOptions = new SaveOptions({ resourceName: 'savechanges' });
    //console.log(this.getChanges());
    //return <any>this.manager.saveChanges(null, saveOptions)
    return <any>this.manager
      .saveChanges()
      .then(saveResult => {
        return saveResult.entities;
      })
      .catch(errors => {
        console.log(errors);
        console.log(errors.entityErrors);
        let message = this.processSaveErrors(errors);

        throw message;
      });
  }

  processSaveErrors(errors): string {
    const entityErrors = errors.entityErrors;

    if (errors.status === 401) {
      return "You have meen logged out due to time. Please login and try";
    }

    if (entityErrors) {
      const monitorErrors = entityErrors.filter(
        error =>
          error.errorName === MpEntityError.crseNotOpen ||
          error.errorName === MpEntityError.wgNotOpen
      );
      if (monitorErrors.length > 0) {
        monitorErrors.forEach(error =>
          error.entity.entityAspect.rejectChanges()
        );

        if (
          monitorErrors.some(
            error => error.errorName === MpEntityError.crseNotOpen
          )
        ) {
          return "The Course is currently closed for Review, please refresh the screen";
        }

        if (
          monitorErrors.some(
            error => error.errorName === MpEntityError.wgNotOpen
          )
        ) {
          return "The Group is currently Under Review, please refresh the screen";
        }
      }
    }

    return "An unexpected error occured, your changes were not saved. Please try again.";
  }

  rollback(): void {
    let pendingChanges = this.manager.getChanges();
    this.manager.rejectChanges();
    // UnitOfWork.savedOrRejectedSubject.next({
    //     entities: pendingChanges,
    //     rejected: true
    // });
  }

  clear(): void {
    this._emProvider.clear(this.dataContext);
  }

  // shelve(key: string, clear: boolean = false): void {
  //     let data = this.manager.exportEntities(null, { asString: false, includeMetadata: false });
  //     UnitOfWork.shelveSets[key] = data;
  //     if (clear) {
  //         this._emProvider.reset(this.manager);
  //     }
  // }

  // unshelve(key: string, clear: boolean = true): boolean {
  //     let data = UnitOfWork.shelveSets[key];
  //     if (!data) {
  //         return false;
  //     }

  //     if (clear) {
  //         // Clear the entity manager and don't bother importing lookup data from masterManager.
  //         this.manager.clear();
  //     }
  //     this.manager.importEntities(data);

  //     // Delete the shelveSet
  //     delete UnitOfWork.shelveSets[key];
  //     return true;
  // }

  // protected createRepository<T>(entityTypeName: string, resourceName: string, isCached: boolean = false) {
  //     return new Repository<T>(this.manager, entityTypeName, resourceName, isCached);
  // }

  // protected createFactory<T extends Entity>(type: { new (): T; }) {
  //     //return new EntityFactory<T>(type, this.manager);
  //     return null;
  // }
}
