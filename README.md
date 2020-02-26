# xeokit-bim-viewer

**xeokit-bim-viewer** is an open source BIM viewer for the Web. It uses the [xeokit SDK](http://xeokit.io) for hardware-accelerated graphics, and is cross-platform, cross-browser, and geared for visualizing large, real-world BIM models.

The viewer is developed by [xeolabs](http://xeolabs.com) and [OpenProject GmbH](https://www.openproject.org/), and is integrated  within OpenProject's BIM construction project management software. 

The viewer is also usable as a stand-alone viewer. Simply fork this repository, add your own models to the [````.app/data````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory, then host it via [GitHub Pages](https://help.github.com/en/github/working-with-github-pages/about-github-pages). You can also just download the repository to your own HTTP server and serve everything from there. 

To serve your own models with this viewer, all you need to do is convert their IFC STEP files using open source CLI tools and drop them into the viewer's data directory. Read the guide below for more info.  

The viewer is bundled with the [xeokit SDK](http://xeokit.io) - see the [Pricing](https://xeokit.io/index.html#pricing) for licensing details.

---
* [Homepage](https://xeokit.github.io/xeokit-bim-viewer/)
* [Source Code](https://github.com/xeokit/xeokit-bim-viewer)
* [API Docs](https://xeokit.github.io/xeokit-bim-viewer/docs)
* [xeokit SDK](http://xeokit.io)
 
 ---
 
[![Screenshot](https://github.com/xeokit/xeokit-bim-viewer/raw/master/images/xeokit-bim-viewer.png)](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys)
---
## Contents

- [Features](#features)
- [Demos](#demos)
- [License](#license)
- [Creating a Viewer](#creating-a-viewer)
- [Configuring the Viewer](#configuring-the-viewer)
- [Customizing Viewer Style](#customizing-viewer-style)
  * [Modal Busy Dialog](#modal-busy-dialog)
  * [Tooltips](#tooltips)
  * [Customizing Appearances of IFC Types](#customizing-appearances-of-ifc-types)
- [Programming API](#programming-api)
  * [Querying Info on Projects](#querying-info-on-projects)
  * [Querying Info on a Project](#querying-info-on-a-project)
  * [Loading a Project](#loading-a-project)
  * [Loading a Model](#loading-a-model)
  * [Model Database](#model-database)
- [Adding Your Own Models](#adding-your-own-models)
    + [Loading models from a custom source](#loading-models-from-a-custom-source)
- [Building](#building)

## Features

* Uses [xeokit SDK](https://xeokit.io) for super fast loading and rendering of large models.
* Works in all major browsers, including mobile.
* Loads BIM geometry and metadata from the file system.
* Loads multiple models, at arbitrary position, scale and rotation.
* Configure custom appearances for IFC types.
* Supports IFC2x3 and IFC4.
* 3D and 2D viewing modes.
* Tree view with three hierarchy modes: containment structure, IFC layers and storeys.
* X-ray, highlight, show, hide and slice objects. 
* Customize with your own CSS.
* JavaScript programming API - load models, move camera, show/hide/select/xray objects etc.
* Implemented in JavaScript (ES6).

## Demos 

| Live Demo | Model Source |
|---|---|
| [OTC Conference Center](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys) | [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/301) |
| [Holter Tower](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=HolterTower&tab=storeys)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/316) |
| [West Riverside Hospital](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=WestRiversideHospital&tab=models)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/308) |
| [Schependomlaan](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=Schependomlaan&tab=storeys)| [Details](https://github.com/openBIMstandards/DataSetSchependomlaan) |
| [Schependomlaan Ground Floor](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=Schependomlaan_selectedStorey&tab=storeys)| [Details](https://github.com/openBIMstandards/DataSetSchependomlaan) |
| [Duplex](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=Duplex&tab=storeys)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/274) ||
  
## License

xeokit-bim-viewer is bundled with the xeokit SDK, which is provided under an [Affero GPL V3](https://github.com/xeokit/xeokit-sdk/blob/master/LICENSE.txt) dual-license, which allows free use for non-commercial purposes, with the option to buy a licence for commercial use. Please [Pricing](https://xeokit.io/index.html#pricing) for commercial licensing options.
  
## Programming API
 
[````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html) provides a complete set of methods to programmatically control it with JavaScript.
 
Using these methods, we can create and configure a viewer, query what models are available, load models, interact with the 3D view, control the various tools, and even control the UI itself.
 
### Creating a Viewer
 
In the example below, we'll create a [````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html), with a [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) through which it will load project and model data from the file system.  

We'll configure the ````Server```` to load the data from the [````.app/data````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory.
 
We also configure our ````BimViewer```` with DOM elements for the four parts of its UI: 

 * ````canvasElement```` - a ````<canvas>```` for the 3D canvas, 
 * ````explorerElement```` - a ````<div>```` to contain the explorer panel, 
 * ````toolbarElement```` - a ````<div>```` to contain the toolbar, 
 * ````navCubeCanvasElement```` - a ````<canvas>```` for the NavCube, and 
 * ````busyModelBackdropElement```` - an element to use as the backdrop for the busy-loading modal dialog, which will block events on the viewer while the dialog is showing. 
 
Configuring the ````BIMViewer```` with separate places to locate those elements allows flexible integration into your web page.
  
````javascript
const server = new Server({
     dataDir: "./data"
 });

const myBIMViewer = new BIMViewer(server, {
     canvasElement: document.getElementById("myCanvas"), // WebGL canvas
     explorerElement: document.getElementById("myExplorer"), // Explorer panel
     toolbarElement: document.getElementById("myToolbar"), // Toolbar
     navCubeCanvasElement: document.getElementById("myNavCubeCanvas"),
     busyModelBackdropElement: document.querySelector(".xeokit-busy-modal-backdrop")
});
````
 
In our [````app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) page, the elements look like this:
 
````html
<div id="myViewer" class="xeokit-busy-modal-backdrop">
     <div id="myExplorer" class="active"></div>
     <div id="myContent">
         <div id="myToolbar"></div>
         <canvas id="myCanvas"></canvas>
     </div>
 </div>
 <canvas id="myNavCubeCanvas"></canvas>
````
 
See [````app/css/style.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/css/style.css) for how we've styled these elements. See [````css/BIMViewer.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/css/BIMViewer.css) for the CSS styles that BIMViewer applies to its internally-created HTML.  
 
### Configuring the Viewer
 
Use [BIMViewer#setConfigs()](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setConfigs) to configure your viewer:
 
````javascript
myBIMViewer.setConfigs({
    "saoEnabled":        "false",
    "saoBias":           "0.5",
    "saoIntensity":      "0.5",
    "backgroundColor":   [1.0, 1.0, 1.0]
});
````
 
The complete set of available configurations is:
 
| Property              | Type              | Range                 | Default Value     | Description                       |
|:----------------------|:------------------|:----------------------|:------------------|:----------------------------------|
| "backgroundColor"     | Array             |                       | ````[1.0,1.0,1.0]````   | Canvas background color           |     
| "cameraNear"          | Number            | ````[0.01-0.1]````    | ````0.05````      | Distance to the near clipping plane |
| "cameraFar"           | Number            | ````[1-10000]````     | ````3000.0````    | Distance to the far clipping plane |
| "saoEnabled"          | Boolean           |                       | ````false````     | Whether or not to enable Scalable Ambient Obscurance (SAO) |
| "saoBias"             | Number            | ````[0.0...10.0]````  | ````0.5````       | SAO bias          |
| "saoIntensity"        | Number            | ````[0.0...200.0]```` | ````100.0````     | SAO intensity factor |
| "saoScale"            | Number            | ````[0.0...1000.0]````| ````500.0````     | SAO scale factor |
| "saoKernelRadius"     | Number            | ````[0.0...200.0]```` | ````100.0````     | The maximum area that SAO takes into account when checking for possible occlusion |
| "saoBlur"             | Boolean           |                       | ````true````      | Whether Guassian blur is enabled for SAO |
| "saoInteractive"      | Boolean           |                       | ````true````      | When ````true````, applies SAO when moving the camera, otherwise applies it once the camera stops moving |
| "saoInteractiveDelay" | Number            |                       | ````200````       | when "saoInteractive" is ````false````, this is the time delay in milliseconds after which SAO is applied after the camera has stopped moving |
| "viewFitFOV"          | Number            | ````[10.0...70.0]```` | ````30````        | When fitting objects to view, this is the amount in degrees of how much they should fit the user's field of view |
| "viewFitDuration"     | Number            | ````[0..5]````        | ````0.5````       | When fitting objects to view with an animated transition, this is the duration of the transition in seconds |
| "perspectiveFOV"      | Number            | ````[10.0...70.0]```` | ````55````        | When in perspective projection, this is the field of view, in degrees, that the user sees |
| "objectColorSource"   | String            | "model", "viewer"     | "model"           | Where the colors for model objects will be loaded from |


### Querying Projects, Models and Objects

#### Getting Info on Available Projects

Let's start off by querying what projects are available. Since we're using the default [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html), this will be the JSON in [````.app/data/projects/index.json````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data/projects/index.json). We'll just log that information to the console.
 
````javascript
myBIMViewer.getProjectsInfo((projectsInfo) => {
     console.log(JSON.stringify(projectsInfo, null, "\t"));
});
````
 
Internally, the viewer will call [````Server#getProjects()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getProjects) to get that information.
 
The projects JSON will be similar to:
 
````json
{
     "projects": [
         {
             "id": "Duplex",
             "name": "Duplex"
         },
         {
             "id": "Schependomlaan",
             "name": "Schependomlaan"
         },
         {
             "id": "WestRiversideHospital",
             "name": "West Riverside Hospital"
         }
 	 ]
}
````

#### Getting Info on a Project

Now let's query some info on one of the projects.

````javascript
myBIMViewer.getProjectInfo("WestRiversideHospital", (projectInfo) => {
     console.log(JSON.stringify(projectInfo, null, "\t"));
});
````

Internally, the viewer will call [````Server#getProject()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getProject) to get that information.

The project JSON will be similar to:
 
````json
{
    "id": "WestRiversideHospital",
    "name": "West Riverside Hospital",
    "models": [
        {
            "id": "architectural",
            "name": "Hospital Architecture"
        },
        {
            "id": "structure",
            "name": "Hospital Structure"
        },
        {
            "id": "electrical",
            "name": "Hospital Electrical",
            "saoEnabled": false
        }
    ],
    "viewerConfigs": {
        "backgroundColor": [0.9, 0.9, 1.0],
        "saoEnabled": true,
        "saoIntensity": 0.7,
        "saoScale": 1200.0,
        "saoInteractive": false,
        "saoInteractiveDelay": 200
    },
    "viewerContent": {
        "modelsLoaded": [
            "structure",
            "architectural"
        ]
    },
    "viewerState": {
        "tabOpen": "models"
    }
}
````

In this project info, we have:

* **````id````** - ID of the project,
* **````name````** - human-readable name of the project, 
* **````models````** - info on each model in this project,
* **````viewerConfigs````** - viewer configurations to apply when loading the project,
* **````viewerContent````** - which models to load immediately when loading the project, and
* **````viewerState````** - how the viewer should set up its UI after loading the project.

When we load the project (in a later section), the viewer is going to pass the ````viewerConfigs```` to [BIMViewer#setConfigs()](), which we described in [Configuring the Viewer](#configuring-the-viewer). 

In the ````viewerConfigs```` we're enabling the viewer's Scalable Ambient Obscurance effect, which will create ambient shadows in the crevices of our models. This is an expensive effect for the viewer tp render, so we've disabled it for the "electrical" model, which contains many long, thin wire objects that  


#### Getting Info on an Object

Let's attempt to get some information on an object within one of our project's models.

We say "attempt" because it's up to the [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) to try to find that information for us. 

Internally, the viewer will call [````Server#getObjectInfo()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getObjectInfo), which will attempt to load that object information from a file. If you were to substitute ````Server```` with your own implementation, your implementation could get that information from a data store, such as a relational database, populated with metadata for all the objects in your project's models, keyed to their IDs. 
 
We'll go ahead and assume that our ````Server```` has that object information. 

````javascript
myViewer.getObjectInfo("WestRiversideHospital", "architectural", "2HaS6zNOX8xOGjmaNi_r6b", 
    (objectInfo) => {
        console.log(JSON.stringify(objectInfo, null, "\t"));
    },
    (errMsg) => {
         console.log("Oops! There was an error getting information for this object: " + errMsg);
    });
````

If the object does not exist in the specified project and model, the method will invoke its error callback.

If the object, does exist, then the result we'll get back will look similar to below. If ````````

````json
{
    "id": "2HaS6zNOX8xOGjmaNi_r6b",
    "projectId": "WestRiversideHospital",
    "modelId": "architectural",
    "name": "Basic Wall:Exterior - Metal Panel on Mtl. Stud:187578",
    "type": "IfcWall",
    "parent": "2hExBg8jj4NRG6zzD0RZML"
}
```` 
      
### Loading Projects and Models
 
#### Loading a Project

Let's load the project we just queried info on. 

````javascript
myBIMViewer.loadProject("WestRiversideHospital", 
    () => {
         console.log("Nice! The project loaded successfully.");
    },
    (errMsg) => {
         console.log("Oops! There was an error loading this project: " + errMsg);
    });
````

If that succeeds, the viewer will now have two models loaded: ````"architectural"```` and ````"structure"````.

The viewer will also open its "Models" tab open, thanks to the ````tabOpen```` property in the ````viewerState```` section of the project info (see previous section).

We can confirm that the two models are loaded by querying the IDs of the models that are currently loaded in the viewer:

````javascript
const modelIds = myBIMViewer.getModelLoadedIds();

console.log(modelIds);
````

The result would be:

````json
["architectural", "structure"]
````

#### Loading a Model 

With our project loaded, let's load another of its models.

We could start by getting the IDs of all the models in our project, just to make sure it's there:

````javascript
const modelIds = myBIMViewer.getModelIds();

console.log(modelIds);
````

The result would be:

````json
["architectural", "structure", "electrical"]
````

To load the model:

````javascript
myBIMViewer.loadModel("electrical", 
    () => {
         console.log("Nice! The model loaded successfully.");
    },
    (errMsg) => {
         console.log("Oops! There was an error loading this model: " + errMsg);
    });
````

If we no longer need that model, we can unload it again:

````javascript
myBIMViewer.unloadModel("electrical");
````

### Controlling Viewer State

[````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html) has various methods with which we can programmatically control the state of its UI. 

Let's take a quick look at some of these methods to get an idea of what sort of UI state we can control with them. This won't be an exhaustive guide - see the ````BIMViewer```` class documentation for the complete list.

Having loaded a couple of models in the previous section, let's open the viewer's Objects tab, which contains a tree view of the containment hierarchy of the objects within those models:

````javascript
myBIMViewer.openTab("objects");
````

To confirm which tab is currently open: 

````javascript
const tabId = myBIMViewer.getOpenTab();

console.log("Currently open tab: '" + tabId + "'"); // "objects"
````

Now let's arrange the camera to fit an object in view:

````javascript
myBIMViewer.flyToObject("1fOVjSd7T40PyRtVEklS6X", ()=>{ /* Done */ });
````

TODO: Complete this section once API methods are finalized

### Model Database

The viewer loads models from the file system by default. These are contained within the [./data](https://github.com/xeokit/xeokit-bim-viewer/tree/master/data) directory, which also contains a number of sample models to get you started. 

Each model consists of an ````.XKT```` binary geometry file and a JSON metadata file which classifies its IFC elements. 

Models are grouped within *projects*. Each project can contain multiple models, and has a JSON ````index.json```` manifest which lists its models.

At the root of ````./data```` is a JSON ````index.json```` manifest that lists all the projects.

The directory structure is designed to support RESTful queries, ie:


| Query  | Path |
|---|---|
| Get all projects | ````GET ./data/index.json```` |
| Get project | ````GET ./data/WestRiversideHospital/index.json````  |
| Get model geometry | ````GET ./data/WestRiversideHospital/electrical/geometry.xkt```` |
| Get model metadata | ````GET ./data/WestRiversideHospital/electrical/metadata.json```` |

Shown below is a portion of the ````./data```` directory, showing the directory structure.

````
./data/
└── projects
    ├── index.json
    ├── Duplex
    │   ├── index.json
    │   └── models
    │       └── design
    │           ├── geometry.xkt
    │           ├── issues.json
    │           └── metadata.json
    └── WestRiversideHospital
          ├── index.json
          └── models
              ├── electrical
              │   ├── geometry.xkt
              │   └── metadata.json
              ├── fireAlarms
              │   ├── geometry.xkt
              │   └── metadata.json
              ├── plumbing
              │   ├── geometry.xkt
              │   └── metadata.json
              ├── sprinklers
              │   ├── geometry.xkt
              │   └── metadata.json
              └── structure
                  ├── geometry.xkt
                  └── metadata.json
````

The ````index.json```` at the root of ````./data```` shown below. The ````id```` of each project matches the name of that project's subdirectory. 

````json
{
  "projects": [
    {
      "id": "Duplex",
      "name": "Duplex",
      "position": [-20, 0.0, -10.0],
      "scale": [1.0, 1.0, 1.0],
      "rotation": [0.0, 0.0, 0.0]
    },
    {
      "id": "WestRiversideHospital",
      "name": "West Riverside Hospital",
      "position": [20, 0.0, 0.0],
      "scale": [1.0, 1.0, 1.0],
      "rotation": [0.0, 0.0, 0.0]
    },
    //...
  ]
}
```` 

The ````index.json```` for the "WestRiversideHospital" project is shown below. The ````id```` of each model matches the name of that model's subdirectory, while ````name```` is the string that's displayed for the model in the viewers Models tab.

````json
{
  "id": "WestRiversideHospital",
  "name": "West Riverside Hospital",
  "models": [
    {
      "id": "structure",
      "name": "Hospital Structure",
      "default": true
    },
    {
      "id": "electrical",
      "name": "Hospital Electrical"
    },
    {
      "id": "sprinklers",
      "name": "Hospital Sprinklers"
    },
    {
      "id": "plumbing",
      "name": "Hospital Plumbing"
    },
    {
      "id": "fireAlarms",
      "name": "Hospital Fire Alarms"
    }
  ]
}
````

## Adding Your Own Models

To add your own project to the database, you need to: 

add a new project directory within ````./data````,
 * add a subdirectory within that for each model, containing each model's ````.XKT```` and metadata files,
 * add a ````index.json```` manifest of the models within the project directory, which lists the models, and
 * list your project in the ````index.json```` at the root of ````./data````.    

#### Loading models from a custom source

To load models from a different source than the file system, configure

````javascript



````


## Customizing Viewer Style

The [app/index.html](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) file for the standalone viewer contains CSS rules for the various viewer elements, which you can modify as required.

### Modal Busy Dialog

As mentioned above, the viewer displays a modal dialog box whenever we load a model. The dialog box has a backdrop element, which overlays the viewer. Whenever the dialog becomes visible, the backdrop will block interaction events on the viewer's UI. 

Within our [````app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) page, the main ````<div>```` is the backdrop element:
 
````html
<div id="myBIMViewer" class="xeokit-busy-modal-backdrop">
    <div id="myExplorer" class="active"></div>
    <div id="myContent">
        <div id="myToolbar"></div>
        <canvas id="myCanvas"></canvas>
    </div>
</div>
<canvas id="myNavCubeCanvas"></canvas>
````

As defined in [````css/BIMViewer.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/css/BIMViewer.css), the backdrop gets the following style, which allows the dialog to position itself correctly within the backdrop:

````css
.xeokit-busy-modal-backdrop {
    position:relative;
}
````

If you need to tweak CSS relating to the dialog, search for "xeokit-busy-dialog" within [````css/BIMViewer.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/css/BIMViewer.css).

### Tooltips

Tooltips are not part of the core JavaScript for the viewer. Instead, viewer HTML elements are marked with ````data-tippy-content```` attributes that provide strings to show in their tooltips. 

For example, the *Toggle 2D/3D* button's element looks like this:

````html
<button type="button" class="xeokit-threeD xeokit-btn fa fa-cube fa-2x" data-tippy-content="Toggle 2D/3D"></button>
```` 

In the [app/index.html](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) file for the standalone viewer, we're using [tippy.js](https://github.com/atomiks/tippyjs), which automatically creates tooltips for those elements.

### Customizing Appearances of IFC Types

The viewer loads colors for the various IFC element types straight from the IFC model, except where overrides are defined in the configuration file [src/IFCObjectDefaults/IFCObjectDefaults.js](src/IFCObjectDefaults/IFCObjectDefaults.js).

You can add or remove configurations in that file if you need to customize the color or pickability of specific IFC types.

For example, to ensure that ````IfcWindow```` and ````IfcSpace```` types are initially visible, transparent and pickable (ie. able to be selected by clicking on them), you might configure that file as shown below:

````javascript
const IFCObjectDefaults = {
    IfcSpace: { 
        visible: true,
        pickable: true,
        opacity: 0.2
    },
    IfcWindow: { 
        visible: true,
        pickable: true,
        opacity: 0.5
    }
};

export {IFCObjectDefaults};
```` 
 
Sometimes IFC models have opaque ````IfcWindow```` and ````IfcSpace```` elements, so it's a good idea to have configurations in there so that we can see through them.

## Building 

To install the npm package:

````
sudo npm install
````

Building ES6 module in ````/dist/main.js````:

````
npm run build
````

Building API documentation in ````/docs/````:

````
npm run docs
````
