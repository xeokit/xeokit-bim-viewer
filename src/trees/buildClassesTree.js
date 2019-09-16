/**
 * Creates a tree widget to explore objects via their IFC types.
 * @param viewer
 * @param treePanelId
 * @param model
 * @returns {InspireTree} The tree.
 */
function buildClassesTree(viewer, treePanelId, model) {

    const modelId = model.id;
    const metaModel = viewer.metaScene.metaModels[modelId];

    var createData = function (metaModel) {

        const classes = {};

        function visit(expand, data, metaObject) {
            if (!metaObject) {
                return;
            }
            const ifcType = metaObject.type;
            var objectsOfType = (classes[ifcType] || (classes[ifcType] = []));
            var child = {
                id: metaObject.id,
                text: metaObject.name
            };
            objectsOfType.push(child);
            const children = metaObject.children;
            if (children) {
                child.children = [];
                for (var i = 0, len = children.length; i < len; i++) {
                    visit(true, child.children, children[i]);
                }
            }
        }

        const data = [];

        visit(true, data, metaModel.rootMetaObject);

        for (var ifcType in classes) {
            if (classes.hasOwnProperty(ifcType)) {
                data.push({
                    id: ifcType,
                    text: ifcType,
                    children: classes[ifcType]
                });
            }
        }

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

    tree.on('model.loaded', function () {

        tree.select();

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

        viewer.scene.on("objectVisibility", (entity) => {
            if (muteEntities) {
                return;
            }
            const node = tree.node(entity.id);
            if (!node) {
                return;
            }
            muteTree = true;
            entity.visible ? node.check(true) : node.uncheck(true);
            muteTree = false;
        });
    });

    return tree;
}

export {buildClassesTree};