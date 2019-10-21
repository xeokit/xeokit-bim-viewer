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

        this.viewerUI.toolbar.angle.clear();
        this.viewerUI.toolbar.distance.clear();
        this.viewerUI.toolbar.section.clear();
        this.viewerUI.toolbar.annotate.clearAnnotations();
        // this.toolbar.bcf.clearViewpoints();
      //  this.viewerUI.toolbar.planViews.quitPlanView();
        this.viewerUI.toolbar.firstPerson.setActive(false);
        this.viewerUI.toolbar.ortho.setActive(false);
        this.viewerUI.toolbar.query.setActive(false);
        this.viewerUI.toolbar.xray.setActive(false);
        this.viewerUI.toolbar.hide.setActive(false);
        this.viewerUI.toolbar.select.setActive(false);
        this.viewerUI.toolbar.distance.setActive(false);
        this.viewerUI.toolbar.angle.setActive(false);
        this.viewerUI.toolbar.section.setActive(false);
        this.viewerUI.toolbar.annotate.setActive(false);
        this.viewerUI.toolbar.bcf.setActive(false);

        this._objectsMemento.restoreObjects(this.viewer.scene);

        this._cameraMemento.restoreCamera(this.viewer.scene, () => {

        });
    }
}

export {ResetAction};