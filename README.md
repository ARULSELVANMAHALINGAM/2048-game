# 🎮 2048: Grandmaster Premium Edition

Developed by **arulselvanmahalingam**

Welcome to **2048: Grandmaster Premium Edition**, a feature-rich, high-fidelity, polished reimagining of the classic 2048 sliding-tile puzzle game. Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Express**, this version introduces persistent achievements, an in-game coin economy, tactical powerups, and beautiful theme customization.

---

## 🔥 Key Features

### 🖥️ Balanced Three-Column Layout (Optimized for PC & Mobile)
* **Left Column:** A sleek vertical **Game Mode Selector** allowing seamless switches between classic, zen, blitz, or obstacle-based gameplay.
* **Center Column:** The Core Game Area featuring:
  * An interactive **4x4 Tile Sliding Grid** with buttery smooth spring-physics movement animations.
  * A integrated **Score HUD (Score, Best, and Move Counters)** positioned directly above the grid, remaining clearly visible while playing the game.
  * A responsive **Console Control Bar** hosting Undo actions, individual sound/music mute buttons, and quick game Restarts.
* **Right Column:** The **Grandmaster Hub** — a single, beautiful unified window housing:
  * **Tactics Shop:** Purchase in-game powerups to survive tough blockades.
  * **Skins Selection:** View and apply unlocked visual boards and layouts.
  * **Profile Details:** Real-time stats, permanent achievements progress, and daily challenges.

### 🎮 Diverse Game Modes
* **Classic Mode:** The standard, highly-tactical 2048 sliding experience.
* **Zen Play:** Unlimited relaxation. No defeat, free undo options, and play forever.
* **Time Attack (Blitz):** A 120-second blitz timer! Earn the maximum possible score before the progress bar empties.
* **Survival Mode:** Obstacles spawn randomly as indestructible stone boulder cells, challenging you to slide and consolidate around fixed blockades!

### 💥 Tactical Powerups (In-Game Shop)
Spend your earned coins in the Tactics Shop to deploy game-saving utilities:
* 💣 **Bomb Tile (50 Coins):** Completely blow up any unwanted tile from the grid to free up critical space.
* 🔀 **Shuffle Board (40 Coins):** Instantly rearrange all current tiles on the grid to create new slide possibilities.
* 🌈 **Wildcard Tile (75 Coins):** Transform any tile so it can merge with any other adjacent value.
* ❄️ **Freeze Tile (30 Coins):** Lock a tile in place so it remains static during your next slide.
* ⚡ **2X Score (60 Coins):** Double all merge points earned during your next 5 moves.

### 🎨 Custom Skins & Themes
Unlock gorgeous theme customizers to change the aesthetic of your game board:
* 🪨 **Classic Clay:** Elegant retro clay beige layout with warm natural hues.
* 👾 **Neon Glow:** Fluent glowing pinks, violet grids, and cybernetic indicators.
* ⚡ **Cyberpunk 2077:** Synthetic cyan headers, laser yellow highlights, and holographic borders.
* 🌳 **Forest Oak:** Rich earthy wooden textures, organic moss, and forest shades.
* 🕹️ **8-Bit Monochrome:** High-contrast retro arcade terminal with green phosphor grid lines.

### 🏆 Progress, Achievements & Daily Target Challenges
* **Permanent Record Stats:** Track high scores, highest tile achieved, total games played, and play duration.
* **Trophy Achievements:** Complete challenges like *First Fusion*, *Art Collector*, *Coin Tycoon*, or *Survival Master* to earn instant coin rewards.
* **Daily Target Challenges:** Refreshed milestones (e.g., target scores, merge tasks, and efficiency ratios) to earn large gold payouts.

---

## 🛠️ Architecture & Tech Stack

### Client-Side (SPA)
* **React 19 & TypeScript:** Custom game state engine with strict static typing.
* **Motion:** Fluid spring-based sliding movements, scale animations, and layout transitions.
* **Tailwind CSS:** Responsive grid architecture adapting flawlessly from tiny mobile screens to wide monitors.
* **Lucide React:** Modern, lightweight vector icons matching the active theme's colors.

### Server-Side (API Engine)
* **Express & Node.js:** Custom lightweight full-stack server.
* **esbuild:** Super-fast backend compilation bundling code into a robust, self-contained `dist/server.cjs` bundle.

---

## 🚀 Getting Started

### 1. Install Dependencies
Make sure you have Node.js (v18 or higher) installed, then run:
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```

### 4. Start Local Production Server
```bash
npm run start
```

---

## 🎮 Game Controls
* **Desktop Sliders:** Use Arrow keys (`▲`, `▼`, `◀`, `▶`) or `W`, `A`, `S`, `D` on your keyboard.
* **Mobile Swipes:** Swipe anywhere on the 2048 grid to slide tiles in that direction.
* **Targeting Powerups:** Buy a powerup (e.g., Bomb) inside the Grandmaster Hub, then click directly on a grid tile to activate it.

---

## 🌐 How to Host & Deploy This Game

This full-stack application is designed for rapid and painless deployment. Here is how you can host it across different services:

### Option A: Hosting with Docker & Cloud Run (Recommended)
Because the app comes pre-configured with a custom full-stack Express server, it runs perfectly inside a Docker container.

1. **Create a `Dockerfile` in the root directory:**
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY --from=builder /app/dist ./dist
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Deploy to Google Cloud Run:**
   Ensure you have the Google Cloud CLI installed, then run:
   ```bash
   gcloud run deploy 2048-grandmaster --source . --port 3000 --allow-unauthenticated
   ```

---

### Option B: Hosting on Render / Koyeb / Fly.io (PaaS)
You can connect your GitHub repository directly to PaaS providers for automated builds and deployment:

1. Create a new **Web Service** on Render / Koyeb / Fly.io.
2. Link your repository.
3. Configure the build and start commands:
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start`
4. Set the environment `PORT` to `3000` (or leave as default, the server binds to `0.0.0.0:3000`).

---

### Option C: Client-Only Static Hosting (Vercel / Netlify / GitHub Pages)
If you wish to host the game as a client-side single-page application (SPA) without the backend Express server:

1. Run `npm run build` locally or inside your build setting.
2. Direct your hosting provider (Vercel/Netlify) to publish the static `dist/` directory.
3. Set your **Build Command** to `npm run build` (or `vite build`).
4. Set your **Publish Directory** to `dist`.
