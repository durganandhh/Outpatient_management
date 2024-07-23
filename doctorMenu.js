function showConfirmation() {
    if (confirm("Are you sure you want to logout?")) {
        window.location.href = "logintry.html";
    }
    else{
        event.preventDefault();
        return false;
    }
}

function getParameterByName(name, url) {
if (!url) url = window.location.href;
name = name.replace(/[\[\]]/g,"\\$&");
var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
results = regex.exec(url);
if (!results) return null;
if (!results[2]) return '';
return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var passValue = getParameterByName('mail');
console.log(passValue)

var destinationURL = "doctorAppointment.html?mail=" +encodeURIComponent(passValue);
var infoURL="docInfo.html?mail="+encodeURIComponent(passValue);
var feedURL="feedBack.html?mail="+encodeURIComponent(passValue);

    $(document).ready(function(){
    $('.mydetails').click(function(e){
    e.preventDefault(); 
    $('.insrt').load(infoURL);
    });

    // $('.appointment').click(function(e){
    // e.preventDefault();
    // $('.insrt').load(destinationURL);
    // });
    
    $('.appointment').click(function(e){
        e.preventDefault();
        $('.insrt').load(destinationURL, function() {
            
            initializeFunctions();
        });
    });

    $('.feedback').click(function(e){
    e.preventDefault();
    $('.insrt').load(feedURL);
    });
});

