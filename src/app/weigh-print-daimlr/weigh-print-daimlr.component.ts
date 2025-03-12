import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeighprintoutDaimlrService } from '../service/weighprintout-daimlr.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-weigh-print-daimlr',
  templateUrl: './weigh-print-daimlr.component.html',
  styleUrls: ['./weigh-print-daimlr.component.scss']
})
export class WeighPrintDaimlrComponent implements OnInit, AfterViewInit,OnDestroy {
  weighprintForm!: FormGroup
  Customer: any[] = new Array()
  dataSource = new MatTableDataSource(this.Customer);
  TabelHeaders: string[] = ['select', 'Tranno', 'Trandate', 'Customer', 'VechileNo', 'BinQty', 'Weight']

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder, private service: WeighprintoutDaimlrService, private dialog: MatDialog) {
    this.weighprintForm = this.fb.group({
      customer: ['', [Validators.required]]
    })

  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.service.Customer().subscribe({
      next: (res: any) => {
        console.log(res, 'asd')
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
             this.openDialog()
             return
          }
          this.Customer = res
        } else {
          this.Error = 'No Data Found'
          this.userHeader = 'Error'
           this.openDialog()
        }
      }
    })
  }
  applyFilter(Event: Event) {
    this.dataSource.filter = (Event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ViewCustomerDet: any[] = new Array()
  Tabel: boolean = true
  View() {
    if (this.weighprintForm.invalid) {
      return;

    } else {
      this.service.GetDetalis().subscribe({
        next: (res: any) => {
          console.log(res, 'asd')
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.openDialog()
              return
            }
            this.Tabel = false
            this.ViewCustomerDet = res
            let newarr = {
              selected: false
            }
            this.ViewCustomerDet.forEach(obj => {
              Object.assign(obj, newarr);
            });
            this.dataSource.data = [...this.ViewCustomerDet];
          } else {
            this.Error = 'No Data Found for this Customer'
            this.userHeader = 'Error'
             this.openDialog()
             return
          }
        }
      })
    }
  }
  selectAll = false;
  SelectAll() {
    this.ViewCustomerDet.forEach((item: any) => {
      item.selected = this.selectAll;
    });
  }
  RowSelect() {
    this.selectAll = this.ViewCustomerDet.every((item: { selected: any; }) => item.selected);
  }
  getsaveVaild() {
    const selectedRecords = this.ViewCustomerDet.filter(item => item.selected);
    if (selectedRecords.length === 0) {
      this.Error = 'Please Select At Least One Records To Update Weighment Printout'
      this.userHeader = 'Error'
       this.openDialog()
      return
    } else {
      this.Error = 'Do You Want The Save Weighment Printout ? '
      this.userHeader = 'Save'
      this.openDialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        console.log(result);
        if (result) {
          this.Save()
        } else {
          this.Error = ' Weighment Printout Save Cancelled'
          this.userHeader = 'Information'
          this.openDialog()
          return
        }
      });
    }
  }
  Save() {
    const selectedRecords = this.ViewCustomerDet.filter(item => item.selected);
    if (selectedRecords.length > 0) {
      let updateArr = []
      for (let i = 0; i < selectedRecords.length; i++) {
        updateArr.push({
          Trano: selectedRecords[i].tranno
        })
      }
      console.log(updateArr, 'save');
      this.service.Update(updateArr).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res[0].status == 'Y') {
            this.Error = res[0].Msg
            this.userHeader = 'Information'
            this.openDialog()
            this.dialogRef.afterClosed().subscribe((result: boolean) => {
              console.log(result);
              if (result) {
                updateArr = []
                this.ViewCustomerDet = []
                this.Tabel = true
              }
            });
          } else {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
             this.openDialog()
            return
          }
        }
      })
    }

  }

  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  openDialog() {
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

