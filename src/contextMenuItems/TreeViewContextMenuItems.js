/**
 * ContextMenu items for when user right-clicks on a TreeViewPlugin node.
 */
const TreeViewContextMenuItems = [
    [
        {
            title: "View fit",
            callback: function (context) {
                const scene = context.viewer.scene;
                const objectIds = [];
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        objectIds.push(treeViewNode.objectId);
                    }
                });
                scene.setObjectsVisible(objectIds, true);
                scene.setObjectsHighlighted(objectIds, true);
                context.viewer.cameraFlight.flyTo({
                    aabb: scene.getAABB(objectIds),
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
                    aabb: scene.getAABB({}),
                    duration: 0.5
                });
            }
        }
    ],
    [
        {
            title: "Hide",
            callback: function (context) {
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = context.viewer.scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.visible = false;
                        }
                    }
                });
            }
        },
        {
            title: "Hide others",
            callback: function (context) {
                const scene = context.viewer.scene;
                scene.setObjectsVisible(scene.visibleObjectIds, false);
                scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                scene.setObjectsSelected(scene.selectedObjectIds, false);
                scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.visible = true;
                        }
                    }
                });
            }
        },
        {
            title: "Hide all",
            callback: function (context) {
                context.viewer.scene.setObjectsVisible(context.viewer.scene.visibleObjectIds, false);
            }
        }
    ],
    [
        {
            title: "Show",
            callback: function (context) {
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = context.viewer.scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.visible = true;
                            entity.xrayed = false;
                            entity.selected = false;
                        }
                    }
                });
            }
        },
        {
            title: "Show others",
            callback: function (context) {
                const scene = context.viewer.scene;
                scene.setObjectsVisible(scene.objectIds, true);
                scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                scene.setObjectsSelected(scene.selectedObjectIds, false);
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.visible = false;
                        }
                    }
                });
            }
        },
        {
            title: "Show all",
            callback: function (context) {
                const scene = context.viewer.scene;
                scene.setObjectsVisible(scene.objectIds, true);
                scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                scene.setObjectsSelected(scene.selectedObjectIds, false);
            }
        }
    ],
    [
        {
            title: "X-ray",
            callback: function (context) {
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = context.viewer.scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.xrayed = true;
                            entity.visible = true;
                        }
                    }
                });
            }
        },
        {
            title: "Don't X-ray",
            callback: function (context) {
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = context.viewer.scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.xrayed = false;
                        }
                    }
                });
            }
        },
        {
            title: "X-ray others",
            callback: function (context) {
                const scene = context.viewer.scene;
                scene.setObjectsVisible(scene.objectIds, true);
                scene.setObjectsXRayed(scene.objectIds, true);
                scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.xrayed = false;
                        }
                    }
                });
            }
        },
        {
            title: "X-ray all",
            callback: function (context) {
                context.viewer.scene.setObjectsXRayed(context.viewer.scene.objectIds, true);
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
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = context.viewer.scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.selected = true;
                            entity.visible = true;
                        }
                    }
                });
            }
        },
        {
            title: "Deselect",
            callback: function (context) {
                context.treeViewPlugin.withNodeTree(context.treeViewNode, (treeViewNode) => {
                    if (treeViewNode.objectId) {
                        const entity = context.viewer.scene.objects[treeViewNode.objectId];
                        if (entity) {
                            entity.selected = false;
                        }
                    }
                });
            }
        },
        {
            title: "Reset Selection",
            callback: function (context) {
                context.viewer.scene.setObjectsSelected(context.viewer.scene.selectedObjectIds, false);
            }
        }
    ]
];

export {TreeViewContextMenuItems};