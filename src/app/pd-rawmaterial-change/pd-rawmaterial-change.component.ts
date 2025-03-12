import { CustomizeDialogComponent } from './../customize-dialog/customize-dialog.component';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PDRawmaterialChangeService } from '../service/pd-rawmaterial-change.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { DemoComponent } from '../demo/demo.component';
import { data } from 'jquery';
@Component({
  selector: 'app-pd-rawmaterial-change',
  templateUrl: './pd-rawmaterial-change.component.html',
  styleUrls: ['./pd-rawmaterial-change.component.scss']
})
export class PDRawmaterialChangeComponent implements OnInit, AfterViewInit {
  myForm!: FormGroup
  ViewMat: any[] = new Array()
  dataSource = new MatTableDataSource(this.ViewMat)
  displayedColumns: string[] = ['add', 'Material', 'uom', 'consumption', 'action']
  constructor(private service: PDRawmaterialChangeService, private dialog: MatDialog, private router: Router,
    private fb: FormBuilder, private spinner: NgxSpinnerService, private date: DatePipe) {
    this.myForm = this.fb.group({
      Location: ['', [Validators.required]],
      LocId: [''],
      product: ['', [Validators.required]],
      Cavity: ['', [Validators.required]],
      Process: ['', [Validators.required]],
      EffDate: [this.date.transform(new Date, 'yyyy-MM-dd')]
    })
    // this.date.transform(this.myForm.controls['EffDate'].value, 'yyyy-MM-dd')
  }
  ngAfterViewInit(): void {

  }
  loactionId: number = 0
  Empid: number = 0
  ngOnInit(): void {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.loactionId = data[data.length - 1]
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.Location()

  }
  Location() {
    this.service.Location(this.loactionId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.myForm.controls['Location'].setValue(res[0].location)
          this.myForm.controls['LocId'].setValue(res[0].companyid)
          this.Product()
        }
      }
    })
  }



  Party: any[] = new Array()
  filteredOptions: any = []
  filterControl = new FormControl();

  Product() {
    let companyId = this.myForm.controls['LocId'].value
    this.service.Product(companyId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.Party = res
          this.filteredOptions = [...this.Party]
          this.filterControl.valueChanges.pipe(startWith(''), map((search) =>
            this.Party.filter((option: any) =>
              option.prodname.toLowerCase().includes(search?.toLowerCase() || '')
            ))
          ).subscribe((filtered) => (this.filteredOptions = filtered));
        }
      },
    })
  }
  prodid: number = 0
  productchangeEvent() {

    if (this.myForm.controls['product'].value > 0) {
      this.getPd()
    }
  }
  Pdcavity: any[] = new Array()
  getPd() {
    let prodid = this.myForm.controls['product'].value
    let companyId = this.myForm.controls['LocId'].value
    this.service.Pd(prodid, companyId).subscribe((res: any) => {
      console.log(res);
      if (res.length > 0) {
        if (res[0].status == 'N') {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
        }
        this.Pdcavity = res
      }
    })
  }
  PdChange() {
    if (this.myForm.controls['Cavity'].value > 0) {
      this.getProcess()
      this.myForm.controls['Process'].setValue('')
    }
  }
  Process: any[] = new Array()
  getProcess() {
    let pdid = this.myForm.controls['Cavity'].value
    let companyId = this.myForm.controls['LocId'].value
    this.service.Process(pdid, companyId).subscribe((res: any) => {
      console.log(res);
      if (res.length > 0) {
        if (res[0].status == 'N') {
          this.Error = res[0].Msg
          this.userHeader = 'Error'
          this.opendialog()
        }
        this.Process = res
      } else {
        this.Error = 'No Process Found for this Pd'
        this.userHeader = 'Warning!!'
        this.opendialog()
      }
    })
  }
  forgedetail: any
  ProcessEventChange() {
    let Process = this.myForm.controls['Process'].value
    this.Process.find((item: any) => {
      if (item.processid == Process) {
        this.forgedetail = item.forgedetailid
      }
    })

  }
  addbtn: boolean = true
  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched()
      return
    } else {

      this.service.Material(this.forgedetail).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.length > 0) {
            if (res[0].status === 'N') {
              this.Error = res[0].Msg;
              this.userHeader = 'Error';
              this.opendialog();
              return; // Stop further execution if error occurs
            }
            res.forEach((item: any) => {
              const isDuplicate = this.ViewMat.some(
                (mat) =>
                  mat.materialid == item.rawmatid &&
                  mat.Forgedetailid == this.forgedetail &&
                  mat.Pdid == this.myForm.controls['Cavity'].value
              );
              if (!isDuplicate) {
                this.ViewMat.push({
                  ProcessId: this.myForm.controls['Process'].value,
                  Pdid: this.myForm.controls['Cavity'].value,
                  Forgedetailid: this.forgedetail,
                  materialid: item.rawmatid,
                  consumption: item.consumption,
                  EffFrom: this.myForm.controls['EffDate'].setValue(this.date.transform(new Date, 'yyyy-MM-dd')),
                  LoginId: this.Empid,
                  material: item.rawmatname,
                  uom: item.uom
                });
                this.addbtn = false
                this.dataSource.data = this.ViewMat;
                this.myForm.disable()
                this.Location()
                this.myForm.controls['EffDate'].setValue(this.date.transform(new Date, 'yyyy-MM-dd'))
              } else {
                this.Error = 'Same Material Cannot be Add To The Tabel '
                this.userHeader = 'Warning!!';
                this.opendialog();
              }
            });
          } else {
            this.Error = 'No Data Found for this Process'
            this.userHeader = 'Warning!!';
            this.opendialog();
          }
        },
      });

    }
  }
  AddMat() {
    this.customizeDialog = this.dialog.open(CustomizeDialogComponent, {
      disableClose: true,
      width: '750px',
      height: 'Auto',
      panelClass: 'center-dialog',
      data: { Comp_Name: "PdRawmaterialChange_Add" },
    });
    this.customizeDialog.afterClosed().subscribe((result) => {
      console.log('Dialog Closed Result:', result);
      if (result) {
        console.log(result);
        let data = result
        this.dataSource.data = [...this.dataSource.data, ...result];
        console.log(this.dataSource.data);
        console.log([...this.dataSource.data, ...result]);

        // this.dataSource .data.filter(res => res.hasOwnProperty('add'));
      } else {
        console.log('Dialog closed without returning any data.');
      }
    });
  }

  customizeDialog!: MatDialogRef<CustomizeDialogComponent>;
  editMaterial(Index: number) {
    
    this.customizeDialog = this.dialog.open(CustomizeDialogComponent, {
      disableClose: true,
      width: 'Auto',
      height: 'Auto',
      panelClass: 'center-dialog',
      data: { Comp_Name: "PdRawmaterialChange_Edit" },
    });

    this.customizeDialog.afterClosed().subscribe((result: any) => {
      console.log('Dialog Closed Result:', result);
      if (result) {
        console.log('Updating data source with:', result);
        this.dataSource.data[Index] = {
          material: result.materialName,
          materialid: result.materialId,
          uom: result.uom,
        };
        this.dataSource.data = [...this.dataSource.data];
      } else {
        console.log('Dialog closed without returning any data.');
      }
    });

  }
  Delete(Index: number) {
    // Remove the item at the specified index from the dataSource array
    const updatedData = [...this.dataSource.data]; // Create a copy of the array
    updatedData.splice(Index, 1); // Remove the item at the index
    this.dataSource.data = updatedData;
  }
  updateArr: any[] = new Array()
  saveVaild() {
    if (this.dataSource.data.length === 0) {
      this.Error = "AtLeast Add item to Update The Consumaption",
        this.userHeader = 'Warning!!';
      this.opendialog()
      return;
    } else {
      let selectRec = this.dataSource.data.filter(item => item.material)
      for (const item of selectRec) {
        if (!item.consumption || item.consumption == 0) {
          this.Error = `For <b style="color:brown;"> ${item.material} </b>, consumption should be greater than zero`,
            this.userHeader = 'Warning!!';
          this.opendialog()
          return;
        }
      }
      this.updateArr = selectRec.map(item => ({
        Pdid: this.myForm.controls['Cavity'].value,
        Forgedetailid: this.forgedetail,
        Rawmatid: item.materialid,
        Consumtion: parseFloat(item.consumption),
        EffFrom: this.date.transform(this.myForm.controls['EffDate'].value, 'yyyy-MM-dd'),
        LoginId: this.Empid,
      }));

      this.Error = 'Do You Want To Save Pd RawMaterial Consumaption Change ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        console.log(result);
        if (result) {
          console.log(this.updateArr);
          // this.updateArr.forEach((item:any, Index) => {
            this.service.Update(this.updateArr).subscribe({
              next: (res: any) => {
                console.log(res);
                if (res[0].status == 'Y') {
                  // if (Index == this.updateArr.length - 1) {
                    this.Error = res[0].Msg
                    this.userHeader = 'Information'
                    this.opendialog()
                    this.dialogRef.afterClosed().subscribe((result: boolean) => {
                      if (result) {
                        this.dataSource.data = []
                        this.addbtn = false
                        this.myForm.enable()
                        this.myForm.reset()
                      }
                    })
                  // }
                } else {
                  this.Error = res[0].Msg
                  this.userHeader = 'Error'
                  this.opendialog()
                }
              }
            })
          // })

        } else {
          this.Error = 'PD Rawmaterial Consumption Entry Save Cancelled'
          this.userHeader = 'Information'
          this.opendialog()
          return;
        }
      })
    }
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
  clear() {
    this.addbtn = false
    this.myForm.enable()
    this.myForm.reset()
    this.dataSource.data = []
  }
  ngOnDestroy(): void {
    console.log('Component destroyed');
    this.dialog.closeAll()
  }
}
