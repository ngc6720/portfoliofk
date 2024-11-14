import CONTENT from "/content.js";
import * as dom from "/core/dom/dom.js";
import Lenis from "@studio-freight/lenis";
import { Clock, LoadingManager } from "three";

import { disableElements, prepareDisableElements } from "/core/utils/misc.js";
import { setScrollbarW } from "/core/utils/element.js";

import { AudioLoader } from "/core/au/audioLoader.js";
import createAudio from "/core/au/audio-ctx.js";
import Player from "/core/au/player.js";
import Multiplayer from "/core/au/multiplayer.js";
import extraitsMap from "/core/au/extraits-map.js";
import Atmos from "/core/au/atmos.js";
import Oneh from "/core/au/oneh.js";
import ParamAttachment from "/core/au/param-attachment.js";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import composer from "/core/3d/composer.js";
import renderer from "/core/3d/renderer.js";
import camera from "/core/3d/camera.js";
import scene from "/core/3d/scene.js";
import sphere from "/core/3d/obj/sphere.js";
import { curve } from "/core/3d/obj/path.js";
import { lookatCurve } from "/core/3d/obj/lookat-path.js";
import { TextureLoader } from "three";
import texAlpha from "/textures/alpha.jpg?url";
import texDispl from "/textures/displacement-soft-clouds.jpg?url";

import makeProgressAnim from "/core/animation/progress.js";
import CameraLoc from "/core/animation/camera-loc.js";

import Stats from "stats.js";
var stats = new Stats();
// document.body.appendChild(stats.dom);

let audioCtx,
  pNodes,
  multiplayer,
  atmos1,
  atmos1Attachment,
  oneh,
  projectsPlayer;

(function () {
  const path = window.location.pathname;
  if (!!path && path !== "/" && path.charAt(path.length - 1) === "/") {
    const newPath = path.slice(0, window.location.pathname.length - 1);
    history.replaceState(history.state, "", newPath);
  }
})();
const cameraLoc = new CameraLoc(camera);
cameraLoc.addCurve(curve, lookatCurve);
cameraLoc.addPos([2, -1, 3], [1, 0, -1]);
cameraLoc.addPos([2, 0, 2], [1, 0, -1]);

const setAtmos1Windows = () =>
  CONTENT.sounds.atmos.forEach((el, i) => atmos1.setWindow(i, el.win));

async function createAndLoadAudio() {
  [audioCtx, pNodes] = await createAudio();

  multiplayer = new Multiplayer(audioCtx, {
    playerOptions: { fadems: 1800, loop: false, gain: 0.75 },
  });
  const extraitsSrc = CONTENT.projects.map((project) => project.audio);

  atmos1 = new Atmos(audioCtx, {
    defaultSourceOptions: {
      speedlimms: 1000,
      slidems: 4000,
      threshPosition: Atmos.threshPosition.center,
      windowFade: 0.4,
    },
  });

  atmos1Attachment = new ParamAttachment({
    ctx: audioCtx,
    param: atmos1.node.parameters.get("gain"),
    range: [0, 1],
    initialValue: 0,
    speedlimms: 20,
    slidems: 4000,
    // slidems: 50
  });

  oneh = new Oneh(audioCtx);

  projectsPlayer = new Player(audioCtx, {
    fadems: 2000,
    autoplay: false,
    loop: true,
  });

  // routing

  pNodes.create.gain01("masterGain");

  multiplayer.node.connect(pNodes.masterGain);

  atmos1.node.connect(pNodes.masterGain);

  oneh.node.connect(pNodes.masterGain);

  projectsPlayer.node.connect(pNodes.masterGain);

  pNodes.masterGain.connect(audioCtx.destination);

  return Promise.all([
    multiplayer.load(extraitsSrc.filter((src) => src.length > 0)), //, progress => console.log(`Multiplayer: loading sources progress: ${progress}`)),
    atmos1.load(CONTENT.sounds.atmos.map((el) => el.src)), //, progress => console.log(`Atmos: loading sources progress: ${progress}`)),
    oneh.load(CONTENT.sounds.os.map((el) => el.src)), //, progress => console.log(`Oneh: loading sources progress: ${progress}`)),
    projectsPlayer.load(CONTENT.sounds.projects[0].src),
  ]);
}

function loadTextures(manager) {
  const textureLoader = new TextureLoader(manager);

  return new Promise((resolve) => {
    manager.onLoad = resolve;

    scene.getObjectByName("mesh").material.alphaMap =
      textureLoader.load(texAlpha);

    scene.getObjectByName("mesh").material.displacementMap =
      textureLoader.load(texDispl);
  });
}

const App = function _App() {
  _App.loaded = false;
  _App.nextView = "/fk";

  _App.loadNextView = function () {
    document.querySelector("section.loading").innerHTML = ""; // remove listeners
    document.querySelector("section.loading").remove();
    _App.route(_App.nextView);
  };

  _App.lenis = null;

  _App.lenisResize = null;

  const clock = new Clock();
  _App.render3d = function () {
    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.x = -elapsedTime * 0.1;
    sphere.rotation.y = elapsedTime * 0.2;
    composer.render(scene, camera);
  };

  _App.animate = function (time) {
    // stats.begin();
    _App.lenis && _App.lenis.raf(time);
    _App.render3d();
    // stats.end();
    requestAnimationFrame(_App.animate);
  };

  _App.render3d();
  _App.progressNeedsUpdate = false;

  _App.animateProgress = makeProgressAnim(_App, dom.progress, () =>
    multiplayer.getPosition()
  );

  _App.renderNewScroll = function (_state) {
    if (_App.lenis) {
      window.removeEventListener("resize", _App.lenisResize, false);
      _App.lenis.stop();
      _App.lenis.destroy();
      _App.lenis = null;
    }
    _App.lenis = new Lenis();

    _App.lenisResize = () => {
      _App.lenis.resize();
      // console.log("lenisresize " + _App.lenis.progress)
      if (_state?.data.scroll3d === true) {
        cameraLoc.setScroll(_App.lenis.progress);
        atmos1?.updatePosition(_App.lenis.progress);
      }
    };
    window.addEventListener("resize", _App.lenisResize);

    _App.lenis.on("scroll", (e) => {
      // console.log("leniscroll " + _App.lenis.progress)
      if (_state?.data.scroll3d === true) {
        cameraLoc.setScroll(_App.lenis.progress);
        atmos1?.updatePosition(_App.lenis.progress);
      }
    });
  };

  _App.update = (k, v) => {
    try {
      if (!_App.updates.get(k))
        console.warn(
          `No update function corresponding to App.updates.get(${k})(${v})`
        );
      else _App.updates.get(k)(v);
    } catch (e) {
      console.error(`App.updates.get(${k})(${v}) : ${e}`);
    }
  };

  _App.render = (() => {
    let previousState = {};
    return (_state) => {
      // console.log("render", _state)
      const state = _state ?? {};

      const stateKeysToUpdate = Object.keys(state).filter(
        (k) =>
          k !== "data" &&
          state[k] !== undefined &&
          previousState[k] !== state[k]
      );

      // sets fixed positions in window for transitions not to be affected by body scroll change
      prepareDisableElements([
        ...document.querySelectorAll("section"),
        dom.footer,
      ]);

      _App.transitions(previousState, _state);

      stateKeysToUpdate.map((k) => _App.update(k, state[k]));

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
    if (_view !== "/" && _App.loaded === false) {
      _App.nextView = _view;
      _App.route("/");
      return;
    }

    const state = _App.views.get(_view);

    if (_view !== "/") {
      const href = window.location.origin + _view;
      if (_App.nextView) history.replaceState(state, "", href);
      else history.pushState(state, "", href);
    }

    if (_view === _App.nextView) _App.nextView = null;

    _App.render(state);

    window.scrollY === 0
      ? window.dispatchEvent(new Event("scroll"))
      : window.scrollTo(0, 0);
  };

  _App.views = new Map([
    [
      "/",
      {
        meta: { title: "hello", description: CONTENT.fk.meta.description },
        docTitle: "~ François Kerforn",
        loading: true,
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
      },
    ],
    [
      "/fk",
      {
        meta: {
          title: CONTENT.fk.meta.title,
          description: CONTENT.fk.meta.description,
        },
        docTitle: CONTENT.fk.meta.title,
        loading: false,
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
      },
    ],
    [
      "/projects",
      {
        meta: {
          title: CONTENT.projectsList.meta.title,
          description: CONTENT.projectsList.meta.description,
        },
        loading: false,
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
      },
    ],
    ...CONTENT.projects.map((project, id) => {
      return [
        project.href,
        {
          meta: {
            title: `${project.name} | François Kerforn`,
            description: project.meta.description,
          },
          docTitle: `${project.name} | François Kerforn`,
          loading: false,
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
        },
      ];
    }),
  ]);

  _App.transitions = (previousState, state) => {
    // no fade in when first page is home after loading (for rectangle smooth transition)
    if (previousState.loading && state.fkSection) {
      dom.sectionFk.classList.add("noFade");
      setTimeout(() => {
        dom.sectionFk.classList.remove("noFade");
      }, 400);
    }
    if (previousState.projectsSection && state.project !== -1) {
      oneh.play(4);
    }
    if (previousState.project !== -1 && state.projectsSection) {
      oneh.play(5);
    }
  };

  _App.updates = new Map([
    [
      "loading",
      async (bool) => {
        if (!bool) return;

        let progressA = 0;
        let progressV = 0;
        const el = document.getElementById("loadingProgress");
        const displayProgress = () => {
          const str = `${Math.floor((progressA + progressV) * 0.5 * 100)}%`;
          el.textContent = str;
        };

        const manager = new LoadingManager();
        const audioLoader = new AudioLoader();

        manager.onProgress = function (_, loaded, toLoad) {
          progressV = loaded / toLoad;
          displayProgress();
        };
        audioLoader.onProgress((p) => {
          progressA = p;
          displayProgress();
        });

        Promise.all([createAndLoadAudio(), loadTextures(manager)]) //, fakePromise(3000) ])
          .catch((e) =>
            console.error("Error while loading audio/textures > ", e)
          )
          .finally(() => {
            _App.loaded = true;
            setAtmos1Windows();
            atmos1?.updatePosition(_App.lenis.progress);
            dom.loadingButton.classList.add("ready");
            dom.loadingButton.addEventListener("click", () => {
              if (dom.enableSoundButton.classList.contains("active"))
                startAudio();
              _App.loadNextView();
            });

            Array.from([dom.navLinkProjects, dom.navLinkHome]).forEach(
              (el) => (el.onmouseenter = () => oneh.play(0))
            );
            Array.from([
              ...document.getElementsByClassName("projectContentLinks"),
            ]).forEach((el) => (el.onmouseenter = () => oneh.play(3)));
            dom.projectLinks.forEach(
              (el) => (el.onmouseenter = () => oneh.play(1))
            );
            dom.hyperLinks.forEach(
              (el) => (el.onmouseenter = () => oneh.play(1))
            );
            dom.footer2Content
              .querySelectorAll("a")
              .forEach((el) => (el.onmouseenter = () => oneh.play(2)));

            el.addEventListener("animationend", () => {
              el.textContent = "Enter";
              el.classList.add("show");
            });
            el.addEventListener("webkitAnimationEnd", () => {
              el.textContent = "Enter";
              el.classList.add("show");
            });
            el.classList.add("hidden");
          });
      },
    ],
    [
      "meta",
      ({ title, description }) => {
        document
          .querySelector('meta[name="title"]')
          .setAttribute("content", title);
        document
          .querySelector('meta[name="description"]')
          .setAttribute("content", description);
      },
    ],
    ["docTitle", (v) => (document.title = v)],
    [
      "fkSection",
      (bool) => {
        if (bool) {
          disableElements(
            [
              document.querySelector("section#fk"),
              document.querySelector("footer"),
            ],
            false
          );
          document.querySelector("section#fk").style.opacity = 1;
        } else {
          disableElements(
            [
              document.querySelector("section#fk"),
              document.querySelector("footer"),
            ],
            true
          );
          document.querySelector("section#fk").style.opacity = 0;
        }
      },
    ],
    [
      "projectsSection",
      (bool) => {
        if (bool)
          disableElements(document.querySelector("section#projects"), false);
        else disableElements(document.querySelector("section#projects"), true);
      },
    ],
    [
      "footer",
      (bool) => {
        bool === false
          ? dom.footer.classList.add("hidden")
          : dom.footer.classList.remove("hidden");
      },
    ],
    [
      "nav",
      (bool) => {
        if (bool) {
          disableElements(dom.nav, false);
          dom.nav.classList.remove("hidden"),
            dom.audioSwitch.classList.contains("hidden") &&
              setTimeout(
                () => dom.audioSwitch.classList.remove("hidden"),
                1500
              );
        } else {
          disableElements(dom.nav, true);
          dom.nav.classList.add("hidden");
        }
      },
    ],
    [
      "displayArrows",
      (v) => {
        v === false
          ? dom.arrows.forEach(
              (arrow) => (
                (arrow.style.opacity = "0"),
                (arrow.style.pointerEvents = "none")
              )
            )
          : dom.arrows.forEach(
              (arrow) => (
                (arrow.style.opacity = "1"), (arrow.style.pointerEvents = "all")
              )
            );
      },
    ],
    [
      "project",
      (() => {
        // for different cases when navigating
        let previousId = -1;
        return (id) => {
          if (previousId === undefined || previousId === -1) {
            // none -> none
            if (id === undefined || id === -1) {
              return;

              // none -> project
            } else {
              disableElements(
                document.querySelectorAll("section.project")[id],
                false
              );
              dom.projectNames[id].appear("appearToTop");
              dom.projectContent1[id].display(true);
              dom.projectContent2[id]?.display(true);
              dom.backLinks[id].appear("appearToTop");
              dom.counter.textContent = `${id + 1}/${CONTENT.projects.length}`;
            }
          } else {
            // project -> none
            if (id === undefined || id === -1) {
              disableElements(
                document.querySelectorAll("section.project")[previousId],
                true
              );
              dom.projectNames[previousId].vanish("vanishToTop");
              dom.projectContent1[previousId].display(false);
              dom.projectContent2[previousId]?.display(false);
              dom.backLinks[previousId].vanish();

              // project -> project
            } else {
              let direction = id > previousId ? "RIGHT" : "LEFT";
              if (id === 0 && previousId === CONTENT.projects.length - 1) {
                direction = "RIGHT";
              }
              if (id === CONTENT.projects.length - 1 && previousId === 0) {
                direction = "LEFT";
              }
              disableElements(
                document.querySelectorAll("section.project")[id],
                false
              );
              disableElements(
                document.querySelectorAll("section.project")[previousId],
                true
              );
              dom.projectContent1[previousId].display(false);
              dom.projectContent2[previousId]?.display(false);
              dom.backLinks[previousId].vanish();
              dom.projectNames[previousId].vanish(
                direction === "LEFT" ? "vanishToRight" : "vanishToLeft"
              );
              dom.projectNames[id].appear(
                direction === "LEFT" ? "appearToLeft" : "appearToRight"
              );
              dom.projectContent1[id].display(true);
              dom.projectContent2[id]?.display(true);
              dom.backLinks[id].appear("appearToTop");
              dom.counter.textContent = `${id + 1}/${CONTENT.projects.length}`;
            }
          }
          previousId = id;
        };
      })(),
    ],
    [
      "displayCarousel",
      (v) =>
        v
          ? dom.carousel.el.classList.remove("hidden")
          : dom.carousel.el.classList.add("hidden"),
    ],
    [
      "multiplayer",
      (id) => {
        multiplayer?.play(id);
      },
    ],
    [
      "projectLinksGrid",
      (bool) => {
        if (bool) {
          dom.projectLinksGrid.style.opacity = "1";
          dom.projectLinksGrid.classList.add("fadeIn");
        } else {
          dom.projectLinksGrid.style.opacity = "0";
        }
      },
    ],
    [
      "three",
      (bool) => {
        bool
          ? document.getElementById("three").classList.remove("hidden")
          : document.getElementById("three").classList.add("hidden");
      },
    ],
    [
      "progress",
      (bool) => {
        if (bool) {
          dom.progressContainer.classList.remove("hidden");
          if (multiplayer) _App.progressNeedsUpdate = true;
          requestAnimationFrame(_App.animateProgress);
        } else {
          dom.progressContainer.classList.add("hidden");
          _App.progressNeedsUpdate = false;
        }
      },
    ],
    [
      "heroContent",
      (bool) => {
        bool
          ? (dom.heroContent1.appear("appearToLeft"),
            dom.heroContent2.appear("appearToRight"))
          : (dom.heroContent1.vanish("vanishToRight"),
            dom.heroContent2.vanish("vanishToLeft"));
      },
    ],
    [
      "cameraLoc",
      (id) => {
        if (id == null) return;
        cameraLoc.setPage(id);
      },
    ],
    [
      "atmos1Gain",
      (gainValue) => {
        atmos1Attachment.update(gainValue);
      },
    ],
    [
      "projectsPlayer",
      (bool) => {
        bool ? projectsPlayer?.start() : projectsPlayer?.stop();
      },
    ],
  ]);

  // NAV & LISTENERS

  // Route internally (no refresh)
  [
    ...dom.projectLinks,
    dom.navLinkProjects,
    dom.navLinkHome,
    ...dom.backLinks.map((vanisher) => vanisher.el),
    dom.footer2Link1,
    dom.footer2Link2,
  ].forEach(
    (el) =>
      (el.onclick = () => {
        const path = el.href.substring(window.location.origin.length);
        _App.route(path);
        return false;
      })
  );

  // Elements changing with pages transi are explicitly disabled except loading section (default page)
  disableElements(
    [
      ...document.querySelectorAll("section"),
      document.querySelector("footer"),
      document.querySelector("nav"),
    ].filter((el) => !el.classList.contains("loading")),
    true
  );

  const onEnableSound = () => {
    dom.enableSoundButton.classList.add("active");
    dom.disableSoundButton.classList.remove("active");
  };
  const onDisableSound = () => {
    dom.enableSoundButton.classList.remove("active");
    dom.disableSoundButton.classList.add("active");
  };
  dom.enableSoundButton.addEventListener("click", onEnableSound);
  dom.disableSoundButton.addEventListener("click", onDisableSound);

  // keyboard arrows
  document.addEventListener(
    "keyup",
    (() => {
      let stopstopstopstop = false;
      return (e) => {
        if (stopstopstopstop === true) return;
        stopstopstopstop = true;
        const size = CONTENT.projects.length;
        if (
          e.key === "ArrowLeft" &&
          CONTENT.projects
            .map((project) => project.href)
            .includes(window.location.pathname)
        ) {
          const id =
            history.state.project - 1 < 0
              ? size - 1
              : history.state.project - 1;
          _App.route(CONTENT.projects[id].href);
        }
        if (
          e.key === "ArrowRight" &&
          CONTENT.projects
            .map((project) => project.href)
            .includes(window.location.pathname)
        ) {
          const id =
            history.state.project + 1 >= size ? 0 : history.state.project + 1;
          _App.route(CONTENT.projects[id].href);
        }
        setTimeout(() => (stopstopstopstop = false), 300);
      };
    })()
  );

  // carousel buttons
  dom.arrows.forEach(
    (() => {
      let stopstopstopstop = false;
      return (arrow, i) =>
        arrow.addEventListener("click", () => {
          if (stopstopstopstop === true) return;
          stopstopstopstop = true;
          const size = CONTENT.projects.length;
          if (i === 0) {
            const id =
              history.state.project - 1 < 0
                ? size - 1
                : history.state.project - 1;
            _App.route(CONTENT.projects[id].href);
          }
          if (i === 1) {
            const id =
              history.state.project + 1 >= size ? 0 : history.state.project + 1;
            _App.route(CONTENT.projects[id].href);
          }
          setTimeout(() => (stopstopstopstop = false), 300);
        });
    })()
  );

  async function toggleAudio(event) {
    if (audioCtx.state === "running") {
      //   console.log('suspend')
      stopAudio();
    } else {
      //   console.log('resume')
      startAudio();
    }
  }

  async function startAudio() {
    audioSwitch.classList.add("on");
    await audioCtx.resume();
    if (audioCtx.state !== "running") {
      audioSwitch.classList.remove("on");
      dom.disableSoundButton.classList.add("active");
      dom.enableSoundButton.classList.remove("active");
    }
    // console.log("start")
  }
  async function stopAudio() {
    audioSwitch.classList.remove("on");
    dom.disableSoundButton.classList.add("active");
    dom.enableSoundButton.classList.remove("active");
    await audioCtx.suspend();
    if (audioCtx.state === "running") {
      audioSwitch.classList.add("on");
    }
    // console.log("stop")
  }

  audioSwitch.addEventListener("click", toggleAudio);
  document.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "m") toggleAudio();
  });

  window.onblur = async () => {
    if (dom.audioSwitch.classList.contains("on")) await audioCtx.suspend();
  };
  window.onfocus = async () => {
    if (dom.audioSwitch.classList.contains("on")) await audioCtx.resume();
  };

  function onWindowResize() {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Update effect composer
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener("resize", onWindowResize);
};

App();

window.addEventListener("popstate", (e) => App.render(e.state));
App.route(window.location.pathname);
document.getElementById("three").appendChild(renderer.domElement);
requestAnimationFrame(App.animate);

/* dev ctrl */

// const controls = new OrbitControls(camera, renderer.domElement);
// document.getElementById("ctrl-orbit").oninput = (e) => {
//   if (e.target.checked) {
//     App.lenis?.stop();
//     scene.getObjectByName("lookatPath").visible = true;
//     controls.enabled = true;
//     camera.position.set(16, 16, 16);
//     camera.lookAt(0, 0, 0);
//     controls.update();
//     scene.getObjectByName("grid").visible = true;
//     scene.getObjectByName("axes").visible = true;
//     document.getElementById("three").classList.add("front");
//   } else {
//     scene.getObjectByName("lookatPath").visible = false;
//     controls.enabled = false;
//     App.lenis?.start();
//     scene.getObjectByName("grid").visible = false;
//     scene.getObjectByName("axes").visible = false;
//     document.getElementById("three").classList.remove("front");
//   }
// };

// document.getElementById("ctrl-orbit").dispatchEvent(new Event("input"));
