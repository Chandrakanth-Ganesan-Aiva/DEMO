import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../service/admin.service';

import { LoginService } from '../service/login.service';
import { ToastrService } from 'ngx-toastr';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { data } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { retry, startWith } from 'rxjs';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  Menuform!: FormGroup;
  Logoutform!: FormGroup;
  LoactionId: number = 0
  displayedColumns = ['Check', 'SubMenuname', 'ApprovedBy', 'ApprTime'];


  @ViewChild(MatTable) MatTable!: MatTable<any>;
  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  @ViewChild('paginator1', { static: false }) paginator1!: MatPaginator;
  constructor(private service: AdminService, private dialog: MatDialog,private formBuilder: FormBuilder ) {
  }

  historyData:any= new MatTableDataSource()
  ngAfterViewInit(): void {
    if(this.paginator){
      this.dataSource.paginator = this.paginator;
    }
    if(this.paginator1){
      this.historyData.paginator = this.paginator1;
    }

  }
  isSticky(buttonToggleGroup: MatButtonToggleGroup, id: string) {
    return (buttonToggleGroup.value || []).indexOf(id) !== -1;
  }

  ngOnInit(): void {

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    console.log(this.LoactionId);
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Menuform = this.formBuilder.group({
      Loaction: ['', Validators.required],
      Dept: ['', Validators.required],
      Emp: ['', Validators.required],
      MainMenu: ['', Validators.required],
      Approved: [{ value: user.cusername, disabled: true }, [Validators.required]]

      // Poweruser:new FormControl(''),
      // AdminRight:new FormControl('') 

    })
    this.Location()
    // this.getMenu()
  }
  LocationData: any[] = new Array()
  Location() {
    this.service.Location().subscribe({
      next: (data: any) => {
        if (data.length >= 1) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.LocationData = data
        }
      }
    })

  }
  LocationChangeEvent() {
    console.log(this.Menuform.controls['Loaction'].value);

    if (this.Menuform.controls['Loaction'].value) {
      this.GetDept()
    }
    this.Menuform.controls['Dept'].setValue('')
    this.RightsTable = true
  }
  Department: any[] = new Array()
  GetDept() {
    this.service.dept(this.Menuform.controls['Loaction'].value).subscribe({
      next: (data: any) => {
        if (data.length >= 1) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.Department = data
        }
      }
    })
  }
  DeptName: string = ''
  DeptChangeEvent() {
    if (this.Menuform.controls['Dept'].value) {
      this.Department.filter(emp => {
        if (emp.deptid === this.Menuform.controls['Dept'].value) {

          this.DeptName = emp.deptname
        }
      })
      this.Menuform.controls['Emp'].setValue('')
      this.RightsTable = true
      this.GetEmp()
    }
  }
  Employee: any[] = new Array()
  GetEmp() {
    this.service.Emp(this.Menuform.controls['Dept'].value).subscribe({
      next: (data: any) => {
        if (data.length >= 1) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.Employee = data
        }
      }
    })
  }

  EmpName: string = ''
  EmpChangeEvent() {


    if (this.Menuform.controls['Emp'].value) {
      this.Employee.filter(emp => {
        if (emp.Empid == this.Menuform.controls['Emp'].value) {
          this.EmpName = emp.Empname
        }
      })
      console.log(this.Menuform.controls['Emp'].value);
      console.log(this.EmpName);
      this.Menuform.controls['MainMenu'].setValue('')
      this.RightsTable = true
      this.getMenu()
      this.Getpoweruser()
    }
  }
  MenuNameData: any[] = new Array()
  getMenu() {
    this.service.mainMenu().subscribe({
      next: (res: any) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].message
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.MenuNameData = res
        }
      }
    })
  }
  mainMenuEvent() {
    if (this.Menuform.controls['MainMenu'].value) {
      this.getSubMenu()
      this.GetRights()
    }
  }

  RightsTable: boolean = true
  getSubMenu() {
    this.service.subMenu(this.Menuform.controls['MainMenu'].value).subscribe({
      next: (res: any) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].message
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          this.RightsTable = false
          this.dataSource.data = [...res]
          console.log(this.dataSource.data);
        }
      }
    })
  }


  RightsData: any[] = new Array()
  dataSource = new MatTableDataSource(this.RightsData);
  GetRights() {
    let Loctionid = this.Menuform.controls['Loaction'].value
    let Empid = this.Menuform.controls['Emp'].value
    let mainMenuId = this.Menuform.controls['MainMenu'].value
    this.service.ViewRights(Loctionid, Empid, mainMenuId).subscribe({
      next: (res: any) => {
        if (res.length >= 1) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.RightsData = res
          const updatedMenus = this.dataSource.data.map(Mainmenu => {
            let update = []
            update = res.find((exesting: any) => exesting.SubMenuId == Mainmenu.SubMenuId);
            if (update) {
              console.log(update);

              return {
                Status: update.Status,
                ApprovedBy: update.ApprovedBy,
                RightsApprTime: update.RightsApprTime,
                ...Mainmenu,
              };
            }
            return Mainmenu;
          });
          this.dataSource.data = [...updatedMenus]



          console.log(this.dataSource.data);

        } else {
          this.dataSource.data
          console.log(this.dataSource.data);
        }
      }
    })
  }
  poweruser: string = ''
  Getpoweruser() {
    this.service.poweruser(this.Menuform.controls['Emp'].value).subscribe({
      next: (data: any) => {
        if (data.length >= 1) {
          if (data[0].status == 'N') {
            this.Error = data[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
          if (data[0].power_user == 'Y') {
            this.poweruser = 'Y'
          } else {
            this.poweruser = 'N'
          }
          console.log(this.poweruser);
        }
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ApprStatus: string = ''
  onCheckboxChange(element: any, event: MatCheckboxChange): void {
    const isChecked = event.checked;
    element.Status = isChecked ? 'Y' : 'N';
    console.log(element.Status);

  }
  
  Tab(event: MatTabChangeEvent) {
    console.log('Selected Tab Label:', event.tab.textLabel);
    console.log('Selected Tab Index:', event.index);
    if(event.tab.textLabel =='Rights'){
      this.GetRights()
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }else{
      let Loctionid = this.Menuform.controls['Loaction'].value
      let Empid = this.Menuform.controls['Emp'].value
      this.service.ViewHistory(Loctionid, Empid).subscribe({
        next: (res: any) => {
          if(res.length > 0){
            if(res[0].staus=='N'){
              this.Error=res[0].Msg
              this.userHeader='Error'
              this.opendialog()
              return
            }
            this.historyData.data=res
            this.historyData.paginator = this.paginator1;
            
            if (this.historyData.paginator) {
              this.historyData.paginator.firstPage();
            }
            
          }
        }
      })
    }
  }


  UserDet: any[] = new Array()
  ApproveType: string = ''
  Approve(action: string) {
    this.ApproveType = action; // Set ApproveType based on the button clicked
    console.log(this.ApproveType);

    const nonMatchingFirstArray = this.dataSource.data.filter(firstItem => {
      return !this.RightsData.some(secondItem =>
        secondItem.SubMenuId === firstItem.SubMenuId && secondItem.Status == "Y"
      );
    });

    if (this.Menuform.valid) {
      this.UserDet = []
      this.Error = 'Do You Want To ' + this.ApproveType + ''
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe({
        next: (dialogresult: boolean) => {
          if (dialogresult) {
            if (this.ApproveType == 'Approve') {
              let updateArr = []
              updateArr = nonMatchingFirstArray.filter(item => item.Status == 'Y')
              for (let i = 0; i < updateArr.length; i++) {
                this.UserDet.push({
                  Type: this.ApproveType,
                  MenuId: updateArr[i].SubMenuId,
                  Menuname: updateArr[i].SubMenuName,
                  Empid: this.Menuform.controls['Emp'].value,
                  EmpName: this.EmpName,
                  LocationId: this.Menuform.controls['Loaction'].value,
                  DeptId: this.Menuform.controls['Dept'].value,
                  DeptName: this.DeptName,
                  PowerUser: this.poweruser,
                  Status: updateArr[i].Status,
                  ApprovedBy: this.Menuform.controls['Approved'].value,
                })
              }
            }
            else {
              // Handling Non-Approve Type
              const matchedRecords = this.RightsData.filter((item) => {
                if (item.Status === 'Y') {
                  const matchedRecord = this.dataSource.data.find(
                    (data) => data.SubMenuId === item.SubMenuId && data.Status == 'N'
                  );
                  if (matchedRecord) {
                    this.UserDet.push({
                      Type: this.ApproveType,
                      MenuId: matchedRecord.SubMenuId,
                      Menuname: matchedRecord.SubMenuName,
                      Empid: this.Menuform.controls['Emp'].value,
                      EmpName: this.EmpName,
                      LocationId: this.Menuform.controls['Loaction'].value,
                      DeptId: this.Menuform.controls['Dept'].value,
                      DeptName: this.DeptName,
                      PowerUser: this.poweruser,
                      Status: matchedRecord.Status,
                      ApprovedBy: this.Menuform.controls['Approved'].value,
                    });
                    return true; // Include in matchedRecords
                  }
                }
                return false; // Exclude from matchedRecords
              });
            }
            console.log(this.UserDet);
            this.service.Save(this.UserDet).subscribe({
              next: (res: any) => {
                if (res.length >= 1) {
                  if (res[0].status == 'Y') {
                    this.Error = res[0].Msg
                    this.userHeader = 'Information'
                    this.opendialog()
                    this.dialogRef.afterClosed().subscribe((result: boolean) => {
                      if (result) {
                        this.GetRights()
                      }
                    })
                  } else {
                    this.Error = res[0].Msg
                    this.userHeader = 'Error'
                    this.opendialog()
                  }
                }
              }
            })
          } else {
            this.Error = 'Save Cancelled'
            this.userHeader = 'Information'
            this.opendialog()
          }
        }
      })

    } else {
      return this.Menuform.markAllAsTouched()
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
