import * as THREE from 'three'
import Lights from './ligths/lights.js'

let l
class LoadScene {
  constructor (scene, ambientLightColor, world) {
    this.scene = scene
    this.ambientLightColor = ambientLightColor
    this._Initialize()
    this.world = world
  }

  _Initialize () {
    l = new Lights(this.scene, this.ambientLightColor)
    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load([
      './assets/models/posx.jpg',
      './assets/models/negx.jpg',
      './assets/models/posy.jpg',
      './assets/models/negy.jpg',
      './assets/models/posz.jpg',
      './assets/models/negz.jpg'
    ])
    this.scene.background = texture
  }

  updateLight () {
    l.updateLight()
  }
}

export default LoadScene
