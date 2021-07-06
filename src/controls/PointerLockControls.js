import * as THREE from 'three'
import * as CANNON from 'cannon'
export const PointerLockControls = function (camera, cannonBody) {
  let velocityFactor = 1.0
  const jumpVelocity = 60
  const scope = this

  const pitchObject = new THREE.Object3D()
  pitchObject.add(camera)

  const yawObject = new THREE.Object3D()
  yawObject.position.y = 2
  yawObject.add(pitchObject)

  const quat = new THREE.Quaternion()

  let moveForward = false
  let moveBackward = false
  let moveLeft = false
  let moveRight = false

  let canJump = false

  const contactNormal = new CANNON.Vec3() // Normal in the contact, pointing *out* of whatever the player touched
  const upAxis = new CANNON.Vec3(0, 1, 0)
  cannonBody.addEventListener('collide', function (e) {
    const contact = e.contact

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check
    // bi is the player body, flip the contact normal
    if (contact.bi.id === cannonBody.id) {
      contact.ni.negate(contactNormal)
    } else { contactNormal.copy(contact.ni) } // bi is something else. Keep the normal as it is

    // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    // Use a "good" threshold value between 0 and 1 here!
    if (contactNormal.dot(upAxis) > 0.5) { canJump = true }
  })

  const velocity = cannonBody.velocity

  const PI_2 = Math.PI / 2

  const onMouseMove = function (event) {
    if (scope.enabled === false) return

    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

    yawObject.rotation.y -= movementX * 0.002
    pitchObject.rotation.x -= movementY * 0.002

    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x))
  }

  const onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true
        break

      case 37: // left
      case 65: // a
        moveLeft = true; break

      case 40: // down
      case 83: // s
        moveBackward = true
        break

      case 39: // right
      case 68: // d
        moveRight = true
        break

      case 32: // space
        if (canJump === true) {
          velocity.y = jumpVelocity
        }
        canJump = false
        break
      case 16: // shift
        velocityFactor = 2.0
        break
    }
  }

  const onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false
        break

      case 37: // left
      case 65: // a
        moveLeft = false
        break

      case 40: // down
      case 83: // a
        moveBackward = false
        break

      case 39: // right
      case 68: // d
        moveRight = false
        break
      case 16: // shift
        velocityFactor = 1.0
        break
    }
  }

  document.addEventListener('mousemove', onMouseMove, false)
  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)

  this.enabled = false

  this.getObject = function () {
    return yawObject
  }

  this.getDirection = function (targetVec) {
    targetVec.set(0, 0, -1)
    quat.multiplyVector3(targetVec)
  }

  // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
  const inputVelocity = new THREE.Vector3()
  const euler = new THREE.Euler()
  this.update = function (delta) {
    if (scope.enabled === false) return

    delta *= 0.1

    inputVelocity.set(0, 0, 0)

    if (moveForward) {
      inputVelocity.z = -velocityFactor * delta
    }
    if (moveBackward) {
      inputVelocity.z = velocityFactor * delta
    }

    if (moveLeft) {
      inputVelocity.x = -velocityFactor * delta
    }
    if (moveRight) {
      inputVelocity.x = velocityFactor * delta
    }

    // Convert velocity to world coordinates
    euler.x = pitchObject.rotation.x
    euler.y = yawObject.rotation.y
    euler.order = 'XYZ'
    quat.setFromEuler(euler)
    inputVelocity.applyQuaternion(quat)
    // quat.multiplyVector3(inputVelocity);

    // Add to the object
    velocity.x += inputVelocity.x
    velocity.z += inputVelocity.z

    yawObject.position.copy(cannonBody.position)
  }
}
