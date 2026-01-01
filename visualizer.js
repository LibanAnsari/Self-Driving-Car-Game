class Visualizer{
    static drawNetwork(ctx, network){
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin*2;
        const height = ctx.canvas.height - margin*2;


        const levelHeight = height / network.levels.length;

        for(let i = network.levels.length - 1 ; i >= 0 ; i--){
            const levelTop = top +
                lerp(
                    height - levelHeight,
                    0,
                    network.levels.length == 1
                        ? 0.5
                        : i/(network.levels.length-1)
                );

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i],
                left, levelTop,
                width, levelHeight,
                i == network.levels.length - 1
                    ? ['🠉', '🠈', '🠊', '🠋']
                    // ? ['⬆️', '⬅️', '➡️', '⬇️']
                    : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels){
        const right = left + width;
        const bottom = top + height;

        const {inputs, outputs, weights, biases} = level;

        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        const nodeRadius = 18;

        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            Visualizer.#drawNode(ctx, x, bottom, nodeRadius, inputs[i]);
        }
        
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            Visualizer.#drawNode(ctx, x, top, nodeRadius, outputs[i]);

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius*0.8, 0, Math.PI*2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius*1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadius*0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius*0.1);
            }
        }
    }

    static #drawNode(ctx, x, y, radius, value){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, radius*0.6, 0, Math.PI*2);
        
        const alpha = Math.abs(value);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius*0.6);
        if(value > 0){
            gradient.addColorStop(0, `rgba(255, 255, 100, ${alpha})`);
            gradient.addColorStop(1, `rgba(255, 180, 0, ${alpha})`);
        } else {
            gradient.addColorStop(0, `rgba(100, 255, 255, ${alpha})`);
            gradient.addColorStop(1, `rgba(0, 200, 255, ${alpha})`);
        }
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    static #getNodeX(nodes, index, left, right){
        return lerp(
                left,
                right,
                nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}