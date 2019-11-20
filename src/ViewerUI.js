import {Controller} from "./Controller.js";
import {BusyDialog} from "./BusyDialog.js";
import {ResetAction} from "./toolbar/ResetAction.js";
import {FitAction} from "./toolbar/FitAction.js";
import {FirstPersonMode} from "./toolbar/FirstPersonMode.js";
import {OrthoMode} from "./toolbar/OrthoMode.js";
import {HideMode} from "./toolbar/HideMode.js";
import {SelectMode} from "./toolbar/SelectMode.js";
import {QueryMode} from "./toolbar/QueryMode.js";
import {SectionMode} from "./toolbar/SectionMode.js";
import {NavCubeMode} from "./toolbar/NavCubeMode.js";
import {Models} from "./explorer/Models.js";
import {Objects} from "./explorer/Objects.js";
import {Classes} from "./explorer/Classes.js";

import {Viewer} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/Viewer.js";
import {AmbientLight} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/lights/AmbientLight.js";
import {DirLight} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/lights/DirLight.js";

const explorerTemplate = `<div class="xeokit-tabs">
    <div class="xeokit-tab">
        <a class="xeokit-tab-button xeokit-modelsTab" href="#">Models</a>
        <div class="xeokit-tab-content">
            <div class="xeokit-btn-group">
                <button type="button" class="xeokit-unloadAllModels xeokit-btn disabled">Unload all</button>
            </div>
            <div class="xeokit-models" style="overflow-y:scroll;"></div>
        </div>
    </div>
    <div class="xeokit-tab xeokit-objectsTab">
        <a class="xeokit-tab-button" href="#">Objects</a>
        <div class="xeokit-tab-content">
         <div class="xeokit-btn-group">
            <button type="button" class="xeokit-showAllObjects xeokit-btn disabled">Show all</button>
            <button type="button" class="xeokit-hideAllObjects xeokit-btn disabled">Hide all</button>
        </div>
        <div class="xeokit-objects tree-panel" style="overflow-y:scroll;"></div>
        </div>
    </div>
    <div class="xeokit-tab xeokit-classesTab">
        <a class="xeokit-tab-button" href="#">Classes</a>
        <div class="xeokit-tab-content">
            <div class="xeokit-btn-group">
                <button type="button" class="xeokit-showAllClasses xeokit-btn disabled">Show all</button>
                <button type="button" class="xeokit-hideAllClasses xeokit-btn disabled">Hide all</button>
            </div>
            <div class="xeokit-classes tree-panel" style="overflow-y:scroll;"></div>
        </div>
    </div>
</div>`;

const toolbarTemplate = `<div class="xeokit-toolbar">
    <!-- Reset button -->
    <div class="xeokit-btn-group">
        <button type="button" class="xeokit-reset xeokit-btn fa fa-home fa-2x disabled"></button>
    </div>
    <!-- Fit button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-fit xeokit-btn fa fa-crop fa-2x disabled"></button>
    </div>
    <!-- First Person mode button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-firstPerson xeokit-btn fa fa-male fa-2x disabled"></button>
    </div>
    <!-- Ortho mode button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-ortho xeokit-btn fa fa-cube fa-2x disabled"></button>
    </div>
    <!-- Tools button group -->
    <div class="xeokit-xeokit-btn-group" role="group">
        <!-- Hide tool button -->
        <button type="button" class="xeokit-hide xeokit-btn fa fa-eraser fa-2x disabled"></button>
        <!-- Select tool button -->
        <button type="button" class="xeokit-select xeokit-btn fa fa-mouse-pointer fa-2x disabled"></button>
        <!-- Slice tool button -->
        <button type="button" class="xeokit-section xeokit-btn fa fa-cut fa-2x disabled"></button>
        <!-- Query tool button -->
        <button type="button" class="xeokit-query xeokit-btn fa fa-info-circle fa-2x disabled"></button>
    </div>
</div>`;

function initTabs(containerElement) {

    const tabsClass = 'xeokit-tabs';
    const tabClass = 'xeokit-tab';
    const tabButtonClass = 'xeokit-tab-button';
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
        // List of tabs for this tabbed container
        let tabList = tabbedContainer.querySelectorAll('.' + tabClass);
        // Make the first tab active when the page loads
        activateTab(tabList[0]);
        // Activate a tab when you click its button
        for (let i = 0; i < tabList.length; i++) {
            let tabElement = tabList[i];
            let tabButton = tabElement.querySelector('.' + tabButtonClass);
            tabButton.addEventListener('click', function (event) {
                event.preventDefault();
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

        super(null, cfg, server, new Viewer({
            canvasElement: canvasElement,
            transparent: true
        }));

        this._customizeViewer();

        explorerElement.innerHTML = explorerTemplate;
        toolbarElement.innerHTML = toolbarTemplate;

        initTabs(explorerElement);

        this.busyDialog = new BusyDialog(this); // TODO: Support external spinner dialog

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

        // Toolbar

        this.reset = new ResetAction(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-reset"),
            active: false
        });

        this.fit = new FitAction(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-fit"),
            active: false
        });

        this.firstPerson = new FirstPersonMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-firstPerson"),
            active: false
        });

        this.ortho = new OrthoMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-ortho"),
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

        this.firstPerson.setActive(false);
        this.ortho.setActive(false);
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

        explorerElement.querySelector(".xeokit-unloadAllModels").addEventListener("click", (event) => {
            this._enableControls(false); // For quick UI feedback
            this.models._unloadModels();
            event.preventDefault();
        });

        // Handling model load events here ensures that we
        // are able to fire "modelLoaded" after both trees updated.

        this.models.on("modelLoaded", (modelId) => {
            this.objects._addModel(modelId);
            this.classes._addModel(modelId);
            if (this.models.getNumModelsLoaded() === 1) {
                this._enableControls(true);
            }
            this.fire("modelLoaded", modelId);
        });

        this.models.on("modelUnloaded", (modelId) => {
            this.objects._removeModel(modelId);
            this.classes._removeModel(modelId);
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
    }

    _customizeViewer() {

        const scene = this.viewer.scene;

        scene.highlightMaterial.edges = true;
        scene.highlightMaterial.edgeColor = [.5, .5, 0];
        scene.highlightMaterial.edgeAlpha = 1.0;
        scene.highlightMaterial.fill = true;
        scene.highlightMaterial.fillAlpha = 0.1;
        scene.highlightMaterial.fillColor = [1, 1, 0];

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
     * Saves viewer state to a BCF viewpoint.
     */
    saveBCFViewpoint() {

    }

    /**
     * Sets viewer state to a BCF viewpoint.
     */
    loadBCFViewpoint() {

    }

    _showAllObjects() {

        this.objects.muteEvents();
        this.classes.muteEvents();

        this.viewer.scene.setObjectsVisible(this.viewer.scene.objectIds, true);

        this.objects.selectAll();
        this.classes.selectAll();

        this.objects.unmuteEvents();
        this.classes.unmuteEvents();
    }

    _hideAllObjects() {

        this.objects.muteEvents();
        this.classes.muteEvents();

        this.viewer.scene.setObjectsVisible(this.viewer.scene.visibleObjectIds, false);

        this.objects.deselectAll();
        this.classes.deselectAll();

        this.objects.unmuteEvents();
        this.classes.unmuteEvents();
    }

    _enableControls(enabled) {

        // Explorer

        this.models.setEnabled(enabled);
        this.objects.setEnabled(enabled);
        this.classes.setEnabled(enabled);

        // Toolbar

        this.reset.setEnabled(enabled);
        this.fit.setEnabled(enabled);
        this.firstPerson.setEnabled(enabled);
        this.ortho.setEnabled(enabled);
        this.query.setEnabled(enabled);
        this.hide.setEnabled(enabled);
        this.select.setEnabled(enabled);
        this.section.setEnabled(enabled);
    }
}

export {ViewerUI};