const CONTENT = Object.freeze({
    works: {
        meta: {
            title: "Works | François Kerforn",
            description: "Portfolio for François Kerforn's design and sound projects"
        }
    },
    about: {
        meta: {
            title: "About | François Kerforn",
            description: "Independant sound and interface designer"
        },
        name: "François Kerforn",
        description: "is an independant sound and interface designer with special interest in interactive systems. His artistic and musical background combined with design and programming abilities lead him to work in a variety of contexts. ",
        clients: ["(((Echora))) - Nadine Schütz", "Aurasens", "GHU Paris psychiatrie & neurosciences", "IRCAM", "Native Instruments"],
        contact: {
            mail: "contact.fk@proton.me",
            linkedin: "https://www.linkedin.com/in/fkerforn/"
        }
    },
    projects: [
        {
            meta: {
                description: "A digital musical instrument"
            },
            name: "Ksora",
            href: '/ksora',
            url: "https://ksora.herokuapp.com/",
            audio: 0,
            idObject: {
                name: "Ksora",
                date: "2020",
                type: "Application / sound installation",
                role: "Composer / developer"
            },
            description: "'Ksora' is a digital musical instrument. It can welcome multiple users on an interface that let us play and mix several sounds together."
        },
        {
            meta: {
                description: "A sound installation by Nadine Schütz"
            },
            name: "Boîte à Tubes #2",
            href: '/boite-a-tubes-2',
            url: "https://www.echora.ch/boite-a-tubes-2",
            audio: 1,
            idObject: {
                name: "Boîte à Tubes #2",
                date: "2021",
                type: "Sound installation",
                role: "Developer / musical programmer"
            },
            description: "'Boîte à tubes' is a sound installation by artist Nadine Schütz. It allows visitors to perform, record and send a digital musical postcard. Sound material from the past, present and future highlights the story of the place welcoming the installation – an ancient factory."
        },
        {
            meta: {
                description: "A sound walk in the old center of Le Mans"
            },
            name: "Errance et Rois",
            href: '/errance-et-rois',
            url: "https://esad-talm.fr/fr/actualites/errance-et-rois",
            audio: 2,
            idObject: {
                name: "Errance et Rois",
                date: "2019",
                type: "Sound walk",
                role: "Sound designer"
            },
            description: "'Errance et Rois' is a sound walk that takes its participants to the old center of Le Mans, a French city that preserves the traces of the Plantagenêt dynasty and of a strong medieval history. The sound walk offers a journey through various scenes inspired by the brothers Richard The Lionhearted and John Lackland."
        },
        {
            meta: {
                description: "A sound installation recreating a rainforest soundscape"
            },
            name: "Echotopie",
            href: '/echotopie',
            audio: 3,
            idObject: {
                name: "Echotopie",
                date: "2019",
                type: "Sound installation",
                role: "Musical programmer"
            },
            description: "'Echotopie' is a sound installation where attendants are immerged in a rainforest soundscape. The participants gestures can alter the composition and disrupt the soundscape, intentionally or unintentionally."
        },
        {
            meta: {
                description: 'A bruitist instrument along the canal of Bourgogne'
            },
            name: "Éclusophone",
            href: '/eclusophone',
            url: "https://www.lyonne.fr/tonnerre-89700/actualites/ce-drole-dinstrument-de-musique-a-douze-faces-est-installe-a-lecluse-darcot-entre-tonnerre-et-commissey_13951221/",
            audio: -1,
            idObject: {
                name: "Éclusophone",
                date: "2021",
                type: "Mechanical instrument",
                role: "Designer"
            },
            description: "An 'Éclusophone' can be found found during a promenade along the canal of Bourgogne. Rattles and clatters emanating from this metallic instrument thanks to several handles and crank arms will surprise and intringue passerbies."
        },
    ]
});