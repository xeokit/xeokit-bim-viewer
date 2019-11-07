import {Controller} from "./Controller.js";

import {Explorer} from "./explorer/Explorer.js";
import {Toolbar} from "./toolbar/Toolbar.js";
import {BusyDialog} from "./BusyDialog.js";

/**
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class ViewerUI extends Controller {

    /** @private */
    constructor(server, viewer, cfg = {}) {

        super(null, cfg, server, viewer);

        this.busyDialog = new BusyDialog(this);

        this.explorer = new Explorer(this, cfg);

        this.toolbar = new Toolbar(this, cfg);

        this._bindButton("#reset", this.toolbar.reset, "reset");
        this._bindButton("#fit", this.toolbar.fit, "fit");
        this._bindCheckButton("#firstPerson", this.toolbar.firstPerson);
        this._bindCheckButton("#ortho", this.toolbar.ortho);
        this._bindCheckButton("#query", this.toolbar.query);
        this._bindCheckButton("#hide", this.toolbar.hide);
        this._bindCheckButton("#select", this.toolbar.select);
        this._bindCheckButton("#section", this.toolbar.section);

        this._bindButton("#unloadModels", this.explorer.models, "unloadModels");

        this._bindButton("#createIssue", this.explorer.issues, "createIssue");
        this._bindButton("#clearIssues", this.explorer.issues, "clearIssues");

        $('#tree').on('click', function () {
            $('#sidebar').toggleClass('active');
        });

        this.toolbar.query.on("active", (active) => {
            if (active) {
                $('#sidebar2').addClass('active');
            } else {
                $('#sidebar2').removeClass('active');
            }
        });

        $('#query').on('click', function () {

        });

        this.explorer.models.on("modelLoaded", () => {
            if (this.explorer.models.getNumModelsLoaded() === 1) {
                this.toolbar.reset.saveState();
                this._setToolbarButtonsEnabled(true);
            }
        });

        this.explorer.models.on("modelUnloaded", () => {
            if (this.explorer.models.getNumModelsLoaded() === 0) {
                this._setToolbarButtonsEnabled(false);
            }
        });
    }

    _setToolbarButtonsEnabled(enabled) {
        this.explorer.setToolbarEnabled(enabled);
        this.toolbar.reset.setEnabled(enabled);
        this.toolbar.fit.setEnabled(enabled);
        this.toolbar.firstPerson.setEnabled(enabled);
        this.toolbar.ortho.setEnabled(enabled);
        this.toolbar.query.setEnabled(enabled);
        this.toolbar.hide.setEnabled(enabled);
        this.toolbar.select.setEnabled(enabled);
        this.toolbar.section.setEnabled(enabled);
    }

    _bindButton(selector, component, action) {
        $(selector).on('click', function (event) {
            component[action]();
            event.preventDefault();
        });
        component.on("enabled", (enabled) => {
            if (!enabled) {
                $(selector).addClass("disabled");
            } else {
                $(selector).removeClass("disabled");
            }
        });
        if (!component.getEnabled()) {
            $(selector).addClass("disabled");
        } else {
            $(selector).removeClass("disabled");
        }
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
        component.on("enabled", (enabled) => {
            if (!enabled) {
                $(selector).addClass("disabled");
            } else {
                $(selector).removeClass("disabled");
            }
        });
        if (!component.getEnabled()) {
            $(selector).addClass("disabled");
        } else {
            $(selector).removeClass("disabled");
        }
    }
}

export {ViewerUI};