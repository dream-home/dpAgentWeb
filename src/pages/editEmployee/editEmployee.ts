import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-editEmployee',
  templateUrl: 'editEmployee.html'
})
export class EditEmployeePage {
    staffInfo:any; /*员工信息*/
    permission:any=[];//权限列表
    selectorPermission:any=[];//用来存储权限的改变
    oldpermission:any=[];//员工一开始有的权限
    staffId:string="";//员工id
    staffName:string="";//员工姓名
    staffPassword:string="";
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
         this.staffId=this.navParams.get("staffId");
        this.getPermission();

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
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
                this.oldPermission();
            }else{
                this.commonService.alert("系统提示",data.msg);
                if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
            }
        });
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
                            this.oldpermission.push(false);
                       }
                     this.getStaffInfo();

                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
    }

    //判断员工原来有的权限是那几个
     oldPermission(){

             for(var j=0;j<this.permission.length;j++){
                this.selectorPermission[j]=this.isInArray(this.staffInfo.permission,this.permission[j]);
                 this.oldpermission[j]=this.isInArray(this.staffInfo.permission,this.permission[j]);
            }

        }

        /* var arr = ['a','s','d','f'];
        console.info(isInArray(arr,'a'));//循环的方式*/

        /**
         * 使用循环的方式判断一个元素是否存在于一个数组中
         * @param {Object} arr 数组
         * @param {Object} value 元素值
         */
        isInArray(arr,value){
            for(var i = 0; i < arr.length; i++){
                if(value.description=== arr[i].description && value.permissionId=== arr[i].permissionId){
                    return true;
                }
            }
            return false;
        }
    //选择或者取消权限
    toggleTodoState(index){
     this.selectorPermission[index]=!this.selectorPermission[index];

    }

    //判断权限是否有修改

    yesorno(){
         for(var i = 0; i < this.oldpermission.length; i++){
                        if(this.oldpermission[i]!=this.selectorPermission[i]){
                            return true;

                        }
                    }
        return false;
    }


    //保存
    save(){

        if(this.validator()){

             let permissionIds=[];

                 if(this.yesorno()){
                     for(var i=0;i<this.selectorPermission.length;i++){
                        if(this.selectorPermission[i]){
                            permissionIds.push(
                                {"permissionId":this.permission[i].permissionId}
                                );
                        }
                     }
                 }

          this.commonService.httpPost({
            url:this.commonService.baseUrl+'/staff/update',
            data:{
                permission:permissionIds,
                staffId:this.staffId,
                staffName:this.staffName,
                staffPassword:this.staffPassword
            }
        }).then(data=>{
            if(data.code=='200'){
             this.commonService.toast("修改员工信息成功成功");
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
    //重置
    reset(){
        this.staffName="";//员工姓名
        this.staffPassword="";
        for(var j=0;j<this.permission.length;j++){
                this.selectorPermission[j]=this.isInArray(this.staffInfo.permission,this.permission[j]);
            }

    }
    //判断修改后的员工密码是否符合要求
     validator(){
        if(this.staffPassword != ''){

            if(!(/^[^\s]{6,20}$/.test(this.staffPassword))){

                  this.commonService.toast("密码只能是6-20位，不能包含空格、汉字、中文符号哦");
                    return false;
            }
        if((/[^\x00-\xff]/ig.test(this.staffPassword))){
                 this.commonService.toast("密码只能是6-20位，不能包含空格、汉字、中文符号哦");
                return false;
            }

        }

        return true;
    }

}
