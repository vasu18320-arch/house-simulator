export function createPet(THREE,name){
 const g=new THREE.Group(),mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.85});
 const colors={Cat:0x777777,Dog:0xa66b3e,Cow:0xf0eee5,Parrot:0x31a85d,Hamster:0xc9a16d};
 const fur=mat(colors[name]||0x999999),dark=mat(0x211b19),white=mat(0xffffff),pink=mat(0xe99aab);
 function ball(x,y,z,sx,sy,sz,m){const o=new THREE.Mesh(new THREE.SphereGeometry(1,18,14),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;g.add(o);return o}
 if(name==='Parrot'){
  ball(0,.9,0,.38,.55,.3,fur);ball(0,1.42,.02,.25,.25,.24,fur);ball(0,1.42,.24,.12,.08,.1,mat(0xffbd45));
  ball(-.23,.9,.02,.22,.45,.08,mat(0xf0c83c));ball(.23,.9,.02,.22,.45,.08,mat(0x2f83c7));
  const perch=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.1,8),mat(0x805333));perch.rotation.z=Math.PI/2;perch.position.y=.2;g.add(perch);
 }else{
  const scale=name==='Cow'?1.45:name==='Hamster'?.55:1;
  ball(0,.55,0,.55*scale,.42*scale,.38*scale,fur);ball(.48*scale,.82*scale,.02,.3*scale,.3*scale,.28*scale,fur);
  for(const x of [-.16,.16]){ball(.57*scale+x*.35,.87*scale,.25*scale,.055*scale,.07*scale,.035*scale,dark);ball(.57*scale+x*.35,.89*scale,.28*scale,.02,.025,.012,white)}
  if(name==='Cat'||name==='Hamster'){for(const x of [-.16,.16]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.12*scale,.32*scale,8),fur);ear.position.set(.4*scale+x,.1+1.05*scale,.02);g.add(ear)}}
  if(name==='Cow'){ball(-.2,1.0,-.1,.18,.28,.12,white);ball(.12,.72,.35,.12,.16,.04,dark);for(const x of [-.3,.3]){const horn=new THREE.Mesh(new THREE.ConeGeometry(.08,.28,8),mat(0xe9d8a7));horn.position.set(.48*scale+x,.95*scale,0);g.add(horn)}}
  for(const x of [-.3,.3])for(const z of [-.2,.2]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.07*scale,.09*scale,.42*scale,8),fur);leg.position.set(x*scale,.22*scale,z*scale);g.add(leg)}
  if(name==='Dog'){ball(-.55,.65,-.1,.2,.13,.17,fur);ball(.65,.65,-.02,.12,.12,.12,pink)}
 }
 g.userData.kind=name;return g;
}
