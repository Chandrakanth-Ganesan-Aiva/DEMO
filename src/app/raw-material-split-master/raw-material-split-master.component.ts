import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RawMaterialSplitMasterService } from '../service/raw-material-split-master.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-raw-material-split-master',
  templateUrl: './raw-material-split-master.component.html',
  styleUrl: './raw-material-split-master.component.scss'
})
export class RawMaterialSplitMasterComponent implements OnInit,OnDestroy {
  RawMatSpliytForm!:FormGroup
  constructor(private service:RawMaterialSplitMasterService,private dialog:MatDialog){}
  ngOnInit() {
    this.service.Material().subscribe({next:(res:any)=>{
      console.log(res)
    }})
  }
  View(){
    this.service.Material().subscribe({next:(res:any)=>{
      console.log(res)
    }})
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

  ngOnDestroy(): void {
    this.dialog.closeAll()
   }
}
