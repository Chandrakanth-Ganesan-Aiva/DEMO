import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IndentEntryService } from '../service/indent-entry.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { data } from 'jquery';
import { style } from '@angular/animations';
import { PurchaseRequestService } from '../service/purchase-request.service';

@Component({
  selector: 'app-indent-entry',
  templateUrl: './indent-entry.component.html',
  styleUrls: ['./indent-entry.component.scss'],
})
export class IndentEntryComponent implements OnInit {
  indentForm!: FormGroup;
  StoreReqFrom!: FormGroup;
  currentDate = new Date();
  LoactionId: number = 0;
  Empid: number = 0;
  apiErrorMsg: any
  srtype: number = 1;
  Empname: number = 0
  constructor(
    private date: DatePipe,
    private service: IndentEntryService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,

  ) { }
  @ViewChild('apierrorDialog') apierrorDialog!: ElementRef;
  @ViewChild('StoreRelease') StoreRelease!: ElementRef;
  @ViewChild('closeButton') closeButton!: ElementRef;
  @ViewChild('ViewinTab') ViewinTab!: ElementRef

  ngOnInit(): void {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1];
    // console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid;
    this.Empname = user.cusername;
    this.indentForm = this.fb.group({
      indentNo: new FormControl('', Validators.required),
      Date: new FormControl(this.date.transform(this.currentDate, 'yyyy-MM-dd'), Validators.required),
      dept: new FormControl('', Validators.required),
      deptname: new FormControl(''),
      category: new FormControl('', Validators.required),
      categoryid: new FormControl(''),
      Approved: new FormControl('', Validators.required),
      Approvedid: new FormControl(''),
      indenttype: new FormControl('', Validators.required),
      desc: new FormControl(''),
      frmdate: new FormControl('', Validators.required),
      todate: new FormControl('', Validators.required),
    });
    this.indentForm.controls['Date'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'));
    this.indentForm.controls['indenttype'].setValue('Regular');
    this.getpath();
    this.indentForm.controls['indenttype'].valueChanges.subscribe((res) => {
      if (res == 'Regular') {
        this.srtype = 1;
      } else if (res == 'Capex') {
        this.srtype = 2;
      } else {
        return;
      }
    });
    this.StoreReqFrom = this.fb.group({
      dept: new FormControl('', Validators.required),
      deptid: new FormControl(''),
      material: new FormControl('', Validators.required),
      Empname: new FormControl('', Validators.required),
      EmpId: new FormControl(''),
      refno: new FormControl('', Validators.required),
      SrRefno: new FormControl('')
    });
    this.indentForm.controls['frmdate'].setValue(
      this.date.transform(this.currentDate, 'yyyy-MM-dd')
    );
    this.indentForm.controls['todate'].setValue(
      this.date.transform(this.currentDate, 'yyyy-MM-dd')
    );
  }
  indentPath: string = '';

  getpath() {

    // this.LoactionId=324324234
    this.service.Indentpath(this.LoactionId).subscribe({
      next: (data: any) => {
        console.log(data, 'path');
        if (data.length > 0) {
          if (data[0].status === 'N') {
            this.apiErrorMsg = '';
            this.apiErrorMsg = data[0].Msg;
            this.apierrorDialog.nativeElement.click();
            return;
          }
          this.indentPath = data[0].prefix + data[0].prefixseperator + data[0].compshort + data[0].prefixseperator + data[0].yeardisplay + data[0].prefixseperator;
          this.GetPathNo()
        }
      },
      error: (error: any) => {
        this.apiErrorMsg = '';
        this.apiErrorMsg = error;
        this.apierrorDialog.nativeElement.click();
        return;
      },

    });
  }
GetPathNo(){
  this.service.IndentTrano(this.indentPath).subscribe({
    next: (res: any) => {
      // console.log(res, 'pathTranno');
      if (res.length > 0) {
        if (res[0].status === 'N') {
          this.apiErrorMsg = '';
          this.apiErrorMsg = res[0].Msg;
          this.apierrorDialog.nativeElement.click();
          return;
        }
        this.indentForm.controls['indentNo'].setValue(
          this.indentPath + res[0].TranNo
        );
        this.getdept()
      }
    },
    error: (error: any) => {
      this.apiErrorMsg = '';
      this.apiErrorMsg = error;
      this.apierrorDialog.nativeElement.click();
    },
  });
}


  frmdate(e: any) {
    this.indentForm.controls['frmdate'].setValue(e.target.value)
    this.getdept();
  }
  deptdata: any[] = new Array();
  getdept() {
    this.service.Dept(this.LoactionId, this.indentForm.controls['Date'].value, this.indentForm.controls['frmdate'].value, this.indentForm.controls['todate'].value).subscribe({
      next: (res: any) => {
        this.deptdata = res
        // console.log(this.deptdata, 'dept');
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.apiErrorMsg = '';
            this.apiErrorMsg = res[0].Msg;
            this.apierrorDialog.nativeElement.click();
            return;
          }
        }
      },
      error: (error: any) => {
        this.apiErrorMsg = '';
        this.apiErrorMsg = error;
        this.apierrorDialog.nativeElement.click();
        return;
      },
    });
  }
  deptevent(e: any) {
    this.indentForm.controls['dept'].setValue(e)
    this.deptdata.filter(res => {
      if (parseInt(this.indentForm.controls['dept'].value) === parseInt(res.DeptId)) {
        let deptname = res.DeptName
        this.indentForm.controls['deptname'].setValue(deptname)
        // console.log(this.indentForm.controls['deptname'].value);

      }
      this.indentForm.controls['category'].setValue('')
      this.indentForm.controls['Approved'].setValue('')
    })
    if (parseInt(this.indentForm.controls['dept'].value) > 0) {
      this.getCategory();
    }
  }
  getCategory() {
    this.service.Category(this.Empid, this.LoactionId).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          // console.log(data, 'category');
          if (data[0].status == 'N') {
            this.apiErrorMsg = '';
            this.apiErrorMsg = data[0].Msg;
            this.apierrorDialog.nativeElement.click();
            return;
          }
          this.indentForm.controls['category'].setValue(data[0].Category);
          this.indentForm.controls['categoryid'].setValue(data[0].CatId);
        }
      },
      complete: () => {
        this.getApproved();
      },
    });
  }
  appr: any[] = new Array();
  getApproved() {
    this.service.Approvedby(this.LoactionId, this.indentForm.controls['dept'].value).subscribe({
      next: (res: any) => {
        this.appr = res;
        // console.log(this.appr);
        if (res.length > 0) {
          // console.log(res, 'approved');
          if (res[0].status == 'N') {
            this.apiErrorMsg = '';
            this.apiErrorMsg = res[0].Msg;
            this.apierrorDialog.nativeElement.click();
            return;
          }
          if (res.length === 1) {
            this.indentForm.controls['Approved'].setValue(res[0].ApprovedBy);
            this.indentForm.controls['Approvedid'].setValue(res[0].ApprovedById);
          }
        }
      },
      error: (err) => {
        this.apiErrorMsg = '';
        this.apiErrorMsg = err;
        this.apierrorDialog.nativeElement.click();
      },
    });
  }
  ApprovedbyEvent(e:any){
    this.indentForm.controls['Approvedid'].setValue(e);
    console.log(this.indentForm.controls['Approvedid'].value);

  }
  ViewStoreReq: any;
  onSubmit() {
    this.ViewStoreReq = true;
    if (this.indentForm.invalid) {
      return;
    } else {
      this.StoreRelease.nativeElement.click();
      this.StoreReqFrom.controls['dept'].setValue(this.indentForm.controls['deptname'].value);
      this.StoreReqFrom.controls['deptid'].setValue(this.indentForm.controls['dept'].value);
      this.indentForm.disable()
      this.getRefno()

    }
  }
  RefnoArr: any[] = new Array()
  getRefno() {
    this.service.SrRefNo(this.LoactionId, this.indentForm.controls['frmdate'].value, this.indentForm.controls['todate'].value,
      this.StoreReqFrom.controls['deptid'].value).subscribe({
        next: (res: any) => {
          this.RefnoArr = res
          console.log(this.RefnoArr, 'Refnoarr');
          if (this.RefnoArr.length > 0) {
            if (res[0].status == 'N') {
              this.apiErrorMsg = '';
              this.apiErrorMsg = res[0].Msg;
              this.apierrorDialog.nativeElement.click();
              return;
            }
          }
          if (this.RefnoArr.length === 1) {
            this.StoreReqFrom.controls['refno'].setValue(this.RefnoArr[0].SrNo)
            this.StoreReqFrom.controls['SrRefno'].setValue(this.RefnoArr[0].Sr_Ref_No)
            this.StoreReqFrom.controls['Empname'].setValue(this.RefnoArr[0].Empname)
            this.StoreReqFrom.controls['EmpId'].setValue(this.RefnoArr[0].Empid)
            this.getRawmat()
          }
        },
        error: (err) => {
          this.apiErrorMsg = '';
          this.apiErrorMsg = err;
          this.apierrorDialog.nativeElement.click();
        },
        complete: () => { },
      })
  }
  refNoeEnent(e: any) {
    if (e.target.value > 0) {
      this.RefnoArr.filter(res => {
        if (res.SrNo == e.target.value) {
          console.log(res.Empname,res.Empid);
          this.StoreReqFrom.controls['SrRefno'].setValue(res.Sr_Ref_No)
          this.StoreReqFrom.controls['Empname'].setValue(res.Empname)
          this.StoreReqFrom.controls['EmpId'].setValue(res.Empid)
        }
      })
    }
    this.StoreReqFrom.controls['material'].setValue('')
    if (this.MainTabelRelease.length == 0) {
      this.getRawmat()
    }
    if (this.MainTabelRelease.length > 0) {
      for (let j = 0; j < this.MainTabelRelease.length; j++) {
        for (let i = 0; i < this.viewStoreData.length; i++) {
          console.log(parseInt(this.MainTabelRelease[j].RawMatId), parseInt(this.viewStoreData[i].RawMatId));
          if (parseInt(this.MainTabelRelease[j].RawMatId) === parseInt(this.viewStoreData[i].RawMatId)) {
            const RawMaterialiD = [parseInt(this.MainTabelRelease[j].RawMatId)]
            console.log(RawMaterialiD);
            this.Rawmateriladata = this.Rawmateriladata.filter((item: any) => !RawMaterialiD.includes(item.RawMatId));
            console.log(this.Rawmateriladata, ' this.Rawmateriladata');
          } else {
            this.getRawmat()
          }
        }
      }
    }
  }
  Rawmatid: any;
  Rawmateriladata: any = new Array
  Rawmaterial: any
  getRawmat() {
    this.service.Material(this.LoactionId, this.indentForm.controls['dept'].value, this.StoreReqFrom.controls['SrRefno'].value).subscribe({
      next: (res: any) => {
        this.Rawmaterial = res;
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.apiErrorMsg = '';
            this.apiErrorMsg = res.Msg;
            this.apierrorDialog.nativeElement.click();
          }
          this.Rawmateriladata = []
          for (let i = 0; i < this.Rawmaterial.length; i++) {
            this.Rawmateriladata.push({
              Rawmatname: this.Rawmaterial[i].rawmatname,
              RawMatId: this.Rawmaterial[i].RawMatID
            })
          }
          if (this.MainTabelRelease.length > 0) {
            for (let j = 0; j < this.MainTabelRelease.length; j++) {
              for (let i = 0; i < this.viewStoreData.length; i++) {
                console.log(parseInt(this.MainTabelRelease[j].RawMatId), parseInt(this.viewStoreData[i].RawMatId));
                if (parseInt(this.MainTabelRelease[j].RawMatId) === parseInt(this.viewStoreData[i].RawMatId)) {
                  const RawMaterialiD = [parseInt(this.MainTabelRelease[j].RawMatId)]
                  console.log(RawMaterialiD);
                  this.Rawmateriladata = this.Rawmateriladata.filter((item: any) => !RawMaterialiD.includes(item.RawMatId));
                  console.log(this.Rawmateriladata, ' this.Rawmateriladata');
                }
              }
            }
          }
          console.log(this.Rawmateriladata, 'mat');
        }
      },
      error: (err) => {
        this.apiErrorMsg = '';
        this.apiErrorMsg = err;
        this.apierrorDialog.nativeElement.click();
      },
    });
  }
  materialevent(e: any) {
    this.Rawmatid = e
    console.log(this.Rawmatid, 'this.Rawmatid')
    if (this.Rawmatid > 0) {
      this.StoreReqFrom.controls['material'].disable()
      this.StoreReqFrom.controls['refno'].disable()
      if (this.viewStoreData.length > 0) {
        let matadd = 0
        for (let i = 0; i < this.viewStoreData.length; i++) {
          if (this.viewStoreData[i].RawMatId == this.Rawmatid) {
            matadd = 1;
            this.Error = 2
            this.apiErrorMsg = '';
            this.apiErrorMsg = ''+this.viewStoreData[i].gStrMatDisp+ ' .This Material Is Already Added to The Tabel Please Select Another Material';
            this.StoreReqFrom.controls['material'].enable()
            this.StoreReqFrom.controls['refno'].enable()
            this.apierrorDialog.nativeElement.click();
            return;
          }
        }
        if (matadd != 1) {
          this.ViewStore();
        }
      } else {
        this.ViewStore();
      }
    } else {
      this.StoreReqFrom.controls['material'].enable()
      this.StoreReqFrom.controls['refno'].enable()
    }
  }

  Cuurentqtyvaild(e: any, Index: number) {
    // console.log(Index);


    if (parseInt(this.viewStoreData[Index].Currqty) == undefined || parseInt(this.viewStoreData[Index].Currqty) == 0 || this.viewStoreData[Index].Currqty === '' || this.viewStoreData[Index].Currqty === null) {
      this.Error = 2
      this.apiErrorMsg = ''
      e.target.value = ''
      this.viewStoreData[Index].Currqty = ''
      this.apiErrorMsg = 'Qty is Required for ' + this.viewStoreData[Index].gStrMatDisp + ' ';
      this.apierrorDialog.nativeElement.click();
      return
    }
    else if (parseInt(this.viewStoreData[Index].Currqty) > this.viewStoreData[Index].Pen_Qty) {
      this.Error = 3
      this.apiErrorMsg = ''
      this.apiErrorMsg = 'Quantity cannot be greater than Pending quantity,' + this.viewStoreData[Index].gStrMatDisp + ',For Pending Qty Is ' + '\n' + '' + this.viewStoreData[Index].Pen_Qty + ',You Will Entered as ' + this.viewStoreData[Index].Currqty + '';
      this.apiErrorMsg.split(',').join('\n')
      this.viewStoreData[Index].Currqty = ''
      e.target.value = ''
      this.apierrorDialog.nativeElement.click();
      return;
    }
  }

  viewStoreData: any[] = new Array()
  Tabeldata: any[] = new Array()
  POpendiongArr: any[] = new Array()
  ViewStore() {
    this.spinner.show()
    console.log(this.StoreReqFrom.controls['EmpId'].value, 'em');

    this.service.ViewStoreRelease(this.LoactionId, this.srtype, this.indentForm.controls['frmdate'].value, this.indentForm.controls['todate'].value,
      this.StoreReqFrom.controls['deptid'].value, this.StoreReqFrom.controls['EmpId'].value, this.Rawmatid, this.StoreReqFrom.controls['SrRefno'].value).subscribe({
        next: (res: any) => {
          this.Tabeldata = res
          // console.log(res, 'Tabel');
          this.spinner.hide()
          if (res.length > 0) {
            if (res[0].status === 'N') {
              this.apiErrorMsg = '';
              this.apiErrorMsg = res[0].Msg;
              this.apierrorDialog.nativeElement.click();
              return;
            }
            this.spinner.show()
            this.service.PoPendingQty(this.LoactionId, this.Rawmatid).subscribe({
              next: (data: any) => {
                this.POpendiongArr = data
                // console.log(data, 'po pending qty');
                this.spinner.hide()
                if (data.length > 0) {
                  if (data[0].status === 'N') {
                    this.apiErrorMsg = '';
                    this.apiErrorMsg = data[0].Msg;
                    this.apierrorDialog.nativeElement.click();
                    return;
                  }
                  for (let i = 0; i < this.Tabeldata.length; i++) {
                    for (let j = 0; j < this.POpendiongArr.length; j++) {
                      let Iss_Qty = this.Tabeldata[i].minqty + this.Tabeldata[i].prqty
                      let Pen_Qty = this.Tabeldata[i].srqty - this.Tabeldata[i].minqty + this.Tabeldata[i].prqty
                      if (this.Tabeldata[i].priority === 1) {
                        this.priority = 'Low'
                      } else if (this.Tabeldata[i].priority === 2) {
                        this.priority = 'Medium'
                      } else {
                        this.priority = 'High'
                      }
                      if (this.LoactionId === 1) {
                        this.minlevel = this.Tabeldata[i].minlevel
                        this.maxlevel = this.Tabeldata[i].maxlevel
                        this.reorderlevel = this.Tabeldata[i].reorder_level
                      } else if (this.LoactionId === 2) {
                        this.minlevel = this.Tabeldata[i].minlevel2
                        this.maxlevel = this.Tabeldata[i].maxlevel2
                        this.reorderlevel = this.Tabeldata[i].reorder_leve2
                      } else if (this.LoactionId === 3) {
                        this.minlevel = this.Tabeldata[i].minlevel3
                        this.maxlevel = this.Tabeldata[i].maxlevel3
                        this.reorderlevel = this.Tabeldata[i].reorder_level3
                      } else {
                        this.minlevel = this.Tabeldata[i].minlevel6
                        this.maxlevel = this.Tabeldata[i].maxlevel6
                        this.reorderlevel = this.Tabeldata[i].reorder_level6
                      }
                      this.viewStoreData.push({
                        Sr_Ref_No: this.Tabeldata[i].Sr_Ref_No,
                        SRDate: this.Tabeldata[i].SRDate,
                        RawMatId: this.Tabeldata[i].RawMatID,
                        gStrMatDisp: this.Tabeldata[i].gStrMatDisp,
                        srqty: this.Tabeldata[i].srqty,
                        SRUom: this.Tabeldata[i].SRUom,
                        Iss_Qty: Iss_Qty,
                        Pen_Qty: Pen_Qty,
                        rstock: this.Tabeldata[i].rstock,
                        Pend_PO_Qty: this.POpendiongArr[j].bal,
                        min_level: this.minlevel,
                        max_level: this.maxlevel,
                        reorder_level: this.reorderlevel,
                        priorityname: this.priority,
                        priority: this.Tabeldata[i].priority,
                        Desc: this.indentForm.controls['desc'].value,
                        Spec: this.Tabeldata[i].descrip,
                        capexno: this.Tabeldata[i].capexno,
                        SRId: this.Tabeldata[i].SRId,
                        Empid: this.StoreReqFrom.controls['EmpId'].value
                      })
                    }
                    this.service.UpateRecords(this.Tabeldata[i].SRId).subscribe({
                      next: (res: any) => {
                        console.log(res, 'rs');

                        if (res.length > 0) {
                          if (res[0].status == 'N') {
                            this.apiErrorMsg = '';
                            this.apiErrorMsg = res[0].Msg;
                            this.apierrorDialog.nativeElement.click();
                            return;
                          }
                          for (let k = 0; k < res.length; k++) {
                            this.updateRecords.push({
                              SRID: res[k].SRID,
                              Srchid: res[k].SRSchID,
                              SrchDate: res[k].SrScheduleDate,
                              scscheduleqty: res[k].scscheduleqty
                            })
                          }
                        }

                      }
                    })
                  }
                  for (let i = 0; i < this.viewStoreData.length; i++) {
                    if (parseInt(this.Rawmatid) === parseInt(this.viewStoreData[i].RawMatId)) {
                      const RawMaterialiD = [parseInt(this.viewStoreData[i].RawMatId)]
                      this.Rawmateriladata = this.Rawmateriladata.filter((item: any) => !RawMaterialiD.includes(item.RawMatId));
                    }
                  }
                }
              }
            })
            console.log(this.viewStoreData, 'viewStoreData');
          } else {
            this.Error = 2
            this.apiErrorMsg = 'No Records To Found';
            this.StoreReqFrom.controls['material'].enable()
            this.StoreReqFrom.controls['refno'].enable()
            this.apierrorDialog.nativeElement.click();
          }
        },
      });

  }
  updateRecords: any[] = new Array()
  ReleaseSinglemat: any[] = new Array()
  Releasebtndis: any
  Currqtydis: any
  Releasestore(Index: number) {
    if (this.viewStoreData.length > 0) {
      if (this.viewStoreData[Index].Currqty > 0) {
        // this.viewStoreData[Index].rstock=10
        // if(parseInt(this.viewStoreData[Index].rstock) > parseInt(this.viewStoreData[Index].max_level)){
        //   this.Error = 3
        //   this.apiErrorMsg = ''
        //   this.apiErrorMsg = 'For This Material : ' + '' + this.viewStoreData[Index].gStrMatDisp + '.Availabel Stock is Greater Than The Maxmium Stock Please Cross Verfiy Before Convert An Indent Entry';
        //   this.apierrorDialog.nativeElement.click();
        //   this.viewStoreData[Index].Releasebtndis = false
        //   this.viewStoreData[Index].Currqtydis = false
        // }
        if (parseInt(this.viewStoreData[Index].Currqty) > parseInt(this.viewStoreData[Index].Pen_Qty)) {
          this.Error = 3
          this.apiErrorMsg = ''
          this.apiErrorMsg = 'Quantity cannot be greater than Pending quantity ' + '' + ',' + this.viewStoreData[Index].gStrMatDisp + '.For Pending Qty Is ' + '\n' + '' + this.viewStoreData[Index].Pen_Qty + '.You Will Entered as. ' + this.viewStoreData[Index].Currqty + '';
          this.viewStoreData[Index].Currqty = ''
          this.apierrorDialog.nativeElement.click();
          return;
        } else {
          this.ReleaseSinglemat.push({
            Sr_Ref_No: this.viewStoreData[Index].Sr_Ref_No,
            SRDate: this.viewStoreData[Index].SRDate,
            RawMatId: this.viewStoreData[Index].RawMatId,
            gStrMatDisp: this.viewStoreData[Index].gStrMatDisp,
            srqty: this.viewStoreData[Index].srqty,
            SRUom: this.viewStoreData[Index].SRUom,
            Iss_Qty: this.viewStoreData[Index].Iss_Qty,
            Pen_Qty: this.viewStoreData[Index].Pen_Qty,
            Currqty: this.viewStoreData[Index].Currqty,
            rstock: this.viewStoreData[Index].rstock,
            Pend_PO_Qty: this.viewStoreData[Index].Pend_PO_Qty,
            min_level: this.viewStoreData[Index].min_level,
            max_level: this.viewStoreData[Index].max_level,
            reorder_level: this.viewStoreData[Index].reorder_level,
            priorityname: this.viewStoreData[Index].priorityname,
            priority: this.viewStoreData[Index].priority,
            Desc: this.viewStoreData[Index].Desc,
            Spec: this.viewStoreData[Index].Spec,
            capexno: this.viewStoreData[Index].capexno,
            SRId: this.viewStoreData[Index].SRId,
            Empid: this.viewStoreData[Index].Empid
          })
          this.viewStoreData[Index].Releasebtndis = true
          this.viewStoreData[Index].Currqtydis = true
          this.StoreReqFrom.controls['material'].enable()
          this.StoreReqFrom.controls['material'].setValue('')
        }
        console.log(this.ReleaseSinglemat,'a');

      } else {
        this.Error = 2
        this.apiErrorMsg = ''
        this.viewStoreData[Index].Currqty = ''
        this.apiErrorMsg = 'Qty is Required for ' + this.viewStoreData[Index].gStrMatDisp + ' ';
        this.apierrorDialog.nativeElement.click();
        return
      }
    }
    if (this.Rawmateriladata.length === 0) {
      this.StoreReqFrom.controls['refno'].enable()
    }

  }

  minlevel: number = 0
  maxlevel: number = 0
  reorderlevel: number = 0
  priority: string = ''
  Spec: string = ''
  Error: number = 0
  QtyVaildation() {
    this.Error = 2
    this.StoreRelease.nativeElement.click();
  }
  Releasebtn: any;
  Currqty: number = 0
  MainTabelRelease: any[] = new Array()
  MaintabelShow: boolean = false

  Release() {
    for (let i = 0; i < this.viewStoreData.length; i++) {
      if (this.viewStoreData[i].Currqty == '' || this.viewStoreData[i].Currqty == 0 || this.viewStoreData[i].Currqty == null || this.viewStoreData[i].Currqty == undefined) {
        this.Error = 2
        this.apiErrorMsg = ''
        this.apiErrorMsg = 'Qty is Required for ' + this.viewStoreData[i].gStrMatDisp + ' ';
        this.apierrorDialog.nativeElement.click();
        return
      }
    }
    if (this.ReleaseSinglemat.length > 0) {
      this.MaintabelShow = true
      this.MainTabelRelease = []
      for (let i = 0; i < this.ReleaseSinglemat.length; i++) {
        this.MainTabelRelease.push({
          gStrMatDisp: this.ReleaseSinglemat[i].gStrMatDisp,
          RawMatId: this.ReleaseSinglemat[i].RawMatId,
          SRUom: this.ReleaseSinglemat[i].SRUom,
          Currqty: this.ReleaseSinglemat[i].Currqty,
          rstock: this.ReleaseSinglemat[i].rstock,
          min_level: this.ReleaseSinglemat[i].min_level,
          max_level: this.ReleaseSinglemat[i].max_level,
          reorder_level: this.ReleaseSinglemat[i].reorder_level,
          Spec: this.ReleaseSinglemat[i].Spec,
          Desc: this.ReleaseSinglemat[i].Desc,
          priorityname: this.ReleaseSinglemat[i].priorityname,
          priority: this.ReleaseSinglemat[i].priority,
          capexno: this.ReleaseSinglemat[i].capexno,
          SRId: this.ReleaseSinglemat[i].SRId,
          Empid: this.ReleaseSinglemat[i].Empid,
        })
      }
      console.log(this.MainTabelRelease, 'MainTabelRelease');
      this.closeButton.nativeElement.click();
    } else {
      this.Error = 2
      this.apiErrorMsg = 'At least Add One Material For Release';
      this.StoreReqFrom.controls['material'].enable()
      this.apierrorDialog.nativeElement.click();
    }

  }



  Clear() {
    this.service.Material(this.LoactionId, this.indentForm.controls['dept'].value, this.StoreReqFrom.controls['SrRefno'].value).subscribe({
      next: (res: any) => {
      }
    })
    this.StoreReqFrom.controls['refno'].setValue('')
    this.StoreReqFrom.controls['material'].setValue('')
    this.indentForm.controls['frmdate'].setValue(this.indentForm.controls['Date'].value)
    this.StoreReqFrom.enable()
    this.viewStoreData = []
    this.MainTabelRelease = []
    this.ReleaseSinglemat = []
    console.log(this.Rawmateriladata);

  }
  UpdateEntry: any[] = new Array()
  Msg: String = ''
  Sts: string = ''
  IndentEntry: any[] = new Array()
  Qty: number = 0
  SrchQty: number = 0
  IndentEntrySch: any[] = new Array()
  Save() {
    this.getpath();
    this.UpdateEntry = []
    this.IndentEntry = []
    this.IndentEntrySch = []
    for (let i = 0; i < this.MainTabelRelease.length; i++) {
      this.IndentEntry.push({
        RawmatID: this.MainTabelRelease[i].RawMatId,
        PRQty: this.MainTabelRelease[i].Currqty,
        PRUom: this.MainTabelRelease[i].SRUom,
        MaterialDesc: this.MainTabelRelease[i].Desc,
        MaterialSpec: this.MainTabelRelease[i].Spec,
        SRID: this.MainTabelRelease[i].SRId,
        DescRemark: this.MainTabelRelease[i].Desc,
        priority: this.MainTabelRelease[i].priority,
        capexno: this.MainTabelRelease[i].capexno,
        capexnumber: '',
        capexattach: '',
      })
    }
    console.log(this.MainTabelRelease,this.updateRecords);

    for (let i = 0; i < this.MainTabelRelease.length; i++) {
      this.updateRecords.forEach(res => {
        if (res.SRID === this.MainTabelRelease[i].SRId) {
          if (this.MainTabelRelease[i].Currqty <= res.scscheduleqty && res.scscheduleqty > 0) {
            this.SrchQty = this.MainTabelRelease[i].Currqty
            this.IndentEntrySch.push({
              SChdate: res.SrchDate,
              SchQty: this.SrchQty,
              Srchid: res.Srchid,
              RawmatID: this.MainTabelRelease[i].RawMatId
            })
            this.SrchQty = this.SrchQty - this.SrchQty
          }
          if (this.MainTabelRelease[i].Currqty > res.scscheduleqty && res.scscheduleqty > 0) {
            this.IndentEntrySch.push({
              SChdate: res.SrchDate,
              SchQty: res.scscheduleqty,
              Srchid: res.Srchid,
              RawmatID: this.MainTabelRelease[i].RawMatId
            })
            this.SrchQty = this.SrchQty - res.scscheduleqty
          }
        }
      })
    }
    console.log(this.IndentEntrySch, ' this.IndentEntry');
    this.UpdateEntry.push({
      PR_Ref_No: this.indentForm.controls['indentNo'].value,
      DeptID: this.indentForm.controls['dept'].value,
      EmpID: this.Empid,
      ApprovalBy: this.indentForm.controls['Approvedid'].value,
      PRDesc: this.indentForm.controls['desc'].value,
      PrNewType: this.srtype,
      CostCenterID: 13,
      LocationId: this.LoactionId,
      LoginEmpId: this.Empid,
      IndentEntry: this.IndentEntry,
      IndentEntrySch: this.IndentEntrySch
    })
    console.log(this.UpdateEntry, 'saveArr');

    this.service.Update(this.UpdateEntry).subscribe({
      next: (res: any) => {
        console.log(res, 'indentEntry');
        this.Sts = res[0].status;
        this.Msg = res[0].Msg;
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
  finalSave() {
    this.getpath();
    this.UpdateEntry = []
    this.viewStoreData = []
    this.MainTabelRelease = []
    this.ReleaseSinglemat = []
    this.StoreReqFrom.reset()
    this.indentForm.controls['Date'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'));
    this.indentForm.controls['frmdate'].setValue(this.indentForm.controls['Date'].value)
    this.indentForm.controls['todate'].setValue(this.indentForm.controls['Date'].value)
    this.indentForm.enable()
    this.StoreReqFrom.enable()
    this.viewStoreData[this.addmatIndex].Currqtydis = false
    this.viewStoreData[this.addmatIndex].Releasebtndis = false
    this.MaintabelShow = false
    this.indentForm.controls['dept'].setValue('')
    this.indentForm.controls['category'].setValue('')
    this.indentForm.controls['Approved'].setValue('')
  }
  savetimeerror() {
    this.UpdateEntry = []
  }
  QtyVaildation1() {
    this.MaintabelShow = false
    this.MainTabelRelease = []
    this.StoreRelease.nativeElement.click();
  }
  addmatIndex: number = 0
  deletemat(Index: any) {
    this.addmatIndex = Index
    this.Rawmateriladata.push({
      Rawmatname: this.viewStoreData[Index].gStrMatDisp,
      RawMatId: this.viewStoreData[Index].RawMatId
    })

    this.viewStoreData[Index].Releasebtndis = false
    this.viewStoreData[Index].Currqtydis = false

    this.viewStoreData.splice(Index, 1)
    this.ReleaseSinglemat.splice(Index, 1)
    this.MainTabelRelease.splice(Index, 1)
    this.updateRecords.splice(Index, 1)
    console.log(this.MainTabelRelease,'sa');
    console.log( this.ReleaseSinglemat,'sa2');
    console.log( this.viewStoreData,'sa3');


  }
  apiError() {
    this.spinner.show();
  }
  TabViewMaterial: string = '';
  TabViewUOM: string = '';
  TabViewMaxlevel: number = 0;
  TabViewReorderlevel: number = 0;
  TabViewpriority: string = '';
  TabViewminlevel: number = 0
  TabViewstock: number = 0
  tabView(Index: number) {
    this.TabViewMaterial = this.viewStoreData[Index].gStrMatDisp
    this.TabViewUOM = this.viewStoreData[Index].SRUom
    this.TabViewMaxlevel = this.viewStoreData[Index].max_level
    this.TabViewReorderlevel = this.viewStoreData[Index].reorder_level
    this.TabViewpriority = this.viewStoreData[Index].priority
    this.TabViewminlevel = this.viewStoreData[Index].min_level
    this.TabViewstock = this.viewStoreData[Index].rstock
    this.ViewinTab.nativeElement.click()
  }
  closeViewTab() {
    this.StoreRelease.nativeElement.click()

  }
  ClearAll(){
    this.getpath();
    this.UpdateEntry = []
    this.viewStoreData = []
    this.MainTabelRelease = []
    this.ReleaseSinglemat = []
    this.StoreReqFrom.reset()
    this.indentForm.controls['Date'].setValue(this.date.transform(this.currentDate, 'yyyy-MM-dd'));
    this.indentForm.controls['frmdate'].setValue(this.indentForm.controls['Date'].value)
    this.indentForm.controls['todate'].setValue(this.indentForm.controls['Date'].value)
    this.indentForm.enable()
    this.StoreReqFrom.enable()
    this.viewStoreData[this.addmatIndex].Currqtydis = false
    this.viewStoreData[this.addmatIndex].Releasebtndis = false
    this.MaintabelShow = false
    this.indentForm.controls['dept'].setValue('')
    this.indentForm.controls['category'].setValue('')
    this.indentForm.controls['Approved'].setValue('')
  }
}
