import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {

    
   }

  Location() { 
    return this.http.get(environment.Api+'/login/adminLocation')
  }
  dept(LocationId:any): Observable<any>  {
    return this.http.get(environment.Api +'/login/Department?LocationId='+LocationId)
  }
  Emp(Deptid: any): Observable<any>  {
    return this.http.get(environment.Api +'/login/Empolyee?Deptid=' + Deptid)
  }
  mainMenu(): Observable<any>  {
    return this.http.get(environment.Api +'/login/MainMenu')
  }
  subMenu(MainMenuId:any){
    return this.http.get(environment.Api +'/login/ViewSubMenu?MainMenuId='+MainMenuId)
  } 
  ViewRights(Locationid:any,Empid:any,MainMenuId:any) {
    return this.http.get(environment.Api +'/login/Viewrightstabel?Locationid='+Locationid+'&Empid='+Empid+'&MainMenuId='+MainMenuId)
  }
  ViewHistory(Locationid:any,Empid:any): Observable<any>  {
    return this.http.get(environment.Api +'/login/ViewHistory?Locationid='+Locationid+'&Empid='+Empid)
  }
  poweruser(Empid: any): Observable<any>  {
    return this.http.get(environment.Api +'/login/Poweruser?Empid=' + Empid)
  }
  Approved(): Observable<any>  {
    return this.http.get(environment.Api +'/login/Approved')
  }
  Save(RightsUpdate: any): Observable<any>  {
    return this.http.post(environment.Api +'/login/MenuRighitsDet', RightsUpdate)
  }

}
