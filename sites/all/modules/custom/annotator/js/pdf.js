// Generated by CoffeeScript 1.11.1
(function() {
  var $,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  $ = jQuery;

  Annotator.Plugin.PDF = (function(superClass) {
    extend(PDF, superClass);

    function PDF() {
      return PDF.__super__.constructor.apply(this, arguments);
    }

    PDF.prototype.ANNOTATION_LAYER_MARKUP = '<div class="pdf-annotation-layer" style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 1;"></div>';

    PDF.prototype.DRAG_THRESHOLD = 5;

    PDF.prototype.pluginInit = function() {
      if (!Annotator.supported()) {
        return;
      }
      return Drupal.PDFDocumentView.loaded.then((function(_this) {
        return function() {
          _this.annotationLayers = _this.createAnnotationLayers();
          return _this.listenForInteraction();
        };
      })(this));
    };

    PDF.prototype.createAnnotationLayers = function() {
      return Drupal.PDFDocumentView.pdfPages.map((function(_this) {
        return function(page) {
          var annotationLayer, t;
          t = document.createElement('div');
          t.innerHTML = _this.ANNOTATION_LAYER_MARKUP;
          return annotationLayer = page.div.appendChild(t.firstChild);
        };
      })(this));
    };

    PDF.prototype.listenForInteraction = function() {
      var dragging, mouseDown, mousedownCoordinates;
      mouseDown = false;
      dragging = false;
      mousedownCoordinates = null;
      return $(this.annotationLayers).on('mousedown mousemove mouseup', (function(_this) {
        return function(event) {
          var coordinates, page, rect;
          page = _this.annotationLayers.indexOf(event.target);
          rect = event.target.getBoundingClientRect();
          coordinates = {
            x: event.clientX - rect.x,
            y: event.clientY - rect.y
          };
          if (event.type === 'mousedown') {
            mouseDown = true;
            mousedownCoordinates = coordinates;
          }
          if (event.type === 'mouseup') {
            mouseDown = false;
            mousedownCoordinates = null;
            if (dragging) {
              dragging = false;
              _this.publish('pdf-dragend', {
                event: event,
                page: page,
                coordinates: coordinates
              });
            } else {
              _this.publish('pdf-click', {
                event: event,
                page: page,
                coordinates: coordinates
              });
            }
          }
          if (mouseDown && event.type === 'mousemove') {
            if (!dragging) {
              if (_this.checkDragThreshold(coordinates, mousedownCoordinates)) {
                dragging = true;
                return _this.publish('pdf-dragstart', {
                  event: event,
                  page: page,
                  coordinates: coordinates
                });
              }
            } else {
              return _this.publish('pdf-dragmove', {
                event: event,
                page: page,
                coordinates: coordinates
              });
            }
          }
        };
      })(this));
    };

    PDF.prototype.checkDragThreshold = function(current, down) {
      var x, y;
      x = current.x > down.x + this.DRAG_THRESHOLD || current.x < down.x - this.DRAG_THRESHOLD;
      y = current.y > down.y + this.DRAG_THRESHOLD || current.y < down.y - this.DRAG_THRESHOLD;
      return x || y;
    };

    return PDF;

  })(Annotator.Plugin);

}).call(this);