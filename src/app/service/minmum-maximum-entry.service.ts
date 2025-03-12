import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class MinmumMaximumEntryService {

  constructor(private http: HttpClient) { }


  Category() {
    return this.http.get(environment.Api +'/master/MinMaxCategory')
  }
  Unit(LocationId:any){
    return this.http.get(environment.Api +'/master/MinmaxUnit?LocationId='+LocationId)
  }
  Material(locationId:any,CategoryID:any){
    return this.http.get(environment.Api +'/master/MinmaxMaterial?locationId='+locationId+'&CategoryID='+CategoryID)
  }
  Update(MinMaxUpdate:any){
    return this.http.put(environment.Api +'/master/MinMaxUpdate',MinMaxUpdate)
  }
}
