import {Controller} from "../Controller.js";
import {Frustum, frustumIntersectsAABB3, math, setFrustum} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

const LEFT_TO_RIGHT = 0;
const RIGHT_TO_LEFT = 1;

/** @private */
export class MarqueeSelectionTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        this._objectsKdTree3 = cfg.objectsKdTree3;
        this._marquee = math.AABB2();
        this._marqueeFrustum = new Frustum();
        this._marqueeFrustumProjMat = math.mat4();
        this._marqueeDir = false;

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

        let canvasDragStartX;
        let canvasDragStartY;
        let canvasDragEndX;
        let canvasDragEndY;

        let canvasMarqueeStartX;
        let canvasMarqueeStartY;
        let canvasMarqueeEndX;
        let canvasMarqueeEndY;

        let isMouseDragging = false;
        let mouseWasUpOffCanvas = false;

        canvas.addEventListener("mousedown", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (e.button !== 0) { // Left button only
                return;
            }
            const input = this.bimViewer.viewer.scene.input;
            if (!input.keyDown[input.KEY_CTRL]) { // Clear selection unless CTRL down
                scene.setObjectsSelected(scene.selectedObjectIds, false);
            }
            canvasDragStartX = e.pageX;
            canvasDragStartY = e.pageY;
            marqueeStyle.visibility = "visible";
            marqueeStyle.left = `${canvasDragStartX}px`;
            marqueeStyle.top = `${canvasDragStartY}px`;
            marqueeStyle.width = "0px";
            marqueeStyle.height = "0px";
            marqueeStyle.display = "block";
            canvasMarqueeStartX = e.offsetX;
            canvasMarqueeStartY = e.offsetY;
            isMouseDragging = true;
            this.viewer.cameraControl.pointerEnabled = false; // Disable camera rotation
        });

        canvas.addEventListener("mouseup", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (!isMouseDragging && !mouseWasUpOffCanvas) {
                return
            }
            if (e.button !== 0) {
                return;
            }
            canvasDragEndX = e.pageX;
            canvasDragEndY = e.pageY;
            const width = Math.abs(canvasDragEndX - canvasDragStartX);
            const height = Math.abs(canvasDragEndY - canvasDragStartY);
            marqueeStyle.width = `${width}px`;
            marqueeStyle.height = `${height}px`;
            marqueeStyle.visibility = "hidden";
            isMouseDragging = false;
            this.viewer.cameraControl.pointerEnabled = true; // Enable camera rotation
            if (mouseWasUpOffCanvas) {
                mouseWasUpOffCanvas = false;
            }
            if (width > 3 || height > 3) { // Marquee pick if rectangle big enough
                this._marqueePick();
            }
        }); // Bubbling

        document.addEventListener("mouseup", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (e.button !== 0) { // check if left button was clicked
                return;
            }
            if (!isMouseDragging) {
                return
            }
            marqueeStyle.visibility = "hidden";
            isMouseDragging = false;
            mouseWasUpOffCanvas = true;
            this.viewer.cameraControl.pointerEnabled = true;
        }, true); // Capturing

        canvas.addEventListener("mousemove", (e) => {
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (e.button !== 0) { // check if left button was clicked
                return;
            }
            if (!isMouseDragging) {
                return
            }
            const x = e.pageX;
            const y = e.pageY;
            const width = x - canvasDragStartX;
            const height = y - canvasDragStartY;
            marqueeStyle.width = `${Math.abs(width)}px`;
            marqueeStyle.height = `${Math.abs(height)}px`;
            marqueeStyle.left = `${Math.min(canvasDragStartX, x)}px`;
            marqueeStyle.top = `${Math.min(canvasDragStartY, y)}px`;
            canvasMarqueeEndX = e.offsetX;
            canvasMarqueeEndY = e.offsetY;
            const marqueeDir = (canvasMarqueeStartX < canvasMarqueeEndX) ? LEFT_TO_RIGHT : RIGHT_TO_LEFT;
            this._setMarqueeDir(marqueeDir);
            this._marquee[0] = Math.min(canvasMarqueeStartX, canvasMarqueeEndX);
            this._marquee[1] = Math.min(canvasMarqueeStartY, canvasMarqueeEndY);
            this._marquee[2] = Math.max(canvasMarqueeStartX, canvasMarqueeEndX);
            this._marquee[3] = Math.max(canvasMarqueeStartY, canvasMarqueeEndY);
        });

        // ***** below referenced and modded from above (mouse-event-driven) and xeokit-sdk\src\extras\MarqueePicker\MarqueePickerMouseControl.js
        canvas.addEventListener("touchstart", (e) => {  // modded
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }

            const input = this.bimViewer.viewer.scene.input;
            if (!input.keyDown[input.KEY_CTRL]) { // Clear selection unless CTRL down
                scene.setObjectsSelected(scene.selectedObjectIds, false);
            }
            canvasDragStartX = e.touches[0].pageX;  // modded
            canvasDragStartY = e.touches[0].pageY;  // modded
            marqueeStyle.visibility = "visible";
            marqueeStyle.left = `${canvasDragStartX}px`;
            marqueeStyle.top = `${canvasDragStartY}px`;
            marqueeStyle.width = "0px";
            marqueeStyle.height = "0px";
            marqueeStyle.display = "block";
            canvasMarqueeStartX = e.touches[0].pageX;  // modded
            canvasMarqueeStartY = e.touches[0].pageY;  // modded
            isMouseDragging = true;
            this.viewer.cameraControl.pointerEnabled = false; // Disable camera rotation
        });

        canvas.addEventListener("touchend", (e) => {  // modded
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }
            if (!isMouseDragging && !mouseWasUpOffCanvas) {
                return
            }

            canvasDragEndX = e.changedTouches[0].pageX;  // modded
            canvasDragEndY = e.changedTouches[0].pageY;  // modded
            const width = Math.abs(canvasDragEndX - canvasDragStartX);
            const height = Math.abs(canvasDragEndY - canvasDragStartY);
            marqueeStyle.width = `${width}px`;
            marqueeStyle.height = `${height}px`;
            marqueeStyle.visibility = "hidden";
            isMouseDragging = false;
            this.viewer.cameraControl.pointerEnabled = true; // Enable camera rotation
            if (mouseWasUpOffCanvas) {
                mouseWasUpOffCanvas = false;
            }
            if (width > 3 || height > 3) { // Marquee pick if rectangle big enough
                this._marqueePick();
            }
        }); // Bubbling

        document.addEventListener("touchend", (e) => {  // modded
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }

            if (!isMouseDragging) {
                return
            }
            marqueeStyle.visibility = "hidden";
            isMouseDragging = false;
            mouseWasUpOffCanvas = true;
            this.viewer.cameraControl.pointerEnabled = true;
        }, true); // Capturing

        canvas.addEventListener("touchmove", (e) => {  // modded
            if (!this.getActive() || !this.getEnabled()) {
                return;
            }

            if (!isMouseDragging) {
                return
            }
            const x = e.changedTouches[0].pageX;  // modded
            const y = e.changedTouches[0].pageY;  // modded
            const width = x - canvasDragStartX;
            const height = y - canvasDragStartY;
            marqueeStyle.width = `${Math.abs(width)}px`;
            marqueeStyle.height = `${Math.abs(height)}px`;
            marqueeStyle.left = `${Math.min(canvasDragStartX, x)}px`;
            marqueeStyle.top = `${Math.min(canvasDragStartY, y)}px`;
            canvasMarqueeEndX = e.changedTouches[0].pageX;  // modded
            canvasMarqueeEndY = e.changedTouches[0].pageY;  // modded
            const marqueeDir = (canvasMarqueeStartX < canvasMarqueeEndX) ? LEFT_TO_RIGHT : RIGHT_TO_LEFT;
            this._setMarqueeDir(marqueeDir);
            this._marquee[0] = Math.min(canvasMarqueeStartX, canvasMarqueeEndX) - canvas.parentElement.offsetLeft;  // modded : need to manually add parent canvas offset, differet from mouse input
            this._marquee[1] = Math.min(canvasMarqueeStartY, canvasMarqueeEndY) - canvas.parentElement.offsetTop;  // modded : need to manually add parent canvas offset, differet from mouse input
            this._marquee[2] = Math.max(canvasMarqueeStartX, canvasMarqueeEndX) - canvas.parentElement.offsetLeft;  // modded : need to manually add parent canvas offset, differet from mouse input
            this._marquee[3] = Math.max(canvasMarqueeStartY, canvasMarqueeEndY) - canvas.parentElement.offsetTop;  // modded : need to manually add parent canvas offset, differet from mouse input
        });
    }

    _setMarqueeDir(marqueeDir) {
        if (marqueeDir !== this._marqueeDir) {
            this._marqueeElement.style["background-image"] =
                marqueeDir === LEFT_TO_RIGHT
                    /* Solid */ ? "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%23333' stroke-width='4'/%3e%3c/svg%3e\")"
                    /* Dashed */ : "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%23333' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")";
            this._marqueeDir = marqueeDir;
        }
    }

    _marqueePick() {
        this._buildMarqueeFrustum();
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
                    if (!entity.visible) {
                        continue;
                    }
                    const entityAABB = entity.aabb;
                    if (this._marqueeDir === LEFT_TO_RIGHT) {
                        // Select entities that are completely inside marquee
                        const intersection = frustumIntersectsAABB3(this._marqueeFrustum, entityAABB);
                        if (intersection === Frustum.INSIDE) {
                            entities1.push(entity);
                        }
                    } else {
                        // Select entities that are partially inside marquee
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

    _buildMarqueeFrustum() { // https://github.com/xeokit/xeokit-sdk/issues/869#issuecomment-1165375770
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

        function ratioToMultipler(x) {  // smooth curve function for adjusting frustum angle according to canvas proportion
            const a = 1.2;
            const b = -1.6;
            const c = 1.4;
            return a * x * x + b * x + c;  // AI generated quadratic that pass 3 points : f(1)=1, f(1.5)=1.7 , f(2)=3
        }
        
        if (ratio < 1) {  // use ratio, ratioToMultipler and 3 to adjust selection frustum aperture according to canvas proportion
            math.frustumMat4(
                left,
                right,
                bottom * ratio,
                top * ratio,
                near,
                far,
                this._marqueeFrustumProjMat,
            );
        } else if (ratio < 2) {
            math.frustumMat4(
                left * ratioToMultipler(ratio),
                right * ratioToMultipler(ratio),
                bottom * ratio * ratioToMultipler(ratio),
                top * ratio * ratioToMultipler(ratio),
                near,
                far,
                this._marqueeFrustumProjMat,
            );
        } else {
            math.frustumMat4(
                left * 3,
                right * 3,
                bottom * 3 * ratio,
                top * 3 * ratio,
                near,
                far,
                this._marqueeFrustumProjMat,
            );
        }
        
        setFrustum(this._marqueeFrustum, this.viewer.scene.camera.viewMatrix, this._marqueeFrustumProjMat);
    }
}
