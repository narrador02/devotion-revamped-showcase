import json
import os

# Base directory
base_dir = r"c:\Users\jairo\devotion\devotion-revamped-showcase\src\i18n\locales"

# Translations for remaining languages
translations = {
    "fr": {
        "nav_vr": "Expérience VR",
        "about": {
            "title": "À propos",
            "subtitle": "DevotionSim",
            "description": "Né d'une passion pour la course et d'un dévouement à l'excellence en ingénierie.",
            "missionTitle": "Notre Mission",
            "missionText1": "Chez DevotionSim, nous comblons le fossé entre les courses virtuelles et la physique du monde réel. Notre mission est de fournir aux pilotes professionnels et aux passionnés les outils d'entraînement les plus réalistes disponibles.",
            "missionText2": "Nous croyons que la simulation n'est pas seulement un jeu, c'est un outil crucial pour le développement, la sécurité et l'amélioration des performances.",
            "values": {
                "innovation": "Innovation",
                "innovationDesc": "Repoussant constamment les limites de la technologie de mouvement.",
                "quality": "Qualité",
                "qualityDesc": "Composants de qualité industrielle pour une durabilité 24/7.",
                "passion": "Passion",
                "passionDesc": "Construit par des pilotes, pour des pilotes."
            }
        },
        "contactPage": {
            "title": "Contactez",
            "subtitle": "Nous",
            "description": "Prêt à vivre la simulation ultime? Nous sommes là pour vous aider.",
            "getInTouch": "Entrer en Contact",
            "form": {
                "name": "Nom",
                "email": "Email",
                "subject": "Sujet",
                "message": "Message",
                "send": "Envoyer le Message",
                "sent": "Message Envoyé",
                "sentDesc": "Nous vous recontacterons dès que possible."
            }
        },
        "vr": {
            "title": "AU-DELÀ DE LA RÉALITÉ",
            "subtitle": "Entrez dans le circuit. Ressentez chaque virage. Immersion totale avec l'intégration VR.",
            "cta": "Explorer la Compatibilité",
            "features": {
                "universal": "Support Universel",
                "universalDesc": "Compatible avec tous les principaux casques VR, y compris Meta Quest, HTC Vive et Valve Index.",
                "gameReady": "Prêt à Jouer",
                "gameReadyDesc": "Intégration transparente avec la série MotoGP™, Ride 4 et Assetto Corsa.",
                "zeroLatency": "Latence Zéro",
                "zeroLatencyDesc": "Télémétrie optimisée pour une synchronisation sans lag entre le mouvement et les visuels."
            },
            "immersion": {
                "title": "Ressentez la",
                "highlight": "Vitesse",
                "description": "Notre logiciel propriétaire traduit chaque bosse, virage et accélération directement sur le châssis du simulateur. Combiné avec la VR, votre cerveau est trompé en croyant que vous êtes vraiment sur la piste.",
                "telemetry": "Traitement de la télémétrie en temps réel",
                "audio": "Intégration audio spatiale",
                "haptic": "Support de retour haptique"
            }
        },
        "useCases": {
            "title": "Pour qui est",
            "highlight": "DevotionSim",
            "suffix": " ?",
            "subtitle": "La polyvalence rencontre la performance. Choisissez votre voie.",
            "professional": {
                "title": "Entraînement Professionnel",
                "desc": "Pour les pilotes professionnels qui doivent entraîner la mémoire musculaire, apprendre de nouvelles pistes et se remettre de blessures sans risque."
            },
            "entertainment": {
                "title": "Divertissement",
                "desc": "L'expérience de jeu ultime. Ressentez l'adrénaline de MotoGP à la maison. Défiez vos amis et participez en ligne."
            },
            "schools": {
                "title": "Écoles de Conduite",
                "desc": "Formation sûre et efficace pour les étudiants. Enseignez la posture correcte et le contrôle de la moto dans un environnement contrôlé.",
                "learnMore": "En Savoir Plus"
            },
            "learnMore": "En Savoir Plus"
        }
    },
    "ca": {
        "nav_vr": "Experiència VR",
        "about": {
            "title": "Sobre",
            "subtitle": "DevotionSim",
            "description": "Nascut d'una passió per les curses i una dedicació a l'excel·lència en enginyeria.",
            "missionTitle": "La Nostra Missió",
            "missionText1": "A DevotionSim, tanquem la bretxa entre les curses virtuals i la física del món real. La nostra missió és proporcionar als pilots professionals i entusiastes les eines d'entrenament més realistes disponibles.",
            "missionText2": "Creiem que la simulació no és només un joc, és una eina crucial per al desenvolupament, la seguretat i la millora del rendiment.",
            "values": {
                "innovation": "Innovació",
                "innovationDesc": "Empenyent constantment els límits de la tecnologia de moviment.",
                "quality": "Qualitat",
                "qualityDesc": "Components de grau industrial per a durabilitat 24/7.",
                "passion": "Passió",
                "passionDesc": "Creat per pilots, per a pilots."
            }
        },
        "contactPage": {
            "title": "Contacta",
            "subtitle": "amb Nosaltres",
            "description": "A punt per experimentar la simulació definitiva? Estem aquí per ajudar.",
            "getInTouch": "Posa't en Contacte",
            "form": {
                "name": "Nom",
                "email": "Correu electrònic",
                "subject": "Assumpte",
                "message": "Missatge",
                "send": "Enviar Missatge",
                "sent": "Missatge Enviat",
                "sentDesc": "Ens posarem en contacte amb tu el més aviat possible."
            }
        },
        "vr": {
            "title": "MÉS ENLLÀ DE LA REALITAT",
            "subtitle": "Entra al circuit. Sent cada revolt. Immersió total amb integració VR.",
            "cta": "Explorar Compatibilitat",
            "features": {
                "universal": "Suport Universal",
                "universalDesc": "Compatible amb tots els principals visors VR incloent Meta Quest, HTC Vive i Valve Index.",
                "gameReady": "A punt per Jugar",
                "gameReadyDesc": "Integració perfecta amb la sèrie MotoGP™, Ride 4 i Assetto Corsa.",
                "zeroLatency": "Zero Latència",
                "zeroLatencyDesc": "Telemetria optimitzada per a sincronització sense lag entre moviment i visuals."
            },
            "immersion": {
                "title": "Sent la",
                "highlight": "Velocitat",
                "description": "El nostre programari propietari tradueix cada sotrac, gir i acceleració directament al xassís del simulador. Quan es combina amb VR, el teu cervell és enganyat creient que estàs realment a la pista.",
                "telemetry": "Processament de telemetria en temps real",
                "audio": "Integració d'àudio espacial",
                "haptic": "Suport de retroalimentació hàptica"
            }
        },
        "useCases": {
            "title": "Per a qui és",
            "highlight": "DevotionSim",
            "suffix": "?",
            "subtitle": "Versatilitat i rendiment. Tria el teu camí.",
            "professional": {
                "title": "Entrenament Professional",
                "desc": "Per a pilots professionals que necessiten entrenar memòria muscular, aprendre nous circuits i recuperar-se de lesions sense risc."
            },
            "entertainment": {
                "title": "Entreteniment",
                "desc": "L'experiència de joc definitiva. Sent l'adrenalina de MotoGP a casa. Desafia amics i competeix online."
            },
            "schools": {
                "title": "Autoescoles",
                "desc": "Entrenament segur i eficient per a estudiants. Ensenya postura correcta i control de la moto en un entorn controlat.",
                "learnMore": "Saber Més"
            },
            "learnMore": "Saber Més"
        }
    },
    "nl": {
        "nav_vr": "VR Ervaring",
        "about": {
            "title": "Over",
            "subtitle": "DevotionSim",
            "description": "Geboren uit een passie voor racen en een toewijding aan technische excellentie.",
            "missionTitle": "Onze Missie",
            "missionText1": "Bij DevotionSim overbruggen we de kloof tussen virtueel racen en echte fysica. Onze missie is om professionele rijders en enthousiastelingen de meest realistische trainingstools te bieden.",
            "missionText2": "We geloven dat simulatie niet alleen een spel is—het is een cruciaal hulpmiddel voor ontwikkeling, veiligheid en prestatieverbetering.",
            "values": {
                "innovation": "Innovatie",
                "innovationDesc": "Voortdurend de grenzen van bewegingstechnologie verleggen.",
                "quality": "Kwaliteit",
                "qualityDesc": "Industriële componenten voor 24/7 duurzaamheid.",
                "passion": "Passie",
                "passionDesc": "Gebouwd door rijders, voor rijders."
            }
        },
        "contactPage": {
            "title": "Contact",
            "subtitle": "Opnemen",
            "description": "Klaar om de ultieme simulatie te ervaren? We zijn hier om te helpen.",
            "getInTouch": "Neem Contact Op",
            "form": {
                "name": "Naam",
                "email": "E-mail",
                "subject": "Onderwerp",
                "message": "Bericht",
                "send": "Bericht Verzenden",
                "sent": "Bericht Verzonden",
                "sentDesc": "We nemen zo snel mogelijk contact met u op."
            }
        },
        "vr": {
            "title": "VOORBIJ DE REALITEIT",
            "subtitle": "Stap het circuit binnen. Voel elke bocht. Totale onderdompeling met VR-integratie.",
            "cta": "Verken Compatibiliteit",
            "features": {
                "universal": "Universele Ondersteuning",
                "universalDesc": "Compatibel met alle grote VR-headsets, waaronder Meta Quest, HTC Vive en Valve Index.",
                "gameReady": "Klaar voor Spelen",
                "gameReadyDesc": "Naadloze integratie met MotoGP™-serie, Ride 4 en Assetto Corsa.",
                "zeroLatency": "Nul Latentie",
                "zeroLatencyDesc": "Geoptimaliseerde telemetrie voor lag-vrije synchronisatie tussen beweging en beelden."
            },
            "immersion": {
                "title": "Voel de",
                "highlight": "Snelheid",
                "description": "Onze eigen software vertaalt elke hobbel, bocht en versnelling direct naar het chassis van de simulator. In combinatie met VR wordt je brein misleid te geloven dat je echt op het circuit bent.",
                "telemetry": "Real-time telemetrieverwerking",
                "audio": "Ruimtelijke audio-integratie",
                "haptic": "Haptische feedbackondersteuning"
            }
        },
        "useCases": {
            "title": "Voor wie is",
            "highlight": "DevotionSim",
            "suffix": "?",
            "subtitle": "Veelzijdigheid ontmoet prestaties. Kies je pad.",
            "professional": {
                "title": "Professionele Training",
                "desc": "Voor professionele rijders die spiergeheugen moeten trainen, nieuwe circuits moeten leren en zonder risico moeten herstellen van blessures."
            },
            "entertainment": {
                "title": "Entertainment",
                "desc": "De ultieme game-ervaring. Voel de adrenaline van MotoGP thuis. Daag vrienden uit en race online."
            },
            "schools": {
                "title": "Rijscholen",
                "desc": "Veilige en efficiënte training voor studenten. Leer de juiste houding en motorcontrole in een gecontroleerde omgeving.",
                "learnMore": "Meer Informatie"
            },
            "learnMore": "Meer Informatie"
        }
    },
    "it": {
        "nav_vr": "Esperienza VR",
        "about": {
            "title": "Chi",
            "subtitle": "Siamo",
            "description": "Nato da una passione per le corse e una dedizione all'eccellenza ingegneristica.",
            "missionTitle": "La Nostra Missione",
            "missionText1": "In DevotionSim, colmiamo il divario tra le corse virtuali e la fisica del mondo reale. La nostra missione è fornire ai piloti professionisti e agli appassionati gli strumenti di allenamento più realistici disponibili.",
            "missionText2": "Crediamo che la simulazione non sia solo un gioco, è uno strumento cruciale per lo sviluppo, la sicurezza e il miglioramento delle prestazioni.",
            "values": {
                "innovation": "Innovazione",
                "innovationDesc": "Spingendo costantemente i confini della tecnologia di movimento.",
                "quality": "Qualità",
                "qualityDesc": "Componenti di grado industriale per una durata 24/7.",
                "passion": "Passione",
                "passionDesc": "Creato da piloti, per piloti."
            }
        },
        "contactPage": {
            "title": "Contatta",
            "subtitle": "Noi",
            "description": "Pronto a vivere la simulazione definitiva? Siamo qui per aiutare.",
            "getInTouch": "Mettiti in Contatto",
            "form": {
                "name": "Nome",
                "email": "Email",
                "subject": "Oggetto",
                "message": "Messaggio",
                "send": "Invia Messaggio",
                "sent": "Messaggio Inviato",
                "sentDesc": "Ti risponderemo il prima possibile."
            }
        },
        "vr": {
            "title": "OLTRE LA REALTÀ",
            "subtitle": "Entra nel circuito. Senti ogni curva. Immersione totale con integrazione VR.",
            "cta": "Esplora Compatibilità",
            "features": {
                "universal": "Supporto Universale",
                "universalDesc": "Compatibile con tutti i principali visori VR inclusi Meta Quest, HTC Vive e Valve Index.",
                "gameReady": "Pronto per il Gioco",
                "gameReadyDesc": "Integrazione perfetta con la serie MotoGP™, Ride 4 e Assetto Corsa.",
                "zeroLatency": "Zero Latenza",
                "zeroLatencyDesc": "Telemetria ottimizzata per sincronizzazione senza lag tra movimento e immagini."
            },
            "immersion": {
                "title": "Senti la",
                "highlight": "Velocità",
                "description": "Il nostro software proprietario traduce ogni dosso, curva e accelerazione direttamente al telaio del simulatore. Quando combinato con la VR, il tuo cervello è ingannato credendo di essere veramente in pista.",
                "telemetry": "Elaborazione telemetria in tempo reale",
                "audio": "Integrazione audio spaziale",
                "haptic": "Supporto feedback tattile"
            }
        },
        "useCases": {
            "title": "Per chi è",
            "highlight": "DevotionSim",
            "suffix": "?",
            "subtitle": "La versatilità incontra le prestazioni. Scegli il tuo percorso.",
            "professional": {
                "title": "Allenamento Professionale",
                "desc": "Per piloti professionisti che devono allenare la memoria muscolare, imparare nuovi circuiti e recuperare da infortuni senza rischi."
            },
            "entertainment": {
                "title": "Intrattenimento",
                "desc": "L'esperienza di gioco definitiva. Senti l'adrenalina della MotoGP a casa. Sfida gli amici e competi online."
            },
            "schools": {
                "title": "Scuole Guida",
                "desc": "Allenamento sicuro ed efficiente per studenti. Insegna la postura corretta e il controllo della moto in un ambiente controllato.",
                "learnMore": "Scopri di Più"
            },
            "learnMore": "Scopri di Più"
        }
    },
    "de": {
        "nav_vr": "VR-Erlebnis",
        "about": {
            "title": "Über",
            "subtitle": "DevotionSim",
            "description": "Geboren aus Leidenschaft für den Rennsport und Hingabe an technische Exzellenz.",
            "missionTitle": "Unsere Mission",
            "missionText1": "Bei DevotionSim überbrücken wir die Lücke zwischen virtuellem Rennsport und der Physik der realen Welt. Unsere Mission ist es, professionellen Fahrern und Enthusiasten die realistischsten Trainingswerkzeuge zur Verfügung zu stellen.",
            "missionText2": "Wir glauben, dass Simulation nicht nur ein Spiel ist – es ist ein entscheidendes Werkzeug für Entwicklung, Sicherheit und Leistungssteigerung.",
            "values": {
                "innovation": "Innovation",
                "innovationDesc": "Ständiges Erweitern der Grenzen der Bewegungstechnologie.",
                "quality": "Qualität",
                "qualityDesc": "Industriekomponenten für 24/7 Haltbarkeit.",
                "passion": "Leidenschaft",
                "passionDesc": "Von Fahrern für Fahrer entwickelt."
            }
        },
        "contactPage": {
            "title": "Kontaktieren Sie",
            "subtitle": "Uns",
            "description": "Bereit für die ultimative Simulation? Wir sind hier, um zu helfen.",
            "getInTouch": "Nehmen Sie Kontakt auf",
            "form": {
                "name": "Name",
                "email": "E-Mail",
                "subject": "Betreff",
                "message": "Nachricht",
                "send": "Nachricht Senden",
                "sent": "Nachricht Gesendet",
                "sentDesc": "Wir werden uns so schnell wie möglich bei Ihnen melden."
            }
        },
        "vr": {
            "title": "JENSEITS DER REALITÄT",
            "subtitle": "Betreten Sie die Rennstrecke. Spüren Sie jede Kurve. Totale Immersion mit VR-Integration.",
            "cta": "Kompatibilität Entdecken",
            "features": {
                "universal": "Universelle Unterstützung",
                "universalDesc": "Kompatibel mit allen gängigen VR-Headsets einschließlich Meta Quest, HTC Vive und Valve Index.",
                "gameReady": "Spielbereit",
                "gameReadyDesc": "Nahtlose Integration mit MotoGP™ Serie, Ride 4 und Assetto Corsa.",
                "zeroLatency": "Null Latenz",
                "zeroLatencyDesc": "Optimierte Telemetrie für verzögerungsfreie Synchronisation zwischen Bewegung und Bild."
            },
            "immersion": {
                "title": "Spüren Sie die",
                "highlight": "Geschwindigkeit",
                "description": "Unsere proprietäre Software übersetzt jede Bodenwelle, Kurve und Beschleunigung direkt auf das Simulator-Chassis. In Kombination mit VR wird Ihr Gehirn getäuscht zu glauben, dass Sie wirklich auf der Strecke sind.",
                "telemetry": "Echtzeit-Telemetrieverarbeitung",
                "audio": "Räumliche Audio-Integration",
                "haptic": "Haptisches Feedback Unterstützung"
            }
        },
        "useCases": {
            "title": "Für wen ist",
            "highlight": "DevotionSim",
            "suffix": "?",
            "subtitle": "Vielseitigkeit trifft Leistung. Wählen Sie Ihren Weg.",
            "professional": {
                "title": "Professionelles Training",
                "desc": "Für professionelle Fahrer, die Muskelgedächtnis trainieren, neue Strecken lernen und sich ohne Risiko von Verletzungen erholen müssen."
            },
            "entertainment": {
                "title": "Unterhaltung",
                "desc": "Das ultimative Spielerlebnis. Spüren Sie das Adrenalin der MotoGP zu Hause. Fordern Sie Freunde heraus und treten Sie online an."
            },
            "schools": {
                "title": "Fahrschulen",
                "desc": "Sicheres und effizientes Training für Schüler. Lehren Sie korrekte Haltung und Motorradbeherrschung in einer kontrollierten Umgebung.",
                "learnMore": "Mehr Erfahren"
            },
            "learnMore": "Mehr Erfahren"
        }
    },
    "pt": {
        "nav_vr": "Experiência VR",
        "about": {
            "title": "Sobre",
            "subtitle": "DevotionSim",
            "description": "Nascido de uma paixão por corridas e uma dedicação à excelência em engenharia.",
            "missionTitle": "Nossa Missão",
            "missionText1": "Na DevotionSim, preenchemos a lacuna entre as corridas virtuais e a física do mundo real. Nossa missão é fornecer aos pilotos profissionais e entusiastas as ferramentas de treinamento mais realistas disponíveis.",
            "missionText2": "Acreditamos que a simulação não é apenas um jogo - é uma ferramenta crucial para o desenvolvimento, segurança e melhoria de desempenho.",
            "values": {
                "innovation": "Inovação",
                "innovationDesc": "Constantemente expandindo os limites da tecnologia de movimento.",
                "quality": "Qualidade",
                "qualityDesc": "Componentes de grau industrial para durabilidade 24/7.",
                "passion": "Paixão",
                "passionDesc": "Criado por pilotos, para pilotos."
            }
        },
        "contactPage": {
            "title": "Contate",
            "subtitle": "Nos",
            "description": "Pronto para experimentar a simulação definitiva? Estamos aqui para ajudar.",
            "getInTouch": "Entre em Contato",
            "form": {
                "name": "Nome",
                "email": "Email",
                "subject": "Assunto",
                "message": "Mensagem",
                "send": "Enviar Mensagem",
                "sent": "Mensagem Enviada",
                "sentDesc": "Entraremos em contato o mais breve possível."
            }
        },
        "vr": {
            "title": "ALÉM DA REALIDADE",
            "subtitle": "Entre no circuito. Sinta cada curva. Imersão total com integração VR.",
            "cta": "Explorar Compatibilidade",
            "features": {
                "universal": "Suporte Universal",
                "universalDesc": "Compatível com todos os principais headsets VR, incluindo Meta Quest, HTC Vive e Valve Index.",
                "gameReady": "Pronto para Jogar",
                "gameReadyDesc": "Integração perfeita com a série MotoGP™, Ride 4 e Assetto Corsa.",
                "zeroLatency": "Zero Latência",
                "zeroLatencyDesc": "Telemetria otimizada para sincronização sem lag entre movimento e visuais."
            },
            "immersion": {
                "title": "Sinta a",
                "highlight": "Velocidade",
                "description": "Nosso software proprietário traduz cada solavanco, curva e aceleração diretamente para o chassi do simulador. Quando combinado com VR, seu cérebro é enganado acreditando que você está realmente na pista.",
                "telemetry": "Processamento de telemetria em tempo real",
                "audio": "Integração de áudio espacial",
                "haptic": "Suporte a feedback háptico"
            }
        },
        "useCases": {
            "title": "Para quem é",
            "highlight": "DevotionSim",
            "suffix": "?",
            "subtitle": "Versatilidade encontra desempenho. Escolha seu caminho.",
            "professional": {
                "title": "Treinamento Profissional",
                "desc": "Para pilotos profissionais que precisam treinar memória muscular, aprender novas pistas e se recuperar de lesões sem risco."
            },
            "entertainment": {
                "title": "Entretenimento",
                "desc": "A experiência de jogo definitiva. Sinta a adrenalina da MotoGP em casa. Desafie amigos e compita online."
            },
            "schools": {
                "title": "Autoescolas",
                "desc": "Treinamento seguro e eficiente para alunos. Ensine a postura correta e o controle da moto em um ambiente controlado.",
                "learnMore": "Saiba Mais"
            },
            "learnMore": "Saiba Mais"
        }
    }
}

# Process each language
for lang_code, lang_data in translations.items():
    file_path = os.path.join(base_dir, f"{lang_code}.json")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add nav.vr
    data["nav"]["vr"] = lang_data["nav_vr"]
    
    # Add other sections
    data["about"] = lang_data["about"]
    data["contactPage"] = lang_data["contactPage"]
    data["vr"] = lang_data["vr"]
    data["useCases"] = lang_data["useCases"]
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Updated {lang_code}.json successfully")

print("\nDone! Updated all 6 remaining language files.")
