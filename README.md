# jh-peng.github.io

Personal academic website for **Jiahui Peng (彭嘉辉)**.

A lightweight static site with a portrait, profile, research interests, selected news, and publications. No build step or package manager is required.

## Local preview

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765`.

## Deploy with GitHub Pages

Push the contents of this repository to the `main` branch. In **Settings → Pages**, set the source to **Deploy from a branch**, then choose `main` and `/ (root)`.

## Structure

- `index.html` — page content and metadata
- `cv.html` — Education and Honors, linked from the shared navigation
- `style.css` — theme colors, typography, and responsive layout
- `script.js` — light/dark toggle, saved theme preference, current navigation section, and footer year
- `assets/ava.JPG` — original portrait
- `assets/favicon.svg` — site icon
- `assets/medp-clip-figure2.png` — original Figure 2 extracted from page 5 of the MedP-CLIP [arXiv PDF](https://arxiv.org/pdf/2604.11197); the thumbnail links to the full image

## Appearance

Warm off-white background, dark navy text, and restrained blue accents. The page starts in light mode; the header toggle switches to a navy dark theme and remembers the choice when browser storage is available. Theme colors are defined at the top of `style.css`.

The original portrait is displayed with CSS framing; adjust `.portrait`'s `object-position` to change its framing. The layout adapts to phones, tablets, and desktops. Navigation remains available on narrow screens, and keyboard focus and reduced-motion preferences are supported.

Publication venue details sit beneath the paper image. Journal entries show an impact factor with its metric year; future conference entries should show the verified CCF rating of the conference. Medical Image Analysis uses the 2025 Journal Impact Factor of 14.0, verified against [Ovid / Wolters Kluwer](https://www.wolterskluwer.com/en/solutions/ovid/medical-image-analysis-12143) and the [Rey Juan Carlos University journal record](https://portalcientifico.urjc.es/en/ipublic/source/13328) on 2026-10-06.

Hovering over the portrait shows “Taken at S.H. Ho College, The Chinese University of Hong Kong.” using the browser's native tooltip.

## CV content

The CV page shares the homepage styling and saved theme preference. Education distinguishes the incoming M.Sc. at Nanjing University (starting in 2027) from the B.Sc. at Sichuan University (2023–Present), with membership in Wu Yuzhang Honors College's Honors Bachelor's Program (Shuren Class), GPA 3.92/4.00, and rank in the top 2%. Honors lists the graduate admission recommendation (September 2026) and National Scholarship from the Ministry of Education (December 2025), in reverse chronological order. These dates and academic details were supplied by the author. Add future awards to `.cv-honors` as `.cv-honor` rows with a date and award name.

Education emblems are local copies of official university assets: [Nanjing University](https://www.nju.edu.cn/images/favicon.png) and [Sichuan University](https://www.scu.edu.cn/xxgk/cdbs.htm). They retain their original colors and proportions, with a white background for legibility in both themes.
