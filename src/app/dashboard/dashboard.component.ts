import { Component, inject, NgZone, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { data } from 'jquery';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private breakpointObserver: BreakpointObserver, private dialog: MatDialog,
    private service: LoginService, private toastr: ToastrService,) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      }
    });
  }
  cols: number = 0
  gridByBreakpoint = {
    xl: 3,
    lg: 2,
    md: 3,
    sm: 2,
    xs: 1,
  }
  Empid: number = 0
  LoactionId: number = 0
  Admin: boolean = false
  userRighitsData: any[] = new Array()
  ngOnInit(): void {
    if (sessionStorage.length == 0) {
      this.router.navigate(['/login'])
      this.Logout()
    }

    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid

    this.service.RighitsCheck(this.Empid, this.LoactionId).subscribe((data: any) => {
      this.userRighitsData = data
      if (this.Empid === 154311 || this.Empid === 18 || this.Empid === 132367 || this.Empid === 154234) {
        this.Admin = true;
      } else {
        this.Admin = false;
      }
    })
  }

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 2, rows: 5 },
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 5 },
      ];
    })
  );

  Logout() {
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
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
          this.toastr.success('Logout Successfully');
          sessionStorage.clear();
          localStorage.clear();
          this.dialog.closeAll();
          this.router.navigate(['/login']);
          // window.location.href = '/login';
        }
      }
    })
  }

  token: string = ''
  Token() {
    let tokenData = {
      UserName: '',
      Password: '',
      Expires: 0
    }
    this.service.tokenDet(tokenData).subscribe({
      next: (res: any) => {

        if (res.length > 0) {
          this.token = res[0].Token
          this.token = res.Token
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
