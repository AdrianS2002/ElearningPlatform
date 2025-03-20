import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatbotComponent implements OnInit {
  messages: { sender: string, text: string }[] = [];
  userMessage: string = '';
  isStudent: boolean = false;

  constructor(private chatbotService: ChatbotService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserRole().subscribe(role => {
      this.isStudent = role === 'STUDENT'; 
    });
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
  
    this.messages.push({ sender: "You", text: this.userMessage });
    const messageToSend = this.userMessage;
    this.userMessage = ""; // Curăță inputul
  
    this.chatbotService.sendMessage(messageToSend).subscribe({
      next: (response) => {
        console.log("🛠️ AI Response in Frontend:", response); 
        if (response && response.reply) {
          this.messages.push({ sender: "AI", text: response.reply }); 
        } else {
          this.messages.push({ sender: "AI", text: "Sorry, I could not understand that." });
        }
      },
      error: (err) => {
        console.error("🔥 Chatbot Error in Frontend:", err);
        this.messages.push({ sender: "AI", text: "Sorry, there was an error communicating with AI." });
      }
    });
  }
  
}