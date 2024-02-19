import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app'
@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {
  constructor(private datePipe: DatePipe){}

  transform(value: firebase.firestore.FieldValue | undefined) {
    const date = (value as firebase.firestore.Timestamp).toDate()
    
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm')

  }

}
