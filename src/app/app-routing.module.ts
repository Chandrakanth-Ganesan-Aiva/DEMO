import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryMainModuleComponent } from './inventory-main-module/inventory-main-module.component';
import { PurchaseRequestComponent } from './purchase-request/purchase-request.component';
import { SetupComponent } from './setup/setup.component';
import { DemoComponent } from './demo/demo.component';
import { ExamblesComponent } from './exambles/exambles.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DirectIndentComponent } from './direct-indent/direct-indent.component';
import { IssueRequestComponent } from './issue-request/issue-request.component';
import { StoreIssueComponent } from './store-issue/store-issue.component';
import { AdminComponent } from './admin/admin.component';
import { MaterialReturnFrmDeptComponent } from './material-Recived-frm-dept/material-return-frm-dept.component';
import { ReworkissueComponent } from './reworkissue/reworkissue.component';
import { StorageQtyAllocationComponent } from './storage-qty-allocation/storage-qty-allocation.component';
import { ShelfLifeBatchQtyComponent } from './shelf-life-batch-qty/shelf-life-batch-qty.component';
import { StoreToStoreMomentComponent } from './store-to-store-moment/store-to-store-moment.component';
import { StoreissuelogoutComponent } from './storeissuelogout/storeissuelogout.component';
import { IndentEntryComponent } from './indent-entry/indent-entry.component';
import { PurchaseMainModuleComponent } from './purchase-main-module/purchase-main-module.component';
import { AuthGuard } from './auth.guard';
import { GrnWithoutBillENtryApprComponent } from './grn-without-bill-entry-appr/grn-without-bill-entry-appr.component';
import { ApprovalmainModuleComponent } from './approvalmain-module/approvalmain-module.component';
import { WeighmentRejApprComponent } from './weighment-rej-appr/weighment-rej-appr.component';
import { WeighmentDelayApprComponent } from './weighment-delay-appr/weighment-delay-appr.component';
import { GrndeleteComponent } from './grndelete/grndelete.component';
import { GrndeleterequestComponent } from './grndeleterequest/grndeleterequest.component';
import { WeighmentRejectionRequestComponent } from './weighment-rejection-request/weighment-rejection-request.component';

import { GateEntryDelayComponent } from './gate-entry-delay/gate-entry-delay.component';
import { GateEntryDelayApprComponent } from './gate-entry-delay-appr/gate-entry-delay-appr.component';
import { WeighPrintDaimlrComponent } from './weigh-print-daimlr/weigh-print-daimlr.component';
import { MinmumMaximumEntryComponent } from './minmum-maximum-entry/minmum-maximum-entry.component';
import { QtyDeAllocationComponent } from './qty-de-allocation/qty-de-allocation.component';
import { ItemMasterApprovalComponent } from './item-master-approval/item-master-approval.component';
import { QcRequiredComponent } from './qc-required/qc-required.component';
import { ShelfLifeRecertificateComponent } from './shelf-life-recertificate/shelf-life-recertificate.component';
import { PDRawmaterialChangeComponent } from './pd-rawmaterial-change/pd-rawmaterial-change.component';
import { RawmaterialSplitComponent } from './rawmaterial-split/rawmaterial-split.component';
import { PackingWeightComponent } from './packing-weight/packing-weight.component';
import { CustomerReturnComponent } from './customer-return/customer-return.component';
import { GrnWithoutBillEntryComponent } from './grn-without-bill-entry/grn-without-bill-entry.component';
import { RawMaterialSplitMasterComponent } from './raw-material-split-master/raw-material-split-master.component';
import { POCloseComponent } from './poclose/poclose.component';
import { Poclose2Component } from './poclose2/poclose2.component';
import { Poclose3Component } from './poclose3/poclose3.component';
import { CreditdaysApprovalComponent } from './creditdays-approval/creditdays-approval.component';
import { ClearingApprovalComponent } from './clearing-approval/clearing-approval.component';
import { IndentPendingApprovalComponent } from './indent-pending-approval/indent-pending-approval.component';
import { SupplierregAppPurComponent } from './supplierreg-app-pur/supplierreg-app-pur.component';
import { SupplierregAppFinComponent } from './supplierreg-app-fin/supplierreg-app-fin.component';
import { SupplierregApprovalTecComponent } from './supplierreg-approval-tec/supplierreg-approval-tec.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { GRNEntryComponent } from './grnentry/grnentry.component';
import { MailNumberUpdateComponent } from './mail-number-update/mail-number-update.component';



// import { DashboardCommericaComponent } from './dashboard-commerica/dashboard-commerica.component';

const routes: Routes = [
  // -----------------------Home-----------------
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'demo', component: DemoComponent, canActivate: [AuthGuard] },
  { path: 'examble', component: ExamblesComponent, canActivate: [AuthGuard] },
  { path: 'nav', component: NavigationComponent, canActivate: [AuthGuard] },

  // ----------------------DashBoard--------------------------
  { path: 'Inventory', component: InventoryMainModuleComponent, canActivate: [AuthGuard] },
  { path: 'Purchase', component: PurchaseMainModuleComponent, canActivate: [AuthGuard] },
  { path: 'Approval', component: ApprovalmainModuleComponent, canActivate: [AuthGuard] },

  // ---------------------Inventory---------------------------
  { path: 'PurchaseReq', component: PurchaseRequestComponent, canActivate: [AuthGuard] },
  { path: 'issueReq', component: IssueRequestComponent, canActivate: [AuthGuard] },
  { path: 'directIndent', component: DirectIndentComponent, canActivate: [AuthGuard] },
  { path: 'setup', component: SetupComponent, canActivate: [AuthGuard] },
  { path: 'storeissue', component: StoreIssueComponent, canActivate: [AuthGuard] },
  { path: 'reworkissue', component: ReworkissueComponent, canActivate: [AuthGuard] },
  { path: 'MatlReceiveFrmDept', component: MaterialReturnFrmDeptComponent, canActivate: [AuthGuard] },
  { path: 'StorageQtyAlloc', component: StorageQtyAllocationComponent, canActivate: [AuthGuard] },
  { path: 'Shelflife', component: ShelfLifeBatchQtyComponent, canActivate: [AuthGuard] },
  { path: 'StoretoStore', component: StoreToStoreMomentComponent, canActivate: [AuthGuard] },
  { path: 'Storelogout', component: StoreissuelogoutComponent, canActivate: [AuthGuard] },
  { path: 'GateEntryDelayAppr', component: GateEntryDelayApprComponent, canActivate: [AuthGuard] },
  { path: 'GrnDeleteReq', component: GrndeleterequestComponent, canActivate: [AuthGuard] },
  { path: 'shelflifeRecertificate', component: ShelfLifeRecertificateComponent, canActivate: [AuthGuard] },
  { path: 'RawmatSplit', component: RawmaterialSplitComponent, canActivate: [AuthGuard] },
  { path: 'customerreturn', component: CustomerReturnComponent, canActivate: [AuthGuard] },
  { path: 'grnwithoutbillentry', component: GrnWithoutBillEntryComponent, canActivate: [AuthGuard] },
  { path: 'RawmatSpiltMaster', component: RawMaterialSplitMasterComponent, canActivate: [AuthGuard] },
  { path: 'grnEntry', component: GRNEntryComponent, canActivate: [AuthGuard] },
  // ---------------------------Inventory-Transaction------------------------------
  { path: 'GrnDeleteReq', component: GrndeleterequestComponent, canActivate: [AuthGuard] },
  { path: 'IndentEntry', component: IndentEntryComponent, canActivate: [AuthGuard] },
  { path: 'QtyDellaco', component: QtyDeAllocationComponent, canActivate: [AuthGuard] },

  // ---------------------Inventory-Weigment---------------------------
  { path: 'WeighRejReq', component: WeighmentRejectionRequestComponent, canActivate: [AuthGuard] },
  { path: 'WeighprintDailmr', component: WeighPrintDaimlrComponent, canActivate: [AuthGuard] },

  //---------------------Purchase-------------------------------------
  { path: 'POClose1', component: POCloseComponent, canActivate: [AuthGuard] },
  { path: 'poclose2', component: Poclose2Component, canActivate: [AuthGuard] },
  { path: 'poclose3', component: Poclose3Component, canActivate: [AuthGuard] },
  { path: 'creditdaysApprovals', component: CreditdaysApprovalComponent, canActivate: [AuthGuard] },
  { path: 'clearingFrechargesApprovals', component: ClearingApprovalComponent, canActivate: [AuthGuard] },
  { path: 'IndentApprovalPending', component: IndentPendingApprovalComponent, canActivate: [AuthGuard] },
  { path: 'SupplierRegAppApurchase', component: SupplierregAppPurComponent, canActivate: [AuthGuard] },
  { path: 'SupplierRegAppFin', component: SupplierregAppFinComponent, canActivate: [AuthGuard] },
  { path: 'SupplierRegAppTec', component: SupplierregApprovalTecComponent, canActivate: [AuthGuard] },
  { path: 'PaymentTerms', component: PaymentTermsComponent, canActivate: [AuthGuard] },
  { path: 'MailNumberUpdate', component: MailNumberUpdateComponent, canActivate: [AuthGuard] },
  // ---------------------------------Inventory-Master------------------------------
  { path: 'GateEntryDelay', component: GateEntryDelayComponent, canActivate: [AuthGuard] },
  { path: 'minmaxEntry', component: MinmumMaximumEntryComponent, canActivate: [AuthGuard] },
  { path: 'itemMasterAppr', component: ItemMasterApprovalComponent, canActivate: [AuthGuard] },
  { path: 'QcReq', component: QcRequiredComponent, canActivate: [AuthGuard] },
  { path: 'pdRawmatchange', component: PDRawmaterialChangeComponent, canActivate: [AuthGuard] },
  { path: 'packweight', component: PackingWeightComponent, canActivate: [AuthGuard] },
  // ---------------------------------Approval------------------------------
  { path: 'grnWithoutbillEntryAppr', component: GrnWithoutBillENtryApprComponent, canActivate: [AuthGuard] },
  { path: 'WeighRejAppr', component: WeighmentRejApprComponent, canActivate: [AuthGuard] },
  { path: 'WeighDelAppr', component: WeighmentDelayApprComponent, canActivate: [AuthGuard] },
  { path: 'GrnDelete', component: GrndeleteComponent, canActivate: [AuthGuard] },

  //  ---------------------------Admin---------------------------------
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
