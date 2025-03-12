import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class StorageQtyAllocationService {

  constructor(private http: HttpClient) {

  }

  Items(rawmatname:any){
    return this.http.get(environment.Api +'/Inventory/StorageQtyAlloc-Items?rawmatname='+rawmatname);
  }
  View(LocationId:any,Productid:any,Fromdate:any,Todate:any,Pending:any){
    return this.http.get(environment.Api +'/Inventory/ViewStockAlloc?LocationId='+LocationId+'&Productid='+Productid+'&Fromdate='+Fromdate+'&Todate='+Todate+"&Pending="+Pending)
  }
  Warehouse(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/Stockalloc-Warehouse?LocationId='+LocationId)
  }
  Warhouse1(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/Stockalloc-Warehouse1?LocationId='+LocationId)
  }
  WarehouseName(LocationId:any){
    return this.http.get(environment.Api +'/Inventory/Stockalloc-WarehouseName?LocationId='+LocationId)
  }
  Save(UpdateStock:any){
    return this.http.post(environment.Api +'/Inventory/Post_Stockalloc-save',UpdateStock)
  }
}
