class NeuralNetwork{
    constructor(neuronCounts){
        this.levels = [];
        for(let i = 0 ; i < neuronCounts.length - 1 ; i++){
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    static forward(givenInputs, network){
        let outputs = givenInputs;

        for(let i = 0; i < network.levels.length ; i++){
            const isLastLayer = i === network.levels.length - 1;
            outputs = Level.forward(outputs, network.levels[i], isLastLayer);
        }

        return outputs;
    }


    static mutate(network, amount = 1){
        network.levels.forEach(level => {
            for(let i = 0 ; i < level.biases.length ; i++){
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                )
            }
            for(let i = 0 ; i < level.weights.length ; i++){
                for(let j = 0 ; j < level.weights[i].length ; j++){
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    )
                }
            }
        });
    }
}


class Level{
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for(let i = 0 ; i < inputCount ; i++){
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level){
        for(let i = 0 ; i < level.inputs.length ; i++){
            for(let j = 0 ; j < level.outputs.length ; j++){
                level.weights[i][j] = Math.random()*2 - 1; // weights will be initilized between [-1, 1]
            }
        }

        for(let i = 0 ; i < level.biases.length ; i++){
            level.biases[i] = Math.random()*2 - 1;
        }
    }

    static forward(givenInputs, level, isLastLayer){
        for(let i = 0 ; i < level.inputs.length ; i++){
            level.inputs[i] = givenInputs[i];
        }

        for(let col = 0 ; col < level.outputs.length ; col++){
            let sum = 0;
            for(let row = 0 ; row < level.inputs.length ; row++){
                sum += level.inputs[row] * level.weights[row][col];
            }
            sum += level.biases[col];

            if(isLastLayer){
                // Binary output (sigmoid)
                level.outputs[col] = sigmoid(sum) >= 0.5 ? 1 : 0;
            } else {
                // ReLU
                level.outputs[col] = relu(sum);
            }
        }

        return level.outputs;
    }
}


// class NeuralNetwork{
//     constructor(neuronCounts){
//         this.levels = [];
//         for(let i = 0; i < neuronCounts.length - 1; i++){
//             this.levels.push(
//                 new Level(neuronCounts[i], neuronCounts[i + 1])
//             );
//         }
//     }

//     static forward(givenInputs, network){
//         let outputs = givenInputs;

//         for(let i = 0; i < network.levels.length; i++){
//             const isLastLayer = i === network.levels.length - 1;
//             outputs = Level.forward(outputs, network.levels[i], isLastLayer);
//         }

//         return outputs;
//     }

//     static mutate(network, amount = 1){
//         network.levels.forEach(level => {
//             for(let i = 0 ; i < level.biases.length ; i++){
//                 level.biases[i] = lerp(
//                     level.biases[i],
//                     Math.random() * 2 - 1,
//                     amount
//                 )
//             }
//             for(let i = 0 ; i < level.weights.length ; i++){
//                 for(let j = 0 ; j < level.weights[i].length ; j++){
//                     level.weights[i][j] = lerp(
//                         level.weights[i][j],
//                         Math.random() * 2 - 1,
//                         amount
//                     )
//                 }
//             }
//         });
//     }
// }


// class Level{
//     constructor(inputCount, outputCount){
//         this.inputs = new Array(inputCount);
//         this.outputs = new Array(outputCount);
//         this.biases = new Array(outputCount);

//         this.weights = [];
//         for(let i = 0; i < inputCount; i++){
//             this.weights[i] = new Array(outputCount);
//         }

//         Level.#randomize(this);
//     }

//     static #randomize(level){
//         for(let i = 0; i < level.inputs.length; i++){
//             for(let j = 0; j < level.outputs.length; j++){
//                 level.weights[i][j] = Math.random() * 2 - 1;
//             }
//         }

//         for(let i = 0; i < level.biases.length; i++){
//             level.biases[i] = Math.random() * 2 - 1;
//         }
//     }

//     static forward(givenInputs, level, isLastLayer){
//         for(let i = 0; i < level.inputs.length; i++){
//             level.inputs[i] = givenInputs[i];
//         }

//         for(let col = 0; col < level.outputs.length; col++){
//             let sum = 0;
//             for(let row = 0; row < level.inputs.length; row++){
//                 sum += level.inputs[row] * level.weights[row][col];
//             }

//             // SAME LOGIC AS YOUR ORIGINAL VERSION
//             level.outputs[col] = sum > level.biases[col] ? 1 : 0;
//         }

//         return level.outputs;
//     }
// }
