/**
 * @desc A plan view of a building storey, managed by a {@link PlanViewsPlugin}.
 */
class PlanView {

    /**
     * @private
     */
    constructor(plugin, aabb, modelId, id) {

        /**
         * The {@link PlanViewsPlugin} this PlanView belongs to.
         *
         * @property plugin
         * @type {PlanViewsPlugin}
         */
        this.plugin = plugin;

        /**
         * ID of the {@link MetaObject} that represents the building storey.
         *
         * @property id
         * @type {String}
         */
        this.id = id;

        /**
         * Axis-aligned World-space boundary of the {@link Entity}s within this PlanView's building storey.
         *
         * Represented by a six-element Float32Array containing the min/max extents of the
         * axis-aligned boundary, ie. ````[xmin, ymin, zmin, xmax, ymax, zmax]````.
         */
        this.aabb = aabb.slice();

        /**
         * ID of the {@link MetaModel} that contains this PlanView's building storey.
         *
         * @property modelId
         * @type {String|Number}
         */
        this.modelId = modelId;
    }

    /**
     * Gets the base64-encoded PNG snapshot of {@link Entity}s within this PlanView's building storey.
     */
    get thumbnail() {
        return this.plugin.getThumbnail(this.id);
    }
}

export {PlanView};