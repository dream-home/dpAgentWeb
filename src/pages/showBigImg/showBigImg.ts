import { Component } from '@angular/core';

import { ModalController,ViewController ,NavParams } from 'ionic-angular';


@Component({
  selector: 'page-showBigImg',
  templateUrl: 'showBigImg.html'
})
export class ShowBigImgPage {
     index:number;
     imgs:any=[];//图片数组
  constructor(public modalCtrl: ModalController,public viewCtrl: ViewController,public params: NavParams) {
 /*  this.title=this.params.get('title');*/
 	
 	this.imgs=this.params.get('imgs');
     this.index=this.params.get('index');
  }
	 dismiss() {
	   this.viewCtrl.dismiss();
	 }

}
