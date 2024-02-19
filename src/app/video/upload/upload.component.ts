import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, forkJoin, last, switchMap } from 'rxjs';
import {v4 as uuid} from 'uuid'
import firebase from 'firebase/compat/app'
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RecordService } from 'src/app/services/record-service.service';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import IRecord from 'src/app/models/Record';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  isDragOver = false
  file: File | null = null
  nextStep = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Your record is being uploaded.'
  inSubmission = false
  percentage = 0
  showPercentage = false
  task?: AngularFireUploadTask
  user: firebase.User | null = null
  screenshots: string[] = []
  selectedScreenshot = ''
  screenshotTask?: AngularFireUploadTask

  Title = new FormControl<string>('',[Validators.required,Validators.minLength(5)])
  FileUploaderForm = new FormGroup(
    {
    Title: this.Title,
    }
  )
  constructor(private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private recordService: RecordService,
    private router: Router,
    public ffmpegService: FfmpegService){ 
      auth.user.subscribe(user => this.user = user)
      ffmpegService.load()
    }
    ngOnDestroy(): void {
      this.task?.cancel()
    }


    async storeFile($event: Event) {
      if(this.ffmpegService.isRunning) {
        return
      }
    
      this.isDragOver = false
    
      this.file = ($event as DragEvent).dataTransfer ?
        ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
        ($event.target as HTMLInputElement).files?.item(0) ?? null
    
      if(!this.file || this.file.type !== 'video/mp4') {
        return
      }
    
      this.screenshots = await this.ffmpegService.getScreenshots(this.file)
    
      this.selectedScreenshot = this.screenshots[0]
    
      this.Title.setValue(
        this.file.name.replace(/\.[^/.]+$/, '')
      )
      this.nextStep = true
    }

    
    
    async uploadFile() {
      this.FileUploaderForm.disable()
    
      this.showAlert = true
      this.alertColor = 'blue'
      this.alertMsg = 'Please wait! Your video is being uploaded.'
      this.inSubmission = true
      this.showPercentage = true
    
      const FileName = uuid() 
      const FilePath = `records/${FileName}.mp4`
    
      const screenshotBlob = await this.ffmpegService.blobFromURL(
        this.selectedScreenshot
      )
      const screenshotPath = `screenshots/${FileName}.png`
    
      this.task = this.storage.upload(FilePath, this.file)
      const fileRef = this.storage.ref(FilePath)
    
      this.screenshotTask = this.storage.upload(
        screenshotPath, screenshotBlob
      )
      const screenshotRef = this.storage.ref(screenshotPath)
    
      combineLatest([
        this.task.percentageChanges(),
        this.screenshotTask.percentageChanges()
      ]).subscribe((progress) => {
        const [fileProgress, screenshotProgress] = progress
    
        if(!fileProgress || !screenshotProgress) {
          return
        }
    
        const total = fileProgress + screenshotProgress
    
        this.percentage = total as number / 200
      })
    
      forkJoin([
        this.task.snapshotChanges(),
        this.screenshotTask.snapshotChanges()
      ]).pipe(
        switchMap(() => forkJoin([
          fileRef.getDownloadURL(),
          screenshotRef.getDownloadURL()
        ]))
      ).subscribe({
        next: async (urls) => {
          const [fileUrl, screenshotURL] = urls
    
          const NewFileRecord = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.Title.value,
            fileName: `${FileName}.mp4`,
            url: fileUrl,
            screenshotURL,
            screenshotFileName: `${FileName}.png`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }
    
          const fileDocRef = await this.recordService.createRecord(NewFileRecord as IRecord)
    
          console.log(NewFileRecord)
    
          this.alertColor = 'green'
          this.alertMsg = 'Success! Your video is now ready to share with the world.'
          this.showPercentage = false
    
          setTimeout(() => {
            this.router.navigate([
              'record', fileDocRef.id
            ])
          }, 1000)
        },
        error: (error) => {
          this.FileUploaderForm.enable()
    
          this.alertColor = 'red'
          this.alertMsg = 'Upload failed! Please try again later.'
          this.inSubmission = true
          this.showPercentage = false
          console.error(error)
        }
      })
    }
  



 
  
}

