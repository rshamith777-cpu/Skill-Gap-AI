import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface SkillNodeData {
  id: string;
  name: string;
  category: string;
  state: "CURRENT" | "REQUIRED" | "GAP";
  roleRelevance: string;
  pos: [number, number, number];
  size: number;
}

const NODES_DATA: SkillNodeData[] = [
  {
    id: "core",
    name: "ML CORE",
    category: "Architecture",
    state: "CURRENT",
    roleRelevance: "Central Latent Feature Representation",
    pos: [0, 0, 0],
    size: 1.5,
  },
  {
    id: "python",
    name: "Python",
    category: "Language",
    state: "CURRENT",
    roleRelevance: "Primary Language & Scientific Compute",
    pos: [-2.8, 1.4, 1.1],
    size: 1.1,
  },
  {
    id: "sql",
    name: "SQL",
    category: "Data",
    state: "CURRENT",
    roleRelevance: "Relational Querying & Feature Store",
    pos: [-1.8, -2.2, 0.8],
    size: 0.95,
  },
  {
    id: "stats",
    name: "Statistics",
    category: "Math",
    state: "REQUIRED",
    roleRelevance: "Hypothesis Testing & Variance Analysis",
    pos: [2.2, 2.1, -0.6],
    size: 1.0,
  },
  {
    id: "ml",
    name: "Machine Learning",
    category: "Algorithms",
    state: "REQUIRED",
    roleRelevance: "Supervised & Unsupervised Modeling",
    pos: [2.9, 0.2, 1.2],
    size: 1.2,
  },
  {
    id: "dl",
    name: "Deep Learning",
    category: "Neural",
    state: "GAP",
    roleRelevance: "Backpropagation & Neural Architectures",
    pos: [1.4, -2.6, -1.1],
    size: 1.1,
  },
  {
    id: "nlp",
    name: "NLP",
    category: "Domain",
    state: "GAP",
    roleRelevance: "Transformers & Text Feature Mining",
    pos: [-2.7, 0.1, -2.0],
    size: 1.0,
  },
  {
    id: "cloud",
    name: "Cloud",
    category: "Infrastructure",
    state: "GAP",
    roleRelevance: "Model Deployment & Compute Scaling",
    pos: [0.3, 3.1, -1.3],
    size: 0.95,
  },
  {
    id: "git",
    name: "Git",
    category: "DevOps",
    state: "CURRENT",
    roleRelevance: "Model & Code Versioning Control",
    pos: [-0.6, -3.2, 1.6],
    size: 0.85,
  },
  {
    id: "dsa",
    name: "Data Structures",
    category: "Computer Science",
    state: "CURRENT",
    roleRelevance: "Computational Complexity & Optimization",
    pos: [2.5, -1.1, 2.2],
    size: 0.9,
  },
];

export const ThreeSkillVector: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNodeData | null>(NODES_DATA[4]); // default ML node
  const [hoveredNode, setHoveredNode] = useState<SkillNodeData | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 550;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group holding entire network
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 20);
    pointLight.position.set(2, 4, 6);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0x818cf8, 2, 20);
    secondaryLight.position.set(-4, -3, 4);
    scene.add(secondaryLight);

    // Materials based on status
    const getMaterial = (state: "CURRENT" | "REQUIRED" | "GAP", isCenter = false) => {
      if (isCenter) {
        return new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.7,
          roughness: 0.2,
          metalness: 0.8,
        });
      }
      switch (state) {
        case "CURRENT":
          return new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x059669,
            emissiveIntensity: 0.45,
            roughness: 0.3,
            metalness: 0.6,
          });
        case "REQUIRED":
          return new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.6,
          });
        case "GAP":
          return new THREE.MeshStandardMaterial({
            color: 0xf43f5e,
            emissive: 0xe11d48,
            emissiveIntensity: 0.65,
            roughness: 0.2,
            metalness: 0.7,
            wireframe: false,
          });
      }
    };

    // Node Meshes & Hit Targets
    const nodeMeshes: { mesh: THREE.Mesh; data: SkillNodeData }[] = [];

    NODES_DATA.forEach((data) => {
      const isCore = data.id === "core";
      const geometry = isCore
        ? new THREE.IcosahedronGeometry(data.size * 0.55, 2)
        : data.state === "GAP"
        ? new THREE.OctahedronGeometry(data.size * 0.42, 1)
        : new THREE.SphereGeometry(data.size * 0.4, 24, 24);

      const mat = getMaterial(data.state, isCore);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(...data.pos);
      networkGroup.add(mesh);

      // Outer wire glow ring for GAP nodes
      if (data.state === "GAP") {
        const ringGeo = new THREE.RingGeometry(data.size * 0.5, data.size * 0.56, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xfb7185,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(...data.pos);
        networkGroup.add(ringMesh);
      }

      nodeMeshes.push({ mesh, data });
    });

    // Connecting Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
    });

    const coreNode = NODES_DATA.find((n) => n.id === "core")!;
    NODES_DATA.forEach((n) => {
      if (n.id !== "core") {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...coreNode.pos),
          new THREE.Vector3(...n.pos),
        ]);
        const line = new THREE.Line(lineGeo, lineMat);
        networkGroup.add(line);
      }
    });

    // Inter-node secondary relationships
    const interPairs = [
      ["python", "ml"],
      ["python", "sql"],
      ["stats", "ml"],
      ["ml", "dl"],
      ["dl", "nlp"],
      ["cloud", "git"],
      ["dsa", "python"],
    ];
    interPairs.forEach(([idA, idB]) => {
      const nA = NODES_DATA.find((n) => n.id === idA);
      const nB = NODES_DATA.find((n) => n.id === idB);
      if (nA && nB) {
        const interMat = new THREE.LineBasicMaterial({
          color: 0x818cf8,
          transparent: true,
          opacity: 0.16,
        });
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...nA.pos),
          new THREE.Vector3(...nB.pos),
        ]);
        networkGroup.add(new THREE.Line(lineGeo, interMat));
      }
    });

    // Raycaster & Mouse tracking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        networkGroup.rotation.y += deltaX * 0.006;
        networkGroup.rotation.x += deltaY * 0.006;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      // Click detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((m) => m.mesh));
      if (intersects.length > 0) {
        const hit = nodeMeshes.find((m) => m.mesh === intersects[0].object);
        if (hit) {
          setSelectedNode(hit.data);
        }
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousemove", onPointerMove);
    domElement.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Slow organic rotation
      if (!isDragging) {
        networkGroup.rotation.y += 0.0025;
        networkGroup.rotation.x += 0.0008;
      }

      // Raycast hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((m) => m.mesh));
      if (intersects.length > 0) {
        const hit = nodeMeshes.find((m) => m.mesh === intersects[0].object);
        if (hit) {
          domElement.style.cursor = "pointer";
          setHoveredNode(hit.data);
        }
      } else {
        domElement.style.cursor = "grab";
        setHoveredNode(null);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", onPointerUp);
      domElement.removeEventListener("mousemove", onPointerMove);
      domElement.removeEventListener("mousedown", onPointerDown);
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[540px] flex items-center justify-center select-none">
      {/* Three.js canvas container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Glass Node Info Card */}
      {selectedNode && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 backdrop-blur-xl bg-slate-950/75 border border-cyan-500/30 rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-left max-w-[240px] sm:max-w-[270px] transition-all duration-300 pointer-events-auto">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
            <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-bold">
              ML SKILL VECTOR
            </span>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                selectedNode.state === "CURRENT"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : selectedNode.state === "REQUIRED"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              }`}
            >
              {selectedNode.state}
            </span>
          </div>

          <div className="text-base font-extrabold text-white tracking-tight mb-1">
            {selectedNode.name}
          </div>

          <div className="text-[11px] text-slate-300 leading-snug mb-2.5">
            {selectedNode.roleRelevance}
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-white/5">
            <span>CATEGORY:</span>
            <span className="text-slate-200">{selectedNode.category}</span>
          </div>
        </div>
      )}

      {/* Legend & 3D interaction tip */}
      <div className="absolute bottom-2 right-4 sm:bottom-4 sm:right-6 z-20 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 backdrop-blur-md bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/10">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          CURRENT
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          REQUIRED
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185]" />
          GAP
        </span>
        <span className="hidden sm:inline text-slate-500">&bull; Drag to orbit</span>
      </div>
    </div>
  );
};
