# Thaiymuan Production — ແພັກເກັດຖ່າຍຮູບງານດອງ

ເວັບສະແດງລາຄາແພັກເກັດຖ່າຍຮູບ ແລະ ຖ່າຍວິດີໂອງານດອງ.
ໄຟລ໌ດຽວ `index.html` — ບໍ່ມີ build, ບໍ່ມີ dependency (ມີແຕ່ Google Fonts).

## ເປີດເບິ່ງຢູ່ເຄື່ອງ
ເປີດ `index.html` ດ້ວຍ browser ໂດຍກົງ.

## ຂຶ້ນ GitHub Pages
1. Push repo ນີ້ຂຶ້ນ GitHub
2. Settings → Pages → Source: **Deploy from a branch**
3. Branch: `main`, Folder: `/ (root)` → Save
4. ປະມານ 1 ນາທີ ເວັບຈະຢູ່ `https://<username>.github.io/<repo>/`

## ໂຄງສ້າງໜ້າ
- **Nav** — sticky, ມົວຫຼັງ (backdrop blur), ມີປຸ່ມ "ຈອງມື້ງານ"
- **Hero** — ຫົວຂໍ້ໃຫຍ່ + ປຸ່ມ CTA + ແຖບສະຖິຕິ (ລາຄາເລີ່ມຕົ້ນ / ຈຳນວນຊ່າງ / ຮູບປຣິ້ນ / 4K)
- **Packages** — ປຸ່ມສະຫຼັບ **ຖ່າຍຮູບ ↔ ຖ່າຍວິດີໂອ** (tabs), ແຕ່ລະດ້ານມີ 4 ແພັກເກັດ
- **Add-ons** — ເສີມຖ່າຍຮູບ 2 ລາຍການ, ເສີມວິດີໂອ 2 ລາຍການ
- **Included** — ສິ່ງທີ່ໄດ້ຮັບໃນທຸກແພັກເກັດ (4 ຫົວຂໍ້)
- **Contact** — ເບີໂທໃຫຍ່ + WhatsApp + Facebook Page
- **Mobile bar** — ແຖບລອຍລຸ່ມຈໍ (WhatsApp / ໂທ) ສະເພາະໜ້າຈໍນ້ອຍກວ່າ 720px

## Responsive
- Fluid type ດ້ວຍ `clamp()` ທັງໝົດ — ບໍ່ມີຂັ້ນຕອນກະໂດດ
- Card grid: `repeat(auto-fit,minmax(290px,1fr))` → 4 ຄໍລັມ (≥1024px), 2 ຄໍລັມ (tablet), 1 ຄໍລັມ (ມືຖື)
- ≤900px: ຊ່ອນ nav links · ≤720px: ເປີດ mobile bar, badge ຍ້າຍມາຢູ່ເທິງຫົວຂໍ້, add-on ວາງເປັນແນວຕັ້ງ
- ຮອງຮັບ `env(safe-area-inset-bottom)` (iPhone notch) ແລະ `prefers-reduced-motion`

## ຟອນ
stack ດຽວ `--sans: "Roboto","Noto Sans Lao",sans-serif` — ອັງກິດ/ເລກ ໃຊ້ **Roboto**,
ຕົວອັກສອນລາວ browser fall back ໄປ **Noto Sans Lao** ອັດຕະໂນມັດ (Roboto ບໍ່ມີ glyph ລາວ).

## ແກ້ໄຂ
| ຢາກແກ້ | ແກ້ຢູ່ໃສ |
|---|---|
| ລາຄາ / ລາຍລະອຽດແພັກເກັດ | `<article class="card">` ແຕ່ລະອັນ |
| ແພັກເກັດທີ່ຕິດປ້າຍ "ນິຍົມ" | class `featured` + `<span class="badge">` |
| ສີ / ຂອບມົນ / ເງົາ | `:root` ດ້ານເທິງຂອງ `<style>` |
| ເບີໂທ (3 ບ່ອນ: contact, mobile bar) | ຄົ້ນຫາ `8562055959236` |
| Facebook | `https://www.facebook.com/thaiymuan` |

## ປຸ່ມ "ຈອງຜ່ານ WhatsApp" ໃນແຕ່ລະ card
JS ອ່ານຂໍ້ມູນຈາກ card ເອງ (ປະເພດ / ຊື່ແພັກເກັດ / ເວລາ / ລາຄາ) ແລ້ວສ້າງ link
`wa.me` ພ້ອມຂໍ້ຄວາມຕັ້ງຕົ້ນໃຫ້ອັດຕະໂນມັດ — **ເພີ່ມ ຫຼື ແກ້ແພັກເກັດແລ້ວ
ບໍ່ຕ້ອງແກ້ link ເລີຍ**. ຂໍ້ຄວາມທີ່ລູກຄ້າຈະສົ່ງມາ:

```
ສະບາຍດີ Thaiymuan Production

ຂ້ອຍສົນໃຈແພັກເກັດນີ້:
ປະເພດ: ຖ່າຍຮູບ
ແພັກເກັດ: ງານສວຍຫາແລງ
ເວລາ: 15:00 – 23:00
ລາຄາ: 12,000 ฿

ຢາກສອບຖາມມື້ວ່າງ ແລະ ລາຍລະອຽດເພີ່ມເຕີມ
```

ຢາກແກ້ຮູບແບບຂໍ້ຄວາມ → ແກ້ array `msg` ໃນ `<script>` ທ້າຍໄຟລ໌.

## ໂລໂກ້ (`logo/`)
| ໄຟລ໌ | ໃຊ້ບ່ອນໃດ |
|---|---|
| `ຖ່າຍມ່ວນ signager.png` | ຕົ້ນສະບັບ 6657×2750 (ບໍ່ໄດ້ໃຊ້ໃນເວັບໂດຍກົງ) |
| `wordmark.png` | nav, hero, contact, footer (ຂາວ ພື້ນໂປ່ງໃສ 1000px) |
| `favicon.png` | icon ຢູ່ tab ຂອງ browser |
| `apple-touch-icon.png` | icon ຕອນບັນທຶກໃສ່ home screen ມືຖື |
| `og-image.jpg` | ຮູບຕອນແຊຣ໌ link ໃນ Facebook / WhatsApp |

ຖ້າປ່ຽນໂລໂກ້ໃໝ່ ໃຫ້ແທນທີ່ `wordmark.png` ດ້ວຍ PNG **ສີຂາວ ພື້ນໂປ່ງໃສ** (ເພາະເວັບເປັນພື້ນດຳ).

## ແກລເລີຣີ່ຜົນງານ (`gallery/`)
ອັລບັ້ມກຳນົດໄວ້ໃນ `gallery/albums.json` — ໜ້າ `portfolio.html` ອ່ານໄຟລ໌ນີ້ແລ້ວສ້າງ
ກາດອັລບັ້ມ ແລະ ຕົວເບິ່ງຮູບເຕັມຈໍໃຫ້ເອງ.

### ເພີ່ມອັລບັ້ມໃໝ່
1. ສ້າງໂຟນເດີ `gallery/<ຊື່-ອັລບັ້ມ>/`
2. ໃສ່ຮູບເປັນຄູ່: `01.jpg` (ໃຫຍ່ ≤1400px) ແລະ `01-t.jpg` (ຮູບຕົວຢ່າງ ≤640px)
3. ເພີ່ມ block ໃນ `gallery/albums.json`:

```json
{
  "id": "ຊື່-ອັລບັ້ມ",
  "title": "ຊື່ທີ່ສະແດງ",
  "desc": "ຄຳອະທິບາຍສັ້ນ",
  "cover": "gallery/ຊື່-ອັລບັ້ມ/01-t.jpg",
  "photos": [
    {"src":"gallery/ຊື່-ອັລບັ້ມ/01.jpg","thumb":"gallery/ຊື່-ອັລບັ້ມ/01-t.jpg","w":1400,"h":933}
  ]
}
```

ຢ່າໃຊ້ link ຮູບຈາກ Facebook ໂດຍກົງ — link ຂອງ `fbcdn.net` ມີວັນໝົດອາຍຸ ແລ້ວຮູບຈະແຕກ.

## ສາມພາສາ (ລາວ / ไทย / English)
ປຸ່ມປ່ຽນພາສາຢູ່ແຖບ nav. ພາສາທີ່ເລືອກເກັບໄວ້ໃນ browser (`localStorage`) —
ກັບມາເຂົ້າເວັບອີກຈະໄດ້ພາສາເດີມ. ຜູ້ເຂົ້າຊົມໃໝ່ໄດ້ພາສາຕາມການຕັ້ງຄ່າ browser
(ໄທ → ไทย, ອັງກິດ → English, ອື່ນໆ → ລາວ).

### ແກ້ ຫຼື ເພີ່ມຂໍ້ຄວາມ
ຂໍ້ຄວາມທັງໝົດຢູ່ `assets/i18n.json`:
```json
"btn.book": { "lo": "ຈອງແພັກເກັດນີ້", "th": "จองแพ็กเกจนี้", "en": "Book this package" }
```
ໃນ HTML ຕິດປ້າຍໄວ້ແບບນີ້ `<a data-i18n="btn.book">ຈອງແພັກເກັດນີ້</a>`
(ໃຊ້ `data-i18n-html` ຖ້າຂໍ້ຄວາມມີ tag ເຊັ່ນ `<br>`).
ຂໍ້ຄວາມໃນ HTML ເປັນພາສາລາວຢູ່ແລ້ວ — ຖ້າ JS ບໍ່ແລ່ນ ກໍຍັງອ່ານໄດ້ປົກກະຕິ.

ຊື່ ແລະ ຄຳອະທິບາຍອັລບັ້ມຢູ່ `gallery/albums.json` (`title_th`, `title_en`,
`desc_th`, `desc_en` — ບໍ່ມີກໍຖອຍໄປໃຊ້ພາສາລາວ).
