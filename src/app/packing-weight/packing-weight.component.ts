import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PackingWeightService } from '../service/packing-weight.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { map, startWith, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-packing-weight',
  templateUrl: './packing-weight.component.html',
  styleUrls: ['./packing-weight.component.scss']
})
export class PackingWeightComponent implements OnInit, AfterViewInit, OnDestroy {
  PackingweightForm!: FormGroup
  MaterialView: any[] = new Array()
  dataSource = new MatTableDataSource(this.MaterialView)
  displayedColumns: string[] = ['View', 'Material', 'Materialid', 'GWeight', 'NWeight', 'TWeight']
  @ViewChild(MatTable) MatTable!: MatTable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  constructor(private service: PackingWeightService, private fb: FormBuilder, private spinner: NgxSpinnerService,
    private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.PackingweightForm = this.fb.group({
      Material: ['', [Validators.required]],
      GWeight: ['', [Validators.required]],
      NWeight: ['', [Validators.required]],
      TWeight: ['', [Validators.required]],
      Id: [''],
    })

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  MatName: string = ''
  Empid: number = 0
  Material: any[] = new Array()
  filterSubscription: Subscription | undefined;
  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
    this.filterSubscription = this.filterControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms after the user stops typing
        distinctUntilChanged(), // Only trigger if the search term has changed
        filter((search: string) => search.trim().length >= 2), // Ensure at least 2 characters before calling the API
        switchMap((search: string) => this.service.getMatl(search)) // Call the service to fetch the data
      )
      .subscribe((res: any) => {
        this.filteredOptions = res; // Update options with the API response
      });

    this.getProductHistory()

  }
  onSelectionChange(): void {

    this.filterControl.setValue('');
    // this.filteredOptions = []; 
  }
  getProductHistory() {
    this.service.getMatlView().subscribe((res: any) => {
      if (res.length > 0) {
        if (res[0].status == 'N') {
          this.Error = res[0].Msg
          this.userHeader = 'Warning!!'
          this.OpenDialog()
        }
        this.MaterialView = res
        this.dataSource.data = [...this.MaterialView]

      }
    })
  }
  SelectedMaterial: any
  getMatl() {
    this.service.getMatl(this.MatName).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.Material = res
          this.SelectedMaterial = res[0].rawmatname
        }
      }
    })
  }

  filteredOptions: any = []
  filterControl = new FormControl();
  MaunalMaterialname: string = ''
  Add() {
    if (this.PackingweightForm.invalid) {
      this.PackingweightForm.markAllAsTouched()
      return
    } else {
      this.mode = 'Add'
      this.filteredOptions.find((item: any) => {
        if (item.rawmatid === this.PackingweightForm.controls['Material'].value) {
          this.MaunalMaterialname = item.rawmatname
        }
      })
      this.MaterialView.unshift({
        rawmatname: this.MaunalMaterialname,
        rawmatid: this.PackingweightForm.controls['Material'].value,
        grosswt: this.PackingweightForm.controls['GWeight'].value,
        netwt: this.PackingweightForm.controls['NWeight'].value,
        tarewt: this.PackingweightForm.controls['TWeight'].value,
        selected: true
      })
      this.savebtn = false
      this.dataSource.data = [...this.MaterialView]
      this.PackingweightForm.reset()


    }


  }
  materialName: string = ''
  materialInput(e: any) {
    this.materialName = e.target.value.toLowerCase();
    if (this.materialName) {
      this.dataSource.filter = this.materialName.trim().toLowerCase()
      this.dataSource.data = [...this.MaterialView];
    }else{
      this.materialName =''
    }
  }
  ind: number = 0
  ViewDet(Index: number) {
    this.ind = Index + (this.paginator.pageSize * this.paginator.pageIndex)
    this.mode = 'Edit'
    const selectedItem = this.dataSource.filteredData[this.ind]; 
    if (!selectedItem) return; 
    
    this.service.getMatl(selectedItem.rawmatname).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          this.filteredOptions = res
          this.PackingweightForm.controls['Material'].setValue(selectedItem.rawmatid)
          this.PackingweightForm.controls['GWeight'].setValue(selectedItem.grosswt)
          this.PackingweightForm.controls['NWeight'].setValue(selectedItem.netwt)
          this.PackingweightForm.controls['TWeight'].setValue(selectedItem.tarewt)
          this.PackingweightForm.controls['Id'].setValue(selectedItem.id)

          
          this.PackingweightForm.controls['Material'].disable()
        }
      }
    })
    this.savebtn = false
  }

  inputSelect(e: any) {
    this.MatName = e.target.value;
    if (this.MatName.length > 2) {
      this.getMatl()
    }
  }
  savebtn: boolean = true
  Wt() {
    let GWeight = this.PackingweightForm.controls['GWeight'].value
    let NWeight = this.PackingweightForm.controls['NWeight'].value
    let TWeight = this.PackingweightForm.controls['TWeight'].value
    if (GWeight != NWeight + TWeight) {
      if (GWeight <= NWeight) {
        this.Error = 'Net Weight is Greater Than Gross Weight'
        this.userHeader = 'Warning!!'
        this.OpenDialog()
        return
      }
      if (NWeight < TWeight) {
        this.Error = 'Tare Weight is Greater Than Net Weight'
        this.userHeader = 'Warning!!'
        this.OpenDialog()
        return
      }
      if (GWeight < TWeight) {

      }
      this.Error = 'Gross Weight = <b style="color:brown"> ' + GWeight + ' </b></br> Net Weight = <b style="color:brown">  ' + NWeight + '  </b> </br>  Tare Weight = <b style="color:brown"> ' + TWeight + ' </b> </br> ' +
        ' Gross Weight is  <b style="color:brown"> ' + GWeight + '  </b> is not equal to (Net Wt + Tare Wt) is <b style="color:brown">  ' + parseFloat(NWeight + TWeight) + ''
      this.userHeader = 'Warning!!'
      this.OpenDialog()
      return
    }
    if (this.mode == 'Edit') {
      this.saveVaild()
    } else {
      this.Add()
    }
  }
  Save() {
    if (this.mode == 'Edit') {
      this.Wt()
    }else{
      this.saveVaild()
    }
  }
  UpdateArr: any[] = new Array()
  mode: string = ''
  saveVaild() {
    this.UpdateArr = []
    if (this.mode == 'Add') {
      let NewPd: any = this.dataSource.data.filter(res => res.hasOwnProperty('selected'));
      if (NewPd.length > 0) {
        NewPd.forEach((res: any) => {
          this.UpdateArr.push({
            RawMatid: res.rawmatid,
            GrossWeight: res.grosswt,
            Tareweight: res.tarewt,
            NetWeight: res.netwt,
            Id: null,
            LoginId: this.Empid
          });
        });
      } else {
        this.Error = "Same data's cannot updated"
        this.userHeader = 'Warning!!'
        this.OpenDialog()
        return
      }
    } else {
      let GWeight = this.PackingweightForm.controls['GWeight'].value
      let NWeight = this.PackingweightForm.controls['NWeight'].value
      let TWeight = this.PackingweightForm.controls['TWeight'].value
      let Id = this.PackingweightForm.controls['Id'].value
      if (GWeight && NWeight && TWeight && Id) {
        if (GWeight !== this.MaterialView[this.ind].grosswt || NWeight !== this.MaterialView[this.ind].netwt || TWeight !== this.MaterialView[this.ind].tarewt) {
          this.UpdateArr.push({
            RawMatid: this.PackingweightForm.controls['Material'].value,
            GrossWeight: this.PackingweightForm.controls['GWeight'].value,
            NetWeight: this.PackingweightForm.controls['NWeight'].value,
            Tareweight: this.PackingweightForm.controls['TWeight'].value,
            Id: this.PackingweightForm.controls['Id'].value,
            LoginId: this.Empid
          });
        } else {
          this.Error = "No changes found From the Selected Data"
          this.userHeader = 'Warning!!'
          this.OpenDialog()
          return
        }

      } else {
        this.Error = "You Cannot add Same data Update it or Add new Data"
        this.userHeader = 'Warning!!'
        this.OpenDialog()
        return
      }
    }

    this.Error = 'Do You Want To Save  ?'
    this.userHeader = 'Save'
    this.OpenDialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.service.Update(this.UpdateArr).subscribe({
          next: (res: any) => {
            if (res[0].status == 'Y') {
              this.Error = res[0].Msg
              this.userHeader = 'Information'
              this.OpenDialog()
              this.dialogRef.afterClosed().subscribe((result: boolean) => {
                if (result) {
                  this.savebtn = true
                  // this.mode='Edit'
                  this.getProductHistory()
                  this.PackingweightForm.controls['GWeight'].setValue('')
                  this.PackingweightForm.controls['TWeight'].setValue('')
                  this.PackingweightForm.controls['NWeight'].setValue('')
                } else {
                  return
                }
              })
            } else {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.OpenDialog()
            }
          }
        })
      } else {
        this.Error = 'Save Cancelled'
        this.userHeader = 'Information'
        this.OpenDialog()
        return
      }
    })

  }
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  OpenDialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });

  }
  // radiobtn:boolean=true
  clear() {
    this.savebtn = false
    this.PackingweightForm.controls['Material'].enable()
    this.getProductHistory()
    // this.radiobtn=false
    this.mode = ''
    this.PackingweightForm.reset()
    this.MaterialView.length = 0
  }
  ngOnDestroy(): void {
    this.dialog.closeAll()
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }
}
