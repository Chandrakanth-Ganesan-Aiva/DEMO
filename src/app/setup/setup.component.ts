import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  constructor(private router: Router){  }
  currentScreenSize:string=''
  ngOnInit(): void {

  }
  mpinview:string=''
  Reset(){
    this.mpinview= 'Reset'
  }
  back(){
    this.mpinview= ''
  }
  Logout() {
    this.router.navigate(['/login'], {});
  }


}
