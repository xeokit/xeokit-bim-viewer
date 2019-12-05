import {Controller} from "../Controller.js";
import {StoreyViewsPlugin} from "@xeokit/xeokit-sdk/src/plugins/StoreyViewsPlugin/StoreyViewsPlugin.js";

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

        const viewer = this.viewer;

        viewer.scene.xrayMaterial.fill = false;
        viewer.scene.xrayMaterial.fillColor = [0.0, 0.0, 0.0];
        viewer.scene.xrayMaterial.edgeColor = [0.0, 0.0, 0.0];
        viewer.scene.xrayMaterial.fillAlpha = 0.06;
        viewer.scene.xrayMaterial.edgeAlpha = 0.2;
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

        scene.setObjectsVisible(scene.objectIds, true);
        scene.setObjectsXRayed(scene.objectIds, true);

        const objectIds = metaObject.getObjectIDsInSubtree();

        scene.setObjectsXRayed(objectIds, false);

        if (!threeDMode) {

            this._storeyViewsPlugin.gotoStoreyCamera(storeyId, {
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

            viewer.cameraFlight.flyTo({
                aabb: scene.getAABB(objectIds),
                duration: 0.5
            }, () => {
                scene.setObjectsVisible(scene.xrayedObjectIds, false);
                scene.setObjectsXRayed(scene.xrayedObjectIds, false);
            });
        }
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