export function createHouse(THREE,world,tier){
 const g=new THREE.Group(),mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.82});
 function box(x,y,z,sx,sy,sz,c){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(c));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
 function cyl(x,y,z,r1,r2,h,c){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,12),mat(c));o.position.set(x,y,z);o.castShadow=true;g.add(o);return o}
 const w=[5.5,7.5,10][tier],h=[3.1,3.8,4.5][tier],d=[4.5,5.5,7][tier];
 let wall,roof;
 if(world==='mountain'){wall=[0xe8cba4,0xe8dfcf,0xf4eadb][tier];roof=[0x874b3c,0x65463f,0x344f61][tier]}
 else if(world==='countryside'){wall=[0xe4c89a,0xf0dfb9,0xf5e8cc][tier];roof=[0x9d573b,0x87503a,0x70463a][tier]}
 else{wall=[0xd7e0e5,0xe6e9e8,0xf1f2f3][tier];roof=[0x536879,0x354b60,0x293d50][tier]}
 box(0,h/2,-3,w,h,d,wall);box(0,.12,-3,w+.5,.25,d+.5,0x98765c);
 if(world==='mountain'&&tier===2){box(-w*.28,h/2,-3,w*.38,h*.82,d*.72,0x9a7658)}
 const left=box(-w*.25,h+.55,-3,w*.72,.22,d+.9,roof);left.rotation.z=-.48;
 const right=box(w*.25,h+.55,-3,w*.72,.22,d+.9,roof);right.rotation.z=.48;
 box(0,h+1.05,-3,.22,.25,d+.95,0x71463b);
 // front facade and door
 box(0,1.15,-.72,1.15,2.3,.15,0x70462e);
 const knob=new THREE.Mesh(new THREE.SphereGeometry(.07,12,10),mat(0xf5cb6d));knob.position.set(.38,1.1,-.61);g.add(knob);
 for(const x of [-w*.3,w*.3]){box(x,2,-.69,1.25,1.1,.12,0x75bde0);box(x,2,.0,1.38,.09,.08,0xffffff);box(x,2,0,.08,1.2,.08,0xffffff)}
 if(tier>0){box(0,2.35,.2,w*.85,.2,1.8,0x9c7049);for(const x of [-w*.37,w*.37])cyl(x,1.25,.75,.09,.09,2.3,0xf3e4c9)}
 if(tier===2){box(0,h+2.2,-3,3,.14,d*.8,0x8a6849);for(let x=-w/2;x<=w/2;x+=w/6)box(x,.55,1.8,.12,1.1,.12,0xb48c65)}
 // small porch steps and path-facing pots
 box(0,.2,.9,2,.35,.9,0xb7a58e);
 for(const x of [-w*.42,w*.42]){cyl(x,.35,.5,.22,.28,.7,0xb77b55);const plant=new THREE.Mesh(new THREE.SphereGeometry(.35,12,10),mat(0x4c8b4e));plant.position.set(x,.9,.5);g.add(plant)}
 // side extension on grand houses
 if(tier===2){box(w*.58,1.5,-3,2.3,3,d*.7,wall);const roof2=box(w*.58,3.15,-3,2.7,.2,d*.8,roof);roof2.rotation.z=.08}
 return g;
}
