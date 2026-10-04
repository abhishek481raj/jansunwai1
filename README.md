# JanSunwai - National Grievance Redressal Portal

**JanSunwai** is a state-of-the-art full-stack platform designed to bridge the gap between citizens and government administration. By digitizing the grievance redressal lifecycle, the portal ensures transparency, accountability, and rapid resolution of public concerns.

---

## 🌟 Key Features

### 👤 User Roles & Dashboards
- **Citizen Portal:** Easy filing, real-time tracking, and historical grievance records.
- **Department Officer Dashboard:** Management tools for viewing, responding to, and resolving assigned tasks.
- **System Administrator Panel:** Global overview with advanced analytics on resolution times and departmental efficiency.

### 🚀 Smart Reporting & Accessibility
- **AI-Powered "Seva" Chatbot:** An intelligent assistant to help citizens navigate categories, file complaints, and receive instant status updates.
- **Voice-to-Text Submission:** Integrated speech recognition for effortless filing without manual typing.
- **Automated Geolocation:** Precision location detection using the Geolocation API to pinpoint exactly where an issue is occurring.
- **Multimedia Evidence:** Support for uploading photos and documents to provide visual proof for faster investigation.

### ⏱️ Tracking & Transparency
- **Unique Tracking IDs:** Every grievance is assigned a unique identifier for secure tracking.
- **Dynamic Visual Timeline:** A real-time status bar showing the grievance journey from 'Pending' to 'Resolved'.

---

## 🛠️ Tech Stack

### Frontend
- **React.js & Vite:** Core UI framework for high-speed performance and modern developer experience.
- **Tailwind CSS:** Professional-grade utility-first styling for a clean, responsive layout.
- **Lucide React:** Modern iconography for an intuitive user experience.
- **React Router:** Advanced client-side routing and role-based protection.

### Backend
- **Node.js & Express:** Scalable, modular server architecture using ES Modules.
- **JWT Authentication:** Secure token-based session management for data privacy.
- **RESTful API:** Clean, documented endpoints for full-stack communication.

---

## 📂 Project Structure

```text
├── server/             # Express.js Backend & API Routes
│   ├── routes/         # Modular route logic (Auth, Admin, Officer)
│   ├── middleware/     # Security and role-based access logic
│   └── data/           # Secure data store & logic
├── src/                # React.js Frontend source code
│   ├── components/     # UI components (Chatbot, Dashboard, Tracking)
│   ├── pages/          # Main view components
│   └── assets/         # Project-specific branding and icons
├── public/             # Global assets (Favicons, Logo)
└── package.json        # Project metadata & dependencies
