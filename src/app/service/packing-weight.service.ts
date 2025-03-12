import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class PackingWeightService {
  constructor(private http:HttpClient) { }

  getMatl(MatName:any){
    return this.http.get(environment.Api +'/master/PackingWeightMatl?rawmatname='+MatName);
  }
  getMatlView(){
    return this.http.get(environment.Api +'/master/PackingWeightMatldetView')
  }
  Update(PackingWeightUpdate:any){
    return this.http.post(environment.Api +'/master/PackingWeightUpdate',PackingWeightUpdate)
  }
}
