# Design System Master File

> **LOGIC:** Page overrides in `design-system/jpbuidang/pages/[page].md` win over this file.

---

**Project:** JPBuiDang  
**Style:** Ultra Minimal — 1 brand color + neutrals  
**Primary:** `rgb(35, 45, 108)` / `#232D6C`

---

## Palette (only these)

| Role | Hex | Token |
|------|-----|-------|
| Primary | `#232D6C` | `--jp-primary` |
| Primary hover | `#1A2254` | `--jp-primary-hover` |
| Ink | `#111827` | `--jp-ink` |
| Muted | `#6B7280` | `--jp-muted` |
| Border | `#E5E7EB` | `--jp-border` |
| Paper | `#F9FAFB` | `--jp-paper` |
| White | `#FFFFFF` | `--jp-surface` / `--jp-cream` |

**No gold / green / sakura / vermillion.** Legacy tokens alias to primary or neutrals.

## Typography

- Heading: Lora  
- Body: Be Vietnam Pro  

## Rules

- CTAs, links, active states → primary  
- Eyebrows / soft accents → muted  
- Sale badges → primary (not red)  
- Shadows: neutral gray, not tinted  
- Avoid multi-hue gradients — primary → primary-hover only  

## Checklist

- [ ] One brand hue on screen  
- [ ] Contrast ≥ 4.5:1  
- [ ] Focus ring primary  
- [ ] prefers-reduced-motion  
