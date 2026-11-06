export function createWorld(T,type){
 const g=new T.Group(),M=(c,r=.9)=>new T.MeshStandardMaterial({color:c,roughness:r});
 function add(geo,m,x,y,z){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
 function box(x,y,z,a,b,c,col){return add(new T.BoxGeometry(a,b,c),M(col),x,y,z)}
 function ball(x,y,z,a,b,c,col){const o=add(new T.SphereGeometry(1,18,14),M(col),x,y,z);o.scale.set(a,b,c);return o}
 function tree(x,z,s=1,pine=false){box(x,.7*s,z,.2*s,1.4*s,.2*s,0x79502f);if(pine){for(let j=0;j<3;j++)add(new T.ConeGeometry((1-j*.2)*s,1.7*s,9),M(j%2?0x285b3d:0x34764a),x,(1.4+j*.65)*s,z)}else ball(x,2.2*s,z,1.1*s,.95*s,1,0x4e914d)}
 add(new T.PlaneGeometry(260,260),M(type==='city'?0x82948c:type==='countryside'?0x80bd65:0x72ad70),0,-.13,0).rotation.x=-Math.PI/2;
 box(0,-.04,0,30,.08,27,type==='city'?0xa9aaa2:0x9bbd79);
 if(type==='mountain'){
  for(let i=0;i<15;i++){let x=(i-7)*10,h=24+(i%4)*4;add(new T.ConeGeometry(9,h,7),M(i%2?0x718b9b:0x829eaa),x,h/2-1,-76);add(new T.ConeGeometry(3.2,8,7),M(0xf7fbff),x,h-4,-76)}
  for(let i=0;i<48;i++)tree((Math.random()-.5)*70,-30+Math.random()*58,.7+Math.random()*.8,true);
  for(let i=0;i<15;i++)box(-10+Math.sin(i*.4)*2,.02,-20+i*2.3,2.8,.05,2.4,0x64b8d0);
  for(let i=0;i<5;i++){const c=ball(-38+i*18,25+(i%3)*2,-55,3,1,1.4,0xffffff);c.material.transparent=true;c.material.opacity=.8}
 }else if(type==='countryside'){
  for(let i=0;i<9;i++){const x=(i-4)*12;box(x,.015,-35,10,.05,55,i%2?0x9dbb5f:0x78a94f);for(let r=0;r<6;r++)for(let k=0;k<12;k++)box(x-4+r*1.5,.25,-52+k*3,.07,.4,.07,0x668d3e)}
  for(let i=0;i<34;i++)tree((Math.random()-.5)*90,-15-Math.random()*65,.7+Math.random()*.6,false);
  for(let i=0;i<7;i++){const x=(i-3)*15;box(x,1.7,-57,7,3.4,6,0xe5d0a8);add(new T.ConeGeometry(5.3,2.7,4),M(0x9a6040),x,4.6,-57).rotation.y=Math.PI/4}
  const pond=add(new T.CylinderGeometry(4.3,4.3,.12,36),M(0x64b9d4,.2),10,.02,7);pond.scale.z=.7;
 }else{
  box(0,.01,-28,130,.08,12,0x454c55);box(0,.08,-20,130,.16,3,0xc9c5b9);
  for(let x=-60;x<65;x+=8)box(x,.07,-28,.12,.02,4,0xf5e2a4);
  for(let i=0;i<19;i++){const x=(i-9)*7,h=10+(i%5)*3;box(x,h/2,-58,5,h,7,[0xd2d8dc,0xc6b9ae,0xaebfca,0xe2d6c7][i%4]);box(x,h+.1,-58,5.3,.25,7.3,0x536779);for(let y=2;y<h-1;y+=2.3)for(let z=-54;z<-51;z+=2)box(x-1.2,y,z,.75,.95,.07,0x83cce3)}
  for(let i=0;i<14;i++)tree((i-7)*8,13,.85,false);
  for(let i=0;i<4;i++){const x=-34+i*22;box(x,2.2,-42,9,4.4,5,0xf1e8dc);box(x,1.5,-39.4,2.2,2.5,.08,0x6cacc7)}
 }
 for(let i=0;i<15;i++)box(0,.02,1+i*.72,1,.09,.62,type==='city'?0xbab9b3:0xb7aa91);
 for(const side of [-1,1])for(let i=0;i<10;i++){const x=side*(5.2+Math.random()*1.5),z=-5+i*1.2;ball(x,.18,z,.36,.17,.36,0x438d48);for(let j=0;j<3;j++)ball(x+(Math.random()-.5)*.3,.43,z+(Math.random()-.5)*.3,.09,.09,.09,[0xf4a6c4,0xffd65b,0xffffff][j])}
 for(let x=-14;x<=14;x+=2){box(x,.48,-13,.12,.95,.12,0x9d7954);box(x,.48,13,.12,.95,.12,0x9d7954)}box(0,.9,-13,28,.12,.12,0xb88a5c);
 box(-6,.62,4,2,.16,.6,0x98623b);box(-6,1.05,3.75,2,.8,.14,0x98623b);
 return g;
}
