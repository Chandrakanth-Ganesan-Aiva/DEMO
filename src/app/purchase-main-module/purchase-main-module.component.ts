import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-purchase-main-module',
  templateUrl: './purchase-main-module.component.html',
  styleUrls: ['./purchase-main-module.component.scss']
})
export class PurchaseMainModuleComponent implements OnInit {
  LocationId: number = 0
  Empid: number = 0
  EmpName: string = ''
  IndentEntry: boolean = false
  IndentEntryId: number = 228
  userRighitsData: any[] = new Array()
  apiErrorMsg: string = ''
  //Purchase
  POClose: boolean = false
  POCloseID: number = 349
  poclose2: boolean = false
  poclose2Id: number = 350
  poclose3: boolean = false
  poclose3Id: number = 350
  creditdays: boolean = false
  creditdaysId: number = 93
  clearingApproval: boolean = false
  clearingApprovalId: number = 76
  IndentApprovalPending: boolean = false
  IndentApprovalPendingId: number = 231
  SupplierRegAppPurchase: boolean = false
  SupplierRegAppPurchaseId: number = 488
  SupplierRegAppFinance: boolean = false
  SupplierRegAppFinanceId: number = 487
  SupplierRegAppTec: boolean = false
  SupplierRegAppTecId: number = 489
  MailNumberUpdate: boolean = false
  MailNumberUpdateId: number = 155




  constructor(private service: LoginService) { }
  ngOnInit() {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.EmpName = user.empname
    this.service.RighitsCheck(this.Empid, this.LocationId).subscribe({
      next: (data: any) => {
        this.userRighitsData = data
        for (let i = 0; i < this.userRighitsData.length; i++) {
          if (parseInt(this.userRighitsData[i].Menuid) === this.POCloseID) {
            if (this.userRighitsData[i].PowerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.POClose = true
              }
            } else {
              this.POClose = true
            }
          }
          if (parseInt(this.userRighitsData[i].Menuid) === this.poclose2Id) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.poclose2 = true
              }
            }
            else {
              this.poclose2 = true
            }
          }
          if (parseInt(this.userRighitsData[i].Menuid) === this.poclose3Id) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.poclose3 = true
              }
            }
            else {
              this.poclose3 = true
            }
          }
          if (parseInt(this.userRighitsData[i].Menuid) === this.creditdaysId) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.creditdays = true
              }
            }
            else {
              this.creditdays = true
            }
          }
          if (parseInt(this.userRighitsData[i].Menuid) === this.clearingApprovalId) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.clearingApproval = true
              }
            }
            else {
              this.clearingApproval = true
            }
          }
          if (parseInt(this.userRighitsData[i].Menuid) === this.IndentApprovalPendingId) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.IndentApprovalPending = true
              }
            }
            else {
              this.IndentApprovalPending = true
            }
          }
          if (parseInt(this.userRighitsData[i].Menuid) === this.SupplierRegAppPurchaseId) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.SupplierRegAppPurchase = true
              }
            }
            else {
              this.SupplierRegAppPurchase = true
            }
          } if (parseInt(this.userRighitsData[i].Menuid) === this.SupplierRegAppFinanceId) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.SupplierRegAppFinance = true
              }
            }
            else {
              this.SupplierRegAppFinance = true
            }
          }
          if (parseInt(this.userRighitsData[i].Menuid) === this.SupplierRegAppTecId) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.SupplierRegAppTec = true
              }
            }
            else {
              this.SupplierRegAppTec = true
            }
          }
          if (parseInt(this.userRighitsData[i].Menuid) === this.MailNumberUpdateId) {
            if (this.userRighitsData[i].powerUser === 'N') {
              if (this.userRighitsData[i].Status === 'Y') {
                this.MailNumberUpdate = true
              }
            }
            else {
              this.MailNumberUpdate = true
            }
          }
        }
      }
    })
  }
}
