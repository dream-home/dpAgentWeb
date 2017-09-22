import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { CommonService } from './app.base';
import { Area } from './app.data';
import { HomePage } from '../pages/home/home';
import { EPAccountPage } from '../pages/EPAccount/EPAccount';
import { SellermanagePage } from '../pages/sellermanage/sellermanage';
import { InputPagePage } from '../pages/inputPage/inputPage';
import { BusinessInfoPage } from '../pages/businessInfo/businessInfo';
import { LoginPage } from '../pages/login/login';
import { ForgetPasswordPage } from '../pages/forgetPassword/forgetPassword';
import { EmployeeListPage } from '../pages/employeeList/employeeList';
import { EditEmployeePage } from '../pages/editEmployee/editEmployee';
import { EPGivePage } from '../pages/EPGive/EPGive';
import { BusinessListPage } from '../pages/businessList/businessList';
import { BusinessImgReviewPage } from '../pages/businessImgReview/businessImgReview';

import { AddEmployeePage } from '../pages/addEmployee/addEmployee';
import { SettleAccountsPage } from '../pages/settleAccounts/settleAccounts';
import { EssentialInforPage } from '../pages/essentialInfor/essentialInfor';
import { AreaCountPage } from '../pages/areaCount/areaCount';

import { ShowBigImgPage } from '../pages/showBigImg/showBigImg';
import { SelectAddressPage } from '../pages/selectAddress/selectAddress';
import { EmployeeInfoPage } from '../pages/employeeInfo/employeeInfo';
import { ImgReviewListPage } from '../pages/imgReviewList/imgReviewList';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EPAccountPage,
    SellermanagePage,
    InputPagePage,
    BusinessInfoPage,
    LoginPage,
    ForgetPasswordPage,
    EmployeeListPage,
    EditEmployeePage,
    EPGivePage,
    BusinessListPage,
    BusinessImgReviewPage,
    AddEmployeePage,
    SettleAccountsPage,
    ShowBigImgPage,
    EssentialInforPage,
    AreaCountPage,
    SelectAddressPage,
    EmployeeInfoPage,
    ImgReviewListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
          backButtonText: '',
          iconMode: 'ios',
          modalEnter: 'modal-slide-in',
          modalLeave: 'modal-slide-out',
          tabsPlacement: 'bottom',
          pageTransition: 'ios',
          mode: 'ios',
          tabsHideOnSubPages:true
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EPAccountPage,
    SellermanagePage,
    InputPagePage,
    BusinessInfoPage,
    LoginPage,
    ForgetPasswordPage,
    EmployeeListPage,
    EditEmployeePage,
    EPGivePage,
    BusinessListPage,
    BusinessImgReviewPage,
    AddEmployeePage,
    SettleAccountsPage,
    ShowBigImgPage,
    EssentialInforPage,
    AreaCountPage,
    SelectAddressPage,
    EmployeeInfoPage,
    ImgReviewListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonService,
    Area
  ]
})
export class AppModule {}
