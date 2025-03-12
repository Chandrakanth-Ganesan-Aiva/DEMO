import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class WeighmentRejApprService {

  constructor(private http: HttpClient) {  }


  WeighmnetDet(){
    return this.http.get(environment.Api +'/Approval/WeighmentDetalis')
  }
  UpdateAppr(UpdateWeighment:any){
    return this.http.put(environment.Api +'/Approval/UpdateWeighmentRejAppr',UpdateWeighment)
  }
  UpdateRej(UpdateWeighment:any){
    return this.http.put(environment.Api +'/Approval/UpdateWeigmentRejReject',UpdateWeighment)
  }
}
