import {Server} from "./src/server/Server.js";
import {ViewerUI} from "./src/ViewerUI.js";

const server = new Server({
    dataDir: "./data/"
});

const viewerUI = new ViewerUI(server, {
    canvasElement: document.getElementById("myCanvas"), // WebGL canvas
    explorerElement: document.getElementById("myExplorer"), // Left panel
    toolbarElement: document.getElementById("myToolbar"), // Toolbar
    navCubeCanvasElement: document.getElementById("myNavCubeCanvas"),
    sectionPlanesOverviewCanvasElement: document.getElementById("mySectionPlanesOverviewCanvas")
});

viewerUI.on("queryPicked", (event) => {
    const entity = event.entity; // Entity
    const metaObject = event.metaObject; // MetaObject
    alert(`Query result:\n\nObject ID = ${entity.id}\nIFC type = "${metaObject.type}"`);
});

// viewerUI.loadProject("duplex");
viewerUI.loadProject("WestRiversideHospital");
// viewerUI.loadProject("schependomlaan");