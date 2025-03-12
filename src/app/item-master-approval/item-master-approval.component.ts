import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ItemMasterApprService } from '../service/item-master-appr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { Paginator } from 'primeng/paginator';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-item-master-approval',
  templateUrl: './item-master-approval.component.html',
  styleUrls: ['./item-master-approval.component.scss']
})
export class ItemMasterApprovalComponent implements OnInit, AfterViewInit, OnDestroy {


  ItemMasterForm!: FormGroup
  LoactionId: number = 0
  ViewDet: any[] = new Array()
  dataSource = new MatTableDataSource<any>(this.ViewDet);
  TabelHeaders: string[] = ['select','ItemCode', 'Material', 'Spec', 'Make', 'Category', 'Uom', 'Minqty', 'Maxqty', 'Reorder', 'Uomid', 'Grntypeid', 'Weight',
    'Saleable', 'DrawingNo', 'Grade', 'Gradeid', 'Email', 'Location', 'Qcreq', 'Shelflife', 'Hsncode', 'Department']
  constructor(private service: ItemMasterApprService, private spinner: NgxSpinnerService, private dialog: MatDialog, private fb: FormBuilder) {
    this.ItemMasterForm = this.fb.group({
      Dept: ['', [Validators.required]]
    })

    const Location = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = Location[Location.length - 1]
  }
  @ViewChild(MatTable) MatTable!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  Department: any[] = new Array()
  Uom: any[] = new Array()
  empid: string = ''
  ngOnInit() {
    this.service.Dept(this.LoactionId).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.Department = res
          console.log(this.Department);
        } else {
          this.Error = 'No Records To Found'
          this.userHeader = 'Error'
          this.opendialog
        }
      }
    })
    this.service.Uom().subscribe({
      next: (res: any) => {
        this.Uom = res
      }
    })
  }
  onEdit(element: any, key: string, event: Event) {
    const editableElement = event.target as HTMLElement;
    element[key] = editableElement.innerText;     // Update the model with the current text value
    this.moveCaretToEnd(editableElement);        // Move the caret to the end after input
  }
  
  moveCaretToEnd(event: FocusEvent | HTMLElement) {
    let element: HTMLElement;
    if (event instanceof FocusEvent) {             // Handle case where we receive FocusEvent
      element = event.target as HTMLElement;
    } else {                                      // Handle case where we receive HTMLElement directly
      element = event;
    }
  
    const range = document.createRange();
    const selection = window.getSelection();
  
    if (element.childNodes.length > 0) {           // Move caret to the end of the content
      range.selectNodeContents(element);
      range.collapse(false);                       // Set caret position to the end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
  
  

  ItemTabelHidden: boolean = true
  View() {
    if (this.ItemMasterForm.invalid) {
      return
    } else {
      let deptid = this.ItemMasterForm.controls['Dept'].value
      this.service.View(deptid, this.LoactionId).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.opendialog()
            }
            this.ViewDet = res
            this.ItemTabelHidden = false
            let newarr = {
              selected: false,
              Grade: '',
              grntype: '',
              email: '',
              Shelflife:''
            }
            this.ViewDet.forEach(obj => {
              Object.assign(obj, newarr);
            });
            this.getGrade()
            this.getGrntype()
            this.getTabelDept()
            this.getEmail()
            this.getHsncode()
            this.dataSource.data = [...this.ViewDet];

          }
        }
      })
    }
  }
  Category: any[] = new Array()
  getGrntype() {
    this.service.GrnType().subscribe({
      next: (res: any) => {
        this.Category = res;
        console.log(this.Category);
      }
    });
  }
  GradeArr: any[] = new Array()
  getGrade() {
    this.service.Grade().subscribe({
      next: (res: any) => {
        this.GradeArr = res
        console.log(this.GradeArr);
      }
    })
  }
  getTabelDept() {
    for (let i = 0; i < this.ViewDet.length; i++) {
      const index = i
      this.service.TabelDept(this.ViewDet[i].deptid1).subscribe({
        next: (res: any) => {
          console.log(res);
          if (this.dataSource.data[index].deptid1 > 0) {
            this.dataSource.data[index].deptid1 = res[0].deptname
          } else {
            this.dataSource.data[index].deptid1 = '<None>'
          }
        }
      })
    }
  }

  getEmail() {
    for (let i = 0; i < this.ViewDet.length; i++) {
      this.service.email(this.ViewDet[i].loginid).subscribe({
        next: (res: any) => {
          if (res && res.length > 0) {
            this.dataSource.data[i].email = res[0].email

          }
        }
      })
    }
  }
  HsnCode:any[]=new Array()
  getHsncode(){
    this.service.hsncode().subscribe({next:(res:any)=>{
      this.HsnCode=res
    }})
  }
  selectAll = false;
  RowSelect() {
    this.selectAll = this.ViewDet.every((item: { selected: any; }) => item.selected);
  }
  Approve() {
    let selectedrecords = this.dataSource.data.filter(item => item.selected)
    console.log(selectedrecords);
    if (selectedrecords.length > 0) {
      this.Error = 'Do You Want to Save ?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          let ItemMasterupdate = []
          for (let i = 0; i < selectedrecords.length; i++) {
            ItemMasterupdate.push({
              LoginId: this.empid,
              Id: selectedrecords[i].id,
              locid: this.LoactionId,
              Rawmatcode: selectedrecords[i].itemcode,
              Rawmatname: selectedrecords[i].itemname,
              Desc: selectedrecords[i].spec,
              Make: selectedrecords[i].make,
              Uom: selectedrecords[i].uom,
              UomId: selectedrecords[i].uomid,
              Min_level: selectedrecords[i].min_level,
              Max_level: selectedrecords[i].max_level,
              Reorder_level: selectedrecords[i].reorder_level,
              Grntypeid: selectedrecords[i].grntypeid,
              Weight: selectedrecords[i].weight,
              Gradeid: selectedrecords[i].gradeid,
              MatLocationID: selectedrecords[i].loc_id,
              Hsncode: selectedrecords[i].hsncode,
              Uomvalue: selectedrecords[i].uomid,
              Deptid: selectedrecords[i].deptid1,
              ShelfLife: selectedrecords[i].Id,
              Saleable: selectedrecords[i].saleable,
              QcReqStatus: selectedrecords[i].qcreq,
              Drgno: selectedrecords[i].drgno,
              InternalPartNo: selectedrecords[i].drgno,
              Gid: selectedrecords[i].gradeid,
            })
          }
          console.log( ItemMasterupdate);

          let selectedEmails = this.dataSource.data
          .filter(item => item.selected)
          .map(item => item.email);
          console.log(selectedEmails,'selectedEmails');
          
          
          return
          this.service.update(ItemMasterupdate).subscribe({
            next: (res: any) => {
              console.log(res);
              this.spinner.hide()
              if (res[0].status == 'Y') {
                this.Error = res[0].Msg
                this.userHeader = 'Information'
                this.opendialog()
                this.dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    ItemMasterupdate = []
                    selectedrecords = []
                    this.View()
                  } else {
                    return
                  }
                })
              } else {
                this.Error = res[0].Msg
                this.userHeader = 'Error'
                this.opendialog()
              }
            }
          })
        } else {
          this.Error = 'SaveCancelled'
          this.userHeader = 'Information'
          this.opendialog()
        }
      })

      // this.service.update()
    } else {
      this.Error = 'Please select at least one record to approve';
      this.userHeader = 'Error'
      this.opendialog()
      return
    }
  }


  Grade: string = ''
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

  ngOnDestroy(): void {
    this.dialog.closeAll()
  }

}
