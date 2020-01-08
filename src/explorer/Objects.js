import {Controller} from "../Controller.js";
import {TreeViewPlugin} from "@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin.js";
import {TreeViewContextMenuItems} from "../contextMenuItems/TreeViewContextMenuItems.js";
import {ContextMenu} from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

class Objects extends Controller {

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
            autoAddModels: false
        });

        this._treeViewContextMenu = new ContextMenu({
            items: TreeViewContextMenuItems
        });

        this._treeView.on("contextmenu", (e) => {
            this._treeViewContextMenu.show(e.event.pageX, e.event.pageY);
            this._treeViewContextMenu.context = {
                viewer: e.viewer,
                treeViewPlugin: e.treeViewPlugin,
                treeViewNode: e.treeViewNode
            };
        });

        this._onModelLoaded = this.viewer.scene.on("modelLoaded", (modelId) => {
            if (this.viewer.metaScene.metaModels[modelId]) {
                this._treeView.addModel(modelId);
            }
        });

        this._onModelUnloaded = this.viewer.scene.on("modelUnloaded", (modelId) => {
            if (this.viewer.metaScene.metaModels[modelId]) {
                this._treeView.removeModel(modelId);
            }
        });

        this.viewerUI.on("reset", ()=>{
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

    destroy() {
        super.destroy();
        this._treeView.destroy();
        this._treeViewContextMenu.destroy();
        this.viewer.scene.off(this._onModelLoaded);
        this.viewer.scene.off(this._onModelUnloaded);
    }
}

export {Objects};