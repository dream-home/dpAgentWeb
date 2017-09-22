import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Area } from '../../app/app.data';
import { CommonService } from '../../app/app.base';
@Component({
  selector: 'page-selectAddress',
  templateUrl: 'selectAddress.html'
})
export class SelectAddressPage {
  public isShow:boolean=true;
  public province:string="440000";//广东省
  public city:string="440400";//珠海市
  public citys:any[];//城市的数组
  public countys:any[];//区县的数组
  public addrCity:string="";//当前选中的城市编号
  public addrCounty:string="";//当前选中的区县编号
  public addrCityName:string="";//当前选中的城市名字
  public addrCountyName:string="";//当前选中的区县名字
  public flag:number;//1：省代理 2市代 3区县代理
  constructor(public navCtrl: NavController,public area:Area,private commonService: CommonService) {

      this.province=this.commonService.user.agentProvince;
       this.city=this.commonService.user.agentCity;
      if(this.commonService.user.agentLevel=="1"){
        this.flag=1;
      }
      if(this.commonService.user.agentLevel=="2"){
        this.flag=2;
      }
     if(this.flag==1){
       
        this.selectProvi();
     }else if(this.flag==2){
       
        this.selectCity(this.city)
     }
      
  }

 ionViewWillEnter(){
      sessionStorage.removeItem("addrCity");
      sessionStorage.removeItem("addrCounty");
      }


  /*返回上一页*/
    goToBackPage(){
      sessionStorage.setItem("addrCity",this.addrCity);
      sessionStorage.setItem("addrCounty",this.addrCounty);
        this.navCtrl.pop();
    }
    //显示区县

    selectQuxian(index){
       if(this.isShow&&index==2){
        this.isShow=false;
      }else{
        if(index==1)
        {this.isShow=true;}
      }
    }

    //根据省份查找城市
     selectProvi(){
        this.citys = this.area.findCityLisByPid(this.province);
        //console.log(this.citys);
    }
    //根据城市超找区县
     selectCity(cityNo){
        this.countys = this.area.findAreaLisByPid(cityNo);
        //console.log("区县"+this.countys);
    }

    selectAddr(type,value,number){//type,判断点击的是城市还是区县，value点击的值，number点击的地方的编号
        if(type==1&&value!="全部城市"){
          if(value!=this.addrCity){
              this.addrCity=number;
              this.addrCounty="";
              this.addrCityName=value;
              this.addrCountyName="";

              this.selectCity(number);
          }
        }
         if(type==1&&value=="全部城市"){
          this.addrCity="";
          this.addrCounty="";
          this.addrCityName="";
          this.addrCountyName="";
          this.countys=[];
        }

        if(type==2&&value!="全部区县"){
          this.addrCounty=number;

          this.addrCountyName=value;

        }
         if(type==2&&value=="全部区县"){
          if(this.flag==2){
            this.addrCountyName=value;

            this.addrCounty=number;
          }else{
            this.addrCounty="";
            this.addrCountyName="";
          }
          
        }
    }
}
