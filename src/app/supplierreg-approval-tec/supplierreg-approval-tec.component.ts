import { Component } from '@angular/core';
import { SupplierregApprovalTecService } from '../service/supplierreg-approval-tec.service';
import { DatePipe } from '@angular/common';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { error } from 'jquery';

@Component({
  selector: 'app-supplierreg-approval-tec',
  templateUrl: './supplierreg-approval-tec.component.html',
  styleUrl: './supplierreg-approval-tec.component.scss'
})
export class SupplierregApprovalTecComponent {
  constructor(private service: SupplierregApprovalTecService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.empid = user.empid
    this.load()
  }
  empid: number | null = null
  //
  loadArray: any[] = []
  tableArray: any[] = []
  selectedArray: any = []
  lastselectedArray: any[] = []
  inputArray: any[] = []
  load() {
    this.service.empid(this.empid).subscribe((result: any) => {
      this.loadArray = result
    })
    this.service.table().subscribe((result: any) => {
      this.tableArray = result
    })
  }
  select(event: any, row: any) {
    this.lastselectedArray = []
    this.inputArray = []
    this.approveArray = []
    if (event.target.checked) {
      this.selectedArray.push(row)
    }
    else {
      this.selectedArray = this.selectedArray.filter((item: any) => item !== row)
      this.partyid = null
      this.MachineryDetails = null
      this.Measuring = null
      this.Qs = null
      this.production = null
      this.quality = null
      this.others = null
      this.total = null
      this.weeklyHoliday = null
      this.workingHours = null
      this.shiftDetails = null
      this.shiftTimings = null
      this.exp_plan = null
      this.sanctioned_pow_Avl = null
      this.standBy_Power = null
    }
    if (this.selectedArray.length > 0) {
      this.lastselectedArray.push(this.selectedArray[this.selectedArray.length - 1])
      if (this.lastselectedArray.length > 0) {
        this.service.input(this.lastselectedArray[0].code).subscribe((result: any) => {
          this.inputArray = result
          this.partyid = this.inputArray[0].partyid
          this.MachineryDetails = this.inputArray[0].machdet
          this.Measuring = this.inputArray[0].measinst
          this.Qs = this.inputArray[0].manpowerqlty
          this.production = this.inputArray[0].manpowerprod
          this.quality = this.inputArray[0].manpowerqlty
          this.others = this.inputArray[0].manpowerothers
          this.total = this.inputArray[0].manpowertotal
          this.weeklyHoliday = this.inputArray[0].weeklyholiday
          this.workingHours = this.inputArray[0].workhours
          this.shiftDetails = this.inputArray[0].shiftdet
          this.shiftTimings = this.inputArray[0].shifttime
          this.exp_plan = this.inputArray[0].expansionplan
          this.sanctioned_pow_Avl = this.inputArray[0].sanctionedpower
          this.standBy_Power = this.inputArray[0].standbypower
        })
      }
    }
  }
  partyid: number | null = null
  MachineryDetails: string | null = null
  Measuring: string | null = null
  Qs: string | null = null
  production: string | null = null
  quality: string | null = null
  others: string | null = null
  total: string | null = null
  weeklyHoliday: string | null = null
  workingHours: string | null = null
  shiftDetails: string | null = null
  shiftTimings: string | null = null
  exp_plan: string | null = null
  sanctioned_pow_Avl: string | null = null
  standBy_Power: string | null = null
  approveArray: any[] = []
  approve() {
    if (this.selectedArray.length > 0) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      for (let i = 0; i < this.selectedArray.length; i++) {
        this.approveArray.push({
          empid: this.empid,
          today: formattedDate,
          partyid: this.selectedArray[i].partyid
        })
      }
      this.Error = 'Are you sure to Approve?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.service.approve(this.approveArray).subscribe((result: any) => {
            this.Error = result.message
            this.userHeader = 'Information'
            this.opendialog()
          })
        }
      })
    }
    else {
      this.Error = 'Select the Rows to Approve'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }

  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
  clear() {
    this.loadArray = []
    this.tableArray = []
    this.selectedArray = []
    this.lastselectedArray = []
    this.inputArray = []
    this.partyid = null
    this.MachineryDetails = null
    this.Measuring = null
    this.Qs = null
    this.production = null
    this.quality = null
    this.others = null
    this.total = null
    this.weeklyHoliday = null
    this.workingHours = null
    this.shiftDetails = null
    this.shiftTimings = null
    this.exp_plan = null
    this.sanctioned_pow_Avl = null
    this.standBy_Power = null
    this.approveArray = []
    this.Error = ''
    this.userHeader = ''
    this.load()
  }
}
