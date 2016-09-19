function searchSoundCloud(searchGere){
    var queryURL = "http://api.soundcloud.com/tracks?genres="+searchGere+"&client_id=72006e568cc8f77ed2a5b68c4a8c1ca5";

    $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
        	console.log(queryURL);	            
        	console.log(response);
        });
    return false;
}

$('#searchButton').on('click', function() {
	var	searchGere = this.val();
	searchSoundCloud(searchGere);
	console.log(searchGere);
	alert(halp);


});


