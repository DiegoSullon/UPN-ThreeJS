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
      './src/assets/models/environment/resources/posx.jpg',
      './src/assets/models/environment/resources/negx.jpg',
      './src/assets/models/environment/resources/posy.jpg',
      './src/assets/models/environment/resources/negy.jpg',
      './src/assets/models/environment/resources/posz.jpg',
      './src/assets/models/environment/resources/negz.jpg'
    ])
    this.scene.background = texture
  }

  updateLight () {
    l.updateLight()
  }
}

export default LoadScene
