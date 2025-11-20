const hslToHex = ({h, s, l}) => {
	s /= 100
	l /= 100
	const k = n => (n + h / 30) % 12
	const a = s * Math.min(l, 1 - l)
	const f = n => {
		const v = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
		return Math.round(255 * v).toString(16).padStart(2, '0')
	}
	return `#${f(0)}${f(8)}${f(4)}`
}

const randomHue = () => Math.random() * 360

const randomLightness = (min, max) => Math.random() * (max - min) + min

const adjustLightness = (hex, diff) => {
	const h = hexToHsl(hex)
	h.l = Math.max(0, Math.min(100, h.l + diff))
	return hslToHex(h)
}

// Hex → HSL
const hexToHsl = hex => {
	const r = parseInt(hex.slice(1, 3), 16) / 255
	const g = parseInt(hex.slice(3, 5), 16) / 255
	const b = parseInt(hex.slice(5, 7), 16) / 255
	const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min

	let h = 0
	if (d) {
		if (max === r) h = ((g - b) / d) % 6
		else if (max === g) h = (b - r) / d + 2
		else h = (r - g) / d + 4
		h = Math.round(h * 60)
		if (h < 0) h += 360
	}
	const l = (max + min) / 2
	const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))

	return {h, s: s * 100, l: l * 100}
}

document.addEventListener('DOMContentLoaded', () => {
	const root = document.documentElement

	// hors arc-en-ciel
	const clr1 = hslToHex({h: randomHue(), s: 30, l: randomLightness(92, 95)})
	const clr6 = hslToHex({h: randomHue(), s: 20, l: randomLightness(15, 30)})

	// arc-en-ciel
	const baseHue = randomHue()
	const gap = 45
	const sat = 90
	const minL = 65, maxL = 80   // lumière plus haute = couleurs plus lisibles

	const clr2 = hslToHex({h: baseHue, s: sat, l: randomLightness(minL, maxL)})
	const clr3 = hslToHex({h: (baseHue + gap) % 360, s: sat, l: randomLightness(minL, maxL)})
	const clr4 = hslToHex({h: (baseHue + gap * 2) % 360, s: sat, l: randomLightness(minL, maxL)})
	const clr5 = hslToHex({h: (baseHue + gap * 3) % 360, s: sat, l: randomLightness(minL, maxL)})

	// debug
	document.body.innerHTML += `<p style="font-size:.6em;opacity:.5;text-align:center;">
		$clr1: ${clr1}; $clr2: ${clr2}; $clr3: ${clr3}; $clr4: ${clr4}; $clr5: ${clr5}; $clr6: ${clr6}
	</p>`

	root.style.setProperty('--clr1', clr1)
	root.style.setProperty('--clr2', clr2)
	root.style.setProperty('--clr3', clr3)
	root.style.setProperty('--clr4', clr4)
	root.style.setProperty('--clr5', clr5)
	root.style.setProperty('--clr6', clr6)

	root.style.setProperty('--clr-bg', adjustLightness(clr2, 15))
	root.style.setProperty('--clr-text', adjustLightness(clr6, -5))
})
