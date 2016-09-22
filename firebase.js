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

  // mailjs init
  (function(){
        emailjs.init("user_xrCuLVJF1XPydVeSaCraO");
     })();

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
          var defaultImg = response.items[i].snippet.thumbnails.default.url;
          console.log(videoId);
          var wrapperDiv = $('<div>');
          $(wrapperDiv).addClass('playerWrapper');
          $(wrapperDiv).attr('data-id', videoId);
          $(wrapperDiv).attr('data-img', defaultImg);
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
      var selectedVideoImg = $(this).attr('data-img');
      console.log(selectedVideoId);
      firebase.database().ref('/playlists/'+playlistName+'/'+selectedVideoCounter).update({
        videoId: selectedVideoId,
        defaultImg: selectedVideoImg
      });
      selectedVideoCounter++
    })
  })

  $('#send').click(function() {
    firebase.database().ref('/playlists/'+playlistName)
    .once('value').then(function(snapshot) {
      var src1 = snapshot.child('0').child('defaultImg').val();
      var src2 = snapshot.child('1').child('defaultImg').val();
      var src3 = snapshot.child('2').child('defaultImg').val();

      var videoId1 = snapshot.child('0').child('videoId').val();
      var videoId2 = snapshot.child('1').child('videoId').val();
      var videoId3 = snapshot.child('2').child('videoId').val();

      console.log('click');
      var sendTo = $('#email').val().trim();
      console.log(sendTo);
      emailjs.send('default_service', 'send_playlist', {
        'to_email': sendTo,
        'src1': src1,
        'src2': src2,
        'src3': src3
      }).then(
       function(response) {
         console.log("SUCCESS", response);
       },
       function(error) {
         console.log("FAILED", error);
       }
       );
    })
  })


})
