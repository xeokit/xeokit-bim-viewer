import {Controller} from "../Controller.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";


function closeEnough(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

/** @private */
class SelectionTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
                const scene = this.viewer.scene;
                scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.bimViewer.on("reset", () => {
            this.setActive(false);
        });

        this._initSectionMode();
    }

    _initSectionMode() {
        const viewer = this.viewer;
        const cameraControl = viewer.cameraControl;
        var entity = null;
        this._onHover = cameraControl.on("hover", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (entity) {
                entity.highlighted = false;
                entity = null;
            }
            if (!e.entity || !e.entity.isObject) {
                return;
            }
            entity = e.entity;
            entity.highlighted = true;
        });
        this._onHoverOff = cameraControl.on("hoverOff", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (entity) {
                entity.highlighted = false;
                entity = null;
            }
        });
        const lastCoords = math.vec2();
        const input = viewer.scene.input;
        this._onMousedown = input.on("mousedown", (coords) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (!input.mouseDownLeft || input.mouseDownRight || input.mouseDownMiddle) {
                return;
            }
            lastCoords[0] = coords[0];
            lastCoords[1] = coords[1];
        });
        this._onMouseup = input.on("mouseup", (coords) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (entity) {
                if (!closeEnough(lastCoords, coords)) {
                    entity = null;
                    return;
                }
                entity.selected = !entity.selected;
                entity = null;
            }
        });
    }
}

export {SelectionTool};