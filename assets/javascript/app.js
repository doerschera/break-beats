var BB = (function() {

<<<<<<< HEAD
=======
// Initialize Firebase
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








>>>>>>> a1e7ce72f4a74c1870d592250568f915e3f54254
  // cache DOM
  var $submitButton = $('#submit'),
      $videosContainer = $('#player'),
      $listContainer = $('.Selected-list'),
      $searchInput = $('#search-input'),
<<<<<<< HEAD
=======
      $saveButton = $('.save-playlist'),
      $playlistName = $('.playlist-name'),
>>>>>>> a1e7ce72f4a74c1870d592250568f915e3f54254
      query,
      searchTerm,
      videoId,
      titles = [],
      checkedBoxes,
      maxResults = 5,
      paginationData;

// render
  function renderVideos(video) {
    $videosContainer.append(video);
  }
  function renderSelectedTitles(titles) {
    $listContainer.html('');
    for(var i = 0; i < titles.length; i++) {
<<<<<<< HEAD
      $listContainer.append('<h3>'+ titles[i] +'<h3>');
=======
      $listContainer.append('<h3>'+ titles[i].title +'<h3>');
>>>>>>> a1e7ce72f4a74c1870d592250568f915e3f54254
    }
    
  }


// bind events
  $submitButton.on('click', doSearch);
<<<<<<< HEAD
=======
  $saveButton.on('click', getTitle);

>>>>>>> a1e7ce72f4a74c1870d592250568f915e3f54254


// search function
  function doSearch() {
    searchTerm = $searchInput.val().replace(/ /g, '+');
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
    var videoContainer = $('<div>').addClass('Video-container');
    var video = $('<iframe />', {
      class: 'Video-iframe Video-iframe--loading',
      width: '400',
      height: '225',
      src: 'https://www.youtube.com/embed/'+item.id.videoId+'?rel=0',
      frameborder: '0'
    });
    // var checkbox = '<label class="checkbox" for="' + videoId + '"><input type="checkbox" checked="checked" value="" id="' + videoId + '" data-toggle="checkbox" class="custom-checkbox"><span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span></label>';
<<<<<<< HEAD
    var checkbox = '<input type="checkbox" class="checkbox" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" class="checkbox" />';
=======
    var checkbox = '<input type="checkbox" class="checkbox" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" data-image="' + item.snippet.thumbnails.default.url + '" class="checkbox" />';
>>>>>>> a1e7ce72f4a74c1870d592250568f915e3f54254
    videoContainer.append(video).append(checkbox);
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
<<<<<<< HEAD
    console.log(results[2].replace(/\+/g, " "));
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // usage:
  // $('.show-videos').html(getURIParameter('breakid'));
=======
    var playlistId = results[2].replace(/\+/g, " ");
    return decodeURIComponent(atob(playlistId));
  }

  // usage:
  $('.show-videos').html(getURIParameter('breakid'));
>>>>>>> a1e7ce72f4a74c1870d592250568f915e3f54254




  $(document).on('change', '.checkbox', addVideoToPlaylist);

  function addVideoToPlaylist() {
    if ( $(this).is(":checked") ) {
<<<<<<< HEAD
        videoTitle = $(this).data('title');
        titles.push(videoTitle);
        renderSelectedTitles(titles);
        disableSelectionIfPlaylistFull();
        // $(this).attr("checked", returnVal);
    } else {
      videoTitle = $(this).data('title');
      var index = titles.indexOf(videoTitle);
      if (index > -1) {
        titles.splice(index, 1);
        renderSelectedTitles(titles);
      }
=======
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
>>>>>>> a1e7ce72f4a74c1870d592250568f915e3f54254
      enableSelection();
    }
  }

  function disableSelectionIfPlaylistFull() {
    checkedBoxes = $(document).find('.checkbox');
    if ( titles.length > 2 ) {
      for(var i = 0; i < checkedBoxes.length; i++) {
        if( checkedBoxes[i].checked == false) {
          checkedBoxes[i].disabled = true;
        }
      }
    }
  }

  function enableSelection() {
    checkedBoxes = $(document).find('.checkbox');
    for(var i = 0; i < checkedBoxes.length; i++) {
      if( checkedBoxes[i].disabled == true) {
        checkedBoxes[i].disabled = false;
      }
    }
        

  }


<<<<<<< HEAD
=======





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
        defaultImg: vimg
    });
    
    
  }


>>>>>>> a1e7ce72f4a74c1870d592250568f915e3f54254
  console.log(titles);


})();
