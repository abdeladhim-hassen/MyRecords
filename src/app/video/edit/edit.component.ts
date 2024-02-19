import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import IRecord from 'src/app/models/Record';
import { ModalService } from 'src/app/services/modal.service';
import { RecordService } from 'src/app/services/record-service.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  @Input() activeRecord: IRecord | null = null
 inSubmission = false
 showAlert = false
 alertColor = 'blue'
 alertMsg = 'Please wait! Updating record.'
 @Output() update = new EventEmitter()

 ID = new FormControl<string>('', [Validators.required])
 Title = new FormControl<string>('',[Validators.required,Validators.minLength(5)])
  FileUploaderEdit = new FormGroup(
    {
    Title: this.Title,
    Id: this.ID
    }
  )
  
 constructor(
   private modal: ModalService, 
   private recordService: RecordService
 ) { }

 ngOnInit(): void {
   this.modal.Register('EditRecord')
 }

 ngOnDestroy() {
   this.modal.UnRegister('EditRecord')
 }

 ngOnChanges() {
   if(!this.activeRecord) {
     return
   }

   this.inSubmission = false
   this.showAlert = false
   this.ID.setValue(this.activeRecord.docID as string)
   this.Title.setValue(this.activeRecord.title)
 }

 async submit() {
  if (!this.activeRecord) {
    return;
  }

  this.inSubmission = true;
  this.showAlert = true;
  this.alertColor = 'blue';
  this.alertMsg = 'Please wait! Updating record.';

  try {
  if (this.ID.value === null || this.Title.value == null ) {
    return
  }
    await this.recordService.updateRecord(this.ID.value, this.Title.value);
  } catch (e) {
    this.inSubmission = false;
    this.alertColor = 'red';
    this.alertMsg = 'Something went wrong. Try again later';
    return;
  }

  this.activeRecord.title = this.Title.value;
  this.update.emit(this.activeRecord);

  this.inSubmission = false;
  this.alertColor = 'green';
  this.alertMsg = 'Success!';
}

}