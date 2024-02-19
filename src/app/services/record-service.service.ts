import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, combineLatest, firstValueFrom, last, map, of, switchMap } from 'rxjs';
import IRecord from '../models/Record';
import { promises } from 'dns';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  public RecordsCollection: AngularFirestoreCollection<IRecord>
  pageRecords: IRecord[] = []

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { 
    this.RecordsCollection = db.collection('Records')
  }

  createRecord(data: IRecord) : Promise<DocumentReference<IRecord>> {
    return this.RecordsCollection.add(data)
  }

  getUserRecords(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values
        
        if(!user) {
          return of([])
        }

        const query = this.RecordsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc'
        )

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IRecord>).docs)
    )
  }

  updateRecord(id: string, title: string) {
    return this.RecordsCollection.doc(id).update({
      title
    })
  }
  async getRecords(){
    let query = this.RecordsCollection.ref.orderBy(
      'timestamp', 'desc'
    ).limit(3)

    const { length } = this.pageRecords

    if(length) {
      const lastDocID = this.pageRecords[length - 1].docID
      const lastDoc = await firstValueFrom(
        this.RecordsCollection.doc(lastDocID).get()
      );
        

      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get()

    snapshot.forEach(doc => {
      this.pageRecords.push({
        docID: doc.id,
        ...doc.data()
      })
    })
  }
  async deleteRecord(record: IRecord) {
    const RecordRef = this.storage.ref(`records/${record.fileName}`)
    const screenshotRef = this.storage.ref(
      `screenshots/${record.screenshotFileName}`
    )
    await RecordRef.delete()
    await screenshotRef.delete()
    await this.RecordsCollection.doc(record.docID).delete()
  }
}
