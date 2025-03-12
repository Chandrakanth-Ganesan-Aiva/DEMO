
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InventoryMainModuleComponent } from './inventory-main-module/inventory-main-module.component';
import { PurchaseRequestComponent } from './purchase-request/purchase-request.component';
import { SetupComponent } from './setup/setup.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { DatePipe, DecimalPipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DemoComponent } from './demo/demo.component';
import { ExamblesComponent } from './exambles/exambles.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MAT_SELECT_CONFIG, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputOtpModule } from 'primeng/inputotp';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastrModule } from 'ngx-toastr';
import { NavigationComponent } from './navigation/navigation.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DirectIndentComponent } from './direct-indent/direct-indent.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IssueRequestComponent } from './issue-request/issue-request.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StoreIssueComponent } from './store-issue/store-issue.component'
import { MatTabsModule } from '@angular/material/tabs';
import { AdminComponent } from './admin/admin.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialReturnFrmDeptComponent } from './material-Recived-frm-dept/material-return-frm-dept.component';
// import { DashboardCommericaComponent } from './dashboard-commerica/dashboard-commerica.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReworkissueComponent } from './reworkissue/reworkissue.component';
import { DialogModule } from 'primeng/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StorageQtyAllocationComponent } from './storage-qty-allocation/storage-qty-allocation.component';
import { TooltipModule } from 'primeng/tooltip';
import { ShelfLifeBatchQtyComponent } from './shelf-life-batch-qty/shelf-life-batch-qty.component';
import { StoreToStoreMomentComponent } from './store-to-store-moment/store-to-store-moment.component';
import { StoreissuelogoutComponent } from './storeissuelogout/storeissuelogout.component';
import { IndentEntryComponent } from './indent-entry/indent-entry.component';
import { PurchaseMainModuleComponent } from './purchase-main-module/purchase-main-module.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GrnWithoutBillENtryApprComponent } from './grn-without-bill-entry-appr/grn-without-bill-entry-appr.component';
import { ApprovalmainModuleComponent } from './approvalmain-module/approvalmain-module.component';
import { WeighmentRejApprComponent } from './weighment-rej-appr/weighment-rej-appr.component';
import { WeighmentDelayApprComponent } from './weighment-delay-appr/weighment-delay-appr.component';
import { GrndeleteComponent } from './grndelete/grndelete.component';
import { GrndeleterequestComponent } from './grndeleterequest/grndeleterequest.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { WeighmentRejectionRequestComponent } from './weighment-rejection-request/weighment-rejection-request.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { GateEntryDelayComponent } from './gate-entry-delay/gate-entry-delay.component';
import { MatDividerModule } from '@angular/material/divider';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { GateEntryDelayApprComponent } from './gate-entry-delay-appr/gate-entry-delay-appr.component';
import { DialogCompComponent } from './dialog-comp/dialog-comp.component';
import { WeighPrintDaimlrComponent } from './weigh-print-daimlr/weigh-print-daimlr.component';
import { MinmumMaximumEntryComponent } from './minmum-maximum-entry/minmum-maximum-entry.component';
import { QtyDeAllocationComponent } from './qty-de-allocation/qty-de-allocation.component';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { ItemMasterApprovalComponent } from './item-master-approval/item-master-approval.component';
import { QcRequiredComponent } from './qc-required/qc-required.component';
import { ShelfLifeRecertificateComponent } from './shelf-life-recertificate/shelf-life-recertificate.component';
import { PDRawmaterialChangeComponent } from './pd-rawmaterial-change/pd-rawmaterial-change.component';
import { RawmaterialSplitComponent } from './rawmaterial-split/rawmaterial-split.component';
import { PackingWeightComponent } from './packing-weight/packing-weight.component';
import { CustomerReturnComponent } from './customer-return/customer-return.component';
import { CustomerRejdialogComponent } from './customer-rejdialog/customer-rejdialog.component';
import { GrnWithoutBillEntryComponent } from './grn-without-bill-entry/grn-without-bill-entry.component';
import { StoreModule } from '@ngrx/store';
import { TokenInterceptorService } from './Interceptor/token-interceptor.service';
import { authReducer } from './NgrxStore/auth.reducer';
import { HttpRequestInterceptor } from './Interceptor/http-request.interceptor';
import { RawMaterialSplitMasterComponent } from './raw-material-split-master/raw-material-split-master.component';

// ---Purchase Modules---
import { POCloseComponent } from './poclose/poclose.component';
import { Poclose2Component } from './poclose2/poclose2.component';
import { Poclose3Component } from './poclose3/poclose3.component';
import { CreditdaysApprovalComponent } from './creditdays-approval/creditdays-approval.component';
import { ClearingApprovalComponent } from './clearing-approval/clearing-approval.component';
import { CustomizeDialogComponent } from './customize-dialog/customize-dialog.component';
import { IndentPendingApprovalComponent } from './indent-pending-approval/indent-pending-approval.component';
import { SupplierregAppPurComponent } from './supplierreg-app-pur/supplierreg-app-pur.component';
import { SupplierregAppFinComponent } from './supplierreg-app-fin/supplierreg-app-fin.component';
import { SupplierregApprovalTecComponent } from './supplierreg-approval-tec/supplierreg-approval-tec.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { MailNumberUpdateComponent } from './mail-number-update/mail-number-update.component';

import { GRNEntryComponent } from './grnentry/grnentry.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    InventoryMainModuleComponent,
    PurchaseRequestComponent,
    SetupComponent,
    DemoComponent,
    ExamblesComponent,
    NavigationComponent,
    DirectIndentComponent,
    IssueRequestComponent,
    StoreIssueComponent,
    AdminComponent,
    MaterialReturnFrmDeptComponent,
    ReworkissueComponent,
    StorageQtyAllocationComponent,
    ShelfLifeBatchQtyComponent,
    StoreToStoreMomentComponent,
    StoreissuelogoutComponent,
    IndentEntryComponent,
    PurchaseMainModuleComponent,
    GrnWithoutBillENtryApprComponent,
    ApprovalmainModuleComponent,
    WeighmentRejApprComponent,
    WeighmentDelayApprComponent,
    GrndeleteComponent,
    GrndeleterequestComponent,
    WeighmentRejectionRequestComponent,
    GateEntryDelayComponent,
    GateEntryDelayApprComponent,
    DialogCompComponent,
    WeighPrintDaimlrComponent,
    MinmumMaximumEntryComponent,
    QtyDeAllocationComponent,
    ItemMasterApprovalComponent,
    QcRequiredComponent,
    ShelfLifeRecertificateComponent,
    PDRawmaterialChangeComponent,
    RawmaterialSplitComponent,
    PackingWeightComponent,
    CustomerReturnComponent,
    CustomerRejdialogComponent,
    GrnWithoutBillEntryComponent,
    RawMaterialSplitMasterComponent,
    //Purchase,

    POCloseComponent,
    Poclose2Component, Poclose3Component, CreditdaysApprovalComponent, ClearingApprovalComponent, CustomizeDialogComponent, IndentPendingApprovalComponent, SupplierregAppPurComponent, SupplierregAppFinComponent, SupplierregApprovalTecComponent, PaymentTermsComponent, MailNumberUpdateComponent, GRNEntryComponent,
    // DashboardCommericaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule, SplitButtonModule, MatDividerModule, MatNativeDateModule,
    MatToolbarModule, MatDatepickerModule,
    MatRadioModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule, MatSelectModule,
    FormsModule, ReactiveFormsModule, NgxMatSelectSearchModule,
    NgSelectModule,
    MatCheckboxModule,
    InputOtpModule, MatExpansionModule, MatStepperModule, MatDialogModule,
    FieldsetModule, MatTooltipModule, DialogModule, NgxSpinnerModule, ConfirmDialogModule, TooltipModule, MatProgressSpinnerModule,
    TableModule, ContextMenuModule, MatSidenavModule, MatListModule, MatTableModule, MatPaginatorModule, MatSortModule,
    HttpClientModule, MatAutocompleteModule, MatTabsModule, NgMultiSelectDropDownModule, MatButtonToggleModule, MatProgressBarModule,
    StoreModule.forRoot({ auth: authReducer })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true, // Allow multiple interceptors
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'en-GB'
    },
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },

    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }

    , DatePipe, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
