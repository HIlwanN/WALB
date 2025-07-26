# WhatsApp Load Balancer

## Arsitektur

- **baileys-bot**: Bot WhatsApp yang menerima pesan dan meneruskan ke load balancer.
- **whatsapp-lb (Nginx)**: Load balancer berbasis Nginx yang mendistribusikan request ke beberapa backend bot.
- **bot-backend1, bot-backend2, bot-backend3**: Service backend bot yang menerima request dari load balancer.

## Cara Menjalankan

1. Pastikan Docker & Docker Compose sudah terinstall.
2. Jalankan perintah berikut di folder project:
   ```sh
   docker-compose up --build
   ```
3. Scan QR code WhatsApp di http://localhost:3000/qr
4. Kirim pesan ke WhatsApp bot, pesan akan didistribusikan ke backend bot secara bergantian (round-robin).

## Konfigurasi Nginx (whatsapp-lb)
File `whatsapp-lb/nginx.conf` mengatur load balancing ke tiga backend bot:

```
upstream bot_backend {
    server bot-backend1:3001;
    server bot-backend2:3002;
    server bot-backend3:3003;
}

server {
    listen 8080;
    location / {
        proxy_pass http://bot_backend;
    }
}
```

## Menambah Backend Bot
- Tambahkan service baru di `docker-compose.yml` dan di `nginx.conf` pada bagian `upstream`.

## Catatan
- Jangan lupa untuk rebuild jika ada perubahan pada konfigurasi Nginx:
  ```sh
  docker-compose up --build
  ``` 