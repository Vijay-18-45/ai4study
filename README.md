# AI4Study 🎓

> Your AI-powered study companion — upload your notes, ask questions, and get grounded answers instantly.

**Live Demo:** [https://ai4study.lovable.app](https://ai4study.lovable.app)

---

## ✨ Overview

**AI4Study** is a modern, full-stack AI study assistant built for students. Upload PDF, DOCX, or TXT study materials and chat with an AI that answers strictly based on *your* documents — with citations. Browse subject-wise study materials, manage your profile, and learn smarter.

---

## 🚀 Features

- 🔐 **Secure Authentication** — Email/password sign-in with email verification (Firebase Auth)
- 📤 **Document Upload** — Drag-and-drop PDF, DOCX, and TXT files
- 🤖 **AI Q&A** — Ask questions answered strictly from your uploaded materials, with streaming responses and source citations
- 📚 **Study Materials Library** — Browse pre-loaded subject notes (DTI, DLCO, ADSAA, ES, ML, OT, PS) with embedded PDF viewer
- 🛡️ **Admin Gate** — Restricted document upload access for content curators
- 🎨 **Premium Minimalist UI** — Polished SaaS aesthetic with light/dark theme support
- 📱 **Fully Responsive** — Works seamlessly on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| **Frontend**   | React 18, TypeScript, Vite 5              |
| **Styling**    | Tailwind CSS, shadcn/ui, Framer Motion    |
| **State/Data** | TanStack Query, React Hook Form, Zod      |
| **Auth & DB**  | Firebase Auth, Firestore                  |
| **AI Backend** | n8n webhook integration                   |
| **Routing**    | React Router v6                           |
| **Deployment** | Vercel                                    |

---

## ⚡ Setup

### Prerequisites
- Node.js 18+
- npm 9+
- A Firebase project (Auth + Firestore enabled)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/ai4study.git
cd ai4study

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then fill in your Firebase config values

# 4. Run the dev server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Available Scripts

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start the local dev server        |
| `npm run build`  | Build the production bundle       |
| `npm run preview`| Preview the production build      |
| `npm run lint`   | Run ESLint                        |
| `npm run test`   | Run unit tests with Vitest        |

---

## 📸 Screenshots

> _Add screenshots of the Login, Upload, Ask AI, and Study Materials pages here._

| Login | Ask AI | Study Materials |
| ----- | ------ | --------------- |
| ![Login](docs/screenshots/login.png) | ![Ask AI](docs/screenshots/ask.png) | ![Materials](docs/screenshots/materials.png) |

---

## 🌐 Deployment

This project is deployed on **Vercel** with automatic builds on every push to `main`. To deploy your own:

1. Push your fork to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Add your Firebase env vars in the Vercel dashboard
4. Deploy 🚀

---

## 👤 Author

**Your Name**

- 🌐 Portfolio: [yourwebsite.com](https://yourwebsite.com)
- 💼 LinkedIn: [linkedin.com/in/yourname](https://linkedin.com/in/yourname)
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)
- ✉️ Email: your.email@example.com

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ for students, by a student.</p>
