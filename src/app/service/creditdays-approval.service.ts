import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CreditdaysApprovalService {


  constructor(private http: HttpClient) { }

  load(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/crdaysload?empid=' + empid)
  }

  table() {
    return this.http.get(environment.Api + '/Purchase/Approvals/crdaystable')
  }

  approve(data: any[]) {
    console.log(data, 'approve');

    return this.http.put(environment.Api + '/Purchase/Approvals/crdaysapprove', data)
  }

  reject(data: any[]) {
    console.log(data, 'reject');
    return this.http.put(environment.Api + '/Purchase/Approvals/crdaysreject', data)
  }
}
