import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class PDRawmaterialChangeService {
  constructor(private http:HttpClient) { }
  Location(LocationId:any){
    return this.http.get(environment.Api +'/master/PD_MaterialChange-Location?LocationId='+LocationId);
  }
  Product(companyid:any){
    return this.http.get(environment.Api +'/master/PD_MaterialChange-Product?companyid='+companyid)
  }
  Pd(prodid:any,companyid:any){
    return this.http.get(environment.Api +'/master/PD_MaterialChange-Pd?prodid='+prodid+'&companyid='+companyid)
  }
  Process(pdid:any,companyid:any){
    return this.http.get(environment.Api +'/master/PD_MaterialChange-Process?pdid='+pdid+'&companyid='+companyid)
  }
  Material(ProcessId:any){
    return this.http.get(environment.Api +'/master/PD_MaterialChange-Material?forgedetailid='+ProcessId)
  }
  MaterialAll(rawmatname:any){
    return this.http.get(environment.Api +'/master/PD_MaterialChange-AllMaterial?rawmatname='+rawmatname)
  }
  Update(PdMaterialChangeUpdate:any){
    return this.http.post(environment.Api +'/master/PdMaterialChangeUpdate',PdMaterialChangeUpdate)
  }
}
