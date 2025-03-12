import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class ReworkissueService {


 
  constructor(private http: HttpClient) {

  }
  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api +'/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }
  Dept(LocationId:any,Frmdate:any,Todate:any){
    return this.http.get(environment.Api +'/Inventory/Rework-dept?LocationId='+LocationId+'&Frmdate='+Frmdate+'&Todate='+Todate)
  }
  RefNo(LocationId:any,Currdate:any,Deptid:any){
    return this.http.get(environment.Api +'/Inventory/Rework-Refno?LocationId='+LocationId+'&Currdate='+Currdate+'&Deptid='+Deptid)
  }
  Material(Locationid:any,Deptid:any,SrRefNo:any){
    return this.http.get(environment.Api +'/Inventory/Rework-Matl?Locationid='+Locationid+'&Deptid='+Deptid+'&SrRefNo='+SrRefNo)
  }
  View(LocationId:any,CurrDate:any,Deptid:any,SRNO:any,Rawmatid:any){
    return this.http.get(environment.Api +'/Inventory/Rework-ViewDet?LocationId='+LocationId+'&CurrDate='+CurrDate+'&Deptid='+Deptid+'&SRNO='+SRNO+'&Rawmatid='+Rawmatid)
  }
  Warehouse(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/Rework-Warehouse?LocationId='+LocationId)
  }
  Stock_grnid(LocationId:any,Rawmatid:any){
    return this.http.get(environment.Api +'/Inventory/Rework-stockgrnid?LocationId='+LocationId+'&Rawmatid='+Rawmatid)
  }
  UpdateGrnid(Grnid:any){
    return this.http.get(environment.Api +'/Inventory/SubconInwardQtyUpdate?Grnid='+Grnid)
  }
  issuedetalis(ReworkIssueWarehouseValue:any,Rawmatid:any,LocationId:any){
      return this.http.get(environment.Api +'/Inventory/Rework-checkstock?ReworkIssueWarehouseValue='+ReworkIssueWarehouseValue+'&Rawmatid='+Rawmatid+'&LocationId='+LocationId)
  }
  Update(ReworkIssueUpdate:any){
    return this.http.post(environment.Api +'/Inventory/ReworkIssueUpdate',ReworkIssueUpdate)
  }
}
