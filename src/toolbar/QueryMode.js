import {Controller} from "../Controller.js";
import {math} from "../../lib/xeokit/viewer/scene/math/math.js";

function closeEnough(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

/**
 * Controls click-to-query-element mode.
 *
 * Located at {@link Toolbar#query}.
 */
class QueryMode extends Controller {

    /** @private */
    constructor(parent) {

        super(parent);

        this.on("active", (active) => {

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
                        alert(entity.id);
                        entity = null;
                    }
                });

                $('#sidebar2').addClass('active');

            } else {

                this.viewer.cameraControl.off(this._onHover);
                this.viewer.cameraControl.off(this._onHoverOff);
                this.viewer.cameraControl.off(this._onMousedown);
                this.viewer.cameraControl.off(this._onMouseup);

                $('#sidebar2').removeClass('active');
            }
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }

    /** @private */
    destroy() {
        this.setActive(false);
        super.destroy();
    }
}

export {QueryMode};