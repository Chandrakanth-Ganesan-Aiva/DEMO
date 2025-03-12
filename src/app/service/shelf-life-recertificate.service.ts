import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class ShelfLifeRecertificateService {
  private apiurl='192.168.203.59:4000'
  constructor(private httpClient: HttpClient) { }

  shelfDet(Locationid:any){
    return this.httpClient.get(environment.Api +'/Inventory/selflifeRecertificateDet?locationid='+Locationid);
  }
  update(SleflifeRecerticateUpdate:any){
    return this.httpClient.post(environment.Api +'/Inventory/SleflifeRecerticateUpdate',SleflifeRecerticateUpdate);
  }
}

