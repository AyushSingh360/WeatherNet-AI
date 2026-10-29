<div align="center">

<img src="./public/logo.png" alt="WeatherNet Logo" width="280" />

# WeatherNet - Advanced Weather Network

### Enterprise-Grade Atmospheric Intelligence & Predictive Weather Analytics

[![Next.js](https://img.shields.io/badge/Next.js-15.2.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![WebGL](https://img.shields.io/badge/WebGL2-Shader-9333ea?style=for-the-badge&logo=webgl)](https://www.khronos.org/webgl/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.101-ff4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query)

<br />

<img src="./docs/assets/weather-animated-banner.svg" alt="WeatherNet Live Telemetry Banner" width="100%" />

</div>

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [WebGL2 Shader Engine](#webgl2-shader-engine)
- [Interactive Forecast & Telemetry Charts](#interactive-forecast--telemetry-charts)
- [Component Hierarchy](#component-hierarchy)
- [Data Flow & Lifecycle](#data-flow--lifecycle)
- [API Hardening & Security Pipeline](#api-hardening--security-pipeline)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Available Scripts](#available-scripts)
- [License & Legal](#license--legal)

---

## Overview

**WeatherNet** is an advanced, high-performance meteorological dashboard application engineered with **Next.js 15 (App Router)**, **React 19**, **WebGL2 GLSL Shaders**, and **Tailwind CSS**. It delivers real-time weather analytics, multi-day predictive modeling, air quality monitoring, and interactive visualizations inside a responsive glassmorphic user interface powered by custom liquid-silver WebGL shaders.

---

## System Architecture

```mermaid
graph TB
    subgraph ClientLayer["🖥️ Presentation Layer (Client Browser)"]
        UI["Glassmorphic Dashboard UI<br/>(React 19 + Tailwind CSS)"]
        Shader["Iridescence WebGL2 Engine<br/>(GLSL Shaders + OGL Canvas)"]
        Search["Debounced City Autocomplete<br/>(CitySearch + LocalStorage Recents)"]
        Recharts["Interactive Visualizations<br/>(Recharts Dual-Axis Telemetry)"]
    end

    subgraph StateLayer["⚡ State & Data Synchronization"]
        QueryCache["TanStack Query Cache<br/>(5-min SWR Stale Time)"]
        UnitPref["Unit Preferences Context<br/>(Metric / Imperial / Knots)"]
        ThemeContext["Theme State Manager<br/>(Monochrome Dark / Light)"]
    end

    subgraph ServerLayer["🛡️ Secure Edge / API Gateway (Next.js 15)"]
        RateLimiter["Token-Bucket Rate Limiter<br/>(IP Hash + Burst Control)"]
        ZodValidator["Zod Input Validation<br/>(Coordinate & City Schemas)"]
        ProxyCache["Upstream Proxy & TTL Cache<br/>(Cache-Control s-maxage=600)"]
        
        WeatherRoute["/api/weather<br/>(Current Conditions)"]
        ForecastRoute["/api/forecast<br/>(5-Day / 3-Hour Intervals)"]
        AirQualityRoute["/api/air-quality<br/>(Pollutants & AQI Index)"]
        GeocodeRoute["/api/geocode<br/>(Direct Geocoding Autocomplete)"]
    end

    subgraph ExternalServices["🌐 External Upstream APIs"]
        OWM_Weather["OpenWeatherMap Weather API v2.5"]
        OWM_Forecast["OpenWeatherMap Forecast API v2.5"]
        OWM_Pollution["OpenWeatherMap Air Pollution API"]
        OWM_Geo["OpenWeatherMap Geocoding API v1.0"]
        BrowserGeo["HTML5 Geolocation API"]
    end

    %% Connections
    UI --> QueryCache
    UI --> UnitPref
    UI --> ThemeContext
    Shader -.->|Background Layer| UI
    Search --> QueryCache
    Recharts --> QueryCache

    QueryCache --> RateLimiter
    RateLimiter --> ZodValidator
    ZodValidator --> ProxyCache

    ProxyCache --> WeatherRoute
    ProxyCache --> ForecastRoute
    ProxyCache --> AirQualityRoute
    ProxyCache --> GeocodeRoute

    WeatherRoute --> OWM_Weather
    ForecastRoute --> OWM_Forecast
    AirQualityRoute --> OWM_Pollution
    GeocodeRoute --> OWM_Geo
    Search --> BrowserGeo
```

---

## WebGL2 Shader Engine

WeatherNet features a native **WebGL2 GLSL Fragment Shader** backdrop (`Iridescence`) that generates interactive fluid ripples and specular reflections without degrading UI framerates.

```mermaid
graph LR
    subgraph ShaderPipeline["🎨 WebGL2 GLSL Rendering Pipeline"]
        direction LR
        VIn["Vertex Shader<br/>(Fullscreen Quad)"] --> UV["UV Coord Normalize<br/>(Aspect Correction)"]
        UV --> Noise["Domain Warping<br/>(Simplex Noise Field)"]
        Noise --> Swirl["Swirl Dynamics &<br/>Pointer Interaction"]
        Swirl --> Specular["Specular Sheen &<br/>Cosine Color Mapping"]
        Specular --> ToneMap["Tone Mapping &<br/>Contrast Curve (2.2x)"]
        ToneMap --> Canvas["Framebuffer Output<br/>(alpha: true)"]
    end
```

### Shader Specifications
- **Render Mode**: Non-blocking background worker (`pointer-events-none z-0`)
- **Resolution**: Native viewport scaling with DPI clamping (`Math.min(devicePixelRatio, 2)`)
- **Color Model**: High-contrast liquid silver (`saturation: 0`, `contrast: 2.2`, `brightness: 0.55`)
- **Performance**: 60 FPS capped with `requestAnimationFrame` and `visibilitychange` dormancy

---

## Interactive Forecast & Telemetry Charts

<div align="center">
  <img src="./docs/assets/animated-chart.svg" alt="WeatherNet Interactive Dual-Axis Chart" width="100%" />
</div>

WeatherNet provides high-density meteorological analytics with dual-axis synchronization:

| Metric | Resolution | Visual Display | Measurement Unit |
| :--- | :--- | :--- | :--- |
| **Temperature** | 3-Hour Intervals | Monotone Gradient Area Curve | Celsius (°C) / Fahrenheit (°F) |
| **Precipitation** | 3-Hour Cumulative | Rounded Probability Bars | Percentage (0% – 100%) |
| **Atmospheric Pressure**| Real-Time & 5-Day | Precision Stepped Line | hPa / inHg / mmHg / psi |
| **Humidity Index** | Real-Time & 5-Day | Dual-Data Point Connected Line | Relative Humidity (%) |
| **Wind Vectors** | Directional Deg (0-360°) | Dynamic Compass Rose & Velocity | m/s, km/h, mph, knots |

---

## Component Hierarchy

```mermaid
graph TD
    RootLayout["RootLayout (app/layout.tsx)"]
    
    RootLayout --> Providers["Core Providers"]
    Providers --> ThemeProv["ThemeProvider"]
    Providers --> QueryProv["QueryProvider (TanStack)"]
    Providers --> UnitProv["UnitPreferencesProvider"]
    
    RootLayout --> Page["HomePage (app/page.tsx)"]
    
    Page --> WebGL["IridescenceBackground (WebGL2 Canvas)"]
    Page --> Header["Navigation & Branding Header"]
    Header --> Logo["Logo (/logo.png)"]
    Header --> ThemeToggle["ThemeToggle"]
    
    Page --> Dashboard["WeatherDashboard"]
    
    Dashboard --> SearchPanel["SearchPanel"]
    SearchPanel --> CitySearch["CitySearch (Autocomplete + Recents)"]
    SearchPanel --> UnitToggle["UnitToggle (°C/°F, Wind Units)"]
    
    Dashboard --> MainGrid["Primary Metric Grid"]
    MainGrid --> WeatherCard["Current Weather Card"]
    WeatherCard --> MetricTiles["Metric Tiles (Wind, Humidity, Vis, Press)"]
    MainGrid --> AirQualityCard["AirQualityCard (PM2.5, PM10, O₃, NO₂)"]
    MainGrid --> WeatherAlerts["WeatherAlerts (Dynamic Advisory System)"]
    
    Dashboard --> TabsNavigation["Analytics Tabs Navigation"]
    TabsNavigation --> TabCurrent["Tab: Current"]
    TabCurrent --> WeatherDetails["WeatherDetails (Sunrise, Sunset, Cloudiness)"]
    TabCurrent --> WeatherMap["WeatherMap (Interactive Coordinates & Geo View)"]
    
    TabsNavigation --> TabForecast["Tab: Forecast"]
    TabForecast --> HourlyStrip["HourlyStrip (24-Hour Predictive Strip)"]
    TabForecast --> ForecastGrid["ForecastGrid (5-Day Extended Cards)"]
    
    TabsNavigation --> TabCharts["Tab: Charts"]
    TabCharts --> WeatherChart["WeatherChart (Dual-Axis Recharts Engine)"]
    WeatherChart --> FallbackTable["Accessible Fallback Data Table"]
    
    TabsNavigation --> TabFavorites["Tab: Favorites"]
    TabFavorites --> FavoritesPanel["FavoritesPanel (Local Storage Collections)"]
```

---

## Data Flow & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant Dashboard as WeatherDashboard
    participant Store as TanStack Query Cache
    participant API as Next.js API Gateway
    participant Hardening as Security & Rate Limiter
    participant Upstream as OpenWeatherMap API

    User->>Dashboard: Input city name or click "Locate Me"
    Dashboard->>Store: Invalidate & trigger useWeather(query)
    
    alt Cache Hit (staleTime < 5m)
        Store-->>Dashboard: Return cached payload immediately
    else Cache Miss / Expired
        Store->>API: GET /api/weather?city={query}
        API->>Hardening: Check Rate Limit (100 req/min)
        Hardening-->>API: Rate check passed
        API->>Upstream: Query current weather (HTTPS)
        Upstream-->>API: 200 OK (Raw weather telemetry)
        API-->>Store: JSON Response + Cache-Control: max-age=600
        Store-->>Dashboard: Update React State
    end

    par Parallel Data Fetch
        Dashboard->>Store: useAirQuality(lat, lon)
        Store->>API: GET /api/air-quality?lat={lat}&lon={lon}
        API->>Upstream: Query Pollution Metrics
        Upstream-->>API: Return PM2.5, PM10, NO₂, O₃
        API-->>Store: Normalized Air Quality Object
        Store-->>Dashboard: Stream AQI badge & pollutant breakdown
    and Predictive Modeling Fetch
        Dashboard->>Store: useForecast(city)
        Store->>API: GET /api/forecast?city={city}
        API->>Upstream: Query 5-day / 3-hour forecast
        Upstream-->>API: Return 40 forecast buckets
        API-->>Store: Aggregated forecast stream
        Store-->>Dashboard: Update 24h HourlyStrip & Recharts data
    end

    Dashboard-->>User: Render Glassmorphic UI with Smooth Animations
```

---

## API Hardening & Security Pipeline

All external network operations are mediated through a defensive server-side abstraction layer located in [`lib/api-hardening.ts`](./lib/api-hardening.ts):

```mermaid
stateDiagram-v2
    [*] --> InboundRequest: HTTP GET /api/*
    
    state RateLimitCheck {
        InboundRequest --> ExtractIP: Parse x-forwarded-for / socket
        ExtractIP --> TokenBucket: Decrement Client Token
        TokenBucket --> Allowed: Tokens > 0
        TokenBucket --> Throttled: Tokens == 0
    }

    Throttled --> 429Response: HTTP 429 Too Many Requests (Retry-After)
    
    state ValidationCheck {
        Allowed --> ValidateSchema: Parse query with Zod Schema
        ValidateSchema --> ValidInput: Coordinates in bounds / Valid city string
        ValidateSchema --> InvalidInput: Schema parse failure
    }

    InvalidInput --> 422Response: HTTP 422 Unprocessable Entity
    
    state UpstreamExecution {
        ValidInput --> UpstreamFetch: Fetch Upstream with 10s Timeout
        UpstreamFetch --> CacheHeaders: Attach Cache-Control & Security Headers
        CacheHeaders --> 200Success: HTTP 200 JSON Telemetry
    }

    429Response --> [*]
    422Response --> [*]
    200Success --> [*]
```

---

## Core Features

- **Real-Time Weather Intelligence**: Instant temperature, atmospheric pressure, relative humidity, cloudiness index, and wind velocity vectors.
- **24-Hour & 5-Day Forecasting**: High-resolution hourly forecast strip alongside 5-day predictive cards.
- **Air Quality Telemetry (AQI)**: Continuous monitoring of particulate matter (PM2.5, PM10), tropospheric ozone (O₃), and nitrogen dioxide (NO₂).
- **Interactive Multi-Chart Suite**: Recharts-powered temperature curves, precipitation likelihood bars, and barometric trends.
- **Geolocation & Intelligent Geocoding**: Browser-based position detection with debounced city search autocomplete and persistent recent searches.
- **Unit Preference Engine**: Dynamic metric/imperial/nautical unit switching (°C/°F, m/s, km/h, mph, knots).
- **Favorites Management**: LocalStorage-persisted bookmarks for instant multi-city tracking.
- **Progressive Web App (PWA)**: Offline service-worker registration, Web App Manifest, and cached static telemetry.

---

## Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15.2.8** | React Fullstack App Router, Edge Middleware, Static Site Generation |
| **Runtime** | **React 19.1.0** | Modern concurrent rendering, server components, and optimized hooks |
| **Language** | **TypeScript 5.8** | Full static type safety with strict compiler configuration |
| **Styling** | **Tailwind CSS 3.4** | Utility-first styling with custom frosted glassmorphic primitives |
| **Graphics** | **WebGL2 / OGL** | Native hardware-accelerated GLSL shader fluid background |
| **Data Fetching** | **TanStack Query 5.101** | Intelligent caching, stale-while-revalidate, and query deduplication |
| **Charts** | **Recharts 3.5.1** | Composed dual-axis area, line, and bar visualization primitives |
| **Validation** | **Zod 3.24** | Runtime request input parsing and environment variable guards |
| **Icons** | **Lucide React** | Consistent, accessible icon components |
| **Testing** | **Vitest 4.1 + RTL** | High-speed unit testing and coverage reporting |

---

## Installation & Setup

> **Note:** This repository is proprietary software developed by Ayush Singh.

### Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **Package Manager**: `pnpm` (v9 or v10)
- **API Key**: Free OpenWeatherMap API key ([openweathermap.org](https://openweathermap.org/api))

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AyushSingh360/WeatherNet-AI.git
   cd WeatherNet-AI
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the project root:
   ```env
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Launch Development Server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

```bash
# Start Next.js development server
pnpm dev

# Perform TypeScript type checking
pnpm typecheck

# Run ESLint validation
pnpm lint

# Execute Vitest test suite
pnpm test

# Run tests with test coverage reporting
pnpm test:coverage

# Build optimized production bundle
pnpm build

# Start production server
pnpm start
```

---

## License & Legal

**© 2025 Ayush Singh. All rights reserved.**

This is proprietary software owned exclusively by **Ayush Singh**. No part of this software may be used, copied, modified, distributed, or otherwise utilized without explicit written permission from the copyright holder.

For commercial licensing and permissions:
- **Lead Developer**: Ayush Singh
- **GitHub**: [@AyushSingh360](https://github.com/AyushSingh360)
- **Inquiries**: [ayushsingh21109@gmail.com](mailto:ayushsingh21109@gmail.com)

---

<div align="center">
  <sub>Engineered with precision by <strong>Ayush Singh</strong> • WeatherNet AI</sub>
</div>