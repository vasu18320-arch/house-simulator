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

  function sphere(x, y, z, sx, sy, sz, color) {
    const o = add(
      new THREE.SphereGeometry(1, 20, 16),
      mat(color), x, y, z
    );
    o.scale.set(sx, sy, sz);
    return o;
  }

  function box(x, y, z, sx, sy, sz, color) {
    return add(
      new THREE.BoxGeometry(sx, sy, sz),
      mat(color), x, y, z
    );
  }

  // MOUNTAIN FOREST TREES
  function pineTree(x, z, size = 1) {
    const trunk = add(
      new THREE.CylinderGeometry(.09 * size, .15 * size, 1.2 * size, 8),
      mat(0x68452e), x, .6 * size, z
    );

    for (let i = 0; i < 3; i++) {
      add(
        new THREE.ConeGeometry(
          (1.0 - i * .18) * size,
          1.5 * size,
          8
        ),
        mat(i % 2 ? 0x285b3d : 0x34764a),
        x, (1.35 + i * .65) * size, z
      );
    }
  }

  // STONE WALKWAY
  for (let i = 0; i < 18; i++) {
    const z = .5 + i * .75;
    const x = Math.sin(i * .3) * .5;

    const stone = add(
      new THREE.CylinderGeometry(.42, .46, .10, 8),
      mat(0xb8b4a8), x, .01, z
    );
    stone.rotation.y = i * .3;
  }

  // FLOWER GARDENS
  for (const side of [-1, 1]) {
    for (let i = 0; i < 10; i++) {
      const x = side * (5 + Math.random() * 2);
      const z = -4 + i * 1.3;

      sphere(x, .18, z, .35, .18, .35, 0x438d48);

      for (let j = 0; j < 3; j++) {
        sphere(
          x + (Math.random() - .5) * .35,
          .45 + Math.random() * .12,
          z + (Math.random() - .5) * .35,
          .12, .12, .12,
          [0xf4a6c4, 0xffd65b, 0xffffff][j]
        );
      }
    }
  }

  // POND
  const pond = add(
    new THREE.CylinderGeometry(2.1, 2.1, .12, 40),
    mat(0x64b9d4, .2), 7, .02, 3
  );
  pond.scale.z = .8;

  const edge = add(
    new THREE.TorusGeometry(2.1, .16, 8, 40),
    mat(0xaaa18a), 7, .12, 3
  );
  edge.rotation.x = Math.PI / 2;
  edge.scale.z = .8;

  // BENCH
  const bench = new THREE.Group();
  scene.add(bench);
  bench.position.set(-6, 0, 3);

  box(-6, .65, 3, 2, .18, .65, 0x98623b);
  box(-6, 1.15, 2.75, 2, 1, .16, 0x98623b);
  box(-6.75, .3, 3, .14, .6, .14, 0x65432e);
  box(-5.25, .3, 3, .14, .6, .14, 0x65432e);

  // GARDEN LAMPS
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const x = side * 4.5;
      const z = i * 3 - 1;

      add(
        new THREE.CylinderGeometry(.055, .075, 1.8, 10),
        mat(0x51483c), x, .9, z
      );

      sphere(x, 1.95, z, .22, .22, .22, 0xffe5a0);
    }
  }

  // PINE FOREST ON BOTH SIDES
  for (let i = 0; i < 48; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const x = side * (11 + Math.random() * 22);
    const z = -20 + Math.random() * 42;

    pineTree(x, z, .8 + Math.random() * 1.5);
  }

  // DISTANT FORESTED HILLS
  for (let i = 0; i < 15; i++) {
    const x = (i - 7) * 10;

    sphere(
      x, 3, -38,
      9, 5 + Math.random() * 3, 5,
      i % 2 ? 0x668d75 : 0x779b80
    );
  }

  // SMALL ROCKS
  for (let i = 0; i < 22; i++) {
    const x = (Math.random() - .5) * 25;
    const z = (Math.random() - .5) * 25;

    if (Math.abs(x) > 8 || Math.abs(z) > 8) {
      const rock = sphere(
        x, .15, z,
        .3 + Math.random() * .3,
        .18,
        .3 + Math.random() * .3,
        0x898c80
      );
      rock.rotation.y = Math.random() * Math.PI;
    }
  }
}
