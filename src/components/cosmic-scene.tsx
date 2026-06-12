import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CosmicScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, 3),
      new THREE.MeshBasicMaterial({ color: 0xc77dff, wireframe: true, transparent: true, opacity: 0.34 }),
    );
    group.add(core);

    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.065, 12, 12);
    for (let i = 0; i < 26; i += 1) {
      const node = new THREE.Mesh(
        nodeGeometry,
        new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? 0xff4d6d : 0xd8a8ff }),
      );
      const phi = Math.acos(-1 + (2 * i) / 26);
      const theta = Math.sqrt(26 * Math.PI) * phi;
      node.position.setFromSphericalCoords(1.7 + (i % 3) * 0.14, phi, theta);
      nodes.push(node);
      group.add(node);
    }

    const linePoints: THREE.Vector3[] = [];
    nodes.forEach((node, index) => {
      linePoints.push(node.position, nodes[(index * 7 + 3) % nodes.length].position);
    });
    const lines = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(linePoints),
      new THREE.LineBasicMaterial({ color: 0xb15eff, transparent: true, opacity: 0.18 }),
    );
    group.add(lines);

    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(600 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 9;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0xd8a8ff, size: 0.018, transparent: true, opacity: 0.6 })));

    let mouseX = 0;
    let mouseY = 0;
    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.6;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.6;
    };
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);
    const animate = () => {
      frame = requestAnimationFrame(animate);
      group.rotation.y += 0.0025;
      group.rotation.x += (mouseY - group.rotation.x) * 0.018;
      group.rotation.y += (mouseX - group.rotation.y * 0.1) * 0.004;
      core.scale.setScalar(1 + Math.sin(Date.now() * 0.0015) * 0.025);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}