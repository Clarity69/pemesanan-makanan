// Check if already logged in
if (localStorage.getItem('username')) {
    window.location.replace('/index.html');
}

document.addEventListener('DOMContentLoaded', () => {
    // Show/Hide Register Form
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('registerSection').style.display = 'block';
    });

    // Show/Hide Login Form
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('loginSection').style.display = 'block';
    });

    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('username', username);
                window.location.replace('/index.html');
            } else {
                loginError.textContent = data.message;
                loginError.style.display = 'block';
            }
        } catch (error) {
            loginError.textContent = 'Error connecting to server';
            loginError.style.display = 'block';
        }
    });

    // Handle Registration
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;

        try {
            console.log('Attempting registration for:', username);
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful');
                // Switch to login form
                document.getElementById('registerSection').style.display = 'none';
                document.getElementById('loginSection').style.display = 'block';
                loginError.textContent = 'Registration successful! Please login.';
                loginError.style.display = 'block';
                loginError.style.color = 'green';
            } else {
                console.log('Registration failed:', data.message);
                registerError.textContent = data.message;
                registerError.style.display = 'block';
            }
        } catch (error) {
            console.error('Registration error:', error);
            registerError.textContent = 'Error connecting to server';
            registerError.style.display = 'block';
        }
    });
});