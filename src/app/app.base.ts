import {Injectable} from '@angular/core';
import { NavController, AlertController,LoadingController, ToastController,App,Loading } from 'ionic-angular';
import { Http, Headers, URLSearchParams, RequestOptions  } from '@angular/http';
import 'rxjs/Rx';
declare let window:any;
@Injectable()
export class CommonService {
    /**访问路径 */
    //  public baseUrl: string = "http://m.yanbaocoin.cn";
    public baseApiUrl: string = "https://www.6pyun.com";

    //public baseUrl: string = "http://192.168.2.103:8080";
    //public baseUrl: string = "http://192.168.2.200:9010";
    public baseUrl: string = "http://192.168.2.200:8889/agent";//test环境接口
    //public baseUrl: string = "http://192.168.2.200:8899/agent";//dev环境接口


    /**分页页数 */
    pageSize: number = 10;
    /** token */
    public token: string = null;
    /*消息总记录数*/
    public count: number = 0;
    /*系统参数*/
    public params:any;

    // 跳转页面
    public pageIndex: string=null;
    /*uID*/
    public Uid: string=null;
    private loading: Loading;
    private loadRunning: boolean = false;
    public pageBack:boolean = false;

    //判断当前的用户所拥有的权限,默认一开始没有权限

   /* public permission={
        per1:false,// 1:EP转赠
        per2:false,//  2:资料查看
        per3:false,//3:商家审核
        per4:false,//4:图片审核
        per5:false,//5:店铺管理
        per6:false,// 6：业绩查看
        per7:false// 7：员工管理)
    };*/
    public permission=[false,false,false,false,false,false,false,false];

    public user = {
        address:'',
        agentAreaId:'',
        agentCity:'',
        agentCountry:'',
        agentId:'',
        agentLevel:'',
        agentProvince:'',
        agentType:null,
        bankBranch:'',
        bankCard:'',
        bankType:null,
        bankTypeCode:'',
        cardIconId:'',
        company:'',
        createTime:'',
        email:'',
        errorCount:'',
        headImgUrl:'',
        id:'',
        idcard:'',
        key:'',
        licenseIconId:'',
        licenseId:'',
        loginName:'',
        menuPermissionsList:[],
        nickName:'',
        password:'',
        phone:'',
        sex:null,
        status:null,
        token:'',
        uid:'',
        updateTime:null,
        userName:''
    };

    public navCtrl: NavController;
    constructor(
        private http: Http,
        public alertCtrl: AlertController,
        public loadingCtrl:LoadingController,
        public toastCtrl: ToastController,
        public app: App
    ) {
      /*  this.token ="eyJpZCI6Ijk1MTgwNTQxMkYzMzQ2RURCMzU2RjgyQTkzMTUzRkQ3IiwidGltZSI6MTQ5NzUyNjk5NTg5Mywibmlja05hbWUiOiLH5cezIn0*";*/
    }

    /**
    *
    * 发送 Http Get 请求
    */
    public httpGet(options){
        let url = options.url;
        let headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("token",this.token);
        let params = new URLSearchParams();
        for(var key in options.data){
            params.set(key, options.data[key]);
        }
        let opt = new RequestOptions({ headers: headers, search: params });
        this.showLoading();
        let resp = this.http.get(url,opt).map(res => res.json()).toPromise();
        resp.then(data=>{
            if(data.code=='-1'){
                this.navCtrl = this.app.getActiveNav();
                sessionStorage.clear();
                this.token = null;

            }
            this.hideLoading();
        },err=>{
            this.hideLoading();
            this.toast("系统问题或者网络问题，请检查网络连接");
        });
        return resp;
    }


    /**
    *
    * 发送 Http Get 请求 没有加载中特效
    */
    public httpLoad(options){
        let url = options.url;
        let headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("token",this.token);
        let params = new URLSearchParams();
        for(var key in options.data){
            params.set(key, options.data[key]);
        }
        let opt = new RequestOptions({ headers: headers, search: params });
        let resp = this.http.get(url,opt).map(res => res.json()).toPromise();
        resp.then(data=>{
            if(data.code=='-1'){
                sessionStorage.clear();
                this.token = null;
                this.count = 0;
            }
        },err=>{
            this.toast("系统问题或者网络问题，请检查网络连接");
        });
        return resp;
    }

    /**
    *
    * 发送 Http Post 请求
    */
    public httpPost(options){
        let url = options.url;
        let headers = new Headers();
        headers.append("Content-Type", "application/json;charset=utf-8");
        headers.append("token",this.token);
        let opt = new RequestOptions({ headers: headers});
        this.showLoading();
        console.log("post 发送--->>data "+JSON.stringify(options.data)+"  url --->> "+url);
        let resp = this.http.post(url, options.data, opt).map(res => res.json()).toPromise();
        resp.then(data=>{
            console.log("post 返回结果--->>data "+JSON.stringify(data));
            this.hideLoading();
        },err=>{
            this.hideLoading();
            this.toast("网络问题，请检查网络连接");
        });
        return resp;
    }

    /**
    *
    *消息提醒框
    */
    public alert(title,subTitle) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['确定']
        });
        alert.present();
    }

    /*消息提醒(ionic)*/
    public toast(msg){
        let toast = this.toastCtrl.create({
            message: msg,
            position: 'bottom',
            duration: 2500,
            cssClass: 'mytoast'
        });
        toast.present();
        return toast;
    }

    /*系统参数*/
    public loadParam(){
        this.httpLoad({
            url:this.baseUrl+'/api/system/setting',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.params = data.result;
            }
        });
    }


    /**
     * 统一调用此方法显示loading
     * @param content 显示的内容
     */
    showLoading = (content: string = '') => {
      if (!this.loadRunning) {
        this.loadRunning = true;
        this.loading = this.loadingCtrl.create({
          content: content,
          spinner: 'crescent',
          dismissOnPageChange:false
        });
        this.loading.present().then(()=>{
            setTimeout(() => {//最长显示10秒
                this.hideLoading();
            }, 10000);
        });
      }
    };

    /**
     * 关闭loading
     */
    hideLoading = () => {
      if (this.loadRunning) {
          this.loading.dismiss().then(()=>{
              this.loadRunning = false;
          }).catch(()=>{});
      }
    };


    dateFormatLong(date:number, sFormat: String = 'yyyy-MM-dd'){
        return this.dateFormat(new Date(date),sFormat);
    }

    /**
    * 格式化日期
    * sFormat：日期格式:默认为yyyy-MM-dd     年：y，月：M，日：d，时：h，分：m，秒：s
    * @example  dateFormat(new Date(),'yyyy-MM-dd')   "2017-02-28"
    * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')   "2017-02-28 09:24:00"
    * @example  dateFormat(new Date(),'hh:mm')   "09:24"
    * @param date 日期
    * @param sFormat 格式化后的日期字符串
    * @returns {String}
    */
    dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
        let time = {
            Year: 0,
            TYear: '0',
            Month: 0,
            TMonth: '0',
            Day: 0,
            TDay: '0',
            Hour: 0,
            THour: '0',
            hour: 0,
            Thour: '0',
            Minute: 0,
            TMinute: '0',
            Second: 0,
            TSecond: '0',
            Millisecond: 0
        };
        time.Year = date.getFullYear();
        time.TYear = String(time.Year).substr(2);
        time.Month = date.getMonth() + 1;
        time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
        time.Day = date.getDate();
        time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
        time.Hour = date.getHours();
        time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
        time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
        time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
        time.Minute = date.getMinutes();
        time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
        time.Second = date.getSeconds();
        time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
        time.Millisecond = date.getMilliseconds();

        return sFormat.replace(/yyyy/ig, String(time.Year))
            .replace(/yyy/ig, String(time.Year))
            .replace(/yy/ig, time.TYear)
            .replace(/y/ig, time.TYear)
            .replace(/MM/g, time.TMonth)
            .replace(/M/g, String(time.Month))
            .replace(/dd/ig, time.TDay)
            .replace(/d/ig, String(time.Day))
            .replace(/HH/g, time.THour)
            .replace(/H/g, String(time.Hour))
            .replace(/hh/g, time.Thour)
            .replace(/h/g, String(time.hour))
            .replace(/mm/g, time.TMinute)
            .replace(/m/g, String(time.Minute))
            .replace(/ss/ig, time.TSecond)
            .replace(/s/ig, String(time.Second))
            .replace(/fff/ig, String(time.Millisecond))
    }

    toNumber(num:number){
        return num.toFixed(2);
    }

    toDecimal(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return;
        }
        f = Math.round(x*100)/100;
        return f.toFixed(2);
    }

}


@Injectable()
export class GlobalService {
    get(attr) {
        if(typeof this[attr] === 'undefined') return;
        return this[attr];
    }

    set(attr, val) {
        if(typeof val === 'undefined') return;
        this[attr] = val;
        return this[attr];
    }
}
