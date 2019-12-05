import {Controller} from "../Controller.js";

class Classes extends Controller {

    constructor(parent, cfg = {}) {

        super(parent);

        if (!cfg.classesTabElement) {
            throw "Missing config: classesTabElement";
        }

        if (!cfg.showAllClassesButtonElement) {
            throw "Missing config: showAllClassesButtonElement";
        }

        if (!cfg.hideAllClassesButtonElement) {
            throw "Missing config: hideAllClassesButtonElement";
        }

        if (!cfg.classesElement) {
            throw "Missing config: classesElement";
        }

        this._classesTabElement = cfg.classesTabElement;
        this._showAllClassesButtonElement = cfg.showAllClassesButtonElement;
        this._hideAllClassesButtonElement = cfg.hideAllClassesButtonElement;
        this._classesElement = cfg.classesElement;
        this._classesTabButtonElement = this._classesTabElement.querySelector(".xeokit-tab-btn");

        if (!this._classesTabButtonElement) {
            throw "Missing DOM element: ,xeokit-tab-btn";
        }

        this._muteCheckBoxEvents = false;
        this._muteEntityEvents = false;

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
                    document.getElementById("" + type).checked = true;
                }
            } else {
                classData.numObjectsVisible--;
                if (classData.numObjectsVisible === 0) {
                    document.getElementById("" + type).checked = false;
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
        // console.log("Classes._createData() " + (t1 - t0));
    }

    _repaint() {
        const html = [];
        for (var type in this._data) {
            const classData = this._data[type];
            html.push("<div class='xeokit-form-check'>");
            html.push("<input id='");
            html.push(type);
            html.push("' type='checkbox' value=''");
            if (classData.numObjectsVisible > 0) {
                html.push(" checked ");
            }
            html.push(">");
            html.push(type);
            html.push("</div>");
        }
        this._classesElement.innerHTML = html.join("");
        for (var type in this._data) {
            const classData = this._data[type];
            const checkBox = document.getElementById("" + type);
            const objectIds = this.viewer.metaScene.getObjectIDsByType(type);
            checkBox.addEventListener("click", () => {
                if (this._muteCheckBoxEvents) {
                    return;
                }
                const visible = checkBox.checked;
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
    }

    setEnabled(enabled) {
        if (!enabled) {
            this._classesTabButtonElement.classList.add("disabled");
            this._showAllClassesButtonElement.classList.add("disabled");
            this._hideAllClassesButtonElement.classList.add("disabled");
        } else {
            this._classesTabButtonElement.classList.remove("disabled");
            this._showAllClassesButtonElement.classList.remove("disabled");
            this._hideAllClassesButtonElement.classList.remove("disabled");
        }
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
            document.getElementById("" + type).checked = true;
        }
    }

    deselectAll() {
        for (var type in this._data) {
            const classData = this._data[type];
            classData.numObjectsVisible = 0;
            document.getElementById("" + type).checked = false;
        }
    }

    destroy() {
        super.destroy();
    }
}

export {Classes};