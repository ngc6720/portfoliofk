export default Object.freeze({
  sounds: {
    atmos: [
      {
        src: [
          "./media/amb/amb2.opus",
          "./media/amb/amb2.m4a",
          "./media/amb/amb2.wav",
        ],
        win: [-1.2, 0.2],
      },
      {
        src: [
          "./media/amb/amb3.opus",
          "./media/amb/amb3.m4a",
          "./media/amb/amb3.wav",
        ],
        win: [0.0, 0.3],
      },
      {
        src: [
          "./media/amb/amb4.opus",
          "./media/amb/amb4.m4a",
          "./media/amb/amb4.wav",
        ],
        win: [0.15, 0.4],
      },
      {
        src: [
          "./media/amb/amb5.opus",
          "./media/amb/amb5.m4a",
          "./media/amb/amb5.wav",
        ],
        win: [0.25, 0.5],
      },
      {
        src: [
          "./media/amb/amb6.opus",
          "./media/amb/amb6.m4a",
          "./media/amb/amb6.wav",
        ],
        win: [0.3, 0.55],
      },
      {
        src: [
          "./media/amb/amb10.opus",
          "./media/amb/amb10.m4a",
          "./media/amb/amb10.wav",
        ],
        win: [0.35, 0.45],
      },
      {
        src: [
          "./media/amb/amb7.opus",
          "./media/amb/amb7.m4a",
          "./media/amb/amb7.wav",
        ],
        win: [0.4, 0.92],
      },
      {
        src: [
          "./media/amb/amb8.opus",
          "./media/amb/amb8.m4a",
          "./media/amb/amb8.wav",
        ],
        win: [0.65, 0.8],
      },
      {
        src: [
          "./media/amb/amb9.opus",
          "./media/amb/amb9.m4a",
          "./media/amb/amb9.wav",
        ],
        win: [0.75, 1.1],
      },
    ],
    projects: [
      {
        src: [
          "./media/amb/amb1.opus",
          "./media/amb/amb1.m4a",
          "./media/amb/amb1.wav",
        ],
      },
    ],
    os: [
      {
        src: ["./media/os/1.opus", "./media/os/1.m4a", "./media/os/1.wav"],
      },
      {
        src: ["./media/os/2.opus", "./media/os/2.m4a", "./media/os/2.wav"],
      },
      {
        src: ["./media/os/3.opus", "./media/os/3.m4a", "./media/os/3.wav"],
      },
      {
        src: ["./media/os/1b.opus", "./media/os/1b.m4a", "./media/os/1b.wav"],
      },
      {
        src: ["./media/os/t1.opus", "./media/os/t1.m4a", "./media/os/t1.wav"],
      },
      {
        src: ["./media/os/t2.opus", "./media/os/t2.m4a", "./media/os/t2.wav"],
      },
    ],
  },
  fk: {
    meta: {
      title: "François Kerforn",
      description:
        "François Kerforn's Portfolio - Software developer, Audio designer",
    },
    homeDescription: [
      "Hi! I am a software developer focusing on web applications.",
      "I mainly write websites and fullstack applications. I also like to implement designs and systems taylored for specific audiovisual experiences.",
      "My journey as an independant developer led me to work on various products: applications, immersive experiences, HCI and artistic works.",
    ],
  },
  footer: {
    name: "François Kerforn",
    bio: "François Kerforn / I am a software developer with a focus on web applications and front-end. I worked as an independant with diverse clients, artists, researchers and manufacturers. I also do creative coding and audio design. I am open for work, as freelance or full time. Let's talk!",
    contact: {
      mail: "fk.contactme@gmail.com",
      bluesky: "https://bsky.app/profile/francoiskerforn.bsky.social",
      github: "https://github.com/ngc6720/",
      linkedin: "https://www.linkedin.com/in/fkerforn/",
    },
  },
  projectsList: {
    meta: {
      title: "Projects | François Kerforn",
      description: "Sound and design projects",
    },
  },
  links: [
    {
      name: "Granulizer",
      href: "https://ngc6720.github.io/rnbo-webaudio/",
      content: ["rnbo-webaudio", "Granular player", "RNBO/JS"],
    },
    {
      name: "Waveterrain",
      href: "https://ngc6720.github.io/sente/",
      content: ["sente-waveterrain", "Audio synthesis", "Webaudio"],
    },
    {
      name: "Parapluie",
      href: "https://parapluie.pages.dev/",
      content: ["Parapluie", "Weather app", "Vuejs/Nuxt"],
    },
    {
      name: "Jardin d'automne",
      href: "https://jardin-automne.vercel.app/",
      content: ["3d scene", "3d scene of a garden", "three.js journey"],
    },
  ],
  projects: [
    {
      meta: {
        description: "A sound installation",
      },
      name: "Iris",
      href: "/iris",
      url: "https://vimeo.com/778580675",
      audio: [],
      idObject: {
        name: "Iris",
        date: "2022",
        type: "Music / Installation",
        role: "Composer",
      },
      p: [
        "<span>Iris</span> is a music composition that offers fragmented soundscapes for the listener to wander in. It is imagined as a sound installation where layers of sounds spread in the space.",
        "The composition is meant to take several forms, adapting to the diffusion context. It was first commissioned by 'A More Beautiful Journey' and the 'MU' collective as two sound installations.",
        "The first is using Soundways – an application for spatialized sound diffusion regarding users geopositioning – and is located in Trinity Bellwoods Park, Toronto. The latter is using Sound Delta – a device for spatialized immersive composition on headphones with radiowave tracking – and was created in La Station Gare des Mines, Paris.",
      ],
    },
    {
      meta: {
        description: "A web application",
      },
      name: "Psyk",
      href: "/psyk",
      url: "https://www.ircam.fr/projects/pages/psy-son",
      audio: [],
      idObject: {
        name: "Psyk",
        date: "2021",
        type: "Web Application",
        role: "Designer / Developer",
      },
      p: [
        "<span>Psyk</span> is the prototype of a web application made for music discovery and playlists creation in the context of psychiatric caretaking.",
        "With a minimalistic interface it lets users browse music from different entry points to quickly compose playlists.",
        "The application is part of a research project named Psyson and led by GHU Paris Psychiatrie & Neuroscience. The project includes the context for specific usage of the interface by caretakers and patients, as well as the listening environment.",
        "The prototype offers several ways to find music and nudge the generated playlists using musical or emotional parameters.",
      ],
    },
    {
      meta: {
        description: "A digital musical instrument",
      },
      name: "Ksora",
      href: "/ksora",
      url: "https://ksora.onrender.com",
      audio: ["/media/extraits/ksora.opus", "/media/extraits/ksora.mp3"],
      idObject: {
        name: "Ksora",
        date: "2020",
        type: "Digital Instrument",
        role: "Composer / developer",
      },
      p: [
        "<span>Ksora</span> is a digital musical instrument. It can welcome multiple users on an interface that let us play and mix several sounds together.",
      ],
    },
    {
      meta: {
        description: "A sound installation by Nadine Schütz",
      },
      name: "Boîte à Tubes #2",
      href: "/boite-a-tubes-2",
      url: "https://www.echora.ch/boite-a-tubes-2",
      audio: [
        "/media/extraits/boite-a-tubes.opus",
        "/media/extraits/boite-a-tubes.mp3",
      ],
      idObject: {
        name: "Boîte à Tubes #2",
        date: "2021",
        type: "Sound installation",
        role: "Developer / musical programmer",
      },
      p: [
        "<span>Boîte à tubes</span> is a sound installation by artist Nadine Schütz. It allows visitors to perform, record and send a digital musical postcard. Sound material from the past, present and future highlights the story of the place welcoming the installation – an ancient factory.",
      ],
    },
    {
      meta: {
        description: "A sound walk in the old center of Le Mans",
      },
      name: "Errance et Rois",
      href: "/errance-et-rois",
      url: "https://esad-talm.fr/fr/actualites/errance-et-rois",
      audio: [
        "/media/extraits/errance-et-rois.opus",
        "/media/extraits/errance-et-rois.mp3",
      ],
      idObject: {
        name: "Errance et Rois",
        date: "2019",
        type: "Sound walk",
        role: "Sound designer",
      },
      p: [
        "<span>Errance et Rois</span> is a sound walk that takes its participants to the old center of Le Mans, a French city that preserves the traces of the Plantagenêt dynasty and of a strong medieval history. The sound walk offers a journey through various scenes inspired by the brothers Richard The Lionhearted and John Lackland.",
      ],
    },
    {
      meta: {
        description: "A sound installation recreating a rainforest soundscape",
      },
      name: "Echotopie",
      href: "/echotopie",
      audio: [
        "/media/extraits/echotopie.opus",
        "/media/extraits/echotopie.mp3",
      ],
      idObject: {
        name: "Echotopie",
        date: "2019",
        type: "Sound installation",
        role: "Musical programmer",
      },
      p: [
        "<span>Echotopie</span> is a sound installation where attendants are immerged in a rainforest soundscape. The participants gestures can alter the composition and disrupt the soundscape, intentionally or unintentionally.",
      ],
    },
    {
      meta: {
        description: "A bruitist instrument along the canal of Bourgogne",
      },
      name: "Éclusophone",
      href: "/eclusophone",
      url: "https://www.lyonne.fr/tonnerre-89700/actualites/ce-drole-dinstrument-de-musique-a-douze-faces-est-installe-a-lecluse-darcot-entre-tonnerre-et-commissey_13951221/",
      audio: [],
      idObject: {
        name: "Éclusophone",
        date: "2021",
        type: "Mechanical instrument",
        role: "Designer",
      },
      p: [
        "An <span>Éclusophone</span> can be found found during a promenade along the canal of Bourgogne. Rattles and clatters emanating from this metallic instrument thanks to several handles and crank arms will surprise and intringue passerbies.",
      ],
    },
  ],
});
