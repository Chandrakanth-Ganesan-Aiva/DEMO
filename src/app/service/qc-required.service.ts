import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class QcRequiredService {

  constructor(private http:HttpClient) { }

  Supplier(LocationId:any){
    return this.http.get(environment.Api +'/master/QcReqSuppliers?locationid='+LocationId);
  }
  View(LocationId:any,SupId:any){
    return this.http.get(environment.Api +'/master/QcReqViewDet?locationid='+LocationId+'&supid='+SupId);
  }
  save(QcReqUpdate:any){
    return this.http.put(environment.Api +'/master/QcReqUpdate',QcReqUpdate)
  }
}
