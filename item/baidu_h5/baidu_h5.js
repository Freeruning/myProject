/**
 * Created by 周轩 on 2016/8/10.
 */

$(function () {
    
    $(".threeD").each(function () {
        if(this.tagName == "IMG" && $(this).attr("data-name")) $(this).attr("src",build[$(this).attr("data-name")]);
    });

    $(document).one('touchstart', function () {
        document.getElementById('musicContent').play();
        $("#music").removeClass().addClass("music_1");
    });
    //音乐开关
    $("#music").on("click",function () {
        var $music=$('#musicContent');
        if($music[0].paused){
            $(this).removeClass().addClass("music_1");
            $music[0].play();
        }else{
            $(this).removeClass().addClass("music");
            $music[0].pause();
        }
    });
    var url_1 = "http://zhidao.baidu.com/s/shockingShowwap/index.html";
    var url_2 = "http://h5legend.baidu.com/h5/2c62ab6e-6092-6215-ea45-2651948ac5f7.html";
    //弹出二级界面
    $(".title1").on("tap click",function () {
        if($(this).parent().attr("id") == "slideContent"){
            $(this).addClass("active");
            $(this).siblings().removeClass("active");
        }

            var src = $(this).attr("data-src");
            $("#popping").show(500);
            if(src == "tag_2"){
                $("#popButton").removeClass().addClass("pop-btn1").attr("href",url_1);
            }else if(src == "tag_3"){
                $("#popButton").removeClass().addClass("pop-btn2").attr("href",url_2);
            }else {
                $("#popButton").hide();
            }

            $("#pop").css("background-image","url("+popImg[src]+")");

    });

    //二级界面关闭
    $("#popClose").on("click",function () {
        $("#popping").hide(400);
    });


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
                    $("#loading").fadeOut(300);
                },1500);

            }
        }else{
            $(this).load(function(){
                loadNum += 1;
                if(loadNum>=imgNum){
                    onLoad();
                    setTimeout(function () {
                        $("#loading").fadeOut(300);
                    },2000);
                }
            })
        }
    });

});

function onLoad() {
    //定位图标抖动
    var img = $(".threeD,.title").not("#background,.fixed");
    for(var i=0;i<img.length;i++){

        img[i].style.left = parseInt(img[i].style.left) / 1708 *100 +"%";
        img[i].style.top = parseInt(img[i].style.top) / 954 *100 +"%";
        img[i].style.width = parseInt(getStyle(img[i],"width")) / 1708 *100 +"%";
    }
    var ua = parseUA();

    if (!ua.mobile) {
        document.getElementById("orientLayer").style.display = "none";
        dragMouse("main");
        // dragMouseDiv($(".title"));
    }else{
        drag(document.getElementById("main"));
    }
    //字幕滚动
    wordMove1($("#word1"),6000,$("#word4"));
    wordMove1($("#word2"),5000);
    wordMove1($("#word3"),4000);

}
function wordMove1(ele,time,ele2) {

    ele.animate({"left":"35%"},time,"linear",function () {
        var that = $(this);
        that.children(".p_word1").fadeOut(500,function () {
            that.children(".p_word2").fadeIn(500);
            if(ele2) {
                ele2.show(500);
                wordMove1(ele2,time-1000);
            }
        });
        wordMove2(ele,time);
    })
}
function wordMove2(ele,time) {


    ele.animate({"left":"70%"},time,"linear",function () {
        var that = $(this);
        that.children(".p_word2").fadeOut(500,function () {
            that.css({"left":"0"});
            that.children(".p_word1").fadeIn(500);
            wordMove1(that,time);

        });
    });
}

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
function dragMouseDiv(ele) {
    var main;
    ele.on("mousedown",function () {
        var start,startY,left_1,top_1;
         main= this;

        window.addEventListener("mousedown",onMouseDown);

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
    });


}

//鼠标拖动
function dragMouse(id) {
    window.addEventListener("mousedown",onMouseDown);

    var start,left_1;
    var main = document.getElementById(id);
    var widthHalf = parseFloat(getStyle(main,"width")) / 2;
    var bodyWidth = parseFloat(getStyle(document.getElementsByTagName("body")[0],"width"));
    function onMouseDown(e) {
        e.preventDefault();
        start = e.pageX;
        left_1 = parseFloat( getStyle(main,"left"));
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


//使用requestAnimationFrame优化touchmove
function drag(element){

    var startX=0,
        startY=0,
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
        startY=parseInt(touchs.pageY-(element.tops||0));

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
            element.tops = touchs.pageY - startY;

            //2交给requestAnimationFrame 更新位置
            //raf=requestAnimationFrame(function(){draw();});
            raf=requestAnimationFrame(draw);

        }

        ticking = true;
    };




    var draw= function  (){
        ticking = false;
        var widthHalf = parseFloat(getStyle(element,"width")) / 2;
        var heightHalf = parseFloat(getStyle(element,"height")) / 2;
        var bodyWidthHalf = parseFloat(getStyle(document.getElementsByTagName("body")[0],"width"))/2;
        var bodyHeightHalf = parseFloat(getStyle(document.getElementsByTagName("body")[0],"height"))/2;
        var nowLeft=parseFloat(element.lefts) - widthHalf;    //滑动的距离             touchmove时候，如果加阻力，可能有细小的抖动；我想应该是移动端 部分支持0.5px的缘故； parseInt的转化有点牵强；
        var nowTop=parseFloat(element.tops) - heightHalf;    //滑动的距离             touchmove时候，如果加阻力，可能有细小的抖动；我想应该是移动端 部分支持0.5px的缘故； parseInt的转化有点牵强；
        if((nowLeft> bodyWidthHalf - (widthHalf*2) && nowLeft< -bodyWidthHalf) && (nowTop> bodyHeightHalf - (heightHalf*2) && nowTop< -bodyHeightHalf)) {
            element.style.webkitTransform = element.style.transform = "translate3D(" + nowLeft + "px,"+nowTop+"px,0px)";
        }
        // if(nowTop> bodyHeightHalf - (heightHalf*2) && nowTop< -bodyHeightHalf) {
        //     element.style.webkitTransform = element.style.transform = "translate3D(" + nowTop + "px,-50%,0px)";
        // }
    };

    var end=function(){
        var endLeft= parseInt(element.lefts);    //滑动的距离

        //element.style.webkitTransform=element.style.transform = "translate(" + endLeft+ "px," + endTop + "px)";

        doc.removeEventListener("touchmove",update,false);
        doc.removeEventListener("touchend",end,false);
        // cancelAnimationFrame(raf);

    }

}

