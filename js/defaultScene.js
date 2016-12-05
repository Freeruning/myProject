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
            },1000)
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


