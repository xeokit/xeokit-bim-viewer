import {Viewer} from "./lib/xeokit/viewer/Viewer.js";
import {XKTLoaderPlugin} from "./lib/xeokit/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";
import {Toolbar} from "./src/toolbar/Toolbar.js";
import {buildClassesTree} from "./src/trees/buildClassesTree.js";
import {buildStructureTree} from "./src/trees/buildStructureTree.js";
import {Mesh} from "./lib/xeokit/viewer/scene/mesh/Mesh.js";
import {ReadableGeometry} from "./lib/xeokit/viewer/scene/geometry/ReadableGeometry.js";
import {buildPlaneGeometry} from "./lib/xeokit/viewer/scene/geometry/builders/buildPlaneGeometry.js";
import {PhongMaterial} from "./lib/xeokit/viewer/scene/materials/PhongMaterial.js";
import {LambertMaterial} from "./lib/xeokit/viewer/scene/materials/LambertMaterial.js";
import {DirLight} from "./lib/xeokit/viewer/scene/lights/DirLight.js";
import {AmbientLight} from "./lib/xeokit/viewer/scene/lights/AmbientLight.js";

// Create and configure a xeokit Viewer

const viewer = new Viewer({
    canvasId: "myCanvas",
    transparent: true
});

const scene = viewer.scene;
const camera = scene.camera;

camera.eye = [10.45, 17.38, -98.31];
camera.look = [43.09, 0.5, -26.76];
camera.up = [0.06, 0.96, 0.16];

scene.xrayMaterial.fill = true;
scene.xrayMaterial.fillColor = [0, 0, 0];
scene.xrayMaterial.fillAlpha = 0.4;
scene.xrayMaterial.edges = true;
scene.xrayMaterial.edgeColor = [0, 0, 0];
scene.xrayMaterial.edgeAlpha = 0.4;

scene.highlightMaterial.edges = true;
scene.highlightMaterial.edgeColor = [1, 1, 0];
scene.highlightMaterial.edgeAlpha = 1.0;
scene.highlightMaterial.fill = true;
scene.highlightMaterial.fillAlpha = 0.1;
scene.highlightMaterial.fillColor = [1, 1, 0];

// Custom lights

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

// Ground plane

// new Mesh(viewer.scene, {
//     geometry: new ReadableGeometry(viewer.scene, buildPlaneGeometry({
//         xSize: 1500,
//         zSize: 1500
//     })),
//     material: new LambertMaterial(viewer.scene, {
//         color: [0.4, 1.0, 0.4],
//         backfaces: true
//     }),
//     position: [0, -1.0, 0],
//     pickable: false,
//     collidable: false
// });

// Load a model

const xktLoader = new XKTLoaderPlugin(viewer);

const model = xktLoader.load({
    id: "myModel",
    // src: "./data/models/xkt/schependomlaan/schependomlaan.xkt",
    // metaModelSrc: "./data/metaModels/schependomlaan/metaModel.json",

    src: "./data/models/xkt/OTCConferenceCenter/OTCConferenceCenter.xkt",
    metaModelSrc: "./data/metaModels/OTCConferenceCenter/metaModel.json", // Creates a MetaObject instances in scene.metaScene.metaObjects
    edges: true
});

// Create UI

const toolbar = new Toolbar(viewer, {
    sectionPlanesOverviewCanvasId: "mySectionPlanesOverviewCanvas",
    navCubeCanvasId: "myNavCubeCanvas",
    containerId: "canvasContainer",
    bcfPanelId: "bcf-index-panel",
    annotationsPanelId: "annotations-index-panel"
});

bindButton("#reset", toolbar.reset, "reset");
bindButton("#fit", toolbar.fit, "fit");

bindCheckButton("#firstPerson", toolbar.firstPerson);

bindCheckButton("#ortho", toolbar.ortho);

bindCheckButton("#query", toolbar.query);
bindCheckButton("#xray", toolbar.xray);
bindCheckButton("#hide", toolbar.hide);
bindCheckButton("#select", toolbar.select);
bindCheckButton("#distance", toolbar.distance);
bindCheckButton("#angle", toolbar.angle);
bindCheckButton("#section", toolbar.section);
bindCheckButton("#annotate", toolbar.annotate);
bindCheckButton("#bcf", toolbar.bcf);

bindButton("#createBCF", toolbar.bcf, "createViewpoint");
bindButton("#clearBCF", toolbar.bcf, "clearViewpoints");
bindButton("#clearAnnotations", toolbar.annotate, "clearAnnotations");
bindButton("#clearSections", toolbar.section, "clearSections");

function bindButton(selector, component, action) {
    $(selector).on('click', function (event) {
        component[action]();
        event.preventDefault();
    });
}

function bindCheckButton(selector, component) {
    $(selector).on('click', function (event) {
        component.setActive(!component.getActive());
        event.preventDefault();
    });
    component.on("active", (active) => {
        if (active) {
            $(selector).addClass("active");
        } else {
            $(selector).removeClass("active");
        }
    });
    if (component.getActive()) {
        $(selector).addClass("active");
    } else {
        $(selector).removeClass("active");
    }
}

// When model has loaded, create explorer trees

model.on("loaded", () => {
    buildStructureTree(viewer, "structure-tree", model);
  //  buildClassesTree(viewer, "classes-tree", model);
    viewer.cameraFlight.jumpTo(viewer.scene);
    toolbar.reset.saveState();
});
