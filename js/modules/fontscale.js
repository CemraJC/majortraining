
var fontScale = new (function(){

    this.maxSize = 350;

    this.init = function(){
        this.elements = document.querySelectorAll("[fs-min-width], [fs-max-width], [fs]");

        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style.wordWrap = 'none';
        };
        this.recalculate();
    }

    this.recalculate = function(){
        for (var a = 0; a < this.elements.length; a++) {
            this.addWrapper(this.elements[a]);
            this.recalculateElement(this.elements[a].firstChild);
        };
        console.info("Fontscale: Recalculated font size.")
    }

    this.recalculateElement = function(element){
        this.resetScale(element);
        var eh = element.offsetHeight,
            ew = element.offsetWidth,
            ph = this.getNominalHeight(element),
            pw = this.getNominalWidth(element),
            height_ratio = Math.max(eh/ph, 0.01),
            width_ratio  = Math.max(pw/ew, 0.01),
            fuzz_factor  = 0.5;
        this.scaleByRatio(element, width_ratio);
    }

    this.resetScale = function(element) {
        this.scaleByRatio(element, 1);
    }

    this.scaleByRatio = function(element, ratio){
        element.style.fontSize = Math.min(ratio * 100, this.maxSize) + "%";
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