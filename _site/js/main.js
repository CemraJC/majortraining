function reload(){window.location.reload()}function removeSuccessiveDuplicates(array){for(var result=[],i=0;i<array.length;i++)array[i-1]!=array[i]&&result.push(array[i]);return result}function timestamp(){return Math.floor(Date.now()/1)}function titleCase(string){return string?string[0].toUpperCase()+string.slice(1).toLowerCase():""}var display=new function(){this.modify={},this.modify.superclass=this,this.getContentProperty=function(element){return"INPUT"==element.nodeName?"value":"innerHTML"},this.replaceElementContent=function(element,content){element[this.getContentProperty(element)]=content},this.getElementContent=function(element){return element[this.getContentProperty(element)]},this.toggleAttribute=function(element,attribute){null!==element.getAttribute(attribute)?element.removeAttribute(attribute):element.setAttribute(attribute,"")},this.replaceOrGetContent=function(element,content){return void 0===content?this.getElementContent(element):(this.replaceElementContent(element,content),!0)},this.updateReadout=function(){var obj={current_level:save_file.get("current_level"),current_score:save_file.get("current_score")};return obj.level=save_file.get("levels")[obj.current_level],this.modify.textReadoutScore(obj.current_score),this.modify.textReadoutHighscore(obj.level.highscore),this.modify.textReadoutLevel("Level "+obj.current_level),this.modify.textReadoutLevelinfo(obj.level.info),!0},this.counter=function(){var read=parseInt(elements.list.text.count.innerHTML)||0;elements.list.text.count.innerHTML=read+1},this.toggleTheme=function(){var a=document.body.getAttribute("dark");0==a||void 0==a?document.body.setAttribute("dark",!0):document.body.removeAttribute("dark")},this.toggleAssistant=function(){this.toggleAttribute(elements.list.assistant.container,"hidden")},this.getReferenceItem=function(number){return ms_array[number].join(", ")||"?"},this.getMenuItem=function(level_num){var s,obj=save_file.get("levels")[level_num];return s=save_file.get("current_level")==level_num?"selected":"","<li "+s+" levelnum='"+level_num+"'><h4>Level "+level_num+"<span>"+obj.highscore+"</span></h4>\n<small>"+obj.info+'</small><span progression="'+obj.state()+'"></span></li>\n'},this.selectMenuItem=function(level_num,override){var current=document.querySelector("li[selected]")||elements.list.text.select.firstChild,next=document.querySelector('li[levelnum="'+level_num+'"]');return current!=next&&next||override?(current.removeAttribute("selected"),next.setAttribute("selected",""),!0):!1},this.getMenuList=function(){var obj=save_file.get("levels"),list="";for(i in obj)list+=this.getMenuItem(i);return list},this.getReferenceList=function(){for(var list="",i=0;9>=i;i++)list+="<tr><td>"+i+"</td> <td>"+this.getReferenceItem(i)+"</td></tr>";return list},this.updateReferenceList=function(){this.modify.assistantReference(this.getReferenceList())},this.updateMenuList=function(){this.modify.textSelect(this.getMenuList())},this.triggerElementGlow=function(element,color){return color?(element.style.transition="none",element.style.boxShadow="0 0 0.5em "+color+" inset",setTimeout(function(){element.style.transition="all 2s"},20),setTimeout(function(){element.style.boxShadow=""},40),!0):!1},this.goodGlow=function(){this.triggerElementGlow(elements.list.input.main,"#3A8900")},this.badGlow=function(){this.triggerElementGlow(elements.list.input.main,"#B31500")},this.__generateSpecifics=function(obj,lvl,path){if(obj=obj||elements.list,lvl=lvl||1,path=path||"",lvl>10)return!1;for(i in obj){try{var valid=obj[i].nodeType}catch(e){console.error("Element selector problem:",i,e)}void 0!==valid?(this.modify[path+titleCase(i)]=new Function("content","return this.superclass.replaceOrGetContent(this."+path+titleCase(i)+"__element, content);"),this.modify[path+titleCase(i)+"__element"]=obj[i]):this.__generateSpecifics(obj[i],lvl+1,lvl>1?path+titleCase(i):path+i)}},this.init=function(){this.__generateSpecifics(),save_file.get("dark_theme")&&this.toggleTheme(),save_file.get("assistant_open")&&this.toggleAssistant(),this.updateMenuList(),this.updateReferenceList(),this.updateReadout(),this.selectMenuItem(save_file.get("current_level"),!0)}},elements=new function(){this.__s={mainsection:".maincolumn main",menusection:".menucolumn",assistsection:".assistantcolumn",readout:".menucolumn .readout",select:".menucolumn .select",settings:".menucolumn .settings"},this.list={text:{main:this.__s.mainsection+" p.generated",readout:{container:this.__s.readout,score:this.__s.readout+" .score",highscore:this.__s.readout+" .highscore",level:this.__s.readout+" .level",levelinfo:this.__s.readout+" .levelinfo"},select:this.__s.menusection+" .select ul",count:this.__s.mainsection+" .numbar span.count"},button:{skip:this.__s.mainsection+" .numbar a.skip",theme:this.__s.settings+" input[name=theme]",reset:this.__s.settings+" input[name=reset]"},input:{main:this.__s.mainsection+" input[name=main_input]",localdb:{filechooser:this.__s.assistsection+" input[type=file].submit_db",messages:this.__s.assistsection+" p.submit_db"}},assistant:{container:this.__s.assistsection,panel:this.__s.assistsection+" .panel",toggler:this.__s.assistsection+" .button",reference:this.__s.assistsection+" .panel table tbody",generator:{word:this.__s.assistsection+" .inputs button",number:this.__s.assistsection+" .inputs input[type=number]",output:this.__s.assistsection+" span.generated_word"}}},this.init=function(obj,lvl){if(obj=obj||this.list,lvl=lvl||1,lvl>10)return!1;for(item in obj)"string"==typeof obj[item]?obj[item]=document.querySelector(obj[item]):"object"==typeof obj[item]&&this.init(obj[item],lvl+1)}},fontScale=new function(){this.init=function(){this.elements=document.querySelectorAll("[fs-min-width], [fs-max-width], [fs]");for(var i=0;i<this.elements.length;i++)this.elements[i].style.wordWrap="none";this.recalculate()},this.recalculate=function(){for(var a=0;a<this.elements.length;a++)this.addWrapper(this.elements[a]),this.recalculateElement(this.elements[a].firstChild);console.info("Fontscale: Recalculated font size.")},this.recalculateElement=function(element){var eh=element.offsetHeight,ew=element.offsetWidth,ph=this.getNominalHeight(element),pw=this.getNominalWidth(element),height_ratio=Math.max(ph/eh,.01),width_ratio=Math.max(pw/ew,.01);width_ratio>height_ratio?this.scaleHeight(element,height_ratio):this.scaleWidth(element,width_ratio)},this.scaleHeight=function(element,ratio){element.style.fontSize=100*ratio+"%"},this.scaleWidth=function(element,ratio){element.style.fontSize=100*ratio+"%"},this.getNominalHeight=function(element){var ph=element.parentElement.offsetHeight,mh=element.parentElement.getAttribute("fs-max-height")/100*ph||1/0;return Math.min(ph,mh)},this.getNominalWidth=function(element){var pw=element.parentElement.offsetWidth,mw=element.parentElement.getAttribute("fs-max-width")/100*pw||1/0;return Math.min(pw,mw)},this.addWrapper=function(element){element.firstChild.classList||(element.innerHTML="<span class='fontscale'>"+element.innerHTML+"</span>")}},game=new function(){this.generateWord="bung",this.generateNum=function(){display.modify.textMain(this.__generateNumFromFormat(save_file.get("levels")[save_file.get("current_level")].format))},this.__generateNumFromFormat=function(format){format=format||"2-12";for(var groups=format.split("|"),result=[],i=0;i<groups.length;i++){var digit_range=groups[i].split("-");result[i]=this.__generateDigitGroup(digit_range)}return result.join(" ")},this.__generateDigitGroup=function(range){var single_digit,result="";range[1]||(range[1]=range[0]);for(var break_probability=1/(range[1]-range[0]+1),i=1;i<=range[1]&&(single_digit=Math.round(9*Math.random()),result+=single_digit,!(i>=range[0]&&Math.random()<=break_probability));i++);return result},this.checkNum=function(num,word){letters=this.__wordToLetters(word);for(var possible_num=[],i=0;i<letters.length;i++)this.ms.valid.indexOf(letters[i])<0||possible_num.push(game.__letterToNums(letters[i]));return this.__matchPossibleNum(num,possible_num)},this.__wordToLetters=function(word){exploded=removeSuccessiveDuplicates(word.trim().toLowerCase().split(""));for(var index,letters=[],i=0;i<exploded.length;i++)index=this.ms.multi.indexOf(exploded[i]+exploded[i+1]),index>=0?(letters.push(this.ms.multi[index]),i++):letters.push(exploded[i]);return letters},this.__letterToNums=function(letter){nums=[];for(i in this.ms)i>=0&&this.ms[i].indexOf(letter)>=0&&nums.push(i);return nums},this.__matchPossibleNum=function(num,possible_num){if(exploded_num=num.split(""),exploded_num.length!=possible_num.length)return!1;for(var i=0;i<exploded_num.length;i++)if(possible_num[i].indexOf(exploded_num[i])<0)return!1;return!0},this.addTimestamp=function(){save_file.get("times").push(timestamp())},this.updateScore=function(){var obj={current_score:save_file.get("current_score"),levels:save_file.get("levels"),times:save_file.get("times")},level_i=save_file.get("current_level");obj.current_score=this.__calculateScore(obj),obj.current_score>obj.levels[level_i].highscore&&(obj.levels[level_i].highscore=obj.current_score),save_file.set(obj)},this.__calculateScore=function(obj){var MAX_PAST=4,scaler=display.modify.textMain().length,timelen=obj.times.length,pastinterval=Math.max(Math.min(MAX_PAST,timelen),1),timediff=(obj.times[timelen-1]-obj.times[timelen-pastinterval])/1e3,wpm=Math.round(Math.min(Math.max(60/(timediff/pastinterval),1),300));return timelen>MAX_PAST&&(obj.times=obj.times.slice(-5)),2>=pastinterval?10:Math.max(Math.round(wpm*scaler),0)},this.init=function(){this.ms=ms_array,this.generateNum()}},ms_array={0:["s","c","z","x"],1:["d","t","th"],2:["n"],3:["m"],4:["r"],5:["l"],6:["ch","sh","j","g"],7:["c","g","ch","q","k","ng","ck"],8:["f","ph","v"],9:["b","p"],valid:["s","c","z","x","q","d","t","th","n","m","r","l","ch","ck","sh","ph","j","g","k","ng","f","v","b","p"],multi:["ch","ck","sh","th","ng","ph"]};Date.now||(Date.now=function(){return(new Date).getTime()});var inputs=new function(){this.themeListener=function(){save_file.set("dark_theme",!save_file.get("dark_theme")),display.toggleTheme()},this.assistantListener=function(e){display.toggleAssistant()},this.assistantGeneratorListener=function(e){var word=WordGenerator.getWord(display.modify.assistantGeneratorNumber());display.modify.assistantGeneratorOutput(word)},this.skipListener=function(e){game.generateNum()},this.resetListener=function(e){console.log(e),e.detail>=2&&(save_file.reset(),reload())},this.levelSelectListener=function(e){for(var clicked,target=e.target,i=0;3>i;i++){if("LI"==target.nodeName){clicked=target;break}target=target.parentElement}if(!clicked)return!1;var new_level=clicked.getAttribute("levelnum");display.selectMenuItem(new_level)&&(save_file.set({current_score:0,current_level:new_level}),save_file.set("times",[]),display.modify.inputMain(""),game.generateNum(),display.updateReadout(),fontScale.recalculate())},this.mainInputListener=function(e){if(console.log(e),13==e.keyCode){var check=display.replaceOrGetContent(elements.list.text.main.firstChild)||display.modify.textMain();game.checkNum(check,display.modify.inputMain())?(display.modify.inputMain(""),display.goodGlow(),display.counter(),game.generateNum(),game.addTimestamp(),game.updateScore(),display.updateReadout(),display.updateMenuList(),fontScale.recalculate()):display.badGlow()}},this.init=function(){elements.list.button.theme.addEventListener("click",this.themeListener),elements.list.button.reset.addEventListener("click",this.resetListener),elements.list.button.skip.addEventListener("click",this.skipListener),elements.list.text.select.addEventListener("click",this.levelSelectListener),elements.list.input.main.addEventListener("keyup",this.mainInputListener),elements.list.assistant.toggler.addEventListener("click",this.assistantListener),elements.list.assistant.generator.word.addEventListener("click",this.assistantGeneratorListener)}},save_file=new function(){this.__appdata__={storage_key:"major_training_242e9989-ffa2-48b6-8f46-4b7dfc6c590a",current_stage:1,current_level:1,current_score:0,expert_scale:30,master_scale:50,assistant_open:!1,times:[timestamp()],dark_theme:!1,levels:{1:{format:"2",info:"2 digit numbers only",highscore:0,pass:75},2:{format:"3",info:"3 digit numbers only",highscore:0,pass:75},3:{format:"2-3",info:"2 and 3 digit numbers",highscore:0,pass:75},4:{format:"3|3",info:"2 groups of 3 digit numbers",highscore:0,pass:75},5:{format:"4",info:"4 digit numbers only",highscore:0,pass:75},6:{format:"2-4|2-4",info:"2 groups of 2-4 digit numbers",highscore:0,pass:75},7:{format:"2-3|2-3|2-3|2-3",info:"4 groups of 2-3 digit numbers",highscore:0,pass:75},8:{format:"4|3|3",info:"Phone numbers",highscore:0,pass:75},9:{format:"5|5|5|5|5",info:"Credit card numbers",highscore:0,pass:75},10:{format:"40",info:"40 digit mega numbers",highscore:0,pass:75}}},this.save=function(){console.log("Saving:",this.__appdata__),window.localStorage.setItem(this.__appdata__.storage_key,JSON.stringify(this.__appdata__))},this.load=function(){var read=JSON.parse(window.localStorage.getItem(this.__appdata__.storage_key));"object"==typeof read&&null!==read?this.__appdata__=read:this.save()},this.get=function(key){return void 0===this.__appdata__[key]?!1:this.__appdata__[key]},this.set=function(key,value){if("object"!=typeof key||value)this.__appdata__[key]=value;else for(i in key)this.__appdata__[i]=key[i];this.save()},this.reset=function(){window.localStorage.removeItem(this.__appdata__.storage_key)},this.init=function(){this.load();var a=this.__appdata__.levels;for(i in a)a[i].state=function(){if(this.highscore>=this.pass+save_file.get("master_scale"))return 4;if(this.highscore>=this.pass+save_file.get("expert_scale"))return 3;if(this.highscore>=this.pass)return 2;switch(this.highscore){case 0:return 0;default:return 1}}}},WordGenerator=new function(){this.dbUrl="./database/major_database.json",this.dbUuid="MajorTrainingDatabase-60b02baf-b5cf-4851-ad39-1644bd5dd5ec",this.databaseError=!1,this.databaseLoaded=!1,this.httpRequest=new XMLHttpRequest,this.requestDatabase=function(){var localStorage_db=window.localStorage.getItem(this.dbUuid);try{localStorage_db?this.onDatabaseGet(JSON.parse(localStorage_db),"Loaded from localstorage! B)"):this.isOffline()?this.requestLocalFile():this.ajaxMakeRequest(this.httpRequest,this.dbUrl,this.onDatabaseGet,this.onDatabaseError)}catch(e){window.localStorage.removeItem(this.dbUuid)}},this.ajaxMakeRequest=function(req,url,success,failure){return req.superclass=this,req.open("GET",url),req.send(),4===req.readyState&&""===req.response?(failure.call(req.superclass,"AJAX Request could not be made (probably because offline?)"),!1):void req.addEventListener("readystatechange",function(){return this.readyState===XMLHttpRequest.DONE?200===this.status?success.call(this.superclass,JSON.parse(this.response),"Had to get it from server :/")||!0:failure.call(this.superclass,this)||!1:void 0})},this.requestLocalFile=function(){elements.list.input.localdb.filechooser.style.display="block",elements.list.input.localdb.messages.style.display="block",elements.list.input.localdb.filechooser.superclass=this,elements.list.input.localdb.filechooser.addEventListener("change",this.readLocalFile)},this.readLocalFile=function(e){if(!e)return!1;e.preventDefault(),e.stopPropagation();var file=e.target.files[0]||null;if(!file)return!1;var reader=new FileReader;reader.superclass=this.superclass,reader.onload=function(evt){try{var db=JSON.parse(reader.result);this.superclass.onDatabaseGet(db,"Loaded from local file! \\(^.^)/"),display.modify.inputLocaldbMessages("Thank you! (^.^)"),elements.list.input.localdb.filechooser.style.display="none"}catch(err){display.modify.inputLocaldbMessages('<b>Sorry - I don\'t know that that is :(</b><br> Try again maybe? It should be the "major_database.json" file.'),this.superclass.onDatabaseError("Could not parse local file as JSON")}},reader.readAsText(file)},this.isOffline=function(){return window.location.href.indexOf("file:///")>=0||!1},this.onDatabaseGet=function(db,msg){msg=msg||"";try{if(this.db=db,"object"!=typeof this.db)throw Error("Generator database not retreived as object");window.localStorage.setItem(this.dbUuid,JSON.stringify(this.db)),console.info("Generator database is up and running!",msg),this.databaseLoaded=!0}catch(e){this.onDatabaseError(e)}},this.onDatabaseError=function(msg){msg=msg||"",this.databaseError=!0,console.warn("WordGenerator: Sorry, the generator is broken :/\n",msg)},this.getWordFromNum=function(num){if(this.databaseLoaded&&this.db[num]){var working_set=this.db[num],random_index=Math.round(Math.random()*(working_set.length-1));return titleCase(working_set[random_index])||"<i>Error occurred :(</i>"}return this.databaseError?"<i>Sorry, it's broken :(</i>":this.databaseLoaded?"<i>No word found</i>":"<i>Still loading database...</i>"},this.getWord=this.getWordFromNum,this.init=function(){this.requestDatabase()}};
//# sourceMappingURL=main.js.map
