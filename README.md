# xeokit-viewer

A minimal 3D BIM model viewer built on xeokit.

[![Screenshot](https://xeokit.github.io/xeokit-viewer/images/screenshot.png)](https://xeokit.github.io/xeokit-viewer/index.html?project=OTCConferenceCenter&tab=storeys)

## Demos 

* [West Riverside Hospital](https://xeokit.github.io/xeokit-viewer/index.html?project=WestRiversideHospital&tab=models)
* [OTC Conference Center](https://xeokit.github.io/xeokit-viewer/index.html?project=OTCConferenceCenter&tab=storeys)
* [Schependomlaan](https://xeokit.github.io/xeokit-viewer/index.html?project=Schependomlaan&tab=storeys)
* [Duplex](https://xeokit.github.io/xeokit-viewer/index.html?project=Duplex&tab=storeys)


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