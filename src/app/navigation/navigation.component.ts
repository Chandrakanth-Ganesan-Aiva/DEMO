import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { ToastrService } from 'ngx-toastr';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  LoactionId: number = 0
  Empid: number = 0
  constructor(private Router: Router, private service: LoginService, private dialog: MatDialog, private router :Router,
    private toastr: ToastrService) { }
  ngOnInit() {
    const data = JSON.parse(sessionStorage.getItem('location') || '{}');
    this.LoactionId = data[data.length - 1]
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
  }
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  back() {
    window.history.back()
  }
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
          console.log(res[0].Token, 'this.token');
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
