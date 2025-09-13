import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-register-whatsapp',
  imports: [Header],
  templateUrl: './register-whatsapp.html',
  styleUrl: './register-whatsapp.css',
})
export class RegisterWhatsapp {
  qrCodeHtmlPage = signal(`Loading QR Code...`);
  httpClient = inject(HttpClient);

  constructor() {
    this.fetchPage();
    setInterval(() => {
      this.fetchPage();
    }, 30000); // Refresh every 30 seconds
  }

  fetchPage() {
    const url = 'https://jarvis-project-468922.rj.r.appspot.com/qr-code';

    this.httpClient
      .get(url, {
        responseType: 'text',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .subscribe({
        next: (response) => {
          this.qrCodeHtmlPage.set(response);
        },
        error: (error) => {
          console.error('Error fetching QR code:', error);
        },
      });
  }
}
