import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IssueRequestService } from '../service/issue-request.service';
import { data, event } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-issue-request',
  templateUrl: './issue-request.component.html',
  styleUrls: ['./issue-request.component.scss']
})
export class IssueRequestComponent implements OnInit {
  showSubSubMenu: boolean = false;
  indentype: string = ''
  currentDate1 = new Date()
  currentDate = new Date()
  frmdate: any
  planmonth: any;
  IssueRequestForm!: FormGroup;
  IssueRequestmaterialForm!: FormGroup;
  checked: string = ''
  items: any[] = new Array()
  LoactionId: number = 0
  EditMaterialForm!: FormGroup;
  @ViewChild('invalidfocus') invalidfocus!: ElementRef;
  constructor(private router: Router, private date: DatePipe, private spinnerService: NgxSpinnerService, private toastr: ToastrService, private formBuilder: FormBuilder, private service: IssueRequestService) { }
  ngOnInit(): void {
    this.frmdate = this.date.transform(this.currentDate, 'yyyy-MM-dd');
    this.planmonth = this.date.transform(this.currentDate, 'yyyy-MM');

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);
    // this.spinnerService.show();
    this.IssueRequestForm = this.formBuilder.group({
      indentype: new FormControl('', Validators.required),
      SrDesc: new FormControl('')
    })

    this.IssueRequestmaterialForm = this.formBuilder.group({
      material: new FormControl('', Validators.required),
      MaterialQty: new FormControl('', Validators.required),
      Descripation: new FormControl('', [Validators.required, Validators.minLength(10)]),
      machine: new FormControl(''),
      // Priority: new FormControl('', Validators.required),
      Specification: new FormControl(''),
      IntentPendingNo: new FormControl(''),
      StoreRePending: new FormControl(''),
      AllowQty: new FormControl(''),
      StockAvl: new FormControl(''),
      blanaceqty: new FormControl(''),
      plannedqty: new FormControl('')
      // storelocation: new FormControl(''),
    })
    this.EditMaterialForm = this.formBuilder.group({
      EditMaterial: new FormControl('', Validators.required),
      EditQty: new FormControl('', Validators.required)
    })
    this. getStockReqno()
    this.GetDepartment()
  }
  masterid: number = 3929
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    this.service.Stockreno(this.masterid, this.frmdate, this.LoactionId).subscribe((res: any) => {
      this.StockReq = res
      console.log(this.StockReq, 'StockReqNo');
      if (this.StockReq.length != 0) {
        this.StockReqNo = this.StockReq[0].translno
        // this.StockReqNo = 'SR/U1/23-24/14489'
      }
    })

  }
  Error: number = 0
  GetStockReqNoVaildation() {
    this.service.StockReNoVaildation(this.StockReqNo).subscribe((data: any) => {
      const StockReNoVaildation = data
      if (StockReNoVaildation.length > 0) {
        this.Error = 1
        const a = document.getElementById('Error')
        a?.click()
        return;
      } else {
        return;
      }
    })
  }
  get go(): { [key: string]: AbstractControl } {
    return this.IssueRequestForm.controls;
  }
  gobtn: any
  Empid: number = 0
  Deptid: number = 0
  GetDepartment() {
    this.service.Department(this.Empid,this.LoactionId).subscribe((res: any) => {
      const Departmentdata = res
      console.log(Departmentdata)
      if (Departmentdata.length != 0) {
        console.log(Departmentdata[0].deptid,'deptid');
        
        this.Deptid = Departmentdata[0].deptid
      } else {
        return;
      }

    })
  }

  IndentType(event: any) {
    const indentype = this.IssueRequestForm.controls['indentype'].value
    this.srnewtype = parseFloat(event.value)
    console.log(this.srnewtype);

    // console.log(indentype);

    // if (parseInt(indentype) === 2) {
    //   $('.rework').hide()
    //   $('.trhideclass1').show();
    // }
    // if (parseInt(indentype) === 0) {
    //   $('.rework').show()
    //   $('.trhideclass1').hide();
    // }
    this.getCapexNo()
  }
  CapexNodata: any = new Array()
  getCapexNo() {
    this.service.CapexNo(this.LoactionId).subscribe((data: any) => {
      this.CapexNodata = data
      console.log(this.CapexNodata, 'this.CapexNodata');
    })
  }
  capexno: any = 0
  capexdescripation: string = ''
  capexnoEvent(event: any) {
    this.capexno = parseFloat(event.target.value)
    const capex = this.CapexNodata.forEach((el: any) => {
      if (el.capexno === this.capexno) {
        this.capexdescripation = el.description
      }
    });
  }
  Go() {
    this.gobtn = true
    if (this.IssueRequestForm.invalid) {
      this.invalidfocus.nativeElement.focus();
      return;
    }
    else {
      const material = document.getElementById("stockmatrial") as HTMLInputElement;
      material.click()
    }
  }
  RawMatName: any = ''
  RawmatId: any = ''
  Rawmat(event: any) {
    this.RawMatName = event.target.value
    console.log(this.RawMatName);

    if (this.RawMatName.length >= 2) {
      if (this.RawMatName !== null && this.RawMatName !== undefined && this.RawMatName !== 0) {
        this.GetMaterial()
      } else {
        return;
      }
    } else if (this.RawMatName.length < 2) {
      console.log('dasfmsd');
      this.RawmaterilData = []
    }
  }
  searchFn: any;
  customSearchFn(term: string, item: any) {
    return item.RawmatName.toLowerCase().startsWith(term.toLowerCase())
  }
  RawmaterilData: any[] = new Array()
  GetMaterial() {
    this.RawmatId = 0
    this.service.RawMat(this.RawMatName).subscribe((data: any) => {
      this.RawmaterilData = data
      console.log(this.RawmaterilData);
    })
  }
  materialname: string = ''
  getMaterialDetails() {
    console.log(this.Rawmatid, 'Rawmatid');
    const rawmatname = this.RawmaterilData.filter((res: any) => {
      if (this.Rawmatid === res.RawmatId) {
        this.materialname = res.RawmatName
        console.log(this.materialname, 'material');
      }
    })
    if (this.Rawmatid !== '' && this.Rawmatid !== undefined && this.Rawmatid !== null && this.Rawmatid !== 0) {
      this.GetUOM()
      this.getIndentDet()
      // this.GetStockAvl()
      // this.WarwHouse()
      this.GetMachine()
    }
  }
  UOM: string = ''
  GetUOM() {
    this.service.Uom(this.Rawmatid).subscribe((response: any) => {
      const UOMDATA = response
      console.log(UOMDATA, 'UOMDATA');

      if (UOMDATA.length !== 0) {
        this.UOM = UOMDATA[0].uom
        console.log(this.UOM);

      }
    })
  }
  Qty: any = 0
  Rawmatid: any
  tolltt: number = 0
  StockCheckArray: any[] = new Array()
  Updatebtn: boolean = false
  RequestQty(event: any) {
    debugger
    this.Qty = parseFloat(event.target.value)
    console.log(this.Qty, 'Qty');
    if (this.LoactionId === 1 || this.LoactionId === 3) {
      this.service.Tollt(this.LoactionId, this.Rawmatid).subscribe((data: any) => {
        const tollt = data
        console.log(tollt, 'tollt');
        this.tolltt = tollt[0].tolltt
        console.log(this.tolltt, 'tollt');
      })
      if (this.StoreRePending > 0 && parseFloat(this.Qty) > 0) {
        event.target.value = 0
        this.Error = 2
        const itemavialble = document.getElementById('Error')
        itemavialble?.click()
        this.Updatebtn = true
        return;
      }
      else {
        this.Updatebtn = false
      }
      if (this.tolltt > 0) {
        this.BalanceQty = 200
        if (parseFloat(this.Qty) > this.BalanceQty) {
          this.Qty = 0
          this.Error = 3
          const Toleranceqty = document.getElementById('Error')
          Toleranceqty?.click()
          this.Updatebtn = true
          return;
        }
        if (this.PackQty > 0) {
          const chck = parseFloat(this.Qty) % this.PackQty
          if (chck > 0) {
            this.Qty = 0
            this.Error = 4
            const Reqpackqty = document.getElementById('Error')
            Reqpackqty?.click()
            this.Updatebtn = true
            return;
          }
        }
        let stock = this.IndentDetalisData[0].Store_Stk_Qty.toString()
        let balQty = this.BalanceQty.toString()
        let allowpackqty = this.AllowPackQty.toString()
        if (stock === '') {
          this.IndentDetalisData[0].Store_Stk_Qty = 0
        } else {
          this.IndentDetalisData[0].Store_Stk_Qty
        }
        if (balQty === '') {
          this.BalanceQty = 0
        } else {
          this.BalanceQty
        }
        if (allowpackqty === '') {
          this.AllowPackQty = 0
        } else {
          this.AllowPackQty
        }
        this.StockCheckArray.push(this.IndentDetalisData[0].Store_Stk_Qty, this.BalanceQty, this.AllowPackQty)
        let samlest = Math.min(...this.StockCheckArray)
        console.log(samlest);
        samlest = 500
        if (parseFloat(this.Qty) > samlest) {
          this.Qty = ''
          this.Error = 5
          const StockChck = document.getElementById('Error')
          StockChck?.click()
          this.Updatebtn = true
          return;
        }
      }
    }
    this.Updatebtn = false
  }
  IndentDetalisData: any[] = new Array()
  IndentPending: number = 0
  StoreRePending: number = 0
  Plantol: number = 0
  PackQty: number = 0
  plannedQty: any = 0
  IssueQty: number = 0
  AllowQty: number = 0
  AlowpackQty: number = 0
  Specification: string = ''
  BalanceQty: number = 0
  txtQty: any = 0
  minlevel: number = 0
  AllowPackQty: number = 0
  StockAvl: number = 0
  getIndentDet() {
    this.spinnerService.show()
    this.service.IndentDet(this.LoactionId, this.frmdate, this.Rawmatid, this.Deptid).subscribe((res: any) => {
      this.IndentDetalisData = res
      this.spinnerService.hide()
      console.log(this.IndentDetalisData, 'IndentDetalisData');
      if (this.IndentDetalisData.length !== 0) {
        this.IssueRequestmaterialForm.controls['IntentPendingNo'].setValue(this.IndentDetalisData[0].Indent_Pending)
        this.IssueRequestmaterialForm.controls['StoreRePending'].setValue(this.IndentDetalisData[0].Req_Pending)
        this.IssueRequestmaterialForm.controls['AllowQty'].setValue(this.IndentDetalisData[0].Alloc_Stk_Qty)
        this.IssueRequestmaterialForm.controls['IntentPendingNo'].setValue(this.IndentDetalisData[0].Issue_Qty)
        this.IssueRequestmaterialForm.controls['plannedqty'].setValue(this.IndentDetalisData[0].MRP_Plan_Qty)
        this.IssueRequestmaterialForm.controls['blanaceqty'].setValue(this.IndentDetalisData[0].Balance_Qty)
        this.StoreRePending = this.IndentDetalisData[0].Req_Pending
        this.Plantol = this.IndentDetalisData[0].Tolr_Plan_Qty
        this.IssueQty = this.IndentDetalisData[0].Issue_Qty
        this.PackQty = this.IndentDetalisData[0].Pack_Qty
        this.AllowQty = this.IndentDetalisData[0].Allow_Qty
        this.Specification = this.IndentDetalisData[0].RawMatrial
        // this.plannedQty = this.IndentDetalisData[0].MRP_Plan_Qty
        this.BalanceQty = this.IndentDetalisData[0].Balance_Qty
        console.log(this.plannedQty);
        this.txtQty = this.IndentDetalisData[0].Store_Stk_Qty - this.IndentDetalisData[0].Alloc_Stk_Qty
        this.minlevel = this.IndentDetalisData[0].Min_level
        this.AllowPackQty = this.IndentDetalisData[0].Allow_Pack_Qty
        this.IssueRequestmaterialForm.controls['StockAvl'].setValue(this.IndentDetalisData[0].Store_Stk_Qty)
        this.StockAvl = this.IndentDetalisData[0].Store_Stk_Qty
      }
    })
  }
  Issuelocaid: number = 0
  GetIisueloc() {
    this.service.IssueLocId(this.Empid).subscribe((res: any) => {
      const IssuelocidData = res
      if (IssuelocidData.length != 0) {
        this.Issuelocaid = IssuelocidData[0].Isslocid
      }

    })
  }

  Descripation() {
    return this.IssueRequestmaterialForm.get('Descripation');
  }
  // LocationstoreData: any[] = new Array()
  // GetLoactionStore() {
  //   this.service.StoreLoaction(this.LoactionId, this.Rawmatid).subscribe((res: any) => {
  //     this.LocationstoreData = res
  //     console.log(this.LocationstoreData, 'LocationstoreData');
  //     if (this.LocationstoreData.length == 0) {
  //       const loc = document.getElementById('storeloc') as HTMLInputElement
  //       loc.click()
  //     }
  //     if (this.LocationstoreData.length === 1) {
  //       console.log(this.LocationstoreData[0].locname, 'b');
  //       let a = this.LocationstoreData[0].locname
  //       this.IssueRequestmaterialForm.controls['storelocation'].setValue(this.LocationstoreData[0].locname)
  //       console.log(this.IssueRequestmaterialForm.controls['storelocation'].setValue(this.LocationstoreData[0].locname), '1');
  //       console.log(this.IssueRequestmaterialForm.controls['storelocation']);
  //     }
  //   })
  // }
  storelocid: number = 0
  LocationstoreEvent(event: any) {
    this.storelocid = event.target.value
    console.log(this.storelocid, 'storelocid');

  }
  Machines: any[] = new Array()
  mtype: string = ''
  GetMachine() {
    this.service.Machine(this.LoactionId).subscribe((res: any) => {
      this.Machines = res;
      console.log(this.Machines, 'MACH');

    })
  }
  machid: number = 0
  machname: string = ''
  machineEvent(event: any) {
    this.machid = parseInt(event.target.value)
    console.log(this.machid, 'MACH ID');
    const machinetype = this.Machines.forEach((data: any) => {
      if (data.machid == this.machid) {
        this.mtype = data.mtype
        console.log(this.mtype, 'this.mtype');
      }
      if (data.machid == this.machid) {
        this.machname = data.machname
        console.log(this.mtype, 'this.mtype');
      }

    })
  }
  warehouses: any[] = new Array()
  WarwHouse() {
    this.service.Warehouse(this.LoactionId).subscribe((data: any) => {
      this.warehouses = data
      console.log(this.warehouses, ' WARHOUSE');
    })
  }
  warehouseId: number = 0
  WarehouseEvent(event: any) {
    this.warehouseId = event.target.value
    console.log(this.warehouseId, 'WAREHOUSE ID');

  }
  get mat(): { [key: string]: AbstractControl } {
    return this.IssueRequestmaterialForm.controls;
  }
  clearRawmat() {
    this.Materialupdatebtn = false
    this.IssueRequestmaterialForm.reset()
    this.IssueRequestmaterialForm.controls['Priority'].setValue('')
    this.IssueRequestmaterialForm.controls['Descripation'].setValue('')
    this.IssueRequestmaterialForm.controls['Specification'].setValue('')
    this.materialname = ''
    this.Quantity = ''
    this.UOM = ''
    // this.minmaxreorderarray = []
    this.IndentDetalisData = []
    // this.StockAvlData = []
    this.RawmaterilData = []
    this.txtQty = ''
    this.Machines = []
    this.Machines = []
  }

  Materialupdatebtn: any
  Quantity: any = 0
  Material: any[] = new Array()
  Minstock: number = 0
  Maxstock: number = 0
  ReOrder: number = 0
  IndentNo: number = 0
  // Priority: string = ''
  viewMat: boolean = false
  MaterialUpdate() {
    const descripation = this.IssueRequestmaterialForm.controls['Descripation'].value
    debugger
    this.Materialupdatebtn = true
    if (this.IssueRequestmaterialForm.invalid) {
      return
    } else {
      if (this.Deptid === 12 || this.Deptid === 44 || this.Deptid === 79) {
        this.service.Grntype(this.RawmatId).subscribe((data: any) => {
          const Grntype = data
          if (Grntype[0].grntypeid !== 104 && Grntype[0].grntypeid !== 116 && Grntype[0].grntypeid !== 117 && Grntype[0].grntypeid !== 118) {
            if (this.machid === 0) {
              this.toastr.warning('Please select Machine Name')
              return
            }
          }
        })
      }
      if (this.plannedQty > 0) {
        if (this.BalanceQty < parseFloat(this.Qty)) {
          this.toastr.warning('You cannot request more than Planned Qty')
          this.Qty = ''
        }
      }
      this.Quantity = parseFloat(this.IssueRequestmaterialForm.controls['MaterialQty'].value)
      this.Material.push({
        MaterialName: this.materialname,
        MaterialId: this.Rawmatid,
        Quantity: this.Quantity,
        Uom: this.UOM,
        Descripation: this.IssueRequestmaterialForm.controls['Descripation'].value,
        MinStock: this.Minstock,
        MaxStock: this.Maxstock,
        ReOrder: this.ReOrder,
        IndentNo: this.IndentNo,
        Machineid: this.machid,
        Mtype: this.mtype,
        Specification: this.Specification,
        Stock: this.StockAvl,
        // MachineName: this.machname
        // Priority: this.IssueRequestmaterialForm.controls['Priority'].value,
      })
      this.RawmaterilData = []
      this.toastr.success('Record Updated SuccessFully', "Success")
      this.viewMat = true
      console.log(this.Material, 'Material tabel ');
      this.clearmaterial()
    }

  }
  clearmaterial() {
    this.Materialupdatebtn = false
    this.IssueRequestmaterialForm.reset()
    this.IssueRequestmaterialForm.reset()
    this.Materialupdatebtn = false
    this.Machines = []
    this.UOM = ''

    // this.IssueRequestmaterialForm.controls['Priority'].setValue('')
  }
  MaterialPending: any[] = new Array()
  GetMatQtyPending() {
    this.service.MatQtyPending(this.LoactionId, this.Rawmatid).subscribe((data: any) => {
      this.MaterialPending = data
      console.log(this.MaterialPending, 'MaterialPending');
      if (this.MaterialPending.length != 0) {

        const material = document.getElementById('matlpending') as HTMLInputElement
        material.click()
      } else {
        this.toastr.warning('No Records To Found')
      }
    })
  }
  IntendPendingViewData: any[] = new Array()
  GetIndentPendingViewDet() {
    this.service.IntendPendingView(this.LoactionId, this.Rawmatid).subscribe((res: any) => {
      this.IntendPendingViewData = res
      console.log(this.IntendPendingViewData, 'IntendPendingViewData');
      if (this.IntendPendingViewData.length > 0) {
        const Indent = document.getElementById("IntendPendingViewData") as HTMLInputElement;
        Indent.click()
      } else {
        this.toastr.warning("No Data Found", 'Warining');
      }
    })
  }
  schInd: number = 0
  RemoveIntentMaterial(Index: any) {
    this.Error = 6
    const delte = document.getElementById('Error') as HTMLInputElement
    delte.click()
    this.schInd = Index
  }
  deleteMat() {
    if (this.Material.length > 0) {
      this.Material.splice(this.schInd, 1)
      console.log(this.Material.splice(this.schInd, 1));
    }
  }
  EditschInd: any
  EditIntentMaterial(Index: any) {
    const Edit = document.getElementById('Editmaterial') as HTMLInputElement
    Edit.click()
    this.EditschInd = Index
  }

  GetEditQty() {
    const Edit = document.getElementById('mater') as HTMLInputElement
    Edit.click()

  }
  get edit(): { [key: string]: AbstractControl } {
    return this.EditMaterialForm.controls;
  }
  EditMaterialBtn: any
  EditQtySave() {
    debugger
    if (this.EditMaterialForm.invalid) {
      return
    } else {
      this.Material.push({
        MaterialName: this.materialname,
        Quantity: this.Quantity,
        UOM: this.IssueRequestmaterialForm.controls['material'].value,
        Descripation: this.IssueRequestmaterialForm.controls['Descripation'].value,
        MinStock: this.Minstock,
        MaxStock: this.Maxstock,
        ReOrder: this.ReOrder,
        IndentNo: this.IndentNo,
      })
      console.log(this.Material);
    }
  }

  savemenu() {
    const Save = document.getElementById('Savemenu') as HTMLInputElement
    Save.click()
  }
  IssueSchMatrlIndentDetail: any[] = new Array()
  IssueReqSave: any[] = new Array()
  IssueReqUpdate: any[] = new Array()
  Sts: string = ''
  Msg: string = ''
  srnewtype: number = 0
  Status: string = 'Approved'
  GetSave() {
    this. getStockReqno()
    if (this.Deptid === 15) {
      if (this.capexno === '') {
      } else {
        this.toastr.error('You cannot update without Capex Detail.... ');
        return
      }
    }
    // const Entrydatetime = this.date.transform(this.frmdate, 'yyyy-MM-dd HH:mm:ss')
    this.IssueSchMatrlIndentDetail = []
    for (let i = 0; i < this.Material.length; i++) {
      this.IssueSchMatrlIndentDetail.push({
        Rawmatid: this.Material[i].MaterialId,
        Srqty: this.Material[i].Quantity,
        Uom: this.Material[i].Uom,
        MaterialSpec: this.Material[i].MaterialName,
        Stockqty: this.Material[i].Stock,
        machid: this.Material[i].Machineid,
        mtype: this.Material[i].Mtype
      })
    }
    this.IssueReqSave = []
    this.IssueReqSave.push({
      SrRefNo: this.StockReqNo,
      Empid: this.Empid,
      DeptID: this.Deptid,
      srtype: this.srnewtype,
      capexno: this.capexno,
      Status: this.Status,
      SRDesc: this.IssueRequestForm.controls['SrDesc'].value,
      LocationId: this.LoactionId,
      EntryEmpid: this.Empid,
      IssueSchMatrlIndentDetail: this.IssueSchMatrlIndentDetail,

    })
    console.log(this.IssueReqSave, 'save');
    this.spinnerService.show()
    this.service.save(this.IssueReqSave).subscribe((data: any) => {
      this.IssueReqUpdate = data
      this.spinnerService.hide()
      this.Sts = this.IssueReqUpdate[0].status
      this.Msg = this.IssueReqUpdate[0].Msg
      if (this.Sts === 'Y') {
        const Save = document.getElementById('Save') as HTMLInputElement
        Save.click()
      } else {
        const Save = document.getElementById('Save') as HTMLInputElement
        Save.click()
      }
    })
  }
  finalSave() {
    this. getStockReqno()
    this.CapexNodata = []
    this.indentype = ''
    this.IssueRequestmaterialForm.reset()
    this.Materialupdatebtn = false
    this.IssueRequestForm.reset()
    this.gobtn = false
    this.Material = []
    this.IndentDetalisData = []
    this.IntendPendingViewData = []
    this.MaterialPending = []
    this.IssueReqSave = []
    this.IssueReqUpdate = []
    this.IssueSchMatrlIndentDetail = []
    this.RawmaterilData = []
  }
  Logout() {
    this.router.navigate(['/login'], {});
  }
}
