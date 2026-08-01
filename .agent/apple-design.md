# Apple Design Guidelines & Fluid UI Principles

This document translates Apple's interface design philosophy and fluid motion principles into web development standards for `ng-images-preview`.

## Core Design Principles

### 1. Response — Kill Latency
- **Instant Touch Feedback**: Respond immediately on `pointerdown` / `:active`, not on release (`:active { transform: scale(0.97); transition: transform 100ms ease-out; }`).
- **Continuous Feedback**: Feedback must be continuous *during* interactions (1:1 tracking with the pointer), never only at the end.

### 2. Direct Manipulation & Gestures
- **Touch & Content Alignment**: Content must stay glued to the finger and respect the grab offset.
- **Pointer Capture**: Use `setPointerCapture` so tracking continues smoothly even if the pointer leaves element bounds.
- **Velocity History**: Track position and timestamp history to calculate release velocity for physical momentum.

### 3. Interruptibility & Fluid Motion
- **Always Interruptible**: Animations must be interruptible at any frame. The user can grab a closing modal or sliding card mid-motion and reverse it.
- **Presentation Values**: Always animate from the live presentation value (current on-screen transform), never the target value.
- **Velocity Handoff**: When a gesture ends, pass the pointer release velocity into the spring transition (`relativeVelocity = gestureVelocity / (target - current)`).

### 4. Apple Spring Parameters & Motion
- **Damping Ratio (Bouncing)**: Default to `1.0` (critically damped, no overshoot) for UI elements. Use `< 1.0` (~`0.8`) ONLY when the gesture carried momentum (flick, throw, drag release).
- **Response (Snappiness)**: Use `0.3s - 0.4s` for drawers, modals, and sheets.
- **Web Spring Curve**: Use `cubic-bezier(0.16, 1, 0.3, 1)` for Apple-like fluid spring easing.

### 5. Spatial Consistency & Aesthetics
- **Symmetric Paths**: Elements enter and exit along the exact same path (e.g. slide in from right → slide out to right).
- **Anchored Origins**: Set `transform-origin` relative to the trigger element.
- **SF Pro Typography & Layout**: Use SF Pro typography stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text"`), tight tracking (`tracking-tight`), and Bento Grid card structures.
- **Translucent Glassmorphism**: Use lightweight `backdrop-filter: blur(16px)` with 1px glass borders (`border-white/10` or `border-black/10`).

### 6. Hardware Performance & Thermal Efficiency
- **Compositor-Only Animations**: Animations MUST be strictly limited to CSS `transform` and `opacity` (executed on GPU compositor threads with 0 repaint cost).
- **No Heavy Shadow Animations**: Never animate `box-shadow` or `filter` properties continuously.
- **Controlled Blur Radius**: Keep `backdrop-filter` blur radii modest (16px-20px) and avoid multi-layered glass stacking to prevent GPU overheating on low-end or integrated GPUs.
