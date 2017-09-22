import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-forgetPassword',
  templateUrl: 'forgetPassword.html'
})
export class ForgetPasswordPage {
    public title:number;//标题
    public phone:string;//手机号
    public oldLoginPwd:string;//原来的密码
    public newLoginPass:string;//新密码
    public newLoginPassConfirm:string;//确认新密码
    public smsCode:string;//验证码
    picCode:string;
    strImg:string;//图片验证码
    key:string;//图片验证码的key

    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){
        this.title=this.navParams.get("title");

    }

    /*页面事件*/
    ionViewWillEnter(){
        if(this.title==2){
            this.loadData();
        }
    }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

     /*获取图片验证码*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/common/forgetLoginPic',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.strImg = data.result.picCode;
                this.key = data.result.key;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    //获取短信验证码
    getSmsCode(){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/common/forgetLoginSmsCode',
            data:{
                key:this.key,
                phone:this.phone,
                picCode:this.picCode
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.toast("短信验证码已经发送到手机");
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    //验证修改密码
     validator1(){

        if(!this.oldLoginPwd || this.oldLoginPwd == ''){
            this.commonService.toast("旧密码不能为空");
            return false;
        }
        if(!this.newLoginPass || this.newLoginPass == ''){
            this.commonService.toast("新密码不能为空");
            return false;
        }
        if(!this.newLoginPassConfirm || this.newLoginPassConfirm == ''){
            this.commonService.toast("确认密码不能为空");
            return false;
        }
        if(!(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,20}$/.test(this.newLoginPass))){

              this.commonService.toast("密码6-20位，数字、英文、半角符号（至少两种组合，除空格）");
                return false;
        }
        if(this.newLoginPassConfirm!=this.newLoginPass){
            this.commonService.toast("两次密码不一致，请重输");
            return false;
        }
        return true;
    }

     //验证忘记密码
     validator2(){
        if(!this.phone || this.phone == ''){
           this.commonService.toast("手机号码不能为空");
           return false;
        }
        if(!(/0?(1)[0-9]{10}/).test(this.phone)){
            this.commonService.toast("手机号码不存在");
            return false;
        }
        if(!this.newLoginPass || this.newLoginPass == ''){
            this.commonService.toast("新密码不能为空");
            return false;
        }
        if(!this.newLoginPassConfirm || this.newLoginPassConfirm == ''){
            this.commonService.toast("确认密码不能为空");
            return false;
        }
        if(!(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,20}$/.test(this.newLoginPass))){

              this.commonService.toast("密码6-20位，数字、英文、半角符号（至少两种组合，除空格）");
                return false;
        }
        if(this.newLoginPassConfirm!=this.newLoginPass){
            this.commonService.toast("两次密码不一致，请重输");
            return false;
        }
         if(!(/^[0-9a-zA-Z]{4}$/.test(this.picCode))){
            this.commonService.toast("图片验证码输入有误，请重填");
            return false;
        }
        if(!this.smsCode || this.smsCode == ''){
            this.commonService.toast("短信验证码不能为空");
            return false;
        }
        return true;
    }

    //确定
    surePsw(){
        if(this.title==1){
            if(this.validator1()){
               //修改登录密码
                this.commonService.httpPost({
                    url:this.commonService.baseUrl+'/agentInfo/change/loginPwd',
                    data:{
                        newLoginPwd:this.newLoginPass,
                        newLoginPwdConfirm:this.newLoginPassConfirm,
                        oldLoginPwd:this.oldLoginPwd
                    }
                }).then(data=>{
                    if(data.code==200){
                        let str="修改密码成功，请重新登录!";
                        this.exitLogin(str);

                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
            }
        }
         if(this.title==2){
             if(this.validator2()){
               //忘记登录密码
                this.commonService.httpPost({
                    url:this.commonService.baseUrl+'/agentInfo/forget/loginPassword',
                    data:{
                        newPayPass:this.newLoginPass,
                        newPayPassConfirm:this.newLoginPassConfirm,
                        phone:this.phone,
                        smsCode:this.smsCode
                    }
                }).then(data=>{
                    if(data.code==200){
                        let str="找回密码成功，请重新登录!";
                        this.exitLogin(str);

                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
            }
        }
    }

   //重置
   reset(){
       this.phone="";//手机号
       this.oldLoginPwd="";//原来的密码
       this.newLoginPass="";//新密码
       this.newLoginPassConfirm="";//确认新密码
       this.smsCode="";//验证码
       this.picCode="";
   }

    /*退出登陆*/
    exitLogin(str){
        this.commonService.token = null;
        this.commonService.count = 0;
        localStorage.removeItem("token");
        localStorage.clear();
        sessionStorage.clear();
        this.commonService.alert("系统提示",str);
        this.navCtrl.push(LoginPage);
    }
}
