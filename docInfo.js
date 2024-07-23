document.addEventListener('DOMContentLoaded', fetchUserDetails);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    console.log("Current URL:", url);

    name = name.replace(/[\[\]]/g, "\\$&");
    console.log("Parameter Name:", name);

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    console.log("Regular Expression:", regex);

    var results = regex.exec(url);
    console.log("Regex Results:", results);

    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var use = getParameterByName('mail');
console.log("Value of 'mail' parameter:", use);

function updateProfile() {
    const updatedDetail = {
        email: document.getElementById('edit_email').value,
        name: document.getElementById('edit_name').value,
        gender: document.getElementById('edit_gender').value,
        mobile: document.getElementById('edit_mobile').value,
        address: document.getElementById('edit_address').value,
        bloodGroup: document.getElementById('edit_bloodGroup').value,
        specialist: document.getElementById('edit_specialist').value, // Corrected ID
        password: document.getElementById('edit_password').value, // Corrected ID
        doctorId: use
    };

    console.log('Updated Detail:', updatedDetail); 

    fetch('http://localhost:8080/Doctor/addDoc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDetail)
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        return response.text(); // Return plain text response
    }
})
.then(data => {
    if (typeof data === 'object') {
        // Data received as JSON, display success message
        console.log('Profile saved successfully');
        alert('Profile saved successfully');
        fetchUserDetails();
    } else {
        // Data received as plain text
        if (data === 'saved') {
            console.log('Profile saved successfully');
            alert('Profile saved successfully');
            fetchUserDetails();
        } else {
            console.error('Error: Profile not saved');
            alert('Profile not saved');
        }
    }
})
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}

$(document).ready(function() {
    fetchUserDetails();
});

function fetchUserDetails() {
    fetch(`http://localhost:8080/Doctor/getDoc`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(doc => {
            if (doc.doctorId == use) {
                console.log(use);
                console.log(doc.doctorId);
                if (doc) {
                    console.log('User details found:', doc);
                    populateForm(doc);
                } else {
                    console.log('No details found for this user');
                    clearForm();
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
    });
}

function populateForm(data) {
    document.getElementById('edit_name').value = data.name;
    document.getElementById('edit_email').value = data.email;
    document.getElementById('edit_gender').value = data.gender;
    document.getElementById('edit_mobile').value = data.mobile;
    document.getElementById('edit_address').value = data.address;
    document.getElementById('edit_bloodGroup').value = data.bloodGroup;
    document.getElementById('edit_specialist').value = data.specialist; 
    document.getElementById('edit_password').value = data.password;

    document.getElementById('user-name').textContent = data.name;
    document.getElementById('user-email').textContent = data.email;
    document.getElementById('user-gender').textContent = data.gender;
    document.getElementById('user-mobile').textContent = data.mobile;
    document.getElementById('user-address').textContent = data.address;
    document.getElementById('user-bloodGroup').textContent = data.bloodGroup;
    document.getElementById('user-specialist').textContent = data.specialist;
    document.getElementById('user-password').textContent = data.password;
}

function clearForm() {
    document.getElementById('edit_name').value = '';
    document.getElementById('edit_email').value = '';
    document.getElementById('edit_gender').value = '';
    document.getElementById('edit_mobile').value = '';
    document.getElementById('edit_address').value = '';
    document.getElementById('edit_bloodGroup').value = '';

    document.getElementById('user-name').textContent = '';
    document.getElementById('user-email').textContent = '';
    document.getElementById('user-gender').textContent = '';
    document.getElementById('user-mobile').textContent = '';
    document.getElementById('user-address').textContent = '';
    document.getElementById('user-bloodGroup').textContent = '';
}
