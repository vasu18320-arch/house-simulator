export function createHouse(T,world,tier){
 const g=new T.Group(),M=(c,r=.82)=>new T.MeshStandardMaterial({color:c,roughness:r});
 const box=(x,y,z,a,b,c,col)=>{const o=new T.Mesh(new T.BoxGeometry(a,b,c),M(col));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o};
 const cyl=(x,y,z,r,h,col,n=20)=>{const o=new T.Mesh(new T.CylinderGeometry(r,r,h,n),M(col));o.position.set(x,y,z);o.castShadow=true;g.add(o);return o};
 const sphere=(x,y,z,r,col)=>{const o=new T.Mesh(new T.SphereGeometry(r,20,14),M(col));o.position.set(x,y,z);g.add(o);return o};
 const window=(x,y,z,w=1.15,h=1.2)=>{box(x,y,z,w,h,.12,0x405f6b);box(x,y,z+.075,w*.84,h*.82,.035,0x9bcfdf);box(x,y,z+.1,.07,h,.05,0xf4ead7);box(x,y,z+.1,w,.07,.05,0xf4ead7);box(x,y+h*.5,z+.09,w,.055,.04,0xf4ead7)};
 const s=[.9,1.08,1.28][tier],w=7*s,h=3.55*s,d=5.8*s;
 const wall=world==='mountain'?[0xe5d7c3,0xece5d9,0xf0e9dc][tier]:world==='countryside'?[0xe8d2ad,0xf1e0bf,0xf5e9d1][tier]:[0xd9e3e6,0xe9eff0,0xf5f5f0][tier];
 const roof=world==='mountain'?0x405866:world==='countryside'?0x95583e:0x354e60,trim=world==='city'?0x536b77:0x765039;
 // main living space and foundation, with a visible raised plinth
 box(0,h/2,-5,w,h,d,wall);box(0,.16,-5,w+.35,.32,d+.35,trim);
 // tiered but believable home architecture: broad pitched roofs, not abstract blocks
 if(tier===0){
  const a=box(-w*.24,h+.52,-5,w*.62,.22,d+.65,roof);a.rotation.z=-.43;
  const b=box(w*.24,h+.52,-5,w*.62,.22,d+.65,roof);b.rotation.z=.43;
  box(0,h+.88,-5,.18,.18,d+.7,trim);
 }else{
  box(0,h+.16,-5,w+.42,.28,d+.4,roof);
  const a=box(-w*.25,h+.58,-5,w*.62,.22,d+.62,roof);a.rotation.z=-.4;
  const b=box(w*.25,h+.58,-5,w*.62,.22,d+.62,roof);b.rotation.z=.4;
  box(0,h+.94,-5,.18,.18,d+.68,trim);
  // a modest front-facing gable with timber fascia
  const gable=new T.Mesh(new T.ConeGeometry(w*.36,1.65,4),M(roof));gable.position.set(0,h+.88,-1.8);gable.rotation.y=Math.PI/4;gable.scale.z=.45;g.add(gable);
 }
 // inviting front porch, substantial door, framed windows and lanterns
 box(0,1.28,-1.95,1.25,2.55,.2,trim);box(.38,1.2,-1.82,.075,.075,.04,0xe9bd6a);
 box(0,2.65,-1.1,2.8,.18,1.55,roof);
 for(const x of [-1.22,1.22])box(x,1.35,-.48,.13,2.7,.13,trim);
 box(0,.18,-.35,3.7,.32,2.2,0xbdb29f);box(0,.07,3.5,6.4,.14,4.8,world==='city'?0x929b9e:0xc0b69f);
 for(const x of [-w*.32,w*.32])window(x,2.05,-1.92,1.4,1.35);
 // dormer windows on larger homes
 if(tier>0)for(const x of [-w*.23,w*.23]){
  box(x,h+.72,-4.2,1.45,1.1,.22,wall);window(x,h+.73,-4.04,.75,.72);
  const cap=box(x,h+1.34,-4.2,1.75,.16,1.1,roof);cap.rotation.z=0;
 }
 // tidy porch planters, greenery, pathway stones and a chimney
 for(const x of [-2.0,2.0]){
  cyl(x,.34,-.35,.32,.65,0xa96f4d);sphere(x,.95,-.35,.42,0x4d914e);
  for(let j=0;j<3;j++)sphere(x+(j-1)*.18,1.08,-.35,.19,[0x4c8d4a,0x639e54,0x3e7e43][j]);
 }
 box(-w*.34,h+.75,-6.9,.55,1.9,.55,trim);box(-w*.34,h+1.75,-6.9,.72,.12,.72,0x6a6d6b);
 // side extension / garage wing on grand house, with a warm timber pergola
 if(tier===2){
  box(w*.62,1.75,-5,3.7,3.5,5.8,wall);
  const wing=box(w*.62,3.58,-5,4.0,.25,6.1,roof);
  box(w*.62,1.1,-1.95,2.2,2.2,.12,0x496d7a);
  for(const x of [w*.43,w*.81])box(x,1.7,-1.85,.13,3.4,.13,trim);
  for(let x=-3;x<=3;x+=1.5)box(x,.13,1.0,.09,2.4,.09,trim);
  box(0,1.35,2.2,6.3,.12,.12,trim);
 }
 return g;
}