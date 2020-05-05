import {Controller} from "../Controller.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

const tempVec3a = math.vec3();

/** @private */
class ThreeDMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        this._buttonElement = cfg.buttonElement;

        this._cameraControlNavModeMediator = cfg.cameraControlNavModeMediator;

        this._active = false;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                this._buttonElement.classList.add("disabled");
            } else {
                this._buttonElement.classList.remove("disabled");
            }
        });

        this._buttonElement.addEventListener("click", (event) => {
            this.setActive(!this.getActive(), () => { // Animated
            });
            event.preventDefault();
        });

        this.bimViewer.on("reset", () => {
            this.setActive(true, () => { // Animated
            });
        });
    }

    setActive(active, done) {
        if (this._active === active) {
            if (done) {
                done();
            }
            return;
        }
        this._active = active;
        if (active) {
            this._buttonElement.classList.add("active");
            if (done) {
                this._enterThreeDMode(() => {
                    this.fire("active", this._active);
                    done();
                });
            } else {
                this._enterThreeDMode();
                this.fire("active", this._active);
            }
        } else {
            this._buttonElement.classList.remove("active");
            if (done) {
                this._exitThreeDMode(() => {
                    this.fire("active", this._active);
                    done();
                });
            } else {
                this._exitThreeDMode();
                this.fire("active", this._active);
            }
        }
    }

    _enterThreeDMode(done) {

        const viewer = this.viewer;
        const scene = viewer.scene;
        const aabb = scene.getAABB(scene.visibleObjectIds);
        const diag = math.getAABB3Diag(aabb);
        const center = math.getAABB3Center(aabb, tempVec3a);
        const dist = Math.abs(diag / Math.tan(65.0 / 2));     // TODO: fovy match with CameraFlight
        const camera = scene.camera;
        const dir = (camera.yUp) ? [-1, -1, -1] : [1, 1, 1];
        const up = (camera.yUp) ? [-1, 1, -1] : [-1, 1, 1];

        viewer.cameraControl.pivotPos = center;

        this.bimViewer._navCubeMode.setActive(true);
        this.bimViewer._firstPersonMode.setEnabled(true);
        this._cameraControlNavModeMediator.setThreeDModeActive(true);
        this.bimViewer._sectionTool.setEnabled(true);

        if (done) {
            viewer.cameraFlight.flyTo({
                look: center,
                eye: [center[0] - (dist * dir[0]), center[1] - (dist * dir[1]), center[2] - (dist * dir[2])],
                up: up,
                orthoScale: diag * 1.3,
                projection: "perspective",
                duration: 1
            }, () => {
                done();
            });
        } else {
            viewer.cameraFlight.jumpTo({
                look: center,
                eye: [center[0] - (dist * dir[0]), center[1] - (dist * dir[1]), center[2] - (dist * dir[2])],
                up: up,
                orthoScale: diag * 1.3,
                projection: "perspective"
            });
        }
    }

    _exitThreeDMode(done) {

        const viewer = this.viewer;
        const scene = viewer.scene;
        const camera = scene.camera;
        const aabb = scene.getAABB(scene.visibleObjectIds);
        const look2 = math.getAABB3Center(aabb);
        const diag = math.getAABB3Diag(aabb);
        const fitFOV = 45; // fitFOV;
        const sca = Math.abs(diag / Math.tan(fitFOV * math.DEGTORAD));
        const orthoScale2 = diag * 1.3;
        const eye2 = tempVec3a;

        eye2[0] = look2[0] + (camera.worldUp[0] * sca);
        eye2[1] = look2[1] + (camera.worldUp[1] * sca);
        eye2[2] = look2[2] + (camera.worldUp[2] * sca);

        const up2 = math.mulVec3Scalar(camera.worldForward, -1, []);

        this.bimViewer._sectionTool.setActive(false);
        this.bimViewer._sectionTool.clear();
        this.bimViewer._firstPersonMode.setEnabled(false);
        this.bimViewer._sectionTool.setEnabled(false);

        this._cameraControlNavModeMediator.setThreeDModeActive(false);

        if (done) {
            viewer.cameraFlight.flyTo({
                projection: "ortho",
                eye: eye2,
                look: look2,
                up: up2,
                orthoScale: orthoScale2
            }, () => {
                this.bimViewer._navCubeMode.setActive(false);
            });
        } else {
            viewer.cameraFlight.jumpTo({
                projection: "ortho",
                eye: eye2,
                look: look2,
                up: up2,
                orthoScale: orthoScale2
            });
            this.bimViewer._navCubeMode.setActive(false);
        }
    }
}

export {ThreeDMode};