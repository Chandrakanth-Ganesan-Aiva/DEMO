import { Component } from '@angular/core';
import { POCloseService } from '../service/poclose.service';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
interface TableRow {
  pono: string;
  podate: string;
  rawmatname: string;
  ord_qty: number;
  billqty: number;
  reason: string;
  poproductid: number;
  poid: number
}
@Component({
  selector: 'app-poclose',
  templateUrl: './poclose.component.html',
  styleUrl: './poclose.component.scss'
})
export class POCloseComponent {

  constructor(private service: POCloseService, private dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.Load()
    const locationid = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = locationid[0]
    console.log(this.todate, 'todate');
    console.log(this.fromdate, 'fromdate');
  }
  type: number | null = 0
  fromdate: string = new Date().toISOString().slice(0, 10);
  today: string = new Date().toISOString().slice(0, 10);
  todate: string = new Date().toISOString().slice(0, 10);
  selectedsupplier: number | null = 0;
  LocationId: number = 0
  SupplierArray: any[] = []
  LoadArray: any[] = []
  subconid: number | null = 0
  reason: string = ''
  show: boolean = false
  Error: string = ''
  userHeader: string = ''
  Load() {
    this.service.Load().subscribe((result: any) => {
      this.LoadArray = result
    })
  }
  //PO Type
  PoType(event: any) {
    if (this.fromdate) {
      if (this.todate) {
        if (this.fromdate && this.todate) {
          if (this.todate > this.fromdate || this.todate === this.fromdate) {
            this.Load
            const selectElement = event.target as HTMLSelectElement;
            this.type = Number(selectElement.value);
            this.SupplierArray = []
            console.log(this.type, 'this.type');
            this.service.supplier(this.type, this.LocationId, this.fromdate, this.todate).subscribe((result: any) => {
              this.SupplierArray = result.flat(Infinity);
              console.log(this.SupplierArray.length, ' this.SupplierArray');
              if (this.SupplierArray.length > 0) {
                this.selectedsupplier = null
                this.TableArray = []
                this.selectedRows = []
                this.show = false
              }
              else {
                this.Error = 'There is no data to show'
                this.userHeader = 'Information'
                this.opendialog()
              }
            });
          }
          else {
            this.Error = 'Select the Date Correctly'
            this.userHeader = 'Information'
            this.opendialog()
          }


        } else {
          this.Error = 'Check From and To date selected or not'
          this.userHeader = 'Information'
          this.opendialog()
        }
      }
      else {
        this.Error = 'select the Todate correctly'
        this.userHeader = 'Information'
        this.opendialog()
      }
    }
    else {
      this.Error = 'select the from date correctly'
      this.userHeader = 'Information'
      this.opendialog()
      this.type = null
    }
  }

  //Date
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
  frm(e: any) {
    const selectedDate = new Date(e.target.value);
    const currentDateTime = new Date();
    selectedDate.setHours(currentDateTime.getHours());
    selectedDate.setMinutes(currentDateTime.getMinutes());
    selectedDate.setSeconds(currentDateTime.getSeconds());
    selectedDate.setMilliseconds(currentDateTime.getMilliseconds());
    this.fromdate = this.formatDate(selectedDate);
    console.log(this.fromdate, 'this.fromdate');
    this.selectedsupplier = null
    this.TableArray = []
    this.show = false
    if (this.fromdate && this.todate && this.type) {
      this.service.supplier(this.type, this.LocationId, this.fromdate, this.todate).subscribe((result: any) => {
        this.SupplierArray = result.flat(Infinity);
        console.log(this.SupplierArray.length, ' this.SupplierArray');
        if (this.SupplierArray.length > 0) {
          this.selectedsupplier = null
          this.TableArray = []
          this.show = false
        }
        else {
          this.Error = 'There is no data to show'
          this.userHeader = 'Information'
          this.opendialog()
        }
      });
    } else {
      // this.Error = 'Select Type'
      // this.userHeader = 'Information'
      // this.opendialog()
    }
  }
  to(e: any) {
    const selectedDate = new Date(e.target.value);
    const currentDateTime = new Date();
    selectedDate.setHours(currentDateTime.getHours());
    console.log(selectedDate);
    selectedDate.setMinutes(currentDateTime.getMinutes());
    console.log(selectedDate);
    selectedDate.setSeconds(currentDateTime.getSeconds());
    console.log(selectedDate);
    selectedDate.setMilliseconds(currentDateTime.getMilliseconds());
    console.log(selectedDate);
    this.todate = this.formatDate(selectedDate);
    console.log(this.todate, 'this.todate');
    this.selectedsupplier = null
    this.TableArray = []
    this.show = false
    if (this.fromdate && this.todate && this.type) {
      this.service.supplier(this.type, this.LocationId, this.fromdate, this.todate).subscribe((result: any) => {
        this.SupplierArray = result.flat(Infinity);
        console.log(this.SupplierArray.length, ' this.SupplierArray');
        if (this.SupplierArray.length > 0) {
          this.selectedsupplier = null
          this.TableArray = []
          this.show = false
        }
        else {
          this.Error = 'There is no data to show'
          this.userHeader = 'Information'
          this.opendialog()
        }
      });
    }
  }
  //Supplier
  onSupplierChange(selectedSupplierId: any) {
    this.TableArray = []
    this.selectedRows = []
    if (this.type && this.LocationId && this.fromdate && this.todate) {
      this.selectedsupplier = selectedSupplierId;
      if (this.selectedsupplier) {
        this.table()
      }
      else {
        this.show = false
      }
    }
    else {
      this.show = false
      this.Error = 'Select the type and date'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  TableArray: any[] = []
  table() {
    this.TableArray = []
    this.subconid = this.selectedsupplier
    this.service.table(this.type, this.LocationId, this.selectedsupplier, this.type, this.fromdate, this.todate, this.subconid).subscribe((result: any) => {
      this.TableArray = result
      console.log(this.TableArray, 'TableArray');
      if (this.TableArray) {
        this.show = true
      }
      else {
        this.show = false
        this.Error = 'There is no data to show'
        this.userHeader = 'Information'
        this.opendialog()
      }
    })
  }
  viewall() {
    this.selectedRows = []
    if (this.type && this.LocationId && this.fromdate && this.todate) {
      this.selectedsupplier = null
      if (this.SupplierArray.length > 0) {
        if (this.fromdate < this.todate && this.fromdate !== this.todate) {
          this.service.viewall(this.type, this.LocationId, this.fromdate, this.todate).subscribe((result: any) => {
            this.TableArray = result
            console.log(result, 'result');
            if (this.TableArray) {
              this.show = true
            }
            else {
              this.Error = 'Select all the fields'
              this.userHeader = 'Information'
              this.opendialog()
            }
          })
        }
        else {
          this.Error = 'Check the From and to date'
          this.userHeader = 'Infomation'
          this.opendialog()
        }
      } else {
        this.Error = 'There is no data to show'
        this.userHeader = 'Information'
        this.opendialog()
      }
    }
    else {
      this.Error = 'Select the Type'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }

  selectedRows: TableRow[] = [];  // Explicitly typed as TableRow array
  isAllSelected = false;
  toggleSelectAll(event: any) {
    this.isAllSelected = event.target.checked;
    if (this.isAllSelected) {
      const missingReasons = this.TableArray.filter(row => !row.reason.trim());
      if (missingReasons.length > 0) {
        this.Error = 'Please enter a reason for each row before selecting all'
        this.userHeader = 'Information'
        this.opendialog()
        this.isAllSelected = false;
      } else {
        this.selectedRows = [...this.TableArray];
      }
    } else {
      this.selectedRows = [];
    }
  }

  toggleRowSelection(event: any, row: TableRow) {
    if (event.target.checked) {
      if (!row.reason) {
        this.Error = 'Please enter a reason for each row before selecting'
        this.userHeader = 'Information'
        this.opendialog()
        event.target.checked = false;
        return;
      }
      if (!this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(item => item !== row);
      row.reason = ''
    }
    this.isAllSelected = this.selectedRows.length === this.TableArray.length;
  }
  updateArray: any[] = []
  updatedArray: any[] = []
  update() {
    if (this.selectedRows.length > 0) {
      for (let i = 0; i < this.selectedRows.length; i++) {
        this.updateArray.push({
          type: this.type,
          reason: this.selectedRows[i].reason,
          poproductid: this.selectedRows[i].poproductid,
          poid: this.selectedRows[i].poid
        })
      }
      this.Error = 'Are you Sure to Update ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.update(this.updateArray).subscribe((result: any) => {
            result
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
            this.clear()
          })
        }
      })
    } else {
      this.Error = 'Select Rows to Close'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  clear() {
    this.type = null
    const currentDate = new Date();
    this.fromdate = this.formatDate(currentDate);
    this.todate = this.formatDate(currentDate);
    const fromDateInput = document.getElementById('fromdate') as HTMLInputElement;
    const toDateInput = document.getElementById('todate') as HTMLInputElement;
    fromDateInput.value = this.fromdate.split(' ')[0];
    toDateInput.value = this.todate.split(' ')[0];
    this.selectedsupplier = null
    this.SupplierArray = []
    this.subconid = null
    this.reason = ''
    this.show = false
    this.Error = ''
    this.userHeader = ''
    this.show = false
    this.TableArray = []
    this.selectedRows = []
    this.updateArray = []
    this.updatedArray = []
    this.isAllSelected = false;
  }
  onReasonChange(row: TableRow) {
    if (row.reason && row.reason.trim() !== '') {
      if (!this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(item => item !== row);
    }
    this.isAllSelected = this.selectedRows.length === this.TableArray.length;
  }

  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}
