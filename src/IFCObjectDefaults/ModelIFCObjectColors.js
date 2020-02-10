/**
 * @desc Default initial properties for {@link Entity}s loaded from models accompanied by metadata.
 *
 * When loading a model, a loader plugins such as {@link GLTFLoaderPlugin} and {@link BIMServerLoaderPlugin} create
 * a tree of {@link Entity}s that represent the model. These loaders can optionally load metadata, to create
 * a {@link MetaModel} corresponding to the root {@link Entity}, with a {@link MetaObject} corresponding to each
 * object {@link Entity} within the tree.
 *
 * @private
 * @type {{String:Object}}
 */
const ModelIFCObjectColors = {
    IfcSpace: { // IfcSpace elements should be visible and pickable
        visible: true,
        pickable: true,
        opacity: 0.2
    },
    IfcWindow: { // Some IFC models have opaque IfcWindow elements(!)
        pickable: true,
        opacity: 0.5
    },
    IfcOpeningElement: { // These tend to obscure windows
        visible: false
    },
    IfcPlate: { // These tend to be windows(!)
        colorize: [0.8470588235, 0.427450980392, 0, 0.5],
        opacity: 0.5
    }
};

export {ModelIFCObjectColors};