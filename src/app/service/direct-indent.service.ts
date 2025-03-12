import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development'

@Injectable({
  providedIn: 'root'
})
export class DirectIndentService {

  constructor(private http: HttpClient) {
  }

  PoPath(LoactionId: any, indentdate: any) {
    return this.http.get(environment.Api + '/Inventory/IndentNo?LoactionId=' + LoactionId + '&indentdate=' + indentdate)
    
  }
  IndentPONo(IndentNo: any) {
    return this.http.get(environment.Api + '/Inventory/IndentPONo?IndentNo=' + IndentNo)
  }
  Department( LoactionId:any,Empid: any) {
    return this.http.get(environment.Api + '/Inventory/DirectDepartment?LoactionId='+LoactionId+'&Empid='+Empid )
  }
  CostCenter() {
    return this.http.get(environment.Api + '/Inventory/CostCenter')
  }
  CapexNo(LoctionId: any) {
    return this.http.get(environment.Api + '/Inventory/CapexNo?LoctionId=' + LoctionId)
  }
  EmpApr(LocationId: any, DeptId: any, com_selename: any) {
    return this.http.get(environment.Api + '/Inventory/ApprovalEmployees?LocationId=' + LocationId + '&DeptId=' + DeptId + '&com_selename=' + com_selename)
  }
  EmpCat(Empid: any, LoctionId: any) {
    return this.http.get(environment.Api + '/Inventory/EmployeeCategory?Empid=' + Empid + '&LoctionId=' + LoctionId)
  }
  EmpDet(LoctionId: any, EmpId: any, CategoryId: any) {
    return this.http.get(environment.Api + '/Inventory/EmpDetalis?LoctionId=' + LoctionId + '&EmpId=' + EmpId + '&CategoryId=' + CategoryId)
  }
  RawMat(Rawmatname: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/RawMaterial?Rawmatname=' + Rawmatname + '&Rawmatid=' + Rawmatid)
  }
  IndentDet(LocationId: any, SRDate: any, RawMatId: any, DeptId: any) {
    return this.http.get(environment.Api + '/Inventory/StoreIndentDetl?LocationId=' + LocationId + '&SRDate=' + SRDate + '&RawMatId=' + RawMatId + '&DeptId=' + DeptId)
  }
  Uom(RawMatId: any) {
    return this.http.get(environment.Api + '/Inventory/ProductUom?RawMatId=' + RawMatId)
  }
  StockAvl(FrmModule: any, IndentType: any, Issuelocationwise: any, MaterialId: any, LoactionId: any, EmpId: any, Issuelocid: any) {
    return this.http.get(environment.Api + '/Inventory/StockCheck?FrmModule=' + FrmModule + '&IndentType=' + IndentType + '&Issuelocationwise=' + Issuelocationwise + '&MaterialId=' + MaterialId + '&LoactionId=' + LoactionId + '&EmpId=' + EmpId + '&Issuelocid=' + Issuelocid)
  }
  IssueLocId(empid: any) {
    return this.http.get(environment.Api + '/Inventory/IssueLocid?empid=' + empid)
  }
  StoreLoaction(LoactionId: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/StoreLoaction?LoactionId=' + LoactionId + '&Rawmatid=' + Rawmatid)
  }
  Machine(LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Machinename?LocationId=' + LocationId)
  }
  Warehouse(LocationId: any) {
    return this.http.get(environment.Api + '/Inventory/Warehouse?LocationId=' + LocationId)
  }
  OldPOView(locid: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/OldPoView?locid=' + locid + '&Rawmatid=' + Rawmatid)
  }
  IntendPendingView(LocationId: any, RawMatID: any) {
    return this.http.get(environment.Api + '/Inventory/IndentPendingViewDet?LocationId=' + LocationId + '&RawMatID=' + RawMatID)
  }
  MatQtyPending(LocationId: any, Rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/MatQtypendingsts?LocationId=' + LocationId + '&Rawmatid=' + Rawmatid)
  }
  Save(DirectIndentSave: any) {
    return this.http.post(environment.Api + '/Inventory/Post_DirectIndent', DirectIndentSave)
  }
}

