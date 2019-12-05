import {Controller} from "../Controller.js";
import {XKTLoaderPlugin} from "@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

const tempVec3 = math.vec3();

class Models extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.modelsTabElement) {
            throw "Missing config: modelsTabElement";
        }

        if (!cfg.unloadModelsButtonElement) {
            throw "Missing config: unloadModelsButtonElement";
        }

        if (!cfg.modelsElement) {
            throw "Missing config: modelsElement";
        }

        this._modelsTabElement = cfg.modelsTabElement;
        this._unloadModelsButtonElement = cfg.unloadModelsButtonElement;
        this._modelsElement = cfg.modelsElement;
        this._modelsTabButtonElement = this._modelsTabElement.querySelector(".xeokit-tab-btn");

        if (!this._modelsTabButtonElement) {
            throw "Missing DOM element: ,xeokit-tab-btn";
        }

        this._xktLoader = new XKTLoaderPlugin(this.viewer);
        this._modelsInfo = {};
        this._numModelsLoaded = 0;
        this._projectId = null;
    }

    _loadProject(projectId) {
        const params = {};
        this.server.getProject(projectId, (projectInfo) => {
            this._projectId = projectId;
            var html = "";
            const modelsInfo = projectInfo.models || [];
            this._modelsInfo = {};
            for (var i = 0, len = modelsInfo.length; i < len; i++) {
                const modelInfo = modelsInfo[i];
                this._modelsInfo[modelInfo.id] = modelInfo;
                html += "<div class='xeokit-form-check'>";
                html += "<input id='" + modelInfo.id + "' type='checkbox' value=''>" + modelInfo.name;
                html += "</div>";
            }
            this._modelsElement.innerHTML = html;
            for (var i = 0, len = modelsInfo.length; i < len; i++) {
                const modelInfo = modelsInfo[i];
                const modelId = modelInfo.id;
                const checkBox = document.getElementById("" + modelId);
                checkBox.addEventListener("click", () => {
                    if (checkBox.checked) {
                        this._loadModel(modelId);
                    } else {
                        this._unloadModel(modelInfo.id);
                    }
                });
                if (modelInfo.default) {
                    checkBox.checked = true;
                    this._loadModel(modelId);
                }
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
        this.viewerUI.busyModal.show("Loading " + modelInfo.name);
        this.server.getMetadata(this._projectId, modelId,
            (json) => {
                this.server.getGeometry(this._projectId, modelId,
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
                            this._unloadModelsButtonElement.classList.remove("disabled");
                            if (this._numModelsLoaded === 1) { // Jump camera when only one model
                                this.viewer.cameraFlight.jumpTo({
                                    aabb: aabb
                                });
                                this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
                                this.fire("modelLoaded", modelId);
                                this.viewerUI.busyModal.hide();
                            } else { // Fly camera when multiple models
                                this.viewer.cameraFlight.flyTo({
                                    aabb: aabb
                                }, () => {
                                    this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
                                    this.fire("modelLoaded", modelId);
                                    this.viewerUI.busyModal.hide();
                                });
                            }
                        });
                    },
                    (errMsg) => {
                        this.error(errMsg);
                        this.viewerUI.busyModal.hide();
                    });
            },
            (errMsg) => {
                this.error(errMsg);
                this.viewerUI.busyModal.hide();
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
        document.getElementById("" + modelId).checked = false;
        this._numModelsLoaded--;
        if (this._numModelsLoaded > 0) {
            this._unloadModelsButtonElement.classList.remove("disabled");
        } else {
            this._unloadModelsButtonElement.classList.add("disabled");
        }
        this.viewer.cameraFlight.flyTo({
            aabb: aabb
        }, () => {
            this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
            this.fire("modelUnloaded", modelId);
        });
    }

    _unloadModels() {
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

    setEnabled(enabled) {
        if (!enabled) {
            this._modelsTabButtonElement.classList.add("disabled");
            this._unloadModelsButtonElement.classList.add("disabled");
        } else {
            this._modelsTabButtonElement.classList.remove("disabled");
            this._unloadModelsButtonElement.classList.remove("disabled");
        }
    }

    /** @private */
    destroy() {
        super.destroy();
        this._xktLoader.destroy();
    }
}

export {Models};