import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RawmaterialSplitService } from '../service/rawmaterial-split.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-rawmaterial-split',
  templateUrl: './rawmaterial-split.component.html',
  styleUrls: ['./rawmaterial-split.component.scss']
})
export class RawmaterialSplitComponent implements OnInit, AfterViewInit,OnDestroy {
  MyForm!: FormGroup
  ViewRawmat: any[] = new Array()
  dataSource = new MatTableDataSource(this.ViewRawmat)
  MaterialView: any[] = new Array()
  dataSource1 = new MatTableDataSource(this.MaterialView)
  locationid: number = 0
  Empid: number = 0
  displayedColumns: string[] = ['GrnRefNo', 'GrnDate', 'Supplier', 'View', 'Uom', 'GrnQty', 'RejQty', 'Net']
  displayedColumns1: string[] = ['Material', 'Uom', 'Qty']
  constructor(private service: RawmaterialSplitService, private date: DatePipe, private spinner: NgxSpinnerService, private dialog: MatDialog, private fb: FormBuilder) {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.locationid = data[data.length - 1]
    console.log(this.locationid);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.MyForm = fb.group({
      FromDate: [new Date(), Validators.required],
      ToDate: [new Date(), Validators.required],
      Material: [Validators.required]
    })
  }
  ngAfterViewInit(): void {

  }
  Material: any[] = new Array()
  ngOnInit(): void {
    this.service.getRawMaterial().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.OpenDialog()
            return
          }
          this.Material = res
        }
      }
    })
  }


  View() {
    let rawmatid = this.MyForm.controls['Material'].value
    let fromdate = this.date.transform(this.MyForm.controls['FromDate'].value, 'yyyy-MM-dd')
    let todate = this.date.transform(this.MyForm.controls['ToDate'].value, 'yyyy-MM-dd')
    this.service.getRawmaterialView(rawmatid, fromdate, todate, this.locationid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.OpenDialog()
            return
          }
          this.ViewRawmat = res
          this.dataSource.data = [...this.ViewRawmat]
          this.MyForm.disable()
        }
      }
    })
  }
  ViewRawmaterial: boolean = true
  ViewRawt(Index: any) {
    let fromdate = this.date.transform(this.MyForm.controls['FromDate'].value, 'yyyy-MM-dd')
    let todate = this.date.transform(this.MyForm.controls['ToDate'].value, 'yyyy-MM-dd')
    this.service.getRawMatTabel(this.ViewRawmat[Index].rawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.OpenDialog()
            return
          }
          this.ViewRawmaterial = false
          this.MaterialView = res
          console.log(res);
          let newarr = {
            Qty: ''
          }
          this.MaterialView.forEach(obj => {
            Object.assign(obj, newarr);
          });
          this.dataSource1.data = [...this.MaterialView];

        }
      }
    })
    console.log(this.ViewRawmat, 'awre');
  }
  UpdateRawmatSplit: any[] = new Array()
  qtyValue: number = 0
  Updatevaild() {
    for (let i = 0; i < this.dataSource1.data.length; i++) {
      if (this.dataSource1.data[i].Qty > 0) {
        this.qtyValue = parseFloat(this.dataSource1.data[i].Qty)
        this.ViewRawmat[i] = { ...this.ViewRawmat[i], MatlGqty: this.qtyValue };
      } else {
        this.Error = ' ' + this.dataSource1.data[i].rawmatname + ' For this Material Quantity Should Be Greater Than Zero '
        this.userHeader = 'Error'
        this.OpenDialog()
        return;
      }
    }

    this.Error = 'Do You Want To Save ?'
    this.userHeader = 'Save'
    this.OpenDialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.UpdateRawmatSplit = []
        for (let i = 0; i < this.ViewRawmat.length; i++) {
          this.UpdateRawmatSplit.push({
            GrnNo: this.ViewRawmat[i].grnno,
            Rawmatid: this.ViewRawmat[i].rawmatid,
            Uom: this.ViewRawmat[i].uom,
            Grndate: this.ViewRawmat[i].grndate,
            Gqty: this.ViewRawmat[i].MatlGqty,
            Grate: this.ViewRawmat[i].grate,
            Grejdate: this.ViewRawmat[i].grndate,
            Inspected: this.ViewRawmat[i].inspected,
            Qcreq: this.ViewRawmat[i].qcreq,
            Puomrate: 'this.MaterialView[i].puomrate',
            Poproductid: this.ViewRawmat[i].poproductid,
            Altcurrid: this.ViewRawmat[i].altcurrid,
            AltCurrExRate: this.ViewRawmat[i].AltCurrExRate,
            Exrate: this.ViewRawmat[i].exrate,
            LoginId: this.Empid,
            postingaccountid: this.ViewRawmat[i].postingaccountid,
            Grnbasicprice: this.ViewRawmat[i].grnbasicprice,
            MRPprice: 'this.MaterialView[i].gqty',
            Grnid_old: this.ViewRawmat[i].grnid,
          })
        }
        console.log(this.UpdateRawmatSplit, 'updateArr');
        this.spinner.show()
        this.service.Update(this.UpdateRawmatSplit).subscribe({
          next: (res: any) => {
            console.log(res);
            this.spinner.hide()
            if (res[0].status == 'Y') {
              this.Error = res[0].Msg
              this.userHeader = 'Information'
              this.OpenDialog()
              this.dialogRef.afterClosed().subscribe((result:boolean) => {
                if (result) {
                  this.MyForm.enable()
                  this.View()
                } else {
                  return
                }
              })
            } else {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.OpenDialog()
            }
          }
        })
      } else {
        this.Error = 'Save Cancelled'
        this.userHeader = 'Information'
        this.OpenDialog()
      }
    })
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  OpenDialog() {
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
