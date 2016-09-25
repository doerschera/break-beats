$(document).ready(function() {


// Initialize Firebase
  	var config = {
	    apiKey: "AIzaSyAauOC4PC5WrE3Br4Ff1-HkA-FxBmh1QfQ",
	    authDomain: "breakbeats-4758a.firebaseapp.com",
	    databaseURL: "https://breakbeats-4758a.firebaseio.com",
	    storageBucket: "breakbeats-4758a.appspot.com",
	    messagingSenderId: "1058322946724"
  	};
  	firebase.initializeApp(config);

  	// Global variables
	var tags = [];
	var breaks = [];

  	//List tags stored in firebase
	function listTags() {
		var tagsListRef = firebase.database().ref('tagsArray');
		tagsListRef.on('child_added', function(snapshot){
			console.log('Tag: ' + snapshot.val());
		})
	}
	listTags();


	function listBreaks() {
		
		var breaksListRef = firebase.database().ref('playlists');
		breaksListRef.on('child_added', function(snapshot){
		
		console.log('Break: ' + snapshot.val());
		})
	}
	listBreaks();

	// 
	//       "funny",
	//       "calm",
	//       "energy",
	//       "jazz",
	//       "happy",
	//       "Sad",
	//       "Slow",
	//       "fast",
	//       "cats"
	//     ];


	//       "test cats",
	//       "jazz break",
	//       "Groovy",
	//       "rock",
	//       "crazy"
	//     ];


	    $( "#tags" ).autocomplete({
	      source: tags
		});

	    $( "#breaks" ).autocomplete({
	      source: breaks
		});


	$(document).on('click', '#tagSearch', function(tags) {
	});

	$(document).on('click', '#breakSearch', function(breaks) {
	});

});