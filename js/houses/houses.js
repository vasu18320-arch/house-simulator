export function createHouse(T,world,tier){
 const g=new T.Group();
 const mat=(c,r=.82,m=0)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m});
 const palettes={
  mountain:{base:0xd8e2e0,top:0xf1eee4,trim:0x637b7c,roof:0x354f5b,stone:0xb8b8aa,wood:0x765d4b,accent:0x9db8b2},
  countryside:{base:0xe5d7bd,top:0xf6edda,trim:0x87947a,roof:0x566b5b,stone:0xc8b99e,wood:0x87664b,accent:0xb7c39b},
  city:{base:0xd8e0df,top:0xf0f1eb,trim:0x6e8585,roof:0x435d68,stone:0xb9c3c0,wood:0x6c7770,accent:0xa9c1c0}
 };
 const p=palettes[world]||palettes.mountain;
 const cream=mat(p.top),wallBase=mat(p.base),trim=mat(p.trim),roof=mat(p.roof,.72,.12),stone=mat(p.stone),wood=mat(p.wood),accent=mat(p.accent),glass=mat(0x8fc4d2,.2,.15),darkGlass=mat(0x294653,.28),gold=mat(0xc6a66c,.28,.55),green=mat(0x638a68);roof.side=T.DoubleSide;
 const add=(geo,m,x,y,z,rx=0,ry=0,rz=0)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.castShadow=true;o.receiveShadow=true;g.add(o);return o};
 const box=(x,y,z,w,h,d,m)=>add(new T.BoxGeometry(w,h,d),m,x,y,z);
 const cyl=(x,y,z,r,h,m,n=28)=>add(new T.CylinderGeometry(r,r,h,n),m,x,y,z);
 const sphere=(x,y,z,r,m)=>add(new T.SphereGeometry(r,18,14),m,x,y,z);
 const cone=(x,y,z,r,h,m,n=8)=>add(new T.ConeGeometry(r,h,n),m,x,y,z,0,Math.PI/4,0);
 const gradientBox=(x,y,z,w,h,d,bottom,top)=>{
  const geo=new T.BoxGeometry(w,h,d),pos=geo.attributes.position,col=[];
  const a=new T.Color(bottom),b=new T.Color(top);
  for(let i=0;i<pos.count;i++){const t=T.MathUtils.clamp((pos.getY(i)+h/2)/h,0,1);const c=a.clone().lerp(b,t);col.push(c.r,c.g,c.b)}
  geo.setAttribute('color',new T.Float32BufferAttribute(col,3));
  return add(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:.86}),x,y,z);
 };
 const window=(x,y,z,w=1.05,h=1.35)=>{
  box(x,y,z,w+.22,h+.22,.18,wood);box(x,y,z+.105,w,h,.055,darkGlass);
  box(x,y,z+.145,.065,h,.045,gold);box(x,y,z+.145,w,.065,.045,gold);
  box(x,y,z+.15,.04,h,.04,trim);
  box(x,y-h*.56,z+.08,w+.3,.14,.28,stone);
  box(x,y+h*.56,z+.08,w+.3,.12,.24,trim);
 };
 const door=(x,y,z,w=1.35,h=2.45)=>{
  box(x,y,z,w+.24,h+.22,.2,wood);box(x,y,z+.12,w,h,.06,mat(0x53685e));
  box(x-.04,y,z+.17,.055,h,.035,gold);box(x+w*.3,y,z+.2,.07,.07,.07,gold);
  box(x,y+h*.27,z+.19,w*.58,.07,.035,gold);
  for(let i=0;i<3;i++)box(x-w*.22+i*w*.22,y-h*.2,z+.19,.035,.62,.025,wood);
 };
 const W=tier===2?10.2:tier===1?8.8:7.8,D=tier===2?8.0:6.8,H=tier===2?4.2:3.65,cz=-4.6,front=cz+D/2;
 // Stone plinth and vertically blended limewash facade.
 box(0,.2,cz,W+.55,.4,D+.55,stone);
 gradientBox(0,H/2+.4,cz,W,H,D,p.base,p.top);
 box(0,.48,cz,W+.12,.2,D+.12,trim);
 // Elegant dark roof with real gable geometry: two clean sloping planes.
 const ridgeY=H+1.45,eaveY=H+.12,zFront=cz+D/2+.32,zBack=cz-D/2-.32;
 const roofPlane=(side)=>{
  const x0=side<0?-W/2-.38:0,x1=side<0?0:W/2+.38;
  const y0=side<0?eaveY:ridgeY,y1=side<0?ridgeY:eaveY;
  const geo=new T.BufferGeometry();
  const v=[x0,y0,zBack,x1,y1,zBack,x1,y1,zFront,x0,y0,zFront];
  geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();
  return add(geo,roof,0,0,0);
 };
 roofPlane(-1);roofPlane(1);
 box(0,ridgeY+.04,cz,.22,.2,D+.9,trim);
 // Front gable infill and decorative fascia, facing the camera (+Z).
 const gable=new T.BufferGeometry();
 const gv=[-W/2,H+.1,front+.03,W/2,H+.1,front+.03,0,ridgeY-.08,front+.03];
 gable.setAttribute('position',new T.Float32BufferAttribute(gv,3));gable.setIndex([0,1,2]);gable.computeVertexNormals();add(gable,cream,0,0,0);
 box(0,H+.18,front+.1,W+.18,.18,.16,trim);
 // Front door, porch roof, substantial columns and wide welcoming steps.
 box(0,1.65,front+.22,3.8,3.15,.24,trim);
 box(0,1.65,front+.38,3.48,2.9,.12,cream);
 door(0,1.5,front+.47,1.4,2.48);
 box(0,3.28,front+1.0,4.3,.22,2.0,roof);
 for(const x of [-1.82,1.82]){
  box(x,1.65,front+1.0,.2,3.15,.2,wood);
  box(x,.18,front+1.05,.92,.3,.72,stone);
  box(x,3.22,front+1.0,.32,.22,.32,gold);
 }
 box(0,.2,front+1.55,5.0,.34,1.3,stone);
 // A pair of tall, framed windows and smaller upper gable window.
 for(const x of [-W*.31,W*.31])window(x,2.15,front+.12,1.4,1.5);
 window(0,H+.75,front+.12,.9,.82);
 // Side windows and timber details prevent blank side walls.
 for(const z of [cz-1.7,cz+1.1])window(-W/2-.07,2.0,z,.95,1.2);
 for(const z of [cz-1.5,cz+1.2])box(W/2+.06,1.25,z,.08,2.5,.08,trim);
 // Chimney with cap on rear roof slope.
 box(-W*.34,H+.9,cz-D*.28,.62,2.1,.68,trim);
 box(-W*.34,H+2.0,cz-D*.28,.82,.16,.88,stone);
 // Planters, shrubs, lanterns and a path approaching the front door.
 for(const x of [-2.65,2.65]){
  box(x,.32,front+.48,.82,.62,.72,stone);
  cyl(x,.92,front+.48,.32,.64,green);
  for(let j=0;j<4;j++)sphere(x+(j-1.5)*.16,1.15,front+.48,.19,green);
  box(x,2.8,front+.19,.18,.52,.16,wood);
  box(x,3.0,front+.19,.28,.16,.24,gold);
 }
 for(let i=0;i<7;i++)box(0,.09,front+2.5+i*.92,1.55,.16,.72,stone);
 if(tier===1){
  // Upper family suite, balanced dormers and a sunroom wing.
  gradientBox(0,H+1.25,cz,W*.68,2.15,D*.62,p.base,p.top);
  box(-W*.19,H+2.38,cz,W*.48,.22,D*.68,roof).rotation.z=-.42;
  box(W*.19,H+2.38,cz,W*.48,.22,D*.68,roof).rotation.z=.42;
  for(const x of [-W*.2,W*.2])window(x,H+1.25,front+.05,1.15,1.08);
  box(W*.58,1.9,cz,3.1,3.8,4.8,cream);
  box(W*.58,3.88,cz,3.35,.22,5.05,roof);
  window(W*.58,2.0,cz+2.45,1.35,1.45);
 }
 if(tier>=2){
  // MAJESTIC CASTLE: central keep, four round towers, crenellations and a ceremonial gate.
  const tower=(x,z,r,h)=>{
   cyl(x,.38+h/2,z,r,h,stone,36);
   cyl(x,.38+h*.72,z,r+.07,.24,trim,36);
   // Recessed lancet windows on the front and side faces.
   for(const a of [-.72,0,.72]){
    const wx=x+Math.sin(a)*(r+.045),wz=z+Math.cos(a)*(r+.045);
    box(wx,.38+h*.58,wz,.2,1.35,.12,darkGlass);
    box(wx,.38+h*.58,wz+.075,.055,1.42,.045,gold);
   }
   cyl(x,.38+h+.12,z,r+.2,.3,trim,36);
   for(let i=0;i<14;i++){const a=i*Math.PI/7;box(x+Math.cos(a)*(r+.15),.38+h+.45,z+Math.sin(a)*(r+.15),.3,.62,.3,stone)}
   cone(x,.38+h+1.5,z,r+.26,2.15,roof,10);
   cyl(x,.38+h+2.55,z,.065,.55,gold,12);
   cone(x,.38+h+2.88,z,.13,.28,gold,8);
  };
  gradientBox(0,3.0,cz,W*.72,5.5,D*.7,0xc8d1ca,0xf0eee2);
  // Central keep's steep roof and dormer details.
  const kY=8.1;
  box(0,kY,cz,7.2,.32,D*.72,trim);
  const left=box(-1.8,9.05,cz,3.9,.24,D*.78,roof);left.rotation.z=-.55;
  const right=box(1.8,9.05,cz,3.9,.24,D*.78,roof);right.rotation.z=.55;
  for(const x of [-2.15,2.15])window(x,5.3,front+.18,1.0,1.45);
  // Towers flank the front entrance and rear keep corners.
  tower(-W*.48,front-.55,1.12,7.4);tower(W*.48,front-.55,1.12,7.4);
  tower(-W*.48,cz-D*.42,.9,6.0);tower(W*.48,cz-D*.42,.9,6.0);
  // Layered portal, heavy double doors, crest and balcony.
  box(0,2.35,front+.45,3.1,4.2,.55,stone);
  box(0,2.2,front+.77,2.12,3.65,.16,wood);
  box(0,2.2,front+.88,1.72,3.35,.08,mat(0x405b55));
  box(0,4.42,front+.8,3.55,.28,.72,gold);
  box(0,4.72,front+.6,4.2,.18,1.0,trim);
  for(const x of [-1.9,1.9]){box(x,5.05,front+.62,.2,1.0,.2,stone);sphere(x,5.62,front+.62,.19,gold)}
  // Crenellated parapet and ceremonial forecourt.
  for(let x=-3.6;x<=3.61;x+=.72)box(x,8.55,front-.1,.36,.72,.36,stone);
  box(0,.12,front+3.8,15,.22,8.5,stone);
  for(const x of [-6.2,6.2])for(const z of [front+1.5,front+5.6]){
   cyl(x,.48,z,.45,.85,trim);sphere(x,1.2,z,.5,green);
  }
 }
 return g;
}