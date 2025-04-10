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
        "propertiesInspector": { // The "Properties" tab on the right of the canvas
            "title": "Properties",
            "noObjectSelectedWarning": "No object inspected. Right-click or long-tab an object and select \'Inspect Properties\' to view its properties here.",
            "noPropSetWarning": "No property sets found for this object."
        },
        "toolbar": { // The toolbar at the top of the canvas
            "toggleExplorer": "Toggle explorer", // Button to open or close the explorer panel on the left
            "toggleProperties": "Toggle properties", // Button to open or close the properties panel on the right
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
            "showSpacesTip": "Show IFCSpaces", //Button to show IFC spaces
            "numSlicesTip": "Number of existing slices", // Label shows number of sexisting section planes
            "measureDistanceTip": "Measure Distance", // **** added
            "measureAngleTip": "Measure Angle", // **** added
            "marqueeSelectTip": "Marquee Select" // **** added
        },
        "canvasContextMenu": { // Context menu that appears when we right-click on empty canvas space
            "viewFitSelection": "View Fit Selected", // **** added
            "viewFitAll": "View Fit All", // Menu option to position the camera to fit all objects in view
            "hideAll": "Hide All", // Menu option to hide all objects
            "showAll": "Show All", // Menu option to show all objects
            "xRayAll": "X-Ray All", // Menu option to X-ray all objects
            "xRayNone": "X-Ray None", // Menu option to remove X-ray effect from all objects
            "selectNone": "Select None", // Menu option to clear any currently selected objects
            "resetView": "Reset View", // Menu option to reset the view to initial state
            "clearSlices": "Clear Slices", // Menu option to delete all section planes created with the Slice tool
            "measurements": "Measure", // **** added
            "clearMeasurements": "Clear Measurements", // **** added
            "hideMeasurementAxisWires": "Hide Measurement Axis", // **** added
            "showMeasurementAxisWires": "Show Measurement Axis", // **** added
            "disableMeasurementSnapping": "Dsiable Snapping", // **** added
            "enableMeasurementSnapping": "Enable Snapping" // **** added
        },
        "modelsContextMenu": { // Context menu that appears when we right-click on a model in the "Models" tab
            "loadModel": "Load",
            "unloadModel": "Unload",
            "editModel": "Edit",
            "deleteModel": "Delete",
            "loadAllModels": "Load All",
            "unloadAllModels": "Unload All",
            "clearSlices": "Clear Slices",
            "measurements": "Measure", // **** added
            "clearMeasurements": "Clear Measurements", // **** added
            "hideMeasurementAxisWires": "Hide Measurement Axis", // **** added
            "showMeasurementAxisWires": "Show Measurement Axis", // **** added
            "disableMeasurementSnapping": "Dsiable Snapping", // **** added
            "enableMeasurementSnapping": "Enable Snapping" // **** added
        },
        "objectContextMenu": { // Context menu that appears when we right-click on an object in the 3D view
            "inspectProperties": "Inspect Properties", //menu option to inspect properties in the properties inspector
            "viewFit": "View Fit", // Menu option to position the camera to fit the object in view
            "viewFitSelection": "View Fit Selected", // **** added
            "viewFitAll": "View Fit All", // Menu option to position the camera to fit all objects in view
            "showInTree": "Show in Explorer", // Menu option to show the object in the Objects tab's tree
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
            "clearSlices": "Clear Slices", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Measure", // **** added
            "clearMeasurements": "Clear Measurements", // **** added
            "hideMeasurementAxisWires": "Hide Measurement Axis", // **** added
            "showMeasurementAxisWires": "Show Measurement Axis", // **** added
            "disableMeasurementSnapping": "Dsiable Snapping", // **** added
            "enableMeasurementSnapping": "Enable Snapping" // **** added
        },
        "treeViewContextMenu": { // Context menu that appears when we right-click an object node in the tree within in the "Objects" tab
            "inspectProperties": "Inspect Properties", //menu option to inspect properties in the properties inspector
            "viewFit": "View Fit", // Menu option to position the camera to fit the object in view
            "viewFitSelection": "View Fit Selected", // **** added
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
            "clearSlices": "Clear Slices", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Measure", // **** added
            "clearMeasurements": "Clear Measurements", // **** added
            "hideMeasurementAxisWires": "Hide Measurement Axis", // **** added
            "showMeasurementAxisWires": "Show Measurement Axis", // **** added
            "disableMeasurementSnapping": "Dsiable Snapping", // **** added
            "enableMeasurementSnapping": "Enable Snapping" // **** added
        },
        "sectionToolContextMenu": { // Context menu that appears when we right-click an the Slicing tool
            "slice": "Slice", // Title of submenu for each slice, eg. "Slice #0, Slice #1" etc
            "clearSlices": "Clear Slices", // Menu option to delete all slices
            "flipSlices": "Flip Slices", // Menu option to reverse the cutting direction of all slices
            "edit": "Edit", // Sub-menu option to edit a single slice
            "flip": "Flip", // Sub-menu option to reverse the cutting direction of a single slice
            "delete": "Delete" // Sub-menu option to delete a single slice
        },

        "measureContextMenu": {
            "hideMeasurementAxisWires": "Hide Measurement Axis", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementAxisWires": "Show Measurement Axis", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "hideMeasurementLabels": "Hide Measurement Labels", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementLabels": "Show Measurement Labels", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "clearMeasurements": "Clear Measurements" // **** added & previous bug fixed in zeokit-bim-viewer.es.js
        }
    },

    // German

    "de": {
        "busyModal": { // The dialog that appears in the center of the canvas while we are loading a model
            "loading": "Laden von" // Loading <myModel>
        },
        "NavCube": { // The 3D navigation cube at the bottom right of the canvas
            "front": "Vorne",
            "back": "Hinten",
            "top": "Oben",
            "bottom": "Unten",
            "left": "Links",
            "right": "Rechts"
        },
        "modelsExplorer": { // The "Models" tab on the left of the canvas
            "title": "Modelle",
            "loadAll": "Alle laden",
            "loadAllTip": "Alle Modelle in diesem Projekt laden",
            "unloadAll": "Alle abwählen",
            "unloadAllTip": "Alle Modelle abwählen",
            "add": "Hinzufügen",
            "addTip": "Modell hinzufügen"
        },
        "objectsExplorer": { // The "Objects" tab on the left of the canvas
            "title": "Objekte",
            "showAll": "Alle anzeigen",
            "showAllTip": "Alle Objekte anzeigen",
            "hideAll": "Alle ausblenden",
            "hideAllTip": "Alle Objekte ausblenden"
        },
        "classesExplorer": { // The "Classes" tab on the left of the canvas
            "title": "Typen",
            "showAll": "Alle anzeigen",
            "showAllTip": "Alle Typen anzeigen",
            "hideAll": "Alle ausblenden",
            "hideAllTip": "Alle Typen ausblenden"
        },
        "storeysExplorer": { // The "Storeys" tab on the left of the canvas
            "title": "Stockwerke",
            "showAll": "Alle anzeigen",
            "showAllTip": "Alle Stockwerke anzeigen",
            "hideAll": "Alle ausblenden",
            "hideAllTip": "Alle Stockwerke ausblenden"
        },
        "propertiesInspector": { // The "Properties" tab on the right of the canvas
            "title": "Eigenschaften",
            "noObjectSelectedWarning": "Kein Objekt inspiziert. Klicken Sie mit der rechten Maustaste auf ein Objekt oder führen Sie einen langen Tabulator aus und wählen Sie \'Eigenschaften prüfen\', um die Eigenschaften des Objekts anzuzeigen.",
            "noPropSetWarning": "Keine Eigenschaftssätze für dieses Objekt gefunden."
        },
        "toolbar": { // The toolbar at the top of the canvas
            "toggleExplorer": "Explorer ein- und ausblenden", // Button to open or close the explorer panel on the left
            "toggleProperties": "Eigenschaften ein- und ausblenden", // Button to open or close the properties panel on the right
            "resetViewTip": "Ansicht zurücksetzen", // Button to reset the viewer to initial state
            "toggle2d3dTip": "2D/3D umschalten", // Button to toggle between 2D and 3D viewing modes
            "togglePerspectiveTip": "Orthogonale/Perspektivische Ansicht umschalten", // Buttons to toggle between orthographic and perspective projection modes
            "viewFitTip": "In Ansicht einpassen", // Button to fit everything in view
            "firstPersonTip": "Ich-Perspektive umschalten", // Button to toggle between first-person and orbiting camera navigation
            "hideObjectsTip": "Objekte ausblenden", // Button to activate/deactivate the Hide Objects tool
            "selectObjectsTip": "Objekte auswählen", // Button to activate/deactivate "Select objects" tool
            "queryObjectsTip": "Abfrageobjekte", // Button to activate/deactivate "Query objects" tool
            "sliceObjectsTip": "Objekte schneiden", // Button to activate/deactivate "Slice objects" tool
            "slicesMenuTip": "Menü Schnittebenen", // Button to open the pull-down menu of existing section planes
            "showSpacesTip": "IFC-Räume anzeigen", //Button to show IFC spaces
            "numSlicesTip": "Anzahl der Schnittebenen", // Label shows number of existing section planes
            "measureDistanceTip": "Entfernung messen", // **** added
            "measureAngleTip": "Winkel messen", // **** added
            "marqueeSelectTip": "Auswahlrechteck" // **** added
        },
        "canvasContextMenu": { // Context menu that appears when we right-click on empty canvas space
            "viewFitSelection": "Ausgewählte Passform anzeigen", // **** added
            "viewFitAll": "In Ansicht einpassen", // Menu option to position the camera to fit all objects in view
            "hideAll": "Alle ausblenden", // Menu option to hide all objects
            "showAll": "Alle anzeigen", // Menu option to show all objects
            "xRayAll": "Röntgenansicht (alle)", // Menu option to X-ray all objects
            "xRayNone": "Röntgenansicht (keine)", // Menu option to remove X-ray effect from all objects
            "selectNone": "Alle abwählen", // Menu option to clear any currently selected objects
            "resetView": "Ansicht zurücksetzen", // Menu option to reset the view to initial state
            "clearSlices": "Schnittebenen löschen", // Menu option to delete all section planes created with the Slice tool
            "measurements": "Messen", // **** added
            "clearMeasurements": "Klare Messungen", // **** added
            "hideMeasurementAxisWires": "Messachse ausblenden", // **** added
            "showMeasurementAxisWires": "Messachse anzeigen", // **** added
            "disableMeasurementSnapping": "Ausrichten deaktivieren", // **** added
            "enableMeasurementSnapping": "Einrasten aktivieren" // **** added
        },
        "modelsContextMenu": { // Context menu that appears when we right-click on a model in the "Models" tab
            "loadModel": "Laden", // Menu option to load a model
            "unloadModel": "Abwählen", // Menu option to unload a model
            "editModel": "Bearbeiten", // Menu option to edit a model (re-upload its IFC file)
            "deleteModel": "Löschen", // Menu option to delete a model
            "loadAllModels": "Alle laden", // Menu option to load all available models
            "unloadAllModels": "Alle abwählen", // Menu option to unload all available models
            "clearSlices": "Schnittebenen löschen", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Messen", // **** added
            "clearMeasurements": "Klare Messungen", // **** added
            "hideMeasurementAxisWires": "Messachse ausblenden", // **** added
            "showMeasurementAxisWires": "Messachse anzeigen", // **** added
            "disableMeasurementSnapping": "Ausrichten deaktivieren", // **** added
            "enableMeasurementSnapping": "Einrasten aktivieren" // **** added
        },
        "objectContextMenu": { // Context menu that appears when we right-click on an object in the 3D view
            "inspectProperties": "Eigenschaften prüfen", //menu option to inspect properties in the properties inspector
            "viewFit": "Objekt in Ansicht einpassen", // Menu option to position the camera to fit the right-clicked object in view
            "viewFitSelection": "Ausgewählte Passform anzeigen", // **** added
            "viewFitAll": "Alle in Ansicht einpassen", // Menu option to position the camera to fit all objects in view
            "showInTree": "Im Baum anzeigen", // Menu option to show the right-clicked object in the Objects tab's tree
            "hide": "Ausblenden", // Menu option to hide the right-clicked object
            "hideOthers": "Andere ausblenden", // Menu option to hide all objects except the right-clicked object
            "hideAll": "Alle ausblenden", // Menu option to hide all objects
            "showAll": "Alle anzeigen", // Menu option to show all objects
            "xray": "Röntgenansicht", // Menu option to X-ray the right-clicked object
            "xrayOthers": "Röntgenansicht (andere)", // Menu option to X-ray all objects except the right-clicked object
            "xrayAll": "Röntgenansicht (alle)", // Menu option to X-ray all objects
            "xrayNone": "Röntgenansicht (keine)",  // Menu option to undo X-ray on all objects
            "select": "Auswählen",  // Menu option to select the right-clicked object
            "undoSelect": "Abwählen",  // Menu option to unselect the right-clicked object
            "selectNone": "Alle abwählen", // Menu option to unselect all objects
            "clearSlices": "Schnittebenen löschen", // Menu option to delete all slices
            "measurements": "Messen", // **** added
            "clearMeasurements": "Klare Messungen", // **** added
            "hideMeasurementAxisWires": "Messachse ausblenden", // **** added
            "showMeasurementAxisWires": "Messachse anzeigen", // **** added
            "disableMeasurementSnapping": "Ausrichten deaktivieren", // **** added
            "enableMeasurementSnapping": "Einrasten aktivieren" // **** added
        },
        "treeViewContextMenu": { // Context menu that appears when we right-click an object node in the tree within in the "Objects" tab
            "inspectProperties": "Eigenschaften prüfen", //menu option to inspect properties in the properties inspector
            "viewFit": "Objekt in Ansicht einpassen", // Menu option to position the camera to fit the object in view
            "viewFitSelection": "Ausgewählte Passform anzeigen", // **** added
            "viewFitAll": "Alle in Ansicht einpassen", // Menu option to position the camera to fit all objects in view
            "isolate": "Isolieren", // Menu option to hide all other objects and fit this object in view
            "hide": "Ausblenden", // Menu option to hide this object
            "hideOthers": "Andere ausblenden", // Menu option to hide other objects
            "hideAll": "Alle ausblenden", // Menu option to hide all objects
            "show": "Anzeigen", // Menu option to show this object
            "showOthers": "Andere anzeigen", // Menu option to hide this object and show all others
            "showAll": "Alle anzeigen", // Menu option to show all objects
            "xray": "Röntgenansicht", // Menu option to X-ray this object
            "undoXray": "Röntgenansicht rückgängig machen", // Menu option to undo X-ray on this object
            "xrayOthers": "Röntgenansicht (andere)", // Menu option to undo X-ray on all other objects
            "xrayAll": "Röntgenansicht (alle)", // Menu option to X-ray all objects
            "xrayNone": "Röntgenansicht (keine)", // Menu option to remove X-ray effect from all objects
            "select": "Auswählen", // Menu option to select this object
            "undoSelect": "Abwählen", // Menu option to deselect this object
            "selectNone": "Alle abwählen", // Menu option to deselect all objects
            "clearSlices": "Schnittebenen löschen", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Messen", // **** added
            "clearMeasurements": "Klare Messungen", // **** added
            "hideMeasurementAxisWires": "Messachse ausblenden", // **** added
            "showMeasurementAxisWires": "Messachse anzeigen", // **** added
            "disableMeasurementSnapping": "Ausrichten deaktivieren", // **** added
            "enableMeasurementSnapping": "Einrasten aktivieren" // **** added
        },
        "sectionToolContextMenu": { // Context menu that appears when we right-click an the Slicing tool
            "slice": "Schnitte", // Title of submenu for each slice, eg. "Slice #0, Slice #1" etc
            "clearSlices": "Schnittebenen löschen", // Menu option to delete all slices
            "flipSlices": "Schnittebenen umdrehen", // Menu option to reverse the cutting direction of all slices
            "edit": "Bearbeiten", // Sub-menu option to edit a single slice
            "flip": "Umdrehen", // Sub-menu option to reverse the cutting direction of a single slice
            "delete": "Löschen" // Sub-menu option to delete a single slice
        },

        "measureContextMenu": {
            "hideMeasurementAxisWires": "Messachse ausblenden", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementAxisWires": "Messachse anzeigen", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "hideMeasurementLabels": "Messbeschriftungen ausblenden", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementLabels": "Maßbeschriftungen anzeigen", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "clearMeasurements": "Klare Messungen" // **** added & previous bug fixed in zeokit-bim-viewer.es.js
        }
    },

    // French

    "fr": {
        "busyModal": { // The dialog that appears in the center of the canvas while we are loading a model
            "loading": "Chargement" // Loading <myModel>
        },
        "NavCube": { // The 3D navigation cube at the bottom right of the canvas
            "front": "Face",
            "back": "Arrière",//alternative: Dos
            "top": "Dessus",
            "bottom": "Dessous",
            "left": "Droite",
            "right": "Gauche"
        },
        "modelsExplorer": { // The "Models" tab on the left of the canvas
            "title": "Modèles",
            "loadAll": "Afficher tout",
            "loadAllTip": "Afficher tous les modèles du projet",
            "unloadAll": "Masquer tout",
            "unloadAllTip": "Masquer tous les modèles",
            "add": "Ajouter",
            "addTip": "Ajouter un modèle"
        },
        "objectsExplorer": { // The "Objects" tab on the left of the canvas
            "title": "Conteneurs",
            "showAll": "Afficher tout",
            "showAllTip": "Afficher tous les objets",
            "hideAll": "Masquer tout",
            "hideAllTip": "Masquer tous les objets"
        },
        "classesExplorer": { // The "Classes" tab on the left of the canvas
            "title": "Classes IFC",
            "showAll": "Afficher tout",
            "showAllTip": "Affiche toutes les classes",
            "hideAll": "Masquer tout",
            "hideAllTip": "Masquer toutes les classes"
        },
        "storeysExplorer": { // The "Storeys" tab on the left of the canvas
            "title": "Étages",
            "showAll": "Afficher tout",
            "showAllTip": "Afficher tous les étages",
            "hideAll": "Masquer tout",
            "hideAllTip": "Masquer tous les étages"
        },
        "propertiesInspector": { // The "Properties" tab on the right of the canvas
            "title": "Propriétés",
            "noObjectSelectedWarning": "Aucun objet n'a été inspecté. Cliquez avec le bouton droit ou le bouton long sur un objet et sélectionnez \'Inspecter les propriétés\' pour afficher ses propriétés ici.",
            "noPropSetWarning": "Aucun ensemble de propriétés n'a été trouvé pour cet objet."
        },
        "toolbar": { // The toolbar at the top of the canvas
            "toggleExplorer": "Afficher la structure", // Button to open or close the explorer panel on the left
            "toggleProperties": "Afficher les propriétés", // Button to open or close the properties panel on the right
            "resetViewTip": "Réinitialiser la vue", // Button to reset the viewer to initial state
            "toggle2d3dTip": "Activer 2D/3D", // Button to toggle between 3D view and 2D plan view modes
            "togglePerspectiveTip": "Activer Perspective/Ortho", // Button to toggle between perspective and orthographic projection
            "viewFitTip": "Recadrer la vue", // Button to position the camera to fit all objects in view
            "firstPersonTip": "Mode 1ere personne", // Button to switch between first-person and orbit navigation modes
            "hideObjectsTip": "Masquer objets", // Button to activate "Hide objects" tool
            "selectObjectsTip": "Sélectionner", // Button to activate "Select objects" tool
            "queryObjectsTip": "Informations objets", // Button to activate "Query objects" tool
            "sliceObjectsTip": "Coupes", // Button to activate "Slice objects" tool
            "slicesMenuTip": "Outils de coupe", // Button to open the pull-down menu of existing section planes
            "showSpacesTip": "Afficher les espaces IFC", //Button to show IFC spaces
            "numSlicesTip": "Nombre de coupes", // Label shows number of sexisting section planes
            "measureDistanceTip": "Mesurer la distance", // **** added
            "measureAngleTip": "Mesurer l'angle", // **** added
            "marqueeSelectTip": "Sélection de chapiteau" // **** added
        },
        "canvasContextMenu": { // Context menu that appears when we right-click on empty canvas space
            "viewFitSelection": "Voir l'ajustement sélectionné", // **** added
            "viewFitAll": "Recadrer tout", // Menu option to position the camera to fit all objects in view
            "hideAll": "Masquer tout", // Menu option to hide all objects
            "showAll": "Afficher tout", // Menu option to show all objects
            "xRayAll": "X-Ray tout", // Menu option to X-ray all objects
            "xRayNone": "X-Ray aucun", // Menu option to remove X-ray effect from all objects
            "selectNone": "Réinitialiser sélection", // Menu option to clear any currently selected objects
            "resetView": "Réinitialiser la vue", // Menu option to reset the view to initial state
            "clearSlices": "Effacer les coupes", // Menu option to delete all section planes created with the Slice tool
            "measurements": "Mesure", // **** added
            "clearMeasurements": "Mesures claires", // **** added
            "hideMeasurementAxisWires": "Masquer l'axe de mesure", // **** added
            "showMeasurementAxisWires": "Afficher l'axe de mesure", // **** added
            "disableMeasurementSnapping": "Désactiver l'accrochage", // **** added
            "enableMeasurementSnapping": "Activer l'accrochage" // **** added
        },
        "modelsContextMenu": { // Context menu that appears when we right-click on a model in the "Models" tab
            "loadModel": "Charger",
            "unloadModel": "Retirer",
            "editModel": "Editer",
            "deleteModel": "Supprimer",
            "loadAllModels": "Tout charger",
            "unloadAllModels": "Tout retirer",
            "clearSlices": "Effacer les coupes",
            "measurements": "Mesure", // **** added
            "clearMeasurements": "Mesures claires", // **** added
            "hideMeasurementAxisWires": "Masquer l'axe de mesure", // **** added
            "showMeasurementAxisWires": "Afficher l'axe de mesure", // **** added
            "disableMeasurementSnapping": "Désactiver l'accrochage", // **** added
            "enableMeasurementSnapping": "Activer l'accrochage" // **** added
        },
        "objectContextMenu": { // Context menu that appears when we right-click on an object in the 3D view
            "inspectProperties": "Inspecter les propriétés", //menu option to inspect properties in the properties inspector
            "viewFit": "Recadrer objet", // Menu option to position the camera to fit the object in view
            "viewFitSelection": "Voir l'ajustement sélectionné", // **** added
            "viewFitAll": "Recadrer la vue", // Menu option to position the camera to fit all objects in view
            "showInTree": "Afficher arborescence", // Menu option to show the object in the Objects tab's tree
            "hide": "Masquer", // Menu option to hide this object
            "hideOthers": "Isoler l'objet", // Menu option to hide other objects
            "hideAll": "Tout masquer", // Menu option to hide all objects
            "showAll": "Tout afficher", // Menu option to show all objects
            "xray": "X-Ray", // Menu option to X-ray this object
            "xrayOthers": "X-Ray autres", // Menu option to undo X-ray on all other objects
            "xrayAll": "X-Ray tout", // Menu option to X-ray all objects
            "xrayNone": "X-Ray aucun", // Menu option to remove X-ray effect from all objects
            "select": "Sélectionner", // Menu option to select this object
            "undoSelect": "Annuler sélection", // Menu option to deselect this object
            "selectNone": "Réinitialiser sélection", // Menu option to deselect all objects
            "clearSlices": "Effacer les coupes", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Mesure", // **** added
            "clearMeasurements": "Mesures claires", // **** added
            "hideMeasurementAxisWires": "Masquer l'axe de mesure", // **** added
            "showMeasurementAxisWires": "Afficher l'axe de mesure", // **** added
            "disableMeasurementSnapping": "Désactiver l'accrochage", // **** added
            "enableMeasurementSnapping": "Activer l'accrochage" // **** added
        },
        "treeViewContextMenu": { // Context menu that appears when we right-click an object node in the tree within in the "Objects" tab
            "inspectProperties": "Inspecter les propriétés", //menu option to inspect properties in the properties inspector
            "viewFit": "Recadrer objet", // Menu option to position the camera to fit the object in view
            "viewFitSelection": "Voir l'ajustement sélectionné", // **** added
            "viewFitAll": "Recadrer la vue", // Menu option to position the camera to fit all objects in view
            "isolate": "Isoler", // Menu option to hide all other objects and fit this object in view
            "hide": "Masquer", // Menu option to hide this object
            "hideOthers": "Masquer autres", // Menu option to hide other objects
            "hideAll": "Masquer tout", // Menu option to hide all objects
            "show": "Afficher", // Menu option to show this object
            "showOthers": "Afficher les autres", // Menu option to hide this object and show all others
            "showAll": "Afficher tout", // Menu option to show all objects
            "xray": "X-Ray", // Menu option to X-ray this object
            "undoXray": "Annuler X-Ray", // Menu option to undo X-ray on this object
            "xrayOthers": "X-Ray autres", // Menu option to undo X-ray on all other objects
            "xrayAll": "X-Ray tout", // Menu option to X-ray all objects
            "xrayNone": "X-Ray aucun", // Menu option to remove X-ray effect from all objects
            "select": "Sélectionner", // Menu option to select this object
            "undoSelect": "Annuler sélection", // Menu option to deselect this object
            "selectNone": "Réinitialiser sélection", // Menu option to deselect all objects
            "clearSlices": "Effacer les coupes", // Menu option to delete all slices made with the Slicing tool
            "clearMeasurements": "Mesures claires", // **** added
            "hideMeasurementAxisWires": "Masquer l'axe de mesure", // **** added
            "showMeasurementAxisWires": "Afficher l'axe de mesure", // **** added
            "disableMeasurementSnapping": "Désactiver l'accrochage", // **** added
            "enableMeasurementSnapping": "Activer l'accrochage" // **** added
        },
        "sectionToolContextMenu": { // Context menu that appears when we right-click an the Slicing tool
            "slice": "Coupe", // Title of submenu for each slice, eg. "Slice #0, Slice #1" etc
            "clearSlices": "Effacer les coupes", // Menu option to delete all slices
            "flipSlices": "Inverser les coupes", // Menu option to reverse the cutting direction of all slices
            "edit": "Editer", // Sub-menu option to edit a single slice
            "flip": "Inverser", // Sub-menu option to reverse the cutting direction of a single slice
            "delete": "Supprimer" // Sub-menu option to delete a single slice
        },

        "measureContextMenu": {
            "hideMeasurementAxisWires": "Masquer l'axe de mesure", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementAxisWires": "Afficher l'axe de mesure", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "hideMeasurementLabels": "Masquer les étiquettes de mesure", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementLabels": "Afficher les étiquettes de mesure", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "clearMeasurements": "Mesures claires" // **** added & previous bug fixed in zeokit-bim-viewer.es.js
        }
    },

    //Polish

    "pl": {
        "busyModal": { // The dialog that appears in the center of the canvas while we are loading a model
            "loading": "Ładowanie" // Loading <myModel>
        },
        "NavCube": { // The 3D navigation cube at the bottom right of the canvas
            "front": "Przód",
            "back": "Tył",
            "top": "Góra",
            "bottom": "Dół",
            "left": "Lewy",
            "right": "Prawy"
        },
        "modelsExplorer": { // The "Models" tab on the left of the canvas
            "title": "Model",
            "loadAll": "Załaduj",
            "loadAllTip": "Załaduj wszystkie modele",
            "unloadAll": "Zamknij",
            "unloadAllTip": "Zamnij wszystkie modele",
            "add": "Dodaj",
            "addTip": "Dodaj modele"
        },
        "objectsExplorer": { // The "Objects" tab on the left of the canvas
            "title": "Obiekty",
            "showAll": "Pokaż",
            "showAllTip": "Pokaż wszystkie obiekty",
            "hideAll": "Ukryj",
            "hideAllTip": "Ukryj wszystkie obiekty"
        },
        "classesExplorer": { // The "Classes" tab on the left of the canvas
            "title": "Typy",
            "showAll": "Pokaż",
            "showAllTip": "Pokaż wszystkie typy",
            "hideAll": "Ukryj",
            "hideAllTip": "Ukryj wszystkie typy"
        },
        "storeysExplorer": { // The "Storeys" tab on the left of the canvas
            "title": "Piętra",
            "showAll": "Pokaż",
            "showAllTip": "Pokaż wszystkie piętra",
            "hideAll": "Ukryj",
            "hideAllTip": "Ukryj wszystkie piętra"
        },
        "propertiesInspector": { // The "Properties" tab on the right of the canvas
            "title": "Właściwości",
            "noObjectSelectedWarning": "Nie sprawdzono żadnego obiektu. Kliknij prawym przyciskiem myszy lub kliknij długo na obiekcie i wybierz opcję \'Sprawdź właściwości\', aby wyświetlić jego właściwości.",
            "noPropSetWarning": "Nie znaleziono żadnych zestawów właściwości dla tego obiektu."
        },
        "toolbar": { // The toolbar at the top of the canvas
            "toggleExplorer": "Przełączanie eksploratora", // Button to open or close the explorer panel on the left
            "toggleProperties": "Przełączanie właściwości", // Button to open or close the properties panel on the right
            "resetViewTip": "Resetuj widok", // Button to reset the voewer to initial state
            "toggle2d3dTip": "Widok 2D/3D", // Button to toggle between 2D and 3D viewing modes
            "togglePerspectiveTip": "Widok Ortograficzny/Perspektywiczny", // Buttons to toggle between orthographic and perspective projection modes
            "viewFitTip": "Dopasowanie do widoku", // Button to fit everything in view
            "firstPersonTip": "Widok perspektywy pierwszoosobowej", // Button to toggle between first-person and orbiting camera navigation
            "hideObjectsTip": "Ukryj obiekt", // Button to activate/deactivate the Hide Objects tool
            "selectObjectsTip": "Zaznacz obiekt", // Button to activate/deactivate "Select objects" tool
            "queryObjectsTip": "Wywołaj obiekt", // Button to activate/deactivate "Query objects" tool
            "sliceObjectsTip": "Przekroje obiektów", // Button to activate/deactivate "Slice objects" tool
            "slicesMenuTip": "Menu przekroi", // Button to open the pull-down menu of existing section planes
            "showSpacesTip": "Pokaż przestrzenie IFC", //Button to show IFC spaces
            "numSlicesTip": "Liczba przekroi", // Label shows number of existing section planes
            "measureDistanceTip": "Zmierz odległość", // **** added
            "measureAngleTip": "Zmierz kąt", // **** added
            "marqueeSelectTip": "Wybierz markizę" // **** added
        },
        "canvasContextMenu": { // Context menu that appears when we right-click on empty canvas space
            "viewFitSelection": "Wyświetl dopasowanie wybrane", // **** added
            "viewFitAll": "Dopasuj widok do modelu", // Menu option to position the camera to fit all objects in view
            "hideAll": "Ukryj wszystkie", // Menu option to hide all objects
            "showAll": "Pokaż wszystkie", // Menu option to show all objects
            "xRayAll": "Prześwietl wszystko", // Menu option to X-ray all objects
            "xRayNone": "Usuń prześwietlenia", // Menu option to remove X-ray effect from all objects
            "selectNone": "Usuń zaznaczenia", // Menu option to clear any currently selected objects
            "resetView": "Zresetuj widok", // Menu option to reset the view to initial state
            "clearSlices": "Usuń przekroje", // Menu option to delete all section planes created with the Slice tool
            "measurements": "Mierzyć", // **** added
            "clearMeasurements": "Wyraźne pomiary", // **** added
            "hideMeasurementAxisWires": "Ukryj oś pomiaru", // **** added
            "showMeasurementAxisWires": "Pokaż oś pomiaru", // **** added
            "disableMeasurementSnapping": "Wyłącz przyciąganie", // **** added
            "enableMeasurementSnapping": "Włącz przyciąganie" // **** added
        },
        "modelsContextMenu": { // Context menu that appears when we right-click on a model in the "Models" tab
            "loadModel": "Załaduj", // Menu option to load a model
            "unloadModel": "Zamknij", // Menu option to unload a model
            "editModel": "Edytuj", // Menu option to edit a model (re-upload its IFC file)
            "deleteModel": "Usuń", // Menu option to delete a model
            "loadAllModels": "Załaduj wszystkie", // Menu option to load all available models
            "unloadAllModels": "Zamknij wszystkie", // Menu option to unload all available models
            "clearSlices": "Usuń przekroje", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Mierzyć", // **** added
            "clearMeasurements": "Wyraźne pomiary", // **** added
            "hideMeasurementAxisWires": "Ukryj oś pomiaru", // **** added
            "showMeasurementAxisWires": "Pokaż oś pomiaru", // **** added
            "disableMeasurementSnapping": "Wyłącz przyciąganie", // **** added
            "enableMeasurementSnapping": "Włącz przyciąganie" // **** added
        },
        "objectContextMenu": { // Context menu that appears when we right-click on an object in the 3D view
            "inspectProperties": "Sprawdź właściwości", //menu option to inspect properties in the properties inspector
            "viewFit": "Dopasuj widok do obiektu", // Menu option to position the camera to fit the right-clicked object in view
            "viewFitSelection": "Wyświetl dopasowanie wybrane", // **** added
            "viewFitAll": "Dopasuj widok do modelu", // Menu option to position the camera to fit all objects in view
            "showInTree": "Pokaż w widoku drzewa", // Menu option to show the right-clicked object in the Objects tab's tree
            "hide": "Ukryj", // Menu option to hide the right-clicked object
            "hideOthers": "Ukryj pozostałe", // Menu option to hide all objects except the right-clicked object
            "hideAll": "Ukryj wszystkie", // Menu option to hide all objects
            "showAll": "Pokaż wszystkie", // Menu option to show all objects
            "xray": "Prześwietl", // Menu option to X-ray the right-clicked object
            "xrayOthers": "Prześwietl pozostałe", // Menu option to X-ray all objects except the right-clicked object
            "xrayAll": "Prześwietl wszystkie", // Menu option to X-ray all objects
            "xrayNone": "Usuń prześwietlenia",  // Menu option to undo X-ray on all objects
            "select": "Zaznacz",  // Menu option to select the right-clicked object
            "undoSelect": "Usuń zaznaczenie",  // Menu option to unselect the right-clicked object
            "selectNone": "Usuń wszystkie zaznaczenia", // Menu option to unselect all objects
            "clearSlices": "Usuń przekroje", // Menu option to delete all slices
            "measurements": "Mierzyć", // **** added
            "clearMeasurements": "Wyraźne pomiary", // **** added
            "hideMeasurementAxisWires": "Ukryj oś pomiaru", // **** added
            "showMeasurementAxisWires": "Pokaż oś pomiaru", // **** added
            "disableMeasurementSnapping": "Wyłącz przyciąganie", // **** added
            "enableMeasurementSnapping": "Włącz przyciąganie" // **** added
        },
        "treeViewContextMenu": { // Context menu that appears when we right-click an object node in the tree within in the "Objects" tab
            "inspectProperties": "Sprawdź właściwości", //menu option to inspect properties in the properties inspector
            "viewFit": "Dopasuj widok do obiektu", // Menu option to position the camera to fit the object in view
            "viewFitSelection": "Wyświetl dopasowanie wybrane", // **** added
            "viewFitAll": "Dopasuj widok do modelu", // Menu option to position the camera to fit all objects in view
            "isolate": "Wyizoluj", // Menu option to hide all other objects and fit this object in view
            "hide": "Ukryj", // Menu option to hide this object
            "hideOthers": "Ukryj pozostałe", // Menu option to hide other objects
            "hideAll": "Ukryj wszystkie", // Menu option to hide all objects
            "show": "Pokaż", // Menu option to show this object
            "showOthers": "Pokaż pozostałe", // Menu option to hide this object and show all others
            "showAll": "Pokaż wszystkie", // Menu option to show all objects
            "xray": "Prześwietl", // Menu option to X-ray this object
            "undoXray": "Cofnij prześwietlenie", // Menu option to undo X-ray on this object
            "xrayOthers": "Prześwietl pozostałe", // Menu option to undo X-ray on all other objects
            "xrayAll": "Prześwietl wszystkie", // Menu option to X-ray all objects
            "xrayNone": "Usuń prześwietlenia", // Menu option to remove X-ray effect from all objects
            "select": "Wählen", // Menu option to select this object
            "undoSelect": "Zaznacz", // Menu option to deselect this object
            "selectNone": "Usuń wszystkie zaznaczenia", // Menu option to deselect all objects
            "clearSlices": "Usuń przekroje", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Mierzyć", // **** added
            "clearMeasurements": "Wyraźne pomiary", // **** added
            "hideMeasurementAxisWires": "Ukryj oś pomiaru", // **** added
            "showMeasurementAxisWires": "Pokaż oś pomiaru", // **** added
            "disableMeasurementSnapping": "Wyłącz przyciąganie", // **** added
            "enableMeasurementSnapping": "Włącz przyciąganie" // **** added
        },
        "sectionToolContextMenu": { // Context menu that appears when we right-click an the Slicing tool
            "clearSlices": "Usuń przekroje", // Menu option to delete all slices
            "flipSlices": "Zmień kierunek", // Menu option to reverse the cutting direction of all slices
            "edit": "Edytuj", // Sub-menu option to edit a single slice
            "flip": "Obróć", // Sub-menu option to reverse the cutting direction of a single slice
            "delete": "Usuń" // Sub-menu option to delete a single slice
        },

        "measureContextMenu": {
            "hideMeasurementAxisWires": "Masquer l'axe de mesure", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementAxisWires": "Pokaż oś pomiaru", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "hideMeasurementLabels": "Ukryj etykiety pomiarowe", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementLabels": "Pokaż etykiety pomiarowe", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "clearMeasurements": "Wyraźne pomiary" // **** added & previous bug fixed in zeokit-bim-viewer.es.js
        }
    },

    // Russian

    "ru": {
        "busyModal": {
            // The dialog that appears in the center of the canvas while we are loading a model
            "loading": "Загрузка", // Loading <myModel>
        },
        "NavCube": {
            // The 3D navigation cube at the bottom right of the canvas
            "front": "Фронт",
            "back": "Тыл",
            "top": "Верх",
            "bottom": "Низ",
            "left": "Лево",
            "right": "Право",
        },
        "modelsExplorer": {
            // The "Models" tab on the left of the canvas
            "title": "Модели",
            "loadAll": "Загрузить все",
            "loadAllTip": "Загрузить все модели в этом проекте",
            "unloadAll": "Выгрузить все",
            "unloadAllTip": "Выгрузить все модели",
            "add": "Добавить",
            "addTip": "Добавить модель",
        },
        "objectsExplorer": {
            // The "Objects" tab on the left of the canvas
            "title": "Объекты",
            "showAll": "Показать все",
            "showAllTip": "Показать все объекты",
            "hideAll": "Скрыть все",
            "hideAllTip": "Скрыть все объекты",
        },
        "classesExplorer": {
            // The "Classes" tab on the left of the canvas
            "title": "Классы",
            "showAll": "Показать все",
            "showAllTip": "Показать все классы",
            "hideAll": "Скрыть все",
            "hideAllTip": "Скрыть все классы",
        },
        "storeysExplorer": {
            // The "Storeys" tab on the left of the canvas
            "title": "Этажи",
            "showAll": "Показать все",
            "showAllTip": "Показать все этажи",
            "hideAll": "Скрыть все",
            "hideAllTip": "Скрыть все этажи",
        },
        "propertiesInspector": {
            // The "Properties" tab on the right of the canvas
            "title": "Свойства",
            "noObjectSelectedWarning": "Ни один объект не осмотрен. Щелкните правой кнопкой мыши или длинной меткой на объекте и выберите \'Осмотреть свойства\', чтобы просмотреть его свойства здесь.",
            "noPropSetWarning": "Для этого объекта не найдено ни одного набора свойств."
        },
        "toolbar": {
            // The toolbar at the top of the canvas
            "toggleExplorer": "Переключить навигатор", // Button to open or close the explorer panel on the left
            "toggleProperties": "Переключить Свойства", // Button to open or close the properties panel on the right
            "resetViewTip": "Сбросить вид", // Button to reset the viewer to initial state
            "toggle2d3dTip": "Переключить 2D/3D", // Button to toggle between 3D view and 2D plan view modes
            "togglePerspectiveTip": "Переключить проекцию перспектива/орто", // Button to toggle between perspective and orthographic projection
            "viewFitTip": "Показать всю модель", // Button to position the camera to fit all objects in view
            "firstPersonTip": "Переключить режим навигации от первого лица", // Button to switch between first-person and orbit navigation modes
            "hideObjectsTip": "Скрыть объекты", // Button to activate "Hide objects" tool
            "selectObjectsTip": "Выбрать объекты", // Button to activate "Select objects" tool
            "queryObjectsTip": "Выбрать объекты", // Button to activate "Query objects" tool
            "sliceObjectsTip": "Рассечь объекты", // Button to activate "Slice objects" tool
            "slicesMenuTip": "Меню сечений", // Button to open the pull-down menu of existing section planes
            "showSpacesTip": "Показать места IFC", //Button to show IFC spaces
            "numSlicesTip": "Количество существующих сечений", // Label shows number of sexisting section planes
            "measureDistanceTip": "Измерить расстояние", // **** added
            "measureAngleTip": "Измерение угла", // **** added
            "marqueeSelectTip": "Выбрать марку" // **** added
        },
        "canvasContextMenu": {
            // Context menu that appears when we right-click on empty canvas space
            "viewFitSelection": "Посмотреть Fit Выбрано", // **** added
            "viewFitAll": "Вид включающий все", // Menu option to position the camera to fit all objects in view
            "hideAll": "Скрыть все", // Menu option to hide all objects
            "showAll": "Показать все", // Menu option to show all objects
            "xRayAll": "Рентген все", // Menu option to X-ray all objects
            "xRayNone": "Очистить рентген", // Menu option to remove X-ray effect from all objects
            "selectNone": "Очистить выбор", // Menu option to clear any currently selected objects
            "resetView": "Сбросить вид", // Menu option to reset the view to initial state
            "clearSlices": "Очистить сечения", // Menu option to delete all section planes created with the Slice tool
            "measurements": "Мера", // **** added
            "clearMeasurements": "Очистить измерение", // **** added
            "hideMeasurementAxisWires": "Скрыть ось измерения", // **** added
            "showMeasurementAxisWires": "Показать ось измерения", // **** added
            "disableMeasurementSnapping": "Отключить привязку", // **** added
            "enableMeasurementSnapping": "Включить привязку" // **** added
        },
        "modelsContextMenu": {
            // Context menu that appears when we right-click on a model in the "Models" tab
            "loadModel": "Загрузить",
            "unloadModel": "Выгрузить",
            "editModel": "Редактировать",
            "deleteModel": "Удалить",
            "loadAllModels": "Загрузить все",
            "unloadAllModels": "Выгрузить все",
            "clearSlices": "Очистить сечения",
            "measurements": "Мера", // **** added
            "clearMeasurements": "Очистить измерение", // **** added
            "hideMeasurementAxisWires": "Скрыть ось измерения", // **** added
            "showMeasurementAxisWires": "Показать ось измерения", // **** added
            "disableMeasurementSnapping": "Отключить привязку", // **** added
            "enableMeasurementSnapping": "Включить привязку" // **** added
        },
        "objectContextMenu": {
            // Context menu that appears when we right-click on an object in the 3D view
            "inspectProperties": "Осмотреть свойства", //menu option to inspect properties in the properties inspector
            "viewFit": "Показать весь объект", // Menu option to position the camera to fit the object in view
            "viewFitSelection": "Посмотреть Fit Выбрано", // **** added
            "viewFitAll": "Показать все объекты", // Menu option to position the camera to fit all objects in view
            "showInTree": "Показать в навигаторе", // Menu option to show the object in the Objects tab"s tree
            "hide": "Скрыть", // Menu option to hide this object
            "hideOthers": "Скрыть другие", // Menu option to hide other objects
            "hideAll": "Скрыть все", // Menu option to hide all objects
            "showAll": "Показать все", // Menu option to show all objects
            "xray": "Рентген", // Menu option to X-ray this object
            "xrayOthers": "Рентген остальные", // Menu option to undo X-ray on all other objects
            "xrayAll": "Рентген все", // Menu option to X-ray all objects
            "xrayNone": "Очистить рентген", // Menu option to remove X-ray effect from all objects
            "select": "Выбрать", // Menu option to select this object
            "undoSelect": "Отменить выбор", // Menu option to deselect this object
            "selectNone": "Очистить выбор", // Menu option to deselect all objects
            "clearSlices": "Очистить сечения", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Мера", // **** added
            "clearMeasurements": "Очистить измерение", // **** added
            "hideMeasurementAxisWires": "Скрыть ось измерения", // **** added
            "showMeasurementAxisWires": "Показать ось измерения", // **** added
            "disableMeasurementSnapping": "Отключить привязку", // **** added
            "enableMeasurementSnapping": "Включить привязку" // **** added
        },
        "treeViewContextMenu": {
            // Context menu that appears when we right-click an object node in the tree within in the "Objects" tab
            "inspectProperties": "Осмотреть свойства", //menu option to inspect properties in the properties inspector
            "viewFit": "Показать весь объект", // Menu option to position the camera to fit the object in view
            "viewFitSelection": "Посмотреть Fit Выбрано", // **** added
            "viewFitAll": "Показать все объекты", // Menu option to position the camera to fit all objects in view
            "isolate": "Изолировать", // Menu option to hide all other objects and fit this object in view
            "hide": "Скрыть", // Menu option to hide this object
            "hideOthers": "Скрыть другие", // Menu option to hide other objects
            "hideAll": "Скрыть все", // Menu option to hide all objects
            "show": "Показать", // Menu option to show this object
            "showOthers": "Показать остальные", // Menu option to hide this object and show all others
            "showAll": "Показать все", // Menu option to show all objects
            "xray": "Рентген", // Menu option to X-ray this object
            "undoXray": "Отменить рентген", // Menu option to undo X-ray on this object
            "xrayOthers": "Рентген остальные", // Menu option to undo X-ray on all other objects
            "xrayAll": "Ренген все", // Menu option to X-ray all objects
            "xrayNone": "Очистить рентген", // Menu option to remove X-ray effect from all objects
            "select": "Выбрать", // Menu option to select this object
            "undoSelect": "Отменить выбор", // Menu option to deselect this object
            "selectNone": "Очистить выбор", // Menu option to deselect all objects
            "clearSlices": "Очистить сечения", // Menu option to delete all slices made with the Slicing tool
            "measurements": "Мера", // **** added
            "clearMeasurements": "Очистить измерение", // **** added
            "hideMeasurementAxisWires": "Скрыть ось измерения", // **** added
            "showMeasurementAxisWires": "Показать ось измерения", // **** added
            "disableMeasurementSnapping": "Отключить привязку", // **** added
            "enableMeasurementSnapping": "Включить привязку" // **** added
        },
        "sectionToolContextMenu": {
            // Context menu that appears when we right-click an the Slicing tool
            "slice": "Сечение", // Title of submenu for each slice, eg. "Slice #0, Slice #1" etc
            "clearSlices": "Очистить сечения", // Menu option to delete all slices
            "flipSlices": "Развернуть сечения", // Menu option to reverse the cutting direction of all slices
            "edit": "Редактировать", // Sub-menu option to edit a single slice
            "flip": "Развернуть", // Sub-menu option to reverse the cutting direction of a single slice
            "delete": "Удалить", // Sub-menu option to delete a single slice
        },

        "measureContextMenu": {
            "hideMeasurementAxisWires": "Скрыть ось измерения", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementAxisWires": "Показать ось измерения", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "hideMeasurementLabels": "Скрыть метки измерений", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementLabels": "Показать метки измерений", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "clearMeasurements": "Очистить измерение" // **** added & previous bug fixed in zeokit-bim-viewer.es.js
        }
    },

    // Chinese

    "ch": {
        "busyModal": { // The dialog that appears in the center of the canvas while we are loading a model
            "loading": "載入中"
        },
        "NavCube": { // The 3D navigation cube at the bottom right of the canvas
            "front": "前",
            "back": "後",
            "top": "上",
            "bottom": "下",
            "left": "左",
            "right": "右"
        },
        "modelsExplorer": { // The "Models" tab on the left of the canvas
            "title": "模組",
            "loadAll": "全部載入",
            "loadAllTip": "載入專案中的所有模組",
            "unloadAll": "全部卸載",
            "unloadAllTip": "卸載專案中的所有模組",
            "add": "加載",
            "addTip": "加載模組"
        },
        "objectsExplorer": { // The "Objects" tab on the left of the canvas
        "title": "物件",
        "showAll": "全部顯示",
        "showAllTip": "顯示所有物件",
        "hideAll": "全部隱藏",
        "hideAllTip": "隱藏所有物件"
        },
        "classesExplorer": { // The "Classes" tab on the left of the canvas
            "title": "類別",
            "showAll": "全部顯示",
            "showAllTip": "顯示所有類別",
            "hideAll": "全部隱藏",
            "hideAllTip": "隱藏所有類別"
        },
        "storeysExplorer": { // The "Storeys" tab on the left of the canvas
            "title": "樓層",
            "showAll": "全部顯示",
            "showAllTip": "顯示所有樓層",
            "hideAll": "全部隱藏",
            "hideAllTip": "隱藏所有樓層"
        },
        "propertiesInspector": { // The "Properties" tab on the right of the canvas
            "title": "屬性",
            "noObjectSelectedWarning": "未選擇物件進行檢查。右鍵點擊或長按物件並選擇「檢查屬性」以查看其屬性。",
            "noPropSetWarning": "未找到此物件的屬性集。"
        },
        "toolbar": { // The toolbar at the top of the canvas
            "toggleExplorer": "專案樹狀檢視器",
            "toggleProperties": "物件屬性查看",
            "resetViewTip": "重置視角",
            "toggle2d3dTip": "切換二維/三維視角",
            "togglePerspectiveTip": "切換透視/平行視圖",
            "viewFitTip": "全盤視角顯示",
            "firstPersonTip": "切換第一身漫遊模式",
            "hideObjectsTip": "隱藏物件",
            "selectObjectsTip": "選擇物件",
            "queryObjectsTip": "檢查物件",
            "sliceObjectsTip": "創建剖面",
            "slicesMenuTip": "剖面工具",
            "showSpacesTip": "顯示 IFCSpace 物件",
            "numSlicesTip": "現有剖面數量",
            "measureDistanceTip": "量度距離", // **** added
            "measureAngleTip": "量度角度", // **** added
            "marqueeSelectTip": "框選物件" // **** added
        },
        "canvasContextMenu": { // Context menu that appears when we right-click on empty canvas space
            "viewFitSelection": "選擇集視角顯示", // **** added
            "viewFitAll": "全盤視角顯示",
            "hideAll": "隱藏所有",
            "showAll": "顯示所有",
            "xRayAll": "全盤X光顯示",
            "xRayNone": "取消X光顯示",
            "selectNone": "取消所有選擇",
            "resetView": "重置視圖",
            "clearSlices": "取消剖面",
            "measurements": "量度", // **** added
            "clearMeasurements": "取消量度", // **** added
            "hideMeasurementAxisWires": "隱藏量度軸線", // **** added
            "showMeasurementAxisWires": "顯示量度軸線", // **** added
            "disableMeasurementSnapping": "不用邊角對準", // **** added
            "enableMeasurementSnapping": "選用邊角對準", // **** added
        },
        "modelsContextMenu": {
            "loadModel": "載入模型",
            "unloadModel": "模型卸載",
            "editModel": "編輯模型",
            "deleteModel": "刪除模型",
            "loadAllModels": "載入所有模型",
            "unloadAllModels": "卸載所有模型",
            "clearSlices": "取消剖面",
            "measurements": "量度", // **** added
            "clearMeasurements": "取消量度", // **** added
            "hideMeasurementAxisWires": "隱藏量度軸線", // **** added
            "showMeasurementAxisWires": "顯示量度軸線", // **** added
            "disableMeasurementSnapping": "不用邊角對準", // **** added
            "enableMeasurementSnapping": "選用邊角對準", // **** added
        },
        "objectContextMenu": {
            "inspectProperties": "檢查屬性",
            "viewFit": "物件視角顯示",
            "viewFitSelection": "選擇集視角顯示", // **** added
            "viewFitAll": "全盤物件視角顯示",
            "showInTree": "在樹狀檢視器中顯示",
            "hide": "隱藏",
            "hideOthers": "隱藏其他物件",
            "hideAll": "隱藏所有物件",
            "showAll": "顯示所有物件",
            "xray": "X光",
            "xrayOthers": "對其他物件進行X光",
            "xrayAll": "X光所有物件",
            "xrayNone": "取消所有X光",
            "select": "選擇",
            "undoSelect": "取消選擇",
            "selectNone": "取消全部選擇",
            "clearSlices": "取消剖面",
            "measurements": "量度", // **** added
            "clearMeasurements": "取消量度", // **** added
            "hideMeasurementAxisWires": "隱藏量度軸線", // **** added
            "showMeasurementAxisWires": "顯示量度軸線", // **** added
            "disableMeasurementSnapping": "不用邊角對準", // **** added
            "enableMeasurementSnapping": "選用邊角對準", // **** added
        },
        "treeViewContextMenu": {
            "inspectProperties": "檢查屬性",
            "viewFit": "集中視角顯示",
            "viewFitSelection": "選擇集視角顯示",  // **** added
            "viewFitAll": "全盤視角顯示",
            "isolate": "孤立",
            "hide": "隱藏",
            "hideOthers": "隱藏其他",
            "hideAll": "隱藏所有",
            "show": "顯示",
            "showOthers": "隱藏選項並顯示其他",
            "showAll": "顯示所有",
            "xray": "X光",
            "undoXray": "取消X光",
            "xrayOthers": "對其他物件進行X光",
            "xrayAll": "X光所有",
            "xrayNone": "取消所有X光",
            "select": "選擇",
            "undoSelect": "取消選擇",
            "selectNone": "取消全部選擇",
            "clearSlices": "取消剖面",
            "measurements": "量度", // **** added
            "clearMeasurements": "取消量度", // **** added
            "hideMeasurementAxisWires": "隱藏量度軸線", // **** added
            "showMeasurementAxisWires": "顯示量度軸線", // **** added
            "disableMeasurementSnapping": "不用邊角對準", // **** added
            "enableMeasurementSnapping": "選用邊角對準", // **** added
        },
        "sectionToolContextMenu": {
            "slice": "剖面",
            "clearSlices": "清除剖面",
            "flipSlices": "翻轉剖面",
            "edit": "編輯",
            "flip": "翻轉",
            "delete": "刪除"
        },

        "measureContextMenu": {
            "hideMeasurementAxisWires": "隱藏量度軸線", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementAxisWires": "顯示量度軸線", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "hideMeasurementLabels": "隱藏量度", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "showMeasurementLabels": "顯示量度", // **** added & previous bug fixed in zeokit-bim-viewer.es.js
            "clearMeasurements": "刪除量度" // **** added & previous bug fixed in zeokit-bim-viewer.es.js
        }
    }
};

export { messages };