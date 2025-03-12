import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupplierregAppFinService {

  constructor(private http: HttpClient) { }

  load() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supRegAppFinload')
  }
  empid(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/suppregAppFinemp?empid=' + empid)
  }
  input(code: any) {
    return this.http.get(environment.Api + "/Purchase/Approvals/supregAppFininp?code=" + code)
  }
  currency(curr: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFincurrency?curr=' + curr)
  }
  partytype(CTypeId: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinpartyType?CTypeId=' + CTypeId)
  }
  pType() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinType')
  }
  ledgergrp() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinledgerGroup')
  }
  ledger(partygrp: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppFinledgerGrp?partygroup=' + partygrp)
  }
  approve(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/supregAppFinUp', data)
  }
}
