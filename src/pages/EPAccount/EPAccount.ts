import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { EPGivePage } from '../EPGive/EPGive';

@Component({
    selector: 'page-EPAccount',
    templateUrl: 'EPAccount.html'
})
export class EPAccountPage {

    infos:any;
    items:any;
    showScroll: boolean;
    pageNo: number;
    show:boolean=true;//显示提醒
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
       this.loadDate2();
       this.loadData();
       this.pageNo = 1;
       this.showScroll = true;
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //跳转到EP赠送页面
    gotoEPGivePage(){
        this.navCtrl.push(EPGivePage,{EPScore:this.infos.exchangeEP});
    }

    //获取代理商信息
    loadDate2(){
        this.commonService.httpGet({
                url:this.commonService.baseUrl+'/agentInfo/getInfo',
                data:{
                    token:this.commonService.token
                }
            }).then(data=>{
                if(data.code==200){
                  this.infos=data.result;
                }else{
                    this.commonService.alert("系统提示",data.msg);

                }
            });
        }


     loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/ep/getEpSendList',
            data:{
                pageNo:1,
                pageSize:10
            }
        }).then(data=>{
            if(data.code==200){
                this.items =data.result.rows;
                 if(this.pageNo==data.result.totalPage){
                        this.show=false;
                    }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

      // 分页
    doInfinite(infiniteScroll) {
        if(this.show){
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpGet({
                 url:this.commonService.baseUrl+'/ep/getEpSendList',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.commonService.pageSize
                }
            }).then(data=>{
                infiniteScroll.complete();
                if(data.code==200){
                    let tdata = data.result.rows;
                   // this.showScroll =(eval(tdata).length==this.commonService.pageSize);
                    for(var o in tdata){
                        this.items.push(tdata[o]);
                    }
                    if(this.pageNo==data.result.totalPage){
                        this.show=false;
                    }
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }, 500);

        }else{

           this.showScroll=false;
           return;
        }
    }

}
