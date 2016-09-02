    /**
     * Created by 丛慧 on 2016/6/13.
     */


    //region 全局开关
    var vrMode = false;
    var autoRotate = false;
    var onCut=false;
    //endregion

    var intersected,pop,mesh,time;
    var INTERSECTED, SELECTED;
    //创建一个新的场景
    var mainScene = new THREE.Scene();
    //创建一个新的渲染器
    var renderer = new THREE.WebGLRenderer({antialias:true});

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var controls;

    //创建一个新的灯光
    var defaultAmbientLight = new THREE.AmbientLight(0xffffff);

    var defaultDirectionalLight = new THREE.DirectionalLight(0xffffff);
    defaultDirectionalLight.position.set(-1, 1.5, 0.5);
    defaultDirectionalLight.castShadow = true;
    defaultDirectionalLight.shadow.camera.zoom = 4;

    //创建新的相机
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 12000);

    //增加一个状态更新（FPS）查看器
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '410px';
    stats.domElement.style.display = 'none';
    document.body.appendChild(stats.domElement);


    mainScene.add(defaultAmbientLight);
    mainScene.add(defaultDirectionalLight);
    //
    //var redHtml='<div style="width: 10px;height: 10px;background-color: red;position: fixed;top: 50%;left: 50%;margin-top:-5px;margin-left: -5px;z-index: 5;border-radius: 10px;"></div>';
    //red = document.createElement( 'div' );
    //red.innerHTML=redHtml;
    //document.body.appendChild(red);
    //
    //pop = document.createElement( 'div' );
    //pop.style.display="none";
    //pop.innerHTML= '<div style="position: fixed;top: 50%;left: 50%;padding: 10px;background-color: #89cdef;z-index: 5;color: #000;"><span id="popTime">5</span>秒后跳转另一场景</div>';
    //document.body.appendChild( pop );

    //初始化场景
    function initScene()
    {
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        //container = document.body;

        //VR 采用cardbroad方案
        effect = new THREE.CardboardEffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', onWindowResize, false);
        renderer.domElement.addEventListener('dblclick', toggleAutoRotate, false);

        //旋转控制器 当不使用设备旋转的时候采用手动旋转控制器的方式进行旋转
        element = renderer.domElement;


        controls = new THREE.OrbitControls(camera, element);
        controls.target.set(
            camera.position.x + 0.15,
            camera.position.y,
            camera.position.z
        );
        controls.noPan = true;
        controls.minDistance =0.15;
        controls.maxDistance = 6000;
        controls.zoomSpeed = 3;
        //controls.noZoom = true;



        // Our preferred controls via DeviceOrientation
        function setOrientationControls(e)
        {
            if (!e.alpha)
            {
                return;
            }else{
                controls.enabled=false;
            }

            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();

            //sceneChange();

            element.addEventListener('click', fullscreen, false);
            window.removeEventListener('deviceorientation', setOrientationControls, true);

        }

        window.addEventListener('deviceorientation', setOrientationControls, true);

        //camera.rotation.y=Math.PI;
        mainScene.add(camera);
        //
        //controls.addEventListener('change',sceneChange,false);
        //controls.addEventListener('end',sceneChangeEnd,false);



        render();
    }


    function animateScene()
    {
        if(autoRotate){
            //camera.rotation.y -= 0.001;
            defaultSphereEnvMesh.rotation.y += 0.001;
        }
        render();
    }




    //渲染（）
    function render()
    {


        if (vrMode)
        {
            //vr模式采用Effect渲染方式
            effect.render(mainScene, camera);
        }
        else
        {
            //普通模式采用普通渲染方式
            renderer.render(mainScene, camera);
        }


        //递归.反复执行渲染render这个函数
        requestAnimationFrame(animateScene);
        //stats.update();
    }


    function onWindowResize()
    {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        effect.setSize(window.innerWidth, window.innerHeight);
    }



    window.onload = initScene;

    function toggleVR()
    {
        vrMode = !vrMode;
    }
    function toggleAutoRotate()
    {
        autoRotate = !autoRotate;
    }


   var getScene = function ()
    {
        return mainScene
    };


    var sceneChange  = function () {

        //更新选择射线照相机和鼠标位置
        mouse.x=0;
        mouse.y=0;
        raycaster.setFromCamera( mouse, camera );

        var intersections;

        //返回当前选中的模型
        intersections = raycaster.intersectObjects( mesh );

        if(intersections)
        if ( intersections.length > 0 ) {
            if ( intersected != intersections[ 0 ].object ) {

                //if ( intersected ) intersected.material.color.setHex( baseColor );

                intersected = intersections[ 0 ].object;
                //intersected.material.color.setHex( intersectColor );

            }
            pop.style.display = 'block';
            onCut=true;

        }
        else if ( intersected ) {
            onCut=false;
            intersected = null;
            pop.style.display = 'none';
        }

    };
    var sceneChangeEnd  = function () {
        element.classList.remove("active");

        var i3= 4,time01;
        if(onCut){
            document.getElementById("popTime").innerHTML= 5;
            time01=setInterval(function(){

                document.getElementById("popTime").innerHTML= i3;

                if(i3==0){
                    element.classList.add("active_1");
                    clearInterval(time01);
                }

                i3--;
            },1000);

            clearTimeout(time);
            time= setTimeout(function(){


                deleteImg('defaultSphereEnvMesh');
                SphereImg("images/full/fullview_"+Math.ceil(Math.random()*20)+".jpg",'defaultSphereEnvMesh',0);
                element.classList.remove("active_1");
                element.classList.add("active");

                clearInterval(time01);

            },6000);
            document.body.style.cursor = 'pointer';
        }else{


            document.body.style.cursor = 'auto';
            clearTimeout(time);
            document.getElementById("popTime").innerHTML= '3';
        }
    };

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }

    };

    var onError = function ( xhr ) { }

    function deleteImg(name){
        if(mainScene.getObjectByName(name)){
            mainScene.getObjectByName(name).material.map.dispose();
            mainScene.remove(  mainScene.getObjectByName(name) );
        }else{
            console.log('no find name is '+ name+'!!')
        }

    }