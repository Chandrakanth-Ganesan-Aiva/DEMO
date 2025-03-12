import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClearingApprovalService {


  constructor(private http: HttpClient) { }

  Approver(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreightApprovedBy?empid=' + empid)
  }

  table1(Locationid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreighttable1?locationid=' + Locationid)
  }

  table2(tranid: any, Locationid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreighttable2?tranid=' + tranid + '&locationid=' + Locationid)
  }

  handlingcharge(locationid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreightHandlingCharges?locationid=' + locationid)
  }

  AgenciesCharges(locationid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreightAgenciesCharges?locationid=' + locationid)
  }

  CFSCharge(locationid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreightCFSCharges?locationid=' + locationid)
  }

  LinearCharge(locationid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreightLinerCharges?locationid=' + locationid)
  }

  LinerAdditionalCharges(locationid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreightLinerAdditionalCharges?locationid=' + locationid)
  }

  TransportCharges(locationid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/clearingfreightTransportCharges?locationid=' + locationid)
  }

  approve(data: any) {
    console.log(data);

    return this.http.post(environment.Api + '/Purchase/Approvals/clearingfreightapprove', data)
  }
}
