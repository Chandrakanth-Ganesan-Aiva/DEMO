import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class WeighmentrejectoinrequestService {

  constructor(private http: HttpClient) {  }


  Supplier(LocationId:any){
    return this.http.get(environment.Api +'/Weighment/WeghRejReqSupplier?LocationId='+LocationId)
  }
  SupplierDet(SupId:any){
    return this.http.get(environment.Api +'/Weighment/WeghRejReqSupplierDet?SupId='+SupId)
  }
  Update(UpdateWeighRejReq:any){
    return this.http.post(environment.Api +'/Weighment/UpdateWeighRejReq',UpdateWeighRejReq)
  }
}
