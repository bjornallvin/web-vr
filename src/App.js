import React, { useEffect, useRef, useState } from 'react';
import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
  const divRef = useRef(null);
  const size = useWindowSize();
  const [scene, setScene] = useState();
  const [renderer, setRenderer] = useState();
  const [camera, setCamera] = useState()
  const [holder, setHolder] = useState();


  /**
   *  Handle window resize
   */
  useEffect(() => {
    if (!(renderer && camera)) { return; }
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
  }, [size])

  /**
   *  Initialize scene,camera & renderer
   */
  useEffect(() => {
    const scene = new THREE.Scene();
    setScene(scene);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;
    setCamera(camera)
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight);
    setRenderer(renderer);
    divRef.current.appendChild(renderer.domElement);

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 100, 100);

    var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var geometry = new THREE.PlaneGeometry(1000, 1000, 32);
    var material = new THREE.LineBasicMaterial({
      color: 0x451177, side: THREE.DoubleSide, linewidth: 1,
      linecap: 'round', //ignored by WebGLRenderer
      linejoin: 'round' //ignored by WebGLRenderer
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = d2r(90)
    plane.position.y = 0
    scene.add(plane);


  }, [])


  useEffect(() => {
    if (!(renderer && camera && scene)) { return; }
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var loader = new OBJLoader();
    //loader.setMaterials(material)
    loader.load('tower.obj', (obj) => {

      console.log(obj);
      //obj.scale.x = 1000;
      //obj.scale.y = 1000;

      scene.add(obj)

      obj.scale.set(0.2, 0.2, 0.2);

      obj.rotation.x = d2r(-90);

      obj.rotation.y = 0
      obj.rotation.z = 0

      obj.position.x = 0
      obj.position.y = 0;
      obj.position.z = 0

      setHolder(obj);
      renderer.render(scene, camera);

    }, function (xhr) {

      console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    }, function (error) {

      console.error(error);

    });




  }, [renderer])

  useEffect(() => {


    if (renderer && holder) {
      var animate = function () {


        //console.log("animating")
        requestAnimationFrame(animate);
        holder.rotation.z += 0.005;
        //holder.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    }
  }, [renderer, holder])





  return (
    <div ref={divRef} />
  );
}

export default App;



/**
 * Custom hook for handling window resize events
 */
function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

function d2r(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

