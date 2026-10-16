# 🥩 MIETHA KASAP - Avcılık & Kasap Fiyat Hesaplayıcı

Modern **React + TypeScript + Vite** ve **Electron** tabanlı, hem **Web** hem de **Masaüstü** olarak çalışan kasap & avcılık ürünleri fiyat hesaplama ve sipariş yönetim aracı.

---

## 🌟 Özellikler
- **🥩 Ürün Yönetimi:** Et, Deri/Kürk/Boynuz ve Süt/Yağ kategorilerinde anlık adet artırma/azaltma ve özel fiyat girme.
- **🔢 Entegre Hesap Makinesi:** Klavye kısayolları (sayılar, `+`, `-`, `*`, `/`, `Enter`, `C`) destekli tam fonksiyonel hesap makinesi.
- **📸 Yapay Zeka/OCR Fiyat Listesi Tarayıcı:** Tesseract.js ile fotoğraftan veya ekran görüntüsünden (`Ctrl+V`) fiyatları otomatik tespit etme ve tek tıkla uygulama.
- **💾 Yerel Kayıt (localStorage):** Özel girdiğiniz fiyatlar ve siparişler tarayıcınızda veya masaüstünde otomatik olarak hatırlanır.
- **🖥️ Masaüstü Modu (Electron):** "Her Zaman Üstte Tut" (Always on Top) özelliği sayesinde oyun oynarken (RDR2, GTA RP vb.) ekranın bir köşesinde pencerelerin üzerinde kalabilir.

---

## 🚀 Çalıştırma

### 🌐 1. Web Geliştirme Modu (Tarayıcı)
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173` adresini açar.

### 🖥️ 2. Masaüstü Modu (Electron)
```bash
npm run electron:dev
```
Hem Vite yerel sunucusunu hem de Electron masaüstü uygulamasını aynı anda başlatır.

### 📦 3. Web Üretim Derlemesi (Vercel / GitHub Pages için)
```bash
npm run build
```
Çıktı `dist/` klasörüne oluşturulur ve Vercel'e doğrudan deploy edilebilir.
