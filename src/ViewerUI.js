import {BIMViewer} from "./BIMViewer.js";

/**
 * @desc Alias class for {@link BIMViewer}, for backwards compatibility.
 * @private
 */
class ViewerUI extends BIMViewer {
    constructor(server, cfg = {}) {
        super(server, cfg);

    }
}

export {ViewerUI};