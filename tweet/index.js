module.exports = function (context, myBlob) {
    context.log("Node.js blob trigger function started");
    
    var phone = context.bindingData.phone;
    var text = context.bindingData.text;
    var ext = context.bindingData.ext;
    var fileName = text + "-" + phone + "." + ext;

    context.log("Working with " + fileName);

    if (myBlob instanceof Buffer) {
        context.log("myBlob is a Buffer");
    }
    else {
        context.log("myBlob is not a Buffer");
    }

    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key: 'jfZ2SH51lrZvLnMFAzkiCpy6m',
        consumer_secret: 'EMmxNiMljAKQCS4xg9StZN5IKa9CoFeOz4dZbvaGrjfphKc2Iw',
        access_token_key: '6543672-TXOxUNLBFlEEBA6js0jjGdL8UkMYroUVbQRtZoKo4B',
        access_token_secret: 'x8LYi7QcB0santBYoH28Vk9KDfkr6P3BXx9MWcvQiz6aU'
    });

    // Make post request on media endpoint. Pass file data as media parameter
    client.post('media/upload', {media: myBlob}, function(error, media, response) {
      if (!error) {

        // If successful, a media object will be returned.
        console.log(media);

        // Lets tweet it
        var status = {
          status: 'I am a tweet from Azure Functions Blob Storage Trigger',
          media_ids: media.media_id_string // Pass the media id string
        }

        client.post('statuses/update', status, function(error, tweet, response) {
          if (!error) {
            console.log(tweet);
          }
        });
      }
      else {
          context.log("Err tweeting blob: " + error);
      }
    });
    
    context.done();
};