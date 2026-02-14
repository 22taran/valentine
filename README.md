# Valentine Website

A single-page website that asks "Will you be my Valentine?" with a romantic design and playful interactions.

## Features

- **Romantic design**: Soft gradients (rose, coral, blush), elegant typography, floating heart animations
- **Playful "No" button**: Runs away when you hover over it and shows escalating messages when clicked (No → Are you sure? → Maybe? → Please? → Pretty please? → Okay, fine... Yes!)
- **Satisfying "Yes"**: Confetti burst and celebratory message when they say yes

## Run Locally

Open `index.html` in your browser. No build step or server required.

```bash
open index.html
# or
xdg-open index.html   # Linux
start index.html      # Windows
```

## Deploy

- **GitHub Pages**: Push to a repo, enable Pages in Settings, point to the default branch
- **Netlify/Vercel**: Drag and drop the folder for instant hosting

## Files

- `index.html` - Main page structure
- `styles.css` - Styling, animations, responsive rules
- `script.js` - Button logic, confetti, "No" button escape behavior
