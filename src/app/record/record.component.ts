import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import IRecord from '../models/Record';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers:[DatePipe]
})

export class RecordComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef
  player?: Player
  record?: IRecord

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement)

    this.route.data.subscribe(data => {
      this.record = data['record'] as IRecord

      this.player?.src({
        src: this.record.url,
        type: 'video/mp4'
      })
    })
  }
}
