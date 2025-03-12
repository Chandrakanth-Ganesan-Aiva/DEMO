import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { StorageQtyAllocationService } from '../service/storage-qty-allocation.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, startWith, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-storage-qty-allocation',
  templateUrl: './storage-qty-allocation.component.html',
  styleUrls: ['./storage-qty-allocation.component.scss']
})
export class StorageQtyAllocationComponent implements OnInit, AfterViewInit {
  StockAllocForm!: FormGroup;
  currentDate = new Date();
  LoactionId: number = 0;
  Empid: number = 0;
  Pending: string = '';
  UserErr: string = '';
  Apierr: string = ''
  ViewMatlRec: any[] = new Array()
  dataSource = new MatTableDataSource(this.ViewMatlRec);
  TabelHeaders: string[] = ['Select', 'Grn_No', 'Grn_Date', 'Material', 'Qty', 'Warehouse']
  constructor(private date: DatePipe, private dialog: MatDialog,
    private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private service: StorageQtyAllocationService) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator
  filterSubscription: Subscription | undefined;
  ngOnInit() {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);

    this.StockAllocForm = this.formBuilder.group({
      frmdate: new FormControl(this.date.transform(this.currentDate, 'yyyy-MM-dd'), Validators.required),
      Todate: new FormControl(this.date.transform(this.currentDate, 'yyyy-MM-dd')),
      Item: new FormControl('', Validators.required),
      PendingCheckBox: new FormControl('')
    })
    // this.StockAllocForm.controls['frmdate'].setValue(this.date.transform('2024-01-06'))

    this.StockAllocForm.controls['PendingCheckBox'].valueChanges.subscribe(value => {
      if (value === true) {
        this.Pending = 'Y'
      }
      else {
        this.Pending = 'N'
      }
    })
    this.filterSubscription = this.filterControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms after the user stops typing
        distinctUntilChanged(), // Only trigger if the search term has changed
        filter((search: string) => search.trim().length >= 2), // Ensure at least 2 characters before calling the API
        switchMap((search: string) => this.service.Items(search)) // Call the service to fetch the data
      )
      .subscribe((res: any) => {
        this.filteredOptions = res; // Update options with the API response
      });
    // this.getItems()
    this.WareHouse()
  }


  filteredOptions: any[] = new Array()
  filterControl = new FormControl();
  rawmatname: string = ''
  getItems() {
    this.service.Items(this.rawmatname).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.filteredOptions = [...data]
        }
      }
    })
  }
  WareHouse() {
    this.service.Warehouse(this.LoactionId).subscribe((data: any) => {
      if (data.length > 0) {
        if (data[0].status == 'N') {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
        this.warehouseData = data
        console.log(this.warehouseData);
        
        this.warehouseData.forEach((element) => {
          if (!element.Warehouse) {
            element.Warehouse = this.warehouseData[0].WarehouseId;
          }
        });
      }
      this.cdr.detectChanges();

    });
  }
  Viewbtn: any

  warehouse: any
  warehouseData: any[] = new Array()
  Tabel: boolean = true
  getViewbtn() {
    this.Viewbtn = true
    if (this.StockAllocForm.invalid) {

    } else {
      if (this.Pending === '') {
        this.Pending = 'N'
      }
      let frmdate = this.date.transform(this.StockAllocForm.controls['frmdate'].value, 'yyyy-MM-dd')
      this.service.View(this.LoactionId, this.StockAllocForm.controls['Item'].value, frmdate,
        this.StockAllocForm.controls['Todate'].value, this.Pending).subscribe({
          next: (data: any) => {
            if (data.length > 0) {
              if (data[0].status == 'N') {
                this.Error = data[0].Msg
                this.userHeader = 'Error'
                this.opendialog()
                return
              }
              this.ViewMatlRec = data
              this.dataSource.data = this.ViewMatlRec
              console.log(this.ViewMatlRec);
              this.Tabel = false
              for (let i = 0; i < this.ViewMatlRec.length; i++) {
                if (this.ViewMatlRec[i].Storagelocid > 0) {
                  this.warehouse[i] = true
                }
              }
              this.service.Warehouse(this.LoactionId).subscribe((res: any) => {
                if (data.length > 0) {
                  if (data[0].status == 'N') {
                    this.Error = data[0].Msg
                    this.userHeader = 'Error'
                    this.opendialog()
                    return
                  }
                  this.warehouseData = res
                  console.log(this.warehouseData, 'first')
                  this.warehouseData.forEach((element) => {
                    if (!element.Warehouse && this.warehouseData.length > 0) {
                      element.Warehouse = this.warehouseData[0].WarehouseName; // Auto-select the first option
                    }
                    console.log(element.Warehouse);
                  });
                }
              })

              for (let i = 0; i < this.ViewMatlRec.length; i++) {
                if (this.LoactionId == 1) {
                  if (this.ViewMatlRec[i].Rawmatid == 1720 || this.ViewMatlRec[i].Rawmatid == 2078) {
                    const newarr = {
                      selected: false,
                      Warehouse: this.warehouseData[2].WarehouseId
                    }
                    this.ViewMatlRec.forEach(obj => {
                      Object.assign(obj, newarr);
                    });
                  }else{
                    const newarr = {
                      selected: false,
                      Warehouse: this.warehouseData[0].WarehouseId
                    }
                    this.ViewMatlRec.forEach(obj => {
                      Object.assign(obj, newarr);
                    });
                  }
                }
                if(this.LoactionId ==2){

                }
              }
              const newarr = {
                selected: false,
                Warehouse: this.warehouseData[0].WarehouseId
              }
              this.ViewMatlRec.forEach(obj => {
                Object.assign(obj, newarr);
              });

            } else {
              this.Error = 'No Records To Found'
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
  WarehoouseId: number = 0
  Ware: any[] = new Array()
  ind: number = 0
  WarehouseEvent(element: any, index: number) {
    console.log(element);
    
    this.ind = index + (this.paginator.pageSize * this.paginator.pageIndex)
    this.WarehoouseId = Number(element.Warehouse); 
    const currentElement = this.dataSource.filteredData[this.ind];
    if (this.WarehoouseId !== currentElement.Warehouse) {
      currentElement.Warehouse = this.WarehoouseId;
    }
    this.ViewMatlRec[this.ind].Warehouse = this.WarehoouseId;

  }




  UpdateIndex: number = 0
  updatvalidation() {
    let selectedRecords = this.ViewMatlRec.filter(item => item.selected);
    for (let i = 0; i < selectedRecords.length; i++) {
      if (this.ViewMatlRec[i].WarehouseId === 0) {
        this.Error = 'Select a Warehouse Location'
        this.userHeader = 'Warning!!'
        this.opendialog()
        return
      }
    }
    if (selectedRecords.length == 0) {
      this.Error = 'Please Select atleast One Row to update The WareHouse'
      this.userHeader = 'Warning!!'
      this.opendialog()
      return
    } else {
      this.Error = 'Do You Want to Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.update()
        } else {
          this.Error = 'Save Cancelled'
          this.userHeader = 'Information'
          this.opendialog()
        }
      })

    }

  }
  UpdateStock: any[] = new Array()
  StockAllocationUpdate: any[] = new Array()
  // Warehouse: number = 0
  update() {

    this.UpdateStock = []

    let selectedRecords = this.ViewMatlRec.filter(item => item.selected);
    console.log(selectedRecords, 'selec');

    for (let i = 0; i < selectedRecords.length; i++) {
      this.UpdateStock.push({
        Warehouseid: parseInt(selectedRecords[i].Warehouse),
        GrnId: selectedRecords[i].Grnid,
        Quantity: selectedRecords[i].Quantity,
        Stock: selectedRecords[i].Quantity,
        TempStoreEntry_Id: selectedRecords[i].Storagelocid,
        GrnDate: selectedRecords[i].GRnDate,
        Rawmatid: selectedRecords[i].Rawmatid,
        Prodid: selectedRecords[i].Rawmatid,
        LocationQty: selectedRecords[i].Quantity,
        LocationId: this.LoactionId,
        SupId: selectedRecords[i].Supid,
        Refno: selectedRecords[i].grn_ref_no,
        RunningWtAvgRate: selectedRecords[i].Quantity,
      })
    }
    console.log(this.UpdateStock, 'save arr');
    
    this.service.Save(this.UpdateStock).subscribe((data: any) => {
      if (data.length >= 1) {
        if (data[0].status == 'Y') {
          this.Error = data[0].Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
              this.getViewbtn()
            }
          })
        } else {
          this.Error = data[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
      }
    })

  }

  Message: string = ''
  Sts: string = ''
  clear() {
    this.StockAllocForm.controls['Item'].setValue('')
    this.StockAllocForm.controls['PendingCheckBox'].setValue('')
    // this.itemsData = []
    this.ViewMatlRec = []
    this.UpdateStock = []
    this.warehouseData = []
    this.StockAllocationUpdate = []
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
