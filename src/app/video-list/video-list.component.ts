import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RecordService } from '../services/record-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css'],
  providers: [DatePipe]
})
export class VideoListComponent implements OnInit, OnDestroy {
  @Input() scrollable = true
  constructor(public recordService :RecordService){recordService.getRecords()}
  ngOnInit(): void {
    if(this.scrollable){window.addEventListener('scroll', this.handleScroll)}
  }
  ngOnDestroy(): void {
    if(this.scrollable){ window.removeEventListener( 'scroll' ,this.handleScroll)}
    this.recordService.pageRecords = []
  }
  handleScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement
    const {innerHeight} = window

    const bottomOfWindow = Math.round(scrollTop + innerHeight) === Math.round(offsetHeight)

    if(bottomOfWindow){
    this.recordService.getRecords();
    }
  }
}
