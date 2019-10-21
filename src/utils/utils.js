

function saveEmphasisMaterial(material) {
    const memento = {
        edges: material.edges,
        edgeColor: material.edgeColor.slice(),
        edgeAlpha: material.edgeAlpha,
        fill: material.fill,
        fillAlpha: material.fillAlpha,
        fillColor: material.fillColor.slice()
    };
    return memento;
}

function restoreEmphasisMaterial(memento, material) {
    material.edges = memento.edges;
    material.edgeColor = memento.edgeColor;
    material.edgeAlpha = memento.edgeAlpha;
    material.fill = memento.fill;
    material.fillColor = memento.fillColor;
    material.fillAlpha = memento.fillAlpha;
}

export {saveEmphasisMaterial, restoreEmphasisMaterial};