import {Controller} from "./Controller.js";

import {Explorer} from "./explorer/Explorer.js";
import {Toolbar} from "./toolbar/Toolbar.js";
import {CameraMemento} from "../lib/xeokit/viewer/scene/mementos/CameraMemento.js";
import {ObjectsMemento} from "../lib/xeokit/viewer/scene/mementos/ObjectsMemento.js";

/**
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class ViewerUI extends Controller {

    /** @private */
    constructor(server, viewer, cfg = {}) {

        super(null, cfg, server, viewer);

        this._cameraMemento = new CameraMemento();
        this._objectsMemento = new ObjectsMemento();
        this._saved = false;

        this.explorer = new Explorer(this, cfg);
        this.toolbar = new Toolbar(this, cfg);

        this.explorer.on("modelLoaded", () => {
            this._saveState();
        });

        this.explorer.on("modelUnloaded", () => {
            this._saveState();
        });

        this._bindButton("#reset", this, "reset");
        this._bindButton("#fit", this.toolbar.fit, "fit");
        this._bindCheckButton("#firstPerson", this.toolbar.firstPerson);
        this._bindCheckButton("#ortho", this.toolbar.ortho);
        this._bindCheckButton("#query", this.toolbar.query);
        this._bindCheckButton("#hide", this.toolbar.hide);
        this._bindCheckButton("#select", this.toolbar.select);
        this._bindCheckButton("#section", this.toolbar.section);

        this._bindButton("#createBCF", this.toolbar.bcf, "createViewpoint");
        this._bindButton("#clearBCF", this.toolbar.bcf, "clearViewpoints");
        this._bindButton("#clearAnnotations", this.toolbar.annotate, "clearAnnotations");
        this._bindButton("#clearSections", this.toolbar.section, "clearSections");

        $('#tree').on('click', function () {
            $('#sidebar').toggleClass('active');
        });

        $('#bcf').on('click', function () {
            $('#sidebar2').toggleClass('active');
        });
    }

    _saveState() {
        this._cameraMemento.saveCamera(this.viewer.scene);
        this._objectsMemento.saveObjects(this.viewer.scene); // Save all states
        this._saved = true;
    }

    /**
     * Resets the viewer.
     */
    reset() {
        if (!this._saved) {
            this.error("State not saved");
            return;
        }
        this.fire("reset");
        this._objectsMemento.restoreObjects(this.viewer.scene);
        this._cameraMemento.restoreCamera(this.viewer.scene, () => {
        });
    }

    _bindButton(selector, component, action) {
        $(selector).on('click', function (event) {
            component[action]();
            event.preventDefault();
        });
    }

    _bindCheckButton(selector, component) {
        $(selector).on('click', function (event) {
            component.setActive(!component.getActive());
            event.preventDefault();
        });
        component.on("active", (active) => {
            if (active) {
                $(selector).addClass("active");
            } else {
                $(selector).removeClass("active");
            }
        });
        if (component.getActive()) {
            $(selector).addClass("active");
        } else {
            $(selector).removeClass("active");
        }
    }
}

export {ViewerUI};