export function createHouse(T,world,tier){
 const g=new T.Group(),M=(c,r=.82)=>new T.MeshStandardMaterial({color:c,roughness:r});
 function box(x,y,z,a,b,c,col){const o=new T.Mesh(new T.BoxGeometry(a,b,c),M(col));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
 function cyl(x,y,z,r,h,col,n=20){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,n),M(col));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
 function sphere(x,y,z,r,col){const o=new T.Mesh(new T.SphereGeometry(r,18,14),M(col));o.position.set(x,y,z);g.add(o);return o}
 function window(x,y,z,w=1.1,h=1.15){box(x,y,z,w,h,.1,0x426b7c);box(x,y,z+.065,w*.82,h*.82,.035,0x9bd2df);box(x,y,z+.09,.07,h,.045,0xe8e4d9);box(x,y,z+.09,w,.07,.045,0xe8e4d9)}
 const scale=[.86,1,1.12][tier],w=6.6*scale,h=3.5*scale,d=5.4*scale;
 const wall=world==='mountain'?[0xe7d9c7,0xe8e2d8,0xf0e9dd][tier]:world==='countryside'?[0xe8d3ae,0xf0dfbd,0xf6ead1][tier]:[0xd6e0e5,0xe9eff0,0xf4f5f2][tier];
 const roof=world==='mountain'?0x435b68:world==='countryside'?0x92563d:0x344b5e,trim=world==='city'?0x536c79:0x79543c;
 // main structure: square, straight walls and a solid foundation
 box(0,h/2,-3,w,h,d,wall);box(0,.13,-3,w+.32,.26,d+.32,trim);
 if(tier===2){
  // Castle estate: symmetrical keep, four round corner towers, crenellated parapets
  const keepW=8.8,keepD=7.2,keepH=7.2;
  box(0,keepH/2-0.05,-3,keepW,keepH,keepD,wall);
  box(0,keepH,-3,keepW+.25,.32,keepD+.25,trim);
  for(const x of [-5.25,5.25])for(const z of [-7.35,1.35]){
   cyl(x,4.45,z,.9,8.9,wall,24);cyl(x,8.95,z,1.02,.35,trim,24);
   for(let k=0;k<8;k++){const a=k*Math.PI/4;box(x+Math.cos(a)*.77,9.35,z+Math.sin(a)*.77,.24,.55,.24,trim)}
   const cone=new T.ConeGeometry(1.05,2.4,12);const roofObj=new T.Mesh(cone,M(roof));roofObj.position.set(x,10.65,z);roofObj.castShadow=true;g.add(roofObj);
   // narrow tower windows on the front-facing side
   box(x,5.5,z+.91,.32,1.15,.08,0x527887);
  }
  // crenellated central roofline and side wings
  for(let x=-3.6;x<=3.61;x+=.9){box(x,7.55,1.05,.48,.72,.42,trim);box(x,7.55,-7.05,.48,.72,.42,trim)}
  box(-6.1,2.25,-3,3.2,4.5,6.2,wall);box(6.1,2.25,-3,3.2,4.5,6.2,wall);
  box(-6.1,4.6,-3,3.45,.28,6.45,roof);box(6.1,4.6,-3,3.45,.28,6.45,roof);
  // central arched-looking entrance, portcullis detail and broad steps
  box(0,1.55,.68,1.65,3.1,.18,0x634733);box(0,1.45,.79,1.25,2.65,.08,0x9a7251);
  box(0,2.9,.84,1.6,.22,.12,trim);box(0,.22,2.1,3.5,.38,2,0xb9ad9b);box(0,.5,1.35,2.6,.25,1.1,0xc8bdac);
  for(const x of [-2.8,2.8])for(const y of [2.4,4.7,6.2])window(x,y,1.04,.8,1.15);
  for(const x of [-6.1,6.1])for(const y of [1.7,3.1])window(x,y,.18,.85,1.05);
 }else{
  // Simple modern/cottage silhouette with clean roof planes
  if(world==='mountain'){
   box(0,h+.18,-3,w+.45,.3,d+.35,roof);
   const left=box(-w*.25,h+.6,-3,w*.58,.22,d+.55,roof);left.rotation.z=-.48;
   const right=box(w*.25,h+.6,-3,w*.58,.22,d+.55,roof);right.rotation.z=.48;
   box(0,h+.95,-3,.16,.18,d+.6,trim);
  }else if(world==='countryside'){
   box(0,h+.15,-3,w+.5,.28,d+.5,roof);
   const ridge=box(0,h+.72,-3,.24,.2,d+.8,trim);
   const a=box(-w*.25,h+.55,-3,w*.62,.22,d+.65,roof);a.rotation.z=-.42;
   const b=box(w*.25,h+.55,-3,w*.62,.22,d+.65,roof);b.rotation.z=.42;
  }else{
   box(0,h+.15,-3,w+.25,.3,d+.25,roof);
   box(0,h*.67,.02,w*.8,.13,.16,trim);
   if(tier===1){box(0,2.65,.25,w*.9,.2,1.15,trim);for(let x=-w*.4;x<=w*.4;x+=w*.2)box(x,3.0,.8,.07,.65,.07,0x536c7b)}
  }
  // front door, porch canopy and framed windows
  box(0,1.18,-.19,1.15,2.36,.18,trim);box(.34,1.1,-.085,.07,.07,.035,0xf4c86a);
  for(const x of [-w*.31,w*.31])window(x,2,-.17,1.35,1.25);
  box(0,.17,.9,2.6,.3,1.2,0xb8aa96);box(0,.08,4,5.4,.14,4.6,world==='city'?0x85898b:0xc0b9a9);
  // neat symmetrical planters and porch posts
  for(const x of [-w*.42,w*.42]){cyl(x,.32,.65,.3,.6,0xb77b55);sphere(x,.9,.65,.38,0x4b914e);box(x,.9,.65,.08,.75,.08,0x3e7543)}
 }
 return g;
}