"use client"

import React, { useEffect, useRef, useState } from "react"

const PRODUCTS = [
	{ emoji: "🕯️", name: "Vela Soja",       price: "$19" },
	{ emoji: "🪨", name: "Sal Himalaya",     price: "$39" },
	{ emoji: "🍃", name: "Difusor Bambú",    price: "$35" },
	{ emoji: "🌸", name: "Quemador Cascada", price: "$25" },
	{ emoji: "🛋️", name: "Zafu Meditación", price: "$49" },
	{ emoji: "💻", name: "Soporte Laptop",   price: "$55" },
	{ emoji: "🌿", name: "Roller Cuarzo",    price: "$22" },
	{ emoji: "🚿", name: "Dispensador Mármol", price: "$28" },
]

const ORBS = [
	{ size: 6,  x: 15,  y: 20,  delay: 0,   dur: 8  },
	{ size: 4,  x: 75,  y: 15,  delay: 1.5, dur: 10 },
	{ size: 8,  x: 85,  y: 60,  delay: 0.8, dur: 7  },
	{ size: 3,  x: 10,  y: 70,  delay: 2.2, dur: 12 },
	{ size: 5,  x: 50,  y: 85,  delay: 0.4, dur: 9  },
	{ size: 3,  x: 90,  y: 30,  delay: 3,   dur: 11 },
]

export default function Scene3D() {
	const sceneRef  = useRef<HTMLDivElement>(null)
	const [rotY, setRotY]   = useState(0)
	const [rotX, setRotX]   = useState(-8)
	const [drag, setDrag]   = useState<{ x: number; y: number } | null>(null)
	const [auto, setAuto]   = useState(true)
	const rafRef    = useRef<number>()
	const startRot  = useRef({ rotX: -8, rotY: 0 })

	// Auto-rotation
	useEffect(() => {
		if (!auto) return
		let t = 0
		const tick = () => {
			t += 0.3
			setRotY(t)
			rafRef.current = requestAnimationFrame(tick)
		}
		rafRef.current = requestAnimationFrame(tick)
		return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
	}, [auto])

	// Mouse drag to rotate
	const onMouseDown = (e: React.MouseEvent) => {
		setAuto(false)
		setDrag({ x: e.clientX, y: e.clientY })
		startRot.current = { rotX, rotY }
	}
	const onMouseMove = (e: React.MouseEvent) => {
		if (!drag) return
		const dx = e.clientX - drag.x
		const dy = e.clientY - drag.y
		setRotY(startRot.current.rotY + dx * 0.5)
		setRotX(Math.max(-30, Math.min(20, startRot.current.rotX - dy * 0.3)))
	}
	const onMouseUp = () => setDrag(null)

	// Touch drag
	const onTouchStart = (e: React.TouchEvent) => {
		setAuto(false)
		setDrag({ x: e.touches[0].clientX, y: e.touches[0].clientY })
		startRot.current = { rotX, rotY }
	}
	const onTouchMove = (e: React.TouchEvent) => {
		if (!drag) return
		const dx = e.touches[0].clientX - drag.x
		const dy = e.touches[0].clientY - drag.y
		setRotY(startRot.current.rotY + dx * 0.5)
		setRotX(Math.max(-30, Math.min(20, startRot.current.rotX - dy * 0.3)))
	}

	const n = PRODUCTS.length
	const ringRadius = 200

	return (
		<div
			className="relative w-full select-none overflow-hidden"
			style={{ height: 480, background: "linear-gradient(160deg, #1A1208 0%, #2C2416 40%, #3A2E1C 100%)" }}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			onMouseLeave={onMouseUp}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={() => setDrag(null)}
			ref={sceneRef}
		>
			{/* Ambient bokeh orbs */}
			{ORBS.map((orb, i) => (
				<div
					key={i}
					className="absolute rounded-full pointer-events-none"
					style={{
						width:  orb.size * 8,
						height: orb.size * 8,
						left:   `${orb.x}%`,
						top:    `${orb.y}%`,
						background: i % 3 === 0
							? "radial-gradient(circle, rgba(180,140,80,0.35) 0%, transparent 70%)"
							: i % 3 === 1
							? "radial-gradient(circle, rgba(140,100,60,0.25) 0%, transparent 70%)"
							: "radial-gradient(circle, rgba(220,180,120,0.2) 0%, transparent 70%)",
						filter: "blur(8px)",
						animation: `floatOrb ${orb.dur}s ease-in-out ${orb.delay}s infinite alternate`,
					}}
				/>
			))}

			{/* Grain texture overlay */}
			<div className="absolute inset-0 pointer-events-none opacity-[0.03]"
				style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px" }}
			/>

			{/* 3D Scene container */}
			<div
				className="absolute inset-0 flex items-center justify-center"
				style={{ perspective: 900, perspectiveOrigin: "50% 45%" }}
			>
				<div
					style={{
						width: ringRadius * 2 + 120,
						height: ringRadius * 2 + 120,
						transformStyle: "preserve-3d",
						transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
						transition: drag ? "none" : "transform 0.05s linear",
						cursor: drag ? "grabbing" : "grab",
					}}
				>
					{/* ── Outer spinning ring (decoration) */}
					<div style={{
						position: "absolute", inset: 0, borderRadius: "50%",
						border: "1px solid rgba(180,140,60,0.2)",
						transformStyle: "preserve-3d",
						transform: "rotateX(90deg)",
					}} />
					<div style={{
						position: "absolute", inset: 20, borderRadius: "50%",
						border: "1px dashed rgba(180,140,60,0.12)",
						transformStyle: "preserve-3d",
						transform: "rotateX(90deg)",
					}} />

					{/* ── Product cards ring */}
					{PRODUCTS.map((p, i) => {
						const angle = (360 / n) * i
						const rad   = (angle * Math.PI) / 180
						const x     = Math.sin(rad) * ringRadius
						const z     = Math.cos(rad) * ringRadius
						return (
							<div
								key={i}
								style={{
									position: "absolute",
									width: 110,
									height: 130,
									left: "50%",
									top:  "50%",
									marginLeft: -55,
									marginTop:  -65,
									transform:  `translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)`,
									transformStyle: "preserve-3d",
								}}
							>
								<div
									className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all"
									style={{
										background:  "rgba(250,246,240,0.07)",
										backdropFilter: "blur(10px)",
										border: "1px solid rgba(200,170,100,0.2)",
										boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
									}}
								>
									<span style={{ fontSize: 32 }}>{p.emoji}</span>
									<span style={{ fontSize: 10, color: "#C5A96A", fontWeight: 600, letterSpacing: "0.08em", textAlign: "center", lineHeight: 1.2, padding: "0 4px" }}>
										{p.name}
									</span>
									<span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "serif" }}>{p.price}</span>
								</div>
							</div>
						)
					})}

					{/* ── Central orb */}
					<div style={{
						position: "absolute", width: 100, height: 100,
						left: "50%", top: "50%",
						marginLeft: -50, marginTop: -50,
						borderRadius: "50%",
						background: "radial-gradient(circle at 35% 35%, rgba(220,185,120,0.9) 0%, rgba(140,100,50,0.6) 50%, rgba(60,40,20,0.3) 100%)",
						boxShadow: "0 0 60px rgba(200,160,80,0.5), 0 0 120px rgba(180,130,60,0.2), inset 0 0 30px rgba(255,220,150,0.2)",
						border: "1px solid rgba(220,185,120,0.4)",
					}} />

					{/* Glint on orb */}
					<div style={{
						position: "absolute", width: 28, height: 18,
						left: "50%", top: "50%",
						marginLeft: -36, marginTop: -42,
						borderRadius: "50%",
						background: "rgba(255,248,220,0.5)",
						filter: "blur(4px)",
					}} />

					{/* ── Inner vertical ring */}
					<div style={{
						position: "absolute", inset: "25%",
						borderRadius: "50%",
						border: "1px solid rgba(200,160,80,0.15)",
						transformStyle: "preserve-3d",
					}} />
				</div>
			</div>

			{/* Text overlay */}
			<div className="absolute bottom-0 left-0 right-0 text-center pb-5 pointer-events-none">
				<p style={{ color: "rgba(200,170,100,0.7)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
					{auto ? "Arrastra para rotar · " : ""}{n} productos · Ámbitos
				</p>
			</div>

			{/* Auto-rotate toggle */}
			<button
				onClick={() => setAuto(a => !a)}
				className="absolute top-3 right-4 text-[10px] px-3 py-1.5 rounded-full border transition-all"
				style={{
					color: "rgba(200,170,100,0.8)", borderColor: "rgba(200,170,100,0.3)",
					background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)",
				}}
			>
				{auto ? "⏸ Pausar" : "▶ Girar"}
			</button>

			<style>{`
				@keyframes floatOrb {
					from { transform: translateY(0px) scale(1); opacity: 0.6; }
					to   { transform: translateY(-20px) scale(1.15); opacity: 1; }
				}
			`}</style>
		</div>
	)
}
