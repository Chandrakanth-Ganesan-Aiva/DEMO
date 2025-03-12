import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { map, startWith } from 'rxjs';
import { GrnWithoutBillEntryService } from '../service/grn-without-bill-entry.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-grn-without-bill-entry',
  templateUrl: './grn-without-bill-entry.component.html',
  styleUrls: ['./grn-without-bill-entry.component.scss']
})
export class GrnWithoutBillEntryComponent implements OnInit {
  GrnForm!: FormGroup;
  dataSource = new MatTableDataSource();
  loactionId: number = 0
  Empid: number = 0
  constructor(private date: DatePipe, private router: Router, private fb: FormBuilder, private service: GrnWithoutBillEntryService, private spinner: NgxSpinnerService, private dialog: MatDialog) {
    this.GrnForm = this.fb.group({
      grrno: ['', [Validators.required]],
      GrnDate: [{ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, [Validators.required]],
      supplier: ['', [Validators.required]],
      Dcno: ['', [Validators.required]],
      DcDate: [this.date.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      GateEntryDate: [{ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, [Validators.required]],
      gateEntryNo: ['', [Validators.required]],
      Weighment: [{ value: 'WithoutWeighment', disabled: true }, [Validators.required]],
      Material: ['', [Validators.required]],
      PONO: [''],
      gateEntry: [''],
      ticketNo: [''],

    })


    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.loactionId = data[data.length - 1]
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
  }

  beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    console.log('Refresh successful');
    // Uncomment below lines if you want to show a confirmation prompt
    // event.preventDefault();
    // event.returnValue = ''; 
  };



  filterControl = new FormControl();
  ngOnInit() {
    this.getStockReqNo()
    this.getSupplier()
  }
  MasterId: number = 8718
  getStockReqNo() {
    let Grndate = this.GrnForm.controls['GrnDate'].value
    this.service.Stockreno(this.MasterId, Grndate, this.loactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.ErrorMsg = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.GrnForm.controls['grrno'].setValue(res[0].translno)
        }
      },
      error: (err: any) => {
        this.ErrorMsg = err[0].message
        this.userHeader = 'Error'
        return this.opendialog()
      },
      complete: () => {


      }
    })
  }
  SupplierList: any[] = new Array()
  filteredOptions: any = []
  getSupplier() {
    this.service.Supplier().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.ErrorMsg = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.SupplierList = res
          this.filteredOptions = [...this.SupplierList]
          this.filterControl.valueChanges.pipe(startWith(''), map((search) =>
            this.SupplierList.filter((option: any) =>
              option.supname.toLowerCase().includes(search?.toLowerCase() || '')
            ))
          ).subscribe((filtered) => (this.filteredOptions = filtered));
          console.log(this.filteredOptions, 'as');
        }
      }
    })
  }
  Currid: number = 0
  SupplierChange() {
    if (this.GrnForm.controls['supplier'].value) {
      let Result = this.filteredOptions.filter((item: any) => {
        if (item.supid == this.GrnForm.controls['supplier'].value) {
          return this.Currid = item.currid
        }
      })
      if (this.GrnForm.controls['supplier'].value == 2734 || this.GrnForm.controls['supplier'].value == 13956) {
        this.GrnForm.controls['PONO'].setValidators(Validators.required)
        this.getPono()
      }
      this.getGateentry()
    }

  }
  PonoList: any[] = new Array()
  getPono() {
    this.service.Pono().subscribe({
      next: (res: any) => {
        console.log(res, 'PONO');
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.ErrorMsg = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.PonoList = res
          // this.GrnForm.controls['PONO'].setValue(res[0].pono)
        }
      }
    })
  }
  PoPrductId: number = 0
  PoNo: number = 0
  poChangeEvent() {
    this.PonoList.filter((item: any) => {
      if (item.poid == this.GrnForm.controls['PONO'].value) {
        this.PoNo = item.pono;
        this.PoPrductId = item.poproductid
      }
    })
  }
  gateEntryList: any[] = new Array()
  getGateentry() {
    let supid = this.GrnForm.controls['supplier'].value
    this.service.gateentry(supid, this.loactionId, supid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.ErrorMsg = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.gateEntryList = res
        }
      }
    })
  }
  gateEntryRefno: string = ''
  gateEntryEvent(event: any) {
    if (this.GrnForm.controls['gateEntryNo'].value) {
      this.GrnForm.controls['Weighment'].enable()
      let Result = this.gateEntryList.filter((item: any) => {
        if (item.gateentryno == this.GrnForm.controls['gateEntryNo'].value) {
          this.gateEntryRefno = item.GateEntry_Ref_No

          return this.GrnForm.controls['Dcno'].setValue(item.dcno)
        }
      })
    }

  }
  Ticketnumber:boolean=true
  WeighmnetTypeEvent() {
    let gateno = this.GrnForm.get('gateEntryNo')?.value
    let party = this.GrnForm.get('supplier')?.value
    if (this.GrnForm.get('Weighment')?.value == 'WithWeighment') {
      this.GrnForm.controls['ticketNo'].setValidators(Validators.required)
    }
    if (gateno > 0 && party > 0) {
      if (this.GrnForm.get('Weighment')?.value == 'WithWeighment') {
        this.Ticketnumber=false
        this.TabelHidden=false
        this.getWithWeighment()
        this.GrnForm.get('Material')?.disable()
        this.dataSource.data = []
        this.GrnForm.get('Material')?.setValue('')
        this.GrnForm.get('Material')?.clearValidators()
      } else {
        this.Ticketnumber=true
        this.GrnForm.get('Material')?.enable()
        return;
      }
    } else {
      this.ErrorMsg = 'If You Want to select <b style="color:brown">WithWeighment</b>, Please select <b style="color:brown">Supplier </b> and <b style="color:brown">Gate Entry No </b>';
      this.userHeader = 'Error'
      this.opendialog()
      return
    }

  }
  Weighment: any[] = new Array()
  getWithWeighment() {
    let DcDate = this.GrnForm.controls['DcDate'].value
    let party = this.GrnForm.get('supplier')?.value
    this.service.WithWeighment(DcDate, this.loactionId, this.gateEntryRefno, party).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.ErrorMsg = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.Weighment = res
        }
      }
    })
  }


  MaterialLoad() {
    if (this.materialFilter.value && this.materialFilter.value.length > 2) {
      this.getRawmatreial()
      this.materialFilter.valueChanges.pipe(map((search) =>
        this.rawmaterial.filter((option: any) =>
          option.rawmatname.toLowerCase().includes(search?.toLowerCase() || '')
        ))
      ).subscribe((filtered) => (this.MaterialFilterList = filtered));
    } else {
      this.materialFilter.value == ''
      this.MaterialFilterList = []
    }
  }
  materialFilter = new FormControl();
  MaterialFilterList: any = []
  rawmaterial: any[] = new Array()
  getRawmatreial() {
    this.service.Material(this.materialFilter.value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.ErrorMsg = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.rawmaterial = res
          this.MaterialFilterList = [...this.rawmaterial]
        }
      }
    })
  }
  Material: string = ''
  Uom: string = ''
  RawmaterialChanmgeEvent() {
    if (this.GrnForm.get('Material')?.value) {
      this.MaterialFilterList.filter((res: any) => {
        if (res.rawmatid == this.GrnForm.get('Material')?.value) {
          this.Uom = res.uom
          return this.Material = res.rawmatname
        }
      })
    }
  }
  initializePriceDisabled() {
    // Assuming you have a data array called 'dataSource'
    this.priceDisabled = this.dataSource.data.map((row: any) => row.price > 0);
  }

  onPriceChange(index: number, price: number) {
    // Enable the field if price < 0, but do not disable it once changed
    if (price < 0) {
      this.priceDisabled[index] = false;
    }
  }
  TabelHidden:boolean=false
  saveBtnDisabled:boolean=true
  priceDisabled: boolean[] = [];
  Add() {
    if (this.GrnForm.controls['Weighment'].value == 'WithWeighment') {
      this.GrnForm.controls['ticketNo'].setValidators(Validators.required)
    }
    if (this.GrnForm.invalid) {
      return this.GrnForm.markAllAsTouched()
    } else {
      this.TabelHidden=true
      if (this.GrnForm.get('Weighment')?.value != 'WithWeighment') {
        this.GrnForm.disable()
        this.GrnForm.get('Material')?.enable()
        const isMatching = this.dataSource.data.some((item: any) => item.rawmatid == this.GrnForm.get('Material')?.value)
        if (!isMatching) {
          this.dataSource.data = [...this.dataSource.data];

          this.dataSource.data.push({
            rawmatname: this.Material,
            rawmatid: this.GrnForm.get('Material')?.value,
            uom: this.Uom,
            Qty: '',
            price: '',
          });
          let SupId = this.GrnForm.get('supplier')?.value;
          let Weighmenttype = this.GrnForm.get('Weighment')?.value
          let Dcdate=this.GrnForm.get('DcDate')?.value
          this.dataSource.data.filter((item: any) => {
            this.service.Price(Weighmenttype, SupId, item.rawmatid, this.loactionId, this.Currid,Dcdate).subscribe({
              next: (res: any) => {
                if (res.length > 0) {
                  if (res[0].status == 'N') {
                    this.ErrorMsg = res[0].Msg;
                    this.userHeader = 'Error';
                    this.opendialog();
                    return;
                  }
                  let arr = {}
                  res.forEach((element: any) => {
                    arr = {
                      price: element.Rate,
                    }
                  });
                  this.dataSource.data.forEach((element: any) => {
                    if (element.rawmatid === item.rawmatid) {
                      Object.assign(element, arr);
                    }
                  });
                }
                this.dataSource.data = [...this.dataSource.data];
                this.saveBtnDisabled=false
                this.priceDisabled = this.dataSource.data.map((row: any) => row.price > 0);
                console.log(this.dataSource.data);
              }
            })
            this.getTotalGross()
          })
        } else {
          this.ErrorMsg = 'Same Material Cannot be Added'
          this.userHeader = 'Warning!!'
          return this.opendialog()
        }
      } else {
        this.GrnForm.disable()
        let WithWeigmentArr: any = []
        let SupId = this.GrnForm.get('supplier')?.value;
        let Weighmenttype = this.GrnForm.get('Weighment')?.value
        let Dcdate=this.GrnForm.get('DcDate')?.value
        this.Weighment.forEach((item: any) => {
          this.service.WithWeigmentTabel(Weighmenttype, SupId, item.rawmatid, this.loactionId, this.Currid, item.gateentryno,Dcdate).subscribe({
            next: (res: any) => {
              console.log(res);
              res.forEach((element: any) => {
                WithWeigmentArr.push({
                  rawmatname: element.name,
                  rawmatid: element.rawmatid,
                  uom: element.uom,
                  Qty: element.Rate,
                  price: element.NetWeight,
                })

              });
              this.dataSource.data = [...WithWeigmentArr];
            }
          })
          this.getTotalGross()
        })
      }
    }

  }
  deleteMatl(Index: number) {
    this.ErrorMsg = 'Do You Want To Delete ?'
    this.userHeader = 'Warning!!!'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.dataSource.data.splice(Index, 1)
        if(this.dataSource.data.length ==0){
          this.TabelHidden=false
        }
        this.dataSource.data = [...this.dataSource.data]
      } else {
        return
      }
    })

  }
  Gross: number = 0
  getTotalGross() {
    return this.dataSource.data.map((t: any) => Number(t.Qty * t.price)).reduce((acc: number, value: number) => acc + value, 0);
  }


  saveVaild(): Promise<void> {
    return new Promise((resolve, reject) => {
      for (let item of this.dataSource.data as any[]) {
        if ((item.price < 0) || (item.Qty <= 0) || ((item.price * item.Qty) <= 0)) {
          this.ErrorMsg = 'Material : <b style="color:brown"> ' + item.rawmatname + ' </b> Quantity Is Empty Or Quantity Is Less Than Zero Please Check It.. </br> ' +
            'Quantity Must Be Greater Than Zero'
          this.userHeader = 'Warning!!'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe(() => reject('Validation failed'));
          return;
        }
      }
      this.ErrorMsg = 'Do You Want Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          Promise.resolve(this.getSave()).then(resolve).catch(reject)
        } else {
          this.ErrorMsg = 'Save Cancelled'
          this.userHeader = 'Information'
          this.opendialog()
          reject('Save cancelled');
        }
      })
    });
  }
  getSave() {
    let MaterialArr: any = []
    this.dataSource.data.forEach((item: any) => {
      MaterialArr.push({
        RawMatId: item.rawmatid,
        Uom: item.uom,
        Qty: item.Qty,
        EntryEmpid: this.Empid,
        PoProductId: this.PoPrductId ? this.PoPrductId : 0,
        Price: item.price
      })
    })
    let UpdateArr: any = []
    UpdateArr.push({
      GrnRefNo: this.GrnForm.controls['grrno'].value,
      Supid: this.GrnForm.controls['supplier'].value,
      GrnDcNo: this.GrnForm.controls['Dcno'].value,
      GateEntryNo:  this.gateEntryRefno,
      TicketNo: this.GrnForm.controls['ticketNo'].value ? this.GrnForm.controls['ticketNo'].value : null,
      locatinId: this.loactionId,
      Empid: this.Empid,
      Pono: this.PoNo ? this.PoNo : null,
      Poid: this.GrnForm.controls['PONO'].value ? this.GrnForm.controls['PONO'].value : null,
      MaterialDet: MaterialArr
    })
    console.log(UpdateArr);

    this.service.Save(UpdateArr).subscribe({
      next: (res: any) => {
        console.log(res);
        if(res[0].status =='N'){
          this.ErrorMsg=res[0].Msg
          this.userHeader='Error'
          return this.opendialog()
        }else{
          this.ErrorMsg=res[0].Msg
          this.userHeader='Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe(res=>{
            this.GrnForm.reset()
            this.GrnForm.controls['GrnDate'].setValue(this.date.transform(new Date(),'yyyy-MM-dd'))
            this.GrnForm.controls['DcDate'].setValue(this.date.transform(new Date(),'yyyy-MM-dd'))
            this.GrnForm.controls['GateEntryDate'].setValue(this.date.transform(new Date(),'yyyy-MM-dd'))
            this.GrnForm.controls['GateEntryDate'].disable()
            this.GrnForm.controls['GrnDate'].disable()
            this.GrnForm.enable()
            this.dataSource.data=[]
            this.TabelHidden=false
            this.saveBtnDisabled=true
            this.Ticketnumber=true
          })
        }
      }
    })
  }

  ErrorMsg: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.ErrorMsg, Type: this.userHeader }
    });

  }

  ngOnDestroy(): void {
    this.dialog.closeAll()
  }
}
