import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerReturnService } from '../service/customer-return.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
@Component({
  selector: 'app-customer-rejdialog',
  templateUrl: './customer-rejdialog.component.html',
  styleUrls: ['./customer-rejdialog.component.scss']
})
export class CustomerRejdialogComponent implements OnDestroy,OnInit {
  GeneralForm!: FormGroup
  PTCDForm!: FormGroup
  LocationId: number = 0
  TaxList: any[] = new Array()
  dataSource = new MatTableDataSource(this.TaxList)
  @ViewChild(MatSelect) matSelect!: MatSelect;
  constructor(private fb: FormBuilder
    , @Inject(MAT_DIALOG_DATA) public MainCompontentData: any, private service: CustomerReturnService, private overlay: Overlay, private dialog: MatDialog) { }
  CheckedBtn: any

  ngOnInit() {


    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]


    this.GeneralForm = this.fb.group({
      InvoiceId: [''],
      PriceUom: ['', [Validators.required]],
      Product: ['', [Validators.required]],
      Alloy: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      Weight: ['', [Validators.required]],
      BatchNo: [''],
      Uom: ['', [Validators.required]],
      CostCenter: [''],
      RadiobtnType: ['AsPerInvoice'],
      AlternateCurrency: ['', [Validators.required]],
      ExchangeRate: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      Desc: ['', [Validators.required]],
      CurrencyDesc: ['', [Validators.required]],
      InvoiceNo: ['']
    })

    this.PTCDForm = this.fb.group({
      Price: [''],
      Discount: [''],
      Packing: [''],
      InventoryPrice: [''],
    })
    this.getProduct()
    this.getRefNo()
    this.getCostcenter()
    this.getCurrency()
    this.GeneralForm.controls['RadiobtnType'].valueChanges.subscribe({
      next: (res: any) => {
        console.log(res, 'res');
        this.Radiobtntype = res
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }
  ngOnDestroy(): void {
    this.dialog.closeAll()
   }
  Radiobtntype: string = 'AsPerInvoice'
  ProductList: any[] = new Array()
  getProduct() {
    this.service.Product(this.MainCompontentData.CustomerId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.ProductList = res
          console.log(this.ProductList);
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      },
      complete: () => {
        this.CheckCondition()
      }
    })
  }

  RateQcSts: any[] = new Array()
  CheckCondition() {
    if (this.MainCompontentData.Tabel.length == 0) {
      this.service.RateQc(this.LocationId).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            this.RateQcSts = res
            console.log(this.RateQcSts, 'qc');
          }
        },
        error: (err: any) => {
          this.Error = err.message
          this.userHeader = 'Error'
          this.opendialog()
        }
      })
    }
  }

  Qfbno: number = 0
  getRefNo() {
    this.service.QfbrefNo(this.MainCompontentData.CustomerId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.Qfbno = res[0].Qfbno
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }


  ProdChangeEvent(e: any) {
    if (e.target.value > 0) {
      this.getUom()
      this.getInvoice()
      this.getGrade1()
    }
  }

  UomList: any[] = new Array()
  getUom() {
    let MatlId = this.GeneralForm.controls['Product'].value
    this.service.Uom(MatlId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.UomList = res
          this.GeneralForm.controls['Uom'].setValue(res[0].ProdUOM)
          this.GeneralForm.controls['PriceUom'].setValue(res[0].Price)
          this.GeneralForm.controls['Weight'].setValue(res[0].weight)
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }

  InvoiceList: any[] = new Array()
  getInvoice() {
    let MatlId = this.GeneralForm.controls['Product'].value
    this.service.Invoice(this.MainCompontentData.CustomerId, MatlId, this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.InvoiceList = res
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }

  InvoiceChangeEvent(e: any) {
    console.log(e.target.value);
    if (e.target.value > 0) {
      this.getGrade()
      this.getPrice()


    } else {
      this.getGrade1()
    }
  }

  GradeList: any = new Array()
  getGrade() {
    this.GradeList = []
    let MatlId = this.GeneralForm.controls['Product'].value
    this.service.Grade(MatlId).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.length > 0) {
          this.GradeList = res
          console.log(this.GradeList, 'Alloy');
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }
  CostCenter: any[] = new Array()
  getCostcenter() {
    this.service.CostCenter().subscribe({
      next: (res: any) => {
        console.log(res);
        this.CostCenter = res
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }
  getGrade1() {
    this.GradeList = []
    this.service.Grade1().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.GradeList = res
          console.log(this.GradeList, 'Alloy');
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }
  AlloyChangeEvent(e: any) {
    if (e.target.value) {
      let Alloy = this.GeneralForm.controls['Alloy'].value
      let MatlId = this.GeneralForm.controls['Product'].value
      this.service.landedprice(Alloy, MatlId, this.Qfbno).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            this.GeneralForm.controls['Quantity'].setValue(res[0].RejQty)
            let landedprice = res[0].price - res[0].disc + res[0].pack
            this.GeneralForm.controls['PriceUom'].setValue(landedprice)
          }
        },
        error: (err: any) => {
          this.Error = err.message
          this.userHeader = 'Error'
          this.opendialog()
        }
      })
    }
  }

  Pricelist: any[] = new Array()
  getPrice() {
    let InvoiceId = this.GeneralForm.controls['InvoiceId'].value
    let MatlId = this.GeneralForm.controls['Product'].value
    this.service.Price(InvoiceId, MatlId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.Pricelist = res
          this.PTCDForm.controls['Price'].setValue(res[0].price)
          this.PTCDForm.controls['InventoryPrice'].setValue(res[0].price)
          this.GeneralForm.controls['PriceUom'].setValue(res[0].price)
          this.GeneralForm.controls['InvoiceNo'].setValue(res[0].invoiceno)
          console.log(res[0].invoiceno);

          this.getTax()
        } else {
          this.getPrice1()
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }

  getPrice1() {
    let InvoiceId = this.GeneralForm.controls['InvoiceId'].value
    let MatlId = this.GeneralForm.controls['Product'].value
    this.service.Price1(InvoiceId, MatlId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.Pricelist = res
          this.PTCDForm.controls['Price'].setValue(res[0].price)
          this.PTCDForm.controls['InventoryPrice'].setValue(res[0].price)
          this.GeneralForm.controls['PriceUom'].setValue(res[0].price)
          this.GeneralForm.controls['InvoiceNo'].setValue(res[0].invoiceno)
          console.log(res[0].invoiceno);
          this.getTax()
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }


  getTax() {
    let InvoiceNo = this.GeneralForm.controls['InvoiceNo'].value
    let MatlId = this.GeneralForm.controls['Product'].value
    this.service.Tax(InvoiceNo, MatlId, this.MainCompontentData.CustomerId, this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.TaxList = res
          let array = {
            Required: 'Y',
            TaxValue: ''
          }
          this.TaxList.forEach((element: any) => {
            Object.assign(element, array)
          });
          this.TaxList.forEach(element => {
            if (element.additional == 'N') {
              if (element.taxcatid == 3) {
                element.TaxValue = Math.round(this.PTCDForm.controls['InventoryPrice'].value * element.defaultvalue * this.GeneralForm.controls['Quantity'].value / 100)
              }
            }
            if (element.additional == 'Y') {
              if (element.taxcatid == 3) {

              }
            }
          })
          this.dataSource.data = this.TaxList

        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }
  CurrencyList: any[] = new Array()
  getCurrency() {
    this.service.Currency().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.CurrencyList = res
        }
      },
      error: (err: any) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
      }
    })
  }
  Generalfrmbtn: any
  Submit() {
    this.Generalfrmbtn = true
    if (this.Radiobtntype == 'AsPerInvoice') {
      if (this.GeneralForm.controls['InvoiceId'].value == '') {
        this.Error = 'Please Select Invoice'
        this.userHeader = 'Error'
        this.opendialog()
        return
      }
    }
    if (this.GeneralForm.invalid) {
      return
    } else {
      let MatlId = this.GeneralForm.controls['Product'].value
      this.service.Rate(this.MainCompontentData.CustomerId, MatlId, this.LocationId).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.length > 0) {
            let rate1 = Math.round(res[0].Rate * 1.4)
            let rate2 = Math.round(res[0].Rate * 0.5)

            if (rate2 > this.PTCDForm.controls['Price'].value || rate1 < this.PTCDForm.controls['Price'].value) {
              this.Error = 'Please check the Master Price';
              this.userHeader = 'Error';
              this.opendialog();
            }
          }
        },
        error: (err: any) => {
          this.Error = err.message
          this.userHeader = 'Error'
          this.opendialog()
        },
        complete: () => {
          if (this.GeneralForm.controls['InvoiceId'].value == 0) {
            if (this.PTCDForm.controls['InventoryPrice'].value <= 0) {
              this.Error = 'InventoryPrice is Should be Greater Than Zero'
              this.userHeader = 'Error'
              this.opendialog()
            }
            if (this.PTCDForm.controls['Price'].value < this.PTCDForm.controls['Discount'].value) {
              this.Error = 'Discount cannot be less than rate'
              this.userHeader = 'Error'
              this.opendialog()
            }
            if (this.PTCDForm.controls['CostCenter'].value <= 0) {
              this.Error = 'Select CostCenter to continue'
              this.userHeader = 'Error'
              this.opendialog()
            }
          }
        }
      })
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

}

