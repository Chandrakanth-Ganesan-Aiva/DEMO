import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeighmentDelayApprService } from '../service/weighment-delay-appr.service';
import { data } from 'jquery';
import { map, startWith, filter } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-weighment-delay-appr',
  templateUrl: './weighment-delay-appr.component.html',
  styleUrls: ['./weighment-delay-appr.component.scss']
})
export class WeighmentDelayApprComponent implements OnInit, AfterViewInit {
  WeighDelayForm!: FormGroup
  EmpId: number = 0
  constructor(private dialog: MatDialog, private fb: FormBuilder, private service: WeighmentDelayApprService) { }

  @ViewChild(MatTable) MatTable!: MatTable<any>;
  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  ngOnInit(): void {

    this.WeighDelayForm = this.fb.group({
      Supplier: new FormControl('', Validators.required)
    })
    const data = JSON.parse(sessionStorage.getItem('session') || '{}')
    this.EmpId = data.empid
    console.log(this.EmpId);

    this.filterControl.valueChanges.pipe(startWith(''), map((search: any) =>
      this.Supplier.filter((option: any) => option.SupplierName.toLowerCase().startsWith(search?.toLowerCase() || '')))).subscribe((filtered) => (this.filteredOptions = filtered));
    this.getSupplier()
  }
  filterControl = new FormControl
  Supplier: any[] = new Array()
  filteredOptions: any = []
  getSupplier() {
    this.service.Supplier().subscribe({
      next: (res: any) => {
        console.log(res, 'mat');
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error!!'
            this.opendialog()
            return
          }
          res.unshift({
            SupplierName: 'All',
            SupplierId: 0
          })
          this.Supplier = res
          this.filteredOptions = res
        }
      }
    })
  }

  selectAll = false;
  SelectAll() {
    this.dataSource.data.forEach((item: any) => {
      item.selected = this.selectAll;
    });
  }
  RowSelect() {
    this.selectAll = this.dataSource.data.every((item: any) => item.selected);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  dataSource = new MatTableDataSource()
  ViewTabel: boolean = false
  viewbtn: any
  View() {
    this.viewbtn = true
    if (this.WeighDelayForm.invalid) {
      return
    } else {
      this.service.ViewTabel(this.WeighDelayForm.controls['Supplier'].value).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error!!'
              this.opendialog()
              return
            }

            this.ViewTabel = true
            this.dataSource.data=[]
            for (let i = 0; i < res.length; i++) {
              if (res[i].emptydatetime == '1900-01-01') {
                res[i].emptydatetime = ''
              }
              if (res[i].loadeddatetime == '1900-01-01') {
                res[i].loadeddatetime = ''
              }
              // 
              this.dataSource.data.push({
                Id: res[i].id,
                tranno: res[i].tranno,
                TranDate: res[i].TranDate,
                SupName: res[i].SupName,
                emptydatetime: res[i].emptydatetime,
                loadedweight: res[i].loadedweight,
                loadeddatetime: res[i].loadeddatetime,
                vehno: res[i].vehno,
                lateapproalreason: res[i].lateapproalreason,
                selected: false
              })
              this.dataSource.data = [...this.dataSource.data]
              this.Approvebtn = false
            }
          } else {
            this.Error = 'No Records Found in Weighment Delay Approval'
            this.userHeader = 'Warning!!'
            this.opendialog()
            return
          }
        }
      })
    }
  }

  TabEmptyWeight: number = 0
  TabEntrydateTime: any = ''
  TabLoaddateTime: any = ''
  isAllSelected(): boolean {
    return this.dataSource.data.every((row: any) => row.selected);
  }
  isIndeterminate(): boolean {
    return this.dataSource.data.some((row: any) => row.selected) && !this.isAllSelected();
  }
  toggleAllSelection(event: any): void {
    const isChecked = event.checked;
    this.dataSource.data.forEach((row: any) => row.selected = isChecked);
  }
  updateArr: any[] = new Array()
  Approvebtn: boolean = true
  saveVaildation() {
    const selectedRecords = this.dataSource.data.filter((item: any) => item.selected);
    if (selectedRecords.length == 0) {
      this.Error = 'Please select at least one record To Approve';
      this.userHeader = 'Warning!!!!'
      this.opendialog()
      return
    } else {
      this.Error = 'Do You Want To Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.getSave()
        } else {
          this.Error = 'Save Canclled'
          this.userHeader = 'Information'
          this.opendialog()
          return
        }
      })
    }
  }
  Sts: string = ''
  Msg: string = ''
  SaveArr:any[]=[]
  getSave() {
    this.SaveArr = []
    this.SaveArr = this.dataSource.data
      .filter((item: any) => item.selected)
      .map((item: any) => ({
        LoginEmpid: this.EmpId,
        Id: item.Id
      }));

    console.log(this.SaveArr);
    this.service.Update(this.SaveArr).subscribe({
      next: (res: any) => {
        console.log(res);
        this.Sts = res[0].status
        this.Msg = res[0].Msg
        if (res[0].status == 'Y') {
          this.Error = res[0].Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe(res=>{
          this.View()
          })
        } else {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
      }
    })
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

