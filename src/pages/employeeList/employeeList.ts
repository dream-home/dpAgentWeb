import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { EditEmployeePage } from '../editEmployee/editEmployee';
import { AddEmployeePage } from '../addEmployee/addEmployee';
import { AlertController } from 'ionic-angular';
import { EmployeeInfoPage } from '../employeeInfo/employeeInfo';
  import { HomePage } from '../home/home';
@Component({
  selector: 'page-employeeList',
  templateUrl: 'employeeList.html'
})
export class EmployeeListPage {
      items: any;
      pageNo:number;
      showScroll:boolean=true;
      userInfos:any;
      show:boolean=true;//显示提醒
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams,
        private alertCtrl: AlertController
    ){


    }

    /*页面事件*/
    ionViewWillEnter(){
        this.userInfos=this.commonService.user;
         this.pageNo = 1;
        this.loadData();
        this.showScroll = true;
    }

    //获取员工列表
     loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/staff/infotab',
            data:{
                agentId:this.userInfos.agentId,
                  pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
              if(data.result!=null){
                    this.items =data.result.rows;
                   if(this.pageNo==data.result.totalPage||data.result.totalPage==0){
                          this.show=false;
                      }
                    }else{
                      this.showScroll=false;
                    }
            }else{
                this.commonService.alert("系统提示",data.msg);

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
                 url:this.commonService.baseUrl+'/staff/infotab',
                data:{
                    agentId:this.userInfos.agentId,
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


    //删除员工
    delete(id,i,event) {
         event.stopPropagation();
      let alert = this.alertCtrl.create({
        title: '确定删除员工账号？',
        message: '删除以后此员工账号将不可用，请谨慎删除!',
        buttons: [
          {
            text: '确定',
            role: 'sure',
            handler: () => {
                this.commonService.httpPost({
                        url: this.commonService.baseUrl +'/staff/delete',
                        data: {
                            staffId:id
                        }
                    }).then(data => {
                        if (data.code == 200) {
                            this.items.splice(i,1);
                             this.commonService.toast("删除员工成功");
                        } else {
                            this.commonService.alert("系统提示", data.msg);
                                if (data.code==2) {
                                      this.navCtrl.push(HomePage);
                                    }
                        }
                    });

            }
          },
          {
            text: '取消',
            handler: () => {

            }
          }
        ]
      });
      alert.present();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //跳转到编辑员工页面
    gotoEditEmployeePage(id,event){
         event.stopPropagation();
        this.navCtrl.push(EditEmployeePage,{staffId:id});
    }

    //跳转到添加员工页面
    gotoAddEmployeePage(){
        this.navCtrl.push(AddEmployeePage);
    }


    //跳转到员工详情页面
    gotoEmployeeInfo(id){
         this.navCtrl.push(EmployeeInfoPage,{staffId:id});
    }
}
