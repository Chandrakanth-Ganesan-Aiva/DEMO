import { Component } from '@angular/core';
import { CreditdaysApprovalService } from '../service/creditdays-approval.service';
declare var bootstrap: any;
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-creditdays-approval',
  templateUrl: './creditdays-approval.component.html',
  styleUrl: './creditdays-approval.component.scss'
})
export class CreditdaysApprovalComponent {
  constructor(private service: CreditdaysApprovalService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.load()
    this.table()
  }

  empid: number = 0
  currentRowIndex: number | null = null
  rowPendingConfirmation: any
  loadArray: any[] = []
  show: boolean = false
  load() {
    this.service.load(this.empid).subscribe((result: any) => {
      this.loadArray = result
      console.log(this.loadArray);

    })
  }

  approver(event: any) {
    const approver = event.target.value
    console.log(approver);
  }

  tableArray: any[] = []
  table() {
    this.service.table().subscribe((result: any) => {
      this.tableArray = result
      if (this.tableArray.length > 0) {
        this.show = true
      }
      else {
        this.show = false
      }
      console.log(this.tableArray);

    })
  }
  selectedRowApprove: any[] = [];
  selectedRowRej: any[] = [];
  rowBeingChanged: any | null = null;
  checkboxTypeBeingChanged: string | null = null; // 'approve' or 'reject'

  ApproveCheck(event: any, row: any) {
    if (event.target.checked) {
      if (this.selectedRowRej.includes(row)) {
        // If rejection is already checked, show modal
        this.rowBeingChanged = row;
        this.checkboxTypeBeingChanged = 'approve';
        event.target.checked = false; // Temporarily prevent change
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
      }
      else {
        this.selectedRowApprove.push(row);
      }
    } else {
      this.selectedRowApprove = this.selectedRowApprove.filter(selectedRow => selectedRow !== row);
    }
    console.log(this.selectedRowApprove, 'selectedRowApprove');
  }

  rejectionCheck(event: any, row: any) {
    if (event.target.checked) {
      if (this.selectedRowApprove.includes(row)) {
        // If approval is already checked, show modal
        this.rowBeingChanged = row;
        this.checkboxTypeBeingChanged = 'reject';
        event.target.checked = false; // Temporarily prevent change
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
      } else {
        this.selectedRowRej.push(row);
      }
    } else {
      this.selectedRowRej = this.selectedRowRej.filter(selectedRow => selectedRow !== row);
    }
    console.log(this.selectedRowRej, 'selectedRowRej');
  }

  // Handle modal confirmation
  confirmChange() {
    if (this.rowBeingChanged && this.checkboxTypeBeingChanged) {
      if (this.checkboxTypeBeingChanged === 'approve') {
        this.selectedRowApprove.push(this.rowBeingChanged);
        this.selectedRowRej = this.selectedRowRej.filter(row => row !== this.rowBeingChanged);
      } else if (this.checkboxTypeBeingChanged === 'reject') {
        this.selectedRowRej.push(this.rowBeingChanged);
        this.selectedRowApprove = this.selectedRowApprove.filter(row => row !== this.rowBeingChanged);
      }
    }
    this.rowBeingChanged = null;
    this.checkboxTypeBeingChanged = null;
  }

  cancelChange() {
    // Reset values if the user cancels
    this.rowBeingChanged = null;
    this.checkboxTypeBeingChanged = null;
  }

  rejectionArray: any[] = []
  ApproveArray: any[] = []
  Error: string = ''
  userHeader: string = ''
  num: number = 0
  update() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`

    console.log(this.selectedRowRej.length, 'this.selectedRowRej.length');
    console.log(this.selectedRowApprove.length, 'this.selectedRowApprove.length');


    if (this.selectedRowApprove.length > 0 || this.selectedRowRej.length > 0) {
      if (this.selectedRowRej.length > 0) {
        console.log(this.selectedRowRej.length);
        for (let i = 0; i < this.selectedRowRej.length; i++) {
          this.rejectionArray.push({
            empid: this.empid,
            approveddate: formattedTime,
            id: this.selectedRowRej[i].id,
            supid: this.selectedRowRej[i].supid,
          })
        }
      }
      if (this.selectedRowApprove.length > 0) {
        console.log(this.selectedRowApprove.length);
        for (let i = 0; i < this.selectedRowApprove.length; i++) {
          this.ApproveArray.push({
            empid: this.empid,
            approveddate: formattedTime,
            id: this.selectedRowApprove[i].id,
            supid: this.selectedRowApprove[i].supid,
            creditperiod: this.selectedRowApprove[i].newcreditperiod
          })
        }
      }

      this.Error = 'Are you sure to Update?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          if (this.ApproveArray.length > 0 && this.rejectionArray.length > 0) {
            this.service.approve(this.ApproveArray).subscribe((result1: any) => {
              this.Error = result1.message
              this.userHeader = 'Information'
              this.opendialog()
              this.service.reject(this.rejectionArray).subscribe((result2: any) => {
                this.Error = result2.message
                this.userHeader = 'Information'
                this.opendialog()
                this.clear()
              })
            })
            console.log('45');
          }
          else {
            if (this.ApproveArray.length > 0) {
              this.service.approve(this.ApproveArray).subscribe((result: any) => {
                this.Error = result.message
                this.userHeader = 'Information'
                this.opendialog()
                this.reject()
              })
            }
            else {
              this.reject()
            }
          }

        }
      })
    }
    else {
      alert('select rows')
    }

  }

  approve() {
    console.log(this.ApproveArray);
    this.service.approve(this.ApproveArray).subscribe((result: any) => {
      console.log(result)
    })
  }

  reject() {
    if (this.rejectionArray.length > 0) {
      this.service.reject(this.rejectionArray).subscribe((result: any) => {
        this.Error = result.message
        this.userHeader = 'Information'
        this.opendialog()
        this.clear()
      })
    }
    else {
      this.clear()
    }

  }


  clear() {
    this.tableArray = []
    this.selectedRowApprove = [];
    this.selectedRowRej = [];
    this.rowBeingChanged = null;
    this.checkboxTypeBeingChanged = null;
    this.rejectionArray = []
    this.ApproveArray = []
    if (this.tableArray.length === 0) {
      this.table()
    }
  }
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}
