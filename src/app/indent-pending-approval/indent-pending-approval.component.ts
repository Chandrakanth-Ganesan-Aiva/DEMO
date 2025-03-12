import { Component } from '@angular/core';
import { IndentEntryService } from '../service/indent-entry.service';
import { IndentPendingApprovalService } from '../service/indent-pending-approval.service';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
@Component({
  selector: 'app-indent-pending-approval',
  templateUrl: './indent-pending-approval.component.html',
  styleUrl: './indent-pending-approval.component.scss'
})
export class IndentPendingApprovalComponent {
  constructor(private service: IndentPendingApprovalService, private datePipe: DatePipe, private dialog: MatDialog) { }
  LocationId: number = 0
  deptid: number | null = 0
  materialid: number | null = 0
  groupid: number | null = null
  groupid1: number | null = 0
  obj: any[] = []

  //Array
  locationArray: any[] = []
  materialArray: any[] = []
  groupArray: any[] = []
  tableArray: any[] = []
  tableArray1: any[] = []
  tableArray2: any[] = []
  combinedArray: any[] = []
  rArray: any[] = []
  qty1Array: any[] = []
  ngOnInit() {
    const locationid = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = locationid[0]
    this.load()
    this.view()
  }
  load() {
    this.service.location(this.LocationId).subscribe((result: any) => {
      this.locationArray = result
    })
    this.service.material().subscribe((result: any) => {
      this.materialArray = result
    })
    this.service.group().subscribe((result: any) => {
      this.groupArray = result
    })
  }
  dept(event: any) {
    if (event === undefined || event == null) {
      this.deptid = null
    } else {
      this.deptid = event.deptid;
    }
    this.view();
  }
  material(event: any) {
    if (event === undefined || event === null) {
      this.materialid = null
    }
    else {
      this.materialid = event.rawmatid
    }
    this.view()
  }
  group(event: any) {
    if (event === undefined || event === null) {
      this.groupid = null
    }
    else {
      this.groupid = event.id
    }
    this.view()
  }
  selectedRows: any[] = [];
  isAllSelected = false;
  Error = '';
  userHeader = '';
  toggleRowSelection(event: any, row: any) {
    if (event.target.checked) {
      if (!row.reason || row.reason.trim() === '') {
           }
      if (!this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(item => item !== row);
      row.reason = ''; // Clear the reason when unchecked
    }
    this.isAllSelected = this.selectedRows.length === this.tableArray.length;
  }
  onReasonChange(row: any) {
    if (row.reason && row.reason.trim() !== '') {
      if (!this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(item => item !== row);
    }
    setTimeout(() => {
      const checkboxes = document.querySelectorAll("input[type='checkbox']");
      const index = this.tableArray.indexOf(row);
      if (checkboxes[index]) {
        (checkboxes[index] as HTMLInputElement).checked = row.reason.trim() !== '';
      }
    });
    this.isAllSelected = this.selectedRows.length === this.tableArray.length;
  }
  view() {
    this.tableArray = []
    this.tableArray1 = []
    this.obj = []
    this.diffArray = []
    this.combinedArray = []
    this.selectedRows = []
    this.mailArray = []
    if (this.deptid && this.materialid && this.groupid) {
      this.service.all(this.LocationId, this.deptid, this.materialid, this.groupid).subscribe((result: any) => {
        this.tableArray = result
        for (let i = 0; i < this.tableArray.length; i++) {
          this.obj.push({
            r: this.tableArray[i].rawmatid
          })
        }
        for (let i = 0; i < this.tableArray.length; i++) {
          this.service.table(this.LocationId, this.obj[i].r).subscribe((result: any) => {
            this.tableArray1.push({
              Ord_Qty: result[0]?.Ord_Qty ?? null,
              PODate: result[0]?.PODate ?? null,
              PONO: result[0]?.PONo ?? null,
              rate: result[0]?.rate ?? null,
              supname: result[0]?.supname ?? null
            })
          })
        }
      })
    }
    else {
      if (this.deptid && this.materialid) {
        this.service.deptmat(this.LocationId, this.deptid, this.materialid).subscribe((result: any) => {
          this.tableArray = result
          for (let i = 0; i < this.tableArray.length; i++) {
            this.obj.push({
              r: this.tableArray[i].rawmatid
            })
          }
          for (let i = 0; i < this.tableArray.length; i++) {
            this.service.table(this.LocationId, this.obj[i].r).subscribe((result: any) => {
              this.tableArray1.push({
                Ord_Qty: result[0]?.Ord_Qty ?? null,
                PODate: result[0]?.PODate ?? null,
                PONO: result[0]?.PONo ?? null,
                rate: result[0]?.rate ?? null,
                supname: result[0]?.supname ?? null
              })
            })
          }
        })
      }
      else if (this.deptid && this.groupid) {
        this.service.depgrp(this.LocationId, this.deptid, this.groupid).subscribe((result: any) => {
          this.tableArray = result
          for (let i = 0; i < this.tableArray.length; i++) {
            this.obj.push({
              r: this.tableArray[i].rawmatid
            })
          }
          for (let i = 0; i < this.tableArray.length; i++) {
            this.service.table(this.LocationId, this.obj[i].r).subscribe((result: any) => {
              this.tableArray1.push({
                Ord_Qty: result[0]?.Ord_Qty ?? null,
                PODate: result[0]?.PODate ?? null,
                PONO: result[0]?.PONo ?? null,
                rate: result[0]?.rate ?? null,
                supname: result[0]?.supname ?? null
              })
            })
          }
        })
      }
      else if (this.materialid && this.groupid) {
        this.service.rawgrp(this.LocationId, this.materialid, this.groupid).subscribe((result: any) => {
          this.tableArray = result
          for (let i = 0; i < this.tableArray.length; i++) {
            this.obj.push({
              r: this.tableArray[i].rawmatid
            })
          }
          for (let i = 0; i < this.tableArray.length; i++) {
            this.service.table(this.LocationId, this.obj[i].r).subscribe((result: any) => {
              this.tableArray1.push({
                Ord_Qty: result[0]?.Ord_Qty ?? null,
                PODate: result[0]?.PODate ?? null,
                PONO: result[0]?.PONo ?? null,
                rate: result[0]?.rate ?? null,
                supname: result[0]?.supname ?? null
              })
            })
          }
        })
      }
      else {
        if (this.deptid) {
          this.tableArray = []
          this.tableArray1 = []
          this.obj = []
          this.diffArray = []
          this.service.dept(this.LocationId, this.deptid).subscribe((result: any) => {
            this.tableArray = result
            for (let i = 0; i < this.tableArray.length; i++) {
              this.obj.push({
                r: this.tableArray[i].rawmatid,
                diff: String(this.datePipe.transform(this.tableArray[i].PRDate, 'dd-MM-yyyy') || ''),
                podate: this.tableArray[i].PODate
                  ? (this.tableArray[i].PODate).toISOString().replace("T", " ").replace("Z", "")
                  : null
              })
            }

            for (let i = 0; i < this.tableArray.length; i++) {
              this.service.table(this.LocationId, this.obj[i].r).subscribe((result: any) => {
                this.tableArray1.push({
                  Ord_Qty: result[0]?.Ord_Qty ?? null,
                  PODate: result[0]?.PODate ?? null,
                  PONO: result[0]?.PONo ?? null,
                  rate: result[0]?.rate ?? null,
                  supname: result[0]?.supname ?? null,
                })
              })
            }
          })
        }
        else if (this.materialid) {
          this.service.rawmat(this.LocationId, this.materialid).subscribe((result: any) => {
            this.tableArray = result
            for (let i = 0; i < this.tableArray.length; i++) {
              this.obj.push({
                r: this.tableArray[i].rawmatid
              })
            }
            for (let i = 0; i < this.tableArray.length; i++) {
              this.service.table(this.LocationId, this.obj[i].r).subscribe((result: any) => {
                this.tableArray1.push({
                  Ord_Qty: result[0]?.Ord_Qty ?? null,
                  PODate: result[0]?.PODate ?? null,
                  PONO: result[0]?.PONo ?? null,
                  rate: result[0]?.rate ?? null,
                  supname: result[0]?.supname ?? null
                })
              })
            }
          })
        }
        else if (this.groupid) {
          this.service.grouptable(this.LocationId, this.groupid).subscribe((result: any) => {
            this.tableArray = result
            for (let i = 0; i < this.tableArray.length; i++) {
              this.obj.push({
                r: this.tableArray[i].rawmatid
              })
            }
            for (let i = 0; i < this.tableArray.length; i++) {
              this.service.table(this.LocationId, this.obj[i].r).subscribe((result: any) => {
                this.tableArray1.push({
                  Ord_Qty: result[0]?.Ord_Qty ?? null,
                  PODate: result[0]?.PODate ?? null,
                  PONO: result[0]?.PONo ?? null,
                  rate: result[0]?.rate ?? null,
                  supname: result[0]?.supname ?? null
                })
              })
            }
          })
        }
        else {
          this.service.viewall(this.LocationId).subscribe((result: any) => {
            this.tableArray = result
            for (let i = 0; i < this.tableArray.length; i++) {
              this.obj.push({
                r: this.tableArray[i].rawmatid
              })
            }
            for (let i = 0; i < this.tableArray.length; i++) {
              this.service.table(this.LocationId, this.obj[i].r).subscribe((result: any) => {
                this.tableArray1.push({
                  Ord_Qty: result[0]?.Ord_Qty ?? null,
                  PODate: result[0]?.PODate ?? null,
                  PONO: result[0]?.PONo ?? null,
                  rate: result[0]?.rate ?? null,
                  supname: result[0]?.supname ?? null
                })
              })
            }
          })
        }
      }
    }
  }
  qty2Array: any[] = []
  diffArray: any[] = []
  view1() {
    this.qty1Array = []; 
    this.qty2Array = []; 
    let pendingRequests = this.tableArray.length; 
    for (let i = 0; i < this.tableArray.length; i++) {
      this.service.qty1(this.LocationId, this.tableArray[i].rawmatid, this.tableArray1[i].PODate).subscribe((result: any) => {
        const effedate = result[0]?.effedate ? new Date(result[0].effedate) : null;
        const effsdate = result[0]?.effsdate ? new Date(result[0].effsdate) : null;
        const qty1Data = {
          qty1: result[0]?.qty1 ?? null,
          effedate: effedate && !isNaN(effedate.getTime()) ? effedate.toISOString().replace("T", " ").replace("Z", " ") : null,
          effsdate: effsdate && !isNaN(effsdate.getTime()) ? effsdate.toISOString().replace("T", " ").replace("Z", " ") : null
        };
        this.qty1Array[i] = qty1Data;
        this.service.qty2(this.LocationId, this.tableArray[i].rawmatid, qty1Data.effsdate, qty1Data.effedate).subscribe((result: any) => {
          this.qty2Array[i] = {
            qty2: result[0]?.qty2 ?? null
          };
          pendingRequests--; 
          if (pendingRequests === 0) {
            this.combineData();
          }
        });
      });
    }
  }
  combineData() {
    this.combinedArray = this.tableArray.map((item, index) => ({
      ...item,                
      ...this.tableArray1[index],
      ...this.qty1Array[index],   
      ...this.qty2Array[index]    
    }));
  }
  mailArray: any[] = []
  sendMail() {
    for (let i = 0; i < this.selectedRows.length; i++) {
      this.mailArray.push({
        reason: this.selectedRows[i].reason,
        prid: this.selectedRows[i].prid,
        rawmatid: this.selectedRows[i].rawmatid,
        ApprovedQty: this.selectedRows[i].ApprovedQty,
        empname: this.selectedRows[i].empname,
        PR_Ref_No: this.selectedRows[i].PR_Ref_No,
        PRDate: this.selectedRows[i].PRDate,
        email: this.selectedRows[i].email,
        Locationid: this.LocationId
      })
    }
    this.Error = 'Are Sure to Send Mail?'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.service.mail(this.mailArray).subscribe((result: any) => {
          this.Error = result.message
          this.userHeader = 'Information'
          this.opendialog()
          this.clear()
        })
      }
    })
  }
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
  clear() {
    this.tableArray = []
    this.tableArray1 = []
    this.tableArray2 = []
    this.combinedArray = []
    this.rArray = []
    this.qty1Array = []
    this.obj = []
    this.selectedRows = [];
    this.isAllSelected = false;
    this.Error = '';
    this.userHeader = '';
    this.mailArray = []
    this.qty2Array = []
    this.diffArray = []
    this.deptid = null
    this.materialid = null
    this.groupid = null
    this.groupid1 = null
  }
}