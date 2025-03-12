import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class StoretostoreService {

  constructor(private http: HttpClient) {  }


  Path(LocationId: any) {
    return this.http.get(environment.Api +'/Inventory/storepath?LocationId=' + LocationId)
  }
  Warehouse(LocationId: any): Observable<any> {
    return this.http.get(environment.Api +'/Inventory/storetostore-Warehouse?LocationId=' + LocationId)
  }
  Rawmaterial(Rawmatname: any) {
    return this.http.get(environment.Api +'/Inventory/storetostore_Material?Rawmatname=' + Rawmatname)
  }
  Deptid(Empid: any) {
    return this.http.get(environment.Api +'/Inventory/dept?Empid=' + Empid)
  }
  Stockchck(RawmatId: any, LocationId: any, FrmstoreId: any) {
    return this.http.get(environment.Api +'/Inventory/storetostore-Stockchck?RawmatId=' + RawmatId + '&LocationId=' + LocationId + '&FrmstoreId=' + FrmstoreId)
  }
  ViewStock(LocationId: any, WarehouseId: any, RawmatId: any) {
    return this.http.get(environment.Api +'/Inventory/storetostore-View?LocationId=' + LocationId + '&WarehouseId=' + WarehouseId + '&RawmatId=' + RawmatId)
  }
  save(StoreToStoreUpdate:any) {
    return this.http.post(environment.Api +'/Inventory/StoreToStoreUpdate',StoreToStoreUpdate)
  }
}
