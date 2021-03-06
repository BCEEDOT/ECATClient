import { Injectable } from '@angular/core';
import { EntityManager, Entity, EntityQuery, FetchStrategy, SaveOptions, EntityChangedEventArgs } from 'breeze-client';
import { Subject } from 'rxjs/Subject';

import { EmProviderService } from '../../core/services/em-provider.service';
import { DataContext } from '../../app-constants';


@Injectable()
export class BaseDataContext {

    private static shelveSets = {};
    //private static savedOrRejectedSubject = new Subject<SavedOrRejectedArgs>();

    private _manager: EntityManager;

    private entityChangedSubject: Subject<EntityChangedEventArgs>;

    constructor(private dataContext: DataContext, private _emProvider: EmProviderService) {
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

    static get savedOrRejected() {
        //return UnitOfWork.savedOrRejectedSubject.asObservable();
        return null;
    }

    //modify has changes so that it checks against all managers?
    hasChanges(): boolean {
        return this.manager.hasChanges();
    }

    // hasChangesChanged(): Observable<any> {
    //     return this.manager.hasChangesChanged.subscribe(eventArgs => {
    //         var data = {hasChanges: eventArgs.hasChanges}
    //     })
    // }

    getChanges(): Entity[] {
        return this.manager.getChanges();
    }

    //This is save changes
    commit(): Promise<any> {
        let saveOptions = new SaveOptions({ resourceName: 'savechanges' });

        return <any>this.manager.saveChanges(null, saveOptions)
            .then((saveResult) => {
                // UnitOfWork.savedOrRejectedSubject.next({
                //     entities: saveResult.entities,
                //     rejected: false
                // });

                return saveResult.entities;
            });
    }

    rollback(): void {
        let pendingChanges = this.manager.getChanges();
        this.manager.rejectChanges();
        // UnitOfWork.savedOrRejectedSubject.next({
        //     entities: pendingChanges,
        //     rejected: true
        // });
    }

    // clear(): void {
    //     this._emProvider.reset(this.manager);
    // }

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