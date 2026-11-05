export function createCharacter(THREE,isGirl=false){
 const g=new THREE.Group();
 const mat=(c,r=.78)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
 const skin=mat(0xc98b70),skinLight=mat(0xdca184),hair=mat(isGirl?0x17111c:0x211916),hair2=mat(isGirl?0x30202c:0x39251d);
 const white=mat(0xffffff),iris=mat(0x38231d),pupil=mat(0x100b0a),shoe=mat(0x352b2a);
 const pants=mat(isGirl?0x493a55:0x35445e),shirt=mat(isGirl?0xe879aa:0x4b85ce),shirtLight=mat(isGirl?0xffa8cc:0x77b3ed);
 const parts={shirt,pants,shirtLight};
 function part(geo,m,x,y,z){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
 function ball(x,y,z,sx,sy,sz,m){const o=part(new THREE.SphereGeometry(1,24,18),m,x,y,z);o.scale.set(sx,sy,sz);return o}
 // torso, head, neck
 const torso=ball(0,1.17,0,.43,.58,.29,shirt);torso.scale.y=1.25;
 ball(0,1.63,.05,.23,.10,.24,shirtLight);ball(0,1.78,0,.13,.15,.13,skin);
 ball(0,2.05,0,.43,.48,.39,skin);
 for(const x of [-.43,.43])ball(x,2.04,0,.10,.14,.09,skinLight);
 ball(0,2.36,-.055,.46,.27,.41,hair);ball(0,2.29,.22,.34,.12,.22,hair);
 if(isGirl){
  ball(0,1.83,-.29,.43,.65,.19,hair);ball(-.37,1.75,-.12,.16,.53,.17,hair);ball(.37,1.75,-.12,.16,.53,.17,hair);
  ball(-.39,1.48,-.10,.12,.38,.13,hair2);ball(.39,1.48,-.10,.12,.38,.13,hair2);
  ball(-.18,2.30,.30,.20,.13,.12,hair2);ball(.06,2.32,.31,.19,.12,.12,hair);ball(.27,2.27,.28,.15,.12,.13,hair);
 }else{
  ball(-.27,2.47,.04,.20,.17,.24,hair2);ball(-.08,2.52,.02,.20,.17,.24,hair);ball(.13,2.49,.03,.21,.17,.23,hair2);ball(.29,2.42,.02,.15,.14,.20,hair);
 }
 for(const x of [-.16,.16]){
  const brow=ball(x,2.20,.345,.105,.035,.045,hair);brow.rotation.z=x<0?.1:-.1;
  ball(x,2.08,.355,.105,.12,.055,white);ball(x,2.075,.402,.057,.078,.025,iris);ball(x,2.075,.422,.034,.052,.014,pupil);ball(x-.018,2.11,.437,.018,.022,.009,white);
 }
 ball(0,1.99,.405,.055,.065,.06,skinLight);
 // curved smile
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.09,1.91,.365),new THREE.Vector3(-.045,1.885,.39),new THREE.Vector3(0,1.88,.397),new THREE.Vector3(.045,1.885,.39),new THREE.Vector3(.09,1.91,.365)]);
 part(new THREE.TubeGeometry(curve,12,.012,6,false),mat(0x793e3a),0,0,0);
 ball(-.27,1.96,.31,.09,.045,.025,mat(0xe9a0a0));ball(.27,1.96,.31,.09,.045,.025,mat(0xe9a0a0));
 const arms=[],legs=[];
 for(const x of [-.49,.49]){const a=part(new THREE.CapsuleGeometry(.115,.48,5,12),shirt,x,1.15,0);a.rotation.z=x<0?-.18:.18;arms.push(a);ball(x,.77,.03,.11,.12,.11,skin)}
 for(const x of [-.19,.19]){const leg=part(new THREE.CapsuleGeometry(.14,.40,5,12),pants,x,.38,0);legs.push(leg);ball(x,.09,.12,.18,.10,.27,shoe)}
 if(isGirl){const skirt=part(new THREE.CylinderGeometry(.32,.52,.48,24),shirt,0,.75,0);skirt.scale.z=.85;ball(0,.98,.015,.38,.045,.30,shirtLight)}
 for(const y of [1.32,1.15])ball(0,y,.292,.035,.035,.018,shirtLight);
 g.userData.parts=parts;g.userData.legs=legs;g.userData.isGirl=isGirl;
 g.animate=(t)=>{const swing=Math.sin(t*5)*.045;legs.forEach((l,i)=>l.rotation.x=swing*(i?1:-1));arms.forEach((a,i)=>a.rotation.x=swing*(i?-1:1))};
 return {group:g,animate:g.animate};
}
export function setOutfit(THREE,character,kind,index){
 const p=character.group.userData.parts;
 const colors=kind===0?[[0x4b85ce,0x35445e,0x77b3ed],[0xc78c42,0x684832,0xe0b36a],[0x34345d,0x292943,0x7777bb]]:
 [[0xe879aa,0x493a55,0xffa8cc],[0xf0a34a,0x7b334d,0xffd18b],[0x9a69c8,0x34345d,0xc8a5ef]];
 const c=colors[index]||colors[0];p.shirt.color.setHex(c[0]);p.pants.color.setHex(c[1]);p.shirtLight.color.setHex(c[2]);
}
