import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QtyDeallocationService } from '../service/qty-deallocation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { error } from 'jquery';


@Component({
  selector: 'app-qty-de-allocation',
  templateUrl: './qty-de-allocation.component.html',
  styleUrls: ['./qty-de-allocation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QtyDeAllocationComponent implements OnInit, AfterViewInit, OnDestroy {
  DeAlllocaForm!: FormGroup
  loactionId: number = 0
  ViewDet: any[] = new Array()
  dataSource = new MatTableDataSource<any>(this.ViewDet);
  displayedColumns: string[] = ['select', 'GrnNo', 'GrnDate', 'Material', 'Uom', 'Qty', 'Store']
  @ViewChild(MatTable) MatTable!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private service: QtyDeallocationService, private spinner: NgxSpinnerService, private dialog: MatDialog) {
    this.DeAlllocaForm = this.fb.group({
      Supplier: ['', [Validators.required]],
      // Material: ['', [Validators.required]],
      FromDate: [new Date()],
      ToDate: [new Date()]
    })
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.loactionId = data[data.length - 1]

    this.datePipe.transform(this.DeAlllocaForm.controls['FromDate'].value, 'yyyy/MM/dd')
    this.datePipe.transform(this.DeAlllocaForm.controls['ToDate'].value, 'yyyy/MM/dd')
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  SupplierDet: any[] = new Array()
  ngOnInit(): void {
    this.getSupplier()
    // this.getMaterial()
  }
  SupName: string = ''
  inputSelect(e: any) {
    this.SupName = e.target.value;
    this.getSupplier()
  }

  onDateChange(event: any) {
    this.DeAlllocaForm.controls['FromDate'].setValue(event.value)
  }
  onDateChange1(event: any) {
    this.DeAlllocaForm.controls['ToDate'].setValue(event.value)

  }
  getSupplier() {
    this.service.Suppiler(this.SupName).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }

          this.SupplierDet = res
        } else {
          this.Error = 'No Records Found  '
          this.userHeader = 'Error'
          this.opendialog()
        }
      }
    })
  }
  clear() {
    this.SupName = '';
    this.getSupplier()
  }
  inputRawMat(e: any) {
    this.RawMatName = e.target.value;
    this.getMaterial()
  }
  RawMatName: string = ''
  MaterialDet: any[] = new Array()
  getMaterial() {
    this.spinner.show()
    this.service.Rawmaterial(this.RawMatName).subscribe({
      next: (res: any) => {
        this.spinner.hide()
        if (res.length > 0) {

          this.MaterialDet = res
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
        } else {
          this.Error = 'No Records Found  '
          this.userHeader = 'Error'
          this.opendialog()
        }
      }
    })
  }
  Rawclear() {
    this.SupName = '';
    this.getMaterial()
  }
  selectAll = false;
  RowSelect() {
    this.selectAll = this.ViewDet.every((item: { selected: any; }) => item.selected);

  }
  materialName: string = ''
  materialInput(e: any) {
    this.materialName = e.target.value.toLowerCase();
    if (this.materialName) {
      const filterValue = (e.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.dataSource.data = [...this.ViewDet];
    }
  }
  hideTabel:boolean=true
  View() {
    if (this.DeAlllocaForm.invalid) {
      return
    } else {
      let SuppId = this.DeAlllocaForm.controls['Supplier'].value
      // let MatlId = this.DeAlllocaForm.controls['Material'].value
      let frmdate = this.datePipe.transform(this.DeAlllocaForm.controls['FromDate'].value, 'yyyy/MM/dd')
      let todate = this.datePipe.transform(this.DeAlllocaForm.controls['ToDate'].value, 'yyyy/MM/dd')
      this.service.ViewDet(this.loactionId, SuppId, frmdate, todate).subscribe({
        next: (res: any) => {

          if (res.length > 0) {
            this.ViewDet = res
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.opendialog()
            }
            let newarr = {
              selected: false
            }
            this.ViewDet.forEach(obj => {
              Object.assign(obj, newarr);
            });
            this.dataSource.data = [...this.ViewDet];
            this.hideTabel=false
          } else {
            this.Error = 'No Records Found For This Supplier In The date of  <b style="color:brown"> '  + frmdate + ' , ' + todate + ' </b>'
            this.userHeader = 'Error'
            this.opendialog()
          }
        }
      })
    }
  }
  UpdateArr: any[] = new Array()
  save() {
    let selectRecords = this.dataSource.data.filter(item => item.selected)
    if (selectRecords.length > 0) {
      this.UpdateArr = []
      for (let i = 0; i < selectRecords.length; i++) {
        this.UpdateArr.push({
          GRNID: selectRecords[i].GRNID
        })
      }
     
      this.Error = 'Do You Want To Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          // this.UpdateArr.forEach((item, Index) => {
            this.service.Update(this.UpdateArr).subscribe({
              next: (res: any) => {
                if (res[0].status == 'Y') {
                  // if (Index == this.UpdateArr.length - 1) {
                    this.Error = res[0].Msg 
                    this.userHeader = 'Information'
                    this.opendialog()
                    this.dialogRef.afterClosed().subscribe((result: boolean) => {
                      if (result) {
                        this.UpdateArr = []
                        selectRecords = []
                        this.View()
                      } else {
                        return
                      }
                    })
                  // }
                } else {
                  this.Error = res[0].Msg
                  this.userHeader = 'Error'
                  this.opendialog()
                }
              }
            })
          // })
        } else {
          this.Error = 'Quantity Deallocation Entry Save Cancelled'
          this.userHeader = 'Information'
          this.opendialog()
          return
        }
      })
    } else {
      this.Error = 'Please Select Checkbox Which you want to Deallocate Material'
      this.userHeader = 'Error'
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
  clearAll(){
    this.hideTabel=true
    this.DeAlllocaForm.reset()
    this.DeAlllocaForm.controls['FromDate'].setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
    this.DeAlllocaForm.controls['ToDate'].setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
    this.dataSource.data=[]

  }
  ngOnDestroy(): void {
    this.dialog.closeAll()
  }
}


