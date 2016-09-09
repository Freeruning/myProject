/**
 * Created by 丛慧 on 2016/6/17.
 */



var defaultSphereEnvMesh;
var mesh;
//获取sceneList中的数据，动态添加到场景
$(function(){
    for(var i=0;i<sceneList.length;i++){
        if(sceneList[i].type==0){
            SphereImg(sceneList[i].src,sceneList[i].objname,sceneList[i].args.rotation);
        }else if(sceneList[i].type==1){
            musicChange(sceneList[i].objname,sceneList[i].src,sceneList[i].args.sound);
        }else if(sceneList[i].type==2 && sceneList[i].url){
            personObj(sceneList[i].url,sceneList[i].src,sceneList[i].objname,sceneList[i].args);

        }
    }

});



//    生成背景
function  SphereImg(img,name,rotation) {

    var defaultSphereEnvGeometry = new THREE.SphereGeometry(5000, 50, 50);
    defaultSphereEnvGeometry.scale(1, 1, -1);

    var defaultSphereEnvMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(img,function () {
            var t=setTimeout(function(){
                $(".loading").fadeOut();
                clearTimeout(t);
            },3000)
        })
           
    });

    defaultSphereEnvMesh = new THREE.Mesh(defaultSphereEnvGeometry, defaultSphereEnvMaterial);

    defaultSphereEnvMesh.name = name;
    defaultSphereEnvMesh.rotation.y = rotation*Math.PI*2;

    mainScene.add(defaultSphereEnvMesh);

}

//生成音乐
function musicChange(name,music,vol){

    $('#'+name).attr({src:music,volume:vol});

    if(window.orientation === undefined) {

        $('#'+name)[0].play();
    }

}
//    生成模型
function personObj(url,img,name,args) {

    var texture = new THREE.TextureLoader().load(img);
    var loader = new THREE.OBJLoader();

    var size=args.size ? args.size : 0;
    var rotation=args.rotation ? args.rotation : 0.5;
    var position=args.position ? args.position : {x:0,y:0,z:200};

    loader.load(url, function (obj) {
        obj.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
                child.material.side = THREE.DoubleSide;
            }
        });

        var objScale=normalizeScale(obj,50);
        obj.scale.set(size+objScale, size+objScale,size+objScale);

        obj.position.set(position.x, position.y, position.z);
        obj.rotation.y =rotation*Math.PI*2;
        obj.name = name ? name : randomString(10);

        mainScene.add(obj);

        mesh=[];
        mesh.push( obj.children[0] );

        $("#replaceMaterial").trigger('objectCreated', [obj.name]);

        THREE.Cache.clear();

    }, onProgress, onError);
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