import {utils} from "@xeokit/xeokit-sdk/src/viewer/scene/utils.js";

/**
 * Default server client which loads content via HTTP from the file system.
 */
class Server {

    /**
     *
     * @param cfg
     * @param.cfg.dataDir Base directory for content.
     */
    constructor(cfg = {}) {
        this._dataDir = cfg.dataDir || "";
    }

    /**
     * Gets in formation on all avaialable projects.
     *
     * @param done
     * @param error
     */
    getProjects(done, error) {
        const url = this._dataDir + "/projects/index.json";
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets information for a project.
     *
     * @param projectId
     * @param done
     * @param error
     */
    getProject(projectId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/index.json";
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets metadata for a model within a project.
     *
     * @param projectId
     * @param modelId
     * @param done
     * @param error
     */
    getMetadata(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/metadata.json";
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets geometry for a model within a project.
     *
     * @param projectId
     * @param modelId
     * @param done
     * @param error
     */
    getGeometry(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/geometry.xkt";
        utils.loadArraybuffer(url, done, error);
    }

    /**
     * Gets metadata for an object within a model within a project.
     *
     * @param projectId
     * @param modelId
     * @param objectId
     * @param done
     * @param error
     */
    getObjectInfo(projectId, modelId, objectId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/objects/" + objectId + "/properties.json";
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets issues for a model within a project.
     *
     * @param projectId
     * @param modelId
     * @param done
     * @param error
     */
    getIssues(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/issues.json";
        utils.loadJSON(url, done, error);
    }
}

export {Server};