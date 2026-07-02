# 🌤️ WeatherNet - Advanced Weather Network

**WeatherNet** is a sophisticated, feature-rich weather network application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Experience weather data like never before with beautiful animations, comprehensive analytics, and intelligent features in a sleek black and white design.

![WeatherNet Dashboard](./output-dashboard.jpg)

---

## ⚖️ License & Copyright

**© 2025 Ayush Singh. All rights reserved.**

This is proprietary software owned exclusively by Ayush Singh. No part of this software may be used, copied, modified, distributed, or otherwise utilized without explicit written permission from the copyright holder.

**🚫 UNAUTHORIZED USE IS STRICTLY PROHIBITED**

For licensing inquiries, contact: ayushsingh21109@gmail.com

---

## ✨ Features

### 🌍 Core Weather Features
- **Real-time Weather Data** - Current conditions with live updates
- **5-Day Detailed Forecast** - Hour-by-hour predictions
- **Interactive Weather Charts** - Temperature, humidity, and pressure trends
- **Weather Alerts** - Intelligent warnings for extreme conditions

### 🎯 Smart Features
- **📍 Auto Location Detection** - GPS-based weather for your current location
- **⭐ Favorites System** - Save and quickly access your favorite cities
- **🌬️ Air Quality Index** - Real-time pollution data with health recommendations
- **🗺️ Interactive Maps** - Visual location context with map integration

### 🎨 Beautiful UI/UX
- **🖤 Monochrome Design** - Elegant black and white aesthetic
- **🌙 Dark/Light Mode** - Seamless theme switching
- **📱 Fully Responsive** - Perfect on mobile, tablet, and desktop
- **🎭 Glassmorphism Design** - Modern frosted glass effects
- **⚡ Lightning Fast** - Optimized performance with smooth animations

### 📊 Advanced Analytics
- **📈 Temperature Trends** - Visual charts showing weather patterns
- **💨 Wind & Pressure Data** - Comprehensive atmospheric information
- **☔ Precipitation Probability** - Rain forecasts with percentage chances
- **🌅 Sunrise/Sunset Times** - Complete daily light cycle information

---

## � Output & Screenshots

### Dashboard Overview
Experience the sleek, modern interface with real-time weather data visualization.

![WeatherNet Charts View](./output-charts.jpg)

### Detailed Weather Information
Comprehensive weather metrics displayed with beautiful glassmorphism design.

![WeatherNet Dashboard View](./output-dashboard.jpg)

### 🎬 Animated UI Features

WeatherNet features a stunning **Silk WebGL Background** - a mesmerizing animated shader effect that creates a flowing, silk-like visual experience:

| Feature | Description |
|---------|-------------|
| **Silk Shader Effect** | Real-time WebGL animation using Three.js and React Three Fiber |
| **Smooth Wave Patterns** | Procedural noise-based flowing patterns |
| **Customizable Colors** | Adjustable color schemes via hex values |
| **Performance Optimized** | GPU-accelerated rendering with adaptive DPR |
| **Interactive Parameters** | Speed, scale, rotation, and noise intensity controls |

#### Background Animation Props
```typescript
interface SilkProps {
  speed?: number;        // Animation speed (default: 5)
  scale?: number;        // Pattern scale (default: 1)
  color?: string;        // Hex color (default: '#7B7481')
  noiseIntensity?: number; // Grain overlay (default: 1.5)
  rotation?: number;     // Pattern rotation (default: 0)
}
```

### 🎨 UI Highlights

- **Glassmorphism Cards** - Frosted glass effect with backdrop blur
- **Smooth Transitions** - CSS and WebGL powered animations
- **Real-time Updates** - Live weather data with animated transitions
- **Responsive Design** - Seamless experience across all devices
- **Dark/Light Mode** - Theme-aware animated backgrounds


## �🚀 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Shadcn/ui](https://ui.shadcn.dev/)** - Beautiful component library
- **[Recharts](https://recharts.org/)** - Interactive data visualization

### APIs & Services
- **[OpenWeatherMap API](https://openweathermap.org/api)** - Weather and air quality data
- **Geolocation API** - Browser-based location detection
- **Google Maps Integration** - Location visualization

### Development Tools
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript Strict Mode** - Enhanced type safety
- **Responsive Design** - Mobile-first approach

---

## 🛠️ Installation & Setup

**⚠️ IMPORTANT: This software is proprietary and requires permission from Ayush Singh before use.**

### Prerequisites
- Node.js 18+ installed
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))
- **Written permission from Ayush Singh**

### Quick Start (Authorized Users Only)

1. **Obtain Permission:**
   Contact ayushsingh21109@gmail.com for licensing

2. **Clone the repository:**
   ```bash
   git clone https://github.com/AyushSingh360/weathernet.git
   cd weathernet
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

4. **Configure Environment Variables:**
   
   Create `.env.local` in the project root:
   ```env
   OPENWEATHERMAP_API_KEY=your_api_key_here
   ```
   
   > 🔑 **Get your free API key:** Visit [OpenWeatherMap](https://openweathermap.org/api) and sign up for a free account.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to see WeatherNet in action! ✨

---

## 🎯 Usage Guide

### 🔍 Search for Cities
- Type any city name in the search bar
- Get instant weather updates with smooth animations

### 📍 Use Your Location
- Click the location button to auto-detect your position
- Grant location permissions for the best experience

### ⭐ Manage Favorites
- Click the bookmark icon to save cities
- Access your favorites from the dedicated tab
- Remove cities with a single click

### 📊 Explore Data
- Switch between Current, Forecast, Charts, and Favorites tabs
- Hover over elements for interactive details
- View comprehensive weather metrics

---

## 🏗️ Project Structure

```
weathernet/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── weather/       # Current weather endpoint
│   │   ├── forecast/      # Forecast endpoint
│   │   └── air-quality/   # Air quality endpoint
│   ├── globals.css        # Global styles & animations
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── logo.tsx          # WeatherNet logo component
│   ├── weather-dashboard.tsx  # Main dashboard
│   ├── weather-chart.tsx     # Chart components
│   ├── air-quality-card.tsx  # Air quality display
│   └── ...               # Other feature components
├── hooks/                # Custom React hooks
│   ├── use-weather.tsx   # Weather data management
│   ├── use-geolocation.tsx   # Location detection
│   └── use-favorites.tsx     # Favorites management
├── lib/                  # Utility functions
├── types/                # TypeScript definitions
└── public/               # Static assets
```

---

## 🎨 Design Philosophy

### Visual Design
- **Monochrome Aesthetic** - Sophisticated black and white color scheme
- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Micro-interactions** - Subtle animations that enhance user experience
- **Typography Hierarchy** - Clear information architecture

### User Experience
- **Progressive Disclosure** - Information revealed contextually
- **Accessibility First** - WCAG compliant design
- **Performance Optimized** - Fast loading with smooth animations
- **Mobile Responsive** - Touch-friendly interface

---

## 🌟 Key Features Explained

### 🎭 Advanced Animations
```css
/* Custom keyframe animations */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Staggered animation delays */
.animate-slide-up.delay-100 { animation-delay: 100ms; }
```

### 🌬️ Air Quality Integration
- Real-time AQI (Air Quality Index) data
- PM2.5, PM10, O₃, NO₂ measurements
- Health recommendations based on pollution levels
- Monochrome color-coded quality indicators

### 📊 Interactive Charts
- Temperature trend visualization
- Humidity and pressure correlations
- Responsive chart design with white/gray color scheme
- Smooth data transitions

### ⚡ Performance Optimizations
- Lazy loading of components
- Optimized API calls with caching
- Efficient state management
- Minimal bundle size

---

## 🔧 Customization

**⚠️ Note: Customization requires permission from Ayush Singh**

### Themes
Modify `app/globals.css` to customize the monochrome theme:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #000000 0%, #404040 100%);
  --animation-duration: 0.6s;
}
```

### Logo Customization
The WeatherNet logo combines a cloud icon with a lightning bolt and can be customized in `components/logo.tsx`:
- Adjust icon sizes for different breakpoints
- Modify the color scheme
- Change the typography

---

## 🚀 Deployment

**⚠️ Deployment requires explicit permission from Ayush Singh**

### Authorized Deployment Options
1. Contact ayush.singh.dev@example.com for deployment authorization
2. Obtain written permission for production use
3. Follow standard deployment procedures only after authorization

---

## 🚫 Contributing

**This is proprietary software. Contributions are not accepted without explicit permission from Ayush Singh.**

To request permission to contribute:
1. Contact ayush.singh.dev@example.com
2. Provide detailed information about proposed contributions
3. Wait for written authorization before proceeding

---

## 📝 License

**PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED**

Copyright (c) 2025 Ayush Singh. All rights reserved.

This software is protected by copyright law. Unauthorized use, reproduction, or distribution is strictly prohibited and may result in severe civil and criminal penalties.

See the [LICENSE](LICENSE) file for complete terms and conditions.

---

## 🙏 Acknowledgments

- **OpenWeatherMap** for comprehensive weather data
- **Shadcn/ui** for beautiful component primitives
- **Recharts** for powerful data visualization
- **Pexels** for stunning stock photography
- **Lucide** for crisp, consistent icons

---

## 📞 Contact & Support

**For all inquiries regarding this proprietary software:**

**Ayush Singh**
- 📧 **Email**: ayushsingh21109@gmail.com
- 🔐 **Licensing**: ayushsingh21109@gmail.com
- 🐛 **Authorized Bug Reports**: Contact via email only
- 💡 **Feature Requests**: Authorized users only

---

## ⚠️ Legal Notice

This software is the exclusive intellectual property of Ayush Singh. Any unauthorized use, copying, modification, distribution, or reverse engineering is strictly prohibited and will be prosecuted to the full extent of the law.

**© 2025 Ayush Singh. All rights reserved.**

---

<div align="center">

**WeatherNet - Proprietary Weather Network Software**

*Developed exclusively by Ayush Singh* 🌤️

**All rights reserved. Unauthorized use prohibited.**

</div>
