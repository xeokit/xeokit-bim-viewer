import {XKTLoaderPlugin} from "../../lib/xeokit/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";
import {Controller} from "../Controller.js";
import {math} from "../../lib/xeokit/viewer/scene/math/math.js";

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
        this._repaint();
    }

    _repaint() {
        const modelsInfo = this.getModels();
        var h = "";
        for (var i = 0, len = modelsInfo.length; i < len; i++) {
            const modelInfo = modelsInfo[i];
            h += "<div class='form-check'>";
            h += "<label class='form-check-label'>";
            h += "<input id='" + modelInfo.id + "' type='checkbox' class='form-check-input' value=''>" + modelInfo.id;
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
                    this.loadModel(modelId, (model) => {

                    });
                } else {
                    this.unloadModel(modelInfo.id);
                }
            });
        }
    }

    getModels() {
        return this.server.getModels();
    }

    loadModel(modelId, done = function () {
    }) {
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
                            const numModels = Object.keys(this.viewer.scene.models).length;
                            if (numModels === 1) { // Jump camera when only one model
                                this.viewer.cameraFlight.jumpTo({
                                    aabb: aabb
                                });
                                this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
                                this.fire("modelLoaded", modelId);
                                done(model);
                            } else { // Fly camera when multiple models
                                this.viewer.cameraFlight.flyTo({
                                    aabb: aabb
                                }, () => {
                                    this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
                                    this.fire("modelLoaded", modelId);
                                    done(model);
                                });
                            }
                        });
                    },
                    (errMsg) => {
                        this.error(errMsg);
                        done();
                    });
            },
            (errMsg) => {
                this.error(errMsg);
                done();
            });
    }

    unloadModel(modelId) {
        const model = this.viewer.scene.models[modelId];
        if (!model) {
            this.error("Model not loaded: " + modelId);
            return;
        }
        model.destroy();
        this.fire("modelUnloaded", modelId);
    }

    /** @private */
    destroy() {
        super.destroy();
        this._xktLoader.destroy();
    }
}

export {Models};