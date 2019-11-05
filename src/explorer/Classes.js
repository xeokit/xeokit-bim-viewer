import {Controller} from "../Controller.js";


/**
 * Manages the classes menu.
 *
 * Located at {@link Explorer#classes}.
 */
class Classes extends Controller {

    /** @private */
    constructor(parent, cfg = {}) {

        super(parent);

        this._muteCheckBoxEvents = false;
        this._muteEntityEvents = false;

        this._element = document.getElementById(cfg.classesTreePanelId);

        this._data = {};

        this.viewer.scene.on("objectVisibility", (entity) => {
            if (this._muteEntityEvents) {
                return;
            }
            const metaObject = this.viewer.metaScene.metaObjects[entity.id];
            if (!metaObject) {
                return;
            }
            const type = metaObject.type;
            const classData = this._data[type];
            if (!classData) {
                return;
            }
            this._muteCheckBoxEvents = true;
            if (entity.visible) {
                classData.numObjectsVisible++;
                if (classData.numObjectsVisible === 1) {
                    $("#" + type).prop("checked", true);
                }
            } else {
                classData.numObjectsVisible--;
                if (classData.numObjectsVisible === 0) {
                    $("#" + type).prop("checked", false);
                }
            }
            this._muteCheckBoxEvents = false;
        });

    }

    _addModel(modelId) {
        this._rebuild();
    }

    _removeModel(modelId) {
        this._rebuild();
    }

    _rebuild(cfg) {
        this._createData();
        this._repaint();
    }

    _createData() {
        var t0 = performance.now();
        this._data = {};
        const objectIds = this.viewer.scene.objectIds;
        const metaObjects = this.viewer.metaScene.metaObjects;
        const objects = this.viewer.scene.objects;
        for (var i = 0, len = objectIds.length; i < len; i++) {
            const objectId = objectIds[i];
            const metaObject = metaObjects[objectId];
            if (metaObject) {
                const type = metaObject.type;
                const entity = objects[objectId];
                var classData = this._data[type];
                if (!classData) {
                    classData = {
                        numObjectsVisible: 0,
                        numObjects: 0
                    };
                    this._data[type] = classData;
                }
                if (entity.visible) {
                    classData.numObjectsVisible++;
                }
                classData.numObjects++;
            }
        }
        var t1 = performance.now();
        console.log("Classes._createData() " + (t1 - t0));
    }

    _repaint() {
        var t0 = performance.now();
        const html = [];
        for (var type in this._data) {
            const classData = this._data[type];
            html.push("<div class='form-check'>");
            html.push("<label class='form-check-label'>");
            html.push("<input id='");
            html.push(type);
            html.push("' type='checkbox' class='form-check-input' value=''");
            if (classData.numObjectsVisible > 0) {
                html.push(" checked ");
            }
            html.push(">");
            html.push(type);
            html.push("</label>");
            html.push("</div>");
        }
        this._element.innerHTML = html.join("");
        for (var type in this._data) {
            const classData = this._data[type];
            const checkBox = $("#" + type);
            const _type = type;
            const objectIds = this.viewer.metaScene.getObjectIDsByType(_type);
            checkBox.on('click', () => {
                if (this._muteCheckBoxEvents) {
                    return;
                }
                const visible = checkBox.prop("checked");
                this._muteEntityEvents = true;
                this.viewer.scene.setObjectsVisible(objectIds, visible);
                if (visible) {
                    classData.numObjectsVisible += objectIds.length;
                } else {
                    classData.numObjectsVisible -= objectIds.length;
                }
                this._muteEntityEvents = false;
            });
        }
        var t1 = performance.now();
        console.log("Classes._repaint() " + (t1 - t0));
    }

    muteEvents() {
        this._muteCheckBoxEvents = true;
        this._muteEntityEvents = true;
    }

    unmuteEvents() {
        this._muteCheckBoxEvents = false;
        this._muteEntityEvents = false;
    }

    selectAll() {
        for (var type in this._data) {
            const classData = this._data[type];
            classData.numObjectsVisible = classData.numObjects;
            $("#" + type).prop("checked", true);
        }
    }

    deselectAll() {
        for (var type in this._data) {
            const classData = this._data[type];
            classData.numObjectsVisible = 0;
            $("#" + type).prop("checked", false);
        }
    }

    destroy() {
        super.destroy();
    }
}

export {Classes};