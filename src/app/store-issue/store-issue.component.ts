import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreIssueService } from '../service/store-issue.service';
import { data, event } from 'jquery';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../service/login.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-store-issue',
  templateUrl: './store-issue.component.html',
  styleUrls: ['./store-issue.component.scss']
})
export class StoreIssueComponent implements OnInit, OnDestroy {
  currentDate = new Date()
  currentDate1 = new Date()
  currentDate2 = new Date()
  Issuedate: any
  fromdt: any
  Todate: any
  StoreIssueForm!: FormGroup;
  LoactionId: number = 0
  Empid: number = 0

  displayedColumns: string[] = []
  constructor(private router: Router, private loginservice: LoginService, private date: DatePipe,
    private toastr: ToastrService, private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder,
    private service: StoreIssueService, private dialog: MatDialog) { }
  ngOnDestroy() {

  }
  ngOnInit(): void {
    this.Issuedate = this.date.transform(this.currentDate, 'yyyy-MM-dd');
    // this.fromdt = '2024-07-12'
    this.fromdt = this.date.transform(this.currentDate1, 'yyyy-MM-dd');
    this.Todate = this.date.transform(this.currentDate2, 'yyyy-MM-dd');
    // console.log(this.Issuedate);

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    // console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    // console.log(this.Empid);

    this.StoreIssueForm = this.formBuilder.group({
      IssueNo: new FormControl('', Validators.required),
      Department: new FormControl('', Validators.required),
      Refno: new FormControl('', Validators.required),
      material: new FormControl('', Validators.required),
      Warehouse: new FormControl('', Validators.required),
    })
    this.getStockReqno()
    this.Disablebackbutton()
  }
  Disablebackbutton() {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href);
    }

  }
  Datechange(e: any) {
    this.Issuedate = e.target.value
    // console.log(this.Issuedate);
  }
  Frmdatevent(e: any) {
    this.fromdt = e.target.value
    console.log(this.fromdt);
    this.StoreIssueForm.controls['Department'].setValue('')
    this.StoreIssueForm.controls['Refno'].setValue('')
    this.StoreIssueForm.controls['Warehouse'].setValue('')
    this.StoreIssueForm.controls['material'].setValue('')
    this.MaterilaDetalis = []
    this.RawmaterialValid = []
  }
  TodateEvent(e: any) {
    this.Todate = e.target.value
  }

  apiErrorMsg: string = ''
  masterid: number = 459
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    this.service.Stockreno(this.masterid, this.Issuedate, this.LoactionId).subscribe((res: any) => {
      this.StockReq = res
      console.log(this.StockReq, 'StockReqNo');
      if (this.StockReq.length != 0) {
        this.StockReqNo = this.StockReq[0].translno
        // this.StockReqNo = 'SR/U1/23-24/14489'
        this.StoreIssueForm.controls['IssueNo'].setValue(this.StockReqNo)
      }
    })
  }
  Depatment: any[] = new Array()
  GetDepartment() {
    this.service.Department(this.LoactionId, this.Issuedate, this.fromdt, this.Todate).subscribe({
      next: (data: any) => {
        this.Depatment = data
        console.log(this.Depatment, 'Dept');
        if (this.Depatment.length > 0) {
          if (this.Depatment[0].status !== undefined) {
            if (this.Depatment[0].status === 'N') {
              this.apiErrorMsg = this.Depatment[0].Msg
              const Error = document.getElementById('apierror') as HTMLInputElement
              Error.click()
              return
            }
          }
        }
      }
    })

  }
  Deptid: number = 0
  DeptEvent(event: any) {
    this.Deptid = event
    if (this.Depatment.length == 0) {
      this.ErrorMsg = ''
      this.ErrorMsg = 'No Materials To Found...'
      const view = document.getElementById('Error') as HTMLInputElement
      view.click()
      return;
    }
    console.log(this.Deptid, 'Deptid');
    this.StoreIssueForm.controls['Refno'].setValue('')
    this.StoreIssueForm.controls['Warehouse'].setValue('')
    this.StoreIssueForm.controls['material'].setValue('')
    this.MaterilaDetalis = []
    this.RawmaterialValid = []
    if (this.Deptid > 0 && this.Deptid !== undefined && this.Deptid !== null) {
      this.GetRefno()
    }
  }


  RefnoData: any[] = new Array()
  GetRefno() {
    this.service.Refno(this.LoactionId, this.Issuedate, this.fromdt, this.Todate, this.Deptid).subscribe({
      next: (data: any) => {
        this.RefnoData = data
        console.log(this.RefnoData, 'Refno');
        if (this.RefnoData.length > 0) {
          if (this.RefnoData[0].status !== undefined) {
            if (this.RefnoData[0].status === 'N') {
              this.apiErrorMsg = this.RefnoData[0].Msg
              const Error = document.getElementById('apierror') as HTMLInputElement
              Error.click()
              return
            }
          }
        }
      }
    })
  }
  RefSrno: string = ''
  srno: number = 0
  RawMatIDChckwarehouse: any
  RefnoEvent(event: any) {
    // debugger
    this.srno = parseInt(event.target.value)
    console.log(this.srno, 'RefSrno');
    const ref = this.RefnoData.forEach((data: any) => {
      if (this.srno == data.SrNo) {
        this.RefSrno = data.Sr_Ref_No
      }
    })
    if (this.srno !== 0 && this.srno !== undefined && this.srno !== null) {
      this.service.warehousechck(this.RefSrno).subscribe((next: any) => {
        let warehousechck = next
        console.log(warehousechck, 'warehousechck');
        if (warehousechck.length > 0) {
          // this.RawMatIDChckwarehouse = warehousechck[0].RawMatID
          // debugger
          const warehouse = warehousechck.forEach((element: any) => {
            console.log(element.RawMatID);
            if (element.RawMatID !== 261709 || element.RawMatID !== 261590) {
              this.RawMatIDChckwarehouse = true
              console.log("In");
              this.GetWarehouse()
              this.warehouseInputbox = 'Incoming Store - U1'
              this.StoreIssueForm.controls['Warehouse'].setValue(26)
              console.log(this.StoreIssueForm.controls['Warehouse'].value);
              this.GetMaterial()
              // this.RawmaterialValid = []
            }
            else {
              this.RawMatIDChckwarehouse = false
              console.log("OUT");
              this.GetWarehouse()
            }
          });

        }
      })
    }
    this.StoreIssueForm.controls['Warehouse'].setValue('')
    this.StoreIssueForm.controls['material'].setValue('')
    this.MaterilaDetalis = []
    this.RawmaterialValid = []
    this.viewbtn = false
  }
  warehousedata: any[] = new Array()

  GetWarehouse() {
    this.service.Warehouse(this.LoactionId).subscribe((data: any) => {
      this.warehousedata = data
      console.log(this.warehousedata, 'this.warehousedata');
      if (this.warehousedata.length > 0) {
        if (this.warehousedata[0].status !== undefined) {
          if (this.warehousedata[0].status === 'N') {
            this.apiErrorMsg = this.warehousedata[0].Msg
            const Error = document.getElementById('apierror') as HTMLInputElement
            Error.click()
            return
          }
        }

      }
    })
  }
  warehouseInputbox: string = ''
  // warehouseno: number = 0
  WarehouseEvent() {
    this.StoreIssueForm.controls['Warehouse'].value
    this.GetMaterial()
    this.StoreIssueForm.controls['material'].setValue('')
    this.MaterilaDetalis = []
    this.RawmaterialValid = []
  }
  Rawmateriladata: any[] = new Array()
  RawmaterialValid: any[] = new Array()
  GetMaterial() {
    this.service.Rawmaterial(this.LoactionId, this.Deptid, this.fromdt, this.Todate, this.RefSrno).subscribe({
      next: (data: any) => {
        this.Rawmateriladata = data

        console.log(this.Rawmateriladata, 'material');
        if (this.Rawmateriladata.length == 0) {
          this.toastr.warning('No Records To Found.Please Fill Correct Detalis');
          return
        } else {
          if (this.Rawmateriladata[0].status !== undefined) {
            if (this.Rawmateriladata[0].status === 'N') {
              this.apiErrorMsg = this.Rawmateriladata[0].Msg
              const Error = document.getElementById('apierror') as HTMLInputElement
              Error.click()
              return
            }
          }
          this.RawmaterialValid = []
          for (let i = 0; i < this.Rawmateriladata.length; i++) {
            this.MaterialAddbtn = false
            this.MaterilaDetalis = []
            this.RawmaterialValid.push({
              RawMatName: this.Rawmateriladata[i].RawMatName,
              RawMatID: this.Rawmateriladata[i].RawMatID
            })
          }
        }
      }
    })
  }

  Rawmatid: any = 0
  RawMaterialName: string = ''
  getMaterialDetails(event: any) {
    this.Rawmatid = parseInt(event)
    const Rawmaterial = this.Rawmateriladata.forEach((data: any) => {
      if (this.Rawmatid === data.rawmatid) {
        this.RawMaterialName = data.rawmatname
      }
      // console.log(this.RawMaterialName, 'MaterialName');
    })
  }
  get view(): { [key: string]: AbstractControl } {
    return this.StoreIssueForm.controls;
  }

  issueQtyvalue: any
  Issuevalue: number = 0
  issueQty(event: any) {
    //debugger
    this.issueQtyvalue = parseInt(event.target.value)
    this.Issuevalue = parseInt(event.target.value)

  }
  Releasebtndisable = [false, false]
  Isuuechck() {
    this.Issuevalue = 0
  }
  viewbtn: any
  MaterialRealase: any[] = new Array()
  PendingQty: number = 0
  cmpname: string = 'SFPL'
  deptname: string = ''
  Viewmat: boolean = false
  RawmaterialInd: any
  MaterilaDetalis: any[] = new Array()
  IndentDetalisData: any[] = new Array()
  StockAvl: number = 0
  StockMinimumcheck: any
  matlcolor: any
  NostockMaterial: any[] = new Array()
  Add() {
    console.log(this.Rawmatid, 'Rawmatid');

    this.viewbtn = true
    if (this.StoreIssueForm.invalid) {
      return
    } else {
      // debugger
      if (this.Rawmatid !== 0) {
        this.spinnerService.show()
        this.service.IssueMaterialViewbtn(this.LoactionId, this.Issuedate, this.StoreIssueForm.controls['Warehouse'].value, this.Deptid, this.srno,
          this.Rawmatid, this.fromdt, this.Todate).subscribe({
            next: (data: any) => {
              this.spinnerService.hide()
              this.MaterialRealase = data
              this.Tab1 = 0
              if (this.MaterialRealase.length !== 0) {
                if (this.MaterialRealase[0].status !== undefined) {
                  if (this.MaterialRealase[0].status === 'N') {
                    this.apiErrorMsg = this.MaterialRealase[0].Msg
                    const Error = document.getElementById('apierror') as HTMLInputElement
                    Error.click()
                    return
                  }
                }
                this.PendingQty = this.MaterialRealase[0].srqty - this.MaterialRealase[0].minqty
                this.deptname = this.MaterialRealase[0].deptname
                // console.log(this.Rawmatid);
                this.spinnerService.show()
                this.service.IndentDet(this.LoactionId, this.Issuedate, this.Rawmatid, this.Deptid).subscribe((res: any) => {
                  this.spinnerService.hide()
                  this.IndentDetalisData = res
                  console.log(this.MaterialRealase, 'MaterialRequest To Realese');
                  // console.log(this.IndentDetalisData, 'IndentDetalisData');
                  if (this.IndentDetalisData.length !== 0) {
                    if (this.IndentDetalisData[0].status !== undefined) {
                      if (this.IndentDetalisData[0].status === 'N') {
                        this.apiErrorMsg = this.IndentDetalisData[0].Msg
                        const Error = document.getElementById('apierror') as HTMLInputElement
                        Error.click()
                        return
                      }
                    }
                    this.StockAvl = this.IndentDetalisData[0].Store_Stk_Qty
                    if (this.IndentDetalisData[0].Store_Stk_Qty === 0) {
                      for (let i = 0; i < this.MaterialRealase.length; i++) {
                        this.NostockMaterial.push({
                          gStrMatDisp: this.MaterialRealase[i].gStrMatDisp,
                          RawMatID: this.MaterialRealase[i].RawMatID,
                        })
                        // console.log(this.NostockMaterial, 'NOSTOCK ARRAY');
                      }
                      // this.Error = 5
                      this.ErrorMsg = ''
                      this.ErrorMsg = 'Stock Is Not Available For This Material...'
                      const stock = document.getElementById('Error') as HTMLInputElement
                      stock.click()
                      return
                    } else {
                      this.Viewmat = true
                      // console.log(this.StockAvl);
                      for (let i = 0; i < this.MaterialRealase.length; i++) {
                        // console.log(this.MaterialRealase[i].SRId, 'srid');
                        // console.log(this.MaterialRealase[i].RawMatID, '22');
                        this.StockMinimumcheck = this.StockAvl < this.MaterialRealase[0].min_level
                        this.MaterilaDetalis.push({
                          Sr_Ref_No: this.MaterialRealase[i].Sr_Ref_No,
                          SRDate: this.MaterialRealase[i].SRDate,
                          gStrMatDisp: this.MaterialRealase[i].gStrMatDisp,
                          RawMatID: this.MaterialRealase[i].RawMatID,
                          SRId: this.MaterialRealase[i].SRId,
                          SRUom: this.MaterialRealase[i].SRUom,
                          srqty: this.MaterialRealase[i].srqty,
                          loc_id: this.MaterialRealase[i].loc_id,
                          Pendingqty: this.MaterialRealase[i].srqty - this.MaterialRealase[i].minqty,
                          stock: this.StockAvl,
                          min_level: this.MaterialRealase[i].min_level,
                          max_level: this.MaterialRealase[i].max_level,
                          reorder_level: this.MaterialRealase[i].reorder_level,
                          deptname: this.MaterialRealase[i].deptname,
                          popend: this.MaterialRealase[i].popend,
                          color: this.StockMinimumcheck
                        })
                        this.MaterialAddbtn = true
                        this.StoreIssueForm.disable()
                        // console.log(this.RawmaterialValid.length === this.MaterilaDetalis.length);
                        this.Rawmateriladata.length === this.MaterilaDetalis.length
                        if (this.Rawmateriladata.length === this.MaterilaDetalis.length) {
                          this.viewbtn = false
                        } else {
                          this.viewbtn = true
                        }
                        console.log(this.MaterilaDetalis, 'this.MaterilaDetalis PushArray');
                      }
                      if (this.Rawmatid === parseInt(this.MaterialRealase[0].RawMatID)) {
                        const RawMaterialiD = [parseInt(this.MaterialRealase[0].RawMatID)]
                        this.RawmaterialValid = this.RawmaterialValid.filter(item => !RawMaterialiD.includes(item.RawMatID));
                        // console.log(this.RawmaterialValid);
                        // this.Rawmatid=0
                        this.StoreIssueForm.controls['material'].setValue(this.RawmaterialValid)
                      }
                    }

                  }
                })
              }
              else {
                this.ErrorMsg = ''
                this.ErrorMsg = 'No Records To Found...'
                const view = document.getElementById('Error') as HTMLInputElement
                view.click()
                return;
              }
            }
          })
      } else {
        // this.Error = 8
        this.ErrorMsg = ''
        this.ErrorMsg = 'Please Select Material...'
        const stock = document.getElementById('Error') as HTMLInputElement
        stock.click()
        return
      }
    }

  }
  Clear() {
    this.Viewmat = false
    this.viewbtn = false
    this.fromdt = this.date.transform(this.currentDate, 'yyyy-MM-dd');
    this.StoreIssueForm.controls['Department'].setValue('')
    this.StoreIssueForm.controls['Refno'].setValue('')
    this.StoreIssueForm.controls['material'].setValue('')
    this.StoreIssueForm.controls['Warehouse'].setValue('')
    this.StoreIssueForm.enable()
    this.MaterilaDetalis = []
    this.Issuedetalisarr = []
    this.BatchData = []
    this.Batcharr = []
    this.NostockMaterial = []
    this.RawmaterialValid = []
    this.Batchwise = []
    this.ReleaseAllMaterial = []
    this.Issueqtymodaldisable[this.issuedetalisIndex] = false
    this.Releasebtndisable[this.issuedetalisIndex] = false
  }
  Tab1 = 0;
  tablabelname: string = '';
  tabChangedRegular(e: MatTabChangeEvent) {
    this.Tab1 = e.index;
    // console.log(this.Tab1, 'tab');

    // console.log(this.Tab1, 'Tab');
    this.tablabelname = e.tab.textLabel
    // console.log(this.tablabelname);

  }
  // Error: number = 0
  issuedetalisIndex: number = 0

  ReleaseVaildation(Index: number) {
    // debugger
    this.issuedetalisIndex = Index
    // console.log(this.MaterilaDetalis[this.issuedetalisIndex].Issueqtymodal);

    if (this.MaterilaDetalis[Index].Issueqtymodal > (this.MaterilaDetalis[Index].Pendingqty)) {
      // this.Error = 1
      this.ErrorMsg = ''
      this.ErrorMsg = 'You cannot issue more than Requested qty...'
      const pending = document.getElementById('Error')
      pending?.click()
      return
    }

    else if (this.MaterilaDetalis[Index].Issueqtymodal > this.MaterilaDetalis[Index].stock) {
      // this.Error = 2
      this.ErrorMsg = ''
      this.ErrorMsg = 'You cannot Issue more than Availabel Stock...'
      const reqqty = document.getElementById('Error')
      reqqty?.click()
      return
    }
    else if (this.MaterilaDetalis[Index].Stock < this.MaterilaDetalis[Index].min_level) {
      this.ErrorMsg = ''
      this.ErrorMsg = 'Stock Is Lesser Than Than The Minimum Quantity...'
      const minqty = document.getElementById('Error')
      minqty?.click()

    }
    else {
      if (this.MaterilaDetalis[Index].min_level < this.MaterilaDetalis[Index].Issueqtymodal) {
        this.ErrorMsg = ''
        this.ErrorMsg = 'Shall I Issue More than Minimum Level Qty...'
        const minqty = document.getElementById('Error2')
        minqty?.click()
      } else {
        if (this.MaterilaDetalis[Index].Issueqtymodal > 0) {
          this.Release()
          console.log('sd');

          this.ReleaseAllMaterial = []
          this.Releasebtndisable[Index] = true
        } else {
          // this.Error = 9
          this.ErrorMsg = ''
          this.ErrorMsg = 'Issue Qty Should Be Greater than Zero...'
          const issueqty = document.getElementById('Error')
          issueqty?.click()
          return
        }
      }
    }
  }
  Batchwise: any[] = new Array()
  ExpiryDate: any
  Issuedetalisarr: any[] = new Array()
  Sr_Ref_No: string = ''
  ind: any
  batchqty: number = 0
  BatchData: any[] = new Array()
  balqty: number = 0
  Batcharr: any[] = new Array()
  // Issueqtymodal: any
  ExpiryDateVailadCheck: any
  // valid: number = 0
  GrnQty: number = 0
  Release() {
    debugger
    if (this.MaterilaDetalis[this.issuedetalisIndex].Issueqtymodal > 0) {
      this.Tab1 = 1
      this.service.GmRefNo(this.StoreIssueForm.controls['Warehouse'].value, this.Rawmatid, this.LoactionId).subscribe({
        next: (data: any) => {
          this.Batchwise = data
          console.log(this.Batchwise, 'IssueDetalis Grid');
          if (this.StoreIssueForm.controls['Warehouse'].value !== 32) {
            if (this.Batchwise.length > 0) {
              if (this.Batchwise[0].status !== undefined) {
                if (this.Batchwise[0].status === 'N') {
                  this.apiErrorMsg = this.Batchwise[0].Msg
                  const Error = document.getElementById('apierror') as HTMLInputElement
                  Error.click()
                  return
                }
              }
              this.Releasebtndisable[this.issuedetalisIndex] = true
              console.log(this.MaterilaDetalis[this.issuedetalisIndex].Sr_Ref_No, 'refno');
              console.log(this.MaterilaDetalis[this.issuedetalisIndex].SRId, 'SRId');
              console.log(this.MaterilaDetalis[this.issuedetalisIndex].SRUom, 'SRUom');

              for (let i = 0; i < this.Batchwise.length; i++) {
                if (this.Batchwise[i].stocknew > 0) {
                  if (this.issueQtyvalue > 0) {
                    if (this.issueQtyvalue <= this.Batchwise[i].stocknew) {
                      // console.log(this.Batchwise[i].stocknew);
                      this.GrnQty = Math.round(this.Batchwise[i].stocknew)
                      this.Issuedetalisarr.push({
                        Sr_Ref_No: this.MaterilaDetalis[this.issuedetalisIndex].Sr_Ref_No,
                        SRDate: this.Batchwise[i].GrnDate,
                        Material: this.Batchwise[i].RawMatName,
                        MaterialID: this.Batchwise[i].Rawmatid,
                        UOM: this.Batchwise[i].PUom,
                        SrQty: this.PendingQty,
                        IssueQty: this.issueQtyvalue,
                        GrnRefNo: this.Batchwise[i].Grn_Ref_no,
                        GrnQty: this.GrnQty,
                        DeptName: this.deptname,
                        Grnid: this.Batchwise[i].GRNID,
                        GRnNO: this.Batchwise[i].GrnNo,
                        ExRate: this.Batchwise[i].ExRate,
                        StoreEntryId: this.Batchwise[i].StoreEntryId,
                        Srid: this.MaterilaDetalis[this.issuedetalisIndex].SRId,
                        Uom: this.MaterilaDetalis[this.issuedetalisIndex].SRUom
                      })
                      console.log(this.Issuedetalisarr, 'Issuedetalisarr-1');
                      this.service.Batch(parseInt(this.Batchwise[i].GRNID)).subscribe({
                        next: (data: any) => {
                          this.BatchData = data
                          console.log(this.BatchData, ' Batchwise Grid');
                          if (this.BatchData.length !== 0) {
                            this.Tab1 = 2
                            if (this.BatchData[0].status !== undefined) {
                              if (this.BatchData[0].status === 'N') {
                                this.apiErrorMsg = this.BatchData[0].Msg
                                const Error = document.getElementById('apierror') as HTMLInputElement
                                Error.click()
                                return
                              }
                            }
                            for (let k = 0; k < this.BatchData.length; k++) {
                              this.balqty = this.BatchData[k].balqty
                              if (this.BatchData[k].balqty > 0) {
                                this.Issuedetalisarr.forEach((res: any) => {
                                  if (this.BatchData[k].grnid === res.Grnid) {
                                    if (res.IssueQty <= this.BatchData[k].balqty) {
                                      this.issueQtyvalue = res.IssueQty
                                      // console.log(this.issueQtyvalue, 'issueQtyvalue');
                                    } else {
                                      this.issueQtyvalue = res.IssueQty - this.BatchData[k].balqty
                                      // console.log(this.issueQtyvalue, 'issueQtyvalue');
                                    }
                                  }
                                })
                                // grnid,grnno
                                this.Batcharr.push({
                                  Grnno: this.BatchData[k].grnno,
                                  GrnId: this.BatchData[k].grnid,
                                  GrnRefNo: this.BatchData[k].grn_ref_no,
                                  GrnDate: this.BatchData[k].grndate,
                                  Material: this.BatchData[k].rawmatname,
                                  MaterialID: this.BatchData[k].rawmatid,
                                  BatchNo: this.BatchData[k].batchno,
                                  ExpiryDate: this.BatchData[k].Batchdate,
                                  BatchQty: this.BatchData[k].batchqty,
                                  BalanceQty: this.BatchData[k].balqty,
                                  BatchId: this.BatchData[k].batch_id,
                                  IssueQty: this.issueQtyvalue
                                })
                                console.log(this.Batcharr, 'Batchwise Arr-1');
                                this.ExpiryDateVailadCheck = this.Batcharr[k].ExpiryDate < this.Issuedate
                                // this.ExpiryDateVailadCheck = true
                                debugger
                                if (this.ExpiryDateVailadCheck === true) {
                                  this.ExpirydateRawmatid = this.BatchData[k].rawmatid
                                  // console.log('yes');
                                  this.Error = 2
                                  this.savebtn = false
                                  this.ErrorMsg = ''
                                  this.ErrorMsg = 'Already Expired this material. Please get the revalidation certificate otherwise you cannot issue'
                                  const Batchdate = document.getElementById('Error') as HTMLInputElement
                                  Batchdate.click()
                                  return
                                } else {
                                  this.issueQtyvalue = 0
                                }
                              }
                            }
                          }
                        }
                      })
                      this.issueQtyvalue = 0

                    } else {
                      if (this.Batchwise[i].stocknew < this.issueQtyvalue) {
                        this.issueQtyvalue = this.issueQtyvalue - this.Batchwise[i].stocknew
                        // console.log(this.issueQtyvalue, 'issue', this.GrnQty, 'this.GrnQty');
                      }
                      else {
                        this.issueQtyvalue = this.issueQtyvalue
                      }
                      this.Issuedetalisarr.push({
                        Sr_Ref_No: this.MaterilaDetalis[this.issuedetalisIndex].Sr_Ref_No,
                        SRDate: this.Batchwise[i].GrnDate,
                        Material: this.Batchwise[i].RawMatName,
                        MaterialID: this.Batchwise[i].Rawmatid,
                        UOM: this.Batchwise[i].PUom,
                        SrQty: this.PendingQty,
                        IssueQty: this.Batchwise[i].stocknew,
                        GrnRefNo: this.Batchwise[i].Grn_Ref_no,
                        GrnQty: this.Batchwise[i].stocknew,
                        DeptName: this.deptname,
                        Grnid: this.Batchwise[i].GRNID,
                        GRnNO: this.Batchwise[i].GrnNo,
                        ExRate: this.Batchwise[i].ExRate,
                        StoreEntryId: this.Batchwise[i].StoreEntryId,
                        Srid: this.MaterilaDetalis[this.issuedetalisIndex].SRId,
                        Uom: this.MaterilaDetalis[this.issuedetalisIndex].SRUom
                      })
                      console.log(this.Issuedetalisarr, 'Issuedetalisarr-2');
                      this.service.Batch(parseInt(this.Batchwise[i].GRNID)).subscribe({
                        next: (data: any) => {
                          this.BatchData = data
                          console.log(this.BatchData, ' BatachWise Grid ');
                          if (this.BatchData.length !== 0) {
                            if (this.BatchData[0].status !== undefined) {
                              if (this.BatchData[0].status === 'N') {
                                this.apiErrorMsg = this.BatchData[0].Msg
                                const Error = document.getElementById('apierror') as HTMLInputElement
                                Error.click()
                                return
                              }
                            }
                            for (let k = 0; k < this.BatchData.length; k++) {
                              this.balqty = this.BatchData[k].balqty
                              if (this.BatchData[k].balqty > 0) {
                                // debugger
                                this.Issuedetalisarr.forEach((res: any) => {
                                  if (this.BatchData[k].grnid === res.Grnid) {
                                    if (res.IssueQty <= this.BatchData[k].balqty) {
                                      this.issueQtyvalue = res.IssueQty
                                      // console.log(this.issueQtyvalue, 'issueQtyvalue');
                                    } else {
                                      this.issueQtyvalue = res.IssueQty - this.BatchData[k].balqty
                                      // console.log(this.issueQtyvalue, 'issueQtyvalue');
                                    }
                                  }
                                })
                                // grnid,grnno
                                this.Batcharr.push({
                                  Grnno: this.BatchData[k].grnno,
                                  GrnId: this.BatchData[k].grnid,
                                  GrnRefNo: this.BatchData[k].grn_ref_no,
                                  GrnDate: this.BatchData[k].grndate,
                                  Material: this.BatchData[k].rawmatname,
                                  MaterialID: this.BatchData[k].rawmatid,
                                  BatchNo: this.BatchData[k].batchno,
                                  ExpiryDate: this.BatchData[k].Batchdate,
                                  BatchQty: this.BatchData[k].batchqty,
                                  BalanceQty: this.BatchData[k].balqty,
                                  BatchId: this.BatchData[k].batch_id,
                                  IssueQty: this.issueQtyvalue
                                })
                                console.log(this.Batcharr, 'Batch  Arr-2');
                                this.ExpiryDateVailadCheck = this.Batcharr[k].ExpiryDate < this.Issuedate
                                // this.ExpiryDateVailadCheck = true
                                console.log(this.ExpiryDateVailadCheck);

                                if (this.ExpiryDateVailadCheck === true) {

                                  this.ExpirydateRawmatid = this.BatchData[k].rawmatid
                                  this.Error = 2
                                  this.ErrorMsg = ''
                                  this.ErrorMsg = 'Already Expired this material. Please get the revalidation certificate otherwise you cannot issue'
                                  const Batchdate = document.getElementById('Error') as HTMLInputElement
                                  Batchdate.click()
                                  return
                                } else {
                                  this.issueQtyvalue = 0
                                }
                              }
                            }
                          }
                        }
                      })
                    }
                  }
                }
              }
              this.Rawmatid = 0
              this.MaterialAddbtn = false
              this.MaterialAllReleasebtn = true
              this.StoreIssueForm.controls['material'].enable()
              if (this.MaterilaDetalis.length !== 0) {
                this.savebtn = true
              }
            }
            else {

              this.Error = 1
              this.Tab1 = 0
              this.ErrorMsg = ''
              this.ErrorMsg = 'No Records Found In BatchWise Please Contact Admin...'
              this.MaterialAddbtn = false
              this.StoreIssueForm.controls['material'].enable()
              const Error = document.getElementById('Error') as HTMLInputElement
              Error.click()
              return;
            }
          } else {

          }
        }
      })
    } else {
      this.MaterialAllReleasebtn = true
      // this.Error = 9
      this.ErrorMsg = ''
      this.ErrorMsg = 'Issue Qty Should Be Greater than Zero...'
      const minqty = document.getElementById('Error') as HTMLInputElement
      minqty?.click()
      return
    }
    this.Issueqtymodaldisable[this.issuedetalisIndex] = true
    // this.MaterilaDetalis[this.issuedetalisIndex].Issueqtymodal = ''

  }
  ExpirydateRawmatid: number = 0
  RemoveExpiryDateMatl() {
    this.MaterilaDetalis.splice(this.issuedetalisIndex, 1);
    for (let i = 0; i < this.Issuedetalisarr.length; i++) {
      if (this.Issuedetalisarr[i].MaterialID === this.ExpirydateRawmatid) {
        this.Issuedetalisarr.splice(i, 1);
      }
    }
    for (let i = 0; i < this.Batcharr.length; i++) {
      if (this.Batcharr[i].MaterialID === this.ExpirydateRawmatid) {
        this.Batcharr.splice(i, 1);

      }
    }
    this.Releasebtndisable[this.issuedetalisIndex] = false
    this.Issueqtymodaldisable[this.issuedetalisIndex] = false
    this.StoreIssueForm.controls['material'].enable()
    if (this.Rawmateriladata.length === this.ReleaseAllMaterial.length) {
      // this.MaterialAllReleasebtn = true
      this.MaterialAddbtn = true
      this.savebtn = true
    } else {
      // this.MaterialAllReleasebtn = false
      this.savebtn = false
      this.MaterialAddbtn = false
    }
  }
  BatchEmptyClear() {
    this.Tab1 = 0
    this.RawmaterialValid.push({
      RawMatName: this.MaterilaDetalis[this.issuedetalisIndex].gStrMatDisp,
      RawMatID: this.MaterilaDetalis[this.issuedetalisIndex].RawMatID,
    })
    // console.log(this.RawmaterialValid);
    this.MaterilaDetalis.splice(this.issuedetalisIndex, 1);
    this.Releasebtndisable[this.issuedetalisIndex] = false
    this.Issueqtymodaldisable[this.issuedetalisIndex] = false
    this.StoreIssueForm.controls['material'].enable()
    if (this.Rawmateriladata.length === this.ReleaseAllMaterial.length) {
      // this.MaterialAllReleasebtn = true
      this.MaterialAddbtn = true
      this.savebtn = true
    } else {
      // this.MaterialAllReleasebtn = false
      this.savebtn = false
      this.MaterialAddbtn = false
    }
  }
  ReleaseAllMaterial: any[] = new Array()
  MaterialAddbtn: boolean = true
  savebtn: boolean = false
  MaterialAllReleasebtn: boolean = true
  Issueqtymodaldisable = [false, false]
  Error: number = 0
  empty() {
    // debugger
    if (this.MaterilaDetalis.length > 0) {
      if (this.MaterilaDetalis[this.issuedetalisIndex].stock === 0) {
        if (this.MaterilaDetalis.length > 0) {
          this.MaterilaDetalis[this.issuedetalisIndex].Issueqtymodal = ''
        }
      }
    }
  }
  Deletemat(Index: number) {
    this.RawmaterialValid.push({
      RawMatName: this.MaterilaDetalis[Index].gStrMatDisp,
      RawMatID: this.MaterilaDetalis[Index].RawMatID,
    })
    // console.log(this.RawmaterialValid);
    this.MaterilaDetalis.splice(Index, 1);
    this.Issuedetalisarr.splice(Index, 1);
    this.Batcharr.splice(Index, 1);
    this.StoreIssueForm.controls['material'].enable()
    this.Releasebtndisable[Index] = false
    this.MaterialAddbtn = false
    this.Issueqtymodaldisable[Index] = false
    if (this.Rawmateriladata.length === this.ReleaseAllMaterial.length) {
      this.MaterialAddbtn = true
      this.savebtn = true
    } else {
      this.savebtn = false
      this.MaterialAddbtn = false
    }
  }
  batchwiseindex: number = 0
  DeleteBatchwise(Index: number) {
    this.batchwiseindex = Index
    this.Tab1 = 0
    this.RawmaterialValid.push({
      RawMatName: this.MaterilaDetalis[Index].gStrMatDisp,
      RawMatID: this.MaterilaDetalis[Index].RawMatID,
    })
    // console.log(this.RawmaterialValid);
    this.MaterilaDetalis.splice(Index, 1);
    this.Issuedetalisarr.splice(Index, 1);
    this.Batcharr.splice(Index, 1);
    this.Releasebtndisable[Index] = false
    this.Issueqtymodaldisable[Index] = false
    this.StoreIssueForm.controls['material'].enable()
    if (this.Rawmateriladata.length === this.ReleaseAllMaterial.length) {
      // this.MaterialAllReleasebtn = true
      this.MaterialAddbtn = true
      this.savebtn = true
    } else {
      // this.MaterialAllReleasebtn = false
      this.savebtn = false
      this.MaterialAddbtn = false
    }

  }

  MaterialReleaseClear() {
    this.MaterialRealase = []
    this.Batcharr = []
    this.Issuedetalisarr = []
  }
  ErrorMsg: string = ''
  releasebtn: any
  Savevaildation() {
    if (this.MaterilaDetalis[this.issuedetalisIndex].Issueqtymodal === '' || this.MaterilaDetalis[this.issuedetalisIndex].Issueqtymodal === 0) {
      this.ErrorMsg = ''
      this.ErrorMsg = 'Please Enter Issue Quantity'
      const savevaildation = document.getElementById('Error')
      savevaildation?.click()
      return
    } else {
      const savevaild = document.getElementById('savevaildation')
      savevaild?.click()
    }
    // }
  }
  SaveConfirm() {
    this.GetSave()
  }
  StoreIssueSave: any[] = new Array()
  UpdateStoreIssue: any[] = new Array()
  StoreIssue_Invent_MinMaterial: any[] = new Array()
  StoreIssue_invent_batchqtyissue: any[] = new Array()
  Sts: string = ''
  Msg: string = ''
  GetSave() {
    this.getStockReqno()
    this.StoreIssue_invent_batchqtyissue = []
    this.StoreIssue_Invent_MinMaterial = []
    this.UpdateStoreIssue = []
    for (let i = 0; i < this.Issuedetalisarr.length; i++) {
      this.StoreIssue_Invent_MinMaterial.push({
        Rawmatid: this.Issuedetalisarr[i].MaterialID,
        IssueQty: this.Issuedetalisarr[i].IssueQty,
        Uom: this.Issuedetalisarr[i].Uom,
        GrnNo: this.Issuedetalisarr[i].GRnNO,
        Empid: this.Empid,
        Grnid: this.Issuedetalisarr[i].Grnid,
        Min_ref_no: this.StockReqNo,
        Srid: this.Issuedetalisarr[i].Srid,
        StoreEntryId: this.Issuedetalisarr[i].StoreEntryId,
        InventRawmatid: this.Issuedetalisarr[i].MaterialID,
        InventProdid: this.Issuedetalisarr[i].MaterialID,
        InventGrnid: this.Issuedetalisarr[i].Grnid,
        InventMinQty: this.Issuedetalisarr[i].IssueQty,
        WarehouseLocationId: this.StoreIssueForm.controls['Warehouse'].value,
        CurrencyId: 1,
        Exrate: this.Issuedetalisarr[i].ExRate,
        LocationId: this.LoactionId,
        StrIssRef_no: this.StockReqNo
      })
    }
    console.log(this.StoreIssue_Invent_MinMaterial, 'StoreIssue_Invent_MinMaterial');
    if (this.Batcharr.length !== 0) {
      for (let i = 0; i < this.Batcharr.length; i++) {
        this.StoreIssue_invent_batchqtyissue.push({
          Grnno: this.Batcharr[i].Grnno,
          GrnId: this.Batcharr[i].GrnId,
          Grn_Ref_No: this.Batcharr[i].GrnRefNo,
          RawMatId: this.Batcharr[i].MaterialID,
          BatchNo: this.Batcharr[i].BatchNo,
          ExpiryDate: this.Batcharr[i].ExpiryDate,
          BatchId: this.Batcharr[i].BatchId,
          IssQty: this.Batcharr[i].IssueQty
        })
        console.log(this.StoreIssue_invent_batchqtyissue, 'StoreIssue_invent_batchqtyissue');
      }
    }
    if (this.Batcharr.length !== 0) {

      this.UpdateStoreIssue.push({
        Deptid: this.Deptid,
        StrIssRef_no: this.StockReqNo,
        LocationId: this.LoactionId,
        Empid: this.Empid,
        IssueId: this.Empid,
        ComputerName: 'Tab Entry',
        StoreIssue_Invent_MinMaterial: this.StoreIssue_Invent_MinMaterial,
        StoreIssue_invent_batchqtyissue: this.StoreIssue_invent_batchqtyissue
      })
      console.log(this.UpdateStoreIssue, 'saveData');
    } else {

      this.UpdateStoreIssue.push({
        Deptid: this.Deptid,
        StrIssRef_no: this.StockReqNo,
        LocationId: this.LoactionId,
        Empid: this.Empid,
        IssueId: this.Empid,
        ComputerName: 'Tab Entry',
        StoreIssue_Invent_MinMaterial: this.StoreIssue_Invent_MinMaterial,
        StoreIssue_invent_batchqtyissue: []
      })
      console.log(this.UpdateStoreIssue, 'saveData');
    }
    this.spinnerService.show()
    this.service.Save(this.UpdateStoreIssue).subscribe({
      next: (data: any) => {
        this.spinnerService.hide()
        this.StoreIssueSave = data
        // console.log(this.StoreIssueSave, 'Save');
        this.Sts = this.StoreIssueSave[0].status
        this.Msg = this.StoreIssueSave[0].Msg
        if (this.Sts === 'Y') {
          const Save = document.getElementById('Save') as HTMLInputElement
          Save.click()
        } else {
          const Save = document.getElementById('Save') as HTMLInputElement
          Save.click()
        }
      }

    })

  }
  finalSave() {
    this.getStockReqno()
    this.UpdateStoreIssue = []
    this.StoreIssue_invent_batchqtyissue = []
    this.StoreIssue_Invent_MinMaterial = []
    this.viewbtn = false
    this.StoreIssueForm.reset()
    this.MaterialRealase = []
    this.Batchwise = []
    this.Issuedetalisarr = []
    this.Batcharr = []
    this.BatchData = []
    this.StoreIssueForm.enable()
    this.Viewmat = false
    this.MaterialAddbtn = true
    this.savebtn = false
    this.MaterilaDetalis = []
    this.Releasebtndisable = [false, false]
    this.Issueqtymodaldisable = [false, false]
  }
  savetimeerror() {
    this.StoreIssue_invent_batchqtyissue = []
    this.StoreIssue_Invent_MinMaterial = []
    this.UpdateStoreIssue = []
  }
  ViewMaterilaDetalis: any[] = new Array()
  View(Index: number) {
    const MaterailTabView = document.getElementById('MaterailTabView') as HTMLInputElement
    MaterailTabView.click()
    this.ViewMaterilaDetalis = []
    this.ViewMaterilaDetalis.push({
      MaterialName: this.MaterilaDetalis[Index].gStrMatDisp,
      SRUom: this.MaterilaDetalis[Index].SRUom,
      loc_id: this.MaterilaDetalis[Index].loc_id,
      max_level: this.MaterilaDetalis[Index].max_level,
      reorder_level: this.MaterilaDetalis[Index].reorder_level,
      deptname: this.MaterilaDetalis[Index].deptname,
      popend: this.MaterilaDetalis[Index].popend,
    })
    // console.log(this.ViewMaterilaDetalis, 'view');
  }
  Spinnercall() {
    this.spinnerService.show()
  }
  StoreIssueid: number = 460
  ComputerName: string = 'Tab-Entry'
  Updatelockscreen = {}
  back() {
    this.StoreIssueid = 166
    this.service.screenlockvaild(this.StoreIssueid, this.LoactionId).subscribe({
      next: (res: any) => {
        let screenlockvaildation = res
        console.log(screenlockvaildation, 'screenlockvaildation');
        if (screenlockvaildation.length > 0) {
          this.Updatelockscreen = {}
          this.Updatelockscreen = {
            LocationId: this.LoactionId,
            EmpId: this.Empid,
            ModuleId: this.StoreIssueid,
            Loginsystem: 'Tab-Entry'
          }
          this.service.Updatelogoutime(this.Updatelockscreen).subscribe({
            next: (res: any) => {
              const updatelockscrrentime = res
              console.log(updatelockscrrentime, 'updatelockscrrentime');
              if (updatelockscrrentime[0].status === 'Y') {
                this.toastr.show(updatelockscrrentime[0].Msg)
              } else {
                this.toastr.error(updatelockscrrentime[0].Msg)
              }
            }
          })
        }
      }
    })
    this.router.navigate(['/Inventory'], {});
  }
  home() {
    this.StoreIssueid = 166
    this.service.screenlockvaild(this.StoreIssueid, this.LoactionId).subscribe({
      next: (res: any) => {
        let screenlockvaildation = res
        console.log(screenlockvaildation, 'screenlockvaildation');
        if (screenlockvaildation.length > 0) {
          this.Updatelockscreen = {}
          this.Updatelockscreen = {
            LocationId: this.LoactionId,
            EmpId: this.Empid,
            ModuleId: this.StoreIssueid,
            Loginsystem: 'Tab-Entry'
          }
          this.service.Updatelogoutime(this.Updatelockscreen).subscribe({
            next: (res: any) => {
              const updatelockscrrentime = res
              console.log(updatelockscrrentime, 'updatelockscrrentime');
              if (updatelockscrrentime[0].status === 'Y') {
                this.toastr.show(updatelockscrrentime[0].Msg)
              } else {
                this.toastr.error(updatelockscrrentime[0].Msg)
              }
            }
          })

        }
      }
    })
    this.router.navigate(['/Dashboard'], {});
  }
  Updatelogout = {}
  logout() {
    this.StoreIssueid = 166
    this.Updatelockscreen = {}
    this.Updatelockscreen = {
      LocationId: this.LoactionId,
      EmpId: this.Empid,
      ModuleId: this.StoreIssueid,
      Loginsystem: 'Tab-Entry'
    }
    this.service.Updatelogoutime(this.Updatelockscreen).subscribe({
      next: (res: any) => {
        const updatelockscrrentime = res
        console.log(updatelockscrrentime, 'updatelockscrrentime');
        if (updatelockscrrentime[0].status === 'Y') {

          // this.toastr.show(updatelockscrrentime[0].Msg)
        } else {
          // this.toastr.error(updatelockscrrentime[0].Msg)
        }

      }
    })
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    let updatelist = []
    updatelist.push({
      EmpId: Data.empid,
    })
    this.loginservice.UpdateUserDet(updatelist).subscribe({
      next: (data: any) => {
        if (data.length >= 1) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.toastr.success('Logout Successfully');
          sessionStorage.clear();
          localStorage.clear();
          this.dialog.closeAll();
          this.router.navigate(['/']);
        }
      }
    })
  }
  Errormsg: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });
  }
}

