
function SwitchingScene(e) {
    var d = {};
    var onCut=false;
    var mesh= [];
    var switchingNum = 1;
    d.nowBackground = undefined;
    d.nowObject = undefined;
    d.autoLoad = e.autoLoad ? e.autoLoad : true;
    d.autoRotate = e.autoRotate ? e.autoRotate : false;
    d.vrMode = e.vrMode ? e.vrMode : false;
    d.switchingMode = e.switchingMode ? e.switchingMode : false;
    var textureBG = e.textureBG;
    var textureOBJ = e.textureOBJ;
    var modelOBJ = e.modelOBJ;
    var SwitchingBG = e.SwitchingBG ;
    var SwitchingOBJ = e.SwitchingOBJ;
    //
    var tagHtml = document.createElement( 'div' );
    tagHtml.innerHTML='<div style="width: 10px;height: 10px;background-color: red;position: fixed;top: 50%;left: 50%;margin-top:-5px;margin-left: -5px;z-index: 5;border-radius: 10px;"></div>';
    document.body.appendChild(tagHtml);

    var popHtml = document.createElement( 'div' );
    popHtml.style.display="none";
    popHtml.innerHTML= '<div style="position: fixed;top: 50%;left: 50%;padding: 10px;background-color: #89cdef;z-index: 5;color: #000;"><span id="popTime">5</span>秒后跳转另一场景</div>';
    document.body.appendChild( popHtml );

    d.cursorTag = e.cursorTag ? e.cursorTag : tagHtml;//中间红点
    d.popTag = e.popTag ? e.popTag : popHtml;//提示信息

    d.container = e.container ? e.container : document.body;
    var width = parseInt(getStyle(d.container,"width"));
    var height = parseInt(getStyle(d.container,"height"));

    var intersected;
    //创建一个新的场景
    var mainScene = new THREE.Scene();
    //创建一个新的渲染器
    var renderer = new THREE.WebGLRenderer({antialias:true});

    var TextureLoader = new THREE.TextureLoader();
    var OBJLoader = new THREE.OBJLoader();
    var defaultSphereEnvGeometry = new THREE.SphereGeometry(5000, 50, 50);
    defaultSphereEnvGeometry.scale(1, 1, -1);
    var defaultSphereEnvMaterial = new THREE.MeshBasicMaterial();
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
    var camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 12000);



    mainScene.add(defaultAmbientLight);
    mainScene.add(defaultDirectionalLight);
    renderer.setSize(width, height);
    d.container.appendChild(renderer.domElement);

    //VR 采用cardbroad方案
    effect = new THREE.CardboardEffect(renderer);
    effect.setSize(width, height);
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
    var flag = true;//开关，手机上只要移动到模型上就开始倒计时了。
        // Our preferred controls vi DeviceOrientation
        function setOrientationControls(e) {
            if (!e.alpha) {
                return
            }else{
                controls.enabled = false;
            }

            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();

            sceneChange();
            if(flag){
                sceneChangeEnd();
            }


            element.addEventListener('click', fullscreen, false);
            window.removeEventListener('deviceorientation', setOrientationControls, true);

        }

    window.addEventListener('deviceorientation', setOrientationControls, true);

    //camera.rotation.y=Math.PI;
    mainScene.add(camera);
    //
    if(d.switchingMode){
        controls.addEventListener('change',sceneChange,false);
        controls.addEventListener('end',sceneChangeEnd,false);
    }


    render();

        function animateScene() {
            if(d.autoRotate && d.nowObject){
                //camera.rotation.y -= 0.001;
                d.nowObject.rotation.y += 0.01;
                d.nowObject.rotation.x += 0.01;
            }
            render();
        }
        //渲染（）
        function render() {
            if (d.vrMode) {
                //vr模式采用Effect渲染方式
                effect.render(mainScene, camera);
            } else {
                //普通模式采用普通渲染方式
                renderer.render(mainScene, camera);
            }

            //递归.反复执行渲染render这个函数
            requestAnimationFrame(animateScene);
        }


        function onWindowResize() {
            var width = parseInt(getStyle(d.container,"width"));
            var height = parseInt(getStyle(d.container,"height"));
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            effect.setSize(width, height);
        }
        function toggleVR() {
            d.vrMode = !d.vrMode;
        }
        function toggleAutoRotate() {
            d.autoRotate = !d.autoRotate;
        }


    d.getScene = function () {
        return mainScene;
    };
    d.loadBackground =  function() {
        if(!textureBG){
            console.log("你没有添加全景图的url！");
            return;
        }
        defaultSphereEnvMaterial.map = TextureLoader.load(textureBG);

        var defaultSphereEnvMesh = new THREE.Mesh(defaultSphereEnvGeometry, defaultSphereEnvMaterial);
        defaultSphereEnvMesh.name = "defaultSphere";

        mainScene.add(defaultSphereEnvMesh);
        d.nowBackground = defaultSphereEnvMesh;

        return d;
    };
    d.deleteBackground = function (){
        if(d.nowBackground){
            d.nowBackground.material.map.dispose();
            mainScene.remove(d.nowBackground);
        }else{
            console.log('no find name is background!!')
        }
        return d;
    };
    //    生成模型
    d.loadObject =  function() {
        // loader.style.display = "block"; //显示loading

        if(!textureOBJ) console.log("你没有添加贴图的url！");
        if(!modelOBJ) console.log("你没有添加模型的url！");
        if(!textureOBJ || !modelOBJ) return;

        var textureMaterial = TextureLoader.load(textureOBJ);

        this.obj = OBJLoader.load(modelOBJ, function (obj) {
            obj.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = textureMaterial;
                    child.material.side = THREE.DoubleSide;
                }
            });

            var objScale=normalizeScale(obj,70);
            obj.scale.set(objScale,objScale,objScale);
            obj.position.set(0,0,400);
            // obj.rotation.y =rotation*Math.PI*2;
            obj.name = "defaultObject";

            mainScene.add(obj);
            d.nowObject = obj;
            mesh = [];
            mesh.push( obj.children[0] ); //射线相交查询的数组
            THREE.Cache.clear();
            // loader.style.display = "none"; //隐藏loading
        });
        return d;
    };

    d.deleteObject = function () {
        if(d.nowObject) {
            d.nowObject.children[0].geometry.dispose();
            mainScene.remove(d.nowObject);
        }else{
            console.log('no find this model !!')
        }
        return d;
    };
    d.setMeshValue = function (c) {
        if(c.textureBG) textureBG = c.textureBG;
        if(c.textureOBJ) textureOBJ = c.textureOBJ;
        if(c.modelOBJ) modelOBJ = c.modelOBJ;
        return d;
    };

    if(d.autoLoad) {
        d.loadBackground();
        d.loadObject();
    }
    var time01;
    function sceneChange() {

        //更新选择射线照相机和鼠标位置
        mouse.x=0;
        mouse.y=0;
        raycaster.setFromCamera( mouse, camera );
        var num = 3;
        var intersections;

        //返回当前选中的模型
        intersections = raycaster.intersectObjects( mesh );

        if(intersections)
            if ( intersections.length > 0 ) {
                if ( intersected != intersections[ 0 ].object ) {

                    intersected = intersections[ 0 ].object;
                    // intersected.material.color.setHex( 0x000000 );
                    d.autoRotate = false;
                    var obj3dScale = intersected.parent.scale;
                    obj3dScale.set(obj3dScale.x + num,obj3dScale.y + num,obj3dScale.z + num);
                }
               
                d.popTag.style.display = 'block';
                onCut=true;


            }else if ( intersected ) {
                onCut=false;
                clearInterval(time01);
                document.getElementById("popTime").innerHTML= 5;
                flag = true;
                var obj3dScale1 = intersected.parent.scale;
                obj3dScale1.set(obj3dScale1.x - num,obj3dScale1.y - num,obj3dScale1.z - num);
                d.popTag.style.display = 'none';
                d.autoRotate = true;
                intersected = null;//清空intersected
            }

    }

    function sceneChangeEnd() {
        element.classList.remove("active");
        var i3= 4;
        if(onCut){
            flag = false;
            document.getElementById("popTime").innerHTML= 5;
            time01=setInterval(function(){
                document.getElementById("popTime").innerHTML= i3;

                if(i3==0){
                    element.classList.add("active_1");
                    clearInterval(time01);
                    textureBG = SwitchingBG["img"+(switchingNum % 6 + 1)];
                    d.deleteBackground().loadBackground();

                    modelOBJ = SwitchingOBJ["file"+(switchingNum % 6 + 1)][0];
                    textureOBJ = SwitchingOBJ["file"+(switchingNum % 6 + 1)][1];
                    d.deleteObject().loadObject();
                    switchingNum++;
                    
                    element.classList.remove("active_1");
                    element.classList.add("active");

                }
                i3--;
            },1000);
            
            document.body.style.cursor = 'pointer';
        }else{

            document.body.style.cursor = 'auto';
            document.getElementById("popTime").innerHTML= '5';
        }

    }

    return d;
}





//获取元素的样式
function getStyle(obj,styleName){
    if(obj.currentStyle){
        return obj.currentStyle[styleName];
    }else{
        return getComputedStyle(obj,null)[styleName];
    }
}


function normalizeScale(theObject,fc) {
    var objBoundary =
    {
        xMax:undefined,
        xMin:undefined,
        yMax:undefined,
        yMin:undefined,
        zMax:undefined,
        zMin:undefined
    };
    theObject.traverse(
        function (theChild) {
            if (theChild instanceof THREE.Mesh) {
                var vPosition = [];
                try{
                    vPosition = theChild.geometry.attributes.position.array;
                }
                catch (e)
                {
                    console.log(e);
                    return;
                }
                if (vPosition.length != 0) {
                    var xyzArray = [0, 0, 0, 0, 0, 0];
                    var j = 0;
                    for (var i = 0; i < vPosition.length; i++) {
                        if (j == 3) {
                            j = 0;
                        }
                        if (i == 0) {
                            xyzArray[0] = vPosition[0];
                            xyzArray[1] = vPosition[0];
                        }
                        else if (i == 1) {
                            xyzArray[2] = vPosition[1];
                            xyzArray[3] = vPosition[1];
                        }
                        else if (i == 2) {
                            xyzArray[4] = vPosition[2];
                            xyzArray[5] = vPosition[2];
                        }
                        else {
                            xyzArray[j * 2] = xyzArray[j * 2] > vPosition[i] ? xyzArray[j * 2] : vPosition[i];
                            xyzArray[j * 2 + 1] = xyzArray[j * 2 + 1] < vPosition[i] ? xyzArray[j * 2 + 1] : vPosition[i];
                        }
                        j++;
                    }
                    objBoundary.xMax = objBoundary.xMax > xyzArray[0] ? objBoundary.xMax : xyzArray[0];
                    objBoundary.xMin = objBoundary.xMin < xyzArray[1] ? objBoundary.xMin : xyzArray[1];
                    objBoundary.yMax = objBoundary.yMax > xyzArray[2] ? objBoundary.yMax : xyzArray[2];
                    objBoundary.yMin = objBoundary.yMin < xyzArray[3] ? objBoundary.yMin : xyzArray[3];
                    objBoundary.zMax = objBoundary.zMax > xyzArray[4] ? objBoundary.zMax : xyzArray[4];
                    objBoundary.zMin = objBoundary.zMin < xyzArray[5] ? objBoundary.zMin : xyzArray[5];
                    //console.log(xyzArray);
                }
                else {
                    console.log('normalizeScale Error!');
                }
            }
        }
    );
    var deltaX = objBoundary.xMax - objBoundary.xMin;
    var deltaY = objBoundary.yMax - objBoundary.yMin;
    var deltaZ = objBoundary.zMax - objBoundary.zMin;
    var theMax = deltaX > deltaY ? deltaX : deltaY;
    theMax = deltaZ > theMax ? deltaZ : theMax;
    //console.log(fc/theMax);
    return fc/theMax;
}