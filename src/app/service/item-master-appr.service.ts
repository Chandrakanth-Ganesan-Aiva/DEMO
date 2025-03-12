import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class ItemMasterApprService {

  constructor(private http:HttpClient) { }

  Dept(LocationId:any){
    return this.http.get(environment.Api +'/master/itemMasterAppr-Dept?LocationId='+LocationId);
  }
  View(Deptid:any,Locationid:any){
    return this.http.get(environment.Api +'/master/itemMasterAppr-View?Deptid='+Deptid+'&Locationid='+Locationid)
  }
  Uom(){
    return this.http.get(environment.Api +'/master/itemMasterAppr-uom')
  }
  Grade(){
    return this.http.get(environment.Api +'/master/itemMasterAppr-grade')
  }
  GradeId(GradeId:any){
    return this.http.get(environment.Api +'/master/itemMasterAppr-gradeid?GradeId='+GradeId)
  }
  GrnType(){
    return this.http.get(environment.Api +'/master/itemMasterAppr-grntype')
  }
  GrnTypeId(GrntypeId:any){
    return this.http.get(environment.Api +'/master/itemMasterAppr-grntypeId?grntypeid='+GrntypeId)
  }
  email(empid:any){
    return this.http.get(environment.Api +'/master/itemMasterAppr-email?empid='+empid)
  }
  TabelDept(deptid:any){
    return this.http.get(environment.Api +'/master/itemMasterAppr-tabelDept?&deptid='+deptid)
  }
  hsncode(){
    return this.http.get(environment.Api +'/master/itemMasterAppr-hsncode')
  }
  update(itemMasterApprupdate:any){
    return this.http.post(environment.Api +'/master/itemMasterApprUpdate',itemMasterApprupdate)
  }

  Mail(){
    return this.http.get(environment.Api +'/master/itemMasterApprMail')
  }
} 
