import { Component } from '@angular/core';
import { CapitalPOReviewService } from '../service/capital-poreview.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
@Component({
  selector: 'app-capital-poreview',
  templateUrl: './capital-poreview.component.html',
  styleUrl: './capital-poreview.component.scss'
})
export class CapitalPOReviewComponent {
  constructor(private service: CapitalPOReviewService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.Load()
  }
  empid: number | null = null
  Error: string = ''
  userHeader: string = ''
  selectedAll: boolean = false
  LoadArray: any[] = []
  Load() {
    this.service.load(this.empid).subscribe((result: any) => {
      this.LoadArray = result
    })
    this.service.table().subscribe((result: any) => {
      this.tableArray = result
      if (!this.tableArray) {
        this.Error = 'No data to Show'
        this.userHeader = 'Information'
        this.opendialog()
      }
      else {
        return
      }

    })
  }
  show: boolean = false
  tableArray: any[] = []
  view() {
    this.service.table().subscribe((result: any) => {
      this.tableArray = result
    })

    if (this.tableArray.length > 0) {
      this.show = true;
    }
    else {
      this.show = false
      this.Error = 'No data to Show'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  selectedrowArray: any[] = [];

  selectedrows(event: any, row: any) {
    if (event.target.checked) {
      if (!this.selectedrowArray.includes(row)) {
        this.selectedrowArray.push(row); // Add to selected rows
      }
    } else {
      this.selectedrowArray = this.selectedrowArray.filter(selectedRow => selectedRow !== row); // Remove from selected rows
    }
    this.selectedAll = this.selectedrowArray.length === this.tableArray.length; // Update "Select All" state
  }

  allchecked(event: any) {
    if (event.target.checked) {
      this.selectedAll = true;
      this.selectedrowArray = [...this.tableArray];
      // Select all rows
    } else {
      this.selectedAll = false;
      this.selectedrowArray = []; // Deselect all rows
    }
  }


  reviewArray: any[] = []
  review() {
    if (this.selectedrowArray.length > 0) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`

      for (let i = 0; i < this.selectedrowArray.length; i++) {
        this.reviewArray.push({
          empid: this.empid,
          reviewon: formattedTime,
          id: this.selectedrowArray[i].id
        })
      }
      console.log(this.reviewArray);


      this.Error = 'Are you sure to Review?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.review(this.reviewArray).subscribe((result: any) => {
            const review = result
            this.selectedrowArray = []
            this.Error = review.message
            this.userHeader = 'Information'
            this.opendialog()
            this.clear()
          })
        }
      })
    }
    else {
      this.Error = 'Select Rows to Review'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }


  clear() {
    this.selectedrowArray = []
    this.reviewArray = []
    this.show = false
    this.selectedAll = false
    this.tableArray = []
  }

  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}
