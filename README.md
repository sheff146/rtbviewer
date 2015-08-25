rtbviewer
=========
# Viewer for RealtimeBoard.

Test task for Developer position. 

Published http://sheff146.azurewebsites.net/.

Problem statement:
* Create viewer for RealtimeBoard;
* Example viewer can be accessed by the link: https://realtimeboard.com/embed/?id=74254397;
* The viewer has to be implemented in JavaScript or TypeScript;
* Two kinds of visualization: using **DOM-elements** and using **canvas**. There should be two radiobuttons for changing visualization type. The view has not to be changed after switching. Viewer architecture has to alllow easy addition of another render type (e.g. WebGL);
* Viewer architecture has to alllow easy addition of new object types for rendering;
* It is not allowed to use third-party libraries. VanillaJS only;
* Following functions have to be implemented:
	* Board data receiving via API request;
	* Text rendering (widgets.type=4);
	* Sticker rendering (widgets.type=5);
	* Image rendering (widgets.type=1);
	* Board navigation;
	* Board zoom;
* Viewer should be introduced as a complete product and should be accessed by a public link;
* Board data can be received in a json format by the link: http://api.realtimeboard.com/objects/74254402;