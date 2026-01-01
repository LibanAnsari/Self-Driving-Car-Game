# 🚗 Self-Driving Car with Neural Networks

A self-driving car simulation built from scratch using JavaScript. This project demonstrates how a neural network and genetic algorithm can learn to drive a car through traffic without crashing.

## � Showcase

<video src="assets/example.mkv" controls="controls" style="max-width: 100%;">
    Your browser does not support the video tag.
</video>

## �🌟 Features

-   **Neural Network**: A fully connected feed-forward neural network implemented from scratch (no libraries).
-   **Genetic Algorithm**: Uses natural selection to evolve the cars. The best performing car's "brain" is saved and mutated for the next generation.
-   **Sensors**: Ray-casting sensors to detect road borders and traffic.
-   **Visualizer**: Real-time visualization of the neural network's decision-making process.
-   **Traffic Simulation**: Randomly generated traffic with seeded randomness for reproducible scenarios.

## 🎮 Controls

The simulation runs automatically. You can interact with the process using the control panel:

-   **💾 Save**: Saves the current best car's neural network to local storage. Use this when you see a car performing well.
-   **🗑️ Delete**: Clears the saved brain from local storage, resetting the learning process.
-   **🔄 Reload**: Refreshes the page to restart the simulation (uses the same traffic seed).

## 🧠 How it Works

1.  **Generation**: A population of `N` cars is spawned.
2.  **Simulation**: Each car drives autonomously using its neural network.
    -   **Inputs**: Readings from 5 ray-cast sensors (distance to obstacles).
    -   **Processing**: The neural network processes inputs through hidden layers.
    -   **Outputs**: Control signals for Forward, Left, Right, and Reverse.
3.  **Selection**: The car that travels the furthest distance (`y` coordinate) is considered the "Best Car".
4.  **Evolution**: When the page is reloaded (or automatically in a loop), the new generation is created based on the saved "Best Car" with slight mutations to explore improvements.

## 📂 Project Structure

```
/
├── index.html      # Main entry point
├── assets/         # Media assets
│   └── example.mkv # Showcase video
├── style/          # Styles
│   └── style.css   # Styling for the simulation and UI
├── README.md       # Project documentation
└── js/             # JavaScript source files
    ├── main.js     # Main game loop and initialization

    ├── car.js      # Car physics and logic
    ├── network.js  # Neural Network implementation
    ├── sensor.js   # Ray-casting sensor logic
    ├── road.js     # Road and lane generation
    ├── controls.js # Input handling
    ├── visualizer.js # Network visualization logic
    └── utils.js    # Helper functions (math, collision, etc.)
```

## 🚀 How to Run

1.  Clone the repository or download the files.
2.  Open `index.html` in any modern web browser.
3.  Interact and watch the cars learn!

## 🛠️ Technologies

-   **HTML5 Canvas**: For rendering the simulation and network visualizer.
-   **Vanilla JavaScript**: Core logic, physics, and ML implementation.
-   **CSS3**: Modern styling for the UI.

---