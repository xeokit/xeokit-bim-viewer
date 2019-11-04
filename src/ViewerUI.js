import {Controller} from "./Controller.js";

import {Explorer} from "./explorer/Explorer.js";
import {Toolbar} from "./toolbar/Toolbar.js";

/**
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class ViewerUI extends Controller {

    /** @private */
    constructor(server, viewer, cfg = {}) {

        super(null, cfg, server, viewer);

        this.explorer = new Explorer(this, cfg);

        this.toolbar = new Toolbar(this, cfg);

        this.explorer.on("modelLoaded", () => {
            this.toolbar.reset.saveState();
        });

        this.explorer.on("modelUnloaded", () => {
            this.toolbar.reset.saveState();
        });

        this._bindButton("#reset", this.toolbar.reset, "reset");
        this._bindButton("#fit", this.toolbar.fit, "fit");

        this._bindCheckButton("#firstPerson", this.toolbar.firstPerson);

        this._bindCheckButton("#ortho", this.toolbar.ortho);

        this._bindCheckButton("#query", this.toolbar.query);
        this._bindCheckButton("#xray", this.toolbar.xray);
        this._bindCheckButton("#hide", this.toolbar.hide);
        this._bindCheckButton("#select", this.toolbar.select);
        this._bindCheckButton("#distance", this.toolbar.distance);
        this._bindCheckButton("#angle", this.toolbar.angle);
        this._bindCheckButton("#section", this.toolbar.section);
        this._bindCheckButton("#annotate", this.toolbar.annotate);

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

    /**
     * Opens the Explorer side panel
     */
    openExplorer() {
        $("#sidebar").addClass("active");
    }

    /**
     * Closes the Explorer side panel
     */
    closeExplorer() {
        $("#sidebar").removeClass("active");
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