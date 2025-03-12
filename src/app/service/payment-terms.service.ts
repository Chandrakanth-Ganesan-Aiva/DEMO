import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentTermsService {

  constructor(private http: HttpClient) { }

  load() {
    return this.http.get(environment.Api + ('/Purchase/Master/mastpaytermLoad'))
  }
  table1(termid: any) {
    return this.http.get(environment.Api + ('/Purchase/Master/mastpaytermtbl?termid=' + termid))
  }
  condition(terms: any) {
    return this.http.get(environment.Api + '/Purchase/Master/mastpaytermcon?terms=' + terms)
  }
  terms(data: any) {
    return this.http.post(environment.Api + '/Purchase/Master/mastpaytermid', data)
  }
  save(data: any) {
    return this.http.post(environment.Api + '/Purchase/Master/mastpaytermsave', data)
  }

}
