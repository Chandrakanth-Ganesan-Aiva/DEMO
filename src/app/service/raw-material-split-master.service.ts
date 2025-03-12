import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../environments/environment';
import { environment } from 'src/environments/environment.development'


@Injectable({
  providedIn: 'root'
})
export class RawMaterialSplitMasterService {
 
  constructor(private http: HttpClient) { }
  
  Material(){
    return this.http.get(`${environment.Api}/Inventory/GrnWithoutbillEntry_Supplier`);
  }
}
