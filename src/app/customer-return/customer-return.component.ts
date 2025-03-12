import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerReturnService } from '../service/customer-return.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { data } from 'jquery';
import { CustomerRejdialogComponent } from '../customer-rejdialog/customer-rejdialog.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-customer-return',
  templateUrl: './customer-return.component.html',
  styleUrls: ['./customer-return.component.scss']
})
export class CustomerReturnComponent implements OnInit, AfterViewInit,OnDestroy {

  CustomerReturnForm!: FormGroup
  GeneralForm!: FormGroup
  CustomerReturnList: any[]=new Array()
  currenntdate=new Date()
  dataSource=new MatTableDataSource<any>(this.CustomerReturnList);
  constructor(private service: CustomerReturnService, private date: DatePipe, private spinner: NgxSpinnerService, private fb: FormBuilder, private dialog: MatDialog) {

    this.CustomerReturnForm = this.fb.group({
      GrnPathNo: ['', [Validators.required]],
      GrnDate: [new Date, Validators.required],
      Billdate: [new Date, Validators.required],
      CostCenter: ['', [Validators.required]],
      Customer: ['', [Validators.required]],
      GateEntryNo: ['', [Validators.required]],
      BillNo: ['', [Validators.required]],
      DcNo: ['', [Validators.required]],
    })
  }
  ngOnDestroy(): void {
   this.dialog.closeAll()
  }
  ngAfterViewInit() {

  }
  LocationId: number = 0
  Costcenter: string = ''
  grnpath: string = ''

  ngOnInit() {
    this.GeneralForm = this.fb.group({
      InvoiceNo: ['', [Validators.required]],

    })
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]
    this. getStockReqno() 
    // 
  }
  masterid: number = 460
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    let date=this.date.transform(this.currenntdate ,'yyyy-MM-dd')
    this.service.Stockreno(this.masterid, date, this.LocationId).subscribe((res: any) => {
      this.StockReq = res
      console.log(this.StockReq, 'StockReqNo');
      if (this.StockReq.length != 0) {
        this.StockReqNo = this.StockReq[0].translno
        this.CustomerReturnForm.controls['GrnPathNo'].setValue( this.StockReqNo)
        // this.StockReqNo = 'SR/U1/23-24/14489'
      }
    })
    this.  getCostcenter()
  }
  DefaultCostCenter: any
  CostCenter: any[] = new Array()
  getCostcenter() {
    this.service.CostCenter().subscribe({
      next: (res: any) => {
        console.log(res);
        this.CostCenter = res
      },
      error: (err: any) => {
        this.Error = err
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
    this.  getCustomer()
  }
  clear() {
    this.customername = ''
    this.getCustomer()
  }
  customername: string = ''
  inputSelect(e: any) {
    this.customername = e.target.value
    this.getCustomer()
  }
  Customer: any[] = new Array()
  getCustomer() {
    this.service.Customer(this.customername).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog
            return
          }
          this.Customer = res
        } else {
          this.Error = 'No Data Found'
          this.userHeader = 'Error'
          this.opendialog()
        }
      },
      error: (err: any) => {
        this.Error = err
        this.userHeader = 'Error'
        this.opendialog()
      },

    })
  }
  ProductList: any[] = new Array()
  CustomerChangeEvent(e: any) {
    this.CustomerReturnForm.controls['Customer'].setValue(e.value)
    this.getGateEntry()

  }
  GateEntryNo: any[] = new Array()
  getGateEntry() {
    let partid = this.CustomerReturnForm.controls['Customer'].value
    this.service.GateEntry(partid, this.LocationId, partid).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog
            return
          }
          this.GateEntryNo = res
        } else {
          this.Error = 'No Data Found'
          this.userHeader = 'Error'
          this.opendialog()
        }
      }
    })
  }
  GateEntryChange(e: any) {
    this.CustomerReturnForm.controls['BillNo'].setValue(e.value)
    this.CustomerReturnForm.controls['DcNo'].setValue(e.value)
  }
  View() {
    if (this.CustomerReturnForm.invalid) {  
      return
    } else {
      const opencustomerRej=this.dialog.open(CustomerRejdialogComponent,{
        disableClose: true,
         width:'auto', 
         height:'100%',
        data:{CustomerId:this.CustomerReturnForm.controls['Customer'].value,Tabel:this.dataSource.data}
      })
      return opencustomerRej
    }
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


  
}
