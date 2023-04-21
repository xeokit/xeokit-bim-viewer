import {Controller} from "../Controller.js";
import {Frustum, frustumIntersectsAABB3, math, setFrustum} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

const tempAABB3 = math.AABB3();

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

        const canvas = this.viewer.scene.canvas.canvas;

        this._marqueeElement = document.createElement('div');
        document.body.appendChild(this._marqueeElement);

        const marqueeElement = this._marqueeElement;
        const marqueeStyle = marqueeElement.style;
        marqueeStyle["border-radius"] = 3 + "px";
        marqueeStyle.border = "solid 2px gray";
        marqueeStyle.background = "rgba(200,200,200,0.3)";
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

        let canvasMarqueeMinX;
        let canvasMarqueeMinY;
        let canvasMarqueeMaxX;
        let canvasMarqueeMaxY;

        let isDragging = false;

        let doubleClick = false;
        let timer = null;

        canvas.addEventListener("mousedown", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (doubleClick) {
                startX = e.pageX;
                startY = e.pageY;
                marqueeStyle.visibility = "visible";
                marqueeStyle.left = startX + "px";
                marqueeStyle.top = startY + "px";
                marqueeStyle.width = "0px";
                marqueeStyle.height = "0px";
                marqueeStyle.display = "block";
                canvasMarqueeMinX = e.offsetX;
                canvasMarqueeMinY = e.offsetY;
                isDragging = true;
                this.viewer.cameraControl.pointerEnabled = false;
                doubleClick = false;
                clearTimeout(timer);
            } else {
                doubleClick = true;
                timer = setTimeout(() => {
                    doubleClick = false;
                }, 1000); // set the time for double-click in milliseconds
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (!isDragging) {
                return
            }
            marqueeStyle.visibility = "hidden";
            isDragging = false;
            this.viewer.cameraControl.pointerEnabled = true;
            this._marqueePick();
        }, true); // Capturing

        canvas.addEventListener("mouseup", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (!isDragging) {
                return
            }
            endX = e.pageX;
            endY = e.pageY;
            const width = endX - startX;
            const height = endY - startY;
            marqueeStyle.width = width + "px";
            marqueeStyle.height = height + "px";
            marqueeStyle.visibility = "hidden";
            isDragging = false;
            this.viewer.cameraControl.pointerEnabled = false;
        }); // Bubbling

        let timeout = -1;

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
            canvasMarqueeMaxX = e.offsetX;
            canvasMarqueeMaxY = e.offsetY;
            this._marquee[0] = Math.min(canvasMarqueeMinX, canvasMarqueeMaxX);
            this._marquee[1] = Math.min(canvasMarqueeMinY, canvasMarqueeMaxY);
            this._marquee[2] = Math.max(canvasMarqueeMinX, canvasMarqueeMaxX);
            this._marquee[3] = Math.max(canvasMarqueeMinY, canvasMarqueeMaxY);
            if (timeout > -1) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                this._marqueePick();
            }, 1000);
        });

        document.addEventListener('dblclick', (event) => {
            event.preventDefault();
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
            //     if (intersects === Frustum.INTERSECT) {
            if (node.entities) {
                const entities = node.entities;
                for (let i = 0, len = entities.length; i < len; i++) {

                    const entity = entities[i];
                    const entityAABB = entity.aabb;
                    const reducedEntityAABB = tempAABB3;

                    // reducedEntityAABB[0] = reducedEntityAABB[3] = (entityAABB[0] + entityAABB[3]) / 2;
                    // reducedEntityAABB[1] = reducedEntityAABB[4] = (entityAABB[1] + entityAABB[4]) / 2;
                    // reducedEntityAABB[2] = reducedEntityAABB[5] = (entityAABB[2] + entityAABB[5]) / 2;

                    reducedEntityAABB[0] = entityAABB[0] + ((entityAABB[3] - entityAABB[0]) / 5);
                    reducedEntityAABB[1] = entityAABB[1] + ((entityAABB[4] - entityAABB[1]) / 5);
                    reducedEntityAABB[2] = entityAABB[2] + ((entityAABB[5] - entityAABB[2]) / 5);
                    reducedEntityAABB[3] = entityAABB[3] - ((entityAABB[3] - entityAABB[0]) / 5);
                    reducedEntityAABB[4] = entityAABB[4] - ((entityAABB[4] - entityAABB[1]) / 5);
                    reducedEntityAABB[5] = entityAABB[5] - ((entityAABB[5] - entityAABB[2]) / 5);

                    if (frustumIntersectsAABB3(this._marqueeFrustum, reducedEntityAABB) !== Frustum.OUTSIDE) {
                        entities1.push(entity);
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
