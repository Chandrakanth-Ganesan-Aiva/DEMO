import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, pipe, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'


@Injectable({
  providedIn: 'root'
})
export class GateEntryDelayService {

  constructor(private http: HttpClient) {

  }

  partyDet(PartyName:any) {
    return this.http.get(environment.Api + '/master/GateEntryDelay_party?PartyName='+PartyName)
  }
  ViewgateEntryDelay(PartyId: any, LocationId: any) {
    return this.http.get(environment.Api + '/master/GateEntryDelay_partilist?PartyId=' + PartyId + '&LocationId=' + LocationId)
  }
  Update(GateEntryDelatUpdate:any){
    return this.http.post(environment.Api + '/master/GateEntryDelatUpdate',GateEntryDelatUpdate)
  }

  // --------------------------------------Gate Entry DElay Approval ----------------------------------
  TabelDataList(LocationId:any){
    return this.http.get(environment.Api + '/master/GateEntryApprovalList?LocationId='+LocationId)
  }
  UpdateAppr(GateEntryDelayAppr:any){
    return this.http.post(environment.Api + '/master/GateEntryDelayAppr',GateEntryDelayAppr)
  }
}

