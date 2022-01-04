var clients = workspace.clientList();
var activeClient;

for (var i=0; i<clients.length; i++) {
    if (clients[i].active) {
      activeClient = clients[i];
    }
}

workspace.clientActivated.connect(function(client){
  activeClient = client;
});

// function to check for valid clients taken from the tiling-kwin-script
// Copyright (C) 2012 Mathias Gottschlag <mgottschlag@gmail.com>
// Copyright (C) 2013-2014 Fabian Homborg <FHomborg@gmail.com>
var isIgnored = function(client) {
	// TODO: Add regex and more options (by title/caption, override a floater, maybe even a complete scripting language / code)
	// Application workarounds should be put here
	// HACK: Qt gives us a method-less QVariant(QStringList) if we ask for an array
	// Ask for a string instead (which can and should still be a StringList for the UI)
	var fl = "yakuake,krunner,plasma,plasma-desktop,plugin-container,Wine,klipper";
	// TODO: This could break if an entry contains whitespace or a comma - it needs to be validated on the qt side
	var floaters = String(readConfig("floaters", fl)).replace(/ /g,"").split(",");
	if (floaters.indexOf(client.resourceClass.toString()) > -1) {
		return true;
	}
	// HACK: Steam doesn't set the windowtype properly
	// Everything that isn't captioned "Steam" should be a dialog - these resize worse than the main window does
	// With the exception of course of the class-less update/start dialog with the caption "Steam" (*Sigh*)
	if (client.resourceClass.toString() == "steam" && client.caption != "Steam") {
		return true;
	} else if (client.resourceClass.toString() != "steam" && client.caption == "Steam") {
		return true;
	}
	if (client.specialWindow == true) {
		return true;
	}
	if (client.desktopWindow == true) {
		return true;
	}
	if (client.dock == true) {
		return true;
	}
	if (client.toolbar == true) {
		return true;
	}
	if (client.menu == true) {
		return true;
	}
	if (client.dialog == true) {
		return true;
	}
	if (client.splash == true) {
		return true;
	}
	if (client.utility == true) {
		return true;
	}
	if (client.dropdownMenu == true) {
		return true;
	}
	if (client.popupMenu == true) {
		return true;
	}
	if (client.tooltip == true) {
		return true;
	}
	if (client.notification == true) {
		return true;
	}
	if (client.comboBox == true) {
		return true;
	}
	if (client.dndIcon == true) {
		return true;
	}

    return false;
};

var resizeAndMove = function(width_dividend, width_multiple, xpos_dividend, xpos_index, height_dividend, ypos_index){
  print("Ultrawide tiling called to resize and move with args: " + width_dividend + ", " + width_multiple + ", " + xpos_dividend + ", " + xpos_index);
  if (isIgnored(activeClient)) {
    print("client ignored, not resizing or moving");
    return;
  }

  var workGeo = workspace.clientArea(KWin.PlacementArea, activeClient.screen, 1);
  var geo = activeClient.geometry;

  if (height_dividend > 1) {
    // set height
    geo.height = workGeo.height / height_dividend;
    
    // vertical position (from left edge)
    geo.y = (workGeo.height / height_dividend) * ypos_index;
  } else {
    // vertical geometry should be top-to-bottom
    geo.y = workGeo.y;
    geo.height = workGeo.height;
  }
  
  // horizontal position (from left edge)
  geo.x = (workGeo.width / xpos_dividend) * xpos_index;

  // width
  geo.width = (workGeo.width / width_dividend) * width_multiple;

  // HACK: unset "maximized" since kwin doesn't do it when you resize an already-maximized window with .geometry
  activeClient.setMaximize(false, false);

  print("new geometry is x: " + geo.x + " y: " + geo.y + " width: " + geo.width + " height: " + geo.height);
  activeClient.geometry = geo;
}

var maximize = function(){
  print("Ultrawide tiling called to maximize window");
  if (isIgnored(activeClient)) {
    print("client ignored, not maximizing");
    return;
  }
  activeClient.setMaximize(true, true);
}

print("Ultrawide tiling is active");

// fullscreen
registerShortcut("ULTRAWIDE TILING: Full", "ULTRAWIDE TILING: Full", "Meta+Ctrl+F", function () {maximize()});

// halves - full height
registerShortcut("ULTRAWIDE TILING: 1/2 Center", "ULTRAWIDE TILING: 1/2 Center", "", function () {resizeAndMove(2, 1, 4, 1, 1, 1)});
registerShortcut("ULTRAWIDE TILING: 1/2 Left", "ULTRAWIDE TILING: 1/2 Left", "", function () {resizeAndMove(2, 1, 2, 0, 1, 1)});
registerShortcut("ULTRAWIDE TILING: 1/2 Right", "ULTRAWIDE TILING: 1/2 Right", "", function () {resizeAndMove(2, 1, 2, 1, 1, 1)});

// halves - 2x2 grid - top row
registerShortcut("ULTRAWIDE TILING: Grid 2x2 Top-Left", "ULTRAWIDE TILING: Grid 2x2 Top-Left", "Meta+!", function () {resizeAndMove(2, 1, 2, 0, 2, 0)});
//registerShortcut("ULTRAWIDE TILING: Grid 2x2 Top-Center", "ULTRAWIDE TILING: Grid 2x2 Top-Center", "", function () {resizeAndMove(2, 1, 4, 1, 2, 0)});
registerShortcut("ULTRAWIDE TILING: Grid 2x2 Top-Right", "ULTRAWIDE TILING: Grid 2x2 Top-Right", "Meta+@", function () {resizeAndMove(2, 1, 2, 1, 2, 0)});
// halves - Grid 2x2 grid - bottom row
registerShortcut("ULTRAWIDE TILING: Grid 2x2 Bottom-Left", "ULTRAWIDE TILING: Grid 2x2 Bottom-Left", "Meta+#", function () {resizeAndMove(2, 1, 2, 0, 2, 1)});
//registerShortcut("ULTRAWIDE TILING: Grid 2x2 Bottom-Center", "ULTRAWIDE TILING: Grid 2x2 Bottom-Center", "", function () {resizeAndMove(2, 1, 4, 1, 2, 1)});
registerShortcut("ULTRAWIDE TILING: Grid 2x2 Bottom-Right", "ULTRAWIDE TILING: Grid 2x2 Bottom-Right", "Meta+$", function () {resizeAndMove(2, 1, 2, 1, 2, 1)});


// thirds - full height
registerShortcut("ULTRAWIDE TILING: 1/3 Left", "ULTRAWIDE TILING: 1/3 Left", "Meta+Ctrl+Left", function () {resizeAndMove(3, 1, 3, 0, 1, 1)});
registerShortcut("ULTRAWIDE TILING: 1/3 Center", "ULTRAWIDE TILING: 1/3 Center", "Meta+Ctrl+Up", function () {resizeAndMove(3, 1, 3, 1, 1, 1)});
registerShortcut("ULTRAWIDE TILING: 1/3 Right", "ULTRAWIDE TILING: 1/3 Right", "Meta+Ctrl+Right", function () {resizeAndMove(3, 1, 3, 2, 1, 1)});
// thirds - 3x3 grid - top row
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Top-Left", "ULTRAWIDE TILING: Grid 3x3 Top-Left", "Meta+Alt+1", function () {resizeAndMove(3, 1, 3, 0, 3, 0)});
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Top-Center", "ULTRAWIDE TILING: Grid 3x3 Top-Center", "Meta+Alt+2", function () {resizeAndMove(3, 1, 3, 1, 3, 0)});
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Top-Right", "ULTRAWIDE TILING: Grid 3x3 Top-Right", "Meta+Alt+3", function () {resizeAndMove(3, 1, 3, 2, 3, 0)});
// thirds - Grid 3x3 grid - middle row
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Middle-Left", "ULTRAWIDE TILING: Grid 3x3 Middle-Left", "Meta+Alt+4", function () {resizeAndMove(3, 1, 3, 0, 3, 1)});
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Middle-Center", "ULTRAWIDE TILING: Grid 3x3 Middle-Center", "Meta+Alt+5", function () {resizeAndMove(3, 1, 3, 1, 3, 1)});
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Middle-Right", "ULTRAWIDE TILING: Grid 3x3 Middle-Right", "Meta+Alt+6", function () {resizeAndMove(3, 1, 3, 2, 3, 1)});
// thirds - Grid 3x3 grid - bottom row
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Bottom-Left", "ULTRAWIDE TILING: Grid 3x3 Bottom-Left", "Meta+Alt+7", function () {resizeAndMove(3, 1, 3, 0, 3, 2)});
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Bottom-Center", "ULTRAWIDE TILING: Grid 3x3 Bottom-Center", "Meta+Alt+8", function () {resizeAndMove(3, 1, 3, 1, 3, 2)});
registerShortcut("ULTRAWIDE TILING: Grid 3x3 Bottom-Right", "ULTRAWIDE TILING: Grid 3x3 Bottom-Right", "Meta+Alt+9", function () {resizeAndMove(3, 1, 3, 2, 3, 2)});


// two-thirds
registerShortcut("ULTRAWIDE TILING: 2/3 Left", "ULTRAWIDE TILING: 2/3 Left", "Meta+Ctrl+1", function () {resizeAndMove(3, 2, 6, 0, 1, 1)});
registerShortcut("ULTRAWIDE TILING: 2/3 Center", "ULTRAWIDE TILING: 2/3 Center", "Meta+Ctrl+3", function () {resizeAndMove(3, 2, 6, 1, 1, 1)});
registerShortcut("ULTRAWIDE TILING: 2/3 Right", "ULTRAWIDE TILING: 2/3 Right", "Meta+Ctrl+2", function () {resizeAndMove(3, 2, 6, 2, 1, 1)});


// sixths
registerShortcut("ULTRAWIDE TILING: 1/6 Left-Left", "ULTRAWIDE TILING: 1/6 Left-Left", "", function () {resizeAndMove(6, 1, 6, 0)});
registerShortcut("ULTRAWIDE TILING: 1/6 Left-Center", "ULTRAWIDE TILING: 1/6 Left-Center", "", function () {resizeAndMove(6, 1, 6, 1)});
registerShortcut("ULTRAWIDE TILING: 1/6 Left-Right", "ULTRAWIDE TILING: 1/6 Left-Right", "", function () {resizeAndMove(6, 1, 6, 2)});
registerShortcut("ULTRAWIDE TILING: 1/6 Right-Left", "ULTRAWIDE TILING: 1/6 Right-Left", "", function () {resizeAndMove(6, 1, 6, 3)});
registerShortcut("ULTRAWIDE TILING: 1/6 Right-Center", "ULTRAWIDE TILING: 1/6 Right-Center", "", function () {resizeAndMove(6, 1, 6, 4)});
registerShortcut("ULTRAWIDE TILING: 1/6 Right-Right", "ULTRAWIDE TILING: 1/6 Right-Right", "", function () {resizeAndMove(6, 1, 6, 5)});
