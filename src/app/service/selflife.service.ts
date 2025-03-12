import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class SelflifeService {

  constructor(private http: HttpClient) {

  }

  GrnNo(LocationId:any): Observable<any>{
    return this.http.get(environment.Api +'/Inventory/SelfLife-GRNo?LocationId='+LocationId)
  }
  Supplier(Grnno:any): Observable<any>{
    return this.http.get(environment.Api +'/Inventory/SelfLife-Supplier?Grnno='+Grnno)
  }
  Viewbtn(Grnno:any): Observable<any>{
    return this.http.get(environment.Api +'/Inventory/Selflife-ViewItemDetails?Grnno='+Grnno)
  }
  BatchQtyVaildation(GrnId:any): Observable<any>{
    return this.http.get(environment.Api +'/Inventory/Selflife-batchqty?GrnId='+GrnId)
  }
  Save(SelflifeUpdate:any): Observable<any>{
    return this.http.post(environment.Api +'/Inventory/Post_SleflifeHrd',SelflifeUpdate)
  }
}
