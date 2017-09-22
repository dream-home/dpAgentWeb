import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ForgetPasswordPage } from '../forgetPassword/forgetPassword';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

    loginName:string;
    password:string;
    key:string="";
    picCode:string="";
    strImg:string;
    errorCount:number=-1;//错误次数
    save:boolean=false;
    index:number=1;//判断这是第几次登录，如果连续3次错误，第四次就要输入验证码

    personInfo:any= {
        loginNum:"",
        loginPwd:"",
        curtime:new Date().getTime()//获取当前时间
    };//用于保存登录信息
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
       // this.loadData();
       var str=localStorage.getItem("person");
             var s=JSON.parse(str);
             if(s!=null){
                //this.personInfo=s;
                 //console.log("是否保存信息"+this.personInfo.curtime);
                 let exp=1000*60*60*24*7;
                 if(new Date().getTime() - s.curtime > exp)//如果当前时间-减去存储的元素在创建时候设置的时间 > 过期时间
                    {
                      console.log("保存登录已经过期，请重新登录");//提示过期
                    }
                    else{

                        this.loginName=s.loginNum;
                        this.password=s.loginPwd;
                        console.log("没有过期啊没有过期");
                        this.loginCenter();
                    }
            }

    }

    //跳转到首页
    gotoHomePage(){
        this.navCtrl.push(HomePage);
    }

    //跳转到忘记密码页面
    gotoForgetPasswordPage(){
        this.navCtrl.push(ForgetPasswordPage,{title:2});
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

     /*登录*/
    loginIn(){
        if(this.validator()){
            this.loginCenter();
        }

    }

    loginCenter(){
        this.commonService.httpPost({
                url:this.commonService.baseUrl+'/agentInfo/login/loginIn',
                data:{
                    loginName:this.loginName,
                    password:this.password,
                    key:this.key,
                    picCode:this.picCode,
                    errorCount:this.errorCount
                }
            }).then(data=>{
                if(data.code==200){

                    this.commonService.token = data.result.token;
                    this.commonService.user = data.result;
                    this.commonService.toast("用户登录成功");
                    this.errorCount=data.result.errorCount;

                   localStorage.setItem("token", this.commonService.token);
                   if(this.save){
                        this.personInfo.loginNum=this.loginName;
                        this.personInfo.loginPwd=this.password;
                         var str=JSON.stringify(this.personInfo);
                     localStorage.setItem("person",str);
                   }
                    this.gotoHomePage();
                }else{

                    this.commonService.alert("系统提示",data.msg);
                    if(data.msg=="用户名或密码错误"){
                        this.index++;
                    }
                    if(this.index>3){
                        this.picCode ='';
                        this.loadData();
                    }

                }
            });
    }

    validator(){
        if(!(/^[A-Za-z0-9]+$/).test(this.loginName)){

            this.commonService.toast("用户名输入格式错误");
            return false;
        }
        if(!this.loginName || this.loginName == ''){
            this.commonService.toast("用户名不能为空");
            return false;
        }
        if(!this.password || this.password == ''){
            this.commonService.toast("密码不能为空");
            return false;
        }
        if(this.index>3){

            if(!(/^[0-9a-zA-Z]{4}$/.test(this.picCode))){
                this.commonService.toast("图片验证码输入有误，请重填");
                return false;
            }
        }
        return true;
    }



}
