import {utils} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/utils.js";

class Server {

    constructor() {

        this._modelsIndex = [
            {
                id: "Duplex",
                name: "Duplex",
                src: "./data/models/xkt/duplex/duplex.xkt",
                metaModelSrc: "./data/metaModels/duplex/metaModel.json"
            },
            {
                id: "OTCConferenceCenter",
                name: "OTC Conference Center",
                src: "./data/models/xkt/OTCConferenceCenter/OTCConferenceCenter.xkt",
                metaModelSrc: "./data/metaModels/OTCConferenceCenter/metaModel.json"
            },
            {
                id: "schependomlaan",
                name: "Schependomlaan",
                src: "./data/models/xkt/schependomlaan/schependomlaan.xkt",
                metaModelSrc: "./data/metaModels/schependomlaan/metaModel.json"
            },
            {
                id: "HospitalStructure",
                name: "Hospital Structure",
                src: "./data/models/xkt/WestRiverSideHospital/structure.xkt",
                metaModelSrc: "./data/metaModels/WestRiverSideHospital/structure.json"
            },
            {
                id: "HospitalElectrical",
                name: "Hospital Electrical",
                src: "./data/models/xkt/WestRiverSideHospital/electrical.xkt",
                metaModelSrc: "data/metaModels/WestRiverSideHospital/electrical.json"
            },
            {
                id: "HospitalSprinklers",
                name: "Hospital Sprinklers",
                src: "./data/models/xkt/WestRiverSideHospital/sprinklers.xkt",
                metaModelSrc: "./data/metaModels/WestRiverSideHospital/sprinklers.json"
            },
            {
                id: "HospitalPlumbing",
                name: "Hospital Plumbing",
                src: "./data/models/xkt/WestRiverSideHospital/plumbing.xkt",
                metaModelSrc: "./data/metaModels/WestRiverSideHospital/plumbing.json"
            },
            {
                id: "HospitalFireAlarms",
                name: "Hospital Fire Alarms",
                src: "./data/models/xkt/WestRiverSideHospital/fireAlarms.xkt",
                metaModelSrc: "./data/metaModels/WestRiverSideHospital/fireAlarms.json"
            }
        ];

        this._viewpointsIndex = [
            {
                id: "viewpoint1"
            },
            {
                id: "viewpoint2"
            }
        ];
    }

    getModels(params, done, error) {
       done(this._modelsIndex);
    }

    getModelGeometry(modelId, done, error) {
        const modelInfo = this._findModel(modelId);
        if (!modelInfo) {
            error("Model not found: " + modelId);
            return;
        }
        utils.loadArraybuffer(modelInfo.src, (data) => {
            done(data);
        }, (err) => {
            error(err);
        });
    }

    _findModel(modelId) {
        for (var i = 0, len = this._modelsIndex.length; i < len; i++) {
            if (this._modelsIndex[i].id === modelId) {
                return this._modelsIndex[i];
            }
        }
    }

    getModelMetadata(modelId, done, error) {
        const modelInfo = this._findModel(modelId);
        if (!modelInfo) {
            error("Model not found: " + modelId);
            return;
        }
        utils.loadJSON(modelInfo.metaModelSrc, (data) => {
            done(data);
        }, (err) => {
            error(err);
        });
    }

    getViewpointsIndex(modelId, done, error) {
        const modelInfo = this._findModel(modelId);
        if (!modelInfo) {
            error("Model not found: " + modelId);
            return;
        }
        done(this._viewpointsIndex);
    }

    saveViewpoint(modelId, viewpointId, viewpoint) {
    }

    getViewpoint(viewpointId, done, error) {
        utils.loadJSON("./data/bcf/" + viewpointId + ".json", (data) => {
            done(data);
        }, (err) => {
            error(err);
        });
    }

    deleteViewpoint(viewpointId) {
    }
}

export {Server};