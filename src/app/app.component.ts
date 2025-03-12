import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogoutService } from './service/logout.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreIssueService } from './service/store-issue.service';
import { LoginService } from './service/login.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setToken } from './NgrxStore/auth.action';
import { DialogCompComponent } from './dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Commercial';
  locationId: number = 0;
  empId: number = 0;
  storeIssueId: number = 460;
  token: string = '';
  sessionTimeoutHandled: boolean = false; // Flag to track if session timeout logic has been executed
  timeoutSubscription: any; // Store the subscription to the idle timeout

  constructor(
    private logoutService: LogoutService,
    private loginService: LoginService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private storeIssueService: StoreIssueService,
    private dialog: MatDialog
  ) { }

  UserName: string = ''
  ngOnInit() {
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.UserName = Data.cusername;
    this.initializeSessionData();
    this.setupIdleTimeout();
    this.updateStoreIssueLogout();
    this.dispatchTokenToStore();
  }

  ngOnDestroy(): void {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe(); // Unsubscribe to avoid subsequent timeouts
    }
    this.logoutService.stopTimer();
    this.dialog.closeAll();
  }

  private initializeSessionData(): void {
    const locationData = sessionStorage.getItem('location');
    if (locationData) {
      const data = JSON.parse(locationData);
      this.locationId = data[data.length - 1];
    }

    const sessionData = sessionStorage.getItem('session');
    if (sessionData) {
      const user = JSON.parse(sessionData);
      this.empId = user.empid;
    }
  }

  private setupIdleTimeout(): void {
    const idleTimeoutInSeconds = 3000;  // 5 minutes Set to the number of seconds you want for idle timeout
    this.timeoutSubscription = this.logoutService.startWatching(idleTimeoutInSeconds).subscribe({
      next: (isTimeout: boolean) => {
        if (isTimeout && !this.sessionTimeoutHandled) {
          this.sessionTimeoutHandled = true; // Mark timeout as handled
          this.handleLogout(); // Call handleLogout for the first timeout

          // Stop further timeouts from being triggered
          if (this.timeoutSubscription) {
            this.timeoutSubscription.unsubscribe();
          }
        }
      },
      error: (err) => console.error('Error in idle timeout:', err),
    });
  }

  handleLogout() {
    let updatelist = [];
    updatelist.push({
      EmpId: this.empId,
    });
    let logincheck = JSON.parse(sessionStorage.getItem('islogIn') || '{}');
    if (logincheck == true) {
      this.loginService.UpdateUserDet(updatelist).subscribe({
        next: (data: any) => {
          if (data.length >= 1) {
            if (data[0].status == 'N') {
              this.Error = data[0].Msg;
              this.userHeader = 'Error';
              this.opendialog();
              return;
            }
            this.toastr.warning('Session Timeout Logout');
            sessionStorage.clear();
            localStorage.clear();
            this.dialog.closeAll();
            this.router.navigate(['/login']);
            // window.location.href = '/login';
          }
        },
      });
    }
  }

  updateStoreIssueLogout(): void {
    this.storeIssueId = 166;
    const lockScreenData = {
      LocationId: this.locationId,
      EmpId: this.empId,
      ModuleId: this.storeIssueId,
      Loginsystem: 'Tab-Entry',
    };

    this.storeIssueService.Updatelogoutime(lockScreenData).subscribe({
      next: (res: any) => {
        res
      },
      error: (err) => {
        this.Error = err.message
        this.userHeader = 'Error'
        this.opendialog()
        return
      }
    });
  }

  private dispatchTokenToStore(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.store.dispatch(setToken({ token }));
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


