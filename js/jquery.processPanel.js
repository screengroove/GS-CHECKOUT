(function($){
	function openContent(event)
	{
		var current_open = $('.content:visible').attr('id');
		
		switch(current_open){
			case 'content1':
				//$('#sidebar-cart:hidden').slideDown();
				if( ($(this).attr("href") == "#content2" || $(this).attr("href") == "#content3" || $(this).attr("href") == "#content4") && !$(".validateform").validationEngine('validate')){
					return false;
				} else if( ($(this).attr("href") == "#content4")) {
					$('#sidebar-cart').slideUp();
					//console.log('fire');
				}
			break;
			case 'content2':
				//$('#sidebar-cart:hidden').slideDown();
				if( ($(this).attr("href") == "#content3" || $(this).attr("href") == "#content4") && !$(".validateform").validationEngine('validate')){ 
					return false;
				} else if( ($(this).attr("href") == "#content4")) {
					$('#sidebar-cart').slideUp();
					//console.log('fire');
				}
			break;
			case 'content3':
				if( ($(this).attr("href") == "#content4") && ( !$(".validateform2").validationEngine('validate') || !$(".validateform3").validationEngine('validate') ) ) { 
					 return false;
				} else if( ($(this).attr("href") == "#content4")) {
					$('#sidebar-cart').slideUp();
					//console.log('fire');
				}
			break;
			case 'content4':
				if( ($(this).attr("href") != "#content4")) $('#sidebar-cart:hidden').slideDown();
			break;
		}

		var options = event.data.options;
		event.preventDefault();
		//contentElement
		var contentElement = null;
		if($(this).attr("href")!=undefined && $(this).attr("href").substr(0,1)!="#" && $(this).attr("href")!="")
			contentElement = $("#"+$(this).attr("href").split("#")[1]);
		else
			contentElement = $($(this).attr("href"));
		var currentStepNumber = $("#"+event.data.panelId).children("[href]").index($(this));
		if(false === options.onOpen(event, $(this), contentElement, currentStepNumber+1))
		{
			$(this).trigger("mouseout");
			return;
		}
		$(this).unbind("mouseout", hoverOut);
		if($(this).attr("href")!=undefined && $(this).attr("href").substr(0,1)!="#" && $(this).attr("href")!="")
		{
			var url = $(this).attr("href").split("#")[0];
			var contentId = $(this).attr("href").split("#")[1];
			$(event.data.contentsSelector+":not(#"+contentId+")").css("display", "none");
			var self = $(this);
			$.ajax({
				url: url,
				type: "post",
				async: false,
				dataType: "html",
				success: function(data){
					$("#"+contentId).css({"opacity":0, "display":"block"}).html(data).animate({opacity:1}, options.fadeSpeed, function(){if(jQuery.browser.msie)this.style.removeAttribute("filter");/*IE bug fix*/});
				}
			});
		}
		else
		{
			$(event.data.contentsSelector+":not("+$(this).attr("href")+")").css("display", "none");
			$($(this).attr("href")).css({"opacity":0, "display":"block"}).animate({opacity:1}, options.fadeSpeed, function(){if(jQuery.browser.msie)this.style.removeAttribute("filter");/*IE bug fix*/});
		}
		if(!options.chooseAgain)
		{
			$(this).unbind(options.event, openContent);
			$(this).bind(options.event, function(event){event.preventDefault();});
		}
		if(event.data.options.kind=="stepByStep")
		{
			if($(this).next().attr("href")!=undefined && $.data($(this).next().get(0), "events")==null)//check the last step
			{
				$(this).next().bind(options.event, {options:options, hoverBg:event.data.hoverBg, hoverColor:event.data.hoverColor, stepBg:event.data.stepBg, stepColor:event.data.stepColor, panelId:event.data.panelId, contentsSelector:event.data.contentsSelector}, openContent);
				$(this).next().bind("mouseover", {options:options, hoverBg:event.data.hoverBg, hoverColor:event.data.hoverColor}, hoverIn);
				$(this).next().bind("mouseout", {options:options, stepBg:event.data.stepBg, stepColor:event.data.stepColor}, hoverOut);
			}
		}
		if(options.nextPrevButtons)
		{
			//add nextPrevButtons
			var prevStep = null;
			var nextStep = null;
			if($(this).next().length && $(this).next().attr("href")!=undefined)
				nextStep = $(this).next().attr("href");
			if($(this).prev().attr("href")!=undefined && (options.chooseAgain || options.kind=="freeChoice"))
				prevStep = $(this).prev().attr("href");
			if($(this).next().length && ($.data($(this).next().get(0), "events")==null || $.data($(this).next().get(0), "events")[options.event]==null))
				nextStep = null;
			if($.data($(this).prev().get(0), "events")==null || $.data($(this).prev().get(0), "events")[options.event]==null)
				prevStep = null;
			$("#"+event.data.panelId+" .nextPrevButtons").remove();
			if(options.nextPrevButtonsPosition=="top")
				$("#"+event.data.panelId).prepend("<div class='nextPrevButtons clearfix'><a class='button " + (prevStep!=null ? "activeButton-"+options.style:"inactiveButton") + "' title='" + options.prevButtonTitle + "' " + (prevStep!=null ? "xref='"+prevStep+"'":"xref='#'") + ">" + options.prevButtonTitle + "</a><a class='button " + (nextStep!=null ? "activeButton-"+options.style:"inactiveButton") + "' title='" + options.nextButtonTitle + "' " + (nextStep!=null ? "xref='"+nextStep+"'":"xref='#'") + ">" + options.nextButtonTitle + "</a></div>");
			else
				$("#"+event.data.panelId).append("<div class='nextPrevButtons clearfix'><a class='button " + (prevStep!=null ? "activeButton-"+options.style:"inactiveButton") + "' title='" + options.prevButtonTitle + "' " + (prevStep!=null ? "xref='"+prevStep+"'":"xref='#'") + ">" + options.prevButtonTitle + "</a><a class='button " + (nextStep!=null ? "activeButton-"+options.style:"inactiveButton") + "' title='" + options.nextButtonTitle + "' " + (nextStep!=null ? "xref='"+nextStep+"'":"xref='#'") + ">" + options.nextButtonTitle + "</a></div>");
		}
		if(!options.markVisited)
		{
			if(event.data.options.kind=="stepByStep")
			{
				//unhighlight all next steps
				$(this).nextAll("a.step").each(function(){
					$(this).css({
						"background-position": parseInt($(this).backgroundPosition().split(" ")[0]) + "px " + event.data.stepBg.split(" ")[1],
						"color":event.data.stepColor
					});
				});
				//highlight all previous steps
				$(this).prevAll("a.step").each(function(){
					$(this).css({
						"background-position": parseInt($(this).backgroundPosition().split(" ")[0]) + "px " + event.data.hoverBg.split(" ")[1],
						"color":event.data.hoverColor,
						"cursor":"pointer"
					});
				});
				//unbind mouseout
				$(this).prev("a.step").unbind("mouseout", hoverOut);
				//bind mouseout
				$(this).next("a.step").bind("mouseout", {options:options, stepBg:event.data.stepBg, stepColor:event.data.stepColor, panelId:event.data.panelId}, hoverOut);
			}
			else
			{
				//unhighlight all sibling steps
				$(this).siblings("a.step").each(function(){
					if($(this).get(0)===$("#"+event.data.panelId).children("[href]").first().get(0))//firstStep
						$("#"+event.data.panelId+" .boxStart").css("background-position", "-10px " + event.data.stepBg.split(" ")[1]);
					$(this).css({
						"background-position": parseInt($(this).backgroundPosition().split(" ")[0]) + "px " + event.data.stepBg.split(" ")[1],
						"color":event.data.stepColor
					});
					//bind mouseout
					$(this).bind("mouseout", {options:options, stepBg:event.data.stepBg, stepColor:event.data.stepColor, panelId:event.data.panelId}, hoverOut);
				});
			}
		}
		options.afterOpen(event, $(this), contentElement, currentStepNumber);
	};
	function hoverIn(event)
	{
		var currentStepNumber = $("#"+event.data.panelId).children("[href]").index($(this));
		if(false === event.data.options.onHoverIn(event, $(this), currentStepNumber)) return;
		if($(this).get(0)===$("#"+event.data.panelId).children("[href]").first().get(0))//firstStep
			$("#"+event.data.panelId+" .boxStart").css("background-position", "-10px " + event.data.hoverBg.split(" ")[1]);
		$(this).css({
			"background-position": parseInt($(this).backgroundPosition().split(" ")[0]) + "px " + event.data.hoverBg.split(" ")[1],
			"color":event.data.hoverColor,
			"cursor":"pointer"
		});
	};
	function hoverOut(event)
	{
		var currentStepNumber = $("#"+event.data.panelId).children("[href]").index($(this));
		if(false===event.data.options.onHoverOut(event, $(this), currentStepNumber)) return;
		if($(this).get(0)===$("#"+event.data.panelId).children("[href]").first().get(0))//firstStep
			$("#"+event.data.panelId+" .boxStart").css("background-position", "-10px " + event.data.stepBg.split(" ")[1]);
		$(this).css({
			"background-position": parseInt($(this).backgroundPosition().split(" ")[0]) + "px " + event.data.stepBg.split(" ")[1],
			"color":event.data.stepColor
		});
	};

	jQuery.fn.backgroundPosition = function() {
		var p = $(this).css("background-position");
		if(typeof(p) === "undefined" || ($.browser.msie && parseInt($.browser.version)==9))
			return $(this).css("background-position-x") + " " + $(this).css("background-position-y");
		else
			return p.replace(/%/g,"px");
	  };

	jQuery.fn.processPanel = function(options){
		var defaults = {
			kind: "stepByStep",
			style: "green-blue",
			firstSelected: true,
			icons: true,
			imgFolder: "img",
			chooseAgain: true,
			markVisited: true,
			nextPrevButtons: true,
			nextPrevButtonsPosition: "bottom",
			nextButtonTitle: "Next step",
			prevButtonTitle: "Previous step",
			fadeSpeed: 1000,
			event: "click",
			beforeLoad: function(){},
			onLoad: function(){},
			onOpen: function(){},
			afterOpen: function(){},
			onOpenPopup: function(){},
			onClosePopup: function(){},
			onHoverIn: function(){},
			onHoverOut: function(){}
		  };
		var options = $.extend(defaults, options);
		this.getOptions = function(){
			return options;
		};
		this.each(function(){
			options.beforeLoad();
			var panelId = $(this).attr("id");
			var steps = $(this).children("[href]").length;
			var contentsId = new Array();
			var contentsSelector = "";
			$(this).children("[href]").each(function(){
				if($(this).attr("href").substr(0,1)!="#")
				{
					contentsId.push($(this).attr("href").split("#")[1]);
					contentsSelector+= "#"+$(this).attr("href").split("#")[1]+",";
				}
				else
				{
					contentsId.push($(this).attr("href").substr(1));
					contentsSelector += $(this).attr("href")+",";
				}
			});
			contentsSelector = contentsSelector.substr(0, contentsSelector.length-1);
			$(this).children("[href]").first().before("<div class='boxStart boxStart-"+options.style+"'>&nbsp;</div>");
			var hoverBg, hoverColor, stepBg, stepColor, firstStep, secondStep;
			$(contentsSelector).each(function(){
				$(this).addClass("content");
			});
			$(this).children("[href]").each(function(index){
				$(this).addClass("step step-"+options.style+" step" + (index+1));
				if(index==0)
					$(this).addClass("step" + (index+1) +"-"+options.style);
				if(!options.icons)
					$(this).css("background-image", "url('" + options.imgFolder + "/sprite_without_icons.png')");
				if(index>0)
					$(this).css("padding-left", parseInt($(this).css("padding-left"))+20+"px");
				var bgPos;
				if(index+1==steps)
					bgPos = -551+parseInt($(this).css("width"))-580+parseInt($(this).css("padding-left"))+"px " + $(this).backgroundPosition().split(" ")[1];
				else
					bgPos = -551+parseInt($(this).css("width"))-10+parseInt($(this).css("padding-left"))+"px " + $(this).backgroundPosition().split(" ")[1];
				$(this).css({
					"z-index":steps-index,
					"background-position":bgPos
				});
				if(index==0)
				{
					firstStep = $(this);
					hoverBg = $(this).backgroundPosition();
					hoverColor = $(this).css("color");
					$(this).css("margin-left", "0px");
				}
				else if(index==1)
				{
					secondStep = $(this);
					stepBg = $(this).backgroundPosition();
					stepColor = $(this).css("color");
				}
				if($(this).attr("label")!=undefined)
					$(this).append("<span class='stepLabel"+(index+1==steps?"Last":"")+"'>" + $(this).attr("label") + "</span>");
			});
			//if options.firstSelected==false change background of first step
			if(!options.firstSelected)
			{
				firstStep.css({
								"background-position":parseInt(firstStep.backgroundPosition().split(" ")[0]) + "px " + stepBg.split(" ")[1],
								"color":stepColor
							});
				$("#"+panelId+" .boxStart").css("background-position", "-10px " + stepBg.split(" ")[1]);
			}
			else
				firstStep.css("cursor", "pointer");
			//bind hover event
			if(options.kind=="stepByStep")
			{
				if(!options.firstSelected || options.chooseAgain)
					firstStep.bind(options.event, {options:options, hoverBg:hoverBg, hoverColor:hoverColor, stepBg:stepBg, stepColor:stepColor, panelId:panelId, contentsSelector:contentsSelector}, openContent);
				else
					firstStep.bind(options.event, function(event){event.preventDefault();});
				if(!options.firstSelected)
				{
					firstStep.bind("mouseover", {options:options, hoverBg:hoverBg, hoverColor:hoverColor, panelId:panelId}, hoverIn);
					firstStep.bind("mouseout", {options:options, stepBg:stepBg, stepColor:stepColor, panelId:panelId}, hoverOut);
				}
				else
				{
					secondStep.bind("mouseover", {options:options, hoverBg:hoverBg, hoverColor:hoverColor}, hoverIn);
					secondStep.bind("mouseout", {options:options, stepBg:stepBg, stepColor:stepColor}, hoverOut);
					secondStep.bind(options.event, {options:options, hoverBg:hoverBg, hoverColor:hoverColor, stepBg:stepBg, stepColor:stepColor, panelId:panelId, contentsSelector:contentsSelector}, openContent);
				}
			}
			else
			{
				//bind hover and openContent to all steps
				$(this).children("[href]").each(function(index){
					if(index>0 || !options.firstSelected || !options.markVisited)
					{
						$(this).bind("mouseover", {options:options, hoverBg:hoverBg, hoverColor:hoverColor, panelId:panelId}, hoverIn);
						if(index>0 || !options.firstSelected)
							$(this).bind("mouseout", {options:options, stepBg:stepBg, stepColor:stepColor, panelId:panelId}, hoverOut);
						$(this).bind(options.event, {options:options, stepBg:stepBg, stepColor:stepColor, panelId:panelId, contentsSelector:contentsSelector}, openContent);
					}
					else if(!options.firstSelected || options.chooseAgain)
						$(this).bind(options.event, {options:options, panelId:panelId, stepBg:stepBg, stepColor:stepColor, contentsSelector:contentsSelector}, openContent);
					else
						$(this).bind(options.event, function(event){event.preventDefault();});
				});
			}
			$(contentsSelector).each(function(index){
				if(!options.firstSelected || $(this).attr("id")!=contentsId[0])
					$(this).css("display", "none");
				else if($(this).attr("id")==contentsId[0] && options.nextPrevButtons)
				{
					//add nextPrevButtons
					if(options.nextPrevButtonsPosition=="top")
						$("#"+panelId).prepend("<div class='nextPrevButtons clearfix'><a xref='#' class='button inactiveButton' title='" + options.prevButtonTitle + "'>" + options.prevButtonTitle + "</a><a xref='"+secondStep.attr("href")+"' class='button activeButton-"+options.style+"' title='" + options.nextButtonTitle + "'>" + options.nextButtonTitle + "</a></div>");
					else
						$("#"+panelId).append("<div class='nextPrevButtons clearfix'><a xref='#' class='button inactiveButton' title='" + options.prevButtonTitle + "'>" + options.prevButtonTitle + "</a><a xref='"+secondStep.attr("href")+"' class='button activeButton-"+options.style+"' title='" + options.nextButtonTitle + "'>" + options.nextButtonTitle + "</a></div>");
				}
			});
			if(options.firstSelected && firstStep.attr("href")!=undefined && firstStep.attr("href").substr(0,1)!="#" && firstStep.attr("href")!="")
			{
				var url = firstStep.attr("href").split("#")[0];
				var contentId = firstStep.attr("href").split("#")[1];
				$.ajax({
					url: url,
					type: "post",
					async: false,
					dataType: "html",
					success: function(data){
						$("#"+contentId).html(data);
					}
				});
			}
			$("#"+panelId+" .button[xref!='#']").live("click", function(event){
				event.preventDefault();
				$("#"+panelId+" [href='"+$(this).attr("xref")+"']:not(.button)").trigger("mouseover").trigger("click");
			});
			$("[href='#"+panelId+"-popup']").click(function(event){
				var panelId = $(this).attr("href").substr(0, $(this).attr("href").length-6);
				if(false===options.onOpenPopup(event, $(this), $(panelId))) return;
				event.preventDefault();
				$("body").append("<div class='overlay'></div>");
				$(panelId).css({"width":$(panelId).width()+"px", "z-index":"101"});
				$(panelId).css("top", ( $(window).height() - $(panelId).height() ) / 2+$(window).scrollTop() + "px");
				$(panelId).css("left", ( $(window).width() - $(panelId).width() ) / 2+$(window).scrollLeft() + "px");
				$(panelId).appendTo("body");
				$(panelId).css("display", "block");
				$(".overlay").css({"width":$(window).width()+"px", "height":$(document).height()+300+"px", "opacity":"0.7"});
				//opera lost width - fix
				var bgPos;
				var steps = $(panelId).children("a").length;
				$(panelId).children("[href]").each(function(index){
					if(index+1==steps)
						bgPos = -551+parseInt($(this).css("width"))-580+parseInt($(this).css("padding-left"))+"px " + $(this).backgroundPosition().split(" ")[1];
					else
						bgPos = -551+parseInt($(this).css("width"))-10+parseInt($(this).css("padding-left"))+"px " + $(this).backgroundPosition().split(" ")[1];
					$(this).css("background-position", bgPos);
				});
				$(panelId).css("opacity", "0");
				$(panelId).animate({opacity: 1}, 500, function(){if(jQuery.browser.msie)this.style.removeAttribute("filter");/*IE bug fix*/});
				$(".overlay").click(function(event){
					if(false===options.onClosePopup(event, $(panelId))) return;
					$(panelId).animate({opacity:0},500,function(){$(this).css("display", "none")});
					$(this).remove();
				});
				$(window).resize(function(){
					$(".overlay").css("height", $(document).height()+"px");
				});
			});
			options.onLoad();
		});
		return this;
	};
	$(".inactiveButton").live("click", function(event){
		event.preventDefault();
	});
})(jQuery);