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

const explorerTemplate = `<div class="sidebar-header">
<ul class="nav nav-tabs" id="treeTabs" role="tablist">
    <!-- Models tab -->
    <li class="nav-item">
        <a class="xeokit-modelsTab nav-link active" id="{{models}}-tab" data-toggle="tab" href="#{{models}}" role="tab">Models</a>
    </li>
    <!-- Objects tab -->
    <li class=" nav-item">
        <a class="xeokit-objectsTab nav-link disabled" id="{{objects}}-tab" data-toggle="tab" href="#{{objects}}" role="tab">Objects</a>
    </li>
    <!-- Classes tab -->
    <li class="nav-item">
        <a class="xeokit-classesTab nav-link disabled" id="{{classes}}-tab" data-toggle="tab" href="#{{classes}}" role="tab">Classes</a>
    </li>
</ul>
<div class="tab-content" id="myTabContent">
    <!-- Models tree -->
    <div class="tab-pane fade show active" id="{{models}}" role="tabpanel">
        <div class="explorer-toolbar btn-toolbar" role="toolbar">
            <button type="button" class="xeokit-unloadAllModels btn btn-outline-light disabled">Unload all</button>
        </div>
        <div class="xeokit-models"></div>
    </div>
    <!-- Objects tree -->
    <div class="tab-pane fade" id="{{objects}}" role="tabpanel">
        <div class="explorer-toolbar btn-toolbar" role="toolbar">
            <button type="button" class="xeokit-showAllObjects btn btn-outline-light disabled">Show all</button>
            <button type="button" class="xeokit-hideAllObjects btn btn-outline-light disabled">Hide all</button>
        </div>
        <div class="xeokit-objects tree-panel"></div>
    </div>
    <!-- Classes tree -->
    <div class="tab-pane fade" id="{{classes}}" role="tabpanel">
        <div class="explorer-toolbar btn-toolbar" role="toolbar">
            <button type="button" class="xeokit-showAllClasses btn btn-outline-light disabled">Show all</button>
            <button type="button" class="xeokit-hideAllClasses btn btn-outline-light disabled">Hide all</button>
        </div>
        <div class="xeokit-classes tree-panel"></div>
    </div>
</div>
</div>`;

const toolbarTemplate = `<div class="xeokit-toolbar btn-toolbar" role="toolbar">
    <!-- Reset button -->
    <div class="btn-group mr-2" role="group">
        <button type="button" class="xeokit-reset btn btn-outline-primary fa fa-home fa-2x disabled" data-toggle="tooltip" data-placement="top" title="Reset"></button>
    </div>
    <!-- Fit button -->
    <div class="btn-group mr-2" role="group">
        <button type="button" class="xeokit-fit btn btn-outline-primary fa fa-crop fa-2x disabled" data-toggle="tooltip" data-placement="top" title="Fit view"></button>
    </div>
    <!-- First Person mode button -->
    <div class="btn-group mr-2" role="group">
        <button type="button" class="xeokit-firstPerson btn btn-outline-primary fa fa-male  fa-2x disabled" data-toggle="tooltip" data-placement="top" title="First person mode"></button>
    </div>
    <!-- Ortho mode button -->
    <div class="btn-group mr-2" role="group">
        <button type="button" class="xeokit-ortho btn btn-outline-primary fa fa-cube  fa-2x disabled" data-toggle="tooltip" data-placement="top" title="Orthographic mode"></button>
    </div>
    <!-- Tools button group -->
    <div class="btn-group mr-2" role="group">
        <!-- Hide tool button -->
        <button type="button" class="xeokit-hide btn btn-outline-primary fa fa-eraser fa-2x disabled" data-toggle="tooltip" data-placement="top" title="Hide object tool"></button>
        <!-- Select tool button -->
        <button type="button" class="xeokit-select btn btn-outline-primary fa fa-mouse-pointer fa-2x disabled" data-toggle="tooltip" data-placement="top" title="Select object tool"></button>
        <!-- Slice tool button -->
        <button type="button" class="xeokit-section btn btn-outline-primary fa fa-cut fa-2x disabled" data-toggle="tooltip" data-placement="top" title="Slice tool"></button>
        <!-- Query tool button -->
        <button type="button" class="xeokit-query btn btn-outline-primary fa fa-info-circle fa-2x disabled" data-toggle="tooltip" data-placement="top" title="Query object tool"></button>
    </div>
</div>`;

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

        if (!cfg.queryInfoPanelElement) {
            throw "Config expected: queryInfoPanelElement";
        }

        const canvasElement = cfg.canvasElement;
        const explorerElement = cfg.explorerElement;
        const toolbarElement = cfg.toolbarElement;
        const navCubeCanvasElement = cfg.navCubeCanvasElement;
        const sectionPlanesOverviewCanvasElement = cfg.sectionPlanesOverviewCanvasElement;
        const queryInfoPanelElement = cfg.queryInfoPanelElement;

        super(null, cfg, server, new Viewer({
            canvasElement: canvasElement.get(0),
            transparent: true
        }));

        this._customizeViewer();

        // In explorer HTML, IDs are used to coordinate tabs with their panels;
        // we must generate those IDs to ensure that they are unique within the DOM

        explorerElement.html(explorerTemplate
            .replace(/{{objects}}/g, "objects" + this.viewer.id)
            .replace(/{{models}}/g, "models" + this.viewer.id)
            .replace(/{{classes}}/g, "classes" + this.viewer.id));

        toolbarElement.html(toolbarTemplate);

        this.busyDialog = new BusyDialog(this); // TODO: Support external spinner dialog

        // Explorer

        this.models = new Models(this, {
            modelsTabElement: explorerElement.find(".xeokit-modelsTab"),
            unloadModelsButtonElement: explorerElement.find(".xeokit-unloadAllModels"),
            modelsElement: explorerElement.find(".xeokit-models")
        });

        this.objects = new Objects(this, {
            objectsTabElement: explorerElement.find(".xeokit-objectsTab"),
            showAllObjectsButtonElement: explorerElement.find(".xeokit-showAllObjects"),
            hideAllObjectsButtonElement: explorerElement.find(".xeokit-hideAllObjects"),
            objectsElement: explorerElement.find(".xeokit-objects")
        });

        this.classes = new Classes(this, {
            classesTabElement: explorerElement.find(".xeokit-classesTab"),
            showAllClassesButtonElement: explorerElement.find(".xeokit-showAllClasses"),
            hideAllClassesButtonElement: explorerElement.find(".xeokit-hideAllClasses"),
            classesElement: explorerElement.find(".xeokit-classes")
        });

        // Toolbar

        this.reset = new ResetAction(this, {
            buttonElement: toolbarElement.find(".xeokit-reset"),
            active: false
        });

        this.fit = new FitAction(this, {
            buttonElement: toolbarElement.find(".xeokit-fit"),
            active: false
        });

        this.firstPerson = new FirstPersonMode(this, {
            buttonElement: toolbarElement.find(".xeokit-firstPerson"),
            active: false
        });

        this.ortho = new OrthoMode(this, {
            buttonElement: toolbarElement.find(".xeokit-ortho"),
            active: false
        });

        this.hide = new HideMode(this, {
            buttonElement: toolbarElement.find(".xeokit-hide"),
            active: false
        });

        this.select = new SelectMode(this, {
            buttonElement: toolbarElement.find(".xeokit-select"),
            active: false
        });

        this.query = new QueryMode(this, {
            buttonElement: toolbarElement.find(".xeokit-query"),
            queryInfoPanelElement: queryInfoPanelElement,
            active: false
        });

        this.section = new SectionMode(this, {
            buttonElement: toolbarElement.find(".xeokit-section"),
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

        // $('.xeokit-toggleExplorer').on('click', function () {
        //     $('.toggleExplorer').toggleClass('active');
        //     $('.sidebar').toggleClass('active');
        // });

        explorerElement.find(".xeokit-showAllObjects").on('click', (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        explorerElement.find(".xeokit-hideAllObjects").on('click', (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        explorerElement.find(".xeokit-showAllClasses").on('click', (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        explorerElement.find(".xeokit-hideAllClasses").on('click', (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        explorerElement.find(".xeokit-unloadAllModels").on('click', (event) => {
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