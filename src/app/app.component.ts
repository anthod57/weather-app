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

  // Weather codes from https://open-meteo.com/en/docs#api_form
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
    // Get city latitude and longitude required for weather API call
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${this.searchInput}`).then(response => response.json()).then(data => {
      console.log(data);
      if (!data.results) {
        this.error = true;
        this.errorText = "City not found.";
      } else {
        this.cityData = data.results[0];

        // Fetch weather data
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${this.cityData.latitude}&longitude=${this.cityData.longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode&daily=temperature_2m_max,temperature_2m_min&timezone=${this.cityData.timezone}`)
          .then(response => response.json()).then(data => {
            this.cityData.weatherData = data;

            // Convert dates from the API server to locale time string
            let dateArray: [string] = this.cityData.weatherData.hourly.time.map((date: string) => new Date(date).toLocaleString());

            // Convert NOW to match the API server date format
            let now = new Date(Date.now());
            let currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
        
            let currentHourIndex = dateArray.findIndex(x => x === currentHour.toLocaleString());

            this.cityData.weatherData.currentTemperature = data.hourly.temperature_2m[currentHourIndex];
            this.cityData.weatherData.currentWeatherCode = data.hourly.weathercode[currentHourIndex];
          });
      }
    }).catch((error) => {
      this.error = true;
      this.errorText = error.toString();
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

    // If weather code doesn't match any codes above
    return "fa-solid fa-cloud";
  }
}