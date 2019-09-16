import {Controller} from "../Controller.js";
import {SectionMode} from "./SectionMode.js";
import {BCFMode} from "./BCFMode.js";
import {ScreenshotAction} from "./ScreenshotAction.js";
import {ResetAction} from "./ResetAction.js";
import {HideMode} from "./HideMode.js";
import {FirstPersonMode} from "./FirstPersonMode.js";
import {OrbitMode} from "./OrbitMode.js";
import {OrthoMode} from "./OrthoMode.js";
import {PerspectiveMode} from "./PerspectiveMode.js";
import {NavCubeMode} from "./NavCubeMode.js";
import {FitAction} from "./FitAction.js";
import {XRayMode} from "./XRayMode.js";
import {MeasureDistanceMode} from "./MeasureDistanceMode.js";
import {MeasureAngleMode} from "./MeasureAngleMode.js";
import {SelectMode} from "./SelectMode.js";
import {PlanViews} from "./PlanViews.js";
import {QueryMode} from "./QueryMode.js";
import {AnnotateMode} from "./AnnotateMode.js";

/**
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class Toolbar extends Controller {

    /** @private */
    constructor(viewer, cfg = {}) {

        super(null, viewer);

        /** Resets the viewer.
         * @type {ResetAction}
         */
        this.reset = new ResetAction(this);

        /** Flies the camera to show the entire model in view, from the current viewing angle.
         * @type {FitAction}
         */
        this.fit = new FitAction(this);

        /**
         * Controls plan view mode.
         * @type {PlanViews}
         */
        this.planViews = new PlanViews(this);

        /**
         * Controls orbit mode.
         * @type {OrbitMode}
         */
        this.orbit = new OrbitMode(this);

        /**
         * Controls first person mode.
         * @type {FirstPersonMode}
         */
        this.firstPerson = new FirstPersonMode(this);

        /**
         * Controls perspective mode.
         * @type {PerspectiveMode}
         */
        this.perspective = new PerspectiveMode(this);

        /**
         * Controls orthographic mode.
         * @type {OrthoMode}
         */
        this.ortho = new OrthoMode(this);

        /** Click-to-hide mode.
         * @type {HideMode}
         */
        this.hide = new HideMode(this);

        /** Click-to-select mode.
         * @type {SelectMode}
         */
        this.select = new SelectMode(this);

        /** Click-to-query-element mode.
         * @type {QueryMode}
         */
        this.query = new QueryMode(this, {
            queryPanelId: cfg.queryPanelId
        });

        /** Click-to-xray mode.
         * @type {XRayMode}
         */
        this.xray = new XRayMode(this);

        /**
         * Distance measurement mode.
         * @type {MeasureDistanceMode}
         */
        this.distance = new MeasureDistanceMode(this, {
            containerId: cfg.containerId
        });

        /**
         * Angle measurement mode.
         * @type {MeasureAngleMode}
         */
        this.angle = new MeasureAngleMode(this, {
            containerId: cfg.containerId
        });

        /**
         * Controls section planes.
         * @type {SectionMode}
         */
        this.section = new SectionMode(this, {
            sectionPlanesOverviewCanvasId: cfg.sectionPlanesOverviewCanvasId
        });

        /**
         * Controls annotations.
         * @type {AnnotateMode}
         */
        this.annotate = new AnnotateMode(this, {
            containerId: cfg.containerId,
            annotationsPanelId: cfg.annotationsPanelId
        });

        /**
         * Manages BCF viewpoints.
         * @type {BCFMode}
         */
        this.bcf = new BCFMode(this, {
            bcfPanelId: cfg.bcfPanelId
        });

        /**
         * Controls screenshots.
         * @type {ScreenshotAction}
         */
        this.screenshot = new ScreenshotAction(this);

        /**
         * Controls the NavCube.
         * @type {NavCubeMode}
         */
        this.navCube = new NavCubeMode(this, {
            navCubeCanvasId: cfg.navCubeCanvasId
        });

        // Ensure mutual exclusion of various modes
        this._mutexActivation([this.planViews, this.orbit, this.firstPerson], true);
        this._mutexActivation([this.perspective, this.ortho], true);
        this._mutexActivation([this.query, this.xray, this.hide, this.select, this.distance, this.angle, this.section, this.annotate]);

        this.orbit.setActive(true);
        this.perspective.setActive(true);
        this.navCube.setActive(true);
    }
}

export {Toolbar};