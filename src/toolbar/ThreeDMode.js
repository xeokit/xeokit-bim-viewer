import {Controller} from "../Controller.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

const tempVec3a = math.vec3();

class ThreeDMode extends Controller {

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

            if (active) {

                this._resetCamera();

                this.viewerUI.navCube.setActive(true);

            } else {

                this.viewerUI.section.setActive(false);
                this.viewerUI.section.clear();

                const viewer = this.viewer;
                const scene = viewer.scene;
                const camera = scene.camera;
                const aabb = scene.getAABB(scene.visibleObjectIds);
               // const aabb = scene.aabb;

                if (aabb[3] < aabb[0] || aabb[4] < aabb[1] || aabb[5] < aabb[2]) { // Don't fly to an inverted boundary
                    return;
                }
                if (aabb[3] === aabb[0] && aabb[4] === aabb[1] && aabb[5] === aabb[2]) { // Don't fly to an empty boundary
                    return;
                }
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

                viewer.cameraFlight.flyTo({
                    projection: "ortho",
                    eye: eye2,
                    look: look2,
                    up: up2,
                    orthoScale: orthoScale2
                }, () =>{
                    this.viewerUI.navCube.setActive(false);
                });
            }

            this.viewer.cameraControl.planView = !active;
            this.viewerUI.firstPerson.setEnabled(active);
           // this.viewerUI.ortho.setEnabled(active);
            this.viewerUI.section.setEnabled(active);

            if (!active) {
                this.viewerUI.section.setActive(false);
                //this.viewerUI.firstPerson.setActive(false);
            }

        });

        buttonElement.addEventListener("click", (event) => {
            this.setActive(!this.getActive());
            event.preventDefault();
        });

        this.viewerUI.on("reset", () => {
            this.setActive(true);
        });
    }

    _resetCamera() {
        const viewer = this.viewer;
        const scene = viewer.scene;
        const aabb = scene.getAABB(scene.visibleObjectIds);
       // const aabb = scene.aabb;
        const diag = math.getAABB3Diag(aabb);
        const center = math.getAABB3Center(aabb, tempVec3a);
        const dist = Math.abs(diag / Math.tan(65.0 / 2));     // TODO: fovy match with CameraFlight
        const camera = scene.camera;
        const dir = (camera.yUp) ? [-1, -1, -1] : [1, 1, 1];
        const up = (camera.yUp) ? [-1, 1, -1] : [-1, 1, 1];
        viewer.cameraControl.pivotPos = center;
        viewer.cameraControl.planView = false;

        // scene.setObjectsXRayed(scene.objectIds, true);
        // scene.setObjectsXRayed(scene.visibleObjectIds, false);
        // scene.setObjectsVisible(scene.objectIds, true);

        viewer.cameraFlight.flyTo({
            look: center,
            eye: [center[0] - (dist * dir[0]), center[1] - (dist * dir[1]), center[2] - (dist * dir[2])],
            up: up,
            orthoScale: diag * 1.3,
            projection: "perspective",
            duration: 1
        }, () => {
            // scene.setObjectsVisible(scene.xrayedObjectIds, false);
            // scene.setObjectsXRayed(scene.xrayedObjectIds, false);
        });
    }
}

export {ThreeDMode};