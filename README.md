# CoFoundry - Startup Collaboration Platform

CoFoundry is a modern startup collaboration platform that connects founders with talented collaborators. Founders can showcase their startup ideas, post opportunities, and manage applications, while collaborators can discover exciting projects and apply to join innovative startups.

## Live Website

Admin: 
Admin passward: 

● Live Site Link: https://co-foundry-client.vercel.app/

● Github Repository (Server): https://github.com/shariful-ire/CoFoundry-server

● Github Repository (Client): https://github.com/shariful-ire/CoFoundry-client

## Admin Credentials

* Email: [admin@example.com](mailto:admin@example.com)
* Password: ********

## Features

* Secure Email/Password and Google Authentication
* Role-based Dashboard (Founder, Collaborator, and Admin)
* Founders can create and manage startup profiles
* Post collaboration opportunities and receive applications
* Collaborators can browse opportunities and apply to startups
* Application tracking and status management
* Premium upgrade flow with Stripe integration
* Admin dashboard for managing users, startups, and transactions
* Protected routes with role-based authorization
* Responsive UI for desktop, tablet, and mobile devices

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* DaisyUI
* TanStack Query
* Axios
* React Hook Form
* Zod

### Backend & Database

* BetterAuth
* MongoDB
* Mongoose

### Payment & Deployment

* Stripe
* Vercel

## Installation and Setup

### Clone the Repository

```bash
git clone <repository-url>
cd cofoundry
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and add:

```env
MONGODB_URI=
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.



## Future Improvements

* Real-time messaging between founders and collaborators
* Notifications and activity feeds
* Advanced search and filtering
* Team management and invitation system
* Analytics dashboard for startup growth insights



