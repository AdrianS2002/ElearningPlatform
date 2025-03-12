import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, HeaderComponent] // Importăm RouterOutlet pentru a afișa rutele
 // Importăm RouterOutlet pentru a afișa rutele
})
export class AppComponent {
  title = 'eLearning Platform';
}
