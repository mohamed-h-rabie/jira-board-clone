# 🧩 Front-End Developer Assessment Task

## 🚀 Project Overview

This project is a **Kanban-style To-Do List Dashboard** built using **React + Vite**.  
It includes four interactive columns — **Backlog**, **In Progress**, **Review**, and **Done** — and supports **CRUD operations**, **drag & drop**, **pagination/infinite scroll**, **search**, and **React Query caching**.

A **Bonus jQuery Task** is also implemented to demonstrate DOM manipulation and animations using pure jQuery.

---
## 🌐 Deployment

Deployed via Vercel

🔗 Live Demo (Main App): https://jira-clone-delta-kohl.vercel.app/

🔗 Bonus Task: https://jira-clone-delta-kohl.vercel.app/jqueryTask.html

🔗 GitHub Repository: https://github.com/your-username/kanban-dashboard
---
## 🧠 Features

### 🖥️ Main Task — Kanban Board

✅ Display tasks in **4 columns**: Backlog, In Progress, Review, and Done  
✅ **Create, Update, and Delete** tasks  
✅ **Drag and Drop** tasks between columns (smooth Jira-like animation)  
✅ **Pagination** or **Infinite Scroll** in each column  
✅ **Search** tasks by title or description  
✅ **React Query Caching** for optimized API requests  
✅ Fully **responsive** and **clean UI**

---

### 🧩 Bonus Task — jQuery Dynamic List

- Add items dynamically using an input and button  
- Show an **error message** if the input is empty (auto-hides after 2 seconds)  
- Append new items to the list  
- Each item has a **Delete button** with a fade-out animation  

---

## ⚙️ Tech Stack

| Category | Tool |
|-----------|------|
| **Framework** | React (Vite) |
| **State Management** | Zustand |
| **Data Fetching** | React Query |
| **UI Library** | Material UI |
| **API** | json-server |
| **Bonus Task** | jQuery |
| **Deployment** | Vercel |

---

## ⚡ Setup Instructions

### 🧱 Prerequisites

Make sure you have installed:

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- json-server (for mock API)

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/kanban-dashboard.git
cd kanban-dashboard

then
npm install
# or
pnpm install
# or
yarn install


then Run server 
npx json-server --watch db.json --port 4000
then run client 
npm run dev

