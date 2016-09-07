/**
 * Created by 周轩 on 2016/9/6.
 */
var modelFile = {
    file1:["model/file1/obj1.obj","model/file1/obj1.jpg"],
    file2:["model/file2/obj2.obj","model/file2/obj2.jpg"],
    file3:["model/file3/obj3.obj","model/file3/obj3.jpg"],
    file4:["model/file4/obj4.obj","model/file4/obj4.jpg"],
    file5:["model/file5/obj5.obj","model/file5/obj5.jpg"],
    file6:["model/file6/obj6.obj","model/file6/obj6.jpg"]
};

var FULL,prevImg;
$(function() {
    loadPredefinedPanorama();

    dragMouse("imgList","list_item2-control");

    var allImg = $(".img-control");
    prevImg = allImg.filter(".active");

    allImg.on("click",function () {
        var src = $(this).attr("data-src");

        prevImg.removeClass("active");
        $(this).addClass("active");
        prevImg = $(this);

        FULL.setModel({
            model:modelFile[src][0],
            texture:modelFile[src][1]
        }).delete().loadObject();
    });

    $("#upload").click(function () {
        $("#uploadModel").fadeIn();
    });
    $(".btn-get").on("click",function () {
        var that = $(this).prev();
        var pano = $("#pano");
        pano.trigger("click");
        pano.on("change",function () {
            var value = $(this).val();
            that.val($(this).val());
            $(this).off("change");
            var name = that.attr("name");
            var regex = new RegExp(name+"$");
            if(regex.test(value)) {
                that.removeClass("error");
            }else {
                that.addClass("error");
                popAlert("请先上传正确."+name+"格式的文件！");
                return;
            }
            upload(this);

        });

    });

    $("#submit").on("click",function () {
        var parents = $(this).parents(".modal");
        var input = parents.find(":text");
        input.each(function () {
            if(!($(this).val())){
                $(this).addClass("error");
            }
        });
        if(parents.find(".error")[0]){
            popAlert("请先上传正确的模型和贴图！")
        }else {
            FULL.delete().loadObject();
            parents.fadeOut();
        }

    });

    $(".modal").find(".close").on("click",function () {
       $(this).parents(".modal").fadeOut();
    });
    $(".all").on("click",function () {
        var header = $("header");
        if(header.css("bottom") == "110px"){
            header.animate({bottom:"-200px"});
        }else {
            header.animate({bottom:"110px"});
        }
    });
});


// Load the predefined panorama
function loadPredefinedPanorama() {

    // Loader
    var loader = document.createElement('div');
    loader.className = 'loader';
    var div = document.body;

    FULL = new ModelShow({
        model:modelFile.file1[0],
        texture:modelFile.file1[1],
        args: false,
        //默认为true;
        autoLoad:true,
        autoRotate:true,
        // Container
        container: div,

        loader: loader
    });
}

// Load a panorama stored on the user's computer
function upload(ele) {
    // Retrieve the chosen file and create the FileReader object
    var file = ele.files[0];
    var reader = new FileReader();


    reader.onload = function() {
        if(/\.obj$/.test(file.name)){
            FULL.setModel({
                model:reader.result
            });
        }else if(/\.jpg$/.test(file.name)){
            FULL.setModel({
                texture:reader.result
            });
        }
    };

    reader.readAsDataURL(file);
}
//鼠标拖动
function dragMouse(id,con) {
    var main = document.getElementById(id);
    var start,left_1,
        distance = "200px",
        flag = false;
    var mainWidthHalf = parseFloat($(main).width()) / 2;


    main.addEventListener("mousedown",onMouseDown);
    $("." + con).on("click",function () {
        var name = $(this).attr("data-name");
        if(name == "left"){
            var distance_1 = parseFloat($(main).css("left")) - parseFloat($(main).children("li").width());
            if(Math.abs(distance_1) <= mainWidthHalf/6 ) $(main).animate({left:distance_1 + "px"});
        }else if(name == "right"){
            var distance_2 = parseFloat($(main).css("left")) + parseFloat($(main).children("li").width());
            if(Math.abs(distance_2) <= mainWidthHalf/6 ) $(main).animate({left:distance_2 + "px"});
        }
    });

    function onMouseDown(e) {
        e.preventDefault();
        start = e.pageX;
        left_1 = parseFloat( $(main).css("left"));
        window.addEventListener("mouseup",onMouseUP);
        window.addEventListener("mousemove",onMouseMove);
    }

    function onMouseMove(e) {

        e.preventDefault();
        window.addEventListener("mouseup",onMouseUP);
        var tx = e.pageX - start+left_1;
        if(Math.abs(tx) < (mainWidthHalf/8 )){
            flag = false;
            main.style.left =tx +"px";
        }else {
            flag = true;
        }
        if(tx >= mainWidthHalf/8){
            distance = "-200px";
        }else {
            distance = "200px";
        }

    }


    function onMouseUP(e) {
        window.removeEventListener("mousemove",onMouseMove);
        e.preventDefault();
        if(flag){
            $(main).animate({left:distance},600);
            $(main).animate({left:'0'},"slow");
            flag = false;
        }
    }
}
//弹出提示
function popAlert(text){
    var pop = document.createElement('div');
    pop.classList.add("pop-reminder");
    pop.innerHTML = text;
    document.body.appendChild(pop);
    $(pop).fadeIn().animate({display:"block"},1000).fadeOut(function () {
        $(this).remove();
    })

}