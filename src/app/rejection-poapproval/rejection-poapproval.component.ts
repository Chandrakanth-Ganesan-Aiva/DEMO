import { Component, OnInit } from '@angular/core';
import { RejectionPOApprovalService } from '../service/rejection-poapproval.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-rejection-poapproval',
  standalone: false,
  templateUrl: './rejection-poapproval.component.html',
  styleUrl: './rejection-poapproval.component.scss'
})
export class RejectionPOApprovalComponent {


  constructor(private service: RejectionPOApprovalService, private dialog: MatDialog) { }
  ngOnInit() {
    const locationid = JSON.parse(sessionStorage.getItem('location') || '{}')
    console.log(locationid[0], 'locationid');

    this.LocationId = locationid[0]
    console.log(this.LocationId, 'LocationID');

    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.Load()
    this.view()
  }
  supplier: number | null = null
  LocationId: number = 0
  supid: number | null = null
  currentDateTime: any
  empid: number = 0
  selectedSupplier: any
  show: boolean = false
  clearable: boolean = false
  //Array
  tableArray: any[] = []
  SupplierArray: any[] = []

  Load() {
    this.service.Supplier().subscribe((result: any) => {
      this.SupplierArray = result
    })
  }

  supidfun(e: any) {
    const supID = e
    this.supid = supID.supid
  }

  view() {
    this.allSelected = false
    this.tableArray = []
    if (this.supid === null) {
      this.service.allSupplier(this.LocationId).subscribe((result: any) => {
        this.tableArray = result
        if (this.tableArray.length > 0) {
          this.show = true
        }
        else {
          this.show = false
          this.Error = 'There is no data to show'
          this.userHeader = 'Information'
          this.opendialog()
        }
      })
    }
    else {
      this.service.oneSupplier(this.LocationId, this.supid).subscribe((result: any) => {
        this.tableArray = result
        if (this.tableArray.length > 0) {
          this.show = true
        }
        else {
          this.show = false
          this.Error = 'There is no data to show'
          this.userHeader = 'Information'
          this.opendialog()
        }
      })
    }
  }

  selectedRows: any[] = []
  selectedrows(event: any, row: any) {
    if (event.target.checked) {
      this.selectedRows.push(row)
    }
    else {
      this.selectedRows = this.selectedRows.filter(selectedRow => selectedRow !== row)
    }
    this.allSelected = this.selectedRows.length === this.tableArray.length
  }

  allSelected: boolean = false
  selectAll(event: any) {
    if (event.target.checked) {
      this.allSelected = true;
      this.selectedRows = [...this.tableArray]
    }
    else {
      this.allSelected = false;
      this.selectedRows = []
    }
  }
  approveData: any[] = []
  Approve() {
    if (this.selectedRows.length > 0) {
      const now = new Date();
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`

      for (let i = 0; i < this.selectedRows.length; i++) {
        this.approveData.push({
          POID: this.selectedRows[i].poid,
          empid: this.empid,
          approvaldatetime: formattedTime
        })
      }
      console.log(this.approveData, 'this.approveData');

      this.Error = 'Are you Sure to approve ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.Approve(this.approveData).subscribe((result: any) => {
            const response = result
            console.log(response, 'response');
            this.Error = response.message
            this.userHeader = 'Information'
            this.opendialog()
            this.clear()
          })
        }
      })
    }
    else {
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Warning'
      this.opendialog()
    }

  }
  clear() {
    this.selectedRows = []
    this.tableArray = []
    this.selectedRows = []
    this.supplier = null
    this.supid = null
    this.currentDateTime = ''
    this.selectedSupplier = null
    this.show = false
    this.approveData = []
  }


  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}
