var fullImg = {
		img1:"full/full_1.jpg",
		img2:"full/full_2.jpg",
		img3:"full/full_3.jpg",
		img4:"full/full_4.jpg",
		img5:"full/full_5.jpg",
		img6:"full/full_6.jpg"
};
var FULL,prevImg;
window.onload = function() {
	loadPredefinedPanorama();

	dragMouse("imgList","list_item2-control");

	var allImg = $(".img-control");
	prevImg = allImg.filter(".active");

	allImg.on("click",function () {
		var src = $(this).attr("data-src");

		prevImg.removeClass("active");
		$(this).addClass("active");
		prevImg = $(this);

		FULL.changePanorama(fullImg[src]);
		FULL.delete();
		FULL.load();
	});

	$("#upload").click(function () {
		$("#pano").trigger("click");
	});
	$(".all").on("click",function () {
		var header = $("header");
		if(header.css("top") == "110px"){
			header.animate({top:"-200px"});
		}else {
			header.animate({top:"110px"});
		}
	});
	document.getElementById('pano').addEventListener('change', upload, false);
};


// Load the predefined panorama
function loadPredefinedPanorama() {
	// evt.preventDefault();

	// Loader
	var loader = document.createElement('div');
	loader.className = 'loader';

	// Panorama display
	var div = document.getElementById('container');

	FULL = new PhotoSphereViewer({
		// Path to the panorama
		panorama: fullImg.img1,

		// Container
		container: div,

		// Deactivate the animation
		time_anim: false,

		// Display the navigation bar
		navbar: true,

		// Resize the panorama
		size: {
			width: '100%',
			height: '100%'
		},

		// HTML loader
		loading_html: loader
	});
}

// Load a panorama stored on the user's computer
function upload() {
	// Retrieve the chosen file and create the FileReader object
	var file = document.getElementById('pano').files[0];
	var reader = new FileReader();

	reader.onload = function() {
		FULL.changePanorama(reader.result);
		FULL.delete();
		FULL.load();
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
