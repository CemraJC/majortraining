var display=new function(){this.modify={},this.getContentProperty=function(element){return"INPUT"==element.nodeName?"value":"innerHTML"},this.replaceElementContent=function(element,content){element[this.getContentProperty(element)]=content},this.getElementContent=function(element){return step_downs=["SPAN","I","B"],element.firstChild&&step_downs.indexOf(element.firstChild.nodeName)>=0?element.firstChild[this.getContentProperty(element)]:element[this.getContentProperty(element)]},this.toggleAttribute=function(element,attribute){null!==element.getAttribute(attribute)?element.removeAttribute(attribute):element.setAttribute(attribute,"")},this.toggleDrawer=function(){this.toggleAttribute(elements.list.input.drawer,"checked"),setTimeout(function(){fontScale.recalculate()},325)},this.replaceOrGetContent=function(element,content){return void 0===content?this.getElementContent(element):(this.replaceElementContent(element,content),!0)},this.updateReadout=function(){var obj={current_level:save_file.get("current_level"),current_stage:save_file.get("current_stage"),current_score:save_file.get("current_score")};return obj.level=save_file.get("levels")["stage"+obj.current_stage][obj.current_level],this.modify.textReadoutScore(obj.current_score),this.modify.textReadoutHighscore(obj.level.highscore),this.modify.textReadoutLevel("Level "+obj.current_level),this.modify.textReadoutLevelinfo(obj.level.info),!0},this.counter=function(set){var read=set>=0?set:parseInt(elements.list.text.count.innerHTML)+1;read=read>=0?read:0,elements.list.text.count.innerHTML=read},this.toggleTheme=function(){var a=document.body.getAttribute("dark");0==a||void 0==a?document.body.setAttribute("dark",!0):document.body.removeAttribute("dark")},this.getReferenceItem=function(number){return ms_array[number].join(", ")||"?"},this.getMenuItem=function(stage_num,level_num){var s,obj=save_file.get("levels")["stage"+stage_num][level_num];return s=save_file.get("current_level")==level_num?"selected":"","<li "+s+" levelnum='"+level_num+"'><h4>Level "+level_num+"<span>"+obj.highscore+"</span></h4>\n<small>"+obj.info+'</small><span progression="'+obj.state()+'"></span></li>\n'},this.selectLevel=function(stage_num,level_num,override){var current_lvl=document.querySelector(".select#stage-select-"+stage_num+" li[selected]")||elements.list.text.select["stage"+stage_num].firstChild,next_lvl=document.querySelector(".select#stage-select-"+stage_num+' li[levelnum="'+level_num+'"]'),current_stage=document.querySelector("input[checked]#stage-tab-"+stage_num)||elements.list.text.select["stage"+stage_num].radio,next_stage=elements.list.text.select["stage"+stage_num].radio;return(current_stage!==next_stage&&next_stage||override)&&(current_stage.removeAttribute("checked"),next_stage.setAttribute("checked","")),(current_lvl!==next_lvl&&next_lvl||override)&&(current_lvl.removeAttribute("selected"),next_lvl.setAttribute("selected","")),!0},this.getLevelsList=function(stage_num){var obj=save_file.get("levels")["stage"+stage_num],list="";for(i in obj)list+=this.getMenuItem(stage_num,i);return list},this.getReferenceList=function(){for(var list="",i=0;i<=9;i++)list+="<tr><td>"+i+"</td> <td>"+this.getReferenceItem(i)+"</td></tr>";return list},this.setMenuTabs=function(){for(var a=elements.list.input.tabs,selected=save_file.get("tab_selected"),i=0;i<a.length;i++)a[i].value===selected&&a[i].setAttribute("checked","")},this.updateReferenceList=function(){this.modify.reference(this.getReferenceList())},this.updateLevelsLists=function(stage_nums){console.log("Updating",stage_nums);for(var i in stage_nums)this.modify["textSelectStage"+stage_nums[i]+"List"](this.getLevelsList(stage_nums[i]))},this.triggerElementGlow=function(element,color){return!!color&&(element.style.transition="none",element.style.boxShadow="0 0 0.5em "+color+" inset",setTimeout(function(){element.style.transition="all 2s"},20),setTimeout(function(){element.style.boxShadow=""},40),!0)},this.goodGlow=function(){this.triggerElementGlow(elements.list.input.main,"#3A8900")},this.badGlow=function(){this.triggerElementGlow(elements.list.input.main,"#B31500")},this.__generateSpecifics=function(obj,lvl,path){if(obj=obj||elements.list,lvl=lvl||1,path=path||"",lvl>10)return!1;for(i in obj){try{var valid=obj[i].nodeType}catch(e){console.error("Element selector problem:",i,e)}if(void 0!==valid){var index=path?titleCase(i):i;this.modify[path+index]=new Function("content","return this.replaceOrGetContent(this.modify."+path+index+"__element, content);").bind(this),this.modify[path+index+"__element"]=obj[i]}else this.__generateSpecifics(obj[i],lvl+1,lvl>1?path+titleCase(i):path+i)}},this.init=function(){this.__generateSpecifics(),save_file.get("dark_theme")&&this.toggleTheme(),save_file.get("drawer_open")&&this.toggleDrawer(),this.setMenuTabs(),this.updateLevelsLists([1,2]),this.updateReferenceList(),this.updateReadout(),this.selectLevel(save_file.get("current_stage"),save_file.get("current_level"),!0)}};
var elements=new function(){this.__s={mainsection:".maincolumn .main",tabmenu:{container:"#drawer-tabs .tab-container",levels:{container:"#drawer-tabs .tab-container .tab-panel.levelscolumn#tab-1 ",readout:"#drawer-tabs .tab-container .tab-panel.levelscolumn#tab-1 .readout",select:"#drawer-tabs .tab-container .tab-panel.levelscolumn#tab-1 .select",settings:"#drawer-tabs .tab-container .tab-panel#tab-1 .settings"},generator:{container:"#drawer-tabs .tab-container .tab-panel.generatorscolumn#tab-2 "},reference:{container:"#drawer-tabs .tab-container .tab-panel.referencecolumn#tab-3 "}}},this.list={text:{main:this.__s.mainsection+" p.generated",readout:{container:this.__s.tabmenu.levels.readout,score:this.__s.tabmenu.levels.readout+" .score",highscore:this.__s.tabmenu.levels.readout+" .highscore",level:this.__s.tabmenu.levels.readout+" .level",levelinfo:this.__s.tabmenu.levels.readout+" .levelinfo"},select:{stage1:{button:this.__s.tabmenu.levels.container+" .stagecolumn .stagebanner[for='stage-tab-1']",list:this.__s.tabmenu.levels.container+" .stagecolumn .select#stage-select-1 ul",radio:this.__s.tabmenu.levels.container+" .stagecolumn input#stage-tab-1"},stage2:{button:this.__s.tabmenu.levels.container+" .stagecolumn .stagebanner[for='stage-tab-2']",list:this.__s.tabmenu.levels.container+" .stagecolumn .select#stage-select-2 ul",radio:this.__s.tabmenu.levels.container+" .stagecolumn input#stage-tab-2"}},count:this.__s.mainsection+" .numbar span.count"},button:{skip:this.__s.mainsection+" .numbar a.skip",theme:this.__s.tabmenu.levels.settings+" input[name=theme]",reset:this.__s.tabmenu.levels.settings+" input[name=reset]"},input:{main:this.__s.mainsection+" input[name=main_input]",tabs:"#drawer input[type=radio][name='drawer-tabs']",tab_labels:"#drawer .tab-buttons",drawer:"input[type=checkbox]#drawer-toggle",local_dict:{filechooser:this.__s.tabmenu.generator.container+" input[type=file].submit_dict",messages:this.__s.tabmenu.generator.container+" p.submit_dict"},prompt_dict:{button:this.__s.tabmenu.generator.container+" button.prompt_dict",message:this.__s.tabmenu.generator.container+" p.prompt_dict"}},reference:this.__s.tabmenu.reference.container+" table tbody",generator:{container:this.__s.tabmenu.generator.container,word:this.__s.tabmenu.generator.container+" .inputs button#generate_word",nums:this.__s.tabmenu.generator.container+" .inputs button#generate_nums",input:{word:this.__s.tabmenu.generator.container+" .inputs input[type=text]",number:this.__s.tabmenu.generator.container+" .inputs input[type=number]"},output:{nums:this.__s.tabmenu.generator.container+" span.generated_nums",word:this.__s.tabmenu.generator.container+" span.generated_word"}}},this.init=function(obj,lvl){if(obj=obj||this.list,lvl=lvl||1,lvl>10)return!1;for(item in obj)if("string"==typeof obj[item]){var found=document.querySelectorAll(obj[item]);1===found.length&&(found=found[0]),obj[item]=found}else"object"==typeof obj[item]&&this.init(obj[item],lvl+1)}};
var fontScale=new function(){this.maxSize=350,this.init=function(){this.elements=document.querySelectorAll("[fs-min-width], [fs-max-width], [fs]");for(var i=0;i<this.elements.length;i++)this.elements[i].style.wordWrap="none";this.recalculate()},this.recalculate=function(){for(var a=0;a<this.elements.length;a++)this.addWrapper(this.elements[a]),this.recalculateElement(this.elements[a].firstChild);console.info("Fontscale: Recalculated font size.")},this.recalculateElement=function(element){this.resetScale(element);var eh=element.offsetHeight,ew=element.offsetWidth,ph=this.getNominalHeight(element),pw=this.getNominalWidth(element),height_ratio=Math.max(ph/eh,.01),width_ratio=Math.max(pw/ew,.01);width_ratio<height_ratio?this.scaleByRatio(element,width_ratio):this.scaleByRatio(element,height_ratio)},this.resetScale=function(element){this.scaleByRatio(element,1)},this.scaleByRatio=function(element,ratio){element.style.fontSize=Math.min(100*ratio,this.maxSize)+"%"},this.getNominalHeight=function(element){var ph=element.parentElement.offsetHeight,mh=element.parentElement.getAttribute("fs-max-height")/100*ph||1/0;return Math.min(ph,mh)},this.getNominalWidth=function(element){var pw=element.parentElement.offsetWidth,mw=element.parentElement.getAttribute("fs-max-width")/100*pw||1/0;return Math.min(pw,mw)},this.addWrapper=function(element){element.firstChild.classList||(element.innerHTML="<span class='fontscale'>"+element.innerHTML+"</span>")}};
var game=new function(){this.generate=function(){for(var generated=!1,limit=0;(!generated||generated==save_file.get("last_generated"))&&limit<50;)generated=2==save_file.get("current_stage")?this.generateWord():this.generateNum(),limit++;display.modify.textMain(generated),save_file.set("last_generated",generated),fontScale.recalculate()},this.generateWord=function(){return this.__generateWordFromFormat(save_file.get("levels")["stage"+save_file.get("current_stage")][save_file.get("current_level")].format)},this.__generateWordFromFormat=function(format){var index,random_word_index,generated_word,words=[],i=0;if(1==format)return WordGenerator.getLetterFromNum(this.__generateNumFromFormat(format));if(!WordGenerator.dictionaryLoaded)return WordGenerator.getWordsFromNum(0);for(;words.length<=0&&i<200;){index=this.__generateNumFromFormat(format).split(" ");for(var i=0;i<index.length;i++){var generated_word=WordGenerator.getWordsFromNum(index[i]);if(!generated_word){words=[];break}random_word_index=Math.round(Math.random()*(generated_word.length-1)),generated_word=generated_word[random_word_index],words.push(titleCase(generated_word))}i++}return words.join(" ")},this.checkWord=function(words,nums){nums=removeEmpty(nums.split(" ")),words=removeEmpty(words.split(" "));for(var i in words){var valid=!1;if(!nums[i]||!words[i])return!1;check_nums=this.explodePossibleNumToNums(this.possibleNumFromWord(words[i]));for(var n in check_nums)if(check_nums[n]==nums[i]){valid=!0;break}if(!valid)return!1}return!0},this.generateNum=function(){return this.__generateNumFromFormat(save_file.get("levels")["stage"+save_file.get("current_stage")][save_file.get("current_level")].format)},this.__generateNumFromFormat=function(format){format=format||"2-12";for(var groups=format.split("|"),result=[],i=0;i<groups.length;i++){var digit_range=groups[i].split("-");result[i]=this.__generateDigitGroup(digit_range)}return result.join(" ")},this.__generateDigitGroup=function(range){var single_digit,result="";range[1]||(range[1]=range[0]);for(var break_probability=1/(range[1]-range[0]+1),i=1;i<=range[1]&&(single_digit=Math.round(9*Math.random()),result+=single_digit,!(i>=range[0]&&Math.random()<=break_probability));i++);return result},this.checkNum=function(num,word){return num=stripSpaces(num),this.__matchPossibleNum(num,this.possibleNumFromWord(word))},this.possibleNumFromWord=function(word){for(var letters=this.__wordToLetters(word),possible_num=[],i=0;i<letters.length;i++)this.ms.valid.indexOf(letters[i])<0||possible_num.push(game.__letterToNums(letters[i]));return possible_num.length>0&&possible_num},this.explodePossibleNumToNums=function(possible_num){if(!possible_num)return!1;for(var explodedNums=[],max_index=0,i=0;i<possible_num.length;i++)max_index<possible_num[i].length&&(max_index=possible_num[i].length);return explodedNums=this.__recursiveSerialJoinArrays(possible_num),explodedNums[0]},this.__recursiveSerialJoinArrays=function(arrays,lvl){if(lvl=lvl||1,lvl>15||!arrays)return arrays;var reduced_arrays=arrays.slice(1);reduced_arrays[0]=this.__serialJoinArrays(arrays[0],arrays[1]);var next_array=this.__recursiveSerialJoinArrays(reduced_arrays,lvl+1);return next_array[0]?next_array:arrays},this.__serialJoinArrays=function(arr1,arr2){if(!arr1||!arr2)return!1;var result=[];for(var a in arr1)for(var b in arr2)result.push(arr1[a].toString()+arr2[b].toString());return result},this.__wordToLetters=function(word){if("string"!=typeof word)return!1;var exploded,index,letters=[];exploded=removeSuccessiveDuplicates(word.trim().toLowerCase().split(""));for(var i=0;i<exploded.length;i++)index=this.ms.multi.indexOf(exploded[i]+exploded[i+1]),index>=0?(letters.push(this.ms.multi[index]),i++):null!=exploded[i].match(/[a-z]+/i)&&letters.push(exploded[i]);return letters},this.__letterToNums=function(letter){nums=[];for(i in this.ms)i>=0&&this.ms[i].indexOf(letter)>=0&&nums.push(i);return nums},this.__matchPossibleNum=function(num,possible_num){if(exploded_num=num.split(""),exploded_num.length!=possible_num.length)return!1;for(var i=0;i<exploded_num.length;i++)if(possible_num[i].indexOf(exploded_num[i])<0)return!1;return!0},this.addTimestamp=function(){save_file.get("times").push(timestamp())},this.updateScore=function(){var obj={current_score:save_file.get("current_score"),current_stage:save_file.get("current_stage"),levels:save_file.get("levels"),times:save_file.get("times")},level_i=save_file.get("current_level");obj.current_score=this.__calculateScore(obj),obj.current_score>obj.levels["stage"+obj.current_stage][level_i].highscore&&(obj.levels["stage"+obj.current_stage][level_i].highscore=obj.current_score),save_file.set(obj)},this.__calculateScore=function(obj){var MAX_PAST=4,scaler=display.modify.textMain().length,timelen=obj.times.length,pastinterval=Math.max(Math.min(MAX_PAST,timelen),1),timediff=(obj.times[timelen-1]-obj.times[timelen-pastinterval])/1e3,wpm=Math.round(Math.min(Math.max(60/(timediff/pastinterval),1),300));return timelen>MAX_PAST&&(obj.times=obj.times.slice(-5)),pastinterval<=2?10:Math.max(Math.round(wpm*scaler),0)},this.init=function(){this.ms=ms_array,this.generate()}};
function reload(){window.location.reload()}function removeEmpty(array){for(var result=[],i=0;i<array.length;i++)array[i].length<=0||result.push(array[i]);return result}function stripSpaces(string){return string?string.replace(/\ +/g,""):null}function removeSuccessiveDuplicates(array){for(var result=[],i=0;i<array.length;i++)array[i-1]!=array[i]&&result.push(array[i]);return result}function timestamp(){return Math.floor(Date.now()/1)}function titleCase(string){return string?string[0].toUpperCase()+string.slice(1).toLowerCase():""}var ms_array={0:["s","c","z","x"],1:["d","t","th"],2:["n"],3:["m"],4:["r"],5:["l"],6:["ch","sh","j","g"],7:["c","g","ch","q","k","ng","ck"],8:["f","ph","v"],9:["b","p"],valid:["s","c","z","x","q","d","t","th","n","m","r","l","ch","ck","sh","ph","j","g","k","ng","f","v","b","p"],multi:["ch","ck","sh","th","ng","ph"]};Date.now||(Date.now=function(){return(new Date).getTime()});
var inputs=new function(){this.themeListener=function(){save_file.set("dark_theme",!save_file.get("dark_theme")),display.toggleTheme()},this.generateNums=function(e){var nums=game.explodePossibleNumToNums(game.possibleNumFromWord(display.modify.generatorInputWord())),tail=nums.length>3?"...":"",inputElement=elements.list.generator.input.word;return nums?(display.modify.generatorOutputNums(nums.splice(0,3).join(", ")+tail),inputElement.placeholder=inputElement.value,void display.modify.generatorInputWord("")):(inputElement.placeholder=inputElement.value,display.modify.generatorInputWord(""),!1)},this.generateNumsListener=function(e){13===e.keyCode&&this.generateNums()},this.generateWordListener=function(e){if("keyup"==e.type&&13===e.keyCode||"click"==e.type){var word=WordGenerator.getWord(display.modify.generatorInputNumber());display.modify.generatorOutputWord(word)}},this.tabsListener=function(e){var a=elements.list.input.tabs;setTimeout(function(){for(var i=0;i<a.length;i++)a[i].checked&&save_file.set("tab_selected",a[i].value)},50)},this.drawerListener=function(e){var state=elements.list.input.drawer.checked;state?save_file.set("drawer_open",!0):save_file.set("drawer_open",!1),setTimeout(function(){fontScale.recalculate()},325)},this.skipListener=function(e){game.generate()},this.resetListenerTouchEnd=function(e){return clearTimeout(resetTimeout),!1},this.resetListenerTouchStart=function(e){return resetTimeout=window.setTimeout(function(){save_file.reset(),WordGenerator.clearDictionaryFromLocalStorage(),reload()},3500),!1},this.resetListener=function(e){e.detail>=2&&(save_file.reset(),WordGenerator.clearDictionaryFromLocalStorage(),reload())},this.stageSelectListener=function(e){var clicked=this.reverseDomSearch(e.target,"LABEL"),next_stage=clicked.getAttribute("for").match(/\d$/)[0];save_file.get("current_stage")!==next_stage&&(save_file.set({current_stage:next_stage,current_level:0}),display.selectLevel(next_stage,0,!0),display.updateReadout(),display.updateLevelsLists(),display.counter(0),game.generate())},this.levelSelectListener=function(e){var clicked=this.reverseDomSearch(e.target,"LI"),new_level=clicked.getAttribute("levelnum");return!!clicked&&void(display.selectLevel(save_file.get("current_stage"),new_level)&&(save_file.set({current_score:0,current_level:new_level,times:[]}),display.modify.inputMain(""),display.counter(0),game.generate(),display.updateReadout(),fontScale.recalculate()))},this.reverseDomSearch=function(element,target_element_name){for(var target_element,i=0;i<3;i++){if(element.nodeName===target_element_name){target_element=element;break}element=element.parentElement}return!!element&&element},this.mainInputListener=function(e){if(13===e.keyCode){if(e.shiftKey)return game.generate(),!0;var check=display.replaceOrGetContent(elements.list.text.main.firstChild)||display.modify.textMain();1==save_file.get("current_stage")?game.checkNum(check,display.modify.inputMain())?(display.modify.inputMain(""),display.goodGlow(),display.counter(),game.generate(),game.addTimestamp(),game.updateScore(),display.updateReadout(),display.updateLevelsLists([1,2]),fontScale.recalculate()):display.badGlow():2==save_file.get("current_stage")&&(game.checkWord(check,display.modify.inputMain())?(display.modify.inputMain(""),display.goodGlow(),display.counter(),game.generate(),game.addTimestamp(),game.updateScore(),display.updateReadout(),display.updateLevelsLists([1,2]),fontScale.recalculate()):display.badGlow())}},this.init=function(){elements.list.button.theme.addEventListener("click",this.themeListener),elements.list.button.reset.addEventListener("click",this.resetListener),elements.list.button.skip.addEventListener("click",this.skipListener),elements.list.button.reset.addEventListener("touchstart",this.resetListenerTouchStart),elements.list.button.reset.addEventListener("touchend",this.resetListenerTouchEnd),elements.list.text.select.stage1.list.addEventListener("click",this.levelSelectListener.bind(this)),elements.list.text.select.stage2.list.addEventListener("click",this.levelSelectListener.bind(this)),elements.list.text.select.stage1.button.addEventListener("click",this.stageSelectListener.bind(this)),elements.list.text.select.stage2.button.addEventListener("click",this.stageSelectListener.bind(this)),elements.list.generator.word.addEventListener("click",this.generateWordListener),elements.list.generator.nums.addEventListener("click",this.generateNums),elements.list.generator.input.word.addEventListener("keyup",this.generateNumsListener.bind(this)),elements.list.generator.input.number.addEventListener("keyup",this.generateWordListener.bind(this)),elements.list.input.main.addEventListener("keyup",this.mainInputListener),elements.list.input.drawer.addEventListener("click",this.drawerListener),elements.list.input.tab_labels.addEventListener("click",this.tabsListener)}};
var DEBUGGING=!1,save_file=new function(){this.__appdata__={storage_key:"major_training_242e9989-ffa2-48b6-8f46-4b7dfc6c590a",current_stage:1,current_level:0,current_score:0,expert_scale:30,master_scale:50,drawer_open:!1,tab_selected:"1",last_generated:"",times:[timestamp()],dark_theme:!1,levels:{stage1:{0:{format:"1",info:"Practise with single numbers",highscore:0,pass:50},1:{format:"2",info:"2 digit numbers only",highscore:0,pass:50},2:{format:"3",info:"3 digit numbers only",highscore:0,pass:70},3:{format:"2-3",info:"2 and 3 digit numbers",highscore:0,pass:60},4:{format:"3|3",info:"2 groups of 3 digit numbers",highscore:0,pass:40},5:{format:"4",info:"4 digit numbers only",highscore:0,pass:30},6:{format:"2-4|2-4",info:"2 groups of 2-4 digit numbers",highscore:0,pass:30},7:{format:"2-3|2-3|2-3|2-3",info:"4 groups of 2-3 digit numbers",highscore:0,pass:20},8:{format:"4|3|3",info:"Phone numbers",highscore:0,pass:10},9:{format:"4|4|4|4",info:"Credit card numbers",highscore:0,pass:5},10:{format:"40",info:"40 digit mega numbers",highscore:0,pass:5}},stage2:{0:{format:"1",info:"Practise with single letters",highscore:0,pass:75},1:{format:"2-3",info:"1 word with 2 or 3 digits",highscore:0,pass:60},2:{format:"2-3|2-3",info:"2 words with 2 or 3 digits each",highscore:0,pass:30},3:{format:"2-5",info:"2 to 5 digits in one word",highscore:0,pass:15},4:{format:"2|3|4",info:"10 digits in 3 words",highscore:0,pass:15},5:{format:"4|4|4|4|4",info:"20 digits in 5 words",highscore:0,pass:10}}}},this.save=function(){console.log("Saving:",this.__appdata__),window.localStorage.setItem(this.__appdata__.storage_key,JSON.stringify(this.__appdata__))},this.load=function(){if(DEBUGGING)read=null;else var read=JSON.parse(window.localStorage.getItem(this.__appdata__.storage_key));"object"==typeof read&&null!==read?this.__appdata__=read:this.save()},this.get=function(key){return void 0!==this.__appdata__[key]&&this.__appdata__[key]},this.set=function(key,value){if("object"!=typeof key||value)this.__appdata__[key]=value;else for(i in key)this.__appdata__[i]=key[i];this.save()},this.reset=function(){window.localStorage.removeItem(this.__appdata__.storage_key)},this.init=function(){this.load();var a=this.__appdata__.levels;for(var stage in a)for(var i in a[stage])a[stage][i].state=function(){if(this.highscore>=this.pass+save_file.get("master_scale"))return 4;if(this.highscore>=this.pass+save_file.get("expert_scale"))return 3;if(this.highscore>=this.pass)return 2;switch(this.highscore){case 0:return 0;default:return 1}}}};
var WordGenerator=new function(){this.dictUrl="./dictionary/major_dictionary.txt",this.dictUuid="MajorTrainingDictionary-60b02baf-b5cf-4851-ad39-1644bd5dd5ec",this.dictionaryError=!1,this.dictionaryLoaded=!1,this.requestDictionary=function(){var localStorage_db=window.localStorage.getItem(this.dictUuid);try{localStorage_db?this.onDictionaryGet(JSON.parse(localStorage_db),"Loaded from localstorage! B)"):this.isOffline()?this.requestLocalFile():this.promptForDictionary()}catch(e){this.clearDictionaryFromLocalStorage()}},this.clearDictionaryFromLocalStorage=function(){window.localStorage.removeItem(this.dictUuid)},this.promptForDictionary=function(){this.getfileSize(this.dictUrl,function(size){size&&display.modify.inputPrompt_dictButton("Download ("+(size/1e6).toFixed(2)+" MB)")}),elements.list.input.prompt_dict.message.style.display="block",elements.list.input.prompt_dict.button.style.display="block",elements.list.input.prompt_dict.button.addEventListener("click",function(){try{WordGenerator.ajaxMakeRequest(WordGenerator.dictUrl,WordGenerator.onDictionaryGet,WordGenerator.onDictionaryError),elements.list.input.prompt_dict.button.style.display="none",display.modify.inputPrompt_dictMessage("<b>Loading</b> <span class='spinner'></span> (Expect freezing for about 30sec)")}catch(e){console.log(e)}})},this.getfileSize=function(url,callback){var xhr=new XMLHttpRequest;xhr.open("HEAD",url),xhr.addEventListener("readystatechange",function(){if(xhr.readyState===XMLHttpRequest.DONE){if(200!==this.status)return!1;callback(xhr.getResponseHeader("Content-Length"))}}),xhr.send()},this.ajaxMakeRequest=function(url,success,failure){var xhr=new XMLHttpRequest;if(xhr.open("GET",url),4===xhr.readyState&&""===xhr.response)return failure.call(xhr.superclass,"AJAX request could not be made (probably because offline?)"),!1;var superclass=this;xhr.addEventListener("readystatechange",function(){if(this.readyState===XMLHttpRequest.DONE)return 200===this.status?success.call(superclass,superclass.dictionaryToDatabase(this.response),"Had to get it from server :/")||!0:failure.call(superclass,this)||!1}),xhr.send()},this.requestLocalFile=function(){elements.list.input.local_dict.filechooser.style.display="block",elements.list.input.local_dict.messages.style.display="block",elements.list.input.local_dict.filechooser.superclass=this,elements.list.input.local_dict.filechooser.addEventListener("change",this.readLocalFile)},this.readLocalFile=function(e){if(!e)return!1;e.preventDefault(),e.stopPropagation();var file=e.target.files[0]||null;if(!file)return!1;var reader=new FileReader,superclass=this.superclass;reader.onload=function(evt){try{superclass.onDictionaryGet(superclass.dictionaryToDatabase(reader.result),"Loaded from local file! \\(^.^)/"),display.modify.inputLocal_dictMessages("Thank you! (^.^)"),elements.list.input.local_dict.filechooser.style.display="none"}catch(err){superclass.onDictionaryError("Could not parse local file as JSON")}},reader.readAsText(file)},this.isOffline=function(){return window.location.href.indexOf("file:///")>=0||!1},this.onDictionaryGet=function(dict,msg){msg=msg||"";try{if(this.db=dict,"object"!=typeof this.db)throw Error("Generator dictionary not retreived as object");window.localStorage.setItem(this.dictUuid,JSON.stringify(this.db)),console.info("Generator dictionary is up and running!",msg),this.dictionaryLoaded=!0,elements.list.input.prompt_dict.button.style.display="none",elements.list.input.prompt_dict.message.style.display="none"}catch(e){this.onDictionaryError(e)}},this.onDictionaryError=function(msg){msg=msg||"",this.dictionaryError=!0,console.warn("WordGenerator: Sorry, the generator is broken :/\n",msg),display.modify.inputPrompt_dictMessage("<b>This is embarrassing...</b><br>The dictionary didn't load properly :/. If this happens again, you should definitely <a href='https://github.com/cemrajc/majortraining/issues'>file a bug report</a>.")},this.dictionaryToDatabase=function(dict){var words=dict.split("\n"),db={};for(var i in words)if(this.matchesDictionaryFilter(words[i])){var indices=game.explodePossibleNumToNums(game.possibleNumFromWord(words[i]));for(var index in indices)db[indices[index]]||(db[indices[index]]=[]),db[indices[index]].push(words[i])}return db},this.matchesDictionaryFilter=function(word){return/^[a-z]+$/i.test(word)},this.getWordsFromNum=function(num){return num=parseInt(num),this.dictionaryLoaded?!!this.db[num]&&this.db[num]:"Need dictionary! (Go to the generator tab)"},this.getWordFromNum=function(num){if(this.dictionaryLoaded&&this.db[num]){var working_set=this.db[num],random_index=Math.round(Math.random()*(working_set.length-1));return titleCase(working_set[random_index])||"<i>Error occurred :(</i>"}return this.dictionaryError?"<i>Sorry, it's broken :(</i>":this.dictionaryLoaded?"<i>No word found</i>":"<i>Waiting for dictionary</i>"},this.getWord=this.getWordFromNum,this.getLetterFromNum=function(num){return avail=ms_array.valid.length,choice=Math.floor(Math.random()*avail),ms_array.valid[choice]},this.init=function(){this.requestDictionary()}};
//# sourceMappingURL=main.js.map
