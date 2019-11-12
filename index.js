
import {Server} from "./src/server/Server.js";
import {ViewerUI} from "./src/ViewerUI.js";
import {Viewer} from "@xeokit/xeokit-sdk/src/viewer/Viewer.js";
import {AmbientLight} from "@xeokit/xeokit-sdk/src/viewer/scene/lights/AmbientLight.js";
import {DirLight} from "@xeokit/xeokit-sdk/src/viewer/scene/lights/DirLight.js";

const viewer = new Viewer({
    canvasId: "myCanvas",
    transparent: true
});

const scene = viewer.scene;
const camera = scene.camera;

camera.eye = [10.45, 17.38, -98.31];
camera.look = [43.09, 0.5, -26.76];
camera.up = [0.06, 0.96, 0.16];

scene.xrayMaterial.fill = false;
scene.xrayMaterial.fillColor = [0, 0, 0];
scene.xrayMaterial.fillAlpha = 0.1;
scene.xrayMaterial.edges = true;
scene.xrayMaterial.edgeColor = [0, 0, 0];
scene.xrayMaterial.edgeAlpha = 0.3;

scene.highlightMaterial.edges = true;
scene.highlightMaterial.edgeColor = [.5, .5, 0];
scene.highlightMaterial.edgeAlpha = 1.0;
scene.highlightMaterial.fill = true;
scene.highlightMaterial.fillAlpha = 0.1;
scene.highlightMaterial.fillColor = [1, 1, 0];

scene.clearLights();

new AmbientLight(scene, {
    color: [0.3, 0.3, 0.3],
    intensity: 1.0
});

new DirLight(scene, {
    dir: [0.8, -0.6, -0.8],
    color: [1.0, 1.0, 1.0],
    intensity: 1.0,
    space: "world"
});

new DirLight(scene, {
    dir: [-0.8, -0.4, 0.4],
    color: [1.0, 1.0, 1.0],
    intensity: 1.0,
    space: "world"
});

new DirLight(scene, {
    dir: [0.2, -0.8, 0.8],
    color: [0.6, 0.6, 0.6],
    intensity: 1.0,
    space: "world"
});

const server = new Server({});

const viewerUI = new ViewerUI(server, viewer, {
    modelsPanelId: "models-list",
    objectsTreePanelId: "objects-tree",
    classesTreePanelId: "classes-tree",
    storeysPanelId: "storeys-menu",
    sectionPlanesOverviewCanvasId: "mySectionPlanesOverviewCanvas",
    navCubeCanvasId: "myNavCubeCanvas",
    containerId: "canvasContainer",
    issuesPanelId: "issues-list"
});

