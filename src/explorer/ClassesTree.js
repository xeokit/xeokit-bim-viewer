import {Controller} from "../Controller.js";


/**
 * Manages the classes tree.
 *
 * Located at {@link Explorer#classes}.
 */
class ClassesTree extends Controller {

    /** @private */
    constructor(parent, cfg = {}) {

        super(parent);

        this._muteTreeEvents = false;
        this._muteEntityEvents = false;

        this._tree = new InspireTree({
            selection: {
                autoSelectChildren: true,
                autoDeselect: true,
                mode: 'checkbox'
            },
            checkbox: {
                autoCheckChildren: true
            },
            data: []
        });

        new InspireTreeDOM(this._tree, {
            target: document.getElementById(cfg.classesTreePanelId)
        });

        this._tree.on("model.loaded", () => {

            this._tree.select();

            this._tree.on('node.selected', (event, node) => {
                if (this._muteTreeEvents) {
                    return;
                }
                const objectId = event.id;
                const entity = this.viewer.scene.objects[objectId];
                if (entity) {
                    this._muteEntityEvents = true;
                    entity.visible = true;
                    this._muteEntityEvents = false;
                }
            });

            this._tree.on('node.deselected', (event, node) => {
                if (this._muteTreeEvents) {
                    return;
                }
                const objectId = event.id;
                const entity = this.viewer.scene.objects[objectId];
                if (entity) {
                    this._muteEntityEvents = true;
                    entity.visible = false;
                    this._muteEntityEvents = false;
                }
            });

            this.viewer.scene.on("objectVisibility", (entity) => {
                if (this._muteEntityEvents) {
                    return;
                }
                const node = this._tree.node(entity.id);
                if (!node) {
                    return;
                }
                this._muteTreeEvents = true;
                entity.visible ? node.check(true) : node.uncheck(true);
                this._muteTreeEvents = false;
            });
        });

        // this.viewer.scene.on("modelLoaded", () => {
        //     this._rebuild(cfg);
        // });
        //
        // this.viewer.scene.on("modelDestroyed", () => { // TODO: Need this event
        //     this._rebuild(cfg);
        // });
    }

    _addModel(modelId) {
        this._rebuild();
    }

    _removeModel(modelId) {
        this._rebuild();
    }

    _rebuild(cfg) {
        this._tree.removeAll();
        this._tree.addNodes(this._createData());
    }

    _createData() {
        const data = [];
        const metaTypes = {};
        const objects = this.viewer.scene.objects;
        const metaObjects = this.viewer.metaScene.metaObjects;
        for (var objectId in objects) {
            if (objects.hasOwnProperty(objectId)) {
                const metaObject = metaObjects[objectId];
                if (metaObject) {
                    var metaType = metaTypes[metaObject.type];
                    if (!metaType) {
                        metaType = {
                            id: metaObject.type,
                            text: metaObject.type,
                            children: []
                        };
                        data.push(metaType);
                        metaTypes[metaObject.type] = metaType;
                    }
                    metaType.children.push({
                        id: objectId,
                        text: metaObject.name
                    })
                }
            }
        }
        return data;
    }

    muteEvents() {
        this._muteTreeEvents = true;
        this._muteEntityEvents = true;
    }

    unmuteEvents() {
        this._muteTreeEvents = false;
        this._muteEntityEvents = false;
    }

    selectAll() {
        this._tree.selectDeep();
    }

    deselectAll() {
        this._tree.deselectDeep();
    }

    destroy() {
        super.destroy();
    }
}

export {ClassesTree};