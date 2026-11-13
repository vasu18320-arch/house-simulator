import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import {createCharacter,setOutfit} from './characters/characters.js';
import {createWorld} from './worlds/worlds.js';
import {createHouse} from './houses/houses.js';
import {createPet} from './animals/pets.js';
import {createVehicle,createVehicleShed} from './vehicles/vehicles.js';
import {createBaby} from './family/babies.js';
import {bindUI} from './ui/ui.js';
import {saveGame,loadGame} from './systems/save.js';

const scene=new THREE.Scene();scene.background=new THREE.Color(0xb8d9e8);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,300);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
document.querySelector('#game').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe9f5ff,0x65764d,2));
const sun=new THREE.DirectionalLight(0xffedcf,2.5);sun.position.set(-25,38,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const state={world:'mountain',tier:0,vasuOutfit:0,shellyOutfit:0,pets:[],vehicles:[],babies:[],driving:null};
const worldGroup=new THREE.Group(),houseGroup=new THREE.Group(),actors=new THREE.Group(),props=new THREE.Group(),vehicleGroup=new THREE.Group(),shedGroup=new THREE.Group();scene.add(worldGroup,houseGroup,actors,props,vehicleGroup,shedGroup);
const vasu=createCharacter(THREE,false),shelly=createCharacter(THREE,true);actors.add(vasu.group,shelly.group);vasu.group.position.set(-1,0,4);shelly.group.position.set(1,0,4);
let babyGroup=new THREE.Group();actors.add(babyGroup);
let move={x:0,y:0},running=false,yaw=0,pitch=.2,dragging=false,last={x:0,y:0},joyId=null;
const clock=new THREE.Clock();
function toast(s){const e=document.querySelector('#toast');e.textContent=s;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),1800)}
function clear(g){while(g.children.length){const o=g.children[g.children.length-1];g.remove(o);o.traverse?.(n=>{n.geometry?.dispose?.();if(Array.isArray(n.material))n.material.forEach(m=>m.dispose?.());else n.material?.dispose?.()})}}
function rebuild(){clear(worldGroup);clear(houseGroup);clear(shedGroup);worldGroup.add(createWorld(THREE,state.world));houseGroup.add(createHouse(THREE,state.world,state.tier));shedGroup.add(createVehicleShed(THREE));shedGroup.position.set(18.5,0,-7);scene.background.set(state.world==='mountain'?0xb8d9e8:state.world==='countryside'?0xc6e6ad:0xa9c5d7);toast(state.world+' world selected')}
function refresh(){clear(props);clear(vehicleGroup);clear(babyGroup);state.pets.forEach((p,i)=>{const o=createPet(THREE,p.type);o.position.set(-10+(i%5)*4,0,7+Math.floor(i/5)*3);props.add(o);p.object=o});state.vehicles.forEach((v,i)=>{const o=createVehicle(THREE,v.type);o.position.set(12.5+(i%3)*5.6,0,-11.5+Math.floor(i/3)*5.5);vehicleGroup.add(o);v.object=o});state.babies.forEach((b,i)=>{const o=createBaby(THREE,b.type);o.position.set(-1.3+(i%4)*.8,0,2+Math.floor(i/4)*.7);babyGroup.add(o);b.object=o});document.querySelector('#familyCount').textContent=state.babies.length?state.babies.length+' little ones in your family':'No babies yet'}
function looks(){setOutfit(THREE,vasu,0,state.vasuOutfit);setOutfit(THREE,shelly,1,state.shellyOutfit)}
function changeWorld(n){state.world=n;rebuild();vasu.group.position.set(-1,0,4);shelly.group.position.set(1,0,4);yaw=0}
function changeHouse(n){state.tier=+n;rebuild()}
function nearest(){let best=null,d0=4.8;for(const v of state.vehicles){if(v.object){const d=v.object.position.distanceTo(vasu.group.position);if(d<d0){best=v;d0=d}}}return best}
function interact(){if(state.driving){state.driving=null;toast('You got out');return}const v=nearest();if(v){state.driving=v;toast('Driving '+v.type+' — use joystick')}else toast('Walk closer to a vehicle')}
function portrait(on){document.querySelector('#portraitOverlay').classList.toggle('show',on);document.querySelector('#ui').classList.toggle('portrait-mode',on);if(on){yaw=0;pitch=.12;toast('Ready! Take a screenshot ❤️')}}
function snapshot(){return {world:state.world,tier:state.tier,vasuOutfit:state.vasuOutfit,shellyOutfit:state.shellyOutfit,pets:state.pets.map(x=>({type:x.type})),vehicles:state.vehicles.map(x=>({type:x.type})),babies:state.babies.map(x=>({type:x.type}))}}
function apply(d){if(!d){toast('No saved world found');return}state.world=['mountain','countryside','city'].includes(d.world)?d.world:'mountain';state.tier=Math.max(0,Math.min(2,+d.tier||0));state.vasuOutfit=+d.vasuOutfit||0;state.shellyOutfit=+d.shellyOutfit||0;state.pets=(d.pets||[]).map(x=>({type:x.type}));state.vehicles=(d.vehicles||[]).map(x=>({type:x.type}));state.babies=(d.babies||[]).map(x=>({type:x.type}));looks();rebuild();refresh()}
bindUI({changeWorld,changeHouse,addPet:t=>{state.pets.push({type:t});refresh();toast(t+' joined your family')},addVehicle:t=>{state.vehicles.push({type:t});refresh()},addBaby:t=>{state.babies.push({type:t});refresh()},setOutfit:(k,n)=>{if(k===0)state.vasuOutfit=n;else state.shellyOutfit=n;looks()},portrait,save:()=>{saveGame(snapshot());toast('World saved ❤️')},load:()=>apply(loadGame()),reset:()=>{state.pets=[];state.vehicles=[];state.babies=[];state.world='mountain';state.tier=0;state.vasuOutfit=0;state.shellyOutfit=0;looks();rebuild();refresh()},setRunning:v=>running=v,interact});
rebuild();looks();refresh();
const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');
function joyUpdate(e){const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy)||1,k=Math.min(1,43/len);move={x:dx*k/43,y:dy*k/43};stick.style.transform=`translate(${move.x*43}px,${move.y*43}px)`}
joy.addEventListener('pointerdown',e=>{e.preventDefault();joyId=e.pointerId;joy.setPointerCapture(e.pointerId);joyUpdate(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId)joyUpdate(e)});
function joyEnd(e){if(e.pointerId!==joyId)return;joyId=null;move={x:0,y:0};stick.style.transform='translate(0,0)'}
joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;last={x:e.clientX,y:e.clientY}});
renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;yaw-=(e.clientX-last.x)*.006;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-last.y)*.002,.08,.48);last={x:e.clientX,y:e.clientY}});
['pointerup','pointercancel','pointerleave'].forEach(x=>renderer.domElement.addEventListener(x,()=>dragging=false));
function animate(t){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),moving=Math.abs(move.x)+Math.abs(move.y)>.06,speed=(running?8:4.5)*dt;
 if(moving){const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),dir=r.multiplyScalar(move.x).add(f.multiplyScalar(-move.y));if(dir.lengthSq()>1)dir.normalize();if(state.driving?.object){const v=state.driving.object;v.position.addScaledVector(dir,speed);v.rotation.y=Math.atan2(dir.x,dir.z);vasu.group.position.copy(v.position)}else{vasu.group.position.addScaledVector(dir,speed);vasu.group.rotation.y=Math.atan2(dir.x,dir.z)}}
 const target=new THREE.Vector3(vasu.group.position.x+Math.sin(yaw)*12,5.5+pitch*7,vasu.group.position.z+Math.cos(yaw)*12);camera.position.lerp(target,.14);camera.lookAt(vasu.group.position.x,1.05,vasu.group.position.z);
 shelly.group.position.lerp(new THREE.Vector3(vasu.group.position.x+1.25,0,vasu.group.position.z+.35),.06);shelly.group.lookAt(vasu.group.position.x,0,vasu.group.position.z);
 vasu.animate(t/1000,moving);shelly.animate(t/1000,false);for(const p of state.pets)p.object?.userData.animate?.(t/1000,dt,{minX:-24,maxX:24,minZ:4,maxZ:27});renderer.render(scene,camera)}
requestAnimationFrame(animate);window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5))});
setTimeout(()=>{const l=document.querySelector('#loading');if(l){l.style.opacity='0';setTimeout(()=>l.remove(),550)}},1300);
