
var display = new (function() {
    // This will store the specific elements when generated on init
    this.modify = {};

    this.getContentProperty = function(element){
        if (element.nodeName == "INPUT") {
            return 'value'
        } else {
            return 'innerHTML'
        }
    }

    this.replaceElementContent = function(element, content) {
        element[this.getContentProperty(element)] = content;
    }

    this.getElementContent = function(element) {
        return element[this.getContentProperty(element)];
    }

    this.toggleAttribute = function(element, attribute) {
        if (element.getAttribute(attribute) !== null) {
            element.removeAttribute(attribute);
        } else {
            element.setAttribute(attribute, '');
        }
    }

    this.toggleDrawer = function() {
        this.toggleAttribute(elements.list.input.drawer, 'checked')
    }

    this.replaceOrGetContent = function(element, content) {
        if (content === undefined){
            return this.getElementContent(element);
        } else {
            this.replaceElementContent(element, content);
            return true;
        }
    }

    this.updateReadout = function(){
        var obj = {
            current_level: save_file.get('current_level'),
            current_stage: save_file.get('current_stage'),
            current_score: save_file.get('current_score')
        }
        obj.level = save_file.get('levels')[obj.current_level];

        this.modify.textReadoutScore(obj.current_score)
        this.modify.textReadoutHighscore( obj.level.highscore)
        this.modify.textReadoutLevel("Level " + obj.current_level)
        this.modify.textReadoutLevelinfo(obj.level.info)
        return true;
    }

    this.counter = function() {
        var read = parseInt(elements.list.text.count.innerHTML) || 0;
        elements.list.text.count.innerHTML = read + 1;
    }

    this.toggleTheme = function() {
        var a = document.body.getAttribute('dark');
        if(a == false || a == undefined){
            document.body.setAttribute('dark', true)
        } else {
            document.body.removeAttribute('dark');
        }
    }

    this.getReferenceItem = function(number) {
        return ms_array[number].join(", ") || "?";
    }

    this.getMenuItem = function(level_num) {
        var obj = save_file.get('levels')[level_num], s;
        if (save_file.get('current_level') == level_num){
            s = "selected";
        } else {
            s = "";
        }

        return "<li " + s + " levelnum='" + level_num + "'><h4>Level " + level_num + "<span>" + obj.highscore + "</span></h4>\n<small>" + obj.info + "</small><span progression=\"" + obj.state() + "\"></span></li>\n";
    }

    this.selectLevel = function(stage_num, level_num, override){
        var current = document.querySelector('.select#stage-select-' + stage_num + ' li[selected]') || elements.list.text.select["stage"+ stage_num].firstChild,
            next = document.querySelector('.select#stage-select-' + stage_num + ' li[levelnum="' + level_num + '"]');

        if ((current == next || !next) && !override) {
            return false
        } else {
            current.removeAttribute('selected');
            next.setAttribute('selected', '');
            return true
        };
    }

    this.getLevelsList = function() {
        var obj = save_file.get('levels'),
            list = "";

        for (i in obj) {
            list += this.getMenuItem(i);
        }
        return list
    }

    this.getReferenceList = function() {
        var list = "";
        for (var i = 0; i <= 9; i++) {
            list += "<tr><td>" + i + "</td> <td>" + this.getReferenceItem(i) + "</td></tr>";
        };
        return list;
    }

    this.setMenuTabs = function(){
        var a = elements.list.input.tabs,
            selected = save_file.get('tab_selected');
        for (var i = 0; i < a.length; i++) {
            if(a[i].value === selected){
                a[i].setAttribute('checked', '');
            }
        }
    }

    this.updateReferenceList = function() {
        this.modify.reference(this.getReferenceList());
    }

    this.updateLevelsList = function(stage_num) {
        this.modify["textSelectStage" + stage_num + "List"](this.getLevelsList());
    }


    /* Notification / Feedback system */
    this.triggerElementGlow = function(element, color){
        if (!color) { return false; }

        // Ultra Jank Animation of some properties

        element.style.transition = 'none';
        element.style.boxShadow = '0 0 0.5em ' + color + ' inset';
        setTimeout(function(){
            element.style.transition = "all 2s";
        }, 20);
        setTimeout(function(){
            element.style.boxShadow = '';
        }, 40);
        return true;
    }
    this.goodGlow = function(){
        this.triggerElementGlow(elements.list.input.main, "#3A8900");
    };
    this.badGlow = function(){
        this.triggerElementGlow(elements.list.input.main, "#B31500");
    };


    /* Element specifics are auto-generated on init */
    this.__generateSpecifics = function(obj, lvl, path) {
        obj = obj || elements.list;
        lvl = lvl || 1;
        path = path || "";
        if (lvl > 10) { return false; }

        for (i in obj) {
            try {
                var valid = obj[i].nodeType;
            } catch(e) {
                console.error("Element selector problem:", i, e);
            }
            if (valid !== undefined) {
                var index = (path) ? titleCase(i) : i;
                this.modify[path + index] = new Function('content', 'return this.replaceOrGetContent(this.modify.' + path + index + '__element, content);').bind(this);
                this.modify[path + index + "__element"] = obj[i];
            } else {
                this.__generateSpecifics(obj[i], lvl + 1, (lvl > 1) ? path + titleCase(i) : path + i);
            }
        }
    }



    this.init = function(){
        this.__generateSpecifics()
        if ( save_file.get('dark_theme') ) { this.toggleTheme() }
        if ( save_file.get('drawer_open') ) { this.toggleDrawer() }
        this.setMenuTabs();
        this.updateLevelsList(save_file.get('current_stage'));
        this.updateReferenceList();
        this.updateReadout();
        this.selectLevel(save_file.get('current_stage'), save_file.get('current_level'), true);
    }
})();