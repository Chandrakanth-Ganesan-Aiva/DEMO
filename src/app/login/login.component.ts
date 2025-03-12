import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { ToastrService } from 'ngx-toastr';
import { data, error } from 'jquery';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { setToken } from '../NgrxStore/auth.action';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { retry } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private service: LoginService, private dialog: MatDialog,
    private store: Store, private zone: NgZone, private router: Router, private date: DatePipe) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      location: ['', Validators.required],
    })
  }
  ngOnDestroy() {

  }
  ipAddress: string = '';

  Loaction: any[] = new Array()
  ngOnInit() {
    this.service.companyDetail().subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.Loaction = res

        }
      }
    })
    // this.service.ip().subscribe({
    //   next: (data:any) => {
    //     this.ipAddress = data;
    //     console.log(this.ipAddress ,'ip');
    //      // Adjust based on backend response
    //   },
    //   error: (err) => {
    //     console.error('Error fetching IP address:', err);
    //   },
    // });

  }


  loginvaildbtn: any
  logindata: any = new Array()
  login() {
    this.loginvaildbtn = true
    if (this.loginForm.invalid) {
      return
    } else {
      this.service.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            if (res[0].status == 'N') {
              this.Error = res[0].Msg
              this.userHeader = 'Error'
              this.opendialog()
              return
            }
            this.logindata = res
            if (this.logindata[0].password === this.service.CryptString(this.loginForm.controls['password'].value)) {
              sessionStorage.setItem('session', JSON.stringify(this.logindata[0]));
              sessionStorage.setItem('islogIn', "true");
              sessionStorage.setItem('location', JSON.stringify(this.loginForm.get('location')?.value))
              let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
              this.service.checkloginsts(Data.empid).subscribe({
                next: (chck: any) => {
                  if (chck.length >= 1) {
                    if (chck[0].status == 'N') {
                      this.Error = chck[0].Msg
                      this.userHeader = 'Error'
                      this.opendialog()
                      return
                    }
                    this.Error = 'You are already logged in on another system, or you did not log out properly last time. <br> ' +
                      ' Would you like to log out from the previous session?'
                    this.userHeader = 'Warning!!!'
                    this.opendialog()
                    this.dialogRef.afterClosed().subscribe((dia: boolean) => {
                      if (dia) {
                        let updatelist = []
                        updatelist.push({
                          EmpId: Data.empid,
                        })
                        this.service.UpdateUserDet(updatelist).subscribe({
                          next: (data: any) => {
                            if (data.length >= 1) {
                              if (data[0].status == 'N') {
                                this.Error = data[0].Msg
                                this.userHeader = 'Error'
                                this.opendialog()
                                return
                              }
                              console.log(data, 'after update');
                              if (data.status == 'N') {
                                this.Error = data[0].Msg
                                this.userHeader = 'Error'
                                this.opendialog()
                                return
                              } else {
                                this.getUserDetIns()
                              }
                            }
                          }
                        })
                      } else {
                        return
                      }
                    })

                  } else {
                    this.getUserDetIns()
                  }
                }
              })
            } else {
              this.Error = 'Your Password Is Invaild..Please Check...'
              this.userHeader = 'Error'
              this.opendialog()
              return
            }
          } else {
            this.Error = 'Check User Name And Password'
            this.userHeader = 'Error'
            this.opendialog()
            return
          }
        }
      })
    }
  }
  DeptDet: any[] = new Array()
  userDet: any[] = new Array()
  getUserDetIns() {
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.service.Dept(Data.empid).subscribe({
      next: (res: any) => {
        if (res) {
          if (res[0].status == 'N') {
            this.Error = res[0].Msg
            this.userHeader = 'Error'
            this.opendialog()
          }
          this.DeptDet = res
          this.userDet = []
          this.userDet.push({
            Empid: Data.empid,
            Empname: Data.cusername,
            LocationId: this.loginForm.get('location')?.value,
            LoginTime: this.date.transform(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            DeptId: this.DeptDet[0].deptid,
            DeptName: this.DeptDet[0].deptname
          })
          this.service.loginUserDetInsert(this.userDet).subscribe({
            next: (res: any) => {
              if (res) {
                if (res[0].status == 'N') {
                  this.Error = res[0].Msg
                  this.userHeader = 'Error'
                  this.opendialog()
                }
                if (res[0].status === 'Y') {
                  let tokenData = {
                    UserName: this.loginForm.controls['username'].value,
                    Password: this.loginForm.controls['password'].value,
                    Expires: 1
                  }
                  this.service.tokenDet(tokenData).subscribe({
                    next: (token: any) => {
                      this.zone.run(() => {
                        sessionStorage.setItem('token', JSON.stringify(token.Token))
                        this.router.navigate(['/Dashboard'], {});
                        setTimeout(() => {
                          window.location.reload();
                        },); // The page will reload after 1 second (1000 milliseconds)
                      })
                    }
                  })
                } else {
                  this.Error = res[0].Msg
                  this.userHeader = 'Error'
                  this.opendialog()
                  return
                }

              }
            },
            error: (error: any) => {
              this.Error = error.message
              this.userHeader = 'Eroor'
              this.opendialog()
              return;
            },
          })
        }
      }
    })

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
