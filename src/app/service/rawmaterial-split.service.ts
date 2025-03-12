import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class RawmaterialSplitService {

  constructor(private http:HttpClient) { }
  getRawMaterial(){
    return this.http.get(environment.Api +'/Inventory/RawMatSplit-Material');
  }
  getRawmaterialView(rawmatid:any,fromdate:any,todate:any,locationid:any){
    return this.http.get(environment.Api +'/Inventory/RawMatSplit-View?rawmatid='+rawmatid+'&fromdate='+fromdate+'&todate='+todate+'&locationid='+locationid) 
  }
  getRawMatTabel(rawmatid:any){
    return this.http.get(environment.Api +'/Inventory/RawMatSplit-TabelRawmat?rawmatid='+rawmatid)
  }
  Update(RawMatSplitupdate:any){
    return this.http.post(environment.Api +'/Inventory/RawMatSplitupdate',RawMatSplitupdate)
  }
}
