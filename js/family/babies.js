export function createBaby(T,type='girl'){
 const g=new T.Group();
 const mat=(c,r=.82)=>new T.MeshStandardMaterial({color:c,roughness:r});
 const skin=mat(0xf0c5a8),skinShade=mat(0xd99f83),white=mat(0xfffdf8),iris=mat(0x594238),pupil=mat(0x17151a),shine=mat(0xffffff),hair=mat(type==='girl'?0x493024:0x30251f),cloth=mat(type==='girl'?0xf1a6c4:0x8bbde5),trim=mat(type==='girl'?0xffd5e3:0xc8e7fa),sock=mat(0xfff4e9),mouth=mat(0x9e5d60);
 const sphere=(parent,m,x,y,z,sx,sy,sz,seg=24)=>{const o=new T.Mesh(new T.SphereGeometry(1,seg,18),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o};
 const cylinder=(m,a,b,r1,r2)=>{const d=new T.Vector3().subVectors(b,a),o=new T.Mesh(new T.CylinderGeometry(r2,r1,d.length(),12),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());o.castShadow=true;g.add(o);return o};
 // Soft, oversized infant head and tiny seated body
 sphere(g,cloth,0,.47,0,.27,.32,.25);
 sphere(g,skin,0,1.02,.015,.39,.405,.355,32);
 // round cheeks, ears and little nose
 for(const s of [-1,1]){sphere(g,skin,s*.345,1.0,0,.09,.125,.075);sphere(g,skinShade,s*.365,1.0,.048,.035,.06,.018);sphere(g,skin,s*.19,.88,.286,.115,.09,.065)}
 sphere(g,skinShade,0,.99,.355,.043,.045,.04);
 // eyes: bright whites, warm irises, pupils and catchlights
 for(const s of [-1,1]){
  sphere(g,white,s*.145,1.095,.315,.075,.091,.045);
  sphere(g,iris,s*.145,1.09,.354,.039,.052,.022);
  sphere(g,pupil,s*.145,1.09,.371,.022,.034,.012);
  sphere(g,shine,s*.158,1.115,.383,.012,.015,.008);
  // tiny upper lashes / brows
  sphere(g,hair,s*.145,1.205,.306,.064,.012,.018);
 }
 // smiling mouth and subtle chin
 sphere(g,mouth,0,.84,.354,.042,.014,.012);
 // hair cap, hairline and tiny sculpted locks
 sphere(g,hair,0,1.31,-.015,.385,.19,.345,28);
 sphere(g,hair,0,1.22,.27,.31,.105,.11,24);
 for(let i=0;i<5;i++){const x=(i-2)*.105;sphere(g,hair,x,1.365,.275,.07,.075,.09,16)}
 // baby arms with rounded hands
 for(const s of [-1,1]){
  const shoulder=new T.Vector3(s*.22,.61,0),hand=new T.Vector3(s*.36,.38,.12);
  cylinder(skin,shoulder,hand,.075,.065);sphere(g,skin,hand.x,hand.y,hand.z,.085,.07,.08);
  // short legs and soft booties
  const hip=new T.Vector3(s*.12,.25,.01),foot=new T.Vector3(s*.16,.12,.13);
  cylinder(skin,hip,foot,.085,.075);sphere(g,sock,foot.x,foot.y,foot.z+.035,.095,.075,.13);
 }
 // bib, neckline, small buttons and a tidy diaper/onesie seam
 sphere(g,trim,0,.64,.238,.145,.13,.035);
 for(const y of [.43,.51])sphere(g,trim,0,y,.252,.018,.018,.012,12);
 if(type==='girl'){
  // soft headband and a small bow
  const band= new T.Mesh(new T.TorusGeometry(.335,.025,8,40,Math.PI),trim);band.rotation.z=Math.PI;band.position.set(0,1.32,.015);g.add(band);
  sphere(g,trim,-.25,1.39,.18,.09,.045,.035);sphere(g,trim,-.16,1.39,.18,.09,.045,.035);sphere(g,cloth,-.205,1.39,.205,.035,.035,.025);
 }else{
  // little side-swept tuft
  const tuft=sphere(g,hair,.16,1.46,.18,.13,.065,.11);tuft.rotation.z=-.45;
 }
 g.scale.setScalar(.78);
 g.userData.animate=t=>{g.position.y=.035+Math.sin(t*2.6)*.025;g.rotation.z=Math.sin(t*1.4)*.025};
 return g;
}