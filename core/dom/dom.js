import CONTENT from '/content.js'
import { makeElement, makeIcon } from '/core/utils/utils.js'
import { makeVanisher, makeVanisherDisplay } from '/core/animation/vanish.js'
import makePathes from '/core/image/wavetable.js'

// DEV

const layout = makeElement('div', { 'id': 'layout'});
for (let i = 0; i<12; i++) layout.appendChild(makeElement('div'));
document.body.appendChild(layout)

// META 

const meta = [
    makeElement('meta', {name: 'robots', content: "index, follow" }),
    makeElement('meta', {name: 'title', content: CONTENT.fk.meta.title }),
    makeElement('meta', {name: 'description', content: CONTENT.fk.meta.title }),
]
meta.forEach(meta => document.head.appendChild(meta));


// HEADER 

const header = makeElement('header');
const h1 = makeElement('h1', "François Kerforn | Portfolio");
header.appendChild(h1);
document.body.appendChild(header);


// MAIN

const main = makeElement('main');
document.body.appendChild(main);

// NAV

export const nav = makeElement('nav', { classList: 'hidden' });

// export const navLinkProjects = makeElement('a', { href: '/projects', alt: "Projects | François Kerforn"  }, "Projects")
export const navLinkProjects = makeElement('a', { href: '/projects', alt: "Projects | François Kerforn" })
const navLinkProjectsSpan = makeElement('span', "Projects");
navLinkProjects.setAttribute('data-text', navLinkProjectsSpan.textContent)
navLinkProjects.appendChild(navLinkProjectsSpan)

export const navLinkHome = makeElement('a', { href: '/fk', alt: "Home | François Kerforn" })
const navLinkHomeSpan = makeElement('span', "Home");
navLinkHome.setAttribute('data-text', navLinkHomeSpan.textContent)
navLinkHome.appendChild(navLinkHomeSpan)

export const audioSwitch = makeElement('button', { id: 'audioSwitch', className: 'hidden' });
const audioSwitchSpan = makeElement('span', "Audio (is on)")
const audioSwitchIcon = makeElement('div')
audioSwitch.setAttribute('data-text', audioSwitchSpan.textContent)
audioSwitch.appendChild(audioSwitchIcon)
audioSwitch.appendChild(audioSwitchSpan)



nav.appendChild(navLinkHome)
nav.appendChild(navLinkProjects)
nav.appendChild(audioSwitch)
header.appendChild(nav);


// FOOTER

export const footer = makeElement('footer', { classList: 'hidden' });

// const footer1Cat = makeElement('div', { className: 'category' });

// const footer1Name = makeElement('div', "Website pages");
// const footer1Content = makeElement('div', { className: 'content' })
// export const footer2Link1 = makeElement('a', { href: '/fk', alt: "Projects | François Kerforn"  }, "FK")
// export const footer2Link2 = makeElement('a', { href: '/projects', alt: "Home | François Kerforn"  }, "Projects")
// footer1Content.appendChild( footer2Link1 )
// footer1Content.appendChild( footer2Link2 )
// footer1Cat.appendChild(footer1Name)

const footer1Cat = makeElement('div', { className: 'category' });

const footer1Name = makeElement('div', `François Kerforn?`);
// const footer1Name = makeElement('div', `${(new Date()).getFullYear()} © François Kerforn.`);
const footer1Content = makeElement('div', { className: 'content' })
export const footer2Link1 = makeElement('a', { href: '/fk', alt: "Projects | François Kerforn"  }, "FK")
export const footer2Link2 = makeElement('a', { href: '/projects', alt: "Home | François Kerforn"  }, "Projects")
footer1Content.appendChild( makeElement('div', "> " + CONTENT.footer.bio) )
footer1Cat.appendChild(footer1Name)
footer1Cat.appendChild(footer1Content)

const footer2Cat = makeElement('div', { className: 'category' });

const footer2Name = makeElement('div', "Contact me!");
const footer2Content = makeElement('div', { className: 'content' })
footer2Content.appendChild(  makeElement('a', { href: `mailto:${CONTENT.footer.contact.mail}`, target: '_blank', alt: "Send e-mail"}, "E-mail") )
const mailText = makeElement('div', {id: 'mailText'})
mailText.appendChild(makeElement('span', `(`))
const mailTextContent = makeElement('span', `${CONTENT.footer.contact.mail}`);
mailText.appendChild(mailTextContent)
mailText.appendChild(makeElement('span', `)`))
footer2Content.appendChild(mailText)
// mailText.onclick = () => mailTextContent.select()

footer2Content.appendChild( makeElement('a', { href: CONTENT.footer.contact.linkedin, target: '_blank', alt: "Open Linkedin Profile"}, "Linkedin") )

footer2Cat.appendChild(footer2Name)
footer2Cat.appendChild(footer2Content)

const footer3Cat = makeElement('div', { className: 'category' });
const footer3Name = makeElement('div', "Favourite tools:");
const footer3Content = makeElement('div', { className: 'content' })

CONTENT.footer.tools.forEach(tool => footer3Content.appendChild(makeElement('p', tool)));
footer3Cat.appendChild(footer3Name)
footer3Cat.appendChild(footer3Content)


footer.appendChild(footer1Cat)
footer.appendChild(footer2Cat)
footer.appendChild(footer3Cat)
footer.appendChild(makeElement('p', `${(new Date()).getFullYear()} © fk.`))
document.body.appendChild(footer);


//  LOADING

export const loadingMess = makeElement('div', { id: 'loadingMess' }, "fk");
const sectionLoading = makeElement('section', {className: 'loading'});

const soundChoiceContainer = makeElement('div', { id: 'soundChoiceContainer' });
const soundChoiceQuestion = makeElement('div', { id: 'soundChoiceQuestion' }, "Enable audio ?");
export const enableSoundButton = makeElement('button', { id: 'enableSoundButton' }, "yes");
export const disableSoundButton = makeElement('button', { id: 'enableSoundButton', className: 'active' }, "no");

sectionLoading.appendChild(loadingMess)
soundChoiceContainer.appendChild(soundChoiceQuestion)
soundChoiceContainer.appendChild(enableSoundButton)
soundChoiceContainer.appendChild(disableSoundButton)
sectionLoading.appendChild(soundChoiceContainer)
main.appendChild(sectionLoading);



// FK

const sectionFk = makeElement('section', {className: 'fk'});
main.appendChild(sectionFk);

const hero = makeElement('div', { id: 'hero' });
export const heroContent1 = makeVanisher([
    makeElement('span', "f"),
    makeElement('span', "k"),
], makeElement('span'));
export const heroContent2 = makeVanisher([
    makeElement('span', "SOUND"),
    makeElement('span', "DESIGN"),
    makeElement('span', "CODE")
], makeElement('span'));

const heroContent = makeElement('span');
heroContent.appendChild(heroContent1.el)
heroContent.appendChild(heroContent2.el)
hero.appendChild(heroContent)

const homeArticle = makeElement('article');

const homeArticleContent = makeElement('div');
const homeDescriptionTitle = makeElement('h3', "SOUND x DESIGN x CODE")
const homeDescriptionParagraphs = CONTENT.fk.homeDescription.map(p => makeElement('p', p))

homeArticleContent.appendChild(homeDescriptionTitle)
homeDescriptionParagraphs.forEach(p => homeArticleContent.appendChild(p))
homeArticle.appendChild(homeArticleContent)
sectionFk.appendChild(hero);
sectionFk.appendChild(homeArticle);

const homeLinks = makeElement('div', {id: 'homeLinks'})
export const homeLink1 = makeElement('a', { className: 'homeLink', href: '/projects', alt: "Projects | François Kerforn" });
homeLink1.appendChild(makeElement('span', { className:"scrolling-text" }, "ROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * P" ))
homeLink1.appendChild(makeElement('span', { className:"scrolling-text" }, "ROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * PROJECTS * P"))

const homeLink2 = makeElement('a', { className: 'homeLink', href: `mailto:${CONTENT.footer.contact.mail}`, target: '_blank', alt: "Send e-mail"});
homeLink2.appendChild(makeElement('span', { className:"scrolling-text" }, "ACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONT" ))
homeLink2.appendChild(makeElement('span', { className:"scrolling-text" }, "ACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONTACT ↗ CONT" ))

homeLinks.appendChild(homeLink1);
homeLinks.appendChild(homeLink2);
sectionFk.appendChild(homeLinks);


// SECTION PROJECTS

const waveformsWidth = 128;
const waveformsheight = 128;

export const projectLinks = CONTENT.projects.map(project => {
    const el = makeElement('a', { href: project.href, className: 'projectLink', target: '_blank', alt: `Open project : ${project.name}`});
    el.appendChild(makeIcon(
        makeElement('div', {className: 'waveIcon'}),
        makePathes({ width: waveformsWidth, height: waveformsheight }),
        { width: '100%', height: '100%', viewBox: `0 0  ${waveformsWidth} ${waveformsheight}` }
    ))
    const container = makeElement('div', { className: 'text'});
    const els = [
        makeElement('div', project.name),
        makeElement('div', project.idObject.date),
        makeElement('div', "> " + project.idObject.type)
    ]
    els.forEach(el => {
        const mask = makeElement('span', {className: 'mask' });
        mask.appendChild(el)
        container.appendChild(mask)
    })
    container.querySelectorAll('.mask').forEach(el => el.setAttribute('data-text', el.textContent))
    el.appendChild(container)
    return el;
});

export const hyperLinks = CONTENT.links.map(project => {
    const el = makeElement('a', { href: project.href, className: 'hyperLink', target: '_blank', alt: `Visit project : ${project.name}`});
    el.appendChild(makeIcon(
        makeElement('div', {className: 'waveIcon'}),
        makePathes({ width: waveformsWidth, height: waveformsheight }),
        { width: '100%', height: '100%', viewBox: `0 0  ${waveformsWidth} ${waveformsheight}` }
    ))
    const container = makeElement('div', { className: 'text'});
    const els = [
        makeElement('div', project.name),
        makeElement('div', "> " + project.content[1]),
        makeElement('div', "> " + project.content[2])
    ]
    els.forEach(el => {
        const mask = makeElement('span', {className: 'mask' });
        mask.appendChild(el)
        container.appendChild(mask)
    })
    container.querySelectorAll('.mask').forEach(el => el.setAttribute('data-text', el.textContent))
    el.appendChild(container)
    return el;
});

const sectionProjects = makeElement('section', {className: 'projects'});
main.appendChild(sectionProjects);

const projectsTitle = makeElement('h2', { id: 'projectsTitle' }, "Projects");
sectionProjects.appendChild(projectsTitle);

const projectLinksEl = makeElement('div', { id: 'projectLinks'});
export const projectLinksGrid = makeElement('div', { id: 'projectLinksList'});

projectLinks.forEach((link, i) => {
    projectLinksGrid.appendChild(link);
});
hyperLinks.forEach((link, i) => {
    projectLinksGrid.appendChild(link);
});

projectLinksEl.appendChild(projectLinksGrid);
sectionProjects.appendChild(projectLinksEl);


// PROJECT

const makeIdItem = (k, v) => {
    const el = makeElement('p')
    const key = makeElement('span', k);
    const value = makeElement('span', v);
    el.appendChild(key);
    el.appendChild(value);
    return el;
}

const idContent = CONTENT.projects.map(project => {
    const container = makeElement('div', { className: 'projectInfo' });
    [ makeIdItem('Name:', project.idObject.name), makeIdItem('Date:', project.idObject.date), makeIdItem('Role:', project.idObject.role) ].forEach(item => container.appendChild(item));
    return container;
})

export const projectContent1 = CONTENT.projects.map(project => {
    const el1 = makeElement('article', { className: 'projectArticle1' });
    const p0 = makeElement('p');
    p0.innerHTML =  project.p[0];

    el1.appendChild(p0);

    return {
        el: el1,
        display: v => {
            el1.classList.toggle('display', v);
        }
    }
})

export const projectContent2 = CONTENT.projects.map(project => {
    const el2 = makeElement('article', { className: 'projectArticle2' });
    const paragraphs = project.p.map((str, i) => i > 0 && makeElement('p', str)).filter(el => el);

    paragraphs.forEach(el => el2.appendChild(el));

    if (paragraphs.length > 0) return {
        el: el2,
        display: bool => {
            el2.classList.toggle('display', bool);
        }
    }
})

export const backLinks = CONTENT.projects.map(_ => makeVanisher(
    [
        // makeElement('div', "← Close")
        makeElement('div', "x Close")
    ],
    makeElement('a', { href: '/projects', className: 'backLink', alt: "Projects | François Kerforn" }),
    { tMin: 650, tMax: 900 })
);

export const projectNames = CONTENT.projects.map(project => makeVanisherDisplay(
    project.name.split(''),
    makeElement('h2', {className: 'projectName'}, project.name),
    { tMin: 600, tMax: 1400, random: true }
));

CONTENT.projects.forEach((project, i) => {
    const section = makeElement('section', {className: 'project'});
    main.appendChild(section);
    section.appendChild(backLinks[i].el);
    projectContent1[i].el.insertBefore(idContent[i], projectContent1[i].el.childNodes[0]);
    projectContent1[i].el.insertBefore(projectNames[i].el, projectContent1[i].el.childNodes[0]);
   
    const projectArticleGrid = makeElement('div', {className: 'projectArticleGrid'});
    
    projectArticleGrid.appendChild(projectContent1[i].el);
    projectContent2[i]?.el && projectArticleGrid.appendChild(projectContent2[i].el);
    const link = makeElement(
        'a', { href: project.url, className: 'projectContentLinks', target: '_blank'}, 
    )
    const linkSpan = makeElement('span', 'Learn More ↗ ')
    link.setAttribute('data-text', linkSpan.textContent)
    link.appendChild(linkSpan)

    if (project.url) projectArticleGrid.lastChild.appendChild(
        link
    );

    section.appendChild(projectArticleGrid)
});


// CAROUSEL

export const arrows = [
    makeElement('button', { id: 'arrowLeft' }, "← Prev"),
    makeElement('button', { id: 'arrowRight' }, "Next →")
];

export const counter = makeElement('div', { id: 'counter'});

export const carousel = (() => {
    const el = makeElement('div', { id: 'carousel'})
    el.appendChild(arrows[0]);
    el.appendChild(counter)
    el.appendChild(arrows[1]);
    return {
        el: el,
    }
})();

document.body.insertBefore(carousel.el, footer);

// PROGRESS
export const progress = makeElement('div', { id: 'progress' })
export const progressContainer = makeElement('div', { id: 'progressContainer' })
progressContainer.appendChild(progress)
document.body.appendChild(progressContainer)