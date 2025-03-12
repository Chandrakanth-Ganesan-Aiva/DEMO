import { Component, Type } from '@angular/core';
import { CODApproveService } from '../service/codapprove.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-codapprove',
  templateUrl: './codapprove.component.html',
  styleUrl: './codapprove.component.scss'
})
export class CODApproveComponent {
  constructor(private service: CODApproveService, private dialog: MatDialog) { }
  ngOnInit() {
    const locationid = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = locationid[0]
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.load()
  }

  LocationId: number = 0
  approverId: number | null = null
  Empid: number | null = null
  allchecked: boolean = false
  ApproverName: String = ''
  show: boolean = false
  Error: String = ''
  userHeader: String = ''

  ApproverArray: any[] = []
  load() {
    this.service.load(this.LocationId).subscribe((result: any) => {
      this.ApproverArray = result;
      // Set the default value to the first empname in the array
      if (this.ApproverArray.length > 0) {
        this.ApproverName = this.ApproverArray[0].empname;
        this.approverId = this.ApproverArray[0].empid
      } else {
        this.ApproverName = ''; // Handle case when array is empty
      }
    });
  }

  tableArray: any[] = []
  Approver(event: any) {
    const approverId = event
    this.approverId = approverId.empid
  }

  view() {
    this.allSelected = false
    if (this.approverId) {
      this.service.table(this.LocationId).subscribe((result: any) => {
        this.tableArray = result
        if (this.tableArray.length > 0) {
          this.show = true;
        } else {
          this.show = false;
          this.Error = 'No data to Approve'
          this.userHeader = 'Information'
          this.opendialog()
        }
      })
    }
  }

  selectedRows: any[] = [];
  allSelected: boolean = false;
  selectedrows(event: any, row: any) {
    if (event.target.checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(selectedRow => selectedRow !== row);
    }
    this.allSelected = this.selectedRows.length === this.tableArray.length;
  }
  selectAll(event: any) {
    if (event.target.checked) {
      this.allSelected = true;
      this.selectedRows = [...this.tableArray];
    } else {
      this.allSelected = false;
      this.selectedRows = [];
    }
  }

  approveArray: any[] = []
  approvedata: any[] = []
  approve() {
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
        this.approvedata.push({
          approverId: this.Empid,
          approveddate: formattedTime,
          poid: this.selectedRows[i].poid
        })
      }
      console.log(this.approvedata, 'before approve');
      this.Error = 'Are you sure to approve ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.approve(this.approvedata).subscribe((result: any) => {
            this.approveArray = result
            console.log(this.approveArray);
            this.Error = 'Data Saved Succesfully'
            this.userHeader = 'Information'
            this.opendialog()
            this.clear()
          })
        }
      })


    }
    else {
      this.Error = 'Select Rows to Approve'
      this.userHeader = 'Warning'
      this.opendialog()
    }

  }

  clear() {
    this.tableArray = []
    this.selectedRows = []
    this.approvedata = []
    this.approveArray = []
    this.allSelected = false
    this.show = false
  }

  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}