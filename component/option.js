define("form/component/option", ["form/component", "form/tplutil"],
function(p, s, u) {
    s = p("form/component");
    var h = p("form/tplutil");
    window.Option = s.extend({
        initialize: function(e) {
            this.componentSetup = {
                componentKey: "Option",
                name: "选项",
                order: 0,
                index: 0,
                required: !1,
                selectionId: "",//选项id
                fieldId: "",
                defOption: !1,
                other: !1,
                objId: "",//图文选择题的图片id
                parent: "",
                children: [],
                errorContent:"",
                isError:!1,
                filePath:"",
                scoreValue:"",
                questionAnswers: [],
                quoteQuestionId: "",
                quoteOptionId: "",
                satisfactionLevel:"",//满意度级别(可自定义)
                educationIds:"",
                selfId: "",//前端操作自用id,用于处理逻辑
                jumpId: "" //逻辑跳转的题目id
            };
            null != e && (this.componentSetup.name = e.name, this.componentSetup.order = e.order, this.componentSetup.index = e.index, this.componentSetup.required = e.required, this.componentSetup.selectionId = e.selectionId, this.componentSetup.defOption = e.defOption, this.componentSetup.other = e.other, this.componentSetup.objId = e.objId, this.componentSetup.parent = e.parent, this.componentSetup.children = e.children, this.componentSetup.fieldId = e.fieldId,this.componentSetup.errorContent = e.errorContent,this.componentSetup.isError = e.isError,this.componentSetup.filePath=e.filePath,this.componentSetup.scoreValue=e.scoreValue, this.componentSetup.questionAnswers=e.questionAnswers, this.componentSetup.satisfactionLevel = e.satisfactionLevel, this.componentSetup.quoteOptionId = e.quoteOptionId, this.componentSetup.quoteQuestionId = e.quoteQuestionId, this.componentSetup.educationIds = e.educationIds, this.componentSetup.selfId = e.selfId || this.cid, this.componentSetup.jumpId = e.jumpId);
            this.tpl = h.get("option");
        },
        setName: function(e) {
            this.componentSetup.name = e;
        },
        setOrder: function(e) {
            this.componentSetup.order = e;
        },
        setRequired: function(e) {
            this.componentSetup.required = e;
        },
        setOther: function(e) {
            this.componentSetup.other = e;
        },
        setObjId: function(e) {
            this.componentSetup.objId = e;
        },
        setFilePath: function(e) {
            this.componentSetup.filePath = e;
        },
        setScoreValue:function(e) {
        	this.componentSetup.scoreValue = e;
        },
        setSatisfactionLevel:function(e) {
            this.componentSetup.satisfactionLevel = e;
        },
        setChildren: function(e) {
            this.componentSetup.children = e;
        },
        setErrorContent: function(e) {
            this.componentSetup.errorContent = e;
        },
        setIsError: function(e) {
            this.componentSetup.isError = e;
        },
        setSelfId: function(e) {
            this.componentSetup.selfId = e;
        },
        setEducationIds: function(e) {
            this.componentSetup.educationIds = e;
        },
        setJumpId: function(e) {
            this.componentSetup.jumpId = e;
        },
        render: function(e, d) {
            var c = $(this.tpl).siblings("#form_option");
            c = c.find("." + d.componentSetup.componentKey + "_js").clone();
            c.find("input").attr("name", d.cid);
            c.find("span").text(this.componentSetup.name);
            "true" != this.componentSetup.other && 1 != this.componentSetup.other || c.append('<input type="text" class="text_control input_otherchoice" disabled="disabled"/>');
            if("ImageRadioBox" == d.componentSetup.componentKey || "ImageCheckBox" == d.componentSetup.componentKey){
            	c.find("img").attr("src", this.componentSetup.filePath);
                c.find("img").attr("imageid", this.componentSetup.objId);
            }else if("MatrixRaty" == d.componentSetup.componentKey){
            	c.html("<span></span>");
        		for(var i=0;i<this.componentSetup.children.length;i++){
        			c.append("<img src='/hug_interview/resources/images/raty_star_unchecked.png' value='"+(i+1)+"'>");
        		}
        		c.find("span").text(this.componentSetup.name);
            }else if("Select" == d.componentSetup.componentKey){
            	c="<option value="+this.cid+">"+this.componentSetup.name+"</option>";//解决IE8兼容问题
            }else if("MultipleTextArea" == d.componentSetup.componentKey){
            	c.find(".text_control").addClass(d.componentSetup.size);
            	c.find(".text_control").attr("disabled","disabled");
            }
            e.find(".no_option_js").remove();
            e.append(c);
        },
        renderEditor: function(e, d, c, k) {
            var f = $(this.tpl).siblings("#editor_option");
            var b = d.componentSetup.componentKey;
            //f = "true" == this.componentSetup.other || 1 == this.componentSetup.other ? f.find(".otherOption_js") : f.find("." + b + "_js").clone();
            f = f.find("." + b + "_js").clone();
            f.attr("id",this.componentSetup.selfId||this.cid);
            ("true" == this.componentSetup.other || 1 == this.componentSetup.other) && (
                f.addClass("otherOption_js"));//,f.find(".option_plus_js").remove());
            f.find(".optionName_js").attr("value", this.componentSetup.name)
                .attr("selfId",this.componentSetup.selfId||this.cid)
                .attr("required_option",this.componentSetup.required)
                .attr("educationIds",this.componentSetup.educationIds);
            f.find(".optionError_js").attr("value", this.componentSetup.errorContent);
            if("ImageRadioBox" == d.componentSetup.componentKey || "ImageCheckBox" == d.componentSetup.componentKey){
            	f.find(".optionName_js").attr("imagesrc", this.componentSetup.filePath);
            	f.find(".optionName_js").attr("imageid", this.componentSetup.objId);
            }
            f.find(".optionScore_js").attr("value", this.componentSetup.scoreValue);
            "true" == this.componentSetup.isError || 1 == this.componentSetup.isError ? 
            		(f.find(".optionError_js").removeClass("hide"),f.find("input:checkbox[name='error_option']").next().removeClass("sc_unchecked").addClass("sc_checked"),f.find("input:checkbox[name='error_option']").attr("checked", true)):
            		(f.find(".optionError_js").addClass("hide"),f.find("input:checkbox[name='error_option']").next().removeClass("sc_checked").addClass("sc_unchecked"),f.find("input:checkbox[name='error_option']").attr("checked", false));
            if((d.componentSetup.quoteQuestionId && !d.componentSetup.isEditQuoteQuestion) || d.componentSetup.disableEditFromModify){
                f.find("input").attr("disabled","disabled");
                f.find("select").attr("disabled","disabled");
                f.find(".option_minus_js,.option_plus_js").addClass("option_disabled");
                f.find(".optionScore_js").attr("disabled",false);
            }
            //满意度题型—统计类别下拉内容
            if(f.find(".statistics_select_js").length>0){
                var _f=f.find(".statistics_select_js");
                _f.html($("#satisfLevel_select_jtemplate .statistics_select_js").html());
                if($.trim(this.componentSetup.satisfactionLevel)==""){//解决满意度级别的值是0的bug
                    d.componentSetup.options[k]&&(d.componentSetup.options[k].satisfactionLevel=_f.find("option:first").attr("value"));
                }
                _f.val(this.componentSetup.satisfactionLevel);
                _f.chosen({
                    disable_search_threshold:10,
                    allow_single_deselect:true,
                    search_contains:true,
                    no_results_text:"未找到此选项",
                    width:"120px"
                });
            }
            c ? f.insertAfter(c) : e.append(f);
        },
        renderPreview: function(e, d) {
        	var c = $(this.tpl).siblings("#form_option");
        	var qs;
            c = c.find("." + d.componentSetup.componentKey + "_js").clone();
            c.find("input").attr("name", d.cid).attr("disabled",false).attr("id",this.componentSetup.selectionId).val(this.componentSetup.selectionId)
                .data("componentData",this);
            c.find("span").text(this.componentSetup.name);
            "true" != this.componentSetup.other && 1 != this.componentSetup.other || c.append('<input type="text" class="text_control input_otherchoice" title="" onblur="this.title=this.value" onkeyup="this.title=this.value" />');
            if("ImageRadioBox"==d.componentSetup.componentKey||"ImageCheckBox"==d.componentSetup.componentKey){
            	c.find("img").attr("src", this.componentSetup.filePath);
                c.find("img").attr("imageid", this.componentSetup.objId);
                c.find(".content").attr("title",this.componentSetup.name);
                if("ImageRadioBox"==d.componentSetup.componentKey){
                    qs=this.componentSetup.questionAnswers;
                    ("true" == this.componentSetup.isError || 1 == this.componentSetup.isError) &&  c.find("#" + this.componentSetup.selectionId).parents("li").addClass("question_error");
                    if(qs!=undefined) {
                        for (var i = 0; i < qs.length; i++) {
                            if (qs[i].questionAnswer == this.componentSetup.selectionId && ("true" == this.componentSetup.isError || 1 == this.componentSetup.isError)) {
                                c.find("#" + qs[i].questionAnswer).parents("li").addClass("option_error");
                                this.componentSetup.errorContent && e.parent().append('<div class="widget_tip">提示：' + this.componentSetup.errorContent + '</div>')
                            }
                        }
                    }
                }else if("ImageCheckBox"==d.componentSetup.componentKey){
                    qs=this.componentSetup.questionAnswers;
                    ("true" == this.componentSetup.isError || 1 == this.componentSetup.isError) &&  c.find("#" + this.componentSetup.selectionId).parents("li").addClass("question_error");
                    if(qs!=undefined) {
                        for (var i = 0; i < qs.length; i++) {
                            if (qs[i].questionAnswer == this.componentSetup.selectionId && ("true" == this.componentSetup.isError || 1 == this.componentSetup.isError)) {
                                c.find("#" + qs[i].questionAnswer).parents("li").addClass("option_error");
                                this.componentSetup.errorContent && (e.parent().find(".widget_tip").length > 0 ? (e.parent().find(".widget_tip").append('；' + this.componentSetup.errorContent)) :
                                    (e.parent().append('<div class="widget_tip">提示：' + this.componentSetup.errorContent + '</div>')));
                            }
                        }
                    }
                }
            }else if("MatrixRaty" == d.componentSetup.componentKey){
                qs=this.componentSetup.questionAnswers;
                ("true" == this.componentSetup.isError || 1 == this.componentSetup.isError) &&  c.find("#" + this.componentSetup.selectionId).parents("li").addClass("question_error");
            	c.html("<span></span>");
            	var r=this.componentSetup.children;
        		for(var i=0;i<r.length;i++){
        			c.append("<img src='/hug_interview/resources/images/raty_star_unchecked.png' value='"+(i+1)+"' fieldId='"+this.componentSetup.fieldId+"' id='"+r[i].selectionId+"' quoteOptionId='"+$.trim(r[i].quoteOptionId)+"' quoteQuestionId='"+$.trim(this.componentSetup.quoteQuestionId)+"' isError='"+r[i].isError+"' title='"+r[i].errorContent+"'>");
        			if(qs!=undefined&&qs.length>0&&r[i].selectionId==qs[0].questionAnswer&&("true" == r[i].isError || 1 == r[i].isError)){
                        c.find("#" + qs[0].questionAnswer).parents("li").addClass("option_error");
                        this.componentSetup.errorContent && (e.parent().find(".widget_tip").length > 0 ? (e.parent().find(".widget_tip").append('；' + r[i].errorContent)) :
                            (e.parent().append('<div class="widget_tip">提示：' + r[i].errorContent + '</div>')));
                    }
        		}
        		c.find("span").text(this.componentSetup.name);
                this.componentSetup.questionAnswers && this.componentSetup.questionAnswers[0] && c.find("#"+this.componentSetup.questionAnswers[0].questionAnswer).attr("src","/hug_interview/resources/images/raty_star_checked.png").attr("class","raty_star_checked")
                    .prevAll().attr("src","/hug_interview/resources/images/raty_star_checked.png");
            }else if("Select" == d.componentSetup.componentKey){
            	var v = this.componentSetup.selectionId || this.cid;
                c="<option value="+ v +">"+this.componentSetup.name+"</option>";//解决IE8兼容问题
            }else if("MultipleTextArea" == d.componentSetup.componentKey){
                this.componentSetup.questionAnswers && this.componentSetup.questionAnswers[0] && c.find(".text_control").val(this.componentSetup.questionAnswers[0].questionAnswer);
                c.find(".text_control").addClass(d.componentSetup.size).attr("id",this.componentSetup.fieldId).attr("quoteQuestionId",this.componentSetup.quoteQuestionId);
            }else if("RadioBox" == d.componentSetup.componentKey || "ScoreRadioBox" == d.componentSetup.componentKey || "SatisfyRadioBox" == d.componentSetup.componentKey || "SatisfyScoreRadioBox" == d.componentSetup.componentKey){
                qs=this.componentSetup.questionAnswers;
                ("true" == this.componentSetup.isError || 1 == this.componentSetup.isError) &&  c.find("#" + this.componentSetup.selectionId).parents("li").addClass("question_error");
                if(qs!=undefined) {
                    for (var i = 0; i < qs.length; i++) {
                        if (qs[i].questionAnswer == this.componentSetup.selectionId) {
                            if(("true" == this.componentSetup.isError || 1 == this.componentSetup.isError)){
                                c.find("#" + qs[i].questionAnswer).parents("li").addClass("option_error");
                                this.componentSetup.errorContent && e.parent().append('<div class="widget_tip">提示：' + this.componentSetup.errorContent + '</div>');
                            }
                            if(("true" == this.componentSetup.other || 1 == this.componentSetup.other)){
                                qs[i].content && e.parent().append('<div class="other_tip">详细内容：' + qs[i].content + '</div>');
                            }
                        }
                    }
                }
            }else if("CheckBox" == d.componentSetup.componentKey){
                qs=this.componentSetup.questionAnswers;
                ("true" == this.componentSetup.isError || 1 == this.componentSetup.isError) &&  c.find("#" + this.componentSetup.selectionId).parents("li").addClass("question_error");
                if(qs!=undefined) {
                    for (var i = 0; i < qs.length; i++) {
                        if (qs[i].questionAnswer == this.componentSetup.selectionId) {
                            if(("true" == this.componentSetup.isError || 1 == this.componentSetup.isError)){
                                c.find("#" + qs[i].questionAnswer).parents("li").addClass("option_error");
                                this.componentSetup.errorContent && (e.parent().find(".widget_tip").length > 0 ? (e.parent().find(".widget_tip").append('；' + this.componentSetup.errorContent)) :
                                    (e.parent().append('<div class="widget_tip">提示：' + this.componentSetup.errorContent + '</div>')));
                            }
                            if(("true" == this.componentSetup.other || 1 == this.componentSetup.other)){
                                qs[i].content && (e.parent().find(".other_tip").length > 0 ? (e.parent().find(".other_tip").append('；' + qs[i].content)) :
                                    (e.parent().append('<div class="other_tip">详细内容：' + qs[i].content + '</div>')));
                            }
                        }
                    }
                }
            }
            e.append(c);
        }
    });
    u.exports = window.Option;
});