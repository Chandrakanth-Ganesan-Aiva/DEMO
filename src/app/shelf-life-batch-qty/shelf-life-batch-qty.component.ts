import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SelflifeService } from '../service/selflife.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-shelf-life-batch-qty',
  templateUrl: './shelf-life-batch-qty.component.html',
  styleUrls: ['./shelf-life-batch-qty.component.scss']
})
export class ShelfLifeBatchQtyComponent implements OnInit {
  displayedColumns: string[] = ['GRN_Date', 'GRN_Id', 'Rawmatname', 'Spilt', 'UOM', 'Qty', 'Rate'];
  LocationId: number = 0
  selflife!: FormGroup
  Empid: string = ''
  constructor(private date: DatePipe, private service: SelflifeService, private fb: FormBuilder, private dialog: MatDialog) { }
  ngOnInit() {

    this.selflife = this.fb.group({
      GrnRefno: [''],
      party: [{ value: '', disabled: true }, [Validators.required]],
      dcno: [{ value: '', disabled: true }, [Validators.required]],
      partyid: [''],
      Grnno: ['']
    })

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.getGrnno()
  }
  filterControl = new FormControl()
  filteredOptions: any
  GrnnoData: any[] = new Array()
  errorMessage: string = ''
  getGrnno() {
    this.service.GrnNo(this.LocationId).subscribe({
      next: (res) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.GrnnoData = res
          this.filteredOptions = res
        }
      }
    })
  }
  grnnoEvent() {
    this.getSupplier()
    this.View()
    this.SpiltClick = false
    this.SplitBtachwiseArr.data = []
  }

  getSupplier() {
    this.service.Supplier(this.selflife.controls['GrnRefno'].value).subscribe({
      next: (res) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.selflife.controls['party'].setValue(res[0].PartyName)
          this.selflife.controls['partyid'].setValue(res[0].PartyId)
          this.selflife.controls['dcno'].setValue(res[0].Grn_Dc_No)
        }
      }
    })
  }

  ViewItem: any[] = new Array()
  Viewclick: boolean = false
  View() {
    if (this.selflife.invalid) {
      return
    }
    else {
      this.service.Viewbtn(this.selflife.controls['GrnRefno'].value).subscribe({
        next: (data: any) => {
          if (data.length >= 1) {
            if (data[0].status == 'N') {
              this.Error = data[0].Msg
              this.userHeader = 'Error'
              this.opendialog()
              return
            }
            this.ViewItem = data
            console.log(this.ViewItem);

            this.Viewclick = true
          }
        }
      })
    }
  }
  SplitBtachwiseArr: any = new MatTableDataSource()
  GrnQty: any
  mainatbelIndex: number = 0
  SpiltClick: boolean = false
  CurrGrnid: number = 0
  dataSource = new MatTableDataSource()
  SpiltBatchwise(Index: number) {
    this.mainatbelIndex = Index;
    this.CurrGrnid = this.ViewItem[Index].GRN_Id;

    const isExisting = this.SplitBtachwiseArr.data.some((item: { GrnId: number }) => item.GrnId === this.CurrGrnid);
    console.log(isExisting);

    if (!isExisting) {
      this.updateBtnDisable = true
      this.SpiltClick = true;
      this.SplitBtachwiseArr.data = [
        ...this.SplitBtachwiseArr.data,
        {
          GrnId: this.ViewItem[Index].GRN_Id,
          Rawmatid: this.ViewItem[Index].Rawmatid,
          Rate: this.ViewItem[Index].GRN_BasicPrice,
          TotalQty: this.ViewItem[Index].GRN_Qty,
          SplitQty: '',
          Batchno: '',
          Manfacturedate: '',
          BatchDate: ''
        }
      ];

    }

  }
  BatchnoEvent(event: any, element: any) {
    if (element.Batchno < 0) {
      element.Batchno = ''; // Prevent negative numbers
      return;
    }
    const duplicate = this.SplitBtachwiseArr.data.some(
      (item: any) => item !== element && item.Batchno === element.Batchno
    );
    if (duplicate) {
      this.warningError(` Batch No  <b style="color:brown"> ${element.Batchno} </b> is already assigned to another row  . Please use a unique Batch No.`);
      element.Batchno = ''; // Reset the value
    }
  }


  SpiltQtyEvent(Index: number) {
    const grnidsum = this.SplitBtachwiseArr.data.filter((a: any) => String(a.GrnId) === String(this.CurrGrnid));
    let SplitQty = grnidsum.reduce((accumulator: number, currentValue: any) =>
      accumulator + (parseFloat(currentValue.SplitQty) || 0), 0
    );
    if (parseFloat(this.SplitBtachwiseArr.data[Index].SplitQty) < 0) {
      this.SplitBtachwiseArr.data[Index].SplitQty = '';
    }
    if (grnidsum[0].TotalQty < parseFloat(SplitQty)) {
      this.Error = 'Spilt Qty is  <b style="color:brown"> ' + SplitQty + ' </b> </br> GRN Qty is <b style="color:brown">  ' + this.SplitBtachwiseArr.data[Index].TotalQty + ' </b> </br> ' +
        ' Spilt Qty should not Greater Than The GRN Qty '
      this.userHeader = 'Warning!!'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: any) => {
        this.SplitBtachwiseArr.data[Index].SplitQty = ''
      })
      return
    }
    if (grnidsum[0].TotalQty === parseFloat(SplitQty)) {
      this.updateBtnDisable = false
    } else {
      this.updateBtnDisable = true
    }

  }

  ManfDtEvent(element: any) {
    if (element.Manfacturedate) {
      // Ensure BatchDate is not less than ManufactureDate
      if (element.BatchDate && new Date(element.BatchDate) < new Date(element.Manfacturedate)) {
        element.BatchDate = null; // Reset BatchDate if it's invalid
      }
    }
  }
  getNextDay(date: string | Date): string | null {
    if (!date) return null;
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 2); // Move to the next day
    return nextDay.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  }

  updateBtnDisable: boolean = true
  Addbtndisable = [true, true]
  addindex: number = 0
  add(index: number) {
    this.addindex = index
    if (this.addindex < this.SplitBtachwiseArr.data.length) {
      this.addindex++; // Increment index
    }

    const { SplitQty, Batchno, Manfacturedate, BatchDate } = this.SplitBtachwiseArr.data[index];
    if (!Batchno) return this.warningError('Please Enter BatchNo on  <b style="color:brown"> Rownumber ' + index + '... </b>');
    if (!SplitQty) return this.warningError('Please Enter  Qty on  <b style="color:brown"> Rownumber ' + index + '... </b>...');
    if (SplitQty <= 0) return this.warningError(' Qty Should Be Greater Than Zero on  <b style="color:brown"> Rownumber ' + index + '... </b>...')
    if (!Manfacturedate) return this.warningError('Please Enter Manufacture Date on  <b style="color:brown"> Rownumber ' + index + '...</b>...');
    if (!BatchDate) return this.warningError('Please Enter Expiry Date on  <b style="color:brown"> Rownumber ' + index + '...</b>...');
    if (Manfacturedate >= BatchDate) return this.warningError('Manfacturedate cannot be excced Expiry Date on  <b style="color:brown"> Rownumber ' + index + '...</b>');
    this.SplitBtachwiseArr.data.forEach((mainarray: any) => {
      let totalsplit = this.selflifeupdate
        .filter(subarray => subarray.GRN_Id == mainarray.GrnId)
        .reduce((acc: any, curr: any) => acc + curr.BatchQty, 0)

      if (totalsplit === mainarray.GRN_Qty) return
    });
    console.log(this.SplitBtachwiseArr.data);

    const grnidsum = this.SplitBtachwiseArr.data.filter((a: any) => String(a.GrnId) === String(this.CurrGrnid));
    let totalSplitQty = grnidsum.reduce((accumulator: number, currentValue: any) =>
      accumulator + (parseFloat(currentValue.SplitQty) || 0), 0
    );
    if (parseInt(grnidsum[0].TotalQty) !== totalSplitQty) {
      this.updateBtnDisable = true
      this.SplitBtachwiseArr.data = [
        ...this.SplitBtachwiseArr.data,
        {
          GrnId: this.ViewItem[this.mainatbelIndex].GRN_Id,
          Rawmatid: this.ViewItem[this.mainatbelIndex].Rawmatid,
          Rate: this.ViewItem[this.mainatbelIndex].GRN_BasicPrice,
          TotalQty: this.ViewItem[this.mainatbelIndex].GRN_Qty,
          SplitQty: '',
          Batchno: '',
          Manfacturedate: '',
          BatchDate: ''
        }
      ];
      console.log(this.SplitBtachwiseArr.data);
      this.Addbtndisable[index] = true;
    } else {
      this.warningError('You Cannot Enter more than GRN Qty. <b style="color:brown"> For Grnid ' + this.CurrGrnid + ' </b>...');
      this.updateBtnDisable = false
      return
    }

    // this.UpdateBtndisable = parseInt(this.SplitBtachwiseArr.data[index].TotalQty) !== totalSplitQty;
  }
  DeleteBatchSplit(Index: number) {
    if (this.SplitBtachwiseArr && this.SplitBtachwiseArr.data && Index >= 0 && Index < this.SplitBtachwiseArr.data.length) {
      this.SplitBtachwiseArr.data.splice(Index, 1);
      console.log(this.selflifeupdate);

      this.selflifeupdate.splice(Index, 1);
      console.log(this.selflifeupdate);
      console.log(this.SplitBtachwiseArr.data);

      this.SplitBtachwiseArr.data = [...this.SplitBtachwiseArr.data];

      if (this.SplitBtachwiseArr.data.length === 0) {
        this.SpiltClick = false;
      }
    } else {
      console.log("Invalid Index or data is undefined");
    }
  }
  enabledIndex = 0;
  selflifeupdate: any[] = new Array()
  ItemUpdate() {
    const validationFailed = this.SplitBtachwiseArr.data.some((item: any, index: number) => {
      if (!item.Manfacturedate) {
        this.warningError('Please Check Manufacture Date on row <b style="color:brown"> Row number ' + (index + 1) + '   </b>');
        return true; // Stop execution
      }

      if (!item.BatchDate) {
        this.warningError('Please Check Expiry Date on row <b style="color:brown"> Row number ' + (index + 1) + ' </b>');
        return true; // Stop execution
      }

      if (item.Manfacturedate && item.BatchDate && item.Manfacturedate >= item.BatchDate) {
        this.warningError('Manufacture date cannot exceed Expiry Date on <b style="color:brown"> Row number ' + (index + 1) + ' </b>');
        return true; // Stop execution
      }

      return false; // Continue checking other rows
    });
    if (validationFailed) return;

    const grnidsum = this.SplitBtachwiseArr.data.filter((a: any) => String(a.GrnId) === String(this.CurrGrnid));
    let QtySplit = grnidsum.reduce((accumulator: number, currentValue: any) =>
      accumulator + (parseFloat(currentValue.SplitQty) || 0), 0
    );

    if (grnidsum[0].TotalQty === parseFloat(QtySplit)) {
      if (this.enabledIndex < this.ViewItem.length - 1) {
        this.enabledIndex++;
      }
      this.selflifeupdate = this.SplitBtachwiseArr.data.map((item: any) => ({
        GRN_NO: this.selflife.controls['GrnRefno'].value,
        GRN_Id: item.GrnId,
        RawmatId: item.Rawmatid,
        Batchno: item.Batchno,
        BatchQty: item.SplitQty,
        BatchDate: this.date.transform(item.BatchDate, 'yyyy-MM-dd'),
        ManufactureDate: this.date.transform(item.Manfacturedate, 'yyyy-MM-dd'),
        Rate: item.Rate,
      }));

      this.SplitBtachwiseArr.data.forEach((element: any) => {
        if (this.CurrGrnid == element.GrnId) {
          element.disabled = true;
        }
      });

      console.log(this.selflifeupdate);
    }

    if (grnidsum[0].TotalQty !== QtySplit) {
      this.warningError(' Split Qty is <b style="color:brown">' + QtySplit + '</b> </br>  GRN Qty is <b style = "color:brown" > ' + grnidsum[0].TotalQty + ' </b> </br>  Please Check The Qty');
      this.enabledIndex--;
      return;
    }

    const firstArrayGrnIds = this.ViewItem.filter((item: { GRN_Id: any; }) => item.GRN_Id);
    const secondarray = Array.from(
      new Set(this.selflifeupdate.map(item => item.GRN_Id))
    ).map(GRN_Id => this.selflifeupdate.find(item => item.GRN_Id === GRN_Id));

    if (firstArrayGrnIds.length == secondarray.length) {
      this.saveBtnDisabled = false;
    }
  }

  ItemClear(){
    this.SpiltClick=false
    this.enabledIndex=0
    this.SplitBtachwiseArr.data=[]
    this.selflifeupdate=[]
  }

  saveBtnDisabled: boolean = true
  saveVaild() {
    // console.log(this.SplitBtachwiseArr.data);

    for (let mainarray of this.SplitBtachwiseArr.data) {
      console.log(mainarray.GrnId);

      let totalsplit = this.selflifeupdate
        .filter(subarray => subarray.GRN_Id == mainarray.GrnId)
        .reduce((acc: any, curr: any) => acc + curr.BatchQty, 0)
      console.log(totalsplit, mainarray.TotalQty);

      if (totalsplit != mainarray.TotalQty) return this.warningError('Mismatch for GRN_ID:  <b style="color:brown"> ' + mainarray.GrnId + '. </b> </br> Expected:  <b style="color:brown"> ' + mainarray.TotalQty + ', </b> </br> Found:  <b style="color:brown">' + totalsplit + ' </b> ')

      const firstArrayGrnIds = this.ViewItem.filter((item: { GRN_Id: any; }) => item.GRN_Id);
      const secondarray = Array.from(
        new Set(this.selflifeupdate.map(item => item.GRN_Id))
      ).map(GRN_Id => this.selflifeupdate.find(item => item.GRN_Id === GRN_Id));


      if (firstArrayGrnIds.length !== secondarray.length) return this.warningError('You Cannot Split All the GrnId For this Supplier.Please Check it...')


    }
    this.Error = 'Do You Want To Save ?'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.Save()
      } else {
        this.Error = 'Save Cancelled'
        this.userHeader = 'Information'
        this.opendialog()
        return
      }
    })

  }
  SelflifeSave: any[] = new Array()
  Msg: string = ''
  Status: string = ''
  Save() {
    let update: any = []
    let savedata: any = []
    this.selflifeupdate.forEach(item => {
      update.push({
        GRN_NO: item.GRN_NO,
        GRN_Id: item.GRN_Id,
        RawmatId: item.RawmatId,
        Batchno: item.Batchno,
        BatchQty: item.BatchQty,
        BatchDate: item.BatchDate,
        ManufactureDate: item.ManufactureDate,
        Rate: item.Rate,
        Empid: this.Empid
      })
      console.log(update);
    })

    savedata = {
      GRN_Id: Array.from(new Set(this.selflifeupdate.filter(item => item.GRN_Id).map(item => item.GRN_Id))),
      update: update
    }
    console.log(savedata);

    this.service.Save(savedata).subscribe({
      next: (data: any) => {
        this.SelflifeSave = data
        console.log(this.SelflifeSave, 'Save');
        this.Msg = this.SelflifeSave[0].Msg
        this.Status = this.SelflifeSave[0].status
        if (this.Status === 'Y') {
          this.Error = this.Msg
          this.userHeader = 'Information'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.Viewclick = false
              this.SpiltClick = false
              this.selflife.reset()
              this.getSupplier()
            }
          })
        }
        else {
          this.Error = this.Msg
          this.userHeader = 'Error'
          this.opendialog()
          return
        }
      }
    })
  }
  private warningError(message: string) {
    this.Error = message;
    this.userHeader = 'Warning!!';
    this.opendialog();
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
