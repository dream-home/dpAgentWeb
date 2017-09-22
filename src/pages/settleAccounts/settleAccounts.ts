import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
  import { HomePage } from '../home/home';
@Component({
  selector: 'page-settleAccounts',
  templateUrl: 'settleAccounts.html'
})
export class SettleAccountsPage {
        showScroll: boolean;
       pageNo: number;
       show:boolean=true;//显示提醒
       items:any;//
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){
         this.pageNo = 1;
        this.showScroll = true;
        this.loadData();
    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/wallet/getAgentPerformance',
            data:{
                pageNo:1,
                pageSize:10
            }
        }).then(data=>{
            if(data.code==200){
                this.items =data.result.rows;
                 if(this.pageNo<=data.result.totalPage){
                        this.show=false;
                    }
            }else{
                if (data.code!=4) {
                           this.commonService.alert("系统提示",data.msg);
                        }
                if (data.code==2) {
                          this.navCtrl.push(HomePage);
                        }
            }
        });
    }

      // 分页
    doInfinite(infiniteScroll) {
        if(this.show){
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpGet({
                 url:this.commonService.baseUrl+'/store/getStoreList',
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
                    if(this.pageNo<=data.result.totalPage){
                        this.show=false;
                    }
                }else{
                    this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                          this.navCtrl.push(HomePage);
                        }
                }
            });
        }, 500);

        }else{

           this.showScroll=false;
           return;
        }
    }
}
