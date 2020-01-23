import {Controller} from "./Controller.js";
import {BusyModal} from "./BusyModal.js";
import {ResetAction} from "./toolbar/ResetAction.js";
import {FitAction} from "./toolbar/FitAction.js";
import {FirstPersonMode} from "./toolbar/FirstPersonMode.js";
import {HideMode} from "./toolbar/HideMode.js";
import {SelectMode} from "./toolbar/SelectMode.js";
import {QueryMode} from "./toolbar/QueryMode.js";
import {SectionMode} from "./toolbar/SectionMode.js";
import {NavCubeMode} from "./toolbar/NavCubeMode.js";
import {Models} from "./explorer/Models.js";
import {Objects} from "./explorer/Objects.js";
import {Classes} from "./explorer/Classes.js";

import {Viewer} from "@xeokit/xeokit-sdk/src/viewer/Viewer.js";
import {AmbientLight} from "@xeokit/xeokit-sdk/src/viewer/scene/lights/AmbientLight.js";
import {DirLight} from "@xeokit/xeokit-sdk/src/viewer/scene/lights/DirLight.js";
import {Storeys} from "./explorer/Storeys.js";
import {BCFViewpointsPlugin} from "@xeokit/xeokit-sdk/src/plugins/BCFViewpointsPlugin/BCFViewpointsPlugin.js";
import {ThreeDMode} from "./toolbar/ThreeDMode.js";
import {ContextMenu} from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";
import {ObjectContextMenuItems} from "./contextMenuItems/ObjectContextMenuItems.js";
import {CanvasContextMenuItems} from "./contextMenuItems/CanvasContextMenuItems.js";
import {ViewerCameraControl} from "./interaction/ViewerCameraControl.js";

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
        <button type="button" class="xeokit-fit xeokit-btn fa fa-crop fa-2x disabled" data-tippy-content="Fit to view"></button>
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
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class ViewerUI extends Controller {

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

        super(null, cfg, server, new Viewer({
            canvasElement: canvasElement,
            transparent: true
        }));

        this._customizeViewer();
        this._initCanvasContextMenus();

        explorerElement.innerHTML = explorerTemplate;
        toolbarElement.innerHTML = toolbarTemplate;

        this._explorerElement = explorerElement;

        initTabs(explorerElement);

        this.busyModal = new BusyModal(this); // TODO: Support external spinner dialog

        // Explorer

        this.models = new Models(this, {
            modelsTabElement: explorerElement.querySelector(".xeokit-modelsTab"),
            unloadModelsButtonElement: explorerElement.querySelector(".xeokit-unloadAllModels"),
            modelsElement: explorerElement.querySelector(".xeokit-models")
        });

        this.objects = new Objects(this, {
            objectsTabElement: explorerElement.querySelector(".xeokit-objectsTab"),
            showAllObjectsButtonElement: explorerElement.querySelector(".xeokit-showAllObjects"),
            hideAllObjectsButtonElement: explorerElement.querySelector(".xeokit-hideAllObjects"),
            objectsElement: explorerElement.querySelector(".xeokit-objects")
        });

        this.classes = new Classes(this, {
            classesTabElement: explorerElement.querySelector(".xeokit-classesTab"),
            showAllClassesButtonElement: explorerElement.querySelector(".xeokit-showAllClasses"),
            hideAllClassesButtonElement: explorerElement.querySelector(".xeokit-hideAllClasses"),
            classesElement: explorerElement.querySelector(".xeokit-classes")
        });

        this.storeys = new Storeys(this, {
            storeysTabElement: explorerElement.querySelector(".xeokit-storeysTab"),
            showAllStoreysButtonElement: explorerElement.querySelector(".xeokit-showAllStoreys"),
            hideAllStoreysButtonElement: explorerElement.querySelector(".xeokit-hideAllStoreys"),
            storeysElement: explorerElement.querySelector(".xeokit-storeys")
        });

        // Toolbar

        this.reset = new ResetAction(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-reset"),
            active: false
        });

        this.fit = new FitAction(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-fit"),
            active: false
        });

        this.threeD = new ThreeDMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-threeD"),
            active: false
        });

        this.firstPerson = new FirstPersonMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-firstPerson"),
            active: false
        });

        this.hide = new HideMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-hide"),
            active: false
        });

        this.select = new SelectMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-select"),
            active: false
        });

        this.query = new QueryMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-query"),
            queryInfoPanelElement: queryInfoPanelElement,
            active: false
        });

        this.section = new SectionMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-section"),
            sectionPlanesOverviewCanvasElement: sectionPlanesOverviewCanvasElement,
            active: false
        });

        this.navCube = new NavCubeMode(this, {
            navCubeCanvasElement: navCubeCanvasElement,
            active: true
        });

        this._mutexActivation([this.query, this.hide, this.select, this.section]);

        this.threeD.setActive(true);
        this.firstPerson.setActive(false);
        this.navCube.setActive(true);

        explorerElement.querySelector(".xeokit-showAllObjects").addEventListener("click", (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-hideAllObjects").addEventListener("click", (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-showAllClasses").addEventListener("click", (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-hideAllClasses").addEventListener("click", (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-showAllStoreys").addEventListener("click", (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-hideAllStoreys").addEventListener("click", (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-unloadAllModels").addEventListener("click", (event) => {
            this._enableControls(false); // For quick UI feedback
            this.models._unloadModels();
            event.preventDefault();
        });

        this.models.on("modelLoaded", (modelId) => {
            if (this.models.getNumModelsLoaded() === 1) {
                this._enableControls(true);
            }
            this.fire("modelLoaded", modelId);
        });

        this.models.on("modelUnloaded", (modelId) => {
            if (this.models.getNumModelsLoaded() === 0) {
                this._enableControls(false);
            }
            this.fire("modelUnloaded", modelId);
        });

        this.query.on("queryPicked", (entityId) => {
            const event = {};
            event.entity = this.viewer.scene.objects[entityId];
            event.metaObject = this.viewer.metaScene.metaObjects[entityId];
            this.fire("queryPicked", event);
        });

        this.query.on("queryNotPicked", () => {
            this.fire("queryNotPicked", true);
        });

        this.reset.on("reset", () => {
            this.fire("reset", true);
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

        // HACK: Custom camera control with middle button drag, until xeokit CameraControl allows customization
        this.viewer.cameraControl.active = false;
        this.cameraControl = new ViewerCameraControl(scene);
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

        this.viewer.scene.canvas.canvas.oncontextmenu = (e) => {

            const hit = this.viewer.scene.pick({
                canvasPos: [e.offsetX, e.offsetY]
            });

            if (hit && hit.entity.isObject) {
                this._canvasContextMenu.hide();
                this._objectContextMenu.show(e.pageX, e.pageY);
                this._objectContextMenu.context = {
                    viewer: this.viewer,
                    viewerUI: this,
                    showNodeInTreeViews: (objectId) => {
                        this.objects.showNodeInTreeView(objectId); // TODO: Show node only in currently visible tree
                        this.classes.showNodeInTreeView(objectId);
                        this.storeys.showNodeInTreeView(objectId);
                    },
                    entity: hit.entity
                };
            } else {
                this._objectContextMenu.hide();
                this._canvasContextMenu.show(e.pageX, e.pageY);
                this._canvasContextMenu.context = {
                    viewer: this.viewer,
                    viewerUI: this
                };
            }

            e.preventDefault();
        };

    }

    _showAllObjects() {
        this.viewer.scene.setObjectsVisible(this.viewer.scene.objectIds, true);
    }

    _hideAllObjects() {
        this.viewer.scene.setObjectsVisible(this.viewer.scene.visibleObjectIds, false);
    }

    /**
     * Loads a project into the viewer.
     * Unloads any project already loaded.
     * @param projectId
     */
    loadProject(projectId) {
        this.models._loadProject(projectId);
    }

    /**
     * Opens a tab.
     * @param tabId
     */
    openTab(tabId) {
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
                tabSelector = "xeokit-objectsTab";
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
     * const viewer = new Viewer();
     *
     * const bcfPlugin = new BCFPlugin(viewer, {
     *     //...
     * });
     *
     * const viewpoint = viewerUI.saveBCFViewpoint({
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
        this._bcfViewpointsPlugin.setViewpoint(bcfViewpoint, options);
    }

    /**
     * Resets the view.
     */
    resetView() {
        this.reset.reset();
    }

    _enableControls(enabled) {

        // Explorer

        // Models tab is always enabled
        this.objects.setEnabled(enabled);
        this.classes.setEnabled(enabled);
        this.storeys.setEnabled(enabled);

        // Toolbar

        this.reset.setEnabled(enabled);
        this.fit.setEnabled(enabled);
        this.threeD.setEnabled(enabled);
        this.firstPerson.setEnabled(enabled);
        this.query.setEnabled(enabled);
        this.hide.setEnabled(enabled);
        this.select.setEnabled(enabled);
        this.section.setEnabled(enabled);
    }

    destroy() {
        this.viewer.destroy();
        this._bcfViewpointsPlugin.destroy();
        this._canvasContextMenu.destroy();
        this._objectContextMenu.destroy();
    }
}

export {ViewerUI};