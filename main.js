import CONTENT from '/content.js'
import * as dom from '/core/dom/dom.js'
import Lenis from '@studio-freight/lenis'

import { setScrollbarW, disableElements, prepareDisableElements, isScrollAtBottom } from '/core/utils/utils.js'

import createAudio from '/core/au/audio-ctx.js'
import Player from '/core/au/player.js'
import Multiplayer from '/core/au/multiplayer.js'
import extraitsMap from '/core/au/extraits-map.js'
import Atmos from '/core/au/atmos.js'
import Oneh from '/core/au/oneh.js'
import ParamAttachment from '/core/au/param-attachment.js'

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import composer from '/core/3d/composer.js'
import renderer from '/core/3d/renderer.js'
import camera from '/core/3d/camera.js';
import scene from '/core/3d/scene.js';
import { curve } from '/core/3d/obj/path.js'
import { lookatCurve } from '/core/3d/obj/lookat-path.js'
import { TextureLoader } from 'three'
import texAlpha from '/textures/alpha.jpg?url'
import texDispl from '/textures/displacement-soft-clouds.jpg?url'


import { fakePromise } from '/core/utils/utils.js'

import makeLoadingAnim from '/core/animation/loader.js'
import makeProgressAnim from '/core/animation/progress.js'
import CameraLoc from '/core/animation/camera-loc.js'

let audioCtx, pNodes, multiplayer, atmos1, atmos1Attachment, oneh, projectsPlayer;

(function() {
    const path = window.location.pathname;
    if (!!path && path !== '/' && path.charAt(path.length-1) === '/') {
        const newPath = path.slice(0, window.location.pathname.length-1)
        history.replaceState(history.state, '', newPath)
    }
})();

const cameraLoc = new CameraLoc(camera);
cameraLoc.addCurve(curve, lookatCurve)
cameraLoc.addPos([2, -1, 3], [1, 0, -1])
cameraLoc.addPos([2, 0, 2], [1, 0, -1])

const setAtmos1Windows = () => CONTENT.sounds.atmos.forEach((el, i) => atmos1.setWindow(i, el.win) )

async function createAndLoadAudio() {
    [ audioCtx, pNodes ] = await createAudio();

    multiplayer = new Multiplayer(audioCtx, { playerOptions: { fadems: 1800, loop: false } });
    const extraitsSrc = CONTENT.projects.map(project => project.audio)

    atmos1 = new Atmos(audioCtx, {
        defaultSourceOptions: {
        speedlimms: 1000,
        slidems: 4000,
        // slidems: 50,
        threshPosition: Atmos.threshPosition.center,
        windowFade: 0.4
        // windowFade: 0.
    }});

    atmos1Attachment = new ParamAttachment({
        ctx: audioCtx,
        param: atmos1.node.parameters.get('gain'),
        range: [0, 1],
        initialValue: 0,
        speedlimms: 20,
        slidems: 4000
        // slidems: 50
    })

    oneh = new Oneh(audioCtx);

    projectsPlayer = new Player(audioCtx, {
        fadems: 2000, autoplay: false, loop: true
    })

    // routing 

    pNodes.create.gain01('masterGain')

    multiplayer.node
    .connect(pNodes.masterGain)

    atmos1.node
    .connect(pNodes.masterGain)

    oneh.node
    .connect(pNodes.masterGain)
    
    projectsPlayer.node
    .connect(pNodes.masterGain)

    pNodes.masterGain.connect(audioCtx.destination)
    
    return Promise.all([
        multiplayer.loadSources(extraitsSrc.filter(src => src !== '')),//, progress => console.log(`Multiplayer: loading sources progress: ${progress}`)),
        atmos1.loadAudioSources(CONTENT.sounds.atmos.map(el => el.src)),//, progress => console.log(`Atmos: loading sources progress: ${progress}`)),
        oneh.loadSources(CONTENT.sounds.os.map(el => el.src)),//, progress => console.log(`Oneh: loading sources progress: ${progress}`)),
        projectsPlayer.loadAudioSource(CONTENT.sounds.projects[0].src),
    ])
}

function loadTextures() {
    function loadAlphaMap(url) {
      return new Promise(resolve => {
        scene.getObjectByName('mesh').material.alphaMap = new TextureLoader().load( texAlpha, resolve )
      })
    }
    function loadDisplacementMap(url) {
      return new Promise(resolve => {
        scene.getObjectByName('mesh').material.displacementMap = new TextureLoader().load( texDispl, resolve )
      })
    }
    return [ loadAlphaMap(), loadDisplacementMap() ]
}
  
// parallax
function updateParallax(_parallaxMap, reset = false) {
    const scrollY = reset ? 0 : window.scrollY;
    if (isScrollAtBottom()) return;
    _parallaxMap.forEach(map => map.el.style.transform = `translateY(${map.qt * scrollY}px)`);
};


const App = function _App() {
    
    _App.loaded = false;
    _App.userClicked = false;
    
    _App.nextView = '/fk';

    _App.loadNextView = function() {
        // console.log("loadnextview", _App.nextView)
        dom.enableSoundButton.removeEventListener('click', onEnableSound, false)
        dom.disableSoundButton.removeEventListener('click', onEnableSound, false)
        dom.loadingMess.removeEventListener('click', onEnableSound, false)
        // _App.loaded = true;
        _App.route(_App.nextView);
        // _App.nextView = '/'
    };

    _App.lenis = null;

    _App.lenisResize = null;
    
    _App.render3d = function() {
        composer.render( scene, camera );
        // effect.render( scene, camera );
      }

    _App.animate = function(time) {
        _App.lenis && _App.lenis.raf(time)
        _App.render3d();
        requestAnimationFrame(_App.animate)
    }
    
    _App.progressNeedsUpdate = false;
    _App.loaderNeedsUpdate = false;

    _App.animateLoader = makeLoadingAnim(_App, dom.loadingMess);
    _App.animateProgress = makeProgressAnim(_App, dom.progress, () => multiplayer.getPosition());

    _App.renderNewScroll = function(_state) {
        if (_App.lenis) {
            window.removeEventListener('resize', _App.lenisResize, false);
            _App.lenis.stop();
            _App.lenis.destroy();
            _App.lenis = null;
        }
        _App.lenis = new Lenis();

        _App.lenisResize = () => {
            _App.lenis.resize();
            // console.log("lenisresize " + _App.lenis.progress)
            if (_state.data.scroll3d === true) {
                cameraLoc.setScroll(_App.lenis.progress)
                atmos1?.updatePosition(_App.lenis.progress)
            }
        }
        window.addEventListener('resize', _App.lenisResize)
        
        _App.lenis.on('scroll', e => {
            // console.log("leniscroll " + _App.lenis.progress)
            if (_state.data.scroll3d === true) {
                cameraLoc.setScroll(_App.lenis.progress)
                atmos1?.updatePosition(_App.lenis.progress)
            }
        })
    }
    
    _App.update = (k, v) => {
        try {
            if (!_App.updates.get(k))
                console.warn(`No update function corresponding to App.updates.get(${k})(${v})`)
            else
                _App.updates.get(k)(v)
        } catch(e) {
            console.error(`App.updates.get(${k})(${v}) : ${e}`)
        }
    }

    _App.render = (() => {
        let previousState = {};
        return (_state) => {
            // console.log("render", _state)
            const state = _state ?? {};

            const stateKeysToUpdate = Object.keys(state)
            .filter(k => k !== 'data' && state[k] !== undefined && previousState[k] !== state[k]);

            
            // sets fixed positions in window for transitions not to be affected by body scroll change
            prepareDisableElements([ ...document.querySelectorAll('section'), dom.footer])
            stateKeysToUpdate.map( k => _App.update(k, state[k]) );
            previousState = state;

            setScrollbarW();

            _App.renderNewScroll(_state);            

            if (stateKeysToUpdate.length === 0) {
                return false;
            }

            return true;
        };
    })();

    _App.route = (_view) => {
    //    console.log("route", _view)
        if (_view !== '/' && _App.loaded === false) {
            _App.nextView = _view;
            _App.route('/')
            return;
        }

        if (_view === '/' && _App.loaded === true) {
            _App.route('/fk')
            return;
        }

        const state = _App.views.get(_view);
        const href = window.location.origin + _view;
        if (_view !== '/') history.pushState(state, '', href);
        _App.render(state);

        
        window.scrollY === 0 ?  window.dispatchEvent(new Event('scroll')) : window.scrollTo(0,0)
        // cameraLoc.setPage(_view)
        // updateParallax(parallaxMap, true);
    };
    
    _App.views = new Map([
        ['/', {
            meta: {title: "hello", description: CONTENT.fk.meta.description},
            docTitle: "~~ François Kerforn",
            loading: true,
            loadingSection: true,
            fkSection: false,
            projectsSection: false,
            displayArrows: false,
            project: -1,
            displayCarousel: false,
            multiplayer: -1,
            projectLinksGrid: false,
            footer: false,
            nav: false,
            three: false,
            data: { scroll3d: false },
            progress: false,
            heroContent: false,
            projectsPlayer: false,
        }],
        ['/fk', {
            meta: {title: CONTENT.fk.meta.title, description: CONTENT.fk.meta.description},
            docTitle: CONTENT.fk.meta.title,
            loading: false,
            loadingSection: false,
            fkSection: true,
            projectsSection: false,
            displayArrows: false,
            project: -1,
            displayCarousel: false,
            multiplayer: -1,
            projectLinksGrid: false,
            footer: true,
            nav: true,
            three: true,
            data: { scroll3d: true },
            progress: false,
            heroContent: true,
            cameraLoc: 0,
            atmos1Gain: 1,
            projectsPlayer: false,
        }],
        ['/projects', {
            meta: {title: CONTENT.projectsList.meta.title, description: CONTENT.projectsList.meta.description},
            loading: false,
            loadingSection: false,
            fkSection: false,
            projectsSection: true,
            docTitle: CONTENT.projectsList.meta.title,
            displayArrows: false,
            project: -1,
            displayCarousel: false,
            multiplayer: -1,
            projectLinksGrid: true,
            footer: false,
            nav: true,
            three: true,
            data: { scroll3d: false },
            progress: false,
            heroContent: false,
            cameraLoc: 1,
            atmos1Gain: 0,
            projectsPlayer: true,
        }],
        ...CONTENT.projects.map((project, id) => {
            return [
                project.href,
                {
                    meta: {title: `${project.name} | François Kerforn`, description: project.meta.description},
                    docTitle: `${project.name} | François Kerforn`,
                    loading: false,
                    loadingSection: false,
                    fkSection: false,
                    projectsSection: false,
                    displayArrows: true,
                    project: id,
                    displayCarousel: true,
                    multiplayer: extraitsMap[id],
                    projectLinksGrid: false,
                    footer: false,
                    nav: true,
                    three: true,
                    data: { scroll3d: false },
                    progress: true,
                    heroContent: false,
                    cameraLoc: 2,
                    atmos1Gain: 0,
                    projectsPlayer: false,
                }
            ]
        })        
    ]);

    _App.updates = new Map([
        ['loading', async bool => {
            if (!bool)
                return;

            Promise.all([ createAndLoadAudio(), ...loadTextures()])//, fakePromise(3000) ])
            .catch(e => console.error("Error while loading audio/textures > ", e))
            .finally(() => {
                _App.loaded = true;
                if (_App.userClicked) _App.loadNextView();
                setAtmos1Windows();
                atmos1?.updatePosition(_App.lenis.progress)
                dom.loadingMess.classList.add("completed");
                dom.loadingMess.addEventListener('click', onDisableSound)
                dom.loadingMess.textContent = "Enter"
                Array.from([dom.navLinkProjects, dom.navLinkHome, ...document.getElementsByClassName('projectContentLinks')]).forEach( el => el.onmouseenter = () => oneh.play(0) )
                dom.projectLinks.forEach( el => el.onmouseenter = () => oneh.play(1) )
                dom.hyperLinks.forEach( el => el.onmouseenter = () => oneh.play(1) )
                Array.from(document.getElementsByClassName('homeLink')).forEach( el => el.onmouseenter = () => oneh.play(2) )

            })
        }],
        ['meta', ({ title, description }) => {
            document.querySelector('meta[name="title"]').setAttribute("content", title);
            document.querySelector('meta[name="description"]').setAttribute("content", description);
        }],
        ['docTitle', v => document.title = v],
        ['loadingSection', bool => {
            if (bool) {
                disableElements(document.querySelector('section.loading'), false)
                document.querySelector('section.loading').style.opacity = 1;
                _App.loaderNeedsUpdate = true;
                _App.animateLoader();

            } else { 
                disableElements(document.querySelector('section.loading'), true)
                document.querySelector('section.loading').style.opacity = 0;
                _App.loaderNeedsUpdate = false;
            }
        }],
        ['fkSection', bool => {
            if (bool) {
                disableElements([document.querySelector('section.fk'), document.querySelector('footer')], false)
                document.querySelector('section.fk').style.opacity = 1;
            } else { 
                disableElements([document.querySelector('section.fk'), document.querySelector('footer')], true)
                document.querySelector('section.fk').style.opacity = 0;
            }
        }],
        ['projectsSection', bool => {
            if (bool) disableElements(document.querySelector('section.projects'), false);
            else disableElements(document.querySelector('section.projects'), true)
        }],
        ['footer', bool => {
            bool === false ? dom.footer.classList.add('hidden') : dom.footer.classList.remove('hidden');
        }],
        ['nav', bool => {

            bool === false ? dom.nav.classList.add('hidden') : (dom.nav.classList.remove('hidden'), dom.audioSwitch.classList.contains('hidden') && setTimeout(() => dom.audioSwitch.classList.remove('hidden'), 1500));
        }],
        ['displayArrows', v => {
            v === false ? dom.arrows.forEach(arrow => (arrow.style.opacity= '0', arrow.style.pointerEvents= 'none')) : dom.arrows.forEach(arrow => (arrow.style.opacity= '1', arrow.style.pointerEvents= 'all'));
        }],
        ['project', (() => {
            // for different cases when navigating
            let previousId = -1;
            return (id) => {
                
                if (previousId === undefined || previousId === -1) {

                    // none -> none
                    if (id === undefined || id === -1) {
                        return;

                    // none -> project
                    } else {
                        disableElements([
                            document.querySelectorAll('section.project')[id],
                            // document.getElementById('progressCnvContainer')
                         ], false);
                        dom.projectNames[id].appear('appearToTop')
                        dom.projectContent1[id].display(true);
                        dom.projectContent2[id]?.display(true);
                        dom.backLinks[id].appear('appearToTop');
                        dom.counter.textContent = `${id+1}/${CONTENT.projects.length}`;
                    }

                } else {

                    // project -> none
                    if (id === undefined || id === -1) {
                        disableElements([
                            document.querySelectorAll('section.project')[previousId],
                            // document.getElementById('progressCnvContainer')
                        ], true);
                        dom.projectNames[previousId].vanish('vanishToTop');
                        dom.projectContent1[previousId].display(false);
                        dom.projectContent2[previousId]?.display(false);
                        dom.backLinks[previousId].vanish();
                        
                    // project -> project
                    } else {
                        let direction = id > previousId ? 'RIGHT' : 'LEFT';
                        if (id === 0 && previousId === CONTENT.projects.length-1) {
                            direction = 'RIGHT';
                        }
                        if (id === CONTENT.projects.length-1 && previousId === 0) {
                            direction = 'LEFT';
                        }
                        disableElements(document.querySelectorAll('section.project')[id], false);
                        disableElements(document.querySelectorAll('section.project')[previousId], true);
                        dom.projectContent1[previousId].display(false);
                        dom.projectContent2[previousId]?.display(false);
                        dom.backLinks[previousId].vanish();
                        dom.projectNames[previousId].vanish(direction === 'LEFT' ? 'vanishToRight' : 'vanishToLeft');
                        dom.projectNames[id].appear(direction === 'LEFT' ? 'appearToLeft' : 'appearToRight');
                        dom.projectContent1[id].display(true);
                        dom.projectContent2[id]?.display(true);
                        dom.backLinks[id].appear('appearToTop');
                        dom.counter.textContent = `${id+1}/${CONTENT.projects.length}`;
                    }
                }
                previousId = id;
            }})()
        ],
        ['displayCarousel', v => v ? dom.carousel.el.classList.remove('hidden')  : dom.carousel.el.classList.add('hidden')],
        ['multiplayer', (id) => {
            multiplayer?.play(id)
        }],
        ['projectLinksGrid', bool => {
            if (bool) {
            dom.projectLinksGrid.style.opacity = '1';
            dom.projectLinksGrid.classList.add('fadeIn');
        } else {
            dom.projectLinksGrid.style.opacity = '0';
        }
        }],
        ['three', bool => {
            bool ? document.getElementById('three').classList.remove('hidden') : document.getElementById('three').classList.add('hidden')
        }],
        ['progress', bool => {
            if (bool) {
                dom.progressContainer.classList.remove('hidden')
                if (multiplayer)
                    _App.progressNeedsUpdate = true;
                    requestAnimationFrame(_App.animateProgress)
             } else {
                 dom.progressContainer.classList.add('hidden')
                 _App.progressNeedsUpdate = false;

             }
        }],
        ['heroContent', bool => {
            bool ? ( dom.heroContent1.appear('appearToLeft'), dom.heroContent2.appear('appearToRight')) :
            ( dom.heroContent1.vanish('vanishToRight'),  dom.heroContent2.vanish('vanishToLeft'))
        }],
        ['cameraLoc', id => {
            if (id == null) return;
            cameraLoc.setPage(id)
        }],
        ['atmos1Gain', gainValue => {
            atmos1Attachment.update(gainValue);
        }],
        ['projectsPlayer', bool => {
            bool ? projectsPlayer?.start() : projectsPlayer?.stop()
        }],
        
    ]);
    

    // NAV & LISTENERS

    // Route internally (no refresh)
    [...dom.projectLinks, dom.navLinkProjects, dom.navLinkHome, dom.homeLink1, ...(dom.backLinks.map(vanisher => vanisher.el)), dom.footer2Link1, dom.footer2Link2].forEach(el => el.onclick = () => {
        const path = el.href.substring(window.location.origin.length);
        _App.route(path);
        return false;
    });

    // Elements changing with pages transi are explicitly disabled
    [...document.querySelectorAll('section'), document.querySelector('footer')].forEach(el => el.classList.add('disabled'))

    const onEnableSound = () => {
        startAudio();
        if (_App.loaded) _App.loadNextView();
        _App.userClicked = true;
    }
    const onDisableSound = () => {
        stopAudio();
        if (_App.loaded) _App.loadNextView();
        _App.userClicked = true;
    }
    dom.enableSoundButton.addEventListener('click', onEnableSound)
    dom.disableSoundButton.addEventListener('click', onDisableSound)

    // keyboard arrows
    document.addEventListener('keyup', (() => {
        let stopstopstopstop = false;
        return e => {
            if (stopstopstopstop === true) return;
            stopstopstopstop = true;
            const size = CONTENT.projects.length;
            if (e.key === 'ArrowLeft' && CONTENT.projects.map(project => project.href).includes(window.location.pathname)) {
                const id =  history.state.project-1 < 0 ? size-1 : history.state.project-1;
                _App.route(CONTENT.projects[id].href);
            }
            if (e.key === 'ArrowRight' && CONTENT.projects.map(project => project.href).includes(window.location.pathname)) {
                const id =  history.state.project+1 >= size ? 0 : history.state.project+1;
                _App.route(CONTENT.projects[id].href);
            }
            setTimeout(() => stopstopstopstop = false, 300);
        }
    })());

    // carousel buttons
    dom.arrows.forEach( (() => {
        let stopstopstopstop = false;
        return (arrow, i) => arrow.addEventListener('click', () => {
            if (stopstopstopstop === true) return;
            stopstopstopstop = true;
            const size = CONTENT.projects.length;
            if (i === 0) {
                const id =  history.state.project-1 < 0 ? size-1 : history.state.project-1;
                _App.route(CONTENT.projects[id].href);
            }
            if (i === 1) {
                const id =  history.state.project+1 >= size ? 0 : history.state.project+1;
                _App.route(CONTENT.projects[id].href);
            }
            setTimeout(() => stopstopstopstop = false, 300);
        }
    )})());


    async function toggleAudio(event) {
  
        if (audioCtx.state === 'running') {
        //   console.log('suspend')
            stopAudio()
        } else {
        //   console.log('resume')
            startAudio()
        }
    }
    
    async function startAudio() {
        audioSwitch.classList.add('on')
        dom.enableSoundButton.classList.add('active')
        dom.disableSoundButton.classList.remove('active')
        await audioCtx.resume();
        if(audioCtx.state !== 'running') {
            audioSwitch.classList.remove('on')
            dom.disableSoundButton.classList.add('active')
            dom.enableSoundButton.classList.remove('active')
        }
        // console.log("start")
    }
    async function stopAudio() {
        audioSwitch.classList.remove('on')
        dom.disableSoundButton.classList.add('active')
        dom.enableSoundButton.classList.remove('active')
        await audioCtx.suspend();
        if (audioCtx.state === 'running') {
            audioSwitch.classList.add('on')
            dom.enableSoundButton.classList.add('active')
            dom.disableSoundButton.classList.remove('active')
        }
        // console.log("stop")
    }

    audioSwitch.addEventListener("click", toggleAudio);



    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        composer.setSize( window.innerWidth, window.innerHeight );
        // effect.setSize( window.innerWidth, window.innerHeight );
    }
    
    window.addEventListener( 'resize', onWindowResize );

    // const parallaxMap = [ { el: document.getElementById('info'), qt: -1.2 } ];
    // function parallaxCb() {
    //     updateParallax(parallaxMap);
    // }
    // document.addEventListener('scroll', parallaxCb)

}



App();
// cameraLoc.initPage(App.views.get(window.location.pathname).cameraLoc)
window.addEventListener('popstate', e => App.render(e.state));
App.route(window.location.pathname);
document.getElementById('three').appendChild(renderer.domElement);
requestAnimationFrame(App.animate);


/* dev ctrl */

// const controls = new OrbitControls( camera, renderer.domElement );
// document.getElementById("ctrl-orbit").oninput = (e) => {
//     if (e.target.checked) {
//         App.lenis?.stop()
//         scene.getObjectByName('lookatPath').visible = true;
//         controls.enabled = true;
//         camera.position.set( 16, 16, 16 );
//         camera.lookAt(0, 0, 0)
//         controls.update()
//         scene.getObjectByName('grid').visible = true;
//         scene.getObjectByName('axes').visible = true;
//         document.getElementById('three').classList.add('front');
//     } else {
//         scene.getObjectByName('lookatPath').visible = false;
//         controls.enabled = false;
//         App.lenis?.start()
//         scene.getObjectByName('grid').visible = false;
//         scene.getObjectByName('axes').visible = false;
//         document.getElementById('three').classList.remove('front');
//     }
// }


// document.getElementById("ctrl-orbit").dispatchEvent(new Event('input'))

// window.addEventListener('scroll', () => console.log('scroll'))
