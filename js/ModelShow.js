/**
 * Created by 周轩 on 2016/9/6.
 */

function ModelShow(e) {

    var autoLoad,
        autoRotate,
        size,
        rotation,
        position,
        texture,
        model,
        container,
        width,
        height,
        defaultObject,
        loader;
    
        autoLoad = e.autoLoad ? e.autoLoad : true;
        autoRotate = e.autoRotate ? e.autoRotate : false;
        size=e.args ? e.args.size : 0;
        rotation=e.args ? e.args.rotation : 0.5;
        position=e.args ? e.args.position : {x:0,y:-20,z:0};
        texture = e.texture;
        model = e.model;
        container = e.container ? e.container : document.body;
        width = parseInt(getStyle(container,"width"));
        height = parseInt(getStyle(container,"height"));
        defaultObject = undefined;
        //loading
        if(!!e.loader){
            loader = e.loader
        }else{
            loader =  document.createElement('div');
            loader.style.position ="relative";
            loader.style.width ="100%";
            loader.style.height ="100%";
            var loadP =  document.createElement('p');
            loadP.innerHTML = 'loading...';
            loadP.style.position ="absolute";
            loadP.style.top ="49%";
            loadP.style.left ="49%";
            loader.appendChild(loadP);
        }
        container.appendChild(loader);

        //创建一个新的场景
        var mainScene = new THREE.Scene();
        //创建一个新的渲染器
        var renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( width, height );
        // renderer.setClearColor(0x000000,0.5);
        var controls;
        var TextureLoader = new THREE.TextureLoader();
        var OBJLoader = new THREE.OBJLoader();
        //创建一个新的灯光
        var defaultAmbientLight = new THREE.AmbientLight(0xffffff);

        var defaultDirectionalLight = new THREE.DirectionalLight(0xffffff);
        defaultDirectionalLight.position.set( 1000, 1000, 2000 );


         //创建新的相机
        camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
        camera.position.z = 120;

        mainScene.add(defaultAmbientLight);
        mainScene.add(defaultDirectionalLight);

        renderer.setSize(width , height);
        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
        renderer.domElement.addEventListener('dblclick', toggleAutoRotate, false);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        mainScene.add(camera);
        render();



    function animateScene() {
        if(autoRotate && defaultObject != undefined){
            // camera.rotation.y -= 0.01;
            defaultObject.rotation.y += 0.01;
        }
        render();
    }

//渲染（）
    function render() {
        renderer.render(mainScene, camera);
        requestAnimationFrame(animateScene);

    }
    function onWindowResize() {
        var width = parseInt(getStyle(container,"width"));
        var height = parseInt(getStyle(container,"height"));
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    function toggleAutoRotate() {
        autoRotate = !autoRotate;
    }

    //    生成模型
    this.loadObject =  function() {
        loader.style.display = "block"; //显示loading

        if(!texture) console.log("你没有添加贴图的url！");
        if(!model) console.log("你没有添加模型的url！");
        if(!texture || !model) return;

        var textureMaterial = TextureLoader.load(texture);

        this.obj = OBJLoader.load(model, function (obj) {
            obj.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = textureMaterial;
                    child.material.side = THREE.DoubleSide;
                }
            });

            var objScale=normalizeScale(obj,50);
            obj.scale.set(size+objScale, size+objScale,size+objScale);

            obj.position.set(position.x, position.y, position.z);
            obj.rotation.y =rotation*Math.PI*2;
            obj.name = "defaultObject";

            mainScene.add(obj);
            defaultObject = obj;
            THREE.Cache.clear();
            loader.style.display = "none"; //隐藏loading
        });
        return this;
    };

    this.delete = function () {
        if(defaultObject) {

            defaultObject.children[0].geometry.dispose();
            mainScene.remove(defaultObject);
        }else{
            console.log('no find this model !!')
        }
        return this;
    };
    this.setModel = function (d) {
        if(d.texture) texture = d.texture;
        if(d.model) model = d.model;
        return this;
    };

    if(autoLoad) this.loadObject();

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