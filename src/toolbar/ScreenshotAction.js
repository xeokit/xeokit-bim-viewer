import {Controller} from "../Controller.js";

/**
 * Manages screenshots.
 *
 * Located at {@link Toolbar#screenshot}.
 */
class ScreenshotAction extends Controller {

    /** @private */
    constructor(parent, cfg) {
        super(parent, cfg);
    }

    /** @private */
    destroy() {
        super.destroy();
    }
}

export {ScreenshotAction};