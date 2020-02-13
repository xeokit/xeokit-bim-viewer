import {Controller} from "../Controller.js";
import {XKTLoaderPlugin} from "@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";
import {ModelIFCObjectColors} from "../IFCObjectDefaults/ModelIFCObjectColors.js";
import {ViewerIFCObjectColors} from "../IFCObjectDefaults/ViewerIFCObjectColors.js";

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
            objectDefaults: ModelIFCObjectColors
        });

        this._modelsInfo = {};
        this._numModelsLoaded = 0;
        this._projectId = null;
    }

    loadProject(projectId, done, error) {
        this.server.getProject(projectId, (projectInfo) => {
            this.unloadProject();
            this._projectId = projectId;
            this._modelsInfo = {};
            this._parseProject(projectInfo, done);
        }, (errMsg) => {
            this.error(errMsg);
            if (error) {
                error(errMsg);
            }
        });
    }

    _parseProject(projectInfo, done) {
        this._buildModelsMenu(projectInfo);
        this._parseViewerConfigs(projectInfo);
        this._parseViewerContent(projectInfo, () => {
            this._parseViewerState(projectInfo, () => {
                done();
            });
        });
    }

    _buildModelsMenu(projectInfo) {
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
        }
    }

    _parseViewerConfigs(projectInfo) {
        const viewerConfigs = projectInfo.viewerConfigs;
        if (viewerConfigs) {
            this.bimViewer.setConfigs(viewerConfigs);
        }
    }

    _parseViewerContent(projectInfo, done) {
        const viewerContent = projectInfo.viewerContent;
        if (!viewerContent) {
            done();
            return;
        }
        this._parseModelsLoaded(viewerContent, () => {
            done();
        });
    }

    _parseModelsLoaded(viewerContent, done) {
        const modelsLoaded = viewerContent.modelsLoaded;
        if (!modelsLoaded || (modelsLoaded.length === 0)) {
            done();
            return;
        }
        this._loadNextModel(modelsLoaded.slice(0), done);
    }

    _loadNextModel(modelsLoaded, done) {
        if (modelsLoaded.length === 0) {
            done();
            return;
        }
        const modelId = modelsLoaded.pop();
        this.loadModel(modelId,
            () => { // Done
            this._loadNextModel(modelsLoaded, done);
            },
            () => { // Error - recover and attempt to load next model
                this._loadNextModel(modelsLoaded, done);
            });
    }

    _parseViewerState(projectInfo, done) {
        const viewerState = projectInfo.viewerState;
        if (!viewerState) {
            done();
            return;
        }
        if (viewerState.tabOpen) {
            this.bimViewer.openTab(viewerState.tabOpen);
        }

        this._parseSelectedStorey(viewerState, () => {
            this._parseThreeDMode(viewerState, () => {
                done();
            });
        });
    }

    _parseSelectedStorey(viewerState, done) {
        if (viewerState.selectedStorey) {
            this.bimViewer.selectStorey(viewerState.selectedStorey);
            done();
        } else {
            done();
        }
    }

    _parseThreeDMode(viewerState, done) {
        const activateThreeDMode = (viewerState.threeDEnabled !== false);
        this.bimViewer.set3DEnabled(activateThreeDMode, done);
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
            const errMsg = "No project currently loaded";
            this.error(errMsg);
            if (error) {
                error(errMsg);
            }
            return;
        }
        const modelInfo = this._modelsInfo[modelId];
        if (!modelInfo) {
            const errMsg = "Model not in currently loaded project";
            this.error(errMsg);
            if (error) {
                error(errMsg);
            }
            return;
        }
        this.bimViewer._busyModal.show("Loading " + modelInfo.name);
        this.server.getMetadata(this._projectId, modelId,
            (json) => {
                this.server.getGeometry(this._projectId, modelId,
                    (arraybuffer) => {
                        const objectColorSource = (modelInfo.objectColorSource || this.bimViewer.getObjectColorSource());
                        const objectDefaults = (objectColorSource === "model") ? ModelIFCObjectColors : ViewerIFCObjectColors;
                        const model = this._xktLoader.load({
                            id: modelId,
                            metaModelData: json,
                            xkt: arraybuffer,
                            objectDefaults: objectDefaults,
                            excludeUnclassifiedObjects: true,
                            position: modelInfo.position,
                            scale: modelInfo.scale,
                            rotation: modelInfo.rotation,
                            matrix: modelInfo.matrix,
                            edges: (modelInfo.edges !== false),
                            saoEnabled: modelInfo.saoEnabled
                        });
                        model.on("loaded", () => {
                            document.getElementById("" + modelId).checked = true;
                            const scene = this.viewer.scene;
                            const aabb = scene.getAABB(scene.visibleObjectIds);
                            this._numModelsLoaded++;
                            this._unloadModelsButtonElement.classList.remove("disabled");
                            if (this._numModelsLoaded === 1) { // Jump camera to view-fit first model loaded
                                this.viewer.cameraFlight.jumpTo({
                                    aabb: aabb
                                });
                                this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
                                this.fire("modelLoaded", modelId);
                                this.bimViewer._busyModal.hide();
                                if (done) {
                                    done();
                                }
                            } else {
                                this.fire("modelLoaded", modelId);
                                this.bimViewer._busyModal.hide();
                                if (done) {
                                    done();
                                }
                            }
                        });
                    },
                    (errMsg) => {
                        this.bimViewer._busyModal.hide();
                        this.error(errMsg);
                        if (error) {
                            error(errMsg);
                        }
                    });
            },
            (errMsg) => {
                this.bimViewer._busyModal.hide();
                this.error(errMsg);
                if (error) {
                    error(errMsg);
                }
            });
    }

    unloadModel(modelId) {
        const model = this.viewer.scene.models[modelId];
        if (!model) {
            this.error("Model not loaded: " + modelId);
            return;
        }
        model.destroy();
        document.getElementById("" + modelId).checked = false;
        this._numModelsLoaded--;
        if (this._numModelsLoaded > 0) {
            this._unloadModelsButtonElement.classList.remove("disabled");
        } else {
            this._unloadModelsButtonElement.classList.add("disabled");
        }
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