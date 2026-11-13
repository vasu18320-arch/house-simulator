// Carefully proportioned low-poly vehicles and a dedicated covered parking shed.
export function createVehicle(T,name){
 const root=new T.Group();
 const mat=(c,r=.48,m=.15)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m});
 const colors={SUV:0x315d78,Car:0xc84f3d,Pickup:0x657d57,Motorcycle:0x263b4b,Bicycle:0x3b7891,Tractor:0x3d8b46};
 const paint=mat(colors[name]||0x526f80,.3,.35),dark=mat(0x20282c,.65,.1),rubber=mat(0x171a1c,.95),chrome=mat(0xb7c2c7,.24,.8),glass=new T.MeshPhysicalMaterial({color:0x8ec5d8,roughness:.16,metalness:.12,transparent:true,opacity:.78,clearcoat:1}),seat=mat(0x403b36,.92),lamp=mat(0xffefc4,.2,.2),red=mat(0x9e2822,.35,.1),under=mat(0x33383a,.85);
 const mesh=(p,geo,m,x=0,y=0,z=0)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o};
 const box=(p,x,y,z,a,b,c,m)=>mesh(p,new T.BoxGeometry(a,b,c),m,x,y,z);
 const ball=(p,x,y,z,a,b,c,m)=>{const o=mesh(p,new T.SphereGeometry(1,24,16),m,x,y,z);o.scale.set(a,b,c);return o};
 const cyl=(p,x,y,z,r,h,m,axis='y',n=24)=>{const o=mesh(p,new T.CylinderGeometry(r,r,h,n),m,x,y,z);if(axis==='x')o.rotation.z=Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o};
 const tube=(p,a,b,r,m)=>{const A=new T.Vector3(...a),B=new T.Vector3(...b),d=B.clone().sub(A),o=mesh(p,new T.CylinderGeometry(r,r,d.length(),12),m);o.position.copy(A.add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o};
 function wheel(x,z,r=.43,width=.28){
  const w=new T.Group();w.position.set(x,r,z);root.add(w);
  const tyre=mesh(w,new T.CylinderGeometry(r,r,width,36),rubber);tyre.rotation.z=Math.PI/2;
  for(const s of [-1,1]){
   cyl(w,s*(width/2+.012),0,0,r*.68,.035,dark,'x');
   cyl(w,s*(width/2+.035),0,0,r*.51,.04,chrome,'x');
   cyl(w,s*(width/2+.06),0,0,r*.17,.045,paint,'x');
   for(let i=0;i<24;i++){const a=i*Math.PI/12;const t=box(w,s*width*.39,Math.sin(a)*(r+.008),Math.cos(a)*(r+.008),width*.22,.075,.045,dark);t.rotation.x=a}
  }
  return w;
 }
 if(name==='Bicycle'){
  const r=.52;
  for(const x of [-.88,.88]){
   const w=mesh(root,new T.TorusGeometry(r,.055,10,40),rubber,x,r,0);w.rotation.y=Math.PI/2;
   cyl(root,x,r,0,.06,.18,chrome,'x');
   for(let i=0;i<20;i++){const a=i*Math.PI/10;const s=mesh(root,new T.CylinderGeometry(.006,.006,r*.9,5),chrome,x,r,0);s.rotation.set(0,Math.PI/2,a)}
  }
  const frame=mat(0x347b9b,.28,.65);
  tube(root,[-.88,r,0],[-.28,r+.05,0],.035,frame);tube(root,[-.28,r+.05,0],[.25,r,0],.035,frame);tube(root,[.25,r,0],[.88,r,0],.035,frame);
  tube(root,[-.28,r+.05,0],[0,r+.58,0],.035,frame);tube(root,[0,r+.58,0],[.25,r,0],.035,frame);
  tube(root,[0,r+.58,0],[.48,r+.62,0],.03,chrome);tube(root,[.48,r+.62,0],[.58,r+.83,0],.03,chrome);
  tube(root,[-.28,r+.05,0],[-.48,r+.44,0],.03,chrome);box(root,-.47,r+.47,0,.4,.08,.23,seat);
  cyl(root,-.28,r+.05,.14,.12,.08,dark,'z');tube(root,[-.88,r,.14],[-.28,r+.05,.14],.012,chrome);tube(root,[-.28,r+.05,.14],[.25,r,.14],.012,chrome);
  return root;
 }
 if(name==='Motorcycle'){
  const r=.43;
  for(const x of [-.82,.82]){const w=mesh(root,new T.TorusGeometry(r,.075,12,40),rubber,x,r,0);w.rotation.y=Math.PI/2;cyl(root,x,r,0,.11,.22,chrome,'x');}
  // compact frame, engine, sculpted tank, seat and exhaust
  tube(root,[-.82,r,0],[-.18,r+.32,0],.055,dark);tube(root,[-.18,r+.32,0],[.82,r,0],.05,dark);
  ball(root,-.03,r+.43,0,.37,.25,.29,paint);box(root,-.28,r+.79,0,.78,.13,.32,seat);
  box(root,-.04,r+.25,0,.42,.4,.34,chrome);box(root,-.04,r+.25,.19,.3,.29,.05,dark);
  tube(root,[-.48,r+.15,.24],[.36,r+.13,.24],.055,chrome);
  tube(root,[.52,r+.78,0],[.62,r+1.16,0],.035,chrome);tube(root,[.62,r+1.16,0],[.18,r+1.22,0],.035,dark);
  tube(root,[.82,r,0],[.58,r+.68,0],.045,chrome);
  box(root,.84,r+.75,0,.16,.14,.42,dark);ball(root,.87,r+.82,.02,.12,.11,.13,lamp);
  for(const x of [-.82,.82]){const f=mesh(root,new T.TorusGeometry(.46,.035,8,30,Math.PI),paint,x,r,0);f.rotation.y=Math.PI/2;f.rotation.z=x<0?Math.PI:0}
  return root;
 }
 if(name==='Tractor'){
  // Realistic farm tractor stance: tall rear wheels, narrow bonnet and open operator station.
  box(root,-.05,.72,0,2.7,.48,1.18,paint);box(root,-.62,1.05,0,1.15,.48,1.05,paint);
  box(root,.46,1.08,0,.92,.22,1.0,dark);box(root,.43,1.2,0,.76,.12,.88,seat);
  for(const x of [-.88,.92])for(const z of [-.68,.68])wheel(x,z,x<0?.66:.38,x<0?.34:.24);
  box(root,-1.43,.83,0,.08,.43,.85,dark);
  for(const z of [-.27,.27]){ball(root,-1.49,1.02,z,.05,.09,.09,lamp);box(root,-1.49,.78,z,.04,.22,.035,chrome)}
  for(const z of [-.45,.45]){box(root,-.85,1.25,z,.1,.75,.1,paint);box(root,-.85,1.62,z,.9,.08,.1,paint)}
  cyl(root,-.72,1.68,-.38,.045,.7,dark);cyl(root,-.72,2.05,-.38,.07,.08,chrome);
  box(root,.05,.4,0,1.2,.12,1.25,dark);box(root,1.25,.45,0,.4,.14,1.05,chrome);
  return root;
 }
 const isSUV=name==='SUV',isPickup=name==='Pickup',isCar=name==='Car';
 const L=isPickup?3.9:isSUV?3.8:3.35,W=isSUV?1.72:1.55,front=-L/2,rear=L/2;
 // chassis and lower body
 box(root,0,.52,0,L*.92,.25,W*.94,under);
 box(root,0,.76,0,L,W,.48,paint);
 box(root,front+.42,.91,0,.88,.35,W,paint);
 box(root,rear-.4,.91,0,.78,.34,W,paint);
 // cabin with upright, well-defined windshield and roof
 const cabL=isPickup?1.72:isSUV?2.05:1.78,cabX=isPickup?-.42:-.05,top=1.68;
 box(root,cabX,top,0,cabL,.16,W*.84,paint);
 box(root,cabX,1.36,0,cabL*.96,.52,W*.79,dark);
 box(root,front+.91,1.39,0,.075,.48,W*.75,glass).rotation.z=-.18;
 box(root,rear-.78,1.39,0,.075,.43,W*.75,glass).rotation.z=.18;
 for(const s of [-1,1]){
  box(root,cabX-.43,1.4,s*(W*.405),.69,.4,.035,glass);
  box(root,cabX+.40,1.4,s*(W*.405),.68,.4,.035,glass);
  box(root,cabX-.02,1.4,s*(W*.425),.055,.44,.045,paint);
  box(root,cabX-.38,1.09,s*(W*.45),.19,.045,.035,chrome);
  box(root,cabX+.32,1.09,s*(W*.45),.19,.045,.035,chrome);
  tube(root,[front+.78,1.33,s*.58],[front+.74,1.48,s*.82],.025,paint);
  box(root,front+.72,1.48,s*.84,.18,.13,.09,dark);
  box(root,0,.47,s*(W*.54),1.45,.09,.12,dark);
 }
 // interior details
 for(const x of [-.4,.34]){box(root,cabX+x,1.13,-.27,.39,.12,.32,seat);box(root,cabX+x,1.34,-.40,.39,.36,.12,seat)}
 box(root,front+.83,1.13,0,.3,.12,W*.7,dark);
 const steering=mesh(root,new T.TorusGeometry(.14,.018,8,24),chrome,front+.82,1.31,-.26);steering.rotation.x=Math.PI/2;
 // four road wheels and arch lips
 for(const x of [front+.72,rear-.72])for(const z of [-W*.55,W*.55]){
  wheel(x,z,.45,.26);
  const arch=mesh(root,new T.TorusGeometry(.49,.045,8,32,Math.PI),dark,x,.77,z);arch.rotation.y=Math.PI/2;arch.rotation.z=Math.PI;
 }
 // front grille with vertical slats, bumper and signature lights
 box(root,front-.035,.82,0,.10,.43,W*.7,dark);
 box(root,front-.10,.82,0,.035,.31,.56,chrome);
 for(let i=0;i<7;i++)box(root,front-.125,.82,-.24+i*.08,.025,.25,.025,dark);
 for(const z of [-.55,.55]){box(root,front-.12,1.02,z,.045,.18,.23,lamp);box(root,front-.13,.59,z,.08,.12,.22,chrome);box(root,rear+.04,.94,z,.07,.23,.18,red)}
 box(root,front-.12,.48,0,.16,.13,W*.95,chrome);box(root,rear+.08,.53,0,.16,.13,W*.95,dark);
 // side sills, handles, fuel door and mirrors
 for(const s of [-1,1]){box(root,0,.61,s*(W*.51),L*.58,.06,.035,dark);box(root,cabX+.30,1.10,s*(W*.44),.17,.035,.025,chrome)}
 ball(root,rear-.43,1.04,W*.51,.07,.065,.025,dark);
 if(isSUV){
  // roof rails and rear roof spoiler
  for(const z of [-.48,.48]){box(root,cabX,1.79,z,cabL*.82,.045,.045,chrome);for(const x of [cabX-.5,cabX+.5])box(root,x,1.75,z,.07,.09,.07,chrome)}
  box(root,rear-.55,1.72,0,.5,.08,W*.72,dark);
 }else if(isPickup){
  // Deep, open, ribbed pickup bed with wheel-well humps and tailgate
  box(root,rear-.45,.99,0,.88,.07,W*.78,dark);
  for(const s of [-1,1]){box(root,rear-.43,1.18,s*W*.40,.98,.36,.09,paint);box(root,rear-.43,1.38,s*W*.40,.98,.05,.095,chrome)}
  box(root,rear-.02,1.17,0,.08,.36,W*.78,paint);
  for(let i=0;i<6;i++)box(root,rear-.83+i*.14,1.035,0,.025,.018,W*.70,chrome);
  for(const s of [-1,1])box(root,rear-.60,.99,s*.43,.34,.20,.20,paint);
 }
 root.userData.kind=name;return root;
}
export function createVehicleShed(T){
 const g=new T.Group();
 const mat=(c,r=.82)=>new T.MeshStandardMaterial({color:c,roughness:r});
 const plaster=mat(0xe7e1d3),sage=mat(0x87988a),wood=mat(0x94765b),roof=mat(0x647d78),stone=mat(0xc8c1b2),dark=mat(0x58615d),glass=mat(0xb7d0cb,.35),gold=mat(0xc5a875,.35);
 const box=(x,y,z,w,h,d,m)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o};
 const cyl=(x,y,z,r,h,m)=>{const o=new T.Mesh(new T.CylinderGeometry(r,r,h,24),m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o};
 // A calm, courtyard-style carriage house: pale limewash, sage trim and a tiled green roof.
 box(0,.16,0,19,.32,13,stone);box(0,.34,0,18.7,.08,12.7,plaster);
 // Rear wall and low side wings make it feel like a designed outbuilding, not a warehouse.
 box(0,2.25,5.95,18.2,4.25,.35,plaster);
 box(-8.95,1.9,0,.35,3.6,12,sage);box(8.95,1.9,0,.35,3.6,12,sage);
 // Four elegant timber piers at the open front and two at the back.
 for(const x of [-8.7,-3.0,3.0,8.7]){
  box(x,2.2,-5.95,.34,4.4,.34,wood);
  box(x,4.35,-5.95,.62,.22,.62,gold);
 }
 for(const x of [-8.7,8.7])box(x,2.2,5.7,.34,4.4,.34,wood);
 // Pitched roof planes with broad eaves and fascia.
 const left=box(-4.65,4.65,0,9.9,.3,13.4,roof);left.rotation.z=-.16;
 const right=box(4.65,4.65,0,9.9,.3,13.4,roof);right.rotation.z=.16;
 box(0,5.02,0,.3,.34,13.5,wood);
 box(0,4.38,-5.94,18.1,.24,.28,wood);box(0,4.38,5.94,18.1,.24,.28,wood);
 // Rear wall gets a row of high clerestory windows and warm lanterns.
 for(const x of [-5.8,0,5.8]){
  box(x,3.1,5.75,2.3,1.0,.08,wood);box(x,3.1,5.68,2.05,.76,.05,glass);
  box(x,3.1,5.63,.06,.78,.04,gold);box(x,3.1,5.63,2.05,.06,.04,gold);
 }
 for(const x of [-6,0,6]){
  box(x,3.85,-5.72,.28,.55,.22,wood);
  const l=box(x,3.55,-5.58,.28,.38,.18,gold);
 }
 // Discreet sage bay dividers and stone wheel stops keep each vehicle neatly parked.
 for(const x of [-5.9,0,5.9]){
  box(x,.09,-.2,.09,.18,10.5,sage);
  box(x,.12,3.6,4.1,.18,.24,stone);
 }
 // Side planting troughs soften the structure.
 for(const x of [-8.35,8.35]){
  box(x,.42,2.8,.65,.72,2.0,wood);
  for(let i=0;i<4;i++){const leaf=cyl(x+(i-1.5)*.13,.95,2.8,.18,.55,sage);leaf.scale.set(.8,1.25,.8)}
 }
 return g;
}
