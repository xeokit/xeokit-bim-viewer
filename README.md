# xeokit-bim-viewer

[![npm version](https://badge.fury.io/js/%40xeokit%2Fxeokit-bim-viewer.svg)](https://badge.fury.io/js/%40xeokit%2Fxeokit-bim-viewer) [![](https://data.jsdelivr.com/v1/package/npm/@xeokit/xeokit-bim-viewer/badge)](https://www.jsdelivr.com/package/npm/@xeokit/xeokit-bim-viewer)

[![Screenshot](https://github.com/xeokit/xeokit-bim-viewer/raw/master/images/xeokit-bim-viewer.png)](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys)

* [Run demo](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys)

---

**[xeokit-bim-viewer](https://github.com/xeokit/xeokit-bim-viewer)** is an open source 2D/3D BIM viewer that runs in the
browser and loads models from your file system.

The viewer is built on **[xeokit](http://xeokit.io)**, and is bundled as part of the **[xeokit SDK](http://xeokit.io)**.

The viewer is developed by [xeolabs](http://xeolabs.com) and [OpenProject](https://www.openproject.org/), and is
integrated within [OpenProject BIM 10.4](https://www.openproject.org/openproject-bim-10-4/) and later.

The viewer can be used as a stand-alone JavaScript application. In combination with open source CLI model conversion
tools, it represents a low-cost, high-performance way to get your IFC models on the Web, that allows you the freedom to
convert and host your models on your own server or GitHub repository.

To view your models with this viewer:

1. Fork the [xeokit-bim-viewer](https://github.com/xeokit/xeokit-bim-viewer) repository on GitHub.
1. Convert your IFC STEP files
   using [open source CLI tools](https://www.notion.so/xeokit/Viewing-an-IFC-Model-with-xeokit-c373e48bc4094ff5b6e5c5700ff580ee)
   .
3. Add your converted models to your fork's data directory.
4. Serve your fork using [GitHub Pages](https://pages.github.com/).

Then users can view your models in their browsers, with URLs like this:

[````https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys````](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=OTCConferenceCenter&tab=storeys)

Read the documentation below to get started.

--- 

* [Releases / Changelog](https://github.com/xeokit/xeokit-bim-viewer/releases)
* [Source Code](https://github.com/xeokit/xeokit-bim-viewer)
* [API Docs](https://xeokit.github.io/xeokit-bim-viewer/docs)
* [xeokit SDK](http://xeokit.io)

---

# Contents

- [Features](#features)
- [Demos](#demos)
- [License](#license)
- [The Viewer Application](#the-viewer-application)
- [Model Database](#model-database)
- [Viewer Configurations](#viewer-configurations)
    * [Viewer States](#viewer-states)
- [Deploying XKT V7 and Earlier](#deploying-xkt-v7-and-earlier)
- [Support for Multi-Part (Split) Models](#support-for-multi-part--split--models)
- [Split Model with Separate Metadata Files](#split-model-with-separate-metadata-files)
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
    * [Localizing a Viewer](#localizing-a-viewer)
- [xeokit Components Used in the Viewer](#xeokit-components-used-in-the-viewer)
- [Building the Viewer](#building-the-viewer)
    * [Installing from NPM](#installing-from-npm)
    * [Building the Binary](#building-the-binary)
    * [Building the Documentation](#building-the-documentation)

---

# Features

* Uses [xeokit](https://xeokit.io) for efficient model loading and rendering.
* Works in all major browsers, including mobile.
* Can load models from the file system.
* Loads multiple models.
* Saves and loads BCF viewpoints.
* 3D and 2D viewing modes.
* Interactively X-ray, highlight, show, hide and section objects.
* Tree views of structure, layers and storeys.
* Full-precision geometry.
* Point clouds.
* Supports IFC2x3 and IFC4.
* Customize viewer appearance with your own CSS.
* Localization support.
* JavaScript programming API for all viewer functions.

# Demos

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

# License

xeokit-bim-viewer is bundled within the [xeokit SDK](http://xeokit.io), which is licensed under the AGPL3. See
our [Pricing](https://xeokit.io/index.html#pricing) page for custom licensing options.

# The Viewer Application

The [````./app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/index.html) page provides a
ready-to-use instance of xeokit-bim-viewer. We'll just call it *viewer* from now on.

The viewer loads projects and models from
the [````./app/data/projects````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data/projects) directory.

To view a project, load the viewer with the project's ID on the URL:

[````https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=WestRiversideHospital````](https://xeokit.github.io/xeokit-bim-viewer/app/index.html?projectId=WestRiversideHospital)

# Model Database

> **This section shows how to add your own models to the viewer application. These instructions rely on the most
> recent versions of XKT (V8 or later) and the conversion tools, which you can learn about
in  *[Viewing an IFC Model with xeokit](https://www.notion.so/xeokit/Viewing-an-IFC-Model-with-xeokit-c373e48bc4094ff5b6e5c5700ff580ee)*
.**

Let's examine the structure of
the [````./app/data/projects````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory, where the
viewer keeps its projects and models.

Shown below is a portion of the ````./app/data/projects```` directory. We'll describe it from the root directory
downwards.

Within the root, we have a directory for each project, along with a manifest of the projects in ````index.json````.

Within a project directory, we have a directory for each model in the project, along with a manifest of the models
in ````index.json````.

Within a model directory, we have the ````.XKT```` file which contains the model's geometry and metadata.

````
.app/data/projects
  │
  ├── index.json
  │
  ├── Duplex
  │     │
  │     ├── index.json
  │     │
  │     └── models
  │           └── design
  │                   └── geometry.xkt
  │
  └── WestRiversideHospital
        │
        ├── index.json
        │
        └── models
              ├── architecture             
              │       └── geometry.xkt
              ├── structure            
              │       └── geometry.xkt
              └── electrical
                      └── geometry.xkt                  
````

The ````index.json```` at the root of ````./app/data/projects```` is shown below.

Within this file, the ````id```` of each project matches the name of that project's subdirectory.

````json
{
  "projects": [
    {
      "id": "Duplex",
      "name": "Duplex"
    },
    {
      "id": "WestRiversideHospital",
      "name": "West Riverside Hospital"
    }
    //..
  ]
}
````

The ````index.json```` for the "WestRiversideHospital" project is shown below.

Within this file, the ````id```` of each model matches the name of that model's subdirectory. Each model's ````name````
is the human-readable name that's displayed in the viewers Models tab.

````json
{
  "id": "WestRiversideHospital",
  "name": "West Riverside Hospital Project",
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
    "backgroundColor": [
      0.9,
      0.9,
      1.0
    ]
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

The optional ````viewerConfigs```` section specifies configurations for the viewer to set on itself as it loads the
project. See the complete list of available viewer configurations in [Viewer Configurations](#viewer-configurations).

The optional ````viewerContent```` array specifies IDs of models that the viewer will load initially, right after it's
applied the configurations.

The optional ````viewerState```` section specifies how the viewer should set up the initial state of its UI, right after
its loaded the initial models. See the complete list of available viewer states in [Viewer States](#viewer-states).

The ````geometry.xkt```` file for each model is created from an IFC file using open source CLI tools. Learn how to
create those files
in *[Viewing an IFC Model with xeokit](https://www.notion.so/xeokit/Viewing-an-IFC-Model-with-xeokit-c373e48bc4094ff5b6e5c5700ff580ee)*
.

# Viewer Configurations

The table below lists the complete set of available configurations. Think of these as user preferences. These may be
provided to the viewer within project info files, as described in [Model Database](#model-database), or set
programmatically on the viewer
with [````BIMViewer#setConfigs()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setConfigs)
, as described in [Configuring the Viewer](#configuring-the-viewer).

| Property               | Type    | Range                  | Default Value         | Description                                                                                                                                                                                                                                                                                                    |
|:-----------------------|:--------|:-----------------------|:----------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| "backgroundColor"      | Array   |                        | ````[1.0,1.0,1.0]```` | Canvas background color                                                                                                                                                                                                                                                                                        |     
| "cameraNear"           | Number  | ````[0.01-0.1]````     | ````0.05````          | Distance to the near clipping plane                                                                                                                                                                                                                                                                            |
| "cameraFar"            | Number  | ````[1-100000000]````  | ````3000.0````        | Distance to the far clipping plane                                                                                                                                                                                                                                                                             |
| "smartPivot"           | Boolean |                        | ````true````          | Enables a better pivot-orbiting experience when click-dragging on empty space in camera orbit mode.                                                                                                                                                                                                            |
| "saoEnabled"           | Boolean |                        | ````true````          | Whether or not to enable Scalable Ambient Obscurance (SAO)                                                                                                                                                                                                                                                     |
| "saoBias"              | Number  | ````[0.0...10.0]````   | ````0.5````           | SAO bias                                                                                                                                                                                                                                                                                                       |
| "saoIntensity"         | Number  | ````[0.0...200.0]````  | ````100.0````         | SAO intensity factor                                                                                                                                                                                                                                                                                           |
| "saoScale"             | Number  | ````[0.0...1000.0]```` | ````500.0````         | SAO scale factor                                                                                                                                                                                                                                                                                               |
| "saoKernelRadius"      | Number  | ````[0.0...200.0]````  | ````100.0````         | The maximum area that SAO takes into account when checking for possible occlusion                                                                                                                                                                                                                              |
| "saoBlur"              | Boolean |                        | ````true````          | Whether Guassian blur is enabled for SAO                                                                                                                                                                                                                                                                       |
| "edgesEnabled"         | Boolean |                        | ````true````          | Whether or not to enhance edges on objects                                                                                                                                                                                                                                                                     |
| "pbrEnabled"           | Boolean |                        | ````false````         | Whether or not to enable Physically Based rendering (PBR)                                                                                                                                                                                                                                                      |
| "viewFitFOV"           | Number  | ````[10.0...70.0]````  | ````30````            | When fitting objects to view, this is the amount in degrees of how much they should fit the user's field of view                                                                                                                                                                                               |
| "viewFitDuration"      | Number  | ````[0..5]````         | ````0.5````           | When fitting objects to view with an animated transition, this is the duration of the transition in seconds                                                                                                                                                                                                    |
| "perspectiveFOV"       | Number  | ````[10.0...70.0]````  | ````55````            | When in perspective projection, this is the field of view, in degrees, that the user sees                                                                                                                                                                                                                      |
| "objectColors"         | Object  |                        | ````undefined````     | A map of custom attributes for various IFC types                                                                                                                                                                                                                                                               |
| "externalMetadata"     | Boolean |                        | ````false````         | Whether to load a metadata.json file with each geometry.xkt file                                                                                                                                                                                                                                               |
| "xrayPickable"         | Boolean |                        | ````false````         | Whether we can interact with X-rayed objects using mouse/touch input                                                                                                                                                                                                                                           |
| "selectedGlowThrough"  | Boolean |                        | ````true````          | Whether selected objects appear to "glow through" other objects                                                                                                                                                                                                                                                |
| "highlightGlowThrough" | Boolean |                        | ````true````          | Whether highlighted objects appear to "glow through" other objects                                                                                                                                                                                                                                             |
| "dtxEnabled"           | Boolean |                        | ````false````         | Whether to enable xeokit's data texture-based (DTX) scene representation and rendering mode. This has a lower memory footprint than the standard vertex buffer object-based (VBO) mode, and loads fast, but may be slower on low-spec GPUs.                                                                    |
| "showSpaces"           | Boolean |                        | ````false````         | Whether to enable the visibility of IfcSpace elements. When this is ````false````, then even though we can instruct BIMViewer to make IfcSpaces visible in the tree view or context menus, they will remain invisible. This config is also dynamically controlled by the "Show IfcSpaces" tool in the toolbar. |

## Viewer States

In [Model Database](#model-database) we saw how a project can specify directives for how the viewer should set up the
initial state of its UI, right after the project has loaded. The table below lists the available directives. These can
also be set on the viewer
using [````BIMViewer#setViewerState()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setViewerState)
. So far, we have:

| Property              | Type              | Range                 | Default Value     | Description                      |
|:----------------------|:------------------|:----------------------|:------------------|:----------------------------------|
| "focusObject"         | String            |                       |                   | ID of object to focus on        |     
| "tabOpen"             | String            |  "objects", "classes" or "storeys"  |                   | Which explorer tab to open           |     
| "expandObjectsTree"   | Number            |  [0..*]               | 0                 | How deep to expand the "objects" tree |
| "expandClassesTree"   | Number            |  [0..*]               | 0                 | How deep to expand the "classes" tree |
| "expandStoreysTree"   | Number            |  [0..*]               | 0                 | How deep to expand the "storeys" tree |
| "setCamera"           | { eye: Number[], look: Number[], up: Number[] } |  | 0        | Camera position |

# Deploying XKT V7 and Earlier

> **This section describes how to deploy models that use older versions of XKT that don't combine geometry and metadata.
For those older versions,
> we need a little extra plumbing to deploy an additional JSON metadata file for each model.**

The previous section described how to deploy models that used XKT V8 and later. The XKT V8+ format combines geometry and
metadata into the same XKT file, and was introduced in the
[xeokit v1.9 release](https://www.notion.so/xeokit/What-s-New-in-xeokit-1-9-b7503ca7647e43e4b9c76e1505fa4484).

XKT versions prior to V8 only contained geometry, and needed to be accompanied by a JSON file that contained the model's
IFC metadata. In this section, we'll describe how to deploy models that use XKT versions prior to V8.

Let's imagine that we want to deploy the Duplex and West Riverside Hospital projects, using XKT V7. For each model
within our database, we'll deploy a ````geometry.xkt````, which is an XKT V7 file containing the model's geometry, and
a ````metadata.json ````, containing IFC metadata for the model.

We'll just assume that you've got those files already, and are not ready to convert their original IFC files into XKT
V8+.

Here's our database files again, this time with XKT V7 and accompanying metadata files:

````
.app/data/projects
  │
  ├── index.json
  │
  ├── Duplex
  │     │
  │     ├── index.json
  │     │
  │     └── models
  │           └── design
  │                   ├── geometry.xkt
  │                   └── metadata.json
  │
  └── WestRiversideHospital
        │
        ├── index.json
        │
        └── models
              ├── architecture             
              │       ├── geometry.xkt
              │       └── metadata.json
              ├── structure            
              │       ├── geometry.xkt
              │       └── metadata.json
              └── electrical
                      ├── geometry.xkt 
                      └── metadata.json                 
````

To make BIMViewer load both the ````geometry.xkt```` and ````metadata.json```` files for each model, we need to add a
new  ````externalMetadata: true```` configuration to the ````viewerConfigs```` in the project's ````index.json```` file:

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
    "externalMetadata": true, // <<------------ ADD THIS
    "backgroundColor": [
      0.9,
      0.9,
      1.0
    ]
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

# Support for Multi-Part (Split) Models

Since xeokit-bim-viewer 2.4, we can deploy models that are split into multiple XKT files (with optional external JSON
metadadata files).

The `ifc2gltf` tool from Creoox, which converts IFC files into glTF geometry and JSON metadata files, has the option to
split its output into multiple pairs of glTF and JSON files, accompanied by a JSON manifest that lists the files.

To integrate with that option, the `convert2xkt` tool, which converts glTF geometry and JSON metadata files into XKT
files, also has the option to batch-convert the glTF+JSON files in the manifest, in one invocation.

When we use this option, convert2xkt will output a bunch of XKT files, along with a JSON manifest file that lists those
XKT files.

This feature extends BIMViewer with the option to load models comprised of multiple XKT files, combining the XKT files into a single tree view for each model, and enabling the unloading of the model to unload all its XKT files in one shot. In other words, instead of having a separate model and tree view for each XKT, we can now group a bunch of XKT files together to behave as one model in BIMViewer.

Learn more about the conversion of IFC models into multiple XKT files in [this tutorial](https://www.notion.so/xeokit/Importing-Huge-IFC-Models-as-Multiple-XKT-Files-165fc022e94742cf966ee50003572259).

To show how to deploy one of these multi-XKT models in BIMViewer, let's examine the Karhumaki project.

---
* [Load the Karhumaki Project in BIMViewer](https://xeokit.io/demo.html?projectId=Karhumaki)
---

````
.app/data/projects
  │
  ├── index.json
  │
  └── Karhumaki
        │
        ├── index.json
        │
        └── models
              └──  KarhumakiBridge 
                      ├── manifest.json 
                      ├── model.xkt                             
                      ├── model_1.xkt
                      ├── model_2.xkt
                      ├── model_3.xkt
                      ├── model_4.xkt
                      ├── model_5.xkt
                      ├── model_6.xkt
                      ├── model_7.xkt
                      ├── model_8.xkt
                      └── model_9.xkt                      
````

The `manifest.json` XKT manifest looks like this:

````json
{
  "xktFiles": [
    "model.xkt",
    "model_1.xkt",
    "model_2.xkt",
    "model_3.xkt",
    "model_4.xkt",
    "model_5.xkt",
    "model_6.xkt",
    "model_7.xkt",
    "model_8.xkt",
    "model_9.xkt"
  ]
}
````

The ````index.json```` for the "Karhumaki" project is shown below.

Within this file, as usual, the ````id```` of each model matches the name of that model's subdirectory. Each model's ````name```` is the human-readable name that's displayed in the viewers Models tab.

To indicate that the model is a multi-part model, with multiple XKTs, the model entry gets a ````manifest```` property containing the file name of our `manifest.json` file.

In `viewerContent`, we specify that our multipart model gets loaded immediately, as soon as the project is loaded.

````json
{
  "id": "Karhumaki",
  "name": "Karhumaki",
  "models": [
    {
      "id": "Karhumaki-Bridge",
      "name": "Karhumaki Bridge",
      "manifest": "manifest.json"
    }
  ],
  "viewerConfigs": {
    "backgroundColor": [
      0.9,
      0.9,
      1.0
    ]
  },
  "viewerContent": {
    "modelsLoaded": [
      "Karhumaki-Bridge"
    ]
  },
  "viewerState": {
    "tabOpen": "models"
  }
}
````

# Split Model with Separate Metadata Files

In recent versions of xeokit, we combine the geometry and metadata into the XKT files, for simplicity within the pipeline, as we've done in the example above.

In older versions of XKT, as mentioned above, we would have the metadata in separate JSON files, so that each XKT file would have the geometry, and would be accompanied by a JSON file containing its IFC metadata.

BIMViewer, and the rest of the xeokit SDK, remains backwardly compatible with this XKT+JSON separation. The split-model loading feature also remains backwardly-compatible, as demonstrated in the "WestRiversideHospital_Combined" example project, described below.

---
* [Load the WestRiversideHospital_Combined Project in BIMViewer](https://xeokit.io/demo.html?projectId=WestRiversideHospital_Combined)
---

We have our separated XKT and JSON metadata files in the `models` directory:

````
.app/data/projects
  │
  ├── index.json
  │
  └── WestRiversideHospital_Combined
    ├── index.json
    │
    └── models
        │
        └── WestRiversideHospital
            ├── architectural.json
            ├── architectural.xkt
            ├── electrical.json
            ├── electrical.xkt
            ├── fireAlarms.json
            ├── fireAlarms.xkt
            ├── manifest.json
            ├── mechanical.json
            ├── mechanical.xkt
            ├── plumbing.json
            ├── plumbing.xkt
            ├── sprinklers.json
            ├── sprinklers.xkt
            ├── structure.json
            └── structure.xkt
````

The `manifest.json` XKT manifest looks as below. Notice the additional `metaModelFiles` property, which lists the JSON files that comprise the metamodel for the "WestRiversideHospital" model:

````
{
  "xktFiles": [
    "architectural.xkt",
    "electrical.xkt",
    "fireAlarms.xkt",
    "mechanical.xkt",
    "plumbing.xkt",
    "sprinklers.xkt",
    "structure.xkt"
  ],
  "metaModelFiles": [
    "architectural.json",
    "electrical.json",
    "fireAlarms.json",
    "mechanical.json",
    "plumbing.json",
    "sprinklers.json",
    "structure.json"
  ]
}
````

Finally, the ````index.json```` for the "WestRiversideHospital_Combined" project is shown below.

Within this file, as before, the ````id```` of each model matches the name of that model's subdirectory, and Each model's ````name```` is the human-readable name that's displayed in the viewers Models tab.

As before, to indicate that the model is a multi-part model, with multiple XKTs, the model entry gets a ````manifest```` property containing the file name of our `manifest.json` file.

In `viewerContent`, we specify that our multipart model gets loaded immediately, as soon as the project is loaded.

````json
{
    "id": "WestRiversideHospital_Combined",
    "name": "West Riverside Hospital",
    "models": [
        {
            "id": "WestRiversideHospital",
            "name": "West Riverside Hospital",
            "saoEnabled": true,
            "manifest": "manifest.json"
        }
    ],
    "viewerConfigs": {
        "backgroundColor": [0.9, 0.9, 1.0],
        "externalMetadata": true
    },
    "viewerContent": {
        "modelsLoaded": [
            "WestRiversideHospital"
        ]
    },
    "viewerState": {
        "viewCubeEnabled": true,
        "threeDEnabled": true,
        "tabOpen": "models"
    }
}
````

# Programming API

> **This section goes deeper into the viewer, describing how to instantiate a viewer, and how to use its JavaScript
programming API.**

The viewer is implemented by the
JavaScript [````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html)
class, which provides a complete set of methods to programmatically control it.

Using these methods, we can:

* create and configure a viewer,
* query what models are available,
* load projects and models,
* interact with the 3D view,
* save and load BCF viewpoints,
* control the various viewer tools, and
* drive the state of the viewer's UI.

## Creating a Viewer

In the example below, we'll create
a [````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html), with
a [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) through which
it will load projects and models from the file system.

We'll configure the ````Server```` to load that data from
the [````./app/data````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data) directory.

We'll also configure our ````BimViewer```` with DOM elements to hold the four parts of its UI, which are:

1. the 3D canvas,
2. the explorer panel containing the tree views,
3. the toolbar,
4. the NavCube, and
4. the "backdrop" element, which covers everything in the UI to prevent interaction whenever the viewer is busy loading
   a model.

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

Configuring the ````BIMViewer```` with separate places in the document to locate its parts allows us to integrate them
more flexibly into our web page.

In our [````app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) page, the HTML
elements look like this:

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

See [````app/css/style.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/css/style.css) for how we've
styled these elements.

Also
see [````dist/xeokit-bim-viewer.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/dist/xeokit-bim-viewer.css)
for the CSS styles that BIMViewer applies to the elements it creates internally.

## Configuring the Viewer

With our viewer created, let's
use [````BIMViewer#setConfigs()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setConfigs)
to configure it.

We'll just set the canvas background color to white:

````javascript
myBIMViewer.setConfigs({
    "backgroundColor": [1.0, 1.0, 1.0]
});
````

See [Viewer Configurations](#viewer-configurations) for the list of available configurations.

## Querying Projects, Models and Objects

With our viewer created and configured, let's find out what content is available.

### Getting Info on Available Projects

Let's query what projects are available.

````javascript
myBIMViewer.getProjectsInfo((projectsInfo) => {
    console.log(JSON.stringify(projectsInfo, null, "\t"));
});
````

Internally, the viewer will
call [````Server#getProjects()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getProjects)
to get the projects info.

As described earlier in [Model Database](#model-database), the projects info is the JSON
in [````./app/data/projects/index.json````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data/projects/index.json)
. We'll just log that info to the console.

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

### Getting Info on a Project

Now we know what projects are available, we'll get info on one of those projects.

````javascript
myBIMViewer.getProjectInfo("WestRiversideHospital", (projectInfo) => {
    console.log(JSON.stringify(projectInfo, null, "\t"));
});
````

Internally, the viewer will
call [````Server#getProject()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getProject)
to get that project info. Like before, we'll just log it to the console.

The project info will be the contents
of [````./app/data/projects/WestRiversideHospital/index.json````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data/projects/WestRiversideHospital/index.json)
.

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
    "backgroundColor": [
      0.9,
      0.9,
      1.0
    ],
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

When we later load the project in section [Loading a Project](#loading_a_project), the viewer is going to pass
the ````viewerConfigs````
to [````BIMViewer#setConfigs()````](https://xeokit.github.io/xeokit-sdk/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-setConfigs)
, which we described earlier in [Configuring the Viewer](#configuring-the-viewer).

In the ````viewerConfigs```` we're enabling the viewer's Scalable Ambient Obscurance effect, which will create ambient
shadows in the crevices of our models. This is an expensive effect for the viewer to render, so we've disabled it for
the "electrical" model, which contains many long, thin wire objects that don't show the SAO effect well.

### Getting Info on an Object

Let's attempt to get some info on an object within one of our project's models.

We say "attempt" because it's up to
the [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) to try to
find that info for us, which might not exist.

Internally, the viewer will
call [````Server#getObjectInfo()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html#instance-method-getObjectInfo)
, which will attempt to load that object info from a file.

If you were to substitute ````Server```` with your own implementation, your implementation might get that info from a
data store, such as a relational database, populated with metadata for all the objects in your project's models, keyed
to their IDs.

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

Our file system database does happen to have info for that object, stored
in [````./app/data/projects/WestRiversideHospital/models/architectural/objects/2HaS6zNOX8xOGjmaNi_r6b.json````](https://github.com/xeokit/xeokit-bim-viewer/tree/master/app/data/projects/WestRiversideHospital/models/architectural/objects/2HaS6zNOX8xOGjmaNi_r6b.json)
.

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

> By now, you've probably noticed that our file system database is structured to
> support [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) URIs, which
> our [````Server````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/server/Server.js~Server.html) constructs
> from the project, model and object IDs we supplied to the viewer's query methods.

## Loading Projects and Models

Let's now load some of the projects and models that we queried in the previous section.

### Loading a Project

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

If that succeeds, the viewer will now have two models loaded, ````"architectural"```` and ````"structure"````, since
those are specified in the project info's ````viewerContent````.

The viewer will also enable Scalable Ambient Obscurance, since that's specified by the ````saoEnabled```` property in
the ````viewerConfigs````. The viewer will also set various other configs on itself, as specified in that section.

The viewer will also open its "Models" tab, thanks to the ````tabOpen```` property in the project
info's ````viewerState```` section.

We can confirm that the two models are loaded by querying the IDs of the models that are currently loaded in the viewer:

````javascript
const modelIds = myBIMViewer.getModelLoadedIds();

console.log(modelIds);
````

The result would be:

````json
[
  "architectural",
  "structure"
]
````

### Loading a Model

With our project loaded, let's load another of its models.

We could start by getting the IDs of all the models in our project, just to make sure the model is available:

````javascript
const modelIds = myBIMViewer.getModelIds();

console.log(modelIds);
````

The result would be:

````json
[
  "architectural",
  "structure",
  "electrical"
]
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

## Controlling Viewer State

[````BIMViewer````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html) has various
methods with which we can programmatically control the state of its UI.

Let's take a quick look at some of these methods to get an idea of what sort of UI state we can control with them. This
won't be an exhaustive guide - see the ````BIMViewer```` class documentation for the complete list.

Having loaded a couple of models in the previous section, let's open the viewer's Objects tab, which contains a tree
view of the containment hierarchy of the objects within those models:

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
myBIMViewer.flyToObject("1fOVjSd7T40PyRtVEklS6X", () => { /* Done */
});
````

TODO: Complete this section once API methods are finalized

## Saving and Loading BCF Viewpoints

[Bim Collaborative Format](https://en.wikipedia.org/wiki/BIM_Collaboration_Format) (BCF) is a format for managing issues
on a BIM project. A BCF record captures the visual state of a BIM viewer, which includes the camera position, the
visibility and selected states of the objects, and any section planes that are currently active.

A BCF record saved from one BIM viewer can be loaded into another viewer, to synchronize the visual states of both
viewers.

Note that BCF viewpoints do not record which models are currently loaded. It's assumed that both the source and target
viewers have the same models loaded.

Use
the [````BIMViewer#saveBCFViewpoint()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-saveBCFViewpoint)
to save a JSON BCF record of the current view:

````javascript
const viewpoint = bimViewer.saveBCFViewpoint({
    // Options - see BIMViewer#saveBCFViewpoint() documentation for details
});
````

Our viewpoint JSON will look similar to below. Before saving this viewpoint, we've hidden one object, selected another
object, and created section plane to slice our model. The viewpoint also contains a PNG snapshot of the viewer's canvas,
which we've truncated here for brevity.

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

Use
the [````BIMViewer#loadBCFViewpoint()````](https://xeokit.github.io/xeokit-bim-viewer/docs/class/src/BIMViewer.js~BIMViewer.html#instance-method-loadBCFViewpoint)
to load a JSON BCF record:

````javascript
bimViewer.loadBCFViewpoint(viewpoint, {
    // Options - see BIMViewer#loadBCFViewpoint() documentation for details
});
````

# Customizing Viewer Style

The [````app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) file for the
standalone viewer contains CSS rules for the various viewer elements, which you can modify as required.

## Modal Busy Dialog

The viewer displays a modal dialog box whenever we load a model. The dialog box has a backdrop element, which overlays
the viewer. Whenever the dialog becomes visible, the backdrop will block interaction events on the viewer's UI.

Within our [````app/index.html````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) page, the
main ````<div>```` is the backdrop element:

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

As defined in [````css/BIMViewer.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/css/BIMViewer.css),
the backdrop gets the following style, which allows the dialog to position itself correctly within the backdrop:

````css
.xeokit-busy-modal-backdrop {
    position: relative;
}
````

If you need to tweak CSS relating to the dialog, search for "xeokit-busy-dialog"
within [````css/BIMViewer.css````](https://github.com/xeokit/xeokit-bim-viewer/blob/master/css/BIMViewer.css).

## Tooltips

Tooltips are not part of the core JavaScript for the viewer. Instead, viewer HTML elements are marked
with ````data-tippy-content```` attributes that provide strings to show in their tooltips.

For example, the *Toggle 2D/3D* button's element looks like this:

````html

<button type="button" class="xeokit-threeD xeokit-btn fa fa-cube fa-2x" data-tippy-content="Toggle 2D/3D"></button>
```` 

In the [app/index.html](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/index.html) file for the standalone
viewer, we're using [tippy.js](https://github.com/atomiks/tippyjs), which automatically creates tooltips for those
elements.

## Customizing Appearances of IFC Types

By default, BIMViewer loads whatever object colors and opacities are in the XKT model files, without changing them.
Sometimes, however, certain types of objects may have colors that make it hard for us to view the model. 

For example, in some IFC models, ````IfcPlate```` types may be used to represent windows, and those types are often given opaque 
colors. That results in the windows of our model being opaque. For this example, we can make the windows transparent 
by configuring the BIMViewer, or just that model, with a custom color or opacity, for that ````IfcPlate```` type. That would make
all ````IfcPlate```` types transparent again. There are two ways we can do this - programmatically via ````BIMViewer.setConfigs````, or 
for each project individually, via the project's `index.json` file.

In the code below, we'll configure all ````IfcSpace````, ````IfcWindow````, ````IfcOpeningElement```` and ````IfcPlate```` types 
to be transparent, and while we're at it, we'll make ````IfcWindow```` types to be always blue. Note that all values are in range ````[0..1]````. 

---

 Note that prior to v2.4, BIMViewer did change the colors and opacities of `IfcOpening`, `IfcSpace`, `IfcWindow` and `IfcPlate` by 
 default. We've removed that in v2.4, because it was confusing 
 and users wondered why those object types did not have the colors/opacities defined for them in the model.

---

````javascript
// In case the model has opaque colors for IfcSpace, IfcWindow, IfcOpeningElement and IfcPlate 
// objects, let's make those objects always transparent. To make the model look extra nice,
// let's force IfcWindows to always be blue, while we're at it. This will apply to all models,
// except where we override the settings per-project, as shown next.

bimViewer.setConfigs({
      "objectColors": {
            "IfcSpace": {
                "opacity": 0.3
            },
            "IfcWindow": {
                "opacity": 0.4,
                "color": [0, 0, 1]
            },
            "IfcOpeningElement": {
                "opacity": 0.3
            },
            "IfcPlate": {
                "opacity": 0.3
            }
        }
});
````

The other way we can set these color/opacity customizations is per-project, within the ````viewerConfigs```` section of 
a project's ````index.json```` file. If we've also set them via ````BIMViewer.setConFigs````, then these will override 
the ones set via that method.

As an example, we've done this for the `OTCConferenceCenter` demo model, which otherwise has its windows opaque, which would make it hard 
for us to navigate around that model. Therefore, we provide a custom map of colors and opacities for certain IFC types via 
the ```viewerConfigs``` in the [project ````index.json```` for that model](https://github.com/xeokit/xeokit-bim-viewer/blob/master/app/data/projects/OTCConferenceCenter/index.json), as shown below.

````json
{
    "id": "otcConferenceCenter",
    "name": "OTC Conference Center",
    "models": [
        {
            "id": "design",
            "name": "OTC Conference Center Design"
        }
    ],
    "viewerConfigs": {
        "backgroundColor": [
            0.95,
            0.95,
            1.0
        ],
        "objectColors": {
            "IfcSpace": {
                "opacity": 0.3
            },
            "IfcWindow": {
                "opacity": 0.4
            },
            "IfcOpeningElement": {
                "opacity": 0.3
            },
            "IfcPlate": {
                "opacity": 0.3
            }
        }
    },
    "viewerContent": {
        "modelsLoaded": [
            "design"
        ]
    },
    "viewerState": {
        "tabOpen": "objects",
        "expandObjectsTree": 3,
        "expandClassesTree": 1,
        "expandStoreysTree": 1
    }
}
````


## Localizing a Viewer

The easiest way to localize a BIMViewer is by loading translation strings into its locale service, which is implemented
by a
xeokit [LocaleService](https://xeokit.github.io/xeokit-sdk/docs/class/src/viewer/localization/LocaleService.js~LocaleService.html)
.

The snippet below shows how it's done, using a partial set of the translations expected by the components
within the BIMViewer. We'll just show the translations for the faces of the NavCube. We'll also load the translations
inline, rather than fetch them from a separate JSON file, as we would in practice.

We call translations "messages". Our metaphor is that the UI "conveys messages to the user".

To see all the translations expected by a BIMViewer, take a look at the translations we've configured for the bundled
BIMViewer
demo application:  [````/app/locales/messages.js````](/app/locales/messages.js).

````javascript
myBIMViewer.localeService.loadMessages({
    "en": { // English
        "NavCube": {
            "front": "Front",
            "back": "Back",
            "top": "Top",
            "bottom": "Bottom",
            "left": "Left",
            "right": "Right"
        },
        //..
    },
    "mi": { // Māori
        "NavCube": {
            "front": "Mua",
            "back": "Tuarā",
            "top": "Runga",
            "bottom": "Raro",
            "left": "Mauī",
            "right": "Tika"
        },
        //..
    },
    "fr": { // French
        "NavCube": {
            "front": "Avant",
            "back": "Arrière",
            "top": "Supérieur",
            "bottom": "Inférieur",
            "left": "Gauche",
            "right": "Droit"
        },
        //..
    },
    "jp": { // Japanese
        "NavCube": {
            "front": "前部",
            "backLabel": "裏",
            "topLabel": "上",
            "bottomLabel": "底",
            "leftLabel": "左",
            "rightLabel": "右"
        },
        //..
    },
});
````

Once we've loaded our translations, we can switch the BIMViewer between locales like so:

````javascript
myBIMViewer.localeService.locale = "jp";
````

# xeokit Components Used in the Viewer

The viewer is built on various [xeokit SDK](http://xeokit.io) components and plugins that are designed to accelerate the
development of BIM and CAD visualization apps.

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

# Building the Viewer

## Installing from NPM

To install the npm package:

````
npm i @xeokit/xeokit-bim-viewer
````

## Building the Binary

Run the command below to build the ES6 module in ````/dist/xeokit-bim-viewer.es.js````.

````
npm run build
````

## Building the Documentation

To build the API documentation in ````/docs/````:

````
npm run docs
````





