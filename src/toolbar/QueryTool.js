import {Controller} from "../Controller.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

function closeEnough(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

/** @private */
class QueryTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.bimViewer.on("reset", ()=>{
            this.setActive(false);
        });

        this._init();
    }

    _init() {
        const viewer = this.viewer;
        const cameraControl = viewer.cameraControl;
        var entity = null;
        this._onHover = cameraControl.on("hover", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (entity) {
                entity.highlighted = false;
                entity = null;
            }
            entity = e.entity;
            entity.highlighted = true;
        });
        this._onHoverOff = cameraControl.on("hoverOff", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (entity) {
                entity.highlighted = false;
                entity = null;
            }
        });
        const lastCoords = math.vec2();
        this._onMousedown = viewer.scene.input.on("mousedown", (coords) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            lastCoords[0] = coords[0];
            lastCoords[1] = coords[1];
        });
        this._onMouseup = viewer.scene.input.on("mouseup", (coords) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (entity) {
                if (!closeEnough(lastCoords, coords)) {
                    entity = null;
                    return;
                }
                const model = entity.model;
                if (!model) { // OK to click on entities that don't belong to models - could be a navigation gizmo or helper
                    return;
                }
                const projectId = this.bimViewer.getLoadedProjectId();
                if (!projectId) {
                    this.error("Query tool: should be a project loaded - ignoring query-pick");
                    return;
                }
                const modelId = model.id;
                const objectId = entity.id;
                const metaObject = viewer.metaScene.metaObjects[objectId];
                if (!metaObject) {
                    return;
                }
                const objectName = metaObject.name;
                const objectType = metaObject.type;
                const objectQueryResult = {
                    projectId: projectId,
                    modelId: modelId,
                    objectId: objectId,
                    objectName: objectName,
                    objectType: objectType
                };
                this.fire("queryPicked", objectQueryResult);
                entity = null;
            } else {
                this.fire("queryNotPicked", false);
            }
        });
    }
}

export {QueryTool};