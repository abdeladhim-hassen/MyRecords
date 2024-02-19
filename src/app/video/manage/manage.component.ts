import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IRecord from 'src/app/models/Record';
import { ModalService } from 'src/app/services/modal.service';
import { RecordService } from 'src/app/services/record-service.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent  implements OnInit{
  OrderBy = '1'
  sort$: BehaviorSubject<string>
  records: IRecord[] = []
  activeRecord: IRecord | null = null
  constructor(private router: Router,
    private route: ActivatedRoute,
    private recordservice: RecordService,
    private modal: ModalService){
      this.sort$ = new BehaviorSubject(this.OrderBy)
    }
ngOnInit(): void {
  this.route.queryParams.subscribe((Params: Params) =>{
    this.OrderBy = Params['sort'] === '2'? Params['sort'] : '1'
    this.sort$.next(this.OrderBy)
  } )
  this.recordservice.getUserRecords(this.sort$).subscribe(docs => {
  this.records = []
  docs.forEach(doc => this.records.push(
    {docID: doc.id,
    ...doc.data()
   })
   )
  })
}

  sort(event: Event)
{
  const selectElement = event.target as HTMLSelectElement
  this.router.navigate(
    [],
    {
      relativeTo: this.route,
      queryParams: {sort: selectElement.value}
    }
  )
  //navigateByUrl(`/manage?sort=${selectElement.value}`)
}
openModal($event: Event, record: IRecord) {
  $event.preventDefault()

  this.activeRecord = record

  this.modal.ToggleModal('EditRecord')
}

update($event: IRecord) {
  this.records.forEach((element, index) => {
    if(element.docID == $event.docID) {
      this.records[index].title = $event.title
    }
  })
}

deleteRecord($event: Event, record: IRecord) {
  $event.preventDefault()

  this.recordservice.deleteRecord(record)

  this.records.forEach((element, index) => {
    if(element.docID == record.docID) {
      this.records.splice(index, 1)
    }
  })
}
 async CopyLink($event: Event, docID: string | undefined){
  $event.preventDefault()

  if(!docID) {
    return
  }

  const url = `${location.origin}/record/${docID}`

  await navigator.clipboard.writeText(url)

  alert('Link Copied!')
}
}
