<div align="center">

# 🚀 CoFoundry — Client

### Find your co-founder. Build your dream team.

CoFoundry is a full-stack platform where startup founders post team openings and collaborators — developers, designers, marketers — apply to join early-stage teams. This is the client application: a Next.js + Tailwind + Framer Motion frontend for the CoFoundry platform.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-co--foundry--client.vercel.app-6d28d9?style=for-the-badge&logo=vercel&logoColor=white)](https://co-foundry-client.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)

**[🌐 Live Site](https://co-foundry-client.vercel.app)** · **[⚙️ Server Repo](https://github.com/shariful-ire)**

</div>

---

## ✨ Features

### Public
- Animated home page — hero banner, featured startups, featured opportunities, and more, built with Framer Motion
- Browse Startups with search and Industry / Funding Stage filters
- Browse Opportunities with server-side search (`$regex` on role title & skills), Work Type / Industry filters (`$in`, multi-select), and server-side pagination
- Fully responsive, custom-designed 404 page

### Authentication
- Email/password registration with role selection (Founder or Collaborator), password strength meter, and profile photo upload (via ImgBB)
- "Continue with Google" — role is chosen once at sign-up; existing accounts sign in straight to their saved role, brand-new Google accounts are guided to pick a role before anything is created
- Session persists across refresh and new tabs; protected routes redirect back to where you were headed after logging in

### Founder Dashboard
- Overview stats — total opportunities, applications, accepted members
- Create/manage a startup profile (with logo upload) — pending admin approval
- Post and manage opportunities (role title, required skills, work type, commitment, deadline)
- Review applications and accept/reject candidates
- Free tier capped at 3 open opportunities — Stripe Checkout unlocks unlimited postings

### Collaborator Dashboard
- Apply to opportunities with a portfolio link and motivation message
- Track all applications and their status in one place
- Editable profile — name, photo, skills, bio, contact number

### Admin Dashboard
- Platform overview — users, startups, opportunities, revenue
- Manage users (block/unblock), approve or remove startup listings
- View all transactions and payment status
- Editable admin profile (photo, name, contact number)

---

## 🛠️ Tech Stack

| Layer            | Technology                                             |
|-------------------|--------------------------------------------------------|
| Framework         | [Next.js](https://nextjs.org/) 16 (App Router)          |
| UI                | [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/) 4 |
| Animation         | [Framer Motion](https://www.framer.com/motion/)         |
| Data fetching     | [TanStack Query](https://tanstack.com/query), [Axios](https://axios-http.com/) |
| Forms             | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Image uploads     | [ImgBB](https://api.imgbb.com/) API                     |
| Payments          | [Stripe](https://stripe.com/) Checkout                  |
| Icons             | [React Icons](https://react-icons.github.io/react-icons/) |
| Deployment        | [Vercel](https://vercel.com/)                           |

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- The [CoFoundry server](https://github.com/shariful-ire) running locally or deployed

### Installation

```bash
git clone https://github.com/shariful-ire/cofoundry-client.git
cd cofoundry-client
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your own values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the CoFoundry server (no trailing slash) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key, used for client-side image uploads |
| `BYPASS_AUTH` | Dev only — set `true` to skip the auth guard while developing locally |

### Run locally

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/        # Home, Browse Startups, Browse Opportunities, Payment success
│   ├── (auth)/           # Login, Register
│   ├── (dashboard)/      # Founder, Collaborator, Admin dashboards
│   └── auth/google/      # Google OAuth callback handler
├── components/           # Navbar, Footer, dashboard shell, home sections
├── context/              # AuthContext — session state
├── hooks/, lib/          # Axios instance, TanStack Query client
└── proxy.js              # Route protection (Next.js Proxy / middleware)
```

---

## 🔐 Security Notes

- Session cookie is HTTPOnly — never accessible to client-side JavaScript
- All protected routes are guarded both at the edge (Proxy) and client-side
- Role is always resolved from the verified server session, never trusted from client state

---

## 👤 Author

**Md Shariful Islam**

[![GitHub](https://img.shields.io/badge/GitHub-shariful--ire-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shariful-ire)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-shariful--ire-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shariful-ire)
[![Twitter](https://img.shields.io/badge/Twitter-shariful__ire-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/shariful_ire)

