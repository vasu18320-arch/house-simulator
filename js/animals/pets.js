// Companion pets with autonomous wandering, natural scale and species-specific motion.
export function createPet(T,name){
 const root=new T.Group(),mat=(c,r=.82)=>new T.MeshStandardMaterial({color:c,roughness:r});
 const fur=mat(({Cat:0x77716a,Dog:0xb67a48,Cow:0xf0eee6,Parrot:0x16894d,Hamster:0xc9965d})[name]||0x999999),light=mat(({Cat:0xbcb3a7,Dog:0xd9ad79,Cow:0xffffff,Parrot:0x40b96b,Hamster:0xe4bd89})[name]||0xcccccc),dark=mat(({Cat:0x39383a,Dog:0x69412b,Cow:0x302b29,Parrot:0x075b3a,Hamster:0x9b603d})[name]||0x555555),pink=mat(0xd98591),nose=mat(0x302323),eye=mat(0x100d0b,.2),white=mat(0xfff8e9),beak=mat(0xf0a72f),claw=mat(0x51463e),blue=mat(0x197eb4),yellow=mat(0xf2c83c),red=mat(0xe34c39);
 const parts={},sphere=new T.SphereGeometry(1,24,18);
 function ell(p,x,y,z,a,b,c,m,key){const o=new T.Mesh(sphere,m);o.position.set(x,y,z);o.scale.set(a,b,c);o.castShadow=true;o.receiveShadow=true;if(key)parts[key]=o;p.add(o);return o}
 function capsule(p,x,y,z,r,len,m){const o=new T.Mesh(new T.CapsuleGeometry(r,len,4,10),m);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o}
 function tube(p,pts,r,m){const c=new T.CatmullRomCurve3(pts.map(v=>new T.Vector3(...v))),o=new T.Mesh(new T.TubeGeometry(c,16,r,7,false),m);o.castShadow=true;p.add(o);return o}
 function eyes(p,x,y,z,r=.07){for(const s of [-1,1]){ell(p,s*x,y,z,r,r*1.1,r*.45,white);ell(p,s*x,y,z+r*.35,r*.65,r*.75,r*.3,eye);ell(p,s*x-.015,y+.02,z+r*.6,r*.16,r*.18,r*.1,white)}}
 function leg(p,x,z,top,bottom,r=.08){capsule(p,x,(top+bottom)/2,z,r,(top-bottom)*.55,fur);ell(p,x,bottom,z+.07,r*1.2,.06,r*1.5,light)}
 if(['Cat','Dog','Hamster','Cow'].includes(name)){
  const cow=name==='Cow',dog=name==='Dog',ham=name==='Hamster',scale=ham?.48:cow?1.0:1;
  const by=cow?.83:ham?.48:.68;
  ell(root,dog?-.08:0,by,0,cow?.78:dog?.65:ham?.43:.55,cow?.46:dog?.37:ham?.29:.35,cow?.4:.36,fur);
  ell(root,.34,by+.1,.02,.28,.36,.29,fur);
  const head=new T.Group();head.position.set(dog?.58:.46,dog?1.08:cow?1.34:ham?.79:1.2,.02);root.add(head);parts.head=head;
  ell(head,0,0,0,dog?.33:cow?.32:ham?.27:.29,dog?.32:cow?.31:ham?.25:.29,dog?.3:cow?.28:ham?.25:.27,fur);
  if(dog){ell(head,0,-.13,.24,.22,.15,.22,light);ell(head,0,-.07,.42,.11,.08,.07,nose);for(const s of [-1,1]){const e=ell(head,s*.28,.1,-.01,.15,.27,.1,dark);e.rotation.z=s*-.3}eyes(head,.14,.09,.25,.065);tube(head,[[-.08,-.21,.34],[0,-.25,.38],[.08,-.21,.34]],.012,nose);parts.tail=new T.Group();parts.tail.position.set(-.6,.85,0);root.add(parts.tail);tube(parts.tail,[[0,0,0],[-.16,.18,0],[-.34,.29,.02]],.06,fur)}
  else if(cow){ell(head,0,-.12,.2,.21,.19,.2,light);ell(head,0,-.16,.36,.17,.11,.07,pink);for(const s of [-1,1]){const horn=ell(head,s*.19,.29,-.02,.07,.19,.07,light);horn.rotation.z=s*-.2;ell(head,s*.34,.08,0,.2,.08,.14,light);ell(head,s*.14,.02,.25,.045,.055,.03,eye)}for(const p of [[-.35,1,.3,.2,.22,.07],[.2,.9,-.3,.22,.25,.07],[-.12,.55,.35,.16,.12,.05]])ell(root,...p,dark);for(const x of [-.48,.48])for(const z of [-.23,.23]){capsule(root,x,.4,z,.1,.55,fur);ell(root,x,.1,z+.05,.12,.1,.14,dark)}ell(root,0,.4,.31,.18,.13,.16,pink);parts.tail=new T.Group();parts.tail.position.set(-.7,1,0);root.add(parts.tail);tube(parts.tail,[[0,0,0],[-.05,-.25,0],[-.1,-.42,.02]],.03,fur);ell(parts.tail,-.1,-.44,.02,.06,.1,.06,dark)}
  else if(ham){ell(head,0,-.13,.22,.18,.12,.13,light);ell(head,0,-.07,.34,.045,.04,.035,pink);eyes(head,.11,.06,.24,.05);for(const s of [-1,1])ell(head,s*.18,.2,-.01,.085,.11,.07,dark);for(const x of [-.25,.25])for(const z of [-.17,.17])leg(root,x,z,.4,.06,.055)}
  else{ell(head,0,-.13,.22,.15,.1,.12,light);ell(head,0,-.07,.33,.05,.04,.03,pink);eyes(head,.12,.06,.24);for(const s of [-1,1]){const e=new T.Mesh(new T.ConeGeometry(.14,.32,16),fur);e.position.set(s*.18,.29,-.01);e.rotation.z=s*-.15;head.add(e);ell(head,s*.18,.28,.04,.065,.1,.025,pink)}for(let i=0;i<3;i++)for(const s of [-1,1])tube(head,[[s*.1,-.13,.32],[s*.28,-.13-i*.025,.34],[s*.4,-.1-i*.05,.32]],.005,white);parts.tail=new T.Group();parts.tail.position.set(-.5,.73,0);root.add(parts.tail);tube(parts.tail,[[0,0,0],[-.14,.2,0],[-.23,.42,.02]],.055,fur)}
  if(dog)for(const x of [-.4,.4])for(const z of [-.22,.22])leg(root,x,z,.62,.06,.095);
  if(!cow&&!dog&&!ham)for(const x of [-.3,.3])for(const z of [-.2,.2])leg(root,x,z,.57,.06,.08);
  if(dog){const c=new T.Mesh(new T.TorusGeometry(.22,.03,8,24),mat(0xa63850));c.position.set(.34,1,.02);c.rotation.x=Math.PI/2;root.add(c)}
  if(name==='Cat')for(let i=0;i<4;i++){const s=ell(root,-.16+i*.105,.95,.28,.02,.14,.014,dark);s.rotation.z=-.2}
  root.scale.setScalar(scale);
 }else if(name==='Parrot'){
  const bird=new T.Group();root.add(bird);ell(bird,0,.68,0,.23,.32,.19,fur);ell(bird,0,1.02,.01,.21,.21,.19,light);eyes(bird,.085,1.04,.17,.04);
  const b=new T.Mesh(new T.ConeGeometry(.07,.17,8),beak);b.position.set(0,.88,.23);b.rotation.x=Math.PI/2;b.rotation.z=Math.PI;bird.add(b);
  for(const s of [-1,1]){const wing=new T.Group();wing.position.set(s*.17,.7,0);bird.add(wing);ell(wing,s*.02,0,0,.1,.23,.055,fur);for(let i=0;i<4;i++){const f=ell(wing,s*.02,-.08-i*.045,.045,.065,.13,.03,i%2?blue:yellow);f.rotation.z=s*.2}parts[s<0?'leftWing':'rightWing']=wing}
  for(let i=-1;i<=1;i++){const f=ell(bird,i*.06,.32,-.16,.04,.28,.03,i===0?red:blue);f.rotation.z=i*.12}
  for(const x of [-.08,.08]){capsule(bird,x,.31,.02,.022,.14,claw);tube(bird,[[x,.24,.1],[x-.03,.19,.14],[x-.06,.23,.15]],.012,claw)}
  parts.bird=bird;root.scale.setScalar(.58);
 }
 root.userData.kind=name;root.userData.phase=Math.random()*Math.PI*2;root.userData.wander={x:0,z:0,wait:0,heading:0,air:Math.random()*Math.PI*2};
 root.userData.animate=(time,dt=.016,bounds={minX:-22,maxX:22,minZ:3,maxZ:27})=>{
  const w=root.userData.wander,p=root.userData.phase;
  w.wait-=dt;
  if(w.wait<=0){w.wait=1.8+Math.random()*3.8;w.x=(Math.random()-.5)*2;w.z=(Math.random()-.5)*2;w.heading=Math.atan2(w.x,w.z)}
  const speed=name==='Cow'?.55:name==='Dog'?1.0:name==='Cat'?.85:name==='Hamster'?1.15:1.25;
  if(name==='Parrot'){
   const fly=.95+Math.sin(time*2.1+w.air)*.22;root.position.x+=Math.sin(time*.55+w.air)*dt*.7;root.position.z+=Math.cos(time*.48+w.air)*dt*.65;root.position.y=fly+Math.sin(time*3+w.air)*.16;
   if(parts.leftWing){parts.leftWing.rotation.z=Math.sin(time*13+w.air)*.45;parts.rightWing.rotation.z=-Math.sin(time*13+w.air)*.45}
   root.rotation.y=Math.sin(time*.55+w.air)*.35;
  }else{
   const moving=w.wait>0&&(Math.abs(w.x)+Math.abs(w.z)>.1);
   if(moving){root.position.x+=w.x*speed*dt;root.position.z+=w.z*speed*dt;root.rotation.y=Math.atan2(w.x,w.z);root.position.y=Math.abs(Math.sin(time*(name==='Hamster'?12:8)+p))*(name==='Hamster'?.025:.045)}
   else root.position.y=Math.sin(time*2+p)*.012;
   if(parts.tail){parts.tail.rotation.z=Math.sin(time*3+p)*.22;parts.tail.rotation.x=Math.cos(time*2+p)*.08}
   if(parts.head)parts.head.rotation.y=Math.sin(time*.8+p)*.08;
  }
  root.position.x=T.MathUtils.clamp(root.position.x,bounds.minX,bounds.maxX);root.position.z=T.MathUtils.clamp(root.position.z,bounds.minZ,bounds.maxZ);
 };
 return root;
}