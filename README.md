# xeokit-viewer

A minimal BIM model viewer built on xeokit. Work in progress!

[![Screenshot](https://xeokit.github.io/xeokit-viewer/images/screenshot.png)](https://xeokit.github.io/xeokit-viewer/index.html?project=OTCConferenceCenter&tab=storeys)

## Features

* Uses [xeokit SDK](https://xeokit.io) for fast loading and rendering of large models.
* Works in all major browsers, including mobile.
* Loads BIM geometry and metadata from the file system.
* Supports IFC2x3 and IFC4.
* Implemented in JavaScript (ES6), with no external library dependencies (other than xeokit).

## Demos 

| Live Demo | Model Source |
|---|---|
| [OTC Conference Center](https://xeokit.github.io/xeokit-viewer/index.html?project=OTCConferenceCenter&tab=storeys) | [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/301) |
| [Holter Tower](https://xeokit.github.io/xeokit-viewer/index.html?project=HolterTower&tab=storeys)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/316) |
| [West Riverside Hospital](https://xeokit.github.io/xeokit-viewer/index.html?project=WestRiversideHospital&tab=models)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/308) |
| [Schependomlaan](https://xeokit.github.io/xeokit-viewer/index.html?project=Schependomlaan&tab=storeys)| [Details](https://github.com/openBIMstandards/DataSetSchependomlaan) |
| [Duplex](https://xeokit.github.io/xeokit-viewer/index.html?project=Duplex&tab=storeys)| [Details](http://openifcmodel.cs.auckland.ac.nz/Model/Details/274) |



## Building 

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