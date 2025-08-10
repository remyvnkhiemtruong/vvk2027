
# Website Kỷ Niệm THPT – Static (GitHub Pages)

Deploy nhanh một trang hoàn chỉnh: countdown (múi giờ Asia/Ho_Chi_Minh), trạng thái sự kiện, lịch, thư viện ảnh (lightbox),
sổ lưu bút (Google Form / giscus), góc cựu học sinh, quiz…

## Cấu trúc
- `index.html` – Trang chủ (đếm ngược + trạng thái Trước/Đang diễn ra/Sau)
- `about.html` – Giới thiệu & timeline (từ `data/history.json`)
- `leadership.html` – Lãnh đạo qua các thời kỳ (từ `data/leadership.json`)
- `events.html` – Lịch trình + Google Maps (sửa `data/config.json`)
- `gallery.html` – Thư viện ảnh (từ `data/gallery.json`)
- `guestbook.html` – Sổ lưu bút (Google Form / giscus, cấu hình trong `data/config.json`)
- `alumni.html` – Góc cựu học sinh (từ `data/alumni.json`)
- `fun.html` – Quiz nhỏ + BXH localStorage
- `extras.html` – Nơi bổ sung Hall of Fame, Flipbook, 360°, Fun facts…
- `assets/` – Ảnh, CSS, JS
- `data/` – Các file JSON cấu hình & nội dung

## Sửa nhanh
- `data/config.json`
  - `eventDate`: ISO + `+07:00`
  - `livestream.youtubeId`: mã YouTube (nếu có)
  - `maps.embed`: URL nhúng Google Maps
  - `forms.rsvp`, `forms.wishes`: thay bằng link Form thật
  - `giscus`: điền repo/repoId/categoryId (tuỳ chọn)

- `data/*.json`: cập nhật lịch, lịch sử, lãnh đạo, thư viện, alumni,…

## Deploy GitHub Pages
1. Tạo repo → upload toàn bộ file.
2. Bật Settings → Pages → Branch `main` (root).
3. Sau vài phút, site sẽ hoạt động.

> Nếu dùng custom domain: thêm file `CNAME` ở gốc repo.

## Gợi ý mở rộng
- AOS/GSAP/Barba/Typed/Particles… thêm trực tiếp qua CDN trong HTML (đã có GLightbox).
- PWA: tạo `manifest.webmanifest` + `service-worker.js` (tuỳ nhu cầu).
