import { Component } from '@angular/core';

import {ViewController ,NavParams } from 'ionic-angular';


@Component({
  selector: 'page-inputPage',
  templateUrl: 'inputPage.html'
})
export class InputPagePage {
  public title:string;
  public reason:string="";
  public show:boolean;
  constructor(public viewCtrl: ViewController,public params: NavParams) {
   this.title=this.params.get('title');
  }
	   dismissSure() {
	   	if(this.reason.length<10){
	   		this.show=true;
	   	}else{
	   		this.show=false;
	   		let data = { 'conter':this.reason};
	   		this.viewCtrl.dismiss(data);
	   	}
	   
	 }
	 dismiss() {
	   let data = { 'conter':""};
	   this.viewCtrl.dismiss(data);
	 }

}
