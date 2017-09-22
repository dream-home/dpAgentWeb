import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController} from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-areaCount',
  templateUrl: 'areaCount.html'
})
export class AreaCountPage {
    public areaInfo:any;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.loadData();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //获取区域统计的信息
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/wallet/RangeStatistics',
            data:{
                agentId:this.commonService.user.agentId
            }
        }).then(data=>{
            if(data.code=='200'){
                this.areaInfo = data.result;

            }else{
                this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
            }
        });
    }
}
