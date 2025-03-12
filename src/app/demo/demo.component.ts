
import { ChangeDetectorRef, Component, effect, Input, OnInit } from '@angular/core';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../service/login.service';
import { filter } from 'rxjs/operators';
import { data } from 'jquery';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { startWith } from 'rxjs';
import { Router } from '@angular/router';




// interface Menu {
//   Name: string;
//   icon?: string;
//   subTitle?: string[];

// }
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],

})
export class DemoComponent implements OnInit {

  sidenavClass = 'lg';
  isSmallScreen: boolean = false;

  constructor(private dialog: MatDialog, private service: LoginService, private cdr: ChangeDetectorRef,private router: Router) { }
  UserName: string = ''
  Empid: number = 0
  ngOnInit() {
    const Location = JSON.parse(sessionStorage.getItem('location') || '{}')
    this.LocationId = Location[Location.length - 1]
    let Data = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.UserName = Data.cusername;
    this.Empid = Data.empid
    this.getMenu()

  }
  LocationId: number = 0
  @Input() isSidenavOpen: boolean = true;
  menus: any[] = new Array()
  showsubMenu: boolean = false;
  showSubTitles: boolean = false;
  selectedMainMenuTitle: any;
  Mainid: any
  getMenu() {
    this.menus = [{ 'Name': 'Finance', "MainId": 1, icon: 'account_balance', }, { 'Name': 'Inventory', "MainId": 2, icon: 'local_grocery_store', }, { 'Name': 'Purcahse', "MainId": 3, icon: 'local_parking', },
    { 'Name': 'Sales', "MainId": 4, icon: 'local_grocery_store', }]
    console.log(this.menus);
    // 

  }
  subTitle: any[] = new Array()
  MainMenuId: number = 0
  toggleSubTitles(menu: any) {
    if (this.selectedMainMenuTitle === menu.Name) {
      this.selectedMainMenuTitle = null;
      this.subTitle = [];
      return;
    }
    // console.log(menu);

    this.Mainid = menu.MainId;
    this.selectedMainMenuTitle = menu.Name;
    // alert( this.selectedMainMenuTitle)

    // this.cdr.detectChanges();
    this.service.MenuList(this.Mainid).subscribe((res: any) => {
      if (res.length > 0) {
        if (res[0].status === 'N') {
          this.Error = res[0].Msg;
          this.userHeader = 'Error';
          return this.opendialog();
        }
        // console.log(res);
        this.subTitle = res;
      }
    });
  }
  getArrowIcon(menu: any): string {
    return this.selectedMainMenuTitle === menu.Name ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }
  SubMenuArr: any[] = new Array()
  Subtitle: string = ''
  originalSubMenuArr: any[] = new Array()
  navigateToSubContainer(subtitle: any) {
    this.Subtitle = subtitle.MainMenuName
    this.MainMenuId = subtitle.MainMenuId

    this.cdr.detectChanges();

    this.service.SubMenuList(this.MainMenuId, this.Mainid).subscribe({
      next: (res: any) => {
        if (res.length > 0) {
          if (res[0].status === 'N') {
            this.Error = res[0].Msg;
            this.userHeader = 'Error';
            return this.opendialog();
          }
          // let arr = {
          //   isDisabled: true
          // }
          // res.forEach((element: any) => {
          //   Object.assign(element, arr)
          // });
          this.SubMenuArr = res
          this.originalSubMenuArr = res
          const mainContainer = document.getElementById('main-container');
          const subContainer = document.getElementById('sub-container');

          if (mainContainer && subContainer) {
            mainContainer.style.animation = 'mainAway 0.3s forwards';
            subContainer.style.display = 'block';
            subContainer.style.animation = 'subBack 0.3s forwards';
            this.getUserRights()
            setTimeout(() => {
              if (mainContainer) {
                mainContainer.style.display = 'none';
              }
            }, 300);
          }
        }
      }
    })
  }
  MenuRights: any[] = new Array()
  getUserRights() {
   const routeMap: Record<number, string> = {
      203: 'grnEntry',
      212: 'grnwithoutbillentry',
      234:'IndentEntry',
      374: 'PurchaseReq',
      242: 'issueReq',
      143: 'directIndent',
      473:'storeissue',
      396: 'reworkissue',
      282: 'MatlReceiveFrmDept',
      471:'StorageQtyAlloc',
      440: 'Shelflife',
      472: 'StoretoStore',
      // 202:'GrnDeleteReqId',
      539: 'WeighRejReq',
      191: 'GateEntryDelay',
      538:'WeighprintDailmr',
      285: 'minmaxEntry',
      378: 'QtyDellaco',
      246: 'itemMasterAppr',
      380: 'QcReq',
      441:'shelflifeRecertificate',
      322: 'packweight',
      111: 'customerreturn',
      
    };
    this.service.RighitsCheck(this.Empid, this.LocationId).subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          if (data[0].status === 'N') {
            this.Error = data[0].Msg;
            this.userHeader = 'Error';
            this.opendialog();
          }
          // console.log(data);
          this.MenuRights = data
          this.SubMenuArr = this.SubMenuArr.filter((item: any) =>
            this.MenuRights.some((element) => element.Menuid === item.SubMenuId && element.Status === 'Y')
          );
          this.SubMenuArr.forEach((res: any) => {
            if (routeMap[res.SubMenuId]) {
              res.route = routeMap[res.SubMenuId];
              console.log( res.route);
              
            }
          });
          // console.log( this.SubMenuArr);
          
          // return
         this.SubMenuArr=structuredClone(this.SubMenuArr)
         this.originalSubMenuArr=structuredClone(this.SubMenuArr)
        }
      }
    })
  }
  SearchEvent(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.SubMenuArr = this.originalSubMenuArr.filter(subMenu =>
      subMenu.SubMenuName.toLowerCase().startsWith(searchTerm)
    );
  }

  navigateToMainContainer() {
    const mainContainer = document.getElementById('main-container');
    const subContainer = document.getElementById('sub-container');
    if (mainContainer && subContainer) {
      subContainer.style.animation = 'subPush 0.3s forwards';
      mainContainer.style.display = 'block';
      mainContainer.style.animation = 'mainBack 0.3s forwards';
      setTimeout(() => {
        subContainer.style.display = 'none';
      });
    }
  }
  close1btn:boolean=true
  Close() {
    this.isSidenavOpen = false; // This will close the sidenav
    this.close1btn=false
    this.service.updateSidenavState(false);
    this.service.updateClose1btnState(false);
    // this.router.navigate(['/nav'], {});
  }

  Close1(){
    this.isSidenavOpen = true;
    this.close1btn=true
    this.service.updateSidenavState(true);
    this.service.updateClose1btnState(true);
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



  openSidenav() {
    this.service.updateSidenavState(true);
    this.service.updateClose1btnState(true);
  }
  
  closeSidenav() {
    this.service.updateSidenavState(false);
    this.service.updateClose1btnState(false);
  }
}

