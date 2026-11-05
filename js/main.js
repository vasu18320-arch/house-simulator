import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { createCharacter, setOutfit } from './characters/characters.js';
import { createWorld } from './worlds/worlds.js';
import { createHouse } from './houses/houses.js';
import { createPet } from './animals/pets.js';
import { createVehicle } from './vehicles/vehicles.js';
import { createBaby } from './family/babies.js';
import { bindUI } from './ui/ui.js';
import { saveGame, loadGame } from './systems/save.js';

const gameEl=document.querySelector('#game');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xa8d5ed);
scene.fog=new THREE.Fog(0xa8d5ed,55,150);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,260);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
gameEl.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xe4f4ff,0x61734b,2.1));
const sun=new THREE.DirectionalLight(0xfff0d5,2.8);
sun.position.set(-25,38,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-38;sun.shadow.camera.right=38;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-38;scene.add(sun);

const state={world:'mountain',tier:0,vasuOutfit:0,shellyOutfit:0,pets:[],vehicles:[],babies:[],portrait:false,driving:null};
let worldGroup=new THREE.Group();scene.add(worldGroup);
let houseGroup=new THREE.Group();scene.add(houseGroup);
let actors=new THREE.Group();scene.add(actors);
let props=new THREE.Group();scene.add(props);
let vasu=createCharacter(THREE,false);let shelly=createCharacter(THREE,true);
actors.add(vasu.group,shelly.group);
vasu.group.position.set(-1,0,3);shelly.group.position.set(1,0,3);
let worldObjects=[];
let move={x:0,y:0};let running=false;let yaw=0;let cameraPitch=.22;let dragging=false;let lastPointer={x:0,y:0};let lastTime=0;
const clock=new THREE.Clock();

function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1900)}
function clearGroup(g){while(g.children.length){const o=g.children.pop();if(o.parent)o.parent.remove(o);disposeObject(o)}}
function disposeObject(o){o.traverse?.(n=>{n.geometry?.dispose?.();if(Array.isArray(n.material))n.material.forEach(m=>m.dispose?.());else n.material?.dispose?.()})}
function rebuildWorld(){
  clearGroup(worldGroup);clearGroup(houseGroup);
  const w=createWorld(THREE,state.world);worldGroup.add(w);
  const h=createHouse(THREE,state.world,state.tier);houseGroup.add(h);
  toast(`${state.world[0].toUpperCase()+state.world.slice(1)} world · ${['Simple','Moderate','Grand'][state.tier]} home`);
}
function refreshProps(){
  clearGroup(props);
  state.pets.forEach((p,i)=>{const o=createPet(THREE,p.type);o.position.set(-5+(i%4)*1.5,0,6+Math.floor(i/4)*1.5);props.add(o);p.object=o});
  state.vehicles.forEach((v,i)=>{const o=createVehicle(THREE,v.type);o.position.set(5+(i%3)*3,0,5+Math.floor(i/3)*3);props.add(o);v.object=o});
  state.babies.forEach((b,i)=>{const o=createBaby(THREE,b.type);o.position.set(-1.5+(i%3)*.8,0,1+Math.floor(i/3)*.7);actors.add(o);b.object=o});
  document.querySelector('#familyCount').textContent=state.babies.length?`${state.babies.length} little ${state.babies.length===1?'one':'ones'} in your family`:'No babies yet';
}
function changeWorld(name){state.world=name;rebuildWorld();camera.position.set(0,9,17);yaw=0}
function changeHouse(t){state.tier=Number(t);rebuildWorld()}
function addPet(type){state.pets.push({type});refreshProps();toast(`${type} joined your family!`)}
function addVehicle(type){state.vehicles.push({type});refreshProps();toast(`${type} added to your property!`)}
function addBaby(type){state.babies.push({type});refreshProps();toast(`A baby ${type} joined your family ❤️`)}
function setLooks(){
  setOutfit(THREE,vasu,0,state.vasuOutfit);
  setOutfit(THREE,shelly,1,state.shellyOutfit);
}
function nearestVehicle(){
 let best=null,dist=4.5;
 state.vehicles.forEach(v=>{if(!v.object)return;const d=v.object.position.distanceTo(vasu.group.position);if(d<dist){dist=d;best=v}});
 return best;
}
function interact(){
 if(state.driving){state.driving=null;toast('You got out of the vehicle');return}
 const v=nearestVehicle();
 if(v){state.driving=v;toast(`Driving ${v.type}! Use joystick to move.`)}
 else toast('Explore your garden and walk closer to a vehicle to drive.');
}
function portrait(on){
 state.portrait=on;
 document.querySelector('#portraitOverlay').classList.toggle('show',on);document.querySelector('#ui').classList.toggle('portrait-mode',on);
 if(on){camera.position.set(0,8,21);yaw=0;toast('Family portrait ready! Take a screenshot ❤️')}
}
function snapshot(){return {world:state.world,tier:state.tier,vasuOutfit:state.vasuOutfit,shellyOutfit:state.shellyOutfit,pets:state.pets.map(x=>({type:x.type})),vehicles:state.vehicles.map(x=>({type:x.type})),babies:state.babies.map(x=>({type:x.type}))}}
function applySave(data){
 if(!data)return;
 state.world=['mountain','countryside','city'].includes(data.world)?data.world:'mountain';
 state.tier=Math.max(0,Math.min(2,Number(data.tier)||0));
 state.vasuOutfit=Number(data.vasuOutfit)||0;state.shellyOutfit=Number(data.shellyOutfit)||0;
 state.pets=Array.isArray(data.pets)?data.pets.map(x=>({type:x.type})):[];state.vehicles=Array.isArray(data.vehicles)?data.vehicles.map(x=>({type:x.type})):[];state.babies=Array.isArray(data.babies)?data.babies.map(x=>({type:x.type})):[];setLooks();rebuildWorld();refreshProps();toast('Your saved world is back ❤️')
}
bindUI({changeWorld,changeHouse,addPet,addVehicle,addBaby,portrait,setOutfit:(kind,index)=>{if(kind===0)state.vasuOutfit=index;else state.shellyOutfit=index;setLooks();toast('Outfit updated!')},save:()=>{saveGame(snapshot());toast('Your world has been saved!')},load:()=>applySave(loadGame()),reset:()=>{state.pets=[];state.vehicles=[];state.babies=[];state.world='mountain';state.tier=0;state.vasuOutfit=0;state.shellyOutfit=0;setLooks();rebuildWorld();refreshProps();toast('A fresh new world!')},setMove:v=>move=v,setRunning:v=>running=v,interact});
rebuildWorld();setLooks();refreshProps();

const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');
let joyPointer=null;
joy.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;joy.setPointerCapture(e.pointerId);updateJoy(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)updateJoy(e)});
function updateJoy(e){const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy),max=35,s=Math.min(1,max/(len||1));move={x:dx*s/max,y:dy*s/max};stick.style.transform=`translate(${move.x*35}px,${move.y*35}px)`}
function endJoy(e){if(e.pointerId!==joyPointer)return;joyPointer=null;move={x:0,y:0};stick.style.transform='translate(0,0)'}
joy.addEventListener('pointerup',endJoy);joy.addEventListener('pointercancel',endJoy);
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastPointer={x:e.clientX,y:e.clientY}});
renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastPointer.x;const dy=e.clientY-lastPointer.y;yaw-=dx*.005;cameraPitch=Math.max(.08,Math.min(.55,cameraPitch+dy*.002));lastPointer={x:e.clientX,y:e.clientY}});
['pointerup','pointercancel','pointerleave'].forEach(ev=>renderer.domElement.addEventListener(ev,()=>dragging=false));
function animate(t){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);
 const speed=(running?7:4.1)*dt;
 if(move.x||move.y){
  const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
  const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
  const dir=right.multiplyScalar(move.x).add(forward.multiplyScalar(-move.y));
  if(dir.lengthSq()>0){dir.normalize();const target=vasu.group.position.clone().addScaledVector(dir,speed);vasu.group.position.lerp(target,.8);vasu.group.rotation.y=Math.atan2(dir.x,dir.z)}
 }
 if(state.driving?.object){
  const v=state.driving.object;v.position.x=vasu.group.position.x;v.position.z=vasu.group.position.z;
  v.position.add(new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw)).multiplyScalar(-move.y*speed));
  vasu.group.position.x=v.position.x;vasu.group.position.z=v.position.z;
 }
 const follow=new THREE.Vector3(vasu.group.position.x+Math.sin(yaw)*15,7+cameraPitch*5,vasu.group.position.z+Math.cos(yaw)*15);
 camera.position.lerp(follow,.09);camera.lookAt(vasu.group.position.x,1.1,vasu.group.position.z);
 shelly.group.position.lerp(new THREE.Vector3(vasu.group.position.x+1.25,0,vasu.group.position.z+.3),.035);
 vasu.animate?.(t/1000);shelly.animate?.(t/1000);
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6))});
setTimeout(()=>{const l=document.querySelector('#loading');l.style.opacity='0';setTimeout(()=>l.remove(),550)},650);
