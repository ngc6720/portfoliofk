export default Object.freeze({
    sounds : {
        atmos: [
            { src: [ "./media/amb/amb2.opus", "./media/amb/amb2.m4a", "./media/amb/amb2.wav" ], win: [-1.2, 0.2]},
            { src: [ "./media/amb/amb3.opus", "./media/amb/amb3.m4a", "./media/amb/amb3.wav" ], win: [0.0, 0.3]},
            { src: [ "./media/amb/amb4.opus", "./media/amb/amb4.m4a", "./media/amb/amb4.wav" ], win: [0.15,0.4]},
            { src: [ "./media/amb/amb5.opus", "./media/amb/amb5.m4a", "./media/amb/amb5.wav" ], win: [0.25, 0.5]},
            { src: [ "./media/amb/amb6.opus", "./media/amb/amb6.m4a", "./media/amb/amb6.wav" ], win: [0.3, 0.55]},
            { src: [ "./media/amb/amb10.opus", "./media/amb/amb10.m4a", "./media/amb/amb10.wav" ], win: [0.35, 0.45]},
            { src: [ "./media/amb/amb7.opus", "./media/amb/amb7.m4a", "./media/amb/amb7.wav" ], win: [0.4, 0.92]},
            { src: [ "./media/amb/amb8.opus", "./media/amb/amb8.m4a", "./media/amb/amb8.wav" ], win: [0.65, 0.8]},
            { src: [ "./media/amb/amb9.opus", "./media/amb/amb9.m4a", "./media/amb/amb9.wav" ], win: [0.75, 1.1]},
        ],
        projects: [{ src:  ["./media/amb/amb1.opus", "./media/amb/amb1.m4a", "./media/amb/amb1.wav" ] }],
        os: [
            { src: [ "./media/os/hov1.opus", "./media/os/hov1.m4a", "./media/os/hov1.wav" ] },
            { src: [ "./media/os/hov2.opus", "./media/os/hov2.m4a", "./media/os/hov2.wav" ] },
            { src: [ "./media/os/hov3.opus", "./media/os/hov3.m4a", "./media/os/hov3.wav" ] },
        ]
    },
    fk: {
        meta: {
            title: "François Kerforn",
            description: "François Kerforn's Portfolio - Independant sound and interface designer"
        },
        homeDescription: [
            "I create and compose sounds for various purposes : immersive experiences, HCI, artistic works, soundtracks, sound design tools.",
            "Tayloring sounds to their future context is part of my process. I like to study and implement systems that suit specific experiences.",
            "My appetence for programming helps in producing fine-tuned interfaces.",
        ],
    },
    footer: {
        name: "François Kerforn",
        bio: "independant sound and interface designer-developer with special interest in interactive systems.",
        clients: ["(((Echora))) - Nadine Schütz", "Aurasens", "GHU Paris psychiatrie & neurosciences", "IRCAM", "Native Instruments"],
        contact: {
            mail: "contact.fk@proton.me",
            linkedin: "https://www.linkedin.com/in/fkerforn/"
        },
        tools: ["Ableton Live", "Maxmsp/M4L", "HTML/CSS", "Javascript", "WebAudio", "JUCE"]
    },
    projectsList: {
        meta: {
            title: "Projects | François Kerforn",
            description: "Sound and design projects"
        },
        
    },
    links: [
        {
            name: "rnbo-webaudio",
            href: "https://ngc6720.github.io/rnbo-webaudio/",
            content: [
                "rnbo-webaudio",
                "granular player",
                "rnbo javascript",
            ]
        },
        {
            name: "sente-waveterrain",
            href: "https://ngc6720.github.io/sente/",
            content: [
                "sente-waveterrain",
                "3d waveform",
                "audio synthesis",
            ]
        }
    ],
    projects: [
        {
            meta: {
                description: "A digital musical instrument"
            },
            name: "Iris",
            href: '/iris',
            url: "https://vimeo.com/778580675",
            audio: '',
            idObject: {
                name: "Iris",
                date: "2022",
                type: "Music / Installation",
                role: "Composer"
            },
            p: [
                    "<span>Iris</span> is a music composition that offers fragmented soundscapes for the listener to wander in. It is imagined as a sound installation where layers of sounds spread in the space.",
                    "The composition is meant to take several forms, adapting to the diffusion context. It was first commissioned by 'A More Beautiful Journey' and the 'MU' collective as two sound installations.",
                    "The first is using Soundways – an application for spatialized sound diffusion regarding users geopositioning – and is located in Trinity Bellwoods Park, Toronto. The latter is using Sound Delta – a device for spatialized immersive composition on headphones with radiowave tracking – and was created in La Station Gare des Mines, Paris.",
            ]
        },
        {
            meta: {
                description: "A digital musical instrument"
            },
            name: "Psyk",
            href: '/psyk',
            url: "https://www.ircam.fr/projects/pages/psy-son",
            audio: '',
            idObject: {
                name: "Psyk",
                date: "2021",
                type: "Web Application",
                role: "Designer / Developer"
            },
            p: [
                    "<span>Psyk</span> is the prototype of a web application made for music discovery and playlists creation in the context of psychiatric caretaking.",
                    "With a minimalistic interface it lets users browse music from different entry points to quickly compose playlists.",
                    "The application is part of a research project named Psyson and led by GHU Paris Psychiatrie & Neuroscience. The project includes the context for specific usage of the interface by caretakers and patients, as well as the listening environment.",
                    "The prototype offers several ways to find music and nudge the generated playlists using musical or emotional parameters."
            ]
        },
        {
            meta: {
                description: "A digital musical instrument"
            },
            name: "Ksora",
            href: '/ksora',
            url: "https://ksora.onrender.com",
            audio: '/media/extraits/ksora.mp3',
            idObject: {
                name: "Ksora",
                date: "2020",
                type: "Digital Instrument",
                role: "Composer / developer"
            },
            p: [
                    "<span>Ksora</span> is a digital musical instrument. It can welcome multiple users on an interface that let us play and mix several sounds together."
            ]
        },
        {
            meta: {
                description: "A sound installation by Nadine Schütz"
            },
            name: "Boîte à Tubes #2",
            href: '/boite-a-tubes-2',
            url: "https://www.echora.ch/boite-a-tubes-2",
            audio: '/media/extraits/boite-a-tubes.mp3',
            idObject: {
                name: "Boîte à Tubes #2",
                date: "2021",
                type: "Sound installation",
                role: "Developer / musical programmer"
            },
            p: [
                    "<span>Boîte à tubes</span> is a sound installation by artist Nadine Schütz. It allows visitors to perform, record and send a digital musical postcard. Sound material from the past, present and future highlights the story of the place welcoming the installation – an ancient factory.",
            ]
        },
        {
            meta: {
                description: "A sound walk in the old center of Le Mans"
            },
            name: "Errance et Rois",
            href: '/errance-et-rois',
            url: "https://esad-talm.fr/fr/actualites/errance-et-rois",
            audio: '/media/extraits/errance-et-rois.mp3',
            idObject: {
                name: "Errance et Rois",
                date: "2019",
                type: "Sound walk",
                role: "Sound designer"
            },
            p: [
                    "<span>Errance et Rois</span> is a sound walk that takes its participants to the old center of Le Mans, a French city that preserves the traces of the Plantagenêt dynasty and of a strong medieval history. The sound walk offers a journey through various scenes inspired by the brothers Richard The Lionhearted and John Lackland.",
            ]
        },
        {
            meta: {
                description: "A sound installation recreating a rainforest soundscape"
            },
            name: "Echotopie",
            href: '/echotopie',
            audio: '/media/extraits/echotopie.mp3',
            idObject: {
                name: "Echotopie",
                date: "2019",
                type: "Sound installation",
                role: "Musical programmer"
            },
            p: [
                    "<span>Echotopie</span> is a sound installation where attendants are immerged in a rainforest soundscape. The participants gestures can alter the composition and disrupt the soundscape, intentionally or unintentionally."
            ]
        },
        {
            meta: {
                description: 'A bruitist instrument along the canal of Bourgogne'
            },
            name: "Éclusophone",
            href: '/eclusophone',
            url: "https://www.lyonne.fr/tonnerre-89700/actualites/ce-drole-dinstrument-de-musique-a-douze-faces-est-installe-a-lecluse-darcot-entre-tonnerre-et-commissey_13951221/",
            audio: '',
            idObject: {
                name: "Éclusophone",
                date: "2021",
                type: "Mechanical instrument",
                role: "Designer"
            },
            p: [
                    "An <span>Éclusophone</span> can be found found during a promenade along the canal of Bourgogne. Rattles and clatters emanating from this metallic instrument thanks to several handles and crank arms will surprise and intringue passerbies.",
            ]
        },
    ],
    ascii: `-,,-=+++==--.._..,.._____.,,-=+CB;;:=--,.......,,-,                                                            ---==+++==-,.....,,..____.,-=:;C;;;:=-,,,.....,,--.                                                            ,--====---,,....,,,.._...,-+;CC;;;;:=-,,....,,,,,,_                                                            ,-------,,,....,-,,....,-=+:;C;;CCC;:=-,,,,---,,.,_                                                            -----,,,,,._....,,,....,=+;;;;;BAABC;:=-,,,+:+-...                                                             +=,....,,.__....,,..,,,+:;CBBBCBAAB;;+=,.,,:BCC::=_                                                            +=,......_____..,,..,--+;CAABAAABCCC:=-,.,-:CCCCC:_                                                            ==,..,,,._.___...,..,-+;CBAAAABBC;::=,...,-+::::C:_                                                            =-,........_______..,-=:CCBBBBCC;:==,....,-=+++++=_                                                            ,,,....,,,....___....,-+;;;;;;;:+=-,,....,-=++++==_                                                            ,,.....,,,,...__..__..--=+++++=--,,......,=====--,_                                                            ,._....,,-,,..__....._,,----,-,....___.,,-==--,..._                                                            ..__....,,,.._________.......,.___._..,-==+-,..___                                                             ..__...._,,.__________....__...___..,,-=+++-,,..__                                                             _____......._________________._____.____........__                                                             __.__........___.________..____                                                                                _...___..............____..___                                                                                 ..._____.............______              _                                                                     ________............_____             _.-.                                                                     ._______.............____            _,,-.                                                                     ,,._____....____.._.._            ...-==-.                                                                     =-,........___________           .-,-;:--.                                                                     +=-,,,,...._______.__          _,==+:C;=,                                                                      :=----,,,,,_._____..          _.=+:CC;+.                                                                       ;+=+=-,,,,.._______          _.-+:BB;=-_                                                                       :++++=--,.....____           .,=+C!B+-._                                                                    :++:+==,,.....___           ..-:;AB;=,.                                                                     ===++=-,,,..____            _.-;AB;+-._                                                                        ----=-,......_._             .-;CC:-,.                                                                         ,,.,,......_____             ,+BC;:=,.                                                                         .__.._.....____             .:BAB;:=._                                                                         _______......_          _.,-+!?!BC:=._                                                                         .__________.._          .=:B12?ACC+-_                                                                          ._____.._____         _=;;C!53AC;;+,__                                                                         .___........_    _    -CAC!24!;::+-.                                                                           .....,,,,..._   _,__ _C!AB122C:++=,.                                                                           ,,,,,,,==,..   _-+,._=AABA221;+==-..                                                                           ==-,,,,--,..  _.:+,.,;!CC!21A:=--,__                                                                           :++-,,---,..  ,,:=,,,?BCC?32A+=-,.__                                                                           B;:+-----,.. _,,=--,-1BC!?33A+=,,__                                                                            !C:+====-,.. .,,,--,+2C!?2541+-,,__                                                                            CC:+==--,,._ ....,,,:1A?1353?+-,.__                                                                            :+===--,-,._ ____...:1?32342!=,..__                                                                            --,--,,...._ ____...+!14333?A=,._    _                                                                         ,,,,,,....._ ___....+A14333!C=,.._                                                                             .....,....._ ___.,._,;12231A:-,___ __                                                                          .__........_ _....,..=!2???A;=,_ _  _                                                                          .......__.._ _....,,.,C!!!?!B:-._   _                                                                          ,,,...__...__.___.,,.-:CBA!!AC:,._  _                                _                                         ,,,...__.....,___.,,,-:CCCAB!!B-._  __                              ___                                        ,,.__....,,--,___.,,-:;CCCC;A22:,_____                              ___                                        ,,___.,,.,-=-,____.,:B;;CC;+;54C-._____                             ___                                        .._..,,,,-=+=,_ __.,:!;:CBC::67A+,_____                                                                        .._.,-===+:+-.__ _..:?;+:A?C;&8!+,__                                                                           ...,--=++;+,._____..:?C==;!!B371+,_                                __                                          ..,===+::;=.__..__..+1B=-=A1!262:.                                 ,___                                        ,,-:+:;;:+,____.__..-2!=--:?1!21=_                                _-,_                                         ,,-;::;;+=,_______..-??=--=C?!A;.                                 _-,_                                         ,-=;;:;:+=,________.,C?:==-+CC+_                                  _,,_                                         ,-=;:++++-.____   __.=A;:+-,-=-_                  _               _..                                          ,-=;=-===-____        ,+;;=,,-.                                                                                ,,-;-,,,.___ __        _.;C-,..   ..,,.       __                                                               ..,:-,,...__  _  _        ;,._  .;C?:,      ____                                                              _.,+,._____     __        -C+,_ _,:C!;=.___ _..__                                                              _.,-.    _       ___     __C+-.__,:;C;;=,_.__...___                                                            ..--.           ___._     _::=,__=;!C:;:-.,....____                                                            ,,-=,_  __     __..,.     _::;._.-C!!AC;,......____                                                            -=+++,_____    _..,-=-_____CAB-..,:AA?!C-,_....____                                                            CC;:++,.___    __.,-+=,,._.C??:,,,+BA!2?:-...,..._                                                             21?!A;-,.___   __.,-+=,-._,A23C+,,=CB!31;=,,,,._.__                                                            332!B;=,..._   _.,,,=-,,,.,A34!+,,,;C!31;+,,,.____                                                             CC;=-=,._._   __.,-,-==++-,?562:-..+:B21:-,...____                                                             +==-,,._    ____.,,,-==++-=1692:-._=+:A!C+-,...___                                                             +=-,,__      __..,,,-==++=+3782:-.,==-+BC:=....___                                                             ,,___        .,------==+:+:4882+--+++,,B!C+.....__                                                             ._         __,-======+=+::;5$&?+==+==..C4?:-...._                                                              ___        __,++++:::+++++;27&!=,-=,.__B64C+,.._                                                               ______    _.,=;;::;;;:+===:A?4C,_    ,387B+,.__                                                               _  __ .,-=+;CAAAAAABC:+==+:::C=.     :1597!:,.__                                                               .,=+++;B!?22311?!!ABC;====+::BA+   ,+A?276A+,._                                                                ,:B!ABA1112221?!AABC;:=---+;;??1=_,B;;C!55A+-.___                                                              -;;BC;CAAA????!AAB;:+=-,,,-:;1A2!:CBC:C?55A=,.___                                                              =;;;:+;CABBAAAB;;::=--,,,..+:?B43;:;+-+C!B+=-,.__          ___                                                 ;C;;+=+:;::::::===--,,,.___-+;C3?=,.__  ,=CC=-,.__         ___                                                 +;:+---=======--,--,.....__.-+::;:,_  _.=CC:=-,,._          __                                                 +:=-,,,----,,,..___..__.____.--,-?2+..._.+===---,._          _                                                 !!C:==--,,,,,,.._____________,-==A?+._  __.-=:;:=-.     ________                                               54?C:+=---,,,,.._____________,--=;B=.___   =B?1A;=._   _________                                               22?C+-,,,,,,,,..____________.,-,-=;:-,,   _-A32B;=.  ___...____         ___   ___.._   _.                      ?!B:=,,.,,,,..._____________,,-,,,+CA1A....,C51C:,_  _.._..____   _  ___..._  .,-==-._...__                    AB;=,,.,-,.._______  ______.,,-,.,=CA58!,._.:2?;=____..._____________.......__,-+;;+=,,,....__                 ;:=-.......__ _____ _ __..,,--=+---:B28?,__.=AA:,__.......__________,,,,,.....,-:CB;+-,,..,.,,.                ---,..__...__________ __.,----==---=:!5?,___.-:-...........________.,,,--,,..,-+;AAB;=-,.....,.__              ,,...___..._______    _.------------=;23+_  _.-,,,,,,,,,,...._..__.,-----,...,=:CA!AC=-,........__             ..._____......__    ___,,----------=+:;?C-,..,,,,,,,,,,,,....____,-=+===+=,,,-=:C!31B+-...._....___            ........,..______  _.,,,---=-------=:::AA:=-=+++,,,,,,,,........__,::+==+=-,,-+;A661:=,,..._._.__              .,,,,,,,,..____  ___.,..,--======--=:;A66&45A;:::-,,,,,,,.....___.,CC;:+++=--=:A5Ý7!=-,,_________              ,,---,.....__ _____.....,=+======--=:!$&8$5&B;:+CB-,,..,,..,..___.:?!AC;;:+==+A3&Ý4;=-,,....._____..._         --==-,,,..________.,,,.,=++-,,,,=+;B!Ý&9W&88A::+;?!-,..,,..,.___.-?21?!AAC;::C37Ý9!+=-,,,,,....,,-=+=.__       ==--,,,.._________,,----==-,,,-=+!33&$8WÝ8W2?;;++!1B=,.,,...___..=3332221!ABA?4$Å2:+=,,,,,,,,-+:++:+-,,,.____  ----,..._________.,,,-+++=-,,,+?4668W79Å9&9!!B?B=C2?C:-,.....___,?2344576311139W7C=----,,,,,=;ABBB;====--,.,.__---,..___  ______.,,,,--+==+++156$&Å98ÝÝ88?ABC6?=+32!AA+--,..._.-!235679733235&8A+=====-----C32?!:==:+==+:;;:=--,,..____________..,-=-,=+:CC155$WÝ$9ÝÅ971;CC;82,-!3!!AB:!43+,,,-:13479&53323682+==-==+=---+14!:=-----+CA??ABC;,,,,.____________.,.,,-+;;CC?559ÅÅÅ9$&97!;::;;7?=.;5?AB!;B7&A=,..,A15$Ý94344451C==-===:+,-=A41;+----=:C?34432!C,,,,.______   __._..,-;CC;A1239ÅÅÅ&99764+=:+:C6;::C43C;;;:4&3=._.+?60ÇÝ8333321C=-==+++:+--+23!C+---++B?47764!:=,,,,._______  __...-:CBCC?3336Å00W8777?B+=+==C6C:4&1?C;CBB4&4+=+;B1ÅÇÇÝ943221A;=--=+++:+--C34!C:--=+;!36776?;:=,....________ _.,-=;BC;C14546WÇ0Ý76672;=-==--B6C:88BCC!?3Ç01++==:B50Ç0W732211B:=--=:++:+==A54!B;===:B257862C;:=..____________,-==:BBCA134558ÅÇÅ&6594;=-----=!5C;85B;;:C4W8;-,,=+B9ÇÇÅ&62121AC+--==::::+++?66?B:::;C!46773;;;=-...._______..,--=:CCA!245567900$7587A=------+13;!94B;:;B7Ý2=,,-=:AWÇÇÝ95211!C;+====++:+++C2781ABBBCB46663B+++=-,.....____..,,-=+::B?2466777WÇÅ86893+=---,-+C3?;391C;:C!9Å2=-,-=+!ÝÇ0W74211AC:+=====+++=+A478?!12?BA6663C::===-,.____ ___.,-=++:CA1124688690Ç&7996C-=----+;?2CC9&2B;:C!8W2=---=+2ÇÇÝ8632?!C::+----==+==+B464?2661B1875!;++==-,`
});