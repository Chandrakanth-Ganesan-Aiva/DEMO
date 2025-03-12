import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exambles',
  templateUrl: './exambles.component.html',
  styleUrls: ['./exambles.component.scss']
})
export class ExamblesComponent {
  constructor(private router: Router){}
  Logout(){
    this.router.navigate(['/login'], {});
  }
}
