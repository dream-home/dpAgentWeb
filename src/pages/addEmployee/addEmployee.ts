import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
@Component({

  selector: 'page-addEmployee',
  templateUrl: 'addEmployee.html'
})
export class AddEmployeePage {
    type:number;//判断是添加还是查看
    staffAccount:string="";//账号
    staffName:string="";//用户名
    staffPassword1:string;//登录密码
    staffPassword2:string;//确认密码
    permission:any=[];//权限列表
    selectorPermission:any=[];//默认一开始所有权限未选的状态列表

    infos:any="";
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){
       // console.log(this.ziliao);
       this.infos=this.commonService.user;
       this.getPermission();

    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    toggleTodoState(index){
     this.selectorPermission[index]=!this.selectorPermission[index];

    }

    //获取权限列表
    getPermission(){
         this.commonService.httpGet({
                url:this.commonService.baseUrl+'/staff/permission',
                data:{
                }
            }).then(data=>{
                if(data.code==200){
                    this.permission=data.result;

                     let num=this.permission.length;

                       for (var i = 0; i < num; i++) {
                           this.selectorPermission.push(false);
                       }


                }else{
                    this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
                }
            });
    }

    //
    validator(){
      if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(this.staffAccount))){
            this.commonService.toast("账户输入格式错误(6-12位，由数字和字母组成)");
            return false;
        }
        if(!this.staffName || this.staffName == ''){
            this.commonService.toast("员工姓名不能为空");
            return false;
        }
         if(this.staffName.length>6){
                 this.commonService.toast("员工姓名不能超过6个字");
                 return false;
            }
        if(!this.staffPassword1 || this.staffPassword1 == ''){
            this.commonService.toast("密码不能为空");
            return false;
        }


        if(!(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,20}$/.test(this.staffPassword1))){

              this.commonService.toast("密码6-20位，数字、英文、半角符号（至少两种组合，除空格）");
                return false;
        }

        /*if(!(/^[^\s]{6,20}$/.test(this.staffPassword1))){

              this.commonService.toast("密码6-20位，数字、英文、半角符号（至少两种组合）");
                return false;
        }


        if((/[^\x00-\xff]/ig.test(this.staffPassword1))){
                 this.commonService.toast("密码只能是6-20位，不能包含空格、汉字、中文符号哦");
                return false;
            }*/

       if(this.staffPassword2!=this.staffPassword1){
            this.commonService.toast("两次密码不一致");
            return false;
        }
        return true;
    }

    add(){
        if(this.validator()){

             let permissionIds=[];
             for(var i=0;i<this.selectorPermission.length;i++){
                if(this.selectorPermission[i]){
                    permissionIds.push(
                        {"permissionId":this.permission[i].permissionId}
                        );
                }
             }

             this.commonService.httpPost({
                url:this.commonService.baseUrl+'/staff/add',
                data:{
                    agentId:this.infos.agentId,
                    permission:permissionIds,
                    staffAccount:this.staffAccount,
                    staffName:this.staffName,
                    staffPassword:this.staffPassword1
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("添加员工成功");
                       this.goToBackPage();
                }else{
                    this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
                }
            });
        }
    }

    reset(){
         this.staffAccount="";//账号
        this.staffName="";//用户名
        this.staffPassword1="";//登录密码
        this.staffPassword2="";//确认密码

        for (var i = this.selectorPermission.length - 1; i >= 0; i--) {
            this.selectorPermission[i]=false;
        }
    }
}
