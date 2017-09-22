import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { ImgReviewListPage } from '../imgReviewList/imgReviewList';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-businessImgReview',
  templateUrl: 'businessImgReview.html'
})
export class BusinessImgReviewPage {
   items: any;
  showScroll: boolean;
  pageNum: number;
   show:boolean=true;//显示提醒
  constructor( public navCtrl: NavController,private commonService: CommonService,) {
      this.pageNum = 1;
        this.showScroll = true;

  }
  /*页面事件*/
    ionViewWillEnter(){
      this.loadData();
    }
    
     /*返回上一页*/

    goToBackPage(){
        this.navCtrl.pop();
    }


    gotoImgReviewPage(id){

      this.navCtrl.push(ImgReviewListPage,{id:id});
    }

      loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/image/allStoreImg',
            data:{
               agentId:this.commonService.user.agentId,
                pageNum:1,
                pageSize:10
            }
        }).then(data=>{
            if(data.code==200){
               if(data.result!=null){
                 this.items =data.result.rows;
               // console.log(this.items[0].goods);
                 if(this.pageNum==data.result.totalPage||data.result.totalPage==0){
                        this.show=false;
                    }

               }else{
                  this.showScroll=false;
               }
                if(data.result.length==0){
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
        this.pageNum++;
        setTimeout(() => {
            this.commonService.httpGet({
                 url:this.commonService.baseUrl+'/image/allStoreImg',
                data:{
                    agentId:this.commonService.user.agentId,
                    pageNum:this.pageNum,
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
                    if(this.pageNum==data.result.totalPage){
                        this.show=false;
                    }
                }else{
                    this.commonService.alert("系统提示",data.msg);
                    if (data.code==2) {
                      this.navCtrl.push(HomePage);
                    }
                }

                console.log(this.items);
            });
        }, 500);

        }else{

           this.showScroll=false;
           return;
        }
    }

}
