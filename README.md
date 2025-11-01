🚀 Project Overview

This project is a Kanban-style To-Do List Dashboard built using React + Vite.
It includes four interactive columns — Backlog, In Progress, Review, and Done — and supports CRUD operations, drag & drop, pagination/infinite scroll, search, and React Query caching.

A Bonus jQuery Task is also implemented to demonstrate DOM manipulation and animations using pure jQuery.

🧠 Features
🖥️ Main Task — Kanban Board

✅ Display tasks in 4 columns: Backlog, In Progress, Review, and Done
✅ Create, Update, and Delete tasks
✅ Drag and Drop tasks between columns (smooth Jira-like animation)
✅ Pagination or Infinite Scroll in each column
✅ Search tasks by title or description
✅ React Query Caching for optimized API requests
✅ Fully responsive and clean UI

🧩 Bonus Task — jQuery Dynamic List

Add items dynamically using an input and button

Show an error message if the input is empty (auto-hides after 2 seconds)

Append new items to the list

Each item has a Delete button with a fade-out animation

⚙️ Tech Stack
Category	Tool
Framework	React (Vite)
State Management	Zustand
Data Fetching	React Query
UI Library	Material UI
API	json-server
Bonus Task	jQuery
Deployment	Vercel

⚡ Setup Instructions
🧱 Prerequisites

Make sure you have installed:

Node.js (v18+)

npm, yarn, or pnpm

json-server (for mock API)

1️⃣ Clone Repository
git clone https://github.com/your-username/kanban-dashboard.git
cd kanban-dashboard

2️⃣ Install Dependencies
npm install


or

pnpm install

3️⃣ Start the Mock API
json-server --watch db.json --port 4000


API Endpoint:
http://localhost:4000/tasks

4️⃣ Run the App
npm run dev


Visit the app at → http://localhost:5173

🔍 API Schema
{
  "id": 1,
  "title": "Design homepage",
  "description": "Include hero section",
  "column": "backlog"
}

🧠 React Query Setup

Caching per column for fast reload

Automatic refetch on mutation (add/update/delete)

Optimistic UI updates when moving tasks between columns

🎨 UI Preview
🖥️ Main Kanban Board

(Example: tasks organized by progress)

🧩 Bonus Task (jQuery Dynamic List)

🌐 Deployment

Deployed via Vercel
🔗 Live Demo: https://your-vercel-link.vercel.app

🔗 GitHub Repository: https://github.com/your-username/kanban-dashboard

🧾 Future Improvements

Add authentication (user-based boards)

Task prioritization (high, medium, low)

Drag-and-drop animations improvements

Dark mode support
