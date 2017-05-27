//Use Ben key 40e9cece for OMDB

//require needed library

var spotify = require('spotify');
var twitter = require('twitter');
var request = require('request');
var fs = require('fs');

var keys = require('./keys.js');

//getting what user want to do

if (process.argv[2] === 'my-tweets') {

  getTweets();

}
else if (process.argv[2] === 'spotify-this-song') {

  var title = '';

  for(var i = 3;i<process.argv.length;i++) {

    title += process.argv[i] + " ";

  }
  title = title.replace(/\s$/, '');
  if (title == '') {
    title = 'The Sign Ace of base';
  }
  getSongInfo(title);

}
else if (process.argv[2] === 'movie-this') {

  var title = '';

  for(var i = 3;i<process.argv.length;i++) {

    title += process.argv[i] + "+";

  }

  //if title movie is empty

  if (title == '') {

    title = 'Mr.+Nobody';

    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!\n");

    writeToFile("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/\n");
    writeToFile("It's on Netflix!\n");
  }
  else {
    title = title.replace(/\+$/, '');
  }

  getMovieInfo(title);

}
else if (process.argv[2] === 'do-what-it-says') {

  readFile();

}
else {

  console.log("Sorry, i'm not Siri, i'm just Liri!");
  writeToFile("Sorry, i'm not Siri, i'm just Liri!\n");

}

//getTweets(keys);
//getSongInfo('The Sign');
//getMovieInfo("the+departed");
//readFile();

//function to get movie information from omdb

function getMovieInfo(movieTitle) {

  var url = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + movieTitle ;
  //var url = encodeURI(ref);
  //console.log(url);
  request(url, function (error, response, body) {

    if (error || response.statusCode != 200) {
      console.log("Sorry, cannot get information for the movie");
      writeToFile("Sorry, cannot get information for the movie\n");
      return;
    }

    var bodyObj = JSON.parse(body);
    
    var title = bodyObj.Title;
    var release_year = bodyObj.Year;
    var imdb_rating = bodyObj.imdbRating;
    var rotten = '';
    
    for (var i =0;i<bodyObj.Ratings.length;i++) {
      if (bodyObj.Ratings[i].Source = 'Rotten Tomatoes') {
        
        rotten = bodyObj.Ratings[i].Value;
      }
    }
    var country = bodyObj.Country;
    var language = bodyObj.Language;
    var plot = bodyObj.Plot;
    var actors = bodyObj.Actors;
    
    console.log("Movie title: " + title + "\nIMDB Rating: "+imdb_rating+"\nRotten Tomatoes Rating: "+rotten +
    
              "\nActors: " + actors + "\nCountry: " + country + "\nLanguage: " + language + 
              "\nPlot: " + plot + "\nYear Released: " + release_year);
    console.log('----------------------------------------------------');

    writeToFile("Movie title: " + title + "\nIMDB Rating: "+imdb_rating+"\nRotten Tomatoes Rating: "+rotten +
    
              "\nActors: " + actors + "\nCountry: " + country + "\nLanguage: " + language + 
              "\nPlot: " + plot + "\nYear Released: " + release_year + "\n");
    writeToFile("----------------------------------------------------\n");
    

  });

}
//function to get song information from Spotify

function getSongInfo(songName) {

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if ( err ) {
        console.log('Sorry, cannot get information for this song' + songName);
        writeToFile('Sorry, cannot get information for this song' + songName + "\n");
        return;
    }

    var items = data.tracks.items;

    for (var i=0;i<items.length;i++) {

      var preview_url = items[i].preview_url;
      var song_name = items[i].name;
      var album_name = items[i].album.name;

      
      var artist_list = '';

      for (var j =0; j< items[i].artists.length;j++) {

        artist_list +=  items[i].artists[j].name + ',';

      }

      artist_list = artist_list.replace(/,$/, '');

      console.log("Song title: " + song_name + "\nAlbum title: " + album_name + "\nArtist: " + artist_list);
      console.log('--------------------------------');

      writeToFile("Song title: " + song_name + "\nAlbum title: " + album_name + "\nArtist: " + artist_list +"\n");
      writeToFile("--------------------------------\n");
      
    }

  });

}

//get tweets
function getTweets() {

  var client = new twitter({

    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret

  });

  var params = {screen_name:'@jimmiinguyen1',count:20};
  client.get('statuses/user_timeline', params,function(error, tweets, response) {

    if (error) {
      console.log('Sorry, i cannot get your tweets!' + "\n");
      writeToFile("Sorry, i cannot get your tweets!\n");
    } 
    else {

      for (var i =0;i<tweets.length;i++) {
        
        var created_at = tweets[i].created_at;
        var text = tweets[i].text;
        console.log("Created at: " + created_at + "\nMessage:" + text + "\n");
        console.log('------------------------');

        writeToFile("Created at: " + created_at + "\nMessage:" + text + "\n")
      }

    }
   
  });

}
//read random.txt file.

function readFile () {

  var file = './random.txt';

  fs.readFile(file, "utf8", function(err,data) {

      // If the code experiences any errors it will log the error to the console.
          if (err) {
              writeToFile("Sorry, cannot read random.txt file!");
              return console.log("Sorry, cannot read random.txt file!");
              
          }
          var dataArray = data.split(',');

          var question = dataArray[0];
          var param = dataArray[1];

          if (question === 'my-tweets') {
            
            getTweets();

          }
          else if (question === 'spotify-this-song') {
            
            getSongInfo(param);

          }
          else if (question == 'movie-this') {

            getMovieInfo(param.replace(/\s/g, '+'));

          }
          else {
            console.log("Sorry not sure what you mean!");
            writeToFile("Sorry not sure what you mean!\n");
          }
  });

}
//write to log.txt
function writeToFile(message) {

  fs.appendFile('./log.txt', message , 'utf8', function(err) {
    
    if (err) throw err;

  });
}