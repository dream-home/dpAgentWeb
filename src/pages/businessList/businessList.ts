import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { BusinessInfoPage } from '../businessInfo/businessInfo';
import { SelectAddressPage } from '../selectAddress/selectAddress';
import { Area } from '../../app/app.data';

import { ModalController } from 'ionic-angular';
import { InputPagePage } from '../inputPage/inputPage';
 import { HomePage } from '../home/home';

@Component({
  selector: 'page-businessList',
  templateUrl: 'businessList.html'
})
export class BusinessListPage {

 items: any;
  showScroll: boolean;
  pageNo: number;
   show:boolean=true;//显示提醒
   //有关地区选择
    public myAddr:string="";//当前代理的代理区域
    public province:string="440000";//广东省
    public city:string="440400";//珠海市
    public addrs:any[];//地区列表
     public selectAddr:string="";//当前选择的地区，默认为当前代理的区域
    public status:string="1,3";//当前显示的列表的状态，默认为全部。
    failureCause:string="";//关闭商家的原因
    addrnum:number=0;//判断有几个地区
  constructor(public modalCtrl: ModalController,public navCtrl: NavController, public area:Area,private commonService: CommonService) {
        this.pageNo = 1;
        this.showScroll = true;

        this.province=this.commonService.user.agentProvince;

        this.city=this.commonService.user.agentCity;

        if(this.commonService.user.agentLevel=="1"){

           this.selectProvi();
            this.myAddr=this.area.findNameByProvince(this.province);

        }
        if(this.commonService.user.agentLevel=="2"){

            this.selectCity(this.city);
             this.myAddr=this.area.findNameByCity(this.city);
        }




  }

    ionViewWillEnter(){

      let addrCity=sessionStorage.getItem("addrCity");
      let addrCounty=sessionStorage.getItem("addrCounty")


      if(addrCity!=null&&addrCounty!=null){

         if(addrCounty==""&&addrCity!=""){
           //返回城市编号
            this.selectAddr=addrCity;
         }

         if(addrCity==""){
            this.selectAddr="";
         }

         if(addrCounty!=""){
          //返回区县编号
            this.selectAddr=addrCounty;
         }


      }

        this.loadData();

      }

    //根据省份查找城市
     selectProvi(){
        this.addrs = this.area.findCityLisByPid(this.province);
        this.addrnum=this.addrs.length;
      //  console.log(this.addrs);
    }
    //根据城市超找区县
     selectCity(cityNo){
        this.addrs = this.area.findAreaLisByPid(cityNo);
        this.addrnum=this.addrs.length;
       // console.log("区县"+this.addrs);
    }


  //选择数据的状态
      selectStatu(str){
      this.status=str;
     this.loadData();
   }
  //根据地区和状态查找数据(一开始是默认)
    findList(str){
        this.selectAddr=str;
        this.loadData();
    }

     loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/store/getStoreList',
            data:{
               location:this.selectAddr,
                pageNo:1,
                pageSize:12,
                status:this.status
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
                if(data.code==3){
                  //this.selectAddr="";
                  this.items=[];
                }
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
                 url:this.commonService.baseUrl+'/store/getStoreList',
                data:{
                    location:this.selectAddr,
                    pageNo:this.pageNo,
                    pageSize:this.commonService.pageSize,
                    status:this.status
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
         sessionStorage.removeItem("addrCity");
         sessionStorage.removeItem("addrCounty");
        this.navCtrl.pop();
    }

   //跳转到商家信息详情界面
   goToBusinessInfoPage(id){
        this.navCtrl.push(BusinessInfoPage,{"storeId":id});
    }

    //跳转到地区选择页面
    goToSelectAddressPage(){
        this.navCtrl.push(SelectAddressPage);
    }


     //关闭店铺
    close(sid,index){
       this.commonService.httpPost({
            url:this.commonService.baseUrl+'/business/isBan?failureCause='+this.failureCause+"&id="+sid+"&status=3",
            data:{

            }
        }).then(data=>{
            if(data.code==200){
                 this.commonService.alert("温馨提示","已经成功的将此商家关闭。");
                this.items[index].status=3;
            }else{
                this.commonService.alert("系统提示",data.msg);
                 if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
            }
        });
    }
     //弹出输入原因的页面
    openInputpage(sid,index,event){
        event.stopPropagation();
      let title="";
          title="店铺关闭的原因";

        let profileModal = this.modalCtrl.create(InputPagePage,{title:title});
         profileModal.onDidDismiss(data => {

            if(data.conter!=""){
              this.failureCause=data.conter;
                //关闭店铺
                   this.close(sid,index);

            }
           });
        profileModal.present();


    }

    open(event){
       event.stopPropagation();
       this.commonService.alert("温馨提示","请联系管理员开启店铺。");
    }
}
