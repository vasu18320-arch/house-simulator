export function createWorld(T,type){
 const g=new T.Group(),M=(c,r=.9)=>new T.MeshStandardMaterial({color:c,roughness:r});
 function add(geo,m,x,y,z){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
 function box(x,y,z,a,b,c,col){return add(new T.BoxGeometry(a,b,c),M(col),x,y,z)}
 function ball(x,y,z,a,b,c,col){const o=add(new T.SphereGeometry(1,20,16),M(col),x,y,z);o.scale.set(a,b,c);return o}
 function tree(x,z,s=1,pine=false){
  const trunk=box(x,.8*s,z,.24*s,1.6*s,.24*s,0x765039);
  if(pine){for(let j=0;j<3;j++)add(new T.ConeGeometry((1-j*.19)*s,1.55*s,9),M(j===1?0x39704a:0x28583e),x,(1.35+j*.62)*s,z)}
  else{ball(x,2.15*s,z,.9*s,.95*s,.88*s,0x397d49);ball(x-.35*s,2.05*s,z+.1*s,.55*s,.6*s,.55*s,0x4d9251);ball(x+.35*s,2.12*s,z-.1*s,.55*s,.6*s,.55*s,0x478849)}
 }
 // broad natural ground plane and a clean central home plot
 add(new T.PlaneGeometry(260,260),M(type==='city'?0x8e9b91:type==='countryside'?0x82b85e:0x6f9d69),0,-.16,0).rotation.x=-Math.PI/2;
 box(0,-.045,0,58,.09,54,type==='city'?0xb7b6ae:0xa9c68c);
 if(type==='mountain'){
  // layered mountain range with snow caps, rocky ridges and pine forest
  for(let i=0;i<17;i++){
   const x=(i-8)*8.5,h=23+(i%5)*3.7,depth=-88+(i%3)*2;
   add(new T.ConeGeometry(10+(i%3),h,7),M(i%2?0x657f91:0x829ba7),x,h/2-1,depth).rotation.y=(i%2)*.18;
   add(new T.ConeGeometry(3.8+(i%2),7.2,7),M(0xf2f5f1),x,h-4.4,depth+.1).rotation.y=.18;
   add(new T.ConeGeometry(2.4,4.5,7),M(0xdce8e9),x+.8,h-7.5,depth+.2);
  }
  for(let i=0;i<72;i++){const x=(Math.random()-.5)*100,z=-18-Math.random()*58;tree(x,z,.65+Math.random()*.75,true)}
  // winding blue stream with pebble banks
  for(let i=0;i<22;i++){const z=-24+i*2.3,x=12+Math.sin(i*.36)*5;const r=box(x,.015,z,2.6,.035,2.4,0x4dabc8);r.rotation.y=.28}
  for(let i=0;i<22;i++){const x=-45+i*4.2;ball(x,19+(i%4)*1.2,-52,.2,.2,.2,0xffffff)}
  for(let i=0;i<15;i++)ball(-10+Math.sin(i*.7)*2,.03,-20+i*2.4,.28,.13,.22,0x8c9692);
 }else if(type==='countryside'){
  // patchwork fields with crop rows, hedges, orchard and a reflective pond
  for(let i=0;i<8;i++){
   const x=(i-3.5)*13;box(x,.005,-39,12,.035,66,i%2?0x9ebd63:0x79a94f);
   for(let r=0;r<8;r++)for(let k=0;k<22;k++){const z=-68+k*2.8;const o=box(x-5+r*1.4,.17,z,.045,.3,.045,0x668b3e);o.rotation.z=.12}
  }
  for(let i=0;i<28;i++)tree((i-14)*5.7,-13-(i%4)*2,.62+(i%3)*.12,false);
  // distant farm cottages with pitched roofs
  for(let i=0;i<5;i++){const x=(i-2)*19;box(x,1.6,-66,7,3.2,6,0xe9d9b8);const roof=add(new T.ConeGeometry(5.6,2.8,4),M(0x985d3f),x,4.45,-66);roof.rotation.y=Math.PI/4;box(x,1,-62.9,1.25,2,.08,0x74513d)}
  const pond=add(new T.CylinderGeometry(5.3,5.3,.13,48),M(0x55aeca,.18),15,.015,8);pond.scale.z=.72;
  for(let i=0;i<16;i++){const a=i*Math.PI/8;ball(15+Math.cos(a)*5.2,.08,8+Math.sin(a)*3.7,.25,.12,.22,0x7a9d54)}
 }else{
  // modern city blocks: road, pavements, lane markings, shopfronts and lit windows
  box(0,-.005,-30,150,.08,15,0x424b55);box(0,.045,-20,150,.1,3.2,0xd0c9b9);
  for(let x=-72;x<74;x+=8)box(x,.07,-30,.16,.025,4.3,0xf5d98c);
  box(0,.025,-39,150,.09,3.2,0xaaaeb0);
  for(let i=0;i<19;i++){
   const x=(i-9)*7.3,h=11+(i%5)*3.4,w=5.3;
   box(x,h/2,-61,w,h,8,[0xc6d1d5,0xd8c9b9,0x9fb6c1,0xe0ded5][i%4]);
   box(x,h+.08,-61,w+.18,.22,8.2,0x596c78);
   for(let y=2.2;y<h-1;y+=2.5)for(let z=-56.8;z<-54.5;z+=2.4){
    box(x-1.35,y,z,.92,1.25,.1,0x4c7082);box(x-1.35,y,z+.07,.76,1.08,.025,0x9ed4e2);
    box(x+.55,y,z,.92,1.25,.1,0x4c7082);box(x+.55,y,z+.07,.76,1.08,.025,0xa7dce8);
   }
   for(let y=3.4;y<h;y+=5)box(x,y,-56.6,5.45,.12,.45,0x788f99);
  }
  // lower street-level stores and trees along the boulevard
  for(let i=0;i<5;i++){const x=-36+i*18;box(x,2,-42,10,4,5,0xe8e5dc);box(x,1.55,-39.4,5,2.5,.1,0x6aa7bc);box(x,3.8,-39.4,10,.25,.12,0x526d7b)}
  for(let i=0;i<16;i++)tree((i-8)*8,10,.72,false);
  for(let x=-60;x<=60;x+=12){box(x,.6,-37,.12,1.2,.12,0x4c4e50);ball(x,1.35,-37,.16,.16,.16,0xffe2a1)}
 }
 // foreground footpath, neat low fence, flower beds and garden benches
 for(let i=0;i<16;i++)box(0,.02,1+i*.78,1.05,.08,.66,type==='city'?0xb9b7b0:0xc3b69c);
 for(const side of [-1,1]){
  for(let i=0;i<11;i++){const x=side*(5.8+(i%2)*.35),z=-5+i*1.15;ball(x,.2,z,.42,.18,.4,0x3f8147);for(let j=0;j<3;j++)ball(x+(j-1)*.16,.45,z,.09,.09,.09,[0xe99bb7,0xffd15d,0xf7f2e8][j])}
 }
 for(let x=-28;x<=28;x+=2){box(x,.48,-24,.12,.95,.12,0x987653);box(x,.48,29,.12,.95,.12,0x987653)}
 for(let z=-24;z<=29;z+=2){box(-28,.48,z,.12,.95,.12,0x987653);box(28,.48,z,.12,.95,.12,0x987653)}
 box(0,.95,-24,56,.12,.12,0xb88a5c);box(0,.95,29,56,.12,.12,0xb88a5c);box(-28,.95,2,.12,.12,52,0xb88a5c);box(28,.95,2,.12,.12,52,0xb88a5c);
 // garden bench with backrest
 box(-6,.52,4,2.1,.16,.65,0x805638);box(-6,1.02,3.7,2.1,.82,.13,0x805638);
 return g;
}