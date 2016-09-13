    /**
     * Created by 丛慧 on 2016/6/13.
     */


    //region 全局开关
    var vrMode = false;
    var autoRotate = false;
    var onCut=false;
    //endregion
    
    //创建一个新的场景
    var mainScene = new THREE.Scene();
    //创建一个新的渲染器
    var renderer = new THREE.WebGLRenderer({antialias:true});

 

    var controls;

    //创建一个新的灯光
    var defaultAmbientLight = new THREE.AmbientLight(0xffffff);

    var defaultDirectionalLight = new THREE.DirectionalLight(0xffffff);
    defaultDirectionalLight.position.set(-1, 1.5, 0.5);
    defaultDirectionalLight.castShadow = true;
    defaultDirectionalLight.shadow.camera.zoom = 4;

    //创建新的相机
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 12000);
    

    mainScene.add(defaultAmbientLight);
    mainScene.add(defaultDirectionalLight);
   

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


            element.addEventListener('click', fullscreen, false);
            window.removeEventListener('deviceorientation', setOrientationControls, true);

        }

        window.addEventListener('deviceorientation', setOrientationControls, true);

        mainScene.add(camera);
        



        render();
    }


    function animateScene()
    {
        if(autoRotate){
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
 
  