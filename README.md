# Rejection Control System

A full-stack web application developed to digitize and manage the manufacturing rejection process. The system allows production operators to record rejection entries, supervisors to review and approve them, and automatically creates Corrective and Preventive Action (CAPA) records whenever the configured rejection percentage exceeds the escalation limit.

---

## Features

- User Registration (Operator / Supervisor)
- Secure Login using JWT Authentication
- Role-Based Access Control
- Rejection Entry Management
- Automatic CAPA Creation based on Escalation Limit
- Supervisor Approval Workflow
- Shop Floor Display
- System Settings (Escalation Limit)
- Material UI Interface

---

# Technology Stack

## Frontend

- React
- React Router DOM
- Material UI (MUI)
- Zustand
- JavaScript

### Why React?

React provides a component-based architecture, reusable UI components, fast rendering, and excellent support for modern frontend development.

---

## Backend

- Python
- Django
- Django REST Framework
- JWT Authentication (Simple JWT)

### Why Django?

Django offers rapid development, built-in security features, an ORM for database operations, authentication support, and a clean architecture for building REST APIs.

---

## Database

- SQLite

### Why SQLite?

SQLite was chosen because it is lightweight, requires no additional configuration during development, and integrates seamlessly with Django.

---

# Project Structure

```
Rejection-Control-System/
│
├── backend/
│   ├── accounts/
│   ├── approvals/
│   ├── capa/
│   ├── master/
│   ├── rejections/
│   ├── settings/
│   └── config/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── services/
│   ├── layouts/
│   └── routes/
│
└── README.md
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/Naveendpsn25/Rejection-Control-System.git
```

---

## Backend Setup

Move into backend

```bash
cd backend
```

Create virtual environment

```bash
python -m venv venv
```

Activate virtual environment

### Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Apply migrations

```bash
python manage.py migrate
```

Run backend

```bash
python manage.py runserver
```

Backend runs at

```
http://127.0.0.1:8000/
```

---

## Frontend Setup

Move into frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# Login Credentials

Use the following credentials for testing.

## Supervisor

```
Username:
supervisor

Password:
supervisor123
```

## Operator

```
Username:
Naveen

Password:
Naveen.ns@001
```


---

# Workflow

1. User registers as Operator or Supervisor.
2. User logs into the system.
3. Operator creates a rejection entry.
4. System calculates rejection percentage.
5. If rejection percentage exceeds the configured escalation limit:
   - CAPA is created automatically.
6. Supervisor reviews the CAPA.
7. Supervisor approves or rejects the CAPA.
8. Status updates are reflected throughout the system.

---

# API Modules

- Authentication
- Registration
- Rejection Entries
- CAPA
- Approval
- Departments
- Defect Types
- Settings
- Shop Floor Display

---

# Security

- JWT Authentication
- Password hashing using Django
- Role-based authorization
- Protected API endpoints

---

---

# AI Usage Statement

AI tools (ChatGPT) were used during the development of this project to assist with:

- Understanding Django and React concepts.
- Designing REST APIs.
- Debugging frontend and backend issues.
- Improving user interface layout.
- Reviewing application architecture.
- Generating reusable code snippets.

All AI-generated suggestions were carefully reviewed, tested, and modified where necessary to meet the project requirements and business logic. Final implementation, debugging, integration, and testing were performed manually.

---

# Author

**Naveen P**

Bachelor of Engineering (Computer Science and Engineering)

Python Full Stack Developer

GitHub:
https://github.com/Naveendpsn25

---

