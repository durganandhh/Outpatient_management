
function initializeFunctions() {
    fetchFutureAppointments();


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

var passValue = getParameterByName('mail');
console.log(passValue);

let currentUserId = null;

function fetchBookedAppointments() {
    fetch('http://localhost:8080/book/getBooking')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#example tbody');
        tableBody.innerHTML = '';

        const currentDateTime = new Date().toISOString().split('T')[0];

        fetch('http://localhost:8080/profile/getpatprofile')
        .then(userResponse => userResponse.json())
        .then(users => {
            data.forEach(booking => {
                if (booking.doctorId == passValue && booking.slotDate < currentDateTime) {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = booking.recordId;
                    row.insertCell().textContent = booking.userId;
                    row.insertCell().textContent = booking.slotDate;
                    row.insertCell().textContent = booking.slotTime;

                    const user = users.find(user => user.userId == booking.userId);
                    if (user) {
                        row.insertCell().textContent = user.name;
                    }
                    const addDetailsCell = row.insertCell();
                    const addDetailsButton = document.createElement('button');
                    addDetailsButton.textContent = 'report';
                    addDetailsButton.className = 'btn btn-primary btn-sm';
                    addDetailsButton.onclick = function() {
                        openAddDetailsModal(booking.recordId);
                    };
                    addDetailsCell.appendChild(addDetailsButton);

                    
                    if (booking.prescriptionAdded) {
                        const actionCell = row.insertCell();
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Cancel';
                        deleteButton.className = 'btn btn-danger btn-sm';
                        deleteButton.onclick = function() {
                            deleteAppointment(booking.recordId);
                        };
                        actionCell.appendChild(deleteButton);
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
}



function deleteAppointment(recordId) {
                fetch(`http://localhost:8080/book/deletebook/${recordId}`, {
                    method: 'DELETE'
                })
                .then(() => {
                    console.log('step2');
                    fetchFutureAppointments();

                })
                .catch(error => {
                    console.error('Error deleting appointment:', error);
                });
            }

function openAddDetailsModal(recordId) {
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.style.display = 'block'; 
        fetchPrescriptions(recordId);
       
        const recordIdInput = modal.querySelector('#recordIdInput');
        if (recordIdInput) {
            recordIdInput.value = recordId; 
        }
       
        
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
        }
    } else {
        console.error('Modal element not found.');
    }
}

















function postDetailsToDatabase(details) {
    fetch('http://localhost:8080/prescription/addprescription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Details added successfully:', data);
        
    })
    .catch(error => {
        console.error('Error adding details:', error);
    });
}


const addSubmitBtn = document.getElementById('add-submit');
addSubmitBtn.addEventListener('click', function() {
    const recordId = document.getElementById('recordIdInput').value;
    const reason = document.getElementById('consultationType').value;
    const medication = document.getElementById('medication').value;
    const diet = document.getElementById('dietaryRecommendation').value;
    const concern = document.getElementById('healthConcern').value;
    const severity = document.getElementById('severity').value;
    const allergy = document.getElementById('allergies').value;
    const detail = document.getElementById('detailsInput').value;


    const details = {

        recordId,
        reason,
        medication,
        diet,
        concern,
        severity,
        allergy,
        detail
        
    };


    postDetailsToDatabase(details);

    addSubmitBtn.disabled = true;
});










function fetchPrescriptions(recordId) {
    fetch(`http://localhost:8080/prescription/getprescription`,{
    method: 'GET',
           
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(detail => {
                if(detail.recordId==recordId){
                populateForm(detail);} 
                else {
                console.log('No details found for this user');
                clearForm();
            }
        })
    })
        .catch(error => {
            console.error('Error fetching user details:', error);

        });
}

function clearForm(){
    document.getElementById('consultationType').value = '';
    document.getElementById('medication').value = '';
    document.getElementById('dietaryRecommendation').value = '';
    document.getElementById('healthConcern').value = '';
    document.getElementById('severity').value = '';
    document.getElementById('allergies').value = '';
    document.getElementById('detailsInput').value = '';

    document.getElementById('consultationType').textContent = '';
    document.getElementById('medication').textContent = '';
    document.getElementById('dietaryRecommendation').textContent = '';
    document.getElementById('healthConcern').textContent = '';
    document.getElementById('severity').textContent = '';
    document.getElementById('allergies').textContent = '';
    document.getElementById('detailsInput').textContent = '';
}
function populateForm(data) {
    document.getElementById('consultationType').value =data.reason;
    document.getElementById('medication').value =data.medication;
    document.getElementById('dietaryRecommendation').value = data.diet;
    document.getElementById('healthConcern').value = data.concern;
    document.getElementById('severity').value  =data.severity;
    document.getElementById('allergies').value =  data.allergy;
    // document.getElementById('surgery').value = data.surgery;
    document.getElementById('detailsInput').value = data.detail;

    document.getElementById('consultationType').textContent = data.reason;
    document.getElementById('medication').textContent = data.medication;
    document.getElementById('dietaryRecommendation').textContent = data.diet;
    document.getElementById('healthConcern').textContent = data.concern;
    document.getElementById('severity').textContent = data.severity;
    document.getElementById('allergies').textContent = data.allergy;
    document.getElementById('detailsInput').textContent = data.detail;
    // document.getElementById('user-surgery').textContent = data.surgery;
}


let isShowingHistory = false; 


function toggleAppointmentView() {
    if (isShowingHistory) {
        fetchFutureAppointments();
    } else {
        fetchBookedAppointments();
    }
    isShowingHistory = !isShowingHistory;
}


document.getElementById("view-history").addEventListener("click", toggleAppointmentView);




function fetchFutureAppointments() {
    fetch('http://localhost:8080/book/getBooking')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector('#example tbody');
        tableBody.innerHTML = ''; 

        const currentDateTime = new Date().toISOString().split('T')[0]; 

        fetch('http://localhost:8080/profile/getpatprofile')
        .then(userResponse => userResponse.json())
        .then(users => {
            data.forEach(booking => {
                if (booking.doctorId == passValue && booking.slotDate >= currentDateTime) {
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = booking.recordId;
                    row.insertCell().textContent = booking.userId;
                    row.insertCell().textContent = booking.slotDate;
                    row.insertCell().textContent = booking.slotTime;

                    const user = users.find(user => user.userId == booking.userId);
                    if (user) {
                        row.insertCell().textContent = user.name;
                    }

                    const addDetailsCell = row.insertCell();
                    const addDetailsButton = document.createElement('button');
                    addDetailsButton.textContent = 'Report';
                    addDetailsButton.className = 'btn btn-primary btn-sm';
                    addDetailsButton.onclick = function() {
                        openAddDetailsModal(booking.recordId);
                    };
                    addDetailsCell.appendChild(addDetailsButton);

                    const actionCell = row.insertCell();
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.className = 'btn btn-danger btn-sm';
                    cancelButton.onclick = function() {
                        deleteAppointment(booking.recordId);
                    };
                    actionCell.appendChild(cancelButton);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
}
}