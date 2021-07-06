import * as THREE from 'three'

let spotLight
let ambientLight
let lightHelper
let shadowCameraHelper
class Lights {
  constructor (scene, ambientLightColor) {
    this.scene = scene
    this.ambientLightColor = ambientLightColor
    this._Init()
  }

  _Init () {
    spotLight = new THREE.SpotLight(this.ambientLightColor, 10)
    spotLight.position.set(200, 200, 200)
    spotLight.angle = Math.PI / 2
    spotLight.penumbra = 0.1
    spotLight.decay = 2
    spotLight.distance = 200
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 512
    spotLight.shadow.mapSize.height = 512
    spotLight.shadow.camera.near = 10
    spotLight.shadow.camera.far = 200
    spotLight.shadow.focus = 1

    // this.scene.add(spotLight);

    lightHelper = new THREE.SpotLightHelper(spotLight)

    // this.scene.add(lightHelper);

    shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
    // this.scene.add(shadowCameraHelper);
    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
    // this.scene.add(ambientLight);
  }

  updateLigths () {
    spotLight.color.setHex(this.ambientLightColor)
  }
}
export default Lights
