import './style/style.css'
import * as THREE from 'three/build/three.module.js'
import * as CANNON from 'cannon'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import LoadScene from './scene/evironment.js'
import FPPCamera from './camera/FPPCamera.js'
import CargarModelos from './loaders/loaders.js'
import { PointerLockControls } from './controls/PointerLockControls.js'

const mouse = new THREE.Vector2()
// instances
let SCENE = null
let UPN = null
let INTERSECTED
let controls; let time = Date.now()

// lights
let spotLight
let ambientLight

// Graphics variables
let container
let camera, scene, raycaster, renderer, gui

const clock = new THREE.Clock()
const clock2 = new THREE.Clock()

let world
const timeStamp = 1.0 / 60.0
let boxBody
let sphereShape, sphereBody
let bMesh

// characters
let mixers
let mixers2
let poste1, poste2, poste3, poste4
let lpabellonA, lpabellonB, lbiblioteca

let fullscreenchange
const balls = []; const ballsShape = []

init()
window.requestIdleCallback(animate)

function init () {
  container = document.getElementById('canvas')
  document.body.appendChild(container)

  raycaster = new THREE.Raycaster()
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)
  window.addEventListener('resize', _OnWindowResize, false)
  const blocker = document.getElementById('blocker')
  const instructions = document.getElementById('instructions')

  const havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document

  if (havePointerLock) {
    const element = document.body

    const pointerlockchange = function (event) {
      if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
        controls.enabled = true

        blocker.style.display = 'none'
      } else {
        controls.enabled = false

        blocker.style.display = '-webkit-box'
        blocker.style.display = '-moz-box'
        blocker.style.display = 'box'

        instructions.style.display = ''
      }
    }

    const pointerlockerror = function (event) {
      instructions.style.display = ''
    }

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false)
    document.addEventListener('mozpointerlockchange', pointerlockchange, false)
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false)

    document.addEventListener('pointerlockerror', pointerlockerror, false)
    document.addEventListener('mozpointerlockerror', pointerlockerror, false)
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false)

    instructions.addEventListener('click', function (event) {
      instructions.style.display = 'none'

      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock

      if (/Firefox/i.test(navigator.userAgent)) {
        fullscreenchange = function (event) {
          if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
            document.removeEventListener('fullscreenchange', fullscreenchange)
            document.removeEventListener('mozfullscreenchange', fullscreenchange)

            element.requestPointerLock()
          }
        }

        document.addEventListener('fullscreenchange', fullscreenchange, false)
        document.addEventListener('mozfullscreenchange', fullscreenchange, false)

        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen

        element.requestFullscreen()
      } else {
        element.requestPointerLock()
      }
    }, false)
  } else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API'
  }

  camera = new FPPCamera(renderer)
  scene = new THREE.Scene()
  // Luces
  spotLight = new THREE.SpotLight(0xffffff, 1)
  spotLight.position.set(205, 168, 347)
  spotLight.angle = Math.PI / 3
  spotLight.penumbra = 0.1
  spotLight.decay = 3
  spotLight.distance = 600
  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 512
  spotLight.shadow.mapSize.height = 512
  spotLight.shadow.camera.near = 10
  spotLight.shadow.camera.far = 200
  spotLight.shadow.focus = 1
  scene.add(spotLight)

  const sphere = new THREE.SphereBufferGeometry(0.5, 16, 8)

  poste1 = new THREE.PointLight(0xd0d32d, 2, 50)
  poste1.position.set(94, 79.5, 159.8)
  poste1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xe8dbdb })))
  scene.add(poste1)

  poste2 = new THREE.PointLight(0xd0d32d, 2, 50)
  poste2.position.set(94, 79.5, 363.3)
  poste2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xe8dbdb })))
  scene.add(poste2)

  poste3 = new THREE.PointLight(0xd0d32d, 2, 50)
  poste3.position.set(336, 79.5, 159.8)
  poste3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xe8dbdb })))
  scene.add(poste3)

  poste4 = new THREE.PointLight(0xd0d32d, 2, 50)
  poste4.position.set(336, 79.5, 363.3)
  poste4.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xe8dbdb })))
  scene.add(poste4)

  // LuzPabellonA
  lpabellonA = new THREE.PointLight(0xd0d32d, 2, 50)
  lpabellonA.position.set(90, 69.5, 50)
  lpabellonA.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xdef48a })))
  scene.add(lpabellonA)

  // LuzPabellonB
  lpabellonB = new THREE.PointLight(0xd0d32d, 2, 50)
  lpabellonB.position.set(93.5, 67.5, 523)
  lpabellonB.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xdef48a })))
  scene.add(lpabellonB)

  // Biblioteca
  lbiblioteca = new THREE.PointLight(0xd0d32d, 2, 50)
  lbiblioteca.position.set(200, 69.5, 500)
  lbiblioteca.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xdef48a })))
  scene.add(lbiblioteca)

  // LuzAmbiente
  ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.15)
  scene.add(ambientLight)

  // gui
  scene.userData.fppCamera = true
  scene.userData.poste1 = true
  scene.userData.poste2 = true
  scene.userData.poste3 = true
  scene.userData.poste4 = true
  scene.userData.lpabellonA = true
  scene.userData.lpabellonB = true
  scene.userData.lbiblioteca = true
  // scene.userData.ambientLight = new THREE.Color(0x00FFFF);
  // console.log(scene.userData.ambientLight);
  createGUI()

  world = new CANNON.World()
  world.gravity.set(0, -50, 0)
  world.broadphase = new CANNON.NaiveBroadphase()

  SCENE = new LoadScene(scene, scene.userData.ambientLight, world)
  UPN = new CargarModelos(scene, world)
  console.log(SCENE, UPN)

  const plane = new CANNON.Plane()
  const planebody = new CANNON.Body({ shape: plane, mass: 0 })
  planebody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  planebody.position.set(0, 50, 0)
  world.addBody(planebody)

  const box = new CANNON.Box(new CANNON.Vec3(3, 3, 3))
  boxBody = new CANNON.Body({ shape: box, mass: 2 })
  boxBody.position.set(15, 350, 5)
  world.addBody(boxBody)

  const mass = 200; const radius = 4
  sphereShape = new CANNON.Sphere(radius)
  sphereBody = new CANNON.Body({ mass: mass })
  sphereBody.addShape(sphereShape)
  sphereBody.position.set(0, 200, 0)
  sphereBody.linearDamping = 0.9
  world.addBody(sphereBody)

  controls = new PointerLockControls(camera, sphereBody)
  controls.velocityFactor = 10
  scene.add(controls.getObject())
  controls.enabled = true

  const bGeo = new THREE.BoxGeometry(5, 5, 5)
  const bMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
  bMesh = new THREE.Mesh(bGeo, bMat)
  scene.add(bMesh)

  function onClick (event) {
    // llamarmodalMapa();
    if (INTERSECTED !== null) {
      if (INTERSECTED.name === 'panel1') {
        llamarmodalMapa()
        document.exitPointerLock()
      }
      if (INTERSECTED.name === 'panel2') {
        llamarmodalMapa()
        document.exitPointerLock()
      }
      if (INTERSECTED.name === 'caja') {
        llamarmodalCaja()
        document.exitPointerLock()
      }
      if (INTERSECTED.name === 'computadora1') {
        llamarmodalBiblioteca()
        document.exitPointerLock()
      }
      if (INTERSECTED.name === 'book1') {
        llamarmodalEstructura()
        document.exitPointerLock()
      }
      if (INTERSECTED.name === 'book2') {
        llamarmodalPoo()
        document.exitPointerLock()
      }
      if (INTERSECTED.name === 'cajita2') {
        llamarmodalBeca()
        document.exitPointerLock()
      }
      console.log('INTERSECTED: ' + INTERSECTED.name)
    }
  }

  // characters
  const loader = new FBXLoader()
  loader.load('./src/assets/models/Texting.fbx', function (object) {
    const boxc = new CANNON.Box(new CANNON.Vec3(1, 13, 1))
    const boxCBody = new CANNON.Body({ shape: boxc, mass: 0 })

    mixers = new THREE.AnimationMixer(object)

    const action = mixers.clipAction(object.animations[0])
    action.play()

    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    object.scale.setScalar(0.08)
    object.position.set(200, 51, 500)
    world.addBody(boxCBody)
    scene.add(object)
    boxCBody.position.copy(object.position)
  })
  const loader2 = new FBXLoader()
  loader2.load('./src/assets/models/Typing.fbx', function (object) {
    mixers2 = new THREE.AnimationMixer(object)

    const action = mixers2.clipAction(object.animations[0])
    action.play()

    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    object.scale.setScalar(0.08)
    object.position.set(105, 51, 480)
    scene.add(object)
  })

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  document.addEventListener('click', onClick, false)
}
function onDocumentMouseMove (event) {
  event.preventDefault()

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  // console.log(mouse);
}

function showSkeleton () {
  console.log('ball')
  const mass = 1; const radius = 2
  const sphereShape = new CANNON.Sphere(radius)
  const ballBody = new CANNON.Body({ mass: mass })
  ballBody.addShape(sphereShape)
  ballBody.position.copy(sphereBody.position)
  ballBody.position.y = ballBody.position.y + 10
  ballBody.position.x = ballBody.position.x + 10
  ballBody.linearDamping = 0.9
  world.addBody(ballBody)
  ballsShape.push(ballBody)

  const bGeo = new THREE.SphereGeometry(2, 32, 32)
  const bMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
  bMesh = new THREE.Mesh(bGeo, bMat)
  scene.add(bMesh)
  balls.push(bMesh)
  bMesh.position.copy(ballBody.position)
}
function createGUI () {
  if (gui) {
    gui.destroy()
  }

  gui = new GUI({ width: 350 })

  const graphicsFolder = gui.addFolder('Graphics')
  const settings = {
    ball: showSkeleton
  }
  // graphicsFolder.add(scene.userData, "fppCamera").name("FPPCamera");
  graphicsFolder.add(settings, 'ball')
  // graphicsFolder.add(settings, 'show model').onChange(showModel);

  const params = {
    'light color': spotLight.color.getHex(),
    Intensidad: spotLight.intensity,
    Distancia: spotLight.distance,
    Angulo: spotLight.angle,
    Penumbra: spotLight.penumbra,
    Decadencia: spotLight.decay,
    Foco: spotLight.shadow.focus,
    PosX: spotLight.position.x,
    PosY: spotLight.position.y,
    PosZ: spotLight.position.z
  }
  graphicsFolder.addColor(params, 'light color').name('Color de Iluminacion').onChange(function (val) {
    spotLight.color.setHex(val)
  })
  graphicsFolder.add(params, 'Intensidad', 0, 10).name(' Intensidad de Iluminación').onChange(function (val) {
    spotLight.intensity = val
  })
  graphicsFolder.add(params, 'Distancia', 50, 1000).onChange(function (val) {
    spotLight.distance = val
  })
  graphicsFolder.add(params, 'Angulo', 0, Math.PI / 2).onChange(function (val) {
    spotLight.angle = val
  })
  graphicsFolder.add(params, 'Penumbra', 0, 1).onChange(function (val) {
    spotLight.penumbra = val
  })
  graphicsFolder.add(params, 'Decadencia', 1, 2).onChange(function (val) {
    spotLight.decay = val
  })
  graphicsFolder.add(params, 'Foco', 0, 1).onChange(function (val) {
    spotLight.shadow.focus = val
  })
  graphicsFolder.add(params, 'PosX', 0, 300).onChange(function (val) {
    spotLight.position.x = val
  })
  graphicsFolder.add(params, 'PosY', 0, 500).onChange(function (val) {
    spotLight.position.y = val
  })
  graphicsFolder.add(params, 'PosZ', -200, 600).onChange(function (val) {
    spotLight.position.z = val
  })

  const params2 = {
    'light color': ambientLight.color.getHex(),
    intensity: ambientLight.intensity
  }
  graphicsFolder.addColor(params2, 'light color').name('Luz Ambiental').onChange(function (val) {
    ambientLight.color.setHex(val)
  })
  graphicsFolder.add(params2, 'intensity', 0, 1.5).name(' Intensidad Luz Ambiental').onChange(function (val) {
    ambientLight.intensity = val
  })
  graphicsFolder.add(scene.userData, 'poste1', 'poste2', 'poste3', 'poste4').name('Postes').onChange(function (val) {
    poste1.intensity = val
    poste2.intensity = val
    poste3.intensity = val
    poste4.intensity = val
    val = 2
  })
  graphicsFolder.add(scene.userData, 'lpabellonA', 'lpabellonB').name('Pabellones').onChange(function (val) {
    lpabellonA.intensity = val
    lpabellonB.intensity = val
    val = 2
  })
  graphicsFolder.add(scene.userData, 'lbiblioteca').name('Biblioteca').onChange(function (val) {
    lbiblioteca.intensity = val
    val = 2
  })

  // graphicsFolder.open();
}

function _OnWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
function animate () {
  window.requestAnimationFrame(animate)

  const delta = clock.getDelta()
  const delta2 = clock2.getDelta()

  if (mixers) mixers.update(delta)
  if (mixers2) mixers2.update(delta2)

  // renderer.render(scene, camera);
  // controls.update(clock1.getDelta());
  // controls2.update(clock2.getDelta());
  render()
}
// function animate2 () {
//   window.requestAnimationFrame(animate2)
// }

function render () {
  world.step(timeStamp)
  controls.update(Date.now() - time)
  time = Date.now()

  bMesh.position.copy(boxBody.position)
  bMesh.quaternion.copy(boxBody.quaternion)
  for (let i = 0; i < balls.length; i++) {
    balls[i].position.copy(ballsShape[i].position)
    balls[i].quaternion.copy(ballsShape[i].quaternion)
  }

  // raycaster
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    // const targetDistance = intersects[0].distance

    // camera.focusAt(targetDistance); // using Cinematic camera focusAt method

    if (INTERSECTED !== intersects[0].object) {
      if (intersects[0].object.material.emissive != null) {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

        INTERSECTED = intersects[0].object
        if (INTERSECTED.name === 'panel1' || INTERSECTED.name === 'panel2' || INTERSECTED.name === 'computadora1' || INTERSECTED.name === 'caja' ||
                    INTERSECTED.name === 'book1' || INTERSECTED.name === 'book2' || INTERSECTED.name === 'cajita2') {
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
          INTERSECTED.material.emissive.setHex(0xff0000)
        }
        // console.log("Intersedted");
        // console.log(intersects[0].object);
      } else {
        // console.log("No intersedted");
        // console.log(intersects[0].object);
        // // const color2 = new THREE.Color( 0xff0000 );
        // intersects[0].object.material.color=new THREE.Color( 0x200ff );
      }
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

    INTERSECTED = null
  }

  renderer.render(scene, camera)
}
function llamarmodalCaja () {
  // eslint-disable-next-line no-undef
  $('#modalCaja').modal('show') // abrir
}
function llamarmodalBiblioteca () {
  // eslint-disable-next-line no-undef
  $('#modalBiblioteca').modal('show') // abrir
}
function llamarmodalEstructura () {
  // eslint-disable-next-line no-undef
  $('#modalEstructura').modal('show') // abrir
}
function llamarmodalPoo () {
  // eslint-disable-next-line no-undef
  $('#modalPoo').modal('show') // abrir
}
function llamarmodalMapa () {
  // eslint-disable-next-line no-undef
  $('#modalMapa').modal('show') // abrir
}
function llamarmodalBeca () {
  // eslint-disable-next-line no-undef
  $('#modalBeca').modal('show') // abrir
}
