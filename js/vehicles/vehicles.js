export function createVehicle(THREE,name){
 const g=new THREE.Group(),mat=(c,r=.75)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
 const color={SUV:0x294d7b,Car:0xd4a13a,Pickup:0x547d62,Motorcycle:0xb72f35,Bicycle:0x387b9e,Tractor:0x3d9d48}[name]||0x547d62;
 function box(x,y,z,sx,sy,sz,c){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(c));o.position.set(x,y,z);o.castShadow=true;g.add(o);return o}
 function wheel(x,y,z,r=.34){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.2,18),mat(0x202020));o.position.set(x,y,z);o.rotation.z=Math.PI/2;g.add(o);const hub=new THREE.Mesh(new THREE.CylinderGeometry(r*.35,r*.35,.22,12),mat(0xb9b9b9));hub.position.copy(o.position);hub.rotation.z=Math.PI/2;g.add(hub)}
 if(name==='Bicycle'||name==='Motorcycle'){
  const r=name==='Bicycle'?.48:.42;for(const x of [-.75,.75]){const tire=new THREE.Mesh(new THREE.TorusGeometry(r,.07,8,20),mat(0x222222));tire.position.set(x,.48,0);tire.rotation.y=Math.PI/2;g.add(tire)}
  box(0,.65,0,1.2,.08,.08,color);box(-.35,.9,0,.1,.5,.1,color);box(.3,.8,0,.1,.35,.1,color);
  if(name==='Motorcycle'){box(0,.95,0,.65,.35,.42,color);box(.1,1.25,0,.35,.08,.35,0x222222)}
 }else{
  const length=name==='SUV'?3.2:name==='Pickup'?3.4:name==='Tractor'?3.4:2.6;
  box(0,.78,0,length,.65,1.35,color);
  box(-.12,1.35,0,length*.48,.68,1.12,0x91cce0);
  for(const x of [-length*.32,length*.32])for(const z of [-.72,.72])wheel(x,.38,z,name==='Tractor'&&x<0?.48:.34);
  if(name==='Pickup')box(length*.31,1.05,0,.9,.35,1.25,0x9d9d9d);
  if(name==='Tractor'){box(-.9,1.65,0,.6,.65,.65,0x3d9d48);box(-.9,2.1,0,.08,.45,.08,0x333333)}
 }
 g.userData.kind=name;return g;
}
