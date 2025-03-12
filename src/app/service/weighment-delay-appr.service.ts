import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class WeighmentDelayApprService {

  constructor(private http: HttpClient) { }


  Supplier(){
    return this.http.get(environment.Api +'/Approval/WeighDelayMatList')
  }
  ViewTabel(SupId:any){
    return this.http.get(environment.Api +'/Approval/WeighDelayList?SupId='+SupId)
  }
  Update(UpdateWghDelayAppr:any){
    return this.http.post(environment.Api +'/Approval/UpdateWghDelayAppr',UpdateWghDelayAppr)
  }
}
