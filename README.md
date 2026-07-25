# 🚀 Resilient Portfolio & CMS Ecosystem

A modern, high-performance, and secure full-stack portfolio ecosystem featuring a public-facing website, a self-hosted CMS REST API backend, and an administrative dashboard with **Two-Factor Authentication (2FA)**. 

Designed for maximum resilience, visual fidelity, and secure administration, this repository represents a complete production-grade application optimized for personal branding and enterprise-grade portfolio demonstration.

---

## 📂 Repository Architecture

The project is structured as a multi-package repository separating concerns across the frontend, administrative panel, and server API:

```yaml
.
├── backend/                  # Express + TypeScript REST API Server
│   ├── src/
│   │   ├── config/           # Database connections & DB Seeders (Yatin's Info)
│   │   ├── controllers/      # Route request/response handlers
│   │   ├── middleware/       # Auth guards, 2FA checker, XSS, rate-limiters
│   │   ├── models/           # Mongoose schemas (Hero, Skills, Projects, Logs...)
│   │   ├── routes/           # REST endpoint definitions (Auth & CMS)
│   │   └── utils/            # Helper classes (TOTP, token signers, SMTP nodemailer)
│   └── package.json
│
├── frontend/                 # Next.js 16 + Tailwind CSS v4 Client Portfolio
│   ├── app/                  # App router pages & global layout
│   ├── components/sections/  # Custom interactive sections (Hero, Skills, Projects...)
│   ├── data/                 # Offline mock/fallback static data matching database
│   ├── lib/                  # Resilient API client (dynamic fetch with 4s timeout)
│   └── package.json
│
└── admin/                    # Next.js 16 Admin Panel (CMS Interface)
    ├── src/
    │   ├── app/              # Secure routes (Dashboard, Logs, SEO, Media, settings)
    │   ├── components/       # Interface components & form builders
    │   └── store/            # Zustand global authentication and configuration state
    └── package.json
```

---

## ⚡ Core Features & Implementation ("What" & "How")

### 1. Hybrid Resilient Client (`frontend`)
* **What**: The portfolio remains 100% operational even if the backend database server is offline, down, or experiencing cold starts (common on free hosting tiers like Render/fly.io).
* **How**: The frontend custom API client [api.ts](file:///c:/Users/Yatin/Desktop/Project/Resume/frontend/lib/api.ts) wraps all database queries in a short-lived `AbortSignal.timeout(4000)`. If the request fails or times out within 4 seconds, the system seamlessly falls back to local static TypeScript data modules.

### 2. High-Fidelity UI & Custom SVG Visualizers (`frontend`)
* **What**: Premium editorial grid design featuring rich animations and dynamic data visualizations rather than standard chart libraries.
* **How**: Custom SVG canvas boards built using **Framer Motion**:
  * **Frontend Category**: A morphing radar/sonar sine wave that speeds up on hover.
  * **Backend Category**: An interactive dot-matrix grid with an auto-drawing line chart and pulsing peak load indicator.
  * **State Category**: An active network mesh representing node connections with glowing packet animations on hover.
  * **DevOps Category**: A mechanical speedometer dial that sweeps to peak value on hover.

### 3. Production-Grade CMS Server (`backend`)
* **What**: A fully typed REST API with Mongoose schemas and strict request validation via Zod.
* **How**: Houses structured collections for all portfolio sections including **Hero**, **About**, **Technical Skills & Categories**, **Projects**, **Experience**, **Education**, **Certificates**, **Showcase items (ISRO Space Program, Google AI, Hackathon metrics)**, **SEO Metadata**, and **Audit Logs**.

### 4. Admin Portal (`admin`)
* **What**: A responsive dashboard giving the administrator full CRUD capabilities to modify site data, check visitors' logs, manage assets, and edit SEO configurations without redeploying code.
* **How**: Utilizes **Zustand** for auth state and **React Hook Form** + **Zod** for robust schema validation before executing mutative API calls.

### 5. Advanced Security Engine (`backend` & `admin`)
* **What**: Hardened administrative panel protecting portfolio operations from malicious actions and unauthorized modifications.
* **How**:
  * **MFA/TOTP**: Multi-Factor Authentication setup using `otplib` and `qrcode` to generate authenticator secrets and register mobile authentication apps (Google Authenticator, Authy).
  * **Double JWT Cookie Architecture**: Separate Access Token (short-lived) and Refresh Token (long-lived) signed using `jsonwebtoken` and stored in `HttpOnly`, `Secure`, and `SameSite=Strict` cookies.
  * **Audit Trail Logs**: Captures admin login attempts (success/failure), 2FA state changes, data mutations, and uploads, recording IP addresses and client user agents.
  * **Defensive Middleware**: Integrates `helmet` headers, strict body limits (10MB maximum for media uploads), custom MongoDB injection filters, and cross-site scripting (XSS) sanitizers.

### 6. Resilient Email Engine & Visitor Analytics (`backend`)
* **What**: Sends high-fidelity notifications for form entries and logs real-time visitor sessions directly to your inbox.
* **How**:
  * **API-based Email (Resend API)**: Bypasses cloud host port firewalls (like Render's default SMTP blocks) by defaulting to the **Resend HTTP API (Port 443)** when `RESEND_API_KEY` is provided. Falls back to Nodemailer SMTP when not.
  * **Visitor Insights**: An active tracker catches IP addresses, location metrics (city, region, country, coordinates, ISP via Geo-IP service), language settings, screen resolutions, and referrer URLs.
  * **Premium Theme Templates**: Renders responses using a beautiful dark-mode HTML email design system carrying signature crimson accents matching your portfolio theme.
  * **DB Fallback**: If email delivery fails entirely, the message is stored inside the database audit logs (`ActivityLog`) under the prefix `[SAVED MSG]` to ensure no contact submissions are ever lost.

---

## 🛠️ Architectural Decisions ("Why")


| Rationale Point | Decision | Why is it there? |
| :--- | :--- | :--- |
| **Separation of Concerns** | Monorepo Structure | Splitting **Frontend**, **Backend**, and **Admin** ensures separate, low-overhead build systems, distinct package boundaries, and the freedom to host independently (e.g. static Vercel edges for frontends and containerized Render services for the API). |
| **User Experience First** | Hybrid Resilient Fallback | Portfolio visitors (recruiters, clients) expect instantaneous page loads. Waiting on a cold-starting backend container degrades the experience. The dynamic-to-static fallback ensures immediate loading under any server condition. |
| **Modern Styling** | Tailwind CSS v4 | Provides ultra-fast compilation, native CSS variables configuration, and modular utility styling perfectly suited for modern component design. |
| **Hardened Protection** | TOTP 2FA | A portfolio database must not be vandalized or modified. Requiring dynamic authenticator pin entry for all mutative sessions guarantees only the portfolio owner can edit content. |

---

## ⚖️ Pros & Cons

### Pros
* **Ultimate Reliability**: Double-layered data fetching (DB API + Offline file-based assets) guarantees uptime.
* **Aesthetic Superiority**: Curated color palette (pure dark, vibrant crimson `#E63925`), micro-animations, and custom visual SVG charts feel premium and responsive.
* **Highly Secure**: Implements professional enterprise standards (2FA, HttpOnly cookies, secure CORS, rate-limits, injection filters).
* **Zero-Redeploy Maintenance**: Content can be edited instantly from a phone or computer via the Admin Panel.

### Cons
* **API Startup Latency**: On free hosting tiers, first-load queries might experience cold starts (mitigated by the 4-second timeout fallback).
* **Memory Rate-Limiter**: Express rate limiting uses in-memory tables. In a distributed multi-node production setup, this would require backing with Redis.
* **Asset Upload Boundaries**: File uploading is tied to Cloudinary; changing hosting providers requires modifying the Media schema and helper helper scripts.

---

## 🏁 Getting Started

### 1. Prerequisites
* **Node.js** (v18+)
* **MongoDB** (Local instance or Atlas URI)
* **Cloudinary Account** (For image/resume uploads)
* **SMTP Credentials** (For contact emails - e.g. Ethereal, Gmail, or SendGrid)

### 2. Environment Variables Configuration
Configure configuration variables in respective directories:

* **`backend/.env`**:
  ```ini
  PORT=5000
  MONGODB_URI=mongodb://127.0.0.1:27017/portfolio-cms
  JWT_ACCESS_SECRET=your_32_character_access_secret_key
  JWT_REFRESH_SECRET=your_32_character_refresh_secret_key
  JWT_2FA_PENDING_SECRET=your_32_character_2fa_secret_key
  CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_API_SECRET=your_cloudinary_api_secret
  ADMIN_FRONTEND_ORIGIN=http://localhost:3001
  NODE_ENV=development
  
  SMTP_HOST=smtp.yourprovider.com
  SMTP_PORT=587
  SMTP_USER=your_email_user
  SMTP_PASS=your_email_password
  CONTACT_RECEIVER_EMAIL=your_inbox@gmail.com
  RESEND_API_KEY=your_resend_api_key_here
  ```


* **`frontend/.env.local`**:
  ```ini
  NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
  ```

* **`admin/.env.local`**:
  ```ini
  NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
  PORT=3001
  ```

### 3. Installation & Database Seeding
To install packages and seed the database with initial developer records:

```bash
# Install dependencies for all apps
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install

# Start the Backend Server (Seeds database automatically on initial launch)
cd ../backend
npm run dev
```

### 4. Running the Dev Servers
Launch the frontend website and administrative panel:

```bash
# Run Frontend (default: http://localhost:3000)
cd frontend
npm run dev

# Run Admin (default: http://localhost:3001)
cd admin
npm run dev
```

The database automatic seeding process populates collections with **Yatin Kashyap's** details (Python Developer Intern at Surekha Technologies, UI/UX Lead at GoodGame Theory, achievements like ISRO space credentials, Google AI workshop validation, and four featured projects). Use the Admin Panel to set up 2FA and manage the data.
