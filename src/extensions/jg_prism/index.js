const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
// const Cast = require('../../util/cast');

/**
 * Class for Prism blocks
 * @constructor
 */
class JgPrismBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.audioPlayer = new Audio();
        this.isJSPermissionGranted = false;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgPrism',
            name: 'Prism',
            color1: '#BC7FFF',
            color2: '#AD66FF',
            blocks: [
                {
                    blockType: BlockType.LABEL,
                    text: "Audio"
                },
                {
                    opcode: 'playAudioFromUrl',
                    text: formatMessage({
                        id: 'jgPrism.blocks.playAudioFromUrl',
                        default: 'play audio from [URL]',
                        description: 'Plays sound from a URL.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://synthesis-service.scratch.mit.edu/synth?locale=en-US&gender=female&text=hello'
                        }
                    }
                },
                {
                    opcode: 'setAudioToLooping',
                    text: formatMessage({
                        id: 'jgPrism.blocks.setAudioToLooping',
                        default: 'set audio to loop',
                        description: 'Sets the audio to be looping.'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'setAudioToNotLooping',
                    text: formatMessage({
                        id: 'jgPrism.blocks.setAudioToNotLooping',
                        default: 'set audio to not loop',
                        description: 'Sets the audio to not be looping.'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'pauseAudio',
                    text: formatMessage({
                        id: 'jgPrism.blocks.pauseAudio',
                        default: 'pause audio',
                        description: 'Pauses the audio player.'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'playAudio',
                    text: formatMessage({
                        id: 'jgPrism.blocks.playAudio',
                        default: 'resume audio',
                        description: 'Resumes the audio player.'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'setAudioPlaybackSpeed',
                    text: formatMessage({
                        id: 'jgPrism.blocks.setAudioPlaybackSpeed',
                        default: 'set audio speed to [SPEED]%',
                        description: 'Sets the speed of the audio player.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'getAudioPlaybackSpeed',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getAudioPlaybackSpeed',
                        default: 'audio speed',
                        description: 'Block that returns the playback speed of the audio player.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'setAudioPosition',
                    text: formatMessage({
                        id: 'jgPrism.blocks.setAudioPosition',
                        default: 'set audio position to [POSITION] seconds',
                        description: 'Sets the position of the current audio in the audio player.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        POSITION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    }
                },
                {
                    opcode: 'getAudioPosition',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getAudioPosition',
                        default: 'audio position',
                        description: 'Block that returns the position of the audio player in the currently playing audio.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'setAudioVolume',
                    text: formatMessage({
                        id: 'jgPrism.blocks.setAudioVolume',
                        default: 'set audio volume to [VOLUME]%',
                        description: 'Sets the volume of the current audio in the audio player.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VOLUME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'getAudioVolume',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getAudioVolume',
                        default: 'audio volume',
                        description: 'Block that returns the volume of the audio player.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    blockType: BlockType.LABEL,
                    text: "JavaScript"
                },
                {
                    opcode: 'evaluate',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.evaluate',
                        default: 'eval [JAVASCRIPT]',
                        description: 'Block that runs JavaScript code.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        JAVASCRIPT: {
                            type: ArgumentType.STRING,
                            defaultValue: "console.log('Hello!')"
                        }
                    }
                },
                {
                    opcode: 'evaluate2',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.evaluate2',
                        default: 'eval [JAVASCRIPT]',
                        description: 'Block that runs JavaScript code and returns the result of it.'
                    }),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        JAVASCRIPT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Math.random()"
                        }
                    }
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Data URIs"
                },
                {
                    opcode: 'screenshotStage',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.screenshotStage',
                        default: 'screenshot the stage',
                        description: 'Block that screenshots the stage and returns a Data URI of it.'
                    }),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true
                },
                {
                    opcode: 'dataUriOfCostume',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.dataUriOfCostume',
                        default: 'data uri of costume #[INDEX]',
                        description: 'Block that returns a Data URI of the costume at the index.'
                    }),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "1"
                        }
                    }
                },
                {
                    opcode: 'dataUriFromImageUrl',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.dataUriFromImageUrl',
                        default: 'data uri of image at url: [URL]',
                        description: 'Block that returns a Data URI of the costume at the index.'
                    }),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "url"
                        }
                    }
                },
                {
                    blockType: BlockType.LABEL,
                    text: "More Mouse Inputs"
                },
                {
                    opcode: 'whenMouseScrolledUp',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.whenMouseScrolledUp',
                        default: 'when mouse scrolled up',
                        description: 'im too lazy to write these anymore tbh'
                    }),
                    blockType: BlockType.HAT
                },
                {
                    opcode: 'whenMouseScrolledDown',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.whenMouseScrolledDown',
                        default: 'when mouse scrolled down',
                        description: 'im too lazy to write these anymore tbh'
                    }),
                    blockType: BlockType.HAT
                },
                {
                    opcode: 'currentMouseScroll',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.currentMouseScroll',
                        default: 'mouse scroll y',
                        description: 'im too lazy to write these anymore tbh'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                }
            ]
        };
    }
    playAudioFromUrl(args) {
        this.audioPlayer.pause();
        this.audioPlayer.src = "https://api.allorigins.win/raw?url=" + encodeURIComponent(String(args.URL));
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play();
    }
    setAudioToLooping() {
        this.audioPlayer.loop = true;
    }
    setAudioToNotLooping() {
        this.audioPlayer.loop = false;
    }
    pauseAudio() {
        this.audioPlayer.pause();
    }
    playAudio() {
        this.audioPlayer.play();
    }
    setAudioPlaybackSpeed(args) {
        this.audioPlayer.playbackRate = (isNaN(Number(args.SPEED)) ? 100 : Number(args.SPEED)) / 100;
    }
    getAudioPlaybackSpeed() {
        return this.audioPlayer.playbackRate * 100;
    }
    setAudioPosition(args) {
        this.audioPlayer.currentTime = isNaN(Number(args.POSITION)) ? 0 : Number(args.POSITION);
    }
    getAudioPosition() {
        return this.audioPlayer.currentTime;
    }
    setAudioVolume(args) {
        this.audioPlayer.volume = (isNaN(Number(args.VOLUME)) ? 100 : Number(args.VOLUME)) / 100;
    }
    getAudioVolume() {
        return this.audioPlayer.volume * 100;
    }
    evaluate(args, util) {
        if (!(this.isJSPermissionGranted)) {
            this.isJSPermissionGranted = confirm("Allow this project to run custom unsafe code?");
        }
        // otherwise
        try {
            eval(String(args.JAVASCRIPT));
        } catch (e) {
            alert(e);
            console.error(e)
        }
    }
    evaluate2(args, util) {
        if (!(this.isJSPermissionGranted)) {
            this.isJSPermissionGranted = confirm("Allow this project to run custom unsafe code?");
            if (!this.isJSPermissionGranted) return "";
        }
        // otherwise
        let result = "";
        try {
            result = eval(String(args.JAVASCRIPT));
        } catch (e) {
            result = e;
            console.error(e)
        }
        let canJsonParse = true;
        try {
            JSON.parse(result);
        } catch {
            canJsonParse = false;
        }
        if (canJsonParse) return JSON.parse(result);
        // otherwise
        return result;
    }
    screenshotStage() {
        return new Promise((resolve, _) => {
            vm.renderer.requestSnapshot(uri => {
                resolve(uri);
            })
        })
    }
    dataUriOfCostume(args, util) {
        const index = Number(args.INDEX);
        if (isNaN(index)) return "";
        if (index < 1) return "";

        let target = util.target
        if (target.sprite.costumes[index - 1] == undefined || target.sprite.costumes[index - 1] == null) return "";
        let dataURI = target.sprite.costumes[index - 1].asset.encodeDataURI();
        return String(dataURI);
    }
    dataUriFromImageUrl(args, util) {
        return new Promise((resolve, reject) => {
            if (window && !window.FileReader) return resolve("");
            if (window && !window.fetch) return resolve("");
            fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(String(args.URL))).then(r => {
                r.text().then(text => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      resolve(e.target.result);
                    }
                    reader.readAsDataURL(new Blob([r]))
                }).catch(err => {
                    resolve("");
                })
            }).catch(err => {
                resolve("");
            })
        })
    }
    whenMouseScrolledUp(args, util) {
        return util.ioQuery('mouse', 'getScrollDeltaY', []) < 0;
    }
    whenMouseScrolledDown(args, util) {
        return util.ioQuery('mouse', 'getScrollDeltaY', []) > 0;
    }
    currentMouseScroll(args, util) {
        return util.ioQuery('mouse', 'getScrollDeltaY', []);
    }
}

module.exports = JgPrismBlocks;
