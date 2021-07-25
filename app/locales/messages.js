/**
 * Locale translations for BIMViewer
 */
const messages = {

    // English

    "en": {
        "busyModal": { // The dialog that appears in the center of the canvas while we are loading a model
            "loading": "Loading" // Loading <myModel>
        },
        "NavCube": { // The 3D navigation cube at the bottom right of the canvas
            "front": "Front",
            "back": "Back",
            "top": "Top",
            "bottom": "Bottom",
            "left": "Left",
            "right": "Right"
        },
        "modelsExplorer": { // The "Models" tab on the left of the canvas
            "title": "Models",
            "loadAll": "Load all",
            "loadAllTip": "Load all models in this project",
            "unloadAll": "Unload all",
            "unloadAllTip": "Unload all models",
            "add": "Add",
            "addTip": "Add a Model"
        },
        "objectsExplorer": { // The "Objects" tab on the left of the canvas
            "title": "Objects",
            "showAll": "Show all",
            "showAllTip": "Show all objects",
            "hideAll": "Hide all",
            "hideAllTip": "Hide all objects"
        },
        "classesExplorer": { // The "Classes" tab on the left of the canvas
            "title": "Classes",
            "showAll": "Show all",
            "showAllTip": "Show all classes",
            "hideAll": "Hide all",
            "hideAllTip": "Hide all classes"
        },
        "storeysExplorer": { // The "Storeys" tab on the left of the canvas
            "title": "Storeys",
            "showAll": "Show all",
            "showAllTip": "Show all storeys",
            "hideAll": "Hide all",
            "hideAllTip": "Hide all storeys"
        },
        "toolbar": { // The toolbar at the top of the canvas
            "toggleExplorer": "Toggle explorer", // Button to open or close the explorer panel on the left
            "resetViewTip": "Reset view", // Button to reset the viewer to initial state
            "toggle2d3dTip": "Toggle 2D/3D", // Button to toggle between 3D view and 2D plan view modes
            "togglePerspectiveTip": "Toggle Perspective/Ortho", // Button to toggle between perspective and orthographic projection
            "viewFitTip": "View fit", // Button to position the camera to fit all objects in view
            "firstPersonTip": "Toggle first person navigation mode", // Button to switch between first-person and orbit navigation modes
            "hideObjectsTip": "Hide objects", // Button to activate "Hide objects" tool
            "selectObjectsTip": "Select objects", // Button to activate "Select objects" tool
            "queryObjectsTip": "Query objects", // Button to activate "Query objects" tool
            "sliceObjectsTip": "Slice objects", // Button to activate "Slice objects" tool
            "slicesMenuTip": "Slices menu", // Button to open the pull-down menu of existing section planes
            "numSlicesTip": "Number of existing slices" // Label shows number of sexisting section planes
        },
        "canvasContextMenu": { // Context menu that appears when we right-click on empty canvas space
            "viewFitAll": "View Fit All", // Menu option to position the camera to fit all objects in view
            "hideAll": "Hide All", // Menu option to hide all objects
            "showAll": "Show All", // Menu option to show all objects
            "xRayAll": "X-Ray All", // Menu option to X-ray all objects
            "xRayNone": "X-Ray None", // Menu option to remove X-ray effect from all objects
            "selectNone": "Select None", // Menu option to clear any currently selected objects
            "resetView": "Reset View", // Menu option to reset the view to initial state
            "clearSlices": "Clear Slices" // Menu option to delete all section planes created with the Slice tool
        },
        "modelsContextMenu": { // Context menu that appears when we right-click on a model in the "Models" tab
            "loadModel": "Load",
            "unloadModel": "Unload",
            "editModel": "Edit",
            "deleteModel": "Delete",
            "loadAllModels": "Load All",
            "unloadAllModels": "Unload All",
            "clearSlices": "Clear Slices"
        },
        "objectContextMenu": { // Context menu that appears when we right-click on an object in the 3D view
            "viewFit": "View Fit", // Menu option to position the camera to fit the object in view
            "viewFitAll": "View Fit All", // Menu option to position the camera to fit all objects in view
            "showInTree": "Show in Tree", // Menu option to show the object in the Objects tab's tree
            "hide": "Hide", // Menu option to hide this object
            "hideOthers": "Hide Others", // Menu option to hide other objects
            "hideAll": "Hide All", // Menu option to hide all objects
            "showAll": "Show All", // Menu option to show all objects
            "xray": "X-Ray", // Menu option to X-ray this object
            "xrayOthers": "X-Ray Others", // Menu option to undo X-ray on all other objects
            "xrayAll": "X-Ray All", // Menu option to X-ray all objects
            "xrayNone": "X-Ray None", // Menu option to remove X-ray effect from all objects
            "select": "Select", // Menu option to select this object
            "undoSelect": "Undo Select", // Menu option to deselect this object
            "selectNone": "Select None", // Menu option to deselect all objects
            "clearSlices": "Clear Slices" // Menu option to delete all slices made with the Slicing tool
        },
        "treeViewContextMenu": { // Context menu that appears when we right-click an object node in the tree within in the "Objects" tab
            "viewFit": "View Fit", // Menu option to position the camera to fit the object in view
            "viewFitAll": "View Fit All", // Menu option to position the camera to fit all objects in view
            "isolate": "Isolate", // Menu option to hide all other objects and fit this object in view
            "hide": "Hide", // Menu option to hide this object
            "hideOthers": "Hide Others", // Menu option to hide other objects
            "hideAll": "Hide All", // Menu option to hide all objects
            "show": "Show", // Menu option to show this object
            "showOthers": "Show Others", // Menu option to hide this object and show all others
            "showAll": "Show All", // Menu option to show all objects
            "xray": "X-Ray", // Menu option to X-ray this object
            "undoXray": "Undo X-Ray", // Menu option to undo X-ray on this object
            "xrayOthers": "X-Ray Others", // Menu option to undo X-ray on all other objects
            "xrayAll": "X-Ray All", // Menu option to X-ray all objects
            "xrayNone": "X-Ray None", // Menu option to remove X-ray effect from all objects
            "select": "Select", // Menu option to select this object
            "undoSelect": "Undo Select", // Menu option to deselect this object
            "selectNone": "Select None", // Menu option to deselect all objects
            "clearSlices": "Clear Slices" // Menu option to delete all slices made with the Slicing tool
        },
        "sectionToolContextMenu": { // Context menu that appears when we right-click an the Slicing tool
            "clearSlices": "Clear Slices", // Menu option to delete all slices
            "flipSlices": "Flip Slices", // Menu option to reverse the cutting direction of all slices
            "edit": "Edit", // Sub-menu option to edit a single slice
            "flip": "Flip", // Sub-menu option to reverse the cutting direction of a single slice
            "delete": "Delete" // Sub-menu option to delete a single slice
        }
    },

    // German

    "de": {
        "busyModal": { // The dialog that appears in the center of the canvas while we are loading a model
            "loading": "Laden von" // Loading <myModel>
        },
        "NavCube": { // The 3D navigation cube at the bottom right of the canvas
            "front": "Vorderseite",
            "back": "Zurück",
            "top": "Oben",
            "bottom": "Unterseite",
            "left": "Links",
            "right": "Recht"
        },
        "modelsExplorer": { // The "Models" tab on the left of the canvas
            "title": "Modelle",
            "loadAll": "Alle laden",
            "loadAllTip": "Alle Modelle laden",
            "unloadAll": "Alles entladen",
            "unloadAllTip": "Alle Modelle entladen",
            "add": "Hinzufügen",
            "addTip": "Modell hinzufügen"
        },
        "objectsExplorer": { // The "Objects" tab on the left of the canvas
            "title": "Objekte",
            "showAll": "Zeige alles",
            "showAllTip": "Alle Objekte anzeigen",
            "hideAll": "Versteck alles",
            "hideAllTip": "Alle Objekte ausblenden"
        },
        "classesExplorer": { // The "Classes" tab on the left of the canvas
            "title": "Typen",
            "showAll": "Zeige alles",
            "showAllTip": "Alle Typen anzeigen",
            "hideAll": "Versteck alles",
            "hideAllTip": "Alle Typen ausblenden"
        },
        "storeysExplorer": { // The "Storeys" tab on the left of the canvas
            "title": "Stockwerke",
            "showAll": "Zeige alles",
            "showAllTip": "Alle Stockwerke anzeigen",
            "hideAll": "Versteck alles",
            "hideAllTip": "Alle Stockwerke ausblenden"
        },
        "toolbar": { // The toolbar at the top of the canvas
            "toggleExplorer": "Explorer umschalten", // Button to open or close the explorer panel on the left
            "resetViewTip": "Ansicht zurücksetzen", // Button to reset the viewer to initial state
            "toggle2d3dTip": "2D/3D umschalten", // Button to toggle between 2D and 3D viewing modes
            "togglePerspectiveTip": "Ortho/Perspektive umschalten", // Buttons to toggle between orthographic and perspective projection modes
            "viewFitTip": "Alles zur Ansicht anpassen", // Button to fit everything in view
            "firstPersonTip": "Ego-Navigationsmodus umschalten", // Button to toggle between first-person and orbiting camera navigation
            "hideObjectsTip": "Objekte ausblenden", // Button to activate/deactivate the Hide Objects tool
            "selectObjectsTip": "Objekte auswählen", // Button to activate/deactivate "Select objects" tool
            "queryObjectsTip": "Abfrageobjekte", // Button to activate/deactivate "Query objects" tool
            "sliceObjectsTip": "Objekte aufschneiden", // Button to activate/deactivate "Slice objects" tool
            "slicesMenuTip": "Scheiben Menü", // Button to open the pull-down menu of existing section planes
            "numSlicesTip": "Anzahl der Scheiben" // Label shows number of existing section planes
        },
        "canvasContextMenu": { // Context menu that appears when we right-click on empty canvas space
            "viewFitAll": "Alle in Sichtweite einpassen", // Menu option to position the camera to fit all objects in view
            "hideAll": "Versteck alles", // Menu option to hide all objects
            "showAll": "Zeige alles", // Menu option to show all objects
            "xRayAll": "X-Ray alles", // Menu option to X-ray all objects
            "xRayNone": "X-Ray keine", // Menu option to remove X-ray effect from all objects
            "selectNone": "Nichts ausgewählt", // Menu option to clear any currently selected objects
            "resetView": "Ansicht zurücksetzen", // Menu option to reset the view to initial state
            "clearSlices": "Scheiben löschen" // Menu option to delete all section planes created with the Slice tool
        },
        "modelsContextMenu": { // Context menu that appears when we right-click on a model in the "Models" tab
            "loadModel": "Laden", // Menu option to load a model
            "unloadModel": "Entladen", // Menu option to unload a model
            "editModel": "Bearbeiten", // Menu option to edit a model (re-upload its IFC file)
            "deleteModel": "Löschen", // Menu option to delete a model
            "loadAllModels": "Alle laden", // Menu option to load all available models
            "unloadAllModels": "Alle entladen", // Menu option to unload all available models
            "clearSlices": "Slices löschen" // Menu option to delete all slices made with the Slicing tool
        },
        "objectContextMenu": { // Context menu that appears when we right-click on an object in the 3D view
            "viewFit": "Objekt in Sichtweite einpassen", // Menu option to position the camera to fit the right-clicked object in view
            "viewFitAll": "Alle in Sichtweite einpassen", // Menu option to position the camera to fit all objects in view
            "showInTree": "Im Baum anzeigen", // Menu option to show the right-clicked object in the Objects tab's tree
            "hide": "Ausblenden", // Menu option to hide the right-clicked object
            "hideOthers": "Andere verstecken", // Menu option to hide all objects except the right-clicked object
            "hideAll": "Versteck alles", // Menu option to hide all objects
            "showAll": "Zeige alles", // Menu option to show all objects
            "xray": "X-Ray", // Menu option to X-ray the right-clicked object
            "xrayOthers": "X-Ray Andere", // Menu option to X-ray all objects except the right-clicked object
            "xrayAll": "X-Ray alles", // Menu option to X-ray all objects
            "xrayNone": "X-Ray keine",  // Menu option to undo X-ray on all objects
            "select": "Wählen",  // Menu option to select the right-clicked object
            "undoSelect": "Abwählen",  // Menu option to unselect the right-clicked object
            "selectNone": "Nichts ausgewählt", // Menu option to unselect all objects
            "clearSlices": "Slices löschen" // Menu option to delete all slices
        },
        "treeViewContextMenu": { // Context menu that appears when we right-click an object node in the tree within in the "Objects" tab
            "viewFit": "Objekt in Sichtweite einpassen", // Menu option to position the camera to fit the object in view
            "viewFitAll": "Alle in Sichtweite einpassen", // Menu option to position the camera to fit all objects in view
            "isolate": "Isolieren", // Menu option to hide all other objects and fit this object in view
            "hide": "Ausblenden", // Menu option to hide this object
            "hideOthers": "Andere Verstecken", // Menu option to hide other objects
            "hideAll": "Versteck Alles", // Menu option to hide all objects
            "show": "Zeige", // Menu option to show this object
            "showOthers": "Anderen Zeigen", // Menu option to hide this object and show all others
            "showAll": "Zeige Alles", // Menu option to show all objects
            "xray": "X-Ray", // Menu option to X-ray this object
            "undoXray": "X-Ray rückgängig machen", // Menu option to undo X-ray on this object
            "xrayOthers": "X-Ray Andere", // Menu option to undo X-ray on all other objects
            "xrayAll": "X-Ray alles", // Menu option to X-ray all objects
            "xrayNone": "X-Ray keine", // Menu option to remove X-ray effect from all objects
            "select": "Wählen", // Menu option to select this object
            "undoSelect": "Abwählen", // Menu option to deselect this object
            "selectNone": "Nichts ausgewählt", // Menu option to deselect all objects
            "clearSlices": "Slices löschen" // Menu option to delete all slices made with the Slicing tool
        },
        "sectionToolContextMenu": { // Context menu that appears when we right-click an the Slicing tool
            "clearSlices": "Slices löschen", // Menu option to delete all slices
            "flipSlices": "Scheiben wenden", // Menu option to reverse the cutting direction of all slices
            "edit": "Bearbeiten", // Sub-menu option to edit a single slice
            "flip": "Wenden", // Sub-menu option to reverse the cutting direction of a single slice
            "delete": "Löschen" // Sub-menu option to delete a single slice
        }
    }

    // Please add your locale translations here!
};

export {messages};