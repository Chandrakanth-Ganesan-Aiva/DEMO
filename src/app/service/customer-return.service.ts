import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class CustomerReturnService {
  constructor(private http :HttpClient) { }
  Stockreno(mid: Number, trandate: any, locid: any) {
    return this.http.get(environment.Api +'/Inventory/StockReqNo?mid=' + mid + '&trandate=' + trandate + '&locid=' + locid)
  }
  CostCenter(){
    return this.http.get(environment.Api +'/Inventory/CustReturnCostCenter')
  }
  Customer(custname:any){
    return this.http.get(environment.Api +'/Inventory/CustReturnSupp?custname='+custname)
  }
  GateEntry(PartyID:any,locationid:any,supid:any){
    return this.http.get(environment.Api +'/Inventory/CustReturnGateentry?PartyID='+PartyID+'&locationid='+locationid+'&supid='+supid)
  }
  
  // ----------------------------------Customer Rejection General----------------------------------------------

  Product(custid:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejectionProduct?custid='+custid)
  }

  QfbrefNo(custid:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_QfbrefNo?custid='+custid)
  }

  Uom(ProdID:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Uom?ProdID='+ProdID)
  }

  Invoice(custid:any,ProdID:any,Locationid:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_invoice?custid='+custid+'&ProdID='+ProdID+'&Locationid='+Locationid)
  }
  Grade(prodid:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Grade?prodid='+prodid)
  }

  Grade1(){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Grade1')
  }

  RateQc(companyid:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_RateQc?companyid='+companyid)
  }

  landedprice(GradeId:any,ProdId:any,Qfbno:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Landprice?GradeId='+GradeId+'&ProdId='+ProdId+'&Qfbno='+Qfbno)
  }

  Price(invoiceId:any,prodId:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Price?invid='+invoiceId+ '&prodid='+prodId)
  }

  Price1(invoiceId:any,prodId:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Price1?invid='+invoiceId+ '&prodid='+prodId)
  }

  Tax(invoiceNo:any,ProdId:any,custid:any,locationid:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Tax?invno='+invoiceNo+'&ProdId='+ProdId+'&custid='+custid+'&locationid='+locationid)
  }
  Currency(){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Currency')
  }
  Rate(custid:any,prodid:any,locationid:any){
    return this.http.get(environment.Api +'/Inventory/CusRetCusRejection_Rate?custid='+custid+'&prodid='+prodid+'&locationid='+locationid)
  }
}
