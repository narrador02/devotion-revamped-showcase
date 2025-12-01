import json
import os

# Define the missing keys for all languages
missing_keys = {
    "en": {
        "nav_vr": "VR Experience",
        "about": {
            "title": "About",
            "subtitle": "DevotionSim",
            "description": "Born from a passion for racing and a dedication to engineering excellence.",
            "missionTitle": "Our Mission",
            "missionText1": "At DevotionSim, we bridge the gap between virtual racing and real-world physics. Our mission is to provide professional riders and enthusiasts with the most realistic training tools available.",
            "missionText2": "We believe that simulation isn't just a game—it's a crucial tool for development, safety, and performance improvement.",
            "values": {
                "innovation": "Innovation",
                "innovationDesc": "Constantly pushing the boundaries of motion technology.",
                "quality": "Quality",
                "qualityDesc": "Industrial-grade components for 24/7 durability.",
                "passion": "Passion",
                "passionDesc": "Built by riders, for riders."
            }
        },
        "contactPage": {
            "title": "Contact",
            "subtitle": "Us",
            "description": "Ready to experience the ultimate simulation? We're here to help.",
            "getInTouch": "Get In Touch",
            "form": {
                "name": "Name",
                "email": "Email",
                "subject": "Subject",
                "message": "Message",
                "send": "Send Message",
                "sent": "Message Sent",
                "sentDesc": "We'll get back to you as soon as possible."
            }
        },
        "vr": {
            "title": "BEYOND REALITY",
            "subtitle": "Step into the circuit. Feel every turn. Total immersion with VR integration.",
            "cta": "Explore Compatibility",
            "features": {
                "universal": "Universal Support",
                "universalDesc": "Compatible with all major VR headsets including Meta Quest, HTC Vive, and Valve Index.",
                "gameReady": "Game Ready",
                "gameReadyDesc": "Seamless integration with MotoGP™ series, Ride 4, and Assetto Corsa.",
                "zeroLatency": "Zero Latency",
                "zeroLatencyDesc": "Optimized telemetry for lag-free sync between motion and visuals."
            },
            "immersion": {
                "title": "Feel the",
                "highlight": "Speed",
                "description": "Our proprietary software translates every bump, turn, and acceleration directly to the simulator chassis. When combined with VR, your brain is tricked into believing you're truly on the track.",
                "telemetry": "Real-time telemetry processing",
                "audio": "Spatial audio integration",
                "haptic": "Haptic feedback support"
            }
        },
        "useCases": {
            "title": "Who is",
            "highlight": "DevotionSim",
            "suffix": " for?",
            "subtitle": "Versatility meets performance. Choose your path.",
            "professional": {
                "title": "Professional Training",
                "desc": "For professional riders who need to train muscle memory, learn new tracks, and recover from injuries without risk."
            },
            "entertainment": {
                "title": "Entertainment",
                "desc": "The ultimate gaming experience. Feel the adrenaline of MotoGP at home. Challenge friends and compete online."
            },
            "schools": {
                "title": "Driving Schools",
                "desc": "Safe and efficient training for students. Teach correct posture and bike control in a controlled environment.",
                "learnMore": "Learn More"
            },
            "learnMore": "Learn More"
        }
    },
    "es": {
        "nav_vr": "Experiencia VR",
        "about": {
            "title": "Sobre",
            "subtitle": "DevotionSim",
            "description": "Nacido de una pasión por las carreras y una dedicación a la excelencia en ingeniería.",
            "missionTitle": "Nuestra Misión",
            "missionText1": "En DevotionSim, cerramos la brecha entre las carreras virtuales y la física del mundo real. Nuestra misión es proporcionar a los pilotos profesionales y entusiastas las herramientas de entrenamiento más realistas disponibles.",
            "missionText2": "Creemos que la simulación no es solo un juego, es una herramienta crucial para el desarrollo, la seguridad y la mejora del rendimiento.",
            "values": {
                "innovation": "Innovación",
                "innovationDesc": "Empujando constantemente los límites de la tecnología de movimiento.",
                "quality": "Calidad",
                "qualityDesc": "Componentes de grado industrial para durabilidad 24/7.",
                "passion": "Pasión",
                "passionDesc": "Construido por pilotos, para pilotos."
            }
        },
        "contactPage": {
            "title": "Contacta",
            "subtitle": "con Nosotros",
            "description": "¿Listo para experimentar la simulación definitiva? Estamos aquí para ayudar.",
            "getInTouch": "Ponte en Contacto",
            "form": {
                "name": "Nombre",
                "email": "Correo electrónico",
                "subject": "Asunto",
                "message": "Mensaje",
                "send": "Enviar Mensaje",
                "sent": "Mensaje Enviado",
                "sentDesc": "Nos pondremos en contacto contigo lo antes posible."
            }
        },
        "vr": {
            "title": "MÁS ALLÁ DE LA REALIDAD",
            "subtitle": "Entra en el circuito. Siente cada curva. Inmersión total con integración VR.",
            "cta": "Explorar Compatibilidad",
            "features": {
                "universal": "Soporte Universal",
                "universalDesc": "Compatible con todos los principales cascos VR incluyendo Meta Quest, HTC Vive y Valve Index.",
                "gameReady": "Listo para Jugar",
                "gameReadyDesc": "Integración perfecta con la serie MotoGP™, Ride 4 y Assetto Corsa.",
                "zeroLatency": "Latencia Cero",
                "zeroLatencyDesc": "Telemetría optimizada para sincronización sin lag entre movimiento y visuales."
            },
            "immersion": {
                "title": "Siente la",
                "highlight": "Velocidad",
                "description": "Nuestro software propietario traduce cada bache, giro y aceleración directamente al chasis del simulador. Cuando se combina con VR, tu cerebro es engañado para creer que estás realmente en la pista.",
                "telemetry": "Procesamiento de telemetría en tiempo real",
                "audio": "Integración de audio espacial",
                "haptic": "Soporte de retroalimentación háptica"
            }
        },
        "useCases": {
            "title": "¿Para quién es",
            "highlight": "DevotionSim",
            "suffix": "?",
            "subtitle": "La versatilidad se encuentra con el rendimiento. Elige tu camino.",
            "professional": {
                "title": "Entrenamiento Profesional",
                "desc": "Para pilotos profesionales que necesitan entrenar la memoria muscular, aprender nuevas pistas y recuperarse de lesiones sin riesgo."
            },
            "entertainment": {
                "title": "Entretenimiento",
                "desc": "La experiencia de juego definitiva. Siente la adrenalina de MotoGP en casa. Desafía a amigos y compite en línea."
            },
            "schools": {
                "title": "Escuelas de Conducción",
                "desc": "Entrenamiento seguro y eficiente para estudiantes. Enseña la postura correcta y el control de la moto en un entorno controlado.",
                "learnMore": "Saber Más"
            },
            "learnMore": "Saber Más"
        }
    }
}

# Base directory
base_dir = r"c:\Users\jairo\devotion\devotion-revamped-showcase\src\i18n\locales"

# Process English file
en_file = os.path.join(base_dir, "en.json")
with open(en_file, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Add nav.vr
en_data["nav"]["vr"] = missing_keys["en"]["nav_vr"]

# Add other sections
en_data["about"] = missing_keys["en"]["about"]
en_data["contactPage"] = missing_keys["en"]["contactPage"]
en_data["vr"] = missing_keys["en"]["vr"]
en_data["useCases"] = missing_keys["en"]["useCases"]

# Write back
with open(en_file, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Updated en.json successfully")

# Process Spanish file
es_file = os.path.join(base_dir, "es.json")
with open(es_file, 'r', encoding='utf-8') as f:
    es_data = json.load(f)

# Add nav.vr
es_data["nav"]["vr"] = missing_keys["es"]["nav_vr"]

# Add other sections
es_data["about"] = missing_keys["es"]["about"]
es_data["contactPage"] = missing_keys["es"]["contactPage"]
es_data["vr"] = missing_keys["es"]["vr"]
es_data["useCases"] = missing_keys["es"]["useCases"]

# Write back
with open(es_file, 'w', encoding='utf-8') as f:
    json.dump(es_data, f, ensure_ascii=False, indent=2)

print("Updated es.json successfully")
print("Done! Updated English and Spanish locale files.")
