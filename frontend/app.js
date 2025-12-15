const API_URL = 'api';
let token = localStorage.getItem('token');
let username = localStorage.getItem('username');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        showTodoSection();
        loadTodos();
    } else {
        showAuthSection();
    }
    
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('addTodoForm').addEventListener('submit', handleAddTodo);
}

// Auth Functions
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
    clearErrors();
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    clearErrors();
}

function clearErrors() {
    document.getElementById('loginError').textContent = '';
    document.getElementById('signupError').textContent = '';
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('username', data.username);
            showTodoSection();
            loadTodos();
        } else {
            document.getElementById('loginError').textContent = data.error || 'Login failed';
        }
    } catch (error) {
        document.getElementById('loginError').textContent = 'Network error. Please try again.';
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('username', data.username);
            showTodoSection();
            loadTodos();
        } else {
            document.getElementById('signupError').textContent = data.error || 'Signup failed';
        }
    } catch (error) {
        document.getElementById('signupError').textContent = 'Network error. Please try again.';
    }
}

function logout() {
    token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    showAuthSection();
}

function showAuthSection() {
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('todoSection').style.display = 'none';
}

function showTodoSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('todoSection').style.display = 'block';
    document.getElementById('usernameDisplay').textContent = localStorage.getItem('username');
}

// Todo Functions
async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const todos = await response.json();
            renderTodos(todos);
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

function renderTodos(todos) {
    const todosList = document.getElementById('todosList');
    
    if (todos.length === 0) {
        todosList.innerHTML = `
            <div class="empty-state">
                <p>No todos yet!</p>
                <p style="font-size: 0.875rem;">Add your first todo above to get started.</p>
            </div>
        `;
        return;
    }
    
    todosList.innerHTML = todos.map(todo => `
        <div class="todo-item" data-id="${todo.id}">
            <div class="todo-content">
                <div class="todo-title">${escapeHtml(todo.title)}</div>
                <span class="todo-status status-${todo.status.toLowerCase().replace(' ', '-')}">${todo.status}</span>
            </div>
            <div class="todo-actions">
                <button class="btn-edit" onclick="editTodo(${todo.id})">Edit</button>
                <button class="btn-delete" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function handleAddTodo(e) {
    e.preventDefault();
    const title = document.getElementById('todoTitle').value;
    const status = document.getElementById('todoStatus').value;
    
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, status })
        });
        
        if (response.ok) {
            document.getElementById('todoTitle').value = '';
            document.getElementById('todoStatus').value = 'Pending';
            loadTodos();
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

function editTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const title = todoItem.querySelector('.todo-title').textContent;
    const statusElement = todoItem.querySelector('.todo-status');
    const status = statusElement.textContent;
    
    todoItem.classList.add('editing');
    todoItem.innerHTML = `
        <div class="todo-content">
            <input type="text" id="editTitle-${id}" value="${escapeHtml(title)}">
            <select id="editStatus-${id}">
                <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In Progress" ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        </div>
        <div class="todo-actions">
            <button class="btn-save" onclick="saveTodo(${id})">Save</button>
            <button class="btn-cancel" onclick="loadTodos()">Cancel</button>
        </div>
    `;
}

async function saveTodo(id) {
    const title = document.getElementById(`editTitle-${id}`).value;
    const status = document.getElementById(`editStatus-${id}`).value;
    
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, status })
        });
        
        if (response.ok) {
            loadTodos();
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            loadTodos();
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
