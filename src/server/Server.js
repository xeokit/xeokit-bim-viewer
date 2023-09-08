import {utils} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

/**
 * Default server client which loads content for a {@link BIMViewer} via HTTP from the file system.
 *
 * A BIMViewer is instantiated with an instance of this class.
 *
 * To load content from an alternative source, instantiate BIMViewer with your own custom implementation of this class.
 */
class Server {

    /**
     * Constructs a Server.
     *
     * @param {*} [cfg] Server configuration.
     * @param {String} [cfg.dataDir] Base directory for content.
     */
    constructor(cfg = {}) {
        this._dataDir = cfg.dataDir || "";
    }

    /**
     * Gets information on all available projects.
     *
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getProjects(done, error) {
        const url = this._dataDir + "/projects/index.json";
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets information for a project.
     *
     * @param {String} projectId ID of the project.
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getProject(projectId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/index.json";
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets metadata for a model within a project.
     *
     * @param {String} projectId ID of the project.
     * @param {String} modelId ID of the model.
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getMetadata(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/metadata.json";
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets geometry for a model within a project.
     *
     * @param {String} projectId ID of the project.
     * @param {String} modelId ID of the model.
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getGeometry(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/geometry.xkt";
        utils.loadArraybuffer(url, done, error);
    }

    /**
     * Gets metadata for an object within a model within a project.
     *
     * @param {String} projectId ID of the project.
     * @param {String} modelId ID of the model.
     * @param {String} objectId ID of the object.
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getObjectInfo(projectId, modelId, objectId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/props/" + objectId + ".json";
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets existing issues for a model within a project.
     *
     * @param {String} projectId ID of the project.
     * @param {String} modelId ID of the model.
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getIssues(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/issues.json";
        utils.loadJSON(url, done, error);
    }


    /**
     * Gets a JSON manifest file for a model that's split into multiple XKT files (and maybe also JSON metadata files).
     *
     * The manifest can have an arbitrary name, and will list all the XKT (and maybe separate JSON metada files)
     * that comprise the model.
     *
     * @param {String} projectId ID of the project.
     * @param {String} modelId ID of the model.
     * @param {String} manifestName Filename of the manifest.
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getSplitModelManifest(projectId, modelId, manifestName, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/" + manifestName;
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets one of the metadata files within a split model within a project.
     *
     * @param {String} projectId ID of the project.
     * @param {String} modelId ID of the model.
     * @param {String} metadataFileName Filename of the metadata file.
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getSplitModelMetadata(projectId, modelId, metadataFileName, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/" + metadataFileName;
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets one of the XKT geometry files within a split model within a project.
     *
     * @param {String} projectId ID of the project.
     * @param {String} modelId ID of the model.
     *  @param {String} geometryFileName Filename of the XKT geometry file.
     * @param {Function} done Callback through which the JSON result is returned.
     * @param {Function} error Callback through which an error message is returned on error.
     */
    getSplitModelGeometry(projectId, modelId, geometryFileName, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/" + geometryFileName;
        utils.loadArraybuffer(url, done, error);
    }
}

export {Server};