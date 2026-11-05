
export function addWorldDetails(THREE, scene) {
  const mat = (color, roughness = 0.9) =>
    new THREE.MeshStandardMaterial({ color, roughness });

  function add(geometry, material, x, y, z, parent = scene) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  function box(x, y, z, sx, sy, sz, color) {
    return add(
      new THREE.BoxGeometry(sx, sy, sz),
      mat(color), x, y, z
    );
  }

  function sphere(x, y, z, sx, sy, sz, color) {
    const o = add(
      new THREE.SphereGeometry(1, 20, 16),
      mat(color), x, y, z
    );
    o.scale.set(sx, sy, sz);
    return o;
  }

  // STONE WALKWAY TO THE HOUSE
  for (let i = 0; i < 13; i++) {
    const z = 0.5 + i * 0.85;
    const x = Math.sin(i * 0.35) * 0.5;

    const stone = add(
      new THREE.CylinderGeometry(.42, .46, .10, 8),
      mat(0xb8b4a8),
      x, .01, z
    );
    stone.rotation.y = i * .3;
  }

  // FLOWER GARDENS
  for (let side of [-1, 1]) {
    for (let i = 0; i < 9; i++) {
      const x = side * (5 + Math.random() * 2);
      const z = -3 + i * 1.35;

      sphere(x, .18, z, .32, .18, .32, 0x438d48);

      const colors = [
        0xf4a6c4, 0xffd65b, 0xffffff, 0xb99be9
      ];

      for (let j = 0; j < 3; j++) {
        const flowerX = x + (Math.random() - .5) * .35;
        const flowerZ = z + (Math.random() - .5) * .35;

        add(
          new THREE.SphereGeometry(.12, 12, 10),
          mat(colors[(i + j) % colors.length]),
          flowerX, .48 + Math.random() * .15, flowerZ
        );
      }
    }
  }

  // SMALL POND
  const pond = add(
    new THREE.CylinderGeometry(2.1, 2.1, .12, 40),
    mat(0x64b9d4, .2),
    7, .02, 3
  );
  pond.scale.z = .8;

  const pondEdge = add(
    new THREE.TorusGeometry(2.1, .16, 8, 40),
    mat(0xaaa18a),
    7, .12, 3
  );
  pondEdge.rotation.x = Math.PI / 2;
  pondEdge.scale.z = .8;

  // BENCH
  const bench = new THREE.Group();
  scene.add(bench);
  bench.position.set(-6, 0, 3);

  function benchBox(x, y, z, sx, sy, sz, color) {
    return box(x - 6, y, z + 3, sx, sy, sz, color);
  }

  benchBox(0, .65, 0, 2, .18, .65, 0x98623b);
  benchBox(0, 1.15, -.25, 2, 1, .16, 0x98623b);
  benchBox(-.75, .3, 0, .14, .6, .14, 0x65432e);
  benchBox(.75, .3, 0, .14, .6, .14, 0x65432e);

  // GARDEN LAMP POSTS
  for (let side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const x = side * 4.5;
      const z = i * 3 - 1;

      add(
        new THREE.CylinderGeometry(.055, .075, 1.8, 10),
        mat(0x51483c),
        x, .9, z
      );

      sphere(x, 1.95, z, .22, .22, .22, 0xffe5a0);
    }
  }

  // DECORATIVE ROCKS
  for (let i = 0; i < 18; i++) {
    const x = (Math.random() - .5) * 22;
    const z = (Math.random() - .5) * 22;

    if (Math.abs(x) > 8 || Math.abs(z) > 8) {
      const rock = sphere(
        x, .15, z,
        .25 + Math.random() * .3,
        .18,
        .25 + Math.random() * .3,
        0x898c80
      );
      rock.rotation.y = Math.random() * Math.PI;
    }
  }

  // EXTRA BUSHES
  for (let i = 0; i < 16; i++) {
    const x = (Math.random() - .5) * 24;
    const z = (Math.random() - .5) * 24;

    if (Math.abs(x) > 7 || Math.abs(z) > 7) {
      sphere(
        x, .5, z,
        .55, .55, .55,
        i % 2 ? 0x43894a : 0x5b9b53
      );
    }
  }
}
