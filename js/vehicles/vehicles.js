// Detailed vehicles built from procedural meshes so they stay lightweight on phones.
export function createVehicle(T, name) {
  const root=new T.Group();
  const mat=(color,roughness=.48,metalness=.12)=>new T.MeshStandardMaterial({color,roughness,metalness});
  const paintColor={SUV:0x294d69,Car:0xc44b37,Pickup:0x657d57,Motorcycle:0x263747,Bicycle:0x3c718a,Tractor:0x3e8b43}[name]||0x547d62;
  const paint=mat(paintColor,.28,.42), paintDark=mat(0x202a31,.42,.25), rubber=mat(0x17191b,1,0), glass= new T.MeshPhysicalMaterial({color:0x6d9eaf,roughness:.13,metalness:.15,transparent:true,opacity:.78,clearcoat:1,clearcoatRoughness:.08}), chrome=mat(0xb9c4c9,.22,.88), black=mat(0x15191c,.75,.05), lamp= new T.MeshStandardMaterial({color:0xfff0c2,emissive:0xffc65b,emissiveIntensity:.55}), redLamp=new T.MeshStandardMaterial({color:0x9e1e19,emissive:0x6c0805,emissiveIntensity:.35});
  const cabin=mat(0x282d32,.9), seat=mat(0x544a40,.95), trim=mat(0x737d83,.55,.35);
  function mesh(parent,geo,material,x=0,y=0,z=0) { const o=new T.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o; }
  function box(parent,x,y,z,sx,sy,sz,material,bevel=.04) {
    const geo=new T.BoxGeometry(sx,sy,sz);
    const o=mesh(parent,geo,material,x,y,z);
    return o;
  }
  function sphere(parent,x,y,z,sx,sy,sz,material) { const o=mesh(parent,new T.SphereGeometry(1,20,14),material,x,y,z);o.scale.set(sx,sy,sz);return o; }
  function cylinder(parent,x,y,z,r,h,material,axis='y',segments=24) {
    const o=mesh(parent,new T.CylinderGeometry(r,r,h,segments),material,x,y,z);
    if(axis==='x') o.rotation.z=Math.PI/2;
    if(axis==='z') o.rotation.x=Math.PI/2;
    return o;
  }
  function wheel(x,z,r=.39,width=.22) {
    const group=new T.Group();group.position.set(x,r,z);root.add(group);
    const tire=mesh(group,new T.CylinderGeometry(r,r,width,32,1),rubber);
    tire.rotation.z=Math.PI/2;
    const sideX=width/2+.008;
    for(const side of [-1,1]) {
      cylinder(group,side*sideX,0,0,r*.67,.025,paintDark,'x',32);
      cylinder(group,side*(sideX+.018),0,0,r*.53,.03,chrome,'x',32);
      cylinder(group,side*(sideX+.04),0,0,r*.12,.035,paintDark,'x',20);
      // Raised radial tread blocks create a proper tyre profile.
      for(let i=0;i<28;i++) {
        const a=i*Math.PI*2/28;
        const tread=box(group,side*(width*.42),Math.sin(a)*(r+.006),Math.cos(a)*(r+.006),width*.22,.075,.035,black,0);
        tread.rotation.x=a;
      }
    }
    for(let i=0;i<8;i++) {
      const a=i*Math.PI/4;
      const spoke=box(group,0,Math.sin(a)*r*.39,Math.cos(a)*r*.39,width+.012,.045,.055,chrome,0);
      spoke.rotation.x=a;
    }
    return group;
  }
  function windowPanel(parent,coords,material=glass) {
    const geo=new T.BufferGeometry();
    geo.setFromPoints(coords.map(p=>new T.Vector3(...p)));
    const face=mesh(parent,new T.BufferGeometry(),material);
    face.geometry.setAttribute('position',new T.Float32BufferAttribute(coords.flat(),3));
    face.geometry.setIndex([0,1,2,0,2,3]);face.geometry.computeVertexNormals();
    return face;
  }
  function headlight(x,z) {
    const h=mesh(root,new T.BoxGeometry(.32,.18,.045),lamp,x,.91,z);
    h.rotation.y=0;
    sphere(root,x,.91,z+.03,.14,.065,.035,mat(0xffffff,.18,.25));
  }
  function mirror(x,z) {
    const arm=mesh(root,new T.CylinderGeometry(.025,.025,.32,8),paint,x,.0,z);
    arm.rotation.z=Math.PI/3;
    sphere(root,x,.0,z,.13,.09,.07,paintDark);
  }

  if(name==='Bicycle' || name==='Motorcycle') {
    const isBike=name==='Bicycle', r=isBike?.49:.43;
    for(const x of [-.82,.82]) {
      const w=mesh(root,new T.TorusGeometry(r,.065,10,40),rubber,x,r,0);w.rotation.y=Math.PI/2;
      cylinder(root,x,r,0,.07,.22,chrome,'x',20);
      for(let i=0;i<16;i++) {
        const a=i*Math.PI/8;
        const spoke=mesh(root,new T.CylinderGeometry(.008,.008,r*.88,5),chrome,x,r,0);
        spoke.rotation.z=a;spoke.rotation.y=Math.PI/2;
      }
    }
    const frame=mat(isBike?0x3c718a:paintColor,.3,.65);
    // Frame tubes / chassis.
    const tube=(a,b,rad=.035)=>{const A=new T.Vector3(...a),B=new T.Vector3(...b),d=B.clone().sub(A);const o=mesh(root,new T.CylinderGeometry(rad,rad,d.length(),10),frame);o.position.copy(A.add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;};
    tube([-.82,r,0],[-.25,r+.08,0]);tube([-.25,r+.08,0],[.25,r,0]);tube([.25,r,0],[.82,r,0]);tube([-.25,r+.08,0],[.05,r+.55,0]);tube([.05,r+.55,0],[.82,r,0]);tube([.05,r+.55,0],[-.25,r+.08,0]);
    if(isBike) {
      tube([-.25,r+.08,0],[-.42,r+.42,0],.045);tube([.05,r+.55,0],[.36,r+.58,0],.035);
      box(root,-.39,r+.47,0,.36,.07,.22,black);
      tube([.35,r+.58,0],[.48,r+.82,0],.025);tube([.48,r+.82,0],[.70,r+.82,0],.025);
      // Chain and crank.
      cylinder(root,-.25,r+.08,.13,.11,.08,paintDark,'z',16);
      tube([-.82,r,0],[-.25,r+.08,.12],.018,chrome);tube([-.25,r+.08,.12],[.82,r,0],.018,chrome);
      box(root,0,.10,0,1.0,.07,.34,paintDark);
      return root;
    }
    // Motorcycle: fuel tank, seat, engine, exhaust, fork, lights and mudguards.
    sphere(root,0,r+.63,0,.55,.25,.32,paint);
    box(root,-.16,r+.92,0,.72,.16,.34,seat);
    sphere(root,-.25,r+.34,.04,.27,.32,.27,chrome);
    box(root,.02,r+.37,.04,.46,.42,.42,paintDark);
    cylinder(root,-.05,r+.16,.28,.055,.8,chrome,'z',16);
    const fork1=mesh(root,new T.CylinderGeometry(.045,.045,.78,10),chrome,.65,r+.39,0);fork1.rotation.z=-.28;
    box(root,.80,r+.89,0,.12,.12,.55,paintDark);
    sphere(root,.84,r+.95,.02,.14,.13,.16,lamp);
    for(const x of [-.1,.1]) cylinder(root,.05,r+.17,x,.045,.44,chrome,'z',12);
    // Rear and front fenders.
    const f1=mesh(root,new T.TorusGeometry(.47,.035,8,28,Math.PI),paintDark,-.82,r,0);f1.rotation.y=Math.PI/2;f1.rotation.z=Math.PI;
    const f2=mesh(root,new T.TorusGeometry(.47,.035,8,28,Math.PI),paintDark,.82,r,0);f2.rotation.y=Math.PI/2;
    tube([.52,r+.9,0],[.52,r+1.25,0],.025); tube([.52,r+1.25,0],[.15,r+1.36,0],.025);
    return root;
  }

  if(name==='Tractor') {
    // Farm tractor with huge rear tyres, smaller front tyres, bonnet and cab.
    box(root,0,.73,0,2.8,.48,1.35,paint);
    box(root,.48,1.12,0,1.35,.48,1.1,paint);
    box(root,.25,1.58,0,.95,.52,1.0,glass);
    for(const x of [-.24,.24]) box(root,.25,1.86,x,.08,.12,.08,paintDark);
    box(root,-.78,1.05,0,.48,.55,1.0,paint);
    box(root,-1.08,.82,0,.20,.16,1.35,paintDark);
    // Exhaust stack and air intake.
    cylinder(root,-.76,1.65,-.38,.045,.75,black);
    cylinder(root,-.76,2.04,-.38,.07,.06,chrome);
    // Front grille and paired lamps.
    box(root,-1.43,.92,0,.06,.48,.82,paintDark);
    for(let z of [-.27,.27]) { sphere(root,-1.48,1.12,z,.045,.09,.09,lamp); box(root,-1.49,.88,z,.03,.20,.045,chrome); }
    for(const x of [-.88,.92]) for(const z of [-.78,.78]) wheel(x,z,x<0?.63:.38,x<0?.32:.24);
    box(root,1.30,.45,0,.35,.12,1.0,chrome);
    box(root,.5,.25,0,.5,.12,1.1,paintDark);
    return root;
  }

  const isSUV=name==='SUV', isPickup=name==='Pickup', length=isSUV?3.65:isPickup?3.75:3.15, width=isSUV?1.62:1.48;
  const front=-length/2, rear=length/2;
  // Lower chassis, sculpted body and wheel arches.
  box(root,0,.66,0,length,.42,width,paint);
  box(root,0,.87,0,length*.91,.38,width*.98,paint);
  box(root,front+.48,1.0,0,.92,.38,width*.98,paint);
  box(root,rear-.40,.98,0,.78,.34,width*.98,paint);
  // Cabin glass and roof silhouette.
  const cabCenter=-.03, cabLength=isSUV?1.85:1.60, cabWidth=width*.82;
  box(root,cabCenter,1.42,0,cabLength,.13,cabWidth,paint);
  box(root,cabCenter,1.15,0,cabLength,.56,cabWidth*.92,cabin);
  // Windscreen / rear glass and side windows.
  box(root,front+.94,1.43,0,.055,.47,cabWidth*.89,glass).rotation.z=-.20;
  box(root,rear-.82,1.43,0,.055,.44,cabWidth*.89,glass).rotation.z=.20;
  for(const side of [-1,1]) {
    box(root,cabCenter-.40,1.43,side*(cabWidth/2+.012),.66,.42,.035,glass);
    box(root,cabCenter+.42,1.43,side*(cabWidth/2+.012),.67,.42,.035,glass);
    box(root,cabCenter+.02,1.43,side*(cabWidth/2+.03),.045,.44,.045,paintDark);
    box(root,cabCenter-.40,1.10,side*(cabWidth/2+.04),.055,.07,.035,chrome);
    box(root,cabCenter+.42,1.10,side*(cabWidth/2+.04),.055,.07,.035,chrome);
    // Door handles, mirrors and running boards.
    box(root,cabCenter-.18,1.07,side*(width/2+.025),.18,.045,.035,chrome);
    const mirrorArm=mesh(root,new T.CylinderGeometry(.025,.025,.25,8),paint,front+.78,1.30,side*(width*.54));
    mirrorArm.rotation.z=Math.PI/3;
    box(root,front+.72,1.34,side*(width*.57),.17,.12,.10,paintDark);
    box(root,0,.48,side*(width*.52),1.35,.10,.12,paintDark);
  }
  // Seats, steering wheel and dashboard visible through the glass.
  for(const x of [-.40,.36]) {
    box(root,x,1.02,-.31,.42,.12,.36,seat);
    box(root,x,1.24,-.45,.42,.40,.12,seat);
  }
  box(root,front+.80,1.03,0,.28,.12,cabWidth*.82,cabin);
  const steering=mesh(root,new T.TorusGeometry(.14,.018,8,20),black,front+.78,1.19,-.28);
  steering.rotation.x=Math.PI/2;
  // Wheels, detailed alloy rims and flared arches.
  for(const x of [front+.72,rear-.68]) for(const z of [-width*.53,width*.53]) {
    const w=wheel(x,z,.43,.25);
    const arch=mesh(root,new T.TorusGeometry(.47,.055,8,28,Math.PI),paintDark,x,.72,z);
    arch.rotation.y=Math.PI/2; arch.rotation.z=Math.PI;
  }
  // Front fascia, grille, bumper, fog lamps and rear tail lamps.
  box(root,front-.04,.77,0,.12,.40,width*.82,paintDark);
  box(root,front-.11,.80,0,.04,.27,.70,chrome);
  for(let i=0;i<7;i++) box(root,front-.14,.80,-.27+i*.09,.035,.20,.025,black);
  for(const z of [-.56,.56]) {
    box(root,front-.13,1.00,z,.045,.18,.24,lamp);
    box(root,front-.14,.57,z,.08,.11,.23,mat(0xeee5d3,.25,.25));
    box(root,rear+.035,.93,z,.08,.25,.19,redLamp);
  }
  box(root,front-.13,.48,0,.18,.13,width*.96,chrome);
  box(root,rear+.08,.55,0,.18,.13,width*.96,paintDark);
  // Side cladding, fuel flap and rear wiper details.
  box(root,0,.61,0,length*.66,.045,width*1.015,paintDark);
  sphere(root,rear-.45,1.0,width*.51,.055,.07,.025,paintDark);
  box(root,front+.91,1.66,0,.06,.035,cabWidth*.9,black);
  if(isPickup) {
    // Open cargo bed with ribbed floor, inner walls and tailgate.
    box(root,rear-.42,1.02,0,.85,.08,width*.80,paintDark);
    for(const z of [-width*.39,width*.39]) box(root,rear-.42,1.22,z,.92,.38,.09,paint);
    box(root,rear-.03,1.20,0,.09,.38,width*.80,paint);
    for(let i=0;i<5;i++) box(root,rear-.78+i*.17,1.07,0,.025,.018,width*.72,chrome);
  }
  // Roof rails on SUV and subtle roof details.
  if(isSUV) for(const z of [-cabWidth*.38,cabWidth*.38]) {
    box(root,cabCenter,1.57,z,cabLength*.85,.045,.045,chrome);
    for(const x of [cabCenter-.55,cabCenter+.55]) box(root,x,1.60,z,.06,.10,.06,chrome);
  }
  root.userData.kind=name;
  return root;
}
