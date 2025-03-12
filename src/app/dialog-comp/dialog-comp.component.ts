import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-comp',
  templateUrl: './dialog-comp.component.html',
  styleUrls: ['./dialog-comp.component.scss'],
})
export class DialogCompComponent {
  // open(DialogCompComponent: typeof DialogCompComponent, arg1: {}) {
  //   throw new Error('Method not implemented.');
  // }
  ErrorMsg!: SafeHtml;
  constructor(
    public dialogRef: MatDialogRef<DialogCompComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {
    this.ErrorMsg = this.sanitizer.bypassSecurityTrustHtml(data.Msg)
  }

  Status: boolean = this.data.Type == 'Information' ? true : false
  Yes() {
    this.Status = true
    this.dialogRef.close(this.Status);
  } No() {
    this.Status = false
    this.dialogRef.close(this.Status)
  }

  closeDialog(value: string): void {
    this.dialogRef.close(value);
  }
}
