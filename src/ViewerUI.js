import {Controller} from "./Controller.js";

import {Explorer} from "./explorer/Explorer.js";
import {Toolbar} from "./toolbar/Toolbar.js";

/**
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class ViewerUI extends Controller {

    /** @private */
    constructor(server, viewer, cfg = {}) {

        super(null, cfg, server, viewer);

        this.explorer = new Explorer(this, cfg);

        this.toolbar = new Toolbar(this, cfg);

        this.explorer.on("modelLoaded", (modelId) => {
            this.toolbar.reset.saveState();
        });

        this.explorer.on("modelUnloaded", (modelId) => {
            this.toolbar.reset.saveState();
        });
    }
}

export {ViewerUI};