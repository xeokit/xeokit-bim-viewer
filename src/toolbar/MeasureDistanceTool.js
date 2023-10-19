import {Controller} from "../Controller.js";
import {DistanceMeasurementsMouseControl, DistanceMeasurementsPlugin} from "@xeokit/xeokit-sdk";

/** @private */
export class MeasureDistanceTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this._distanceMeasurementsPlugin = new DistanceMeasurementsPlugin(this.viewer, {
            defaultAxisVisible: false
        });

        this._distanceMeasurementsMouseControl = new DistanceMeasurementsMouseControl(this._distanceMeasurementsPlugin, {
            //   pointerLens : new PointerLens(viewer)
        })

        this._distanceMeasurementsMouseControl.snapping = true;

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
                this._distanceMeasurementsMouseControl.activate();
            } else {
                buttonElement.classList.remove("active");
                this._distanceMeasurementsMouseControl.deactivate();
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
        return Object.keys(this._distanceMeasurementsPlugin.measurements).length;
    }

    setMeasurementsAxisVisible(axisVisible) {
        this._distanceMeasurementsPlugin.setAxisVisible(axisVisible);
    }

    getMeasurementsAxisVisible() {
        return this._distanceMeasurementsPlugin.getAxisVisible();
    }

    setSnappingEnabled(snappingEnabled) {
        return this._distanceMeasurementsMouseControl.snapping = snappingEnabled;
    }

    getSnappingEnabled() {
        return this._distanceMeasurementsMouseControl.snapping;
    }

    clear() {
        this._distanceMeasurementsPlugin.clear();
    }

    destroy() {
        this._distanceMeasurementsPlugin.destroy();
        this._distanceMeasurementsMouseControl.destroy();
        super.destroy();
    }
}