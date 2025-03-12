import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupplierregAppPurService {

  constructor(private http: HttpClient) { }
  load(empid: any) {
    return this.http.get(environment.Api + "/Purchase/Approvals/suppregAppPurchaseload?empid=" + empid)
  }
  organisation() {
    return this.http.get(environment.Api + "/Purchase/Approvals/suppregAppPurchaseorganisation")
  }
  table() {
    return this.http.get(environment.Api + '/Purchase/Approvals/suppregAppPurchasetable')
  }
  input(code: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppPurchaseinp?code=' + code)
  }
  org(id: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregAppPurchaseorg?id=' + id)
  }
  approve(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/supregAppPurchase', data)
  }

}
