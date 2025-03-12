import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development'
@Injectable({
  providedIn: 'root'
})
export class GrnWithoutBillEntryApprService {
  constructor(private http: HttpClient) { }

  material(LocationId: any) {
    return this.http.get(environment.Api + '/Approval/grnapprMaterial?LocationId=' + LocationId)
  }
  UpdateAppr(UpdateGrnWithoutAppr: any) {
    return this.http.put(environment.Api + '/Approval/UpdateGrnWithoutAppr', UpdateGrnWithoutAppr)
  }
  UpdateReject(UpdateGrnWithoutReject: any) {
    return this.http.put(environment.Api + '/Approval/UpdateGrnWithoutReject', UpdateGrnWithoutReject)
  }
}
