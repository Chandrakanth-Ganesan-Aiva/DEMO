import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class Poclose2Service {

  constructor(private http: HttpClient) { }



  load(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/poclose2load?empid=' + empid)
  }

  table() {
    return this.http.get(environment.Api + '/Purchase/Approvals/poclose2table')
  }

  approve(data: any) {
    return this.http.put(environment.Api + '/Purchase/Approvals/poclose2approve', data)
  }
}
