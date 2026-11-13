export function createHouse(T,world,tier){
 const g=new T.Group();
 const mat=(c,r=.84)=>new T.MeshStandardMaterial({color:c,roughness:r});
 const palettes={
  mountain:{wall:0xe8dfd0,trim:0x9c8065,roof:0x536b70,stone:0xbab2a2,wood:0x765d49},
  countryside:{wall:0xeee2c9,trim:0xb68a67,roof:0x78866c,stone:0xc8bda7,wood:0x80634b},
  city:{wall:0xe7e9e3,trim:0x9ba99e,roof:0x657b7b,stone:0xc5c9be,wood:0x66766d}
 };
 const p=palettes[world]||palettes.countryside;
 const cream=mat(p.wall),trim=mat(p.trim),roof=mat(p.roof),stone=mat(p.stone),wood=mat(p.wood),glass=mat(0x8fb9bd,.24),darkGlass=mat(0x38535a,.35),gold=mat(0xc7a76b,.32),green=mat(0x66866a);
 const add=(geo,m,x,y,z,rx=0,ry=0,rz=0)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.castShadow=true;o.receiveShadow=true;g.add(o);return o};
 const box=(x,y,z,w,h,d,m)=>add(new T.BoxGeometry(w,h,d),m,x,y,z);
 const cyl=(x,y,z,r,h,m,n=24)=>add(new T.CylinderGeometry(r,r,h,n),m,x,y,z);
 const cone=(x,y,z,r,h,m,n=4)=>add(new T.ConeGeometry(r,h,n),m,x,y,z,0,Math.PI/4,0);
 const sphere=(x,y,z,r,m)=>add(new T.SphereGeometry(r,16,12),m,x,y,z);
 const window=(x,y,z,w=1.05,h=1.25)=>{
  box(x,y,z,w+.16,h+.16,.13,wood);box(x,y,z-.075,w,h,.045,darkGlass);
  box(x,y,z-.11,.065,h,.045,gold);box(x,y,z-.11,w,.065,.045,gold);
  box(x,y,z-.12,.045,h,.045,trim);
  box(x,y-h*.56,z-.08,w+.22,.12,.22,trim);
 };
 const door=(x,y,z,w=1.25,h=2.35)=>{
  box(x,y,z,w+.2,h+.2,.2,wood);box(x,y,z-.12,w,h,.07,mat(0x80634d));
  box(x,y,z-.17,.06,h,.04,gold);sphere(x+w*.32,y,z-.2,.065,gold);
  box(x,y+h*.26,z-.19,w*.55,.08,.035,gold);
 };
 const tierScale=[1,1.12,1.22][Math.min(2,tier)]||1;
 const W=7.4*tierScale,D=6.2*tierScale,H=3.65*tierScale;
 // Broad stone foundation and warm, softly coloured main house.
 box(0,.18,-4.6,W+.5,.36,D+.5,stone);
 box(0,H/2+.35,-4.6,W,H,D,cream);
 box(0,.43,-4.6,W+.12,.22,D+.12,trim);
 // Main pitched roof with clear eaves and ridge.
 box(-W*.245,H+.62,-4.6,W*.57,.22,D+.55,roof).rotation.z=-.43;
 box(W*.245,H+.62,-4.6,W*.57,.22,D+.55,roof).rotation.z=.43;
 box(0,H+1.02,-4.6,.2,.2,D+.65,trim);
 box(0,H+.28,-1.47,3.25,.18,1.65,roof);
 // Welcoming recessed porch, framed entry and steps.
 box(0,1.45,-1.42,3.25,2.9,.22,trim);
 box(0,1.45,-1.27,2.88,2.68,.13,cream);
 door(0,1.48,-1.17,1.28,2.45);
 for(const x of [-1.45,1.45]){
  box(x,1.52,-.56,.17,2.95,.17,wood);
  box(x,.16,-.12,.9,.28,.58,stone);
  box(x,3.04,-1.35,.22,.22,.22,gold);
 }
 box(0,.2,-.08,4.1,.3,1.15,stone);
 // Symmetrical, generous windows on the front elevation.
 for(const x of [-W*.32,W*.32]){
  window(x,2.2,-1.48,1.35,1.48);
  box(x,1.35,-1.35,1.5,.1,.18,trim);
 }
 // Side wall windows add a lived-in, finished silhouette.
 for(const z of [-6.0,-3.2])window(-W*.505,2.15,z,.95,1.15);
 // Chimney and tasteful garden details.
 box(-W*.34,H+1.05,-6.65,.58,1.9,.62,trim);
 box(-W*.34,H+2.04,-6.65,.76,.16,.78,stone);
 for(const x of [-2.3,2.3]){
  box(x,.28,-.65,.72,.55,.7,stone);
  cyl(x,.86,-.65,.3,.68,green);
  for(let j=0;j<3;j++)sphere(x+(j-1)*.17,1.08,-.65,.19,green);
 }
 // Stepping-stone path to the front door.
 for(let i=0;i<5;i++)box(0,.08,1.0+i*1.0,1.3,.12,.68,stone);
 if(tier===1){
  // Larger family home: a real upper storey with dormer windows and a side sunroom.
  box(0,H+1.0,-4.6,W*.72,1.8,D*.68,cream);
  box(-W*.18,H+2.08,-4.6,W*.48,.2,D*.72,roof).rotation.z=-.42;
  box(W*.18,H+2.08,-4.6,W*.48,.2,D*.72,roof).rotation.z=.42;
  for(const x of [-W*.22,W*.22])window(x,H+1.05,-1.48,1.12,1.12);
  box(W*.57,1.85,-4.7,3.0,3.7,4.6,cream);
  box(W*.57,3.76,-4.7,3.25,.2,4.85,roof);
  window(W*.57,2.0,-2.34,1.35,1.4);
 }
 if(tier>=2){
  // CASTLE ESTATE: a majestic central keep, flanking round towers and a grand entrance.
  // The extra stonework, tall towers, crenellations and copper-toned roofs create a castle silhouette.
  const tower=(x,z,r,h)=>{
   const baseY=.38;
   cyl(x,baseY+h/2,z,r,h,stone,32);
   cyl(x,baseY+h*.72,z,r+.035,.22,trim,32);
   // narrow arched-looking slit windows on visible faces
   for(const a of [-.7,.7,Math.PI]){
    const wx=x+Math.sin(a)*(r+.04),wz=z+Math.cos(a)*(r+.04);
    box(wx,baseY+h*.57,wz,.2,1.15,.12,darkGlass);
    box(wx,baseY+h*.57,wz-.08,.055,1.25,.055,gold);
   }
   cyl(x,baseY+h+.12,z,r+.18,.28,trim,32);
   // merlons around the parapet
   for(let i=0;i<12;i++){const a=i*Math.PI/6;box(x+Math.cos(a)*(r+.12),baseY+h+.42,z+Math.sin(a)*(r+.12),.28,.62,.28,stone)}
   cone(x,baseY+h+1.35,z,r+.2,1.9,roof,8);
   cyl(x,baseY+h+2.35,z,.07,.55,gold,12);
   cone(x,baseY+h+2.72,z,.12,.25,gold,8);
  };
  // castle keep rises behind the entry block
  box(0,H/2+1.2,-5.0,W*.68,H+2.0,D*.72,cream);
  box(0,H+2.35,-5.0,W*.73,.3,D*.76,trim);
  for(const x of [-W*.24,W*.24])window(x,H+1.25,-2.68,1.05,1.4);
  // Four tall corner towers; front towers are larger and frame the gateway.
  tower(-W*.48,-1.9,1.05,7.0);tower(W*.48,-1.9,1.05,7.0);
  tower(-W*.48,-8.0,.88,5.6);tower(W*.48,-8.0,.88,5.6);
  // Grand arched gate effect using layered portal, double doors and a balcony.
  box(0,2.15,-1.2,2.6,3.8,.42,stone);
  box(0,2.0,-.94,1.78,3.35,.18,wood);
  box(0,2.0,-.82,1.42,3.05,.08,mat(0x665342));
  box(0,3.92,-.88,2.9,.24,.65,gold);
  box(0,4.18,-1.1,3.5,.16,.9,trim);
  for(const x of [-1.65,1.65]){box(x,4.55,-1.1,.18,.95,.18,stone);sphere(x,5.08,-1.1,.18,gold)}
  // Decorative battlements along the keep roofline.
  for(let x=-3.3;x<=3.31;x+=.72)box(x,H+3.0,-1.75,.34,.68,.34,stone);
  // Softly landscaped castle forecourt.
  box(0,.08,2.1,12,.16,5.4,stone);
  for(const x of [-5.0,5.0])for(const z of [0.0,3.2]){
   cyl(x,.42,z,.42,.72,trim);sphere(x,1.15,z,.48,green);
  }
 }
 return g;
}