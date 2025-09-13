import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-register-whatsapp',
  imports: [],
  templateUrl: './register-whatsapp.html',
  styleUrl: './register-whatsapp.css',
})
export class RegisterWhatsapp {
  qrCodeHtmlPage = `
      <html>
        <head>
          <title>WhatsApp Conectado</title>
        </head>
        <body>
          <h1>WhatsApp Conectado!</h1>
          <p>Não há QR Code disponível pois a sessão já está ativa.</p>
          <p>Informações da conexão:</p>
          <pre>{
  "pushname": "Kassio San Tech",
  "wid": {
    "server": "c.us",
    "user": "556392470299",
    "_serialized": "556392470299@c.us"
  },
  "me": {
    "server": "c.us",
    "user": "556392470299",
    "_serialized": "556392470299@c.us"
  },
  "platform": "smbi"
}</pre>
        </body>
      </html>
    `;
  httpClient = inject(HttpClient);

  

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
          this.qrCodeHtmlPage = response;
        },
        error: (error) => {
          console.error('Error fetching QR code:', error);
        },
      });
  }
}
