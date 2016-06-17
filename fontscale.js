
var fontScale = new (function(){

    this.init = function(){
        this.elements = document.querySelectorAll("[fs-min-width], [fs-max-width], [fs]");

        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style.wordWrap = 'none';
        };
    }

    this.recalculate = function(){
        console.log("Recalculating...")
        for (var a = 0; a < this.elements.length; a++) {
            this.addWrapper(this.elements[a]);
            this.recalculateElement(this.elements[a].firstChild);
        };
    }

    this.recalculateElement = function(element){
        var eh = element.offsetHeight,
            ew = element.offsetWidth,
            ph = this.getNominalHeight(element),
            pw = this.getNominalWidth(element),
            height_ratio = Math.max(ph/eh, 0.01),
            width_ratio  = Math.max(pw/ew, 0.01);
        if (height_ratio < width_ratio) {
            this.scaleHeight(element, height_ratio);
        } else {
            this.scaleWidth(element, width_ratio);
        }
    }

    this.scaleHeight = function(element, ratio){
        element.style.fontSize = ratio*100 + "%";
    }

    this.scaleWidth = function(element, ratio){
        element.style.fontSize = ratio*100 + "%";
    }

    this.getNominalHeight = function(element){
        var ph = element.parentElement.offsetHeight,
            mh = element.parentElement.getAttribute('fs-max-height')/100 * ph || Infinity;

        return Math.min(ph, mh);
    }

    this.getNominalWidth = function(element){
        var pw = element.parentElement.offsetWidth,
            mw = element.parentElement.getAttribute('fs-max-width')/100 * pw || Infinity;

        return Math.min(pw, mw);
    }

    this.addWrapper = function (element){
        if (!element.firstChild.classList) {
            element.innerHTML = "<span class='fontscale'>" + element.innerHTML + "</span>";
        }
    }
});

document.addEventListener('DOMContentLoaded', function(e){
    fontScale.init();
    fontScale.recalculate();
});