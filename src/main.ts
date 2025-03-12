import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // 👈 Înlocuiește `HttpClientModule`
    ...appConfig.providers
  ]
}).catch(err => console.error(err));
