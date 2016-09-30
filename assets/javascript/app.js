var BB = (function() {

	/* -------------------------------------------
	 * Initialize Firebase
	 * ---------------------------------------- */
	  var config = {
	    apiKey: "AIzaSyAauOC4PC5WrE3Br4Ff1-HkA-FxBmh1QfQ",
	    authDomain: "breakbeats-4758a.firebaseapp.com",
	    databaseURL: "https://breakbeats-4758a.firebaseio.com",
	    storageBucket: "breakbeats-4758a.appspot.com",
	    messagingSenderId: "1058322946724"
	  };
	  firebase.initializeApp(config);

	// create a db reference
	  var dbRef = firebase.database().ref();
	// create a reference to the 'links' child inside db
	  playlistsRef = dbRef.child('playlists');
	// create a reference to the 'tags' child
    var tagsRef = dbRef.child('tags');

	/*--------------------------------------------
	 * email init
	 * ---------------------------------------- */

	emailjs.init("user_xrCuLVJF1XPydVeSaCraO");

	/* -------------------------------------------
	 * Bild DOM
	 * ---------------------------------------- */

  // cache DOM
  var $createPlaylist = $('#js-create-playlist'),
			$ytSearch = $('#js-yt-search-button'),
			$playlistSearch = $('#js-playlist-search'),
			$playlistSearchButton = $('#js-playlist-search-button'),
      $videosContainer = $('.yt-results'),
      $listContainer = $('#js-selected-list'),
			$landingSearch = $('#js-landing-search'),
      $ytSearchInput = $('#js-yt-search'),
			$viewNewPlaylist = $('#js-view-new-playlist'),
      $saveButton = $('.save-playlist'),
			$emailAddress = $('#js-email-address'),
			$sendButton = $('#js-send-email'),
      $playlistTitle = $('#js-playlist-name'),
			$playlistVideoContainer = $('#js-video-list'),
			$newTags = $('#js-user-tags'),
			$addTag = $('#js-add-tag-button'),
			$removeTag = $('.chip'),
			$displayError = $('#js-error-message'),
			$close = $('#js-close-send-review'),
			$magenta = '#AB537F',
			data =[],
      query,
      searchTerm,
      videoId,
			returnedTags= [],
      titles = [],
			userTags = [],
      checkedBoxes,
      maxResults = 10,
			playlistCounter = 0,
			playlistIds = [],
      paginationData;

	// render DOM
	  function renderVideos(video) {
	    $videosContainer.append(video);
	  }
	  function renderSelectedTitles(titles) {
			$viewNewPlaylist.removeClass('disabled')
	    $listContainer.html('');
	    for(var i = 0; i < titles.length; i++) {
	      $listContainer.append('<li class="remove-video">'+ titles[i].title +'&nbsp<i class="tiny close material-icons">close</i><li>');
	    }

	  }
		function renderNewTags(tag) {
			$newTags.append(tag);
		}
		function renderNewPlaylist() {
			for(var i = 0; i < titles.length; i++) {
				var title = titles[i].title;
				var image = titles[i].image;

				var $li = $('<li>');
				var $wrapperDiv = $('<div class="col s12"></div>');
				$wrapperDiv.append('<img class="col s6" src='+image+' />');
				$wrapperDiv.append('<p class="flow-text col s6">'+title+'</p>');
				$li.append($wrapperDiv);
				$playlistVideoContainer.append($li);

			}
		}

	// DOM show/hide
	function hideLanding(pageToShow) {
		$('.landing-page').addClass('disable');
		$(pageToShow).removeClass('disable');
		$ytSearchInput.select();
		$playlistSearch.select();
	}
		function reviewAndSend() {
			$('.search-yt').addClass('opacity');
			$('.playlist-review-send').removeClass('disable');
		}
		function closeReviewSend() {
			$('.playlist-review-send').addClass('disable');
			$('.search-yt').removeClass('opacity');
		}
		function playlistHover() {
			$(this).append('<div class="playlist-hover"></div>');
			var index = $(this).index();
			var height = $(this).height();
			var width = $(this).width();
			console.log(playlistIds[index]);
			$('.playlist-hover').css({
				'height': height,
				'width': width
			})
			$('.playlist-hover').append('<h4>This playlist is...</h4>');
			renderPlaylistTags(index);
			$('.playlist-hover').append('<a href="https://pure-harbor-98837.herokuapp.com/break/?breakid='+playlistIds[index]+'" class="waves-effect btn" id="js-view-playlist">view</a>');

		}
		function renderPlaylistTags(index) {
			console.log(returnedTags);
			var tagArray = returnedTags[index];
			for(var i = 0; i < tagArray.length; i++) {
				var tag = tagArray[i];
				var tagDiv = $('<div class="chip">'+tag+'</div>');
				$('.playlist-hover').append(tagDiv);
			}
		}

	// bind events
	  $ytSearch.on('click', doSearch);
		$sendButton.on('click', getPlaylistTitle);
	  $saveButton.on('click', getPlaylistTitle);
		$createPlaylist.on('click', function() {
			hideLanding('.search-yt');
		});
		$landingSearch.on('click', function() {
			hideLanding('.search-playlists');
			loadBrowse();
		});
		$viewNewPlaylist.on('click', function() {
			$(document).scrollTop(0);
			reviewAndSend();
			renderNewPlaylist();
		});
		$addTag.on('click', addTag);
		$(document).on('click', '.remove-tag', removeTag);
		$close.on('click', closeReviewSend);
		$playlistSearchButton.on('click', searchTags);
		$listContainer.on('click', '.remove-video', removeVideo);
		$('.playlist-results').on('mouseenter', '.playlist-display', playlistHover);
		$('.playlist-results').on('mouseleave', '.playlist-display', function() {
			$('.playlist-hover').remove();
		})
		$('#js-view-search').on('click', function() {
			$('.search-yt').addClass('disable').removeClass('opacity');
			$('.search-playlists').removeClass('disable');
		})
		$('#js-view-create').on('click', function() {
			$('.search-playlists').addClass('disable');
			$('.search-yt').removeClass('disable');
		})
		$('#js-forward-email').on('click', forwardPlaylist);




	// search function
	  function doSearch() {
			$videosContainer.empty();
	    searchTerm = $ytSearchInput.val().replace(/ /g, '+');
	    query = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=' + maxResults + '&order=viewCount&q="' + searchTerm + '"&type=video&key=AIzaSyDIE0dd7hZ5j4vQRtwrU0CwQLGq-lhXWCc';
	    getDatafromAPI(query);
			$ytSearchInput.val("");
	    return false;
	  }

	  function getDatafromAPI(query) {
	    $.ajax({
	      url: query,
	      method: 'GET'
	    }).done( data => {
	      // videoId = data[0].id.videoId;
	      for(var i = 0; i < data.items.length; i++) {
	        createImage(data.items[i]);
	      }
	    });
	  }


		/* -------------------------------------------
	   * create iframe function from data
	   * ---------------------------------------- */

		function createIframe(item) {
	    var videoContainer = $('<div>').addClass('video col s6');
	    var video = $('<iframe />', {
	      class: 'Video-iframe Video-iframe--loading',
	      width: '100%',
				height: '100%',
	      src: 'https://www.youtube.com/embed/'+item.id.videoId+'?rel=0',
	      frameborder: '0'
	    });
	    // var checkbox = '<label class="checkbox" for="' + videoId + '"><input type="checkbox" checked="checked" value="" id="' + videoId + '" data-toggle="checkbox" class="custom-checkbox"><span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span></label>';
	    var checkbox = '<input type="radio" class="with-gap radio" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" data-image="' + item.snippet.thumbnails.default.url + '" />';
			var label = '<label for='+item.id.videoId+'></label>';
	    videoContainer.append(video).append(checkbox).append(label);
	    renderVideos(videoContainer);
	  }

		function createImage(item) {
			var imgContainer = $('<div>').addClass('video col s6');
			var title = '<h5>' + item.snippet.title + '</h5>'
			var image = $('<img>', {
				class: 'Image',
				width: '100%',
				height: '100%',
				src: item.snippet.thumbnails.default.url
			});
			var checkbox = '<input type="radio" class="with-gap radio" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" data-image="' + item.snippet.thumbnails.default.url + '" />';
			var label = '<label for='+item.id.videoId+'></label>';
			imgContainer.prepend(title).append(image).append(checkbox).append(label);
			renderVideos(imgContainer);
		}

		function removeVideo() {
			console.log(titles);
			var title = $(this).text()
			title = title.replace(/close/g, "");
			console.log(title);
			var index = $(this).index();
			console.log(index);
			if(index === 0) {
				$listContainer.children('li').eq(0).remove();
				titles.splice(0, 1);
			} else if(index === 2) {
				$listContainer.children('li').eq(2).remove();
				titles.splice(1, 1);
			} else {
				$listContainer.children('li').eq(4).remove();
				titles.splice(2, 1);
			}
			$('.radio').prop('checked', false);
			$('.radio').prop('disabled', false);
			if(titles.length < 1) {
				$viewNewPlaylist.addClass('disabled');
			}
			console.log(titles);
		}


		// internal tag search
		function searchResultsTitle(title) {
			var newDiv = $('<div class="playlist-display col s5" id="playlist'+playlistCounter+'">');
			var h3 = $("<h3>"+title+"</h3>");
			$('.playlist-results').append(newDiv);
			$(newDiv).append(h3);
			$(newDiv).append('<ul>')
		}

		function searchResultsList(image, title) {
			var $li = $('<li>');
			var $wrapperDiv = $('<div class="col s12"></div>');
			$wrapperDiv.append('<img class="col s6 responsive-img" src='+image+' />');
			$wrapperDiv.append('<p class="flow-text col s6">'+title+'</p>');
			$li.append($wrapperDiv);
			$('#playlist'+playlistCounter+'> ul').append($li);
			$('.playlist-display').css('border', 'solid 1px '+$magenta);
		}




  /* -------------------------------------------
   * get URI parameters to display break videos
   * ---------------------------------------- */

	 function getURIParameter(paramID, url) {
     if (!url) url = window.location.href;
     paramID = paramID.replace(/[\[\]]/g, "\\$&");
     var regex = new RegExp("[?&]" + paramID + "(=([^&#]*)|&|#|$)"),
         results = regex.exec(url);
     if (!results) return null;
     if (!results[2]) return '';
     var playlistId = results[2].replace(/\+/g, " ");
     // return decodeURIComponent(atob(playlistId));
     return playlistId;
   }

 // add to DOM
   playlistId = getURIParameter('breakid');

   playlistsRef.on('value', function(snapshot) {
     var playlists = snapshot.val();
     if(playlistId) {
       $('#js-video-display').html('<h3>' + playlists[playlistId].vtitle + '</h3>');
       var videos =playlists[playlistId].videos;
       for(video in videos) {
         if(videos.hasOwnProperty(video)) {
           var vid = videos[video].videoId;
           $('#js-video-display').append('<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/' + vid + '?rel=0" frameborder="0" allowfullscreen></iframe></div>');
         }
       }
     }
	 })

  // usage:
  $('.show-videos').html(getURIParameter('breakid'));




  $(document).on('change', '.radio', addVideoToPlaylist);

  function addVideoToPlaylist() {
    if ( $(this).is(":checked") ) {

        videoTitle  = $(this).data('title');
        videoId     = $(this).attr('id');
        videoImg    = $(this).data('image');
        titles.push({
          'title': videoTitle,
          'image': videoImg,
          'videoId': videoId
        });
        renderSelectedTitles(titles);
        disableSelectionIfPlaylistFull();
    } else {
      videoTitle = $(this).data('title');

      for(var i = 0; i < titles.length; i++) {
        if(titles[i].title === videoTitle) {
          titles.splice(i, 1);
        }
      }
      renderSelectedTitles(titles);
      enableSelection();
    }
  }

  function disableSelectionIfPlaylistFull() {
    checkedBoxes = $(document).find('.radio');
    if ( titles.length > 2 ) {
      for(var i = 0; i < checkedBoxes.length; i++) {
        if( checkedBoxes[i].checked == false) {
          checkedBoxes[i].disabled = true;
        }
      }
    }
  }

  function enableSelection() {
    checkedBoxes = $(document).find('.radio');
    for(var i = 0; i < checkedBoxes.length; i++) {
      if( checkedBoxes[i].disabled == true) {
        checkedBoxes[i].disabled = false;
      }
    }
  }



  /* -------------------------------------------
   * firebase integration
   * ---------------------------------------- */

  function getPlaylistTitle() {
    var playlistTitle = $playlistTitle.val().trim();
		console.log(playlistTitle);
    var tags = userTags;
		var emailAddress = $emailAddress.val().trim();
		var validAddress = /[^@]+@[^@]+/.test(emailAddress);

		$displayError.empty();
		if(playlistTitle == "") {
			$displayError.append('<h5><em>Oops! Your playlist needs a title.</em></h5>');
			return false;
		} else if (tags.length < 1) {
			$displayError.append('<h5><em>Oops! Please add at least one tag to your playlist.</em></h5>');
			return false;
		} else if(!validAddress) {
			$displayError.append('<h5><em>Oops! That\'s not a valid email address.</em></h5>');
			return false;
		} else {
			var newPlaylist = playlistsRef.push().key;
	    playlistsRef.child('/'+newPlaylist+'/').update(
	      {
	        'vtitle': playlistTitle,
	        'vtags': tags
	      });

	    for(i = 0; i < titles.length; i++) {
	      saveToFirebase(newPlaylist, titles[i]);
	    }

	    sendEmail(emailAddress, newPlaylist);


	    // global tag array
	    for(i = 0; i < tags.length; i++) {
	      tagsRef.child('/'+tags[i]+'/').set({
	        'tags': 'tag'
	      });
	    }


	    return false;
		}
  }

	// dbRef.child('tags').on('value', function(snapshot) {
	// 	var tags = snapshot.val();
	// 	data = Object.keys(tags);
	// })
	//
	//
	// 	$('input.autocomplete').autocomplete({
	// 		source: data,
	// 		messages: {
	// 					noResults: '',
	// 					results: function() {}
	// 				}
	// 	});

		// var source = $('input.autocomplete').autocomplete("option", "source");

		// $('input.autocomplete').autocomplete("option", "source", data);




	function addTag() {
		var newTag = $('#js-add-tags').val().trim();
		var newChip =$('<div class="chip">'+newTag+'</div>');
		var iTag = $('<i class="close material-icons remove-tag">close</i>');
		newChip.append(iTag);
		$('#js-user-tags').append(newChip);

		userTags.push(newTag);
		console.log(userTags);
		$('#js-add-tags').val("");
	}

	function removeTag() {
		var tag = $(this).parent().text();
		tag = tag.replace(/close/i, "");
		var index = userTags.indexOf(tag);
		userTags.splice(index, 1);
		console.log(userTags);
	}

  function saveToFirebase(playlistName, video) {
    vid = video.videoId;
    vimg = video.image;
		vtitle = video.title;

    playlistsRef.child(playlistName).child('videos').push({
        videoId: vid,
        defaultImg: vimg,
				videoTitle: vtitle
    });
  }

  console.log(titles);

	function searchTags() {
		$('.playlist-results').empty();
		returnedTags = [];
		playlistIds = [];
		playlistsRef.once('value').then(function(snapshot) {
			var tagSearch = $playlistSearch.val().trim()

			snapshot.forEach(function(childSnapshot) {
				var playlist = childSnapshot.val();
				var videos = playlist.videos;
				var tags = playlist.vtags;

				if(tags.indexOf(tagSearch) != -1) {
					console.log(true);
					var playlistId = childSnapshot.key;
					playlistIds.push(playlistId);
					console.log(playlistId);
					var title = playlist.vtitle;
					searchResultsTitle(title)
					returnedTags.push(tags);
					for(i in videos) {
						var defaultImg = videos[i].defaultImg;
						var videoId = videos[i].videoId;
						var videoTitle = videos[i].videoTitle;
						searchResultsList(defaultImg, videoTitle);
					}
					playlistCounter++
				}

			})
			$playlistSearch.val("");
		})
	}

	function loadBrowse() {
		// get the first 10 playlists
  playlistsRef.on('value', function(snapshot) {

    var counter = 0;
    var max = 10;


      snapshot.forEach(function(childSnapshot) {
				if(counter == max) return;

        // store videos obj
				var playlists = childSnapshot.val();
        var videos = playlists.videos;
				var title = playlists.vtitle;
				var playlistId = childSnapshot.key;
				console.log(playlistId);
				var tags = playlists.vtags;
				returnedTags.push(tags);
				playlistIds.push(playlistId);
				searchResultsTitle(title);
        for (k in videos) {
          var defaultImg = videos[k].defaultImg;
					var videoId = videos[k].videoId;
					var videoTitle = videos[k].videoTitle;
					searchResultsList(defaultImg);
        }

        counter++;
				playlistCounter++;
        console.log(counter);
			})


  });
	}

	/* -------------------------------------------
   * send email
   * ---------------------------------------- */

   function sendEmail(emailAddress, newPlaylist) {
    var sendToAddress = emailAddress;
    var playlistRef = playlistsRef.child('/'+newPlaylist+'/');

			playlistRef.on('value', function(snapshot) {
	      var playlist = snapshot.val();

				var playlistName = playlist.vtitle;
				var uri = "https://pure-harbor-98837.herokuapp.com/break/?breakid=" + newPlaylist
	      var defaultImages = [];
	      var videos = playlist.videos;
	      for(video in videos) {
	        if(videos.hasOwnProperty(video)) {
	          var vimg = videos[video].defaultImg;
						defaultImages.push(vimg);
	        }
				}

				//  temporarily disabled to avoid using up emails
		    //  -----------------------------------------------------------
		    //  emailjs.send('default_service', 'send_playlist', {
		    //    'to_email': sendToAddress,
		    //    'src1': defaultImages[0],
				// 	 'src2': defaultImages[1],
				// 	 'src3': defaultImages[2],
		    //    'uri_link': uri,
				// 	 'playlist_name': playlistName
		    //  }).then(
		    //   function(response) {
		    //     console.log("SUCCESS", response);
				// 		$('#js-email-success').removeClass('disable');
				// 		$('.playlist-review-send').css('opacity', '0.5');
				// 		setTimeout(function() {
				// 			reviewSendReset();
				// 		}, 5000);
		    //   },
		    //   function(error) {
		    //     console.log("FAILED", error);
		    //   })

				})
  }

	function forwardPlaylist() {
		var uri = window.location.href;
		var emailAddress = $('#js-forward-email-address').val();
		var validAddress = /[^@]+@[^@]+/.test(emailAddress);
		var playlistTitle = $('h3').html();
		var playlistId = uri.replace(/^[^=]*=/, "");
		console.log(playlistId);

		$('#message').empty();

		playlistsRef.child('/'+playlistId+'/').on('value', function(snapshot) {
			var playlist = snapshot.val();
			var videos = playlist.videos;
			var defaultImages = [];
			for(video in videos) {
				if(videos.hasOwnProperty(video)) {
					var vimg = videos[video].defaultImg;
					defaultImages.push(vimg);
				}
			}

			if(!validAddress) {
				$('#message').append('<h5><em>Oops! That\'s not a valid email address.</em></h5>');
				return false;
			} else {
				console.log(emailAddress);
				console.log(defaultImages);
				console.log(uri);
				// console.log(playlistTitle);
				// email.js('default_service', 'send_playlist', {
				// 	'to_email': emailAddress,
				// 	'src1': defaultImages[0],
				// 	'src2': defaultImages[1],
				// 	'src3': defaultImages[2],
				// 	'uri_link': uri,
				// 	'playlist_name': playlistTitle
				// }).then(
				// 	function(response) {
				// 		console.log("SUCCESS", respnse);
				// 		$('#message').append('<h5><em>Sent!</em></h5>');
				// 		$('#js-forward-email-address').val("");
				// 		setTimeout(function() {
				// 			$('#message').empty()
				// 		}, 2000);
				// 	}
				// )
			}
		})

	}

	function reviewSendReset() {
		titles = [];
		$('#js-user-tags, #js-video-list').empty();
		$('#js-playlist-name, #js-email-address').val("");
		$('#js-email-success').addClass('disable');
		$('.playlist-review-send').css('opacity', '1').addClass('disable');
		$('.search-yt').removeClass('opacity');
		$('.yt-results, #js-selected-list').empty();
		$('#js-view-new-playlist').addClass('disabled');
	}

})();
