import { Component } from '@angular/core';
import { Poclose2Service } from '../service/poclose2.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-poclose2',
  templateUrl: './poclose2.component.html',
  styleUrl: './poclose2.component.scss'
})
export class Poclose2Component {
  constructor(private service: Poclose2Service, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    console.log(user, ' user');
    this.empid = user.empid
    console.log(this.empid);
    this.load()
    this.table()
  }
  empid: number | null = null
  show: boolean = false
  Error: string = ''
  userHeader: string = ''


  loadArray: any[] = []
  load() {
    this.service.load(this.empid).subscribe((result: any) => {
      this.loadArray = result
    })
  }
  tableArray: any
  table() {
    this.service.table().subscribe((result: any) => {
      this.tableArray = result
      console.log(this.tableArray, 'this.tableArray');

      if (this.tableArray.length > 0) {
        this.show = true
      }
      else {
        this.show = false
      }
    })
  }
  selectedrowsArray: any[] = []
  selectedrows(event: any, row: any) {
    if (event.target.checked) {
      console.log(event.target.checked, 'event.target.checked');
      this.selectedrowsArray.push(row)
    }
    else {
      this.selectedrowsArray = this.selectedrowsArray.filter(selectedrow => selectedrow !== row)
    }
    console.log(this.selectedrowsArray, 'selectedrowsArray');
  }
  approveArray: any[] = []

  approve() {
    this.approveArray = []
    if (this.selectedrowsArray.length > 0) {
      const now = new Date();
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`
      console.log(formattedTime);

      for (let i = 0; i < this.selectedrowsArray.length; i++) {
        this.approveArray.push({
          empid: this.empid,
          poclosedon: formattedTime,
          poproductid: this.selectedrowsArray[i].poproductid,
          poid: this.selectedrowsArray[i].poid
        })
      }
      console.log(this.approveArray);

      this.Error = 'Are you sure to Approve?'
      this.userHeader = 'Save'
      this.opendailog()

      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.approve(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendailog()
            this.clear()
          })
        }
      })
    }
    else {
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Information'
      this.opendailog()
    }
  }
  clear() {
    this.tableArray = []
    this.selectedrowsArray = []
    this.approveArray = []
    this.show = false
    if (this.tableArray == 0) {
      this.table()
    }
  }
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendailog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}
