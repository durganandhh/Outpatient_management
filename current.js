let slotId;
const textInput = document.getElementById('date');
textInput.addEventListener('focus', function() {

const today = new Date();


const futureDate = new Date();
futureDate.setDate(today.getDate() + 5);

const formattedFutureDate = futureDate.toISOString().split('T')[0];


const dateInput = document.getElementById('date');
dateInput.setAttribute('min', today.toISOString().split('T')[0]); 
dateInput.setAttribute('max', formattedFutureDate);
});    
    
    document.getElementById('specialist').addEventListener('change', function() {
        var spec = this.value;
        var doctorList = document.getElementById('doctorList');
        doctorList.innerHTML = '<option disabled selected> Select </option>';

        fetch('http://localhost:8080/Doctor/getDoc', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            doctorList.innerHTML = '<option disabled selected>Select</option>';
            data.forEach(doctor => {
                if (doctor.specialist === spec) {
                    var option = document.createElement('option');
                    option.text = doctor.name;
                    option.value = doctor.doctorId;
                    doctorList.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching doctors:', error);
        });
    });

    document.getElementById('date').addEventListener('change', function() {
        
        const slotSelect = document.getElementById('slot');
        const selectedDoctor = document.getElementById('doctorList').value;
        const selectedDate = this.value;
        slotSelect.innerHTML = '<option disabled selected>Select a time</option>';


        var url = 'http://localhost:8080/slot/availableSlots';

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            slotSelect.innerHTML = '<option disabled selected>Select</option>';
            data.forEach(slot=> {
                console.log('Processing slot:', slot);
                console.log(slot.slotTime);
                if (slot.doctorId == selectedDoctor && slot.slotDate === selectedDate) 
                {
                    const doctorId=slot.doctorId;
                    console.log(doctorId);
                    const times = slot.slotTime.split(',');
                    times.forEach(time => {
                    var option = document.createElement('option');
                    console.log('hi');
                    option.text = slot.slotTime;
                    option.value = slot.slotTime;
                    option.dataset.doctorId = slot.doctorId;
                    option.dataset.slotId = slot.slotId;
                    console.log(slot.slotTime);
                    slotSelect.appendChild(option);
                });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching slots:', error);
        });
    });

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

 
    var addon = getParameterByName('mail');
    console.log(addon);
    var doctorName
    doctorList.addEventListener('change', function() {
    var selectedOption = doctorList.options[doctorList.selectedIndex];
    doctorName = selectedOption.text;})
    document.getElementById('slot').addEventListener('change', function() {
        var selectedOption = this.options[this.selectedIndex];
        var slotId = selectedOption.dataset.slotId;
        console.log('Selected Slot ID:', slotId);

        window.selectedSlotId = slotId; 
    });
    
    function register() {
            console.log("function calling")
            var userId = addon;   
            var specialist = document.getElementById("specialist").value;
            var name =doctorName;
            var slotDate = document.getElementById("date").value;
            var slotTime= document.getElementById("slot").value;
            var doctorId=document.getElementById("doctorList").value;
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
                details();
                if(data === 'Saved'){
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
                tableBody.innerHTML = ''; // Clear existing table rows
                
                data.forEach(booking => {
                    if (booking.userId == addon) { // Filter appointments for the current user
                        const row = tableBody.insertRow();
    
                        // Insert cells for each appointment detail
                        row.insertCell().textContent = booking.recordId;
                        row.insertCell().textContent = booking.specialist;
                        row.insertCell().textContent = booking.name;
                        row.insertCell().textContent = booking.slotDate;
                        row.insertCell().textContent = booking.slotTime;
    

                        // const actionCell = row.insertCell();
                        // const viewReportButton = document.createElement('button');
                        // viewReportButton.textContent = 'View Report';
                        // viewReportButton.className = 'btn btn-primary btn-sm';
                        // // viewReportButton.onclick = function() {
                        // //     viewDoctorReport(booking.recordId);
                        // // };
                        // actionCell.appendChild(viewReportButton);
    
                        // Create delete button and attach event handler
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
            .then(data => {
            
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting');
            });
        }    

        function viewDoctorReport(recordId){
            fetch('http://localhost:8080/prescription/getprescription')
            .then(response => response.json())
            .then(data => {
                console.log('step1');
               
                console.log('step2');
                data.forEach(data => {
                    if (data.recordId == recordId) {

                    }
            });
        })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
        }

        function details() {
        

            var slotId = window.selectedSlotId;
            console.log(slotId);
            var userId=addon;
            console.log(userId);
            // var requestBody = {
            //     slotId:slotId,
            //     userId: userId
              
            // };
                fetch('http://localhost:8080/email/send-document/'+slotId+userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
           
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log(data);
                            })
            .catch(error => {
                console.error('Error during fetch request:', error);
                alert('An error occurred while processing your request. Please try again later.');
            });

}