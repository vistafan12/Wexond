function durationToSpring (w, o = 0) {
  const s = o <= 0
    ? 1 - o
    : 1 / Math.sqrt(1 + Math.pow(2 * Math.PI / Math.log(1 / (o * o)), 2))

  const ks = (2 * Math.PI / w) / Math.max(Math.sqrt(1 - s * s), 0.5)
  const c = 2 * ks * s
  return {
    stiffness: ks * ks,
    damping: c
  }
}

const ipcRenderer = require('electron').ipcRenderer
const remote = require('electron').remote

const menuAnimationData = {
  opacitySpring: durationToSpring(0.4),
  topSpring: durationToSpring(0.4),
  tabsDividerSpring: durationToSpring(0.4),
  menuHeightSpring: durationToSpring(0.4)
}
