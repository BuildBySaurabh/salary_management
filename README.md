# Full Stack Digital Lending Application

A full-stack web application built for a digital lending/NBFC use case. The application provides a modern interface for managing lending-related workflows with a Python Django backend, React frontend, PostgreSQL database, and secure REST APIs.

The project is designed with a focus on scalability, security, performance, and a clean user experience.

---

## Live Demo

**Frontend:**
https://salary-management-frontend-1h1y.onrender.com

> **Open the frontend link above to explore the complete working application, including the available features and user flows.**

**Backend API:**
https://salary-management-bnhw.onrender.com

> **The application is fully deployed and can be accessed online without setting up the project locally.**

---

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Responsive UI

### Backend

* Python
* Django
* Django REST Framework
* REST APIs
* JWT Authentication
* Role-Based Access Control (RBAC)

### Database

* PostgreSQL

### Cloud & Deployment

* Render
* AWS
* Cloud deployment and environment configuration

---

### Tools

* Git
* GitHub
* Postman
* VS Code

---

## Features

* Full-stack web application using React and Django
* RESTful API architecture
* Secure authentication using JWT
* Role-based access control
* PostgreSQL database integration
* Responsive React user interface
* API integration between frontend and backend
* Backend validation and error handling
* Database-driven application workflows
* Production deployment on Render
* Environment-based configuration
* Production debugging and performance optimization

---

## Project Architecture

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                               │ REST APIs
                               ▼
                    ┌─────────────────────┐
                    │       Django        │
                    │   Django REST API   │
                    └──────────┬──────────┘
                               │
                               │ ORM
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
```

---

## Authentication & Security

The application uses JWT-based authentication for securing API requests.

Key security features include:

* JWT authentication
* Role-based access control
* Protected API endpoints
* Server-side validation
* Environment variables for sensitive configuration
* Controlled CORS configuration

---

## Project Structure

```text
project/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── project/
│   └── applications/
│
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── public/
│
└── README.md
```

---

## Environment Variables

Create the required environment variables for the backend and frontend.

### Backend

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=your-postgresql-database-url
CORS_ALLOWED_ORIGINS=your-frontend-url
CSRF_TRUSTED_ORIGINS=your-frontend-url
```

### Frontend

Example:

```env
VITE_API_URL=your-backend-api-url/api
```

---

## Deployment

The application is deployed using **Render**.

Typical deployment setup:

### Backend

```text
Build Command:
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

### Frontend

```text
Build Command:
npm install && npm run build
```

---

The generated frontend build is deployed as a Render static site.

## Application Flow

```text
User
  │
  ▼
React Frontend
  │
  │ HTTP / REST API
  ▼
Django REST Framework
  │
  ├── Authentication
  ├── Authorization
  ├── Business Logic
  └── Validation
  │
  ▼
PostgreSQL
```

---

## Key Development Areas

### Backend

* Django application development
* REST API development
* Authentication and authorization
* Database models and relationships
* Business logic
* API validation
* Error handling

### Frontend

* React components
* API integration
* Form handling
* Authentication state
* Responsive UI
* User interactions

### Database

* PostgreSQL
* Relational data modeling
* Querying through Django ORM
* Data validation

## API Testing

APIs can be tested using tools such as:

* Postman
* Browser developer tools
* Frontend API integration

---

## Performance & Scalability

The application is structured to support future scaling through:

* REST API separation
* PostgreSQL database
* Reusable React components
* Modular Django applications
* Cloud deployment
* Environment-based configuration
* Database query optimization

---

## Future Improvements

Possible future enhancements include:

* React Native mobile application
* DynamoDB integration where appropriate
* Docker-based deployment
* Kubernetes-based orchestration
* Background job processing
* Advanced monitoring and logging
* Automated CI/CD pipelines
* Additional lending and financial workflows
* AI-powered lending assistance and automation

---
<img width="1241" height="1754" alt="Image" src="https://github.com/user-attachments/assets/34c620a8-aec2-4013-b211-2990d10eeed4" />
<img width="1919" height="941" alt="Image" src="https://github.com/user-attachments/assets/fd2ca182-3d72-44c0-8d34-6efe16558d05" />
<img width="1918" height="941" alt="Image" src="https://github.com/user-attachments/assets/14d95180-bc16-41af-b9ea-657eb8854a60" />
<img width="1919" height="942" alt="Image" src="https://github.com/user-attachments/assets/245948b9-5cb7-46df-969d-5a23d65912fc" />
<img width="1919" height="947" alt="Image" src="https://github.com/user-attachments/assets/a4b5929e-ad08-438f-94e9-be3a59fbf7b3" />
<img width="1919" height="947" alt="Image" src="https://github.com/user-attachments/assets/fc13f3a2-9c3f-4841-9269-fcd52d6cf84d" />
<img width="1913" height="944" alt="Image" src="https://github.com/user-attachments/assets/d37e8e31-0c90-40cb-a429-13299b2bede8" />
<img width="1917" height="940" alt="Image" src="https://github.com/user-attachments/assets/ab45cbdf-362d-4cd4-9172-4f1aa3402d19" />


## Author

**Saurabh Waghmare**

