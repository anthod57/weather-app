import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'weather-app';
  searchInput: string
  city: string
  error: boolean
  errorText: string

  onClick() {
    if(!this.searchInput){
      this.error = true;
      this.errorText = "Please enter a valid city name !";
      return;
    }else{
      this.error = false;
      this.errorText = "";
      this.city = this.searchInput;
    }
  }

  onKeyUp(event: any) {
    this.searchInput = event.target.value;
  }
}