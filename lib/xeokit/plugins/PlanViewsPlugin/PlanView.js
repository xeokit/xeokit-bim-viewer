/**
 * @desc A plan view of a building storey, managed by a {@link PlanViewsPlugin}.
 */
class PlanView {

    /**
     * @private
     */
    constructor(aabb, modelId, id, thumbnail) {

        /**
         * ID of the {@link MetaObject} that represents the building storey.
         *
         * @property storeObjectId
         * @type {String|Number}
         */
        this.id = id;

        /**
         * Axis-aligned World-space boundary of the {@link Entity}s within the building storey.
         *
         * Represented by a six-element Float32Array containing the min/max extents of the
         * axis-aligned boundary, ie. ````[xmin, ymin, zmin, xmax, ymax, zmax]````.
         */
        this.aabb = aabb.slice();

        /**
         * ID of the {@link MetaModel} that contains the building storey.
         *
         * @property modelId
         * @type {String|Number}
         */
        this.modelId = modelId;

        /**
         * Base64-encoded downward-looking orthographic snapshot image of {@link Entity}s within the building storey.
         *
         * The format is indicated by {@link FirstPersonPlugin#format}.
         *
         * This property is automatically regenerated whenever {@link FirstPersonPlugin} is reconfigured (eg. on update of
         * {@link FirstPersonPlugin#format}, {@link FirstPersonPlugin#size}, {@link FirstPersonPlugin#objectStates} etc).
         */
        this.thumbnail = thumbnail;
    }
}

export {PlanView};