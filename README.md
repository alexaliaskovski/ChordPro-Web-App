# ChordPro-Web-App
A web application created as an assignment for a web application class. Comments denote unoriginal code.

/*

	Alexandra Liaskovski-Balaba
	101071309
	alexandraliaskovskib@cmail.carleton.ca
	
	COMP2406 - Assignment #2
	README
	18th October 2018, 10pm
	
	Testing: The page can be found at http://localhost:3000/assignment2.html in the browser
	
*/

Files:				server.js
				html/assignment2.html
				html/canvas.js
				html/jquery-1.11.3
				songs/Sister Golden Hair.txt
				songs/Peaceful Easy Feeling.txt
				songs/Brown Eyed Girl.txt
				songs/Never My Love.txt
				
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
				3. In the chrome web browser, go to http://localhost:3000/assignment2.html

Execution:		In the text field below the canvas, enter one of the following titles exactly as shown:
					- Sister Golden Hair
					- Peaceful Easy Feeling
					- Brown Eyed Girl
					- Never My Love
				This program will have all the same functionality as assignment 1. When adding a new song, the text file must be saved in /songs, and the name of the text file is what must be used
				when entering a song in the text field to be added on the canvas. To save a song from the canvas, be sure to enter the name of the text file you want to save it as before you hit 'Save As'.
