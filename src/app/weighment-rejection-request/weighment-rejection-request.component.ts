import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WeighmentrejectoinrequestService } from '../service/weighmentrejectoinrequest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-weighment-rejection-request',
  templateUrl: './weighment-rejection-request.component.html',
  styleUrls: ['./weighment-rejection-request.component.scss']
})
export class WeighmentRejectionRequestComponent implements OnInit, AfterViewInit {
  WeighRejReqForm!: FormGroup
  LocationId: number = 0;
  Empid: number = 0;
  appiError: string = ''
  SupplierDetArr: any[] = new Array();
  dataSource = new MatTableDataSource(this.SupplierDetArr);
  selection = new SelectionModel(true, []);
  TabelHeaders: string[] = ['select', 'Supplier', 'Material', 'Trano', 'TranDate', 'LoadedWt', 'TareWt', 'Vechno']
  constructor(private dialog: MatDialog, private service: WeighmentrejectoinrequestService,  private fb: FormBuilder) { }

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  ngOnInit(): void {
    this.WeighRejReqForm = this.fb.group({
      Supplier: new FormControl('', Validators.required)
    })
    let Location = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = Location[Location.length - 1];
    let Emp = JSON.parse(sessionStorage.getItem('session') || '{}')
    this.Empid = Emp.empid
    this.filterControl.valueChanges.pipe(startWith(''),map((serach:any)=>
    this.SupllierArr.map((option)=> option.supname.toLowerCase().startsWith(serach?.toLowerCase() || '')))).subscribe((filtered) => (this.filteredOptions = filtered));
  
    this.getSupplier()
  }
  filterControl=new  FormControl
  SupllierArr: any[] = new Array()
  filteredOptions:any[]=[]
  getSupplier() {
    this.service.Supplier(this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          res.unshift({
            supname: 'All',
            Supid: 0
          })
          this.SupllierArr = res
          this.filteredOptions=res
        }
      }
    })
  }
  Savebtn: boolean=true
  Tabel: boolean = true
  Submit() {

    if (this.WeighRejReqForm.invalid) {
      return
    }
    else {
      this.service.SupplierDet(this.WeighRejReqForm.controls['Supplier'].value).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.opendialog()
              return
            }
            this.Tabel = false
            this.SupplierDetArr = res

            this.WeighRejReqForm.disable()
            const newarr = {
              selected: false
            }
            this.SupplierDetArr.forEach(obj => {
              Object.assign(obj, newarr);
            });
            this.dataSource.data=[...this.SupplierDetArr]
            this.Savebtn=false
          }
        }
      })
    }
  }
  selectAll = false;
  SelectAll() {
    this.SupplierDetArr.forEach((item: any) => {
      item.selected = this.selectAll;
    });
  }
  RowSelect() {
    this.selectAll = this.SupplierDetArr.every((item: { selected: any; }) => item.selected);
  }
  SaveVaildation() {
    let selectedRecords = this.SupplierDetArr.filter(item => item.selected);
    if (selectedRecords.length == 0) {
      this.Error = 'Please select at least one Record'
      this.userHeader = 'Warning!!'
      this.opendialog()
      return
    }
    else {
      this.Error = 'Do You Want Save ?'
      this.userHeader = 'Information'
      this.opendialog()
     this.dialogRef.afterClosed().subscribe((result)=>{
      if(result){
        this. Approve() 
      }
     })
    }
  }
  updateArr: any[] = new Array()
  Sts: string = ''
  Msg: string = ''
  Approve() {
    let selectedRecords = this.SupplierDetArr.filter(item => item.selected);
    let savearr = []
    for (let i = 0; i < selectedRecords.length; i++) {
      savearr.push({
        ApprovedById: this.Empid,
        Trano: selectedRecords[i].tranno
      })
    }
    this.updateArr = []
    this.updateArr.push({
      WeighRejReq: savearr
    })
    this.service.Update(savearr).subscribe({
      next: (res: any) => {
        this.Sts = res[0].status
        this.Msg = res[0].Msg
        if (this.Sts == 'Y') {
          this.Error = res[0].Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe(res=>{
              this.Submit()
          })
        }
        else {
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