// Empty JS for your own code to be here、、

//页面加载之前执行  ie9以下不兼容  (function(){})(jQuery);

$(function () {

//对于ie9及更低版本的ie，进行提示并关闭
    //判断为手机浏览器
    var ua = parseUA();
    var Sys = {};
    if (window.ActiveXObject){
        Sys.ie = ua.userAgent.match(/msie ([\d.]+)/)[1];
        if (Sys.ie<10){
            html='<div style="text-align: center;color: #666;font_aws-size: 16px;width: 100%;height: 100%;">' +
            '<h1 style="color: #456;line-height: 100px;font_aws-size: 56px;font_aws-weight: normal;">请使用指定浏览器</h1>' +
            '<p>可以尽快去<a style="color: #031f06;" href="http://www.google.cn/chrome/browser/desktop/index.html">下载Chrome</a>浏览器，就可以使用了</p></div>';
            document.body.innerHTML=html;
            document.body.style.backgroundColor='#b4cbb6';
        }
    }

});

function onPalyMusic($music, src){
    if(src){
        $music.attr('src', src);
    }
    if($music.attr('src')) {
        if($music[0].paused){
            $(this).removeClass("music-1").addClass("music rotate");
            $music[0].play();
        }else{
            $(this).removeClass("music rotate").addClass("music-1");
            $music[0].pause();
        }

    }else{
        $(this).removeClass("music").addClass("music-1");
        popReminder('此作品未添加音乐!');

    }

}

//弹出提示
function popReminder(text){
    var pop = document.createElement('div');
    pop.classList.add("pop-reminder");
    pop.innerHTML = text;
    document.body.appendChild(pop);
    $(pop).fadeIn("slow").animate({display:"block"},1500).fadeOut(function () {
        $(this).remove();
    })

}



function parseUA() {
    var u = navigator.userAgent;
    var u2 = navigator.userAgent.toLowerCase();
    return { //移动终端浏览器版本信息
        userAgent:u2,
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
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

