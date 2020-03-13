var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js'));

class structured_tweet {
    constructor(creation, text, hashtags, coordinates) {
        this.created_at = creation
        this.text = text
        this.hashtags = hashtags
        this.coordinates = coordinates
    }
}

var T = new Twit(config);


var stream = T.stream('statuses/sample', {language: 'en'});

stream.on('tweet', function (tweet) {
    var tmp = JSON.stringify(tweet)
    var obj = JSON.parse(tmp)
    if (obj.entities.hashtags.length != 0){
        var hashtags = []
        for (tags in obj.entities.hashtags) {
            hashtags.push(obj.entities.hashtags[tags].text)
        }
        if (obj.place != null) {
            if(obj.place.bounding_box.coordinates != null){
                var coordinates = []
                for (coords in obj.place.bounding_box.coordinates) {
                    for (coord in obj.place.bounding_box.coordinates[coords]){
                        coordinates.push(obj.place.bounding_box.coordinates[coords][coord])
                    }
                }
                var res = new structured_tweet(obj.created_at, obj.text, hashtags, coordinates)
                fs.appendFile('all_tweets.json',JSON.stringify(res) + '\n');
                fs.appendFile('filtered_tweets.json',JSON.stringify(res) + '\n');
            }
        } else {
            var res = new structured_tweet(obj.created_at, obj.text, hashtags, obj.place)
            fs.appendFile('all_tweets.json',JSON.stringify(res) + '\n');
        }
    }
})
