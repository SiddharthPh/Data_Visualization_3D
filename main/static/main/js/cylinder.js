
			import * as THREE from './three.js-master/build/three.module.js';

			import { GUI } from './three.js-master/examples/jsm/libs/dat.gui.module.js';

			import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';
			import { Lut } from './three.js-master/examples/jsm/math/Lut.js';

			let container;
            let canv;

			let perpCamera, orthoCamera, renderer, lut;

			let mesh, sprite;
			let scene, uiScene;

			let params;
            var fps=1;
            var width;
            var height;
            var raycaster=new THREE.Raycaster();
            var mouse = new THREE.Vector2();


			init();
            // update();
			function init() {

				container = document.getElementById( 'col2' );
                // console.log(container.offsetWidth)
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xc4c4c4 );

				uiScene = new THREE.Scene();

				lut = new Lut();

                width = 450;
                 height = 300;
                // console.log(width)

				perpCamera = new THREE.PerspectiveCamera( 60, width / height, 1, 100 );
				perpCamera.position.set( 0, 0, 40 );
				scene.add( perpCamera );

				orthoCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 1, 2 );
				orthoCamera.position.set( 0.5, 0, 1 );

				sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
					map: new THREE.CanvasTexture( lut.createCanvas() )
				} ) );
				sprite.scale.x = 0.1;
                sprite.position.x=1
				uiScene.add( sprite );

				mesh = new THREE.Mesh( undefined, new THREE.MeshLambertMaterial( {
					side: THREE.DoubleSide,
					color: 0xF5F5F5,
					vertexColors: true
				} ) );
				scene.add( mesh );

				params	= {
					colorMap: 'rainbow',
				};

				const pointLight = new THREE.PointLight( 0xffffff, 1 );
				perpCamera.add( pointLight );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.autoClear = false;
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( width, height );
				container.appendChild( renderer.domElement );
                loadModel( );

				window.addEventListener( 'resize', onWindowResize );

				const controls = new OrbitControls( perpCamera, renderer.domElement );
				controls.addEventListener( 'change', render );

				var gui = new GUI({autoPlace:false});
                var customcont=document.getElementById('container1');
                customcont.appendChild(gui.domElement)
                // gui.domElement.id=guid;
                // gui.position.y=-1
				gui.add( params, 'colorMap', [ 'rainbow', 'cooltowarm', 'blackbody', 'grayscale' ] ).onChange( function () {

					updateColors();
					render();

				} );
                uiScene.add(gui)

			}

			function onWindowResize() {

				const width = 500;
				const height = 500;

				perpCamera.aspect = width / height;
				perpCamera.updateProjectionMatrix();

				renderer.setSize( width, height );
				render();

			}

			function render() {
				renderer.clear();
                // raycaster.setFromCamera( mouse, perpCamera );
				renderer.render( scene, perpCamera );
				renderer.render( uiScene, orthoCamera );
                // loadModel();
			}



			function loadModel( ) {
                setTimeout(function(){
                    // updatetemp();
                    var geometry=new THREE.CylinderGeometry( 5, 5, 40, 33,31 );
                    geometry.center();

                    geometry.rotateX(-1.54);
                    geometry.rotateY(-0.3);
                    var temps=updatetemp(geometry)  
                    document.getElementById("temp-1").innerHTML=temps[210]
                    document.getElementById("temp-2").innerHTML=temps[420]
                    document.getElementById("temp-3").innerHTML=temps[630]
                    document.getElementById("temp-4").innerHTML=temps[840]

                    geometry.setAttribute('Temperature',new THREE.Float32BufferAttribute(temps,1));
                    // console.log(geometry.attributes)
					geometry.computeVertexNormals();
                    // console.log(geometry)
					// default color attribute
					const colors = [];

					for ( let i = 0, n = geometry.attributes.position.count; i < n;++i) {

						colors.push( 0, 0, 0 );
                        

					}

					geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

					mesh.geometry = geometry;
					updateColors();

					render();
                    canv=document.getElementById("col2").children[1]
                    canv.addEventListener( 'click', onPointerMove,false );
                    requestAnimationFrame(loadModel);
                },1000/fps);
			}

            function onPointerMove( event ) {

				// pointer.x = ( event.clientX / window.innerWidth) * 2 - 1;
				// pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                // mouse.x=(event.clientX/window.innerWidth)*2-1;
                // mouse.y=-(event.clientX/window.innerHeight)*2+1;
                mouse.x=((event.clientX/canv.width)-1.813)*2-1;
                mouse.y=-((event.clientY/canv.height)-0.56)*2+1;
                raycaster.setFromCamera(mouse,perpCamera);
                var intersects = raycaster.intersectObjects( scene.children,true);
                // console.log(event.clientY)
                // console.log(intersects)


                mouse.x=((event.clientX/canv.width)-1.813)*2-1;
                mouse.y=-((event.clientY/canv.height)-0.56)*2+1;
                raycaster.setFromCamera(mouse,perpCamera);
                var intersects = raycaster.intersectObjects( scene.children);
                // console.log(intersects.length) 

                if(intersects.length){
                // console.log(event.clientY)
                // temperat=intersects
                var intersection=intersects[0];
                var vA = new THREE.Vector3();
                var vB = new THREE.Vector3();
                var vC = new THREE.Vector3();
                var face1 = intersection.face;
                var geometry1 = intersection.object.geometry;
                var temperat = geometry1.attributes.Temperature;

                var tempdisplay=vA.fromBufferAttribute( temperat, face1.a ).x;
                // vB.fromBufferAttribute( temperat, face1.b );
                // vC.fromBufferAttribute( temperat, face1.c );
                // var posx=intersection.point.x
                // var posy=intersection.point.y
                // var posz=intersection.point.z
                // var element;
                // var check=1;
                // while(check==1){
                //    var ind= intersection.object.geometry.attributes.position.array.find(element=> element==posx)
                // }
                // var ind=intersection.object.geometry.attributes.position;
                // var temperat=intersection.object.geometry.attributes.Temperature.array.findIndex(indexpos);
                document.getElementById("tooltip").innerHTML=tempdisplay
                console.log(tempdisplay)

                
                }

			}
            // function indexpos(pos){
            //     return pos
            // }


			function updatetemp(geometry){
                var temps=[];
                var temp=0;
                    var temp=1000;
                    var temp=1000;
                    
                        // console.log(geometry.attributes.position)
                    // console.log(geometry.attributes.position.array[0])
                    var sensor=[250,600,800,700];
                    var j=3;
                    var temp1=1000;
                    var diff=20;
                    var tempo=0;
                    var k=0;
                    var noofrounds=12
                    for(var i=0;i <geometry.attributes.position.count;i++)
                    {
                        if(i%34==0){
                            temp=Math.random()*1000;
                            temp1=temp-100;
                        }
                        // var diff=Math.floor((temp-sensor[j])/6);

                    //     if(i==0)
                    //     {
                    //         temp-=diff;
                    //         temp1=temp-100
                    //         temps.push(temp)
                    //     }
                       if(i<1054){    

                            // if(i<210){
                            //     if(i%34==0){
                            //     temp-=diff;
                            //     temp1=temp-100;
                            //     temps.push(temp);

                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }
                            // else if(i==210)
                            // {
                            // j-=1;
                            // if(i%34==0){
                            //     temp-=diff;
                            //     temp1=temp-100;
                            //     temps.push(temp);
                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }
                            // else if(i>210 && i<420)
                            // {
                            //     if(i%34==0){
                            //     temp-=diff;
                            //     temp1=temp-100;
                            //     temps.push(temp);
                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }


                            // else if(i==420)
                            // {
                            // j-=1;
                            // if(i%34==0){
                            //     temp-=diff;
                            //     temp1=temp-100;
                            //     temps.push(temp);
                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }
                            // else if(i>420 && i<630)
                            // {
                            //     if(i%34==0){
                            //     temp-=diff;
                            //     temp1=temp-100;
                            //     temps.push(temp);
                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }


                            // else if(i==630)
                            // {
                            // j-=1;
                            // if(i%34==0){
                            //     temp-=diff;
                            //     temp1=temp-100;
                            //     temps.push(temp);
                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }
                            // else if(i>630 && i<840)
                            // {
                            //     if(i%34==0){
                            //     temp-=diff;
                            //     temp1=temp-100;
                            //     temps.push(temp);
                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }
                            // else if(i==840)
                            // {
                                
                            // if(i%34==0){
                            //     temp-=20;
                            //     temp1=temp-100;
                            //     temps.push(temp);
                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }
                            // else if(i>840 && i<1054)
                            // {
                            //     if(i%34==0){
                            //     temp-=20;
                            //     temp1=temp-100;
                            //     temps.push(temp);
                            //     }
                            //     else if((i%34)<17)
                            //     temps.push(temp1);
                            //     else
                            //     temps.push(temp);
                            // }
                            // else{
                                if((i%34)<17)
                                temps.push(temp1);
                                else
                                temps.push(temp); 

                            

                        }



                        else if(i>=1054 && i<1121)
                        {
                            temps.push(1000)
                        }
                        else{
                            temps.push(32)
                        }
                    }   
                    // console.log("hey")
                    // for(var i=0;i<geometry.attributes.position.count;i++)
                    // {
                    //     temp=Math.random()*1000;
                    //     temps.push(temp);
                    // }
            return temps
                
            }
            
            function updateColors() {

				lut.setColorMap( params.colorMap );

				lut.setMax( 1000 );
				lut.setMin( 20 );

				const geometry = mesh.geometry;
				const pressures = geometry.attributes.Temperature;
				const colors = geometry.attributes.color;

				for ( let i = 0; i < pressures.array.length; i ++ ) {

					const colorValue = pressures.array[ i ];

					const color = lut.getColor( colorValue );

                    // console.log(colorValue);

					if ( color === undefined ) {

						console.log( 'Unable to determine color for value:', colorValue );

					} else {

						colors.setXYZ( i, color.r, color.g, color.b );

					}

				}

				colors.needsUpdate = true;

				const map = sprite.material.map;
				lut.updateCanvas( map.image );
				map.needsUpdate = true;

			}
