import {utils} from "../../lib/xeokit/viewer/scene/utils.js";

class BCFData {

    constructor() {

        this._index = [
            {id: "viewpoint1"},
            {id: "viewpoint2"}
        ];
    }

    getViewpointsIndex(modelId, done, error) {
        done(this._index);
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

export {BCFData};