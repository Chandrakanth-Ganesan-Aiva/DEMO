import { Component } from '@angular/core';
import { Poclose3Service } from '../service/poclose3.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-poclose3',
  templateUrl: './poclose3.component.html',
  styleUrl: './poclose3.component.scss'
})
export class Poclose3Component {
  constructor(private service: Poclose3Service, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.load()
    this.table()
  }
  empid: number = 0
  loadArray: any[] = []
  show: boolean = false
  Error: string = ''
  userHeader: string = ''
  load() {
    this.service.load(this.empid).subscribe((result: any) => {
      this.loadArray = result
      console.log(this.loadArray);
    })
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
  selectedrowsArray: any[] = []
  selectedrows(event: any, row: any) {
    if (event.target.checked) {
      this.selectedrowsArray.push(row)
    }
    else {
      this.selectedrowsArray = this.selectedrowsArray.filter(selectedrows => selectedrows !== row)
    }
    console.log(this.selectedrowsArray);
  }
  approveArray: any[] = []
  approve() {
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
      this.selectedrowsArray.forEach((row) => {
        this.approveArray.push({
          empid: this.empid,
          poclosedon: formattedTime,
          poproductid: row.poproductid,
          poid: row.poid
        });
      });

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
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  clear() {
    this.approveArray = []
    this.selectedrowsArray = []
    this.tableArray = []
    this.show = false
    if (this.tableArray.length === 0) {
      this.show = true
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
