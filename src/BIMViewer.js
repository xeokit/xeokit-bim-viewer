import {Controller} from "./Controller.js";
import {BusyModal} from "./BusyModal.js";
import {ResetAction} from "./toolbar/ResetAction.js";
import {FitAction} from "./toolbar/FitAction.js";
import {FirstPersonMode} from "./toolbar/FirstPersonMode.js";
import {HideTool} from "./toolbar/HideTool.js";
import {SelectionTool} from "./toolbar/SelectionTool.js";
import {QueryTool} from "./toolbar/QueryTool.js";
import {SectionTool} from "./toolbar/SectionTool.js";
import {NavCubeMode} from "./toolbar/NavCubeMode.js";

import {ModelsExplorer} from "./explorer/ModelsExplorer.js";
import {ObjectsExplorer} from "./explorer/ObjectsExplorer.js";
import {ClassesExplorer} from "./explorer/ClassesExplorer.js";
import {StoreysExplorer} from "./explorer/StoreysExplorer.js";

import {Viewer} from "@xeokit/xeokit-sdk/src/viewer/Viewer.js";
import {AmbientLight} from "@xeokit/xeokit-sdk/src/viewer/scene/lights/AmbientLight.js";
import {DirLight} from "@xeokit/xeokit-sdk/src/viewer/scene/lights/DirLight.js";
import {BCFViewpointsPlugin} from "@xeokit/xeokit-sdk/src/plugins/BCFViewpointsPlugin/BCFViewpointsPlugin.js";
import {ThreeDMode} from "./toolbar/ThreeDMode.js";
import {ContextMenu} from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";
import {ObjectContextMenuItems} from "./contextMenuItems/ObjectContextMenuItems.js";
import {CanvasContextMenuItems} from "./contextMenuItems/CanvasContextMenuItems.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

const explorerTemplate = `<div class="xeokit-tabs">
    <div class="xeokit-tab xeokit-modelsTab">
        <a class="xeokit-tab-btn" href="#">Models</a>
        <div class="xeokit-tab-content">
            <div class="xeokit-btn-group">
                <button type="button" class="xeokit-unloadAllModels xeokit-btn disabled" data-tippy-content="Unload all models">Unload all</button>
            </div>
            <div class="xeokit-models" ></div>
        </div>
    </div>
    <div class="xeokit-tab xeokit-objectsTab">
        <a class="xeokit-tab-btn disabled" href="#">Objects</a>
        <div class="xeokit-tab-content">
         <div class="xeokit-btn-group">
            <button type="button" class="xeokit-showAllObjects xeokit-btn disabled" data-tippy-content="Show all objects">Show all</button>
            <button type="button" class="xeokit-hideAllObjects xeokit-btn disabled" data-tippy-content="Hide all objects">Hide all</button>
        </div>
        <div class="xeokit-objects xeokit-tree-panel" ></div>
        </div>
    </div>
    <div class="xeokit-tab xeokit-classesTab">
        <a class="xeokit-tab-btn disabled" href="#">Classes</a>
        <div class="xeokit-tab-content">
            <div class="xeokit-btn-group">
                <button type="button" class="xeokit-showAllClasses xeokit-btn disabled" data-tippy-content="Show all classes">Show all</button>
                <button type="button" class="xeokit-hideAllClasses xeokit-btn disabled" data-tippy-content="Hide all classes">Hide all</button>
            </div>
            <div class="xeokit-classes xeokit-tree-panel" ></div>
        </div>
    </div>
     <div class="xeokit-tab xeokit-storeysTab">
        <a class="xeokit-tab-btn disabled" href="#">Storeys</a>
        <div class="xeokit-tab-content">
         <div class="xeokit-btn-group">
                <button type="button" class="xeokit-showAllStoreys xeokit-btn disabled" data-tippy-content="Show all storeys">Show all</button>
                <button type="button" class="xeokit-hideAllStoreys xeokit-btn disabled" data-tippy-content="Hide all storeys">Hide all</button>
            </div>
             <div class="xeokit-storeys xeokit-tree-panel"></div>
        </div>
    </div>
</div>`;

const toolbarTemplate = `<div class="xeokit-toolbar">
    <!-- Reset button -->
    <div class="xeokit-btn-group">
        <button type="button" class="xeokit-reset xeokit-btn fa fa-home fa-2x disabled" data-tippy-content="Reset view"></button>
    </div>
    <!-- 3D Mode button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-threeD xeokit-btn fa fa-cube fa-2x" data-tippy-content="Toggle 2D/3D"></button>
    </div>
    <!-- Fit button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-fit xeokit-btn fa fa-crop fa-2x disabled" data-tippy-content="View fit"></button>
    </div>
    <!-- First Person mode button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-firstPerson xeokit-btn fa fa-male fa-2x disabled" data-tippy-content="First person"></button>
    </div>
    <!-- Tools button group -->
    <div class="xeokit-btn-group" role="group">
        <!-- Hide tool button -->
        <button type="button" class="xeokit-hide xeokit-btn fa fa-eraser fa-2x disabled" data-tippy-content="Hide objects"></button>
        <!-- Select tool button -->
        <button type="button" class="xeokit-select xeokit-btn fa fa-mouse-pointer fa-2x disabled" data-tippy-content="Select objects"></button>
        <!-- Query tool button -->
        <button type="button" class="xeokit-query xeokit-btn fa fa-info-circle fa-2x disabled" data-tippy-content="Query objects"></button>
        <!-- Slice tool button -->
        <button type="button" class="xeokit-section xeokit-btn fa fa-cut fa-2x disabled" data-tippy-content="Slice objects"></button>
    </div>
</div>`;

function initTabs(containerElement) {

    const tabsClass = 'xeokit-tabs';
    const tabClass = 'xeokit-tab';
    const tabButtonClass = 'xeokit-tab-btn';
    const activeClass = 'active';

    // Activates the chosen tab and deactivates the rest
    function activateTab(chosenTabElement) {
        let tabList = chosenTabElement.parentNode.querySelectorAll('.' + tabClass);
        for (let i = 0; i < tabList.length; i++) {
            let tabElement = tabList[i];
            if (tabElement.isEqualNode(chosenTabElement)) {
                tabElement.classList.add(activeClass)
            } else {
                tabElement.classList.remove(activeClass)
            }
        }
    }

    // Initialize each tabbed container
    let tabbedContainers = containerElement.querySelectorAll('.' + tabsClass);
    for (let i = 0; i < tabbedContainers.length; i++) {
        let tabbedContainer = tabbedContainers[i];
        let tabList = tabbedContainer.querySelectorAll('.' + tabClass);
        activateTab(tabList[0]);
        for (let i = 0; i < tabList.length; i++) {
            let tabElement = tabList[i];
            let tabButton = tabElement.querySelector('.' + tabButtonClass);
            tabButton.addEventListener('click', function (event) {
                event.preventDefault();
                if (this.classList.contains("disabled")) {
                    return;
                }
                activateTab(event.target.parentNode);
            })
        }
    }
}

/**
 * @desc A BIM viewer based on the [xeokit SDK](http://xeokit.io).
 */
class BIMViewer extends Controller {

    /**
     * Constructs a ViewerUI.
     * @param {Server} server Data access strategy.
     * @param {*} cfg Configuration.
     */
    constructor(server, cfg = {}) {

        if (!cfg.canvasElement) {
            throw "Config expected: canvasElement";
        }

        if (!cfg.explorerElement) {
            throw "Config expected: explorerElement";
        }

        if (!cfg.toolbarElement) {
            throw "Config expected: toolbarElement";
        }

        if (!cfg.navCubeCanvasElement) {
            throw "Config expected: navCubeCanvasElement";
        }

        if (!cfg.sectionPlanesOverviewCanvasElement) {
            throw "Config expected: sectionPlanesOverviewCanvasElement";
        }

        const canvasElement = cfg.canvasElement;
        const explorerElement = cfg.explorerElement;
        const toolbarElement = cfg.toolbarElement;
        const navCubeCanvasElement = cfg.navCubeCanvasElement;
        const sectionPlanesOverviewCanvasElement = cfg.sectionPlanesOverviewCanvasElement;
        const queryInfoPanelElement = cfg.queryInfoPanelElement;

        explorerElement.oncontextmenu = (e) => {
            e.preventDefault();
        };

        toolbarElement.oncontextmenu = (e) => {
            e.preventDefault();
        };

        navCubeCanvasElement.oncontextmenu = (e) => {
            e.preventDefault();
        };

        sectionPlanesOverviewCanvasElement.oncontextmenu = (e) => {
            e.preventDefault();
        };

        const viewer = new Viewer({
            canvasElement: canvasElement,
            transparent: true
        });

        super(null, cfg, server, viewer);

        /**
         * The xeokit [Viewer](https://xeokit.github.io/xeokit-sdk/docs/class/src/viewer/Viewer.js~Viewer.html) at the core of this BIM viewer.
         *
         * @type {Viewer}
         */
        this.viewer = viewer;

        this._customizeViewer();
        this._initCanvasContextMenus();

        explorerElement.innerHTML = explorerTemplate;
        toolbarElement.innerHTML = toolbarTemplate;

        this._explorerElement = explorerElement;

        initTabs(explorerElement);

        this._busyModal = new BusyModal(this); // TODO: Support external spinner dialog

        this._modelsExplorer = new ModelsExplorer(this, {
            modelsTabElement: explorerElement.querySelector(".xeokit-modelsTab"),
            unloadModelsButtonElement: explorerElement.querySelector(".xeokit-unloadAllModels"),
            modelsElement: explorerElement.querySelector(".xeokit-models")
        });

        this._objectsExplorer = new ObjectsExplorer(this, {
            objectsTabElement: explorerElement.querySelector(".xeokit-objectsTab"),
            showAllObjectsButtonElement: explorerElement.querySelector(".xeokit-showAllObjects"),
            hideAllObjectsButtonElement: explorerElement.querySelector(".xeokit-hideAllObjects"),
            objectsElement: explorerElement.querySelector(".xeokit-objects")
        });

        this._classesExplorer = new ClassesExplorer(this, {
            classesTabElement: explorerElement.querySelector(".xeokit-classesTab"),
            showAllClassesButtonElement: explorerElement.querySelector(".xeokit-showAllClasses"),
            hideAllClassesButtonElement: explorerElement.querySelector(".xeokit-hideAllClasses"),
            classesElement: explorerElement.querySelector(".xeokit-classes")
        });

        this._storeysExplorer = new StoreysExplorer(this, {
            storeysTabElement: explorerElement.querySelector(".xeokit-storeysTab"),
            showAllStoreysButtonElement: explorerElement.querySelector(".xeokit-showAllStoreys"),
            hideAllStoreysButtonElement: explorerElement.querySelector(".xeokit-hideAllStoreys"),
            storeysElement: explorerElement.querySelector(".xeokit-storeys")
        });

        this._resetAction = new ResetAction(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-reset"),
            active: false
        });

        this._fitAction = new FitAction(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-fit"),
            active: false
        });

        this._threeDMode = new ThreeDMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-threeD"),
            active: false
        });

        this._firstPersonMode = new FirstPersonMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-firstPerson"),
            active: false
        });

        this._hideTool = new HideTool(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-hide"),
            active: false
        });

        this._selectionTool = new SelectionTool(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-select"),
            active: false
        });

        this._queryTool = new QueryTool(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-query"),
            queryInfoPanelElement: queryInfoPanelElement,
            active: false
        });

        this._sectionTool = new SectionTool(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-section"),
            sectionPlanesOverviewCanvasElement: sectionPlanesOverviewCanvasElement,
            active: false
        });

        this._navCubeMode = new NavCubeMode(this, {
            navCubeCanvasElement: navCubeCanvasElement,
            active: true
        });

        this._threeDMode.setActive(true);
        this._firstPersonMode.setActive(false);
        this._navCubeMode.setActive(true);

        this._modelsExplorer.on("modelLoaded", (modelId) => {
            if (this._modelsExplorer.getNumModelsLoaded() === 1) {
                this.setControlsEnabled(true);
            }
            this.fire("modelLoaded", modelId);
        });

        this._modelsExplorer.on("modelUnloaded", (modelId) => {
            if (this._modelsExplorer.getNumModelsLoaded() === 0) {
                this.setControlsEnabled(false);
                this.openTab("models");
            }
            this.fire("modelUnloaded", modelId);
        });

        this._queryTool.on("queryPicked", (entityId) => {
            const event = {};
            event.entity = this.viewer.scene.objects[entityId];
            event.metaObject = this.viewer.metaScene.metaObjects[entityId];
            this.fire("queryPicked", event);
        });

        this._queryTool.on("queryNotPicked", () => {
            this.fire("queryNotPicked", true);
        });

        this.resetView("reset", () => {
            this.fire("reset", true);
        });

        this._mutexActivation([this._queryTool, this._hideTool, this._selectionTool, this._sectionTool]);

        explorerElement.querySelector(".xeokit-showAllObjects").addEventListener("click", (event) => {
            this.showAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-hideAllObjects").addEventListener("click", (event) => {
            this.hideAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-showAllClasses").addEventListener("click", (event) => {
            this.showAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-hideAllClasses").addEventListener("click", (event) => {
            this.hideAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-showAllStoreys").addEventListener("click", (event) => {
            this.showAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-hideAllStoreys").addEventListener("click", (event) => {
            this.hideAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-unloadAllModels").addEventListener("click", (event) => {
            this.setControlsEnabled(false); // For quick UI feedback
            this._modelsExplorer.unloadAllModels();
            event.preventDefault();
        });

        this._bcfViewpointsPlugin = new BCFViewpointsPlugin(this.viewer, {});
    }

    _customizeViewer() {

        const scene = this.viewer.scene;

        scene.xrayMaterial.fill = true;
        scene.xrayMaterial.fillAlpha = 0.1;
        scene.xrayMaterial.fillColor = [0, 0, 0];
        scene.xrayMaterial.edgeAlpha = 0.3;
        scene.xrayMaterial.edgeColor = [0, 0, 0];

        scene.highlightMaterial.edges = true;
        scene.highlightMaterial.edgeColor = [.5, .5, 0];
        scene.highlightMaterial.edgeAlpha = 1.0;
        scene.highlightMaterial.fill = true;
        scene.highlightMaterial.fillAlpha = 0.1;
        scene.highlightMaterial.fillColor = [1, 0, 0];

        scene.clearLights();

        new AmbientLight(scene, {
            color: [0.3, 0.3, 0.3],
            intensity: 1.0
        });

        new DirLight(scene, {
            dir: [0.8, -0.6, -0.8],
            color: [1.0, 1.0, 1.0],
            intensity: 1.0,
            space: "world"
        });

        new DirLight(scene, {
            dir: [-0.8, -0.4, 0.4],
            color: [1.0, 1.0, 1.0],
            intensity: 1.0,
            space: "world"
        });

        new DirLight(scene, {
            dir: [0.2, -0.8, 0.8],
            color: [0.6, 0.6, 0.6],
            intensity: 1.0,
            space: "world"
        });

        this.viewer.cameraControl.panRightClick = true;
        this.viewer.cameraControl.panToPointer = true;
    }

    _initCanvasContextMenus() {

        this._canvasContextMenu = new ContextMenu({
            context: {
                viewer: this.viewer
            },
            items: CanvasContextMenuItems
        });

        this._objectContextMenu = new ContextMenu({
            items: ObjectContextMenuItems
        });

        this.viewer.cameraControl.on("rightClick", (e) => {

            const event = e.event;

            const hit = this.viewer.scene.pick({
                canvasPos: [event.offsetX, event.offsetY]
            });

            if (hit && hit.entity.isObject) {
                this._canvasContextMenu.hide();
                this._objectContextMenu.show(event.pageX, event.pageY);
                this._objectContextMenu.context = {
                    viewer: this.viewer,
                    bimViewer: this,
                    showNodeInTreeViews: (objectId) => {
                        this._objectsExplorer.showNodeInTreeView(objectId); // TODO: Show node only in currently visible tree
                        this._classesExplorer.showNodeInTreeView(objectId);
                        this._storeysExplorer.showNodeInTreeView(objectId);
                    },
                    entity: hit.entity
                };
            } else {
                this._objectContextMenu.hide();
                this._canvasContextMenu.show(event.pageX, event.pageY);
                this._canvasContextMenu.context = {
                    viewer: this.viewer,
                    bimViewer: this
                };
            }

            e.event.preventDefault();
        });

    }

    /**
     * Gets information on all available projects.
     *
     * ### Example
     *
     * ````javascript
     * myViewer.getProjectsInfo((projectsInfo) => {
     *      console.log(JSON.stringify(projectsInfo, null, "\t"));
     * });
     * ````
     *
     * Returns JSON similar to:
     *
     * ````json
     * {
     *      "projects": [
     *          {
     *              "id": "Duplex",
     *              "name": "Duplex"
     *          },
     *          {
     *              "id": "Schependomlaan",
     *              "name": "Schependomlaan"
     *          },
     *          {
     *              "id": "WestRiversideHospital",
     *              "name": "West Riverside Hospital"
     *          }
     *	    ]
     * }
     * ````
     * @param {Function} done Callback invoked on success, into which the projects information JSON is passed.
     * @param {Function} error Callback invoked on failure, into which the error message string is passed.
     */
    getProjectsInfo(done, error) {
        if (!done) {
            this.error("getProjectsInfo() - Argument expected: 'done'");
            return;
        }
        this.server.getProjects( done, (errorMsg) => {
            this.error("getProjectsInfo() - " + errorMsg);
            if (error) {
                error(errorMsg);
            }
        });
    }

    /**
     * Gets information on the given project.
     *
     * Use {@link BIMViewer#getProjects} to get information on all available projects.
     *
     * ### Example
     *
     * ````javascript
     * myViewer.getProjectInfo(("Duplex") => {
     *      console.log(JSON.stringify(projectInfo, null, "\t"));
     * });
     * ````
     *
     * Returns JSON similar to:
     *
     * ````json
     * {
     *      "id": "Duplex",
     *      "name": "Duplex"
     * }
     * ````
     *
     * @param {String} projectId ID of the project to get information on. Must be the ID of one of the projects in the information obtained by {@link BIMViewer#getProjects}.
     * @param {Function} done Callback invoked on success, into which the project information JSON is passed.
     * @param {Function} error Callback invoked on failure, into which the error message string is passed.
     */
    getProjectInfo(projectId, done, error) {
        if (!projectId) {
            this.error("getProjectInfo() - Argument expected: objectId");
            return;
        }
        if (!done) {
            this.error("getProjectInfo() - Argument expected: 'done'");
            return;
        }
        this.server.getProject(projectId,
            done, (errorMsg) => {
                this.error("getProjectInfo() - " + errorMsg);
                if (error) {
                    error(errorMsg);
                }
            });
    }

    /**
     * Loads a project into the viewer.
     *
     * Unloads any currently loaded project and its models first. If the given project is already loaded, will unload that project first.
     *
     * @param {String} projectId ID of the project to load. Must be the ID of one of the projects in the information obtained by {@link BIMViewer#getProjects}.
     * @param {Function} done Callback invoked on success.
     * @param {Function} error Callback invoked on failure, into which the error message string is passed.
     */
    loadProject(projectId, done, error) {
        if (!projectId) {
            this.error("loadProject() - Argument expected: objectId");
            return;
        }
        this._modelsExplorer.loadProject(projectId,
            () => {
                if (done) {
                    done();
                }
            }, (errorMsg) => {
                this.error("loadProject() - " + errorMsg);
                if (error) {
                    error(errorMsg);
                }
            });
    }

    /**
     * Unloads whatever project is currently loaded.
     */
    unloadProject() {
        this._modelsExplorer.unloadProject();
        this.openTab("models");
        this.setControlsEnabled(false); // For quick UI feedback
    }

    /**
     * Returns the ID of the currently loaded project, if any.
     *
     * @returns {String} The ID of the currently loaded project, otherwise ````null```` if no project is currently loaded.
     */
    getLoadedProjectId() {
        return this._modelsExplorer.getLoadedProjectId();
    }

    /**
     * Loads a model into the viewer.
     *
     * Assumes that the project containing the model is currently loaded.
     *
     * @param {String} modelId ID of the model to load. Must be the ID of one of the models in the currently loaded project.
     * @param {Function} done Callback invoked on success.
     * @param {Function} error Callback invoked on failure, into which the error message string is passed.
     */
    loadModel(modelId, done, error) {
        if (!modelId) {
            this.error("loadModel() - Argument expected: modelId");
            return;
        }
        this._modelsExplorer.loadModel(modelId,
            () => {
                if (done) {
                    done();
                }
            }, (errorMsg) => {
                this.error("loadModel() - " + errorMsg);
                if (error) {
                    error(errorMsg);
                }
            });
    }

    /**
     * Returns the IDs of the currently loaded models, if any.
     *
     * @returns {String[]} The IDs of the currently loaded models, otherwise an empty array if no models are currently loaded.
     */
    getLoadedModelIds() {
        return this._modelsExplorer._getLoadedModelIds();
    }

    /**
     * Unloads a model from the viewer.
     *
     * Does nothing if the model is not currently loaded.
     *
     * @param modelId
     */
    unLoadModel(modelId) {
        if (!modelId) {
            this.error("unLoadModel() - Argument expected: modelId");
            return;
        }
        this._modelsExplorer.unloadModel(modelId);
    }

    /**
     * Unloads all currently loaded models.
     */
    unloadAllModels() {
        this._modelsExplorer.unloadAllModels();
    }

    /**
     * Show the given object in the Objects tab.
     * @param {String} objectId ID of the object
     */
    showObjectInObjectsTab(objectId) {
        if (!objectId) {
            this.error("showObjectInObjectsTab() - Argument expected: objectId");
            return;
        }
        this._objectsExplorer.showNodeInTreeView(objectId);
    }

    /**
     * Show the given object in the Classes tab.
     * @param {String} objectId ID of the object
     */
    showObjectInClassesTab(objectId) {
        if (!objectId) {
            this.error("showObjectInClassesTab() - Argument expected: objectId");
            return;
        }
        this._classesExplorer.showNodeInTreeView(objectId);

    }

    /**
     *
     * @param {String} objectId ID of the object
     */
    showObjectInStoreysTab(objectId) {
        if (!objectId) {
            this.error("showObjectInStoreysTab() - Argument expected: objectId");
            return;
        }
        this._storeysExplorer.showNodeInTreeView(objectId);
    }

    /**
     * Shows the object with the given ID.
     * @param {String} objectId ID of object to show.
     */
    showObject(objectId) {
        if (!objectId) {
            this.error("showObject() - Argument expected: objectId");
            return;
        }
        this.viewer.metaScene.withMetaObjectsInSubtree(objectId, (metaObject) => {
            const entity = this.viewer.scene.objects[metaObject.id];
            if (entity) {
                entity.visible = true;
            }
        });
    }

    /**
     * Shows all objects currently in the viewer.
     */
    showAllObjects() {
        this.viewer.scene.setObjectsVisible(this.viewer.scene.objectIds, true);
    }

    /**
     * Shows all objects currently in the viewer, except for those with the given IDs.
     * @param {String[]} objectIds IDs of objects to not show.
     */
    showAllObjectsExceptFor(objectIds) {
        if (!objectId) {
            this.error("showAllObjectsExceptFor() - Argument expected: objectId");
            return;
        }
    }

    /**
     * Hides the object with the given ID.
     * @param {String} objectId ID of object to hide.
     */
    hideObject(objectId) {
        if (!objectId) {
            this.error("hideObject() - Argument expected: objectId");
            return;
        }
    }

    /**
     * Hides all objects currently in the viewer.
     */
    hideAllObjects() {
        this.viewer.scene.setObjectsVisible(this.viewer.scene.visibleObjectIds, false);
    }

    /**
     * Hides all objects currently in the viewer, except for those with the given IDs.
     * @param {String[]} objectIds IDs of objects to not hide.
     */
    hideAllObjectsExceptFor(objectIds) {
        if (!objectIds) {
            this.error("hideAllObjectsExceptFor() - Argument expected: objectId");
            return;
        }
    }

    /**
     * flies the camera to fit the given object in view.
     *
     * @param {String} objectId ID of the object
     * @param {Function} done Callback invoked on completion
     */
    flyToObject(objectId, done) {
        if (!objectId) {
            this.error("flyToObject() - Argument expected: objectId");
            return;
        }
        const viewer = this.viewer;
        const scene = viewer.scene;
        const objectIds = [];
        this.viewer.metaScene.withMetaObjectsInSubtree(objectId, (metaObject) => {
            if (scene.objects[metaObject.id]) {
                objectIds.push(metaObject.id);
            }
        });
        if (objectIds.length === 0) {
            this.error("Object not found in viewer: '" + objectId + "'");
            if (done) {
                done();
            }
            return;
        }
        scene.setObjectsVisible(objectIds, true);
        scene.setObjectsHighlighted(objectIds, true);
        const aabb = scene.getAABB(objectIds);
        viewer.cameraFlight.flyTo({
            aabb: aabb,
            duration: 0.5
        }, () => {
            if (done) {
                done();
            }
            setTimeout(function () {
                scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
            }, 500);
        });
        viewer.cameraControl.pivotPos = math.getAABB3Center(aabb);
    }

    /**
     * Jumps the camera to fit the given object in view.
     *
     * @param {String} objectId ID of the object
     */
    jumpToObject(objectId) {
        if (!objectId) {
            this.error("jumpToObject() - Argument expected: objectId");
            return;
        }
        const viewer = this.viewer;
        const scene = viewer.scene;
        const objectIds = [];
        this.viewer.metaScene.withMetaObjectsInSubtree(objectId, (metaObject) => {
            if (scene.objects[metaObject.id]) {
                objectIds.push(metaObject.id);
            }
        });
        if (objectIds.length === 0) {
            this.error("Object not found in viewer: '" + objectId + "'");
            return;
        }
        scene.setObjectsVisible(objectIds, true);
        const aabb = scene.getAABB(objectIds);
        viewer.cameraFlight.jumpTo({
            aabb: aabb
        });
        viewer.cameraControl.pivotPos = math.getAABB3Center(aabb);
    }

    /**
     * X-ray the object with the given ID.
     *
     * @param {String} objectId ID of object to x-ray.
     */
    xrayObject(objectId) {
        if (!objectId) {
            this.error("xrayObject() - Argument expected: objectId");
            return;
        }
        this.viewer.metaScene.withMetaObjectsInSubtree(objectId, (metaObject) => {
            const entity = this.viewer.scene.objects[metaObject.id];
            if (entity) {
                entity.xrayed = true;
            }
        });
    }

    /**
     * X-rays all objects currently in the viewer.
     */
    xrayAllObjects() {
        this.viewer.scene.setObjectsXRayed(this.viewer.scene.objectIds, true);
    }

    /**
     * X-rays all objects currently in the viewer, except for those with the given IDs.
     * @param {String[]} objectIds IDs of objects to not x-ray.
     */
    xrayAllObjectsExceptFor(objectIds) {

    }

    /**
     * Un-x-rays all objects currently in the viewer.
     */
    xrayNoObjects() {
        this.viewer.scene.setObjectsXRayed(this.viewer.scene.objectIds, false);
    }

    /**
     * Selects the objects with the given ID.
     * @param {String} objectId ID of object to select.
     */
    selectObject(objectId) {
        if (!objectId) {
            this.error("selectObject() - Argument expected: objectId");
            return;
        }
        this.viewer.metaScene.withMetaObjectsInSubtree(objectId, (metaObject) => {
            const entity = this.viewer.scene.objects[metaObject.id];
            if (entity) {
                entity.selected = true;
            }
        });
    }

    /**
     * Selects all objects currently in the viewer.
     */
    selectAllObjects() {
        this.viewer.scene.setObjectsSelected(this.viewer.scene.objectIds, true);
    }

    /**
     * Selects all objects currently in the viewer, except for those with the given IDs.
     * @param {String[]} objectIds IDs of objects to not select.
     */
    selectAllObjectsExceptFor(objectIds) {

    }

    /**
     * De-selects all objects currently in the viewer.
     */
    deselectAllObjects() {
        this.viewer.scene.setObjectsSelected(this.viewer.scene.selectedObjectIds, false);
    }

    /**
     * Opens the specified viewer tab.
     *
     * The available tabs are:
     *
     *  * "models" - the Models tab, which lists the models available within the currently loaded project,
     *  * "objects" - the Objects tab, which contains a tree view for each loaded model, organized to indicate the containment hierarchy of their objects,
     *  * "classes" - the Classes tab, which contains a tree view for each loaded model, with nodes grouped by IFC types of their objects, and
     *  * "storeys" - the Storeys tab, which contains a tree view for each loaded model, with nodes grouped within ````IfcBuildingStoreys````, sub-grouped by their IFC types.
     *
     * @param {String} tabId ID of the tab to open - see method description.
     */
    openTab(tabId) {
        if (!tabId) {
            this.error("openTab() - Argument expected: tabId");
            return;
        }
        const tabClass = 'xeokit-tab';
        const activeClass = 'active';
        let tabSelector;
        switch (tabId) {
            case "models":
                tabSelector = "xeokit-modelsTab";
                break;
            case "objects":
                tabSelector = "xeokit-objectsTab";
                break;
            case "classes":
                tabSelector = "xeokit-classesTab";
                break;
            case "storeys":
                tabSelector = "xeokit-storeysTab";
                break;
            default:
                this.error("openTab() - tab not recognized: '" + tabId + "'");
                return;
        }
        let tabs = this._explorerElement.querySelectorAll("." + tabClass);
        let tab = this._explorerElement.querySelector("." + tabSelector);
        for (let i = 0; i < tabs.length; i++) {
            let tabElement = tabs[i];
            if (tabElement.isEqualNode(tab)) {
                tabElement.classList.add(activeClass)
            } else {
                tabElement.classList.remove(activeClass)
            }
        }
    }

    /**
     * Saves viewer state to a BCF viewpoint.
     *
     * This does not save information about the project and model(s) that are currently loaded. When loading the viewpoint,
     * the viewer will assume that the same project and models will be currently loaded (the BCF viewpoint specification
     * does not contain that information).
     *
     * Note that xeokit's {@link Camera#look} is the **point-of-interest**, whereas the BCF ````camera_direction```` is a
     * direction vector. Therefore, we save ````camera_direction```` as the vector from {@link Camera#eye} to {@link Camera#look}.
     *
     * @param {*} [options] Options for getting the viewpoint.
     * @param {Boolean} [options.spacesVisible=false] Indicates whether ````IfcSpace```` types should be forced visible in the viewpoint.
     * @param {Boolean} [options.openingsVisible=false] Indicates whether ````IfcOpening```` types should be forced visible in the viewpoint.
     * @param {Boolean} [options.spaceBoundariesVisible=false] Indicates whether the boundaries of ````IfcSpace```` types should be visible in the viewpoint.
     * @returns {*} BCF JSON viewpoint object
     * @example
     *
     * const viewpoint = bimViewer.saveBCFViewpoint({
     *     spacesVisible: false,          // Default
     *     spaceBoundariesVisible: false, // Default
     *     openingsVisible: false         // Default
     * });
     *
     * // viewpoint will resemble the following:
     *
     * {
     *     perspective_camera: {
     *         camera_view_point: {
     *             x: 0.0,
     *             y: 0.0,
     *             z: 0.0
     *         },
     *         camera_direction: {
     *             x: 1.0,
     *             y: 1.0,
     *             z: 2.0
     *         },
     *         camera_up_vector: {
     *             x: 0.0,
     *             y: 0.0,
     *             z: 1.0
     *         },
     *         field_of_view: 90.0
     *     },
     *     lines: [],
     *     clipping_planes: [{
     *         location: {
     *             x: 0.5,
     *             y: 0.5,
     *             z: 0.5
     *         },
     *         direction: {
     *             x: 1.0,
     *             y: 0.0,
     *             z: 0.0
     *         }
     *     }],
     *     bitmaps: [],
     *     snapshot: {
     *         snapshot_type: png,
     *         snapshot_data: "data:image/png;base64,......"
     *     },
     *     components: {
     *         visibility: {
     *             default_visibility: false,
     *             exceptions: [{
     *                 ifc_guid: 4$cshxZO9AJBebsni$z9Yk,
     *                 originating_system: xeokit.io,
     *                 authoring_tool_id: xeokit/v1.0
     *             }]
     *        },
     *         selection: [{
     *            ifc_guid: "4$cshxZO9AJBebsni$z9Yk",
     *         }]
     *     }
     * }
     */
    saveBCFViewpoint(options) {
        return this._bcfViewpointsPlugin.getViewpoint(options);
    }

    /**
     * Sets viewer state to the given BCF viewpoint.
     *
     * This assumes that the viewer currently contains the same project and model(s) that were loaded at the time that the
     * viewpoint was originally saved (the BCF viewpoint specification does not contain that information).
     *
     * Note that xeokit's {@link Camera#look} is the **point-of-interest**, whereas the BCF ````camera_direction```` is a
     * direction vector. Therefore, when loading a BCF viewpoint, we set {@link Camera#look} to the absolute position
     * obtained by offsetting the BCF ````camera_view_point````  along ````camera_direction````.
     *
     * When loading a viewpoint, we also have the option to find {@link Camera#look} as the closest point of intersection
     * (on the surface of any visible and pickable {@link Entity}) with a 3D ray fired from ````camera_view_point```` in
     * the direction of ````camera_direction````.
     *
     * @param {*} bcfViewpoint  BCF JSON viewpoint object or "reset" / "RESET" to reset the viewer, which clears SectionPlanes,
     * shows default visible entities and restores camera to initial default position.
     * @param {*} [options] Options for setting the viewpoint.
     * @param {Boolean} [options.rayCast=true] When ````true```` (default), will attempt to set {@link Camera#look} to the closest
     * point of surface intersection with a ray fired from the BCF ````camera_view_point```` in the direction of ````camera_direction````.
     * @param {Boolean} [options.immediate] When ````true```` (default), immediately set camera position.
     * @param {Boolean} [options.duration] Flight duration in seconds.  Overrides {@link CameraFlightAnimation#duration}.
     */
    loadBCFViewpoint(bcfViewpoint, options) {
        if (!bcfViewpoint) {
            this.error("loadBCFViewpoint() - Argument expected: bcfViewpoint");
            return;
        }
        this._bcfViewpointsPlugin.setViewpoint(bcfViewpoint, options);
    }

    /**
     * Resets the view.
     */
    resetView() {
        this._resetAction.reset();
    }

    /**
     * Enables or disables the various buttons and controls throughout the viewer.
     *
     * This also makes various buttons appear disabled.
     *
     * @param {Boolean} enabled Whether or not to disable the controls.
     */
    setControlsEnabled(enabled) {

        // Explorer

        // Models tab is always enabled
        this._objectsExplorer.setEnabled(enabled);
        this._classesExplorer.setEnabled(enabled);
        this._storeysExplorer.setEnabled(enabled);

        // Toolbar

        this._resetAction.setEnabled(enabled);
        this._fitAction.setEnabled(enabled);
        this._threeDMode.setEnabled(enabled);
        this._firstPersonMode.setEnabled(enabled);
        this._queryTool.setEnabled(enabled);
        this._hideTool.setEnabled(enabled);
        this._selectionTool.setEnabled(enabled);
        this._sectionTool.setEnabled(enabled);
    }

    /**
     * Destroys the viewer, freeing all resources.
     */
    destroy() {
        this.viewer.destroy();
        this._bcfViewpointsPlugin.destroy();
        this._canvasContextMenu.destroy();
        this._objectContextMenu.destroy();
    }
}

export {BIMViewer};