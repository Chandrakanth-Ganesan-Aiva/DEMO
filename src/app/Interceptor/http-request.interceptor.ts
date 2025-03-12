import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { catchError, finalize, Observable, throwError } from "rxjs";
import { DialogCompComponent } from "../dialog-comp/dialog-comp.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  activeRequests = 0;

  constructor(private spinner: NgxSpinnerService, private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.activeRequests++) this.spinner.show();

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        const errorUrl = error.url || ''; // Get the URL from the error response

        const userFriendlyUrl = errorUrl.replace('192.168.100.5:6055', 'URL'); // Replace IP address with 'url'
        console.log(error.status);

        if (error.status === 0) {
          // Network or server issue
          this.ErrorMsg = 'Internet Problem or Server Issue.<b>Wait few minutes and Try again</b>.<br>Please contact the administrator<br>';
          this.userHeader = "Error";
          this.openDialog();
        } else if (error.status === 404) {
          // Resource not found
          this.ErrorMsg = `The requested page <b style="color:brown"> ${userFriendlyUrl} </B>.. Please contact the administrator`;
          this.userHeader = "Error";
          this.openDialog();
        } else if (error.status === 401) {
          // Unauthorized request
          this.ErrorMsg = "Unauthorized access. Please log in again or contact the administrator.";
          this.userHeader = "Error";
          this.openDialog();
        } else if (error.status >= 500) {
          // Server error
          this.ErrorMsg = "Server is currently unavailable. Please try again later.";
          this.userHeader = "Error";
          this.openDialog();
        }
        else if (error.status >= 403) {
          // Server error
          this.ErrorMsg = "Forbidden: Authorization header is missing or invalid.";
          this.userHeader = "Error";
          this.openDialog();
        } else {
          // Other unhandled errors
          this.ErrorMsg = `Unexpected error occurred <b style="color:brown">${error.status} , ${error} </b>. Please contact the administrator.`;
          this.userHeader = "Error";
          this.openDialog();
        }

        // Rethrow the error to keep the observable chain alive
        return throwError(() => error);
      }),
      // Finalize spinner and active request tracking
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.spinner.hide();
        }
      })
    );
  }
  ErrorMsg: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>;
  openDialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.ErrorMsg, Type: this.userHeader }
    });

  }

}
