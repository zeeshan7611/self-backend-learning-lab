# Backend Launch Lab — 25 Days from CS Graduate to Practical Backend Developer

**Author & Creator**: **Zeeshan Ansari**  
**Repository**: [https://github.com/zeeshan7611/self-backend-learning-lab](https://github.com/zeeshan7611/self-backend-learning-lab)

> An interactive, beginner-friendly learning platform designed to help CS graduates rebuild programming confidence from scratch. Written in clear, simple English with real-life analogies, side-by-side Java 21 & Python 3.12 comparisons, and guided step-by-step framework implementations (Spring Boot & FastAPI).

---

## 🚀 Key Features

- **Interactive 25-Day Curricular Dashboard**:
  - **Stage A (Days 1–10)**: Dual-language parallel learning (Java & Python) covering terminal fluency, memory models (Stack vs Heap), conditionals & guard clauses, call stacks, two-pointer algorithms, OOP & interfaces, HashMaps & collision mechanics, exceptions & file I/O, Big-O complexity, and the Day 10 Diagnostic Assessment.
  - **Stage B (Days 11–25)**: Primary backend specialization in **Java + Spring Boot 3.3** or **Python + FastAPI 0.115**, covering PostgreSQL relational schemas, REST API idempotency, embedded servers, CRUD DTO separation, 3-tier architecture, Bean Validation/Pydantic, automated testing with mocks, stateless JWT authentication, and structured logging.
- **Coding Practice Engine**:
  - Curated backend problem sets with a 5-tier progressive hint ladder (Problem Breakdown → Conceptual Hint → Algorithm Approach → Pseudocode → Explained Model Solution).
  - Transparent verification criteria checklist for honest self-evaluation.
- **Portfolio Capstone: Job Application Tracker API**:
  - Complete 3-tier layered architecture blueprint (Controller → Service → Repository).
  - PostgreSQL relational schema with cascading foreign keys and indexes.
  - Comprehensive acceptance checklist and executable cURL test workflow.
- **Job Readiness & Interview Preparation**:
  - 10-Point Senior Engineering Rubric (self-assessment across fundamentals, SQL, API design, testing, Git, and architecture).
  - Daily technical interview Q&A with model answers.
  - Truthful entry-level Markdown resume template.
- **Personal Job Application Tracker**:
  - Local database to track real applications (Company, Role, Status, Follow-up Date, Posting URL, and Notes) with JSON export.
- **Local Storage Persistence**:
  - All completed days, quiz results, notes, bookmarks, checklist items, and job applications persist locally in the browser with one-click JSON backup and restore.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Build Tool**: Vite 8
- **Storage**: Browser LocalStorage with full JSON export/import

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or yarn

### Installation & Run
```bash
# 1. Clone the repository
git clone https://github.com/zeeshan7611/self-backend-learning-lab.git
cd self-backend-learning-lab

# 2. Install dependencies
npm install

# 3. Build project
npm run build

# 4. Start the interactive development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 📂 Project Structure

```
backend-launch-lab/
├── public/                 # Static assets & favicon
├── src/
│   ├── components/         # Shared UI components (Sidebar, etc.)
│   ├── data/               # Curricular matrix (Days 1–25), exercises
│   │   ├── days1to5.ts     # Common fundamentals: terminal, types, loops, functions, strings
│   │   ├── days6to10.ts    # OOP, HashMaps, exceptions, DSA, Day 10 Diagnostic
│   │   ├── days11to16.ts   # Relational DBs, HTTP, frameworks, CRUD, 3-tier architecture
│   │   ├── days17to21.ts   # Validation, testing, security, logging, Capstone blueprint
│   │   ├── days22to25.ts   # Capstone implementation sprints & culmination
│   │   ├── curriculum.ts   # Master curriculum index
│   │   └── exercises.ts    # Coding practice challenges with 5-tier hints
│   ├── types/              # TypeScript data models and interfaces
│   ├── utils/              # Local storage manager
│   ├── views/              # Main screen views
│   │   ├── DashboardView.tsx        # KPI metrics, active focus & daily notes
│   │   ├── RoadmapView.tsx          # 25-day roadmap with week filters & search
│   │   ├── DailyWorkspaceView.tsx   # Detailed day lessons, code tabs & quizzes
│   │   ├── CodingPracticeView.tsx   # Practice challenges & 5-tier hints
│   │   ├── TrackView.tsx            # Java vs Python framework deep-dives
│   │   ├── CapstoneView.tsx         # Job Tracker API blueprint & cURL scripts
│   │   ├── InterviewPrepView.tsx    # 10-point rubric & truthful resume template
│   │   ├── JobTrackerView.tsx       # Personal job application manager
│   │   └── ResourcesSettingsView.tsx# Official resource links & data backup
│   ├── App.tsx             # Root router & layout
│   ├── main.tsx            # React root mount
│   └── style.css           # Tailwind v4 configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📜 Educational Philosophy

> **Realism Guarantee**: Completing 25 days does not automatically guarantee employment. Real job readiness is demonstrated through assessment rigor, independent problem-solving, test suites, and clean architecture.
