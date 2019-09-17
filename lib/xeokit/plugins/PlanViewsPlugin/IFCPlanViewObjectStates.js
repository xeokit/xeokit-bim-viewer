/**
 * @desc Property states for {@link Entity}s in {@link PlanView}s capture by a {@link PlanViewsPlugin}.
 *
 * @type {{String:Object}}
 */
const IFCPlanViewObjectStates = {
    IfcSlab: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcWall: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcWallStandardCase: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcDoor: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcWindow: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcColumn: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcCurtainWall: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcStair: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcStairFlight: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcRamp: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcFurniture: {
        xray: true,
        visible: true,
        edges: true
    },
    IfcFooting: {
        xray: true,
        visible: true,
        edges: true
    },
    DEFAULT: {
        xray: true,
        visible: false
    }
};

export {IFCPlanViewObjectStates}