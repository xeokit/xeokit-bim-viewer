import {AnnotationsPlugin} from "../../lib/xeokit/plugins/AnnotationsPlugin/AnnotationsPlugin.js";
import {math} from "../../lib/xeokit/viewer/scene/math/math.js";
import {Controller} from "../Controller.js";

var countAnnotations = 0;

/**
 * @desc Manages annotations.
 *
 * Located at {@link Toolbar#annotate}.
 */
class AnnotateMode extends Controller {

    constructor(parent, cfg) {

        super(parent);

        this._element = document.getElementById(cfg.annotationsPanelId);

        this._annotationsPlugin = new AnnotationsPlugin(this.viewer, {
            container: document.getElementById(cfg.containerId),
            markerHTML: "<div class='annotation-marker' style='background-color: {{markerBGColor}};'>{{glyph}}</div>",
            labelHTML: "<div class='annotation-label' style='background-color: {{labelBGColor}};'><div class='annotation-title'>{{title}}</div><div class='annotation-desc'>{{description}}</div></div>",
            values: {
                markerBGColor: "red",
                labelBGColor: "red",
                glyph: "X",
                title: "Untitled",
                description: "No description"
            }
        });

        this._annotationsPlugin.on("markerClicked", (annotation) => {
            this._gotoAnnotation(annotation);
        });

        this.on("active", (active) => {

            if (active) {

                var entity = null;
                var worldPos = math.vec3();

                this._onHoverSurface = this.viewer.cameraControl.on("hoverSurface", (e) => {

                    if (entity) {
                        entity.highlighted = false;
                        entity = null;
                    }
                    entity = e.entity;
                    entity.highlighted = true;

                    worldPos.set(e.worldPos);
                });

                this._onHoverOff = this.viewer.cameraControl.on("hoverOff", (e) => {
                    if (entity) {
                        entity.highlighted = false;
                        entity = null;
                    }
                });

                this.viewer.scene.input.on("mouseup", () => {

                    if (entity) {

                        const annotationId = math.createUUID();
                        const camera = this.viewer.scene.camera;

                        this._annotationsPlugin.createAnnotation({
                            id: annotationId,
                            entity: entity,
                            worldPos: worldPos,
                            eye: camera.eye,
                            look: camera.look,
                            up: camera.up,
                            occludable: false,
                            markerShown: true,
                            labelShown: true,
                            values: {
                                glyph: "A",
                                title: "Annotation " + (++countAnnotations),
                                description: "This is my annotation."
                            }
                        });

                        this._repaint();

                        entity = null;
                    }
                });

            } else {

                this.viewer.cameraControl.off(this._onHoverSurface);
                this.viewer.cameraControl.off(this._onHoverOff);
                //  this.viewer.cameraControl.off(this._onPicked);
            }

        });
    }

    _gotoAnnotation(annotation) {
        if (this._prevAnnotationClicked) {
            this._prevAnnotationClicked.setLabelShown(false);
        }
        annotation.setLabelShown(true);
        this.viewer.cameraFlight.flyTo(annotation);
        this._prevAnnotationClicked = annotation;
    }

    clearAnnotations() {
        this._annotationsPlugin.clear();
        this._prevAnnotationClicked = null;
        this._repaint();
    }

    _repaint() {
        var h = '<table class="table table-bordered"><tbody>';
        for (var annotationId in this._annotationsPlugin.annotations) {
            const annotation = this._annotationsPlugin.annotations[annotationId];
            h += '<tr> <td><a id="' + annotation.id + '" href="">' + annotation.getValues().title + '</td> <td><button type="button"  id="' + annotation.id + '.delete" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></td> </tr>';
        }
        h += "</tbody></table>";
        const self = this;
        this._element.innerHTML = h;
        for (var annotationId in this._annotationsPlugin.annotations) {
            (function () {
                const annotation = self._annotationsPlugin.annotations[annotationId];
                $("#" + annotation.id).on('click', (event) => {
                    self._gotoAnnotation(annotation);
                    event.preventDefault();
                });
                $("#" + annotation.id + ".delete").on('click', (event) => {
                    annotation.destroy();
                    self._repaint();
                    event.preventDefault();
                });
            })();
        }
    }

    /** @private */
    destroy() {
        super.destroy();
        this._annotationsPlugin.destroy();
    }
}

export {AnnotateMode};