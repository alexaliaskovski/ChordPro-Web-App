/*

	Alexandra Liaskovski-Balaba
	101071309
	alexandraliaskovskib@cmail.carleton.ca
	
	COMP2406 - Assignment #2
	canvas.js
	18th October 2018, 10pm
	
	Testing: The page can be found at http://localhost:3000/assignment2.html in the browser
	
*/

let words = [] //parsed words of the song

let wordBeingMoved //when user is dragging words
let originalWord //original location of the dragged word
let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1') //our drawing canvas
const transposeUp = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"] //order of chords when transposing up
const transposeDown = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"] //order of chords when transposing down (transpose down = move down one index)

//used to string format lyrics sent from server in order to populate HTML
function simpleParseLyrics(unparsed) {
	let simpleLyrics = unparsed.toString().split("\n") //only split lyrics by line
	return simpleLyrics
}

//used to string format lyrics sent from server in order to populate canvas
//splits lyrics by line and by whether they're words or chords
function parseLyrics(unparsed) {
	let lyrics = []// creating an empty array for song lyrics to populate canvas
	let simpleLyrics = unparsed.toString().split("\n")
	for (let line of simpleLyrics) {//loop through each line of the song
		let arrLine = []// empty array, will be used to separate words from chords
		let line1 = ""// a string of all the chords in one line
		let line2 = ""// a string of all the words in one line
		let flag = false
		let numChars = 0//number of character in the chords, to adjust for spacing
		for (let i = 0; i < line.length; i++) {	//loop through each character
			if (line[i] == "[") {//if the character is a [, listen for a chord (flag = true)
				flag = true
			}
			else if (flag) {//if we're listening for a chord...
				if (line[i] == "]") {//stop listening if we're at the end of the chord
					flag = false
					line1 += " "
				}
				else {//add this letter to the chords string
					line1 += line[i]
					numChars += 1//keeping track of the size of the chords for spacing
				}
			}
			else {//if the character is not a [ and we're not listening for a chord, we're reading either a space or a lyric
				line2 += line[i]
				if (numChars > 0) numChars -= 1	// don't add spaces to chord array to adjust for size of chord last placed
				else line1 += " "// add spaces between chords so they will appear above corresponding words
			}
		}
		arrLine.push(line1)	// in parsed line array, add chords
		arrLine.push(line2)	// now add lyrics
		lyrics.push(arrLine) // add the parsed line to the parsed lyrics array; lyrics is a 2D array
	}
	return lyrics
}

//initializes the location of each word on the canvas when the lyrics are first drawn
function initWordLoc(wordArray) {
	let context = canvas.getContext('2d')
	let lyrics = [] // array of the location of each word on each line
	
	// set original coordinates to base location off of for following words
	
	let width =  10	//width of a space
	let height = 25	//height of a line
	let nextX = 100	//location of the next x-value
	let nextY = 25	//location of the next y-value
		
	for (let section of wordArray) {	//for each line of the parsed lyrics (2D Array)
		for (let line of section) {		// for each section of each line (either a string of the chords or of the lyrics)
			let eachLine = []
			wordLength = 0
			word = ""
			for (let i of line) {
				if (i != " ") {			// as long as we haven't encountered a space, increase word length
					wordLength += 1
					word += i
				}
				else {					// if we've encountered a space...
					if (word != "") {	// plot the coordinates of the word, clear and continue looping through the string
						eachLine.push({word: word, x: nextX, y: nextY})
						nextX += context.measureText(word).width + width
						word = ""
						wordLength = 0
					}
					else {nextX += width}	// if we've encountered two spaces in a row, just increase the spacing
				}
			}
			if (word != "") {eachLine.push({word: word, x: nextX, y: nextY})}	// add the last word in the line to the array
			lyrics.push(eachLine)
			nextX = 100	//restart x coordinate
			nextY += height	// increase y coordinate
		}
	}
	return lyrics
}
	
//When the canvas was clicked, find the word at the location it was clicked
function getWordAtLocation(aCanvasX, aCanvasY) {	
	let context = canvas.getContext('2d')
	for (let i = 0; i < words.length; i++) {
		for (let j = 0; j < words[i].length; j++){
			if ((Math.abs(words[i][j].x - aCanvasX) < 5 || (Math.abs(aCanvasX - words[i][j].x) < (context.measureText(words[i][j].word).width)+15)) && Math.abs(words[i][j].y - aCanvasY) < 10) {
				return words[i][j]
			}
		}
	}
	return null
}

//draws the canvas
function drawCanvas() {
	let context = canvas.getContext('2d')
	
	context.fillStyle = '#A1C3D1'
	context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

	context.font = '20pt Impact'

	// adding lyrics from location
	for (let i = 0; i < words.length; i++) {
		if (i%2 == 0) {
			context.fillStyle = '#AD2E95'
		}
		else {
			context.fillStyle = "#F172A1"
		}
		for (let j = 0; j < words[i].length; j++) {
			let data = words[i][j]
			context.fillText(data.word, data.x, data.y)
		}
	}
	
	// actually draws everything define above
	context.stroke()
}

//handles when mouse is pressed down
function handleMouseDown(e) {

	//get mouse location relative to canvas top left
	let rect = canvas.getBoundingClientRect()
	let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
	let canvasY = e.pageY - rect.top

	//determines which word was clicked
	wordBeingMoved = getWordAtLocation(canvasX, canvasY)
	originalWord = getWordAtLocation(canvasX, canvasY)
	if (wordBeingMoved != null) {
		deltaX = wordBeingMoved.x - canvasX
		deltaY = wordBeingMoved.y - canvasY
		$("#canvas1").mousemove(handleMouseMove)	//if a word was clicked, listen for dragging...
		$("#canvas1").mouseup(handleMouseUp)		//... and letting go of the word

	}
	
	e.stopPropagation()
	e.preventDefault()

	drawCanvas()
}

//handle when mouse is being moved
function handleMouseMove(e) {

	//get mouse location relative to canvas top left
	let rect = canvas.getBoundingClientRect()
	let canvasX = e.pageX - rect.left
	let canvasY = e.pageY - rect.top

	wordBeingMoved.x = canvasX + deltaX
	wordBeingMoved.y = canvasY + deltaY
	
	//find which word is being moved, and update its location
	for (let i = 0; i < words.length; i++) {
		for (let j = 0; j < words[i].length; j++) {
			if (words[i][j] == originalWord) {
				words[i][j].x = originalWord.x
				words[i][j].y = originalWord.y
				originalWord = words[i][j]
			}
		}
	}	

	e.stopPropagation()

	drawCanvas()
}

//handles when user lets go of the word
function handleMouseUp(e) {

	e.stopPropagation()

	//remove mouse move and mouse up handlers but leave mouse down handler
	$("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
	$("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

	drawCanvas() //redraw the canvas
}

//handles when the user submits a new song
function handleSubmitButton() {

	let userText = $('#userTextField').val(); //get text from user text input field
	if (userText && userText != '') { //user text was not empty
		userText = userText.toLowerCase()
		let userRequestObj = {text: userText, request: "Submit", content: "uhph"} //make object to send to server
		
		let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
		$('#userTextField').val('') //clear the user text field
		$.post("userText", userRequestJSON, function(data, status) {
			let textDiv = document.getElementById("text-area")
			document.getElementById("text-area").innerHTML = ""	//clear existing lyrics in HTML
			
			let responseObj = JSON.parse(data)
			//replace word array with new words if there are any
			if (responseObj.wordArray) {
				let lyrics = simpleParseLyrics(responseObj.wordArray)
				for (let i = 0; i < lyrics.length; i ++) {
					textDiv.innerHTML = textDiv.innerHTML + `<p>${lyrics[i]}</p>` //add the line to the HTML
				}
				words = initWordLoc(parseLyrics(responseObj.wordArray))	//initialized parsed word array from unparsed server string
			}
			else {
				words = []	//if nothing was submitted, clear the word array
			}
			drawCanvas()
		})
	}
}

function helperTranspose(direc, transArray, otherArray, root, tail) {
	if (transArray.includes(root)) {
		index = transArray.indexOf(root)
		if (direc == "up") {
			if (index == 11) {index = 0}
			else {index += 1}
		}
		else if (direc == "down") {
			if (index == 0) {index = 11}
			else {index -= 1}
		}
		return transArray[index]
	}
	else if (otherArray.includes(root)) {
		index = otherArray.indexOf(root)
		if (direc == "up") {
			if (index == 11) {index = 0}
			else {index += 1}
		}
		else if (direc == "down") {
			if (index == 0) {index = 11}
			else {index -= 1}
		}
		return otherArray[index]
	}
}

function findRoot(word) {
	let root = ""
	let tail = ""
	for (let letter = 0; letter < word.length; letter++) {
		if ("ABCDEFG".includes(word[letter])) {root += word[letter]}
		else if ("b#".includes(word[letter])) {root += word[letter]}
		else (tail += word[letter])
	}
	return [root, tail]
}

function transpose(direc) {
	if (direc == "up") {
		transArray = transposeUp
		otherArray = transposeDown}
	else if (direc == "down") {
		transArray = transposeDown
		otherArray = transposeUp}
	else {console.log("Transpose Error 1")}
	
	for (let i = 0; i < words.length; i ++) {	//loop through each line
		if (i % 2 == 0) { //only consider lines with chords
			let counter = 1
			for (let j = 0; j < words[i].length; j++) {	//loop through each word
				if (words[i][j].word.includes("/")){
					chordHalves = words[i][j].word.split("/")
					for (let half = 0; half < 2; half++) {
						chordHalves[half] = findRoot(chordHalves[half])
						chordHalves[half] = helperTranspose(direc, transArray, otherArray, chordHalves[half][0], chordHalves[half][1])
					}
					words[i][j].word = chordHalves[0] + "/" + chordHalves[1]
				}
				else {
					part = findRoot(words[i][j].word)
					newRoot = helperTranspose(direc, transArray, otherArray, part[0], part[1])
					words[i][j].word = newRoot + part[1]
				}
			}
		}
	}
}

//handle when the user wants to transpose up
function handleTransposeUp() {
	if (words) {	//if lyrics exist on the canvas
		transpose("up")
		drawCanvas()
	}
}

//handles when user wants to transpose down
function handleTransposeDown() {
	if (words) {	//if lyrics exist on the canvas
		transpose("down")
		drawCanvas()
	}
}

function reorderWordArray() {
	let newWords = []
	for (let i = 25; i < canvas.height; i+=25) {
		let newLine = []
		for (let j = 0; j < words.length; j ++) {
			for (let k = 0; k < words[j].length; k++) {
				if (words[j][k].y == i) {
					newLine.push(words[j][k])
				}
			}
		}
		newLine.sort(function(wordA, wordB) {
			if(wordA.x < wordB.x) return -1
			if(wordA.x == wordB.x) return 0
			if(wordA.x > wordB.x) return 1
		})
		newWords.push(newLine)
	}
	words = newWords
}
  
function wordArrayToString() {
	let string = ""
	for (let i = 0; i < words.length - 1; i+=2) {	//loop through each line
		let tempChords = words[i]
		let tempWords = words[i + 1]
		let chordsCounter = 0
		let wordsCounter = 0
		console.log(tempChords)
		while (chordsCounter < tempChords.length || wordsCounter < tempWords.length) {
			if (chordsCounter < tempChords.length && wordsCounter < tempWords.length) {
				if (tempChords[chordsCounter].x <= tempWords[wordsCounter].x) { 
					string += "[" + tempChords[chordsCounter].word + "] "
					chordsCounter += 1
				}
				else if (tempWords[wordsCounter].x < tempChords[chordsCounter].x) {
					string += tempWords[wordsCounter].word + " "
					wordsCounter += 1
				}
				else {break}
			}
			else if (chordsCounter < tempChords.length) {
				console.log("2")
				string += "[" + tempChords[chordsCounter].word + "] "
				chordsCounter += 1
			}
			else if (wordsCounter < tempWords.length) {
				console.log("3")
				string += tempWords[wordsCounter].word + " "
				wordsCounter += 1
			}
			else {break}
		}
		string += "\n"
	}
	return string
}

function adjustRows() {
	for (let i = 25; i < canvas.height; i += 25) {
		for (let j = 0; j < words.length; j++) {
			for (let k = 0; k < words[j].length; k++) {
				if (words[j][k].y < i + 25 && words[j][k].y >= i - 25) {
					if (i%50 != 0 && j % 2 == 0) {words[j][k].y = i}
					else if (i%50 == 0 && j%2 != 0){words[j][k].y = i}
				}
			}
		}
	}
	drawCanvas()
}

function handleRefresh() {
	adjustRows()
	reorderWordArray()
	
	let textDiv = document.getElementById("text-area")
	document.getElementById("text-area").innerHTML = ""	//clear existing lyrics in HTML
	if (words) {
		let lyrics = simpleParseLyrics(wordArrayToString())
		for (let i = 0; i < lyrics.length; i ++) {
			textDiv.innerHTML = textDiv.innerHTML + `<p>${lyrics[i]}</p>` //add the line to the HTML
		}
	}
}

function handleSaveAs() {
	let userText = $('#userTextField').val(); //get text from user text input field
	let textDiv = document.getElementById("text-area")
	if (userText && userText != '' && words != []) { //user text and canvas was not empty
		let userRequestObj = {text: userText, content: textDiv.innerText, request: "Save"} //make object to send to server
		
		let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
		$('#userTextField').val('') //clear the user text field
		$.post("userText", userRequestJSON, function(data, status) {
			console.log("Successful send of writing..")
		})
	}
}
		

$(document).ready(function() {
	
	//This is called after the browser has loaded the web page
	//add mouse down listener to our canvas object
	$("#canvas1").mousedown(handleMouseDown)

	drawCanvas()
})			