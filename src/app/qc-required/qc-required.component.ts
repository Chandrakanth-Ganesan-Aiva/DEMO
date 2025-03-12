import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QcRequiredService } from '../service/qc-required.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-qc-required',
  templateUrl: './qc-required.component.html',
  styleUrls: ['./qc-required.component.scss']
})
export class QcRequiredComponent implements OnInit, OnDestroy,AfterViewInit {
  QcRequiredForm!: FormGroup
  suppliers: any[] = new Array()
  loactionId: number = 0
  displayedColumns: string[] = ['select', 'Grnrefno', 'Grndate','Grnno','Grnid', 'Material', 'Qty']
  ViewDet: any[] = new Array()
  dataSource = new MatTableDataSource(this.ViewDet)
  private _liveAnnouncer = inject(LiveAnnouncer);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private service: QcRequiredService, private fb: FormBuilder, private dialog: MatDialog, private spinner: NgxSpinnerService) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.loactionId = data[data.length - 1]


    this.QcRequiredForm = this.fb.group({
      supplier: ['', [Validators.required]]
    })


    this.service.Supplier(this.loactionId).subscribe({
      next: (res: any) => {
        this.suppliers = res
      }
    })
  }
  selectAll = false;
  RowSelect() {
    this.selectAll = this.ViewDet.every((item: { selected: any; }) => item.selected);

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  View() {
    if (this.QcRequiredForm.valid) {
      let SupId = this.QcRequiredForm.controls['supplier'].value
      this.service.View(this.loactionId, SupId).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error=res[0].Msg
              this.userHeader='Error'
              this.opendialog()
            }
            this.ViewDet = res
            this.dataSource.data = this.ViewDet
            let arr = {
              selected: false
            }
            this.ViewDet.forEach(item => {
              Object.assign(item, arr);
            })
          }else{
            this.Error='No Data Qc Found For this '+this.QcRequiredForm.controls['supplier'].value+''
            this.userHeader='Warning!!'
            this.opendialog()
          }
        }
      })
    } else {
      return
    }
  }
  QcReUpdate: any[] = new Array()
  save() {
    let selectedRecords = this.ViewDet.filter(item => item.selected)

    if (selectedRecords.length > 0) {
      this.QcReUpdate = []
      for (let i = 0; i < selectedRecords.length; i++) {
        this.QcReUpdate.push({
          Grnid: selectedRecords[i].grnid
        })
      }
      this.Error = 'Do You Want To Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.spinner.show()
          this.QcReUpdate.forEach((item, Index) => {
            this.service.save(item).subscribe({
              next: (res: any) => {
                this.spinner.hide()
                if (res[0].status == 'Y') {
                  if (Index == this.QcReUpdate.length - 1) {
                    this.Error = res[0].Msg 
                    this.userHeader = 'Information'
                    this.opendialog()
                    this.dialogRef.afterClosed().subscribe((result: boolean) => {
                      if (result) {
                        this.QcReUpdate = []
                        selectedRecords = []
                        this.View()
                      } else {
                        return
                      }
                    })
                  }

                } else {
                  this.Error = res[0].Msg
                  this.userHeader = 'Error'
                  this.opendialog()
                }
              }
            })
          })

        } else {
          this.Error = 'Qualtity Required Entry Save Cancelled'
          this.userHeader = 'Information'
          this.opendialog()
          return
        }
      })
    } else {
      this.Error = 'Please Select  CheckBox Which You Want Quality Required'
      this.userHeader = 'Warning!!'
      this.opendialog()
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

  ngOnDestroy(): void {
    this.dialog.closeAll()
  }
}
