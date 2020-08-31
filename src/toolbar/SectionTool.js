import {Controller} from "../Controller.js";
import {SectionPlanesPlugin} from "@xeokit/xeokit-sdk/src/plugins/SectionPlanesPlugin/SectionPlanesPlugin.js";
import {SectionToolContextMenu} from "./../contextMenus/SectionToolContextMenu.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

/** @private */
class SectionTool extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        if (!cfg.menuButtonElement) {
            throw "Missing config: menuButtonElement";
        }

        this._buttonElement = cfg.buttonElement;
        this._counterElement = cfg.counterElement;
        this._menuButtonElement = cfg.menuButtonElement;

        this._sectionPlanesPlugin = new SectionPlanesPlugin(this.viewer, {});

        this._sectionToolContextMenu = new SectionToolContextMenu({
            sectionPlanesPlugin: this._sectionPlanesPlugin
        });

        this._sectionPlanesPlugin.setOverviewVisible(false);

        this.on("enabled", (enabled) => {
            if (!enabled) {
                this._buttonElement.classList.add("disabled");
                if (this._counterElement) {
                    this._counterElement.classList.add("disabled");
                }
                this._menuButtonElement.classList.add("disabled");
            } else {
                this._buttonElement.classList.remove("disabled");
                if (this._counterElement) {
                    this._counterElement.classList.remove("disabled");
                }
                this._menuButtonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                this._buttonElement.classList.add("active");
                if (this._counterElement) {
                    this._counterElement.classList.add("active");
                }
                this._menuButtonElement.classList.add("active");
            } else {
                this._buttonElement.classList.remove("active");
                if (this._counterElement) {
                    this._counterElement.classList.remove("active");
                }
                this._menuButtonElement.classList.remove("active");
            }
        });

        this.on("active", (active) => {
            if (!active) {
                this._sectionPlanesPlugin.hideControl();
            }
        });

        this._buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this._menuButtonElement.onclick = (e) => {
            this._sectionToolContextMenu.context = {
                bimViewer: this.bimViewer,
                viewer: this.viewer,
                sectionTool: this
            };
            const rect = this._menuButtonElement.getBoundingClientRect();
            this._sectionToolContextMenu.show(rect.left, rect.bottom - 1);
            e.preventDefault();
        };

        this.bimViewer.on("reset", () => {
            this.clear();
            this.setActive(false);
        });

        this._initSectionMode();
    }

    _initSectionMode() {

        this.viewer.scene.input.on("mouseclicked", (coords) => {

            if (!this.getActive() || !this.getEnabled()) {
                return;
            }

            const pickResult = this.viewer.scene.pick({
                canvasPos: coords,
                pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
            });

            if (pickResult) {

                const sectionPlane = this._sectionPlanesPlugin.createSectionPlane({
                    pos: pickResult.worldPos,
                    dir: math.mulVec3Scalar(pickResult.worldNormal, -1)
                });

                this._sectionPlanesPlugin.showControl(sectionPlane.id);

                this._updateSectionPlanesCount();
            }
        });

        this._updateSectionPlanesCount();
    }

    _updateSectionPlanesCount() {
        if (this._counterElement) {
            this._counterElement.innerText = ("" + this.getNumSections());
        }
    }

    getNumSections() {
        return Object.keys(this._sectionPlanesPlugin.sectionPlanes).length;
    }

    clear() {
        this._sectionPlanesPlugin.clear();
        this._updateSectionPlanesCount();
    }

    flipSections() {
        this._sectionPlanesPlugin.flipSectionPlanes();
    }

    destroy() {
        this._sectionPlanesPlugin.destroy();
        this._sectionToolContextMenu.destroy();
        super.destroy();
    }
}

export {SectionTool};