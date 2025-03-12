import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-inventory-main-module',
  templateUrl: './inventory-main-module.component.html',
  styleUrls: ['./inventory-main-module.component.scss']
})
export class InventoryMainModuleComponent implements OnInit, OnDestroy {

  Menuname: string = ''
  sidenavWidth = 4;
  LocationId: number = 0
  Empid: number = 0
  MOduleId: any
  PurchaseRequest: boolean = false
  IssueRequest: boolean = false
  DirectIndent: boolean = false
  StoreIssue: boolean = false
  MatlReturnFrmDept: boolean = false
  ReworkIssue: boolean = false
  StorageQtyAlloc: boolean = false
  Shelflife: boolean = false
  StoretoStore: boolean = false
  Storelogout: boolean = false
  IndentEntry: boolean = false
  GrnDeleteReq: boolean = false
  WeighRejReq: boolean = false
  GateEntryDelay: boolean = false
  Weighprintoutdiamler: boolean = false
  minmaxEntry: boolean = false
  QtyDelloac: boolean = false
  itemMasterAppr: boolean = false
  QcReq: boolean = false
  shelflifeRecertificate: boolean = false
  // pdRawmatchange: boolean = false
  RawmatSplit: boolean = false
  packweight: boolean = false
  customerreturn: boolean = false
  grnwithoutbillentry: boolean = false
  grnEntry:boolean=false
  IndentEntryId: number = 234
  StorelogoutId: number = 549
  PurchaseReqId: number = 374
  IssueRequestId: number = 242
  DirectIndentId: number = 143
  StoreIssueId: number = 473
  MatlReturnFrmDeptId: number = 282
  ReworkIssueId: number = 396
  StorageQtyAllocId: number = 471
  ShelflifeId: number = 441
  StoretoStoreId: number = 472
  GrnDeleteReqId: number = 202  
  WeighRejReqId: number = 539
  GateEntryDelayId: number = 191
  WeighprintoutdiamlerId: number = 538
  minmaxEntryId: number = 285
  QtyDelloacId: number = 378
  itemMasterApprId: number = 246
  QcReqId: number = 380
  shelflifeRecertificateId: number = 441
  // pdRawmatchangeId: number = 336
  RawmatSplitId: number = 386
  packweightId: number = 322
  customerreturnId: number = 111
  grnwithoutbillentryId: number = 212 
  grnEntryId:number=203
  Poweruser: string = ''
  empid: number = 458
  userRighitsData: any[] = new Array()
  EmpName: string = '';
  @ViewChild('message') message!: ElementRef
  constructor(private router: Router, private service: LoginService, private spinner: NgxSpinnerService, private dialog: MatDialog) { }
  ngOnInit(): void {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');

    this.LocationId = data[data.length - 1]

    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.EmpName = user.empname
    this.spinner.show()

    this.service.RighitsCheck(this.Empid, this.LocationId).subscribe({
      next: (data: any) => {
        if(data.length>=1){
        if (data[0].status == 'N') {
          this.Error=data[0].Msg
          this.userHeader='Error'
          this.opendialog()
        }
        this.spinner.hide()
        this.userRighitsData = data
        this.userRighitsData.forEach(data => {
          const checkPermission = (moduleId: number): boolean =>
            parseInt(data.Menuid) === moduleId && (data.PowerUser === 'Y' || data.Status === 'Y');
          if (checkPermission(this.PurchaseReqId)) {
            this.PurchaseRequest = true;
          }
          if (checkPermission(this.IssueRequestId)) {
            this.IssueRequest = true;
          }
          if (checkPermission(this.StoreIssueId)) {
            this.StoreIssue = true;
          }
          if (checkPermission(this.MatlReturnFrmDeptId)) {
            this.MatlReturnFrmDept = true;
          }
          if (checkPermission(this.ReworkIssueId)) {
            this.ReworkIssue = true;
          }
          if (checkPermission(this.StorageQtyAllocId)) {
            this.StorageQtyAlloc = true;
          }
          if (checkPermission(this.ShelflifeId)) {
            this.Shelflife = true;
          }
          if (checkPermission(this.StoretoStoreId)) {
            this.StoretoStore = true;
          }
          if (checkPermission(this.StorelogoutId)) {
            this.Storelogout = true;
          }
          if (checkPermission(this.IndentEntryId)) {
            this.IndentEntry = true;
          }
          if (checkPermission(this.GrnDeleteReqId)) {
            this.GrnDeleteReq = true;
          }
          if (checkPermission(this.WeighRejReqId)) {
            this.WeighRejReq = true;
          }
          if (checkPermission(this.GateEntryDelayId)) {
            this.GateEntryDelay = true;
          }
          if (checkPermission(this.WeighprintoutdiamlerId)) {
            this.Weighprintoutdiamler = true;
          }
          if (checkPermission(this.minmaxEntryId)) {
            this.minmaxEntry = true;
          }
          if (checkPermission(this.QtyDelloacId)) {
            this.QtyDelloac = true;
          }
          if (checkPermission(this.itemMasterApprId)) {
            this.itemMasterAppr = true;
          }
          if (checkPermission(this.QcReqId)) {
            this.QcReq = true;
          }
          if (checkPermission(this.shelflifeRecertificateId)) {
            this.shelflifeRecertificate = true;
          }
          // if (checkPermission(this.pdRawmatchangeId)) {
          //   this.pdRawmatchange = true;
          // }
          if (checkPermission(this.RawmatSplitId)) {
            this.RawmatSplit = true;
          }
          if (checkPermission(this.packweightId)) {
            this.packweight = true;
          }
          if (checkPermission(this.customerreturnId)) {
            this.customerreturn = true;
            // Not Completed
          }
          if (checkPermission(this.grnwithoutbillentryId)) {
            this.grnwithoutbillentry = true;
          }
          if (checkPermission(this.grnEntryId)) {
            this.grnEntry = true;
          }
        });
      }

      },
      error: (err) => {
        this.apiErrorMsg = err
        const Error = document.getElementById('apierror') as HTMLInputElement
        Error.click()
        // this.spinner.show()
        return
      },
      complete: () => {
        this.spinner.hide()
      },
    })
  }

  apiErrorMsg: string = ''
  increase() {
    this.sidenavWidth = 15;
    console.log('increase sidenav width');
  }
  decrease() {
    this.sidenavWidth = 4;
    console.log('decrease sidenav width');
  }

  Logout() {
    this.router.navigate(['/login'], {});
  }
  Back() {
    this.router.navigate(['/Dashboard'], {});
  }
  Spinnercall() {
    this.spinner.show()
  }
  screenlockvaildation: any[] = new Array()
  ErrorMsg: string = ''

  EmpData: any[] = new Array()
  InsertloginDet = {}
  getScreenLockVaildation() {
    this.StoreIssueId = 166
    this.service.screenlockvaild(this.StoreIssueId, this.LocationId).subscribe({
      next: (res: any) => {
        this.screenlockvaildation = res
        console.log(this.screenlockvaildation, 'screenlockvaildation');
        console.log(this.screenlockvaildation.length);
        if (this.screenlockvaildation.length > 0) {
          this.ErrorMsg = 'Store Issue Already Logged By Login Name : <b style="color:brown;font-weight:x-bolder"> ' + this.screenlockvaildation[0].empname + ' </b>.Please Ensure that person Logout the Store Issue'
          this.userHeader = 'Error'
          this.opendialog()
          return
        } else {
          this.InsertloginDet = {}
          this.InsertloginDet = {
            Menuid: this.StoreIssueId,
            LocationId: this.LocationId,
            Empid: this.Empid,
            Loginsystem: 'Tab-Entry'
          }
          this.service.Insertlockscreen(this.InsertloginDet).subscribe({
            next: (res: any) => {
              console.log('else');
              const insertuserdata = res
              console.log(insertuserdata, 'insertuserdata');
              if (insertuserdata[0].status === 'Y') {
                this.ErrorMsg = insertuserdata[0].Msg
                console.log(this.ErrorMsg, 'dsf');
                this.router.navigate(['/storeissue'], {});
              } else {
                this.ErrorMsg = insertuserdata[0].Msg
                this.message.nativeElement.click()
              }
            }
          })
        }
      }
    })
  }

  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });

  }

  ngOnDestroy(): void {
    this.dialog.closeAll()

  }


}

