define("form/component/topic", ["form/component/text","form/component/satisfyText","form/component/textarea","form/component/satisfyTextarea",
                                "form/component/radiobox","form/component/satisfyRadioBox","form/component/checkbox",
                                "form/component/imageradiobox","form/component/imagecheckbox","form/component/matrixraty",
                                "form/component/imagecomponent","form/component/scoreradiobox","form/component/satisfyScoreRadioBox",
                                "form/component/select","form/component/datecomponent","form/component/mobile","form/component/multipleTextArea",
                                "form/component/columnpanel","form/component/tablelayout"],
		function(p,s,u){
	p("form/component/text");
    p("form/component/satisfyText");
	p("form/component/textarea");
	p("form/component/satisfyTextarea");
	p("form/component/radiobox");
	p("form/component/satisfyRadioBox");
	p("form/component/checkbox");
	p("form/component/imageradiobox");
	p("form/component/imagecheckbox");
	p("form/component/matrixraty");
	p("form/component/imagecomponent");
	p("form/component/scoreradiobox");
	p("form/component/satisfyScoreRadioBox");
	p("form/component/select");
	p("form/component/datecomponent");
	p("form/component/mobile");
	p("form/component/multipleTextArea");
	p("form/component/columnpanel");
	p("form/component/tablelayout");
});
//文本输入框
define("form/component/text", ["form/editablecomponent","form/tplutil"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil");
	window.Text = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "Text",
				title: "文本输入框"
            };
            if(null != c) {
                a.title = c.title, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			this.tpl = e.get("text");
		},
		render: function(d){
            var c = $(this.tpl).siblings("#form_text");
            h.prototype.render.call(this, d, c);
            d.html(c.html());
        },
        renderEditor:function(){
        	var d = $(this.tpl).siblings("#editor_text");
        	h.prototype.renderEditor.call(this, d);
        	d.find("input:radio[name='tSize']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            d.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            "true" == this.componentSetup.isDefault || 1 ==this.componentSetup.isDefault ? 
            		(d.find("#default_value").removeClass("hide"),d.find("#isDefault").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isDefault").attr("checked", true)):
            		(d.find("#default_value").addClass("hide"),d.find("#isDefault").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isDefault").attr("checked", false));
            d.find("#default_content").text(this.componentSetup.content);
            "true" == this.componentSetup.isReadOnly || 1 ==this.componentSetup.isReadOnly ? 
            		(d.find("#isReadOnly").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isReadOnly").attr("checked", true)):
            		(d.find("#isReadOnly").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isReadOnly").attr("checked", false));
            $("#edit_widget").html(d);
        },
        renderPreview:function(d, c, a){//预览和查看
        	var f = $(this.tpl).siblings("#form_text");
        	h.prototype.renderPreview.call(this, d, c, a, f);
            this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]&&f.find(".text_control").val(this.componentSetup.questionAnswers[0].questionAnswer);
        	f.find(".text_control").addClass(this.componentSetup.size).attr("id",this.componentSetup.fieldId || ("preview_"+this.cid));
        	"true" != this.componentSetup.isDefault && 1 !=this.componentSetup.isDefault ||f.find(".field_value_js").attr("value",this.componentSetup.content);
        	"true" != this.componentSetup.isDefault && 1 !=this.componentSetup.isDefault||"true" != this.componentSetup.isReadOnly && 1 !=this.componentSetup.isReadOnly||(f.addClass("fieldReadOnly"),f.find(".field_value_js").attr("disabled","disabled"));
        	d.append(f);
        },
        renderEditPreview: function(d) {
            var c = $(this.tpl).siblings("#form_text");
            h.prototype.renderEditPreview.call(this, d, c);
            d.append(c);
        },
        checkEvents:function(e,r,m){//初始化绑定事件
            var id=this.componentSetup.fieldId || ("preview_"+this.cid),
                str="#preview_widget_control #"+id;
            if(m){
                str="#widget_control #"+id;
            }
            $(document).on("blur.preview", str,function(b){
                b=$.trim($(this).val());
                if(b.length>200){
                    art.dialog({content: '文本输入框最大支持输入200个文字！',icon: 'warning',time: 1.5});
                }
            });
        },
        submitCheck: function(e) {//表单校验
            var v=e.val();
            if(v.length>200){
                art.dialog({content: '文本输入框最大支持输入200个文字！',icon: 'warning',time: 1.5});
                return 1;
            }
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&$.trim(v)==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {//拼接该类型题数据
            var c = $.trim(d.val());
            var f = {
                fieldId2: this.componentSetup.fieldId2,
                fieldName: this.componentSetup.fieldName,
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,//引用单题
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: "",
                    quoteQuestionAnswer: ""
                }]
            };
            return f;
        }
	});
	u.exports = window.Text;
});
//满意度文本输入框
define("form/component/satisfyText", ["form/editablecomponent","form/tplutil"],
        function(p,s,u){
    var h=p("form/editablecomponent"),
        e=p("form/tplutil");
    window.SatisfyText = h.extend({
        initialize:function(c){
            h.prototype.initialize.call(this, c);
            var a = {
                componentKey: "SatisfyText",
                title: "文本输入框"
            };
            if(null != c) {
                a.title = c.title, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
            this.componentSetup = $.extend(this.componentSetup, a);
            this.tpl = e.get("satisfyText");
        },
        render: function(d){
            var c = $(this.tpl).siblings("#form_text");
            h.prototype.render.call(this, d, c);
            d.html(c.html());
        },
        renderEditor:function(){
            var d = $(this.tpl).siblings("#editor_text");
            h.prototype.renderEditor.call(this, d);
            d.find("input:radio[name='tSize']").each(function(){
                $(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            d.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            "true" == this.componentSetup.isDefault || 1 ==this.componentSetup.isDefault ?
                (d.find("#default_value").removeClass("hide"),d.find("#isDefault").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isDefault").attr("checked", true)):
                (d.find("#default_value").addClass("hide"),d.find("#isDefault").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isDefault").attr("checked", false));
            d.find("#default_content").text(this.componentSetup.content);
            "true" == this.componentSetup.isReadOnly || 1 ==this.componentSetup.isReadOnly ?
                (d.find("#isReadOnly").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isReadOnly").attr("checked", true)):
                (d.find("#isReadOnly").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isReadOnly").attr("checked", false));
            $("#edit_widget").html(d);
        },
        renderPreview:function(d, c, a){
            var f = $(this.tpl).siblings("#form_text");
            h.prototype.renderPreview.call(this, d, c, a, f);
            this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]&&f.find(".text_control").val(this.componentSetup.questionAnswers[0].questionAnswer);
            f.find(".text_control").addClass(this.componentSetup.size).attr("id",this.componentSetup.fieldId || ("preview_"+this.cid));
            "true" != this.componentSetup.isDefault && 1 !=this.componentSetup.isDefault ||f.find(".field_value_js").attr("value",this.componentSetup.content);
            "true" != this.componentSetup.isDefault && 1 !=this.componentSetup.isDefault||"true" != this.componentSetup.isReadOnly && 1 !=this.componentSetup.isReadOnly||(f.addClass("fieldReadOnly"),f.find(".field_value_js").attr("disabled","disabled"));
            d.append(f);
        },
        renderEditPreview: function(d) {
            var c = $(this.tpl).siblings("#form_text");
            h.prototype.renderEditPreview.call(this, d, c);
            d.append(c);
        },
        checkEvents:function(e,r,m){
            var id=this.componentSetup.fieldId || ("preview_"+this.cid),
                str="#preview_widget_control #"+id;
            if(m){
                str="#widget_control #"+id;
            }
            $(document).on("blur.preview", str,function(b){
                b=$.trim($(this).val());
                if(b.length>200){
                    art.dialog({content: '文本输入框最大支持输入200个文字！',icon: 'warning',time: 1.5});
                }
            });
        },
        submitCheck: function(e) {
            var v=e.val();
            if(v.length>200){
                art.dialog({content: '文本输入框最大支持输入200个文字！',icon: 'warning',time: 1.5});
                return 1;
            }
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&$.trim(v)==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var c = $.trim(d.val());
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: "",
                    quoteQuestionAnswer: ""
                }]
            };
            return f;
        }
    });
    u.exports = window.SatisfyText;
});
//多行文本框
define("form/component/textarea", ["form/editablecomponent","form/tplutil"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil");
	window.TextArea = h.extend({
		initialize:function(c){
            h.prototype.initialize.call(this, c);
            var a = {
                componentKey: "TextArea",
                title: "多行文本框"
            };
            if(null != c) {
                a.title = c.title, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
            this.componentSetup = $.extend(this.componentSetup, a);
            this.tpl = e.get("textarea");
		},
		render: function(d){
            var c = $(this.tpl).siblings("#form_textarea");
            h.prototype.render.call(this, d, c);
            d.html(c.html());
        },
        renderEditor:function(){
        	var d = $(this.tpl).siblings("#editor_textarea");
        	h.prototype.renderEditor.call(this, d);
            d.find("input:radio[name='tSize']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            d.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            "true" == this.componentSetup.isDefault || 1 ==this.componentSetup.isDefault ? 
            		(d.find("#default_value").removeClass("hide"),d.find("#isDefault").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isDefault").attr("checked", true)):
            		(d.find("#default_value").addClass("hide"),d.find("#isDefault").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isDefault").attr("checked", false));
            d.find("#default_content").text(this.componentSetup.content);
            "true" == this.componentSetup.isReadOnly || 1 ==this.componentSetup.isReadOnly ? 
            		(d.find("#isReadOnly").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isReadOnly").attr("checked", true)):
            		(d.find("#isReadOnly").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isReadOnly").attr("checked", false));
            $("#edit_widget").html(d);
        },
        renderPreview:function(d, c, a){
        	var f = $(this.tpl).siblings("#form_textarea");
        	h.prototype.renderPreview.call(this, d, c, a, f);
            this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]&&f.find(".text_control").val(this.componentSetup.questionAnswers[0].questionAnswer);
        	f.find(".text_control").addClass(this.componentSetup.size);
        	"true" != this.componentSetup.isDefault && 1 !=this.componentSetup.isDefault ||f.find(".field_value_js").text(this.componentSetup.content);
        	"true" != this.componentSetup.isDefault && 1 !=this.componentSetup.isDefault||"true" != this.componentSetup.isReadOnly && 1 !=this.componentSetup.isReadOnly||(f.addClass("fieldReadOnly"),f.find(".field_value_js").attr("disabled","disabled"));
            d.append(f);
        },
        renderEditPreview: function(d) {
            var c = $(this.tpl).siblings("#form_textarea");
            h.prototype.renderEditPreview.call(this, d, c);
            d.append(c);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var v=e.val();
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&$.trim(v)==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var c = $.trim(d.val());
            var f = {
                fieldId2: this.componentSetup.fieldId2,
                fieldName: this.componentSetup.fieldName,
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: "",
                    quoteQuestionAnswer: ""
                }]
            };
            return f;
        }
	});
	u.exports = window.TextArea;
});
//满意度多行文本框
define("form/component/satisfyTextarea", ["form/editablecomponent","form/tplutil"],
        function(p,s,u){
    var h=p("form/editablecomponent"),
        e=p("form/tplutil");
    window.SatisfyTextArea = h.extend({
        initialize:function(c){
            h.prototype.initialize.call(this, c);
            var a = {
                componentKey: "SatisfyTextArea",
                title: "多行文本框"
            };
            if(null != c) {
                a.title = c.title, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
            this.componentSetup = $.extend(this.componentSetup, a);
            this.tpl = e.get("satisfyTextarea");
        },
        render: function(d){
            var c = $(this.tpl).siblings("#form_textarea");
            h.prototype.render.call(this, d, c);
            d.html(c.html());
        },
        renderEditor:function(){
            var d = $(this.tpl).siblings("#editor_textarea");
            h.prototype.renderEditor.call(this, d);
            d.find("input:radio[name='tSize']").each(function(){
                $(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            d.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            "true" == this.componentSetup.isDefault || 1 ==this.componentSetup.isDefault ?
                (d.find("#default_value").removeClass("hide"),d.find("#isDefault").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isDefault").attr("checked", true)):
                (d.find("#default_value").addClass("hide"),d.find("#isDefault").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isDefault").attr("checked", false));
            d.find("#default_content").text(this.componentSetup.content);
            "true" == this.componentSetup.isReadOnly || 1 ==this.componentSetup.isReadOnly ?
                (d.find("#isReadOnly").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isReadOnly").attr("checked", true)):
                (d.find("#isReadOnly").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isReadOnly").attr("checked", false));
            $("#edit_widget").html(d);
        },
        renderPreview:function(d, c, a){
            var f = $(this.tpl).siblings("#form_textarea");
            h.prototype.renderPreview.call(this, d, c, a, f);
            this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]&&f.find(".text_control").val(this.componentSetup.questionAnswers[0].questionAnswer);
            f.find(".text_control").addClass(this.componentSetup.size);
            "true" != this.componentSetup.isDefault && 1 !=this.componentSetup.isDefault ||f.find(".field_value_js").text(this.componentSetup.content);
            "true" != this.componentSetup.isDefault && 1 !=this.componentSetup.isDefault||"true" != this.componentSetup.isReadOnly && 1 !=this.componentSetup.isReadOnly||(f.addClass("fieldReadOnly"),f.find(".field_value_js").attr("disabled","disabled"));
            d.append(f);
        },
        renderEditPreview: function(d) {
            var c = $(this.tpl).siblings("#form_textarea");
            h.prototype.renderEditPreview.call(this, d, c);
            d.append(c);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var v=e.val();
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&$.trim(v)==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var c = $.trim(d.val());
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: "",
                    quoteQuestionAnswer: ""
                }]
            };
            return f;
        }
    });
    u.exports = window.SatisfyTextArea;
});
//单选框
define("form/component/radiobox", ["form/editablecomponent","form/tplutil","form/component/option"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil"),
	d = p("form/component/option");
	window.RadioBox = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "RadioBox",
				title: "单选框",
                layout: "choicelist_inline",
                options: []
            };
			if(null != c) {
                a.title = c.title, a.layout = c.layout, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			if (!this.componentSetup.options || 0 == this.componentSetup.options.length) {
                c = new d;
                c.setName("选项1");
                c.setOrder(0);
                c.setSelfId(c.cid);
                a = new d;
                a.setName("选项2");
                a.setOrder(1);
                a.setSelfId(a.cid);
                var f = new d;
                f.setName("选项3");
                f.setOrder(2);
                f.setSelfId(f.cid);
                this.componentSetup.options = [];
                this.componentSetup.options[0] = c.componentSetup;
                this.componentSetup.options[1] = a.componentSetup;
                this.componentSetup.options[2] = f.componentSetup;
            }
			this.tpl = e.get("radiobox");
		},
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
		render: function(a){
            var c = $(this.tpl).siblings("#form_radiobox");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }
            a.html(c.html());
        },
        renderEditor:function(){
        	var c = $(this.tpl).siblings("#editor_radiobox");
        	h.prototype.renderEditor.call(this, c);
        	for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this);
                //"true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(),c.find(".plus_other_js").parent().next().css({"margin-left":"28px"}));
            }
        	c.find("input:radio[name='layout']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
        	$("#edit_widget").html(c);
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_radiobox"),
        		g = b.find(".choicelist_js");
        	g.addClass(this.componentSetup.layout);
        	for (var k = 0; k < this.componentSetup.options.length; k++){
                this.componentSetup.options[k].questionAnswers=this.componentSetup.questionAnswers;//答案回显，传到option层，方便展现异常
                (new d(this.componentSetup.options[k])).renderPreview(g, this);
        	}
            h.prototype.renderPreview.call(this, c, a, f, b);
            if(this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]){
                var q=g.find("input:radio[id='"+this.componentSetup.questionAnswers[0].questionAnswer+"']");
                q.attr("checked", true);
                q.next().removeClass("r_unchecked").addClass("r_checked");
                q.parent().next(".input_otherchoice").length>0&&(q.parent().next(".input_otherchoice").removeClass("hide"),
                    q.parent().next(".input_otherchoice").val(this.componentSetup.questionAnswers[0].content).attr("title",this.componentSetup.questionAnswers[0].content));
            }
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_radiobox");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }
            c.append(a);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var b = e.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            var text=b.closest("li").find("input:text"),
                t=$.trim(text.val());
            b = b.data("componentData");
            if(b && ("true" == b.componentSetup.required || 1 ==b.componentSetup.required) &&
                ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && t==""){
                art.dialog({content: '其他选项内容不能为空！',icon: 'warning',time: 1.5});
                text.focus();
                return 1;
            }
            return 0;
        },
        getValue: function(d) {
            var b = d.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            b = b.data("componentData");
            var k = "",
                quoteQuestionAnswer = "",
                isError = "";
            b && (quoteQuestionAnswer = b.componentSetup.quoteOptionId,isError = b.componentSetup.isError,
            ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && (k = d.find("input:radio[name='" + this.cid + "']:checked").parent().next("input:text").val()));
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: k,
                    except: isError,
                    quoteQuestionAnswer: quoteQuestionAnswer
                }]
            };
            return f;
        }
	});
	u.exports = window.RadioBox;
});
//满意度单选框
define("form/component/satisfyRadioBox", ["form/editablecomponent","form/tplutil","form/component/option"],
        function(p,s,u){
    var h=p("form/editablecomponent"),
        e=p("form/tplutil"),
        d = p("form/component/option");
    window.SatisfyRadioBox = h.extend({
        initialize:function(c){
            h.prototype.initialize.call(this, c);
            var a = {
                componentKey: "SatisfyRadioBox",
                title: "单选框",
                layout: "choicelist_inline",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
            this.componentSetup = $.extend(this.componentSetup, a);
            if (!this.componentSetup.options || 0 == this.componentSetup.options.length) {
                c = new d;
                c.setName("选项1");
                c.setOrder(0);
                c.setSelfId(c.cid);
                a = new d;
                a.setName("选项2");
                a.setOrder(1);
                a.setSelfId(a.cid);
                var f = new d;
                f.setName("选项3");
                f.setOrder(2);
                f.setSelfId(f.cid);
                this.componentSetup.options = [];
                this.componentSetup.options[0] = c.componentSetup;
                this.componentSetup.options[1] = a.componentSetup;
                this.componentSetup.options[2] = f.componentSetup;
            }
            this.tpl = e.get("satisfyRadioBox");
        },
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
        render: function(a){
            var c = $(this.tpl).siblings("#form_radiobox");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }
            a.html(c.html());
        },
        renderEditor:function(){
            var c = $(this.tpl).siblings("#editor_radiobox");
            h.prototype.renderEditor.call(this, c);
            for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this, null, f);
                //"true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(),c.find(".plus_other_js").parent().next().css({"margin-left":"28px"}));
            }
            c.find("input:radio[name='layout']").each(function(){
                $(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            $("#edit_widget").html(c);
        },
        renderPreview:function(c, a, f){
            var b = $(this.tpl).siblings("#form_radiobox"),
                g = b.find(".choicelist_js");
            g.addClass(this.componentSetup.layout);
            for (var k = 0; k < this.componentSetup.options.length; k++){
                this.componentSetup.options[k].questionAnswers=this.componentSetup.questionAnswers;//答案回显，传到option层，方便展现异常
                (new d(this.componentSetup.options[k])).renderPreview(g, this);
            }
            h.prototype.renderPreview.call(this, c, a, f, b);
            if(this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]){
                var q=g.find("input:radio[id='"+this.componentSetup.questionAnswers[0].questionAnswer+"']");
                q.attr("checked", true);
                q.next().removeClass("r_unchecked").addClass("r_checked");
                q.parent().next(".input_otherchoice").length>0&&(q.parent().next(".input_otherchoice").removeClass("hide"),
                    q.parent().next(".input_otherchoice").val(this.componentSetup.questionAnswers[0].content).attr("title",this.componentSetup.questionAnswers[0].content));
            }
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_radiobox");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }
            c.append(a);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var b = e.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            var text=b.closest("li").find("input:text"),
                t=$.trim(text.val());
            b = b.data("componentData");
            if(b && ("true" == b.componentSetup.required || 1 ==b.componentSetup.required) &&
                ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && t==""){
                art.dialog({content: '其他选项内容不能为空！',icon: 'warning',time: 1.5});
                text.focus();
                return 1;
            }
            return 0;
        },
        getValue: function(d) {
            var b = d.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            b = b.data("componentData");
            var k = "",
                quoteQuestionAnswer = "",
                isError = "";
            b && (quoteQuestionAnswer = b.componentSetup.quoteOptionId,isError = b.componentSetup.isError,
            ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && (k = d.find("input:radio[name='" + this.cid + "']:checked").parent().next("input:text").val()));
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: k,
                    except: isError,
                    quoteQuestionAnswer: quoteQuestionAnswer
                }]
            };
            return f;
        }
    });
    u.exports = window.SatisfyRadioBox;
});
//多选框
define("form/component/checkbox", ["form/editablecomponent","form/tplutil","form/component/option"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil"),
	d = p("form/component/option");
	window.CheckBox = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "CheckBox",
				title: "多选框",
                layout: "choicelist_inline",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			if (!this.componentSetup.options || 0 == this.componentSetup.options.length) {
                c = new d;
                c.setName("选项1");
                c.setOrder(0);
                c.setSelfId(c.cid);
                a = new d;
                a.setName("选项2");
                a.setOrder(1);
                a.setSelfId(a.cid);
                var f = new d;
                f.setName("选项3");
                f.setOrder(2);
                f.setSelfId(f.cid);
                this.componentSetup.options = [];
                this.componentSetup.options[0] = c.componentSetup;
                this.componentSetup.options[1] = a.componentSetup;
                this.componentSetup.options[2] = f.componentSetup;
            }
			this.tpl = e.get("checkbox");
		},
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
		render: function(a){
            var c = $(this.tpl).siblings("#form_checkbox");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }
            a.html(c.html());
        },
        renderEditor:function(){
        	var c = $(this.tpl).siblings("#editor_checkbox");
        	h.prototype.renderEditor.call(this, c);
        	for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this);
                //"true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(),c.find(".plus_other_js").parent().next().css({"margin-left":"28px"}));
            }
        	c.find("input:radio[name='layout']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            $("#edit_widget").html(c.html());
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_checkbox"),
        		g = b.find(".choicelist_js");
        	g.addClass(this.componentSetup.layout);
        	for (var k = 0; k < this.componentSetup.options.length; k++){
                this.componentSetup.options[k].questionAnswers=this.componentSetup.questionAnswers;//答案回显，传到option层，方便展现异常
        		(new d(this.componentSetup.options[k])).renderPreview(g, this);
        	}
            h.prototype.renderPreview.call(this, c, a, f, b);
            if(this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]){
                for(var i=0;i<this.componentSetup.questionAnswers.length;i++){
                    var q=g.find("input:checkbox[id='"+this.componentSetup.questionAnswers[i].questionAnswer+"']");
                    q.attr("checked", true);
                    q.next().removeClass("sc_unchecked").addClass("sc_checked");
                    q.parent().next(".input_otherchoice").length>0&&(q.parent().next(".input_otherchoice").removeClass("hide"),
                        q.parent().next(".input_otherchoice").val(this.componentSetup.questionAnswers[i].content).attr("title",this.componentSetup.questionAnswers[i].content));
                }
            }
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_checkbox");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }
            c.append(a);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var b = "";//e.find("input:checkbox[name='" + this.cid + "']:checked");
            var c="";
            var s=true;
            e.find("input:checkbox[name='" + this.cid + "']:checked").each(function(){
                b = $(this).data("componentData");
                c += ","+$(this).val();
                var t=$.trim($(this).closest("li").find("input:text").val());
                if(b && ("true" == b.componentSetup.required || 1 ==b.componentSetup.required) &&
                    ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && t==""){
                    art.dialog({content: '其他选项内容不能为空！',icon: 'warning',time: 1.5});
                    $(this).closest("li").find("input:text").focus();
                    s=false;
                    return false;
                }
            });
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            if(!s){
                return 1;
            }
            return 0;
        },
        getValue: function(d) {
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers:[]
            };
            d.find("input:checkbox[name='" + this.cid + "']:checked").each(function(b){
                f.questionAnswers[b]={
                    questionId: "",
                    questionAnswer: $(this).val(),
                    content: $.trim($(this).closest("li").find("input:text").val()),
                    except: $(this).data("componentData").componentSetup.isError,
                    quoteQuestionAnswer: $(this).data("componentData").componentSetup.quoteOptionId
                };
            });
            return f;
        }
	});
	u.exports = window.CheckBox;
});
//图文选择框(单选)
define("form/component/imageradiobox", ["form/editablecomponent","form/tplutil","form/component/option"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil"),
	d = p("form/component/option");
	window.ImageRadioBox = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "ImageRadioBox",
				title: "图文选择框",
				formId: "",
                layout: "choicelist_inline",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.formId = c.formId, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			this.tpl = e.get("imageradiobox");
		},
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
		render: function(a){
            var c = $(this.tpl).siblings("#form_imageradiobox");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }else{
            	f.html('<li class="no_option_js no_option">请在右侧添加选项</li>');
            }
            a.html(c.html());
        },
        renderEditor:function(){
        	var c = $(this.tpl).siblings("#editor_imageradiobox");
        	h.prototype.renderEditor.call(this, c);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                    var b = this.componentSetup.options[f];
                    (new d(b)).renderEditor(a, this);
                    "true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(), c.find(".plus_other_js").parent().next().css({"margin-left": "28px"}));
                }
            }
        	c.find("input:radio[name='layout']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            c.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            $("#edit_widget").html(c.html());
            this.initUploader("img_upload_js", "#item_container_js .choicelistEdit_js");
        },
        change: function(c) {
            var a = c.oldObj;
            c = c.changeEl;
            this.componentSetup.title = a.componentSetup.title;
            this.componentSetup.titleLayout = a.componentSetup.titleLayout;
            this.componentSetup.required = a.componentSetup.required;
            this.componentSetup.layout = a.componentSetup.layout;
            this.componentSetup.isHideTitle = a.componentSetup.isHideTitle;
            this.componentSetup.options = a.componentSetup.options;
            this.componentSetup.alias = a.componentSetup.alias;
            this.componentSetup.isNotSendMobile = a.componentSetup.isNotSendMobile;
            this.render(c);
            this.renderEditor();
            c.addClass("field_active").attr("componentkey",this.componentSetup.componentKey);
        },
        initUploader:function(a,c){
        	var e = this;
        	a = this.uploader = new plupload.Uploader({
                runtimes: "html5,flash",
                file_data_name: "data",
                browse_button: a,
                max_file_size: "20M",
                filters: {
                    mime_types : [ //只允许上传图片
                        { title : "Image files", extensions : "jpg,gif,png" }
                    ]
                },
                url: "/hug_interview/repository/form/upload.file",
                flash_swf_url: "/hug_interview/resources/plupload/plupload.swf"
            });
        	a.init();
        	a.bind("FilesAdded",function(b, a){
                $.each(a,function(b, a){
                    plupload.formatSize(a.size);
                });
                b.refresh();
                b.start();
            });
            a.bind("Error",function(b, a){
                (- 600 == a.code || - 601 == a.code ) && art.dialog({content: '只能上传最大不超过20M的图片！',icon: 'warning',time: 1.5});
                b.refresh();
            });
            a.bind("FileUploaded",function(b, a, n){
                b = n = $.parseJSON(n.response);
                a = n.name.slice(0, n.name.lastIndexOf("."));
                if (n.status) {
                    n=new d,n.componentSetup.selfId=n.cid,n.setFilePath('/hug_interview'+b.filePath),n.setObjId(b.imageId),n.setName(a),n.renderEditor($(c), e),e.componentSetup.options.push(n.componentSetup),b = $("#widget_control .field_active .choicelist_js"), n.render(b, e);
                }
            });
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_imageradiobox"),
        		g = b.find(".choicelist_js");
        	g.addClass(this.componentSetup.layout);
        	if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
	        	for (var k = 0; k < this.componentSetup.options.length; k++){
                    this.componentSetup.options[k].questionAnswers=this.componentSetup.questionAnswers;//答案回显，传到option层，方便展现异常
	        		(new d(this.componentSetup.options[k])).renderPreview(g, this);
	        	}
        	}else{
        		g.html('<li class="no_option_js no_option">请在右侧添加选项</li>');
        	}
            h.prototype.renderPreview.call(this, c, a, f, b);
            if(this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]){
                var q=g.find("input:radio[id='"+this.componentSetup.questionAnswers[0].questionAnswer+"']");
                q.attr("checked", true);
                q.next().removeClass("r_unchecked").addClass("r_checked");
            }
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_imageradiobox");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }else{
            	f.html('<li class="no_option_js no_option">请在右侧添加选项</li>');
            }
            c.append(a);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var b = e.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var b = d.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            b = b.data("componentData");
            var k = "",
                quoteQuestionAnswer = "",
                isError = "";
            b && (quoteQuestionAnswer = b.componentSetup.quoteOptionId,isError = b.componentSetup.isError,
            ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && (k = d.find("input:radio[name='" + this.cid + "']:checked").parent().next("input:text").val()));

            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: "",
                    except: isError,
                    quoteQuestionAnswer: quoteQuestionAnswer
                }]
            };
            return f;
        }
	});
	u.exports = window.ImageRadioBox;
});
//图文选择框(多选)
define("form/component/imagecheckbox", ["form/editablecomponent","form/tplutil","form/component/option"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil"),
	d = p("form/component/option");
	window.ImageCheckBox = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "ImageCheckBox",
				title: "图文选择框",
				formId: "",
                layout: "choicelist_inline",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.formId = c.formId, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			this.tpl = e.get("imagecheckbox");
		},
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
		render: function(a){
            var c = $(this.tpl).siblings("#form_imagecheckbox");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }else{
            	f.html('<li class="no_option_js no_option">请在右侧添加选项</li>');
            }
            a.html(c.html());
        },
        renderEditor:function(){
        	var c = $(this.tpl).siblings("#editor_imagecheckbox");
        	h.prototype.renderEditor.call(this, c);
        	for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this);
                "true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(),c.find(".plus_other_js").parent().next().css({"margin-left":"28px"}));
            }
        	c.find("input:radio[name='layout']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            c.find("input:radio[name='componentType'][value='" + this.componentSetup.componentKey + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            $("#edit_widget").html(c.html());
            this.initUploader("img_upload_js", "#item_container_js .choicelistEdit_js");
        },
        change: function(c) {
            var a = c.oldObj;
            c = c.changeEl;
            this.componentSetup.title = a.componentSetup.title;
            this.componentSetup.titleLayout = a.componentSetup.titleLayout;
            this.componentSetup.required = a.componentSetup.required;
            this.componentSetup.layout = a.componentSetup.layout;
            this.componentSetup.isHideTitle = a.componentSetup.isHideTitle;
            this.componentSetup.options = a.componentSetup.options;
            this.componentSetup.alias = a.componentSetup.alias;
            this.componentSetup.isNotSendMobile = a.componentSetup.isNotSendMobile;
            this.render(c);
            this.renderEditor();
            c.addClass("field_active").attr("componentkey",this.componentSetup.componentKey);
        },
        initUploader:function(a,c){
        	var e = this;
        	a = this.uploader = new plupload.Uploader({
                runtimes: "html5,flash",
                file_data_name: "data",
                browse_button: a,
                max_file_size: "20M",
                filters: {
                    mime_types : [ //只允许上传图片
                        { title : "Image files", extensions : "jpg,gif,png" }
                    ]
                },
                url: "/hug_interview/repository/form/upload.file",
                flash_swf_url: "/hug_interview/resources/plupload/plupload.swf"
            });
        	a.init();
        	a.bind("FilesAdded",function(b, a){
                $.each(a,function(b, a){
                    plupload.formatSize(a.size);
                });
                b.refresh();
                b.start();
            });
            a.bind("Error",function(b, a){
                (- 600 == a.code || - 601 == a.code ) && art.dialog({content: '只能上传最大不超过20M的图片！',icon: 'warning',time: 1.5});
                b.refresh();
            });
            a.bind("FileUploaded",function(b, a, n){
                b = n = $.parseJSON(n.response);
                a = n.name.slice(0, n.name.lastIndexOf("."));
                if (n.status) {
                    n=new d,n.setFilePath('/hug_interview'+b.filePath),n.setObjId(b.imageId),n.setName(a),n.renderEditor($(c), e),e.componentSetup.options.push(n.componentSetup),b = $("#widget_control .field_active .choicelist_js"), n.render(b, e);
                }
            });
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_imagecheckbox"),
        		g = b.find(".choicelist_js");
        	g.addClass(this.componentSetup.layout);
        	if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
	        	for (var k = 0; k < this.componentSetup.options.length; k++){
                    this.componentSetup.options[k].questionAnswers=this.componentSetup.questionAnswers;//答案回显，传到option层，方便展现异常
	        		(new d(this.componentSetup.options[k])).renderPreview(g, this);
	        	}
        	}else{
        		g.html('<li class="no_option_js no_option">请在右侧添加选项</li>');
        	}
            h.prototype.renderPreview.call(this, c, a, f, b);
            if(this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]){
                for(var i=0;i<this.componentSetup.questionAnswers.length;i++){
                    var q=g.find("input:checkbox[id='"+this.componentSetup.questionAnswers[i].questionAnswer+"']");
                    q.attr("checked", true);
                    q.next().removeClass("sc_unchecked").addClass("sc_checked");
                }
            }
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_imagecheckbox");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }else{
            	f.html('<li class="no_option_js no_option">请在右侧添加选项</li>');
            }
            c.append(a);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var c="";
            e.find("input:checkbox[name='" + this.cid + "']:checked").each(function(){
                c += ","+$(this).val();
            });
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers:[]
            };
            d.find("input:checkbox[name='" + this.cid + "']:checked").each(function(b){
                f.questionAnswers[b]={
                    questionId: "",
                    questionAnswer: $(this).val(),
                    content: "",
                    except: $(this).data("componentData").componentSetup.isError,
                    quoteQuestionAnswer: $(this).data("componentData").componentSetup.quoteOptionId
                };
            });
            return f;
        }
	});
	u.exports = window.ImageCheckBox;
});
//矩阵评级框
define("form/component/matrixraty", ["form/editablecomponent","form/tplutil","form/component/option","form/component/secondOption"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil"),
	d = p("form/component/option"),
	x= p("form/component/secondOption");
	window.MatrixRaty = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "MatrixRaty",
				title: "矩阵评级框",
                layout: "",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			if (!this.componentSetup.options || 0 == this.componentSetup.options.length) {
                c = new d;
                c.setName("选项1");
                c.setOrder(0);
                //第二层选项-不用new一个，不然引用的怎么改都会变成一样的
                var s_a=new x;
                s_a.setComponentKey("MatrixRatyStar");
                var s_b=new x;
                s_b.setComponentKey("MatrixRatyStar");
                var s_c=new x;
                s_c.setComponentKey("MatrixRatyStar");
                var s_d=new x;
                s_d.setComponentKey("MatrixRatyStar");
                var s_e=new x;
                s_e.setComponentKey("MatrixRatyStar");
                c.setChildren([s_a.componentSetup,s_b.componentSetup,s_c.componentSetup,s_d.componentSetup,s_e.componentSetup]);
                this.componentSetup.options = [];
                this.componentSetup.options[0] = c.componentSetup;
            }
			this.tpl = e.get("matrixraty");
		},
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
		render: function(a){
            var c = $(this.tpl).siblings("#form_matrixraty");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }
            a.html(c.html());
        },
        renderEditor:function(){
        	var c = $(this.tpl).siblings("#editor_matrixraty");
        	h.prototype.renderEditor.call(this, c);
        	for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this);
            }
        	for (var a = c.find("ul.secondChoicelistEdit_js"), f = 0; f < this.componentSetup.options[0].children.length; f++) {
                var b = this.componentSetup.options[0].children[f]; (new x(b)).renderEditor(a, "MatrixRatyStar");
            }
            if((this.componentSetup.quoteQuestionId && !this.componentSetup.isEditQuoteQuestion) || this.componentSetup.disableEditFromModify){
                c.find(".secondChoicelistEdit_js input").attr("disabled","disabled");
                c.find(".star_oper_btns").remove();
            }
        	$("#edit_widget").html(c.html());
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_matrixraty"),
        		g = b.find(".choicelist_js");
        	g.addClass(this.componentSetup.layout);
        	for (var k = 0; k < this.componentSetup.options.length; k++){
        		(new d(this.componentSetup.options[k])).renderPreview(g, this);
        	}
            h.prototype.renderPreview.call(this, c, a, f, b);
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_matrixraty");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }
            c.append(a);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var r = e.find(".raty_star_checked").size(),
                l = e.find("li").size();
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&r!=l){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers:[]
            };
            d.find(".raty_star_checked").each(function(b){
                f.questionAnswers[b]={
                    questionId: $(this).attr("fieldId"),
                    questionAnswer: $(this).attr("id"),
                    content: "",
                    except: $(this).attr("isError"),
                    quoteQuestionId: $.trim($(this).attr("quoteQuestionId")),
                    quoteQuestionAnswer: $.trim($(this).attr("quoteOptionId"))
                };
            });
            return f;
        }
	});
	u.exports = window.MatrixRaty;
});
//图片
define("form/component/imagecomponent", ["form/editablecomponent","form/tplutil"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil");
	window.ImageComponent = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "ImageComponent",
				title: "图片",
                isSingle: !1
            };
            if(null != c) {
                a.title = c.title, a.isSingle = c.isSingle, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			this.tpl = e.get("imagecomponent");
		},
		setIsSingle: function(c) {
            this.componentSetup.isSingle = c;
        },
		render: function(d){
            var c = $(this.tpl).siblings("#form_imagecomponent");
            h.prototype.render.call(this, d, c);
            d.html(c.html());
        },
        renderEditor:function(){
        	var d = $(this.tpl).siblings("#editor_imagecomponent");
        	h.prototype.renderEditor.call(this, d);
        	"true" == this.componentSetup.isSingle || 1 ==this.componentSetup.isSingle ? 
            		(d.find("#isSingle").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isSingle").attr("checked", true)):
            		(d.find("#isSingle").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isSingle").attr("checked", false));
        	$("#edit_widget").html(d.html());
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_imagecomponent");
            h.prototype.renderPreview.call(this, c, a, f, b);
            b.find(".form_img_upload .img_add").attr("id","preview_"+this.cid);
            if(this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]){
                for(var i=0;i<this.componentSetup.questionAnswers.length;i++){
                    b.find(".imagescomponentlist_js").append('<li class="image_radiobox"><div class="box"><img src="'+this.componentSetup.questionAnswers[i].questionAnswer+'" id="'+this.componentSetup.questionAnswers[i].questionAnswer+'"></div><div class="design_icon delete_red_circle img_delete"></div></li>');
                }
            }
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_imagecomponent");
            h.prototype.renderEditPreview.call(this, c, a);
            c.append(a);
        },
        checkEvents:function(e,r){
            if(!r){
        	    this.initUploader("preview_"+this.cid);
            }
            $(document).on("click", ".img_delete",function(){
                $(this).parent(".image_radiobox").remove();
            });
        },
        initUploader:function(a){
        	var ul=$("#"+a).parents("ul"),
        	isSingle="true" == this.componentSetup.isSingle || 1 ==this.componentSetup.isSingle;
        	a = this.uploader = new plupload.Uploader({
                runtimes: "html5,flash",
                file_data_name: "data",
                browse_button: a,
                max_file_size: "20M",
                filters: {
                    mime_types : [ //只允许上传图片
                        { title : "Image files", extensions : "jpg,gif,png" }
                    ]
                },
                url: "/hug_interview/repository/form/upload.file",
                flash_swf_url: "/hug_interview/resources/plupload/plupload.swf"
            });
        	a.init();
        	a.bind("FilesAdded",function(b, a){
                if((isSingle&&a.length>1)||(isSingle&&ul.find("li").length>1)){
                	art.dialog({content: '此控件仅能上传一张图片！',icon: 'warning',time: 1.5});
                	b.splice();
                }else{
    	    		$.each(a,function(b, a){
    	                plupload.formatSize(a.size);
    	            });
    	            b.refresh();
    	            b.start();
                }
            });
            a.bind("Error",function(b, a){
                (- 600 == a.code || - 601 == a.code ) && art.dialog({content: '只能上传最大不超过20M的图片！',icon: 'warning',time: 1.5});
                b.refresh();
            });
            a.bind("FileUploaded",function(b, a, n){
                b = n = $.parseJSON(n.response);
                if (n.status) {
                    ul.append('<li class="image_radiobox"><div class="box"><img src="/hug_interview'+b.filePath+'" id="/hug_interview'+b.filePath+'"></div><div class="design_icon delete_red_circle img_delete"></div></li>');
                }
            });
        },
        submitCheck: function(e) {
            var d = e.find(".image_radiobox").length;
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required) && d<1){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                questionAnswers:[]
            };
            d.find(".image_radiobox img").each(function(b){
                f.questionAnswers[b]={
                    questionId: "",
                    questionAnswer: $(this).attr("id"),
                    content: ""
                };
            });
            return f;
        }
	});
	u.exports = window.ImageComponent;
});
//评分单选框
define("form/component/scoreradiobox", ["form/editablecomponent","form/tplutil","form/component/option"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil"),
	d = p("form/component/option");
	window.ScoreRadioBox = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "ScoreRadioBox",
				title: "评分单选框",
                layout: "choicelist_inline",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			if (!this.componentSetup.options || 0 == this.componentSetup.options.length) {
                c = new d;
                c.setName("选项1");
                c.setOrder(0);
                c.setSelfId(c.cid);
                a = new d;
                a.setName("选项2");
                a.setOrder(1);
                a.setSelfId(a.cid);
                var f = new d;
                f.setName("选项3");
                f.setOrder(2);
                f.setSelfId(f.cid);
                this.componentSetup.options = [];
                this.componentSetup.options[0] = c.componentSetup;
                this.componentSetup.options[1] = a.componentSetup;
                this.componentSetup.options[2] = f.componentSetup;
            }
			this.tpl = e.get("scoreradiobox");
		},
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
        getScoreTable: function(){
            return e.get("scoretable");
        },
		render: function(a){
            var c = $(this.tpl).siblings("#form_scoreradiobox");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }
            a.html(c.html());
        },
        renderEditor:function(){
        	var c = $(this.tpl).siblings("#editor_scoreradiobox");
        	h.prototype.renderEditor.call(this, c);
        	for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this);
                //"true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(),c.find(".plus_other_js").parent().next().css({"margin-left":"28px"}));
            }
        	c.find("input:radio[name='layout']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            $("#edit_widget").html(c);
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_scoreradiobox"),
        		g = b.find(".choicelist_js");
        	g.addClass(this.componentSetup.layout);
        	for (var k = 0; k < this.componentSetup.options.length; k++){
                this.componentSetup.options[k].questionAnswers=this.componentSetup.questionAnswers;//答案回显，传到option层，方便展现异常
        	    (new d(this.componentSetup.options[k])).renderPreview(g, this);
        	}
            h.prototype.renderPreview.call(this, c, a, f, b);
            if(this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]){
                var q=g.find("input:radio[id='"+this.componentSetup.questionAnswers[0].questionAnswer+"']");
                q.attr("checked", true);
                q.next().removeClass("r_unchecked").addClass("r_checked");
                q.parent().next(".input_otherchoice").length>0&&(q.parent().next(".input_otherchoice").removeClass("hide"),
                    q.parent().next(".input_otherchoice").val(this.componentSetup.questionAnswers[0].content).attr("title",this.componentSetup.questionAnswers[0].content));
            }
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_scoreradiobox");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }
            c.append(a);
            $("#formContent .score_standard_container").length<1?$("#formContent").append(this.getScoreTable()):null;
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            /*var c = $.trim(e.find("input:radio[name='" + this.cid + "']:checked").val());
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            return 0;*/
            var b = e.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            var text=b.closest("li").find("input:text"),
                t=$.trim(text.val());
            b = b.data("componentData");
            if(b && ("true" == b.componentSetup.required || 1 ==b.componentSetup.required) &&
                ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && t==""){
                art.dialog({content: '其他选项内容不能为空！',icon: 'warning',time: 1.5});
                text.focus();
                return 1;
            }
            return 0;
        },
        getValue: function(d) {
            var b = d.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            b = b.data("componentData");
            var k = "",
                quoteQuestionAnswer = "",
                isError = "";
            b && (quoteQuestionAnswer = b.componentSetup.quoteOptionId,isError = b.componentSetup.isError,
            ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && (k = d.find("input:radio[name='" + this.cid + "']:checked").parent().next("input:text").val()));
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: k,
                    except: isError,
                    quoteQuestionAnswer: quoteQuestionAnswer
                }]
            };
            return f;
        }
	});
	u.exports = window.ScoreRadioBox;
});
//满意度评分单选框
define("form/component/satisfyScoreRadioBox", ["form/editablecomponent","form/tplutil","form/component/option"],
        function(p,s,u){
    var h=p("form/editablecomponent"),
        e=p("form/tplutil"),
        d = p("form/component/option");
    window.SatisfyScoreRadioBox = h.extend({
        initialize:function(c){
            h.prototype.initialize.call(this, c);
            var a = {
                componentKey: "SatisfyScoreRadioBox",
                title: "评分单选框",
                layout: "choicelist_inline",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
            this.componentSetup = $.extend(this.componentSetup, a);
            if (!this.componentSetup.options || 0 == this.componentSetup.options.length) {
                c = new d;
                c.setName("选项1");
                c.setOrder(0);
                c.setSelfId(c.cid);
                a = new d;
                a.setName("选项2");
                a.setOrder(1);
                a.setSelfId(a.cid);
                var f = new d;
                f.setName("选项3");
                f.setOrder(2);
                f.setSelfId(f.cid);
                this.componentSetup.options = [];
                this.componentSetup.options[0] = c.componentSetup;
                this.componentSetup.options[1] = a.componentSetup;
                this.componentSetup.options[2] = f.componentSetup;
            }
            this.tpl = e.get("satisfyScoreRadioBox");
        },
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
        getScoreTable: function(){
            return e.get("scoretable");
        },
        render: function(a){
            var c = $(this.tpl).siblings("#form_scoreradiobox");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }
            a.html(c.html());
        },
        renderEditor:function(){
            var c = $(this.tpl).siblings("#editor_scoreradiobox");
            h.prototype.renderEditor.call(this, c);
            for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this, null, f);
                //"true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(),c.find(".plus_other_js").parent().next().css({"margin-left":"28px"}));
            }
            c.find("input:radio[name='layout']").each(function(){
                $(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            $("#edit_widget").html(c);
        },
        renderPreview:function(c, a, f){
            var b = $(this.tpl).siblings("#form_scoreradiobox"),
                g = b.find(".choicelist_js");
            g.addClass(this.componentSetup.layout);
            for (var k = 0; k < this.componentSetup.options.length; k++){
                this.componentSetup.options[k].questionAnswers=this.componentSetup.questionAnswers;//答案回显，传到option层，方便展现异常
                (new d(this.componentSetup.options[k])).renderPreview(g, this);
            }
            h.prototype.renderPreview.call(this, c, a, f, b);
            if(this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0]){
                var q=g.find("input:radio[id='"+this.componentSetup.questionAnswers[0].questionAnswer+"']");
                q.attr("checked", true);
                q.next().removeClass("r_unchecked").addClass("r_checked");
                q.parent().next(".input_otherchoice").length>0&&(q.parent().next(".input_otherchoice").removeClass("hide"),
                    q.parent().next(".input_otherchoice").val(this.componentSetup.questionAnswers[0].content).attr("title",this.componentSetup.questionAnswers[0].content));
            }
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_scoreradiobox");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }
            c.append(a);
            $("#formContent .score_standard_container").length<1?$("#formContent").append(this.getScoreTable()):null;
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            /*var c = $.trim(e.find("input:radio[name='" + this.cid + "']:checked").val());
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            return 0;*/
            var b = e.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            var text=b.closest("li").find("input:text"),
                t=$.trim(text.val());
            b = b.data("componentData");
            if(b && ("true" == b.componentSetup.required || 1 ==b.componentSetup.required) &&
                ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && t==""){
                art.dialog({content: '其他选项内容不能为空！',icon: 'warning',time: 1.5});
                text.focus();
                return 1;
            }
            return 0;
        },
        getValue: function(d) {
            var b = d.find("input:radio[name='" + this.cid + "']:checked"),
                c = $.trim(b.val());
            b = b.data("componentData");
            var k = "",
                quoteQuestionAnswer = "",
                isError = "";
            b && (quoteQuestionAnswer = b.componentSetup.quoteOptionId,isError = b.componentSetup.isError,
            ("true" == b.componentSetup.other || 1 == b.componentSetup.other) && (k = d.find("input:radio[name='" + this.cid + "']:checked").parent().next("input:text").val()));
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: k,
                    except: isError,
                    quoteQuestionAnswer: quoteQuestionAnswer
                }]
            };
            return f;
        }
    });
    u.exports = window.SatisfyScoreRadioBox;
});
//下拉菜单
define("form/component/select", ["form/editablecomponent","form/tplutil","form/component/option"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil"),
	d = p("form/component/option");
	window.Select = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "Select",
				title: "下拉菜单",
                layout: "",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			if (!this.componentSetup.options || 0 == this.componentSetup.options.length) {
                c = new d;
                c.setName("选项1");
                c.setOrder(0);
                a = new d;
                a.setName("选项2");
                a.setOrder(1);
                var f = new d;
                f.setName("选项3");
                f.setOrder(2);
                this.componentSetup.options = [];
                this.componentSetup.options[0] = c.componentSetup;
                this.componentSetup.options[1] = a.componentSetup;
                this.componentSetup.options[2] = f.componentSetup;
            }
			this.tpl = e.get("select");
		},
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
		render: function(a){
            var c = $(this.tpl).siblings("#form_select");
            h.prototype.render.call(this, a, c);
            var f = c.find("select");
            f.html("<option value=''></option>");
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }
            this.chosen1(f);
            a.html(c.html());
            a.find(".chosen-container").addClass(this.componentSetup.size);
        },
        renderEditor:function(){
        	var c = $(this.tpl).siblings("#editor_select");
        	h.prototype.renderEditor.call(this, c);
        	for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this);
                "true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(),c.find(".plus_other_js").parent().next().css({"margin-left":"0px"}));
            }
        	c.find("input:radio[name='tSize']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
        	$("#edit_widget").html(c.html());
        },
        chosen1:function(f){
        	//下拉菜单初始化
        	f.chosen({
    	    	disable_search_threshold:10,
    	    	allow_single_deselect:true,
    	    	search_contains:true,
                allow_scroll:false,
    	    	no_results_text:"未找到此选项"
    	    });
        },
        chosen2:function(r){//表格内的控件不调用checkEvents,主动触发来实现下拉效果
            var size="50%";
            this.componentSetup.size=="medium"?size="75%":this.componentSetup.size=="large"?size="100%":size="50%";
            if(r){
                $(".preview_chosen_select_deselect").attr("disabled","disabled");
            }
            $(".preview_chosen_select_deselect").chosen({
                disable_search_threshold:10,
                allow_single_deselect:true,
                search_contains:true,
                allow_scroll:false,
                no_results_text:"未找到此选项",
                width:size
            });
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_select"),
        		g = b.find("select").attr("disabled",false).addClass("preview_chosen_select_deselect");
        	g.html("<option value=''></option>");
        	for (var k = 0; k < this.componentSetup.options.length; k++){
        		(new d(this.componentSetup.options[k])).renderPreview(g, this);
        	}
            h.prototype.renderPreview.call(this, c, a, f, b);
            this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0] && g.val(this.componentSetup.questionAnswers[0].questionAnswer);
            c.append(b);
            this.chosen2(f);
            c.find(".chosen-container").addClass(this.componentSetup.size);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_select");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            var b = this.componentSetup.options;
            f.html("<option value=''></option>");
            if (null != b && 0 < b.length) {
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }
            c.append(a);
            this.chosen1(f);
            c.find(".chosen-container").addClass(this.componentSetup.size);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var c = $.trim(e.val());
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&c==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var c = $.trim(d.val());
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: ""
                }]
            };
            return f;
        }
	});
	u.exports = window.Select;
});
//日期
define("form/component/datecomponent", ["form/editablecomponent","form/tplutil"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil");
	window.DateComponent = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
                componentKey: "DateComponent",
				title: "日期",
				format: "YYYY-MM-DD",
                isSystemDate: !1
            };
            if(null != c) {
                a.title = c.title, a.format = c.format, a.isSystemDate = c.isSystemDate, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			this.tpl = e.get("datecomponent");
		},
        setFormat: function(c) {
            this.componentSetup.format = c;
        },
        setIsSystemDate: function(c) {
            this.componentSetup.isSystemDate = c;
        },
		render: function(d){
            var c = $(this.tpl).siblings("#form_datecomponent");
            h.prototype.render.call(this, d, c);
            d.html(c.html());
        },
        renderEditor:function(){
        	var d = $(this.tpl).siblings("#editor_datecomponent");
        	h.prototype.renderEditor.call(this, d);
        	d.find("input:radio[name='tSize']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            d.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
        	d.find("input:radio[name='dateFormat']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            d.find("input:radio[name='dateFormat'][value='" + this.componentSetup.format + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
            "true" == this.componentSetup.isReadOnly || 1 ==this.componentSetup.isReadOnly ? 
            		(d.find("#isReadOnly").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isReadOnly").attr("checked", true)):
            		(d.find("#isReadOnly").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isReadOnly").attr("checked", false));
    		"true" == this.componentSetup.isSystemDate || 1 ==this.componentSetup.isSystemDate ? 
            		(d.find("#isSystemDate").next().removeClass("sc_unchecked").addClass("sc_checked"),d.find("#isReadOnly").parents(".checkbox").removeClass("hide"),d.find("#isSystemDate").attr("checked", true)):
            		(d.find("#isSystemDate").next().removeClass("sc_checked").addClass("sc_unchecked"),d.find("#isReadOnly").parents(".checkbox").addClass("hide"),d.find("#isSystemDate").attr("checked", false));
            $("#edit_widget").html(d.html());
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_datecomponent");
            h.prototype.renderPreview.call(this, c, a, f, b);
            this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0] && b.find(".text_control").val(this.componentSetup.questionAnswers[0].questionAnswer);
            b.find(".text_control").addClass(this.componentSetup.size).attr("id", "preview_"+this.cid);
            "true" != this.componentSetup.isSystemDate && 1 !=this.componentSetup.isSystemDate||b.find(".field_value_js").attr("value",new Date().format(this.componentSetup.format));
            "true" != this.componentSetup.isSystemDate && 1 !=this.componentSetup.isSystemDate||"true" != this.componentSetup.isReadOnly && 1 !=this.componentSetup.isReadOnly||b.find(".field_value_js").attr("disabled","disabled");
            c.append(b);
        },
        renderEditPreview: function(d) {
            var c = $(this.tpl).siblings("#form_datecomponent");
            h.prototype.renderEditPreview.call(this, d, c);
            d.append(c);
        },
        checkEvents:function(e,r,m){
        	var id="#preview_"+this.cid,
				str="#preview_widget_control "+id,
				format=this.componentSetup.format,
				istime=false;
        	if(m){
                str="#widget_control "+id;
            }
        	format=="YYYY-MM-DD hh:mm" ? istime=true : istime=false;
			$(document).on("click.preview", str,function(){
				laydate({
				   elem: id,
				   format: format,
	  			   istime: istime
				});
			});
        },
        submitCheck: function(e) {
            var v=e.val();
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required)&&$.trim(v)==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var c = $.trim(d.val());
            var f = {
                fieldId2: this.componentSetup.fieldId2,
                fieldName: this.componentSetup.fieldName,
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: ""
                }]
            };
            return f;
        }
	});
	u.exports = window.DateComponent;
});
//手机
define("form/component/mobile", ["form/editablecomponent","form/tplutil"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil");
	window.Mobile = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "Mobile",
				title: "手机"
            };
            if(null != c) {
                a.title = c.title, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			this.tpl = e.get("mobile");
		},
		render: function(d){
            var c = $(this.tpl).siblings("#form_mobile");
            h.prototype.render.call(this, d, c);
            d.html(c.html());
        },
        renderEditor:function(){
        	var d = $(this.tpl).siblings("#editor_mobile");
        	h.prototype.renderEditor.call(this, d);
        	d.find("input:radio[name='tSize']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            d.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
        	$("#edit_widget").html(d.html());
        },
        renderPreview:function(d, c, a){
        	var f = $(this.tpl).siblings("#form_mobile");
        	h.prototype.renderPreview.call(this, d, c, a, f);
            this.componentSetup.questionAnswers&&this.componentSetup.questionAnswers[0] && f.find(".text_control").val(this.componentSetup.questionAnswers[0].questionAnswer);
        	f.find(".text_control").addClass(this.componentSetup.size).attr("id", "preview_"+this.cid);
            d.append(f);
        },
        renderEditPreview: function(d) {
            var c = $(this.tpl).siblings("#form_mobile");
            h.prototype.renderEditPreview.call(this, d, c);
            d.append(c);
        },
        checkEvents:function(e,r,m){
        	if(!m){
                var isMobile=/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
                var id="#preview_"+this.cid,
                str="#preview_widget_control "+id,
                required="true" == this.componentSetup.required || 1 ==this.componentSetup.required;
                if(m){
                    str="#widget_control "+id;
                }
                $(document).on("blur.preview", str,function(b){
                    b=$.trim($(this).val());
                    if(b==""&&required){
                        art.dialog({content: '手机号码不能为空！',icon: 'warning',time: 1.5});
                    }else{
                        if(!isMobile.test(b)&&b!=""){
                            art.dialog({content: '手机格式有误，请输入有效的手机号码！',icon: 'warning',time: 1.5});
                        }
                    }
                });
            }
        },
        submitCheck: function(e) {
            var v=$.trim(e.val());
            var isMobile=/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
            if(!isMobile.test(v) && v!=""){
                art.dialog({content: '手机格式有误，请输入有效的手机号码！',icon: 'warning',time: 1.5});
                return 1;
            }
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required) && v==""){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var c = $.trim(d.val());
            var f = {
                fieldId2: this.componentSetup.fieldId2,
                fieldName: this.componentSetup.fieldName,
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                questionAnswers: [{
                    questionId: "",
                    questionAnswer: c,
                    content: ""
                }]
            };
            return f;
        }
	});
	u.exports = window.Mobile;
});
//多行多选输入框
define("form/component/multipleTextArea", ["form/editablecomponent","form/tplutil","form/component/option"],
		function(p,s,u){
	var h=p("form/editablecomponent"),
	e=p("form/tplutil"),
	d = p("form/component/option");
	window.MultipleTextArea = h.extend({
		initialize:function(c){
			h.prototype.initialize.call(this, c);
			var a = {
				componentKey: "MultipleTextArea",
				title: "多选输入框",
                layout: "choicelist_inline",
                options: []
            };
            if(null != c) {
                a.title = c.title, a.layout = c.layout, a.options = c.options, a.selfId=c.selfId;
            } else {
                a.selfId=this.cid;
            }
			this.componentSetup = $.extend(this.componentSetup, a);
			if (!this.componentSetup.options || 0 == this.componentSetup.options.length) {
                c = new d;
                c.setName("选项1");
                c.setOrder(0);
                a = new d;
                a.setName("选项2");
                a.setOrder(1);
                var f = new d;
                f.setName("选项3");
                f.setOrder(2);
                this.componentSetup.options = [];
                this.componentSetup.options[0] = c.componentSetup;
                this.componentSetup.options[1] = a.componentSetup;
                this.componentSetup.options[2] = f.componentSetup;
            }
			this.tpl = e.get("multipleTextArea");
		},
        setLayout: function(c){
            this.componentSetup.layout = c;
        },
        setOptions: function(c) {
            this.componentSetup.options = c;
        },
		render: function(a){
            var c = $(this.tpl).siblings("#form_multipleTextArea");
            h.prototype.render.call(this, a, c);
            var f = c.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            if (this.componentSetup.options && 0 < this.componentSetup.options.length) {
                f.html("");
                for (var b = 0; b < this.componentSetup.options.length; b++)(new d(this.componentSetup.options[b])).render(f, this);
            }
            a.html(c.html());
        },
        renderEditor:function(){
        	var c = $(this.tpl).siblings("#editor_multipleTextArea");
        	h.prototype.renderEditor.call(this, c);
        	for (var a = c.find("ul.choicelistEdit_js"), f = 0; f < this.componentSetup.options.length; f++) {
                var b = this.componentSetup.options[f]; (new d(b)).renderEditor(a, this);
                "true" != b.other && 1 != b.other || (c.find(".plus_other_js").parent().hide(),c.find(".plus_other_js").parent().next().css({"margin-left":"28px"}));
            }
        	c.find("input:radio[name='layout']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='layout'][value='" + this.componentSetup.layout + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
        	c.find("input:radio[name='tSize']").each(function(){
            	$(this).next().removeClass("r_checked").addClass("r_unchecked");
            });
            c.find("input:radio[name='tSize'][value='" + this.componentSetup.size + "']").attr("checked", true).next().removeClass("r_unchecked").addClass("r_checked");
        	$("#edit_widget").html(c.html());
        },
        renderPreview:function(c, a, f){
        	var b = $(this.tpl).siblings("#form_multipleTextArea"),
        		g = b.find(".choicelist_js");
        	g.addClass(this.componentSetup.layout);
        	for (var k = 0; k < this.componentSetup.options.length; k++){
        		(new d(this.componentSetup.options[k])).renderPreview(g, this);
        	}
            h.prototype.renderPreview.call(this, c, a, f, b);
            c.append(b);
        },
        renderEditPreview: function(c) {
            var a = $(this.tpl).siblings("#form_multipleTextArea");
            h.prototype.renderEditPreview.call(this, c, a);
            var f = a.find(".choicelist_js");
            f.addClass(this.componentSetup.layout);
            var b = this.componentSetup.options;
            if (null != b && 0 < b.length) {
                f.html("");
                for (var g = 0; g < b.length; g++)(new d(b[g])).render(f, this);
            }
            c.append(a);
        },
        checkEvents:function(e){},
        submitCheck: function(e) {
            var c=true;
            e.find("textarea").each(function(b){
                b=$.trim($(this).val());
                if(b==""){
                    c=false;
                    return c;
                }
            });
            if(("true" == this.componentSetup.required || 1 ==this.componentSetup.required) && !c){
                return 9;
            }
            return 0;
        },
        getValue: function(d) {
            var f = {
                componentKey: this.componentSetup.componentKey,
                questionId: this.componentSetup.fieldId,
                quoteQuestionId: this.componentSetup.quoteQuestionId,
                questionAnswers:[]
            };
            d.find("textarea").each(function(b){
                f.questionAnswers[b]={
                    questionId: $(this).attr("id"),
                    questionAnswer: $.trim($(this).val()),
                    content: "",
                    quoteQuestionId: $(this).attr("quoteQuestionId"),
                    quoteQuestionAnswer: ""
                };
            });
            return f;
        }
	});
	u.exports = window.MultipleTextArea;
});
//一行几列布局
define("form/component/columnpanel", ["form/component","form/tplutil"],
		function(p,s,u){
	var h=p("form/component"),
	e=p("form/tplutil");
	window.ColumnPanel = h.extend({
		initialize:function(d){
			this.componentSetup = {
	            componentKey: "ColumnPanel",
	            title: "",
	            layoutDetail: [],
	            order: 0,
	            index: 0,
	            size: "1"
	        };
			null != d && (this.componentSetup.title = d.title, this.componentSetup.layoutDetail = d.layoutDetail, this.componentSetup.order = d.order, this.componentSetup.index = d.index, this.componentSetup.size = d.size);
			this.tpl = e.get("columnpanel");
		},
		render: function(d){
			var c = $(this.tpl);
            this.componentSetup.size = d.attr("componentsize");
            c = c.siblings("#layout_columnPanel_" + this.componentSetup.size);
            d.attr("class", c.attr("class"));
            d.html(c.html());
        },
        renderEditor:function(){},
        renderPreview:function(e){
        	if (1 < this.componentSetup.size) {
                var d = $(this.tpl).siblings("#layout_columnPanel_" + this.componentSetup.size);
                d.attr("componentkey",this.componentSetup.componentKey);
                d.find(".form_layout_toolbar").remove();
                d.removeAttr("id");
                e.append(d);
                return d.find(".columns_js").children();
            }
        },
        renderEditPreview: function(e) {
        	if (1 < this.componentSetup.size) {
                var d = $(this.tpl).siblings("#layout_columnPanel_" + this.componentSetup.size);
                d.attr("id", "");
                d.data("componentData", this);
                e.append(d);
                return d.find(".columns_js").children();
            }
        },
        checkEvents: function(e){}
	});
	u.exports = ColumnPanel;
});
//表格布局
define("form/component/tablelayout", ["form/component", "form/tplutil", "form/component/table"],
		function(p, s, u) {
	var h = p("form/component"),
    e = p("form/tplutil");
    p("form/component/table");
    window.TableLayout = h.extend({
		initialize:function(d){
			this.componentSetup = {
                componentKey: "TableLayout",
                layoutDetail: [],
                order: 0,
                index: 0,
                rows: 4,
                cols: 3,
                thArray: [],
                tableId: "",
                fieldReads: [],
                fieldWrites: [],
                windowWidth: "" //存储表单保存时，屏幕编辑区域的宽度，为后续在不同分辨率情况下打开做缩放使用
            };
            null != d && (this.componentSetup.title = d.title, this.componentSetup.layoutDetail = d.layoutDetail, this.componentSetup.order = d.order, this.componentSetup.index = d.index, this.componentSetup.rows = d.rows, this.componentSetup.cols = d.cols, this.componentSetup.thArray = d.thArray, this.componentSetup.tableId = d.tableId, this.componentSetup.fieldReads = d.fieldReads, this.componentSetup.fieldWrites = d.fieldWrites, this.componentSetup.windowWidth = d.windowWidth);
            this.tpl = e.get("tablelayout");
		},
		render: function(e){
			var d = $(this.tpl).siblings("#table_layout");
            e.attr("class", d.attr("class"));
            e.html(d.html());
            this.table = e.find(".j_table").table({
                rows: this.componentSetup.rows,
                cols: this.componentSetup.cols,
                afterCreateCell: function(c, a) {
                    $(document).trigger("afterCreateCell", {
                        cell: a
                    });
                },
                beforeChangeCell: function(c, a) {
                    return !0;
                },
                afterChangeWidth: function(c, a) {
                	return !0;
                },
                afterDeleteCol: function(c) {
                    0 == c.options.cols && c.$table.closest(".table_layout_js").remove();
                },
                afterDeleteRow: function(c) {
                    0 == c.options.rows && c.$table.closest(".table_layout_js").remove();
                }
            });
        },
        renderEditor:function(){},
        renderPreview: function(e, d, c, a, q) {
            var f = $(this.tpl),
            b = this.componentSetup.layoutDetail;
            this.isReadOnly = c;
            if ("mobile" != window.systemInfo_form) {
                f = f.siblings("#preview_tablelayout");
                e.append(f);
                var g = this.componentSetup.rows,
                    cs = this.componentSetup.cols,
                k = $("<table class='table table-bordered'></table>");
                f.find(".j_tablelayout").append(k);
                var nw=$("#formContent").width();//获取当前打开表单的内容展示区域宽度

                if (g && 0 < g) for (var r = 0; r < g; r++) k.append($("<tr class=''></tr>"));
                if (b && 0 < b.length) for (r = 0; r < b.length; r++) {
                    var g = b[r],
                    n = Number(g.width);
                    n = Math.floor((n-cs)*nw/this.componentSetup.windowWidth);//做单元格的比例缩放
                    if (g && 0 < g.rowSpan && 0 < g.colSpan) {
                        var n = $("<td rowspan='" + g.rowSpan + "' colspan='" + g.colSpan + "' style='width:" + (n || "255") + "px'></td>"),
                        l = g.coordinate.split("_")[0];
                        k.find("tr").eq(~~l).append(n);
                        if (g.layoutDetail && 0 < g.layoutDetail.length) {
                            l = g.layoutDetail[0].componentKey;
                            var l = new window[l](g.layoutDetail[0]),
                            m = c;
                            if (!c && g.layoutDetail[0].fieldId && this.componentSetup.fieldWrites) {
                                var h = this.componentSetup.fieldWrites[g.layoutDetail[0].fieldId];
                                "undefined" == typeof h || h || (m = !0);
                            }
                            l.renderPreview(n, d, m);
                            l.checkEvents(null,m,q);//解决表格内字段控件事件无效的bug,例如时间控件不弹出时间框的bug
                            (g.layoutDetail[0].fieldId && this.componentSetup.fieldReads 
                            && (h = this.componentSetup.fieldReads[g.layoutDetail[0].fieldId], "undefined" == typeof h || h || n.find(".field_js").addClass("hide")));
                        }
                        n = n.parent();
                        //"TdLayout" == g.componentKey && 0 == n.find(".field_js").not(".hide").size() ? n.hide() : n.show();//判断到底要不要掩藏空tr
                    }
                }
                f.attr("id", "");
                f.attr("cid", this.cid);
            }
            this.el = e;
        },
        renderEditPreview: function(e,formObj) {
            var d = $(this.tpl).siblings("#table_layout");
            this.table = d.find(".j_table").table({
                rows: this.componentSetup.rows,
                cols: this.componentSetup.cols,
                tdArray: this.componentSetup.layoutDetail,
                thArray: this.componentSetup.thArray,
                windowWidth: this.componentSetup.windowWidth,
                afterCreateCell: function(c, a) {
                    $(document).trigger("afterCreateCell", {
                        cell: a
                    });
                },
                beforeChangeCell: function(c, a) {
                    return !0;
                },
                afterCreateBodyTd: function(c, a, f) {
                    if(f.layoutDetail && 0 < f.layoutDetail.length){
                        formObj.disable_edit && (f.layoutDetail[0].disableEditFromModify = true);
                        (new window[f.layoutDetail[0].componentKey](f.layoutDetail[0])).renderEditPreview(a);
                    }
                    //f.layoutDetail && 0 < f.layoutDetail.length && (new window[f.layoutDetail[0].componentKey](f.layoutDetail[0])).renderEditPreview(a);
                },
                afterChangeWidth: function(c, a) {
                	return !0;
                },
                afterDeleteCol: function(c) {
                	0 == c.options.cols && c.$table.closest(".table_layout_js").remove();
                },
                afterDeleteRow: function(c) {
                	0 == c.options.rows && c.$table.closest(".table_layout_js").remove();
                }
            });
            d.attr("id", "");
            d.attr("cid", this.cid);
            d.data("componentData", this);
            e.append(d);
        },
        checkEvents: function(e){},
        getTableSerialize: function(e, d) {
            var c = this.table,
            a = c.persist.storage,
            f = c.options,
            b = [],
            g = [];
            if (a && 0 < a.length) for (var k = 0; k < a.length; k++) {
                var r = k,
                n = a[k];
                if (n && 0 < n.length) for (var l = 0; l < n.length; l++) {
                    var m = n[l],
                    h = {
                        coordinate: r + f.separator + l,
                        rowSpan: 0,
                        colSpan: 0,
                        width: null,
                        height: null
                    };
                    if (m) {
                        h.rowSpan = m.rowSpan;
                        h.colSpan = m.colSpan;
                        h.width = $(m).width();
                        l == n.length - 1 && (h.width = $(m).width());
                        h.height = $(m).height();
                        var m = e.assemComponent(d, $(m).find(".field_js")),
                        p = [];
                        null != m && p.push(m.componentSetup);
                        h.componentKey = "TdLayout";
                        h.layoutDetail = p;
                    }
                    b.push(h);
                }
            } (c = c.$table.find("thead th")) && 0 < c.length && c.each(function() {
                g.push($(this).width() + 17);
            });
            this.componentSetup.layoutDetail = b;
            this.componentSetup.rows = f.rows;
            this.componentSetup.cols = f.cols;
            this.componentSetup.windowWidth = $("#formContent").width();
            this.componentSetup.thArray = g;
        }
	});
	u.exports = TableLayout;
});