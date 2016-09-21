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

  // Global vars
  var playlistName;
  var selectedVideoCounter = 0;

  $('#search').on('click', function() {
    var searchTerm = $('#searchField').val().trim();
    var qUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&q="+searchTerm+"&type=video&key=AIzaSyDIE0dd7hZ5j4vQRtwrU0CwQLGq-lhXWCc"


    $.ajax({
      url: qUrl,
      method: 'GET'
    }).done(function(response) {
        for(var i = 0; i < 10; i++) {
          var videoId = response.items[i].id.videoId;
          var src = "https://www.youtube.com/embed/"+videoId;
          console.log(videoId);
          var wrapperDiv = $('<div>');
          $(wrapperDiv).addClass('playerWrapper');
          $(wrapperDiv).attr('data-id', videoId);
          $('<iframe />');
          $('<iframe />', {
            id: 'video1',
            width: '320',
            height: '195',
            src: src,
            frameborder: '0',
          }).appendTo(wrapperDiv);
          $('.results').append(wrapperDiv);

        }
    })

    $('#submit').on('click', function() {
      playlistName = $('#playlistName').val().trim();
    })

    $(document).on('click', '.playerWrapper', function() {
      $(this).css('border', 'solid 2px green');
      var selectedVideoId = $(this).attr('data-id');
      console.log(selectedVideoId);
      firebase.database().ref('/playlists/'+playlistName+'/'+selectedVideoCounter).update({videoId: selectedVideoId});
      selectedVideoCounter++
    })
  })

})
