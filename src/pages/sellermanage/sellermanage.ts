import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { BusinessListPage } from '../businessList/businessList';
import { BusinessInfoPage } from '../businessInfo/businessInfo';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-sellermanage',
  templateUrl: 'sellermanage.html'
})
export class SellermanagePage {
  items: any;
  showScroll: boolean;
  pageNo: number;
  show:boolean=true;//显示提醒
  constructor(public navCtrl: NavController, private commonService: CommonService) {

  }
    ionViewWillEnter(){
          this.pageNo =1;
          this.showScroll = true;
          this.show = true;
          this.loadData();
          sessionStorage.removeItem("addrCity");
         sessionStorage.removeItem("addrCounty");
      }

     loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/store/getStoreList',
            data:{
                pageNo:1,
                pageSize:10,
                status:"0,2"
            }
        }).then(data=>{
            if(data.code==200){
                if(data.result!=null){

                  this.items =data.result.rows;
                    if(this.pageNo==data.result.totalPage||data.result.totalPage==0){
                          this.show=false;
                      }
                    if(this.items.length==0){

                      this.showScroll=false;
                    }
                }else{
                  this.showScroll=false;
               }
            }else{
                this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                          this.navCtrl.push(HomePage);
                        }
                      if (data.code==3) {
                         this.showScroll=false;
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
                    pageSize:this.commonService.pageSize,
                    status:"0,2"
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


	 /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    //跳转到商家列表
	goToBusinessListPage(){
	        this.navCtrl.push(BusinessListPage);
	    }

     //跳转到商家信息详情界面
   goToBusinessInfoPage(id){
        this.navCtrl.push(BusinessInfoPage,{"storeId":id});
    }
}
