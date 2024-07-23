function initializeFunctions() {
    fetchFutureAppointments();
}



function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var checkValue = getParameterByName('mail');
console.log(checkValue);
    function showConfirmation() {
        if (confirm("Are you sure you want to logout?")) {
            window.location.href = "index.html";
        }
        else{
            event.preventDefault();
            return false;
        }
    }
    var destinationURL = "appointment.html?mail=" + checkValue;
        var infoURL="info.html?mail="+checkValue;
        var feedURL="feedback.html?mail="+checkValue;
    $(document).ready(function(){

        

    $('.mydetails').click(function(e){
        e.preventDefault();
        $('.insrt').load(infoURL);
    });
   
    $('.appointment').click(function(e){
        e.preventDefault();
        $('.insrt').load(destinationURL, function() {
            // Call the initialize function after content is loaded
            initializeFunctions();
        });
    });
    $('.feedback').click(function(e){
        e.preventDefault();
        $('.insrt').load(feedURL);
    });
});





