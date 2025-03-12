import { Component } from '@angular/core';
import { ClearingApprovalService } from '../service/clearing-approval.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-clearing-approval',
  templateUrl: './clearing-approval.component.html',
  styleUrl: './clearing-approval.component.scss'
})
export class ClearingApprovalComponent {
  constructor(private service: ClearingApprovalService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    const locationid = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = locationid[0]
    this.view()
    this.Approver()
    this.table3()
  }

  LocationId: number = 0
  empid: number = 0
  selectedRowObject: any
  ApproverArray: any[] = []

  Approver() {
    this.service.Approver(this.empid).subscribe((result: any) => {
      this.ApproverArray = result
    })
  }

  table1Array: any[] = []
  show: boolean = false
  view() {
    this.service.table1(this.LocationId).subscribe((result: any) => {
      this.table1Array = result
      if (this.table1Array.length > 0) {
        this.show = this.show
      }
      else {
        this.show = !this.show
      }
    })
  }

  selectedRows: any[] = []
  checked(event: Event, row: any, index: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedRows.push(row)
    }
    else {
      this.selectedRows = this.selectedRows.filter((_, i) => i !== index)
    }
    console.log(this.selectedRows, 'selectedrows');
    if (this.selectedRows.length > 0) {
      this.table2()
    }
    else {
      this.showtable = false
    }
  }

  table2Array: any[] = []
  idArray: any[] = []
  total: number = 0
  showtable: boolean = false
  table2() {

    if (this.selectedRows.length > 0) {
      this.showtable = true
      this.selectedRowObject = this.selectedRows[this.selectedRows.length - 1]
      const id = this.selectedRowObject.id
      this.total = this.selectedRowObject.totamount
      this.service.table2(id, this.LocationId).subscribe((result: any) => {
        this.table2Array = result
      })
    }
  }

  handlingChargesArray: any[] = []
  AgenciesChargesArray: any[] = []
  CFSChargeArray: any[] = []
  LinearChargeArray: any[] = []
  LinearAddChrArray: any[] = []
  TransportChargesArray: any[] = []
  table3() {
    this.service.handlingcharge(this.LocationId).subscribe((result: any) => {
      this.handlingChargesArray = result
    })

    this.service.AgenciesCharges(this.LocationId).subscribe((result: any) => {
      this.AgenciesChargesArray = result
    })

    this.service.CFSCharge(this.LocationId).subscribe((result: any) => {
      this.CFSChargeArray = result
    })

    this.service.LinearCharge(this.LocationId).subscribe((result: any) => {
      this.LinearChargeArray = result
    })

    this.service.LinerAdditionalCharges(this.LocationId).subscribe((result: any) => {
      this.LinearAddChrArray = result
    })

    this.service.TransportCharges(this.LocationId).subscribe((result: any) => {
      this.TransportChargesArray = result
    })
  }

  approveArray: any[] = []
  Error: string = ''
  userHeader: string = ''

  Approve() {
    if (this.selectedRows.length > 0) {
      for (let i = 0; i < this.selectedRows.length; i++) {
        this.approveArray.push({
          approvedby: this.empid,
          id: this.selectedRows[i].id
        })
      }
      console.log(this.approveArray, 'this.approveArray');


      this.Error = 'Are you sure to Approve?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.approve(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
            this.clear()
          })
        }
      })
    }
    else {
      this.Error = 'Select Rows to Approve'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  clear() {
    this.selectedRows = []
    this.selectedRowObject = []
    this.table1Array = []
    this.approveArray = []
    this.handlingChargesArray = []
    this.AgenciesChargesArray = []
    this.CFSChargeArray = []
    this.LinearChargeArray = []
    this.LinearAddChrArray = []
    this.TransportChargesArray = []
    this.showtable = false
    this.show = false
    if (this.table1Array.length == 0) {
      this.view()
    }
  }
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}
