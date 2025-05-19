import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private backendUrl = 'http://localhost:5000/api/chatbot'; 

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    return this.http.post<{ reply: string }>(this.backendUrl, { message });
  }
}
