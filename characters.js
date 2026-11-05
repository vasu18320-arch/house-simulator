
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function makePerson(scene, isGirl = false) {
  const g = new THREE.Group();

  const material = (color) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.85 });

  const skin = material(0xc98b68);
  const hair = material(isGirl ? 0x15101b : 0x241b17);
  const clothes = material(isGirl ? 0xe88db4 : 0x4b83c8);

  function part(geo, mat, x, y, z) {
    const o = new THREE.Mesh(geo, mat);
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    g.add(o);
    return o;
  }

  // Body and head
  part(new THREE.CapsuleGeometry(.38, .8, 5, 12), clothes, 0, 1.05, 0);
  part(new THREE.SphereGeometry(.43, 24, 20), skin, 0, 2, 0);
  part(new THREE.SphereGeometry(.45, 20, 16), hair, 0, 2.27, -.12);

  if (isGirl) {
    part(new THREE.SphereGeometry(.28, 16, 12), hair, -.38, 1.98, -.05);
    part(new THREE.SphereGeometry(.28, 16, 12), hair, .38, 1.98, -.05);
  }

  // Eyes and nose
  for (const x of [-.16, .16]) {
    part(new THREE.SphereGeometry(.055, 12, 10), material(0xffffff), x, 2.04, .385);
    part(new THREE.SphereGeometry(.027, 12, 10), material(0x241714), x, 2.04, .433);
  }

  part(new THREE.SphereGeometry(.075, 12, 10), skin, 0, 1.91, .4);

  // Arms
  for (const x of [-.48, .48]) {
    const arm = part(new THREE.CapsuleGeometry(.12, .58, 4, 8), clothes, x, 1.15, 0);
    arm.rotation.z = x < 0 ? -.35 : .35;
    part(new THREE.SphereGeometry(.13, 12, 10), skin, x * 1.2, .79, .02);
  }

  // Legs and shoes
  for (const x of [-.19, .19]) {
    part(new THREE.CapsuleGeometry(.14, .45, 4, 8), material(0x39435c), x, .28, 0);
    part(new THREE.BoxGeometry(.3, .14, .48), material(0x342a27), x, .06, .12);
  }

  scene.add(g);
  return g;
}
