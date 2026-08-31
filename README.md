# Khaow – ข้าวและธัญพืชสำคัญของโลก 6 สายพันธุ์

เว็บไซต์นำเสนอผลการศึกษาทางวิชาการแบบ single-page editorial ที่ผสมผสานข้อมูลเชิงวิทยาศาสตร์กับการเล่าเรื่องแบบ scrollytelling สำหรับกลุ่มผู้อ่านหลากหลาย เช่น อาจารย์ นักศึกษา เกษตรกร และผู้สนใจทั่วไป

## ภาพรวมโปรเจกต์

เว็บไซต์นี้ออกแบบให้ทำหน้าที่เป็นสื่อการเรียนรู้เชิงลึกและงานนำเสนอทางวิชาการไปพร้อมกัน โดยเน้นความถูกต้องของข้อมูล ความชัดเจนของการเปรียบเทียบ และความสวยงามระดับงานนำเสนอเชิงสถาปัตยกรรมข้อมูล (data storytelling)

## คุณสมบัติเด่น

- Hero section แบบเต็มจอพร้อมภาพทุ่งนาและ overlay gradient
- Sticky navigation with glassmorphism effect
- Dark mode และ Thai/English language switch
- Species gallery 6 สายพันธุ์ พร้อม search, filter และ modal รายละเอียด
- Nutrition comparison table และ Chart.js radar/bar chart
- Disease resistance heatmap แบบ interactive
- Lifecycle timeline และ summary cards
- SEO meta tags, Open Graph, Twitter Card และ JSON-LD Dataset
- GitHub Actions deploy workflow สำหรับ GitHub Pages

## เทคโนโลยีที่ใช้

- HTML5
- Tailwind CSS via CDN
- ES Modules JavaScript
- GSAP + ScrollTrigger
- Chart.js
- Swiper.js
- Lenis smooth scrolling
- Lucide icons
- Google Fonts

## วิธีติดตั้งและรันบนเครื่อง

1. Clone repository

```bash
git clone https://github.com/<username>/Khaow.git
cd Khaow
```

2. เปิดไฟล์ index.html ในเบราว์เซอร์ หรือรัน local server

```bash
python3 -m http.server 8000
```

3. เปิด URL ด้านล่างในเบราว์เซอร์

```text
http://localhost:8000
```

## วิธี deploy ขึ้น GitHub Pages

1. Push code ไปที่ branch `main`
2. ไปที่ Repository Settings → Pages
3. เลือก Source เป็น GitHub Actions
4. Workflow ที่มีอยู่จะ deploy อัตโนมัติทุกครั้งที่ push

ไฟล์ workflow อยู่ที่:

```text
.github/workflows/deploy.yml
```

## โครงสร้างไฟล์

```text
Khaow/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
├─ assets/
│  ├─ logo-grain.svg
│  └─ images/
├─ css/
│  └─ style.css
├─ js/
│  ├─ main.js
│  ├─ charts.js
│  ├─ animations.js
│  ├─ i18n.js
│  └─ data.js
├─ .gitignore
├─ index.html
├─ LICENSE
├─ README.md
├─ robots.txt
├─ sitemap.xml
└─
```

## ข้อควรทราบเมื่อแก้ไขต่อ

- ข้อมูลสายพันธุ์และโภชนาการอยู่ใน `js/data.js`
- การ render การ์ดและตารางอยู่ใน `js/charts.js`
- การจัดการอีเวนต์/ภารกิจของหน้าอยู่ใน `js/main.js`
- การสลับภาษาและ meta content สามารถปรับเพิ่มเติมได้จาก `js/i18n.js`
- ตัวเลือกธีมและ preloader อยู่ใน `index.html` และ `js/main.js`

## License

Project นี้เผยแพร่ภายใต้ MIT License

## เครดิต

- ภาพประกอบจาก Unsplash
- ไอคอนจาก Lucide
- ฟอนต์จาก Google Fonts
- โครงสร้างเว็บคำนึงถึงการใช้งานบน GitHub Pages อย่างแท้จริง
