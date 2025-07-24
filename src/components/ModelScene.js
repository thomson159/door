import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ModelScene() {
  const mount = useRef(null);
  const rotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const width = mount.current.clientWidth;
    const height = mount.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 0.4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.current.appendChild(renderer.domElement);

    // Światła
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Grupa do rotacji
    const group = new THREE.Group();
    scene.add(group);

    const loader = new GLTFLoader();
    let model;

    loader.load(
      "/models/bullet.glb",
      (gltf) => {
        model = gltf.scene;

        // Wycentrowanie modelu w grupie
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        model.scale.set(1, 1, 1);
        group.add(model);
      },
      undefined,
      (error) => console.error("Błąd ładowania modelu:", error)
    );

    const onMouseDown = (e) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current || !group) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.current.x,
        y: e.clientY - previousMousePosition.current.y,
      };

      rotation.current.z += deltaMove.x * 0.005; // <-- tutaj
      rotation.current.y += deltaMove.x * 0.005;
      rotation.current.x += deltaMove.y * 0.005;

      // ograniczenia
      rotation.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotation.current.x)
      );
      rotation.current.y = rotation.current.y % (2 * Math.PI);
      rotation.current.z = (rotation.current.z + 2 * Math.PI) % (2 * Math.PI);

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    mount.current.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const animate = () => {
      if (group) {
        if (!isDragging.current) {
          group.rotation.x += 0.01;
          group.rotation.y += 0.01;
          group.rotation.z += 0.01; // obrót po skosie
        } else {
          group.rotation.x = rotation.current.x;
          group.rotation.y = rotation.current.y;
          group.rotation.z = rotation.current.z || 0; // dodaj, jeśli chcesz kontrolować z
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mount.current.removeChild(renderer.domElement);
      mount.current.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={mount}
      style={{ width: "100%", height: "600px", cursor: "grab" }}
    />
  );
}
