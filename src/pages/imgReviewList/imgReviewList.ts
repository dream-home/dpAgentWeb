import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { InputPagePage } from '../inputPage/inputPage';
import { ShowBigImgPage } from '../showBigImg/showBigImg';
import { CommonService } from '../../app/app.base';
import { AlertController } from 'ionic-angular';
    import { HomePage } from '../home/home';
@Component({
  selector: 'page-imgReviewList',
  templateUrl: 'imgReviewList.html'
})
export class ImgReviewListPage {
  public title:string;
  public reason:string="";
  public show:boolean;
  public checked:boolean=false;
  public goodsId:string="";//商品的id
  public goodImgs:any="";//商品图片
  failCause:string="";//审核不通过的原因
  //测试图
  public testImgs:any=["../assets/images/jiben.png","../assets/images/ep.png","../assets/images/quyu.png"];
  constructor(  private alertCtrl: AlertController, private commonService: CommonService,public navCtrl: NavController,public modalCtrl: ModalController,private navParams: NavParams) {
      this.goodsId=this.navParams.get("id");

      this.loadImg();
  }
	  //弹出输入原因的页面
    openInputpage(){
        let profileModal = this.modalCtrl.create(InputPagePage,{ title:"图片审核不通过的原因"});
         profileModal.onDidDismiss(data => {

             if(data.conter!=""){
                this.failCause=data.conter;
                this.examine(3);
              }
           });
        profileModal.present();
    }

    //获取选中通过的图片
    test(){
      console.log(this.checked);
    }
     /*返回上一页*/

    goToBackPage(){
        this.navCtrl.pop();
    }

    //弹出查看图片大图
    openShowBigImgPage(imgs,index){
        let profileModal = this.modalCtrl.create(ShowBigImgPage,{"index":index,"imgs":imgs});
        /* profileModal.onDidDismiss(data => {
             console.log(data);
           });*/
        profileModal.present();
    }
    //获取商品的图片
    loadImg(){
         this.commonService.httpGet({
            url:this.commonService.baseUrl+'/image/goodsImg',
            data:{
                goodsId:this.goodsId
            }
        }).then(data=>{
            if(data.code=='200'){
                this.goodImgs = data.result;

            }else{
                this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                          this.navCtrl.push(HomePage);
                        }
            }
        });
    }

  // //审核图片
    examine(index){//2,通过，3不通过
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/image/ImageReview',
            data:{
               failCause:this.failCause,
               goodsId:this.goodsId,
               isverify:index
            }
        }).then(data=>{
            if(data.code==200){

                  if(index==2){
                     this.commonService.alert("温馨提示","审核操作成功，此商品图片审核结果为通过");
                  }
                 else{
                   this.commonService.alert("温馨提示","审核操作成功，此商品图片审核结果为不通过");
                 }
                 this.goToBackPage();
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
        message: '通过后图片将显示在APP商城，请谨慎处理!',
        buttons: [
          {
            text: '确定',
            role: 'sure',
            handler: () => {
               this.examine(2);

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
