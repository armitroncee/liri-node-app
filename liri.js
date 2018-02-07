var keyWord = process.argv[2];
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require("./keys.js");
var consumerKey = keys.twitterKeys.consumer_key;
var consumerSecret = keys.twitterKeys.consumer_secret;
var accessToken = keys.twitterKeys.access_token_key;
var accessTokenSecret = keys.twitterKeys.access_token_secret;
var client = new Twitter({
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
  access_token_key: accessToken,
  access_token_secret: accessTokenSecret
});
var spotifyConsumerKey = keys.spotifyKeys.id;
var spotifySecretKey = keys.spotifyKeys.secret;
var spotifyClient = new Spotify({
  id: spotifyConsumerKey,
  secret: spotifySecretKey
});
var songName = "";
var request = require("request");
var fs = require("fs");


switch (keyWord) {
  case "my-tweets":
    tweet();
    break;

  case "spotify-this-song":
    spotify();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    runRandom();
    break;
}

function tweet() {
  var params = {screen_name: 'BootcampCJR', count: 20 };
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for (var i = 0; i < tweets.length; i++) {
    console.log('\n-----------------\n' + tweets[i].text + '\n' + tweets[i].created_at);
    }
  } else {
    console.log(error)
  }
});
}

function spotify() {
    var cmdArg = process.argv;
    for (i=3;i<cmdArg.length;i++){
      songName = songName + " " + cmdArg[i]
      // console.log(songName)
    }

    if (songName === "") {
      songName = "The Sign Ace of Base"
      // console.log(songName);
    }

  spotifyClient.search({ type: 'track', query: songName, limit: 1}, function(err, data) {
    var songInfo = data.tracks.items[0]
  if (err) {
    return console.log('Error occurred: ' + err);
  } else {
    console.log("--------------------------------------------------------------------------")
    console.log("\nSong Artist: " + songInfo.artists[0].name)
    console.log("\nSong Name: " + songInfo.name)
    if (songInfo.preview_url === null) {
      console.log("\nThere is no preview URL")
    } else {
      console.log("\nPreview URL: " + songInfo.preview_url)
    }
    console.log("\nAlbum: " + songInfo.album.name)
    console.log("\n-------------------------------------------------------------------------")
    }
  });
}

function movie() {
  var nodeArgs = process.argv;
  var movieName = "";
  for (i = 3; i < nodeArgs.length; i++) {
    movieName = movieName + "+" + nodeArgs[i];
  }
  if (movieName === "") {
    movieName = "Mr. Nobody"
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  // console.log(queryUrl)
  request(queryUrl, function(error, response, body) {
    if(error) {
      console.log("The error is " + error)
    } else {
      // console.log(JSON.parse(body))
      console.log("\n---------------------------------------------")
      console.log("\nMovie Title: " + JSON.parse(body).Title)
      console.log("\nYear Released: " + JSON.parse(body).Year)
      console.log("\nIMDB Rating: " + JSON.parse(body).imdbRating)
      if (JSON.parse(body).tomatoRating === "N/A") {
      console.log("\nThere is no Rotten Tomatoes Rating for this movie")
    } else {
      console.log("\nRotten Tomatoes Rating: " + JSON.parse(body).tomatoRating)
      }
      console.log("\nCountry produced: " + JSON.parse(body).Country)
      console.log("\nLanguage: " + JSON.parse(body).Language)
      console.log("\nPlot: " + JSON.parse(body).Plot)
      console.log("\nActors: " + JSON.parse(body).Actors)
      console.log("\n---------------------------------------------")
    }
  })
}

function runRandom() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var commandArray = data.split(",");
    var command  = commandArray[0];
    songName = commandArray[1];
    if (command === "spotify-this-song") {
      spotify()
    }
  })
}
