import {Controller} from "../Controller.js";
import {StoreyViewsPlugin} from "@xeokit/xeokit-sdk/src/plugins/StoreyViewsPlugin/StoreyViewsPlugin.js";
import {CameraMemento} from "@xeokit/xeokit-sdk/src/viewer/scene/mementos/CameraMemento.js";
import {ObjectsMemento} from "@xeokit/xeokit-sdk/src/viewer/scene/mementos/ObjectsMemento.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

class Storeys extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.storeysTabElement) {
            throw "Missing config: storeysTabElement";
        }

        if (!cfg.storeysElement) {
            throw "Missing config: storeysElement";
        }

        this._storeysTabElement = cfg.storeysTabElement;
        this._storeysElement = cfg.storeysElement;
        this._storeysTabButtonElement = this._storeysTabElement.querySelector(".xeokit-tab-btn");

        if (!this._storeysTabButtonElement) {
            throw "Missing DOM element: ,xeokit-tab-btn";
        }

        this._storeyViewsPlugin = new StoreyViewsPlugin(this.viewer);

        this._storeyViewsPlugin.on("storeys", () => {
            this._repaint();
        });

        this._objectsMemento = new ObjectsMemento();
        this._cameraMemento = new CameraMemento();

        this._storeyOpen = false;
        this._openStoreyId = null;

        const canStandOnTypes = {
            IfcSlab: true,
            IfcStair: true,
            IfcFloor: true,
            IfcFooting: true
        };

        const viewer = this.viewer;
        const worldPos = math.vec3();

        viewer.scene.xrayMaterial.fill = false;
        viewer.scene.xrayMaterial.fillColor = [0.0, 0.0, 0.0];
        viewer.scene.xrayMaterial.edgeColor = [0.0, 0.0, 0.0];

        viewer.scene.xrayMaterial.fillAlpha = 0.06;
        viewer.scene.xrayMaterial.edgeAlpha = 0.2;

        viewer.cameraControl.on("pickedSurface", (pickResult) => {

            return;

            if (!this._storeyOpen) {
                return;
            }

            const entity = pickResult.entity;
            const metaObject = viewer.metaScene.metaObjects[entity.id];

          //  if (canStandOnTypes[metaObject.type]) {

                worldPos.set(pickResult.worldPos);
                worldPos[1] += 1.5;

                viewer.cameraFlight.flyTo({
                    eye: worldPos,
                    up: viewer.camera.worldUp,
                    look: math.addVec3(worldPos, viewer.camera.worldForward, []),
                    projection: "perspective",
                    duration: 1.5
                }, () => {

                    viewer.cameraControl.planView = false;
                    viewer.cameraControl.firstPerson = true;
                    viewer.cameraControl.pivoting = false;

                    this._storeyOpen = false;
                    this._openStoreyId = null;
                });
           // }
        });

        viewer.cameraControl.on("pickedNothing", (pickResult) => {

            if (!this._storeyOpen) {
                return;
            }

            const openStoreyId = this._openStoreyId;

            this._storeyOpen = false;
            this._openStoreyId = null;

            this._objectsMemento.restoreObjects(this.viewer.scene);
            this._cameraMemento.restoreCamera(this.viewer.scene, () => {
            });

            this.fire("storeyClosed", openStoreyId);

            // TODO: return to previous camera, saved in showStorey on first open storey

            // this._storeyViewsPlugin.gotoStoreyCamera("2SWZMQPyD9pfT9q87pgXa1", {
            //     projection: "ortho",
            //     duration: 1.5,
            //     done: () => {
            //         viewer.cameraControl.planView = true;
            //     }
            // });
        });
    }

    _repaint() {
        const html = [];
        var storeyId;
        const models = this.viewer.scene.models;
        const metaScene = this.viewer.metaScene;
        const storeyIds = [];
        for (var modelId in models) {
            const model = this.viewer.scene.models[modelId];
            const metaModel = metaScene.metaModels[modelId];
            const rootMetaObject = metaModel.rootMetaObject;
            if (!metaModel) {
                continue;
            }
            const storeys = this._storeyViewsPlugin.modelStoreys[modelId];
            if (!storeys) {
                continue;
            }
            html.push("<div>" + (rootMetaObject ? rootMetaObject.name : metaModel.id) + "</div>");
            html.push("<ul>");
            for (storeyId in storeys) {
                const storey = storeys[storeyId];
                const metaObject = metaScene.metaObjects[storeyId];
                if (storey) {
                    html.push("<li>");
                    html.push("<a id='" + storey.storeyId + "' href=''>" + metaObject.name + "</a>");
                    html.push("</li>");
                    storeyIds.push(storeyId);
                }
            }
            html.push("</ul>");
            html.push("<br>");
        }
        this._storeysElement.innerHTML = html.join("");
        for (var i = 0, len = storeyIds.length; i < len; i++) {
            const _storeyId = storeyIds[i];
            const link = document.getElementById("" + _storeyId);
            link.addEventListener("click", (e) => {
                this.showStorey(_storeyId, () => {
                });
                e.preventDefault();
            });
        }
    }

    showStorey(storeyId, done) {

        const storey = this._storeyViewsPlugin.storeys[storeyId];

        if (!storey) {
            return;
        }

        const viewer = this.viewer;
        const scene = viewer.scene;
        const metaScene = viewer.metaScene;
        const metaObject = metaScene.metaObjects[storeyId];

        this.viewerUI.query.setActive(false);
        this.viewerUI.hide.setActive(false);
        this.viewerUI.select.setActive(false);
        this.viewerUI.section.setActive(false);
        this.viewerUI.firstPerson.setActive(false);

        const threeDMode = this.viewerUI.threeD.getActive();

        if (this._storeyOpen) {

            scene.setObjectsVisible(scene.objectIds, true);
            scene.setObjectsXRayed(scene.objectIds, true);

            const objectIds = metaObject.getObjectIDsInSubtree();

            scene.setObjectsVisible(objectIds, true);
            scene.setObjectsXRayed(objectIds, false);

            if (!threeDMode) {

                this._storeyViewsPlugin.gotoStoreyCamera(storeyId, {
                    projection: "ortho", // Orthographic projection
                    duration: 0.5,       // 2.5 second transition
                    done: () => {

                        this._storeyViewsPlugin.showStoreyObjects(storeyId, {
                            hideOthers: true,
                            useObjectStates: false
                        });

                        scene.setObjectsXRayed(scene.xrayedObjectIds, false);

                        if (done) {
                            done();
                        }
                    }
                });
            } else {
                // View fit

                viewer.cameraFlight.flyTo({
                    aabb: scene.getAABB(objectIds),
                    duration: 0.5
                }, () => {
                    scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                    scene.setObjectsVisible(scene.xrayedObjectIds, false);
                });
            }

        } else {

            this._cameraMemento.saveCamera(scene);
            this._objectsMemento.saveObjects(scene);

            scene.setObjectsVisible(scene.objectIds, true);
            scene.setObjectsXRayed(scene.objectIds, true);

            const objectIds = metaObject.getObjectIDsInSubtree();

            scene.setObjectsVisible(objectIds, true);
            scene.setObjectsXRayed(objectIds, false);

            if (!threeDMode) {

                this._storeyViewsPlugin.gotoStoreyCamera(storeyId, {
                    projection: "ortho", // Orthographic projection
                    duration: 0.5,       // 2.5 second transition
                    done: () => {

                        this._storeyViewsPlugin.showStoreyObjects(storeyId, {
                            hideOthers: true,
                            useObjectStates: false
                        });

                        scene.setObjectsXRayed(scene.xrayedObjectIds, false);

                        if (done) {
                            done();
                        }
                    }
                });
            } else {
                // view fit

                viewer.cameraFlight.flyTo({
                    aabb: scene.getAABB(objectIds),
                    duration: 0.5
                }, () => {
                    scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                    scene.setObjectsVisible(scene.xrayedObjectIds, false);
                });
            }
        }

        this._storeyOpen = true;
        this._openStoreyId = storeyId;

        this.fire("storeyOpened", this._openStoreyId);
    }

    setEnabled(enabled) {
        if (!enabled) {
            this._storeysTabButtonElement.classList.add("disabled");
            this._storeysTabElement.classList.add("disabled");
           } else {
            this._storeysTabButtonElement.classList.remove("disabled");
            this._storeysTabElement.classList.remove("disabled");
        }
    }

    /** @private */
    destroy() {
        super.destroy();
        this._storeyViewsPlugin.destroy();
    }
}

export {Storeys};