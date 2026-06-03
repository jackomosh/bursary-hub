// Shared authentication functions

function saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
    return !!getToken();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

async function loginAndRedirect(phone, role) {
    try {
        // Request OTP
        await login(phone, role);
        alert('OTP sent to your phone. Please check.');
        
        // In production, show OTP input modal
        const otp = prompt('Enter OTP:');
        if (otp) {
            const result = await verifyOTP(phone, otp);
            saveAuth(result.token, result.user);
            
            // Redirect based on role
            switch (result.user.role) {
                case 'donor':
                    window.location.href = 'grantor/dashboard.html';
                    break;
                case 'school_admin':
                    window.location.href = 'institution/dashboard.html';
                    break;
                case 'student':
                    window.location.href = 'beneficiary/portal.html';
                    break;
                case 'admin':
                    window.location.href = 'admin/dashboard.html';
                    break;
            }
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}