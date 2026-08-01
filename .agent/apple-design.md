# Apple Design Guidelines & Fluid UI Principles

This document translates Apple's interface design philosophy and fluid motion principles (distilled from WWDC *Designing Fluid Interfaces*) into web development standards for `ng-images-preview`.

---

## 🌟 The Core Philosophy

> "When we align the interface to the way we think and move, something magical happens — it stops feeling like a computer and starts feeling like a seamless extension of us."

An interface feels alive when motion:
1. **Starts from the current on-screen value**,
2. **Inherits the user's velocity**,
3. **Projects momentum forward**, and
4. **Can be grabbed and reversed at any instant**.

---

## 8 Core Pillars of Apple Fluid Design

### 1. Response — Kill Latency
Latency destroys directness. Response is the foundation everything else is built on.
- **Respond on Pointer-Down**: Show press feedback instantly on `pointerdown` / `:active`, not on release. Waiting for `click` / touch-up feels sluggish.
- **Continuous Feedback**: Update UI 1:1 with pointer movements during gestures — never animate only after the gesture completes.

```css
/* Latency-free active press feedback */
.apple-press:active {
  transform: scale(0.97);
  transition: transform 100ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 2. Direct Manipulation — 1:1 Tracking
- **Respect Grab Offset**: When dragging an object, it must stay glued to the finger at the exact spot grabbed. Snapping to element center breaks physical illusion.
- **Pointer Capture**: Use `setPointerCapture(pointerId)` so tracking continues seamlessly even when finger/cursor leaves bounds.
- **Velocity History**: Maintain position and timestamp history across `pointermove` events to compute release velocity.

### 3. Interruptibility — The Single Most Important Principle
Every animation must be interruptible and redirectable at any frame.
- **Never Lock Out Input**: Users must be able to grab a sliding card or closing overlay mid-motion and reverse it.
- **Animate from Presentation Value**: On interrupt, read element's live `getComputedStyle(el).transform` and start the new motion from there — never jump to target values.
- **Smooth Reversals**: Blend velocity on direction change to prevent hard velocity cuts.

### 4. Behavior Over Animation — Use Springs
Pre-scripted fixed-duration keyframes cannot adapt to live user input; springs naturally adapt because new input simply adjusts the spring target.

#### Apple Physics Parameters
- **Damping Ratio**: Controls overshoot.
  - `1.0` = Critically damped (no bounce/overshoot, smooth settle). **Default for UI**.
  - `< 1.0` (~`0.8`) = Over-shoots & bounces. **Use ONLY when gesture carried release momentum**.
- **Response**: Time in seconds to reach target. Snappier = `0.3s - 0.4s`.

#### Apple Shipped Spring Reference Table
| Interaction | Damping Ratio | Response | Web Easing Curve / Spring |
| :--- | :--- | :--- | :--- |
| **Move / Reposition (PiP)** | `1.0` (No bounce) | `0.4s` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **Rotation / Tilt** | `0.8` (Light bounce) | `0.4s` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| **Drawer / Sheet / Modal** | `0.8` (Soft bounce) | `0.3s` | `cubic-bezier(0.2, 1.2, 0.2, 1)` |

### 5. Velocity Handoff — Seam-free Transitions
When a gesture ends, pass the pointer release velocity directly as initial spring velocity:
$$\text{relativeVelocity} = \frac{\text{gestureVelocity}}{\text{targetValue} - \text{currentValue}}$$

### 6. Momentum Projection — Animate to Trajectory Target
Don't snap to the nearest boundary from release position. Project resting position using Apple's deceleration formula, then snap to the nearest target:

```javascript
// Apple's exact momentum projection formula (decelerationRate = 0.998)
function project(releaseVelocity, decelerationRate = 0.998) {
  return (releaseVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

const projectedEndpoint = currentPosition + project(releaseVelocity);
const targetSnapPoint = nearestSnapPoint(projectedEndpoint);
```

### 7. Spatial Consistency — Symmetric Paths & Anchored Origins
- **Symmetric Paths**: Panels sliding in from the right MUST dismiss back to the right.
- **Anchored Origins**: Set `transform-origin` relative to the trigger button so spatial relationships remain clear.

### 8. Hinting Trajectory
Intermediate motion should telegraph final outcome — grow cards toward destination during drag to guide user expectation.

---

## 🎨 Aesthetics & Layout Guidelines

- **Typography**: SF Pro font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text"`). Use tight tracking (`tracking-tight`) for headers.
- **Glassmorphism**: Lightweight `backdrop-filter: blur(16px)` with 1px glass border (`border-white/10` or `border-black/10`).
- **Bento Grid Cards**: Clean rounded container grids with subtle scale on hover (`scale-[1.015]`).

---

## ⚡ Hardware Performance & Thermal Efficiency

To prevent device heating, high CPU/GPU load, or battery drain:
1. **Compositor-Only Animations**: Restrict all CSS transitions strictly to `transform` and `opacity`.
2. **No Heavy Filter/Shadow Animations**: Never animate `box-shadow`, `filter`, or `backdrop-filter` in keyframes.
3. **Controlled Blur Radius**: Keep `backdrop-filter` blur under 20px and avoid multi-layer glass stacking.
