import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestService {

  constructor(private http: HttpClient) {

  }

  Capex(Empid:any){
    return this.http.get(environment.Api +'/Inventory/Capexvisibile?Empid='+Empid)
  }
  Department(Empid:any){
    return this.http.get(environment.Api +'/Inventory/Department?Empid='+Empid)
  }
  Company(){
    return this.http.get(environment.Api +'/Inventory/company')
  }
  CompName(CompanyId:any){
    return this.http.get(environment.Api +'/Inventory/companyname?CompanyId='+CompanyId)
  }
  CapexNo(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/CapexNo?LocationId='+LocationId)
  }
  CapexValidationDept(empid:any){
    return this.http.get(environment.Api +'/Inventory/CapexDepartment?empid='+empid)
  }
  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api +'/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }
  StockReNoValidation(StockReqNo:any){
    return this.http.get(environment.Api +'/Inventory/StockReqNochck?StockReqNo='+StockReqNo)
  }
  Rawmaterial(locationid: any, Rawmatname: any) {
    return this.http.get(environment.Api +'/Inventory/Get_RawMaterial?locationid=' + locationid +'&Rawmatname='+Rawmatname)

  }
  IndentDet(LocationId:any,SRDate:any,RawMatId:any,DeptId:any){
  return  this.http.get(environment.Api +'/Inventory/StoreIndentDetl?LocationId='+LocationId+'&SRDate='+SRDate+'&RawMatId='+RawMatId+'&DeptId='+DeptId)
  }
  IntendPendingView(LocationId:any,RawMatID:any){
    return this.http.get(environment.Api +'/Inventory/IndentPendingViewDet?LocationId='+LocationId+'&RawMatID='+RawMatID)
  }
  IssueLocId(empid:any){
    return this.http.get(environment.Api +'/Inventory/IssueLocid?empid='+empid)
  }
  StockAvl(FrmModule:any,IndentType:any,Issuelocationwise:any,MaterialId:any,LoactionId:any,EmpId:any,Issuelocid:any){
    return this.http.get(environment.Api +'/Inventory/StockCheck?FrmModule='+FrmModule+'&IndentType='+IndentType+'&Issuelocationwise='+Issuelocationwise+'&MaterialId='+MaterialId+'&LoactionId='+LoactionId+'&EmpId='+EmpId+'&Issuelocid='+Issuelocid)
  }
  StoreLoaction(LoactionId:any,Rawmatid:any){
    return this.http.get(environment.Api +'/Inventory/StoreLoaction?LoactionId='+LoactionId+'&Rawmatid='+Rawmatid)
  }
  Uom(RawMatId:any){
    return this.http.get(environment.Api +'/Inventory/ProductUom?RawMatId='+RawMatId)
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
  Save(PurchaseReqSave:any){
    return this.http.post(environment.Api +'/Inventory/Post_PurchaseReq',PurchaseReqSave)
  }
}
