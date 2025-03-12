import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class IssueRequestService {
  
  constructor(private http: HttpClient) { }
  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api +'/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }
  StockReNoVaildation(StoreReqno: any) {
    return this.http.get(environment.Api +'/Inventory/StoreReqNoValidation?StoreReqno=' + StoreReqno)
  }
  CapexNo(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/CapexNo?LocationId='+LocationId)
  }
  Tollt(LoactionId: any, RawMatId: any) {
    return this.http.get(environment.Api +'/Inventory/Tolltt?LoactionId=' + LoactionId + '&RawMatId=' + RawMatId)
  }
  Department(Empid: any,locationid:any) {
    return this.http.get(environment.Api +'/Inventory/Department?Empid=' + Empid+'&locationid='+locationid)
  }
  RawMat(Rawmatname: any) {
    return this.http.get(environment.Api +'/Inventory/storetostore_Material?Rawmatname=' + Rawmatname)
  }
  Uom(RawMatId: any) {
    return this.http.get(environment.Api +'/Inventory/ProductUom?RawMatId=' + RawMatId)
  }
  IndentDet(LocationId: any, SRDate: any, RawMatId: any, DeptId: any) {
    return this.http.get(environment.Api +'/Inventory/StoreIndentDetl?LocationId=' + LocationId + '&SRDate=' + SRDate + '&RawMatId=' + RawMatId + '&DeptId=' + DeptId)
  }
  IssueLocId(empid:any){
    return this.http.get(environment.Api +'/Inventory/IssueLocid?empid='+empid)
  }
  StockAvl(FrmModule: any, IndentType: any, Issuelocationwise: any, MaterialId: any, LoactionId: any, EmpId: any, Issuelocid: any) {
    return this.http.get(environment.Api +'/Inventory/StockCheck?FrmModule=' + FrmModule + '&IndentType=' + IndentType + '&Issuelocationwise=' + Issuelocationwise + '&MaterialId=' + MaterialId + '&LoactionId=' + LoactionId + '&EmpId=' + EmpId + '&Issuelocid=' + Issuelocid)
  }
  StoreLoaction(LoactionId:any,Rawmatid:any){
    return this.http.get(environment.Api +'/Inventory/StoreLoaction?LoactionId='+LoactionId+'&Rawmatid='+Rawmatid)
  }
  Machine(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/Machinename?LocationId='+LocationId)
  }
  Warehouse(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/Warehouse?LocationId='+LocationId )
  }
   MatQtyPending(LocationId:any,Rawmatid:any){
    return this.http.get(environment.Api +'/Inventory/MatQtypendingsts?LocationId='+LocationId+'&Rawmatid='+Rawmatid)
  }
  OldPOView(locid:any,Rawmatid:any){
    return this.http.get(environment.Api +'/Inventory/OldPoView?locid='+locid+'&Rawmatid='+Rawmatid)
  }
  IntendPendingView(LocationId:any,RawMatID:any){
    return this.http.get(environment.Api +'/Inventory/IndentPendingViewDet?LocationId='+LocationId+'&RawMatID='+RawMatID)
  }
  Grntype(RawMatId:any){
    return this.http.get(environment.Api +'/Inventory/Grntypeid?RawMatId='+RawMatId)
  }
  save(IssueReqSave:any){
    return this.http.post(environment.Api +'/Inventory/Post_IssueReq',IssueReqSave)
  }
}
