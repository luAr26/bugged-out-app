import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseConfigService } from '../../core/service/firebase-config.service';
import { Bug } from '../model/bug';


@Injectable()
export class BugService{
  private bugsDbRef = this.fire.database.ref('/bugs');

  constructor(private fire: FirebaseConfigService) {}

  getAddedBugs(): Observable<any> {
    return Observable.create(obs => {
      this.bugsDbRef.on('child_added', bug => {
        const newBug = bug.val() as Bug;
        newBug.id = bug.key;
        obs.next(newBug);
      }, err => {obs.throw(err);});  
    });
  }

  changedListener(): Observable<any> {
    return Observable.create(obs => {
      this.bugsDbRef.on('child_changed', bug => {
        const updatedBug = bug.val() as Bug;
        updatedBug.id = bug.key;
        obs.next(updatedBug);
      }, err => {obs.throw(err);});
    });
  }

  addBug(bug: Bug) {
    const newBugRef = this.bugsDbRef.push();
    newBugRef.set({
      title: bug.title,
      status: bug.status,
      severity: bug.severity,
      description: bug.description,
      createdBy: 'Jess',
      createdDate: Date.now()
    }).catch(err => console.error('Unable to add bug to the firebase - ', err));
  }

  updateBug(bug: Bug) {
    const currentBugRef = this.bugsDbRef.child(bug.id);
    bug.id = null;
    bug.updatedBy = 'Tom Tickle';
    bug.updatedDate = Date.now();
    currentBugRef.update(bug);
  }
}