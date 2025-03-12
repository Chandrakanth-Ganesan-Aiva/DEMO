import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatlRecivedfrmdeptService } from '../service/matl-recivedfrmdept.service';
import { data, event } from 'jquery';
import { map, startWith, Subscription } from 'rxjs';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-material-return-frm-dept',
  templateUrl: './material-return-frm-dept.component.html',
  styleUrls: ['./material-return-frm-dept.component.scss']
})
export class MaterialReturnFrmDeptComponent implements OnInit,OnDestroy  {
  // Currdate: any
  // currentDate = new Date()
  LoactionId: number = 0
  Empid: number = 0
  myform!: FormGroup
  private subscription!: Subscription;

  constructor(private date: DatePipe, private formBuilder: FormBuilder,
     private service: MatlRecivedfrmdeptService, private dialog: MatDialog) { }


  ngOnInit(): void {
    // this.Currdate = this.date.transform(this.currentDate, 'yyyy-MM-dd');
    // console.log(this.Currdate);

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);


    this.myform = this.formBuilder.group({
      tranno: ['', [Validators.required]],
      frmdate: [{ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }],
      Dept: ['', Validators.required],
      Material: ['', Validators.required]
    })
    this.getStockReqno()
    this.GetDept()
    this.filterControl.valueChanges.pipe(startWith(''), map((search) =>
      this.Deptdata.filter((option: any) => option.Deptname.toLowerCase().startsWith(search?.toLowerCase() || '')))).subscribe((filtered) => (this.filteredOptions = filtered));

    this.filterControlMatl.valueChanges.pipe(startWith(''), map((search) =>
      this.materialdata.filter((option: any) => option.Rawmatname.toLowerCase().startsWith(search?.toLowerCase() || '')))).subscribe((filtered) => (this.filteredMaterial = filtered));
  }
  masterid: number = 547
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    let Curr_date = this.myform.controls['frmdate'].value
    this.subscription = this.service.Stockreno(this.masterid, Curr_date, this.LoactionId).subscribe((res: any) => {
      if (res.length >= 1) {
        if (res[0].status == 'N') {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
        this.StockReq = res
        this.myform.controls['tranno'].setValue(this.StockReq[0].translno)
      }
    })
  }
  filteredOptions: any = []
  filterControl = new FormControl();
  Deptdata: any[] = new Array()
  GetDept() {
    this.subscription = this.service.Department(this.LoactionId).subscribe((data: any) => {
      if (data.length >= 1) {
        if (data[0].status == 'N') {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
        this.Deptdata = data
        this.filteredOptions = [...data]
      }
    })
  }

  deptEvent() {
    this.getmaterial()

  }

  filterControlMatl = new FormControl()
  filteredMaterial: any = []
  materialdata: any[] = new Array()
  getmaterial() {
    let DeptId = this.myform.controls['Dept'].value
    this.subscription = this.service.Material(DeptId, this.LoactionId).subscribe((data: any) => {
      if (data.length >= 1) {
        if (data[0].status == 'N') {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
        this.materialdata = data
        this.filteredMaterial = data
        console.log(this.materialdata);
      }
    })
  }
  MaterialChangeEvent(){
      if(this.myform.controls['Material'].value){
        this. ViewRecivedMaterial() 
      }
  }
  RecivedMaterial: any[] = new Array()
  dataSource = new MatTableDataSource(this.RecivedMaterial)
  ViewRecivedMaterial() {
    let DeptId = this.myform.controls['Dept'].value
    let Matlid = this.myform.controls['Material'].value
    this.subscription = this.service.ViewRecivedMaterial(this.LoactionId, Matlid, DeptId).subscribe((data: any) => {
      if (data.length >= 1) {
        if (data[0].status == 'N') {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
        this.RecivedMaterial = data
        this.MaterialTabel = true
        const newarr = {
          ReturnQty: ''
        }
        this.RecivedMaterial.forEach(obj => {
          Object.assign(obj, newarr);
        });
        this.dataSource.data=[]
        this.dataSource.data = [...this.RecivedMaterial]
        this.saveBtn=false
      } else {
        this.MaterialTabel = false
        this.dataSource.data=[]
        this.Error = 'No Material Recived from this Department '
        this.userHeader = 'Warning!!'
        this.opendialog()
        return
      }
    })
  }
  saveBtn:boolean=true
  // materialInput(Event: Event) {
  //   const filterValue = (Event.target as HTMLInputElement).value
  //   this.dataSource.filter = filterValue.trim().toLowerCase()
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage()
  //   }
  // }
  Returnqty: any = 0
  Returnvalue: any = 0
  conditionMet: boolean = false;
  MaterialTabel: boolean = false
  ReturnqtyEvent(event: any) {
    this.Returnqty = parseFloat(event.target.value)
    for (let i = 0; i < this.dataSource.data.length; i++) {
      const currentRow = this.dataSource.data[i];
      if (currentRow.ReturnQty > currentRow.qty) {
        this.Error = 'Return Qty Should Not be Greater Than the Balance Qty'
        this.userHeader = 'Warning!!'
        this.opendialog()
        this.dialogRef.afterClosed().subscribe((result: boolean) => {
          currentRow.ReturnQty = 0
        })
        return

        // currentRow.ReturnQty = currentRow.qty;        
        // if (i + 1 < this.RecivedMaterial.length) {
        //   const nextRow = this.RecivedMaterial[i + 1];
        //   const remainingQty = currentRow.qty - nextRow.ReturnQty;
        //   if (remainingQty > nextRow.qty) {
        //     nextRow.ReturnQty = nextRow.qty;
        //   } else {
        //     const remainingQty = currentRow.qty - currentRow.ReturnQty;
        //     if (remainingQty > 0) {
        //       currentRow.ReturnQty = currentRow.qty;
        //     }
        //   }
        // }
        // else {
        //   return;
        // }
      }
    }
  }
  update: any[] = new Array()
  savevaildation() {
    this.update = []
    for (let i = 0; i < this.RecivedMaterial.length; i++) {
      if (this.RecivedMaterial[i].ReturnQty == 0) {
        this.Error = 'Retrun Qty Should be Greater Than Zero For Row Number. ' + i + '';
        this.userHeader = 'Warning!!'
        this.opendialog()
        return
      }
    }
    this.Error = 'Do You Want to Save ?';
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getSave()
      } else {
        this.Error = 'Save Cancelled';
        this.userHeader = 'Information'
        this.opendialog()
        return
      }
    })
  }
  Sts: string = ''
  Msg: String = ''
  getSave() {
    let Curr_date = this.myform.controls['frmdate'].value
    this.subscription =  this.service.Stockreno(this.masterid, Curr_date, this.LoactionId).subscribe((res: any) => {
      if (res.length >= 1) {
        if (res[0].status == 'N') {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
        this.StockReq = res
        this.myform.controls['tranno'].setValue(this.StockReq[0].translno)
      }
    })
    console.log( this.myform.controls['tranno'].value);
    
    this.update = []
    for (let i = 0; i < this.dataSource.data.length; i++) {
      let mindate = this.date.transform(this.RecivedMaterial[i].mindate, 'yyyy-MM-dd')
      this.update.push({
        Tranno: this.myform.controls['tranno'].value,
        Minno: this.dataSource.data[i].minno,
        Mindate: mindate,
        MinDetailId: this.dataSource.data[i].mindetail_id,
        RawmatId: this.dataSource.data[i].rawmatid,
        ReturnQty: this.dataSource.data[i].ReturnQty,
        Min_Ref_No: this.dataSource.data[i].min_ref_no,
        GrnId: this.dataSource.data[i].grnid,
        Grn_Ref_No: this.dataSource.data[i].grn_ref_no,
        Empid: this.Empid,
        Issueqty: this.dataSource.data[i].qty,
        LocationId: this.LoactionId,
        DeptId: this.myform.controls['Dept'].value,
      })
    }
    this.subscription =  this.service.Update(this.update).subscribe({
      next: (res: any) => {
        console.log(res, 'saveRes');
        this.Sts = res[0].status
        if (this.Sts == 'Y') {
          this.Error = res[0].Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
              this.getStockReqno()
              this.MaterialTabel=false
              this.dataSource.data=[]
              this.myform.reset()
              this.myform.controls['frmdate'].setValue(this.date.transform(new Date(),'yyyy-MM-dd'))
            }
          })
        } else {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
      },
    })
  }
  Clear() {
    this.saveBtn=true
    this.getStockReqno()
    this.MaterialTabel = false
    this.myform.reset()
    this.myform.controls['frmdate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
