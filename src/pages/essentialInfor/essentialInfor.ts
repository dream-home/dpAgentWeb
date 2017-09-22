import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-essentialInfor',
  templateUrl: 'essentialInfor.html'
})
export class EssentialInforPage {
    infos:any;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){
        this.loadDate2();
    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //获取代理商信息
    loadDate2(){
        this.commonService.httpGet({
                url:this.commonService.baseUrl+'/agentInfo/getInfo',
                data:{

                }
            }).then(data=>{
                if(data.code==200){
                  this.infos=data.result;
                }else{
                    this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                          this.navCtrl.push(HomePage);
                        }

                }
            });
        }

}
