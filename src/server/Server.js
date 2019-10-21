import {utils} from "../../lib/xeokit/viewer/scene/utils.js";

class Server {

    constructor() {

        this._viewpointsIndex = [
            {
                id: "viewpoint1"
            },
            {
                id: "viewpoint2"
            }
        ];

        this._modelsIndex = [
            {
                id: "duplex",
                src: "./data/models/xkt/duplex/duplex.xkt",
                metaModelSrc: "./data/metaModels/duplex/metaModel.json"
            },
            {
                id: "schependomlaan",
                src: "./data/models/xkt/schependomlaan/schependomlaan.xkt",
                metaModelSrc: "./data/metaModels/schependomlaan/metaModel.json"
            },
            {
                id: "structure",
                src: "./data/models/xkt/WestRiverSideHospital/structure.xkt",
                metaModelSrc: "./data/metaModels/WestRiverSideHospital/structure.json"
            },
            {
                id: "electrical",
                src: "./data/models/xkt/WestRiverSideHospital/electrical.xkt",
                metaModelSrc: "data/metaModels/WestRiverSideHospital/electrical.json"
            },
            {
                id: "sprinklers",
                src: "./data/models/xkt/WestRiverSideHospital/sprinklers.xkt",
                metaModelSrc: "./data/metaModels/WestRiverSideHospital/sprinklers.json"
            },
            {
                id: "plumbing",
                src: "./data/models/xkt/WestRiverSideHospital/plumbing.xkt",
                metaModelSrc: "./data/metaModels/WestRiverSideHospital/plumbing.json"
            },
            {
                id: "fireAlarms",
                src: "./data/models/xkt/WestRiverSideHospital/fireAlarms.xkt",
                metaModelSrc: "./data/metaModels/WestRiverSideHospital/fireAlarms.json"
            }
        ];
    }

    getModels(params, done, error) {
      //  done(this._modelsIndex);

        return this._modelsIndex;
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