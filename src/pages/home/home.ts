import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { EPAccountPage } from '../EPAccount/EPAccount';
import { EmployeeListPage } from '../employeeList/employeeList';
import { ForgetPasswordPage } from '../forgetPassword/forgetPassword';
import { SellermanagePage } from '../sellermanage/sellermanage';
import { BusinessImgReviewPage } from '../businessImgReview/businessImgReview';
import { SettleAccountsPage } from '../settleAccounts/settleAccounts';
import { EssentialInforPage } from '../essentialInfor/essentialInfor';
import { AreaCountPage } from '../areaCount/areaCount';
import { LoginPage } from '../login/login';
import { BusinessListPage } from '../businessList/businessList';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    public nowDate:any;
    public photoCount:number=0;//待审核图片
    public shopCount:number=0;//待审核商铺
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){

    }
    /*页面事件*/
    ionViewWillEnter(){
        this.getPermission();
      this.nowDate=new Date();
        this.loadDate();
    }

    //获取当前账号的权限列表
    getPermission(){
        this.commonService.httpGet({
                url:this.commonService.baseUrl+'/agentInfo/permission',
                data:{

                }
            }).then(data=>{
                if(data.code==200){
                   //员工
                   if(data.result.IsStaff){
                    //员工
                     this.set2();
                      let num=data.result.Permission.length;
                            for (var i =0; i<num; i++) {
                                let n=data.result.Permission[i];
                                this.commonService.permission[n]=true;

                            }

                   }else{//老板
                        this.set();

                   }
                   //console.log(this.commonService.permission);
                }
            });

    }

    //跳转到EP账户页面
    gotoEPAccountPage(){
        this.navCtrl.push(EPAccountPage);
    }

    //跳转到员工列表页面
    gotoEmployeeListPage(){
        this.navCtrl.push(EmployeeListPage);
    }

    //跳转到设置密码页面
    gotoForgetPasswordPage(){
        this.navCtrl.push(ForgetPasswordPage,{title:1});
    }

    //跳转到商家管理页面
    gotoSellermanagePage(){
        if(this.commonService.permission[3]){
            this.navCtrl.push(SellermanagePage);
        }else{
            if(this.commonService.permission[5]){
                 this.navCtrl.push(BusinessListPage);
            }
        }

         //this.navCtrl.push(BusinessListPage);

    }

    //跳转到商家图片审核
    gotoBusinessImgReviewPage(){
         this.navCtrl.push(BusinessImgReviewPage);
    }

    //跳转到业绩结算页面
    gotoSettleAccountsPage(){
        this.navCtrl.push(SettleAccountsPage);
    }

    //跳转到基本信息页面
    gotoEssentialInforPage(){
        this.navCtrl.push(EssentialInforPage);
    }

    //跳转到区域统计页面
    gotoAreaCountPage(){
        this.navCtrl.push(AreaCountPage);
    }

    //获取待审核的消息
    loadDate(){
        this.commonService.httpGet({
                url:this.commonService.baseUrl+'/message/messageCount',
                data:{
                    agentId:this.commonService.user.agentId
                }
            }).then(data=>{
                if(data.code==200){
                  this.photoCount=data.result.photoCount;
                  this.shopCount=data.result.shopCount;
                }
            });
        }


    /*退出登陆*/
    exitLogin(){
        if(!this.commonService.token){
            this.navCtrl.push(LoginPage);
        }else{
            this.commonService.httpPost({
                 url:this.commonService.baseUrl+'/agentInfo/loginOut',
                 data:{
                 }
             }).then(data=>{
                 if(data.code==200){
                   this.commonService.token = null;
                    // this.commonService.user.agentId = null;
                     this.commonService.count = 0;
                     //localStorage.removeItem("token");
                     localStorage.removeItem("person")
                     localStorage.clear();
                     sessionStorage.clear();
                     this.commonService.alert("系统提示","您已成功退出当前账号!");
                     this.navCtrl.push(LoginPage);
                 }else if(data.code==-1 || data.code==0){
                     this.navCtrl.push(LoginPage);
                 }else{
                     this.commonService.alert("系统提示",data.msg);
                 }
             });
        };



    }

     //判断当前用户有什么权限，根据权限限制访问页面

    set(){
     this.commonService.permission=[true,true,true,true,true,true,true,true,];
    }
    set2(){
    this.commonService.permission=[false,false,false,false,false,false,false,false,];
    }

}
