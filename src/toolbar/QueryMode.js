import {Controller} from "../Controller.js";
import {math} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

function closeEnough(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

class QueryMode extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.addClass("disabled");
            } else {
                buttonElement.removeClass("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.addClass("active");
            } else {
                buttonElement.removeClass("active");
            }
        });

        this.on("active", (active) => {
            const viewer = this.viewer;
            const cameraControl = viewer.cameraControl;
            if (active) {
                var entity = null;
                this._onHover = cameraControl.on("hover", (e) => {
                    if (entity) {
                        entity.highlighted = false;
                        entity = null;
                    }
                    entity = e.entity;
                    entity.highlighted = true;
                });
                this._onHoverOff = cameraControl.on("hoverOff", (e) => {
                    if (entity) {
                        entity.highlighted = false;
                        entity = null;
                    }
                });
                const lastCoords = math.vec2();
                this._onMousedown = viewer.scene.input.on("mousedown", (coords) => {
                    lastCoords[0] = coords[0];
                    lastCoords[1] = coords[1];
                });
                this._onMouseup = viewer.scene.input.on("mouseup", (coords) => {
                    if (entity) {
                        if (!closeEnough(lastCoords, coords)) {
                            entity = null;
                            return;
                        }
                        this.fire("queryPicked", entity.id);
                        entity = null;
                    } else {
                        this.fire("queryNotPicked", false);
                    }
                });
            } else {
                cameraControl.off(this._onHover);
                cameraControl.off(this._onHoverOff);
                cameraControl.off(this._onMousedown);
                cameraControl.off(this._onMouseup);
            }
        });

        buttonElement.on('click', (event) => {
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
}

export {QueryMode};