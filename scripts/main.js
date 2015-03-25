window.LeapSignature = window.LeapSignature || (function(Leap){
    'use strict';
    var signatures = [];

    var Signature = function(options) {
        options = options || {};
        this.element = options.element;
        this._createCanvas();
        this.prevCoords = null;
    };

    Signature.prototype._createCanvas = function() {
        var canvasEl = document.createElement('canvas');

        canvasEl.setAttribute('style', 'position:absolute;top:0;left:0;pointer-events:none;');
        this.element.appendChild(canvasEl);
        this.ctx = canvasEl.getContext('2d');
        this._setCanvasSize();
    };

    Signature.prototype._setCanvasSize = function() {
        this.ctx.canvas.width = this.element.clientWidth;
        this.ctx.canvas.height = this.element.clientHeight;  
    };

    Signature.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };

    Signature.prototype._processCoordinates = function(x, y) {
        var relativeCoords = this._getRelativeCoordinates(x, y);
        this._draw(relativeCoords);
    };

    Signature.prototype._getRelativeCoordinates = function(x, y) {
        return {
            x: this.ctx.canvas.width * x,
            y: this.ctx.canvas.height * (1 - y)
        };
    };

    Signature.prototype._draw = function(coords) {
        if (this.prevCoords) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'red';
            this.ctx.moveTo(this.prevCoords.x, this.prevCoords.y);
            this.ctx.lineTo(coords.x, coords.y);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        
        this.prevCoords = coords;
    };

    Leap.loop(function(frame) {
        var x,
            pointable,
            normPos;

        if (signatures.length) {
            if (frame.pointables.length) {
                pointable = frame.pointables[0];
                normPos = frame.interactionBox.normalizePoint(pointable.stabilizedTipPosition, true);

                for (x = 0; x < signatures.length; x++) {
                    signatures[x]._processCoordinates(normPos[0], normPos[1]);
                }
            }
        } 
    });

    return {
        init: function(element) {
            var instance = new Signature({
                element: element
            });

            signatures.push(instance);

            return instance;
        }
    };

})(Leap);
