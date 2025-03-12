import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'

@Injectable({
  providedIn: 'root'
})
export class WeighprintoutDaimlrService {


  constructor(private http: HttpClient) { }

  Customer() {
    return this.http.get(environment.Api +'/Weighment/WeighPrintoutCustomer')
  }
  GetDetalis() {
    return this.http.get(environment.Api +'/Weighment/WeighPrintoutView')
  }
  Update(WeighPrintUpdate: any) {
    return this.http.put(environment.Api +'/Weighment/WeighPrintoutUpdate', WeighPrintUpdate)
  }
}
