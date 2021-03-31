import {Controller} from "../Controller.js";

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

                this._onPick = this.viewer.cameraControl.on("picked", (pickResult) => {
                    if (!pickResult.entity) {
                        return;
                    }
                    const entity = pickResult.entity;
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
                    const metaObject = this.viewer.metaScene.metaObjects[objectId];
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
                });

                this._onPickedNothing = this.viewer.cameraControl.on("pickedNothing", (pickResult) => {
                    this.fire("queryNotPicked", false);
                });

            } else {

                buttonElement.classList.remove("active");

                if (this._onPick !== undefined) {
                    this.viewer.cameraControl.off(this._onPick);
                    this.viewer.cameraControl.off(this._onPickedNothing);
                    this._onPick = undefined;
                    this._onPickedNothing = undefined;
                }
            }
        });

        buttonElement.addEventListener("click", (event) => {
            this.bimViewer._sectionTool.hideControl();
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.bimViewer.on("reset", () => {
            this.setActive(false);
        });
    }
}

export {QueryTool};