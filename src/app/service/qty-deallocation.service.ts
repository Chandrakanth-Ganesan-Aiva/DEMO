import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class QtyDeallocationService {

  constructor(private http:HttpClient) { }

  Suppiler(SupName:any){
    return this.http.get(environment.Api +'/Transaction/QtyDeallocSupllier?SupName='+SupName)

  }
  Rawmaterial(RawMatName:any){
    return this.http.get(environment.Api +'/Transaction/QtyDellocMaterial?RawMatName='+RawMatName)
  }
  ViewDet(LoactionId:any,SupplierId:any,Frmdate:any,Todate:any){
    return this.http.get(environment.Api +'/Transaction/QtyDellocViewDet?LoactionId='+LoactionId+'&SupplierId='+SupplierId+
      '&Frmdate='+Frmdate+'&Todate='+Todate)

  }
  Update(QtyDellocUpdate:any){
    return this.http.put(environment.Api +'/Transaction/QtyDellocUpdate',QtyDellocUpdate)
  }
}

