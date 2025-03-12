import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class Poclose3Service {


  constructor(private http: HttpClient) { }

  load(empid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/poclose3load?empid=' + empid)
  }
  table() {
    return this.http.get(environment.Api + '/Purchase/Approvals/poclose3table')
  }
  approve(data: any) {
    return this.http.put(environment.Api + '/Purchase/Approvals/poclose3approve', data)
  }
}
