import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MinmumMaximumEntryService } from '../service/minmum-maximum-entry.service';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { startWith, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-minmum-maximum-entry',
  templateUrl: './minmum-maximum-entry.component.html',
  styleUrls: ['./minmum-maximum-entry.component.scss']
})
export class MinmumMaximumEntryComponent implements OnInit, AfterViewInit, OnDestroy {
  minmaxform!: FormGroup
  ViewMaterial: any[] = new Array()
  dataSource = new MatTableDataSource(this.ViewMaterial)
  LocationId: number = 0
  TabelHeaders: string[] = ['select', 'Material', 'UOM', 'Min', 'Max', 'Reorder', 'Reorderlimit', 'LeadDays']

  private destroy$ = new Subject<void>();


  constructor(private fb: FormBuilder, private service: MinmumMaximumEntryService, private dialog: MatDialog, private spinner: NgxSpinnerService) {
    this.minmaxform = this.fb.group({
      category: ['', [Validators.required]],
      Unit: ['', [Validators.required]]
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

  }
  @ViewChild(MatTable) MatTable!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  ViewCategory: any[] = new Array()
  filtercontrol = new FormControl
  filteredoptions: any[] = []
  pageSizeOptions: number[] = [8, 20, 30];
  ngOnInit() {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LocationId = data[data.length - 1]

    this.filtercontrol.valueChanges.pipe(map((search) =>
      this.ViewCategory.filter((option: any) =>
        option.grntype.toLowerCase().includes(search?.toLowerCase() || '')
      ))
    ).subscribe((filtered) => (this.filteredoptions = filtered));


    this.service.Category().subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.ViewCategory = data
          this.filteredoptions = data
          this.getLocation()
        }
      }

    })

  }
  getLocation() {
    this.service.Unit(this.LocationId).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.minmaxform.controls['Unit'].setValue(res[0].companyid)
        }
      }
    })
  }
  categoryChangeEvent() {
    if (this.minmaxform.controls['category'].value) {
      this.View()
    }
  }
  materialName: string = ''
  materialInput(e: any) {
    this.materialName = e.target.value.toLowerCase();
    if (this.materialName) {
      const filteredData = this.material.filter(element =>
        element.rawmatname.toLowerCase().startsWith(this.materialName)
      );
      this.dataSource.data = filteredData;
      this.dataSource.data = structuredClone(filteredData); 
    } else {
      // this.dataSource.data = [...this.material];
      this.dataSource.data = structuredClone(this.material); 
    }
  }

  material: any[] = new Array()
  Table: boolean = true
  // initialDisabledStates: any
  Savebtndis:boolean=true
  View() {
    // this.Viewbtn = true
    if (this.minmaxform.invalid) {
      return this.minmaxform.markAllAsTouched()
    } else {
      let catid = this.minmaxform.controls['category'].value
      this.service.Material(this.LocationId, catid).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            this.material = res
            // this.initialDisabledStates = new Map(
            //   this.material.map(item => [
            //     item.rawmatid,  // Use a unique identifier
            //     {
            //       min_level: item.min_level > 0,
            //       max_level: item.max_level > 0,
            //       reorder_level: item.reorder_level > 0,
            //       reorder_limit: item.reorder_limit > 0,
            //       leadtime: item.leadtime > 0
            //     }
            //   ])
            // );
            this.Table = false
            let newarr = {
              selected: false
            }
            this.material.forEach(obj => {
              Object.assign(obj, newarr);
            });
            // this.dataSource.data = [...this.material];
            this.dataSource.data = structuredClone(this.material);  // structuredClone is used for Deep copy avoid Shallow copy              
            this.Savebtndis=false
          } else {
            this.Error = 'No Records To Found'
            this.userHeader = 'Information'
            this.opendialog()
          }
        }
      })
    }
  }

  updateMinMax: any[] = new Array()
  getSaveVaild() {
    const Selectedrecords = this.dataSource.data.filter(item => item.selected)
    if (Selectedrecords.length == 0) {
      this.Error = 'Please Select Checkbox Which You Want To Update Min Max Entry  '
      this.userHeader = 'Warning!!'
      this.opendialog()
    }
    else if (this.dataSource.data.some(item => item.selected &&
      [item.min_level, item.max_level, item.reorder_level, item.leadtime, item.reorder_limit]
        .some(val => val < 0 || val === '' || val === null || val === undefined))) {

      this.Error = 'Selected Records Value Should Not Be Less Than Zero Or Empty';
      this.userHeader = 'Warning!!';
      return this.opendialog();
    }
    else {
      this.updateMinMax = []
      const Selectedrecords = this.dataSource.data.filter(item => item.selected)
      for (let i = 0; i < Selectedrecords.length; i++) {
        this.updateMinMax.push({
          locatinId: this.LocationId,
          MinLevel: Selectedrecords[i].min_level,
          Maxlevel: Selectedrecords[i].max_level,
          LeadTime: Selectedrecords[i].leadtime,
          ReorderLevel: Selectedrecords[i].reorder_level,
          ReorderLimit: Selectedrecords[i].reorder_limit,
          RawmatId: Selectedrecords[i].rawmatid
        })
      }
      // const Selected = this.updateMinMax.every(item => item.MinLevel > 0 || item.Maxlevel > 0 || item.LeadTime > 0 || item.ReorderLevel > 0 || item.ReorderLimit > 0);
      const isDuplicate = this.updateMinMax.some((item) => {
        const matchedRawMat = this.material.find((res: any) => item.RawmatId === res.rawmatid);
        console.log(matchedRawMat, item);

        if (matchedRawMat) {
          return (
            item.MinLevel == matchedRawMat.min_level &&
            item.Maxlevel == matchedRawMat.max_level &&
            item.ReorderLevel == matchedRawMat.reorder_level &&
            item.ReorderLimit == matchedRawMat.reorder_limit &&
            item.LeadTime == matchedRawMat.leadtime
          );
        }
        return false;
      });

      if (isDuplicate) {
        this.Error = 'Same Record Cannot be Updated';
        this.userHeader = 'Warning!!';
        return this.opendialog();
      } else {
        this.Error = 'Do You Want To Save ?'
        this.userHeader = 'Save'
        this.opendialog()
        this.dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.updateMinMax.forEach((item, index) => {
              this.service.Update(item).subscribe({
                next: (res: any) => {
                  if (res[0].status == 'Y') {
                    if (index == this.updateMinMax.length - 1) {
                      this.Error = res[0].Msg
                      this.userHeader = 'Information'
                      this.opendialog()
                      this.dialogRef.afterClosed().subscribe((result: boolean) => {
                        if (result) {
                          this.updateMinMax = []
                          this.material = []
                          this.materialName = ''
                          this.View()
                        } else {
                          return
                        }
                      });
                    }

                  } else {
                    this.Error = res[0].Msg
                    this.userHeader = 'Error'
                    this.opendialog()
                    return
                  }
                }
              })
            })

          } else {
            this.Error = 'Minimum Maxmium Entry Save Cancelled'
            this.userHeader = 'Information'
            this.opendialog()
            return
          }
        })
      }
      // else {
      //   this.Error = 'Selected Checkbox have  At least any One of the <b style="color:brown;"> Min Qty or Max Qty or leadtime or Reorder_level  or Reorder_limit Should be Greater Than Zero </b> '
      //   this.userHeader = 'Error'
      //   this.opendialog()
      //   return
      // }

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


}
