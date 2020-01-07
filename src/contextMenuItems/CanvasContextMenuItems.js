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
                context.viewer.cameraFlight.flyTo({
                    aabb: context.viewer.scene.getAABB()
                });
            }
        }
    ],
    [
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