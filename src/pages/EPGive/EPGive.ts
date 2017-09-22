import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';

@Component({
  selector: 'page-EPGive',
  templateUrl: 'EPGive.html'
})
export class EPGivePage {

    userAccount:string;//赠送的用户帐号
    showName:string;//赠送时显示对方的名字
    submitBoolean:boolean = false;
    sendNumber:number;//赠送数量
    sendPwd:string;//操作密码
    EPScore:number;//EP总数量
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.EPScore = this.navParams.get('EPScore');
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //检索赠送用户
    checkUser(){
        this.commonService.httpGet({
             url:this.commonService.baseUrl+'/ep/getNameById',
            data:{
                id:this.userAccount
            }
        }).then(data=>{
            if(data.code==200){
                this.showName = data.result;
                this.submitBoolean = true;
            }else{
                this.showName = data.msg;
            }
        });
    }

    //提交赠送
    submitData(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/ep/epPresented',
                data:{
                    epCount:this.sendNumber,
                    id:this.userAccount,
                    password:this.sendPwd
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("EP转赠成功");
                    this.navCtrl.pop();
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    //重置输入框
    reset(){
        this.userAccount = '';//用户帐号
        this.sendNumber = null;//赠送数量
        this.sendPwd = '';//操作密码
        this.showName = '';//显示赠送者用户名
    }

    //验证
    validator(){
        if(!this.submitBoolean){
            this.commonService.toast("用户帐号输入错误");
            return false;
        }
        if(!(/^[A-Za-z0-9]+$/).test(this.userAccount)){
            this.commonService.toast("用户帐号输入格式错误");
            return false;
        }
        if(this.userAccount == null || this.userAccount == ''){
            this.commonService.toast("用户帐号不能为空");
            return false;
        }
        if(this.EPScore < this.sendNumber){
            this.commonService.toast("EP数量不足，请重新填写转赠数量");
            return false;
        }
        if(this.sendNumber > 999999){
            this.commonService.toast("转赠数量不能大于999999");
            return false;
        }
        if(!(/^[0-9]*[1-9][0-9]*$/).test(this.sendNumber+'') || this.sendNumber == 0){
            this.commonService.toast("转赠数量必须是大于0的正整数");
            return false;
        }
        if(this.sendNumber == null){
            this.commonService.toast("转赠数量不能为空");
            return false;
        }
        if(this.sendPwd == null || this.sendPwd == ''){
            this.commonService.toast("操作密码不能为空");
            return false;
        }
        return true;
    }
}
