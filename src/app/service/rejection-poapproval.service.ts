import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'


@Injectable({
  providedIn: 'root'
})
export class RejectionPOApprovalService {

  constructor(private http: HttpClient) { }
  Supplier() {
    return this.http.get(environment.Api + '/Purchase/Approvals/rejPOsupplier')
  }
  allSupplier(LocationId: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/rejPOAll_Supplier?LocationId=' + LocationId)
  }
  oneSupplier(LocationId: number, supid: number) {
    return this.http.get(environment.Api + '/Purchase/Approvals/rejPOsupplierid?LocationId=' + LocationId + '&supid=' + supid)
  }
  Approve(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/rejPOApprove', data)
  }
}
