import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'


@Injectable({
  providedIn: 'root'
})
export class CODApproveService {


  constructor(private http: HttpClient) { }

  load(LocationId: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/CODLoad?LocationId=' + LocationId)
  }

  table(LocationId: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/CODtable?LocationId=' + LocationId)
  }
  approve(data: any) {
    console.log(data, 'data');

    return this.http.post(environment.Api + '/Purchase/Approvals/CODapprove', data)
  }
}
