// School Dashboard JavaScript

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

function openNewClaimModal() {
    document.getElementById('new-claim-modal').classList.remove('hidden');
}

function closeNewClaimModal() {
    document.getElementById('new-claim-modal').classList.add('hidden');
}

function createClaim() {
    const token = localStorage.getItem('token');
    // In production, send to API
    alert('Claim created (demo mode)');
    closeNewClaimModal();
}

function saveFeeMaster() {
    const token = localStorage.getItem('token');
    const tuition = parseFloat(document.getElementById('tuition').value);
    
    fetch('/api/school/fee-master', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            school_id: 1,
            academic_year: '2024-2025',
            course: 'Computer Science',
            year_of_study: 1,
            tuition_amount: tuition,
            accommodation_amount: 25000,
            food_amount: 15000,
            transport_amount: 5000
        })
    })
    .then(res => res.json())
    .then(data => {
        alert('Fee master saved successfully!');
    })
    .catch(err => {
        console.error(err);
    });
}

function bulkUpdateFees() {
    const tuition = parseFloat(document.getElementById('tuition').value);
    const token = localStorage.getItem('token');
    
    fetch('/api/school/fee-master/bulk-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            school_id: 1,
            academic_year: '2024-2025',
            course: 'Computer Science',
            year_of_study: 1,
            new_tuition: tuition
        })
    })
    .then(res => res.json())
    .then(data => {
        alert('Bulk update preview: ' + data.students_updated + ' students affected');
    })
    .catch(err => {
        console.error(err);
    });
}