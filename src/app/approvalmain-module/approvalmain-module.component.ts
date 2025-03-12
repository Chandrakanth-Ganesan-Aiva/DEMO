import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-approvalmain-module',
  templateUrl: './approvalmain-module.component.html',
  styleUrls: ['./approvalmain-module.component.scss']
})
export class ApprovalmainModuleComponent implements OnInit {
  LocationId:number=0
  Empid:number=0
  EmpName:string=''
  apiErrorMsg:string=''
  GRNWithoutbillentryAppr:boolean=false;
  RejectionWeighment:boolean=false
  WeighdelAppr:boolean=false
  GrnDelete:boolean=false
  GateEntryDelayAppr:boolean=false
  GRNWithoutbillentryApprId:number=213
  RejectionWeighmentId:number=394
  WeighdelApprId:number=534
  GrnDeleteId:number=201
  GateEntryDelayApprId:number=192
  constructor(private service: LoginService, private dialog: MatDialog) { }
  userRighitsData:any[]=new Array()
  ngOnInit(): void {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]

    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.EmpName = user.empname
 
    this.service.RighitsCheck(this.Empid, this.LocationId).subscribe({
      next: (data: any) => {
        if(data.length>=1){
        if (data[0].status == 'N') {
          this.Error=data[0].Msg
          this.userHeader='Error'
          this.opendialog()
        }
        this.userRighitsData = data
        this.userRighitsData.forEach(data => {
          const checkPermission = (moduleId: number): boolean =>
            parseInt(data.Menuid) === moduleId && (data.PowerUser === 'Y' || data.Status === 'Y');
          if (checkPermission(this.GRNWithoutbillentryApprId)) {
            this.GRNWithoutbillentryAppr = true;
          }
          if (checkPermission(this.RejectionWeighmentId)) {
            this.RejectionWeighment = true;
          }
          if (checkPermission(this.WeighdelApprId)) {
            this.WeighdelAppr = true;
          }
          if (checkPermission(this.GrnDeleteId)) {
            this.GrnDelete = true;
          }
          if (checkPermission(this.GateEntryDelayApprId)) {
            this.GateEntryDelayAppr = true;
          }
         
        });
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
