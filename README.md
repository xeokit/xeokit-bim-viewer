# xeokit-bim-viewer

**xeokit-bim-viewer** is an open source BIM viewer for the Web. It uses the [xeokit SDK](http://xeokit.io) for hardware-accelerated graphics, and is cross-platform, cross-browser, and geared for visualizing large, real-world BIM models.

The viewer is developed by [xeolabs](http://xeolabs.com) and [OpenProject GmbH](https://www.openproject.org/), and is integrated  within OpenProject's BIM construction project management software. 

The viewer is also usable as a stand-alone viewer. Simply fork this repository, add your own models to the [````.app/data````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory, then host it via [GitHub Pages](https://help.github.com/en/github/working-with-github-pages/about-github-pages). You can also just download the repository to your own HTTP server and serve everything from there. 

To serve your own models with this viewer, all you need to do is convert their IFC STEP files using open source CLI tools and drop them into the viewer's data directory. Read the guide below for more info.  

The viewer is bundled with the [xeokit SDK](http://xeokit.io) - see the [xeokit licensing](https://xeokit.github.io/xeokit-licensing/) page for licensing details.

---
* [Homepage](https://xeokit.github.io/xeokit-bim-viewer/)
* [Source Code](https://github.com/xeokit/xeokit-bim-viewer)
* [API Docs](https://xeokit.github.io/xeokit-bim-viewer/docs)
* [xeokit SDK](http://xeokit.io)
 
[![Screenshot](https://github.com/xeokit/xeokit-bim-viewer/raw/master/images/xeokit-bim-viewer.png)](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys).

## Contents

- [Features](#features)
- [Demos](#demos)
- [License](#license)
- [Usage](#usage)
- [Configuration](#configuration)
- [Programming API](#programming-api)
  * [Model Database](#model-database)
    + [Adding your own models](#adding-your-own-models)
    + [Loading models from a custom source](#loading-models-from-a-custom-source)
  * [Customizing CSS](#customizing-css)
  * [Tooltips](#tooltips)
  * [Customizing Appearances of IFC Types](#customizing-appearances-of-ifc-types)
- [Building](#building)

## Features

* Uses [xeokit SDK](https://xeokit.io) for super fast loading and rendering of large models.
* Works in all major browsers, including mobile.
* Loads BIM geometry and metadata from the file system.
* Loads multiple models, at arbitrary position, scale and rotation.
* Configure custom appearances for IFC types.
* Supports IFC2x3 and IFC4.
* 3D and 2D viewing modes.
* Tree view with three hierarchy modes: containment, IFC type and storeys.
* X-ray, highlight, show, hide and slice objects. 
* Customize with your own CSS.
* JavaScript programming API - load models, move camera, show/hide/select/xray objects etc.
* Implemented in JavaScript (ES6), with no external dependencies (other than xeokit).

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

xeokit-bim-viewer is bundled with the xeokit SDK, which is provided under an [Affero GPL V3](https://github.com/xeokit/xeokit-sdk/blob/master/LICENSE.txt) dual-license, which allows free use for non-commercial purposes, with the option to buy a licence for commercial use. Please [see here](https://xeokit.github.io/xeokit-licensing/) for commercial licensing options.


## Creating a Viewer
 
In the example below, we'll create a [````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html), with a [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) through which it will load project and model data from the file system.  

We'll configure the ````Server```` to load the data from the [````.app/data````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory.
 
We also configure our ````BimViewer```` with DOM elements for the four parts of its UI: 

 * ````canvasElement```` - a ````<canvas>```` for the 3D canvas, 
 * ````explorerElement```` - a ````<div>```` to contain the explorer panel, 
 * ````toolbarElement```` - a ````<div>```` to contain the toolbar, 
 * ````navCubeCanvasElement```` - a ````<canvas>```` for the NavCube, and 
 * ````busyModelBackdropElement```` - an element to use as the backdrop for the busy-loading modal dialog, which will block events on the viewer while the dialog is showing. 
 
 Configuring the ````BIMViewer```` with separate places to locate these various elements allows flexible integration into your web page.
 
 For example:
  
````javascript
const server = new Server({
     dataDir: "./data"
 });

const bimViewer = new BIMViewer(server, {
    
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
 
## Configuring the Viewer
 
Configure your viewer using [BIMViewer#setConfigs](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setConfigs):
 
````javascript
myBIMViewer.setConfigs({
    "saoEnabled":        "false",
    "saoBias":           "0.5",
    "saoIntensity":      "0.5",
    "backgroundColor":   [1.0, 1.0, 1.0]
});
````
 
The available configurations are:
 
| Property     | Type      | Range      | Default Value | Description |
|:------------:|:---------:|:----------:|:-------------:|:-----------:|
| "cameraNear" | Number    | ````[0.01-0.1]```` | ````0.05````          | Distance to the near clipping plane |
| "cameraFar"  | Number    | ````[1-10000]````  | ````3000.0````        | Distance to the far clipping plane |
| "saoEnabled":| Boolean   |  - | ````false````         | Whether or not to enable Scalable Ambient Obscurance |

TODO


## Customizing Viewer Style

The [app/index.html](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) file for the standalone viewer contains CSS rules for the various viewer elements, which you can modify as required.

### Modal Busy Dialog

As mentioned above, the viewer displays a modal dialog box whenever we load a model. The dialog box has a backdrop element, which overlays the viewer. Whenever the dialog becomes visible, the backdrop will block interaction events on the viewer's UI. 

Within our [````app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) page, the main ````<div>```` is the backdrop element:
 
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
  
## Programming API
 
````BIMViewer```` provides a complete set of methods to programmatically control it.
 
Using these methods, we can query what models are available, load models, interact with the 3D view, control the various tools, and drive the UI itself.
 
Let's start off by querying what projects are available. Since we're using the default {@link Server}, this will be the JSON in ````./data/projects/index.json````. We'll just log that information to the console.
 
````javascript
myViewer.getProjectsInfo((projectsInfo) => {
     console.log(JSON.stringify(projectsInfo, null, "\t"));
});
````
 
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

Let's now query some info on a project.

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

## Building the Viewer 

Initialize:

````
sudo npm install
````

Building ES6 module in ````/dist/main.js````:

````
npm run build
````

Then, within ````index.hml````, we use the module like so:

````javascript
import {Server, ViewerUI} from "./dist/main.js";

const server = new Server({
    dataDir: "./data/"
});

const viewerUI = new ViewerUI(server, {
    //...
});
````
