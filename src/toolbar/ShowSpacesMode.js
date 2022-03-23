import {Controller} from "../Controller.js";

/** @private */
class ShowSpacesMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        this._buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                this._buttonElement.classList.add("disabled");
            } else {
                this._buttonElement.classList.remove("disabled");
            }
        });

        this._buttonElement.addEventListener("click", (event) => {
            if (this.getEnabled()) {
                this.setActive(!this.getActive(), () => {
                });
            }
            event.preventDefault();
        });

        this.bimViewer.on("reset", () => {
            this.setActive(false); // IfcSpaces hidden by default
        });

        this.viewer.scene.on("modelLoaded", (modelId) => {
            if (!this._active) {
                const objectIds = this.viewer.metaScene.getObjectIDsByType("IfcSpace");
                this.viewer.scene.setObjectsCulled(objectIds, true);
            }
        });
        
        this._active = false;
        this._buttonElement.classList.remove("active");
    }

    setActive(active) {
        if (this._active === active) {
            return;
        }
        this._active = active;
        if (active) {
            this._buttonElement.classList.add("active");
            this._enterShowSpacesMode();
            this.fire("active", this._active);
        } else {
            this._buttonElement.classList.remove("active");
            this._exitShowSpacesMode();
            this.fire("active", this._active);
        }
    }

    _enterShowSpacesMode() {
        const viewer = this.viewer;
        const scene = viewer.scene;
        const metaScene = viewer.metaScene;
        const objectIds = metaScene.getObjectIDsByType("IfcSpace");
        scene.setObjectsCulled(objectIds, false);
    }

    _exitShowSpacesMode() {
        const viewer = this.viewer;
        const scene = viewer.scene;
        const metaScene = viewer.metaScene;
        const objectIds = metaScene.getObjectIDsByType("IfcSpace");
        scene.setObjectsCulled(objectIds, true);
    }
}

export {ShowSpacesMode};