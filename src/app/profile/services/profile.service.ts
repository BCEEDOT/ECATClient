import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EmProviderService } from "../../core/services/em-provider.service";
import { Entity, EntityQuery, EntityManager, Predicate, FilterQueryOp } from "breeze-client";

import { ProfileStudent, CognitiveRegistrationHelper } from "../../core/entities/user";


@Injectable()
export class ProfileService {

  em: EntityManager;
  profile: ProfileStudent;

  constructor(private regHelper: CognitiveRegistrationHelper, private emProvider: EmProviderService) {
    this.em = this.emProvider.getManager();
    var profileType = this.em.metadataStore.getEntityType('ProfileStudent');
    console.log(profileType);
    console.log(this.getProfile());
    
    //this.getUsers().then(res => console.log(res));
  }

  getProfile(): Promise<ProfileStudent> {

    var profileType = this.em.metadataStore.getEntityType('ProfileStudent');
    
    let query = EntityQuery.from('user').where('studentId', '=', '2').toType('Students');

    return <Promise<ProfileStudent>>this.em.executeQuery(query)
      .then(res => res.results[0] as ProfileStudent)
      .catch(e => {
        console.log('Did not retrieve users' + e);
        return Promise.reject(e);
      });
  }
}
