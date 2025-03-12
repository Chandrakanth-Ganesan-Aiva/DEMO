import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../service/login.service';
import { AdminService } from '../service/admin.service';
import { StoreIssueService } from '../service/store-issue.service';

@Component({
  selector: 'app-storeissuelogout',
  templateUrl: './storeissuelogout.component.html',
  styleUrls: ['./storeissuelogout.component.scss']
})
export class StoreissuelogoutComponent implements OnInit {
  Logoutform!: FormGroup
  displayedColumns: string[] = ['S.No', 'empname', 'locid', 'logindate', 'loginsystem', 'logoutdate', 'modid',];
  constructor(private service: AdminService, private spinners: NgxSpinnerService, private formBuilder: FormBuilder, private loginservice: LoginService, private storeissueservice: StoreIssueService) { }
  ngOnInit() {
    this.Logoutform = this.formBuilder.group({
      Loaction: new FormControl('', Validators.required),
      Dept: new FormControl('', Validators.required),
      Emp: new FormControl('', Validators.required),
    })
    this.Location()
  }
  Location() {
    this.service.Location().subscribe({
      next: (data: any) => {
        this.UserLocationidArr = data
        console.log(this.UserLocationidArr = data
          , 'location');
      },
      error: (err: any) => {
        this.apiErrorMsg = err
        const Error = document.getElementById('apierror') as HTMLInputElement
        Error.click()
        return
      }
    })

  }

  UserLocationidArr: any[] = new Array
  Locid: any
  Locationevent(event: any) {
    this.Locid = event.target.value
    console.log(this.Locid)
    // this.GetDept()
  }
  Department: any[] = new Array()
  // GetDept() {
  //   this.service.dept().subscribe({
  //     next: (data: any) => {
  //       this.Department = data
  //       console.log(this.Department, 'dept');
  //     },
  //     error: (err: any) => {
  //       this.apiErrorMsg = err
  //       const Error = document.getElementById('apierror') as HTMLInputElement
  //       Error.click()
  //       return
  //     }
  //   })
  // }
  DeptEvent(event: any) {
    this.Deptid = parseInt(event)
    console.log(this.Deptid, 'deptid');
    this.GetEmp()
  }
  Deptid: number = 0
  Employee: any[] = new Array()
  apiErrorMsg: string = ''
  GetEmp() {
    this.service.Emp(this.Deptid).subscribe({
      next: (data: any) => {
        this.Employee = data
        console.log(this.Employee, 'dept');
      },
      error: (err: any) => {
        this.apiErrorMsg = err
        const Error = document.getElementById('apierror') as HTMLInputElement
        Error.click()
        return
      }
    })
  }
  Empid: any
  EmpEvent(event: any) {
    this.Empid = parseInt(event.target.value)
  }
  StoreIssueId: number = 0
  ViewSccrenlogUser: any[] = new Array()
  Viewunlockuser() {
    this.vaildationbtn = true
    if (this.Logoutform.invalid) {
      return
    } else {
      this.StoreIssueId = 166
      this.loginservice.screenlockvaild(this.StoreIssueId,this.Locid).subscribe({
        next: (res: any) => {
          this.ViewSccrenlogUser = res
          console.log(this.ViewSccrenlogUser, 'screenlockvaildation');
          if (this.ViewSccrenlogUser.length > 0) {
            const view = document.getElementById('View') as HTMLInputElement
            view.click()
          } else {
            this.ErrorMsg = ''
            this.ErrorMsg = "No Records To Logout For this Employee"
            console.log(this.ErrorMsg);
            const view = document.getElementById('logout') as HTMLInputElement
            view.click()
          }
        },
        error: (err) => {
          this.apiErrorMsg = err
          const Error = document.getElementById('apierror') as HTMLInputElement
          Error.click()
          // this.spinner.show()
          return
        }
      })
    }
  }
  Updatelockscreen = {}
  ErrorMsg: string = ''
  vaildationbtn: any
  LogoutEmp() {
    this.vaildationbtn = true
    if (this.Logoutform.invalid) {
      return
    } else {
      this.Updatelockscreen={}
      this.Updatelockscreen={
        LocationId:this.Locid,
        EmpId:this.Empid,
        ModuleId:this.StoreIssueId,
        Loginsystem:'Tab-Entry'
      }
      this.storeissueservice.Updatelogoutime(this.Updatelockscreen).subscribe({
        next: (res: any) => {
          const updatelockscrrentime = res
          console.log(updatelockscrrentime, 'updatelockscrrentime');
          if (updatelockscrrentime.length > 0) {
            if (updatelockscrrentime[0].status === 'Y') {
              this.ErrorMsg = ''
              this.ErrorMsg = "You Logout " + this.Empid + ""
              console.log(this.ErrorMsg);
              const view = document.getElementById('logout') as HTMLInputElement
              view.click()
            } else {
              this.ErrorMsg = ''
              this.ErrorMsg = "Failed  (OR) No Records For this Employee..Click View Btn and Check For this Empoyee will Open the Store Issue Or NOT ..."
              console.log(this.ErrorMsg);
              const view = document.getElementById('logout') as HTMLInputElement
              view.click()
            }
          } else {
            this.ErrorMsg = ''
            this.ErrorMsg = "No Records To Logout For this Employee"
            console.log(this.ErrorMsg);
            const view = document.getElementById('logout') as HTMLInputElement
            view.click()
          }
        },
        error: (error: any) => {
          this.apiErrorMsg = error;
          const Error = document.getElementById('apierror') as HTMLInputElement
          Error.click()
          return
        }
      })
    }
  }
}
