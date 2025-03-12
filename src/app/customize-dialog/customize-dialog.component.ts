import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { PDRawmaterialChangeService } from '../service/pd-rawmaterial-change.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { TabelDataSource } from '../purchase-request/tabel-datasource';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GrndeleterequestService } from '../service/grndeleterequest.service';
import { data } from 'jquery';
import { GrnDeleteService } from '../service/grn-delete.service';
import { GrnEntryService } from '../service/grn-entry.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-customize-dialog',
  templateUrl: './customize-dialog.component.html',
  styleUrl: './customize-dialog.component.scss'
})
export class CustomizeDialogComponent implements OnInit, OnDestroy,AfterViewInit {
  displayedColumns: string[] = ['Material', 'uom', 'consumption', 'delete']
  AddPdMaterial: any[] = new Array()
  dataSource = new MatTableDataSource(this.AddPdMaterial)
  constructor(
    public dialogRef: MatDialogRef<CustomizeDialogComponent>,
    private fb: FormBuilder,
    private pdRawmaterialService: PDRawmaterialChangeService,
    public dialogRef1: MatDialogRef<DialogCompComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private grndeleteReqService: GrndeleterequestService,
    private grndeleteser: GrnDeleteService,
    private GrnEntryService:GrnEntryService
  ) {
    // this.ErrorMsg = this.sanitizer.bypassSecurityTrustHtml(data.Msg)
  }
    @ViewChild(MatTable) MatTable!: MatTable<any>;
    @ViewChild('grnEntryPaginator', { static: false }) paginator!: MatPaginator;
    @ViewChild('paginator1', { static: false }) paginator1!: MatPaginator;
  ngAfterViewInit(): void {
    this.grnEntryoldGateEntryDet.paginator = this.paginator;
  }
  PdRawmaterialFormEdit!: FormGroup
  PdRawmaterialFormAdd!: FormGroup
  ngOnInit() {
    console.log(this.data);
    console.log(this.data.Comp_Name);


    this.PdRawmaterialFormEdit = this.fb.group({
      Material: ['', Validators.required],
      Uom: ['', Validators.required],
    })
    this.PdRawmaterialFormAdd = this.fb.group({
      Material: ['', Validators.required],
      Uom: ['', Validators.required],
      cons_qty: ['', Validators.required],
    })
    if (this.data.Comp_Name === 'grnDeleteRequest') {
      this.grndeleteReq()
    }
    if(this.data.Comp_Name === 'grnEntry'){
      this.oldGateEntryDet()
    }
  }

  SupName: any = []
  inputSelect() {
    if (this.MaterialfilterControll.value && this.MaterialfilterControll.value.length >= 2) {
      this.getAllRawmaterial()
      this.MaterialfilterControll.valueChanges.pipe(startWith(''), map((search) =>
        this.rawmaterial.filter((option: any) =>
          option.rawmatname.toLowerCase().includes(search?.toLowerCase() || '')
        ))
      ).subscribe((filtered) => (this.filteredMaterial = filtered));
    } else {
      this.MaterialfilterControll.value == ''
      this.filteredMaterial = []
    }
  }
  filteredMaterial: any = []
  MaterialfilterControll = new FormControl();
  rawmaterial: any[] = new Array()
  getAllRawmaterial(): void {
    this.pdRawmaterialService.MaterialAll(this.MaterialfilterControll.value).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
            return;
          }
          this.rawmaterial = res;
          this.filteredMaterial = [...this.rawmaterial]; // Ensure filteredMaterial is updated
        }
      }
    });
  }

  selectedMaterialName: string = ''

  onMaterialSelect(): void {
    if (this.selectedMaterialId && this.filteredMaterial.length > 0) {
      const selectedMaterial = this.filteredMaterial.find(
        (item: any) => item.rawmatid === this.selectedMaterialId
      );

      if (selectedMaterial) {
        this.PdRawmaterialFormEdit.get('Uom')?.setValue(selectedMaterial.uom);
        this.PdRawmaterialFormAdd.get('Uom')?.setValue(selectedMaterial.uom);
        this.selectedMaterialName = selectedMaterial.rawmatname;
      } else {
        console.log('No matching material found for selected ID:', this.selectedMaterialId);
      }
    }
  }

  Status: boolean = false
  selectedMaterialId: number = 0
  pdRawmaterialUpdate() {
    this.Status = true
    // this.dialogRef.close(this.Status);
    if (this.PdRawmaterialFormEdit.valid) {
      const value = {
        materialName: this.selectedMaterialName,
        uom: this.PdRawmaterialFormEdit.get('Uom')?.value,
        materialid: this.selectedMaterialId,
      };
      this.dialogRef.close(value);
      console.log('Dialog closed with value:', value);
    } else {
      console.log('Form is invalid');
    }
  }
  // ---------------------------Add PdRawmterial --------------------------
  pdRawMatAddUpdatebtn: boolean = true
  pdRawmaterialAdd() {
    if (!this.PdRawmaterialFormAdd.valid) {
      this.PdRawmaterialFormAdd.markAllAsTouched();
      return;
    }

    const materialData = {
      materialid: this.PdRawmaterialFormAdd.controls['Material'].value,
      material: this.selectedMaterialName,
      uom: this.PdRawmaterialFormAdd.controls['Uom'].value,
      consumption: this.PdRawmaterialFormAdd.controls['cons_qty'].value,
      selected: true
    };

    const isDuplicate = this.AddPdMaterial.some(mat => mat.materialid === materialData.materialid);

    if (isDuplicate) {
      this.Error = `You Are Trying To Add Duplicate Data <b style="color:brown">${materialData.material} <b>`;
      this.userHeader = 'Warning!!'
      this.opendialog()
      return;
    }

    this.AddPdMaterial.push(materialData);
    this.dataSource.data = [...this.AddPdMaterial];

    this.PdRawmaterialFormAdd.reset();

    if (this.dataSource.data.length >= 1) {
      this.pdRawMatAddUpdatebtn = false;
    }
  }

  pdRawmaterialAddUpdate() {

    this.dialogRef.close(this.AddPdMaterial);

  }
  Delete(Index: number) {
    const updatedData = [...this.dataSource.data];
    updatedData.splice(Index, 1);
    this.dataSource.data = updatedData;
  }
  // --------------------------------------------End PdRawmterial Add -----------------------------


  // -------------------------------------------------GRN DELETE REQUEST------------------------------------------------------
  MaterialArr: any[] = new Array()
  grnDeleteReqMatlDatasource = new MatTableDataSource(this.MaterialArr)
  TaxArr: any[] = new Array()
  grnDeleteReqTaxDatasource = new MatTableDataSource(this.TaxArr)
  grndeleteReq() {
    console.log(this.data.Index);
    this.grndeleteReqService.Material(this.data.grnRefno).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
            return;
          }
          this.MaterialArr = res
          this.grnDeleteReqMatlDatasource.data = [...this.MaterialArr]
        }
      }
    })
    this.grndeleteReqService.Tax(this.data.grnRefno).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
            return;
          }
          this.TaxArr = data
          this.grnDeleteReqTaxDatasource.data = [...this.TaxArr]
        }
      }
    })
  }

  getTotalNetAmount(): number {
    return this.grnDeleteReqMatlDatasource.data
      ? this.TaxArr.reduce((total, item) => {
        return total + item.Amount
      }, 0)
      : 0;
  }
  getTotalGross(): number {
    return this.grnDeleteReqTaxDatasource.data
      ? this.MaterialArr.reduce((total, item) => {
        const billedQty = item.BilledQty || 0;
        const grnBasicPrice = item.GrnBasicPrice || 0;
        return total + (billedQty * grnBasicPrice);
      }, 0)
      : 0;
  }


  // -------------------------------------------------------------GRN DELETE -------------------------------------------------

  grnDeleteMaterialArr: any[] = new Array()
  grnDeleteMatlDatasource = new MatTableDataSource(this.grnDeleteMaterialArr)
  grnDeleteTaxArr: any[] = new Array()
  grnDeleteTaxDatasource = new MatTableDataSource(this.grnDeleteTaxArr)
  grnDelete() {
    this.grndeleteser.Material(this.data.grnRefno).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
            return;
          }
          this.grnDeleteMaterialArr = res
          this.grnDeleteMatlDatasource.data = [...this.grnDeleteMaterialArr]
        }
      }
    })
    this.grndeleteser.Tax(this.data.grnRefno).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
            return;
          }
          this.grnDeleteTaxArr = data
          this.grnDeleteTaxDatasource.data = [...this.grnDeleteTaxArr]
        }
      }
    })
  }

  getGrnDeleteTotalNetAmount(): number {
    return this.grnDeleteMatlDatasource.data
      ? this.TaxArr.reduce((total, item) => {
        return total + item.Amount
      }, 0)
      : 0;
  }
  getGrnDeleteTotalGross(): number {
    return this.grnDeleteTaxDatasource.data
      ? this.MaterialArr.reduce((total, item) => {
        const billedQty = item.BilledQty || 0;
        const grnBasicPrice = item.GrnBasicPrice || 0;
        return total + (billedQty * grnBasicPrice);
      }, 0)
      : 0;
  }

// -------------------------------------------------GRN ENTRY------------------------------------------------------------------
grnEntryoldGateEntryDet = new MatTableDataSource()
oldGateEntryDet(){
  const data = JSON.parse(sessionStorage.getItem('location') || '{}');
 let LocationId = data[data.length - 1]
  this.GrnEntryService.gateEntryDelay(LocationId).subscribe({
    next: (res: any) => {
      if (res.length > 0) {
        if (res[0].status == 'N') {
          this.Error=res[0].Msg
          this.userHeader='Error'
          return this.opendialog()
        }
        this.grnEntryoldGateEntryDet.data=res
        this.grnEntryoldGateEntryDet.data=[...this.grnEntryoldGateEntryDet.data]
        this.grnEntryoldGateEntryDet.paginator = this.paginator;
      } 
    }
  })
}

  Error: string = ''
  userHeader: string = ''
  // dialogRef1!: MatDialogRef<DialogCompComponent>;
  opendialog() {
    this.dialogRef1 = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });

  }


  ngOnDestroy(): void {
    // this.dialogRef.closeAll()
  }
}
