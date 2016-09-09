$(function(){
	$.ajax({
		type: "GET",
		url: "ajax/message.json",
		dataType: "json",
		success: function(data){
			data.about_info.forEach(function(item){
				$("#about_info").append("<p>"+item+"</p>");
			});
			$("#skill_info").append("<p>"+data.skill_info+"</p>");
			data.threeJs.forEach(function(item){
				$("#skill_int1").append("<p>"+item+"</p>");
			});
			data.html.forEach(function(item){
				$("#skill_int2").append("<p>"+item+"</p>");
			});
			data.css.forEach(function(item){
				$("#skill_int3").append("<p>"+item+"</p>");
			});
			data.javaScript.forEach(function(item){
				$("#skill_int4").append("<p>"+item+"</p>");
			});
			$("#exp_info").append("<p>"+data.exp_info+"</p>");
			data.contact_info.forEach(function(item){
				$("#contact_info").append("<p>"+item+"</p>");
			});
		}
	});
    $('#dowebok').fullpage({
		scrollingSpeed: 300,
		css3: true,
		resize: true,
		anchors: ["page1","page2","page3","page4","page5","page6"],
		verticalCentered: false,
		easingcss3:"ease-in-out",
		afterRender: function(){
			$("#home_head").css({"margin-top":"100px"});
			$("header").animate({opacity:"1"},1000,function(){
				$("#header").css({"opacity":"0.3"});
				$("#home_info1").fadeIn(700,function(){
					$(this).next().animate({width:"100%"},700,function(){
						$("#home_info2").fadeIn(450,function(){
							$(this).next().fadeIn(450,function(){
								$(this).next().fadeIn(450,function(){
									$(this).next().fadeIn(450);
								});
							});
						});
					});
				});
			});	
		},
		afterLoad: function(anchorLink,index){
			$(".side li").eq(index-1).addClass("selected").siblings().removeClass("selected");
			$(".section").eq(index-1).find(".title_en").animate({width:"130px"},800,function(){
				$(".title_en h2").slideDown(400);
			});
			if(index == 1){
				$("#home_info1").fadeIn(700,function(){
					$(this).next().animate({width:"100%"},700,function(){
						$("#home_info2").fadeIn(450,function(){
							$(this).next().fadeIn(450,function(){
								$(this).next().fadeIn(450,function(){
									$(this).next().fadeIn(450);
								});
							});
						});
					});
				});
			}
			if(index==2){
				var about_info = $("#about_info");
				var about_info_p = about_info.find("p");
				about_info.animate({width:"800px",marginTop:"0",marginBottom:"0"},700,'easeOutElastic',function(){
					about_info_p.eq(0).animate({bottom:"0"},700,function(){
						about_info_p.eq(1).animate({bottom:"0"},700,function(){
							about_info_p.eq(2).animate({bottom:"0"},700,function(){
								about_info_p.eq(3).animate({bottom:"0"},700);
							});
						});
					});
				});	
			}
			if(index==3){
				$(".skill_list_content").addClass("skill_scale");
			}
			if(index==4){
				addAnimateClass($(".exp_scale"),"b_to_t",200);
				$("#exp_list_to").fadeIn(800).delay(500).fadeTo(300,0.3);
			}
			if(index==5){
				addAnimateClass($(".demo_scale"),"b_to_t",200);
			}
			if(index==6){
				addAnimateClass($("#contact_head2 span"),"fade_in",200);
				$("#contact_head1").addClass("b_to_t");
				setTimeout(function(){
					addAnimateClass($(".contact_scale"),"fade_in",350);
				},100);
			}
		},
		onLeave:function(index){
			$(".title_en").css("width","0");
			if(index ==1 ) {
				$("#home_info").find("p").css("display","none");
				$("#home_info_box").css("width","0");
			}
			if(index ==2 ) {
				$("#about_info").css("width","0").find("p").css("bottom","-300px");
			}
			$(".skill_list_content").removeClass("skill_scale");
			$(".b_to_t").removeClass("b_to_t");
			$(".fade_in").removeClass("b_to_t");
		}
	});
});

function addAnimateClass(ele,cla,time) {
	var i=-1;
	ele.each(function() {
		var $this=$(this);
		if(!$this.hasClass(cla)){
			i++;
			setTimeout(function(){
				$this.addClass(cla);
			},time * i);
		}
	});
}


// 技能明细切换
	$(".skill_icon").click(function(){
		$(".skill_int").each(function(){
			if($(this).is(":visible")){
				$(this).slideUp(200);
				$(this).prev().removeClass("skill_flag_scale");
			}
		});
		if($(this).siblings(".skill_int").is(":hidden")){
			$(this).siblings(".skill_int").slideDown(400);
			$(this).siblings(".skill_flag").addClass("skill_flag_scale");
		}else{
			$(this).siblings(".skill_int").slideUp(200);
			$(this).siblings(".skill_flag").removeClass("skill_flag_scale");
		}
	});
// 图片轮播
	$("#exp_list_slider").width($(".exp_list").width());
	$("#exp_list_content").width($(".exp_list").width()*3);
	$("#exp_list_slider_content").mouseenter(function(){
		$("#exp_list_to").stop(true,false).fadeTo(700,1);
	}).mouseleave(function(){
		$("#exp_list_to").stop(true,false).fadeTo(700,0.1);
	});

	$("#exp_list_toleft").click(function()
    {
		if(!$("#exp_list_content").is(":animated")){
			if(page==1){
				$("#exp_list_content").animate({left:"+=50"},200,function(){
					$(this).animate({left:"-=50"},200);
				});
				return false;
			}	
			$("#exp_list_content").animate({left:"+="+$(".exp_list").width()});
			page--;
		}
	});
	$("#exp_list_toright").click(function(){
		if(!$("#exp_list_content").is(":animated")){
			if(page==3){
				$("#exp_list_content").animate({left:"-=50"},200,function(){
					$(this).animate({left:"+=50"},200);
				});
				return;
			}
			$("#exp_list_content").animate({left:"-="+$(".exp_list").width()});
			page++;
		}
	});

	// 时光轴
	var x=10;
	var y=20;
	var page=1;
	$("#exp_timeline").find("a").mouseover(function(e){
		var aa=$(this).attr('data-title');
		var exp_timeline_title = $("<div class='exp_timeline_title'>"+aa+"</div>");
		$("body").append(exp_timeline_title);
		exp_timeline_title.css({
			"top":e.pageY+y+"px",
			"left":e.pageX+x+"px"
		}).show("fast");
	}).mousemove(function(e){
		$(".exp_timeline_title").css({
			"top":e.pageY+y+"px",
			"left":e.pageX+x+"px"
		});
	}).mouseout(function(){
		$(".exp_timeline_title").remove();
	}).click(function(){
		$("#exp_list_content").stop(true,false).animate({left:-$(".exp_list").width()*$(this).index()},2000,"easeInOutCubic");
		page=$(this).index()+1;
	});
// 点击留言
	$("#contact_message1").click(function(){
		$(this).fadeOut(200,function(){
			$("#contact_form").fadeIn(200);
		})
	});
////内容适应居中
	$(function(){
		// $("aside").css({"top":($(".active").height()-$("aside").height())/2});
		var home_content = $("#home_content");
		var about_content = $("#about_content");
		var skill_content = $("#skill_content");
		var skill_content = $("#skill_content");
		// home_content.css({"padding-top":($(".active").height()-home_content.height())/6});
		// about_en_edu
		//weixin
		var weiXin = function(){
			var mobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
			var $tip = $('.tip');
			if(!mobile){
				$('.wx').hover(function(){
					$tip.css({'height':'118px'});
				},function(){
					$tip.css({'height':'0'});
				});
			}else if(m){
				$(document).on('click',function(e){
					var h = $tip.height();
					var wx = e.target.id;
					if((h==0)&&(wx=='weixin')){
						$tip.css({'height':'118px'});
					}else if(h==118){
						$tip.css({'height':'0'});
					}
				})
			}
		};
		weiXin();
	});