import {Controller} from "../Controller.js";
import {SectionToolContextMenu} from "./../contextMenus/SectionToolContextMenu.js";
import {math, SectionPlanesPlugin} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

/** @private */
class SectionTool extends Controller { // XX

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
        this._containerElement = cfg.containerElement;
        this._menuButtonElement = cfg.menuButtonElement;
        this._menuButtonArrowElement = cfg.menuButtonArrowElement;

        this._sectionPlanesPlugin = new SectionPlanesPlugin(this.viewer, {});

        this._sectionToolContextMenu = new SectionToolContextMenu({
            sectionPlanesPlugin: this._sectionPlanesPlugin,
            hideOnMouseDown: false,
            hideOnAction: false,
            parentNode: this._containerElement
        });

        this._sectionPlanesPlugin.setOverviewVisible(false);

        this.on("enabled", (enabled) => {
            if (!enabled) {
                this._buttonElement.classList.add("disabled");
                if (this._counterElement) {
                    this._counterElement.classList.add("disabled");
                }
                this._menuButtonElement.classList.add("disabled");
                this._menuButtonArrowElement.classList.add("disabled");
            } else {
                this._buttonElement.classList.remove("disabled");
                if (this._counterElement) {
                    this._counterElement.classList.remove("disabled");
                }
                this._menuButtonElement.classList.remove("disabled");
                this._menuButtonArrowElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                this._buttonElement.classList.add("active");
                if (this._counterElement) {
                    this._counterElement.classList.add("active");
                }
                this._menuButtonElement.classList.add("active");
                this._menuButtonArrowElement.classList.add("active");
            } else {
                this._buttonElement.classList.remove("active");
                if (this._counterElement) {
                    this._counterElement.classList.remove("active");
                }
                this._menuButtonElement.classList.remove("active");
                this._menuButtonArrowElement.classList.remove("active");
            }
        });

        this.on("active", (active) => {
            if (!active) {
                this._sectionPlanesPlugin.hideControl();
            }
        });

        this._buttonElement.addEventListener("click", (e) => {
            if (!this.getEnabled()) {
                return;
            }
            if (e.target === this._menuButtonElement || e.target.parentNode === this._menuButtonElement) {
                if (this._sectionToolContextMenu.shown) {
                    this._sectionToolContextMenu.hide();
                } else {
                    this._sectionToolContextMenu.context = {
                        bimViewer: this.bimViewer,
                        viewer: this.viewer,
                        sectionTool: this
                    };

                    const rect = this._menuButtonElement.getBoundingClientRect();

                    this._sectionToolContextMenu.show(rect.left + scrollX, rect.bottom + window.scrollY + 5);
                }
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            e.preventDefault();
        });

        this._sectionToolContextMenu.on("shown", () => {
            this._menuButtonArrowElement.classList.remove("xeokit-arrow-down");
            this._menuButtonArrowElement.classList.add("xeokit-arrow-up");
        });

        this._sectionToolContextMenu.on("hidden", () => {
            this._menuButtonArrowElement.classList.remove("xeokit-arrow-up");
            this._menuButtonArrowElement.classList.add("xeokit-arrow-down");
        });

        this.bimViewer.on("reset", () => {
            this.clear();
            this.setActive(false);
        });

        this.viewer.scene.on("sectionPlaneCreated", () => {
            this._updateSectionPlanesCount();
        });

        this.viewer.scene.on("sectionPlaneDestroyed", () => {
            this._updateSectionPlanesCount();
        });

        this._initSectionMode();
    }

    _initSectionMode() {

        this._containerElement.addEventListener('mouseup', (e) => {

            if (e.which === 1) {

                const coords = getMouseCanvasPos(e);
                if (!this.getActive() || !this.getEnabled()) {
                    return;
                }

                const pickResult = this.viewer.scene.pick({
                    canvasPos: coords,
                    pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
                });

                if (pickResult && pickResult.entity && pickResult.entity.isObject) { // Only slice model objects, not 3D UI helpers

                    const sectionPlane = this._sectionPlanesPlugin.createSectionPlane({
                        pos: pickResult.worldPos,
                        dir: math.mulVec3Scalar(pickResult.worldNormal, -1)
                    });

                    this._sectionPlanesPlugin.showControl(sectionPlane.id);
                }
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
        return Object.keys(this.viewer.scene.sectionPlanes).length;
    }

    clear() {
        this._sectionPlanesPlugin.clear();
        this._updateSectionPlanesCount();
    }

    flipSections() {
        this._sectionPlanesPlugin.flipSectionPlanes();
    }

    enableSections() {
        const sectionPlanes = this.viewer.scene.sectionPlanes;
        for (let id in sectionPlanes) {
            const sectionPlane = sectionPlanes[id];
            sectionPlane.active = true;
        }
    }

    disableSections() {
        const sectionPlanes = this.viewer.scene.sectionPlanes;
        for (let id in sectionPlanes) {
            const sectionPlane = sectionPlanes[id];
            sectionPlane.active = false;
        }
    }

    hideControl() {
        this._sectionPlanesPlugin.hideControl();
    }

    destroy() {
        this._sectionPlanesPlugin.destroy();
        this._sectionToolContextMenu.destroy();
        super.destroy();
    }
}

function getMouseCanvasPos(event) {
    if (!event) {
        event = window.event;
        this.mouseCanvasPos[0] = event.x;
        this.mouseCanvasPos[1] = event.y;
    } else {
        let element = event.target;
        let totalOffsetLeft = 0;
        let totalOffsetTop = 0;
        while (element.offsetParent) {
            totalOffsetLeft += element.offsetLeft;
            totalOffsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        return [event.pageX - totalOffsetLeft, event.pageY - totalOffsetTop];
    }
}

export {SectionTool};