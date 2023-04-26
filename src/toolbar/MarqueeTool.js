import {Controller} from "../Controller.js";
import {Frustum, frustumIntersectsAABB3, math, setFrustum} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

const tempAABB3 = math.AABB3();

const LEFT_TO_RIGHT = 0;
const RIGHT_TO_LEFT = 1;


/** @private */
export class MarqueeTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        this._objectsKdTree3 = cfg.objectsKdTree3;
        this._marquee = math.AABB2();
        this._marqueeFrustum = new Frustum();
        this._marqueeFrustumProjMat = math.mat4();
        this._marqueeDirection = false;

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
                const nop = this._objectsKdTree3.root; // Lazy-build the kd-tree
            } else {
                buttonElement.classList.remove("active");
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (this.getEnabled()) {
                const active = this.getActive();
                this.setActive(!active);
            }
            event.preventDefault();
        });

        this.bimViewer.on("reset", () => {
            this.setActive(false);
        });

        const scene = this.viewer.scene;
        const canvas = scene.canvas.canvas;

        this._marqueeElement = document.createElement('div');
        document.body.appendChild(this._marqueeElement);

        const marqueeElement = this._marqueeElement;
        const marqueeStyle = marqueeElement.style;
        marqueeStyle.position = "absolute";
        marqueeStyle["z-index"] = "40000005";
        marqueeStyle.width = 8 + "px";
        marqueeStyle.height = 8 + "px";
        marqueeStyle.visibility = "hidden";
        marqueeStyle.top = 0 + "px";
        marqueeStyle.left = 0 + "px";
        marqueeStyle["box-shadow"] = "0 2px 5px 0 #182A3D;";
        marqueeStyle["opacity"] = 1.0;
        marqueeStyle["pointer-events"] = "none";
        let startX;
        let startY;
        let endX;
        var endY;

        let canvasMarqueeStartX;
        let canvasMarqueeStartY;
        let canvasMarqueeEndX;
        let canvasMarqueeEndY;

        let isDragging = false;
        let mouseUpOffCanvas = false;

        let doubleClick = false;
        let timer = null;

        canvas.addEventListener("mousedown", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            scene.setObjectsSelected(scene.selectedObjectIds, false);
            startX = e.pageX;
            startY = e.pageY;
            marqueeStyle.visibility = "visible";
            marqueeStyle.left = startX + "px";
            marqueeStyle.top = startY + "px";
            marqueeStyle.width = "0px";
            marqueeStyle.height = "0px";
            marqueeStyle.display = "block";
            canvasMarqueeStartX = e.offsetX;
            canvasMarqueeStartY = e.offsetY;
            isDragging = true;
            this.viewer.cameraControl.pointerEnabled = false;
            doubleClick = false;
            clearTimeout(timer);
        });


        canvas.addEventListener("mouseup", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (!isDragging && !mouseUpOffCanvas) {
                return
            }
            endX = e.pageX;
            endY = e.pageY;
            const width = Math.abs(endX - startX);
            const height = Math.abs(endY - startY);
            marqueeStyle.width = width + "px";
            marqueeStyle.height = height + "px";
            marqueeStyle.visibility = "hidden";
            isDragging = false;
            this.viewer.cameraControl.pointerEnabled = true;
            if (mouseUpOffCanvas) {
                mouseUpOffCanvas = false;
            }
            if (width > 3 || height > 3) {
                this._marqueePick();
            }

        }); // Bubbling

        document.addEventListener("mouseup", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (!isDragging) {
                return
            }
            marqueeStyle.visibility = "hidden";
            isDragging = false;
            mouseUpOffCanvas = true;
            this.viewer.cameraControl.pointerEnabled = true;
        }, true); // Capturing

        canvas.addEventListener("mousemove", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (!isDragging) {
                return
            }
            const x = e.pageX;
            const y = e.pageY;
            const width = x - startX;
            const height = y - startY;
            marqueeStyle.width = Math.abs(width) + "px";
            marqueeStyle.height = Math.abs(height) + "px";
            marqueeStyle.left = Math.min(startX, x) + "px";
            marqueeStyle.top = Math.min(startY, y) + "px";
            canvasMarqueeEndX = e.offsetX;
            canvasMarqueeEndY = e.offsetY;
            const marqueeDirection = (canvasMarqueeStartX < canvasMarqueeEndX) ? LEFT_TO_RIGHT : RIGHT_TO_LEFT;
            if (marqueeDirection !== this._marqueeDirection) {
                marqueeStyle["background-image"] =
                    marqueeDirection === LEFT_TO_RIGHT
                        ? "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%23333' stroke-width='4'/%3e%3c/svg%3e\")"
                        : "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%23333' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")";
                this._marqueeDirection = marqueeDirection;
            }
            this._marquee[0] = Math.min(canvasMarqueeStartX, canvasMarqueeEndX);
            this._marquee[1] = Math.min(canvasMarqueeStartY, canvasMarqueeEndY);
            this._marquee[2] = Math.max(canvasMarqueeStartX, canvasMarqueeEndX);
            this._marquee[3] = Math.max(canvasMarqueeStartY, canvasMarqueeEndY);

            console.log(this._marquee);
        });
    }


    _marqueePick() {
        this._rebuildFrustum();
        const entities1 = [];
        const visitNode = (node, intersects = Frustum.INTERSECT) => {
            if (intersects === Frustum.INTERSECT) {
                intersects = frustumIntersectsAABB3(this._marqueeFrustum, node.aabb);
            }
            if (intersects === Frustum.OUTSIDE) {
                return;
            }
            if (node.entities) {
                const entities = node.entities;
                for (let i = 0, len = entities.length; i < len; i++) {
                    const entity = entities[i];
                    const entityAABB = entity.aabb;
                    // const reducedEntityAABB = tempAABB3;
                    // reducedEntityAABB[0] = entityAABB[0] + ((entityAABB[3] - entityAABB[0]) / 5);
                    // reducedEntityAABB[1] = entityAABB[1] + ((entityAABB[4] - entityAABB[1]) / 5);
                    // reducedEntityAABB[2] = entityAABB[2] + ((entityAABB[5] - entityAABB[2]) / 5);
                    // reducedEntityAABB[3] = entityAABB[3] - ((entityAABB[3] - entityAABB[0]) / 5);
                    // reducedEntityAABB[4] = entityAABB[4] - ((entityAABB[4] - entityAABB[1]) / 5);
                    // reducedEntityAABB[5] = entityAABB[5] - ((entityAABB[5] - entityAABB[2]) / 5);

                    if (this._marqueeDirection === LEFT_TO_RIGHT) { // Select entities that are completely inside marquee
                        const intersection = frustumIntersectsAABB3(this._marqueeFrustum, entityAABB);
                        if (intersection === Frustum.INSIDE) {
                            entities1.push(entity);
                        }
                    } else {// Select entities that are partially inside marquee
                        const intersection = frustumIntersectsAABB3(this._marqueeFrustum, entityAABB);
                        if (intersection !== Frustum.OUTSIDE) {
                            entities1.push(entity);
                        }
                    }
                }
            }
            //    }
            if (node.left) {
                visitNode(node.left, intersects);
            }
            if (node.right) {
                visitNode(node.right, intersects);
            }
        }
        visitNode(this._objectsKdTree3.root);
        for (let i = 0, len = entities1.length; i < len; i++) {
            entities1[i].selected = true;
        }
        return entities1;
    }

    _rebuildFrustum() { // https://github.com/xeokit/xeokit-sdk/issues/869#issuecomment-1165375770
        const canvas = this.viewer.scene.canvas.canvas;
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        const xCanvasToClip = 2.0 / canvasWidth;
        const yCanvasToClip = 2.0 / canvasHeight;
        const NEAR_SCALING = 17;
        const ratio = canvas.clientHeight / canvas.clientWidth;
        const FAR_PLANE = 10000;
        const left = this._marquee[0] * xCanvasToClip + -1;
        const right = this._marquee[2] * xCanvasToClip + -1;
        const bottom = -this._marquee[3] * yCanvasToClip + 1;
        const top = -this._marquee[1] * yCanvasToClip + 1;
        const near = this.viewer.scene.camera.frustum.near * (NEAR_SCALING * ratio);
        const far = FAR_PLANE;
        math.frustumMat4(
            left,
            right,
            bottom * ratio,
            top * ratio,
            near,
            far,
            this._marqueeFrustumProjMat,
        );
        setFrustum(this._marqueeFrustum, this.viewer.scene.camera.viewMatrix, this._marqueeFrustumProjMat);
    }
}
