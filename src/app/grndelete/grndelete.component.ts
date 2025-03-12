import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GrnDeleteService } from '../service/grn-delete.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { map, startWith } from 'rxjs';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { CustomizeDialogComponent } from '../customize-dialog/customize-dialog.component';




@Component({
  selector: 'app-grndelete',
  templateUrl: './grndelete.component.html',
  styleUrls: ['./grndelete.component.scss']
})
export class GrndeleteComponent implements OnInit, AfterViewInit {
  GrnDeleteform!: FormGroup;
  Empid: number = 0
  LocationId: number = 0
  apiErrorMsg: string = ''
  currentDate = new Date

  suppArr: any[] = new Array()
  dataSource = new MatTableDataSource(this.suppArr);
  constructor(private date: DatePipe, private service: GrnDeleteService, private dialog: MatDialog, private fb: FormBuilder) { }
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

    this.GrnDeleteform = this.fb.group({
      Supplier: new FormControl('', Validators.required),
      frmdate: new FormControl(''),
      Todate: new FormControl({value:'',disabled:true}),
    })

    this.GrnDeleteform.controls['Todate'].setValue(date)
    
    this.filterControl.valueChanges.pipe(startWith(''), map((search) =>
      this.SupplierArr.filter((option: any) => option.SupName.toLowerCase().includes(search?.toLowerCase() || '')))).subscribe((filtered) => (this.filteredOptions = filtered));

  }
  filterControl = new FormControl()
  Fromdate() {
    this.GrnDeleteform.controls['frmdate'].setValue(
      this.date.transform(this.GrnDeleteform.controls['frmdate'].value, 'yyyy-MM-dd')
    );
    if (this.GrnDeleteform.controls['frmdate'].value) {
      this.getsupplier();
    }

  }

  MatlClick() {
    if (this.GrnDeleteform.controls['frmdate'].invalid) {
      return this.GrnDeleteform.controls['frmdate'].markAllAsTouched()
    }
  }


  filteredOptions: any = []
  SupplierArr: any[] = new Array()
  getsupplier() {
    this.GrnDeleteform.controls['frmdate'].setValue(this.date.transform(this.GrnDeleteform.controls['frmdate'].value, 'yyyy-MM-dd'))
    let frmdate = this.GrnDeleteform.controls['frmdate'].value
    let Todate = this.GrnDeleteform.controls['Todate'].value
    let Module = 'Grn Delete'
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
          this.Error = 'No Grn Delete Records Found in Selected Date  <strong style="color:brown"> ' + frmdate + ' , ' + Todate + ' </strong> '
          this.userHeader = 'Warning!!';
          return this.opendialog()
        }
      }
    })
  }
  selectAll = false;
  SelectAll() {
    this.dataSource.data.forEach((item: any) => {
      item.selected = this.selectAll;
      console.log(item.selecte, 's');

    });
  }
  RowSelect() {
    this.selectAll = this.dataSource.data.every((item: any) => item.selected);
  }

  SupplierView: boolean = true
  hideGrnno: boolean = false
  AddSupplier() {
    if (this.GrnDeleteform.invalid) {
      return
    }
    else {

      let frmdate = this.GrnDeleteform.controls['frmdate'].value
      let Todate = this.GrnDeleteform.controls['Todate'].value
      let SupId = this.GrnDeleteform.controls['Supplier'].value
      let Module = 'Grn Delete'
      this.service.supplierView(this.LocationId, frmdate, Todate, SupId, Module).subscribe({
        next: (res: any) => {
          console.log(res);
          this.suppArr = res
          this.dataSource.data = []
          if (res.length > 0) {
            this.GrnDeleteform.disable()
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            this.SupplierView = false
            let newarr = {
              selected: false
            }
            this.suppArr.forEach((item: any) => {
              Object.assign(item, newarr)
            })
            this.dataSource.data = [...this.suppArr]
            this.dataSource.data=[ ...this.dataSource.data]
          } else {
            this.Error = 'No Data Found'
            this.userHeader = 'Warning!!'
            return this.opendialog()
          }
        }
      })
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
      height: ' ',
      // panelClass: 'center-dialog',
      data: {
        Comp_Name: "grnDelete",
        grnRefno: this.dataSource.data[ind].Grn_Ref_no,
        SupName: this.dataSource.data[ind].SupName,
      },
    });

  }
  GrnDelete: any[] = new Array()
  ApproveVaildation() {
    const selectedRecords = this.dataSource.data.filter((item: any) => item.selected);
    if (selectedRecords.length == 0) {
      this.Error = 'Please select at least one record';
      this.userHeader = 'Warning!!'
      return this.opendialog()
    } else {
      this.Error = 'Do You Want To Saved ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.Approve()
        } else {
          this.Error = 'Save Cancelled'
          this.userHeader = 'Information'
          return this.opendialog()
        }
      })
    }
  }
  Msg: string = '';
  Sts: string = '';
  Approve() {
    const selectedRecords = this.dataSource.data.filter((item: any) => item.selected);
    let update: any = []
    selectedRecords.forEach((element: any) => {
      update.push({
        GrnNO: element.GrnNo,
        LoginEmpid: this.Empid
      })
    })

    this.service.Update(update).subscribe((res: any) => {
      console.log(res, 'save');

      this.Sts = res[0].status;
      this.Msg = res[0].Msg
      if (this.Sts == 'Y') {
        this.Error = res[0].Msg
        this.userHeader = 'Information'
        this.opendialog()

      }
      else {
        this.Error = res[0].Msg
        this.userHeader = 'Error'
        return this.opendialog()
      }
    })
  }



  Clear() {
    this.GrnDelete = []
    this.dataSource.data = []
    this.SupplierView = true
    this.GrnDeleteform.enable()
    this.GrnDeleteform.reset()
    this.GrnDeleteform.controls['frmdate'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'))
    this.GrnDeleteform.controls['Todate'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'))
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
