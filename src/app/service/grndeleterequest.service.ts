import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class GrndeleterequestService {

  constructor(private http: HttpClient) {

  }


  supplier(LoactionId: any, Frmdate: any, Todate: any, Module: any) {
    return this.http.get(environment.Api + '/Approval/GrnDelete_Supplier?LoactionId=' + LoactionId + '&Frmdate=' + Frmdate +
      '&Todate=' + Todate + '&Module=' + Module)
  }
  supplierView(LoactionId: any, Frmdate: any, Todate: any, Supid: any, Module: any) {
    return this.http.get(environment.Api + '/Approval/GrnDelete_SupplierView?LoactionId=' + LoactionId + '&Frmdate=' + Frmdate +
      '&Todate=' + Todate + '&Supid=' + Supid + '&Module=' + Module)
  }
  Material(Grn_Ref_No: any) {
    return this.http.get(environment.Api + '/Approval/GrnDelete_Rawmterial?Grn_Ref_No=' + Grn_Ref_No)
  }
  Tax(Grn_Ref_No: any) {
    return this.http.get(environment.Api + '/Approval/GrnDelete_Tax?Grn_Ref_No=' + Grn_Ref_No)
  }
  Update(UpdateGrnDeleteReq: any) {
    return this.http.post(environment.Api + '/Approval/UpdateGrnDeleteReq', UpdateGrnDeleteReq)
  }
}
