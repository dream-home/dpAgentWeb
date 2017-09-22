import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController ,NavParams} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { InputPagePage } from '../inputPage/inputPage';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ShowBigImgPage } from '../showBigImg/showBigImg';
@Component({
  selector: 'page-businessInfo',
  templateUrl: 'businessInfo.html'
})
export class BusinessInfoPage {
  public storeInfo:any;//商家信息
  public storeId:string;
  public failureCause:string="";//商铺审核不通过的原因
  constructor( private alertCtrl: AlertController,public modalCtrl: ModalController,public navCtrl: NavController,public params:NavParams, private commonService: CommonService) {
    this.storeId=this.params.get("storeId");
    this.loadDate();
  }

  //获取店铺的详细信息
  loadDate(){
     this.commonService.httpGet({
            url:this.commonService.baseUrl+'/store/getStoreInfo',
            data:{
                storeId:this.storeId
            }
        }).then(data=>{
            if(data.code==200){
                this.storeInfo =data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
            }
        });
  }
	  //弹出输入原因的页面
    openInputpage(type){
      let title="";
       if(type==1){
          title="店铺关闭原的因";
       }else if(type==2){
          title="店铺审核不通过的原因";
       }
        let profileModal = this.modalCtrl.create(InputPagePage,{title:title});
         profileModal.onDidDismiss(data => {

            if(data.conter!=""){
              this.failureCause=data.conter;
                if(type==1){//关闭店铺
                   this.close();
                }
                if(type==2){
                   this.examine(2);
                }
            }
           });
        profileModal.present();


    }

    //弹出查看图片大图
    openShowBigImgPage(imgs,index){
      console.log(imgs);
        let profileModal = this.modalCtrl.create(ShowBigImgPage,{"index":index,"imgs":imgs});
        /* profileModal.onDidDismiss(data => {
             console.log(data);
           });*/
        profileModal.present();
    }

     /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //审核店铺
    examine(index){//1,通过，2不通过
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/business/shopCheck?failureCause='+this.failureCause+"&id="+this.storeInfo.id+"&status="+index,
            data:{

            }
        }).then(data=>{
            if(data.code==200){

                  if(index==1){
                     this.commonService.alert("温馨提示","审核操作成功，此商家审核结果为通过");
                  }
                 else{
                   this.commonService.alert("温馨提示","审核操作成功，此商家审核结果为不通过");
                 }
                 this.tuisong();
                 this.loadDate();

            }else{
                this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
            }
        });
    }


    //给代理推送商铺申请消息接口
    tuisong(){
       this.commonService.httpPost({
            url:this.commonService.baseUrl+'/message/pushToTheAgent',
            data:{
               areaId:this.storeInfo.areaId,
               storeId:this.storeId,
               type:"1"
            }
        }).then(data=>{
            if(data.code==200){
                // this.commonService.toast("已经把店铺审核的结果推送给商家了");
            }else{
                this.commonService.alert("系统提示",data.msg);

            }
        });
    }


    //关闭店铺
    close(){
       this.commonService.httpPost({
            url:this.commonService.baseUrl+'/business/isBan?failureCause='+this.failureCause+"&id="+this.storeId+"&status=3",
            data:{

            }
        }).then(data=>{
            if(data.code==200){
                 this.commonService.alert("温馨提示","已经成功的将此商家关闭。");
                  this.loadDate();
            }else{
                this.commonService.alert("系统提示",data.msg);
                 if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }

            }
        });
    }

     //审核通过
    tongguo() {
         event.stopPropagation();
      let alert = this.alertCtrl.create({
        title: '确定通过审核',
        message: '通过后商家将显示在APP商城，请谨慎处理!',
        buttons: [
          {
            text: '确定',
            role: 'sure',
            handler: () => {
               this.examine(1);

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
}
