var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");

// Require  NPMs
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// Twitter authentication
var twitterAuth = keys.twitterKeys;
var twitter = new Twitter(twitterAuth);

// Spotify authentication
var spotifyAuth = keys.spotifyKeys;
var spotify = new Spotify(spotifyAuth);

// Omdb authentication
var omdbAuth = '40e9cece';

// User input values
var command = process.argv[2];
var value = "";
// Build string with no '+' at the end
if (process.argv[4] === undefined) {
    value = process.argv[3];
} else {
    for (var i = 3; i < process.argv.length - 1; i++) {
        value += process.argv[i] + "+";
    };
    value += process.argv[process.argv.length - 1];
}
console.log('Value: ',value)

// Twitter query parameters
var twitterParams = {
    'screen_name': 'SevenLionsMusic',
    'count': 20
};

// Spotify query parameters
var spotifyParams = {
    type: 'track',
    query: value,
    limit: 1
}

// Movies query parameters

// Defining commands
if (command === "my-tweets" || command === "spotify-this-song" || command === "movie-this" || command === "do-what-it-says") {
    switch (command) {
        case "my-tweets":
            twitterSearch();
            break
        case "spotify-this-song":
            spotifySearch();
            break
        case "movie-this":
            movieSearch();
            break
        case "do-what-it-says":
            break
    }
} else {
    console.log("Please enter a valid command")
};

// Tweet command output
function twitterSearch() {
    fs.appendFile('log.txt', '\n****** \nCommand: ' + command + '\n\n');
    twitter.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
        if (!error && response.statusCode === 200) {
            var tweetCounter = 0;
            tweets.forEach(function(element){
                tweetCounter ++;
                fs.appendFile('log.txt', tweetCounter + ". " + element.text + "\n\n", function(err) {
                // If an error was experienced we say it.
                    if (err) {
                        console.log(err);
                    }
                    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                    // else {
                    //  console.log("Content Added");
                    // };
                });
                console.log(tweetCounter + ". " + element.text);
            });
             
            // console.log(tweets.text);
        } else {
            console.log(error)
        };
    });
};

// Spotify command output
function spotifySearch() {
    fs.appendFile('log.txt', '\n****** \nCommand: ' + command + '\nSong: ' + value + '\n\n');
    if (value === undefined || value === "") {
        spotifyParams.query = "The Sign Ace of Base";
    }
    spotify.search(spotifyParams, function(error, data) {
        if (!error) {
            var song = data.tracks.items[0];
            var songArtists = "";
            for (var i = 0; i < song.album.artists.length; i++) {
                songArtists += song.album.artists[i].name + ", "
            }
            songArtists = songArtists.slice(0, -2);
            console.log("Artist(s): " + songArtists);
            console.log("Song name: " + song.name);
            console.log("Album name: " + song.album.name);
            console.log("Preview URL: " + song.preview_url);
            // Append to log.txt
            var logElement = 'Artist(s): ' + songArtists + '\nSong name: ' + song.name + '\nAlbum name: ' + song.album.name 
                           + '\nPreview URL: ' + song.preview_url;
            fs.appendFile('log.txt', logElement + '\n\n');
        } else {
            console.log(error);
        };
    });
};

// Movies command output
function movieSearch() {
    var query = value;
    fs.appendFile('log.txt', '\n****** \nCommand: ' + command + '\nMovie: ' + value + '\n\n');
    if (value === undefined || value === "") {
        query = "Mr. Nobody";
    }
    request('http://www.omdbapi.com/?apikey=' + omdbAuth + '&t=' + query, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body)
            console.log('Title:', data.Title);
            console.log('Year:', data.Year);
            console.log('IMDB Rating:', data.imdbRating);
            console.log('Rotten Tomatoes Rating:', data.Ratings[1].Value);
            console.log('Country:', data.Country);
            console.log('Language:', data.Language);
            console.log('Plot:', data.Plot);
            console.log('Actors:', data.Actors);
            var logElement = 'Title: ' + data.Title + '\nYear: ' + data.Year + '\nIMDB Rating: ' + data.imdbRating 
                    + '\nRotten Tomatoes Rating: ' + data.Ratings[1].Value + '\nCountry: ' + data.Country
                    + '\nLanguage: ' + data.Language + '\nPlot: ' + data.Language + '\nActors: ' + data.Actors;
            fs.appendFile('log.txt', logElement + '\n\n');
        } else {
            console.log(error);
        }
    });
};





