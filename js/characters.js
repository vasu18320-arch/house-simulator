
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function makePerson(scene, isGirl = false) {
  const g = new THREE.Group();

  const mat = (color, roughness = 0.8) =>
    new THREE.MeshStandardMaterial({ color, roughness });

  const skin = mat(0xc98b70);
  const skinLight = mat(0xdca184);
  const hair = mat(isGirl ? 0x17111c : 0x211916);
  const hairLight = mat(isGirl ? 0x30202c : 0x39251d);
  const white = mat(0xffffff);
  const iris = mat(0x38231d);
  const pupil = mat(0x100b0a);
  const shoe = mat(0x352b2a);
  const pants = mat(isGirl ? 0x493a55 : 0x35445e);
  const shirt = mat(isGirl ? 0xe879aa : 0x4b85ce);
  const shirtLight = mat(isGirl ? 0xffa8cc : 0x77b3ed);

  function part(geo, material, x, y, z, parent = g) {
    const o = new THREE.Mesh(geo, material);
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  }

  function sphere(x, y, z, sx, sy, sz, material, parent = g) {
    const o = part(
      new THREE.SphereGeometry(1, 24, 20),
      material, x, y, z, parent
    );
    o.scale.set(sx, sy, sz);
    return o;
  }

  // BODY
  const body = sphere(0, 1.17, 0, .43, .58, .29, shirt);
  body.scale.y = 1.25;

  // Decorative shirt collar
  sphere(0, 1.63, .05, .23, .10, .24, shirtLight);

  // Head
  sphere(0, 2.05, 0, .43, .48, .39, skin);

  // Ears
  for (const x of [-.43, .43]) {
    sphere(x, 2.04, 0, .10, .14, .09, skinLight);
  }

  // Hair cap
  sphere(0, 2.36, -.055, .46, .27, .41, hair);

  // Hairline
  sphere(0, 2.29, .22, .34, .12, .22, hair);

  if (isGirl) {
    // Long flowing hair behind the head
    sphere(0, 1.83, -.29, .43, .65, .19, hair);
    sphere(-.37, 1.75, -.12, .16, .53, .17, hair);
    sphere(.37, 1.75, -.12, .16, .53, .17, hair);

    // Side locks
    sphere(-.39, 1.48, -.10, .12, .38, .13, hairLight);
    sphere(.39, 1.48, -.10, .12, .38, .13, hairLight);

    // Bangs
    sphere(-.18, 2.30, .30, .20, .13, .12, hairLight);
    sphere(.06, 2.32, .31, .19, .12, .12, hair);
    sphere(.27, 2.27, .28, .15, .12, .13, hair);
  } else {
    // Short textured hairstyle
    sphere(-.27, 2.47, .04, .20, .17, .24, hairLight);
    sphere(-.08, 2.52, .02, .20, .17, .24, hair);
    sphere(.13, 2.49, .03, .21, .17, .23, hairLight);
    sphere(.29, 2.42, .02, .15, .14, .20, hair);
  }

  // EYEBROWS
  for (const x of [-.16, .16]) {
    const brow = sphere(x, 2.20, .345, .105, .035, .045, hair);
    brow.rotation.z = x < 0 ? .10 : -.10;
  }

  // BIG EXPRESSIVE EYES
  for (const x of [-.16, .16]) {
    sphere(x, 2.08, .355, .105, .12, .055, white);
    sphere(x, 2.075, .402, .057, .078, .025, iris);
    sphere(x, 2.075, .422, .034, .052, .014, pupil);
    sphere(x - .018, 2.11, .437, .018, .022, .009, white);
  }

  // Nose
  sphere(0, 1.99, .405, .055, .065, .06, skinLight);

  // Smile
  const smilePoints = [
    new THREE.Vector3(-.09, 1.91, .365),
    new THREE.Vector3(-.045, 1.885, .39),
    new THREE.Vector3(0, 1.88, .397),
    new THREE.Vector3(.045, 1.885, .39),
    new THREE.Vector3(.09, 1.91, .365)
  ];

  const smileCurve = new THREE.CatmullRomCurve3(smilePoints);

  part(
    new THREE.TubeGeometry(smileCurve, 12, .012, 6, false),
    mat(0x793e3a),
    0, 0, 0
  );

  // CHEEKS
  sphere(-.27, 1.96, .31, .09, .045, .025, mat(0xe9a0a0));
  sphere(.27, 1.96, .31, .09, .045, .025, mat(0xe9a0a0));

  // ARMS
  for (const x of [-.49, .49]) {
    const arm = part(
      new THREE.CapsuleGeometry(.115, .48, 5, 12),
      shirt, x, 1.15, 0
    );

    arm.rotation.z = x < 0 ? -.18 : .18;

    sphere(x * 1.12, .82, .015, .13, .14, .13, skin);
  }

  // HANDS
  for (const x of [-.55, .55]) {
    sphere(x, .77, .03, .11, .12, .11, skin);
  }

  // LEGS
  for (const x of [-.19, .19]) {
    part(
      new THREE.CapsuleGeometry(.14, .40, 5, 12),
      pants, x, .38, 0
    );

    // Shoes
    sphere(x, .09, .12, .18, .10, .27, shoe);
  }

  // GIRL'S DRESS DETAIL
  if (isGirl) {
    const skirt = part(
      new THREE.CylinderGeometry(.32, .52, .48, 24),
      shirt, 0, .75, 0
    );
    skirt.scale.z = .85;

    // Decorative waistline
    sphere(0, .98, .015, .38, .045, .30, shirtLight);
  }

  // Small decorative buttons
  for (const y of [1.32, 1.15]) {
    sphere(0, y, .292, .035, .035, .018, shirtLight);
  }

  g.userData.isGirl = isGirl;
  g.userData.baseScale = 1;

  scene.add(g);
  return g;
}
