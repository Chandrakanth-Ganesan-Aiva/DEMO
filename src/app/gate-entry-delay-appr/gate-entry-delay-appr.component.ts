import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GateEntryDelayService } from '../service/gate-entry-delay.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-gate-entry-delay-appr',
  templateUrl: './gate-entry-delay-appr.component.html',
  styleUrls: ['./gate-entry-delay-appr.component.scss']
})
export class GateEntryDelayApprComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Select', 'GateEntryNo', 'EntryDate', 'Supplier', 'Dcno', 'Remarks', 'Description'];
  LocationId: number = 0
  Error: string = ''
  SupplierDetArr: any[] = new Array()
  Empid: number = 0
  dataSource = new MatTableDataSource(this.SupplierDetArr)
  @ViewChild('ErrorNative') ErrorNative!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('SaveNative') SaveNative!: ElementRef;
  @ViewChild('Save') Save!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

  }

  constructor(private service: GateEntryDelayService) { }
  ngOnInit(): void {
    const Location = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = Location[Location.length - 1]
    let empid = JSON.parse(sessionStorage.getItem('session') || '{}')
    this.Empid = empid.empid
    console.log(this.Empid);

    this.supllierDet()
  }

  supllierDet() {
    this.service.TabelDataList(this.LocationId).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.ErrorNative.nativeElement.click()
          }
          const newarr = {
            selected: false,
          }
          this.SupplierDetArr.forEach(obj => {
            Object.assign(obj, newarr);
          });
          this.SupplierDetArr = res
          this.dataSource.data = this.SupplierDetArr
        }
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  RowSelect() {
    this.selectAll = this.SupplierDetArr.every((item: { selected: any; }) => item.selected);
    // this.dataSource.data = [...this.gateEntryDelayList];
  }
  selectAll: boolean = false
  SelectAll(event: any) {
    const filteredData = this.dataSource.filteredData;
    if (event.checked) {
      filteredData.forEach(row => row.selected = true);
    } else {
      filteredData.forEach(row => row.selected = false);
    }
    // this.SupplierDetArr.forEach((item: any) => {
    //   item.selected = this.selectAll;
    // });
    // this.dataSource.data = [...this.gateEntryDelayList];
  }
  updateArr: any[] = new Array()
  SaveVaild() {
    this.updateArr = []
    let selected = this.SupplierDetArr.filter(item => {
      if (item.selected == true) {
        this.updateArr.push({
          LoginId: this.Empid,
          TranmasId: item.GateEntryNo
        })
      }
    })
    console.log(this.updateArr,'updatarr');
    let selectedrec = this.SupplierDetArr.filter(item => item.selected)
    console.log(selectedrec.length);

    if (selectedrec.length > 0) {
      this.SaveNative.nativeElement.click()
    } else {
      this.Error = 'Please Select Atleast One Record'
      this.ErrorNative.nativeElement.click()
      return;
    }
  }
  Msg: string = ''
  Sts: string = ''
  Update() {
    this.service.UpdateAppr(this.updateArr).subscribe({
      next: (res: any) => {
        console.log(res);
        this.Sts = res[0].status
        this.Msg = res[0].Msg
        if (this.Sts == 'Y') {
          this.Save.nativeElement.click()
        } else {
          this.Save.nativeElement.click()
          this.updateArr = []
        }
      }
    })
  }
  finalSave() {
    this.supllierDet()
    this.updateArr = []
  }
  savetimeerror() {
    this.updateArr = []
  }
}
