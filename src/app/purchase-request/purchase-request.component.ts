import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { data, event } from 'jquery';
import { PurchaseRequestService } from '../service/purchase-request.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.scss'],

})
export class PurchaseRequestComponent implements OnInit {
  showSubSubMenu: boolean = false;
  currentDate1 = new Date()
  currentDate = new Date()
  frmdate: any
  planmonth: any;
  Purchaseindenttypeform!: FormGroup;
  StockRequestmaterialForm!: FormGroup;
  checked: string = ''
  loactionId: number = 0

  @ViewChild('Termsbtnupdate') Termsbtnupdate!: ElementRef;
  @ViewChild('Error01') Error01!: ElementRef;

  constructor(private router: Router, private date: DatePipe, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder, private service: PurchaseRequestService) { }
  ngOnInit(): void {
    this.frmdate = this.date.transform(this.currentDate, 'yyyy-MM-dd');
    this.planmonth = this.date.transform(this.currentDate, 'yyyy-MM');
    this.Commitmentdate = this.date.transform(this.currentDate1, 'yyyy-MM-dd');

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.loactionId = data[data.length - 1]
    console.log(this.loactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);

    this.Purchaseindenttypeform = this.formBuilder.group({
      indentype: new FormControl('', Validators.required),
      SrDesc: new FormControl('')
    })
    this.StockRequestmaterialForm = this.formBuilder.group({
      material: new FormControl('', Validators.required),
      MaterialQty: new FormControl('', Validators.required),
      Descripation: new FormControl('', [Validators.required, Validators.minLength(10)]),
      Priority: new FormControl('', Validators.required),
      Specification: new FormControl(''),
      IntentPendingNo: new FormControl(''),
      StoreRePending: new FormControl(''),
      AllowQty: new FormControl(''),
      StockAvl: new FormControl(''),
      storelocation: new FormControl(''),
    })
    this.getStockReqno()
    this.Comm_Date()
    this.GetDeptCapex()
    this.GetCompany()
    this.GetCompanyName()
    this.GetDepartment()
    this.GetMachine()


  }

  Comm_Date() {
    $(document).ready(function () {
      var today = new Date().toISOString().split('T')[0];
      $('#date').attr('min', today);
    });
  }
  companylist: any[] = new Array()
  CompanyId: number = 0
  GetCompany() {
    this.service.Company().subscribe((data: any) => {
      this.companylist = data;
      console.log(this.companylist, 'company');
      // for(let i =0 ;i<this.companylist.length;i++){
      //   // com
      // }
    })
  }
  companyname: string = ''

  ErrorMsg: string = ''
  GetCompanyName() {
    this.service.CompName(this.loactionId).subscribe((data: any) => {
      const compnamedettalis = data
      console.log(compnamedettalis, 'compnamedettalis');
      if (compnamedettalis.length != 0) {
        this.companyname = compnamedettalis[0].Description
        console.log(this.companyname, 'cmpname');
      }
      if (this.companyname !== 'SFPL') {
        this.service.IssueLocId(this.Empid).subscribe((res: any) => {
          const IssuelocidData = res
          if (IssuelocidData.length != 0) {
            this.Issuelocaid = IssuelocidData[0].Isslocid
            console.log(this.Issuelocaid);
            if (this.Issuelocaid == 0) {
              this.ErrorMsg = ''
              this.ErrorMsg = 'Please fix the Issue Location ID in Store Master entry...'
              // const Company = document.getElementById('Error') as HTMLInputElement
              // Company.click()
              this.Error01.nativeElement.click()
              return
            }
          }
        })
      } else {
        return;
      }
    })
  }
  Empid: number = 0
  Deptid: number = 0
  GetDepartment() {
    this.service.Department(this.Empid).subscribe((res: any) => {
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
  apiErrorMsg: string = ''
  capexDeptid: number = 0
  GetDeptCapex() {
    this.service.CapexValidationDept(this.Empid).subscribe((data: any) => {
      const capexDeptdata = data
      console.log("capexDeptdata", capexDeptdata)
      if (capexDeptdata[0].status === 'N') {
        this.apiErrorMsg = capexDeptdata[0].Msg
        const Error = document.getElementById('apierror') as HTMLInputElement
        Error.click()
        return
      }
      if (capexDeptdata.length !== 0) {
        this.capexDeptid = capexDeptdata[0].deptid
        console.log(this.capexDeptid, 'capexDeptid');
      } else {
        return;
      }

      if (this.capexDeptid == 15) {
        this.indentype == 'Capex'
      }
    })
  }
  masterid: number = 3929
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    this.service.Stockreno(this.masterid, this.frmdate, this.loactionId).subscribe((res: any) => {
      this.StockReq = res
      console.log(this.StockReq, 'StockReqNo');
      if (this.StockReq.length != 0) {
        this.StockReqNo = this.StockReq[0].translno
        // this.StockReqNo = 'SR/U1/23-24/14489'
      }
    })

  }
  // ------->CapexVisibile Condtion Want to write Not Finish ---------------->>>>
  capexVisibile: number = 0
  getcapex() {
    this.service.Capex(this.Empid).subscribe((res: any) => {
      const capexdata = res
      console.log(capexdata);
      if (capexdata.length != 0) {
        this.capexVisibile = capexdata[0].deptid
      }
    })
  }
  CapexNodata: any = new Array()
  getCapexNo() {
    this.service.CapexNo(this.loactionId).subscribe((data: any) => {
      this.CapexNodata = data
      console.log(this.CapexNodata, 'this.CapexNodata');
    })
  }
  capexno: number = 0
  capexdescripation: string = ''
  capexnoEvent(event: any) {
    this.capexno = event.target.value
    const capex = this.CapexNodata.forEach((el: any) => {
      if (el.capexno === this.capexno) {
        this.capexdescripation = el.description
      }
    });
  }
  GetStockReNochck() {
    this.service.StockReNoValidation(this.StockReqNo).subscribe((res: any) => {
      const StockReNoValidationData = res
      console.log(StockReNoValidationData, 'StockReNoValidation Check');
      if (StockReNoValidationData.length > 0) {
        this.ErrorMsg = ''
        this.ErrorMsg = 'Already this transactions No exists in Store Requisition Table. Please contact your Systemadmin '
        this.Error01.nativeElement.click()
        return;
      } else {
        return;
      }
    })
  }
  get go(): { [key: string]: AbstractControl } {
    return this.Purchaseindenttypeform.controls;
  }
  scrollToFirstInvalidControl() {
    let form = document.getElementById('formId') as HTMLFormElement
    let firstInvalidControl = form.getElementsByClassName('ng-invalid')[0];
    firstInvalidControl.scrollIntoView();
    (firstInvalidControl as HTMLElement).focus();
  }
  gobtn: any
  StockMaterialDeatlis: boolean = false
  IntentPending: number = 0
  Viewbtn: boolean = false
  Go() {
    this.GetStockReNochck()
    this.gobtn = true
    if (this.Purchaseindenttypeform.invalid) {
      console.log(this.Purchaseindenttypeform);

      this.scrollToFirstInvalidControl()
      return;
    }
    else {
      if (this.indentype === 'Capex') {
        if (this.capexdescripation === '') {
          this.toastr.error('Please Select A Capex Detail')
          return
        }
      } else {
        this.StockMaterialDeatlis = true
        console.log(this.indenttypevalue,'this.indenttypevalue');
        const material = document.getElementById("stockmatrial") as HTMLInputElement;
        material.click()
        this.Purchaseindenttypeform.disable()
      }
    }
  }
  indenttypevalue :number=1
  indentype: string = ''
  IndentypeEvent(event: any) {
    this.indentype = event.value
    console.log(this.indentype, 'indenttype');
    if (this.indentype == 'Capex') {
        this.indenttypevalue=2

      this.getCapexNo()
      return;
    }else{
      this.indenttypevalue=1
    }

  }

  dbname: string = 'migicsoft'
  productiondb: string = 'Production'
  Rawmateriladata: any[] = new Array()
  minlevel: number = 0
  maxlevel: number = 0
  reorderlevel: number = 0
  leadtime: number = 0
  // minmaxreorderarray: any[] = new Array()
  FrmModule: number = 1
  RawmatnamePar: any
  Rawmat(event: any) {
    this.Materialupdatebtn = false
    this.StockRequestmaterialForm.reset()
    this.RawmatnamePar = event.target.value
    console.log(this.RawmatnamePar);
    if (this.RawmatnamePar.length >= 2) {
      if (this.RawmatnamePar !== null && this.RawmatnamePar !== undefined && this.RawmatnamePar !== 0) {
        this.gewtRawmat()
      } else {
        return;
      }
    } else if (this.RawmatnamePar.length < 2) {
      // console.log('dasfmsd');
      this.Rawmateriladata = []
    }

  }
  searchFn: any;
  customSearchFn(term: string, item: any) {
    return item.gstrmatdisp.toLowerCase().startsWith(term.toLowerCase())
  }
  gewtRawmat() {
    this.service.Rawmaterial(this.loactionId, this.RawmatnamePar).subscribe((res: any) => {
      this.Rawmateriladata = res
      console.log(this.Rawmateriladata, 'material');
      if (this.Rawmateriladata.length !== 0) {
      } else {
        this.toastr.warning('No Data Found..', 'Warning')
        return
      }

    })
  }

  Rawmatid: number = 0
  txtQty: any = 0
  materialname: string = ''
  getMaterialDetails() {
    console.log(this.Rawmatid, 'Rawmatid');
    const rawmatname = this.Rawmateriladata.filter((res: any) => {
      if (this.Rawmatid === res.rawmatid) {
        this.materialname = res.gstrmatdisp
        console.log(this.materialname, 'material');
      }
    })
    if (this.Rawmatid !== null && this.Rawmatid !== undefined && this.Rawmatid !== 0) {
      for (let i = 0; i < this.Material.length; i++) {
        if (this.Material[i].MaterialName === this.materialname) {
          this.ErrorMsg = ''
          this.ErrorMsg = 'Material already selected..Please Select a Another Material...'
          this.StockRequestmaterialForm.controls['material'].setValue('')
          // const material = document.getElementById('Error') as HTMLInputElement
          // material.click()
          // material.focus()
          this.Error01.nativeElement.click()
          return;
        }
        else {
        }
      }
      this.getIndentDet()
      this.GetLoactionStore()
      this.GetUOM()

    } else {
      return;
    }
    // this.minmaxreorderarray = []
    this.IndentDetalisData = []


    // console.log(this.minmaxreorderarray, 'u1');
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
  StockAvl: number = 0

  getIndentDet() {
    this.spinnerService.show()
    this.service.IndentDet(this.loactionId, this.frmdate, this.Rawmatid, this.Deptid).subscribe((res: any) => {
      this.IndentDetalisData = res
      this.spinnerService.hide()
      console.log(this.IndentDetalisData, 'IndentDetalisData');
      if (this.IndentDetalisData.length !== 0) {
        this.StockRequestmaterialForm.controls['IntentPendingNo'].setValue(this.IndentDetalisData[0].Indent_Pending)
        this.StockRequestmaterialForm.controls['StoreRePending'].setValue(this.IndentDetalisData[0].Req_Pending)
        this.StockRequestmaterialForm.controls['AllowQty'].setValue(this.IndentDetalisData[0].Alloc_Stk_Qty)
        this.StockRequestmaterialForm.controls['IntentPendingNo'].setValue(this.IndentDetalisData[0].Issue_Qty)
        this.StoreRePending = this.IndentDetalisData[0].Req_Pending
        this.Plantol = this.IndentDetalisData[0].Tolr_Plan_Qty
        this.IssueQty = this.IndentDetalisData[0].Issue_Qty
        this.PackQty = this.IndentDetalisData[0].Pack_Qty
        this.AllowQty = this.IndentDetalisData[0].Allow_Qty
        this.Specification = this.IndentDetalisData[0].RawMatrial
        this.plannedQty = this.IndentDetalisData[0].MRP_Plan_Qty
        this.BalanceQty = this.IndentDetalisData[0].Balance_Qty
        console.log(this.plannedQty);
        this.txtQty = this.StockAvl - this.IndentDetalisData[0].Alloc_Stk_Qty
        this.minlevel = this.IndentDetalisData[0].Min_level
        this.StockRequestmaterialForm.controls['StockAvl'].setValue(this.IndentDetalisData[0].Store_Stk_Qty)
        console.log(this.StockAvl);
        this.StockAvl = this.IndentDetalisData[0].Store_Stk_Qty
      }
    })
    // this.GetStockAvl()
  }
  Descripation() {
    return this.StockRequestmaterialForm.get('Descripation');
  }
  get mat(): { [key: string]: AbstractControl } {
    return this.StockRequestmaterialForm.controls;
  }
  Qty: number = 0
  RequestQty(event: any) {
    this.Qty = event.target.value
    console.log(this.Qty, 'QTY');

    if (this.Qty > 0) {
      if (this.PackQty > 0) {
        const a = (this.Qty % this.PackQty).toFixed(3)
        const oqty = parseFloat(a)
        if (oqty > 0) {
          const packqty = this.PackQty.toString()
          this.toastr.warning('Packing Qty is , ' + packqty + ' ,Please define accordingly')
        }
      }
    }
  }
  IntendPendingViewData: any[] = new Array()
  GetIndentPendingViewDet() {
    this.service.IntendPendingView(this.loactionId, this.Rawmatid).subscribe((res: any) => {
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
  Issuelocaid: number = 0
  GetIisueloc() {
    this.service.IssueLocId(this.Empid).subscribe((res: any) => {
      const IssuelocidData = res
      if (IssuelocidData.length != 0) {
        this.Issuelocaid = IssuelocidData[0].Isslocid
      }

    })
  }

  LocationstoreData: any[] = new Array()
  Locationdata: any[] = new Array()
  error: number = 0

  GetLoactionStore() {
    this.service.StoreLoaction(this.loactionId, this.Rawmatid).subscribe((res: any) => {
      this.LocationstoreData = res
      console.log(this.LocationstoreData, 'LocationstoreData');
      this.Locationdata = this.LocationstoreData
      if (this.LocationstoreData.length == 0) {
        this.error = 1
        this.ErrorMsg = ''
        this.ErrorMsg = 'Please set the Location Name in location Master. Shall I continue ? '
        // const loc = document.getElementById('Error') as HTMLInputElement
        // loc.click()
        this.Error01.nativeElement.click()
      }
      if (this.LocationstoreData.length == 1) {
        console.log(this.LocationstoreData[0].locname, 'b');
        let a = this.LocationstoreData[0].locname
        this.StockRequestmaterialForm.controls['storelocation'].setValue(this.LocationstoreData[0].locname)
        console.log(this.StockRequestmaterialForm.controls['storelocation'].setValue(this.LocationstoreData[0].locname), '1');
        console.log(this.StockRequestmaterialForm.controls['storelocation']);
      }
    })

  }
  loc() {

  }
  storelocid: number = 0
  LocationstoreEvent(event: any) {
    this.storelocid = event

    console.log(this.storelocid, 'storelocid');

  }
  Machines: any[] = new Array()
  GetMachine() {
    this.service.Machine(this.loactionId).subscribe((res: any) => {
      this.Machines = res;
      console.log(this.Machines, 'MACH');

    })
  }
  machid: number = 0
  machineEvent(event: any) {
    this.machid = parseFloat(event.target.value)
    console.log(this.machid, 'MACH ID');
  }
  warehouses: any[] = new Array()
  WarwHouse() {
    this.service.Warehouse(this.loactionId).subscribe((data: any) => {
      this.warehouses = data
      console.log(this.warehouses, ' WARHOUSE');
    })
  }
  warehouseId: number = 0
  WarehouseEvent(event: any) {
    this.warehouseId = event.target.value
    console.log(this.warehouseId, 'WAREHOUSE ID');

  }
  MaterialPending: any[] = new Array()
  GetMatQtyPending() {
    this.service.MatQtyPending(this.loactionId, this.Rawmatid).subscribe((data: any) => {
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
  priorityvalue: number = 0

  Materialupdatebtn: any
  Quantity: any = 0
  Material: any[] = new Array()
  Minstock: number = 0
  Maxstock: number = 0
  ReOrder: number = 0
  IndentNo: number = 0
  // Priority: string = ''
  AvlQty: any = 0
  matlcolor: any
  MatlUpdatedisable: boolean = false
  IndentSchComments: string = ''
  MaterialUpdate() {
    const descripation = this.StockRequestmaterialForm.controls['Descripation'].value

    this.Materialupdatebtn = true
    if (this.StockRequestmaterialForm.invalid) {
      return
    }
    else {
      this.AvlQty = this.StockAvl - this.txtQty
      console.log(this.AvlQty);
      const minimumlevelReach = this.AvlQty - this.minlevel
      console.log(this.AvlQty, this.minlevel);
      if (this.StockRequestmaterialForm.controls['Priority'].value === 'Low') {
        this.priorityvalue = 0
      }
      else if (this.StockRequestmaterialForm.controls['Priority'].value === 'Medium') {
        this.priorityvalue = 1
      }
      else {
        this.priorityvalue = 2
      }
      if (minimumlevelReach > 0) {
        this.toastr.warning('Please raise Issue Indent. Already Stock is available', "Warning")
        this.Qty = 0
        return
      } else {
        this.Quantity = parseFloat(this.StockRequestmaterialForm.controls['MaterialQty'].value)
        this.Material.push({
          MaterialName: this.materialname,
          MaterialId: this.Rawmatid,
          Quantity: this.Quantity,
          UOM: this.UOM,
          Descripation: this.StockRequestmaterialForm.controls['Descripation'].value,
          MinStock: this.Minstock,
          MaxStock: this.Maxstock,
          ReOrder: this.ReOrder,
          IndentNo: this.IndentNo,
          Priority: this.StockRequestmaterialForm.controls['Priority'].value,
          Stock: this.StockAvl,
          Specification: this.Specification,
          PriorityNo: this.priorityvalue,
          color: 'Tomato'
        })
        console.log(this.Material, 'material');

        this.Viewbtn = true
        this.Rawmateriladata = []
        this.toastr.success('Record Updated SuccessFully', "Success")
        if (this.Material.length > 0) {
          if (this.POIntentDisablebtn[this.IndentdisIndex] === false) {
            this.matlcolor = 1
          }
        }
        console.log(this.Material, 'Material tabel ');
        this.clearmaterial()
      }
    }
  }

  clearmaterial() {
    this.Materialupdatebtn = false
    this.StockRequestmaterialForm.reset()
    this.StockRequestmaterialForm.controls['Priority'].setValue('')
    this.StockRequestmaterialForm.controls['Descripation'].setValue('')
    this.StockRequestmaterialForm.controls['Specification'].setValue('')
    this.materialname = ''
    this.Quantity = ''
    this.UOM = ''
    this.IndentDetalisData = []
    this.txtQty = ''
    this.LocationstoreData = []
  }
  clearRawmat() {
    this.Materialupdatebtn = false
    this.StockRequestmaterialForm.reset()
    this.StockRequestmaterialForm.controls['Priority'].setValue('')
    this.StockRequestmaterialForm.controls['Descripation'].setValue('')
    this.StockRequestmaterialForm.controls['Specification'].setValue('')
    this.materialname = ''
    this.Quantity = ''
    this.UOM = ''
    // this.minmaxreorderarray = []
    this.IndentDetalisData = []
    // this.StockAvlData = []
    this.Rawmateriladata = []
    this.txtQty = ''
    this.Machines = []
    this.LocationstoreData = []
  }
  ii: any
  deleteMat() {
    if (this.IntendScheduleSave.length > 0) {
      for (let i = 0; i < this.IntendScheduleSave.length; i++) {
        console.log(this.Material[this.schInd].MaterialId, 'mattabel');
        console.log(this.IntendScheduleSave[i].MaterialIdSave, 'sctabel');
        if (this.Material[this.schInd].MaterialId === this.IntendScheduleSave[i].MaterialIdSave) {
          this.IntendScheduleSave.splice(i, 1)
          //  i = -1
          this.POIntentDisablebtn[this.IndentdisIndex] = false
          console.log(this.IntendScheduleSave.splice(i, 1), 'slice');
        }
      }
      this.Material.splice(this.schInd, 1)
    } else {
      this.Material.splice(this.schInd, 1)
    }

  }
  schInd: number = 0
  RemoveIntentMaterial(Index: any) {
    this.error = 2
    this.ErrorMsg = ''
    this.ErrorMsg = 'If You Want to Delete Material... !'
    // const delte = document.getElementById('Error') as HTMLInputElement
    // delte.click()
    this.Error01.nativeElement.click()
    this.schInd = Index

  }

  click: string = 'Y'
  IndemtremoveIndex: number = 0
  Qtycorrection(Index: any) {
    this.IndemtremoveIndex = Index
  }
  EditQty() {
    if (this.IntendScheduleSave.length > 0) {
      if (this.click == 'Y') {
        this.ErrorMsg = ''
        this.ErrorMsg = "Do You Want  Change The Quantity ?" +
          "If You Change,Indent Schdeule Will be Delete"
        // const value = document.getElementById('Error') as HTMLInputElement
        // value.click()
        this.Error01.nativeElement.click()
      }
    }
  }
  changeQty() {
    console.log('sddhsf');
    if (this.IntendScheduleSave.length > 0) {
      console.log(this.IndemtremoveIndex);
      for (let i = 0; i < this.IntendScheduleSave.length; i++) {
        console.log(this.Material[this.IndemtremoveIndex].MaterialId, this.IntendScheduleSave[i].MaterialIdSave);
        if (this.Material[this.IndemtremoveIndex].MaterialId === this.IntendScheduleSave[i].MaterialIdSave) {
          this.IntendScheduleSave.splice(i, 1)
          console.log(this.IntendScheduleSave.length);
          i = -1
          this.POIntentDisablebtn[this.IndentdisIndex] = false
        }
      }
    }
  }

  IndentMatName: string = ''
  // IndentQty: number = 0
  IntentSchRawMatName: string = ''
  IntentSchQty: any = 0
  IntentUom: string = ''
  IntentRawMatId: number = 0
  IndentdisIndex: number = 0
  scheduleindex: any
  POIntentDisablebtn = [false, false]
  IndentSchedule(Index: number) {
    this.IntendScheduleInsertArr = []
    this.scheduleindex = Index
    this.IndentdisIndex = Index
    this.Insertbtn = false
    const dialogRef = document.getElementById('indentscheduledialog') as HTMLInputElement
    dialogRef.click()
    this.IntentSchRawMatName = this.Material[Index].MaterialName
    this.IntentSchQty = this.Material[Index].Quantity
    this.IntentUom = this.Material[Index].UOM;
    this.IntentRawMatId = this.Material[Index].MaterialId
    console.log(this.IntentUom, 'this.IntentUom');
  }
  eventchck: string = 'N'
  CheckPOQty(): boolean {
    this.eventchck = 'Y'
    if (this.IntentQty === 0) {
      this.Insertbtn = true
    } else {
      this.Insertbtn = false
    }
    if (this.IntentQty > this.IntentSchQty) {
      this.toastr.warning("Quantity cannot be greater than Order Quantity.");
      return false;
    }
    return true;
  }



  Commitment_dt_Event(event: any) {
    this.Commitmentdate = event.target.value;

  }
  checkQty: number = 0
  valid: number = 0
  diffIntentQty: any
  IntentQty: any = ''
  Commitmentdate: any
  checkqty: any = 0
  IntendScheduleInsertArr: any[] = new Array()
  QuantityDisable: boolean = false
  BalQty: any[] = new Array()
  first: any = 0
  last: any
  Insertbtn: boolean = false
  InsertIntent() {
    if (!this.CheckPOQty()) {
      return;
    } else {
      if (this.valid === 0) {
        this.last = this.IntendScheduleInsertArr.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.Qty), 0);
        console.log(this.last);
        this.checkQty = parseFloat(this.IntentQty) + parseFloat(this.last)
        if (this.checkQty > this.IntentSchQty) {
          this.toastr.warning("Total quantity in table cannot exceed Order Quantity.");
          return;
        } else {
          this.IntendScheduleInsertArr.push({
            MaterialName: this.IntentSchRawMatName,
            MatlId: this.IntentRawMatId,
            Qty: parseInt(this.IntentQty),
            Sch_Dt: this.Commitmentdate,
            Sch_Commitment_Dt: this.frmdate
          });
          this.Commitmentdate = this.frmdate
          this.IndentSchComments = ''
          this.valid = 1
          this.IntentQty = parseFloat(this.IntentSchQty) - this.checkQty
          if (this.IntentQty === 0) {
            this.Insertbtn = true
          } else {
            this.Insertbtn = false
          }

        }
      }
      else {
        let y = 0
        for (let i = 0; i < this.IntendScheduleInsertArr.length; i++) {
          this.last = +  this.IntendScheduleInsertArr[i].Qty
          y = this.last + y
          console.log(y);

        }
        this.checkQty = parseFloat(this.IntentQty) + y
        if (this.checkQty > this.IntentSchQty) {
          this.toastr.warning("Total quantity in table cannot exceed Order Quantity.");
          return;
        } else {
          this.IntendScheduleInsertArr.push({
            MaterialName: this.IntentSchRawMatName,
            MatlId: this.IntentRawMatId,
            Qty: parseInt(this.IntentQty),
            Sch_Dt: this.Commitmentdate,
            Sch_Commitment_Dt: this.frmdate
          });
          this.Commitmentdate = this.frmdate
          this.IndentSchComments = ''
          this.IntentQty = parseFloat(this.IntentSchQty) - this.checkQty
          if (this.IntentQty === 0) {
            this.Insertbtn = true
          } else {
            this.Insertbtn = false
          }
        }
      }
    }
  }

  removevaild: string = 'N'
  removeqtyarray: any
  removearray: any[] = new Array()
  arr: any[] = new Array()
  RemoveIndent(Index: any) {
    this.removevaild = 'Y'
    const qty = this.IntendScheduleInsertArr[Index].Qty
    console.log(qty);
    this.removearray.push({
      RemoveQty: qty,
    })
    this.arr.push(this.diffIntentQty)
    this.removeqtyarray = this.removearray.reduce((accumulator, currentValue) => accumulator + currentValue.RemoveQty, 0)
    const lastElement = this.arr.pop()
    const beforeremoveQty = this.removeqtyarray
    this.diffIntentQty = parseFloat(beforeremoveQty)
    this.IntendScheduleInsertArr.splice(Index, 1);
    this.Insertbtn = false
  }
  IntendScheduleSave: any[] = new Array()
  IntentUpdateTabel: boolean = false
  Indentsave: boolean = false

  IndentSchSave() {
    let TotalIndetSChQty = 0;
    for (let i = 0; i < this.IntendScheduleInsertArr.length; i++) {
      TotalIndetSChQty += parseFloat(this.IntendScheduleInsertArr[i].Qty);
    }
    const ReqestQuantity = parseInt(this.IntentSchQty)
    if (ReqestQuantity === TotalIndetSChQty) {
      this.IntentUpdateTabel = true
      for (let i = 0; i < this.IntendScheduleInsertArr.length; i++) {
        this.IntendScheduleSave.push({
          Rawmaterial: this.IntendScheduleInsertArr[i].MaterialName,
          MaterialIdSave: this.IntendScheduleInsertArr[i].MatlId,
          Qty: this.IntendScheduleInsertArr[i].Qty,
          Sch_Dt: this.IntendScheduleInsertArr[i].Sch_Dt
        })
      }

      this.Material[this.scheduleindex].color = ''

      this.POIntentDisablebtn[this.IndentdisIndex] = true
      console.log(this.IntendScheduleSave, 'Indent Save');
      this.valid = 0
      this.BalQty = []
    }
    else {
      this.error = 3
      this.ErrorMsg = ''
      this.ErrorMsg = 'Please fill the full schedule'
      this.POIntentDisablebtn[this.IndentdisIndex] = false
      // const TotalIndetSChQtydialog = document.getElementById('Error')
      // TotalIndetSChQtydialog?.click()
      this.Error01.nativeElement.click()
      this.valid = 1
    }

  }
  IndentSchClear() {
    this.IntendScheduleSave = []
    this.IntendScheduleInsertArr = []
    this.valid = 0
    this.IntentQty = 0
    this.checkqty = 0
    this.last = 0
    this.diffIntentQty = 0
  }
  OldPOData: any[] = new Array()
  OldPo(Index: number) {
    this.IntentRawMatId = this.Material[Index].MaterialId
    this.Old()
  }
  Old() {
    this.service.OldPOView(this.loactionId, this.IntentRawMatId).subscribe((data: any) => {
      this.OldPOData = data
      console.log(this.OldPOData);
      if (this.OldPOData.length != 0) {
        console.log('dslk');

        const dialogRef = document.getElementById('OldPo') as HTMLInputElement
        dialogRef.click()
      } else {
        this.toastr.warning('No Records To Found')
        return
      }
    })
  }

  upload(event: any) {

  }
  AddAttackment() {

  }


  PurchaseReqSave: any[] = new Array()
  srnewtype: number = 0
  Status: string = 'Approved'
  SchIndentDetail: any[] = new Array()
  SchMatrlIndentDetail: any[] = new Array()
  PurchaseReqUpdate: any[] = new Array()
  Sts: string = ''
  Msg: string = ''
  GetSave() {
    this.getStockReqno()
    this.last = this.IntendScheduleSave.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.Qty), 0);
    const first = this.Material.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.Quantity), 0);
    if (parseFloat(this.last) === parseFloat(first)) {
      this.SchMatrlIndentDetail = []
      this.SchIndentDetail = []
      const Entrydatetime = this.date.transform(this.frmdate, 'yyyy-MM-dd hh:mm:ss')
      for (let i = 0; i < this.IntendScheduleSave.length; i++) {
        this.SchIndentDetail.push({
          SrScheduleDate: this.IntendScheduleSave[i].Sch_Dt,
          ScScheduleQty: this.IntendScheduleSave[i].Qty,
          Rawmatid: this.IntendScheduleSave[i].MaterialIdSave
        })
      }
      for (let i = 0; i < this.Material.length; i++) {
        this.SchMatrlIndentDetail.push({
          Rawmatid: this.Material[i].MaterialId,
          Srqty: this.Material[i].Quantity,
          Uom: this.Material[i].UOM,
          Materialspec: this.Material[i].Specification,
          Stockqty: this.Material[i].Stock,
          Descripation: this.Material[i].Descripation,
          Priority: this.Material[i].PriorityNo,
        })
      }
      this.PurchaseReqSave = []
      this.PurchaseReqSave.push({
        SrRefNo: this.StockReqNo,
        Empid: this.Empid,
        DeptID: this.Deptid,
        sr_newtype: this.indenttypevalue,
        capexno: this.capexno,
        capexnumber: this.capexdescripation,
        Status: this.Status,
        SRDesc: this.Purchaseindenttypeform.controls['SrDesc'].value,
        LocationId: this.loactionId,
        EntryDateTime: Entrydatetime,
        EntryEmpid: this.Empid,
        SchMatrlIndentDetail: this.SchMatrlIndentDetail,
        SchIndentDetail: this.SchIndentDetail

      })
      console.log(this.PurchaseReqSave, 'save');
      // this.spinnerService.show()
      this.service.Save(this.PurchaseReqSave).subscribe((data: any) => {
        this.PurchaseReqUpdate = data
        // this.spinnerService.hide()
        this.Sts = this.PurchaseReqUpdate[0].status
        this.Msg = this.PurchaseReqUpdate[0].Msg
        if (this.Sts === 'Y') {
          const Save = document.getElementById('Save') as HTMLInputElement
          Save.click()
        } else {
          const Save = document.getElementById('Save') as HTMLInputElement
          Save.click()
        }
      })
    } else {
      this.toastr.error('Please Schedule Indent For All Materials.... ');
      return
    }

  }
  finalSave() {
    this.getStockReqno()
    this.CapexNodata = []
    this.indentype = ''
    this.indenttypevalue=1
    this.StockRequestmaterialForm.reset()
    this.Materialupdatebtn = false
    this.Purchaseindenttypeform.reset()
    this.gobtn = false
    this.Material = []
    this.IntendScheduleSave = []
    this.IndentDetalisData = []
    this.IntendScheduleInsertArr = []
    this.OldPOData = []
    this.IntendPendingViewData = []
    this.MaterialPending = []
    this.PurchaseReqSave = []
    this.SchIndentDetail = []
    this.SchMatrlIndentDetail = []
    this.PurchaseReqUpdate = []
    this.Rawmateriladata = []
  }
  Logout() {
    this.router.navigate(['/login'], {});
  }
  Spinnercall() {
    this.spinnerService.show()
  }
}
