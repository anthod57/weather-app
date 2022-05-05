import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'weather-app';
  searchInput: string;
  error: boolean;
  errorText: string;
  cityData: any;

  sunnyWeatherCode = [0, 1, 2, 3];
  rainyWeatherCode = [61, 63, 65, 66, 67, 80, 81, 82];
  snowyWeatherCode = [71, 73, 75, 77, 85, 86];
  stormyWeatherCode = [95, 96, 99];

  onClick() {
    if (!this.searchInput) {
      this.error = true;
      this.errorText = "Please enter a valid city name !";
      return;
    } else {
      this.error = false;
      this.errorText = "";
      this.getData();
    }
  }

  getData() {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${this.searchInput}`).then(response => response.json()).then(data => {
      console.log(data);
      if (!data.results) {
        this.error = true;
        this.errorText = "City not found.";
      } else {
        this.cityData = data.results[0];
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${this.cityData.latitude}&longitude=${this.cityData.longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode&daily=temperature_2m_max,temperature_2m_min&timezone=${this.cityData.timezone}`)
          .then(response => response.json()).then(data => {
            this.cityData.weatherData = data;
            this.cityData.weatherData.currentTemperature = data.hourly.temperature_2m[data.hourly.temperature_2m.length - 1];
            this.cityData.weatherData.currentWeatherCode = data.hourly.weathercode[data.hourly.weathercode.length - 1];
            console.log(this.cityData)
          });
      }
    }).catch((error) => {
      this.error = true;
      this.errorText = error;
    })
  }

  onKeyUp(event: any) {
    if (event.key === "Enter") {
      this.onClick();
    }

    this.searchInput = event.target.value;
  }

  getWeatherIcon(code : number) : string {
    if(this.sunnyWeatherCode.includes(code)){
      return "fa-solid fa-sun";
    }else if (this.rainyWeatherCode.includes(code)){
      return "fa-solid fa-cloud-showers-heavy";
    }else if (this.snowyWeatherCode.includes(code)){
      return "fa-solid fa-snowflake";
    }else if (this.stormyWeatherCode.includes(code)){
      return "fa-solid fa-cloud-bolt";
    }

    return "fa-solid fa-cloud";
  }
}