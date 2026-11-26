# Eventra

**A Centralized Campus Event Aggregation, Management, and Registration Platform**

Eventra is a full-stack MERN web application that brings campus event discovery, registration, online payment and QR-based entry check-in into one place.

> Societal Project (1BSOP308), III Semester, Dept. of CSE, BMS Institute of Technology & Management, 2026-27

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Objectives](#objectives)
3. [Features](#features)
4. [User Roles](#user-roles)
5. [Tech Stack](#tech-stack)
6. [System Architecture](#system-architecture)
7. [Project Structure](#project-structure)
8. [Getting Started](#getting-started)
9. [Environment Variables](#environment-variables)
10. [Usage Workflow](#usage-workflow)
11. [Screenshots](#screenshots)
12. [SDG Alignment](#sdg-alignment)
13. [Future Scope](#future-scope)
14. [Team](#team)
15. [References](#references)
16. [License](#license)

---

## Problem Statement

Campus events are announced through scattered channels (social media, messaging groups, e-mail), registered for through manual forms, and checked at the venue using paper lists. This leads to low awareness, manual payment verification, slow entry, no college-identity check and no analytics for organizers.

## Objectives

- Provide one centralized platform to publish and discover all campus events.
- Support Student, Organizer and Admin roles, with admin approval before events go live.
- Allow student login only with a valid college e-mail ID.
- Enable search and category filters (Cultural, Tech, Sports, Hackathons, Workshops).
- Allow online registration with secure Razorpay payments for paid events.
- Issue a unique QR pass per registration and scan it for fast check-in.
- Give admins analytics on registrations, attendance and users.

## Features

- **College-email login:** only verified college students can register.
- **Role-based access:** separate permissions for Student, Organizer and Admin (JWT).
- **Event approval flow:** new events are "pending" until an admin approves them.
- **Search and filters:** find events by name or category.
- **Online registration and payments:** Razorpay checkout for paid events.
- **My Registrations:** students see all their registrations in one page.
- **QR entry pass:** a unique QR code for every registration.
- **QR check-in:** the admin scans passes at the venue to mark attendance.
- **Admin dashboard:** analytics on events, registrations, attendance and users.
- **Responsive UI:** works on mobile and desktop.

## User Roles

| Role | What they can do |
|------|------------------|
| **Student** | Log in with college e-mail, search and filter events, register and pay, view My Registrations, download QR pass |
| **Organizer** | Create events (description, category, date, venue, fee), submit for approval, track registrations for their events |
| **Admin** | Approve or reject events, scan QR passes at the venue, view registrations and users, see analytics |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Security | JWT, bcrypt |
| Payments | Razorpay |
| QR | QR code generation and scanning |
| Tools | VS Code, Git/GitHub, Postman |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## System Architecture

```
React Client  <--->  Express REST API  <--->  MongoDB (Atlas)
                          |
                 +--------+--------+
                 |                 |
             Razorpay         QR module
          (payment gateway)  (generate / scan)
```

The React client talks to the Express API over HTTPS. The API handles authentication, role checks, payments and QR passes, and stores data in MongoDB.

## Project Structure

```
eventra/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── App.js
├── server/                 # Node + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── .gitignore
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or later) and npm
- Git
- A MongoDB Atlas account (or local MongoDB)
- A Razorpay account (test mode keys are enough)

### 1. Clone the repository

```bash
git clone https://github.com/[your-username]/eventra.git
cd eventra
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/` (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
npm start
```

The app runs at `http://localhost:3000`.

## Environment Variables

Create `server/.env` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ALLOWED_EMAIL_DOMAIN=[your-college-domain]
```

Never commit your `.env` file. It is listed in `.gitignore`.

## Usage Workflow

1. The Organizer submits a new event.
2. The Admin approves it, and it becomes visible to students.
3. The Student logs in with their college e-mail and finds the event.
4. The Student registers and pays through Razorpay.
5. A unique QR pass is generated and saved in My Registrations.
6. The Admin scans the QR pass at the venue to mark attendance.

## Screenshots

> Add screenshots here once the pages are ready. Create a `docs/screenshots/` folder and link the images.

| Home | Event Details |
|------|---------------|
| ![Home](docs/screenshots/home.png) | ![Event](docs/screenshots/event.png) |

| My Registrations (QR Pass) | Admin Dashboard |
|----------------------------|-----------------|
| ![QR](docs/screenshots/qr.png) | ![Admin](docs/screenshots/admin.png) |

## SDG Alignment

- **SDG 4 (Quality Education):** easier access to workshops, talks and learning events.
- **SDG 9 (Industry, Innovation and Infrastructure):** digital infrastructure for campus activities.
- **SDG 12 (Responsible Consumption and Production):** paperless registration and entry.

## Future Scope

- Mobile app (Android and iOS)
- E-mail and push notifications for reminders
- Auto-generated participation certificates
- Multi-college support on one platform

## Team

| Name | USN | Role |
|------|-----|------|
| [Student Name 1] | [USN] | [e.g., Backend] |
| [Student Name 2] | [USN] | [e.g., Frontend] |

**Guide:** [Guide Name], [Designation], Dept. of CSE, BMSIT&M

## References

1. M. Jones, J. Bradley and N. Sakimura, "JSON Web Token (JWT)," RFC 7519, Internet Engineering Task Force, May 2015.
2. N. Provos and D. Mazieres, "A Future-Adaptable Password Scheme," in Proc. USENIX Annual Technical Conf., 1999.
3. ISO/IEC 18004:2015, QR Code bar code symbology specification.
4. MongoDB Inc., "MongoDB Manual," https://www.mongodb.com/docs/manual/
5. Razorpay, "Razorpay Payments API Documentation," https://razorpay.com/docs/
6. Meta Platforms, Inc., "React Documentation," https://react.dev/

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
