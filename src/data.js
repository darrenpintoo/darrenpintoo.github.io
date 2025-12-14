export const profile = {
    name: "Darren Pinto",
    tagline: "Engineer & Researcher",
    contact: {
        email: "pintodarren999@gmail.com",
        phone: "(224)-814-9416",
        github: "github.com/darrenpintoo",
        linkedin: "linkedin.com/in/darrpinto",
    },
    education: [
        {
            university: "Carnegie Mellon University",
            location: "Pittsburgh, PA",
            degree: "B.S. in Electrical and Computer Engineering",
            date: "Aug 2025 - May 2029",
            courses: [
                "Intro to ECE",
                "Matrices & Linear Transformations",
                "Concepts of Math",
            ],
        },
        {
            university: "Carmel Catholic High School",
            location: "Mundelein, IL",
            degree: "Valedictorian (Rank 1/263)",
            date: "May 2025",
        },
    ],
    skills: {
        languages: [
            "C++",
            "Python",
            "Java",
            "C",
            "MATLAB",
            "Lua",
            "JavaScript",
            "TypeScript",
        ],
        frameworks: [
            "ROS",
            "NumPy",
            "OpenCV",
            "PyTorch",
            "Kubernetes",
            "Flask",
        ],
        tools: [
            "Git",
            "Docker",
            "Azure",
            "Linux",
            "Bash",
            "Altium Designer",
            "Onshape",
        ],
    },
};

export const experiences = [
    {
        role: "Undergraduate Student Researcher",
        company: "Biorobotics Lab — CMU Robotics Institute",
        location: "Pittsburgh, PA",
        date: "Sep 2025 – Present",
        description: [
            "Integrating Intel RealSense Depth camera w/ ROS for robotic perception in reinforcement learning.",
            "Researching reinforcement learning solutions for vertical manipulation on modular robots w/ NVIDIA IsaacSim.",
        ],
    },
    {
        role: "Research & Development Intern",
        company: "Cadre Research (Cadre Forensics)",
        location: "Evanston, IL",
        date: "Jun 2025 – Aug 2025",
        description: [
            "Conceptualized & developed automated motor rotation system for 3D Virtual Microscopy bullet scanning.",
            "Designed low-power ESP32 PCBs (<2mA) with wireless duplex IR comms and ISO 15693 RFID tray identification.",
            "Implemented time-deterministic stepper motor control in C++ to minimize bullet slippage.",
            "Developed an HPC prototype using Azure and KEDA, accelerating comparisons by ~30%.",
        ],
    },
    {
        role: "Software Lead & Team Captain",
        company: "Not Your Average Nerds Robotics (FTC)",
        location: "Mundelein, IL",
        date: "Aug 2021 – May 2025",
        description: [
            "Led development of a library for intuitive control theory, optimizing I2C/UART communication.",
            "Designed physics-based subsystem modeling using state-space representation.",
            "Created an inverse-point-projection algorithm to translate 2D vision data to 3D.",
            "Showcased software to 15k+ industry professionals at Rockwell Industrial Automation Fair.",
            "Achievements: Control Award Finalist (World Championship), 3x Illinois State Champion.",
        ],
    }
];

export const projects = [
    {
        title: "Cartoon Creation Club",
        subtitle: "Roblox Game",
        tech: ["Luau", "Roblox Studio"],
        date: "Sep 2024 – Present",
        stats: "6M+ Sessions | 175k+ Players",
        description: [
            "Released 2 games with 6M+ sessions and high monetary conversion.",
            "Built scalable data persistence with 0 data loss for 2M+ monthly users.",
            "Cultivated a community of 175k+ players through data-driven updates.",
            "Top 500 game on Roblox (Peak: 111k active players).",
        ],
    },
    {
        title: "OptiBox",
        subtitle: "High School Capstone",
        tech: ["Python", "C++", "Flask", "Raspberry Pi", "LiDAR"],
        date: "Aug 2024 – May 2025",
        description: [
            "Software to optimize cardboard box size for measured payloads using LiDAR (reduced volume by ~20%).",
            "Built a responsive dashboard on Raspberry Pi for real-time visualization and control.",
        ],
    },
];
