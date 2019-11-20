import {Controller} from "../Controller.js";
import {math} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

function closeEnough(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

class HideMode extends Controller {

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
            } else {
                buttonElement.classList.remove("active");
            }
        });

        this.on("active", (active) => {
           this.activateHideMode(active);
        });

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }

    activateHideMode(active) {
        if (active) {
            var entity = null;
            this._onHover = this.viewer.cameraControl.on("hover", (e) => {
                if (entity) {
                    entity.highlighted = false;
                    entity = null;
                }
                entity = e.entity;
                entity.highlighted = true;
            });
            this._onHoverOff = this.viewer.cameraControl.on("hoverOff", (e) => {
                if (entity) {
                    entity.highlighted = false;
                    entity = null;
                }
            });
            const lastCoords = math.vec2();
            this._onMousedown = this.viewer.scene.input.on("mousedown", (coords) => {
                lastCoords[0] = coords[0];
                lastCoords[1] = coords[1];
            });
            this._onMouseup = this.viewer.scene.input.on("mouseup", (coords) => {
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
        } else {
            if (entity) {
                entity.highlighted = false;
                entity = null;
            }
            this.viewer.cameraControl.off(this._onHover);
            this.viewer.cameraControl.off(this._onHoverOff);
            this.viewer.cameraControl.off(this._onMousedown);
            this.viewer.cameraControl.off(this._onMouseup);
        }
    }
}

export {HideMode};