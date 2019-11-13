import {Controller} from "../Controller.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";
import {ModelMemento} from "@xeokit/xeokit-sdk/src/viewer/scene/mementos/ModelMemento.js";
const tempVec3a = math.vec3();

class ResetAction extends Controller {

    /** @private */
    constructor(parent, cfg = {}) {

        super(parent, cfg);

        this._modelMementos = {};

        this.viewerUI.explorer.models.on("modelLoaded", (modelId) => {
            this._saveModelMemento(modelId);
        });

        this.viewerUI.explorer.models.on("modelUnloaded", (modelId) => {
            this._destroyModelMemento(modelId);
        });

        $("#reset").on('click', (event) => {
            this.reset();
            event.preventDefault();
        });

        this.on("enabled", (enabled) => {
            if (!enabled) {
                $("#reset").addClass("disabled");
            } else {
                $("#reset").removeClass("disabled");
            }
        });
    }

    reset() {
        const scene = this.viewer.scene;
        const modelIds = scene.modelIds;
        for (var i = 0, len = modelIds.length; i < len; i++) {
            const modelId = modelIds[i];
            this._restoreModelMemento(modelId);
        }
     //   this._restoreDefaultCamera(() => {
            this.fire("reset");
      //  });
    }

    _saveModelMemento(modelId) {
        const metaModel = this.viewer.metaScene.metaModels[modelId];
        if (!metaModel) {
            this.error("MetaModel not found: " + modelId);
            return;
        }
        const modelMemento = new ModelMemento();
        modelMemento.saveObjects(this.viewer.scene, metaModel);
        this._modelMementos[modelId] = modelMemento;
    }

    _restoreModelMemento(modelId) {
        const metaModel = this.viewer.metaScene.metaModels[modelId];
        if (!metaModel) {
            this.error("MetaModel not found: " + modelId);
            return;
        }
        const modelMemento = this._modelMementos[modelId];
        modelMemento.restoreObjects(this.viewer.scene, metaModel);
    }

    _destroyModelMemento(modelId) {
        delete this._modelMementos[modelId];
    }

    _restoreDefaultCamera(done) {
        const viewer = this.viewer;
        const scene = viewer.scene;
        const aabb = scene.getAABB(scene.visibleObjectIds);
        const diag = math.getAABB3Diag(aabb);
        const center = math.getAABB3Center(aabb, tempVec3a);
        const dist = Math.abs(diag / Math.tan(55.0 / 2));
        const camera = scene.camera;
        const dir = (camera.yUp) ? [1, -1, 1] : [1, 1, 1];
        const up = (camera.yUp) ? [-1, 1, -1] : [-1, 1, 1];
        viewer.cameraControl.pivotPos = center;
        viewer.cameraFlight.jumpTo({
            look: center,
            eye: [center[0] - (dist * dir[0]), center[1] - (dist * dir[1]), center[2] - (dist * dir[2])],
            up: up,
            orthoScale: diag * 1.3,
            projection: "perspective",
            duration: 1
        }, done);
    }
}

export {ResetAction};