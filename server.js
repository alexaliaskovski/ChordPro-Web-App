/*

	Alexandra Liaskovski-Balaba
	101071309
	alexandraliaskovskib@cmail.carleton.ca
	
	COMP2406 - Assignment #2
	server.js
	18th October 2018, 10pm
	
	Testing: The page can be found at http://localhost:3000/assignment2.html in the browser
	
*/

//array of songs, index maps to a string which stores the location of the file in the directory
const songs = {
	"Peaceful Easy Feeling": 'songs/peaceful_easy_feeling.txt',
	"Sister Golden Hair": 'songs/sister_golden_hair.txt',
	"Brown Eyed Girl": 'songs/brown_eyed_girl.txt',
	"Riptide": 'songs/riptide.txt',
	"Never My Love": 'songs/never_my_love.txt'
};

//Server Code
const http = require("http"); //need to http
const fs = require("fs"); //need to read static files
const url = require("url"); //to parse url strings
const ROOT_DIR = "html"; //dir to serve static files from

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain"
}

const get_mime = function(filename) {
  //Use file extension to determine the correct response MIME type
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
       return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES["txt"]
}

http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true, false)
    console.log("\n============================")
    console.log("PATHNAME: " + urlObj.pathname)
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
    console.log("METHOD: " + request.method)

    var receivedData = ""

    //Event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    })

    //Event handler for the end of the message
    request.on("end", function() {
      console.log("received data: ", receivedData)
      console.log("type: ", typeof receivedData)

      //if it is a POST request then echo back the data.
      if (request.method == "POST") {
        //Handle POST requests
        var dataObj = JSON.parse(receivedData)
        console.log("received data object: ", dataObj)
        console.log("type: ", typeof dataObj)
        //Here we can decide how to process the data object and what object to send back to client.
		
        console.log("USER REQUEST: " + dataObj.text)
        var returnObj = {}
		//if the text input matches an index in the songs map, return a string array of the content in the text file
		if (dataObj.request == "Submit"){
			// no string formatting here, data is passed as one long string in an array
			fs.readFile("songs/" + dataObj.text + ".txt", "utf8", function(err, data) {
				if (err) {
					//report error to console
					console.log("ERROR: " + JSON.stringify(err))
					//respond with not found 404 to client
					response.writeHead(404)
					response.end(JSON.stringify(err))
					return
				}
				returnObj.wordArray = data
				 //object to return to client
				response.writeHead(200, { "Content-Type": MIME_TYPES["txt"] })
				response.end(JSON.stringify(returnObj)) //send just the JSON object as plain text 
			})
		}
		
		else if (dataObj.request == "Save") {
			fs.writeFile("songs/" + dataObj.text + ".txt", dataObj.content, function(err, data) {
				if (err) {
					//report error to console
					console.log("ERROR: " + JSON.stringify(err))
					//respond with not found 404 to client
					response.writeHead(404)
					response.end(JSON.stringify(err))
					return
				}
			})	
		}
      }

      if (request.method == "GET") {
        //Handle GET requests
        //Treat GET requests as request for static file
        var filePath = ROOT_DIR + urlObj.pathname
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html"

        fs.readFile(filePath, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404)
            response.end(JSON.stringify(err))
            return
          }
          //respond with file contents
          response.writeHead(200, { "Content-Type": get_mime(filePath) })
          response.end(data)
        })
      }
    })
  }).listen(3000)

  
// print to console for user use
console.log("Server Running at PORT 3000  CTRL-C to quit")
console.log("To Test:")
console.log("http://localhost:3000/assignment2.html")