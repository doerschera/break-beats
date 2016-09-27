var BB = (function() {

  /* -------------------------------------------
   * firebase init
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
// create a reference to the 'playlists' child inside db
  var playlistsRef = dbRef.child('playlists');
// create a reference to the 'tags' child
  var tagsRef = dbRef.child('tags');


  /* -------------------------------------------
   * email init
   * ---------------------------------------- */

  emailjs.init("user_xrCuLVJF1XPydVeSaCraO");






  // cache DOM
  var $searchButton     = $('.js-search-videos'),
      $videosContainer  = $('.Videos-container'),
      $listContainer    = $('.Selected-list'),
      $searchInput      = $('.js-search-input'),
      $saveButton       = $('.js-save-playlist'),
      $playlistTitle    = $('.js-playlist-title'),
      $emailAddress     = $('.js-email'),
      $clearButton      = $('.js-clear-results'),
      $tagsSelect       = $('.js-tags-select'),
      query,
      searchTerm,
      videoId,
      titles = [],
      checkedBoxes,
      maxResults = 25,
      paginationData,
      playlistId;


// render
  function renderVideos(video) {
    $videosContainer.prepend(video);
  }
  function renderSelectedTitles(titles) {
    $listContainer.html('');
    for(var i = 0; i < titles.length; i++) {
      $listContainer.append('<h6>'+ titles[i].title +'<h6>');
    }

  }



// bind events
  $searchButton.on('click', doSearch);
  $saveButton.on('click', getPlaylistTitle);
  $(document).on('change', '.checkbox', addVideoToPlaylist);
  $clearButton.on('click', clearAllResults);




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
      for(var i = 0; i < data.items.length; i++) {
        createImage(data.items[i]);
      }
    });
  }


  function clearAllResults() {
    $videosContainer.empty();
    return false;
  }


  /* -------------------------------------------
   * create iframe function from data
   * ---------------------------------------- */

  function createIframe(item) {
    var videoContainer = $('<div>').addClass('Video-container grid-flex-cell-1of2');
    var video = $('<iframe />', {
      class: 'Video-iframe Video-iframe--loading',
      width: '400',
      height: '225',
      src: 'https://www.youtube.com/embed/'+item.id.videoId+'?rel=0',
      frameborder: '0'
    });
    // var checkbox = '<label class="checkbox" for="' + videoId + '"><input type="checkbox" checked="checked" value="" id="' + videoId + '" data-toggle="checkbox" class="custom-checkbox"><span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span></label>';
    var checkbox = '<input type="checkbox" class="checkbox" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" data-image="' + item.snippet.thumbnails.default.url + '" class="checkbox" />';
    videoContainer.append(video).append(checkbox);
    renderVideos(videoContainer);
  }






  /* -------------------------------------------
   * create iframe function from data
   * ---------------------------------------- */

  function createImage(item) {
    var imgContainer = $('<div>').addClass('Image-container grid-flex-cell-1of2');
    var title = '<h5>' + item.snippet.title + '</h5>'
    var image = $('<img>', {
      class: 'Image',
      width: '400',
      height: '225',
      src: item.snippet.thumbnails.default.url
    });
    var checkbox = '<input type="checkbox" class="checkbox" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" data-image="' + item.snippet.thumbnails.default.url + '" class="checkbox" />';
    imgContainer.prepend(title).append(image).append(checkbox);
    renderVideos(imgContainer);
  }





  /* -------------------------------------------
   * checkboxes
   * ---------------------------------------- */

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





  /* -------------------------------------------
   * tags
   * ---------------------------------------- */

  $tagsSelect.select2({
     tags: true
  });


// add tags to tag select
  tagsRef.on('value', function(snapshot) {
    var tag = snapshot.val();

    for(var i in tag) {
      $tagsSelect.append($('<option>', {
        value: i,
        text : i
      }));
    }

  });





  /* -------------------------------------------
   * firebase integration
   * ---------------------------------------- */


  function getPlaylistTitle() {
    var playlistTitle = $playlistTitle.val().trim();
    var tags = $tagsSelect.val();

    var newPlaylist = playlistsRef.push().key;
    playlistsRef.child('/'+newPlaylist+'/').update(
      {
        'vtitle': playlistTitle,
        'vtags': tags
      });

    for(i = 0; i < titles.length; i++) {
      saveToFirebase(newPlaylist, titles[i]);
    }

    var emailAddress = $emailAddress.val().trim();
    sendEmail(emailAddress, newPlaylist);


    // global tag array
    for(i = 0; i < tags.length; i++) {
      tagsRef.child('/'+tags[i]+'/').set({
        'tags': 'tag'
      });
    }


    return false;
  }

  function saveToFirebase(newPlaylist, video) {
    vid = video.videoId;
    vimg = video.image;
    playlistsRef.child('/'+newPlaylist+'/').child('videos').push({
        videoId: vid,
        defaultImg: vimg
    });

    // send to done screen; the playlist key is newPlaylist
  }









  /* -------------------------------------------
   * send email
   * ---------------------------------------- */

   function sendEmail(emailAddress, newPlaylist) {
    var sendToAddress = emailAddress;

    var html = '';

    var playlistRef = playlistsRef.child('/'+newPlaylist+'/');
    playlistRef.on('value', function(snapshot) {
      var playlist = snapshot.val();

      html = '<h1>' + playlist.vtitle + '</h1>';
      var videos = playlist.videos;
      for(video in videos) {
        if(videos.hasOwnProperty(video)) {
          var vimg = videos[video].defaultImg;
          html += '<a href="https://afternoon-falls-60599.herokuapp.com/break/?breakid=' + newPlaylist + '"><img src="' + vimg + '" alt="" /></a><br>';
        }
      }

      html += '<p><a href="https://afternoon-falls-60599.herokuapp.com/break/?breakid=' + newPlaylist + '">click here to listen!</a></p>';

    });


     // temporarily disabled to avoid using up emails
     // -----------------------------------------------------------
     // emailjs.send('default_service', 'template_SqsgoQdI', {
     //   'to_email': sendToAddress,
     //   'reply_to': 'breakbeatsapp@gmail.com',
     //   'message_html': html
     // }).then(
     //  function(response) {
     //    console.log("SUCCESS", response);
     //  },
     //  function(error) {
     //    console.log("FAILED", error);
     //  }
     //  );
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
      $videosContainer.html('<h1>' + playlists[playlistId].vtitle + '</h1>');
      var videos =playlists[playlistId].videos;
      for(video in videos) {
        if(videos.hasOwnProperty(video)) {
          var vid = videos[video].videoId;
          $videosContainer.append('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + vid + '?rel=0" frameborder="0" allowfullscreen></iframe>');
        }
      }
    }

  });














})();
