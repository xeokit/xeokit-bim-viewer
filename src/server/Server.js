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
     * Gets the manifest of all projects.
     * @param done
     * @param error
     */
    getProjects(done, error) {
        const url = this._dataDir + "/projects/index.json";
        console.log("Loading database manifest: " + url);
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets a manifest for a project.
     * @param projectId
     * @param done
     * @param error
     */
    getProject(projectId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/index.json";
        console.log("Loading project manifest: " + url);
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets metadata for a model within a project.
     * @param projectId
     * @param modelId
     * @param done
     * @param error
     */
    getMetadata(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/metadata.json";
        console.log("Loading model metadata: " + url);
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets geometry for a model within a project.
     * @param projectId
     * @param modelId
     * @param done
     * @param error
     */
    getGeometry(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/geometry.xkt";
        console.log("Loading model geometry: " + url);
        utils.loadArraybuffer(url, done, error);
    }

    /**
     * Gets issues for a model within a project.
     * @param projectId
     * @param modelId
     * @param done
     * @param error
     */
    getIssues(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/issues.json";
        console.log("Loading model issues: " + url);
        utils.loadJSON(url, done, error);
    }
}

export {Server};