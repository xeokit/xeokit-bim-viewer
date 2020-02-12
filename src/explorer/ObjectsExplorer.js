import {Controller} from "../Controller.js";
import {TreeViewPlugin} from "@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin.js";
import {TreeViewContextMenu} from "../contextMenus/TreeViewContextMenu.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

const tempVec3 = math.vec3();

/** @private */
class ObjectsExplorer extends Controller {

    constructor(parent, cfg = {}) {

        super(parent);

        if (!cfg.objectsTabElement) {
            throw "Missing config: objectsTabElement";
        }

        if (!cfg.showAllObjectsButtonElement) {
            throw "Missing config: showAllObjectsButtonElement";
        }

        if (!cfg.hideAllObjectsButtonElement) {
            throw "Missing config: hideAllObjectsButtonElement";
        }

        if (!cfg.objectsElement) {
            throw "Missing config: objectsElement";
        }

        this._objectsTabElement = cfg.objectsTabElement;
        this._showAllObjectsButtonElement = cfg.showAllObjectsButtonElement;
        this._hideAllObjectsButtonElement = cfg.hideAllObjectsButtonElement;
        this._objectsTabButtonElement = this._objectsTabElement.querySelector(".xeokit-tab-btn");

        if (!this._objectsTabButtonElement) {
            throw "Missing DOM element: ,xeokit-tab-btn";
        }

        const objectsElement = cfg.objectsElement;

        this._treeView = new TreeViewPlugin(this.viewer, {
            containerElement: objectsElement,
            hierarchy: "containment",
            autoAddModels: false,
            pruneEmptyNodes: true
        });

        this._treeViewContextMenu = new TreeViewContextMenu();

        this._treeView.on("contextmenu", (e) => {
            this._treeViewContextMenu.context = {
                viewer: e.viewer,
                treeViewPlugin: e.treeViewPlugin,
                treeViewNode: e.treeViewNode
            };
            this._treeViewContextMenu.show(e.event.pageX, e.event.pageY);
        });

        // Left-clicking on a tree node isolates that object in the 3D view

        this._treeView.on("nodeTitleClicked", (e) => {
            const scene = this.viewer.scene;
            const objectIds = [];
            e.treeViewPlugin.withNodeTree(e.treeViewNode, (treeViewNode) => {
                if (treeViewNode.objectId) {
                    objectIds.push(treeViewNode.objectId);
                }
            });

            scene.setObjectsXRayed(scene.objectIds, true);
            scene.setObjectsVisible(scene.objectIds, true);
            scene.setObjectsPickable(scene.objectIds, false);
            scene.setObjectsSelected(scene.selectedObjectIds, false);

            scene.setObjectsXRayed(objectIds, false);
            scene.setObjectsVisible(objectIds, true);
            scene.setObjectsPickable(objectIds, true);

            const aabb = scene.getAABB(objectIds);

            this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);

            this.viewer.cameraFlight.flyTo({
                aabb: aabb,
                duration: 0.5
            }, () => {
                // setTimeout(function () {
                //     scene.setObjectsVisible(scene.xrayedObjectIds, false);
                //     scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                // }, 500);
            });
        });

        this._onModelLoaded = this.viewer.scene.on("modelLoaded", (modelId) => {
            if (this.viewer.metaScene.metaModels[modelId]) {
                const modelInfo = this.bimViewer._modelsExplorer.getModelInfo(modelId);
                if (!modelInfo) {
                    return;
                }
                this._treeView.addModel(modelId, {
                    rootName: modelInfo.name
                });
            }
        });

        this._onModelUnloaded = this.viewer.scene.on("modelUnloaded", (modelId) => {
            if (this.viewer.metaScene.metaModels[modelId]) {
                this._treeView.removeModel(modelId);
            }
        });

        this.bimViewer.on("reset", ()=>{
            this._treeView.collapse();
        });
    }

    setEnabled(enabled) {
        if (!enabled) {
            this._objectsTabButtonElement.classList.add("disabled");
            this._showAllObjectsButtonElement.classList.add("disabled");
            this._hideAllObjectsButtonElement.classList.add("disabled");
        } else {
            this._objectsTabButtonElement.classList.remove("disabled");
            this._showAllObjectsButtonElement.classList.remove("disabled");
            this._hideAllObjectsButtonElement.classList.remove("disabled");
        }
    }

    showNodeInTreeView(objectId) {
        this._treeView.collapse();
        this._treeView.showNode(objectId);
    }

    unShowNodeInTreeView() {
        this._treeView.unShowNode();
    }

    destroy() {
        super.destroy();
        this._treeView.destroy();
        this._treeViewContextMenu.destroy();
        this.viewer.scene.off(this._onModelLoaded);
        this.viewer.scene.off(this._onModelUnloaded);
    }
}

export {ObjectsExplorer};