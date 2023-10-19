import {Controller} from "../Controller.js";
import {AngleMeasurementsPlugin, AngleMeasurementsMouseControl} from "@xeokit/xeokit-sdk";

/** @private */
export class MeasureAngleTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this._angleMeasurementsPlugin = new AngleMeasurementsPlugin(this.viewer, {});
        
        this._angleMeasurementsMouseControl  = new AngleMeasurementsMouseControl(this._angleMeasurementsPlugin, {
         //   pointerLens : new PointerLens(viewer)
        })

        this._angleMeasurementsMouseControl.snapping = true;
        
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
                this._angleMeasurementsMouseControl.activate();
            } else {
                buttonElement.classList.remove("active");
                this._angleMeasurementsMouseControl.deactivate();
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
            this.clear();
        });
    }

    getNumMeasurements() {
        return Object.keys(this._angleMeasurementsPlugin.measurements).length;
    }

    setSnappingEnabled(snappingEnabled) {
        return this._angleMeasurementsMouseControl.snapping = snappingEnabled;
    }

    getSnappingEnabled() {
        return this._angleMeasurementsMouseControl.snapping;
    }

    clear() {
        this._angleMeasurementsPlugin.clear();
    }

    destroy() {
        this._angleMeasurementsPlugin.destroy();
        this._angleMeasurementsMouseControl.destroy();
        super.destroy();
    }
}