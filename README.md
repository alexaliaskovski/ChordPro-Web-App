# ChordPro-Web-App
A web application created as an assignment for a web application class. Comments denote unoriginal code.



	Alexa Liaskovski
	
	Chord Pro Web App
	4th October 2018
	


Files:			server.js
				html/assignment1.html
				html/canvas.js
				html/jquery-1.11.3
				songs/sister_golden_hair.txt
				songs/peaceful_easy_feeling.txt
				songs/brown_eyed_girl.txt
				songs/riptide.txt
				
Node Version:	v8.11.4
OS:				Windows 10
Required Code:	only basic node.js libraries were used.
				To install node:
					1. Go to nodejs.org to download node (for windows users, 8.12.0 LTS should be used)
					2. Execute the installing when downloaded from browser
					3. After installation, restart the computer
					4. To test to make sure node was installed, open the command prompt, and type "node -v" (this will display the version number if installed correctly)

Launch:			1. In the command prompt, navigate to the directory containing the server.js file (using cd command)
				2. In the command prompt, type "node server.js" - this will create the server
				3. In the chrome web browser, go to http://localhost:3000/assignment1.html

Execution:		In the text field below the canvas, enter one of the following titles exactly as shown:
					- Sister Golden Hair
					- Peaceful Easy Feeling
					- Brown Eyed Girl
					- Riptide
				The words on the canvas should be drag-able. /Sometimes/, the words can be dragged around from about one space before the word starts. 
				If this space is over another word, it may prevent the other word from being dragged. I could not find the source of this bug; the code used
				to determine the bounds of the word is the same as used in Tutorial 3, and the code works just fine in that tutorial. This bug only happens
				occasionally. It doesn't usually disrupt the user experience of the program. 
