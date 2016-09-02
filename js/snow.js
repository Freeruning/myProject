$(function () {
    saku();

});
function saku(){
    var particles = [],particle,AMOUNTX=35,AMOUNTY=35;
    var PI2 = Math.PI * 2;
    var windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;
    var distance=200;
    console.log(windowHalfX);
    console.log(windowHalfY);

    var speed=0.7;
    var aaf = new THREE.TextureLoader().load( 'images/xue_1.png');
    var abf = new THREE.TextureLoader().load( 'images/xue_2.png');
    var acf = new THREE.TextureLoader().load( 'images/xue_3.png');

    var i = 0;
    var u;
    var sakuras =[aaf,abf,acf];
    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
            particle=particles[i] = new THREE.Sprite();
            i++;
            u = iy % 3;
            particle.material.map=sakuras[u];
            particle.position.x = Math.random() * distance *2 - distance;
            particle.position.y = Math.random() * distance *2 - distance;
            particle.position.z = Math.random() * distance *2 - distance;
            particle.scale.z=particle.scale.x=particle.scale.y=Math.random()*2+3;

            mainScene.add( particle );
        }
    }
    function render() {

        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];

            with(particle.position)
            {
                if(y>-distance){
                    y-=speed;
                }else {
                    y+=distance*2;
                }

                if(x>-distance){
                    x-=speed/2;
                } else {
                    x+=distance *2;
                }

            }
        }

        requestAnimationFrame( render );
    }
    render();
}
