"use client"

import React, { useEffect, useState, useRef } from "react"
import { Play, Pause, RefreshCw, Layers, ShieldAlert, Cpu, Activity, CheckCircle } from "lucide-react"

// Node data definition
interface NodeItem {
	id: number
	label: string
	// Disorganized coordinates (chaotic, offset)
	chaosX: number
	chaosY: number
	chaosZ: number
	// Organized coordinates (perfect layout)
	cleanX: number
	cleanY: number
	cleanZ: number
}

const PROCESS_NODES: NodeItem[] = [
	{ id: 1, label: "Sourcing",      chaosX: -140, chaosY: -80,  chaosZ: 40,   cleanX: -180, cleanY: -60,  cleanZ: 0 },
	{ id: 2, label: "Logística",     chaosX: -40,  chaosY: 90,   chaosZ: -60,  cleanX: -100, cleanY: -60,  cleanZ: 0 },
	{ id: 3, label: "Validación",    chaosX: 160,  chaosY: -110, chaosZ: 80,   cleanX: -20,  cleanY: -60,  cleanZ: 0 },
	{ id: 4, label: "Inventario",    chaosX: -90,  chaosY: -40,  chaosZ: -100, cleanX: 60,   cleanY: -60,  cleanZ: 0 },
	{ id: 5, label: "Venta Nodal",   chaosX: 110,  chaosY: 80,   chaosZ: 30,   cleanX: 140,  cleanY: -60,  cleanZ: 0 },
	
	{ id: 6, label: "Reserva Agenda", chaosX: -170, chaosY: 100,  chaosZ: 50,   cleanX: -180, cleanY: 60,   cleanZ: 0 },
	{ id: 7, label: "Pasarela Pago", chaosX: 30,   chaosY: -90,  chaosZ: 90,   cleanX: -100, cleanY: 60,   cleanZ: 0 },
	{ id: 8, label: "Split Comisiones", chaosX: 90,  chaosY: 120,  chaosZ: -40,  cleanX: -20,  cleanY: 60,   cleanZ: 0 },
	{ id: 9, label: "Notificación",  chaosX: -10,  chaosY: 30,   chaosZ: 120,  cleanX: 60,   cleanY: 60,   cleanZ: 0 },
	{ id: 10, label: "Despacho Cliente", chaosX: 180, chaosY: 20,   chaosZ: -80,  cleanX: 140,  cleanY: 60,   cleanZ: 0 },
]

// Connection lines between nodes
const CONNECTIONS = [
	{ from: 1, to: 2 },
	{ from: 2, to: 3 },
	{ from: 3, to: 4 },
	{ from: 4, to: 5 },
	{ from: 6, to: 7 },
	{ from: 7, to: 8 },
	{ from: 8, to: 9 },
	{ from: 9, to: 10 },
	// Cross functional connections
	{ from: 3, to: 7 },
	{ from: 5, to: 9 },
]

export default function ProcessVisualization3D() {
	// Progress state: 0 is completely disorganized (chaos), 100 is completely organized (calm/optimized)
	const [progress, setProgress] = useState(0)
	const [autoProgress, setAutoProgress] = useState(true)
	const [cameraYaw, setCameraYaw] = useState(-25)
	const [cameraPitch, setCameraPitch] = useState(48)
	const [cameraDistance, setCameraDistance] = useState(750)
	
	const timerRef = useRef<any>(null)
	const isGrowing = useRef(true)

	// Cycle progress back and forth to show transformation
	useEffect(() => {
		if (!autoProgress) return
		
		const tick = () => {
			setProgress(prev => {
				if (isGrowing.current) {
					if (prev >= 100) {
						isGrowing.current = false
						return 100
					}
					return prev + 1.2
				} else {
					if (prev <= 0) {
						isGrowing.current = true
						return 0
					}
					return prev - 1.2
				}
			})
		}
		
		timerRef.current = setInterval(tick, 45)
		return () => clearInterval(timerRef.current)
	}, [autoProgress])

	// Slow drone-like camera panning
	useEffect(() => {
		let animationId: number
		let t = 0
		
		const animateCamera = () => {
			t += 0.003
			// Gentle drone orbit effect
			setCameraYaw(-25 + Math.sin(t) * 15)
			setCameraPitch(48 + Math.cos(t * 1.5) * 8)
			animationId = requestAnimationFrame(animateCamera)
		}
		
		animationId = requestAnimationFrame(animateCamera)
		return () => cancelAnimationFrame(animationId)
	}, [])

	// Interpolate between chaos and clean positions
	const getNodePos = (node: NodeItem) => {
		const factor = progress / 100
		const x = node.chaosX + (node.cleanX - node.chaosX) * factor
		const y = node.chaosY + (node.cleanY - node.chaosY) * factor
		const z = node.chaosZ + (node.cleanZ - node.chaosZ) * factor
		return { x, y, z }
	}

	return (
		<div className="relative w-full rounded-3xl border border-[#3A2E1C] overflow-hidden flex flex-col"
			style={{
				height: 540,
				background: "radial-gradient(circle at 50% 30%, #1A1208 0%, #0E0A05 80%)",
				boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)"
			}}
		>
			{/* Grid texture overlay (3D Floor) */}
			<div className="absolute inset-0 pointer-events-none opacity-[0.04]"
				style={{
					backgroundImage: "radial-gradient(#C5A96A 1px, transparent 1px)",
					backgroundSize: "24px 24px"
				}}
			/>

			{/* HUD Stats Overlay */}
			<div className="absolute top-5 left-5 z-20 pointer-events-none font-mono text-[9px] text-[#A58953] space-y-2 uppercase tracking-widest bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-[#3A2E1C]/50">
				<div className="flex items-center gap-1.5 text-xs text-white font-semibold">
					<Activity className="w-3.5 h-3.5 text-[#C5A96A] animate-pulse" />
					<span>Monitor Operacional</span>
				</div>
				<div className="h-px bg-[#3A2E1C]/50 my-1" />
				<p>Cam. Drone: <span className="text-white">Active</span></p>
				<p>Perspectiva: <span className="text-white">Isométrica 3D</span></p>
				<p>Frecuencia: <span className="text-white">60Hz</span></p>
				<p>Alineación Nodal: <span className="text-white">{progress.toFixed(0)}%</span></p>
				<p className="flex items-center gap-1">
					Estado: 
					{progress < 25 ? (
						<span className="text-red-500 font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Caos Operativo</span>
					) : progress < 75 ? (
						<span className="text-amber-500 font-bold flex items-center gap-1"><Cpu className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} /> Estructurando</span>
					) : (
						<span className="text-green-500 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Flujo Zen</span>
					)}
				</p>
			</div>

			{/* Interactive control panel */}
			<div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 bg-[#1A1208]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#3A2E1C] shadow-lg">
				<button
					onClick={() => setAutoProgress(!autoProgress)}
					className="p-2 rounded-xl bg-[#2C2416] hover:bg-[#3A2E1C] text-[#C5A96A] transition-all"
					title={autoProgress ? "Pausar Simulación" : "Reanudar Simulación"}
				>
					{autoProgress ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
				</button>
				<button
					onClick={() => {
						setAutoProgress(false)
						setProgress(p => p === 0 ? 100 : 0)
					}}
					className="p-2 rounded-xl bg-[#2C2416] hover:bg-[#3A2E1C] text-[#C5A96A] transition-all flex items-center gap-1.5 text-xs font-semibold px-3"
				>
					<RefreshCw className="w-3.5 h-3.5" /> Transformar
				</button>
				<div className="h-4 w-px bg-[#3A2E1C]" />
				<div className="flex items-center gap-2">
					<span className="text-[10px] text-[#A58953] font-mono">Caos</span>
					<input
						type="range"
						min="0"
						max="100"
						value={progress}
						onChange={(e) => {
							setAutoProgress(false)
							setProgress(Number(e.target.value))
						}}
						className="w-24 accent-[#C5A96A] cursor-pointer"
					/>
					<span className="text-[10px] text-[#A58953] font-mono">Calma</span>
				</div>
			</div>

			{/* 3D Render viewport */}
			<div className="flex-1 w-full flex items-center justify-center"
				style={{
					perspective: 1000,
					perspectiveOrigin: "50% 35%"
				}}
			>
				{/* 3D Coordinate Space */}
				<div
					style={{
						transformStyle: "preserve-3d",
						transform: `translateZ(${-cameraDistance}px) rotateX(${cameraPitch}deg) rotateZ(${cameraYaw}deg)`,
						width: 500,
						height: 500,
						transition: "transform 0.1s linear",
						position: "relative"
					}}
				>
					{/* Floor grid */}
					<div 
						style={{
							position: "absolute",
							inset: -150,
							border: "1px solid rgba(197, 169, 106, 0.08)",
							borderRadius: "40px",
							backgroundImage: `
								linear-gradient(to right, rgba(197, 169, 106, 0.04) 1px, transparent 1px),
								linear-gradient(to bottom, rgba(197, 169, 106, 0.04) 1px, transparent 1px)
							`,
							backgroundSize: "40px 40px",
							transform: "translateZ(-80px)",
							transformStyle: "preserve-3d"
						}}
					>
						{/* Grid decoration borders */}
						<div className="absolute inset-2 border border-dashed border-white/5 rounded-[36px]" />
					</div>

					{/* ── Vector Connection Lines ── */}
					<svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
						{CONNECTIONS.map((c, idx) => {
							const fromNode = PROCESS_NODES.find(n => n.id === c.from)
							const toNode = PROCESS_NODES.find(n => n.id === c.to)
							if (!fromNode || !toNode) return null

							const fromPos = getNodePos(fromNode)
							const toPos = getNodePos(toNode)

							// Calculate intermediate colors
							const factor = progress / 100
							const strokeColor = factor < 0.3 
								? "rgba(239, 68, 68, 0.25)" // Chaotic red
								: factor < 0.7
								? "rgba(245, 158, 11, 0.35)" // Transition amber
								: "rgba(197, 169, 106, 0.5)" // Golden zen
								
							const strokeDash = factor < 0.25 ? "4,4" : "none"

							// 3D positioning of vectors using CSS custom 3D transform projection
							return (
								<line
									key={idx}
									x1={250 + fromPos.x}
									y1={250 + fromPos.y}
									x2={250 + toPos.x}
									y2={250 + toPos.y}
									stroke={strokeColor}
									strokeWidth={factor < 0.5 ? 1.5 : 2}
									strokeDasharray={strokeDash}
									style={{
										transform: `translateZ(${fromPos.z}px)`, // approximations
										transition: "all 0.1s ease",
									}}
								/>
							)
						})}
					</svg>

					{/* Connection flowing particle effects along paths */}
					{progress > 40 && CONNECTIONS.map((c, idx) => {
						const fromNode = PROCESS_NODES.find(n => n.id === c.from)
						const toNode = PROCESS_NODES.find(n => n.id === c.to)
						if (!fromNode || !toNode) return null

						const fromPos = getNodePos(fromNode)
						const toPos = getNodePos(toNode)

						return (
							<div
								key={`particle-${idx}`}
								className="absolute w-1.5 h-1.5 rounded-full bg-[#C5A96A] blur-[1px] pointer-events-none"
								style={{
									left: "50%",
									top: "50%",
									boxShadow: "0 0 8px #C5A96A, 0 0 16px #C5A96A",
									animation: `flowParticle-${idx} 3s linear infinite`,
									transformStyle: "preserve-3d",
								}}
							/>
						)
					})}

					{/* ── Nodal Data Points ── */}
					{PROCESS_NODES.map((node) => {
						const pos = getNodePos(node)
						
						// Node styling based on chaos factor
						const factor = progress / 100
						const isChaotic = factor < 0.3
						
						const nodeColor = factor < 0.3 
							? "rgba(239, 68, 68, 0.95)" // Red
							: factor < 0.7
							? "rgba(245, 158, 11, 0.95)" // Amber
							: "rgba(197, 169, 106, 0.95)" // Golden Warm

						const glowShadow = factor < 0.3
							? "0 0 15px rgba(239, 68, 68, 0.5)"
							: factor < 0.7
							? "0 0 20px rgba(245, 158, 11, 0.5)"
							: "0 0 25px rgba(197, 169, 106, 0.6)"

						return (
							<div
								key={node.id}
								style={{
									position: "absolute",
									width: 80,
									height: 40,
									left: "50%",
									top: "50%",
									marginLeft: -40,
									marginTop: -20,
									transform: `translateX(${pos.x}px) translateY(${pos.y}px) translateZ(${pos.z}px)`,
									transformStyle: "preserve-3d",
									transition: "transform 0.1s linear",
								}}
							>
								{/* Node Box card */}
								<div
									className="w-full h-full rounded-xl flex flex-col items-center justify-center p-1.5 border transition-all text-center relative"
									style={{
										background: factor < 0.3 
											? "rgba(30, 10, 10, 0.85)" 
											: "rgba(25, 20, 15, 0.85)",
										borderColor: factor < 0.3 
											? "rgba(239, 68, 68, 0.4)" 
											: factor < 0.7
											? "rgba(245, 158, 11, 0.4)"
											: "rgba(197, 169, 106, 0.4)",
										boxShadow: `${glowShadow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
										backdropFilter: "blur(8px)",
										animation: isChaotic ? "jitter 0.4s ease infinite alternate" : "none",
									}}
								>
									{/* Top indicator dot */}
									<div 
										className="w-2 h-2 rounded-full absolute -top-1 left-1/2 -ml-1 border border-black"
										style={{ 
											background: nodeColor,
											boxShadow: `0 0 8px ${nodeColor}` 
										}}
									/>

									{/* Label */}
									<span className="text-[9px] font-bold text-white tracking-wide uppercase select-none line-clamp-1">
										{node.label}
									</span>
									
									{/* Status readout */}
									<span 
										className="text-[7px] font-mono select-none"
										style={{ color: factor < 0.3 ? "#EF4444" : factor < 0.7 ? "#F59E0B" : "#C5A96A" }}
									>
										{factor < 0.3 ? "ERROR_DISP" : factor < 0.7 ? "ALIGNING" : "OPTIMIZED"}
									</span>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* Footnote instruction */}
			<div className="absolute bottom-5 left-5 pointer-events-none">
				<p className="text-[9px] font-sans text-[#8A7D6E] tracking-wide italic">
					Arrastra el control para ver la transición de "Caos" a "Calma".
				</p>
			</div>

			{/* Inline dynamic styles for particles and animation keyframes */}
			<style>{`
				@keyframes jitter {
					0% { transform: translate(1px, 1px) rotate(0deg); }
					10% { transform: translate(-1px, -1px) rotate(-1deg); }
					20% { transform: translate(-2px, 0px) rotate(1deg); }
					30% { transform: translate(0px, 2px) rotate(0deg); }
					40% { transform: translate(1px, -1px) rotate(1deg); }
					50% { transform: translate(-1px, 2px) rotate(-1deg); }
					60% { transform: translate(-2px, 1px) rotate(0deg); }
					70% { transform: translate(2px, 1px) rotate(-1deg); }
					80% { transform: translate(-1px, -1px) rotate(1deg); }
					90% { transform: translate(2px, 2px) rotate(0deg); }
					100% { transform: translate(1px, -2px) rotate(-1deg); }
				}
				
				/* Dynamically generated particles travel animations along path vectors */
				${CONNECTIONS.map((c, idx) => {
					const fromNode = PROCESS_NODES.find(n => n.id === c.from)
					const toNode = PROCESS_NODES.find(n => n.id === c.to)
					if (!fromNode || !toNode) return ""
					
					const fromPos = getNodePos(fromNode)
					const toPos = getNodePos(toNode)
					
					return `
						@keyframes flowParticle-${idx} {
							0% {
								transform: translateX(${fromPos.x}px) translateY(${fromPos.y}px) translateZ(${fromPos.z}px);
								opacity: 0;
							}
							15% {
								opacity: 1;
							}
							85% {
								opacity: 1;
							}
							100% {
								transform: translateX(${toPos.x}px) translateY(${toPos.y}px) translateZ(${toPos.z}px);
								opacity: 0;
							}
						}
					`
				}).join("\n")}
			`}</style>
		</div>
	)
}
