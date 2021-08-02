import {Controller} from "../Controller.js";

/** @private */
class QueryTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        this.on("active", (active) => {

            if (active) {

                this._onPick = this.viewer.cameraControl.on("picked", (pickResult) => {
                    if (!pickResult.entity) {
                        return;
                    }
                    this.queryEntity(pickResult.entity);
                });

                this._onPickedNothing = this.viewer.cameraControl.on("pickedNothing", () => {
                    this.fire("queryNotPicked", false);
                });

            } else {

                if (this._onPick !== undefined) {
                    this.viewer.cameraControl.off(this._onPick);
                    this.viewer.cameraControl.off(this._onPickedNothing);
                    this._onPick = undefined;
                    this._onPickedNothing = undefined;
                }
            }
        });

        this.bimViewer.on("reset", () => {
            this.setActive(false);
        });
    }

    queryObject(objectId) {
        const metaObject = this.viewer.metaScene.metaObjects[objectId];
        if (metaObject) {
            this.queryMetaObject(metaObject);
        }
    }

    queryMetaObject(metaObject) {
        const projectId = this.bimViewer.getLoadedProjectId();
        if (!projectId) {
            this.error("Query tool: should be a project loaded - ignoring query-pick");
            return;
        }
        const metaModel = metaObject.metaModel;
        const modelId = metaModel.id;
        const objectId = metaObject.id;
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
    }

    queryEntity(entity) {
        const model = entity.model;
        if (!model) { // Navigation gizmo
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
    }
}

export {QueryTool};