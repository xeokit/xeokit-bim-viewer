import {Server} from "./server/Server.js";
import {ViewerUI} from "./ViewerUI.js";

import "bootstrap";
import './scss/app.scss';

const server = new Server({
    dataDir: "./data/"
});

const viewerUI = new ViewerUI(server, {
    canvasElement: $("#myCanvas"), // WebGL canvas
    explorerElement: $("#myExplorer"), // Left panel
    toolbarElement: $("#myToolbar"), // Toolbar
    navCubeCanvasElement: $("#myNavCubeCanvas"),
    sectionPlanesOverviewCanvasElement: $("#mySectionPlanesOverviewCanvas"), // Section planes overview canvas
    queryInfoPanelElement: $("#myQueryInfoPanel") // Query results panel
});

viewerUI.on("queryPicked", (event) => {
    const entity = event.entity; // Entity
    const metaObject = event.metaObject; // MetaObject
    alert(`Query result:\n\nObject ID = ${entity.id}\nIFC type = "${metaObject.type}"`);
});

// viewerUI.loadProject("duplex");
viewerUI.loadProject("WestRiversideHospital");
// viewerUI.loadProject("schependomlaan");
