(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    revealEls.forEach((el, i) => { el.style.transitionDelay = `${Math.min((i % 4) * 90, 270)}ms`; observer.observe(el); });
  } else revealEls.forEach(el => el.classList.add('visible'));

  // Three.js ambient star field with gentle pointer parallax.
  const canvas = document.getElementById('universe');
  if (window.THREE && canvas && !reduceMotion) {
    try {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
      renderer.setSize(innerWidth, innerHeight);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, .1, 1000);
      camera.position.z = 35;
      const count = innerWidth < 650 ? 600 : 1300, positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
      for (let i=0; i<count; i++) {
        positions[i*3]=(Math.random()-.5)*90; positions[i*3+1]=(Math.random()-.5)*65; positions[i*3+2]=(Math.random()-.5)*65;
        const t=Math.random(); colors[i*3]=.35+t*.35; colors[i*3+1]=.58+t*.35; colors[i*3+2]=.9+t*.1;
      }
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(positions,3)); geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
      const stars=new THREE.Points(geo,new THREE.PointsMaterial({size:.11,vertexColors:true,transparent:true,opacity:.85})); scene.add(stars);
      let px=0,py=0,sy=0;
      addEventListener('pointermove',e=>{px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*2},{passive:true});
      addEventListener('scroll',()=>sy=scrollY,{passive:true});
      function animate(){stars.rotation.y+=.00022;stars.rotation.x+=.00008;camera.position.x+=(px*1.2-camera.position.x)*.018;camera.position.y+=(-py*.8-camera.position.y)*.018;camera.position.z=35+Math.min(sy*.002,5);renderer.render(scene,camera);requestAnimationFrame(animate)}
      animate();
      addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(innerWidth,innerHeight)});
    } catch(e) { console.warn('3D background unavailable; CSS fallback remains active.',e); }
  }
  if (!reduceMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*3}deg) rotateX(${-y*3}deg) translateY(-3px)`});
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
    const portrait=document.getElementById('portrait');
    if(portrait){portrait.addEventListener('pointermove',e=>{const r=portrait.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;portrait.style.transform=`rotateY(${x*7}deg) rotateX(${-y*5}deg)`});portrait.addEventListener('pointerleave',()=>portrait.style.transform='')}
  }
  if(window.gsap && !reduceMotion){gsap.from('.hero-copy > *',{y:22,opacity:0,duration:.8,stagger:.09,ease:'power3.out',delay:.15});gsap.from('.portrait-wrap',{y:28,opacity:0,scale:.96,duration:1.15,ease:'power3.out',delay:.25});gsap.from('.float-chip, .floating-label',{opacity:0,scale:.92,duration:.7,stagger:.12,delay:.8,ease:'power2.out'})}
})();