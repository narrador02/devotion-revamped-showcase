#!/usr/bin/env python3
"""
Add SEO translations to all remaining locale files.
This script adds the SEO section with translations to ca.json, it.json, fr.json, de.json, pt.json, and nl.json
"""

import json
import os

# Base directory for locale files
LOCALE_DIR = "src/i18n/locales"

# SEO translations for each language
seo_translations = {
    "ca": {
        "site": {
            "name": "DevotionSim",
            "tagline": "Simuladors Premium de Motos",
            "defaultDescription": "Experimenta l'emoció de les curses professionals de MotoGP amb els simuladors de motos d'alt rendiment de DevotionSim. Simuladors oficials de MotoGP per a entrenament, entreteniment i esdeveniments."
        },
        "home": {
            "title": "DevotionSim | Simuladors Professionals MotoGP i Experiència de Curses",
            "description": "Descobreix simuladors premium de motos amb sistemes de moviment de fins a 4 eixos. Simuladors oficials de MotoGP per a entrenament professional, centres d'entreteniment i esdeveniments. Experimenta sensacions autèntiques de circuit.",
            "keywords": "simulador de motos, simulador motogp, simulador de curses, simulador de moto, entrenament professional, curses VR, simulador de moviment, entrenament de circuit, devotionsim"
        },
        "simulators": {
            "title": "Simuladors de Motos | Models Time Attack, Slady i Top Gun",
            "description": "Explora la nostra gamma de simuladors professionals de motos: Time Attack (2 eixos), Slady (3 eixos amb lliscament), i Top Gun (4 eixos moviment complet). Construïts per a operació 24/7 amb angles d'inclinació fins a 54°.",
            "keywords": "simulador time attack, simulador slady, simulador top gun, simulador 2 eixos, simulador drift 3 eixos, simulador moviment 4 eixos, simulador curses professional"
        },
        "reviews": {
            "title": "Ressenyes de Clients i Testimonis | Experiència DevotionSim",
            "description": "Mira testimonis en vídeo de pilots professionals de MotoGP i clients d'esdeveniments. Descobreix per què milers confien en DevotionSim per a l'experiència de simulació de motos més realista.",
            "keywords": "ressenyes clients, testimonis pilots professionals, pilots motogp, ressenyes simulador, comentaris clients, testimonis esdeveniments"
        },
        "events": {
            "title": "Esdeveniments i Grans Premis MotoGP | Presència Mundial DevotionSim",
            "description": "DevotionSim en Grans Premis de MotoGP i esdeveniments internacionals. Més de 380+ Grans Premis, 470+ esdeveniments totals i 28,000+ participants des de 2018. Porta emoció al teu proper esdeveniment.",
            "keywords": "esdeveniments motogp, grans premis, esdeveniments de motos, lloguer simulador, activació esdeveniments, esdeveniments corporatius, fires, fan zone"
        },
        "rentPurchase": {
            "title": "Lloguer o Compra de Simuladors de Motos | Aconsegueix el teu DevotionSim",
            "description": "Opcions flexibles de lloguer i compra per a simuladors de motos DevotionSim. Enviament mundial, instal·lació experta i garantia completa. Perfecte per a negocis, esdeveniments i centres d'entreteniment.",
            "keywords": "comprar simulador motos, llogar simulador, compra simulador, lloguer simulador, enviament mundial, simulador negoci, equip centre entreteniment"
        },
        "about": {
            "title": "Sobre DevotionSim | Passió per les Curses i Excel·lència en Enginyeria",
            "description": "Coneix la missió de DevotionSim d'unir les curses virtuals i la física del món real. Construït per pilots per a pilots, creem les eines d'entrenament de motos més realistes disponibles.",
            "keywords": "sobre devotionsim, missió empresa, passió curses, excel·lència enginyeria, fabricant simuladors, eines entrenament professional"
        },
        "contact": {
            "title": "Contacte | DevotionSim - Consultes Simuladors Professionals",
            "description": "Posa't en contacte amb DevotionSim per a consultes sobre simuladors, lloguers per a esdeveniments o informació de compra. Ubicats a Madrid, Espanya amb enviament mundial. Resposta garantida en 24 hores.",
            "keywords": "contacte devotionsim, consulta simulador, informació lloguer, consulta compra, enviament mundial, madrid espanya, suport client"
        },
        "vr": {
            "title": "Experiència VR | Curses Immersives MotoGP amb Realitat Virtual",
            "description": "Immersió total amb simuladors de motos compatibles amb VR. Compatible amb Meta Quest, HTC Vive, Valve Index. Experimenta MotoGP, Ride 4 i Assetto Corsa en realitat virtual impressionant.",
            "keywords": "simulador vr motos, curses realitat virtual, compatible meta quest, motogp vr, curses immersives, gaming vr, curses 360 graus"
        }
    },
    "it": {
        "site": {
            "name": "DevotionSim",
            "tagline": "Simulatori Premium per Moto",
            "defaultDescription": "Vivi l'emozione delle corse professionali MotoGP con i simulatori per moto ad alte prestazioni di DevotionSim. Simulatori ufficiali MotoGP per allenamento, intrattenimento ed eventi."
        },
        "home": {
            "title": "DevotionSim | Simulatori Professionali MotoGP ed Esperienza di Corsa",
            "description": "Scopri simulatori premium per moto con sistemi di movimento fino a 4 assi. Simulatori ufficiali MotoGP per allenamento professionale, centri di intrattenimento ed eventi. Sperimenta sensazioni autentiche del circuito.",
            "keywords": "simulatore moto, simulatore motogp, simulatore corse, simulatore moto, allenamento professionale, corse VR, simulatore movimento, allenamento circuito, devotionsim"
        },
        "simulators": {
            "title": "Simulatori per Moto | Modelli Time Attack, Slady e Top Gun",
            "description": "Esplora la nostra gamma di simulatori professionali per moto: Time Attack (2 assi), Slady (3 assi con derapata), e Top Gun (4 assi movimento completo). Costruiti per operazione 24/7 con angoli di piega fino a 54°.",
            "keywords": "simulatore time attack, simulatore slady, simulatore top gun, simulatore 2 assi, simulatore drift 3 assi, simulatore movimento 4 assi, simulatore corse professionale"
        },
        "reviews": {
            "title": "Recensioni Clienti e Testimonianze | Esperienza DevotionSim",
            "description": "Guarda le testimonianze video di piloti professionisti MotoGP e clienti di eventi. Scopri perché migliaia si fidano di DevotionSim per l'esperienza di simulazione moto più realistica.",
            "keywords": "recensioni clienti, testimonianze piloti professionisti, piloti motogp, recensioni simulatore, feedback clienti, testimonianze eventi"
        },
        "events": {
            "title": "Eventi e Gran Premi MotoGP | Presenza Mondiale DevotionSim",
            "description": "DevotionSim ai Gran Premi MotoGP e eventi internazionali. Oltre 380+ Gran Premi, 470+ eventi totali e 28.000+ partecipanti dal 2018. Porta emozione al tuo prossimo evento.",
            "keywords": "eventi motogp, gran premi, eventi moto, noleggio simulatore, attivazione eventi, eventi aziendali, fiere, fan zone"
        },
        "rentPurchase": {
            "title": "Noleggio o Acquisto Simulatori per Moto | Ottieni il tuo DevotionSim",
            "description": "Opzioni flessibili di noleggio e acquisto per simulatori per moto DevotionSim. Spedizione mondiale, installazione esperta e garanzia completa. Perfetto per aziende, eventi e centri di intrattenimento.",
            "keywords": "acquistare simulatore moto, noleggiare simulatore, acquisto simulatore, noleggio simulatore, spedizione mondiale, simulatore aziendale, attrezzatura centro intrattenimento"
        },
        "about": {
            "title": "Chi Siamo DevotionSim | Passione per le Corse ed Eccellenza Ingegneristica",
            "description": "Scopri la missione di DevotionSim di collegare le corse virtuali e la fisica del mondo reale. Costruito da piloti per piloti, creiamo gli strumenti di allenamento moto più realistici disponibili.",
            "keywords": "chi siamo devotionsim, missione aziendale, passione corse, eccellenza ingegneristica, produttore simulatori, strumenti allenamento professionale"
        },
        "contact": {
            "title": "Contatto | DevotionSim - Richieste Simulatori Professionali",
            "description": "Mettiti in contatto con DevotionSim per richieste sui simulatori, noleggi per eventi o informazioni sull'acquisto. Con sede a Madrid, Spagna con spedizione mondiale. Risposta garantita entro 24 ore.",
            "keywords": "contatto devotionsim, richiesta simulatore, informazioni noleggio, richiesta acquisto, spedizione mondiale, madrid spagna, supporto clienti"
        },
        "vr": {
            "title": "Esperienza VR | Corse Immersive MotoGP con Realtà Virtuale",
            "description": "Immersione totale con simulatori per moto compatibili VR. Compatibile con Meta Quest, HTC Vive, Valve Index. Sperimenta MotoGP, Ride 4 e Assetto Corsa in splendida realtà virtuale.",
            "keywords": "simulatore vr moto, corse realtà virtuale, compatibile meta quest, motogp vr, corse immersive, gaming vr, corse 360 gradi"
        }
    },
    "fr": {
        "site": {
            "name": "DevotionSim",
            "tagline": "Simulateurs Premium de Moto",
            "defaultDescription": "Vivez l'émotion des courses professionnelles MotoGP avec les simulateurs de moto haute performance de DevotionSim. Simulateurs officiels MotoGP pour l'entraînement, le divertissement et les événements."
        },
        "home": {
            "title": "DevotionSim | Simulateurs Professionnels MotoGP et Expérience de Course",
            "description": "Découvrez des simulateurs de moto premium avec des systèmes de mouvement jusqu'à 4 axes. Simulateurs officiels MotoGP pour l'entraînement professionnel, les centres de divertissement et les événements. Vivez des sensations authentiques de circuit.",
            "keywords": "simulateur de moto, simulateur motogp, simulateur de course, simulateur moto, entraînement professionnel, courses VR, simulateur de mouvement, entraînement circuit, devotionsim"
        },
        "simulators": {
            "title": "Simulateurs de Moto | Modèles Time Attack, Slady et Top Gun",
            "description": "Explorez notre gamme de simulateurs professionnels de moto: Time Attack (2 axes), Slady (3 axes avec dérapage), et Top Gun (4 axes mouvement complet). Construits pour une opération 24/7 avec des angles d'inclinaison jusqu'à 54°.",
            "keywords": "simulateur time attack, simulateur slady, simulateur top gun, simulateur 2 axes, simulateur drift 3 axes, simulateur mouvement 4 axes, simulateur course professionnel"
        },
        "reviews": {
            "title": "Avis Clients et Témoignages | Expérience DevotionSim",
            "description": "Regardez des témoignages vidéo de pilotes professionnels MotoGP et de clients d'événements. Découvrez pourquoi des milliers font confiance à DevotionSim pour l'expérience de simulation moto la plus réaliste.",
            "keywords": "avis clients, témoignages pilotes professionnels, pilotes motogp, avis simulateur, retours clients, témoignages événements"
        },
        "events": {
            "title": "Événements et Grands Prix MotoGP | Présence Mondiale DevotionSim",
            "description": "DevotionSim aux Grands Prix MotoGP et événements internationaux. Plus de 380+ Grands Prix, 470+ événements totaux et 28 000+ participants depuis 2018. Apportez de l'excitation à votre prochain événement.",
            "keywords": "événements motogp, grands prix, événements moto, location simulateur, activation événements, événements d'entreprise, salons, fan zone"
        },
        "rentPurchase": {
            "title": "Location ou Achat de Simulateurs de Moto | Obtenez votre DevotionSim",
            "description": "Options flexibles de location et d'achat pour les simulateurs de moto DevotionSim. Expédition mondiale, installation experte et garantie complète. Parfait pour les entreprises, événements et centres de divertissement.",
            "keywords": "acheter simulateur moto, louer simulateur, achat simulateur, location simulateur, expédition mondiale, simulateur professionnel, équipement centre divertissement"
        },
        "about": {
            "title": "À Propos de DevotionSim | Passion pour la Course et Excellence Ingénierie",
            "description": "Découvrez la mission de DevotionSim de relier les courses virtuelles et la physique du monde réel. Construit par des pilotes pour des pilotes, nous créons les outils d'entraînement moto les plus réalistes disponibles.",
            "keywords": "à propos devotionsim, mission entreprise, passion course, excellence ingénierie, fabricant simulateurs, outils entraînement professionnel"
        },
        "contact": {
            "title": "Contact | DevotionSim - Demandes Simulateurs Professionnels",
            "description": "Contactez DevotionSim pour des demandes sur les simulateurs, locations d'événements ou informations d'achat. Basés à Madrid, Espagne avec expédition mondiale. Réponse garantie sous 24 heures.",
            "keywords": "contact devotionsim, demande simulateur, informations location, demande achat, expédition mondiale, madrid espagne, support client"
        },
        "vr": {
            "title": "Expérience VR | Courses Immersives MotoGP avec Réalité Virtuelle",
            "description": "Immersion totale avec simulateurs de moto compatibles VR. Compatible avec Meta Quest, HTC Vive, Valve Index. Vivez MotoGP, Ride 4 et Assetto Corsa en réalité virtuelle époustouflante.",
            "keywords": "simulateur vr moto, courses réalité virtuelle, compatible meta quest, motogp vr, courses immersives, gaming vr, courses 360 degrés"
        }
    },
    "de": {
        "site": {
            "name": "DevotionSim",
            "tagline": "Premium Motorrad-Simulatoren",
            "defaultDescription": "Erleben Sie den Nervenkitzel professionellen MotoGP-Rennsports mit DevotionSims Hochleistungs-Motorradsimulatoren. Offizielle MotoGP-Simulatoren für Training, Unterhaltung und Events."
        },
        "home": {
            "title": "DevotionSim | Professionelle MotoGP-Simulatoren & Rennerlebnis",
            "description": "Entdecken Sie Premium-Motorradsimulatoren mit bis zu 4-Achsen-Bewegungssystemen. Offizielle MotoGP-Simulatoren für professionelles Training, Unterhaltungszentren und Events. Erleben Sie authentische Rennstrecken-Sensationen.",
            "keywords": "Motorradsimulator, motogp simulator, Rennsimulator, Bike-Simulator, professionelles Training, VR-Rennen, Bewegungssimulator, Rennstreckentraining, devotionsim"
        },
        "simulators": {
            "title": "Motorrad-Simulatoren | Time Attack, Slady & Top Gun Modelle",
            "description": "Erkunden Sie unsere Palette professioneller Motorradsimulatoren: Time Attack (2-Achsen), Slady (3-Achsen mit Drift), und Top Gun (4-Achsen vollständige Bewegung). Gebaut für 24/7-Betrieb mit Schräglagenwinkel bis zu 54°.",
            "keywords": "time attack simulator, slady simulator, top gun simulator, 2-achsen simulator, 3-achsen drift simulator, 4-achsen bewegungssimulator, professioneller rennsimulator"
        },
        "reviews": {
            "title": "Kundenbewertungen & Erfahrungsberichte | DevotionSim Erlebnis",
            "description": "Sehen Sie Video-Testimonials von professionellen MotoGP-Fahrern und Event-Kunden. Erfahren Sie, warum Tausende DevotionSim für das realistischste Motorrad-Simulationserlebnis vertrauen.",
            "keywords": "kundenbewertungen, erfahrungsberichte profis, motogp fahrer, simulator bewertungen, kundenfeedback, event testimonials"
        },
        "events": {
            "title": "Events & MotoGP Grand Prix | DevotionSim Weltweite Präsenz",
            "description": "DevotionSim bei MotoGP Grand Prix und internationalen Events. Über 380+ Grand Prix, 470+ Events gesamt und 28.000+ Teilnehmer seit 2018. Bringen Sie Spannung zu Ihrem nächsten Event.",
            "keywords": "motogp events, grand prix, motorrad events, simulator miete, event aktivierung, firmenevents, messen, fan zone"
        },
        "rentPurchase": {
            "title": "Mieten oder Kaufen von Motorrad-Simulatoren | Holen Sie sich Ihren DevotionSim",
            "description": "Flexible Miet- und Kaufoptionen für DevotionSim Motorradsimulatoren. Weltweiter Versand, Experteninstallation und umfassende Garantie. Perfekt für Unternehmen, Events und Unterhaltungszentren.",
            "keywords": "motorradsimulator kaufen, simulator mieten, simulator kauf, simulator miete, weltweiter versand, business simulator, unterhaltungszentrum ausrüstung"
        },
        "about": {
            "title": "Über DevotionSim | Leidenschaft für Rennsport & Engineering-Exzellenz",
            "description": "Erfahren Sie mehr über DevotionSims Mission, virtuellen Rennsport und reale Physik zu verbinden. Von Fahrern für Fahrer gebaut, schaffen wir die realistischsten Motorrad-Trainingswerkzeuge.",
            "keywords": "über devotionsim, unternehmensmission, rennsport leidenschaft, engineering exzellenz, simulator hersteller, professionelle trainingswerkzeuge"
        },
        "contact": {
            "title": "Kontakt | DevotionSim - Professionelle Simulator-Anfragen",
            "description": "Kontaktieren Sie DevotionSim für Simulator-Anfragen, Event-Vermietung oder Kaufinformationen. Ansässig in Madrid, Spanien mit weltweitem Versand. Antwort innerhalb 24 Stunden garantiert.",
            "keywords": "kontakt devotionsim, simulator anfrage, mietinformationen, kaufanfrage, weltweiter versand, madrid spanien, kundensupport"
        },
        "vr": {
            "title": "VR-Erlebnis | Immersives MotoGP-Rennen mit Virtual Reality",
            "description": "Totale Immersion mit VR-kompatiblen Motorradsimulatoren. Kompatibel mit Meta Quest, HTC Vive, Valve Index. Erleben Sie MotoGP, Ride 4 und Assetto Corsa in atemberaubender Virtual Reality.",
            "keywords": "vr motorradsimulator, virtual reality rennen, meta quest kompatibel, motogp vr, immersives rennen, vr gaming, 360 grad rennen"
        }
    },
    "pt": {
        "site": {
            "name": "DevotionSim",
            "tagline": "Simuladores Premium de Motos",
            "defaultDescription": "Experimente a emoção das corridas profissionais de MotoGP com os simuladores de motos de alto desempenho da DevotionSim. Simuladores oficiais MotoGP para treino, entretenimento e eventos."
        },
        "home": {
            "title": "DevotionSim | Simuladores Profissionais MotoGP e Experiência de Corrida",
            "description": "Descubra simuladores premium de motos com sistemas de movimento de até 4 eixos. Simuladores oficiais MotoGP para treino profissional, centros de entretenimento e eventos. Experimente sensações autênticas de circuito.",
            "keywords": "simulador de motos, simulador motogp, simulador de corrida, simulador moto, treino profissional, corridas VR, simulador de movimento, treino de circuito, devotionsim"
        },
        "simulators": {
            "title": "Simuladores de Motos | Modelos Time Attack, Slady e Top Gun",
            "description": "Explore nossa gama de simuladores profissionais de motos: Time Attack (2 eixos), Slady (3 eixos com derrapagem), e Top Gun (4 eixos movimento completo). Construídos para operação 24/7 com ângulos de inclinação até 54°.",
            "keywords": "simulador time attack, simulador slady, simulador top gun, simulador 2 eixos, simulador drift 3 eixos, simulador movimento 4 eixos, simulador corridas profissional"
        },
        "reviews": {
            "title": "Avaliações de Clientes e Testemunhos | Experiência DevotionSim",
            "description": "Assista testemunhos em vídeo de pilotos profissionais de MotoGP e clientes de eventos. Veja por que milhares confiam na DevotionSim para a experiência de simulação de motos mais realista.",
            "keywords": "avaliações clientes, testemunhos pilotos profissionais, pilotos motogp, avaliações simulador, feedback clientes, testemunhos eventos"
        },
        "events": {
            "title": "Eventos e Grande Prêmio MotoGP | Presença Mundial DevotionSim",
            "description": "DevotionSim em Grande Prêmios MotoGP e eventos internacionais. Mais de 380+ Grande Prêmios, 470+ eventos totais e 28.000+ participantes desde 2018. Traga emoção ao seu próximo evento.",
            "keywords": "eventos motogp, grande prêmio, eventos motos, aluguel simulador, ativação eventos, eventos corporativos, feiras, fan zone"
        },
        "rentPurchase": {
            "title": "Aluguel ou Compra de Simuladores de Motos | Obtenha seu DevotionSim",
            "description": "Opções flexíveis de aluguel e compra para simuladores de motos DevotionSim. Envio mundial, instalação especializada e garantia completa. Perfeito para negócios, eventos e centros de entretenimento.",
            "keywords": "comprar simulador motos, alugar simulador, compra simulador, aluguel simulador, envio mundial, simulador negócio, equipamento centro entretenimento"
        },
        "about": {
            "title": "Sobre DevotionSim | Paixão por Corridas e Excelência em Engenharia",
            "description": "Conheça a missão da DevotionSim de unir corridas virtuais e física do mundo real. Construído por pilotos para pilotos, criamos as ferramentas de treino de motos mais realistas disponíveis.",
            "keywords": "sobre devotionsim, missão empresa, paixão corridas, excelência engenharia, fabricante simuladores, ferramentas treino profissional"
        },
        "contact": {
            "title": "Contato | DevotionSim - Consultas Simuladores Profissionais",
            "description": "Entre em contato com DevotionSim para consultas sobre simuladores, aluguéis para eventos ou informações de compra. Localizado em Madrid, Espanha com envio mundial. Resposta garantida em 24 horas.",
            "keywords": "contato devotionsim, consulta simulador, informações aluguel, consulta compra, envio mundial, madrid espanha, suporte cliente"
        },
        "vr": {
            "title": "Experiência VR | Corridas Imersivas MotoGP com Realidade Virtual",
            "description": "Imersão total com simuladores de motos compatíveis com VR. Compatível com Meta Quest, HTC Vive, Valve Index. Experimente MotoGP, Ride 4 e Assetto Corsa em realidade virtual deslumbrante.",
            "keywords": "simulador vr motos, corridas realidade virtual, compatível meta quest, motogp vr, corridas imersivas, gaming vr, corridas 360 graus"
        }
    },
    "nl": {
        "site": {
            "name": "DevotionSim",
            "tagline": "Premium Motorsimulators",
            "defaultDescription": "Ervaar de sensatie van professioneel MotoGP-racen met DevotionSim's hoogpresterende motorsimulators. Officiële MotoGP-simulators voor training, entertainment en evenementen."
        },
        "home": {
            "title": "DevotionSim | Professionele MotoGP-simulators & Race-ervaring",
            "description": "Ontdek premium motorsimulators met bewegingssystemen tot 4 assen. Officiële MotoGP-simulators voor professionele training, entertainmentcentra en evenementen. Ervaar authentieke circuit sensaties.",
            "keywords": "motorsimulator, motogp simulator, racesimulator, motor simulator, professionele training, VR racen, bewegingssimulator, circuit training, devotionsim"
        },
        "simulators": {
            "title": "Motorsimulators | Time Attack, Slady & Top Gun Modellen",
            "description": "Verken ons assortiment professionele motorsimulators: Time Attack (2-assen), Slady (3-assen met drift), en Top Gun (4-assen volledige beweging). Gebouwd voor 24/7 gebruik met hellingshoeken tot 54°.",
            "keywords": "time attack simulator, slady simulator, top gun simulator, 2-assen simulator, 3-assen drift simulator, 4-assen bewegingssimulator, professionele racesimulator"
        },
        "reviews": {
            "title": "Klantbeoordelingen & Getuigenissen | DevotionSim Ervaring",
            "description": "Bekijk video getuigenissen van professionele MotoGP-coureurs en evenementklanten. Ontdek waarom duizenden DevotionSim vertrouwen voor de meest realistische motorsimulatie-ervaring.",
            "keywords": "klantbeoordelingen, getuigenissen professionele coureurs, motogp coureurs, simulatorbeoordelingen, klantfeedback, evenement getuigenissen"
        },
        "events": {
            "title": "Evenementen & MotoGP Grand Prix | DevotionSim Wereldwijde Aanwezigheid",
            "description": "DevotionSim bij MotoGP Grand Prix en internationale evenementen. Meer dan 380+ Grand Prix, 470+ totale evenementen en 28.000+ deelnemers sinds 2018. Breng spanning naar uw volgende evenement.",
            "keywords": "motogp evenementen, grand prix, motor evenementen, simulator verhuur, evenement activatie, bedrijfsevenementen, beurzen, fan zone"
        },
        "rentPurchase": {
            "title": "Huur of Koop Motorsimulators | Krijg uw DevotionSim",
            "description": "Flexibele verhuur- en aankoopopties voor DevotionSim motorsimulators. Wereldwijde verzending, professionele installatie en volledige garantie. Perfect voor bedrijven, evenementen en entertainmentcentra.",
            "keywords": "motorsimulator kopen, simulator huren, simulator aankoop, simulator verhuur, wereldwijde verzending, zakelijke simulator, entertainmentcentrum apparatuur"
        },
        "about": {
            "title": "Over DevotionSim | Passie voor Racen & Engineering Excellence",
            "description": "Leer over DevotionSim's missie om virtueel racen en echte fysica te verbinden. Gebouwd door coureurs voor coureurs, creëren we de meest realistische motortrainingstools die beschikbaar zijn.",
            "keywords": "over devotionsim, bedrijfsmissie, race passie, engineering excellentie, simulator fabrikant, professionele trainingstools"
        },
        "contact": {
            "title": "Contact | DevotionSim - Professionele Simulator Vragen",
            "description": "Neem contact op met DevotionSim voor simulator vragen, evenement verhuur of aankoop informatie. Gevestigd in Madrid, Spanje met wereldwijde verzending. Gegarandeerde reactie binnen 24 uur.",
            "keywords": "contact devotionsim, simulator vraag, verhuurinformatie, aankoop vraag, wereldwijde verzending, madrid spanje, klantenondersteuning"
        },
        "vr": {
            "title": "VR-ervaring | Meeslepend MotoGP-racen met Virtual Reality",
            "description": "Totale immersie met VR-compatibele motorsimulators. Compatibel met Meta Quest, HTC Vive, Valve Index. Ervaar MotoGP, Ride 4 en Assetto Corsa in verbluffende virtual reality.",
            "keywords": "vr motorsimulator, virtual reality racen, meta quest compatibel, motogp vr, meeslepend racen, vr gaming, 360 graden racen"
        }
    }
}

def add_seo_to_locale(locale_code, seo_data):
    """Add SEO section to a specific locale file"""
    file_path = os.path.join(LOCALE_DIR, f"{locale_code}.json")
    
    # Read existing file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add SEO section
    data['seo'] = seo_data
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Added SEO translations to {locale_code}.json")

def main():
    """Main function to add SEO to all locale files"""
    print("Adding SEO translations to locale files...")
    
    for locale_code, seo_data in seo_translations.items():
        try:
            add_seo_to_locale(locale_code, seo_data)
        except Exception as e:
            print(f"✗ Error adding SEO to {locale_code}.json: {e}")
    
    print("\n✓ SEO translations added successfully to all locale files!")

if __name__ == "__main__":
    main()
