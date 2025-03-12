import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupplierregApprovalTecService {

  constructor(private http: HttpClient) { }

  empid(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregApptecemp?empid=' + empid)
  }

  table() {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregApptectable')
  }

  input(code: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/supregApptecinp?code=' + code)
  }
  approve(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/supregApptec', data)
  }
}
