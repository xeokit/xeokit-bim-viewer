/**
 * Creates a tree widget to explore objects' structural hierarchy.
 * @param viewer
 * @param treePanelId
 * @param model
 * @returns {InspireTree} The tree.
 */
function buildStructureTree(viewer, treePanelId, model) {

    const modelId = model.id;
    const metaModel = viewer.metaScene.metaModels[modelId];

    var createData = function (metaModel) {

        const data = [];

        function visit(expand, data, metaObject) {
            if (!metaObject) {
                return;
            }
            var child = {
                id: metaObject.id,
                text: metaObject.name || ("(" + metaObject.type + ")")
            };
            data.push(child);
            const children = metaObject.children;
            if (children) {
                child.children = [];
                for (var i = 0, len = children.length; i < len; i++) {
                    visit(true, child.children, children[i]);
                }
            }
        }

        visit(true, data, metaModel.rootMetaObject);
        return data;
    };

    var tree = new InspireTree({
        selection: {
            autoSelectChildren: true,
            autoDeselect: true,
            mode: 'checkbox'
        },
        checkbox: {
            autoCheckChildren: true
        },
        data: createData(metaModel)
    });

    new InspireTreeDOM(tree, {
        target: document.getElementById(treePanelId)
    });

    $("#selectAllStructure").on('click', function (event) {
        tree.selectDeep();
        event.preventDefault();
    });

    $("#deselectAllStructure").on('click', function (event) {
        tree.deselectDeep();
        event.preventDefault();
    });

    tree.on('model.loaded', function () {

        tree.select();

        tree.model.expand();
        tree.model[0].children[0].expand();
        tree.model[0].children[0].children[0].expand();

        var muteEntities = false;
        var muteTree = false;

        tree.on('node.selected', function (event, node) {
            if (muteTree) {
                return;
            }
            const objectId = event.id;
            const entity = viewer.scene.objects[objectId];
            if (entity) {
                muteEntities = true;
                entity.visible = true;
                muteEntities = false;
            }
        });

        tree.on('node.deselected', function (event, node) {
            if (muteTree) {
                return;
            }
            const objectId = event.id;
            const entity = viewer.scene.objects[objectId];
            if (entity) {
                muteEntities = true;
                entity.visible = false;
                muteEntities = false;
            }
        });

        // viewer.scene.on("objectVisibility", (entity) => {
        //     if (muteEntities) {
        //         return;
        //     }
        //     const node = tree.node(entity.id);
        //     if (!node) {
        //         return;
        //     }
        //     muteTree = true;
        //     entity.visible ? node.check(true) : node.uncheck(true);
        //     muteTree = false;
        // });
    });

    return tree;
}


export {buildStructureTree};