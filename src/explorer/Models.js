
import {Controller} from "../Controller.js";
import {XKTLoaderPlugin} from "/node_modules/@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";
import {math} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

const tempVec3 = math.vec3();

/**
 * @desc Manages models.
 *
 * Located at {@link Toolbar#models}.
 */
class Models extends Controller {

    constructor(parent, cfg) {
        super(parent, cfg);
        this._element = document.getElementById(cfg.modelsPanelId);
        this._xktLoader = new XKTLoaderPlugin(this.viewer);
        this._modelsInfo = {};
        this._numModelsLoaded = 0;
        this._repaint();

        $("#unloadAllModels").on('click', (event) => {
            this.unloadModels();
            event.preventDefault();
        });
    }

    _repaint() {
        const params = {};
        this.server.getModels(params, (modelsInfo) => {
        var h = "";
        for (var i = 0, len = modelsInfo.length; i < len; i++) {
            const modelInfo = modelsInfo[i];
            this._modelsInfo[modelInfo.id] = modelInfo;
            h += "<div class='form-check'>";
            h += "<label class='form-check-label'>";
            h += "<input id='" + modelInfo.id + "' type='checkbox' class='form-check-input' value=''>" + modelInfo.name;
            h += "</label>";
            h += "</div>";

        }
        this._element.innerHTML = h;
        for (var i = 0, len = modelsInfo.length; i < len; i++) {
            const modelInfo = modelsInfo[i];
            const modelId = modelInfo.id;
            const checkBox = $("#" + modelId);
            checkBox.on('click', () => {
                if (checkBox.prop("checked")) {
                    this._loadModel(modelId);
                } else {
                    this._unloadModel(modelInfo.id);
                }
            });
        }
        }, (errMsg) => {
            this.error(errMsg);
        });
    }

    _loadModel(modelId) {
        const modelInfo = this._modelsInfo[modelId];
        if (!modelInfo) {
            return;
        }
        this.viewerUI.busyDialog.show("Loading model '" + modelInfo.name + "'");
        this.server.getModelMetadata(modelId,
            (json) => {
                this.server.getModelGeometry(modelId,
                    (arraybuffer) => {
                        const model = this._xktLoader.load({
                            id: modelId,
                            metaModelData: json,
                            xkt: arraybuffer,
                            edges: true
                        });
                        model.on("loaded", () => {
                            const scene = this.viewer.scene;
                            const aabb = scene.getAABB(scene.visibleObjectIds);
                            this._numModelsLoaded++;
                            if (this._numModelsLoaded === 1) { // Jump camera when only one model
                                this.viewer.cameraFlight.jumpTo({
                                    aabb: aabb
                                });
                                this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
                                this.fire("modelLoaded", modelId);
                                this.viewerUI.busyDialog.hide();
                            } else { // Fly camera when multiple models
                                this.viewer.cameraFlight.flyTo({
                                    aabb: aabb
                                }, () => {
                                    this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
                                    this.fire("modelLoaded", modelId);
                                    this.viewerUI.busyDialog.hide();
                                });
                            }
                        });
                    },
                    (errMsg) => {
                        this.error(errMsg);
                        this.viewerUI.busyDialog.hide();
                    });
            },
            (errMsg) => {
                this.error(errMsg);
                this.viewerUI.busyDialog.hide();
            });
    }

    _unloadModel(modelId) {
        const model = this.viewer.scene.models[modelId];
        if (!model) {
            this.error("Model not loaded: " + modelId);
            return;
        }
        model.destroy();
        const scene = this.viewer.scene;
        const aabb = scene.getAABB(scene.visibleObjectIds);
        $("#" + modelId).prop("checked", false);
        this._numModelsLoaded--;
        this.viewer.cameraFlight.flyTo({
            aabb: aabb
        }, () => {
            this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
            this.fire("modelUnloaded", modelId);
        });
    }

    unloadModels() {
        const models = this.viewer.scene.models;
        const modelIds = Object.keys(models);
        for (var i = 0, len = modelIds.length; i < len; i++) {
            const modelId = modelIds[i];
            this._unloadModel(modelId);
        }
    }

    getNumModelsLoaded() {
        return this._numModelsLoaded;
    }

    setToolbarEnabled(enabled) {
        if (!enabled) {
            $("#unloadAllModels").addClass("disabled");
        } else {
            $("#unloadAllModels").removeClass("disabled");
        }
    }

    /** @private */
    destroy() {
        super.destroy();
        this._xktLoader.destroy();
    }
}

export {Models};