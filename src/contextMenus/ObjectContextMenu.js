import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";
import {ContextMenu} from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

/**
 * @private
 */
class ObjectContextMenu extends ContextMenu {
    constructor(cfg = {}) {
        super({
            context: cfg.context,
            items: [
                [
                    {
                        title: "View Fit",
                        doAction: function (context) {
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
                            viewer.cameraControl.pivotPos = math.getAABB3Center(entity.aabb);
                        }
                    },
                    {
                        title: "View Fit All",
                        doAction: function (context) {
                            const viewer = context.viewer;
                            const scene = viewer.scene;
                            const sceneAABB = scene.getAABB(scene.visibleObjectIds);
                            viewer.cameraFlight.flyTo({
                                aabb: sceneAABB,
                                duration: 0.5
                            });
                            viewer.cameraControl.pivotPos = math.getAABB3Center(sceneAABB);
                        }
                    },
                    {
                        title: "Show in Tree",
                        doAction: function (context) {
                            const objectId = context.entity.id;
                            context.showObjectInExplorers(objectId);
                        }
                    }
                ],
                [
                    {
                        title: "Hide",
                        getEnabled: function (context) {
                            return context.entity.visible;
                        },
                        doAction: function (context) {
                            context.entity.visible = false;
                        }
                    },
                    {
                        title: "Hide Others",
                        doAction: function (context) {
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
                        title: "Hide All",
                        getEnabled: function (context) {
                            return (context.viewer.scene.numVisibleObjects > 0);
                        },
                        doAction: function (context) {
                            context.viewer.scene.setObjectsVisible(context.viewer.scene.visibleObjectIds, false);
                        }
                    },
                    {
                        title: "Show All",
                        getEnabled: function (context) {
                            const scene = context.viewer.scene;
                            return ((scene.numVisibleObjects < scene.numObjects) || (context.viewer.scene.numXRayedObjects > 0));
                        },
                        doAction: function (context) {
                            const scene = context.viewer.scene;
                            scene.setObjectsVisible(scene.objectIds, true);
                            scene.setObjectsPickable(scene.xrayedObjectIds, true);
                            scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                        }
                    }
                ],
                [
                    {
                        title: "X-Ray",
                        getEnabled: function (context) {
                            return (!context.entity.xrayed);
                        },
                        doAction: function (context) {
                            const entity = context.entity;
                            entity.xrayed = true;
                            entity.pickable = false;
                        }
                    },
                    {
                        title: "X-Ray Others",
                        doAction: function (context) {
                            const viewer = context.viewer;
                            const scene = viewer.scene;
                            const entity = context.entity;
                            const metaObject = viewer.metaScene.metaObjects[entity.id];
                            if (!metaObject) {
                                return;
                            }
                            scene.setObjectsVisible(scene.objectIds, true);
                            scene.setObjectsXRayed(scene.objectIds, true);
                            scene.setObjectsPickable(scene.objectIds, false);
                            scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                            metaObject.withMetaObjectsInSubtree((metaObject) => {
                                const entity = scene.objects[metaObject.id];
                                if (entity) {
                                    entity.xrayed = false;
                                    entity.pickable = true;
                                }
                            });
                        }
                    },
                    {
                        title: "X-Ray All",
                        getEnabled: function (context) {
                            const scene = context.viewer.scene;
                            return (scene.numXRayedObjects < scene.numObjects);
                        },
                        doAction: function (context) {
                            const scene = context.viewer.scene;
                            scene.setObjectsVisible(scene.objectIds, true);
                            scene.setObjectsPickable(scene.objectIds, false);
                            scene.setObjectsXRayed(scene.objectIds, true);
                        }
                    },
                    {
                        title: "X-Ray None",
                        getEnabled: function (context) {
                            return (context.viewer.scene.numXRayedObjects > 0);
                        },
                        doAction: function (context) {
                            const scene = context.viewer.scene;
                            const xrayedObjectIds = scene.xrayedObjectIds;
                            scene.setObjectsPickable(xrayedObjectIds, true);
                            scene.setObjectsXRayed(xrayedObjectIds, false);
                        }
                    }
                ],
                [
                    {
                        title: "Select",
                        getEnabled: function (context) {
                            return (!context.entity.selected);
                        },
                        doAction: function (context) {
                            context.entity.selected = true;

                        }
                    },
                    {
                        title: "Undo Select",
                        getEnabled: function (context) {
                            return context.entity.selected;
                        },
                        doAction: function (context) {
                            context.entity.selected = false;
                        }
                    },
                    {
                        title: "Select None",
                        getEnabled: function (context) {
                            return (context.viewer.scene.numSelectedObjects > 0);
                        },
                        doAction: function (context) {
                            context.viewer.scene.setObjectsSelected(context.viewer.scene.selectedObjectIds, false);
                        }
                    }
                ]
            ]
        });
    }
};

export {ObjectContextMenu};