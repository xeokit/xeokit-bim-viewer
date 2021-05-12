# xeokit-bim-viewer

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9144bfee5a4b42ae8dc2eb603aa9966c)](https://www.codacy.com/manual/lindsay-kay/xeokit-viewer?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xeokit/xeokit-viewer&amp;utm_campaign=Badge_Grade)
[![npm version](https://badge.fury.io/js/%40xeokit%2Fxeokit-bim-viewer.svg)](https://badge.fury.io/js/%40xeokit%2Fxeokit-bim-viewer)
[![](https://data.jsdelivr.com/v1/package/npm/@xeokit/xeokit-bim-viewer/badge)](https://www.jsdelivr.com/package/npm/@xeokit/xeokit-bim-viewer)

 
[![Screenshot](https://github.com/xeokit/xeokit-bim-viewer/raw/master/images/xeokit-bim-viewer.png)](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys)

---

**[xeokit-bim-viewer](https://github.com/xeokit/xeokit-bim-viewer)** is an open source 2D/3D BIM viewer that runs in the browser and loads models from your file system. 

The viewer is built on **[xeokit](http://xeokit.io)**, and is bundled as part of the **[xeokit SDK](http://xeokit.io)**.

The viewer is developed by [xeolabs](http://xeolabs.com) and [OpenProject](https://www.openproject.org/),  and is integrated within [OpenProject BIM 10.4](https://www.openproject.org/openproject-bim-10-4/) and later. 

The viewer can be used as a stand-alone JavaScript application. In combination with open source CLI model conversion tools, it represents a low-cost, high-performance way to get your IFC models on the Web, that allows you the freedom to convert and host your models on your own server or GitHub repository.

To view your models with this viewer: 

1. Fork the [xeokit-bim-viewer](https://github.com/xeokit/xeokit-bim-viewer) repository on GitHub.
1. Convert your IFC STEP files using [open source CLI tools](https://github.com/xeokit/xeokit-sdk/wiki/Creating-Files-for-Offline-BIM). 
3. Add your converted models to your fork's data directory.
4. Serve your fork using [GitHub Pages](https://pages.github.com/).

Then users can view your models in their browsers, with URLs like this:

[````https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys````](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys)


Read the documentation below to get started.

--- 

* [Source Code](https://github.com/xeokit/xeokit-bim-viewer)
* [API Docs](https://xeokit.github.io/xeokit-bim-viewer/docs)
* [xeokit SDK](http://xeokit.io)
 
---
 
## Contents

- [Features](#features)
- [Demos](#demos)
- [License](#license)
- [The Viewer Application](#the-viewer-application)
- [Model Database](#model-database)
  * [Viewer Configurations](#viewer-configurations)
  * [Viewer States](#viewer-states)
- [Programming API](#programming-api)
  * [Creating a Viewer](#creating-a-viewer)
  * [Configuring the Viewer](#configuring-the-viewer)
  * [Querying Projects, Models and Objects](#querying-projects--models-and-objects)
    + [Getting Info on Available Projects](#getting-info-on-available-projects)
    + [Getting Info on a Project](#getting-info-on-a-project)
    + [Getting Info on an Object](#getting-info-on-an-object)
  * [Loading Projects and Models](#loading-projects-and-models)
    + [Loading a Project](#loading-a-project)
    + [Loading a Model](#loading-a-model)
  * [Controlling Viewer State](#controlling-viewer-state)
  * [Saving and Loading BCF Viewpoints](#saving-and-loading-bcf-viewpoints)
- [Customizing Viewer Style](#customizing-viewer-style)
  * [Modal Busy Dialog](#modal-busy-dialog)
  * [Tooltips](#tooltips)
  * [Customizing Appearances of IFC Types](#customizing-appearances-of-ifc-types)
- [xeokit Components Used in the Viewer](#xeokit-components-used-in-the-viewer)
- [Building the Viewer](#building-the-viewer)
  * [Installing from NPM](#installing-from-npm)
  * [Building the Binary](#building-the-binary)
  * [Building the Documentation](#building-the-documentation)

---

## Features

* Uses [xeokit](https://xeokit.io) for efficient model loading and rendering.
* Works in all major browsers, including mobile.
* Loads models from the file system.
* Loads multiple models.
* Saves and loads BCF viewpoints
* 3D and 2D viewing modes.
* Interactively X-ray, highlight, show, hide and section objects. 
* Tree views of structure, layers and storeys.
* Full-precision geometry.
* Point clouds.
* Supports IFC2x3 and IFC4.
* Customize viewer appearance with your own CSS.
* JavaScript programming API for all viewer functions.

## Demos 

Click the links below to run some demos.

| Live Demo | Model Source |
|---|---|
| [Double-Precision Model](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=MAP) | [BIMData](https://bimdata.io) |
| [Point Cloud](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=MAPPointCloud)| [BIMData](https://bimdata.io) |
| [OTC Conference Center](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys) | [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/301) |
| [Revit Sample Project](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=RevitSamples&tab=models) | [Details](https://knowledge.autodesk.com/support/revit-products/getting-started/caas/CloudHelp/cloudhelp/2020/ENU/Revit-GetStarted/files/GUID-61EF2F22-3A1F-4317-B925-1E85F138BE88-htm.html) |
| [Holter Tower](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=HolterTower&tab=storeys)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/316) |
| [West Riverside Hospital](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=WestRiversideHospital&tab=models)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/308) |
| [Schependomlaan](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=Schependomlaan&tab=storeys)| [Details](https://github.com/openBIMstandards/DataSetSchependomlaan) |
| [Schependomlaan Ground Floor](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=Schependomlaan_selectedStorey&tab=storeys)| [Details](https://github.com/openBIMstandards/DataSetSchependomlaan) |
| [Duplex](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=Duplex&tab=storeys)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/274) |

## License

xeokit-bim-viewer is bundled within the [xeokit SDK](http://xeokit.io). See [Pricing](https://xeokit.io/index.html#pricing) for licensing options.

## The Viewer Application

The [````./app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/index.html) page provides a ready-to-use instance of xeokit-bim-viewer. We'll just call it *viewer* from now on.

The viewer loads projects and models from the [````./app/data````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory.

To view a project, load the viewer with the project's ID on the URL: 

[````https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=WestRiversideHospital````](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=WestRiversideHospital)

## Model Database

**This section aims to show you how how to add your own models to the viewer application.**
                 
Let's examine the structure of the [````./app/data````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory, where the viewer keeps its projects and models.   

Shown below is a portion of the ````./app/data```` directory. We'll describe it from the root directory downwards.
                                                   
Within the root, we have a directory for each project, along with a manifest of the projects in ````index.json````.

Within a project directory, we have a directory for each model in the project, along with a manifest of the models in ````index.json````.

Within a model directory, we have two files that comprise the model itself:

* ````geometry.xkt```` - the model's geometry, formatted as ````.XKT````, which is xeokit's native binary geometry format, and 
* ````metadata.json```` - the model's structural metadata, a JSON file containing the IFC element hierarchy.

````
.app/data/
└── projects
    ├── index.json
    ├── Duplex
    │   ├── index.json
    │   └── models
    │       └── design
    │           ├── geometry.xkt
    │           └── metadata.json
    └── WestRiversideHospital
          ├── index.json
          └── models
              ├── architecture
              │   ├── geometry.xkt
              │   └── metadata.json
              ├── structure
              │   ├── geometry.xkt
              │   └── metadata.json
              └── electrical
                  ├── geometry.xkt
                  └── metadata.json
````

The ````index.json```` at the root of ````./data```` is shown below. 

Within this file, the ````id```` of each project matches the name of that project's subdirectory. 

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

The ````index.json```` for the "WestRiversideHospital" project is shown below.
 
 Within this file, the ````id```` of each model matches the name of that model's subdirectory. Each model's ````name```` is the human-readable name that's displayed in the viewers Models tab.

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
        "saoEnabled": true
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

The optional ````viewerConfigs```` section specifies configurations for the viewer to set on itself as it loads the project. See the complete list of available viewer configurations in [Viewer Configurations](#viewer-configurations).

The optional ````viewerContent```` array specifies IDs of models that the viewer will load initially, right after it's applied the configurations. 

The optional ````viewerState```` section specifies how the viewer should set up the initial state of its UI, right after its loaded the initial models. See the complete list of available viewer states in [Viewer States](#viewer-states).

The ````geometry.xkt```` and ````metadata.json```` files for each model are created from an IFC file using open source CLI tools. Learn how to create those files in the [Creating  Files for Offline BIM](https://github.com/xeokit/xeokit-sdk/wiki/Creating-Files-for-Offline-BIM) tutorial.  

While not essential, you can learn about the format of an ````.xkt```` geometry file in [XKT Format](https://github.com/xeokit/xeokit-sdk/wiki/XKT-Format) specification. 

### Viewer Configurations

The table below lists the complete set of available configurations. Think of these as user preferences. These may be provided to the viewer within project info files, as described in [Model Database](#model-database), or set programmatically on the viewer with [````BIMViewer#setConfigs()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setConfigs), as described in [Configuring the Viewer](#configuring-the-viewer).  
 
| Property              | Type              | Range                 | Default Value     | Description                    |
|:----------------------|:------------------|:----------------------|:------------------|:----------------------------------|
| "backgroundColor"     | Array             |                       | ````[1.0,1.0,1.0]````   | Canvas background color           |     
| "cameraNear"          | Number            | ````[0.01-0.1]````    | ````0.05````      | Distance to the near clipping plane |
| "cameraFar"           | Number            | ````[1-10000]````     | ````3000.0````    | Distance to the far clipping plane |
| "smartPivot"          | Boolean           |                       | ````true````      | Enables a better pivot-orbiting experience when click-dragging on empty space in camera orbit mode.  |
| "saoEnabled"          | Boolean           |                       | ````true````      | Whether or not to enable Scalable Ambient Obscurance (SAO) |
| "saoBias"             | Number            | ````[0.0...10.0]````  | ````0.5````       | SAO bias          |
| "saoIntensity"        | Number            | ````[0.0...200.0]```` | ````100.0````     | SAO intensity factor |
| "saoScale"            | Number            | ````[0.0...1000.0]````| ````500.0````     | SAO scale factor |
| "saoKernelRadius"     | Number            | ````[0.0...200.0]```` | ````100.0````     | The maximum area that SAO takes into account when checking for possible occlusion |
| "saoBlur"             | Boolean           |                       | ````true````      | Whether Guassian blur is enabled for SAO |
| "edgesEnabled"        | Boolean           |                       | ````true````      | Whether or not to enhance edges on objects |
| "pbrEnabled"          | Boolean           |                       | ````false````     | Whether or not to enable Physically Based rendering (PBR) |
| "viewFitFOV"          | Number            | ````[10.0...70.0]```` | ````30````        | When fitting objects to view, this is the amount in degrees of how much they should fit the user's field of view |
| "viewFitDuration"     | Number            | ````[0..5]````        | ````0.5````       | When fitting objects to view with an animated transition, this is the duration of the transition in seconds |
| "perspectiveFOV"      | Number            | ````[10.0...70.0]```` | ````55````        | When in perspective projection, this is the field of view, in degrees, that the user sees |
| "objectColorSource"   | String            | "model", "viewer"     | "model"           | Where the colors for model objects will be loaded from |

### Viewer States

In [Model Database](#model-database) we saw how a project can specify directives for how the viewer should set up the initial state of its UI, right after the project has loaded. The table below lists the available directives.  These can also be set on the viewer using [````BIMViewer#setViewerState()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setViewerState). So far, we have:

| Property              | Type              | Range                 | Default Value     | Description                      |
|:----------------------|:------------------|:----------------------|:------------------|:----------------------------------|
| "focusObject"         | String            |                       |                   | ID of object to focus on        |     
| "tabOpen"             | String            |  "objects", "classes" or "storeys"  |                   | Which explorer tab to open           |     
| "expandObjectsTree"   | Number            |  [0..*]               | 0                 | How deep to expand the "objects" tree |
| "expandClassesTree"   | Number            |  [0..*]               | 0                 | How deep to expand the "classes" tree |
| "expandStoreysTree"   | Number            |  [0..*]               | 0                 | How deep to expand the "storeys" tree |
| "setCamera"           | { eye: Number[], look: Number[], up: Number[] } |  | 0        | Camera position |

## Programming API

**This section goes deeper into the viewer, describing how to instantiate a viewer, and how to use its JavaScript programming API.**

The viewer is implemented by the JavaScript [````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html) class, which provides a complete set of methods to programmatically control it.
 
Using these methods, we can: 

 * create and configure a viewer, 
 * query what models are available, 
 * load projects and models, 
 * interact with the 3D view, 
 * save and load BCF viewpoints,
 * control the various viewer tools, and 
 * drive the state of the viewer's UI.
 
### Creating a Viewer
 
In the example below, we'll create a [````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html), with a [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) through which it will load projects and models from the file system.  

We'll configure the ````Server```` to load that data from the [````./app/data````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory.
 
We'll also configure our ````BimViewer```` with DOM elements to hold the four parts of its UI, which are: 

1. the 3D canvas, 
2. the explorer panel containing the tree views, 
3. the toolbar, 
4. the NavCube, and 
4. the "backdrop" element, which covers everything in the UI to prevent interaction whenever the viewer is busy loading a model. 

  
````javascript
const server = new Server({
     dataDir: "./data"
 });

const myBIMViewer = new BIMViewer(server, {
     canvasElement: document.getElementById("myCanvas"),                // The 3D WebGL canvas
     explorerElement: document.getElementById("myExplorer"),            // Container for the explorer panel
     toolbarElement: document.getElementById("myToolbar"),              // Container for the toolbar
     navCubeCanvasElement: document.getElementById("myNavCubeCanvas"),  // Canvas for the NavCube
     busyModelBackdropElement: document.querySelector(".xeokit-busy-modal-backdrop") // Busy modal dialog backdrop element
});
````
 
Configuring the ````BIMViewer```` with separate places to locate its parts allows us to integrate them more flexibly into our web page.

In our [````app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) page, the HTML elements look like this:
 
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
 
See [````app/css/style.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/css/style.css) for how we've styled these elements. 

Also see [````css/BIMViewer.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/css/BIMViewer.css) for the CSS styles that BIMViewer applies to the elements it creates internally.  
 
### Configuring the Viewer
 
With our viewer created, let's use [````BIMViewer#setConfigs()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setConfigs) to configure it. 

We'll enable Scalable Ambient Obscurance and set the canvas background color to white:
 
````javascript
myBIMViewer.setConfigs({
    "saoEnabled":        "white",
    "backgroundColor":   [1.0, 1.0, 1.0]
});
````
 
See [Viewer Configurations](#viewer-configurations) for the list of available configurations.

### Querying Projects, Models and Objects

With our viewer created and configured, let's find out what content is available.

#### Getting Info on Available Projects

Let's query what projects are available. 
 
````javascript
myBIMViewer.getProjectsInfo((projectsInfo) => {
     console.log(JSON.stringify(projectsInfo, null, "\t"));
});
````
 
Internally, the viewer will call [````Server#getProjects()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getProjects) to get the projects info.
 
As described earlier in [Model Database](#model-database), the projects info is the JSON in [````./app/data/projects/index.json````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data/projects/index.json). We'll just log that info to the console.

The projects info will look similar to:
 
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

Now we know what projects are available, we'll get info on one of those projects.

````javascript
myBIMViewer.getProjectInfo("WestRiversideHospital", (projectInfo) => {
     console.log(JSON.stringify(projectInfo, null, "\t"));
});
````
Internally, the viewer will call [````Server#getProject()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getProject) to get that project info. Like before, we'll just log it to the console.

The project info will be the contents of [````./app/data/projects/WestRiversideHospital/index.json````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data/projects/WestRiversideHospital/index.json).

The project info will be similar to:
 
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
        "saoEnabled": true
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
* **````viewerConfigs````** - configurations for the viewer to apply when loading the project,
* **````viewerContent````** - which models the viewer should immediately load when loading the project, and
* **````viewerState````** - how the viewer should set up its UI after loading the project.


When we later load the project in section [Loading a Project](#loading_a_project), the viewer is going to pass the ````viewerConfigs```` to [````BIMViewer#setConfigs()````](https://xeokit.github.io/xeokit-sdk/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setConfigs), which we described earlier in [Configuring the Viewer](#configuring-the-viewer). 

In the ````viewerConfigs```` we're enabling the viewer's Scalable Ambient Obscurance effect, which will create ambient shadows in the crevices of our models. This is an expensive effect for the viewer to render, so we've disabled it for the "electrical" model, which contains many long, thin wire objects that don't show the SAO effect well.

#### Getting Info on an Object

Let's attempt to get some info on an object within one of our project's models.

We say "attempt" because it's up to the [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) to try to find that info for us, which might not exist. 

Internally, the viewer will call [````Server#getObjectInfo()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getObjectInfo), which will attempt to load that object info from a file. 

If you were to substitute ````Server```` with your own implementation, your implementation might get that info from a data store, such as a relational database, populated with metadata for all the objects in your project's models, keyed to their IDs. 
 
We'll go ahead and assume that our ````Server```` has info an an object. 

````javascript
myViewer.getObjectInfo("WestRiversideHospital", "architectural", "2HaS6zNOX8xOGjmaNi_r6b", 
    (objectInfo) => {
        console.log(JSON.stringify(objectInfo, null, "\t"));
    },
    (errMsg) => {
         console.log("Oops! There was an error getting info for this object: " + errMsg);
    });
````

If the object does not exist in the specified project and model, the method will invoke its error callback.

Our file system database does happen to have info for that object, stored in [````./app/data/projects/WestRiversideHospital/models/architectural/objects/2HaS6zNOX8xOGjmaNi_r6b.json````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data/projects/WestRiversideHospital/models/architectural/objects/2HaS6zNOX8xOGjmaNi_r6b.json).

Since our object info exists, we'll get a result similar to this: 

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

> By now, you've probably noticed that our file system database is structured to support [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) URIs, which our [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) constructs from the project, model and object IDs we supplied to the viewer's query methods. 
       
### Loading Projects and Models
 
Let's now load some of the projects and models that we queried in the previous section.

#### Loading a Project

Let's start by loading the project we just queried info on. 

````javascript
myBIMViewer.loadProject("WestRiversideHospital", 
    () => {
         console.log("Nice! The project loaded successfully.");
    },
    (errMsg) => {
         console.log("Oops! There was an error loading this project: " + errMsg);
    });
````

If that succeeds, the viewer will now have two models loaded, ````"architectural"```` and ````"structure"````, since those are specified in the project info's ````viewerContent````.

The viewer will also enable Scalable Ambient Obscurance, since that's specified by the ````saoEnabled```` property in the ````viewerConfigs````. The viewer will also set various other configs on itself, as specified in that section.

The viewer will also open its "Models" tab, thanks to the ````tabOpen```` property in the project info's ````viewerState```` section. 

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

We could start by getting the IDs of all the models in our project, just to make sure the model is available:

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

When we no longer need the project, unload like so:

````javascript
myBIMViewer.unloadProject();
````

Note that we can only load one project at a time.


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

### Saving and Loading BCF Viewpoints

[Bim Collaborative Format](https://en.wikipedia.org/wiki/BIM_Collaboration_Format) (BCF) is a format for managing issues on a BIM project. A BCF record captures the visual state of a BIM viewer, which includes the camera position, the visibility and selected states of the objects, and any section planes that are currently active. 

A BCF record saved from one BIM viewer can be loaded into another viewer, to synchronize the visual states of both viewers.

Note that BCF viewpoints do not record which models are currently loaded. It's assumed that both the source and target viewers have the same models loaded.

Use the [````BIMViewer#saveBCFViewpoint()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-saveBCFViewpoint) to save a JSON BCF record of the current view: 

````javascript
const viewpoint = bimViewer.saveBCFViewpoint({
    // Options - see BIMViewer#saveBCFViewpoint() documentation for details
});
````

Our viewpoint JSON will look similar to below. Before saving this viewpoint, we've hidden one object, selected another object, and created section plane to slice our model. The viewpoint also contains a PNG snapshot of the viewer's canvas, which we've truncated here for brevity.

````
{
    perspective_camera: {
        camera_view_point: { x: 0.0, y: 0.0, z: 0.0 },
        camera_direction: { x: 1.0, y: 1.0, z: 2.0 },
        camera_up_vector: { x: 0.0, y: 0.0, z: 1.0 },
        field_of_view: 90.0
    },
    lines: [],
    clipping_planes: [{
        location: { x: 0.5, y: 0.5, z: 0.5 },
        direction: { x: 1.0, y: 0.0, z: 0.0 }
    }],
    bitmaps: [],
    snapshot: {
        snapshot_type: png,
        snapshot_data: "data:image/png;base64,......"
    },
    components: {
        visibility: {
            default_visibility: false,
            exceptions: [{
                ifc_guid: 4$cshxZO9AJBebsni$z9Yk,
                originating_system: xeokit.io,
                authoring_tool_id: xeokit/v1.0
            }]
       },
        selection: [{
           ifc_guid: "4$cshxZO9AJBebsni$z9Yk",
        }]
    }
}
````

Use the [````BIMViewer#loadBCFViewpoint()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-loadBCFViewpoint) to load a JSON BCF record: 


````javascript
bimViewer.loadBCFViewpoint(viewpoint, {
    // Options - see BIMViewer#loadBCFViewpoint() documentation for details
});
````

## Customizing Viewer Style

The [````app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) file for the standalone viewer contains CSS rules for the various viewer elements, which you can modify as required.

### Modal Busy Dialog

The viewer displays a modal dialog box whenever we load a model. The dialog box has a backdrop element, which overlays the viewer. Whenever the dialog becomes visible, the backdrop will block interaction events on the viewer's UI. 

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

TODO: Correct this section - viewer can load from model and viewer

The viewer loads colors for the various IFC element types straight from the IFC model, except where overrides are defined in the configuration file [````./src/IFCObjectDefaults/ViewerIFCObjectColors.js````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/src/IFCObjectDefaults/ViewerIFCObjectColors.js).

You can add or remove configurations in that file if you need to customize the color and pickability of specific IFC types.

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

## xeokit Components Used in the Viewer

The viewer is built on various [xeokit SDK](http://xeokit.io) components and plugins that are designed to accelerate the development of BIM and CAD visualization apps. 

The table below lists the main ones used in this viewer. 

| Component              | Purpose          | 
|:-----------------------|:------------------|
| [````Viewer````](https://xeokit.github.io/xeokit-sdk/docs/class/src/viewer/Viewer.js~Viewer.html) | The WebGL-based viewer at the heart of ````BIMViewer````. |
| [````XKTLoaderPlugin````](https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js~XKTLoaderPlugin.html)  | Loads model geometry and metadata. |
| [````NavCubePlugin````](https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/NavCubePlugin/NavCubePlugin.js~NavCubePlugin.html)  | Navigation cube gizmo that allows us to rotate the scene and move the camera to look at it along a selected axis or diagonal. |
| [````TreeViewPlugin````](https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/TreeViewPlugin/TreeViewPlugin.js~TreeViewPlugin.html)  | Implements the Objects, Classes and Storeys tree views within the explorer panel. |
| [````SectionPlanesPlugin````](https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/SectionPlanesPlugin/SectionPlanesPlugin.js~SectionPlanesPlugin.html) | Manages interactive section planes, which are used to slice objects to reveal inner structures. |
| [````BCFViewpointsPlugin````](https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/BCFViewpointsPlugin/BCFViewpointsPlugin.js~BCFViewpointsPlugin.html) | Saves and loads BCF viewpoints. |
| [````ContextMenu````](https://xeokit.github.io/xeokit-sdk/docs/class/src/extras/ContextMenu/ContextMenu.js~ContextMenu.html)  | Implements the context menus for the explorer tree views and 3D canvas. |
 
## Building the Viewer

### Installing from NPM

To install the npm package:

````
npm i @xeokit/xeokit-bim-viewer
````

### Building the Binary

To build the ES6 module in ````/dist/xeokit-bim-viewer.es.js````:

````
npm run build
````

### Building the Documentation

To build the API documentation in ````/docs/````:

````
npm run docs
````


