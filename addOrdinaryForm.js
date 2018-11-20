//表单方法入口--p,s,u(require, exports, module)
define("form/formlayout", ["form/component/topic","form/form-plugin"],
		function(p,s,u){
	p("form/component/topic");
	var h = p("form/form-plugin");
	//a参数不可加var,必须是全局属性
	a = {
	    currentDrag: null,
        disable_edit:false
    };
	//字段控件拖动
	a.componentDraggableEvents = function(){
		a.fromAndColPanelSortable();
		$("#form_widget_list .widget_item").draggable({
			connectToSortable: "#widget_control",
            helper: "clone",
            appendTo: "body",
            start: function(b, f) {
                a.currentDrag = $(this);
                $(".ui-draggable-dragging").css({
                    height: "auto",
                    "float": "none",
                    width: "270px"
                });
            },
            stop: function(b, a) {}
        }).disableSelection();
		$("#layout_widget_list .widget_item").draggable({
			connectToSortable: "#widget_control",
            helper: "clone",
            appendTo: "body",
            start: function(b, f) {
                a.currentDrag = $(this);
                $(".ui-draggable-dragging").css({
                    height: "auto",
                    "float": "none",
                    width: "270px"
                });
            },
            stop: function(b, a) {}
        }).disableSelection();
	};
	//字段控件拖动排序
	a.fromAndColPanelSortable = function() {
        var b = $("#widget_control,.cell_js,.j_tablelayout td"),
        f = $("#widget_control");
        f.sortable({
            connectWith: b,
            placeholder: "form_placeholder_filed ",
            cancel: ".j_cancel_drag",//加上可防止input不可拖动
            stop: function(b, f) {
            	f.item.removeClass("field_move");
            	return a.sortableProcess(f.item);
            },
            over: function(b, a) {
            	a.item.addClass("field_move");
                $(this).find(".form_placeholder_filed").show();
            },
            out: function(b, a) {}
        }).disableSelection();
        f.find(".cell_js").sortable({
            connectWith: b,
            placeholder: "form_placeholder_filed ",
            cancel: ".j_cancel_drag",
            stop: function(b, f) {
            	f.item.removeClass("field_move");
            	return a.sortableProcess(f.item);
            },
            over: function(b, a) {
                if (1 <= $(this).find(".field_js").length){
                	$(this).find(".form_placeholder_filed").hide();
            	}else{
                    var f = a.item.attr("componentkey");
                    "ColumnPanel" != f && "TableLayout" != f || $(this).find(".form_placeholder_filed").hide();
                }
            },
            out: function(b, a) {}
        }).disableSelection();
        $(".j_tablelayout td").sortable({
            connectWith: b,
            placeholder: "form_placeholder_filed ",
            stop: function(b, f) {
            	f.item.removeClass("field_move");
            	return a.sortableProcess(f.item);
            },
            over: function(b, a) {
            	if (1 <= $(this).find(".field_js").length){
                	$(this).find(".form_placeholder_filed").hide();
            	}else {
                    var f = a.item.attr("componentkey");
                    "ColumnPanel" != f && "TableLayout" != f || $(this).find(".form_placeholder_filed").hide();
                }
            },
            out: function(b, a) {}
        }).disableSelection();
    };
    //左侧控件拖动结束，调用模块对象方法
    a.sortableProcess = function(b) {
        if (null != b && null != a.currentDrag) {
            var f = b.attr("componentKey");
            f = new window[f];
            f.render(b);
            b.data("componentData", f);
        }
        if(b.parent().hasClass("cell_js")&& 1 <= b.siblings().length){
        	if(null != a.currentDrag){
        		b.remove();
        	}else{
        		return false;
        	}
        }
        if(0 < b.parent("td").length && 1 <= b.siblings().length){
        	if(null != a.currentDrag){
        		b.remove();
        	}else{
        		return false;
        	}
        }
        if(null != b && b.hasClass("form_layout_js")||b.hasClass("table_layout_js")){
        	if(b.parent().hasClass("cell_js")|| 0 < b.parent("td").length){
        		if(null != a.currentDrag){
        			b.remove();
        		}else{
        			return false;
        		}
        	}
        }else{
        	null != b && b.hasClass("field_js") ? b.click() : null;
        }
        null != b && b.hasClass("form_layout_js") && a.fromAndColPanelSortable();
        null != b && b.hasClass("table_layout_js") && a.fromAndColPanelSortable();
        a.currentDrag = null;
    };
    //表单事件方法集
    a.formEvents = function(){
    	//绑定控件点击事件，触发添加active样式和右侧内容切换
    	$(document).on("click", "#widget_control .field_js",function(){
            $(document).trigger("renderEditor", $(this));
        });
    	$(document).off("renderEditor").on("renderEditor",function(b, a){
    		var g = $(a).data("componentData");
    		null != g && ($(".field_js").removeClass("field_active"),$(a).addClass("field_active"),g.renderEditor(),$(".edit_tab_js[edit-type='widget']").click());
    	});
        //切换跳转模式
        $(document).on("click", ".form_jump_type > span:not(.cannot)",function(){
            var _this = $(this);
            $(this).find(".r_unchecked").size() > 0 && art.dialog.confirm("此操作将使原有跳转全部失效，是否切换？",function (){
                _this.find('.r_unchecked').addClass('r_checked').removeClass("r_unchecked");
                _this.siblings().find('.r_checked').addClass('r_unchecked').removeClass("r_checked");
                if ($("#logic_jump_radio .r_checked").size() > 0) {
                    $(".subset_jump_js").parent().hide();
                    $(".logic_jump_js").parent().show();
                    $(".subset").removeClass('subset').each(function() {
                        $(this).data('componentData').setJumpProp('');
                    });
                    a.subset={};
                } else {
                    $(".subset_jump_js").parent().show();
                    $(".logic_jump_js").parent().hide();
                }
                $("#widget_control .field_js").each(function() { //清空所有jumpId
                    $(this).data("componentData").componentSetup.options && $.each($(this).data("componentData").componentSetup.options, function(i, item) {
                        item.jumpId = '';
                    });
                });
            });
        });
    	//删除控件
    	$(document).on("click", "#widget_control .widgetDel_js",function(){
			var _this=this;
    		art.dialog.confirm("确定要删除控件吗？",function (){
				var b = $(_this),
                a = b.parent(".field");
				b.parent(".field").hasClass("field_active") &&$("#edit_widget").html('<div class="form_edit_content"><div class="widget_warn"><span class="f_design_icon warn_icon"></span><span>请先选择控件</span></div></div>');
				a.remove();
			});
        });
    	//图片放大
    	$(document).on("click", ".widget_control .box img",function(e){
            $(this).viewer();
        });
    	//引用单题
        $(document).on("click", ".head .quoteQuestion_js",function(){
            var categoryId=$("#categoryIdValue").val();
            art.dialog.open("toQuoteSingleQuestion.htm?categoryDTO.categoryType=5&formDTO.categoryId="+categoryId,{
                width : 390,
                height : 274,
                lock : true,
                resize : false,
                title : '引用单题'
            });
        });
		//预览
		$(document).on("click", ".head .preview_js",function() {
			$(".head .operbtns ul").prepend('<li class="btn_lake pull_left back_js">返回</li>');
			$(".head .operbtns ul .showIntro_js").hide()&&$(".head .operbtns ul .preview_js").hide()&&$(".head .operbtns ul .quoteQuestion_js").hide();
			var b = new ColumnPanel,
            g = [];
            $("#widget_control").children().each(function(b) {
                var f = a.assemComponent(b, $(this));
                if (null == f) return true;
                g[b] = f.componentSetup;
            });
            b.componentSetup.layoutDetail = g;
            b = b.toStringify();
            $("#preview_widget_control").html("");
            h.renderForm({
                parentEl: $("#preview_widget_control"),
                layoutDetail: b,
                callback: function(b) {}
            });
            $("#formPreviewContent .form_head_title").text($("#formContent .form_head_title").text());
			$("#formPreviewContent .form_head_desc").text($("#formContent .form_head_desc").text());
			$("#formPreviewContent .form_bottom_desc").text($("#formContent .form_bottom_desc").text());
			$("#form_preview_js").removeClass("hide")&&$("#wrapper_content").css({"position":"absolute","left":"-9999px"});//解决IE8css序号不显示问题
			a.previewEvents();
        });
		//返回
		$(document).on("click", ".head .back_js",function() {
			$(".head .operbtns ul .back_js").remove();
			$(".head .operbtns ul .showIntro_js").show()&&$(".head .operbtns ul .preview_js").show()&&$(".head .operbtns ul .quoteQuestion_js").show();
			$("#form_preview_js").addClass("hide")&&$("#wrapper_content").css({"position":"relative","left":"0"});//解决IE8css序号不显示问题
			$(document).off(".preview");
        });
		//删除布局控件
    	$(document).on("click", "#widget_control .layoutDel_js",function(){
			var _this=this;
    		art.dialog.confirm("确定要删除控件吗？",function (){
				var b = $(_this),
                a = b.parents(".form_layout_js");
				if (a && 0 < a.length) {
					a.find(".field_active").length>0 &&$("#edit_widget").html('<div class="form_edit_content"><div class="widget_warn"><span class="f_design_icon warn_icon"></span><span>请先选择控件</span></div></div>');
					a&&0<a.length?a.remove():null;
				}else{
					var t = b.parents(".table_layout_js");
					if (t && 0 < t.length) {
						t.find(".field_active").length>0 &&$("#edit_widget").html('<div class="form_edit_content"><div class="widget_warn"><span class="f_design_icon warn_icon"></span><span>请先选择控件</span></div></div>');
						t&&0<t.length?t.remove():null;
					}
				}
			});
        });
        //保存并发布
        $(document).on("click", ".head .submit_js",function() {
            var formTitle=$.trim($("#form_title").val());
            if(formTitle==null||formTitle==""){
                $(".back_js").click();
                $(".edit_tab_js[edit-type='form']").click();
                $("#edit_form .c_danger").show();
                return false;
            }
            art.dialog.confirm("确定要保存并发布表单吗？",function (){
                var b = new ColumnPanel,
                    c = [];
                $("#widget_control").children().each(function(b) {
                    var g = a.assemComponent(b, $(this));
                    if (null == g) return true;
                    c[b] = g.componentSetup;
                });
                b.componentSetup.layoutDetail = c;
                var layoutDetail = b.toStringify(),
                    m = {};
                m["beginContent"] = $("#form_beginContent").val();
                m["jumpType"] = ($("#logic_jump_radio .r_checked").size() > 0 ? 1 : 2);
                m["endContent"] = $("#form_endContent").val();
                m["formTitle"] = formTitle;
                m["formId"] = $("#formIdValue").val();
                m["id"] = $("#idValue").val();
                m["formType"] = $("#formTypeValue").val();
                m["categoryId"] = $("#categoryIdValue").val();
                m["formVersion"] = $("#formVersionValue").val()!=null&&$("#formVersionValue").val()!=""?$("#formVersionValue").val():"1.0";
                m["layoutDetail"] = layoutDetail;
                var ajax_url="/hug_interview/repository/saveForm.htm";
                var requestObj=a.analyseRequest();
                if(requestObj["openType"]==1){//openType为1表示引用的请求
                    ajax_url="/hug_interview/repository/quoteFormByUpdate.htm"
                }
                $.ajax({
                    type:"post",
                    url:ajax_url,
                    data:{"formDTO.formJson":JSON.stringify(m),"formDTO.operationType":requestObj["formDTO.operationType"]},
                    success:function(){
                        art.dialog({
                            content:"保存成功！",
                            time:1.5,
                            icon:"succeed"
                        });
                        $(".head .submit_js").remove();
                        //刷新打开页面父页面列表
                        if(window.opener){
                            if(requestObj["openType"]!=1) {//openType为1表示引用的请求
                                window.opener.art.dialog.opener.flushList();
                                var categoryParent = window.opener.art.dialog.opener.parent;
                                $.trim($("#idValue").val()) == "" && categoryParent.$("li.current .num span").text((parseInt(categoryParent.$("li.current .num span").text()) + 1));
                            }
                            window.opener.art.dialog.open.api && window.opener.art.dialog.open.api.close();
                        }
                        setTimeout(function(){
                            window.close();
                        },1500);
                    },
                    error:function () {
                        art.dialog({
                            content:"保存失败！",
                            time:1.5,
                            icon:"error"
                        });
                    }
                });
            });
        });
    };
    //预览-单个控件内容整合
    a.assemComponent = function(b, g) {
        var f = g.data("componentData");
        if (null == f || null == f.componentSetup) return null;
        f.componentSetup.order = b;
        if ("ColumnPanel" == f.componentSetup.componentKey) {
            var c = [];
            g.find(".cell_js ").each(function(b) {
                var g = new ColumnPanel,
                f = [];
                $(this).children().each(function(b) {
                    var g = a.assemComponent(b, $(this));
                    if (null == g) return true;
                    f[b] = g.componentSetup;
                });
                g.componentSetup.layoutDetail = f;
                g.componentSetup.index = b;
                c[b] = g.componentSetup;
            });
            f.componentSetup.layoutDetail = c;
        }else if("TableLayout" == f.componentSetup.componentKey){
        	f.getTableSerialize(a, b);
        }
        return f;
    };
    //控件设置方法集
    a.componentSetupEvents=function(){
    	//修改标题keydown
    	$(document).on("keydown", "#edit_widget #component_title",function(b) {
            b = $.trim($(this).val());
            $("#widget_control .field_active .widget_title .widget_title_js").text(b);
            $("#widget_control .field_active").data("componentData").setTitle(b);
        });
    	//修改标题keyup
    	$(document).on("keyup", "#edit_widget #component_title",function(b) {
            b = $.trim($(this).val());
            $("#widget_control .field_active .widget_title .widget_title_js").text(b);
            $("#widget_control .field_active").data("componentData").setTitle(b);
        });
    	//修改标题布局
    	$(document).on("change","#edit_widget input:radio[name='title_layout']",function(b){
    		b=$(this).val();
            $("#edit_widget input:radio[name='title_layout']").each(function(b) {
            	$(this).is(":checked")?$(this).next().removeClass("r_unchecked").addClass("r_checked"):$(this).next().removeClass("r_checked").addClass("r_unchecked");
            	b = $(this).val();
                $("#widget_control .field_active").removeClass(b);
            });
            $("#widget_control .field_active").addClass(b);
            $("#widget_control .field_active").data("componentData").setTitleLayout(b);
    	});
    	//修改必填项目
    	$(document).on("change","#edit_widget #required",function(b){
    		(b = $(this).is(":checked")) ? ($("#widget_control .field_active").addClass("field_required"),$("#widget_control .field_active .widget_title .widget_required_js").text(" *"),$(this).next().removeClass("sc_unchecked").addClass("sc_checked"))
    				 : ($("#widget_control .field_active").removeClass("field_required"),$("#widget_control .field_active .widget_title .widget_required_js").text(""),$(this).next().removeClass("sc_checked").addClass("sc_unchecked"));
            $("#widget_control .field_active").data("componentData").setRequired(b);
    	});
    	//修改控件大小
    	$(document).on("change","#edit_widget input:radio[name='tSize']",function(b){
    		b=$(this).val();
    		var d=$("#widget_control .field_active").data("componentData");
            $("#edit_widget input:radio[name='tSize']").each(function(b) {
            	$(this).is(":checked")?$(this).next().removeClass("r_unchecked").addClass("r_checked"):$(this).next().removeClass("r_checked").addClass("r_unchecked");
            	b = $(this).val();
                $("#widget_control .field_active .text_control").removeClass(b);
                $("#widget_control .field_active .chosen-container").removeClass(b);
            });
            "Select" == d.componentSetup.componentKey?$("#widget_control .field_active .chosen-container").addClass(b):$("#widget_control .field_active .text_control").addClass(b);
            d.setSize(b);
    	});
    	//掩藏标题
    	$(document).on("change","#edit_widget #isHideTitle",function(b){
    		(b = $(this).is(":checked")) ? ($("#widget_control .field_active").addClass("field_notitle"),$("#widget_control .field_active .widget_title_js").addClass("hide"),$(this).next().removeClass("sc_unchecked").addClass("sc_checked"))
    				:($("#widget_control .field_active").removeClass("field_notitle"),$("#widget_control .field_active .widget_title_js").removeClass("hide"),$(this).next().removeClass("sc_checked").addClass("sc_unchecked"));
    		$("#widget_control .field_active").data("componentData").setIsHideTitle(b);
    	});
    	//掩藏边框
    	$(document).on("change","#edit_widget #isHideBorder",function(b){
    		(b = $(this).is(":checked")) ? ($("#widget_control .field_active .text_control").addClass("nobd"),$(this).next().removeClass("sc_unchecked").addClass("sc_checked"))
    				:($("#widget_control .field_active .text_control").removeClass("nobd"),$(this).next().removeClass("sc_checked").addClass("sc_unchecked"));
    		$("#widget_control .field_active").data("componentData").setIsHideBorder(b);
    	});
    	//默认值
    	$(document).on("change","#edit_widget #isDefault",function(b){
    		(b = $(this).is(":checked")) ? ($("#widget_control .field_active .widget_content .field_value_js").val($("#widget_control .field_active").data("componentData").getContent()),$("#default_value").removeClass("hide"),$(this).next().removeClass("sc_unchecked").addClass("sc_checked"))
    				:($("#widget_control .field_active .widget_content .field_value_js").val(""),$("#default_value").addClass("hide"),$(this).next().removeClass("sc_checked").addClass("sc_unchecked"));
    		$("#widget_control .field_active").data("componentData").setIsDefault(b);
    	});
    	//默认值内容keydown
    	$(document).on("keydown", "#edit_widget #default_content",function(b) {
            b = $.trim($(this).val());
            $("#widget_control .field_active .widget_content .field_value_js").val(b);
            $("#widget_control .field_active").data("componentData").setContent(b);
        });
    	//默认值内容keyup
    	$(document).on("keyup", "#edit_widget #default_content",function(b) {
            b = $.trim($(this).val());
            $("#widget_control .field_active .widget_content .field_value_js").val(b);
            $("#widget_control .field_active").data("componentData").setContent(b);
        });
    	//只读
    	$(document).on("change","#edit_widget #isReadOnly",function(b){
    		(b = $(this).is(":checked")) ? ($("#widget_control .field_active .widget_content .field_value_js").attr("readonly","readonly"),$(this).next().removeClass("sc_unchecked").addClass("sc_checked"))
    				:($("#widget_control .field_active .widget_content .field_value_js").removeAttr("readonly"),$(this).next().removeClass("sc_checked").addClass("sc_unchecked"));
    		$("#widget_control .field_active").data("componentData").setIsReadOnly(b);
    	});
    	//单图片上传
    	$(document).on("change","#edit_widget #isSingle",function(b){
    		(b = $(this).is(":checked")) ? ($(this).next().removeClass("sc_unchecked").addClass("sc_checked")):($(this).next().removeClass("sc_checked").addClass("sc_unchecked"));
            $("#widget_control .field_active").data("componentData").setIsSingle(b);
    	});
    	//切换布局
    	$(document).on("change", "#edit_widget input:radio[name='layout']",function(b){
            b=$(this).val();
            $("#edit_widget input:radio[name='layout']").each(function(b) {
            	$(this).is(":checked")?$(this).next().removeClass("r_unchecked").addClass("r_checked"):$(this).next().removeClass("r_checked").addClass("r_unchecked");
            	b = $(this).val();
                $("#widget_control .field_active .choicelist_js").removeClass(b);
            });
            $("#widget_control .field_active .choicelist_js").addClass(b);
            $("#widget_control .field_active").data("componentData").setLayout(b);
        });
    	//选项设置——选项名称keydown
    	$(document).on("keydown", "#edit_widget .optionName_js",function(b) {
            b = $.trim($(this).val());
            var a=$(this).parent(),
            d=$("#widget_control .field_active").data("componentData");
            a = $("#edit_widget ul.choicelistEdit_js>li").index(a);
            "Select" == d.componentSetup.componentKey?$("#widget_control .field_active .choicelist_js option").eq(a+1).text(b):$("#widget_control .field_active .choicelist_js li").eq(a).find("span").text(b);
            d.componentSetup.options[a].name = b;
        });
    	//选项设置——选项名称keyup
    	$(document).on("keyup", "#edit_widget .optionName_js",function(b) {
    		b = $.trim($(this).val());
            var a=$(this).parent(),
            d=$("#widget_control .field_active").data("componentData");
            a = $("#edit_widget ul.choicelistEdit_js>li").index(a);
            "Select" == d.componentSetup.componentKey?$("#widget_control .field_active .choicelist_js option").eq(a+1).text(b):$("#widget_control .field_active .choicelist_js li").eq(a).find("span").text(b);
            d.componentSetup.options[a].name = b;
        });
    	//选项设置——是否异常
    	$(document).on("change","#edit_widget input:checkbox[name='error_option']",function(b){
    		(b = $(this).is(":checked")) ? ($(this).parents("li").find(".optionError_js").removeClass("hide"),$(this).next().removeClass("sc_unchecked").addClass("sc_checked"))
    				:($(this).parents("li").find(".optionError_js").addClass("hide"),$(this).next().removeClass("sc_checked").addClass("sc_unchecked"));
    		var a=$(this).parents("li");
            a = $("#edit_widget ul.choicelistEdit_js>li").index(a);
            $("#widget_control .field_active").data("componentData").componentSetup.options[a].isError = b;
    	});
    	//选项设置——选项异常内容keydown
    	$(document).on("keydown", "#edit_widget .optionError_js",function(b) {
            b = $.trim($(this).val());
            var a=$(this).parent();
            a = $("#edit_widget ul.choicelistEdit_js>li").index(a);
            $("#widget_control .field_active").data("componentData").componentSetup.options[a].errorContent = b;
        });
    	//选项设置——选项异常内容keyup
    	$(document).on("keyup", "#edit_widget .optionError_js",function(b) {
    		b = $.trim($(this).val());
            var a=$(this).parent();
            a = $("#edit_widget ul.choicelistEdit_js>li").index(a);
            $("#widget_control .field_active").data("componentData").componentSetup.options[a].errorContent = b;
        });
    	//选项设置——添加选项
    	$(document).on("click", "#edit_widget .option_plus_js",function(b) {
            if(!$(this).hasClass("option_disabled")) {
                b = $("#widget_control .field_active").data("componentData");
                var f = $("#edit_widget .choicelistEdit_js");
                var c = new Option;
                $(this).parents("li").hasClass("otherOption_js") && (c.setOther(!0),c.setName("其他"));
                c.renderEditor(f, b, $(this).parents("li"));
                a.changeFormOption();
            }
        });
    	//选项设置——删除选项
    	$(document).on("click", "#edit_widget .option_minus_js",function(b) {
            if(!$(this).hasClass("option_disabled")) {
                b = $(this).parent("li");
                if (b.siblings("li").length < 2) {
                    art.dialog({
                        content: '必须保留至少2项选择！',
                        icon: 'warning',
                        time: 1.0
                    });
                } else {
                    //b.hasClass("otherOption_js") && ($("#edit_widget .plus_other_js").parent().show(), $("#edit_widget .plus_other_js").parent().next().css({"margin-left": "3px"})),
                    b.remove(), a.changeFormOption();
                }
            }
        });
        //填充字段
        $(document).on("click", "#edit_widget .filling_field_text",function(b) {
            art.dialog.open("form/fillingField.html",{
                width : 450,
                height : 300,
                lock : true,
                resize : false,
                title : '自动填充设置'
            });
        });
    	//选项设置——添加其他
    	$(document).on("click", "#edit_widget .plus_other_js",function(b) {
            art.dialog.open("form/other.html",{
                width : 304,
                height : 334,
                lock : true,
                resize : false,
                title : '添加其他'
            });
    	    /*$(this).parent().hide();
    		$(this).parent().next().css({"margin-left":"28px"});
            b = $("#widget_control .field_active").data("componentData");
            var f = $("#edit_widget .choicelistEdit_js");
            var c = new Option;
            c.setOther(!0);
            c.setName("其他");
            c.renderEditor(f, b);
            a.changeFormOption();*/
    		/*$(this).parent().hide();
             $(this).parent().next().css({"margin-left":"28px"});
    		b = $("#widget_control .field_active").data("componentData");
            var f = $("#edit_widget .choicelistEdit_js"),
            c = new Option;
            c.setOther(!0);
            c.renderEditor(f, b);
            a.changeFormOption();*/
        });
    	//选项设置——批量编辑
    	$(document).on("click", "#edit_widget .batch_plus_js",function(b) {
    		art.dialog.open("form/editor.html",{
				width : 390,
				height : 394,
				lock : true,
				resize : false,
				title : '批量编辑'
		    });
        });
    	//选项设置——附加宣教
        $(document).on("click", "#edit_widget .plus_education_js",function(b) {
            art.dialog.open("form/plusEducation.html",{
                width : 486,
                height : 344,
                lock : true,
                resize : false,
                title : '附加宣教'
            });
        });
        //选项设置——逻辑跳转
        $(document).on("click", "#edit_widget .logic_jump_js",function(b) {
            art.dialog.open("form/logicJump.html",{
                width : 486,
                height : 344,
                lock : true,
                resize : false,
                title : '逻辑跳转'
            });
        });
        //选项设置——子题跳转
        $(document).on("click", "#edit_widget .subset_jump_js",function(b) {
            art.dialog.open("form/subsetJump.html",{
                width : 486,
                height : 344,
                lock : true,
                resize : false,
                title : '子题跳转'
            });
        });
    	//选项设置——增加星
    	$(document).on("click", "#edit_widget .star_plus_js",function(b) {
    		b=$("#widget_control .field_active");
    		if(b.find(".MatrixRaty_js:eq(0) img").siblings("img").not("span").length>6){
            	art.dialog({
                	content: '最多保留7项选择！',
                    icon: 'warning',
                    time: 1.0
                });
            }else{
            	var clone=$("#edit_widget .secondChoicelistEdit_js .MatrixRatyStar_js:last").clone();
            	clone.find("input[type='text']").val("");
            	$("#edit_widget .secondChoicelistEdit_js").append(clone);
                var	c = new SecondOption;
                c.setComponentKey("MatrixRatyStar");
            	b.data("componentData").componentSetup.options[0].children.push(c.componentSetup);
	    		a.changeFormOption();
            }
        });
    	//选项设置——删除星
    	$(document).on("click", "#edit_widget .star_minus_js",function(b) {
    		b=$("#widget_control .field_active");
    		if(b.find(".MatrixRaty_js:eq(0) img").siblings("img").not("span").length<3){
            	art.dialog({
            		content: '必须保留至少2项选择！',
                    icon: 'warning',
                    time: 1.0
                });
            }else{
            	$("#edit_widget .secondChoicelistEdit_js .MatrixRatyStar_js:last").remove();
            	b.data("componentData").componentSetup.options[0].children.pop();
            	a.changeFormOption();
            }
        });
    	//第二层选项设置——是否异常
    	$(document).on("change","#edit_widget input:checkbox[name='error_secondOption']",function(b){
    		(b = $(this).is(":checked")) ? $(this).next().removeClass("sc_unchecked").addClass("sc_checked"):$(this).next().removeClass("sc_checked").addClass("sc_unchecked");
    		var a=$(this).parents("li").index();
    		$("#widget_control .field_active").data("componentData").componentSetup.options[0].children[a].isError = b;
    	});
    	//第二层选项设置——选项异常内容keydown
    	$(document).on("keydown", "#edit_widget .secondOptionError_js",function(b) {
            b = $.trim($(this).val());
            var a=$(this).parent().index();
            $("#widget_control .field_active").data("componentData").componentSetup.options[0].children[a].errorContent = b;
        });
    	//第二层选项设置——选项异常内容keyup
    	$(document).on("keyup", "#edit_widget .secondOptionError_js",function(b) {
    		b = $.trim($(this).val());
            var a=$(this).parent().index();
            $("#widget_control .field_active").data("componentData").componentSetup.options[0].children[a].errorContent = b;
        });
    	//切换组件类型
    	$(document).on("change","#edit_widget input:radio[name='componentType']",function(b){
    		var a=$(this).val();
    		b=$("#widget_control .field_active");
    		var f = b.data("componentData");
    		a = new window[a];
    		a.change({
                oldObj: f,
                changeEl: b
            });
    		b.data("componentData", a);
    	});
    	//日期格式设置
    	$(document).on("change","#edit_widget input:radio[name='dateFormat']",function(b){
    		b=$(this).val();
    		var d=$("#widget_control .field_active").data("componentData");
            $("#edit_widget input:radio[name='dateFormat']").each(function(b) {
            	$(this).is(":checked")?$(this).next().removeClass("r_unchecked").addClass("r_checked"):$(this).next().removeClass("r_checked").addClass("r_unchecked");
            	b = $(this).val();
            });
            d.setFormat(b);
    	});
    	//系统日期
    	$(document).on("change","#edit_widget #isSystemDate",function(b){
    		(b = $(this).is(":checked")) ? ($(this).parents(".checkbox").next(".checkbox").removeClass("hide"),$(this).next().removeClass("sc_unchecked").addClass("sc_checked"))
    				:($(this).parents(".checkbox").next(".checkbox").addClass("hide"),$(this).next().removeClass("sc_checked").addClass("sc_unchecked"));
    		$("#widget_control .field_active").data("componentData").setIsSystemDate(b);
    	});
        //不发送手机端
        $(document).on("change","#edit_widget #hideForMobile",function(b){
            (b = $(this).is(":checked")) ? $(this).next().removeClass("sc_unchecked").addClass("sc_checked")
                :$(this).next().removeClass("sc_checked").addClass("sc_unchecked");
            $("#widget_control .field_active").data("componentData").setHideForMobile(b);
        });
        //修改标题别名keydown
        $(document).on("keydown", "#edit_widget #component_alias",function(b) {
            b = $.trim($(this).val());
            $("#widget_control .field_active").data("componentData").setAlias(b);
        });
        //修改标题别名keyup
        $(document).on("keyup", "#edit_widget #component_alias",function(b) {
            b = $.trim($(this).val());
            $("#widget_control .field_active").data("componentData").setAlias(b);
        });
        //修改文字位置
        $(document).on("change","#edit_widget input:radio[name='tAlign']",function(b){
            b=$(this).val();
            var d=$("#widget_control .field_active").data("componentData");
            $("#edit_widget input:radio[name='tAlign']").each(function(b) {
                $(this).is(":checked")?$(this).next().removeClass("r_unchecked").addClass("r_checked"):$(this).next().removeClass("r_checked").addClass("r_unchecked");
                b = $(this).val();
                $("#widget_control .field_active .text_control").removeClass(b);
            });
            $("#widget_control .field_active .text_control").addClass(b);
            d.setTextAlign(b);
        });
        //不纳入统计
        $(document).on("change","#edit_widget #notStatistics",function(b){
            (b = $(this).is(":checked")) ? $(this).next().removeClass("sc_unchecked").addClass("sc_checked")
                :$(this).next().removeClass("sc_checked").addClass("sc_unchecked");
            $("#widget_control .field_active").data("componentData").setNotStatistics(b);
        });
        //院内保存后只读
        $(document).on("change","#edit_widget #replyForOnce",function(b){
            (b = $(this).is(":checked")) ? $(this).next().removeClass("sc_unchecked").addClass("sc_checked")
                :$(this).next().removeClass("sc_checked").addClass("sc_unchecked");
            $("#widget_control .field_active").data("componentData").setReplyForOnce(b);
        });
        //掩藏题目
        $(document).on("change","#edit_widget #isHideQuestion",function(b){
            (b = $(this).is(":checked")) ? ($(this).next().removeClass("sc_unchecked").addClass("sc_checked"),$("#widget_control .field_active .widgetHide_js").removeClass("hide"))
                :($(this).next().removeClass("sc_checked").addClass("sc_unchecked"),$("#widget_control .field_active .widgetHide_js").addClass("hide"));
            $("#widget_control .field_active").data("componentData").setIsHideQuestion(b);
        });
        //修改权重keydown
        $(document).on("keydown", "#edit_widget #weight, #edit_widget #weightTwo",function(e) {
            var which=parseInt(e.which,10);
            if(((which >= 48 && which <= 57)||(which >= 96 && which <= 105))||which==8||which==9||which==110||which==190){
                var b = parseFloat($.trim($(this).val()));
                var id = $(this).attr("id");
                if(id=="weight") {
                    $("#widget_control .field_active").data("componentData").setWeight(b);
                }else if(id=="weightTwo"){
                    $("#widget_control .field_active").data("componentData").setWeightTwo(b);
                }
            }else{
                art.dialog({
                    content: '权重只能是数字！',
                    icon: 'warning',
                    time: 1.0
                });
                e=e?e:window.event;
                e.preventDefault();
                $(this).focus();
            }
        });
        //修改权重keyup
        $(document).on("keyup", "#edit_widget #weight, #edit_widget #weightTwo",function(e) {
            var which=parseInt(e.which,10);
            if(((which >= 48 && which <= 57)||(which >= 96 && which <= 105))||which==8||which==9||which==110){
                var b = parseFloat($.trim($(this).val()));
                var id = $(this).attr("id");
                if(id=="weight") {
                    $("#widget_control .field_active").data("componentData").setWeight(b);
                }else if(id=="weightTwo"){
                    $("#widget_control .field_active").data("componentData").setWeightTwo(b);
                }
            }else{
                art.dialog({
                    content: '权重只能是数字！',
                    icon: 'warning',
                    time: 1.0
                });
                e=e?e:window.event;
                e.preventDefault();
                $(this).focus();
            }
        });
        //修改标题宽度keydown
        $(document).on("keydown", "#edit_widget #labelWidth",function(e) {
            var currKey=e.keyCode||e.which||e.charCode;
            //可通过键码包括删除键、下和左右键、数字键、小数点
            // 上键阻止默认事件为了防止光标移至input框最前
            if(!(currKey==40)&&!(currKey==46)&&!(currKey==110)&&!(currKey==37)&&!(currKey==39)&&!(currKey==190)&&!(currKey==8)&&!(currKey==9)&&!((currKey>=48&&currKey<=57)||(currKey>=96&&currKey<=105))){
                if (e && e.preventDefault) e.preventDefault(); else { event.returnValue = false; }
                currKey!=38 && art.dialog({ content: '标题宽度只能是数字！', icon: 'warning', time: 1.0});//向上键不提示
                $(this).focus();
            }
        });
        //修改标题宽度keyup
        $(document).on("keyup", "#edit_widget #labelWidth",function(e) {
            var b=$.trim($(this).val()).replace(/[^0-9.]/g,'');
            if(b != ""){
                b=parseFloat(b),currKey=e.keyCode||e.which||e.charCode;
                if(currKey==38){//向上按键
                    b++;
                }else if(currKey==40&&b>0){//向下按键
                    b--;
                }
                $(this).val(b);
                $("#widget_control .field_active .widget_title").css("width",b);
                $("#widget_control .field_active .widget_content").css("margin-left",b+2);
            }else {
                $("#widget_control .field_active .widget_title").css("width",'');
                $("#widget_control .field_active .widget_content").css("margin-left",'');
            }
            $("#widget_control .field_active").data("componentData").setLabelWidth(b);
        });
    };
    //表单设置方法集
    a.formSetupEvents = function(){
    	//修改表单标题keydown
    	$(document).on("keydown", "#edit_form #form_title",function(b) {
            b = $(this).val();
            $(".form_view_wrapper .form_view .form_head .form_head_title").text(b);
        });
    	//修改表单标题keyup
        $(document).on("keyup", "#edit_form #form_title",function(b) {
            b = $(this).val();
            $(".form_view_wrapper .form_view .form_head .form_head_title").text(b);
        });
        //表单标题失去焦点
        $(document).on("blur", "#edit_form #form_title",function(b) {
        	b = $.trim($(this).val());
        	"" == b ? $("#edit_form .c_danger").show():$("#edit_form .c_danger").hide();
        });
        //修改表单开头语keydown
    	$(document).on("keydown", "#edit_form #form_beginContent",function(b) {
            b = $(this).val();
            $(".form_view_wrapper .form_view .form_head .form_head_desc").text(b);
        });
    	//修改表单开头语keyup
        $(document).on("keyup", "#edit_form #form_beginContent",function(b) {
            b = $(this).val();
            $(".form_view_wrapper .form_view .form_head .form_head_desc").text(b);
        });
        //修改表单结束语keydown
    	$(document).on("keydown", "#edit_form #form_endContent",function(b) {
            b = $(this).val();
            $(".form_view_wrapper .form_view .form_bottom_desc").text(b);
        });
    	//修改表单结束语keyup
        $(document).on("keyup", "#edit_form #form_endContent",function(b) {
            b = $(this).val();
            $(".form_view_wrapper .form_view .form_bottom_desc").text(b);
        });
    };
    //操作手册介绍方法集
    a.formIntro = function(){
    	var b=[{
            element: "#formContainer_js #formContent",
            intro:'<div class="oper_intro"><span>表单编辑区</span><div class="intro_content"><p>可为表单设计排版</p><p>1、普通表单用于表单统计，请先拖拽布局控件进行表单样式设计；</p><p>2、可以随意拖拽控件的位置；</p><p> 3、可以删除不需要的控件；</p></div></div>',
            position: "left"
        },
        {
            element: "#form_widget #form_widget_list",
            intro:'<div class="oper_intro"><span>字段控件</span><div class="intro_content"><p>选择您需要的控件，以拖拽的方式拖到中间的表单编辑区；</p></div></div>',
            position: "right"
        },
        {
            element: "#formEdit_js #edit_widget",
            intro:'<div class="oper_intro"><span>控件设置</span><div class="intro_content"><p>可以设置当前选中控件的相关信息；</p></div></div>',
            position: "left"
        },
        {
            element: "#form_widget #layout_widget_list",
            intro:'<div class="oper_intro"><span>布局控件</span><div class="intro_content"><p>布局控件中可拖入字段控件，本身无显示效果；</p></div></div>',
            position: "right"
        },
        {
            element: ".head #head_right",
            intro:'<div class="oper_intro"><div class="intro_content"><p>1、预览：预览当前编辑的表单，返回继续进行修改；</p><p>2、保存并发布：保存之后，系统会启用该表单，请确认无误再进行该操作；</p></div></div>',
            position: "left"
        }];
    	introJs().setOptions({
            steps: b
        }).onbeforechange(function(b){
        	switch ($(b).attr("id")) {
            case "formContent":
                setTimeout(function() {
                    $(".introjs-tooltipReferenceLayer .introjs-tooltip").css({'min-width':'183px'});
                    $(".form_edition").css("z-index","99999999");
                },10);
                break;
            case "form_widget_list":
                $(".widget_tab_js[widget-type='form']").click();
                setTimeout(function() {
                    $(".introjs-tooltipReferenceLayer .introjs-tooltip").css({'min-width':'250px'});
                    $(".form_edition").css("z-index","99");
                },10);
                break;
            case "edit_widget":
                $(".edit_tab_js[edit-type='widget']").click();
                break;
            case "layout_widget_list":
            	$(".widget_tab_js[widget-type='layout']").click();
            	setTimeout(function() {
           		 	$(".introjs-helperLayer").removeClass("introjs-helperLayer-head");
                },10);
                break;
            case "head_right":
            	 setTimeout(function() {
                 	$(".introjs-helperLayer").addClass("introjs-helperLayer-head");
                 },10);
            	break;
            }
        }).start().refresh();
    };
    //选项设置改变事件
    a.changeFormOption = function() {
        var b = $("#widget_control .field_active").data("componentData"),
        a = $("#widget_control .field_active .choicelist_js");
        a.html("");
        "Select" == b.componentSetup.componentKey && a.append("<option value=''></option>");
        var f = [];
        $("#edit_widget ul.choicelistEdit_js").children().each(function(c) {
            var e = $(this).find(".optionName_js").val(),
            r=$(this).find(".optionError_js").val(),
            i=$(this).find("input:checkbox[name='error_option']").is(":checked"),
            required=$(this).find(".optionName_js").attr("required_option"),
            educationIds=$(this).find(".optionName_js").attr("educationIds"),
            objId=$(this).find(".optionName_js").attr("imageid"),
            filePath=$(this).find(".optionName_js").attr("imagesrc"),
            selfId=$(this).find(".optionName_js").attr("selfId"),
            children=b.componentSetup.options[0].children,
            w = !1;
            $(this).hasClass("otherOption_js") && (w = !0);//e = "其他"
            var m = new Option({
                name: e,
                order: c,
                other: w,
                errorContent:r,
                isError:i,
                objId: objId,
                filePath:filePath,
                children:children,
                selfId:selfId,
                required:required,
                educationIds:educationIds
            });
            m.render(a, b);
            f[c] = m.componentSetup;
        });
        b.setOptions(f);
        "Select" == b.componentSetup.componentKey && $("#widget_control .field_active .chosen_select_deselect").trigger("chosen:updated");
    };
    //添加其他确定回调
    a.otherOptionCallBack=function(l){
        var b = $("#widget_control .field_active").data("componentData");
        var f = $("#edit_widget .choicelistEdit_js");
        f.html("");
        for (var i = 0; i < l.length; i++){
            var c = new Option;
            c.setOther(l[i].other);
            c.setName(l[i].name);
            c.setOrder(l[i].order);
            c.setSelfId(l[i].selfId);
            c.setErrorContent(l[i].errorContent);
            c.setIsError(l[i].isError);
            c.setRequired(l[i].required);
            c.setScoreValue(l[i].scoreValue);
            c.setSatisfactionLevel(l[i].satisfactionLevel);
            c.setEducationIds(l[i].educationIds);
            c.renderEditor(f, b);
        }
        a.changeFormOption();
    };
    //批量编辑确定回调
    a.formOptionCallBack=function(l){
    	var b = $("#widget_control .field_active").data("componentData");
    	var f = $("#edit_widget ul.choicelistEdit_js");
    	var v = b.componentSetup.componentKey;
		var c = f.find("li." + v + "_js");
		var e;
		var m;
        for (var i = 0; i < l.length; i++){
	        m = l[i],
	        e = c.eq(i),
	        null == e.get(0) ? ((new Option({
	            name: m,
	            order: i,
	            index: 0,
	            other: !1
            })).renderEditor(f, b)) : e.find(".optionName_js").val(m);//, e = f.find(".otherOption_js"), f.remove(".otherOption_js"), f.append(e)) : e.find(".optionName_js").val(m);
        }
        l.length < c.length && f.find("li." + v + "_js:gt(" + (l.length - 1) + ")").remove();
        a.changeFormOption();
    };
    //附加宣教确定回调
    a.formEducationIdsCallBack=function(o){
        var i;
        var s=$("#widget_control .field_active").data("componentData").componentSetup;
        for(var j=0;j<s.options.length;j++){
            if(o[s.options[j].selfId]){
                i=$("#edit_widget ul.choicelistEdit_js").find("li#"+s.options[j].selfId).index();
                s.options[i].educationIds = o[s.options[j].selfId];
            }else{
                s.options[j].educationIds = "";
            }
        }
        $("#widget_control .field_active").data("componentData").renderEditor();
    };
    //为子题增加parentId 和topId
    a.setTopId=function(selfId, options) {
        a.subsets = a.subsets || {};
        a.subsets[selfId] = [];
        $.each(options, function(k, item) {
            item && $.each(item.split(','), function(m, n) {
                a.subsets[selfId].push(n);
            });
        });
        $(".subset").each(function() {
            $(this).removeClass('subset').data("componentData").setJumpProp('');
        });
        $.each(a.subsets, function(i, item) {
            $.each(item, function(m, n) {
                $("#widget_control .field_js[selfId=" + n + "]").addClass('subset').attr('parentId', i).attr('topId', $("#widget_control .field_js[selfId=" + i + "]").attr('topId') || i).data("componentData").setJumpProp(2);
                $("#widget_control .field_js[topId=" + n + "]").attr('topId', $("#widget_control .field_js[selfId=" + i + "]").attr('topId') || i);
            });
        });
    };
    //逻辑跳转确定回调
    a.formJumpIdsCallBack=function(o, subStatus){
        var i;
        var s=$("#widget_control .field_active").data("componentData").componentSetup;
        for(var j=0;j<s.options.length;j++){
            if(o[s.options[j].selfId]){
                i=$("#edit_widget ul.choicelistEdit_js").find("li#"+s.options[j].selfId).index();
                s.options[i].jumpId = o[s.options[j].selfId];
            }else{
                s.options[j].jumpId = "";
            }
        }
        if (subStatus) {
            a.setTopId(s.selfId,o);
        }
    };
    //清空跳题之间的答案内容
    a.clearContent=function(o1,o2,fieldJumpId){
        if (fieldJumpId) {
            $.each(fieldJumpId, function(i, item) {
                var _this = $("div.subset_hide[selfId="+item+"]");
                _this.find("textarea").val("");
                _this.find("input[type='text']").val("");
                _this.find("input[type='checkbox']").attr("checked", false).next().removeClass("sc_checked").addClass("sc_unchecked");
                _this.find("input[type='radio']").attr("checked", false).next().removeClass("r_checked").addClass("r_unchecked");
                _this.find(".raty_star_checked").parent().children().attr("class","raty_star_unchecked").attr("src","/hug_interview/resources/images/raty_star_unchecked.png");
                _this.find("select").val("").trigger("chosen:updated");
            });
        } else {
            o1.nextUntil(o2).each(function(){
                $(this).find("textarea").val("");
                $(this).find("input[type='text']").val("");
                $(this).find("input[type='checkbox']").attr("checked", false).next().removeClass("sc_checked").addClass("sc_unchecked");
                $(this).find("input[type='radio']").attr("checked", false).next().removeClass("r_checked").addClass("r_unchecked");
                $(this).find(".raty_star_checked").parent().children().attr("class","raty_star_unchecked").attr("src","/hug_interview/resources/images/raty_star_unchecked.png");
                $(this).find("select").val("").trigger("chosen:updated");
            });
        }
    };
    // 隐藏本题下所有后代题集  返回所有后代题集的selfId
    a.setSubset=function(field, fieldJumpId, kids, notFirst) {
        fieldJumpId = fieldJumpId || [];
        kids = kids || [];
        if (fieldJumpId.length == 0) {
            $.each(field.find("input[type='radio'], input[type='checkbox']"), function(i, item) {
                $(item).data("componentData").componentSetup.jumpId && (fieldJumpId = fieldJumpId.concat($(item).data("componentData").componentSetup.jumpId.split(',')));
            });
        }
        a.clearContent('','', fieldJumpId);
        kids = kids.concat(fieldJumpId);
        $.each(fieldJumpId, function(i, item) {
            notFirst && field.parent().find('.field_js[selfId='+item+']').addClass('subset_hide');
            kids = a.setSubset(field.parent().find(".field_js.subset_hide[selfId=" + item + "]"), [], kids, true);
        });
        return kids;
    };
    //预览方法集合-bind
    a.previewEvents=function(){
        $(document).on("change.preview","#preview_widget_control input[type='radio']",function(b){
            b=$(this).attr("name");
            $(this).parents(".widget_content").find(".widget_tip").remove();
            var d=$("#preview_widget_control input:radio[name='" + b + "']:checked");
            var optionData=d.data("componentData").componentSetup,
                field = $(this).parents(".field_js"),
                selfId = field.attr("selfId");
            if ($("#logic_jump_radio .r_checked").size() > 0) {
                $('div[jump_fieldId='+selfId+']').length > 0 && field.nextUntil('div[jump_fieldId='+selfId+']').removeClass("jump_hide");
                field.parent().find('div[jump_fieldId='+selfId+']').attr("jump_fieldId","");
                if(optionData.jumpId && field.parent().find('div[selfId='+optionData.jumpId+']').length>0){
                    a.clearContent(field,'div[selfId='+optionData.jumpId+']');
                    field.nextUntil('div[selfId='+optionData.jumpId+']').addClass("jump_hide");
                    field.parent().find('div[selfId='+optionData.jumpId+']').attr("jump_fieldId",selfId);
                }
            } else {
                var optionJumpId = optionData.jumpId ? $.trim(optionData.jumpId).split(',') : [];
                var fieldJumpId = [];
                $.each(field.find("input[type='radio']"), function(i, item) {
                    $(item).data("componentData").componentSetup.jumpId && (fieldJumpId = fieldJumpId.concat($(item).data("componentData").componentSetup.jumpId.split(',')));
                });
                $.each(fieldJumpId, function(i, item) {
                    field.parent().find('div[selfId='+item+']').addClass('subset_hide')
                });
                if (optionJumpId.length>0) {
                    $.each(optionJumpId, function(i, item) {
                        field.parent().find('div[selfId='+item+']').removeClass('subset_hide');
                    });
                }
                var kids = a.setSubset(field, fieldJumpId);
                a.clearContent([], [], kids);
            }
            var $p_obj=$(this).parents(".widget_content");
            var $t_obj=$p_obj.find(".widget_tip");
            if("true" == optionData.isError || 1 == optionData.isError){
                d.parents("li").addClass("option_error");
                optionData.errorContent && ($t_obj.length > 0 ? ($t_obj.html('提示：'+optionData.errorContent)) :
                    ($p_obj.append('<div class="widget_tip">提示：' + optionData.errorContent + '</div>')));
            }
            $("#preview_widget_control input:radio[name='" + b + "']").each(function() {
                $(this).is(":checked")?(($(this).parent().next(".input_otherchoice").length>0?$(this).parent().next(".input_otherchoice").removeClass("hide")
                    :$(this).parents(".field_js").find(".input_otherchoice").addClass("hide")),$(this).next().removeClass("r_unchecked").addClass("r_checked"))
                    :($(this).next().removeClass("r_checked").addClass("r_unchecked"),$(this).parents("li").removeClass("option_error"),$(this).parent().next(".input_otherchoice").addClass("hide"));
            });
        });
        $(document).on("change.preview","#preview_widget_control input[type='checkbox']",function(b){
            b=$(this).attr("name");
            $(this).parents(".widget_content").find(".widget_tip").remove();
            $("#preview_widget_control input:checkbox[name='" + b + "']:checked").each(function(){
                var optionData=$(this).data("componentData").componentSetup;
                var $p_obj=$(this).parents(".widget_content");
                var $t_obj=$p_obj.find(".widget_tip");
                if("true" == optionData.isError || 1 == optionData.isError){
                    $(this).parents("li").addClass("option_error");
                    optionData.errorContent && ($t_obj.length > 0 ? ($t_obj.append('；'+optionData.errorContent)) :
                        ($p_obj.append('<div class="widget_tip">提示：' + optionData.errorContent + '</div>')));
                }
            });
            $(this).is(":checked")?(($(this).parent().next(".input_otherchoice").length>0?$(this).parent().next(".input_otherchoice").removeClass("hide"):null),
                $(this).next().removeClass("sc_unchecked").addClass("sc_checked"))
                :(($(this).parent().next(".input_otherchoice").length>0?$(this).parent().next(".input_otherchoice").addClass("hide"):null),
                $(this).next().removeClass("sc_checked").addClass("sc_unchecked"),$(this).parents("li").removeClass("option_error"));
            if ($("#subset_jump_radio .r_checked").size() > 0) {
                var optionData=$(this).data("componentData").componentSetup,
                    field = $(this).parents(".field_js"),
                    selfId = field.attr("selfId");
                var optionJumpId = optionData.jumpId ? $.trim(optionData.jumpId).split(',') : [];
                if (optionJumpId.length>0) {
                    if ($(this).next().hasClass('sc_checked')) {
                        $.each(optionJumpId, function(i, item) {
                            field.parent().find('div[selfId='+item+']').removeClass('subset_hide');
                        });
                    } else {
                        optionJumpId = [];
                        $.each(field.find("input[type='checkbox']:checked"), function(i, item) {
                            $(item).data("componentData").componentSetup.jumpId && (optionJumpId = optionJumpId.concat($(item).data("componentData").componentSetup.jumpId.split(',')));
                        });
                        var fieldJumpId = [];
                        $.each(field.find("input[type='checkbox']"), function(i, item) {
                            $(item).data("componentData").componentSetup.jumpId && (fieldJumpId = fieldJumpId.concat($(item).data("componentData").componentSetup.jumpId.split(',')));
                        });
                        $.each(fieldJumpId, function(i, item) {
                            field.parent().find('div[selfId='+item+']').addClass('subset_hide')
                        });
                        if (optionJumpId.length>0) {
                            $.each(optionJumpId, function(i, item) {
                                field.parent().find('div[selfId='+item+']').removeClass('subset_hide');
                            });
                        }
                        var kids = a.setSubset(field, fieldJumpId);
                        a.clearContent([], [], kids);
                    }
                }
            }
        });
        $(document).on("click.preview","#preview_widget_control .MatrixRaty_js img",function(){
            $(this).parent().children().attr("src","/hug_interview/resources/images/raty_star_unchecked.png").attr("class","raty_star_unchecked")
            &&$(this).attr("src","/hug_interview/resources/images/raty_star_checked.png").attr("class","raty_star_checked")
            &&$(this).prevAll().attr("src","/hug_interview/resources/images/raty_star_checked.png");
            $(this).parents(".widget_content").find(".widget_tip").remove();
            $(this).parents(".field_js ").find("li").each(function(b){
                b=$(this).find(".raty_star_checked:last");
                var $p_obj=$(this).parents(".widget_content");
                var $t_obj=$p_obj.find(".widget_tip");
                if("true" == b.attr("isError") || 1 == b.attr("isError")){
                    $(this).addClass("option_error");
                    b.attr("title") && ($t_obj.length > 0 ? ($t_obj.append('；'+b.attr("title"))) :
                        ($p_obj.append('<div class="widget_tip">提示：' + b.attr("title") + '</div>')));
                }else{
                    $(this).removeClass("option_error");
                }
            });
        });
    };
    //解析表单布局json
    a.analyseLayout = function(b) {
        null != b && "" != b && (b = JSON.parse(b), $("#widget_control").html(""), a.analyseComponent(b, $("#widget_control")));
    };
    //解析表单控件json
    a.analyseComponent = function(b, g) {
        var f = b.componentKey;
        if(a.disable_edit) {
            b.disableEditFromModify = true;
        }
        if (f) {
            var c = new window[f](b),
            d = c.renderEditPreview(g,a);
            if ("ColumnPanel" == f && null != b.layoutDetail) for (f = 0; f < b.layoutDetail.length; f++) {
            	var c = b.layoutDetail[f],
                e = "",
                e = 1 == b.size ? g: $(d[f]);
                a.subsets = a.subsets || {};
                a.subsets[c.selfId] = a.subsets[c.selfId] || [];
                c.options && $.each(c.options, function(i, item) {
                    item.jumpId && (a.subsets[c.selfId] = a.subsets[c.selfId].concat(item.jumpId.split(',')));
                });
                a.analyseComponent(c, e);
            }
        }
    };
    //get请求参数转对象
    a.analyseRequest=function(){
        var url = decodeURI(window.location.search); //获取url中"?"符后的字串
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    };
    //表单数据初始化--新建表单
    a.initFormData=function(query){
        if(query==""||query==null) return false;
        //掩藏域数据
        $("#idValue").val(query["formDTO.id"]);
        $("#formTypeValue").val(query["formDTO.formType"]);
        $("#categoryIdValue").val(query["formDTO.categoryId"]);
        $("#formVersionValue").val(query["formDTO.formVersion"]);
        //页面展示数据
        $(".form_head_title").text(query["formDTO.formTitle"]);
        $(".form_head_desc").text(query["formDTO.beginContent"]);
        $(".form_bottom_desc").text(query["formDTO.endContent"]);
        query["formDTO.formVersion"]==null||query["formDTO.formVersion"]=="" ? $(".formVersionText").text("1.0") : $(".formVersionText").text(query["formDTO.formVersion"]);
        $("#form_title").val(query["formDTO.formTitle"]);
        $("#form_beginContent").val(query["formDTO.beginContent"]);
        $("#form_endContent").val(query["formDTO.endContent"]);
    };
    //创建控件对象并返回
    a.creatComponent=function(f,e){
        return new window[f](e);
    };
    $(function(){
    	//ajax调用返回修改内容
        var requestObj=a.analyseRequest();
        if(requestObj!=null&&requestObj["formDTO.id"]!=null&&requestObj["formDTO.id"]!=""){
            $.ajax({
                type:"post",
                url:"/hug_interview/repository/queryFormJson.htm",
                data:{"formDTO.id":requestObj["formDTO.id"]},
                success:function(data){
                    var formObj=data.result.models.formJsonObject;
                    //掩藏域数据
                    $("#formIdValue").val(formObj.formId);
                    $("#filling_field").val(formObj.fieldName);
                    $("#idValue").val(formObj.id);
                    $("#formTypeValue").val(formObj.formType);
                    $("#categoryIdValue").val(formObj.categoryId);
                    $("#formVersionValue").val(formObj.formVersion);
                    //页面展示数据
                    $(".form_head_title").text(formObj.formTitle);
                    $(".form_head_desc").text(formObj.beginContent);
                    $(".form_bottom_desc").text(formObj.endContent);
                    if(formObj.formVersion%1==0){
                        $(".formVersionText").text(formObj.formVersion+".0");
                    }else{
                        $(".formVersionText").text(formObj.formVersion);
                    }
                    if(requestObj["openType"]==1){//openType为1表示引用的请求
                        $(".formVersionText").text("1.0");
                        $("#categoryIdValue").val(requestObj["formDTO.categoryId"]);
                    }
                    $("#form_title").val(formObj.formTitle);
                    $("#form_beginContent").val(formObj.beginContent);
                    $("#form_endContent").val(formObj.endContent);
                    if(formObj.formStatus==0){
                        $(".head .submit_js").remove();
                    }
                    if(requestObj["formDTO.operationType"]==4) {
                        a.disable_edit = true;
                        $(".form_jump_type>span").addClass('cannot').css('color', '#999');
                    }
                    formObj.jumpType == 2 && ($("#subset_jump_radio .r_unchecked").addClass('r_checked').removeClass('r_unchecked'), $("#logic_jump_radio .r_checked").removeClass('r_checked').addClass('r_unchecked'));
                    a.analyseLayout(formObj.layoutDetail);
                    a.componentDraggableEvents();
                    $("#widget_control .field_js").each(function() {
                        if ($(this).data('componentData').componentSetup.options && $(this).data('componentData').componentSetup.options.length > 0) {
                            var options = {};
                            $.each($(this).data('componentData').componentSetup.options, function(i, item) {
                                options[item.selfId] = item.jumpId;
                            });
                            formObj.jumpType == 2 && a.setTopId($(this).data('componentData').componentSetup.selfId, options);
                        }
                    });
                },
                error:function () {

                }
            });
        }else{
            a.initFormData(a.analyseRequest());
        }
        $("#hospCode").val(requestObj["formDTO.hospCode"]);
    	a.formEvents();
		a.componentSetupEvents();
		a.formSetupEvents();
		a.componentDraggableEvents();
		//操作手册方法
		$(document).on("click", ".showIntro_js",function() {
            a.formIntro();
        });
		//左侧字段控件和布局控件
    	$(document).on("click", ".widget_tab_js",function() {
    		var b = $(this),
            a = b.attr("widget-type");
            b.parent().siblings().find("a").removeClass("active");
            b.addClass("active");
            "form" == a ? ($("#layout_widget_list").hide(), $("#form_widget_list").show()) : "layout" == a && ($("#layout_widget_list").show(), $("#form_widget_list").hide());
        });
    	//右侧控件设置和表单设置
    	$(document).on("click", ".edit_tab_js",function() {
            var b = $(this),
            a = b.attr("edit-type");
            b.parent().siblings().find("a").removeClass("active");
            b.addClass("active");
            "widget" == a ? ($("#edit_form").hide(), $("#edit_widget").show()) : "form" == a && ($("#edit_form").show(), $("#edit_widget").hide());
        });
    	//防止合并拆分之后，新的td不能放控件
    	$(document).on("afterCreateCell",function(b, f) {
            a.fromAndColPanelSortable();
        });
	});
    //日期格式化
    Date.prototype.format = function(format){
	    var o = {
		    "M+" : this.getMonth()+1, //month
		    "D+" : this.getDate(),    //day
		    "h+" : this.getHours(),   //hour
		    "m+" : this.getMinutes(), //minute
		    "s+" : this.getSeconds(), //second
		    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		    "S" : this.getMilliseconds() //millisecond
	    };
	    if(/(Y+)/.test(format)) format=format.replace(RegExp.$1,
		(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	    for(var k in o)if(new RegExp("("+ k +")").test(format))
    	format = format.replace(RegExp.$1,
		RegExp.$1.length==1 ? o[k] :
		("00"+ o[k]).substr((""+ o[k]).length));
	    return format;
    };
	u.exports = a;
});