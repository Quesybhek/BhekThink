# BhekThink Sovereign v1016.0

**BhekThink** is a sovereign AI assistant that runs as a **Progressive Web App (PWA)** with full multimodal capabilities. It integrates with **Puter** for AI chat, image generation, and cloud storage, and behaves like a native application on desktop and mobile.

![BhekThink Screenshot](screenshot.png) <!-- optional -->

## ✨ Features

- **AI Chat & Image Generation** – Powered by Puter’s AI (GPT‑4o, Claude, etc.). Supports text, vision, and web search.
- **Multimodal File Handling** – Upload text files, images, and PDFs. Drag‑and‑drop, clipboard paste, and OS file picker.
- **Persistent Conversation** – Chat history is saved to Puter KV and restored automatically after sign‑in.
- **Voice I/O** – Speech recognition (mic) and synthesis with adjustable speed.
- **Neural Context Map** – For long PDFs, generates clickable clusters to quickly reference sections.
- **Message Forking & Regeneration** – Edit past messages to branch the conversation, or regenerate AI responses.
- **PWA Ready** – Installable on any device with a manifest, service worker, and offline caching.
- **OS Integration** – File handlers (open with), share target (mobile share sheets), window controls overlay (desktop), and protocol handlers.
- **Language Mesh** – Switch between English, Twi, French, Spanish, Arabic, Chinese.
- **Settings Persistence** – Temperature, voice speed, model, language, and toggles are saved to Puter KV.
- **Export Chat** – Download full conversation as JSON.
- **Live Visuals** – Matrix rain background and audio visualizer.

## 📦 Prerequisites

- A **Puter** account (free at [puter.com](https://puter.com)) – used for AI, KV storage, and authentication.
- A modern browser (Chrome, Edge, Safari, Firefox) with service worker support.
- For full PWA features on iOS/iPadOS, iOS 14.5+.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/BhekThink.git
cd BhekThink
