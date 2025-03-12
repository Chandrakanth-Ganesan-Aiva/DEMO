import { Component } from '@angular/core';

@Component({
  selector: 'app-mail-number-update',
  templateUrl: './mail-number-update.component.html',
  styleUrl: './mail-number-update.component.scss'
})
export class MailNumberUpdateComponent {


  selectedType: string | null = null;

  toggleRadio(type: string, event: Event) {
    if (this.selectedType === type) {
      // If clicked again, uncheck
      this.selectedType = null;
      (event.target as HTMLInputElement).checked = false;
    } else {
      // Select the new radio button
      this.selectedType = type;
      

    }
    console.log('Selected Type:', this.selectedType);
  }

}
