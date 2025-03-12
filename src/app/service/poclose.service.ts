import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'

@Injectable({
  providedIn: 'root'
})
export class POCloseService {

  constructor(private http: HttpClient) { }

  Load() {
    return this.http.get(environment.Api + '/Purchase/Approvals/POCloseLoad')
  }
  supplier(type: any, locationid: any, from: any, to: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/POCloseSupplier?type=' + type + '&Locationid=' + locationid + '&From=' + from + '&To=' + to + '')
  }
  table(type: any, Locid: any, supid: any, typeid: any, from: any, to: any, subconid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/POCloseTable?type=' + type + '&Locationid=' + Locid + '&supid=' + supid + '&popurtypeid=' + typeid + '&From=' + from + '&To=' + to + '&subconid=' + subconid + '')
  }
  viewall(type: any, Locid: any, from: any, to: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/POCloseViewall?type=' + type + '&Locationid=' + Locid + '&From=' + from + '&To=' + to + '')
  }
  update(data: any) {
    console.log(data, 'data');
    return this.http.post(environment.Api + '/Purchase/Approvals/POCloseUpdate', data)
  }
}
