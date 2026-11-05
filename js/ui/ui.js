export function bindUI(api){
 const panel=document.querySelector('#panel');
 const open=()=>panel.classList.add('open'),close=()=>panel.classList.remove('open');
 document.querySelector('#menuToggle').addEventListener('click',open);
 document.querySelector('#closePanel').addEventListener('click',close);
 document.querySelectorAll('[data-world]').forEach(b=>b.addEventListener('click',()=>{api.changeWorld(b.dataset.world);document.querySelectorAll('[data-world]').forEach(x=>x.classList.toggle('selected',x===b))}));
 document.querySelector('#houseTier').addEventListener('change',e=>api.changeHouse(e.target.value));
 document.querySelector('#vasuOutfit').addEventListener('change',e=>api.setOutfit(0,Number(e.target.value)));
 document.querySelector('#shellyOutfit').addEventListener('change',e=>api.setOutfit(1,Number(e.target.value)));
 document.querySelectorAll('[data-pet]').forEach(b=>b.addEventListener('click',()=>api.addPet(b.dataset.pet)));
 document.querySelectorAll('[data-vehicle]').forEach(b=>b.addEventListener('click',()=>api.addVehicle(b.dataset.vehicle)));
 document.querySelectorAll('[data-baby]').forEach(b=>b.addEventListener('click',()=>api.addBaby(b.dataset.baby)));
 document.querySelector('#portraitButton').addEventListener('click',()=>{api.portrait(true);close()});
 document.querySelector('#photoButton').addEventListener('click',()=>{api.portrait(true);close()});
 document.querySelector('#exitPortrait').addEventListener('click',()=>api.portrait(false));
 document.querySelector('#saveButton').addEventListener('click',api.save);
 document.querySelector('#loadButton').addEventListener('click',api.load);
 document.querySelector('#resetButton').addEventListener('click',()=>{if(confirm('Start a fresh world? This clears the current setup.'))api.reset()});
 const run=document.querySelector('#runButton');let running=false;
 const down=e=>{e.preventDefault();running=true;api.setRunning(true)},up=()=>{running=false;api.setRunning(false)};
 run.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(x=>run.addEventListener(x,up));
 document.querySelector('#interactButton').addEventListener('click',api.interact);
}
