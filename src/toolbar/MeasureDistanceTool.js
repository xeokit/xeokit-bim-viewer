import {Controller} from "../Controller.js";
import {ContextMenu, DistanceMeasurementsMouseControl, DistanceMeasurementsPlugin} from "@xeokit/xeokit-sdk";

/** @private */
export class MeasureDistanceTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this._contextMenu = new ContextMenu({
            items: [
                [
                    {
                        getTitle: (context) => {
                            return context.measurement.axisVisible ? (this.viewer.localeService.translate("measureContextMenu.hideMeasurementAxisWires") || "Hide Measurement Axis") : (this.viewer.localeService.translate("measureContextMenu.showMeasurementAxisWires") || "Show Measurement Axis");
                        },
                        doAction: function (context) {
                            context.measurement.axisVisible = !context.measurement.axisVisible;
                        }
                    },
                    {
                        getTitle: (context) => {
                            return context.measurement.labelsVisible ? (this.viewer.localeService.translate("measureContextMenu.hideMeasurementLabels") || "Hide Measurement Labels") : (this.viewer.localeService.translate("measureContextMenu.showMeasurementLabels") || "Show Measurement Labels");
                        },
                        doAction: function (context) {
                            context.measurement.labelsVisible = !context.measurement.labelsVisible;
                        }
                    }
                ], [
                    {
                        getTitle: (context) => {
                            return this.viewer.localeService.translate("measureContextMenu.clearMeasurements") || "Clear Measurements";
                        },
                        doAction: function (context) {
                            context.measurement.destroy();
                        }
                    }
                ]
            ]
        });

        this._contextMenu.on("hidden", () => {
            if (this._contextMenu.context.measurement) {
                this._contextMenu.context.measurement.setHighlighted(false);
            }
        });

        this._distanceMeasurementsPlugin = new DistanceMeasurementsPlugin(this.viewer, {
            defaultAxisVisible: false,
            defaultLabelsOnWires : false
        });

        this._distanceMeasurementsPlugin.on("mouseOver", (e) => {
            e.measurement.setHighlighted(true);
        });

        this._distanceMeasurementsPlugin.on("mouseLeave", (e) => {
            if (this._contextMenu.shown && this._contextMenu.context.measurement.id === e.measurement.id) {
                return;
            }
            e.measurement.setHighlighted(false);
        });

        this._distanceMeasurementsPlugin.on("contextMenu", (e) => {
            this._contextMenu.context = { // Must set context before showing menu
                distanceMeasurementsPlugin: this._distanceMeasurementsPlugin,
                measurement: e.measurement
            };
            this._contextMenu.show(e.event.clientX, e.event.clientY);
            e.event.preventDefault();
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
        this._contextMenu.destroy();
        super.destroy();
    }
}