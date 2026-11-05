export function createBaby(THREE,type='girl'){
 const g=new THREE.Group(),skin=new THREE.MeshStandardMaterial({color:0xd69b80}),cloth=new THREE.MeshStandardMaterial({color:type==='girl'?0xf2a0c4:0x83b9e9}),hair=new THREE.MeshStandardMaterial({color:0x211916}),white=new THREE.MeshStandardMaterial({color:0xffffff}),dark=new THREE.MeshStandardMaterial({color:0x241b1a});
 function ball(x,y,z,sx,sy,sz,m){const o=new THREE.Mesh(new THREE.SphereGeometry(1,18,14),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o)}
 ball(0,.65,0,.34,.4,.3,cloth);ball(0,1.2,0,.38,.4,.34,skin);ball(0,1.48,-.03,.39,.16,.34,hair);
 for(const x of [-.12,.12]){ball(x,1.22,.3,.055,.07,.03,white);ball(x,1.22,.33,.025,.04,.02,dark)}
 ball(0,1.08,.31,.045,.035,.025,dark);ball(-.2,.7,.05,.12,.16,.12,skin);ball(.2,.7,.05,.12,.16,.12,skin);
 g.scale.setScalar(.68);return g;
}
