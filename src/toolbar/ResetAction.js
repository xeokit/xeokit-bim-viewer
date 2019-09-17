import {Controller} from "../Controller.js";
import {ObjectsMemento} from "../../lib/xeokit/viewer/scene/mementos/ObjectsMemento.js";
import {CameraMemento} from "../../lib/xeokit/viewer/scene/mementos/CameraMemento.js";

/**
 * Resets the viewer.
 *
 * Located at {@link Toolbar#reset}.
 */
class ResetAction extends Controller {

    /** @private */
    constructor(parent, cfg={}) {

        super(parent, cfg);

        this._cameraMemento = new CameraMemento();

        this._objectsMemento = new ObjectsMemento();

        this._saved = false;
    }

    /** @private */
    saveState() {

        this._cameraMemento.saveCamera(this.viewer.scene);
        this._objectsMemento.saveObjects(this.viewer.scene);

        this._saved = true;
    }

    /**
     * Resets the viewer.
     */
    reset() {

        if (!this._saved) {
            this.error("State not saved");
            return;
        }

        // TODO: Restore camera to standard view-fit position?
        // TODO: Capture objects after each model load?

        this.toolbar.angle.clear();
        this.toolbar.distance.clear();
        this.toolbar.section.clear();
        this.toolbar.annotate.clearAnnotations();
        // this.toolbar.bcf.clearViewpoints();
        this.toolbar.planViews.quitPlanView();
        this.toolbar.firstPerson.setActive(false);
        this.toolbar.ortho.setActive(false);
        this.toolbar.query.setActive(false);
        this.toolbar.xray.setActive(false);
        this.toolbar.hide.setActive(false);
        this.toolbar.select.setActive(false);
        this.toolbar.distance.setActive(false);
        this.toolbar.angle.setActive(false);
        this.toolbar.section.setActive(false);
        this.toolbar.annotate.setActive(false);
        this.toolbar.bcf.setActive(false);

        this._objectsMemento.restoreObjects(this.viewer.scene);

        this._cameraMemento.restoreCamera(this.viewer.scene, () => {

        });
    }
}

export {ResetAction};