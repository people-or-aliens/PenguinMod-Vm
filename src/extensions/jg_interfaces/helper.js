class Button {
    constructor(addToClient, { id, label, shown }) {
        this.id = id;
        this.label = label;
        this._element = document.createElement("button");
        this._element.style = `position:absolute;left:0%;top:0%`
        if (shown === false) {
            this._element.style.display = "none";
        }
        if (label) {
            this._element.innerText = label;
        } else {
            this._element.innerText = "Button";
        }

        addToClient.AddToCanvas(this._element);
        if (addToClient.buttons[id]) {
            addToClient.buttons[id].dispose();
            delete addToClient.buttons[id];
        }
        addToClient.buttons[id] = this;
    }
    show() {
        this._element.style.display = "";
    }
    hide() {
        this._element.style.display = "none";
    }

    dispose() {
        this._element.remove();
    }
}

class UI {
    constructor(runtime) {
        this.runtime = runtime;
        this._div = document.createElement("div");
        this.Realign();

        this.buttons = {};
    }

    static Button = Button;

    /**
     * If we switch from editor to project page, our element div gets hidden away somewhere.
     * This function puts it back in place.
     */
    Realign() {
        this._div.style = `position: absolute;left: 0px;width: 100%;height: 100%;top: 0px;z-index: 1000;`
        this.runtime.renderer.canvas.parentElement.prepend(this._div);
    }
    /**
     * Append an element to the div containing all UI elements.
     * @param {Element} element The element to add to the div.
     */
    AddToCanvas(element) {
        this._div.append(element);
        this.Realign();
    }

    /**
     * Dispose of all UI elements.
     */
    DisposeAll() {
        const buttons = Object.values(this.buttons);
        const elements = [].concat(buttons);

        elements.forEach(element => {
            element.dispose();
        })

        this.Realign();
    }
}

module.exports = UI;