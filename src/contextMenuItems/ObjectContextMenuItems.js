/**
 * ContextMenu items for when user right-clicks on an object.
 */
const ObjectContextMenuItems = [
    [
        {
            title: "View fit",
            callback: function (context) {
                const viewer = context.viewer;
                const scene = viewer.scene;
                const entity = context.entity;
                viewer.cameraFlight.flyTo({
                    aabb: entity.aabb,
                    duration: 0.5
                }, () => {
                    setTimeout(function () {
                        scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                    }, 500);
                });
            }
        },
        {
            title: "View fit all",
            callback: function (context) {
                const scene = context.viewer.scene;
                context.viewer.cameraFlight.flyTo({
                    aabb: scene.getAABB(),
                    duration: 0.5
                });
            }
        },
        {
            title: "Show in tree",
            callback: function (context) {
                const objectId = context.entity.id;
                context.showNodeInTreeViews(objectId);
            }
        }
    ],
    [
        {
            title: "Hide",
            callback: function (context) {
                context.entity.visible = false;
            }
        },
        {
            title: "Hide others",
            callback: function (context) {
                const viewer = context.viewer;
                const scene = viewer.scene;
                const entity = context.entity;
                const metaObject = viewer.metaScene.metaObjects[entity.id];
                if (!metaObject) {
                    return;
                }
                scene.setObjectsVisible(scene.visibleObjectIds, false);
                scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                metaObject.withMetaObjectsInSubtree((metaObject) => {
                    const entity = scene.objects[metaObject.id];
                    if (entity) {
                        entity.visible = true;
                    }
                });
            }
        },
        {
            title: "Hide all",
            callback: function (context) {
                context.viewer.scene.setObjectsVisible(context.viewer.scene.visibleObjectIds, false);
            }
        },
        {
            title: "Show all ",
            callback: function (context) {
                const scene = context.viewer.scene;
                scene.setObjectsVisible(scene.objectIds, true);
            }
        }
    ],
    [
        {
            title: "X-ray",
            callback: function (context) {
                context.entity.xrayed = true;
            }
        },
        {
            title: "Don't X-ray",
            callback: function (context) {
                context.entity.xrayed = false;
            }
        },
        {
            title: "X-ray others",
            callback: function (context) {
                const viewer = context.viewer;
                const scene = viewer.scene;
                const entity = context.entity;
                const metaObject = viewer.metaScene.metaObjects[entity.id];
                if (!metaObject) {
                    return;
                }
                scene.setObjectsVisible(scene.objectIds, true);
                scene.setObjectsXRayed(scene.objectIds, true);
                scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                metaObject.withMetaObjectsInSubtree((metaObject) => {
                    const entity = scene.objects[metaObject.id];
                    if (entity) {
                        entity.xrayed = false;
                    }
                });
            }
        },
        {
            title: "X-ray all",
            callback: function (context) {
                context.viewer.scene.setObjectsXRayed(context.viewer.scene.objectIds, false);
            }
        },
        {
            title: "Reset X-ray",
            callback: function (context) {
                context.viewer.scene.setObjectsXRayed(context.viewer.scene.xrayedObjectIds, false);
            }
        }
    ],
    [
        {
            title: "Select",
            callback: function (context) {
                context.entity.selected = true;
            }
        },
        {
            title: "Deselect",
            callback: function (context) {
                context.entity.selected = false;
            }
        },
        {
            title: "Reset selection",
            callback: function (context) {
                context.viewer.scene.setObjectsSelected(context.viewer.scene.selectedObjectIds, false);
            }
        }
    ]
];

export {ObjectContextMenuItems};