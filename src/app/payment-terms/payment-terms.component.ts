import { Component } from '@angular/core';
import { PaymentTermsService } from '../service/payment-terms.service';
import { filter } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrl: './payment-terms.component.scss'
})
export class PaymentTermsComponent {

  constructor(private service: PaymentTermsService, private dialog: MatDialog) { }
  termid: number | null = null
  check: boolean = false
  show: boolean = false
  terms: string = ''
  count: number | null = null
  termiden: number | null = null


  loadArray: any = [];
  table1Array: any = []
  termArray: any[] = []
  termsArray: any[] = []
  approveArray: any = []
  ngOnInit() {
    this.load()
  }
  selectedTermId: number | null = null;


  load() {
    this.service.load().subscribe((result: any) => {
      this.loadArray = result
    })
  }
  term(event: any, row: any) {
    if (event.target.checked) {
      this.selectedTermId = row.termid;
      this.service.table1(this.selectedTermId).subscribe((result: any) => {
        this.table1Array = result;
        this.show = this.table1Array.length > 0;
      });
    } else {
      this.selectedTermId = null;
      this.table1Array = [];
      this.show = false;
    }
  }

  tableData: any[] = [
    { terms: '', percentage: '', advance: 'N', detail: '' }
  ];

  addRow() {
    this.tableData = this.tableData.concat({ terms: '', percentage: '', advance: 'N', detail: '' });
  }

  removeRow(index: number) {
    if (index !== 0) {
      this.tableData.splice(index, 1);  // Remove the row at the given index
      this.tableData = [...this.tableData];
    }
  }


  updateRow(index: number, key: string, value: string) {
    this.tableData[index][key] = value;
    this.tableData = [...this.tableData]; // Force Angular to detect changes
    console.log(this.tableData);
  }

  description(value: string) {
    this.terms = encodeURIComponent(value.trim()); // Trim extra spaces
    this.termArray.push({ terms: this.terms })
    console.log(this.termArray);
    console.log(this.termArray.length);
    if (this.terms) {
      this.service.condition(this.terms).subscribe((result: any) => {
        this.count = result.termCount
      });
    }
  }

  saveArray: any[] = []
  save() {
    if (this.count === 0) {
      let missingFields: string[] = [];
      this.tableData.forEach((row, index) => {
        for (const key of ['terms', 'percentage', 'advance', 'detail']) {
          if (!row[key] || row[key].toString().trim() === '') {
            missingFields.push(`Row ${index + 1}: ${key} is missing`);
          }
        }
        if (row.percentage < 0 || row.percentage > 100) {
          missingFields.push(`Row ${index + 1}: Percentage should be within 0 to 100`);
        }
      });
      if (missingFields.length > 0) {
        this.Error = `Please fill in the missing fields:\n${missingFields.map(field => `- ${field}`).join('\n')}`;
        this.userHeader = 'Information'
        this.opendialog()
        return;
      }
      this.Error = 'Are you sure to Update?'
      this.userHeader = 'Save'
      this.opendialog()
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.termsArray.push({ terms: this.termArray[this.termArray.length - 1].terms });
          this.service.terms(this.termsArray).subscribe((result: any) => {
            if (result) {
              this.termiden = result[0]?.id;
              if (this.termiden) {
                this.approveArray = this.tableData.map(row => ({
                  termid: this.termiden,
                  term: row.terms,
                  percentage: row.percentage,
                  advance: row.advance,
                  detail: row.detail,
                }));
                console.log(this.approveArray, 'leng');
                this.service.save(this.approveArray).subscribe((result: any) => {
                  console.log(result, 'res');
                  this.Error = result.message
                  this.userHeader = 'Information'
                  this.opendialog()
                  this.Clear();
                });
              }
            }

          });
        }
      })
    } else if (this.count == null) {
      this.Error = 'Enter Description'
      this.userHeader = 'Information'
      this.opendialog()
    } else {
      this.Error = 'Already you are having the same spec'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }

  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }

  Clear() {
    this.termid = null
    this.check = false
    this.show = false
    this.terms = ''
    this.count = null
    this.termiden = null
    this.loadArray = [];
    this.table1Array = []
    this.termArray = []
    this.termsArray = []
    this.approveArray = []
    this.tableData = []
    this.selectedTermId = null
    this.load()
    this.tableData = [{ terms: '', percentage: '', advance: 'N', detail: '' }];
  }
}