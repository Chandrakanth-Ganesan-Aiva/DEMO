import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class GrnEntryService {

  constructor(private http: HttpClient) { }
  gateEntryDelay(locationid: any) {
    return this.http.get(environment.Api + '/Inventory/GrnGateEntryDelayChk?locationid=' + locationid)
  }
  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api + '/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }
  GrnEntryType() {
    return this.http.get(environment.Api + '/Inventory/GrnEntryType')
  }
  GrnEntryParty() {
    return this.http.get(environment.Api + '/Inventory/GrnEntryParty')
  }
  GrnCreditPeriod(supid: any) {
    return this.http.get(environment.Api + '/Inventory/GrnCreditPeriod?supid=' + supid)
  }
  GrmGateEntry(partyid: any, locationid: any, supid: any) {
    return this.http.get(environment.Api + '/Inventory/GrnGateEntryNo?partyid=' + partyid + '&locationid=' + locationid + '&supid=' + supid)
  }
  GrnMaterial(SupId: any, LocationID: any) {
    return this.http.get(environment.Api + '/Inventory/GrnMaterialTable?SupId=' + SupId + '&LocationID=' + LocationID)
  }
  GrnMaterialTabel(SupId: any, LocationID: any) {
    return this.http.get(environment.Api + '/Inventory/GrnMaterialTable?SupId=' + SupId + '&LocationID=' + LocationID)
  }
  GrnWeightTabel(locationId: any, CustId: any, GateEntry_Ref_No: any, DcDate: any) {
    return this.http.get(environment.Api + '/Inventory/GrnWeightListTabel?locationId=' + locationId + '&CustId=' + CustId + '&GateEntry_Ref_No=' + GateEntry_Ref_No + '&DcDate=' + DcDate)
  }
  GrnGateEntrydelayVaild(GatEntryRefNo: any) {
    return this.http.get(environment.Api + '/Inventory/GrnGateEntryVaild?TranMasId=' + GatEntryRefNo)
  }
  GrnPackingWt(rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/GrnPackWtCalc?rawmatid=' + rawmatid)
  }
  GrnPackingWt1(rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/GrnPackWtCalc?rawmatid=' + rawmatid)
  }
  GrnShelflife(rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/GrnShelfLife?rawmatid=' + rawmatid)
  }
  GrnInspecReq(rawmatid: any) {
    return this.http.get(environment.Api + '/Inventory/GrnInspecReq?rawmatid=' + rawmatid)
  }
  GrnPoDetailTable(Supid: any, rawmatid: any, locationid: any) {
    return this.http.get(environment.Api + '/Inventory/GrnPoDetailTable?Supid=' + Supid + '&rawmatid=' + rawmatid + '&locationid=' + locationid)
  }
  GrnTolType(rawmatid:any,supid:any){
    return this.http.get(environment.Api +'/Inventory/GrnTolType?rawmatid='+rawmatid+'&supid='+supid)
  }
  GrnCurrency(CurrID: any) {
    return this.http.get(environment.Api + '/Inventory/Grncurrencymaster?CurrID=' + CurrID)
  }
  GrnClearingAgent() {
    return this.http.get(environment.Api + '/Inventory/GrnClearingAgent')
  }
  GrnLinear() {
    return this.http.get(environment.Api + '/Inventory/GrnLinear')
  }
  GrnTaxType() {
    return this.http.get(environment.Api + '/Inventory/GrnTaxType')
  }
  GrnPort() {
    return this.http.get(environment.Api + '/Inventory/GrnPort')
  }
}
