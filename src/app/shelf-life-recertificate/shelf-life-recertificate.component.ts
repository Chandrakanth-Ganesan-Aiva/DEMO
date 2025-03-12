import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ShelfLifeRecertificateService } from '../service/shelf-life-recertificate.service';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-shelf-life-recertificate',
  templateUrl: './shelf-life-recertificate.component.html',
  styleUrls: ['./shelf-life-recertificate.component.scss']
})
export class ShelfLifeRecertificateComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['select', 'GrnNo', 'GrnDate', 'Supplier', 'Material', 'BatchDate', 'BatchQty', 'ExpiryDate']
  loactionId: number = 0
  constructor(private service: ShelfLifeRecertificateService, private date: DatePipe, private dialog: MatDialog) { }
  @ViewChild(MatTable) MatTable!: MatTable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  FromDate: any
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  shelflifeDet: any[] = new Array()
  ngOnInit() {
    this.FromDate = this.date.transform(this.FromDate, 'yyyy-MM-dd')
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.loactionId = data[data.length - 1]
    this.getShelfDet()
  }
  getShelfDet(){
    this.service.shelfDet(this.loactionId).subscribe({
      next: (res: any) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.openDialog()
            return
          }
          let arr = {
            selected: false,
            ExpiryDate: ''
          }
          res.forEach((element: any) => {
            Object.assign(element, arr)
          });
          this.shelflifeDet = res
          this.dataSource.data = this.shelflifeDet
          console.log(this.dataSource.data);
        }
      }
    })
  }
  materialName: string = ''
  materialInput(e: any) {
    this.materialName = e.target.value.toLowerCase();
    if (this.materialName) {
      this.dataSource.filter = this.materialName.trim().toLowerCase()
    } else {
      this.dataSource.data = [...this.shelflifeDet];
    }
  }
  expirydateChange(Index: number) {
    let Expirydate: any
    Expirydate = this.date.transform(this.shelflifeDet[Index].ExpiryDate, 'yyyy-MM-dd')
    if (Expirydate < this.shelflifeDet[Index].batchdate) {
      this.Error = 'ExpiryDate is <b style="color:brown"> ' + Expirydate + ' </b> </br> BatchDate is <b style="color:brown"> ' + this.shelflifeDet[Index].batchdate + ' </b> </br>  ExpiryDate Should be Greater Than the Batch Date'
      this.userHeader = 'Warning!!'
      this.openDialog()
      this.dialogRef.afterClosed().subscribe(result=>{
        this.shelflifeDet[Index].ExpiryDate=''
        // this.cdr.detectChanges(); 
        console.log( this.shelflifeDet[Index].batchdate);
        
      })
      return
    }

  }

  savevaild() {
    let selectedrec = this.shelflifeDet.filter((item: any) => item.selected)
    if (selectedrec.length > 0) {
      for (let i = 0; i < selectedrec.length; i++) {
        if (selectedrec[i].ExpiryDate == '') {
          this.Error = '' + selectedrec[i].rawmatname + 'Expiry Date Is Not Selected Please Select the Expiry Date'
          this.userHeader = 'Error'
          this.openDialog()
          return
        }
      }
      this.Error = 'Do You Want Save Shelflife Recertification '
      this.userHeader = 'Save'
      this.openDialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        console.log(result);
        if (result) {
          this.Save()
        } else {
          this.Error = 'Shelflife Recertification Save Cancelled'
          this.userHeader = 'Information'
          this.openDialog()
          return
        }
      });
    } else {
      this.Error = 'Please Select At Least One Checkbox To Update The Shelflife Recertification'
      this.userHeader = 'Error'
      this.openDialog()
      return
    }
  }
  shelflifeupdate: any[] = new Array()
  Save() {
    let selectedrec = this.shelflifeDet.filter((item: any) => item.selected)
    this.shelflifeupdate = []
    for (let i = 0; i < selectedrec.length; i++) {
      let ExpiryDate = this.date.transform(selectedrec[i].ExpiryDate, 'yyyy-MM-dd')
      this.shelflifeupdate.push({
        Oldexpdate: selectedrec[i].batchdate,
        Batchdate: ExpiryDate,
        BatchId: selectedrec[i].batch_id,
        Grnid: selectedrec[i].grnid
      })
    }
    console.log(this.shelflifeupdate);

    this.service.update(this.shelflifeupdate).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res[0].status == 'Y') {
          this.Error = res[0].Msg
          this.userHeader = 'Information'
          this.openDialog()
          this.dialogRef.afterClosed().subscribe((result: boolean) => {
            console.log(result);
            if (result) {
              this.getShelfDet()
            }
          });
        } else {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          this.openDialog()
          return
        }
      }
    })
  }
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  openDialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });

  }

  ngOnDestroy(): void {
    this.dialog.closeAll()
  }
}
