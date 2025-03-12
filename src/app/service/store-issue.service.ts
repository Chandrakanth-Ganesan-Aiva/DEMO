import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development'

@Injectable({
  providedIn: 'root'
})
export class StoreIssueService {

  constructor(private http: HttpClient) {

  }

  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api +'/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }

  Department(LocationID:any,Issuedate:any,Frmdate:any,Todate:any){
    return this.http.get(environment.Api +"/Inventory/StoreIssue-Department?LocationID="+LocationID+'&Issuedate='+Issuedate+'&Frmdate='+Frmdate+
      '&Todate='+Todate)
  }
  Refno(Locationid:any,Issuedate:any,Frmdate:any,Todate:any,Deptid:any){
    return this.http.get(environment.Api +"/Inventory/StoreIssueRefno?Locationid="+Locationid+'&Issuedate='+Issuedate+
      '&Frmdate='+Frmdate+'&Todate='+Todate+'&Deptid='+Deptid)
  }
  warehousechck(SR_Ref_No:any){
    return this.http.get(environment.Api +"/Inventory/warehousechck?SR_Ref_No="+SR_Ref_No)
  }
  Warehouse(LocationId:any){
    return this.http.get(environment.Api +"/Inventory/StoreIssue-Warehouse?LocationId="+LocationId)
  }
  Rawmaterial(Locationid:any,Deptid:any,Fromdate:any,Todate:any,SrRefNo:any){
    return this.http.get(environment.Api +"/Inventory/StoreIssue-Material?Locationid="+Locationid+'&Deptid='+Deptid+'&Fromdate='+Fromdate+
    '&Todate='+Todate+'&SrRefNo='+SrRefNo)
  }
  IssueMaterialViewbtn(Locationid:any,Issuedate:any,WarehouseId:any,Deptid:any,Srno:any,Rawmatid:any,Frmdate:any,Todate:any){
    return this.http.get(environment.Api +"/Inventory/StoreIssue-ViewMaterial?Locationid="+Locationid+'&Issuedate='+Issuedate+'&WarehouseId='+WarehouseId+
    '&Deptid='+Deptid+'&Srno='+Srno+'&Rawmatid='+Rawmatid+'&Frmdate='+Frmdate+'&Todate='+Todate )
  }
  StockDepands(CompanyName:any,Rawmatid:any,Locationid:any,Warehouseid:any){
    return this.http.get(environment.Api +"/Inventory/StoreIssue-StockDepandsCompany?CompanyName="+CompanyName+'&Rawmatid='+Rawmatid+'&Locationid='+Locationid+'&Warehouseid='+Warehouseid)
  }
  IndentDet(LocationId:any,SRDate:any,RawMatId:any,DeptId:any){
    return  this.http.get(environment.Api +"/Inventory/StoreIndentDetl?LocationId="+LocationId+'&SRDate='+SRDate+'&RawMatId='+RawMatId+'&DeptId='+DeptId)
    }
  GmRefNo(Warehouseno:any,Rawmatid:any,Locationid:any){
    return this.http.get(environment.Api +"/Inventory/StoreIssue-GmRefNo?Warehouseno="+Warehouseno+'&Rawmatid='+Rawmatid+'&Locationid='+Locationid)
  }
  StockCheck(IssueQty:any,Rawmatid:any,Warehousevalue:any,GrnId:any,Locationid:any){
    return this.http.get(environment.Api +"/Inventory/StoreIssue-StockCheck?IssueQty="+IssueQty+'&Rawmatid='+Rawmatid+'&Warehousevalue='+Warehousevalue+'&GrnId='+GrnId+'&Locationid='+Locationid)
  }
  Batch(Grnid:any){
    return this.http.get(environment.Api +"/Inventory/Storeissue-Batchwise?Grnid="+Grnid)
  }
  Save(UpdateStoreIssue:any){
    return this.http.post(environment.Api +"/Inventory/Post_StoreIssue",UpdateStoreIssue)
  }


  // ----------------------ScreenLock Update back button OR logout Click----------------------------
  screenlockvaild(MenuId: any, LocationId: any) {
    return this.http.get(environment.Api +"/Inventory/Lockscrnvaildation?MenuId=" + MenuId + '&LocationId=' + LocationId)
  }
  Updatelogoutime(Updatelockscreen:any) {
    return this.http.post(environment.Api +"/Inventory/Updatelockscreen",Updatelockscreen)
  }
}
