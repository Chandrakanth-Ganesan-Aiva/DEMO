import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class IndentEntryService {

  constructor(private http: HttpClient) { }

  Indentpath(LocationId: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/IndentEntryPath?LocationId=' + LocationId)
  }
  IndentTrano(IndentPath: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/IndentEntryTranno?IndentPath=' + IndentPath)
  }
  Dept(LocationID: any, Issuedate: any, Frmdate: any, Todate: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/IndentEntryDept?LocationID=' + LocationID + '&Frmdate=' + Frmdate +
      '&Todate=' + Todate)
  }
  Category(EmpId: any, LoactionId: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/Category?EmpId=' + EmpId + '&LoactionId=' + LoactionId)
  }
  Approvedby(LoactionId: any, Deptid: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/Approved?LoactionId=' + LoactionId + '&Deptid=' + Deptid)
  }
  Employye(LoactionId: any, CatId: any, Deptid: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/emp?LoactionId=' + LoactionId + '&CatId=' + CatId + '&Deptid=' + Deptid)
  }
  Material(LocationId: any, DeptId: any, Sr_Ref_No: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/IndentMaterial?LocationId=' + LocationId + '&DeptId=' + DeptId + '&Sr_Ref_No=' + Sr_Ref_No)
  }
  SrRefNo(LocationID: any, Frmdate: any, Todate: any, Deptid: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/Sp_IndentEntry_SrRefno?LocationID=' + LocationID + '&Frmdate=' + Frmdate +
      '&Todate=' + Todate + '&Deptid=' + Deptid)
  }
  ViewStoreRelease(LocationID: any, Srnewtype: any, Frmdate: any, Todate: any, Deptid: any, Empid: any, Rawmatid: any, Sr_Ref_No: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/ViewStoreRelease?LocationID=' + LocationID + '&Srnewtype=' + Srnewtype + '&Frmdate=' + Frmdate +
      '&Todate=' + Todate + '&Deptid=' + Deptid + '&Empid=' + Empid + '&Rawmatid=' + Rawmatid + '&Sr_Ref_No=' + Sr_Ref_No)
  }
  IndentDet(LocationId: any, SRDate: any, RawMatId: any, DeptId: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/StoreIndentDetl?LocationId=' + LocationId + '&SRDate=' + SRDate + '&RawMatId=' + RawMatId +
      '&DeptId=' + DeptId)
  }
  PoPendingQty(LoactionId: any, RawmatId: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/PendingPoQty?LoactionId=' + LoactionId + '&RawmatId=' + RawmatId)
  }
  Prid() {
    return this.http.get(environment.Api + '/Purchase/Transactions/PridData')
  }
  UpateRecords(SrId: any) {
    return this.http.get(environment.Api + '/Purchase/Transactions/Updaterecords?SrId=' + SrId)
  }
  Update(UpdateIndentEntry: any) {
    return this.http.post(environment.Api + '/Purchase/Transactions/UpdateIndentEntry', UpdateIndentEntry)
  }
}
