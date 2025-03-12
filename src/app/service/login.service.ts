import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, pipe, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  l: any = 0;
  Ch: any = "";
  Chstr: any = "";
  CrStr: any = "";
  currentUser$: any;

  constructor(private http: HttpClient) { }

  // `${environment.Api.Api}`

  login(UserName: any, Password: any): Observable<any> {
    // return this.http.get(environment.Api + '/login/loginDetail/?usern=' + UserName + '&psw=' + Password)
    return this.http.get('http://192.168.100.5:6055/login/loginDetail/?usern=' + UserName + '&psw=' + Password)
  }
  companyDetail() {
    return this.http.get(environment.Api + '/login/Location')
  }
  CryptString(Strvar: any) {
    this.Chstr = "";
    this.CrStr = "";
    this.l = Strvar.length;
    for (let i = 1; i <= this.l; i++) {
      this.Ch = Strvar.substr(i - 1, 1);
      this.CrStr = this.Ch.charCodeAt(0) + (5);
      if (i < 3) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(255)
        console.log(this.Chstr, String.fromCharCode(this.CrStr) + String.fromCharCode(255));
      }
      else if (i >= 3 && i < 6) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(254)
      }
      else if (i >= 6 && i < 9) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(253)
      }
      else if (i >= 9 && i < 12) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(250)
      }
      else if (i >= 12 && i < 15) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(251)
      }
      else if (i >= 15 && i < 18) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(255)
      }
      else if (i >= 18 && i < 21) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(254)
      }
      else if (i >= 21 && i < 24) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(253)
      }
      else if (i >= 24 && i < 27) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(250)
      }
      else if (i >= 27 && i <= 30) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(251)
      }
      else if (i > 30) {
        this.Chstr = this.Chstr + String.fromCharCode(this.CrStr) + String.fromCharCode(250)
      }
      //  console.log(Chstr);
    };
    // CryptString = Chstr
    // console.log(this.Chstr);
    return this.Chstr
  };

  RighitsCheck(Empid: any, Locationid: any) {
    return this.http.get(environment.Api + '/login/rightscheck?Empid=' + Empid + '&Locationid=' + Locationid)
  }
  menuname() {
    return this.http.get(environment.Api + '/login/menurights')
  }
  Emailotp(fmail: any, tmail: any, shtml: any) {
    return this.http.get(environment.Api + '/login/sendmail?fmail=' + fmail + '&tmail=' + tmail + '&shtml=' + shtml)
  }
  Mailuserlist(LocationId: any) {
    return this.http.get(environment.Api + '/login/mailuserlist?LocationId=' + LocationId)
  }
  Loginattempt(Empid: any) {
    return this.http.get(environment.Api + '/login/LoginAttempt?Empid=' + Empid)
  }
  OTPInsert(Empid: any, LocationId: any, Otp: any, FrmDate: any, TOdate: any, CreatedSystem: any, OtpValid: any) {
    return this.http.get(environment.Api + '/login/OtpInsert?Empid=' + Empid + '&LocationId=' + LocationId + '&Otp=' + Otp + '&FrmDate=' + FrmDate + '&TOdate=' + TOdate +
      '&CreatedSystem=' + CreatedSystem + '&OtpValid=' + OtpValid)
  }
  Otpvaild(Empid: any, LocationId: any, Frmdate: any) {
    return this.http.get(environment.Api + '/login/OtpVaildation?Empid=' + Empid + '&LocationId=' + LocationId + '&Frmdate=' + Frmdate)
  }
  OtpforgetUpdate(LocationId: any, Otp: any, Frmdate: any, Todate: any, CreatedSystem: any, OtpValidation: any, Empid: any) {
    return this.http.get(environment.Api + '/login/OtpforgetUpdate?LocationId=' + LocationId + '&Otp=' + Otp + '&Frmdate=' + Frmdate + '&Todate=' + Todate + '&CreatedSystem=' + CreatedSystem +
      ' &OtpValidation=' + OtpValidation + '&Empid=' + Empid)
  }
  UpdateOtpValidation(OtpVaildation: any, Empid: any, LocationId: any, Otp: any, EntryDate: any) {
    return this.http.get(environment.Api + '/login/OtpVaildationUpdate?OtpVaildation=' + OtpVaildation + '&Empid=' + Empid + '&LocationId=' + LocationId + '&Otp=' + Otp + '&EntryDate=' + EntryDate)
  }
  InsertOtpDet(LoginUserName: any, UserId: any, Date_Time: any, Otp: any) {
    return this.http.get(environment.Api + '/login/InsertOtpDetalis?LoginUserName=' + LoginUserName + '&UserId=' + UserId + '&Date_Time=' + Date_Time + '&Otp=' + Otp)
  }
  // --------------------------TOKEN---------------------------------
  tokenDet(token: any) {
    return this.http.post(environment.Api + '/token', token)
  }

  //------------------------------------------------------Screen Lock APi---------------------------------

  screenlockvaild(MenuId: any, LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Lockscrnvaildation?MenuId=' + MenuId + '&LocationId=' + LocationId)
  }
  Insertlockscreen(InsertloginDet: any) {
    return this.http.post(environment.Api + '/Inventory/Lockscreen', InsertloginDet)
  }


  // ----------------------------------Login Vaildation----------------------
  loginUserDetInsert(UserDetInsert: any) {
    return this.http.post(environment.Api + '/login/UserLoginDetalis', UserDetInsert)
  }
  Dept(Empid: any) {
    return this.http.get(environment.Api + '/login/userloginDept?&empid=' + Empid)
  }
  UpdateUserDet(Updateuserdet: any) {
    return this.http.post(environment.Api + '/login/Updateuserdet', Updateuserdet)
  }
  checkloginsts(Empid:any){
    return this.http.get(environment.Api + '/login/loginstatuscheck?Empid='+Empid)
  }

  // ---------------------------------Forget Password-----------------------------------

  Mail(Loginname: any, Empid: any) {
    return this.http.get(environment.Api + '/login/Email?Loginname=' + Loginname + '&Empid=' + Empid)
  }
  EmailotpF(tmail: any, shtml: any) {
    return this.http.get(environment.Api + '/login/sendmailf?tmail=' + tmail + '&shtml=' + shtml)
  }
  InsertFrgOtp(Empid: any, Otp: any) {
    return this.http.get(environment.Api + '/login/InsertOtpFrg?Empid=' + Empid + '&Otp=' + Otp)
  }
  verifyOtpFrg(Empid: any) {
    return this.http.get(environment.Api + '/login/FOtpCheck?Empid=' + Empid)
  }
  Resetpass(UpdatePass: any) {
    return this.http.put(environment.Api + '/login/UpdatePass', UpdatePass)
  }

  // --------------------------------------DASHBOARD SERVICE-------------------------------------
  
  MenuList(Project:any) {
    return this.http.get(environment.Api + '/login/Menus?Project='+Project)
  }
  SubMenuList(MainMenuId:any,MainId:any){
    return this.http.get(environment.Api+'/login/SubMenus?MainMenuId='+MainMenuId+'&MainId='+MainId)
  }
  // ------------------------Shared Date b/w Compontent
  private sidenavState = new BehaviorSubject<boolean>(true);
  private close1btnState = new BehaviorSubject<boolean>(true);

  currentSidenavState = this.sidenavState.asObservable();
  currentClose1btnState = this.close1btnState.asObservable();

  updateSidenavState(state: boolean) {
    this.sidenavState.next(state);
  }

  updateClose1btnState(state: boolean) {
    this.close1btnState.next(state);
  }
}