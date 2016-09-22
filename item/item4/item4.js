

    //region 全局开关
    var autoRotate = false;
    var isDrag = true;
    //endregion
    
    //创建一个新的场景
    var mainScene = new THREE.Scene();
    //创建一个新的渲染器
    var renderer = new THREE.WebGLRenderer({antialias:true});
    var textGeo, material;

    var plane = new THREE.Plane();
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2(),
        offset = new THREE.Vector3(),
        intersection = new THREE.Vector3(),
        INTERSECTED, SELECTED;
    var objects = [];
    var textPosition = {
        text1:[2513,843,3432],
        text2:[3185,898,2098],
        text3:[3598,839,272],
        text4:[4000,822,-1246],
        text5:[4106,751,-2524]

    };
    var text = {};
    $(".change-font").find("input").each(function (index) {
        text["text" + (index + 1)] = this.value ? this.value : "你好";

    });
    var  oneAngle= Math.PI/180;
    var textRotation ={
        text1:[0,-90*oneAngle,3*oneAngle],
        text2:[0,-105*oneAngle,0],
        text3:[0,-90*oneAngle,4*oneAngle],
        text4:[0,-90*oneAngle,5*oneAngle],
        text5:[0,-105*oneAngle,0]
    };

    var height = 2,
        size = 60,
        curveSegments = 4,
        bevelThickness = 2,
        bevelSize = 0.1,
        bevelEnabled = false,
        mirror = false,
        font = undefined;

    var controls;
    var defaultSphereEnvMesh;
    var backgroundImg = "../../images/full_font.jpg";

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

        window.addEventListener('resize', onWindowResize, false);
        element = renderer.domElement;

        material = new THREE.MultiMaterial( [
            new THREE.MeshPhongMaterial( { color: 0xf1e489, shading: THREE.FlatShading } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffff00, shading: THREE.SmoothShading } ) // side
        ] );

        controls = new THREE.OrbitControls(camera, element);
        controls.target.set(
            camera.position.x + 0.15,
            camera.position.y,
            camera.position.z
        );
        controls.noPan = true;
        controls.minDistance =0.15;
        controls.maxDistance = 1000;
        controls.zoomSpeed = 3;

        mainScene.add(camera);
        camera.rotation.y = -Math.PI/2;

        SphereImg(backgroundImg,loadFont);

        if(isDrag){
            renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
            renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
            renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
        }

        render();
    }


    function animateScene() {
        if(autoRotate){
            defaultSphereEnvMesh.rotation.y += 0.001;
        }
        render();
    }
    function render() {
        renderer.render(mainScene, camera);
        requestAnimationFrame(animateScene);
    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.onload = initScene;

    //生成球形背景
    function  SphereImg(img,fun) {

        var defaultSphereEnvGeometry = new THREE.SphereGeometry(5000, 50, 50);
        defaultSphereEnvGeometry.scale(1, 1, -1);

        var defaultSphereEnvMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(img,function () {
                fun();//载入字体
            })

        });

        defaultSphereEnvMesh = new THREE.Mesh(defaultSphereEnvGeometry, defaultSphereEnvMaterial);

        defaultSphereEnvMesh.name = "defaultSphereEnvMesh";

        mainScene.add(defaultSphereEnvMesh);

    }

    function loadFont() {
        var loader = new THREE.FontLoader();
        loader.load( '../../font/FZDaHei-B02S_Regular.typeface.json', function ( response ) {
            font = response;
            refreshText();
            document.getElementById("loading").style.display = "none";
        } );

    }
    function createText() {
        objects =[];
        for(var k in text){
            textGeo = new THREE.TextGeometry( text[k], {

                font: font,

                size: size,
                height: height,
                curveSegments: curveSegments,

                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelEnabled: bevelEnabled


            });

            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            textMesh = new THREE.Mesh( textGeo, material );


            textMesh.position.x = textPosition[k][0];
            textMesh.position.y = textPosition[k][1];
            textMesh.position.z = textPosition[k][2];
            // textMesh.position.z = -4700;

            textMesh.scale.set(2,2,2);
            textMesh.rotation.x = textRotation[k][0];
            textMesh.rotation.y = textRotation[k][1];
            textMesh.rotation.z = textRotation[k][2];
            mainScene.add( textMesh );
            objects.push( textMesh );
        }



    }

    function refreshText() {

        for(var i=0;i<objects.length;i++){
            mainScene.remove( objects[i]);
        }

        if ( !text ) return;
        // 对于字体库比较大，可以把字体库放在服务器上，然后需要什么字，直接发出请求。
        // $.ajax({
        //     type: "POST",
        //     url: "font/new_song.json",
        //     data:text,
        //     dataType: "json",
        //     success: function(data){
        //         font.data.glyphs[data.name] = data.font;
        //         createText();
        //     }
        //
        // });

        createText();
    }
    function onDocumentMouseMove( event ) {

        event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        if ( SELECTED ) {

            if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

                SELECTED.position.copy( intersection.sub( offset ) );

            }

            return;

        }

        var intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 ) {

            if ( INTERSECTED != intersects[ 0 ].object ) {

                // if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                INTERSECTED = intersects[ 0 ].object;
                // INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

                plane.setFromNormalAndCoplanarPoint(
                    camera.getWorldDirection( plane.normal ),
                    INTERSECTED.position );

            }

            document.body.style.cursor = 'pointer';

        } else {

            // if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

            INTERSECTED = null;

            document.body.style.cursor = 'auto';

        }

    }

    function onDocumentMouseDown( event ) {
        event.preventDefault();

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 ) {

            controls.enabled = false;

            SELECTED = intersects[ 0 ].object;

            if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

                offset.copy( intersection ).sub( SELECTED.position );

            }

            document.body.style.cursor = 'move';

        }

    }

    function onDocumentMouseUp( event ) {
        event.preventDefault();

        controls.enabled = true;

        if ( INTERSECTED ) {

            SELECTED = null;

        }

        document.body.style.cursor = 'auto';

    }



