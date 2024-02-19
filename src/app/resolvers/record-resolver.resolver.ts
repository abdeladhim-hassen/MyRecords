import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import IRecord from '../models/Record';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecordResolver implements Resolve<IRecord | null> {
  constructor(private db: AngularFirestore,
             private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IRecord | null> {
    const id = route.params['id'];
    return this.db.collection<IRecord>('Records').doc(id)
    .get()
    .pipe(
      map(snapshot => {
        const data = snapshot.data()

        if(!data) {
          this.router.navigate(['/'])
          return null
        }

        return data
      })
    )
  }
}
