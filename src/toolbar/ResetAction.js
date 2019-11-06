import {Controller} from "../Controller.js";
import {CameraMemento} from "../../lib/xeokit/viewer/scene/mementos/CameraMemento.js";
import {ObjectsMemento} from "../../lib/xeokit/viewer/scene/mementos/ObjectsMemento.js";

class ResetAction extends Controller {

    /** @private */
    constructor(parent, cfg = {}) {

        super(parent, cfg);

        this._cameraMemento = new CameraMemento();
        this._objectsMemento = new ObjectsMemento();
        this._saved = false;

    }

    saveState() {
        this._cameraMemento.saveCamera(this.viewer.scene);
        this._objectsMemento.saveObjects(this.viewer.scene); // Save all states
        this._saved = true;
    }

    reset() {
        if (!this._saved) {
            this.error("State not saved");
            return;
        }
        this.fire("reset");
        this._objectsMemento.restoreObjects(this.viewer.scene);
        this._cameraMemento.restoreCamera(this.viewer.scene, () => {
        });
    }
}

export {ResetAction};