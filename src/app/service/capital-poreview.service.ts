import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CapitalPOReviewService {

  constructor(private http: HttpClient) { }


  load(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/CapitalPOLoad?empid=' + empid)
  }

  table() {
    return this.http.get(environment.Api + '/Purchase/Approvals/CapitalPOtable')
  }
  review(data: any) {
    return this.http.post(environment.Api + '/Purchase/Approvals/CapitalPOreview', data)
  }
}
