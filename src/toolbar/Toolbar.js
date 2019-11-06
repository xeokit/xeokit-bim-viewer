import {Controller} from "../Controller.js";
import {SectionMode} from "./SectionMode.js";
import {BCFMode} from "./BCFMode.js";
import {HideMode} from "./HideMode.js";
import {FirstPersonMode} from "./FirstPersonMode.js";
import {OrthoMode} from "./OrthoMode.js";
import {NavCubeMode} from "./NavCubeMode.js";
import {FitAction} from "./FitAction.js";
import {SelectMode} from "./SelectMode.js";
import {QueryMode} from "./QueryMode.js";
import {ResetAction} from "./ResetAction.js";

/**
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class Toolbar extends Controller {

    /** @private */
    constructor(parent, cfg = {}) {

        super(parent, cfg);

        /** Resets the viewer to the state right after the most recent model was loaded.
         * @type {ResetAction}
         */
        this.reset = new ResetAction(this);

        /** Flies the camera to show the entire model in view, from the current viewing angle.
         * @type {FitAction}
         */
        this.fit = new FitAction(this);

        /**
         * Controls first person mode.
         * @type {FirstPersonMode}
         */
        this.firstPerson = new FirstPersonMode(this, {
            active: false
        });

        /**
         * Controls orthographic mode.
         * @type {OrthoMode}
         */
        this.ortho = new OrthoMode(this, {
            active: false
        });

        /** Click-to-hide mode.
         * @type {HideMode}
         */
        this.hide = new HideMode(this, {
            active: false
        });

        /** Click-to-select mode.
         * @type {SelectMode}
         */
        this.select = new SelectMode(this, {
            active: false
        });

        /** Click-to-query-element mode.
         * @type {QueryMode}
         */
        this.query = new QueryMode(this, {
            queryPanelId: cfg.queryPanelId,
            active: false
        });

        /**
         * Controls section planes.
         * @type {SectionMode}
         */
        this.section = new SectionMode(this, {
            sectionPlanesOverviewCanvasId: cfg.sectionPlanesOverviewCanvasId,
            active: false
        });

        /**
         * Manages BCF viewpoints.
         * @type {BCFMode}
         */
        this.bcf = new BCFMode(this, {
            bcfPanelId: cfg.bcfPanelId,
            active: false
        });

        /**
         * Controls the NavCube.
         * @type {NavCubeMode}
         */
        this.navCube = new NavCubeMode(this, {
            navCubeCanvasId: cfg.navCubeCanvasId,
            active: true
        });

        this._mutexActivation([this.query, this.hide, this.select, this.section, this.bcf]);

        this.firstPerson.setActive(false);
        this.ortho.setActive(false);
        this.navCube.setActive(true);
    }
}

export {Toolbar};