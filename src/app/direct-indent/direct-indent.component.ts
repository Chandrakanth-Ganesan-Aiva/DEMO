import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DirectIndentService } from '../service/direct-indent.service';
import { data } from 'jquery';
import { map, Observable, startWith } from 'rxjs'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-direct-indent',
  templateUrl: './direct-indent.component.html',
  styleUrls: ['./direct-indent.component.scss']
})
export class DirectIndentComponent implements OnInit {
  showSubSubMenu: boolean = false;
  indentype: string = ''
  currentDate1 = new Date()
  currentDate = new Date()
  frmdate: any
  planmonth: any;
  Directindenttypeform!: FormGroup;
  StockRequestmaterialForm!: FormGroup;
  checked: string = ''
  items: any[] = new Array()
  LoactionId: number = 0
  Empid: number = 0
  filteredOptions: any = ''
  fileInput: any;
  constructor(private router: Router, private date: DatePipe, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder, private service: DirectIndentService) { }
  @ViewChild('Termsbtnupdate') Termsbtnupdate!: ElementRef;
  ngOnInit(): void {
    this.frmdate = this.date.transform(this.currentDate, 'yyyy-MM-dd');
    this.planmonth = this.date.transform(this.currentDate, 'yyyy-MM');
    this.Commitmentdate = this.date.transform(this.currentDate1, 'yyyy-MM-dd');
    console.log(this.frmdate);

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    console.log(this.Empid);

    this.Directindenttypeform = this.formBuilder.group({
      Costcenter: new FormControl(''),
      Category: new FormControl(''),
      Department: new FormControl(''),
      Approvedby: new FormControl('', Validators.required),
      Employee: new FormControl('', Validators.required),
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
    })
    this.Comm_Date()
    this.GetIndentPath()
    this.GetCostCenter()
  }

  Comm_Date() {
    $(document).ready(function () {
      var today = new Date().toISOString().split('T')[0];
      $('#date').attr('min', today);
    });
  }
  Indentpath: string = ''
  errorMessage: string = ''
  GetIndentPath() {
    // this.LoactionId = 2
    // this.frmdate = '2023-04-01'
    this.service.PoPath(this.LoactionId, this.frmdate).subscribe({ next: (data: any) => {
        const path = data
        console.log(path, 'path');
        if (path.length !== 0) {
          this.Indentpath = path[0].prefix + '/' + path[0].compshort + '/' + path[0].yeardisplay
          console.log(this.Indentpath, 'this.Indentpath');
          this.GetIndentNo()
        } else {
          this.toastr.warning('Please Chcek Indent No');
          return
        }
      },
      error: (error) => {
        this.errorMessage = error;
        const Error = document.getElementById('apierror') as HTMLInputElement
        Error.click()
      },
      complete: () =>  this.GetCostCenter()
    })



  }
  IndentReqNo: string = ''
  GetIndentNo() {
    this.service.IndentPONo(this.Indentpath).subscribe({next:(data: any) => {
      const IndentNoData = data
      console.log(IndentNoData, 'IndentNoData');
      if (IndentNoData.length !== 0) {
        const IndentNo = IndentNoData[0].Pono
        this.IndentReqNo = this.Indentpath + '/' + IndentNo
        console.log(this.IndentReqNo, 'this.IndentReqNo');

      }
    },
    error: (error) => {
      this.errorMessage = error;
      const Error = document.getElementById('apierror') as HTMLInputElement
      Error.click()
    },

    })
  }
  costcenterData: any[] = new Array()
  CostName: string = ''

  GetCostCenter() {
    this.service.CostCenter().subscribe((data: any) => {
      this.costcenterData = data;
      console.log(this.costcenterData, 'costcenterData');
      if (this.costcenterData.length === 0) {
        this.toastr.error('Please Check CostCenter');
        return
      }
      if (this.costcenterData.length === 1) {
        this.CostcenterId = this.costcenterData[0].costcentreid
        this.CostCenterName = this.costcenterData[0].costcentre
        this.GetDept()
      }
    })
  }
  CostcenterId: number = 0
  CostCenterName: string = ''
  CostcenterEvent(event: any) {
    this.CostcenterId = event.target.value
    const CostCenter = this.costcenterData.forEach((data: any) => {
      if (this.CostcenterId === data.costcentreid) {
        this.CostCenterName = data.costcentre
        console.log(this.CostCenterName, 'CostCenterName');
      }
    })
    console.log(this.CostcenterId, 'costcenterid');
    //
    this.GetDept()
  }
  DeptData: any[] = new Array()

  GetDept() {
    this.DeptData = []
    this.service.Department( this.LoactionId,this.Empid).subscribe((data: any) => {
      this.DeptData = data
      console.log(this.DeptData, 'this.DeptData');
      if (this.DeptData.length === 1) {
        this.deptId = this.DeptData[0].deptid
        console.log( this.deptId );
        
        this.GetCategory()
      }
    })
  }
  deptId: number = 0
  DeptEvent(event: any) {
    this.deptId = event.target.value
    console.log(this.deptId, 'deptid');
    this.GetCategory()
  }
  EmpCat: any[] = new Array()
  GetCategory() {
    this.LoactionId = 1
    this.service.EmpCat(this.Empid, this.LoactionId).subscribe((res: any) => {
      this.EmpCat = res
      console.log(this.EmpCat, 'Category');
      if (this.EmpCat.length === 1) {
        this.Categoryid = this.EmpCat[0].catid
        this.GetApproved()
      }
    })
  }
  Categoryid: number = 0
  CategoryEvent(event: any) {
    this.Categoryid = event.target.value
    console.log(this.Categoryid, 'catid');
    this.GetApproved()
  }
  ApprovedData: any[] = new Array()
  GetApproved() {
    this.service.EmpApr(this.LoactionId, this.deptId, this.CostCenterName).subscribe((data: any) => {
      this.ApprovedData = data
      console.log(this.ApprovedData, 'this.ApprovedData');
      if (this.ApprovedData.length === 1) {
        this.ApprovedId = this.ApprovedData[0].empid
        console.log(this.Categoryid);
        this.GetEmployee()
      }
    })
  }
  ApprovedId: number = 0
  ApproveEvent(event: any) {
    this.ApprovedId = event.target.value
    console.log(this.ApprovedId, 'ApprovedId');
    this.GetEmployee()
  }
  EmployeeData: any[] = new Array()
  GetEmployee() {
    this.service.EmpDet(this.LoactionId, this.Empid, this.Categoryid).subscribe((data: any) => {
      this.EmployeeData = data
      console.log(this.EmployeeData, ' EmployeeData');
      if (this.EmployeeData.length === 1) {
        this.employeeId = this.EmployeeData[0].empid
      }
    })
  }
  employeeId: number = 0
  EmployeeEvent(event: any) {
    this.employeeId = event.target.value
  }
  get go(): { [key: string]: AbstractControl } {
    return this.Directindenttypeform.controls;
  }
  CapexNodata: any = new Array()
  getCapexNo() {
    this.service.CapexNo(this.LoactionId).subscribe((data: any) => {
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
  gobtn: any
  StockMaterialDeatlis: boolean = false
  IntentPending: number = 0
  Priority: any[] = new Array
  priorityvalue: number = 0
  Go() {
    debugger
    if (this.ApprovedData.length !== 1) {
      this.gobtn = true
      if (this.Directindenttypeform.invalid) {
        return;
      }
      else {
        if (this.StockRequestmaterialForm.controls['Priority'].value === 'Low') {
          this.priorityvalue = 0
        }
        else if (this.StockRequestmaterialForm.controls['Priority'].value === 'Medium') {
          this.priorityvalue = 1
        }
        else {
          this.priorityvalue = 2
        }
        this.StockMaterialDeatlis = true
        const material = document.getElementById("stockmatrial") as HTMLInputElement;
        material.click()
        console.log(this.IntentPending, 'IntentPending');
        this.Directindenttypeform.disable()
      }
    } else {
      if (this.employeeId === 0 || this.employeeId === undefined || this.employeeId === null) {
        this.toastr.warning('Please Select Employee')
        return
      }
      if (this.ApprovedId === 0 || this.ApprovedId === undefined || this.ApprovedId === null) {
        this.toastr.warning('Please Select Approved By')
        return
      }
      if (this.StockRequestmaterialForm.controls['Priority'].value === 'Low') {
        this.priorityvalue = 0
      }
      else if (this.StockRequestmaterialForm.controls['Priority'].value === 'Medium') {
        this.priorityvalue = 1
      }
      else {
        this.priorityvalue = 2
      }
      this.StockMaterialDeatlis = true
      const material = document.getElementById("stockmatrial") as HTMLInputElement;
      material.click()
      console.log(this.IntentPending, 'IntentPending');
      this.Directindenttypeform.disable()
    }

  }
  IndentClear() {
    this.gobtn = false
    this.Directindenttypeform.reset()
    this.Directindenttypeform.enable()
    this.GetCostCenter()
    this.GetDept()
    this.GetCategory()
    this.GetApproved()
    this.GetEmployee()
  }

  RawMatName: any = ''
  RawmatId: any = ''
  RawmatnamePar: any
  Rawmat(event: any) {
    this.Materialupdatebtn = false
    this.StockRequestmaterialForm.reset()
    this.RawmatnamePar = event.target.value
    console.log(this.RawmatnamePar);
    if (this.RawmatnamePar.length >= 2) {
      if (this.RawmatnamePar !== null && this.RawmatnamePar !== undefined && this.RawmatnamePar !== 0) {
        this.GetMaterial()
      } else {
        return;
      }
    } else if (this.RawmatnamePar.length < 2) {
      // console.log('dasfmsd');
      this.RawmaterilData = []
    }

  }
  searchFn: any;
  customSearchFn(term: string, item: any) {
    return item.RawmatName.toLowerCase().startsWith(term.toLowerCase())
  }
  RawmaterilData: any[] = new Array()
  GetMaterial() {
    this.service.RawMat(this.RawMatName, this.RawmatId).subscribe((data: any) => {
      this.RawmaterilData = data
      console.log(this.RawmaterilData);
      if (this.RawmaterilData.length !== 0) {
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
    const rawmatname = this.RawmaterilData.filter((res: any) => {
      if (this.Rawmatid === res.rawmatid) {
        this.materialname = res.gstrmatdisp
        console.log(this.materialname, 'material');
      }
    })
    if (this.Rawmatid !== null && this.Rawmatid !== undefined && this.Rawmatid !== 0) {
      for (let i = 0; i < this.Material.length; i++) {
        if (this.Material[i].MaterialName === this.materialname) {
          this.StockRequestmaterialForm.controls['material'].setValue('')
          const material = document.getElementById('mat') as HTMLInputElement
          material.click()
          material.focus()
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
  minlevel: number = 0
  getIndentDet() {
    this.frmdate = this.date.transform(this.currentDate, 'yyyy-MM-dd');
    console.log(this.LoactionId, this.frmdate, this.Rawmatid, this.deptId);

    this.spinnerService.show()
    this.service.IndentDet(this.LoactionId, this.frmdate, this.Rawmatid, this.deptId).subscribe((res: any) => {
      this.IndentDetalisData = res
      this.spinnerService.hide()
      console.log(this.IndentDetalisData, 'IndentDetalisData');
      debugger
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
        // this.txtQty = this.StockAvl - this.IndentDetalisData[0].Alloc_Stk_Qty
        this.txtQty = this.StockAvl - this.IndentDetalisData[0].Alloc_Stk_Qty
        this.minlevel = this.IndentDetalisData[0].Min_level
        this.StockRequestmaterialForm.controls['StockAvl'].setValue(this.IndentDetalisData[0].Store_Stk_Qty)
        this.minlevel = this.IndentDetalisData[0].Min_level
        this.StockAvl = this.IndentDetalisData[0].Store_Stk_Qty
      }
    })
  }
  Issuelocationwise: string = 'N'
  StockAvlData: any[] = new Array()
  StockAvl: number = 0
  frmmodule: number = 2
  indenttypevalue: any = ''
  GetStockAvl() {
    this.service.StockAvl(this.frmmodule, this.indenttypevalue, this.Issuelocationwise, this.Rawmatid, this.LoactionId, this.Empid, this.Issuelocaid).subscribe((res: any) => {
      this.StockAvlData = res
      console.log(this.StockAvlData, 'StockAvlData');
      if (this.Issuelocationwise == 'N') {
        if (this.StockAvlData.length !== 0) {
          this.StockAvl = this.StockAvlData[0].stock
          this.StockRequestmaterialForm.controls['StockAvl'].setValue(this.StockAvlData[0].stock)
          console.log(this.StockAvl, 'StockAvl');
        }
      } else {
        this.toastr.warning(this.StockAvlData[0].Msg)
      }

      if (this.minlevel > this.StockAvlData[0].stock) {
        const col1 = document.getElementById('stock') as HTMLInputElement
        col1.style.background = 'brown';
        col1.style.color = 'black';
        console.log(col1);
      } else {
        return
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
  GetLoactionStore() {
    this.service.StoreLoaction(this.LoactionId, this.Rawmatid).subscribe((res: any) => {
      this.LocationstoreData = res
      console.log(this.LocationstoreData, 'LocationstoreData');
      if (this.LocationstoreData.length == 0) {
        const loc = document.getElementById('storeloc') as HTMLInputElement
        loc.click()
      }
    })
  }
  storelocid: number = 0
  LocationstoreEvent(event: any) {
    this.storelocid = event.target.value
    console.log(this.storelocid, 'storelocid');
  }
  Machines: any[] = new Array()
  GetMachine() {
    this.service.Machine(this.LoactionId).subscribe((res: any) => {
      this.Machines = res;
      console.log(this.Machines, 'MACH');

    })
  }
  machid: number = 0
  machineEvent(event: any) {
    this.machid = event.target.value
    console.log(this.machid, 'MACH ID');

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
  IndentTypeId: number = 1
  IndentypeEvent(event: any) {
    this.indentype = event.value
    if (this.indentype === 'Regular') {
      this.IndentTypeId = 1
      console.log(this.IndentTypeId);
    }
    else if (this.indentype === 'Capex') {
      this.IndentTypeId = 2
      console.log(this.IndentTypeId);
    }
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
    // if(event.target.value > 5){
    //   this.toastr.warning('Please Enter Below or Equal to  Five' )
    //   event.target.value=0
    // }
  }
  PriorityNo: number = 0
  PriorityName: string = ''
  PriorityEvent(event: any) {
    this.PriorityNo = event.target.value
    const priority = this.Priority.forEach((res: any) => {
      if (this.PriorityNo === res.PriorityNo) {
        this.PriorityName = res.Priority
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
  getPriority() {
    if (this.StockRequestmaterialForm.controls['Priority'].value === 'Low') {
      this.PriorityNo = 1
    }
    else if (this.StockRequestmaterialForm.controls['Priority'].value === 'Medium') {
      this.PriorityNo = 2
    }
    else {
      this.PriorityNo = 3
    }
  }
  Materialupdatebtn: any
  Quantity: any = 0
  Material: any[] = new Array()
  Minstock: number = 0
  Maxstock: number = 0
  ReOrder: number = 0
  IndentNo: number = 0
  // Priority: string = ''
  AvlQty: any = 0
  viewmat: boolean = false
  MaterialUpdate() {
    console.log(this.Rawmatid);
    const descripation = this.StockRequestmaterialForm.controls['Descripation'].value
    this.Materialupdatebtn = true
    if (this.StockRequestmaterialForm.invalid) {
      return
    }
    else {
      this.AvlQty = this.StockAvl - this.txtQty
      console.log(this.AvlQty);
      const minimumlevelReach = this.AvlQty + this.minlevel

      if (minimumlevelReach > 0) {
        this.toastr.warning('Please raise Issue Indent. Already Stock is available', "Warning")
        this.Qty = 0
        return
      } else {
        console.log(this.Rawmatid);

        this.getPriority()
        this.Quantity = parseFloat(this.StockRequestmaterialForm.controls['MaterialQty'].value)
        debugger
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
        this.viewmat = true
        this.RawmaterilData = []
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
  matlcolor: any
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

    // this.RawmaterilData = []
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
    this.IndentDetalisData = []
    this.txtQty = ''
    this.Machines = []
    this.LocationstoreData = []
    // this.RawmaterilData = []
  }
  ii: any
  deleteMat() {
    debugger
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

    const delte = document.getElementById('deletematerial') as HTMLInputElement
    delte.click()
    this.schInd = Index

  }
  click: string = 'Y'
  IndemtremoveIndex: number = 0
  Qtycorrection(Index: any) {
    this.IndemtremoveIndex = Index
    debugger
    if (this.IntendScheduleSave.length > 0) {
      if (this.click == 'Y') {
        const value = document.getElementById('change') as HTMLInputElement
        value.click()
      }
    }
  }
  changeQty() {
    debugger
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

  Balance: any[] = new Array()
  eventchck: string = 'N'
  Insertbtn: boolean = false
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
  vaild: number = 0
  diffIntentQty: any
  IntentQty: any
  Commitmentdate: any
  checkQty: number = 0
  IntendScheduleInsertArr: any[] = new Array()
  QuantityDisable: boolean = false
  BalQty: any[] = new Array()
  valid: number = 0
  last: any
  IndentSchComments: string = ''
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
        debugger
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
      this.vaild = 0
      this.BalQty = []
    }
    else {
      this.POIntentDisablebtn[this.IndentdisIndex] = false
      const TotalIndetSChQtydialog = document.getElementById('TotalIndetSChQty')
      TotalIndetSChQtydialog?.click()
      this.vaild = 1
    }

  }
  IndentSchClear() {
    this.IntendScheduleSave = []
    this.IntendScheduleInsertArr = []
    this.valid = 0
    this.IntentQty = 0
    this.last = 0
    this.diffIntentQty = 0
  }
  OldPOData: any[] = new Array()
  OldPo(Index: number) {
    debugger
    this.IntentRawMatId = this.Material[Index].MaterialId
    this.Old()
  }
  Old() {
    this.service.OldPOView(this.LoactionId, this.IntentRawMatId).subscribe((data: any) => {
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
  DirectIndentSave: any[] = new Array()
  srnewtype: number = 0
  Status: string = 'Approved'
  DirectIndent_InventSrSchedule: any[] = new Array()
  DirectIndent_InventsrmMaterial: any[] = new Array()
  DirectIndentUpdate: any[] = new Array()
  Sts: string = ''
  Msg: string = ''
  GetSave() {
    this.GetIndentNo()
    this.last = this.IntendScheduleSave.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.Qty), 0);
    const first = this.Material.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.Quantity), 0);
    if (parseFloat(this.last) === parseFloat(first)) {
      this.DirectIndent_InventsrmMaterial = []
      this.DirectIndent_InventSrSchedule = []
      const Entrydatetime = this.date.transform(this.frmdate, 'yyyy-MM-dd hh:mm:ss')
      for (let i = 0; i < this.IntendScheduleSave.length; i++) {
        this.DirectIndent_InventSrSchedule.push({
          ScheduleDate: this.IntendScheduleSave[i].Sch_Dt,
          ScheduleQuantity: this.IntendScheduleSave[i].Qty,
          RawMatID: this.IntendScheduleSave[i].MaterialIdSave
        })
      }
      for (let i = 0; i < this.Material.length; i++) {
        this.DirectIndent_InventsrmMaterial.push({
          RawMatID: this.Material[i].MaterialId,
          PRQty: this.Material[i].Quantity,
          PRUom: this.Material[i].UOM,
          MaterialDesc: this.Material[i].Specification,
          DescRemark: this.StockRequestmaterialForm.controls['Descripation'].value,
          Priority: this.Material[i].PriorityNo,
          StockUomQty: this.Material[i].Quantity,
          ProdID: this.Material[i].MaterialId,
          Capexnumber: this.capexdescripation,
          Capexno: this.capexno,
        })
        console.log(this.DirectIndent_InventsrmMaterial);

      }
      this.DirectIndentSave = []
      this.DirectIndentSave.push({
        PR_Ref_No: this.IndentReqNo,
        DeptID: this.deptId,
        EmpID: this.Empid,
        ApprovalBy: this.ApprovedId,
        ApprovedBy: this.ApprovedId,
        PRDesc: this.Directindenttypeform.controls['SrDesc'].value,
        MatType: 'M',
        PRType: 'P',
        CostcenterId: this.CostcenterId,
        IndentTypeId: this.IndentTypeId,
        Entryempid: this.Empid,
        Entrycomputer: 'Tab Entry',
        LocationId: this.LoactionId,
        DirectIndent_InventsrmMaterial: this.DirectIndent_InventsrmMaterial,
        DirectIndent_InventSrSchedule: this.DirectIndent_InventSrSchedule

      })
      console.log(this.DirectIndentSave, 'save');
      this.spinnerService.show()
      this.service.Save(this.DirectIndentSave).subscribe((data: any) => {
        this.DirectIndentUpdate = data
        this.spinnerService.hide()
        this.Sts = this.DirectIndentUpdate[0].status
        this.Msg = this.DirectIndentUpdate[0].Msg
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
    this.GetIndentNo()
    this.CapexNodata = []
    this.indentype = ''
    this.StockRequestmaterialForm.reset()
    this.Materialupdatebtn = false
    this.Directindenttypeform.reset()
    this.gobtn = false
    this.Material = []
    this.IntendScheduleSave = []
    this.IndentDetalisData = []
    this.IntendScheduleInsertArr = []
    this.OldPOData = []
    this.IntendPendingViewData = []
    this.MaterialPending = []
    this.DirectIndentSave = []
    this.DirectIndent_InventsrmMaterial = []
    this.DirectIndent_InventSrSchedule = []
    this.DirectIndentUpdate = []
    this.RawmaterilData = []
  }

  upload(event: any) {

  }
  AddAttackment() {

  }

}


