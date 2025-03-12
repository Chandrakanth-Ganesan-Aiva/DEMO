import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeighmentRejApprService } from '../service/weighment-rej-appr.service';

@Component({
  selector: 'app-weighment-rej-appr',
  templateUrl: './weighment-rej-appr.component.html',
  styleUrls: ['./weighment-rej-appr.component.scss']
})
export class WeighmentRejApprComponent implements OnInit {
  RejForm!: FormGroup
  LoactionId: number = 0
  Empid: number = 0
  apiErrorMsg: string = ''
  @ViewChild('apierrorDialog') apierrorDialog!: ElementRef
  @ViewChild('Savechild') Savechild!: ElementRef
  @ViewChild('ViewinTab') ViewinTab!: ElementRef
  constructor(private date: DatePipe, private spinner: NgxSpinnerService, private service: WeighmentRejApprService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.RejForm = this.fb.group({
      Date: new FormControl(''),
      EmpName: new FormControl('', Validators.required)
    })
    const data = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LoactionId = data[data.length - 1];
    const Emp = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = Emp.empid;
    this.RejForm.controls['EmpName'].setValue(Emp.cusername);
  }
  TabViewGateEntryNo: string = ''
  TabViewUOM: string = ''
  TabViewNetwt: number = 0
  ViewTabDet(Index: any) {
    this.TabViewGateEntryNo = this.MaterialArr[Index].GateEntryNo
    this.TabViewUOM = this.MaterialArr[Index].uom
    this.TabViewNetwt = this.MaterialArr[Index].Netwt
    this.ViewinTab.nativeElement.click()
  }
  MaterialArr: any[] = new Array()
  ViewTabel: boolean = false
  View() {
    if (this.RejForm.invalid) {
      return;
    } else {
      this.service.WeighmnetDet().subscribe({
        next: (res: any) => {
          console.log(res);

          if (res.length > 1) {
            this.ViewTabel = true
            this.MaterialArr = []
            for (let i = 0; i < res.length; i++) {
              if (res[i].TareWeight == null) {
                res[i].TareWeight = 0
              }
              this.MaterialArr.push({
                Id: res[i].id,
                Tranno: res[i].tranno,
                Trandate: res[i].Trandate,
                SupName: res[i].supname,
                RawMatName: res[i].rawmatname,
                uom: res[i].uom,
                GateEntryNo: res[i].gateentryno,
                VchNo: res[i].vehno,
                LoadWght: res[i].loadedweight,
                TareWeight: res[i].TareWeight,
                Netwt: res[i].netwt,
                selected: false
              })
            }
            console.log(this.MaterialArr, 'this.MaterialArr');
          } else {
            this.ViewTabel = false
            this.apiErrorMsg = ''
            this.apiErrorMsg = 'No Rejection Weighment Records To Found'
            this.apierrorDialog.nativeElement.click()
          }
        },
        error: (err: any) => {
          this.apiErrorMsg = ''
          this.apiErrorMsg = err
          this.apierrorDialog.nativeElement.click()
        }
      })
    }
  }
  selectAll = false;
  SelectAll() {
    this.MaterialArr.forEach((item: any) => {
      item.selected = this.selectAll;
    });
  }
  RowSelect() {
    this.selectAll = this.MaterialArr.every((item: { selected: any; }) => item.selected);
  }
  materialSelectedArr: any[] = new Array()
  saveVaildation(e: any) {
    const selectedRecords = this.MaterialArr.filter(item => item.selected);
    if (selectedRecords.length == 0) {
      this.apiErrorMsg = '';
      this.apiErrorMsg = 'Please select at least one record';
      this.apierrorDialog.nativeElement.click();
      return;
    }
    else {
      this.materialSelectedArr = []
      let allSelected = this.MaterialArr.every(item => item.selected);
      if (allSelected == true) {
        for (let i = 0; i < this.MaterialArr.length; i++) {
          this.materialSelectedArr.push({
            Lognid: this.Empid,
            Id: this.MaterialArr[i].Id,
            TareWeight: this.MaterialArr[i].TareWeight
          })
        }
        // console.log(this.materialSelectedArr, 'selectAll');
      } else {
        let selectedRecords = this.MaterialArr.filter(item => item.selected);
        for (let i = 0; i < selectedRecords.length; i++) {
          this.materialSelectedArr.push({
            Lognid: this.Empid,
            Id: selectedRecords[i].Id,
            TareWeight: this.MaterialArr[i].TareWeight
          })
        }
      }
      if (e.target.innerText == 'Approve') {
        this.save = 'Approve';
        console.log(this.save);
        this.Savechild.nativeElement.click();
        return;
      }
      if (e.target.innerText == 'Reject') {
        this.save = 'Reject';
        console.log(this.save);
        this.Savechild.nativeElement.click();
        return;
      }
    }
    console.log(this.materialSelectedArr, 'saverecord');
  }
  save: string = ''
  Sts: string = ''
  Msg: string = ''
  UpdateWeighment = {}
  getSave() {
    if (this.save == 'Approve') {
      this.UpdateWeighment = {}
      for (let i = 0; i < this.materialSelectedArr.length; i++) {
        this.UpdateWeighment = {
          Lognid: this.materialSelectedArr[i].Lognid,
          TareWeight: this.materialSelectedArr[i].TareWeight,
          Id: this.materialSelectedArr[i].Id
        }
        console.log(this.UpdateWeighment, 'save');
        this.service.UpdateAppr(this.UpdateWeighment).subscribe({
          next: (res: any) => {
            if (res[0].status == 'N') {
              this.apiErrorMsg = '';
              this.apiErrorMsg = res.Msg
              this.apierrorDialog.nativeElement.click()
            }
            this.Sts = res[0].status
            this.Msg = res[0].Msg
            if (this.Sts === 'Y') {
              const Save = document.getElementById('Save') as HTMLInputElement
              Save.click()
            } else {
              const Save = document.getElementById('Save') as HTMLInputElement
              Save.click()
              return;
            }
          },
          error: (err: any) => {
            this.apiErrorMsg = '';
            this.apiErrorMsg = err.Msg
            this.apierrorDialog.nativeElement.click()
          }
        })
      }
    }
    if (this.save == 'Reject') {
      this.UpdateWeighment = {}
      for (let i = 0; i < this.materialSelectedArr.length; i++) {
        this.UpdateWeighment = {
          Lognid: this.materialSelectedArr[i].Lognid,
          Id: this.materialSelectedArr[i].Id
        }

        console.log(this.UpdateWeighment, 'save');
        this.service.UpdateRej(this.UpdateWeighment).subscribe({
          next: (res: any) => {
            if (res[0].status == 'N') {
              this.apiErrorMsg = '';
              this.apiErrorMsg = res.Msg
              this.apierrorDialog.nativeElement.click()
            }
            this.Sts = res[0].status
            this.Msg = res[0].Msg
            if (this.Sts === 'Y') {
              const Save = document.getElementById('Save') as HTMLInputElement
              Save.click()
            } else {
              const Save = document.getElementById('Save') as HTMLInputElement
              Save.click()
              return;
            }
          },
          error: (err: any) => {
            this.apiErrorMsg = '';
            this.apiErrorMsg = err.Msg
            this.apierrorDialog.nativeElement.click()
          }
        })
      }
    }
  }
  finalSave() {
    this.View()
    this.UpdateWeighment = []
    this.materialSelectedArr=[]
  }
  savetimeerror() {
    this.UpdateWeighment = []

  }
}
