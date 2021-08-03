
			import * as THREE from './three.js-master/build/three.module.js';

			import { GUI } from './three.js-master/examples/jsm/libs/dat.gui.module.js';
			import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js';
			import { OBJLoader } from './three.js-master/examples/jsm/loaders/OBJLoader.js';
			// import {FontLoader}
			import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';
			import { Lut } from './three.js-master/examples/jsm/math/Lut.js';
			import { RoughnessMipmapper } from './three.js-master/examples/jsm/utils/RoughnessMipmapper.js';

			import { CSS2DRenderer, CSS2DObject } from './three.js-master/examples/jsm/renderers/CSS2DRenderer.js';
			let container;

			let perpCamera, orthoCamera, renderer, lut;

			let mesh, sprite;
			let scene, uiScene;

			let params;
			let roughnessMipmapper;
			let geometry;
			let group,labelRenderer;
			var maxtemp=0,mintemp=0;
            var fps=1
            var earthDiv,moonDiv;
            var earthLabel,moonLabel;
			var manager;

			init();
            

			function init() {

				container = document.getElementById( 'container' );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );

				uiScene = new THREE.Scene();
				group=new THREE.Group();
				lut = new Lut();

				const width = window.innerWidth;
				const height = window.innerHeight;

				perpCamera = new THREE.PerspectiveCamera( 50, width / height, 1, 100 );
				perpCamera.position.set( 5, 10, 15 );
				scene.add( perpCamera );

				orthoCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 1, 2 );
				orthoCamera.position.set( 0.5, 0, 1 );
				sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
					map: new THREE.CanvasTexture( lut.createCanvas() )
				} ) );
				sprite.scale.x = 0.05;
				// sprite.geometry.rotation=1;
				// sprite.rotation.set(Math.PI/2,Math.PI/2,Math.PI/2)
				group.add(sprite)



				labelRenderer = new CSS2DRenderer();
				labelRenderer.setSize( window.innerWidth, window.innerHeight );
				labelRenderer.domElement.style.position = 'absolute';
				labelRenderer.domElement.style.top = '0px';
				document.body.appendChild( labelRenderer.domElement );
				params	= {
					colorMap: 'rainbow',
				};
				mesh = new THREE.Mesh( undefined, new THREE.MeshLambertMaterial( {
					side: THREE.DoubleSide,
					color: 0xF5F5F5,
					vertexColors: true
				} ) );
				scene.add( mesh );
				manager = new THREE.LoadingManager( loadModel );

				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};
				loadModel()

				earthDiv = document.createElement( 'div' );
				earthDiv.className = 'label';
				earthDiv.textContent = String(maxtemp);
				earthDiv.style.marginTop = '-9em';
				earthLabel = new CSS2DObject( earthDiv );
				earthLabel.position.copy(sprite.position );
				group.add( earthLabel );

				moonDiv = document.createElement( 'div' );
				moonDiv.className = 'label';
				moonDiv.textContent = String(mintemp);
				moonDiv.style.marginTop = '9em';
				const moonLabel = new CSS2DObject( moonDiv );
				moonLabel.position.copy(sprite.position);
				group.add( moonLabel );
				uiScene.add(group)

								
				const pointLight = new THREE.PointLight( 0xffffff, 1 );
				perpCamera.add( pointLight );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.autoClear = false;
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( width, height );
				container.appendChild( renderer.domElement );
				window.addEventListener( 'resize', onWindowResize );

				roughnessMipmapper = new RoughnessMipmapper( renderer );
				const controls = new OrbitControls( perpCamera, labelRenderer.domElement );
				controls.addEventListener( 'change', render );
				const gui = new GUI();
				gui.add( params, 'colorMap', [ 'rainbow', 'cooltowarm', 'blackbody', 'grayscale' ] ).onChange( function () {

					updateColors();
					render();

				} );
				

			}


			function onWindowResize() {

				const width = window.innerWidth;
				const height = window.innerHeight;

				perpCamera.aspect = width / height;
				perpCamera.updateProjectionMatrix();

				renderer.setSize( width, height );
				render();

			}

			function render() {

				renderer.clear();
				// labelRenderer.clear();
				renderer.render( scene, perpCamera );
				renderer.render( uiScene, orthoCamera );
				labelRenderer.render( uiScene, orthoCamera );
                earthDiv.textContent=String(maxtemp)
                moonDiv.textContent=String(mintemp)

			}

            function loadModel( ) {
                setTimeout(function(){

					const loader = new OBJLoader( manager );
				loader.load( '../../static/main/js/three.js-master/examples/models/obj/xyma2.obj', function ( gltf ) {

					var object = gltf;

				// const loader = new GLTFLoader().setPath( '../../static/main/js/three.js-master/examples/models/gltf/' );
					// loader.load( 'xyma8.glb', function ( gltf ) {
						console.log(gltf)
								gltf.traverse( function ( child ) {
								if ( child.isMesh ) {
										geometry=child.geometry
										geometry.translate(0,5,0);
										geometry.center();
										const colors = [];
									for ( let i = 0, n = geometry.attributes.position.count; i < n; ++ i ) {
										colors.push( 0, 0, 0);
									}
									geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
									var temps=updatetemp(geometry)
									geometry.setAttribute('Temperature',new THREE.Float32BufferAttribute(temps,1));
									mesh.geometry=geometry
									console.log(geometry)
									updateColors()
									roughnessMipmapper.generateMipmaps( child.material );
								
							}
							} );
							roughnessMipmapper.dispose();
							render();
                            requestAnimationFrame(loadModel);
				} );
            },1000/fps);
			}
		

			function updatetemp(geometry){
                var temps=[];
				var temps1=[];
				var temp;
				var j=0
				var k=5
				var sensortemp=[100,200,400,600,700,800,900,80]
                    for(var i=0;i <geometry.attributes.position.count;i++)
                    {
						// if(i<24)
						// temp=32
						// // The Top disk%%
						// // else if(i<672)
						// // temp=900
						// else if(i>671 && i<1712)
						// temp=1
						// else if( i>1712 && i<1906)
						// temp =100
						// else if(i>1905 && i<3000)
						// temp=1000
						// else if(i>2999 && i<3636)
						// temp=100
						// else if(i>3635 && i<6294)
						// temp=320
						// else if(i>6293 && i<6443)
						// temp=500
						if(i<290)
						temp=sensortemp[7]
						else if(i<578)
						temp=sensortemp[0]
						else if(i<865)
						temp=sensortemp[1]
						else if(i<1150)
						temp=sensortemp[2]
						else if(i<1440)
						temp=sensortemp[3]
						else if(i<2015)
						temp=sensortemp[4]
						else if(i<2300)
						temp=sensortemp[5]
						else if(i<2770)
						temp=32
						else if(i<3030)
						temp=1
						// else if(i<3060)
						// temp=sensortemp[0]
						// else if(i<3080)
						// temp=sensortemp[1]
						else if(i<7500)
						{
							if(i<3060+200*j)
							temp=sensortemp[0]
							// if(i<3230)
							// temp=sensortemp[0]
							else if(i==3230)
							j+=1
							else if(i==3430)
							j+=1
							else if(i<5000)
							temp=32
							else
							temp=1000
						}
						else 
						temp=1000
						temps.push(temp)
						temps1.push(temp)
						temp=0
					
				}
				// for (var i=0;i <geometry.attributes.position.count;i++)
				// {
				// 	if(i<2200)
				// 	temp=32
				// 	else if(i<2769)
				// 	temp=32
				// 	else if(i<5000)
				// 	temp=1
				// 	else if(i<5400)
				// 	temp=sensortemp[5]
				// 	else if(i<5900)
				// 	temp=sensortemp[0]
				// 	else if(i<6400)
				// 	temp=sensortemp[1]
				// 	else if(i<6840)
				// 	temp=sensortemp[2]
				// 	else if(i<7300)
				// 	temp=sensortemp[3]
				// 	else if(i<7765)
				// 	temp=sensortemp[4]
				// 	else if(i<7790)
				// 	temp=sensortemp[0]
				// 	else if(i<7820)
				// 	temp=sensortemp[1]
				// 	else if(i<7850)
				// 	temp=sensortemp[2]
				// 	else if(i<7880)
				// 	temp=sensortemp[3]
				// 	else if(i<7910)
				// 	temp=sensortemp[4]
				// 	else if(i<7940)
				// 	temp=sensortemp[5]
				// 	else if(i<7990)
				// 	temp=sensortemp[0]
				// 	else if(i<8030)
				// 	temp=sensortemp[1]
				// 	else if(i<8080)
				// 	temp=sensortemp[2]
				// 	else if(i<8120)
				// 	temp=sensortemp[3]
				// 	else if(i<8150)
				// 	temp=sensortemp[4]
				// 	else if(i<8170)
				// 	temp=sensortemp[5]
				// 	else if(i<8210)
				// 	temp=sensortemp[0]
				// 	else if(i<8250)
				// 	temp=sensortemp[1]
				// 	else if(i<8310)
				// 	temp=sensortemp[2]
				// 	else if(i<8350)
				// 	temp=sensortemp[3]
				// 	else if(i<8390)
				// 	temp=sensortemp[4]
				// 	else if(i<8430)
				// 	temp=sensortemp[5]
				// 	else if(i<8480)
				// 	temp=sensortemp[0]
				// 	else if(i<8520)
				// 	temp=sensortemp[1]
				// 	else if(i<8570)
				// 	temp=sensortemp[2]
				// 	// else if(i<8610)
				// 	// temp=sensortemp[3]
				// 	else if(i<8650)
				// 	temp=sensortemp[3]
				// 	else if(i<8690)
				// 	temp=sensortemp[4]
				// 	else if(i<8730)
				// 	temp=sensortemp[5]
				// 	// else if(i==7940)
				// 	// {
				// 	// j=2
				// 	// temp=sensortemp[0]
				// 	// }
				// 	// else if(i==7940)
				// 	// j+=1
				// 	// else if(i<8010)
				// 	// temp=sensortemp[0]
				// 	// else if(i<8800)
				// 	// temp=32
				// 	else
				// 	temp=1000
				// 	temps.push(temp)
				// 	temps1.push(temp)
				// }
					Array.prototype.max = function() {
					return Math.max.apply(null, this);
					};

					Array.prototype.min = function() {
					return Math.min.apply(null, this);
					};

				maxtemp=temps1.max();
				mintemp=temps1.min();
            return temps
            }

			function updateColors() {

				lut.setColorMap( params.colorMap );

				lut.setMax( 1000 );
				lut.setMin( 0 );

				const geometry = mesh.geometry;
				
				const pressures = geometry.attributes.Temperature;
				const colors = geometry.attributes.color;

				for ( let i = 0; i < pressures.array.length; i ++ ) {

					const colorValue = pressures.array[ i ];

					const color = lut.getColor( colorValue );
					if(colorValue!=0){
					if ( color === undefined ) {

						console.log( 'Unable to determine color for value:', colorValue );

					} else {
						if(colorValue==1)
						{
							colors.setXYZ(i,0.7,0.7,0.7)
						}
						else
						colors.setXYZ( i, color.r, color.g, color.b );

					}
				}
				else
				colors.setXYZ(i,0.1,0.1,0.1)

				}

				colors.needsUpdate = true;

				const map = sprite.material.map;
				lut.updateCanvas( map.image );
				map.needsUpdate = true;

			}

