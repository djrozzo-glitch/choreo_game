EVERYBODY DANCES v0.3 — 3D Puppet

Contents:
  index.html
  assets/dancer.glb (user-supplied rigged model)

Run via a web server (opening file:// directly will block model loading):
  python3 -m http.server 8000
  open http://localhost:8000

Or upload the entire folder to GitHub Pages.

Requires internet for Three.js modules via jsDelivr CDN.

Controls:
  Drag red handles to move hands, feet, head or hips.
  VIEW buttons rotate the camera.
  GRAVITY/FLOAT/PULSE add distinct ambient motion.
  START PERFORMANCE records up to 60 seconds of bone poses.
  WATCH PERFORMANCE replays the recording.
  SAVE POSTER downloads a PNG.

Technical notes:
  This build uses CCD inverse kinematics, not a fully simulated rigid-body ragdoll.
  The original Running animation is intentionally not played.
  Recording is in-memory and is lost on refresh.
