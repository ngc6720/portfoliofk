import CONTENT from "/content.js";
import {
  element,
  div,
  span,
  h2,
  h3,
  p,
  article,
  icon,
} from "/core/utils/element.js";
import { makeVanisher, makeVanisherDisplay } from "/core/animation/vanish.js";
import makePathes from "/core/image/wavetable.js";

// DEV
// document.body.appendChild(
//   div({ id: "layout" }, ...Array.from({ length: 12 }, () => div()))
// );

// META

const meta = [
  element("meta", { name: "robots", content: "index, follow" }),
  element("meta", { name: "title", content: CONTENT.fk.meta.title }),
  element("meta", { name: "description", content: CONTENT.fk.meta.title }),
];
meta.forEach((meta) => document.head.appendChild(meta));

// HEADER

const header = element("header");
const h1 = element("h1", "François Kerforn | Portfolio");
header.appendChild(h1);
document.body.appendChild(header);

// MAIN

const main = document.querySelector("main");
document.body.appendChild(main);

// NAV

export const nav = element("nav", { classList: "hidden" });

export const navLinkProjects = element("a", {
  href: "/projects",
  alt: "Projects | François Kerforn",
});
const navLinkProjectsSpan = element("span", "Projects");
navLinkProjects.setAttribute("data-text", navLinkProjectsSpan.textContent);
navLinkProjects.appendChild(navLinkProjectsSpan);

export const navLinkHome = element("a", {
  href: "/fk",
  alt: "Home | François Kerforn",
});
const navLinkHomeSpan = element("span", "Home");
navLinkHome.setAttribute("data-text", navLinkHomeSpan.textContent);
navLinkHome.appendChild(navLinkHomeSpan);

export const audioSwitch = element("button", {
  id: "audioSwitch",
  className: "hidden",
});
const audioSwitchSpan = element("span", "Audio (is on)");
audioSwitchSpan.innerHTML = "Audio [<span>on</span>]";
const audioSwitchIcon = element("div");
audioSwitch.setAttribute("data-text", audioSwitchSpan.textContent);
audioSwitch.appendChild(audioSwitchIcon);
audioSwitch.appendChild(audioSwitchSpan);

nav.appendChild(navLinkHome);
nav.appendChild(navLinkProjects);
nav.appendChild(audioSwitch);
header.appendChild(nav);

// FOOTER

export const footer = element("footer", { classList: "hidden" });

const footer1Cat = element("div", { className: "category" });

const footer1Content = element("div", { className: "content" });
export const footer2Link1 = element(
  "a",
  { href: "/fk", alt: "Projects | François Kerforn" },
  "FK",
);
export const footer2Link2 = element(
  "a",
  { href: "/projects", alt: "Home | François Kerforn" },
  "Projects",
);
footer1Content.appendChild(element("p", CONTENT.footer.bio));

footer1Cat.appendChild(footer1Content);

const footer2Cat = element("div", { className: "category", id: "contact" });

export const footer2Content = element("div", { className: "content" });
footer2Content.appendChild(
  element(
    "a",
    {
      href: `mailto:${CONTENT.footer.contact.mail}`,
      target: "_blank",
      alt: "Send e-mail",
    },
    "Mail",
  ),
);

footer2Content.appendChild(
  element(
    "a",
    {
      href: CONTENT.footer.contact.bluesky,
      target: "_blank",
      alt: "Open Bluesky Profile",
    },
    "Bluesky",
  ),
);
footer2Content.appendChild(
  element(
    "a",
    {
      href: CONTENT.footer.contact.github,
      target: "_blank",
      alt: "Open Github Profile",
    },
    "Github",
  ),
);
footer2Content.appendChild(
  element(
    "a",
    {
      href: CONTENT.footer.contact.linkedin,
      target: "_blank",
      alt: "Open Linkedin Profile",
    },
    "Linkedin",
  ),
);

footer2Cat.appendChild(footer2Content);

const footer3Cat = element("div", { className: "category" });
const footer3Name = element("div", "Favourite tools:");
const footer3Content = element("div", { className: "content" });

CONTENT.footer.tools.forEach((tool) =>
  footer3Content.appendChild(element("p", tool)),
);
footer3Cat.appendChild(footer3Name);
footer3Cat.appendChild(footer3Content);

footer.appendChild(footer1Cat);
footer.appendChild(footer2Cat);
footer.appendChild(element("p", `${new Date().getFullYear()} © fk.`));
document.body.appendChild(footer);

//  LOADING

const sectionLoading = document.querySelector("section.loading");
export const loadingButton = document.getElementById("loadingButton");
export const loadingIcon = document.getElementById("loadingIcon");

const soundChoiceContainer = element("div", { id: "soundChoiceContainer" });
const soundChoiceQuestion = element(
  "div",
  { id: "soundChoiceQuestion" },
  "Enable audio ?",
);
export const enableSoundButton = element(
  "button",
  { id: "enableSoundButton", className: "active" },
  "yes",
);
export const disableSoundButton = element(
  "button",
  { id: "disableSoundButton" },
  "no",
);

soundChoiceContainer.appendChild(soundChoiceQuestion);
soundChoiceContainer.appendChild(enableSoundButton);
soundChoiceContainer.appendChild(disableSoundButton);
sectionLoading.appendChild(soundChoiceContainer);

// SECTION FK

export const sectionFk = element("section", { id: "fk", className: "fk" });
main.appendChild(sectionFk);

const hero = element("div", { id: "hero" });
export const heroContent1 = makeVanisher(
  [element("span", "f"), element("span", "k")],
  element("span"),
);
export const heroContent2 = makeVanisher(
  [
    element("span", "SOUND"),
    element("span", "DESIGN"),
    element("span", "DEV_"),
  ],
  element("span"),
);

const heroContent = element("span");
heroContent.appendChild(heroContent1.el);
heroContent.appendChild(heroContent2.el);
hero.appendChild(heroContent);
sectionFk.appendChild(hero);

CONTENT.fk.homeDescription.forEach((text) =>
  sectionFk.appendChild(article(div(p(text)))),
);

// SECTION PROJECTS

const waveformsWidth = 128;
const waveformsheight = 128;

export const projectLinks = CONTENT.projects.map((project) => {
  const el = element("a", {
    href: project.href,
    className: "projectLink",
    target: "_blank",
    alt: `Open project : ${project.name}`,
  });
  el.appendChild(
    icon(
      element("div", { className: "waveIcon" }),
      makePathes({ width: waveformsWidth, height: waveformsheight }),
      {
        width: "100%",
        height: "100%",
        viewBox: `0 0  ${waveformsWidth} ${waveformsheight}`,
      },
    ),
  );
  const container = element("div", { className: "text" });
  const els = [
    element("div", project.name),
    element("span", ""),
    element("div", project.idObject.date),
    element("div", project.idObject.type),
  ];
  els.forEach((el) => {
    const mask = element("span", { className: "mask" });
    mask.appendChild(el);
    container.appendChild(mask);
  });
  container
    .querySelectorAll(".mask")
    .forEach((el) => el.setAttribute("data-text", el.textContent));
  el.appendChild(container);
  return el;
});

export const hyperLinks = CONTENT.links.map((project) => {
  const el = element("a", {
    href: project.href,
    className: "hyperLink",
    target: "_blank",
    alt: `Visit project : ${project.name}`,
  });
  el.appendChild(
    icon(
      element("div", { className: "waveIcon" }),
      makePathes({ width: waveformsWidth, height: waveformsheight }),
      {
        width: "100%",
        height: "100%",
        viewBox: `0 0  ${waveformsWidth} ${waveformsheight}`,
      },
    ),
  );
  const container = element("div", { className: "text" });
  const els = [
    element("div", project.name),
    element("span", ""),
    element("div", project.content[1]),
    element("div", project.content[2]),
  ];
  els.forEach((el) => {
    const mask = element("span", { className: "mask" });
    mask.appendChild(el);
    container.appendChild(mask);
  });
  container
    .querySelectorAll(".mask")
    .forEach((el) => el.setAttribute("data-text", el.textContent));
  el.appendChild(container);
  return el;
});

const sectionProjects = element("section", {
  id: "projects",
});
main.appendChild(sectionProjects);

const projectsTitle = element("h2", "Projects");
sectionProjects.appendChild(projectsTitle);

const projectLinksEl = div({ id: "projectLinks" });
export const projectLinksGrid = div(
  { id: "projectLinksList" },
  ...projectLinks,
  ...hyperLinks,
);

projectLinksEl.appendChild(projectLinksGrid);
sectionProjects.appendChild(projectLinksEl);

// PROJECT

const makeIdItem = (k, v) => {
  const el = element("p");
  const key = element("span", k);
  const value = element("span", v);
  el.appendChild(key);
  el.appendChild(value);
  return el;
};

const idContent = CONTENT.projects.map((project) => {
  const container = element("div", { className: "projectInfo" });
  [
    makeIdItem("Name:", project.idObject.name),
    makeIdItem("Date:", project.idObject.date),
    makeIdItem("Role:", project.idObject.role),
  ].forEach((item) => container.appendChild(item));
  return container;
});

export const projectContent1 = CONTENT.projects.map((project) => {
  const el1 = element("article", { className: "projectArticle1" });
  const p0 = element("p");
  p0.innerHTML = project.p[0];

  el1.appendChild(p0);

  return {
    el: el1,
    display: (v) => {
      el1.classList.toggle("display", v);
    },
  };
});

export const projectContent2 = CONTENT.projects.map((project) => {
  const el2 = element("article", { className: "projectArticle2" });
  const paragraphs = project.p
    .map((str, i) => i > 0 && element("p", str))
    .filter((el) => el);

  paragraphs.forEach((el) => el2.appendChild(el));

  if (paragraphs.length > 0)
    return {
      el: el2,
      display: (bool) => {
        el2.classList.toggle("display", bool);
      },
    };
});

export const backLinks = CONTENT.projects.map((_) =>
  makeVanisher(
    [
      element(
        "div",
        element(
          "div",
          element("span", { className: "btn-close-x" }, "["),
          element("span", "x"),
          element("span", { className: "btn-close-x" }, "]"),
          element("span", "Close"),
        ),
      ),
    ],
    element("a", {
      href: "/projects",
      className: "backLink",
      alt: "Projects | François Kerforn",
    }),
    { tMin: 650, tMax: 900 },
  ),
);

export const projectNames = CONTENT.projects.map((project) =>
  makeVanisherDisplay(
    project.name.split(""),
    element("h2", { className: "projectName" }, project.name),
    { tMin: 900, tMax: 1200, random: true },
  ),
);

CONTENT.projects.forEach((project, i) => {
  const section = element("section", {
    id: project.href.slice(1),
    className: "project",
  });
  main.appendChild(section);
  section.appendChild(backLinks[i].el);
  projectContent1[i].el.insertBefore(
    idContent[i],
    projectContent1[i].el.childNodes[0],
  );
  projectContent1[i].el.insertBefore(
    projectNames[i].el,
    projectContent1[i].el.childNodes[0],
  );

  const projectArticleGrid = element("div", {
    className: "projectArticleGrid",
  });

  projectArticleGrid.appendChild(projectContent1[i].el);
  projectContent2[i]?.el &&
    projectArticleGrid.appendChild(projectContent2[i].el);
  const link = element("a", {
    href: project.url,
    className: "projectContentLinks",
    target: "_blank",
  });
  const linkSpan = element("span", "Learn More ↗ ");
  link.setAttribute("data-text", linkSpan.textContent);
  link.appendChild(linkSpan);

  if (project.url) projectArticleGrid.lastChild.appendChild(link);

  section.appendChild(projectArticleGrid);
});

// CAROUSEL

export const arrows = [
  element("button", { id: "arrowLeft" }, "← Prev"),
  element("button", { id: "arrowRight" }, "Next →"),
];

export const counter = element("div", { id: "counter" });

export const carousel = (() => {
  const el = element("div", { id: "carousel" });
  el.appendChild(arrows[0]);
  el.appendChild(counter);
  el.appendChild(arrows[1]);
  return {
    el: el,
  };
})();

document.body.insertBefore(carousel.el, footer);

// PROGRESS

export const progress = element("div", { id: "progress" });
export const progressContainer = element("div", {
  id: "progressContainer",
});
progressContainer.appendChild(progress);
document.body.appendChild(progressContainer);
