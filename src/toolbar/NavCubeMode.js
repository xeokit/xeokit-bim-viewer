import {Controller} from "../Controller.js";
import {NavCubePlugin} from "/node_modules/@xeokit/xeokit-sdk/src/plugins/NavCubePlugin/NavCubePlugin.js";

/**
 * @desc Controls the NavCube.
 *
 * Located at {@link Toolbar#navCube}.
 */
class NavCubeMode extends Controller {

    /** @private */
    constructor(parent, cfg) {
        super(parent, cfg);
        this._navCube = new NavCubePlugin(this.viewer, {
            canvasId: cfg.navCubeCanvasId,
            fitVisible: true
        });
        this._navCube.setVisible(this._active);
        this.on("active", (active) => {
            this._navCube.setVisible(active);
        });
    }

    /** @private */
    destroy() {
        this._navCube.destroy();
        super.destroy();
    }
}

export {NavCubeMode};