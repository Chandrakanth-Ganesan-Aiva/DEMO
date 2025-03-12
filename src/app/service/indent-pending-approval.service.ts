import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IndentPendingApprovalService {

  constructor(private http: HttpClient) { }

  location(locid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenapplocation?locationid=' + locid)
  }

  material() {
    return this.http.get(environment.Api + "/Purchase/Approvals/indpenapprawmat")
  }
  group() {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenappgroup')
  }
  viewall(Locid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenappViewall?Locationid=' + Locid)
  }
  dept(Locationid: any, deptid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenapptabledept?Locationid=' + Locationid + '&deptid=' + deptid)
  }
  rawmat(Locationid: any, rawmatid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenapptablerawmat?Locationid=' + Locationid + '&rawmatid=' + rawmatid)
  }
  grouptable(Locationid: any, groupid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenapptablegrp?Locationid=' + Locationid + '&groupid=' + groupid)
  }
  all(Locationid: any, rawmatid: any, deptid: any, groupid: any) {
    console.log('entered');
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenapptableall?Locationid=' + Locationid + '&rawmatid=' + rawmatid + '&deptid=' + deptid + '&groupid=' + groupid)
  }
  deptmat(Locationid: any, deptid: any, rawmatid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenappdepraw?Locationid=' + Locationid + '&deptid=' + deptid + '&rawmatid=' + rawmatid)
  }
  depgrp(Locationid: any, deptid: any, groupid: any) {


    return this.http.get(environment.Api + '/Purchase/Approvals/indpenappdepgrp?Locationid=' + Locationid + '&deptid=' + deptid + '&groupid=' + groupid)
  }
  rawgrp(Locationid: any, rawmatid: any, groupid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenapprawgrp?Locationid=' + Locationid + '&rawmatid=' + rawmatid + '&groupid=' + groupid)
  }
  table(locationid: any, rawmatid: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenapptable?Locationid=' + locationid + '&rawmatid=' + rawmatid)
  }
  qty1(Locationid: any, rawmatid: any, date: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenappqty1?Locationid=' + Locationid + '&rawmatid=' + rawmatid + '&date=' + date)
  }
  qty2(Locationid: any, rawmatid: any, effdate: any, effedate: any) {
    return this.http.get(environment.Api + '/Purchase/Approvals/indpenappqty2?Locationid=' + Locationid + '&rawmatid=' + rawmatid + '&effdate=' + effdate + '&effedate=' + effedate)
  }
  mail(data: any) {
    console.log(data, 'data')
    return this.http.post(environment.Api + "/Purchase/Approvals/indpenappmail",  data)
  }
}