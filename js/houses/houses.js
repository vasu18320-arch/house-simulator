export function createHouse(T,world,tier){
 const g=new T.Group(),M=c=>new T.MeshStandardMaterial({color:c,roughness:.82});
 function box(x,y,z,a,b,c,col){const o=new T.Mesh(new T.BoxGeometry(a,b,c),M(col));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
 function cyl(x,y,z,r,h,col){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,16),M(col));o.position.set(x,y,z);g.add(o);return o}
 const s=[.82,1,1.2][tier],w=6.6*s,h=3.4*s,d=5.2*s;
 const wall=world==='mountain'?[0xe8d8c2,0xe6dfd3,0xf0e7d8][tier]:world==='countryside'?[0xe8d2a8,0xf0dfbd,0xf5e8ce][tier]:[0xd7e0e5,0xe9edef,0xf3f5f5][tier];
 const roof=world==='mountain'?0x3d5666:world==='countryside'?0x96583d:0x344c61,trim=world==='city'?0x4b6272:0x80553b;
 box(0,h/2,-3,w,h,d,wall);box(0,.12,-3,w+.25,.24,d+.25,trim);
 if(world==='mountain'){box(-w*.28,h*.45,-3,w*.42,h*.9,d*.9,0x92775e);const a=box(-w*.24,h+.55,-3,w*.62,.24,d+.9,roof);a.rotation.z=-.52;const b=box(w*.24,h+.55,-3,w*.62,.24,d+.9,roof);b.rotation.z=.52;box(0,h+1.12,-3,.18,.2,d+.95,trim);if(tier===2){box(0,1,.65,w*.8,.16,2.1,0x8b6547);for(let x=-w*.38;x<=w*.38;x+=w*.19)box(x,1.5,1.55,.08,1,.08,0x8b6547)}}
 else if(world==='countryside'){box(0,h+.42,-3,w+1.3,.28,d+1.4,roof);const gg=new T.Mesh(new T.ConeGeometry(w*.65,2.2*s,4),M(roof));gg.position.set(0,h+.85,-3);gg.rotation.y=Math.PI/4;gg.scale.z=d*.7;g.add(gg);box(0,1.1,.7,w*.92,.18,1.9,trim);for(let x=-w*.42;x<=w*.42;x+=w*.21)cyl(x,1.55,1.35,.075,2.9,0xf2e6ce);if(tier===2){box(-w*.62,1.5,-3,3,3,d*.8,wall);box(-w*.62,3.1,-3,3.3,.2,d*.9,roof)}}
 else{box(0,h+.14,-3,w+.2,.28,d+.2,roof);box(0,h*.63,-.32,w*.78,.12,.12,trim);if(tier>0){box(0,2.6,.25,w*.86,.18,1.2,trim);for(let x=-w*.4;x<=w*.4;x+=w*.2)box(x,2.95,.78,.07,.65,.07,0x536c7b)}if(tier===2){box(w*.55,2,-3,2.8,4,d*.9,wall);box(w*.55,4.1,-3,3,.2,d,roof);box(-w*.55,2,-3,2.5,4,d*.9,wall)}}
 box(0,1.15,-.3,1.15,2.3,.16,trim);box(.34,1.1,-.19,.08,.08,.05,0xf4c86a);
 for(const x of [-w*.31,w*.31]){box(x,2,-.24,1.45,1.2,.12,0x79bddd);box(x,2,-.15,1.55,.08,.08,0xffffff);box(x,2,-.15,.08,1.3,.08,0xffffff)}
 box(0,.18,.85,2.4,.3,1,0xb8aa96);box(0,.08,4,5.2,.12,4.4,world==='city'?0x85898b:0xc0b9a9);
 for(const x of [-w*.43,w*.43]){cyl(x,.3,.55,.28,.55,0xb77b55);const p=new T.Mesh(new T.SphereGeometry(.36,16,12),M(0x4b914e));p.position.set(x,.85,.55);g.add(p)}
 if(tier===2){for(let x=-w*.55;x<=w*.55;x+=w*.22)box(x,.6,2.2,.09,1.1,.09,trim);box(0,1.18,2.2,w*1.1,.12,.12,trim)}
 return g;
}
