
import { Geometry } from 'three/examples/jsm/deprecated/Geometry.js'
import * as CANNON from 'cannon'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
class CargarModelos {
  constructor (scene, world) {
    this.scene = scene
    this.world = world
    // CARGAR ESTRUCTURAS GLB (ubicacion,nombre de archivo)

    this._LoadModelGlb('./assets/models/', 'upnx.glb', 50, 0)
  }

  _LoadModelGlb (path, modelFile, posicionY, rotacionY) {
    const objects = []
    const loader = new GLTFLoader()
    loader.setPath(path)

    loader.load(modelFile, (gltf) => {
      objects.push(gltf.scene.getObjectByName('panel1'))
      objects.push(gltf.scene.getObjectByName('panel2'))
      objects.push(gltf.scene.getObjectByName('estante1'))
      objects.push(gltf.scene.getObjectByName('estante2'))
      objects.push(gltf.scene.getObjectByName('book1'))
      objects.push(gltf.scene.getObjectByName('book2'))
      objects.push(gltf.scene.getObjectByName('caja'))
      for (let i = 1; i <= 15; i++) {
        const escalon = 'escalon' + i.toString()
        objects.push(gltf.scene.getObjectByName(escalon))
      }
      for (let i = 1; i <= 6; i++) {
        const cubo = 'cubo' + i.toString()
        if (cubo !== 'cubo3') {
          objects.push(gltf.scene.getObjectByName(cubo))
        }
      }
      for (let i = 1; i <= 4; i++) {
        const descanso = 'descansoaa' + i.toString()
        objects.push(gltf.scene.getObjectByName(descanso))
      }
      for (let i = 1; i <= 5; i++) {
        const a = 'a' + i.toString()
        objects.push(gltf.scene.getObjectByName(a))
      }
      for (let i = 1; i <= 13; i++) {
        const piedra = 'piedra' + i.toString()
        objects.push(gltf.scene.getObjectByName(piedra))
      }
      for (let i = 1; i <= 24; i++) {
        const p = 'p' + i.toString()
        if (p !== 'p14') {
          const pared = gltf.scene.getObjectByName(p)
          pared.rotation.y = 9.425
          if (pared.type === 'Mesh') {
            objects.push(pared)
          } else {
            console.log(pared)
            this.scene.add(pared)
          }
        }
      }
      for (let i = 1; i <= 10; i++) {
        const p = 'g' + i.toString()
        const pared = gltf.scene.getObjectByName(p)
        if (pared.type === 'Mesh') {
          objects.push(pared)
        } else {
          console.log(pared)
          this.scene.add(pared)
        }
      }
      objects.push(gltf.scene.getObjectByName('plaza'))
      for (let i = 1; i <= 9; i++) {
        const p = 'piso' + i.toString()
        const pared = gltf.scene.getObjectByName(p)
        if (pared.type === 'Mesh') {
          objects.push(pared)
        } else {
          console.log(pared)
          this.scene.add(pared)
        }
      }
      for (let i = 1; i <= 8; i++) {
        const p = 'pisoa' + i.toString()
        const pared = gltf.scene.getObjectByName(p)
        if (pared.type === 'Mesh') {
          objects.push(pared)
        } else {
          console.log(pared)
          this.scene.add(pared)
        }
      }
      for (let i = 1; i <= 9; i++) {
        const p = 'paredb' + i.toString()
        const pared = gltf.scene.getObjectByName(p)
        if (p !== 'paredb4') {
          if (pared.type === 'Mesh') {
            objects.push(pared)
          } else {
            console.log(pared)
            this.scene.add(pared)
          }
        }
      }
      objects.push(gltf.scene.getObjectByName('pisob1'))
      objects.push(gltf.scene.getObjectByName('computadora1'))
      objects.push(gltf.scene.getObjectByName('cajita1'))
      objects.push(gltf.scene.getObjectByName('cajita2'))
      objects.push(gltf.scene.getObjectByName('sofa1'))

      for (let i = 0; i < objects.length; i++) {
        objects[i].position.y = objects[i].position.y + posicionY
        this.scene.add(objects[i])
        const position = objects[i].position
        const quaternion = objects[i].quaternion
        // this.scene.add(panel2);

        // if(objects[i].type=="Mesh")
        const geometry = new Geometry().fromBufferGeometry(objects[i].geometry)
        const scale = objects[i].scale
        const vertices = []; const faces = []
        // Add vertices
        for (let i = 0; i < geometry.vertices.length; i++) {
          const x = scale.x * geometry.vertices[i].x
          const y = scale.y * geometry.vertices[i].y
          const z = scale.z * geometry.vertices[i].z

          vertices.push(new CANNON.Vec3(x, y, z))
        }

        for (let i = 0; i < geometry.faces.length; i++) {
          const a = geometry.faces[i].a
          const b = geometry.faces[i].b
          const c = geometry.faces[i].c

          faces.push([a, b, c])
        }

        const shape = new CANNON.ConvexPolyhedron(vertices, faces)

        const rigidBody = new CANNON.Body({
          mass: 0,
          shape: shape
        })

        rigidBody.position.copy(position)
        rigidBody.quaternion.copy(quaternion)
        this.world.addBody(rigidBody)
      }

      gltf.scene.traverse(c => {
        c.castShadow = true
      })
      gltf.scene.translateY(posicionY)
      gltf.scene.rotateY(rotacionY)
      this.scene.add(gltf.scene)

      console.clear()
    })
  }
}

export default CargarModelos
