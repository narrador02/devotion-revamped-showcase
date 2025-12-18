
export interface SharedSpec {
    key: string;
    value: string;
    category: string;
}

export interface SimulatorSpec {
    label: string;
    value: string; // The translation key for the value
    isShared?: boolean;
}

export interface SimulatorOption {
    id: string;
    name: string; // Translation key
    description: string; // Translation key
    bestForTags: string[]; // Keys to match usage/bestFor
}

export interface SimulatorModel {
    id: string;
    title: string; // Translation key
    shortDescription: string; // Translation key
    fullDescription: string; // Translation key
    features: string[]; // Array of translation keys

    // Visuals
    image: string | { src: string }; // Support string path or object with src
    iconName: 'Zap' | 'Gauge' | 'Rocket';

    // Tailwind Classes (Static Map)
    colorName: string; // 'blue', 'purple', 'amber'
    gradientClass: string;
    borderClass: string;
    textClass: string;
    buttonClass: string;

    // Specs
    badge: string; // e.g. "2-Axis"
    weight: string; // Translation key
    axes: string; // Translation key or string (Movement System)
    usage: string; // Translation key (bestFor)

    // Explicit Comparison Fields (New)
    maxLean: string; // e.g. "50°" or translation key
    wheelie: string; // e.g. "Yes (Top Gun only)" or translation key
    rearSlide: string; // "Yes/No" or key
    surge: string; // "Yes/No" or key

    specs: SimulatorSpec[]; // Detailed specs array
}

export interface SimulatorData {
    sharedSpecs: SharedSpec[];
    models: SimulatorModel[];
    options: SimulatorOption[];
}
