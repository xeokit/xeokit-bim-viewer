import {Server} from "./src/server/Server.js";
import {BIMViewer} from "./src/BIMViewer.js";
import {LocaleService} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";
import BimViewerWebComponent from "./src/webComponent/webComponent.js";

customElements.define('xeokit-bim-viewer', BimViewerWebComponent); 
export {BIMViewer};
export {Server};
export {LocaleService};

