import {Controller} from "../Controller.js";
import {XKTLoaderPlugin} from "@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";
import {IFCObjectDefaults} from "../IFCObjectDefaults/IFCObjectDefaults.js";

const tempVec3 = math.vec3();

/** @private */
class ModelsExplorer extends Controller {

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

        this._xktLoader = new XKTLoaderPlugin(this.viewer, {
            objectDefaults: IFCObjectDefaults
        });
        this._modelsInfo = {};
        this._numModelsLoaded = 0;
        this._projectId = null;
    }

    loadProject(projectId, done, error) {
        this.server.getProject(projectId, (projectInfo) => {
            this.unloadProject();
            this._projectId = projectId;
            var html = "";
            const modelsInfo = projectInfo.models || [];
            this._modelsInfo = {};
            for (let i = 0, len = modelsInfo.length; i < len; i++) {
                const modelInfo = modelsInfo[i];
                this._modelsInfo[modelInfo.id] = modelInfo;
                html += "<div class='xeokit-form-check'>";
                html += "<input id='" + modelInfo.id + "' type='checkbox' value=''>" + modelInfo.name;
                html += "</div>";
            }
            this._modelsElement.innerHTML = html;
            for (let i = 0, len = modelsInfo.length; i < len; i++) {
                const modelInfo = modelsInfo[i];
                const modelId = modelInfo.id;
                const checkBox = document.getElementById("" + modelId);
                checkBox.addEventListener("click", () => {
                    if (checkBox.checked) {
                        this.loadModel(modelId);
                    } else {
                        this.unloadModel(modelInfo.id);
                    }
                });
                if (modelInfo.default) {
                    checkBox.checked = true;
                    this.loadModel(modelId, done, error); // TODO: buffer and load at end
                } else {
                    if (done) {
                        done();
                    }
                }
            }
        }, (errMsg) => {
            this.error(errMsg);
            if (error) {
                error(errMsg);
            }
        });
    }

    unloadProject() {
        if (!this._projectId) {
            return;
        }
        const models = this.viewer.scene.models;
        for (var modelId in models) {
            if (models.hasOwnProperty(modelId)) {
                const model = models[modelId];
                model.destroy();
            }
        }
        this._modelsElement.innerHTML = "";
        this._numModelsLoaded = 0;
        this._unloadModelsButtonElement.classList.add("disabled");
        const lastProjectId = this._projectId;
        this._projectId = null;
        this.fire("projectUnloaded", {
            projectId: lastProjectId
        });
    }

    getLoadedProjectId() {
        return this._projectId;
    }

    loadModel(modelId, done, error) {
        if (!this._projectId) {
            if (error) {
                error("No project currently loaded");
            }
            return;
        }
        const modelInfo = this._modelsInfo[modelId];
        if (!modelInfo) {
            if (error) {
                error("Model not in currently loaded project");
            }
            return;
        }
        this.bimViewer._busyModal.show("Loading " + modelInfo.name);
        this.server.getMetadata(this._projectId, modelId,
            (json) => {
                this.server.getGeometry(this._projectId, modelId,
                    (arraybuffer) => {
                        const model = this._xktLoader.load({
                            id: modelId,
                            metaModelData: json,
                            xkt: arraybuffer,
                            excludeUnclassifiedObjects: true,
                            edges: true,
                            position: modelInfo.position,
                            scale: modelInfo.scale,
                            rotation: modelInfo.rotation,
                            matrix: modelInfo.matrix
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
                                this.bimViewer._busyModal.hide();
                                if (done) {
                                    done();
                                }
                            } else { // Fly camera when multiple models
                                this.viewer.cameraFlight.flyTo({
                                    aabb: aabb
                                }, () => {
                                    this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
                                    this.fire("modelLoaded", modelId);
                                    this.bimViewer._busyModal.hide();
                                    if (done) {
                                        done();
                                    }
                                });
                            }
                        });
                    },
                    (errMsg) => {
                        this.error(errMsg);
                        this.bimViewer._busyModal.hide();
                    });
            },
            (errMsg) => {
                this.error(errMsg);
                this.bimViewer._busyModal.hide();
            });
    }

    unloadModel(modelId) {
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

    unloadAllModels() {
        const models = this.viewer.scene.models;
        const modelIds = Object.keys(models);
        for (var i = 0, len = modelIds.length; i < len; i++) {
            const modelId = modelIds[i];
            this.unloadModel(modelId);
        }
    }

    getNumModelsLoaded() {
        return this._numModelsLoaded;
    }

    _getLoadedModelIds() {
        return Object.keys(this.viewer.scene.models);
    }

    getModelsInfo() {
        return this._modelsInfo;
    }

    getModelInfo(modelId) {
        return this._modelsInfo[modelId];
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

export {ModelsExplorer};