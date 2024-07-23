

function initializeFunctions() {


    fetchBookedAppointments();
}

function clearAndCloseModal() {
    clearFormFields(); 
    $('#addModal').modal('hide'); 
}

const textInput = document.getElementById('date');
textInput.addEventListener('focus', function() {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 5);

    const formattedToday = today.toISOString().split('T')[0];
    const formattedFutureDate = futureDate.toISOString().split('T')[0];

    textInput.setAttribute('min', formattedToday);
    textInput.setAttribute('max', formattedFutureDate);
});

document.getElementById('specialist').addEventListener('change', function() {
    const spec = this.value;
    const doctorList = document.getElementById('doctorList');
    doctorList.innerHTML = '<option disabled selected>Select</option>';

    fetch('http://localhost:8080/Doctor/getDoc', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(data => {
        doctorList.innerHTML = '<option disabled selected>Select</option>';
        data.forEach(doctor => {
            if (doctor.specialist === spec) {
                const option = document.createElement('option');
                option.text = doctor.name;
                option.value = doctor.doctorId;
                doctorList.appendChild(option);
            }
        });
    })
    .catch(error => console.error('Error fetching doctors:', error));
});

document.getElementById('date').addEventListener('change', function() {
    const slotSelect = document.getElementById('slot');
    const selectedDoctor = document.getElementById('doctorList').value;
    const selectedDate = this.value;
    slotSelect.innerHTML = '<option disabled selected>Select a time</option>';

    fetch('http://localhost:8080/slot/availableSlots', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(data => {
        slotSelect.innerHTML = '<option disabled selected>Select</option>';
        data.forEach(slot => {
            if (slot.doctorId == selectedDoctor && slot.slotDate === selectedDate) {
                const times = slot.slotTime.split(',');
                times.forEach(time => {
                    const option = document.createElement('option');
                    option.text = time;
                    option.value = time;
                    option.dataset.doctorId = slot.doctorId;
                    option.dataset.slotId = slot.slotId;
                    slotSelect.appendChild(option);
                });
            }
        });
    })
    .catch(error => console.error('Error fetching slots:', error));
});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const addon = getParameterByName('mail');
let doctorName;
document.getElementById('doctorList').addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    doctorName = selectedOption.text;
});

document.getElementById('slot').addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    window.selectedSlotId = selectedOption.dataset.slotId;
});
    
    function register() {
            console.log("function calling")
            var userId = addon;   
            var specialist = document.getElementById("specialist").value;
            var name =doctorName;
            var slotDate = document.getElementById("date").value;
            var slotTime= document.getElementById("slot").value;
            var doctorId=document.getElementById("doctorList").value;

            if (!specialist || !doctorId || !slotTime || !slotDate) {
                alert("Please fill in all required fields.");
                return;}
            var slotId = window.selectedSlotId;
            var registerObject = {
                userId: userId,
                specialist:specialist,
                name:name,
                slotDate:slotDate,
                slotTime:slotTime,
                doctorId:doctorId,
                slotId:slotId
            }

            console.log(registerObject);

            fetch('http://localhost:8080/book/addbooking', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(registerObject),
            })
            .then(response =>  {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
             
                return response.text();
            })
            .then(data => {
                clearAndCloseModal();
                fetchBookedAppointments();
                // notificate(slotId,userId);
                if(data === 'saved'){
                    alert('appointment confirmed');
                    clearFormFields();
                    
                    
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while Booking');
            });
            
    }
        
    function clearFormFields() {
        document.getElementById("specialist").selectedIndex = 0;
        document.getElementById("doctorList").selectedIndex = 0;
        document.getElementById("date").value = '';
        document.getElementById("slot").innerHTML = '<option disabled selected>Select</option>';
    }

    
    function fetchBookedAppointments() {
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
                
                data.forEach(booking => {
                    if (booking.userId == addon) { 
                        const row = tableBody.insertRow();
                        const currentDateTime = new Date().toISOString().split('T')[0];
                        console.log('Current Date:', currentDateTime);
                        console.log('Booking Date:', booking.slotDate);
                            console.log(currentDateTime);
                  
                            if(booking.slotDate > currentDateTime) {
                     
                        row.insertCell().textContent = booking.recordId;
                        row.insertCell().textContent = booking.specialist;
                        row.insertCell().textContent = booking.name;
                        row.insertCell().textContent = booking.slotDate;
                        row.insertCell().textContent = booking.slotTime;
    
                 
                        const actionCell = row.insertCell();

                       
                           
                            const cancelButton = document.createElement('button');
                            cancelButton.textContent = 'Cancel';
                            cancelButton.className = 'btn btn-danger btn-sm';
                            cancelButton.onclick = function() {
                                deleteAppointment(booking.recordId);
                            };
                            actionCell.appendChild(cancelButton);
                        }
                    }
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
                        makeslotavail();
                        fetchBookedAppointments();

                    })
                    .catch(error => {
                        console.error('Error deleting appointment:', error);
                    });
                }
        $(document).ready(function() {
            fetchBookedAppointments() ;
        });





        function makeslotavail()
        {
            var slotId = window.selectedSlotId;
            var obj = {
                slotId:slotId,
                
                booked:0
            }
            console.log('hello durga', slotId),
            fetch(`http://localhost:8080/slot/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(obj),
            })
            .then(response =>  {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
             
                return response.text();
            })
            // .then(data => {
            //    alert('deleted successfully');
              
            // })
            .catch(error => {
                console.error('Error:', error);
                // alert('An error occurred while deleting');
            });
        }    

             function viewDoctorReport(recordId) {
            var url = `http://localhost:8080/prescription/getprescription?recordId=${recordId}`;
            
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch prescription data');
                    }
                    return response.json();
                })
                .then(data => {
                    const modalBody = document.getElementById('reportModalBody');
                    modalBody.innerHTML = '';
        
                    if (data && data.length > 0) {
                        data.forEach(prescription => {
                            if (prescription.recordId === recordId) {
                                var reason = prescription.reason;
                                var medication = prescription.medication;
                                var diet = prescription.diet;
                                var detail = prescription.detail;
        
                                const reasonPara = document.createElement('p');
                                reasonPara.innerHTML = `<strong>Reason for visit:</strong> ${reason}`;
        
                                const medicationPara = document.createElement('p');
                                medicationPara.innerHTML = `<strong>Medication prescribed:</strong> ${medication}`;
        
                                const dietPara = document.createElement('p');
                                dietPara.innerHTML = `<strong>Diet:</strong> ${diet}`;
        
                                const detailPara = document.createElement('p');
                                detailPara.innerHTML = `<strong>Detail:</strong> ${detail}`;
        
                                const hrElement = document.createElement('hr');
        
                                modalBody.appendChild(reasonPara);
                                modalBody.appendChild(medicationPara);
                                modalBody.appendChild(dietPara);
                                modalBody.appendChild(detailPara);
                                modalBody.appendChild(hrElement);
                            }
                        });
        
                        $('#reportModal').modal('show');
                    } else {
                        modalBody.innerHTML = '<p>No prescription data available</p>';
                        $('#reportModal').modal('show');
                    }
                })
                .catch(error => {
                    console.error('Error fetching prescription data:', error);
        
                    const modalBody = document.getElementById('reportModalBody');
                    modalBody.innerHTML = '<p>Error fetching prescription data</p>';
                    $('#reportModal').modal('show');
                });
        }
        


        function fetchPastAppointments() {

            if (!document.getElementById('searchInput').classList.contains('hidden')) {

            fetch('http://localhost:8080/book/getBooking')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch appointments');
                    }
                    return response.json();
                })
                .then(data => {
                    const tableBody = document.querySelector('#example tbody');
                    tableBody.innerHTML = ''; // Clear existing table rows
                    
                    data.forEach(booking => {
                        if (booking.userId == addon) { // Filter appointments for the current user
                            const row = tableBody.insertRow();
                            const currentDateTime = new Date().toISOString().split('T')[0];
                            console.log('Current Date:', currentDateTime);
                            console.log('Booking Date:', booking.slotDate);
                                console.log(currentDateTime);
                      
                                if(booking.slotDate < currentDateTime) {
                            // Insert cells for each appointment detail
                            row.insertCell().textContent = booking.recordId;
                            row.insertCell().textContent = booking.specialist;
                            row.insertCell().textContent = booking.name;
                            row.insertCell().textContent = booking.slotDate;
                            row.insertCell().textContent = booking.slotTime;
        
                       
                            const actionCell = row.insertCell();
        
                         
                            const viewReportButton = document.createElement('button');
                            console.log(viewReportButton);
                            viewReportButton.textContent = 'View Report';
                            viewReportButton.className = 'btn btn-primary btn-sm';
                            viewReportButton.onclick = function() {
                                viewDoctorReport(booking.recordId);
                            };
                            actionCell.appendChild(viewReportButton);
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching appointments:', error);
                });
        }

    }


        // Add an event listener to the search input field
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase(); // Get the search query and convert to lowercase

    // Call the function to fetch past appointments with the search query
    fetchSearch(searchTerm);
});






// document.getElementById('view-history').addEventListener('click', function() {
//     // Toggle visibility of search input
//     const searchInput = document.getElementById('searchInput');
//     searchInput.classList.toggle('hidden');
//     // If search input is now visible, fetch past appointments
//     if (!searchInput.classList.contains('hidden')) {
//         fetchPastAppointments();
//     }
// });


document.getElementById("view-history").addEventListener("click", function() {
    const searchInput = document.getElementById("searchInput");
    const appointmentTableBody = document.querySelector("#example tbody");

    searchInput.classList.toggle("hidden");
    if (searchInput.classList.contains("hidden")) {
        appointmentTableBody.innerHTML = "";
        searchInput.value = "";
        fetchBookedAppointments();
    }
    if (!searchInput.classList.contains('hidden')) {
                fetchPastAppointments();
            }
});





function fetchSearch(searchTerm = '') {
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
            
            data.forEach(booking => {
                if (booking.userId == addon) { 
                    const row = tableBody.insertRow();
                    const currentDateTime = new Date().toISOString().split('T')[0];
                    console.log('Current Date:', currentDateTime);
                    console.log('Booking Date:', booking.slotDate);
                        console.log(currentDateTime);
              
                        if(booking.slotDate < currentDateTime) {
                            
                            if (
                                booking.slotDate.includes(searchTerm) ||
                                booking.specialist.toLowerCase().includes(searchTerm) ||
                                booking.name.toLowerCase().includes(searchTerm)
                            ) {
                               
                                row.insertCell().textContent = booking.recordId;
                                row.insertCell().textContent = booking.specialist;
                                row.insertCell().textContent = booking.name;
                                row.insertCell().textContent = booking.slotDate;
                                row.insertCell().textContent = booking.slotTime;

                               
                                const actionCell = row.insertCell();

                            
                                const viewReportButton = document.createElement('button');
                                viewReportButton.textContent = 'View Report';
                                viewReportButton.className = 'btn btn-primary btn-sm';
                                viewReportButton.onclick = function() {
                                    viewDoctorReport(booking.recordId);
                                };
                                actionCell.appendChild(viewReportButton);
                            }
                        }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
        });
}

function notificate(slotId,userId){
    console.log('notify1');
    console.log(slotId);
    console.log(userId);

    var detail= {
        userId: userId,
        slotId:slotId
    }

fetch(`http://localhost:8080/email/send-document`, {
    
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(detail),
  
})
.then(response => {
  if (!response.ok) {
    throw new Error('Failed to send email');
  }
  return response.json(); 
})
.then(data => {
  console.log('Email sent successfully:', data);
})
.catch(error => {
  console.error('Error sending email:', error);
});
}