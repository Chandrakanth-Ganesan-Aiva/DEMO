import { Component } from '@angular/core';
import { SupplierregAppFinService } from '../service/supplierreg-app-fin.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { data } from 'jquery';
@Component({
  selector: 'app-supplierreg-app-fin',
  templateUrl: './supplierreg-app-fin.component.html',
  styleUrl: './supplierreg-app-fin.component.scss'
})
export class SupplierregAppFinComponent {
  constructor(private service: SupplierregAppFinService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.load()
    this.service.pType().subscribe((result: any) => {
      this.partyTypeArray = result
    })

    this.service.ledgergrp().subscribe((result: any) => {
      this.ledgergrpArray = result
    })
  }
  empid: number = 0
  empname: string = ''
  vendor: boolean = true
  partyType: string = ''
  ledgergrp: string = ''
  capital: number | null = null
  banker: string | null = ''
  ssi: string | null = ''
  gst: string | null = ''
  ecc_no: String | null = ''
  currency: string | null = ''
  partyid: string | null = ''
  Ledgername: string | null = ''
  empArray: any[] = []
  tableArray: any[] = []
  selectArray: any[] = []
  lastrowArray: any[] = []
  inputArray: any[] = []
  partyTypeArray: any[] = []
  ledgergrpArray: any[] = []
  approveArray: any[] = []
  load() {
    this.service.load().subscribe((result: any) => {
      this.tableArray = result
      this.service.empid(this.empid).subscribe((result: any) => {
        this.empArray = result
        this.empname = this.empArray[0].empname
      })
    })
  }
  select(event: any, row: any) {
    this.lastrowArray = []
    if (event.target.checked) {
      this.selectArray.push(row)
    }
    else {
      this.selectArray = this.selectArray.filter(item => item !== row)
      this.capital = null
      this.banker = ''
      this.ssi = ''
      this.gst = ''
      this.ecc_no = ''
      this.currency = ''
      this.partyid = ''
      this.Ledgername = ''
      this.ledgergrp = ''
      this.partyType = ''
    }
    if (this.selectArray.length > 0) {
      this.lastrowArray.push(this.selectArray.length > 0 ? this.selectArray[this.selectArray.length - 1] : null)
      this.service.input(this.lastrowArray[0].code).subscribe((result: any) => {
        this.inputArray = result
        this.capital = this.inputArray[0].capital
        this.banker = this.inputArray[0].bankersname
        this.ssi = this.inputArray[0].ssiregno
        this.gst = this.inputArray[0].gstno
        this.ecc_no = this.inputArray[0].sup_eccno
        this.partyid = this.inputArray[0].partyid
        this.Ledgername = this.inputArray[0].name
        this.service.currency(this.inputArray[0].currid).subscribe((result: any) => {
          this.currency = result[0].CurrDesc
        })
        this.service.partytype(this.inputArray[0].ctypeid).subscribe((result: any) => {
          this.partyType = result[0].xxx
        })
        this.service.ledger(this.inputArray[0].partygroup).subscribe((result: any) => {
          this.ledgergrp = result[0].xxx
        })

      })
    }
  }
  approve() {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    if (this.selectArray.length > 0) {
      for (let i = 0; i < this.selectArray.length; i++) {
        this.approveArray.push({
          empid: this.empid,
          today: formattedDate,
          partyid: this.selectArray[i].partyid
        })
      }
      this.Error = 'Are Sure to Approve?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.approve(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
            this.clear()
            this.partyType = ''
            this.ledgergrp = ''
            this.tableArray = []
            this.selectArray = []
            this.lastrowArray = []
            this.inputArray = []
            this.approveArray = []
            this.capital = null
            this.banker = ''
            this.ssi = ''
            this.gst = ''
            this.ecc_no = ''
            this.currency = ''
            this.partyid = ''
            this.Ledgername = ''
            this.load()
          })
        }
      })
    }
    else {
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  clear() {
    this.partyType = ''
    this.ledgergrp = ''
    this.tableArray = []
    this.selectArray = []
    this.lastrowArray = []
    this.inputArray = []
    this.approveArray = []
    this.capital = null
    this.banker = ''
    this.ssi = ''
    this.gst = ''
    this.ecc_no = ''
    this.currency = ''
    this.partyid = ''
    this.Ledgername = ''
    this.load()
  }
  Error: String = ''
  userHeader: String = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}