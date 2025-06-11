import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Folder {
  id: number;
  name: string;
  url?: string;
}

interface Props {
  folders: Folder[];
}

const FibonacciLinks: preact.FunctionComponent<Props> = ({ folders }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, 600);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const nodes: THREE.Mesh[] = [];
    const goldenAngle = Math.PI * 2 * (1 - 1 / 1.61803398875);
    const radiusScale = 0.5;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    folders.forEach((folder, i) => {
      const theta = i * goldenAngle;
      const radius = radiusScale * Math.sqrt(i + 1);
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = i * 0.1;

      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00,
        shininess: 100
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      sphere.userData = { 
        name: folder.name, 
        url: folder.url || `https://example.com/folder/${folder.id}` 
      };
      scene.add(sphere);
      nodes.push(sphere);

      // Add line to previous node
      if (i > 0) {
        const prevNode = nodes[i - 1];
        const points = [];
        points.push(new THREE.Vector3(prevNode.position.x, prevNode.position.y, prevNode.position.z));
        points.push(new THREE.Vector3(x, y, z));
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }
    });

    camera.position.z = 10;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      if (!mountRef.current) return;
      
      event.preventDefault();
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes);

      if (intersects.length > 0) {
        const node = intersects[0].object as THREE.Mesh & { 
          userData: { name: string; url: string } 
        };
        window.open(node.userData.url, '_blank');
      }
    };

    mountRef.current.addEventListener('click', onClick);

    const onResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / 600;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, 600);
    };

    window.addEventListener('resize', onResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      mountRef.current?.removeEventListener('click', onClick);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [folders]);

  return <div className="fibonacci-container" ref={mountRef} style={{ width: '100%', height: '600px' }} />;
};

export default FibonacciLinks;
