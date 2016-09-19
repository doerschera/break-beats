
function search(searchTerm) {
  var searchQuerey = " https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&q="+searchTerm+"&type=video&key=AIzaSyDIE0dd7hZ5j4vQRtwrU0CwQLGq-lhXWCc";

  $.ajax({
    url: searchQuerey,
    method: 'GET'
  }).done(function(response) {


    for(var i = 0; i < 10; i++) {
      var videoId = response.items[i].id.videoId;
      var src = 'https://www.youtube.com/watch?v='+videoId;
      console.log(videoId);
      $('<div>');
      $('<div>', {
        id: 'video1',
      }).appendTo('#results');
    }
  })
}


// var searchTerm = $('#search-input').val();

$('#submit').on('click', function() {
  var searchTerm = $('#search-input').val().replace(/ /g, '+');

  search(searchTerm);

  return false;
})

// <iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%3A33Q6ldVXuJyQmqs8BmAa0k" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>
