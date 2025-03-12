import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GrndeleterequestService } from '../service/grndeleterequest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { CustomizeDialogComponent } from '../customize-dialog/customize-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-grndeleterequest',
  templateUrl: './grndeleterequest.component.html',
  styleUrls: ['./grndeleterequest.component.scss']
})
export class GrndeleterequestComponent implements OnInit, AfterViewInit {
  GrnDeleteReqform: FormGroup;
  Empid: number = 0
  LocationId: number = 0
  currentDate = new Date

  constructor(private date: DatePipe, private service: GrndeleterequestService, private dialog: MatDialog,
    private fb: FormBuilder) {
    this.GrnDeleteReqform = this.fb.group({
      Supplier: ['', Validators.required],
      frmdate: ['', Validators.required],
      Todate: [this.date.transform(new Date, 'yyyy-MM-dd')],
    })

  }
  suppArr: any[] = new Array()
  dataSource = new MatTableDataSource(this.suppArr)
  @ViewChild(MatTable) MatTable!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  ngOnInit(): void {
    let Location = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = Location[Location.length - 1]

    let UserDet = JSON.parse(sessionStorage.getItem('session') || '{}')
    this.Empid = UserDet.empid

    let date = this.date.transform(this.currentDate, 'yyyy-MM-dd')


    this.GrnDeleteReqform.controls['Todate'].disable()
    this.filterControl.valueChanges.pipe(startWith(''), map((search) =>
      this.SupplierArr.filter((option: any) => option.SupName.toLowerCase().includes(search?.toLowerCase() || '')))).subscribe((filtered) => (this.filteredOptions = filtered));

  }
  filterControl = new FormControl()
  Fromdate() {
    this.GrnDeleteReqform.controls['frmdate'].setValue(
      this.date.transform(this.GrnDeleteReqform.controls['frmdate'].value, 'yyyy-MM-dd')
    );
    if (this.GrnDeleteReqform.controls['frmdate'].value) {
      this.getsupplier();
    }

  }



  filteredOptions: any = []
  SupplierArr: any[] = new Array()
  getsupplier() {
    this.GrnDeleteReqform.controls['frmdate'].setValue(this.date.transform(this.GrnDeleteReqform.controls['frmdate'].value, 'yyyy-MM-dd'))
    let frmdate = this.GrnDeleteReqform.controls['frmdate'].value
    let Todate = this.GrnDeleteReqform.controls['Todate'].value
    let Module = 'Grn Delete Request'
    this.service.supplier(this.LocationId, frmdate, Todate, Module).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Information'
            this.opendialog()
            return;
          }
          res.unshift({
            SupName: 'All',
            SupId: 0
          })
          this.SupplierArr = res
          this.filteredOptions = res
        } else {
          this.Error = 'No Grn Delete Request Records Found in Selected Date  <strong style="color:brown"> ' + frmdate + ' , ' + Todate + ' </strong> '
          this.userHeader = 'Warning!!';
          return this.opendialog()
        }
      }
    })
  }

  MatlClick() {
    if (this.GrnDeleteReqform.controls['frmdate'].invalid) {
      return this.GrnDeleteReqform.controls['frmdate'].markAllAsTouched()
    }
  }
  selectAll = false;
  SupplierView: boolean = true
  AddSupplier() {
    if (this.GrnDeleteReqform.invalid) {
      return this.GrnDeleteReqform.markAllAsTouched()
    }
    else {
      this.GrnDeleteReqform.controls['frmdate'].setValue(this.date.transform(this.GrnDeleteReqform.controls['frmdate'].value, 'yyyy-MM-dd'))
      let frmdate = this.GrnDeleteReqform.controls['frmdate'].value
      let Todate = this.GrnDeleteReqform.controls['Todate'].value
      let SupId = this.GrnDeleteReqform.controls['Supplier'].value
      let Module = 'Grn Delete Request'
      this.service.supplierView(this.LocationId, frmdate, Todate, SupId, Module).subscribe({
        next: (res: any) => {
          this.suppArr = res

          // this.SupplierListArr = []
          if (res.length > 0) {
            this.GrnDeleteReqform.disable()
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Information'
              this.opendialog()
              return;
            }
            this.SupplierView = false

            let newarr = {
              selected: false
            }
            this.suppArr.forEach((item: any) => {
              Object.assign(item, newarr)
            })
            this.ApprTable = true
            this.dataSource.data = [...this.suppArr]
          } else {
            this.Error = 'No Data Found'
            this.userHeader = 'Warning!!'
            this.opendialog()
            return
          }
        }
      })
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  RamaterialView: boolean = true
  MaterialArr: any[] = new Array()
  TaxArr: any[] = new Array()
  Gross: number = 0
  Net: number = 0
  customizeDialog!: MatDialogRef<CustomizeDialogComponent>;
  ViewTabDet(Index: number) {
    let ind = Index + (this.paginator.pageSize * this.paginator.pageIndex)
    this.customizeDialog = this.dialog.open(CustomizeDialogComponent, {
      disableClose: true,
      width: '100%',
      height: 'Auto',
      // panelClass: 'center-dialog',
      data: {
        Comp_Name: "grnDeleteRequest",
        grnRefno: this.dataSource.data[ind].Grn_Ref_no,
        SupName: this.dataSource.data[ind].SupName,
      },
    });

  }
  ApproveVaildation() {
    const selectedRecords = this.dataSource.data.filter(item => item.selected);
    if (selectedRecords.length == 0) {
      this.Error = 'Please select at least one record'
      this.userHeader = 'Warning!!'
      this.opendialog()
      return;
    } else {
      this.Error = 'Do You Want to Save'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.Approve()
        } else {
          this.Error = 'Save Cancelled'
          this.userHeader = 'Information'
          this.opendialog()
          return
        }
      })
    }
  }
  hideGrnno: boolean = false
  Msg: string = '';
  Sts: string = '';
  ApprTable: boolean = false
  Approve() {
    const selectedRecords = this.dataSource.data.filter(item => item.selected);
    let GrnDelete = []
    for (let i = 0; i < selectedRecords.length; i++) {
      GrnDelete.push({
        Empid: this.Empid,
        GrnNo: selectedRecords[i].GrnNo
      })
    }
    this.service.Update(GrnDelete).subscribe({
      next: (res: any) => {
        if (res[0].status == 'Y') {
          // if (Index == this.UpdateArr.length - 1) {
          this.Error = res[0].Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe(result => {
            this.GrnDeleteReqform.enable()
            this.ApprTable = false
            // this.AddSupplier()
          })
          // }  
        } else {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
      }
    })
  }


  Clear() {
    this.ApprTable = false
    this.SupplierView = true
    this.GrnDeleteReqform.enable()
    this.dataSource.data = []
    this.GrnDeleteReqform.reset()
    this.GrnDeleteReqform.controls['frmdate'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'))
    this.GrnDeleteReqform.controls['Todate'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'))
    this.GrnDeleteReqform.controls['Todate'].disable()
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
}

