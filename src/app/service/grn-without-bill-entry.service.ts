import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class GrnWithoutBillEntryService {
  constructor(private http:HttpClient) { }

  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api +'/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }
  Supplier(){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutbillEntry_Supplier')
  }
  Pono(){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutbillEntry_PONO')
  }
  gateentry(PartyID:any,locationid:any,supid:any){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutbillEntry_GateEntry?PartyID='+PartyID+'&locationid='+locationid+'&supid='+supid)
  }
  Material(rawmatname:any){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutEntry_Material?rawmatname='+rawmatname)
  }
  WithWeighment(DcDate:any,locationid:any,gateentryno:any,custid:any){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutbillEntry_WithWeighment?trandate='+DcDate+'&locationid='+locationid+'&gateentryno='+gateentryno+'&custid='+custid)
  }
  WithWeighment_Rate(rawmatid:any,locationid:any,currid:any){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutbillEntry_WithWeighmentChange-Rate?rawmatid='+rawmatid+'&locationid='+locationid+'&currid='+currid)
  }
  WithWeighment_NeWeight(locationid:any,gateentryno:any,custid:any){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutbillEntry_WithWeighmentChange-NetWight?locationid='+locationid+'&gateentryno='+gateentryno+'&custid='+custid)
  }
  Price(WeighmentType:any,SupId:any,RawMatid:any,LocationId:any,Currid:any,DcDate:any){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutbillEntry_Price?WeighmentType='+WeighmentType+'&SupId='+SupId+'&RawMatid='+RawMatid+'&LocationId='+LocationId+'&Currid='+Currid+'&DcDate='+DcDate)
  }
  WithWeigmentTabel(WeighmentType:any,SupId:any,RawMatid:any,LocationId:any,Currid:any,GateEntryNo:any,DcDate:any){
    return this.http.get(environment.Api +'/Inventory/GrnWithoutbillEntry_Price?WeighmentType='+WeighmentType+'&SupId='+SupId+
      '&RawMatid='+RawMatid+'&LocationId='+LocationId+'&Currid='+Currid+'&GateEntryNo='+GateEntryNo+'&DcDate='+DcDate)
  }
  Save(GrnWithoutBillEntryHrd:any){
    return this.http.post(environment.Api+'/Inventory/GrnWithoutBillEntryHrd',GrnWithoutBillEntryHrd)
  }
}
