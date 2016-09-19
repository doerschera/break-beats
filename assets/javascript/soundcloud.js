$('#searchButton').on('click', function() {
	event.preventDefault();

	var	genre = $('#searchInput').val();
	console.log("genre " +genre);
	var queryURL = "http://api.soundcloud.com/tracks?genres="+genre+"&client_id=72006e568cc8f77ed2a5b68c4a8c1ca5";
	console.log("queryURL " + queryURL);


    $.ajax({
    		url: queryURL, 
    		method: 'GET'
    	})
     	.done(function(response) {
		
		console.log("queryURL " + queryURL);
		console.log(response);

        var results = response.data;
        		console.log("results" +"0");
				console.log(response[0].comment_count);
            for (var i = 0; i < results.length; i++) {
				console.log("results" +i);
				console.log(results[i]);
            }	  		
   	});
});

