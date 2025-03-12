import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GrnWithoutBillEntryApprService } from '../service/grn-without-bill-entry-appr.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-grn-without-bill-entry-appr',
  templateUrl: './grn-without-bill-entry-appr.component.html',
  styleUrls: ['./grn-without-bill-entry-appr.component.scss']
})
export class GrnWithoutBillENtryApprComponent implements OnInit {
  CurrentDate = new Date();
  GrnForm!: FormGroup;
  Empid: number = 0
  LoactionId: number = 0
  selectedProducts!: any;
  items: any;
  apiErrorMsg: string = ''
  @ViewChild('apierrorDialog') apierrorDialog!: ElementRef
  @ViewChild('Savechild') Savechild!: ElementRef
  @ViewChild('ViewinTab') ViewinTab!: ElementRef
  constructor(private date: DatePipe, private spinner: NgxSpinnerService, private service: GrnWithoutBillEntryApprService, private fb: FormBuilder) { }
  ngOnInit(): void {

    this.GrnForm = this.fb.group({
      Date: new FormControl(''),
      EmpName: new FormControl('', Validators.required)
    })
    const data = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LoactionId = data[data.length - 1];
    const Emp = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = Emp.empid;
    this.GrnForm.controls['EmpName'].setValue(Emp.cusername);
  }
  TabViewMaterial: string = ''
  TabViewUOM: string = ''
  TabViewSupplier: string = ''
  ViewTabDet(Index: any) {
    this.TabViewMaterial = this.MaterialArr[Index].RawMatName
    this.TabViewUOM = this.MaterialArr[Index].uom
    this.TabViewSupplier = this.MaterialArr[Index].SupName
    this.ViewinTab.nativeElement.click()
  }
  MaterialArr: any[] = new Array()
  ViewTabel: boolean = false
  View() {
    if (this.GrnForm.invalid) {
      return;
    } else {
      this.service.material(this.LoactionId).subscribe({
        next: (res: any) => {
          if (res.length > 1) {
            this.ViewTabel = true
            this.MaterialArr = []
            for (let i = 0; i < res.length; i++) {
              this.MaterialArr.push({
                GrnNo: res[i].GrnNo,
                GRNID: res[i].GRNID,
                GRNDate: res[i].GRNDate,
                SupName: res[i].SupName,
                RawMatName: res[i].RawMatName,
                uom: res[i].uom,
                Gqty: res[i].Gqty,
                GRNBasicPrice: res[i].GRNBasicPrice,
                value: res[i].value,
                selected: false
              })
            }
            console.log(this.MaterialArr, 'this.MaterialArr');
          } else {
            this.ViewTabel = false
            this.apiErrorMsg = ''
            this.apiErrorMsg = 'No Records To Found'
            this.apierrorDialog.nativeElement.click()
          }
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
    } else {
      this.materialSelectedArr = []
      let allSelected = this.MaterialArr.every(item => item.selected);
      if (allSelected == true) {
        for (let i = 0; i < this.MaterialArr.length; i++) {
          this.materialSelectedArr.push({
            GRNId: this.MaterialArr[i].GRNID
          })
        }
        // console.log(this.materialSelectedArr, 'selectAll');
      } else {
        let selectedRecords = this.MaterialArr.filter(item => item.selected);
        for (let i = 0; i < selectedRecords.length; i++) {
          this.materialSelectedArr.push({
            GRNId: selectedRecords[i].GRNID
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
  }
  save: any
  Sts: string = '';
  Msg: string = '';
  SaveGrnid: number = 0
  UpdateGrn = {}
  getSave() {
    for (let i = 0; i < this.materialSelectedArr.length; i++) {
      this.UpdateGrn = {
        GRNId: this.materialSelectedArr[i].GRNId
      }
      if (this.save == 'Approve') {
        this.spinner.show()
        this.service.UpdateAppr(this.UpdateGrn).subscribe({
          next: (res: any) => {
            this.spinner.hide()
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
          }
        })

      }
      if (this.save == 'Reject') {
        this.service.UpdateReject(this.UpdateGrn).subscribe({
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
          }
        })
      }
    }
  }
  finalSave() {
    this.materialSelectedArr = []
    this.UpdateGrn = []
    this.View()
  }
  savetimeerror() {
    this.UpdateGrn = []
  }

  // serachvalue:string=''
  // Search(e:any) {
  //   this.serachvalue=e.target.value
  //   this.serachvalue=this.serachvalue.trim().toLowerCase();
  //   if (this.serachvalue) {
  //     this.MaterialArr = this.MaterialArr.filter(element =>
  //       element.SupName.toLowerCase().(this.serachvalue)
  //     );
  //   } else {
  //     for (let i = 0; i < this.MaterialArr.length; i++) {
  //       this.MaterialArr.push({
  //         SNo: i + 1,
  //         GrNo: this.MaterialArr[i].GrnNo,
  //         GrnDate: this.MaterialArr[i].GrnDate,
  //         Supplier: this.MaterialArr[i].SupName,
  //         SupplierId: this.MaterialArr[i].SupId,
  //         selected: false
  //       })
  //       console.log(this.MaterialArr,'er');
  //     }
  //   }
  // }
}
