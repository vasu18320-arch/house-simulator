export function createWorld(THREE,type){
 const g=new THREE.Group();
 const mat=(c,r=.9)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
 function add(geo,m,x,y,z){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
 function box(x,y,z,sx,sy,sz,c){return add(new THREE.BoxGeometry(sx,sy,sz),mat(c),x,y,z)}
 function ball(x,y,z,sx,sy,sz,c){const o=add(new THREE.SphereGeometry(1,18,14),mat(c),x,y,z);o.scale.set(sx,sy,sz);return o}
 function tree(x,z,s=1,pine=false){
  add(new THREE.CylinderGeometry(.12*s,.19*s,1.4*s,8),mat(0x79502f),x,.7*s,z);
  if(pine){for(let i=0;i<3;i++)add(new THREE.ConeGeometry((1-i*.2)*s,1.7*s,8),mat(i%2?0x285b3d:0x34764a),x,(1.4+i*.65)*s,z)}
  else{ball(x,2.3*s,z,1.1*s,.95*s,1.0*s,0x43834c);ball(x-.5*s,2.1*s,z, .7*s,.65*s,.7*s,0x5b9c5b);ball(x+.5*s,2.1*s,z,.7*s,.65*s,.7*s,0x5b9c5b)}
 }
 const groundColor=type==='city'?0x82918b:type==='countryside'?0x73b66a:0x6eae70;
 const ground=add(new THREE.PlaneGeometry(240,240),mat(groundColor),0,-.12,0);ground.rotation.x=-Math.PI/2;
 // broad property lawn
 box(0,-.045,0,28,.06,25,type==='city'?0x8a9b8d:0x79b86f);
 // stone path
 for(let i=0;i<18;i++){const stone=add(new THREE.CylinderGeometry(.42,.46,.10,8),mat(0xbab7ae),Math.sin(i*.3)*.45,.02,.5+i*.75);stone.rotation.y=i*.3}
 // fence
 for(let x=-13;x<=13;x+=2){box(x,.55,-12,.13,1.1,.13,0x9d7954);box(x,.55,12,.13,1.1,.13,0x9d7954)}
 box(0,.85,-12,26,.14,.14,0xb88a5c);box(0,.35,-12,26,.14,.14,0xb88a5c);
 // garden beds and flowers
 for(const side of [-1,1])for(let i=0;i<11;i++){const x=side*(5+Math.random()*2),z=-5+i*1.25;ball(x,.13,z,.38,.14,.38,0x438d48);for(let j=0;j<4;j++)ball(x+(Math.random()-.5)*.35,.43,z+(Math.random()-.5)*.35,.10,.10,.10,[0xf4a6c4,0xffd65b,0xffffff,0xb99be9][j])}
 // pond
 const pond=add(new THREE.CylinderGeometry(2,2,.12,40),mat(0x64b9d4,.2),8,.02,4);pond.scale.z=.8;
 const rim=add(new THREE.TorusGeometry(2,.15,8,40),mat(0xb4aa91),8,.12,4);rim.rotation.x=Math.PI/2;rim.scale.z=.8;
 // bench
 box(-6,.65,3,2,.18,.65,0x98623b);box(-6,1.15,2.75,2,1,.16,0x98623b);box(-6.75,.3,3,.14,.6,.14,0x65432e);box(-5.25,.3,3,.14,.6,.14,0x65432e);
 // lamps
 for(const side of [-1,1])for(let i=0;i<3;i++){const x=side*4.5,z=i*3-1;add(new THREE.CylinderGeometry(.055,.075,1.8,10),mat(0x51483c),x,.9,z);ball(x,1.95,z,.2,.2,.2,0xffe5a0)}
 if(type==='mountain'){
  // Snow-capped mountain peaks at the far horizon
  for(let i=0;i<19;i++){const x=(i-9)*10,h=19+Math.random()*14,w=8+Math.random()*3,z=-67-Math.random()*5;add(new THREE.ConeGeometry(w,h,7),mat([0x718b9b,0x829eaa,0x647f91][i%3]),x,h/2-1,z);add(new THREE.ConeGeometry(w*.34,h*.38,7),mat(0xf7fbff),x,h-h*.38*.35-1,z)}
  for(let i=0;i<14;i++){const x=(i-7)*11;ball(x,2,-43,9,5+Math.random()*3,6,i%2?0x557e68:0x73977b)}
  for(let i=0;i<44;i++){const x=(i%2?1:-1)*(12+Math.random()*22),z=-24+Math.random()*47;tree(x,z,.75+Math.random()*1.1,true)}
  for(let i=0;i<10;i++){const cloud=ball(-52+i*12,25+Math.random()*7,-49,2.8,1,1.2,0xffffff);cloud.material.transparent=true;cloud.material.opacity=.82}
 }else if(type==='countryside'){
  for(let i=0;i<60;i++){const x=(Math.random()-.5)*95,z=-15-Math.random()*70;tree(x,z,.7+Math.random()*.8,false)}
  for(let i=0;i<16;i++){const x=(i-8)*9;box(x,.04,-27,5,.08,38, i%2?0x8caa5b:0x9ab966)}
  // distant farmhouse silhouettes
  for(let i=0;i<5;i++){const x=(i-2)*22;box(x,2,-48,8,4,6,0xd5c6a4);add(new THREE.ConeGeometry(6,3,4),mat(0x945c43),x,5,-48).rotation.y=Math.PI/4}
 }else{
  // city streets and sidewalks
  box(0,.02,-27,100,.12,8,0x555c61);box(0,.1,-22,100,.18,2,0xb4b2a9);
  for(let i=0;i<18;i++){const x=(i-9)*8,h=9+Math.random()*19;box(x,h/2,-52,5,h,5,[0xc8c5c0,0xa7b7c4,0xd6c7b8][i%3]);for(let y=2;y<h-1;y+=2)for(let z=-54;z<-49;z+=2)box(x-1.3,y,z,.7,.9,.08,0x83c8df)}
  for(let i=0;i<12;i++){const x=(i-6)*8;tree(x,13,.8,false)}
 }
 // rocks and shrubs on property edge
 for(let i=0;i<18;i++){const x=(Math.random()-.5)*24,z=(Math.random()-.5)*24;if(Math.abs(x)>8||Math.abs(z)>8)ball(x,.18,z,.3+Math.random()*.25,.18,.3,0x8d9186)}
 return g;
}
