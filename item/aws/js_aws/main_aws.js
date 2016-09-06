/**
 * Created by 周轩 on 2016/8/10.
 */





// var moveDistance ={};

$(function () {

    $(".threeD").each(function () {
        $(this).attr("src",build[$(this).attr("data-name")]);
    });

    var $slideContent = $("#slideContent");
    var ulWidth = parseInt($slideContent.css("width")) +20;
    $slideContent.css("right",-ulWidth+"px");
    //右侧导航开关
    $("#icon1,.slide-mask").on("click",function () {
        if($slideContent.css("right") == "0px"){
            $(".slide-right").animate({right:"10px"},400);
            $("#icon1").attr("src","image_aws/icon_1.png");
            $slideContent.animate({right:-ulWidth+"px"},400);
            // $(".slide-li").off("click",slideLi);
            $(".slide-mask").fadeOut(400);

        }else{
            $(".slide-right").animate({right:ulWidth+"px"},400);
            $("#icon1").attr("src","image_aws/icon_1_copy.png");
            $slideContent.animate({right:0},400);
            // $(".slide-li").on("click",slideLi);
            $(".slide-mask").fadeIn();
        }


    });
    //音乐开关
    $("#icon2").on("click",function () {
        var $music=$('#Music');
        if($music[0].paused){
            $(this).attr("src","image_aws/icon_2.png");
            $music[0].play();
        }else{
            $(this).attr("src","image_aws/icon_2_copy.png");
            $music[0].pause();
        }
    });
    // //右侧导航点击跳到按钮
    // var mainWidth = parseFloat($("#main").css_item1("width"));
    // var bodyWidth = parseFloat($("body").css_item1("width"));
    // var moveSpeed =  (mainWidth - bodyWidth) / 60;
    // var moveTime=1;
    //
    // setInterval(function () {
    //     if( moveTime == 60) moveDistance.pop_2 = 0;
    //     moveDistance.pop_2 = bodyWidth - (mainWidth / 2) + moveSpeed;
    //     i++;
    // },1000);
    //
    // function slideLi() {
    //     var pop = $(this).attr("data-src");
    //     //动态获取气球的移动位置
    //
    //     $(".slide-right").animate({right:"10px"},400);
    //     $("#icon1").attr("src","image_aws/icon_1.png");
    //     $slideContent.animate({right:-ulWidth+"px"},400);
    //     $(".slide-mask").fadeOut(400);
    //     $("#main").animate({left:moveDistance[pop] + "px"},500);
    // }

    //随机抖动效果2
    // var $title = $(".title");
    // setInterval(function () {
    //     var $titleImg = $(".title>img");
    //     var $titleDiv = $(".title>div");
    //     var num = Math.floor(Math.random() * $title.length);
    //     $title.find("img").filter(".swing_3").removeClass("swing_3 infinite");
    //     $title.find("div").filter(".fadeOutUp").removeClass("fadeOutUp infinite").hide();
    //     $title.eq(num).find("img").addClass("swing_3 infinite");
    //     $title.eq(num).find("div").addClass("fadeOutUp infinite").show();
    // },2000);

    //随机抖动效果1
    var $title = $(".title2");
    setInterval(function () {
            var num = Math.floor(Math.random() * $title.length);
            $title.filter(".bounce").removeClass("bounce");
            $title.eq(num).addClass("bounce");
    },2000);
    //弹出二级界面
    $(".title1").on("tap click",function () {

        if($(this).parent().attr("id") == "slideContent"){
            $(this).addClass("active");
            $(this).siblings().removeClass("active");
        }

            var src = $(this).attr("data-src");
            var num ="23%";
            var width = "65%";

            if(src == "pop_8"){
                num = "17%";
                width = "55%";
            }else if(src == "pop_2" || src == "pop_3"){
                num = "1%";
            }
            $("#popping").show(500);
            $("#popButton").css({"bottom":num,"width":width}).attr("href",popUrl[src]);
            $("#pop").css("background-image","url("+popImg[src]+")");

    });

    //礼物盒 弹出分享
    $("#deck").on("tap click",function () {
        $("#popping_1").show(500).one("tap click",function () {
            $(this).hide(500);
        });

    });
    //二级界面关闭
    $("#popClose").on("click",function () {
        $("#popping").hide(400);
    });



    //注册
    $("#loginImg,#login").on("tap click",function () {
        window.location.href  = popUrl.pop_1 ;
    });

    var ua = parseUA();

    if (!ua.mobile) {
        document.getElementById("orientLayer").style.display = "none";
        $("#fixedMask").show();
        // dragMouseDiv("aa");
           dragMouse("main");
    }else{
        // dragTouch("main");
        drag(document.getElementById("main"));
    }


    var loadNum = 0;
    var imgNum = $('#main img').length;
    var txtGrad = parseInt(100 / imgNum);
    var bgGrad = parseInt(200 / imgNum);
    $('#main img').each(function(){
        //加入complete为了判断图片是否在未绑定load事件就已经加载完成
        if($(this)[0].complete){
            loadNum += 1;
            if(loadNum>=imgNum){
                onLoad();
                setTimeout(function () {
                    $("#loading").fadeOut(1000);
                },1500);

            }
        }else{
            $(this).load(function(){
                loadNum += 1;
                if(loadNum>=imgNum){
                    onLoad();
                    setTimeout(function () {
                        $("#loading").fadeOut(1000);
                    },2000);
                }
            })
        }
    });
    //二维码
    $("#mask-qrcode").qrcode({
        render: "canvas",
        width: 150,
        height:150,
        text: window.location.href
    });
    $("#fixedMask").on("click",function () {
        $(this).hide();
        $("#btn").show();
    });
    $("#btn").on("click",function () {
        $(this).hide();
        $("#fixedMask").show();
    })
});

function onLoad() {
    var num = window.innerWidth / 1068;
    //定位图标抖动
    var img = $("#main img,.title").not("#background,.dot-img>img");
    // var img = $("#main img").not("#background");
    for(var i=0;i<img.length;i++){

        img[i].style.left = parseInt(img[i].style.left) / 2136 *100 +"%";
        img[i].style.top = parseInt(img[i].style.top) / 1100 *100 +"%";
        img[i].style.width = parseInt(getStyle(img[i],"width")) / 2136 *100 +"%";
    }
    //动态添加动画
    $(".car>img,.cloud>img").each(function (img) {
        $(this).addClass($(this).attr("data-class"));
    });

    $(document).one('touchstart', function () {
        document.getElementById('Music').play();
    });

    $("#slideContent").css("display","block");

    // $(".title").each(function () {
    //     getMoveDistance($(this));
    // });

}
// //获取需要移动的位置
// function getMoveDistance(ele,popLeft) {
//     var main = $("#main");
//     var bgLeft = parseFloat(main.css_item1("left"));
//     var widthHalf = parseFloat(main.css_item1("width")) / 2;
//     var bodyWidth = parseFloat($("body").css_item1("width"));
//     if(!popLeft) popLeft = parseFloat(ele.css_item1("left"));
//     var popWidthHalf = parseFloat(ele.css_item1("width")) / 2;
//     var move = widthHalf - popWidthHalf - popLeft + bgLeft;
//     if(move <= bodyWidth - widthHalf){
//         moveDistance[ele.attr("data-src")] = bodyWidth - widthHalf;
//     }else if(move >= widthHalf){
//         moveDistance[ele.attr("data-src")] = widthHalf;
//     }else{
//         moveDistance[ele.attr("data-src")] = move;
//     }
// }

//获取元素的样式
function getStyle(obj,styleName){
    if(obj.currentStyle){
        return obj.currentStyle[styleName];
    }else{
        return getComputedStyle(obj,null)[styleName];
    }
}

function parseUA() {
    var u = navigator.userAgent;
    var u2 = navigator.userAgent.toLowerCase();
    return { //移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        opr:u.indexOf('OPR') > -1,//opera浏览器-pc。
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        chrome:u.indexOf('Chrome') > -1,//谷歌浏览器
        safari:u.indexOf('Version') > -1 && u.indexOf('Safari') > -1,//Safari浏览器
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
        weixin: u2.match(/MicroMessenger/i) == "micromessenger",
        taobao: u.indexOf('AliApp(TB') > -1
    };
}

//移动物体，测试用
function dragMouseDiv(id) {
    window.addEventListener("mousedown",onMouseDown);

    var start,startY,left_1,top_1;
    var main = document.getElementById(id);
    function onMouseDown(e) {
        e.preventDefault();
        start = e.pageX;
        startY = e.pageY;
        left_1 = parseFloat( getStyle(main,"left"));
        top_1 = parseFloat(getStyle(main,"top"));
        window.addEventListener("mousemove",onMouseMove);
    }

    function onMouseMove(e) {

        e.preventDefault();
        var tx = e.pageX - start+left_1;
        var ty = e.pageY - startY+top_1;

        main.style.left =tx +"px";
        main.style.top =ty +"px";

        window.addEventListener("mouseup",onMouseUP);
    }


    function onMouseUP(e) {
        window.removeEventListener("mousemove",onMouseMove);
        e.preventDefault();
    }
}

//鼠标拖动
function dragMouse(id) {
    window.addEventListener("mousedown",onMouseDown);

    var start,left_1,startY,top_1;
    var main = document.getElementById(id);
    var widthHalf = parseFloat(getStyle(main,"width")) / 2;
    var bodyWidth = parseFloat(getStyle(document.getElementsByTagName("body")[0],"width"));
    function onMouseDown(e) {
        e.preventDefault();
        start = e.pageX;
        // startY = e.pageY;
        left_1 = parseFloat( getStyle(main,"left"));
        // top_1 = parseFloat( getStyle(main,"top"));
        window.addEventListener("mousemove",onMouseMove);
    }

    function onMouseMove(e) {

        e.preventDefault();
        var tx = e.pageX - start+left_1;
        if(tx> bodyWidth - widthHalf && tx< widthHalf){
            main.style.left =tx +"px";
        }

        window.addEventListener("mouseup",onMouseUP);
    }


    function onMouseUP(e) {
        window.removeEventListener("mousemove",onMouseMove);
        e.preventDefault();
    }
}
//触摸拖动
function dragTouch(id) {
    $('#'+id).on('touchstart',function(e){

        var main = document.getElementById(id);
        var widthHalf = parseFloat(getStyle(main,"width")) / 2;
        var bodyWidth = parseFloat(getStyle(document.getElementsByTagName("body")[0],"width"));
        var start = e.originalEvent.touches[0].clientX;
        var left_1 = parseFloat( getStyle(main,"left"));


        $(document).on('touchmove',function(e2){
            e.preventDefault();
            var tx = e2.originalEvent.touches[0].clientX - start+left_1;
            if(tx> bodyWidth - widthHalf && tx< widthHalf){
                main.style.left =tx +"px";
            
            }
        }).on('touchend',function(e3){
            $(document).unbind('touchmove').unbind('touchend');
        });
        var event = event || window.event || arguments.callee.caller.arguments[0];
        event.preventDefault();
    });
}

//使用requestAnimationFrame优化touchmove
function drag(element){

    var startX=0,
        ticking=false,
        raf,
        doc=document;

    element.addEventListener("touchstart",function(e){


        var e=e||window.event,
            touchs = e.touches[0];
        e.preventDefault();       //低端安卓 touch事件 有的导致touchend事件时效  必须开始 就加   e.preventDefault();
        // text a ipnut textarea 几个 等标签除外
        // ，另外自定义移动端touchstart touchend组合的 hover事件，建议不加这个，不然页面无法滚动
        //touchmove 开始 就加  不然抖动一下，才能touchmove， 然后才正常 尤其早些的 三星   系列自带浏览器


        startX=parseInt(touchs.pageX-(element.lefts||0));

        doc.addEventListener("touchmove",update,false);
        doc.addEventListener("touchend",end,false);

    },false);





    var  update=function (e) {

        var e=e||window.event;
        if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
        e.preventDefault();

        //cancelAnimationFrame(raf);
        if(!ticking) {

            var touchs = e.changedTouches[0];

            //1先触摸移动
            element.lefts = touchs.pageX - startX;

            //2交给requestAnimationFrame 更新位置
            //raf=requestAnimationFrame(function(){draw();});
            raf=requestAnimationFrame(draw);

        }

        ticking = true;
    };




    var draw= function  (){
        ticking = false;
        var widthHalf = parseFloat(getStyle(element,"width")) / 2;
        var bodyWidthHalf = parseFloat(getStyle(document.getElementsByTagName("body")[0],"width"))/2;
        var nowLeft=parseFloat(element.lefts) - widthHalf;    //滑动的距离             touchmove时候，如果加阻力，可能有细小的抖动；我想应该是移动端 部分支持0.5px的缘故； parseInt的转化有点牵强；
        if(nowLeft> bodyWidthHalf - (widthHalf*2) && nowLeft< -bodyWidthHalf) {
            element.style.webkitTransform = element.style.transform = "translate3D(" + nowLeft + "px,-50%,0px)";
        }
    };

    var end=function(){
        var endLeft= parseInt(element.lefts);    //滑动的距离

        //element.style.webkitTransform=element.style.transform = "translate(" + endLeft+ "px," + endTop + "px)";

        doc.removeEventListener("touchmove",update,false);
        doc.removeEventListener("touchend",end,false);
        // cancelAnimationFrame(raf);

    }

}

/*
* 跳转到上一页
* window.history.back(-1);
*
* 获取div的translate的x移动百分比
*  element.style.transform.split("(").pop().split(",")[0]
*
* */
