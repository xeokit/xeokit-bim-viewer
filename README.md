# xeokit-viewer

View 3D BIM models and share BCF issues in the browser.

* [West Riverside Hospital](https://xeokit.github.io/xeokit-viewer/index.html?project=WestRiversideHospital)
* [OTC Conference Center](https://xeokit.github.io/xeokit-viewer/index.html?project=OTCConferenceCenter)
* [Schependomlaan](https://xeokit.github.io/xeokit-viewer/index.html?project=Schependomlaan)
* [Duplex](https://xeokit.github.io/xeokit-viewer/index.html?project=Duplex)


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