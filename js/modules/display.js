
var display = new (function() {
    // This will store the specific elements when generated on init
    this.modify = {};
    this.modify.superclass = this; // Context fix :/

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

    this.selectMenuItem = function(level_num, override){
        // If these were separate, would have to pass them around in an object and probably save which one?? (maybe just init)
        var current = document.querySelector('li[selected]') || elements.list.text.select.firstChild,
            next = document.querySelector('li[levelnum="' + level_num + '"]');

        if ((current == next || !next) && !override) {
            return false
        } else {
            current.removeAttribute('selected');
            next.setAttribute('selected', '');
            return true
        };
    }

    this.getMenuList = function() {
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

    this.updateReferenceList = function() {
        this.modify.assistantReference(this.getReferenceList());
    }
    this.updateMenuList = function() {
        this.modify.textSelect(this.getMenuList());
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
                this.modify[path + titleCase(i)] = new Function('content', 'return this.superclass.replaceOrGetContent(this.' + path + titleCase(i) + '__element, content);');
                this.modify[path + titleCase(i) + "__element"] = obj[i];
            } else {
                this.__generateSpecifics(obj[i], lvl + 1, (lvl > 1) ? path + titleCase(i) : path + i);
            }
        }
    }



    this.init = function(){
        this.__generateSpecifics()
        if ( save_file.get('dark_theme') ) { this.toggleTheme() }
        if ( save_file.get('assistant_open') ) { this.toggleAssistant() }
        this.updateMenuList();
        this.updateReferenceList();
        this.updateReadout();
        this.selectMenuItem(save_file.get('current_level'), true);
    }
})();