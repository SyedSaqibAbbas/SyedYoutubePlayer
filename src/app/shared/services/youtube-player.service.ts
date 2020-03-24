import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from './notification.service';
import { BrowserNotificationService } from './browser-notification.service';

let _window: any = window;

@Injectable()
export class YoutubePlayerService {
  public yt_player:any;
  public YT: any;
  private currentVideoId: string;

  @Output() videoChangeEvent: EventEmitter<any> = new EventEmitter(true);
  @Output() playPauseEvent: EventEmitter<any> = new EventEmitter(true);
  @Output() currentVideoText: EventEmitter<any> = new EventEmitter(true);

  constructor(
    public notificationService: NotificationService,
    public browserNotification: BrowserNotificationService
  ) { }

  createPlayer(): void {

    _window['onYouTubeIframeAPIReady'] = (evt) => {
      this.YT = _window['YT'];
  
      this.yt_player = new _window['YT'].Player('yt-player', {
        width: '440',
        height: '250',
        playerVars: {
          iv_load_policy: '3',
          rel: '0'
        },
        events: {
         
          // onReady:  (evt) =>{

          //   evt.target.playVideo();
          
          //   //declare the click even function you want
          //   const button = document.querySelector('mdl-button mdl-js-button mdl-button--icon play')
          
          //   button.addEventListener('click', () => {
          //     //get a data-video-id attr from the <a data-video-id="XXXXXX">
          //     // const myVideo = $(this).attr('data-video-id');
          //     const myVideo = button.getAttribute('data-video-id');
            
          //     //call your custom function
          // 
          //     this.yt_player.loadVideoById(myVideo);
            
          //     //prevent click propagation 
          //     return false;
          //   })
          // },
          
          onReady :   (ev)=>  {
            ev.target.setVolume(100);
            ev.target.playVideo();
          },
          onStateChange: (ev) => {
            this.onPlayerStateChange(ev);
          }
        }
      });
  
    }






    // let interval = setInterval(() => {
    //   if ((typeof _window.YT !== 'undefined') && _window.YT && _window.YT.Player) {
        
    //     clearInterval(interval);
    //   }
    // }, 100);
  }

  onPlayerStateChange(event: any) {
    const state = event.data;
    switch (state) {
      case 0:
        this.videoChangeEvent.emit(true);
        this.playPauseEvent.emit('pause');
        break;
      case 1:
        this.playPauseEvent.emit('play');
        break;
      case 2:
        this.playPauseEvent.emit('pause');
        break;
    }
  }

  playVideo(videoId: string, videoText?: string): void {
    if (!this.yt_player) {
      this.notificationService.showNotification('Player not ready.');
      return;
    }

    
    // this.yt_player.loadVideoById(videoId);
   // this.yt_player.loadVideoById(videoId);

    this.currentVideoId = videoId;
    this.currentVideoText.emit(videoText);
    this.browserNotification.show(videoText);
  }

  pausePlayingVideo(): void {
    this.yt_player.pauseVideo();
  }

  playPausedVideo(): void {
    this.yt_player.playVideo();
  }

  getCurrentVideo(): string {
    return this.currentVideoId;
  }

  resizePlayer(width: number, height: number) {
    this.yt_player.setSize(width, height);
  }

  getShuffled(index: number, max: number): number {
    if (max < 2) {
      return;
    }

    let i = Math.floor(Math.random() * max);
    return i !== index ? i : this.getShuffled(index, max);
  }
}
