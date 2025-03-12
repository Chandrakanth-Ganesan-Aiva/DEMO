import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class MatlRecivedfrmdeptService {

  constructor(private http: HttpClient) {

  }

  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api +'/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }
  Material(Deptid:any,LocationId:any){
    return this.http.get(environment.Api +'/Inventory/MatReturnFrmDept-Material?Deptid='+Deptid+'&LocationId='+LocationId)
  }
  Department(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/MatReturnFrmDept-Dept?LocationId='+LocationId)
  }
  ViewRecivedMaterial(LocationId:any,Rawmatid:any,Deptid:any){
    return this.http.get(environment.Api +'/Inventory/MatReturnFrmDept-ViewReturnMat?LocationId='+LocationId+'&Rawmatid='+Rawmatid+'&Deptid='+Deptid)
  }
  Update(UpdateMatlRetFrmDept:any){
    return this.http.post(environment.Api +'/Inventory/Post_MaterialRecivedFrmDept',UpdateMatlRetFrmDept)
  }
}

