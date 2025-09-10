# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for "포테니티" (Potanity), a game development club at Kangwon National University in South Korea. The website showcases the club's activities, games, and provides information for potential members.

## Architecture

### Frontend Structure
- **Static HTML website** with no build process - files are served directly
- **Bilingual support**: Korean (index.html) and English (index-en.html)
- **Embedded Unity WebGL game** located in `/game/` directory
- **Responsive design** with mobile-first approach

### Key Components

#### Core Files
- `index.html` - Main Korean homepage
- `index-en.html` - English version
- `README.md` - Korean documentation about the club

#### JavaScript Modules
- `js/dynamic-image-loader.js` - Dynamically loads minigame screenshots (up to 10 per game)
- `js/image-slider.js` - Image carousel functionality with touch/swipe support
- `js/activity-photos-loader.js` - Loads activity photos with title/description metadata

#### CSS Architecture
- `css/main.css` - CSS variables, base styles, layout system
- `css/components.css` - Reusable UI components
- `css/responsive.css` - Mobile responsive styles
- **Color scheme**: Primary color #295AA0 with gradient variations
- **CSS Custom Properties** for consistent theming

#### Assets Structure
```
images/
├── activities/          # Club activity photos (clubroom-1.jpg to clubroom-5.jpg, project-1.jpg, project-2.jpg)
├── minigames/          # Game screenshots (minigame1-1.png to minigame8-2.png pattern)
└── game-play-button.png # Game launch button
```

#### Unity WebGL Integration
- Self-contained Unity WebGL build in `/game/` directory
- Includes Unity loader, framework, and WASM files
- Service worker for offline functionality
- Responsive Unity template

## Development Workflow

### No Build Process
- This is a static website with no package.json or build tools
- Changes can be made directly to HTML, CSS, and JS files
- Test by opening `index.html` in a browser or serving via local server

### Image Management
- **Minigame images**: Follow naming pattern `minigame{N}-{I}.png` where N=game number, I=image index
- **Activity photos**: Place in `images/activities/` and update `activityPhotosData` array in `activity-photos-loader.js`
- Images are loaded dynamically with error handling for missing files

### JavaScript Patterns
- **Event-driven architecture**: Uses custom events like 'imagesLoaded' for coordination
- **Dynamic loading**: Images loaded asynchronously with fallbacks
- **Touch-friendly**: Swipe gestures supported on image sliders
- **Error handling**: Graceful degradation when images fail to load

### Deployment
- Static hosting via GitHub Pages at: https://knu-potanity.github.io/website/
- No build step required - commit changes directly

## Content Guidelines

### Language Files
- Maintain parallel structure between `index.html` (Korean) and `index-en.html` (English)
- Update both files when adding new sections or content

### Game Development Status
- Games marked as "(개발중)" (in development) use `<span class="text-danger">(개발중)</span>`
- Completed games have no status indicator

### Contact Information
- KakaoTalk open chat: https://open.kakao.com/o/sds7asbg
- GitHub organization: https://github.com/KNU-Potanity
- Club room location: 한울관 (Hanul Building), Kangwon National University

## Important Instructions for Claude

- **BE CONCISE**: Avoid unnecessary explanations or verbose responses. Just execute the requested tasks.
- **NO COMMENTARY**: Don't explain what you did unless specifically asked.
- **JUST DO IT**: When given a task, complete it without preamble or postscript.

## Common Tasks

### Adding New Minigame
1. Add images to `images/minigames/` following pattern `minigameN-{1,2,3...}.png`
2. Add new minigame section to both `index.html` and `index-en.html`
3. Images will be automatically loaded by `dynamic-image-loader.js`

### Adding Activity Photos
1. Place photos in `images/activities/`
2. Update `activityPhotosData` array in `activity-photos-loader.js`
3. Add photo boxes to HTML activity-photos section

### Updating Club Information
- Modify content in both language versions
- Update contact links and club information as needed
- Maintain consistent styling using existing CSS classes