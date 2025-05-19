import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageDetectionService {

  async getUserCountry(): Promise<string | null> {
    const savedCountry = localStorage.getItem('userCountry');
    if (savedCountry) {
      console.log('🌍 Country retrieved from localStorage:', savedCountry);
      return savedCountry;
    }
  
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
  
        const { latitude, longitude } = position.coords;
        console.log('📍 Geolocation Coordinates:', latitude, longitude);
  
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await response.json();
        console.log('🌎 Geolocation API Response:', data);
  
        if (data.countryCode) {
          localStorage.setItem('userCountry', data.countryCode);
          return data.countryCode;
        } else {
          return null;
        }
      } catch (error) {
        console.error('❌ Geolocation Error:', error);
        return null;
      }
    } else {
      console.warn('⚠️ Geolocation not supported.');
      return null;  // ✅ Adaugă acest return pentru a acoperi toate căile de execuție
    }
  }
  

  getLanguageByCountry(countryCode: string) {
    return fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
      .then(response => response.json())
      .then(data => {
        console.log('🌍 Language API Response:', data);
        return data;
      })
      .catch(error => {
        console.error('❌ Error fetching language:', error);
        return null;
      });
  }
}
