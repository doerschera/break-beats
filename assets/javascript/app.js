var BB = (function() {

  // cache DOM
  var $submitButton = $('#submit'),
      $videosContainer = $('#player'),
      $listContainer = $('.Selected-list'),
      $searchInput = $('#search-input'),
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
      $listContainer.append('<h3>'+ titles[i] +'<h3>');
    }
    
  }


// bind events
  $submitButton.on('click', doSearch);


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
    var checkbox = '<input type="checkbox" class="checkbox" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" class="checkbox" />';
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
    console.log(results[2].replace(/\+/g, " "));
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // usage:
  // $('.show-videos').html(getURIParameter('breakid'));




  $(document).on('change', '.checkbox', addVideoToPlaylist);

  function addVideoToPlaylist() {
    if ( $(this).is(":checked") ) {
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


  console.log(titles);


})();
