import {Controller} from "../Controller.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

function closeEnough(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

/** @private */
class HideTool extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

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
                this.viewer.cameraControl.doublePickFlyTo = false;
            } else {
                buttonElement.classList.remove("active");
                this.viewer.cameraControl.doublePickFlyTo = true;
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

        this._init();
    }

    _init() {
        var entity = null;
        this._onHover = this.viewer.cameraControl.on("hover", (e) => {
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
        this._onHoverOff = this.viewer.cameraControl.on("hoverOff", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (entity) {
                entity.highlighted = false;
                entity = null;
            }
        });
        const lastCoords = math.vec2();
        const input = this.viewer.scene.input;
        this._onMousedown = input.on("mousedown", (coords) => {
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
                entity.visible = false;
                entity.highlighted = false;
                entity = null;
            }
        });
    }
}

export {HideTool};