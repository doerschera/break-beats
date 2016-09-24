(function(){
      emailjs.init("user_xrCuLVJF1XPydVeSaCraO");
   })();

   $('#send').click(function() {
     console.log('click');
     var sendTo = $('#email').val().trim();
     console.log(sendTo);
     emailjs.send('default_service', 'template_SqsgoQdI', {
       'to_email': sendTo,
       'reply_to': 'breakbeatsapp@gmail.com',
       'message_html': "<h1>Hello World!</h1>"
     }).then(
      function(response) {
        console.log("SUCCESS", response);
      },
      function(error) {
        console.log("FAILED", error);
      }
      );
   })
