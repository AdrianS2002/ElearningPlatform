import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageDetectionService {
  
  getUserCountry(): string | null {
    // Verifică dacă țara este deja salvată în cookies sau localStorage
    const savedCountry = localStorage.getItem('userCountry');
    if (savedCountry) {
      console.log('🌍 Country retrieved from localStorage:', savedCountry);
      return savedCountry;
    }

    // Dacă nu este salvată, încearcă să o detectezi din geolocație
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('📍 Geolocation Coordinates:', latitude, longitude);

          // Apelează un API extern pentru a obține țara în funcție de coordonate
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          console.log('🌎 Geolocation API Response:', data);

          if (data.countryCode) {
            localStorage.setItem('userCountry', data.countryCode); // Salvează țara
            return data.countryCode;
          }
        },
        (error) => {
          console.error('❌ Geolocation Error:', error);
        }
      );
    } else {
      console.warn('⚠️ Geolocation not supported.');
    }

    return null;
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
