import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReworkissueService } from '../service/reworkissue.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { data, event } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reworkissue',
  templateUrl: './reworkissue.component.html',
  styleUrls: ['./reworkissue.component.scss']
})
export class ReworkissueComponent implements OnInit {
  currentDate = new Date()
  currentDate1 = new Date()
  currentDate2 = new Date()
  Issuedate: any
  fromdt: any
  Todate: any
  ReworkIssueForm!: FormGroup;
  LoactionId: number = 0
  Empid: number = 0
  Error: string = ''
  @ViewChild('invalidfocus') invalidfocus!: ElementRef;
  @ViewChild('ErrorNative') ErrorNative !: ElementRef;
  @ViewChild('SaveVaild') SaveVaild!: ElementRef;
  @ViewChild('Savenative') Savenative!: ElementRef;
  constructor(private router: Router, private date: DatePipe, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder, private service: ReworkissueService) { }
  ngOnInit(): void {
    this.Issuedate = this.date.transform(this.currentDate, 'yyyy-MM-dd');

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);
    this.ReworkIssueForm = this.formBuilder.group({
      IssueNo: new FormControl('', Validators.required),
      Department: new FormControl('', Validators.required),
      Refno: new FormControl('', Validators.required),
      material: new FormControl('', Validators.required),
      Warehouse: new FormControl('', Validators.required),
      FrmDate: new FormControl(this.date.transform(this.currentDate, '2024-05-01'), Validators.required),
      Todate: new FormControl(this.date.transform(this.currentDate, 'yyyy-MM-dd'), Validators.required),
    })
    this.getStockReqno()
  }
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
        this.ReworkIssueForm.controls['IssueNo'].setValue( this.StockReqNo)
      }
    })
  }
  Deptdata: any[] = new Array()
  getDept() {
    let Frmdate = this.ReworkIssueForm.controls['FrmDate'].value
    let Todate = this.ReworkIssueForm.controls['Todate'].value
    this.service.Dept(this.LoactionId, Frmdate, Todate).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg;
            this.ErrorNative.nativeElement.click();
            return;
          }
          this.Deptdata = data
        }
        // else {
        //   this.Errornum=0
        //   this.Error = 'For This Date No Department Will Raise The Rework Issue';
        //   this.ErrorNative.nativeElement.click();
        //   return;
        // }
      },
      error: (error: any) => {
        this.Errornum=0
        this.Error = error;
        this.ErrorNative.nativeElement.click();
        return;
      },
    })
  }

  DeptEvent() {
    this.ReworkIssueForm.controls['Department'].value
    this.getRefno()
  }
  Frmdatevent(event: any) {
    this.getDept()
  }

  RefnoData: any[] = new Array()
  getRefno() {
    let Dept = parseInt(this.ReworkIssueForm.controls['Department'].value)
    this.spinnerService.show()
    this.service.RefNo(this.LoactionId, this.Issuedate, Dept).subscribe({
      next: (data: any) => {
        this.spinnerService.hide()
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Errornum=0
            this.Error = data[0].Msg;
            this.ErrorNative.nativeElement.click();
            return;
          }
          this.ReworkIssueForm.controls['Refno'].setValue('SR/U1/17-18/10936')
          this.RefnoData = data
          console.log(this.RefnoData);
        }
      },
      error: (error: any) => {
        this.Errornum=0
        this.Error = error;
        this.ErrorNative.nativeElement.click();
        return;
      },
    })
  }
  REFNo: string = ''
  RefnoEvent() {
    this.ReworkIssueForm.controls['Refno'].value
    const refno = this.RefnoData.forEach((res: any) => {
      if (res.SrNo == parseInt(this.ReworkIssueForm.controls['Refno'].value)) {
        this.REFNo = res.Sr_Ref_No
      }
    })
    console.log(this.REFNo);

    this.getWarehouse()
  }
  warehouseData: any[] = new Array()
  getWarehouse() {
    this.service.Warehouse(this.LoactionId).subscribe({
      next: (data: any) => {
        this.warehouseData = data
        console.log(this.warehouseData, 'warehouse');
        if (this.warehouseData.length > 0) {
          if (this.warehouseData[0].status == 'N') {
            this.Errornum=0
            this.Error = data[0].Msg;
            this.ErrorNative.nativeElement.click();
            return;
          }
          if (this.LoactionId == 1) {
            this.ReworkIssueForm.controls['Warehouse'].setValue(42)
            this.getMaterial()
          }
          if (this.LoactionId == 2) {
            this.ReworkIssueForm.controls['Warehouse'].setValue(51)
            this.getMaterial()
          }
        }
      },
      error: (error: any) => {
        this.Errornum=0
        this.Error = error;
        this.ErrorNative.nativeElement.click();
        return;
      },
    })
  }

  Materialdata: any[] = new Array()

  RawmaterialValid: any[] = new Array()
  getMaterial() {
    let RefNo = this.REFNo
    let DeptId = parseInt(this.ReworkIssueForm.controls['Department'].value)
    this.service.Material(this.LoactionId, DeptId, RefNo).subscribe({
      next: (data: any) => {
        this.Materialdata = data
        if (data[0].status == 'N') {
          this.Errornum=0
          this.Error = data[0].Msg;
          this.ErrorNative.nativeElement.click();
          return;
        }
        this.RawmaterialValid = []
        for (let i = 0; i < this.Materialdata.length; i++) {
          // this.MaterialAddbtn = false
          this.RawmaterialValid = []
          this.RawmaterialValid.push({
            RawMatName: this.Materialdata[i].RawMatName,
            RawMatID: this.Materialdata[i].RawMatID
          })
        }
      },
      error: (error: any) => {
        this.Errornum=0
        this.Error = error;
        this.ErrorNative.nativeElement.click();
        return;
      },
    })
  }
  getMaterialDetails() {
    this.ReworkIssueForm.controls['material'].value

  }
  get view(): { [key: string]: AbstractControl } {
    return this.ReworkIssueForm.controls;
  }
  viewbtn: any
  Tab1 = 0;
  MaterialRealase: any = new Array()
  PendingQty: any = 0
  ViewMaterial: boolean = false
  materialTabel: any[] = new Array()
  View() {
    this.viewbtn = true
    if (this.ReworkIssueForm.invalid) {
      return
    } else {
      let DeptId = parseInt(this.ReworkIssueForm.controls['Department'].value)
      let RefNo = this.ReworkIssueForm.controls['Refno'].value
      let Matid = this.ReworkIssueForm.controls['material'].value
      if (this.materialTabel.length > 0) {
        for (let i = 0; i < this.materialTabel.length; i++) {
          if (Matid == this.materialTabel[i].RawMatID && RefNo == this.materialTabel[i].Sr_Ref_No) {
            this.Errornum=0
            this.Error = ''
            this.Error = 'Same ' + this.materialTabel[i].gStrMatDisp + ' not be added..Please Select another Material '
            this.ErrorNative.nativeElement.click()
            return
          }
        }
      }
      this.spinnerService.show()
      this.service.View(this.LoactionId, this.Issuedate, DeptId, RefNo, Matid).subscribe({
        next: (data: any) => {
          this.spinnerService.hide()
          if (data[0].status == 'N') {
            this.Errornum=0
            this.Error = data[0].Msg;
            this.ErrorNative.nativeElement.click();
            return;
          }
          this.MaterialRealase = data
          console.log(this.MaterialRealase, 'ft');
          if (this.MaterialRealase.length == 0) {
            this.Errornum=0
            this.Error = ''
            this.Error = 'For This ' + this.ReworkIssueForm.controls['Refno'].value + ' No Material Found..'
            this.ErrorNative.nativeElement.click()
            return
          }
          else {
            for (let i = 0; i < this.MaterialRealase.length; i++) {
              if (this.MaterialRealase[i].stock == 0) {
                this.Errornum=0
                this.Error = ''
                this.Error = 'Stock Is Not Available For This Material...'
                this.ErrorNative.nativeElement.click()
                return
              }
              else {
                this.ViewMaterial = true
                this.PendingQty = (this.MaterialRealase[i].srqty - this.MaterialRealase[i].minqty).toFixed(3)
                this.materialTabel.push({
                  SRId: this.MaterialRealase[i].SRId,
                  Sr_Ref_No: this.MaterialRealase[i].Sr_Ref_No,
                  SRDate: this.MaterialRealase[i].SRDate,
                  gStrMatDisp: this.MaterialRealase[i].gStrMatDisp,
                  RawMatID: this.MaterialRealase[i].RawMatID,
                  SRUom: this.MaterialRealase[i].SRUom,
                  srqty: this.MaterialRealase[i].srqty,
                  Pendingqty: this.MaterialRealase[i].srqty - this.MaterialRealase[i].minqty,
                  stock: this.MaterialRealase[i].stock,
                  min_level: this.MaterialRealase[i].min_level,
                  max_level: this.MaterialRealase[i].max_level,
                  reorder_level: this.MaterialRealase[i].reorder_level,
                  deptname: this.MaterialRealase[i].deptname,
                  IssueQty: '',
                  Releasebtn: false
                  // color: this.StockMinimumcheck
                })
              }
              this.Tab1 = 0
              this.ReworkIssueForm.disable()
              this.Addbtn=true
              console.log(this.materialTabel, 'matlTabel');
            }

          }
        },
        error: (error: any) => {
          this.Errornum=0
          this.Error = error;
          this.ErrorNative.nativeElement.click();
          return;
        },
      })
    }
  }
  tablabelname: string = '';
  tabChangedRegular(e: MatTabChangeEvent) {
    this.Tab1 = e.index;
    console.log(this.Tab1, 'tab');

    console.log(this.Tab1, 'Tab');
    this.tablabelname = e.tab.textLabel
    console.log(this.tablabelname);

  }
  Errornum: number = 0
  MinmumStckchckN() {
    this.materialTabel.splice(this.Ind, 1);
    this.Addbtn=false;
    this.ReworkIssueForm.enable()
  }

  Ind: number = 0
  ReleaseVaildation(Index: number) {
    this.Ind = Index
    if (this.materialTabel[Index].Pendingqty < this.materialTabel[Index].IssueQty) {
      this.Errornum=0
      this.Error = ''
      this.Error = 'You Cannot Issue More Than The Request Quantity'
      this.materialTabel[Index].IssueQty = 0
      this.ErrorNative.nativeElement.click()
      this.materialTabel[Index].Releasebtn = true
      return
    } else {
      this.materialTabel[Index].Releasebtn = false
    }
    if (this.materialTabel[Index].stock < this.materialTabel[Index].IssueQty) {
      this.Errornum=0
      this.Error = ''
      this.Error = 'You Cannot Issue More Than The Available Stock'
      this.materialTabel[Index].IssueQty = 0
      this.ErrorNative.nativeElement.click()
      this.materialTabel[Index].Releasebtn = true
      return
    } else {
      this.materialTabel[Index].Releasebtn = false
    }
    if (this.materialTabel[Index].min_level < this.materialTabel[Index].IssueQty) {
      this.Errornum = 1
      this.Error = ''
      this.Error = 'Shall Issue More Than The Minimum Quantity'
      this.ErrorNative.nativeElement.click()
    }
  }
  MinmumStckchckY() {
    let index = this.Ind;
    this.Release(index)
  }
  Stock_grindData: any[] = new Array()
  SubconInwardQtyUpdate: any[] = new Array()
  issedetalisRecord: any[] = new Array()
  IssueDetalisArray: any[] = new Array()
  Refno: string = ''
  material: string = ''
  uom: string = ''
  srqty: any = 0
  SrDate: any
  deptname: string = ''
  dblqty: number = 0
  Addbtn:boolean=false
  Release(Index: number) {
    this.Tab1 = 1
    let warehouse = parseInt(this.ReworkIssueForm.controls['Warehouse'].value)
    let MaterilID = parseInt(this.ReworkIssueForm.controls['material'].value)
    this.service.Stock_grnid(warehouse, MaterilID).subscribe({
      next: (data: any) => {
        this.Stock_grindData = data
        if (data[0].status == 'N') {
          this.Errornum=0
          this.Error = data[0].Msg;
          this.ErrorNative.nativeElement.click();
          return;
        }
        if (this.Stock_grindData.length !== 0) {
          this.Refno = this.MaterialRealase[0].Sr_Ref_No
          this.SrDate = this.MaterialRealase[0].SRDate
          this.material = this.MaterialRealase[0].gStrMatDisp
          this.uom = this.MaterialRealase[0].SRUom
          this.srqty = this.MaterialRealase[0].srqty
          this.deptname = this.MaterialRealase[0].deptname
          console.log(this.Refno);
        }
      },
      error: (error: any) => {
        this.Errornum=0
        this.Error = error;
        this.ErrorNative.nativeElement.click();
        return;
      },
    })
    if (this.materialTabel[Index].IssueQty > 0) {
      this.dblqty = this.materialTabel[Index].IssueQty
      this.spinnerService.show()
      let warehouse = parseInt(this.ReworkIssueForm.controls['Warehouse'].value)
      let matlid = parseInt(this.ReworkIssueForm.controls['material'].value)
      this.service.issuedetalis(warehouse, matlid, this.LoactionId).subscribe({
        next: (data: any) => {
          this.issedetalisRecord = data
          console.log(this.issedetalisRecord);
          this.spinnerService.hide()
          if (this.issedetalisRecord.length > 0) {
            console.log(this.issedetalisRecord, 'issedetalisRecord');
            if (parseInt(this.ReworkIssueForm.controls['Warehouse'].value) !== 32) {
              for (let i = 0; i < this.issedetalisRecord.length; i++) {
                if (this.dblqty > 0) {
                  if (this.dblqty <= parseInt(this.issedetalisRecord[i].Stock)) {
                    this.IssueDetalisArray.push({
                      Srid: this.materialTabel[Index].SRId,
                      RawMatID: this.materialTabel[Index].RawMatID,
                      gStrMatDisp: this.materialTabel[Index].gStrMatDisp,
                      SrNo: this.materialTabel[Index].SrNo,
                      Refno: this.Refno,
                      Date: this.SrDate,
                      Material: this.material,
                      Uom: this.uom,
                      SRQty: this.PendingQty,
                      IssueQty: this.dblqty,
                      stock: this.issedetalisRecord[i].Stock,
                      GRNID: this.issedetalisRecord[i].GRNID,
                      GrnNo: this.issedetalisRecord[i].GrnNo,
                      GrnRefno: this.issedetalisRecord[i].Grn_Ref_no,
                      GrnQty: this.issedetalisRecord[i].Stock,
                      Department: this.deptname,
                      STOREID: this.issedetalisRecord[i].StoreEntryId
                    })
                    console.log(this.IssueDetalisArray);
                    this.dblqty = 0
                    this.materialTabel[Index].Releasebtn = true
                    this.materialTabel[Index].IssueQtydis = true
                  } else {
                    if (this.issedetalisRecord[i].Stock < this.dblqty) {
                      this.issedetalisRecord[i].IssueQty = this.issedetalisRecord[i].Stock
                      this.dblqty = this.dblqty - this.issedetalisRecord[i].Stock
                    } else {
                      this.issedetalisRecord[i].IssueQty = this.dblqty
                    }
                    this.IssueDetalisArray.push({
                      Srid: this.materialTabel[Index].SRId,
                      RawMatID: this.materialTabel[Index].RawMatID,
                      gStrMatDisp: this.materialTabel[Index].gStrMatDisp,
                      SrNo: this.materialTabel[Index].SrNo,
                      Refno: this.Refno,
                      Date: this.SrDate,
                      Material: this.material,
                      Uom: this.uom,
                      SRQty: this.PendingQty,
                      IssueQty: this.issedetalisRecord[i].IssueQty,
                      stock: this.issedetalisRecord[i].Stock,
                      GRNID: this.issedetalisRecord[i].GRNID,
                      GrnNo: this.issedetalisRecord[i].GrnNo,
                      GrnRefno: this.issedetalisRecord[i].Grn_Ref_no,
                      GrnQty: this.issedetalisRecord[i].Stock,
                      Department: this.deptname,
                      STOREID: this.issedetalisRecord[i].StoreEntryId
                    })
                    console.log(this.IssueDetalisArray);
                    this.materialTabel[Index].Releasebtn = true
                    this.materialTabel[Index].IssueQtydis = true
                  }
                }
              }
              this.ReworkIssueForm.enable()
              this.Addbtn=false
            }
            if (parseInt(this.ReworkIssueForm.controls['Warehouse'].value) == 32) {
              for (let i = 0; i < this.issedetalisRecord.length; i++) {
                if (this.issedetalisRecord[i].Stock > 0) {
                  this.IssueDetalisArray.push({
                    Srid: this.materialTabel[Index].SRId,
                    RawMatID: this.materialTabel[Index].RawMatID,
                    gStrMatDisp: this.materialTabel[Index].gStrMatDisp,
                    SrNo: this.materialTabel[Index].SrNo,
                    Refno: this.Refno,
                    Date: this.SrDate,
                    Material: this.material,
                    Uom: this.uom,
                    SRQty: this.PendingQty,
                    IssueQty: this.dblqty,
                    stock: this.issedetalisRecord[i].Stock,
                    GRNID: this.issedetalisRecord[i].GRNID,
                    GrnNo: this.issedetalisRecord[i].GrnNo,
                    GrnRefno: this.issedetalisRecord[i].Grn_Ref_no,
                    GrnQty: this.issedetalisRecord[i].Stock,
                    Department: this.deptname,
                    STOREID: this.issedetalisRecord[i].StoreEntryId
                  })
                  console.log(this.IssueDetalisArray);
                  this.materialTabel[Index].Releasebtn = true
                  this.materialTabel[Index].IssueQtydis = true
                  this.dblqty = 0
                }
              }
            }
          } else {
            this.Errornum=0
            this.Error = 'For This  ' + this.materialTabel[Index].gStrMatDisp + ' item Stock Is Not Available in This WareHouse';
            this.Addbtn=false
            this.ReworkIssueForm.enable()
            this.ErrorNative.nativeElement.click();
            this.materialTabel.splice(Index, 1);
            return;
          }
        },
        error: (err) => {
          this.Errornum=0
          this.Error = err;
          this.ErrorNative.nativeElement.click();
          return;
        },
      })
    } else {
      this.Errornum=0
      this.Error = 'For This  ' + this.materialTabel[Index].gStrMatDisp + ' item Issue Qty Is Zero. Please Check...';
      this.ErrorNative.nativeElement.click();
      return;
    }
  }
  Deletematl(Index: any) {
    this.issedetalisRecord.splice(Index, 1);
    // this.materialTabel.splice(Index, 1);
  }
  getSave() {
    if (this.IssueDetalisArray.length == 0) {
      this.Errornum=0
      this.Error = 'Atleast Add One Material In Issue Detalis Tabel With GrnStock';
      this.ErrorNative.nativeElement.click();
      return;
    } else {
      this.SaveVaild.nativeElement.click()
    }
  }
  UpdateArr: any[] = new Array()
  ReworkDet: any = new Array()
  Sts: string = ''
  Msg: String = ''
  Save() {
    this.UpdateArr = []
    this.ReworkDet = []
    for (let i = 0; i < this.IssueDetalisArray.length; i++) {
      this.ReworkDet.push({
        Srid: this.IssueDetalisArray[i].Srid,
        Rawmatid: this.IssueDetalisArray[i].RawMatID,
        Qty: this.IssueDetalisArray[i].IssueQty,
        Uom: this.IssueDetalisArray[i].Uom,
        GrnNo: this.IssueDetalisArray[i].GrnNo,
        LoginId: this.Empid,
        GrnId: this.IssueDetalisArray[i].GRNID,
        Min_Ref_No: this.ReworkIssueForm.controls['IssueNo'].value,
        StoreEntryId: this.IssueDetalisArray[i].STOREID,
        WareHouse: parseInt(this.ReworkIssueForm.controls['Warehouse'].value),
        RawMaterial: this.IssueDetalisArray[i].gStrMatDisp
      })
    }
    this.UpdateArr.push({
      DeptId: parseInt(this.ReworkIssueForm.controls['Department'].value),
      Min_ref_no: this.ReworkIssueForm.controls['IssueNo'].value,
      LocationId: this.LoactionId,
      LoginId: this.Empid,
      ReworkDet: this.ReworkDet,
    })
    console.log(this.UpdateArr);
    this.getStockReqno()
    this.spinnerService.show()
    this.service.Update(this.UpdateArr).subscribe({
      next: (res: any) => {
        this.spinnerService.hide()
        console.log(res);
        this.Sts = res[0].status
        this.Msg = res[0].Msg
        if (this.Sts == 'Y') {
          this.Savenative.nativeElement.click()
        } else {
          this.Savenative.nativeElement.click()
        }
      },
      error: (err) => {
        this.Errornum=0
        this.Error = err;
        this.ErrorNative.nativeElement.click();
        return;
      },
    })
  }
  finalSave() {
    this.IssueDetalisArray = []
    this.UpdateArr = []
    this.ReworkDet=[]
    this.materialTabel = []
    this.ViewMaterial = false
    this.getStockReqno()
    this.ReworkIssueForm.reset()
    this.viewbtn=false
    this.Addbtn=false
    this.Issuedate = this.date.transform(this.currentDate, 'yyyy-MM-dd')
    this.ReworkIssueForm.controls['FrmDate'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'))
    this.ReworkIssueForm.controls['Todate'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'))
  }
  savetimeerror() {
    this.UpdateArr = []
    this.ReworkDet=[]
  }
}
