import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StoretostoreService } from '../service/storetostore.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { data } from 'jquery';
import { debounceTime, distinctUntilChanged, filter, map, startWith, Subscription, switchMap } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-store-to-store-moment',
  templateUrl: './store-to-store-moment.component.html',
  styleUrls: ['./store-to-store-moment.component.scss']
})
export class StoreToStoreMomentComponent implements OnInit, AfterViewInit {
  storetostoreform!: FormGroup
  Trandate: any
  LoactionId: number = 0
  Empid: number = 0
  cols: any
  currentDate = new Date()
  filterControl = new FormControl
  filterSubscription: Subscription | undefined;
  dataSource: any = new MatTableDataSource()
  constructor(private date: DatePipe, private fb: FormBuilder, private service: StoretostoreService,
 private dialog: MatDialog, private cdr: ChangeDetectorRef) { }
  @ViewChild(MatTable) MatTable!: MatTable<any>;
  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit() {

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);
    this.storetostoreform = this.fb.group({
      Trannopath: new FormControl('', Validators.required),
      Trandate: new FormControl( {value:this.date.transform(new Date(), 'yyyy-MM-dd'),disabled:true}),
      frmwarehouse: new FormControl('', Validators.required),
      RawmaterialId: new FormControl('', Validators.required),
      Towarehouse: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      TotTransferQty: new FormControl(''),
    })

    this.getpath()
    this.getDept()
    this.getWarehouse()
    this.filterSubscription = this.filterControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms after the user stops typing
        distinctUntilChanged(), // Only trigger if the search term has changed
        filter((search: string) => search.trim().length >= 2), // Ensure at least 2 characters before calling the API
        switchMap((search: string) => this.service.Rawmaterial(search)) // Call the service to fetch the data
      )
      .subscribe((res: any) => {
        this.filteredOptions = res; // Update options with the API response
      });

  }

  getpath() {
    this.service.Path(this.LoactionId).subscribe({
      next: (res: any) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.storetostoreform.controls['Trannopath'].setValue(res[0].TranoPath)
        }
      }
    })
  }

  Deptid: number = 0
  getDept() {
    this.service.Deptid(this.Empid).subscribe((data: any) => {
      if (data.length >= 1) {
        if (data[0].status == 'N') {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
        const deptid = data
        this.Deptid = deptid[0].Deptid
        console.log(this.Deptid);
      }
    })
  }
  apiErrorMsg: string = ''
  WarehouseData: any = new Array()
  getWarehouse() {
    this.service.Warehouse(this.LoactionId).subscribe({
      next: (res: any) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.WarehouseData = res
          console.log(this.WarehouseData);
        }
      }
    })
  }
  TowarehouseData: any[] = new Array()
  FrmwarehouseEvent() {
    this.TowarehouseData = this.WarehouseData.filter((item: any) => item.WareHouse_Id !== parseInt(this.storetostoreform.controls['frmwarehouse'].value))
    console.log(this.TowarehouseData, 'd');

  }
  RawmaterialName: any
  RawmaterialIdData: any[] = new Array()
  filteredOptions: any[] = []
  getRawmaterial() {
    this.service.Rawmaterial(this.RawmaterialName).subscribe({
      next: (res: any) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.RawmaterialIdData = res
        }
      }
    })
  }

  RawmaterialChangeEvent() {
    if (this.storetostoreform.controls['RawmaterialId'].value) {
      this.getStock()
    } else {
      return
    }
  }
  StockData: any[] = new Array()
  getStock() {
    this.service.Stockchck(this.storetostoreform.controls['RawmaterialId'].value, this.LoactionId, this.storetostoreform.controls['frmwarehouse'].value).subscribe({
      next: (res: any) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.StockData = res
          this.storetostoreform.controls['stock'].setValue(this.StockData[0].Stock)
          this.getView()
        }
      }
    })
  }


  TableShow: boolean=false
  ViewStock: any[] = new Array()
  getView() {
    if (this.storetostoreform.invalid) {
      return this.storetostoreform.markAllAsTouched()
    }
    else {
      if (this.storetostoreform.controls['stock'].value > 0) {
        this.service.ViewStock(this.LoactionId, this.storetostoreform.controls['frmwarehouse'].value, this.storetostoreform.controls['RawmaterialId'].value).subscribe({
          next: (res: any) => {
            if (res.length >0) {
              if (res[0].status == 'N') {
                this.Error = res[0].Msg
                this.userHeader = 'Error'
                this.opendialog()
                return
              }
              this.dataSource.data = res
              console.log(this.dataSource.data, ' this.dataSource.data');
              if (this.dataSource.data.length > 0) {
                const newarr = {
                  TransferQty: '',
                }
                this.dataSource.data.forEach((obj: any) => {
                  Object.assign(obj, newarr);
                });
                console.log(this.dataSource.data, ' this.dataSource.data');
                // this.TableShow = true
              }
            }
          }
        })
      } else {
        // this.TableShow = false
        this.storetostoreform.controls['TotTransferQty'].setValue('')
        this.dataSource.data = []
        this.Error = 'Stock Is Not Avialable For This Material..Please Select Another Material'
        this.userHeader = 'Warning!!'
        this.opendialog()
        return
      }
    }

  }
  btnIndex: number = 0
  onTransferQtyInput(index: number,): void {
    let ind = index + (this.paginator.pageSize * this.paginator.pageIndex)
    if (!this.storetostoreform.controls['TotTransferQty'].value) {
      this.Error = 'Please Enter Totatl Transfer Quantity'
      this.userHeader = 'Warning!!'
      this.opendialog()
      setTimeout(() => {
        this.dataSource.data[ind].TransferQty = '';
      });
      this.cdr.detectChanges();
      this.dataSource.data = [...this.dataSource.data]
      return
    } else {
      let Tot = this.dataSource.data.map((t: any) => Number(t.TransferQty)).reduce((acc: number, value: number) => acc + value, 0)
      if (Number(this.storetostoreform.controls['TotTransferQty'].value) < Number(Tot)) {
        this.Error = 'You Cannot Enter More Than The Total Transfer Quantity '
        this.userHeader = 'Warning!!'
        this.opendialog()
        setTimeout(() => {
          this.dataSource.data[ind].TransferQty = ''
        });
        this.cdr.detectChanges();
        this.dataSource.data = [...this.dataSource.data]
        return
      } else {
        this.getTotalCost()
        if (this.dataSource.data[ind].TransferQty > this.dataSource.data[ind].Stock) {
          this.Error = 'You Cannot Enter More Than Stock'
          this.userHeader = 'Warning!!'
          this.opendialog()
          setTimeout(() => {
            this.dataSource.data[ind].TransferQty = '';
          });
          this.cdr.detectChanges();
          this.dataSource.data = [...this.dataSource.data]
          return
        }
      }
    }
  }

  getTotalStock() {
    return this.dataSource.data.map((t: any) => Number(t.Stock)).reduce((acc: number, value: number) => acc + value, 0);
  }
  getTotalCost() {
    return this.dataSource.data.map((t: any) => Number(t.TransferQty)).reduce((acc: number, value: number) => acc + value, 0);
  }
  StockchckClearence() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      this.dataSource.data[i].allowAdd = false;
    }
  }


  trQty: any

  savevaildation() {
    let Tot = this.dataSource.data.map((t: any) => Number(t.TransferQty)).reduce((acc: number, value: number) => acc + value, 0)
    if (Number(this.storetostoreform.controls['TotTransferQty'].value) !== Number(Tot)) {
      this.Error = 'Total Transfer Quantitya And Transfer Quantity Not Equal Check it..Please Check...'
      this.userHeader = 'Warning!!'
      this.opendialog()
      return
    } else {
      this.Error = 'Do you Want Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.save()
        } else {
          this.Error = 'Save Cancelled'
          this.userHeader = 'Information'
          this.opendialog()
          return
        }
      })
    }
  }

  StoretostoreDet: any[] = new Array()
  StoreToStoreSave: any[] = new Array()
  Msg: string = ''
  status: string = ''
  save() {
    this.getpath()
    this.StoretostoreDet=[]
    this.dataSource.data.forEach((element: any) => {
      if (element.TransferQty > 0) {
        this.StoretostoreDet.push({
          Rawmatid: this.storetostoreform.controls['RawmaterialId'].value,
          Qty: element.TransferQty,
          Uom: element.Uom,
          Mindate: this.storetostoreform.controls['Trandate'].value,
          GRNo: element.GRNNo,
          Empid: this.Empid,
          GRNId: element.GRNId,
          Min_ref_no: this.storetostoreform.controls['Trannopath'].value,
          TransId: element.TransId,
          ToStoreId: this.storetostoreform.controls['Towarehouse'].value
        })
      }
    });

    let update = {
      DeptId: this.Deptid,
      Mindate: this.storetostoreform.controls['Trandate'].value,
      Min_ref_no: this.storetostoreform.controls['Trannopath'].value,
      LocationId: this.LoactionId,
      Empid: this.Empid,
      StoreToStoreDet: this.StoretostoreDet
    }

    console.log(update);

    this.service.save(update).subscribe({
      next: (res: any) => {
        this.StoreToStoreSave = res
        this.status = this.StoreToStoreSave[0].status
        this.Msg = this.StoreToStoreSave[0].Msg
        if (this.StoreToStoreSave[0].status === 'Y') {
          this.Error =  this.StoreToStoreSave[0].Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe(res=>{
            this.getpath()
            this.storetostoreform.reset()
            this.dataSource.data=[]
            this.storetostoreform.controls['Trandate'].setValue(this.date.transform(new Date(), 'yyyy-MM-dd'))
          })
          return
        } else {
          this.Error =  this.StoreToStoreSave[0].Msg
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
