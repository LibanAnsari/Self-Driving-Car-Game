class Controls{
    constructor(type){
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        // allows controls to the main car only
        switch(type){
            case "KEYS":
                this.#addKeyboardListener(); // this is a private listner, cannot be accessed outside the Control class
                break;
            case "DUMMY":
                this.forward = true;
                break;
            default:
                break;
        }
    }

    #addKeyboardListener(){
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
                default:
                    break;
            }
            console.table(this);
        }
        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
                default:
                    break;
            }
        }
    }
}