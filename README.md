# Simple Todo List Full Stack Application

A minimal full-stack todo application with JWT authentication, built with Spring Boot, MySQL, and vanilla HTML/CSS/JS.

## Features

- 🔐 JWT Authentication (Signup/Login)
- ✅ Create, Read, Update, Delete Todos
- 📊 Todo Status Management (Pending, In Progress, Completed)
- 🎨 Modern Dark UI
- 🐳 Docker Deployment

## Tech Stack

- **Backend**: Spring Boot 3.2, Spring Security, JWT
- **Database**: MySQL 8.0
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Docker, Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Ports 80, 3306, and 8080 available

### Running the Application

1. Clone or navigate to the project directory:
```bash
cd /Users/manishgoyal/project/ToDoListFull
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Start all services:
```bash
docker-compose up --build
```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080

### First Time Setup

1. Open http://localhost in your browser
2. Click "Signup" and create a new account
3. Start adding todos!

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Todos (Requires JWT Token)
- `GET /api/todos` - Get all todos for current user
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

## Project Structure

```
ToDoListFull/
├── backend/
│   ├── src/main/java/com/todo/
│   │   ├── TodoApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── TodoController.java
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   └── Todo.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── TodoRepository.java
│   │   └── security/
│   │       ├── JwtUtil.java
│   │       └── JwtRequestFilter.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .env.example

```

## Environment Variables

Create a `.env` file with:

```env
DB_PASSWORD=rootpassword
JWT_SECRET=mySecretKeyForJWTTokenGenerationAndValidation123456789
```

## Stopping the Application

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

## Development

### Backend Development
```bash
cd backend
./mvnw spring-boot:run
```

### Database Access
```bash
docker exec -it todo-mysql mysql -uroot -p
```

## Security Notes

- Change `DB_PASSWORD` and `JWT_SECRET` in production
- JWT tokens expire after 24 hours
- Passwords are encrypted using BCrypt

## License

MIT
