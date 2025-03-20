import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-geoloc',
  standalone: true,
  imports: [NgIf],
  templateUrl: './geoloc.component.html',
  styleUrl: './geoloc.component.css'
})
export class GeolocComponent {
  @Output() locationSaved = new EventEmitter<string>();
  showGeoPopup = false;

  ngOnInit(): void {
    this.checkLocationPermission();
  }

  checkLocationPermission() {
    const savedLocation = document.cookie
      .split('; ')
      .find(row => row.startsWith('userLocation='));

    if (!savedLocation) {
      this.showGeoPopup = true;
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const locationData = `${latitude},${longitude}`;

       
          document.cookie = `userLocation=${locationData}; max-age=${7 * 24 * 60 * 60}; path=/`;

          this.showGeoPopup = false; 
          this.locationSaved.emit(locationData); 
          console.log(" Location saved:", locationData);
        },
        error => {
          console.error(" Error getting location:", error);
          this.showGeoPopup = false;
        }
      );
    } else {
      console.error(" Geolocation is not supported.");
      this.showGeoPopup = false;
    }
  }

  denyLocation() {
    this.showGeoPopup = false;
    console.log(" User denied location access.");
  }
}
