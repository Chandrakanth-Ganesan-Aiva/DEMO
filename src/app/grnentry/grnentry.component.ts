import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GrnEntryService } from '../service/grn-entry.service';
import { CustomizeDialogComponent } from '../customize-dialog/customize-dialog.component';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { map, retry } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-grnentry',
  templateUrl: './grnentry.component.html',
  styleUrl: './grnentry.component.scss'
})
export class GRNEntryComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FormGroup;
  subform: FormGroup;
  CleaningChargesForm: FormGroup;
  OthersForm: FormGroup;
  GeneralForm: FormGroup;

  filterControl = new FormControl;

  constructor(private date: DatePipe, private dialog: MatDialog, private fb: FormBuilder, private service: GrnEntryService) {
    this.form = this.fb.group({
      grnType: ['', Validators.required],
      grnRefNo: [{ value: '', disabled: true }, Validators.required],
      grnDate: [this.date.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      creditPeriod: ['', Validators.required],
      supplier: ['', Validators.required],
      gateEntryNo: ['', Validators.required],
      gateDate: [{ value: this.date.transform(new Date(), 'yyyy-MM-dd'), disabled: true }, Validators.required],
      vechileNo: ['', Validators.required],
      DcNo: ['', Validators.required],
      invoiceNo: ['', Validators.required],
      dcDate: [this.date.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      invoiceDate: [this.date.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      loadWeight: ['', Validators.required],
      tareWeight: ['', Validators.required],
      netWeight: ['', Validators.required],
      netWeight1: ['', Validators.required],
      packingWeight: ['', Validators.required],
      supplierRate: ['', Validators.required],
      ticketNo: ['', Validators.required],
      frieghtIncl: ['', Validators.required],
      Type: ['single', Validators.required],
      Material: ['']
    })

    this.subform = this.fb.group({
      rate: ['', Validators.required],
      currency: ['', Validators.required],
      exRate: ['', Validators.required],
      qcReq: ['', Validators.required],
    })

    this.CleaningChargesForm = this.fb.group({
      ClearingAgent: ['', Validators.required],
      Port: ['', Validators.required],
      Gstno: ['', Validators.required]
    })

    this.GeneralForm = this.fb.group({
      taxType: ['', Validators.required],
    })

    this.OthersForm = this.fb.group({
      linerName: ['', Validators.required],
      Amount: ['', Validators.required],
      TaxType: ['', Validators.required],
      Billno: ['', Validators.required],
      Billdate: [this.date.transform(new Date(), 'yyyy-MM-dd'), Validators.required]
    })
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]
  }
  LocationId: number = 0
  filteredOptions: any[] = [];


  Splibtn: boolean = false
  customizeDialog!: MatDialogRef<CustomizeDialogComponent>;
  ngOnInit() {
    this.Splibtn = true
    this.service.gateEntryDelay(this.LocationId).subscribe({
      next: (res: any) => {
        res.length = 0
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.Error = 'Some Gateentry is found more than 1 days. Please clear'
          this.userHeader = 'Error'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe(res => {
            this.customizeDialog = this.dialog.open(CustomizeDialogComponent, {
              disableClose: true,
              data: {
                Comp_Name: "grnEntry",
              },
            });
          })
        } else {


          this.getStockReqno()
          this.getGrnType()
          this.getParty()
          this.filterControl.valueChanges.pipe(map((search) =>
            this.grnPatyDetArr.filter((option: any) =>
              option.PartyName.toLowerCase().includes(search?.toLowerCase() || '')
            ))
          ).subscribe((filtered) => (this.grnPatyDetArrfilter = filtered));
        }
      }
    })
  }
  ngOnDestroy() {

  }
  // @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  @ViewChild('MaterialPaginator', { static: false }) MaterialPaginator!: MatPaginator;
  @ViewChild('WeightPaginator', { static: false }) WeightPaginator!: MatPaginator;
  ngAfterViewInit() {
    // this.poDetailDataSource.paginator = this.paginator;
    this.materialDataSource.paginator = this.MaterialPaginator
    this.WeightDataSource.paginator = this.WeightPaginator
  }
  masterid: number = 461
  StockReq: any[] = new Array();
  StockReqNo: string = ''
  getStockReqno() {
    let frmdate = this.date.transform(new Date(), 'yyyy-MM-dd')
    this.service.Stockreno(this.masterid, frmdate, this.LocationId).subscribe((res: any) => {
      if (res.length > 0) {
        if (res[0].status == 'N') {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          return this.opendialog()
        }
        this.StockReq = res
        this.form.controls['grnRefNo'].setValue(this.StockReq[0].translno)
      }
    })
  }
  grnTypeArr: any[] = new Array()
  getGrnType() {
    this.service.GrnEntryType().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.grnTypeArr = res
          this.form.controls['grnType'].setValue(res[0].TypeID)
        }
      }
    })
  }
  GrnTypeEvent() {
    if (this.form.controls['grnType'].value) {

    }
  }
  grnPatyDetArr: any[] = new Array()
  grnPatyDetArrfilter: any[] = new Array()
  getParty() {
    this.service.GrnEntryParty().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.grnPatyDetArr = res
          this.grnPatyDetArrfilter = res
        }
      }
    })
  }
  Currid: number = 0
  CleaningChargesTabHide = true
  PartyChangeEvent() {
    if (this.form.controls['supplier'].value) {
      this.grnPatyDetArrfilter.filter((item: any) => {
        item.PartyID == this.form.controls['supplier'].value
        return this.Currid = item.currid
      })
      if (this.Currid == 1) {
        this.CleaningChargesTabHide = false
      } else {
        this.CleaningChargesTabHide = true
      }
      this.form.controls['Type'].setValue('single')
      this.getGateEntryNo()
      this.getCeditPeriod()
      this.getCurrency()
      this.getClearingAgent()
      this.getLinear()
      this.gettaxType()
      this.getPort()
      this.getMaterialTabelDet()
      this.getWeigtDetalisTabel()
      this.gateEntryNofilter.valueChanges.pipe(map((search) =>
        this.gateEntryNoArr.filter((option: any) =>
          option.GateEntry_Ref_No.toLowerCase().includes(search?.toLowerCase() || '')
        ))
      ).subscribe((filtered) => (this.gateEntryNofilteredOptions = filtered));

      this.TaxTypefilterControl.valueChanges.pipe(map((search) =>
        this.taxTypeArr.filter((option: any) =>
          option.taxgroup.toLowerCase().includes(search?.toLowerCase() || '')
        ))
      ).subscribe((filtered) => (this.TaxTypeFilterOption = filtered));

    }
  }
  getCeditPeriod() {
    let Supid = this.form.controls['supplier'].value
    this.service.GrnCreditPeriod(Supid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.form.controls['creditPeriod'].setValue(res[0].creditperiod)
        }
      }
    })
  }
  getCurrency() {
    this.service.GrnCurrency(this.Currid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.subform.controls['currency']?.setValue(res[0].CurrWord)
          if (this.Currid !== 1) {
            this.form.controls['exRate']?.enable()
          } else {
            this.form.controls['exRate']?.disable()
          }
        }
      }
    })
  }
  MainTab(event: MatTabChangeEvent) {
    let label = event.tab.textLabel

  }
  clearingAgentArr: any[] = new Array()
  getClearingAgent() {
    this.service.GrnClearingAgent().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.clearingAgentArr = res
        }
      }
    })
  }
  PortArr: any[] = new Array()
  getPort() {
    this.service.GrnPort().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.PortArr = res
        }
      }
    })
  }
  LinearArr: any[] = new Array()
  getLinear() {
    this.service.GrnLinear().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.LinearArr = res
        }
      }
    })
  }
  TaxTypefilterControl = new FormControl
  taxTypeArr: any[] = new Array()
  TaxTypeFilterOption: any[] = new Array()
  gettaxType() {
    this.service.GrnTaxType().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.taxTypeArr = res
          this.TaxTypeFilterOption = res
        }
      }
    })
  }
  materialDataSource = new MatTableDataSource()
  getMaterialTabelDet() {
    let Supid = this.form.controls['supplier'].value
    this.service.GrnMaterialTabel(Supid, this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          let arr = {
            received: '',
            Select: false
          }
          res.forEach((item: any) => {
            Object.assign(item, arr)
          });
          this.materialDataSource.data = res
          this.materialDataSource.data = structuredClone(this.materialDataSource.data)
          this.materialDataSource.paginator = this.MaterialPaginator
        }
      }
    })
  }

  gateEntryNoArr: any[] = new Array()
  gateEntryNofilter = new FormControl;
  gateEntryNofilteredOptions: any[] = [];
  getGateEntryNo() {
    let Supid = this.form.controls['supplier'].value
    this.service.GrmGateEntry(Supid, this.LocationId, Supid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.gateEntryNoArr = res
          this.gateEntryNofilteredOptions = res
        }
      }
    })
  }
  GateEntryRefNo: number = 0
  gateEntryChangeEvent() {
    if (this.form.controls['gateEntryNo'].value) {
      this.gateEntryNofilteredOptions.filter((item: any) => {
        if (item.gateentryno == this.form.controls['gateEntryNo'].value) {
          return this.GateEntryRefNo = item.GateEntry_Ref_No
        }

      })
      this.gateEntryDelay()
      this.getMaterial()
      this.form.controls['netWeight1'].disable()
      this.form.controls['Type'].setValue('single')
    }
  }
  Item: any[] = new Array()
  getMaterial() {
    let Supid = this.form.controls['supplier'].value
    this.service.GrnMaterial(Supid, this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.Item = res
          this.form.controls['Material'].setValue(this.Item[0].rawmatid)
        }
      }
    })
  }
  WeightDataSource = new MatTableDataSource()
  WeightTabelArr: any[] = new Array()
  getWeigtDetalisTabel() {
    let Supid = this.form.controls['supplier'].value
    let Dcdate = this.form.controls['dcDate'].value
    this.service.GrnWeightTabel(this.LocationId, Supid, this.GateEntryRefNo, Dcdate).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.WeightTabelArr = res
          this.WeightDataSource.data = structuredClone(this.WeightTabelArr)
          this.WeightDataSource.paginator = this.WeightPaginator
        }
      }
    })
  }
  gateEntryDelay() {
    let GatentryNo = this.form.controls['gateEntryNo'].value
    this.service.GrnGateEntrydelayVaild(GatentryNo).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          let GateEntryDate = this.date.transform(res[0].GateEntryDate, 'yyyy-MM-dd') || ''
          this.form.controls['DcNo'].setValue(res[0].dcno)
          this.form.controls['invoiceNo'].setValue(res[0].dcno)
          this.form.controls['dcDate'].setValue(res[0].dcdate)
          this.form.controls['invoiceDate'].setValue(res[0].dcdate)
          this.form.controls['gateDate'].setValue(GateEntryDate)
          this.form.controls['vechileNo'].setValue(res[0].VechicleNo)
          const today = new Date();
          const gateDate = new Date(GateEntryDate); // Convert string to Date object

          const gateDateTime = gateDate.getTime(); // Get time in milliseconds
          const diff = Math.floor((today.getTime() - gateDateTime) / (1000 * 60 * 60 * 24));
          if (diff > 3) {
            this.Error = 'You cannot enter more than 3 day gate entry details'
            this.userHeader = 'Error'
            return this.opendialog()
          }
        }
      }
    })
  }
  selectedRawmatControl = new FormControl(null);
  selectedRawmatid: number = 0
  selectedUom: string = ''
  SelectedRow: any
  SelectedRecivedQty: number = 0
  TicketNumberArr: any[] = new Array()
  getPackingDet(row: any) {
    if (this.materialDataSource.data.length > 0) {
      this.SelectedRow = row
      this.selectedRawmatid = row.rawmatid;
      this.selectedUom = row.uom
      this.SelectedRecivedQty = row.received
      console.log("Selected Rawmat ID:", this.selectedRawmatid);
      // this.TicketNumberArr = structuredClone(this.WeightTabelArr)
    }
    let Supid = this.form.controls['supplier'].value
    let Dcdate = this.form.controls['dcDate'].value
    this.service.GrnWeightTabel(this.LocationId, Supid, this.GateEntryRefNo, Dcdate).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.TicketNumberArr = res
        }
      }
    })
  }
  ShelflifeDatasource = new MatTableDataSource()
  NetWt: number = 0
  TareWt: number = 0
  totperc: number = 0
  tolkgs: number = 0
  penqty: number = 0
  grnqty: number = 0
  texrate: number = 0
  poDetailArr: any[] = new Array()
  POdetalis(row: any) {

    if (!this.form.controls['ticketNo'].value) {
      this.Error = 'Please Select Ticket Number'
      this.userHeader = 'Warning!!'
      return this.opendialog()
    }
    if (row.received == 0) {
      this.Error = 'Please enter the GRN Qty'
      this.userHeader = 'Warning!!'
      return this.opendialog()
    }
    if (this.materialDataSource.data.length > 0) {
      this.SelectedRow = row
      this.selectedRawmatid = row.rawmatid;
      this.selectedUom = row.uom
      this.SelectedRecivedQty = row.received
      console.log("Selected Rawmat ID:", this.selectedRawmatid);
      // this.TicketNumberArr = structuredClone(this.WeightTabelArr)
    }
    this.service.GrnPackingWt1(this.selectedRawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          this.NetWt = res[0].netwt
          this.TareWt = res[0].tarewt
        }
      }
    })
    this.service.GrnShelflife(this.selectedRawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          if (res[0].shelflifeitem == 'Y') {
            this.ShelflifeDatasource.data = row
          }
        }
      }
    })
    console.log((Number(row.received), Number(this.SelectedRow.stocktopurchasecf)), this.NetWt, this.TareWt);

    let PackingWt:number = Math.round((Number(row.received) * Number(this.SelectedRow.stocktopurchasecf)) / this.NetWt * this.TareWt)
    if (isNaN(PackingWt)) {
      console.warn("packingWeight is NaN, using 0 instead");
      PackingWt = 0;
    }
    this.form.controls['packingWeight'].setValue(PackingWt)
    this.form.controls['netWeight'].setValue((Number(this.form.controls['netWeight1'].value)) - (Number(this.form.controls['packingWeight'].value)))
    // alert( this.form.controls['netWeight'].value)
    console.log(this.form.controls['netWeight'].value);
    
    this.service.GrnInspecReq(this.selectedRawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          if (res[0].InspecReq == 1) {
            this.subform.controls['qcReq'].setValue('qcReq')
            this.subform.controls['qcReq'].disable()
            // this.ShelflifeDatasource.data=row
          } else {
            this.subform.controls['qcReq'].setValue('')
            this.subform.controls['qcReq'].enable()
          }
        }
      }
    })
    if (this.Item.length > 0) {
      let Supid = this.form.controls['supplier'].value
      let rawmatId = this.form.controls['Material'].value
      this.service.GrnTolType(rawmatId, Supid).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              return this.opendialog()
            }
            if (res[0].toltype == 'P') {
              this.totperc = res[0].totvalue
            }
            if (res[0].toltype == 'W') {
              this.tolkgs = res[0].totvalue
            }
          }
        }
      })

      if (this.Currid === 1 && this.subform.controls['exrate']?.value === 1) {
        this.Error = 'Exchange Rate cannot be 1 Rupee'
        this.userHeader = 'Warning!!'
        return this.opendialog()
      }
      this.service.GrnPoDetailTable(Supid, rawmatId, this.LocationId).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status === 'N') {
              this.Error = res[0].Msg;
              this.userHeader = 'Error';
              return this.opendialog();
            }
            this.poDetailArr = res;
            console.log(this.poDetailArr);
            alert(res[0].rate)
            console.log(res[0].rate);
            
            this.subform.controls['rate'].setValue(res[0].rate);
            this.totperc = res[0].percofexcp;
            this.tolkgs = res[0].tolerancekgs;
            this.subform.controls['exRate'].setValue(this.Currid > 1 ? res[0].exrate : 1);

            this.penqty = Number(this.form.controls['netWeight'].value) * Number(row?.stocktopurchasecf);
            this.grnqty = Number(this.SelectedRecivedQty) * Number(row?.stocktopurchasecf );
            console.log( this.penqty,this.grnqty);
            
            let Pdetalis: any[] = [];

            this.poDetailArr.filter((element: any) => {
              console.log(element);
              if (element.pending > 0) {
                console.log(1);

                let FreightVal = element.freight && element.ord_qty ? Number(element.freight) / Number(element.ord_qty) : 0;
                let ActFreightVal = (Math.round(Number(element.freight || 0) / Number(element.ord_qty || 1))).toFixed(2);

                if (this.form.controls['supplierRate'].value === 0) {
                  this.form.controls['supplierRate'].setValue(element.rate);
                }

                const disc = element.disc ? Number(element.disc) : 0;
                let GRateVal = Number(element.rate) - (Number(element.rate) * (disc > 0 ? disc / 100 : 0));
                this.form.controls['supplierRate'].setValue(GRateVal);
                this.subform.controls['rate'].setValue(GRateVal);
                this.texrate = this.subform.controls['rate'].value;

                let ReceivedVal = 0;
                let GRNQtyVal = 0;
                if (this.penqty > 0) {
                  if (element.pending > this.penqty) {
                    ReceivedVal = this.penqty;
                    this.penqty = 0;
                  } else {
                    ReceivedVal = element.pending;
                    this.penqty -= element.pending;
                  }
                }
                if (this.grnqty > 0) {
                  if (element.pending > this.grnqty) {
                    GRNQtyVal = this.grnqty;
                    this.grnqty = 0;
                  } else {
                    GRNQtyVal = element.pending;
                    this.grnqty -= element.pending;
                  }
                }
                Pdetalis.push({
                  Select: false,
                  poid: element.poid,
                  uom: element.UOM,
                  pono: element.pono,
                  podate: this.date.transform(element.podate, 'yyyy-MM-dd'),
                  poproductid: element.poproductid,
                  ord_qty: element.ord_qty,
                  grnqty: element.grnqty,
                  rejqty: element.rejqty,
                  pending: element.pending,
                  rate: element.rate.toFixed(3),
                  Received: ReceivedVal,
                  postingaccountid: element.postingaccountid,
                  RateInclusiveOfAllTaxes: element.RateInclusiveOfAllTaxes,
                  disc: element.disc,
                  StockToPurchaseCF: element.StockToPurchaseCF,
                  GRate: GRateVal,
                  GRNQty: GRNQtyVal,
                  Diff: Number(GRNQtyVal) - Number(ReceivedVal),
                  Freight: FreightVal,
                  ActFreight: ActFreightVal,
                });
              }
            });
            this.PoDetailsDdatasource.data = [...Pdetalis];
            console.log(this.PoDetailsDdatasource.data, 'pgfydftyret');
          }
        }
      });

    }
  }
  PoDetailsDdatasource = new MatTableDataSource()
  ticketChangeEvent() {
    this.service.GrnPackingWt(this.selectedRawmatid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            return this.opendialog()
          }
          const NetWt = res[0].netwt
          const TareWt = res[0].tarewt
          const PackingWt = Math.round((Number(this.SelectedRecivedQty) * Number(this.SelectedRow.stocktopurchasecf)) / NetWt * TareWt)
          console.log(PackingWt,'pack');
          
          this.form.controls['packingWeight'].setValue(PackingWt)
          // alert(PackingWt)
        }
      }
    })
    this.TicketNumberArr.forEach((item: any) => {
      if (this.selectedUom == 'Ton') {
        this.form.controls['loadWeight'].setValue(item.loadedweight / 1000)
        this.form.controls['netWeight1'].setValue(item.NetWeight / 1000)
        this.form.controls['tareWeight'].setValue(item.EmptyWeight / 1000)
        this.form.controls['netWeight'].setValue((item.NetWeight / 1000) - (this.form.controls['packingWeight'].value))
      } else {
        this.form.controls['loadWeight'].setValue(item.loadedweight)
        this.form.controls['netWeight1'].setValue(item.NetWeight)
        this.form.controls['tareWeight'].setValue(item.EmptyWeight)
        this.form.controls['netWeight'].setValue((item.NetWeight) - (this.form.controls['packingWeight'].value))
      }

    })
  }

  Clear() {
    window.location.reload()
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
