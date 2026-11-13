// Detailed, softly realistic companion animals for the cosy life-sim world.
export function createPet(T, name) {
  const root = new T.Group();
  const mat = (color, roughness=.82, metalness=0) => new T.MeshStandardMaterial({color, roughness, metalness});
  const mats = {
    fur: mat(({Cat:0x77716a,Dog:0xb67a48,Cow:0xf0eee6,Parrot:0x16894d,Hamster:0xc9965d})[name] || 0x999999),
    furLight: mat(({Cat:0xbcb3a7,Dog:0xd9ad79,Cow:0xffffff,Parrot:0x40b96b,Hamster:0xe4bd89})[name] || 0xcccccc),
    furDark: mat(({Cat:0x39383a,Dog:0x69412b,Cow:0x302b29,Parrot:0x075b3a,Hamster:0x9b603d})[name] || 0x555555),
    skin: mat(0xd9a18f), pink: mat(0xd98591), nose: mat(0x302323, .4),
    eye: mat(0x100d0b,.2), iris: mat(0x6a4b25,.25), white: mat(0xfff8e9,.25),
    horn: mat(0xe8dfc8), beak: mat(0xf0a72f,.45), claw: mat(0x51463e),
    featherBlue: mat(0x197eb4), featherYellow: mat(0xf2c83c), featherRed: mat(0xe34c39)
  };
  const parts = {};
  const sphereGeo = new T.SphereGeometry(1, 28, 20);
  function ell(parent, x,y,z, sx,sy,sz, material, name) {
    const o = new T.Mesh(sphereGeo, material);
    o.position.set(x,y,z); o.scale.set(sx,sy,sz);
    o.castShadow = true; o.receiveShadow = true;
    if (name) parts[name] = o;
    parent.add(o); return o;
  }
  function capsule(parent, x,y,z, radius, length, material, name) {
    const o = new T.Mesh(new T.CapsuleGeometry(radius,length,5,12), material);
    o.position.set(x,y,z); o.castShadow=true; o.receiveShadow=true;
    if(name) parts[name]=o; parent.add(o); return o;
  }
  function tube(parent, points, radius, material, segments=18) {
    const curve = new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const o = new T.Mesh(new T.TubeGeometry(curve,segments,radius,8,false),material);
    o.castShadow=true; parent.add(o); return o;
  }
  function cone(parent,x,y,z,r,h,material,rotZ=0) {
    const o=new T.Mesh(new T.ConeGeometry(r,h,18),material);
    o.position.set(x,y,z); o.rotation.z=rotZ; o.castShadow=true; parent.add(o); return o;
  }
  function eyePair(head, x, y, z, scale=.09, color=mats.iris) {
    for (const side of [-1,1]) {
      ell(head,side*x,y,z,scale*1.22,scale*1.18,scale*.48,mats.white);
      ell(head,side*x,y,z+scale*.38,scale*.68,scale*.78,scale*.35,color);
      ell(head,side*x,y,z+scale*.66,scale*.36,scale*.53,scale*.2,mats.eye);
      ell(head,side*x-scale*.018,y+scale*.025,z+scale*.81,scale*.14,scale*.18,scale*.08,mats.white);
    }
  }
  function leg(parent,x,z, shoulderY, footY, width=.095) {
    const h=shoulderY-footY;
    const limb=capsule(parent,x,(shoulderY+footY)/2,z,width,h*.58,mats.fur);
    limb.rotation.z=x<0?-.04:.04;
    ell(parent,x,footY+.045,z+.035,width*1.2,.075,width*1.55,mats.furLight);
    for(let i=-1;i<=1;i++) ell(parent,x+i*width*.55,footY+.025,z+.13,width*.19,.025,width*.24,mats.claw);
    return limb;
  }

  if (name === 'Cat' || name === 'Dog' || name === 'Hamster' || name === 'Cow') {
    const isCow=name==='Cow', isDog=name==='Dog', isHam=name==='Hamster';
    const bodyY=isCow?.85:isHam?.55:.72;
    const body=ell(root,isDog?-.08:0,bodyY,0,isCow?.78:isDog?.68:isHam?.48:.58,isCow?.47:isDog?.39:isHam?.34:.37,isCow?.42:.39,isCow?mats.fur:mats.fur,'body');
    body.rotation.z=isDog?-.04:0;
    // Neck and chest give the animal a recognisable shoulder line.
    ell(root,isDog?.43:.36,bodyY+.12,.015,isDog?.30:.29,isDog?.40:.42,isDog?.32:.30,mats.fur,'chest');
    const head=new T.Group(); root.add(head);
    head.position.set(isDog?.65:.48,isDog?1.16:isCow?1.36:isHam?.92:1.25,.035);
    parts.head=head;
    ell(head,0,0,0,isDog?.34:isCow?.32:isHam?.29:.30,isDog?.34:isCow?.31:isHam?.27:.31,isDog?.31:isCow?.29:isHam?.27:.29,mats.fur);
    if(isDog) {
      // Soft muzzle, broad nose and floppy ears.
      ell(head,0,-.13,.25,.24,.17,.23,mats.furLight);
      ell(head,0,-.075,.43,.12,.085,.075,mats.nose);
      for(const s of [-1,1]) {
        const ear=ell(head,s*.29,.12,-.015,.16,.29,.105,mats.furDark,s<0?'leftEar':'rightEar');
        ear.rotation.z=s*-.28;
        ell(head,s*.16,-.18,.24,.09,.065,.06,mats.furLight);
      }
      eyePair(head,.145,.095,.265,.07);
      tube(head,[[-.08,-.22,.34],[0,-.26,.37],[.08,-.22,.34]],.012,mats.nose,10);
      // A curved wagging tail.
      parts.tail=new T.Group(); parts.tail.position.set(-.63,.9,0); root.add(parts.tail);
      tube(parts.tail,[[0,0,0],[-.16,.18,0],[-.32,.34,.015],[-.46,.28,.02]],.075,mats.fur);
    } else if(isCow) {
      // Long face, muzzle, ears and short horns.
      ell(head,0,-.12,.20,.21,.20,.20,mats.furLight);
      ell(head,0,-.16,.37,.17,.12,.07,mats.pink);
      for(const s of [-1,1]) {
        const ear=ell(head,s*.34,.10,0,.22,.09,.15,mats.furLight); ear.rotation.z=s*.2;
        cone(head,s*.19,.31,-.01,.085,.28,mats.horn,s*-.12);
        ell(head,s*.14,.035,.26,.055,.065,.035,mats.eye);
      }
      // Characteristic irregular dark coat patches.
      for(const p of [[-.35,1.02,.30,.20,.25,.08],[.22,.92,-.34,.22,.28,.07],[-.1,.58,.38,.19,.13,.05],[.52,.94,-.18,.12,.19,.06]]) {
        const patch=ell(root,...p,mats.furDark); patch.rotation.z=.35;
      }
      // Four sturdy legs, split hooves and a small udder.
      for(const x of [-.48,.48]) for(const z of [-.25,.25]) {
        capsule(root,x,.40,z,.105,.55,mats.fur);
        ell(root,x,.10,z+.025,.12,.10,.15,mats.furDark);
        for(const k of [-1,1]) ell(root,x+k*.045,.085,z+.13,.045,.06,.07,mats.claw);
      }
      ell(root,-.02,.43,.32,.19,.14,.18,mats.pink);
      for(const x of [-.09,.09]) capsule(root,x,.28,.34,.035,.15,mats.pink);
      parts.tail=new T.Group(); parts.tail.position.set(-.72,1.05,0); root.add(parts.tail);
      tube(parts.tail,[[0,0,0],[-.05,-.25,0],[-.1,-.46,.02]],.035,mats.fur);
      ell(parts.tail,-.1,-.48,.02,.07,.12,.07,mats.furDark);
    } else {
      // Cat/hamster cheeks, tiny muzzle and species-specific ears.
      ell(head,0,-.14,.23,isHam?.19:.16,isHam?.13:.11,.13,mats.furLight);
      ell(head,0,-.08,.34,.055,.045,.04,mats.pink);
      eyePair(head,.125,.07,.245,isHam?.055:.07,isHam?mats.eye:mats.iris);
      if(!isHam) {
        for(const s of [-1,1]) {
          const ear=cone(head,s*.19,.31,-.02,.16,.36,mats.fur,s*-.15);
          ell(head,s*.19,.29,.045,.075,.12,.035,mats.pink);
          // Fine whiskers on both sides of the muzzle.
          for(let j=0;j<3;j++) tube(head,[[s*.10,-.13,.34],[s*.28,-.12-j*.035,.36],[s*.42,-.10-j*.07,.34]],.006,mats.white,8);
        }
        parts.tail=new T.Group(); parts.tail.position.set(-.52,.78,0); root.add(parts.tail);
        tube(parts.tail,[[0,0,0],[-.16,.20,0],[-.28,.44,.02],[-.20,.67,.03]],.065,mats.fur);
      } else {
        for(const s of [-1,1]) ell(head,s*.20,.22,-.015,.11,.13,.09,mats.furDark);
        // Hamster's rounded cheeks and compact little feet.
        ell(head,-.13,-.16,.22,.13,.11,.10,mats.furLight);
        ell(head,.13,-.16,.22,.13,.11,.10,mats.furLight);
      }
      for(const x of [-.31,.31]) for(const z of [-.20,.20]) leg(root,x,z,bodyY-.03,.08,isHam?.07:.09);
    }
    if(isDog) {
      for(const x of [-.42,.42]) for(const z of [-.22,.22]) leg(root,x,z,.65,.08,.105);
      // Subtle coat markings and collar.
      const collar=new T.Mesh(new T.TorusGeometry(.23,.035,8,24),mat(0x9e334b));
      collar.position.set(.38,1.05,.03); collar.rotation.x=Math.PI/2; root.add(collar);
      ell(root,.38,1.04,.26,.07,.07,.035,mat(0xf0c65a));
    }
    if(name==='Cat') {
      // A soft striped tabby pattern.
      for(let i=0;i<4;i++) {
        const stripe=ell(root,-.16+i*.105,1.01,.29,.025,.16,.018,mats.furDark);
        stripe.rotation.z=-.22;
      }
    }
  } else if (name === 'Parrot') {
    // Perched parrot with layered wing feathers, hooked beak and curved claws.
    const bird=new T.Group(); root.add(bird);
    ell(bird,0,.92,0,.34,.47,.28,mats.fur,'body');
    ell(bird,0,1.45,.015,.30,.30,.27,mats.furLight,'head');
    ell(bird,0,1.24,.10,.27,.27,.23,mats.fur);
    eyePair(bird,.115,1.48,.245,.055,mats.eye);
    const upper=new T.Mesh(new T.ConeGeometry(.105,.25,7),mats.beak);
    upper.position.set(0,1.30,.34); upper.rotation.x=Math.PI/2; upper.rotation.z=Math.PI; bird.add(upper);
    ell(bird,0,1.22,.34,.08,.055,.07,mats.furDark);
    for(const s of [-1,1]) {
      const wing=new T.Group(); wing.position.set(s*.24,.99,-.01); bird.add(wing);
      ell(wing,s*.015,0,0,.16,.34,.09,mats.fur);
      for(let i=0;i<5;i++) {
        const f=ell(wing,s*.015,-.10-i*.035,.065,.10,.20,.045,i%2?mats.featherBlue:mats.featherYellow);
        f.rotation.z=s*.28;
      }
      parts[s<0?'leftWing':'rightWing']=wing;
    }
    for(let i=0;i<5;i++) ell(bird,0,1.70+i*.045,-.10,.06,.16,.05,i%2?mats.featherRed:mats.fur);
    // Long tapered tail feathers.
    for(let i=-1;i<=1;i++) {
      const feather=ell(bird,i*.10,.40,-.30,.065,.42,.045,i===0?mats.featherRed:mats.featherBlue);
      feather.rotation.x=-.25; feather.rotation.z=i*.12;
    }
    for(const x of [-.12,.12]) {
      capsule(bird,x,.40,.015,.035,.25,mats.claw);
      for(let k=-1;k<=1;k++) tube(bird,[[x,.31,.10],[x+k*.045,.25,.16],[x+k*.07,.30,.18]],.018,mats.claw,8);
    }
    parts.body=bird;
  }

  // Place each animal on the ground with a little breathing/tail motion.
  root.userData.kind=name;
  root.userData.phase=Math.random()*Math.PI*2;
  root.userData.animate=(time)=>{
    const p=root.userData.phase;
    root.position.y=Math.sin(time*2.2+p)*.018;
    if(parts.tail) { parts.tail.rotation.z=Math.sin(time*3+p)*.16; parts.tail.rotation.x=Math.cos(time*2.1+p)*.08; }
    if(parts.leftEar) parts.leftEar.rotation.z=-.28+Math.sin(time*1.7+p)*.035;
    if(parts.rightEar) parts.rightEar.rotation.z=.28+Math.sin(time*1.7+p+1)*.035;
    if(parts.leftWing) { parts.leftWing.rotation.z=Math.sin(time*2+p)*.035; parts.rightWing.rotation.z=-Math.sin(time*2+p)*.035; }
    if(parts.head && name!=='Parrot') parts.head.rotation.y=Math.sin(time*.75+p)*.045;
  };
  return root;
}
