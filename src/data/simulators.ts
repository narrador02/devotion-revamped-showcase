import { SimulatorData } from "@/types/simulator";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
// Video imports
import videoTimeAttack from "@/assets/eje2-wheelie.mp4";
import videoSlady from "@/assets/eje3-desliz.mp4";
import videoTopGun from "@/assets/eje4-aceler.mp4";

export const simulatorsData: SimulatorData = {
    sharedSpecs: [
        {
            key: "products.specs.dimensionsLabel",
            value: "products.specs.dimensionsValue",
            category: "physical"
        },
        {
            key: "products.specs.transportLabel",
            value: "products.specs.transportValue",
            category: "logistics"
        }
    ],
    models: [
        {
            id: "timeattack",
            title: "products.timeAttack.title",
            shortDescription: "products.timeAttack.description",
            fullDescription: "products.timeAttack.fullDescription",
            features: [
                "products.timeAttack.features.axis",
                "products.timeAttack.features.lean",
                "products.timeAttack.features.wheelie",
                "products.timeAttack.features.compatible"
            ],
            image: product1,
            // Video config - 4s seamless loop
            video: videoTimeAttack,
            poster: product1,
            videoLoop: true,
            videoPreload: "metadata",
            iconName: "Zap",
            colorName: "blue",
            gradientClass: "from-blue-500/20 to-blue-600/5",
            borderClass: "border-blue-500/50",
            textClass: "text-blue-500",
            buttonClass: "bg-blue-500 hover:bg-blue-600",
            badge: "2-Axis",
            weight: "products.timeAttack.specs.weight",
            axes: "products.timeAttack.features.axis",
            usage: "products.bestForEvents",
            // Comparison Data
            maxLean: "products.specs.upTo50", // Time Attack is usually slightly less or standard? Assuming 50/54 consistent. Using general key or specific. Let's use specific value key.
            wheelie: "products.comparison.no",
            rearSlide: "products.comparison.no",
            surge: "products.comparison.no",

            specs: [
                { label: "products.specs.type", value: "products.timeAttack.specs.type" },
                { label: "products.specs.weight", value: "products.timeAttack.specs.weight" },
                { label: "products.specs.leanAngle", value: "products.specs.upTo50" }
            ]
        },
        {
            id: "slady",
            title: "products.slady.title",
            shortDescription: "products.slady.description",
            fullDescription: "products.slady.fullDescription",
            features: [
                "products.slady.features.axis",
                "products.slady.features.lean",
                "products.slady.features.drift",
                "products.slady.features.compatible"
            ],
            image: product2,
            // Video config - 2s non-loop
            video: videoSlady,
            poster: product2,
            videoLoop: false,
            videoMaxPlays: 1,
            videoPreload: "none",
            iconName: "Gauge",
            colorName: "purple",
            gradientClass: "from-purple-500/20 to-purple-600/5",
            borderClass: "border-purple-500/50",
            textClass: "text-purple-500",
            buttonClass: "bg-purple-500 hover:bg-purple-600",
            badge: "3-Axis",
            weight: "products.slady.specs.weight",
            axes: "products.slady.features.axis",
            usage: "products.bestForSchools",
            // Comparison Data
            maxLean: "products.specs.upTo54",
            wheelie: "products.comparison.no",
            rearSlide: "products.comparison.yes",
            surge: "products.comparison.no",

            specs: [
                { label: "products.specs.type", value: "products.slady.specs.type" },
                { label: "products.specs.weight", value: "products.slady.specs.weight" },
                { label: "products.specs.leanAngle", value: "products.specs.upTo54" }
            ]
        },
        {
            id: "topgun",
            title: "products.topGun.title",
            shortDescription: "products.topGun.description",
            fullDescription: "products.topGun.fullDescription",
            features: [
                "products.topGun.features.axis",
                "products.topGun.features.lean",
                "products.topGun.features.drift",
                "products.topGun.features.velocity",
                "products.topGun.features.compatible"
            ],
            image: product3,
            // Video config - 2s non-loop
            video: videoTopGun,
            poster: product3,
            videoLoop: false,
            videoMaxPlays: 1,
            videoPreload: "none",
            iconName: "Rocket",
            colorName: "amber",
            gradientClass: "from-amber-500/20 to-amber-600/5",
            borderClass: "border-amber-500/50",
            textClass: "text-amber-500",
            buttonClass: "bg-amber-500 hover:bg-amber-600",
            badge: "4-Axis",
            weight: "products.topGun.specs.weight",
            axes: "products.topGun.features.axis",
            usage: "products.bestForPro",
            // Comparison Data
            maxLean: "products.specs.upTo54",
            wheelie: "products.comparison.yes",
            rearSlide: "products.comparison.yes",
            surge: "products.comparison.yes",

            specs: [
                { label: "products.specs.type", value: "products.topGun.specs.type" },
                { label: "products.specs.weight", value: "products.topGun.specs.weight" },
                { label: "products.specs.leanAngle", value: "products.specs.upTo54" }
            ]
        }
    ],
    options: [
        {
            id: "vr_headset",
            name: "products.options.vr.name",
            description: "products.options.vr.desc",
            bestForTags: ["products.bestForEvents", "products.bestForPro"]
        },
        {
            id: "custom_branding",
            name: "products.options.branding.name",
            description: "products.options.branding.desc",
            bestForTags: ["products.bestForEvents"]
        }
    ]
};
