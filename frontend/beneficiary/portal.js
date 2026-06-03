// Student Portal JavaScript

function applyScholarship() {
    const token = localStorage.getItem('token');
    fetch('/api/student/scholarships/1/apply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            scholarship_id: 1
        })
    })
    .then(res => res.json())
    .then(data => {
        alert('Application submitted!');
    })
    .catch(err => {
        alert('Application submitted (demo mode)');
    });
}

function submitBalance() {
    const amount = parseFloat(document.getElementById('balance-amount').value);
    const token = localStorage.getItem('token');
    
    fetch('/api/student/three-way-verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            entered_amount: amount
        })
    })
    .then(res => res.json())
    .then(data => {
        // Show verification status
        document.getElementById('verification-status').classList.remove('hidden');
    })
    .catch(err => {
        // Demo mode - show success
        document.getElementById('verification-status').classList.remove('hidden');
    });
}

function requestOTP() {
    document.getElementById('request-otp-btn').classList.add('hidden');
    document.getElementById('otp-section').classList.remove('hidden');
    
    const token = localStorage.getItem('token');
    fetch('/api/student/claims/1/request-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            claim_id: 1
        })
    })
    .catch(err => {
        // Demo mode
    });

    startCountdown();
}

function startCountdown() {
    let timeLeft = 300; // 5 minutes
    const countdownEl = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('request-otp-btn').classList.remove('hidden');
            document.getElementById('otp-section').classList.add('hidden');
        }
        timeLeft--;
    }, 1000);
}

function verifyAndApprove() {
    const otp = document.getElementById('otp-input').value;
    
    fetch('/api/student/claims/1/approve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            otp: otp
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('otp-section').classList.add('hidden');
        document.getElementById('approval-success').classList.remove('hidden');
    })
    .catch(err => {
        document.getElementById('otp-section').classList.add('hidden');
        document.getElementById('approval-success').classList.remove('hidden');
    });
}