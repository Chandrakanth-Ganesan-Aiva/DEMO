import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GateEntryDelayService } from '../service/gate-entry-delay.service';
import { map, Observable, startWith } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { Rollback } from '@ngrx/store-devtools/src/actions';

@Component({
  selector: 'app-gate-entry-delay',
  templateUrl: './gate-entry-delay.component.html',
  styleUrls: ['./gate-entry-delay.component.scss']
})
export class GateEntryDelayComponent implements OnInit, AfterViewInit {
  gateEntryDelayForm!: FormGroup;
  LocationId: number = 0
  displayedcolumns: string[] = ['Select', 'GateEntryNo', 'EntryDate', 'Remarks', 'Descripation', 'Supplier']
  gateEntryDelayList: any[] = new Array()
  dataSource = new MatTableDataSource(this.gateEntryDelayList)
  // Error: string = ''
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('ErrorNative') ErrorNative!: ElementRef;
  @ViewChild('Savechild') Savechild!: ElementRef;
  @ViewChild('Save') Save!: ElementRef;
  constructor(private service: GateEntryDelayService, private fb: FormBuilder, private dialog: MatDialog) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.gateEntryDelayForm = this.fb.group({
      party: new FormControl('', Validators.required)
    })
    const Location = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = Location[Location.length - 1]
    this.partDet()
  }

  inputSelect(e: any) {
    this.PartyName = e.target.value;

    this.partDet()
  }
  clear() {
    this.PartyName = '';
    this.partDet()
  }
  PartyName: string = '';
  partDetalisArr: any[] = new Array();
  partDet() {
    this.service.partyDet(this.PartyName).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            this.ErrorNative.nativeElement.click()
            return;
          }
          this.partDetalisArr = res
        }
      }
    })
  }
  Tabelhidden: boolean = true
  Viewbtn: any
  View() {
    this.Viewbtn = true
    if (this.gateEntryDelayForm.invalid) {
      this.gateEntryDelayForm.markAllAsTouched()
      return
    } else {
      let partId = this.gateEntryDelayForm.controls['party'].value
      this.service.ViewgateEntryDelay(partId, this.LocationId).subscribe({
        next: (res: any) => {
          this.gateEntryDelayList = res
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.opendialog()
              this.ErrorNative.nativeElement.click()
              return;
            }
            this.gateEntryDelayForm.disable()
            this.Tabelhidden = false
            const newarr = {
              selected: false,
              Remarks: ''
            }
            this.gateEntryDelayList.forEach(obj => {
              Object.assign(obj, newarr);
            });
            this.dataSource.data = [...this.gateEntryDelayList];
          } else {
            this.Error = 'No Gate Entry Delay For this Party'
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
        }
      })
    }
  }
  applyFilter(Event: Event) {
    this.dataSource.filter = (Event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  RowSelect() {
    this.selectAll = this.gateEntryDelayList.every((item: { selected: any; }) => item.selected);
  }
  selectAll: boolean = false
  SelectAll(event: any) {
    const filteredData = this.dataSource.filteredData;
    if (event.checked) {
      filteredData.forEach(row => row.selected = true);
    } else {
      filteredData.forEach(row => row.selected = false);
    }
  }
  updateArr: any[] = new Array()
  UpdateVaild() {
    this.updateArr = []
    const selectedRecords = this.gateEntryDelayList.filter(item => item.selected);
    if (selectedRecords.length == 0) {
      this.Error = 'Please Select At least One Row with Remarks'
      this.userHeader = 'Error'
      this.opendialog()
      return
    }
    // this.dataSource.data = [...this.gateEntryDelayList];
    this.gateEntryDelayList.filter((item: any) => {
      if (item.selected == true) {
        debugger
        if (item.Remarks == '' || item.Remarks.length < 10) {
          this.Error = 'You cannot Update without remarks.  Please fill remarks with <b style = "color:brown">Minimum 10 Letters </b> of <br> Gate Entry No: <b style = "color:brown">' + item.gateentry_ref_no + '</b> </br>'
          this.userHeader = 'Error'
          this.opendialog()
          return
        } else {
          this.updateArr.push({
            Remark: item.Remarks.trim(),
            TranmasId: item.gateentryno
          })
        }
      }
    });
    if (selectedRecords.length == this.updateArr.length) {
      this.Update()
    } else {
      return;
    }

  }
  Sts: string = ''
  Msg: string = ''
  Update() {
    this.Error = 'Do You Want to Save ?'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.updateArr.forEach((item, index) => {
          this.service.Update(item).subscribe({
            next: (res: any) => {
              this.Sts = res[0].status
              this.Msg = res[0].Msg
              if (this.Sts == 'Y') {
                if (index === this.updateArr.length - 1) {
                  this.Error = this.Msg
                  this.userHeader = 'Information'
                  this.opendialog()
                  this.dialogRef.afterClosed().subscribe((result: boolean) => {
                    if (result) {
                      this.gateEntryDelayForm.enable();
                      // this.gateEntryDelayForm.reset();
                      this.dataSource.data = [];
                      this.Tabelhidden = true;
                      // this.View()
                    }
                  })
                }

              }
              else {
                this.Error = this.Msg
                this.userHeader = 'Error'
                this.opendialog()
              }
            }
          })
        })
      }
      else {
        this.Error = 'Save Cancelled '
        this.userHeader = 'Information'
        this.opendialog()
      }
    })

  }
  ClearAll() {
    this.gateEntryDelayForm.enable();
    this.gateEntryDelayForm.reset();
    this.gateEntryDelayList = [];
    this.Tabelhidden = true;
    this.selectAll = false
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

