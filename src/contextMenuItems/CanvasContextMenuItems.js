import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

/**
 * ContextMenu items for when user right-clicks on empty canvas space.
 */
const CanvasContextMenuItems = [
    [
        {
            title: "Hide all",
            callback: function (context) {
                context.viewer.scene.setObjectsVisible(context.viewer.scene.visibleObjectIds, false);
            }
        },
        {
            title: "Show all",
            callback: function (context) {
                const scene = context.viewer.scene;
                scene.setObjectsVisible(scene.objectIds, true);
            }
        }
    ],
    [
        {
            title: "View fit all",
            callback: function (context) {
                const viewer = context.viewer;
                const scene = viewer.scene;
                const sceneAABB = scene.getAABB(scene.visibleObjectIds);
                viewer.cameraFlight.flyTo({
                    aabb: sceneAABB,
                    duration: 0.5
                });
                viewer.cameraControl.pivotPos = math.getAABB3Center(sceneAABB);
            }
        }
    ],
    [
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
            title: "Reset selection",
            callback: function (context) {
                context.viewer.scene.setObjectsSelected(context.viewer.scene.selectedObjectIds, false);
            }
        }
    ],
    [
        {
            title: "Reset view",
            callback: function (context) {
                context.viewerUI.resetView();
            }
        }
    ]
];

export {CanvasContextMenuItems};