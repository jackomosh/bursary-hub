// Donor Dashboard JavaScript

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

function createScholarship() {
    const title = document.getElementById('title').value;
    const coverageType = document.getElementById('coverage-type').value;
    const maxAmount = parseFloat(document.getElementById('max-amount').value);
    const slots = parseInt(document.getElementById('slots').value);
    const deadline = document.getElementById('deadline').value;
    const minGpa = parseFloat(document.getElementById('min-gpa').value) || 0;
    const courses = document.getElementById('courses').value.split(',').map(c => c.trim());
    const years = document.getElementById('years').value.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));

    if (!title || !maxAmount || !slots) {
        alert('Please fill in required fields');
        return;
    }

    const token = localStorage.getItem('token');
    
    fetch('/api/donor/scholarships', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            title,
            coverage_type: coverageType,
            max_amount_per_student: maxAmount,
            number_of_slots: slots,
            eligible_courses: courses,
            eligible_years: years,
            min_gpa: minGpa,
            application_end_date: deadline
        })
    })
    .then(res => res.json())
    .then(data => {
        alert('Scholarship created successfully!');
        document.getElementById('create-scholarship-form').reset();
    })
    .catch(err => {
        console.error(err);
        alert('Error creating scholarship (API not available in demo)');
    });
}

function loadScholarships() {
    const token = localStorage.getItem('token');
    
    fetch('/api/donor/scholarships', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        // Update scholarships table
        console.log('Scholarships loaded:', data);
    })
    .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', function() {
    loadScholarships();
});