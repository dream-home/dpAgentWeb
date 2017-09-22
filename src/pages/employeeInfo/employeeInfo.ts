import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({

  selector: 'page-employeeInfo',
  templateUrl: 'employeeInfo.html'
})
export class EmployeeInfoPage {
    staffInfo:any;//员工信息
    staffId:string;//员工编号
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){

      this.staffId=this.navParams.get("staffId");
      this.getStaffInfo();
    }

     /*获取员工信息*/
    getStaffInfo(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/staff/info',
            data:{
                staffId:this.staffId
            }
        }).then(data=>{
            if(data.code=='200'){
                this.staffInfo = data.result[0];

            }else{
                this.commonService.alert("系统提示",data.msg);
                if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
            }
        });
    }
    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
}
