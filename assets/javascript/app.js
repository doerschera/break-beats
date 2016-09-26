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
	  console.log(playlistsRef);

	  playlistsRef.on('value', function(snapshot) {
	    var playlists = snapshot.val();
	    for(var playlist in playlists) {
	      console.log(atob(playlist));
	    }
	  });

	/*--------------------------------------------
	 * Initialize materialize chips
	 * ---------------------------------------- */

	//  $('#js-user-tags').material_chip();

	/* -------------------------------------------
	 * Bild DOM
	 * ---------------------------------------- */

  // cache DOM
  var $createPlaylist = $('#js-create-playlist'),
			$ytSearch = $('#js-yt-search-button'),
      $videosContainer = $('.yt-results'),
      $listContainer = $('#js-selected-list'),
			$landingSearch = $('#js-landing-search'),
      $ytSearchInput = $('#js-yt-search'),
			$viewNewPlaylist = $('#js-view-new-playlist'),
      $saveButton = $('.save-playlist'),
			$sendButton = $('#js-send-email'),
      $playlistName = $('#js-playlist-name'),
			$playlistVideoContainer = $('#js-video-list'),
			$newTags = $('#js-user-tags'),
			$addTag = $('#js-add-tag-button'),
			$removeTag = $('.chip'),
			$close = $('#js-close-send-review'),
      query,
      searchTerm,
      videoId,
      titles = [],
			userTags = [],
      checkedBoxes,
      maxResults = 10,
      paginationData;

	// render DOM
	  function renderVideos(video) {
	    $videosContainer.append(video);
	  }
	  function renderSelectedTitles(titles) {
	    $listContainer.html('');
	    for(var i = 0; i < titles.length; i++) {

	      $listContainer.append('<li>'+ titles[i].title +'<li>');
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
				$wrapperDiv.append('<img class="col s3" src='+image+' />');
				$wrapperDiv.append('<p class="flow-text col s9">'+title+'</p>');
				$li.append($wrapperDiv);
				$playlistVideoContainer.append($li);

			}
		}

	// DOM show/hide
		function hideLanding(pageToShow) {
			$('.landing-page').addClass('disable');
			$(pageToShow).removeClass('disable');
		}
		function reviewAndSend() {
			$('.search-yt').addClass('opacity');
			$('.playlist-review-send').removeClass('disable');
		}
		function closeReviewSend() {
			$('.playlist-review-send').addClass('disable');
			$('.search-yt').removeClass('opacity');
		}

	// bind events
	  $ytSearch.on('click', doSearch);
		$sendButton.on('click', getTitle);
	  $saveButton.on('click', getTitle);
		$createPlaylist.on('click', function() {
			hideLanding('.search-yt');
		});
		$landingSearch.on('click', function() {
			hideLanding('.search-playlists');
		});
		$viewNewPlaylist.on('click', function() {
			reviewAndSend();
			renderNewPlaylist();
		});
		$addTag.on('click', addTag);
		$(document).on('click', '.remove-tag', removeTag);
		$close.on('click', closeReviewSend);




	// search function
	  function doSearch() {
	    searchTerm = $ytSearchInput.val().replace(/ /g, '+');
	    query = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=' + maxResults + '&order=viewCount&q="' + searchTerm + '"&type=video&key=AIzaSyDIE0dd7hZ5j4vQRtwrU0CwQLGq-lhXWCc';
	    getDatafromAPI(query);
	    return false;
	  }

	  function getDatafromAPI(query) {
	    $.ajax({
	      url: query,
	      method: 'GET'
	    }).done( data => {
	      // videoId = data[0].id.videoId;
	      console.log(data.items);
	      for(var i = 0; i < data.items.length; i++) {
	        createIframe(data.items[i]);
	      }
	    });
	  }

	// create iframe fucntion from data
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
    return decodeURIComponent(atob(playlistId));
  }

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


  function getTitle() {
    var playlistName = btoa($playlistName.val().trim());
    for(i = 0; i < titles.length; i++) {
      saveToFirebase(playlistName, titles[i]);
    }
    return false;
  }

	function addTag() {
		var newTag = $('#js-add-tags').val().trim();
		var newChip =$('<div class="chip">'+newTag+'</div>');
		var iTag = $('<i class="close material-icons remove-tag">close</i>');
		newChip.append(iTag);
		$('#js-user-tags').append(newChip);

		userTags.push(newTag);
		console.log(userTags);
	}

	function removeTag() {
		var tag = $(this).parent().text();
		tag = tag.replace(/close/i, "");
		var index = userTags.indexOf(tag);
		userTags.splice(index, 1);
		console.log(userTags);
	}

  function saveToFirebase(playlistName, video) {
    // add to firebase
    // firebase.database().ref('/playlists/'+playlistName).update({
    //   videoId: selectedVideoId,
    //   defaultImg: selectedVideoImg
    // });
    vid = video.videoId;
    vimg = video.image;
    playlistsRef.child(playlistName).push({
        videoId: vid,
        defaultImg: vimg,
				tags: userTags
    });
  }

  console.log(titles);


})();
