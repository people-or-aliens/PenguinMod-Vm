const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const BufferUtil = new (require('../../util/array buffer'));

// ShovelUtils
let fps = 0;

/**
 * Class for Runtime blocks
 * @constructor
 */
class JgRuntimeBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // ShovelUtils
        // Based on from https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html
        const times = [];
        fps = this.runtime.frameLoop.framerate;
        const oldStep = this.runtime._step;
        this.runtime._step = function (...args) {
            oldStep.call(this, ...args);
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
        };
    }

    _typeIsBitmap(type) {
        return (
            type === 'image/png' ||
            type === 'image/bmp' ||
            type === 'image/jpg' ||
            type === 'image/jpeg' ||
            type === 'image/jfif' ||
            type === 'image/webp' ||
            type === 'image/gif'
        );
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgRuntime',
            name: 'Runtime',
            color1: '#777777',
            color2: '#555555',
            blocks: [
                {
                    opcode: 'addSpriteUrl',
                    text: 'add sprite from [URL]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://api.allorigins.win/raw?url=https://github.com/PenguinMod/FreshPkg/raw/main/pkgs/anticors/anticors.sprite3'
                        }
                    }
                },
                {
                    opcode: 'addCostumeUrl',
                    text: 'add costume [name] from [URL]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://api.allorigins.win/raw?url=https://studio.penguinmod.site/static/assets/9525874be2b1d66bd448bf53400011a9.svg'
                        },
                        name: {
                            type: ArgumentType.STRING,
                            defaultValue: 'blue flag'
                        }
                    }
                },
                {
                    opcode: 'addSoundUrl',
                    text: 'add sound [NAME] from [URL]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://pm-bapi.vercel.app/buauauau.mp3'
                        },
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Buauauau'
                        }
                    }
                },
                {
                    opcode: 'getIndexOfCostume',
                    text: 'get costume index of [costume]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        costume: {
                            type: ArgumentType.STRING,
                            defaultValue: "costume1"
                        }
                    }
                },
                {
                    opcode: 'getIndexOfSound',
                    text: 'get sound index of [NAME]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "Pop"
                        }
                    }
                },
                {
                    opcode: 'setStageSize',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.setStageSize',
                        default: 'set stage width: [WIDTH] height: [HEIGHT]',
                        description: 'Sets the width and height of the stage.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 480
                        },
                        HEIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 360
                        }
                    }
                },
                {
                    opcode: 'turboModeEnabled',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.turboModeEnabled',
                        default: 'turbo mode enabled?',
                        description: 'Block that returns whether Turbo Mode is enabled on the project or not.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'amountOfClones',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.amountOfClones',
                        default: 'clone count',
                        description: 'Block that returns the amount of clones that currently exist.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getStageWidth',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getStageWidth',
                        default: 'stage width',
                        description: 'Block that returns the width of the stage.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getStageHeight',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getStageHeight',
                        default: 'stage height',
                        description: 'Block that returns the height of the stage.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'setMaxFrameRate',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.setMaxFrameRate',
                        default: 'set max framerate to: [FRAMERATE]',
                        description: 'Sets the max allowed framerate.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FRAMERATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'getMaxFrameRate',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getMaxFrameRate',
                        default: 'max framerate',
                        description: 'Block that returns the amount of FPS allowed.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getFrameRate',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getFrameRate',
                        default: 'framerate',
                        description: 'Block that returns the amount of FPS.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                "---",
                {
                    opcode: 'variables_createVariable',
                    text: 'create variable named [NAME] for [SCOPE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "my variable" },
                        SCOPE: { type: ArgumentType.STRING, menu: "variableScope" }
                    }
                },
                {
                    opcode: 'variables_createCloudVariable',
                    text: 'create cloud variable named [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "cloud variable" },
                    }
                },
                {
                    opcode: 'variables_createList',
                    text: 'create list named [NAME] for [SCOPE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "list" },
                        SCOPE: { type: ArgumentType.STRING, menu: "variableScope" }
                    }
                },
                {
                    opcode: 'variables_getVariable',
                    text: 'get value of variable named [NAME] in [SCOPE]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "my variable" },
                        SCOPE: { type: ArgumentType.STRING, menu: "variableTypes" }
                    }
                },
                {
                    opcode: 'variables_getList',
                    text: 'get array of list named [NAME] in [SCOPE]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "list" },
                        SCOPE: { type: ArgumentType.STRING, menu: "variableScope" }
                    }
                },
                {
                    opcode: 'variables_existsVariable',
                    text: 'variable named [NAME] exists in [SCOPE]?',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "my variable" },
                        SCOPE: { type: ArgumentType.STRING, menu: "variableTypes" }
                    }
                },
                {
                    opcode: 'variables_existsList',
                    text: 'list named [NAME] exists in [SCOPE]?',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "list" },
                        SCOPE: { type: ArgumentType.STRING, menu: "variableScope" }
                    }
                },
                "---",
                {
                    opcode: 'getDataOption',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getDataOption',
                        default: 'get binary data of [OPTION] named [NAME]',
                        description: 'Block that returns the binary data of a sprite, sound or costume.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        OPTION: {
                            type: ArgumentType.STRING,
                            menu: "objectType"
                        },
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "Sprite1"
                        }
                    }
                },
                {
                    opcode: 'getDataUriOption',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getDataUriOption',
                        default: 'get data uri of [OPTION] named [NAME]',
                        description: 'Block that returns the data URI of a sprite, sound or costume.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        OPTION: {
                            type: ArgumentType.STRING,
                            menu: "objectType"
                        },
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "Sprite1"
                        }
                    }
                },
                "---",
                {
                    opcode: 'getAllSprites',
                    text: 'get all sprites',
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getAllCostumes',
                    text: 'get all costumes',
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getAllSounds',
                    text: 'get all sounds',
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                "---",
                {
                    opcode: 'getAllVariables',
                    text: 'get all variables [ALLSCOPE]',
                    disableMonitor: false,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ALLSCOPE: {
                            type: ArgumentType.STRING,
                            menu: "allVariableType"
                        }
                    }
                },
                {
                    opcode: 'getAllLists',
                    text: 'get all lists [ALLSCOPE]',
                    disableMonitor: false,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ALLSCOPE: {
                            type: ArgumentType.STRING,
                            menu: "allVariableScope"
                        }
                    }
                },
                "---",
                {
                    blockType: BlockType.LABEL,
                    text: "Potentially Dangerous"
                },
                {
                    opcode: 'deleteCostume',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.deleteCostume',
                        default: 'delete costume at index [COSTUME]',
                        description: 'Deletes a costume at the specified index.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COSTUME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'deleteSound',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.deleteSound',
                        default: 'delete sound at index [SOUND]',
                        description: 'Deletes a sound at the specified index.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SOUND: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                "---",
                {
                    opcode: 'variables_deleteVariable',
                    text: 'delete variable named [NAME] in [SCOPE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "my variable" },
                        SCOPE: { type: ArgumentType.STRING, menu: "variableTypes" }
                    }
                },
                {
                    opcode: 'variables_deleteList',
                    text: 'delete list named [NAME] in [SCOPE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "list" },
                        SCOPE: { type: ArgumentType.STRING, menu: "variableScope" }
                    }
                },
                "---",
                {
                    opcode: 'deleteSprite',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.deleteSprite',
                        default: 'delete sprite named [NAME]',
                        description: 'Deletes a sprite with the specified name.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "Sprite1"
                        }
                    }
                },
                "---",
                {
                    opcode: 'getIsClone',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getIsClone',
                        default: 'is clone? (deprecated)',
                        description: 'Block that returns whether the sprite is a clone or not.'
                    }),
                    disableMonitor: true,
                    hideFromPalette: true,
                    blockType: BlockType.BOOLEAN
                },
            ],
            menus: {
                objectType: {
                    acceptReporters: true,
                    items: [
                        "sprite",
                        "costume",
                        "sound",
                    ].map(item => ({ text: item, value: item }))
                },
                variableScope: {
                    acceptReporters: true,
                    items: [
                        "all sprites",
                        "this sprite",
                    ].map(item => ({ text: item, value: item }))
                },
                allVariableScope: {
                    acceptReporters: true,
                    items: [
                        "for all sprites",
                        "in every sprite",
                        "in this sprite",
                    ].map(item => ({ text: item, value: item }))
                },
                allVariableType: {
                    acceptReporters: true,
                    items: [
                        "for all sprites",
                        "in every sprite",
                        "in this sprite",
                        "in the cloud",
                    ].map(item => ({ text: item, value: item }))
                },
                variableTypes: {
                    acceptReporters: true,
                    items: [
                        "all sprites",
                        "this sprite",
                        "cloud",
                    ].map(item => ({ text: item, value: item }))
                },
            }
        };
    }
    // utils
    _generateScratchId() {
        const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "/", "|", ",", ".", "{", "}", "[", "]", "(", ")", "+", "-", "!", "?", "`"];
        const array = Array.from(Array(20).keys());
        const normalArray = array.map(() => {
            return characters[Math.round(Math.random() * (characters.length - 1))]
        })
        return normalArray.join("");
    }

    // blocks
    addCostumeUrl(args, util) {
        const targetId = util.target.id;
        return new Promise(resolve => {
            fetch(args.URL, { method: 'GET' }).then(x => x.blob().then(blob => {
                if (!(
                    (this._typeIsBitmap(blob.type)) ||
                    (blob.type === 'image/svg+xml')
                )) {
                    resolve();
                    throw new Error(`Invalid mime type: "${blob.type}"`);
                }

                const assetType = this._typeIsBitmap(blob.type)
                    ? this.runtime.storage.AssetType.ImageBitmap
                    : this.runtime.storage.AssetType.ImageVector;

                const dataType = blob.type === 'image/svg+xml'
                    ? 'svg'
                    : blob.type.split('/')[1];

                blob.arrayBuffer()
                    .then(buffer => {
                        const data = dataType === 'image/svg+xml'
                            ? buffer
                            : new Uint8Array(buffer);
                        const asset = this.runtime.storage.createAsset(assetType, dataType, data, null, true);
                        const name = `${asset.assetId}.${asset.dataFormat}`;
                        const spriteJson = {
                            asset: asset,
                            md5ext: name,
                            name: args.name
                        };
                        const request = vm.addCostume(name, spriteJson, targetId);
                        if (request.then) {
                            request.then(resolve);
                        } else {
                            resolve();
                        }
                    })
                    .catch(err => {
                        console.error(`Failed to Load Costume: ${err}`);
                        console.warn(err);
                        resolve();
                    });
            }));
        });
    }
    deleteCostume(args, util) {
        const index = (Number(args.COSTUME) ? Number(args.COSTUME) : 1) - 1;
        if (index < 0) return;
        util.target.deleteCostume(index);
    }
    deleteSound(args, util) {
        const index = (Number(args.SOUND) ? Number(args.SOUND) : 1) - 1;
        if (index < 0) return;
        util.target.deleteSound(index);
    }
    getIndexOfCostume(args, util) {
        return util.target.getCostumeIndexByName(args.costume) + 1;
    }
    getIndexOfSound(args, util) {
        let index = 0;
        const sounds = util.target.getSounds();
        for (let i = 0; i < sounds.length; i++) {
            const sound = sounds[i];
            if (sound.name === args.NAME) index = i + 1;
        }
        return index;
    }
    setStageSize(args) {
        let width = Number(args.WIDTH) || 480;
        let height = Number(args.HEIGHT) || 360;
        if (width <= 0) width = 1;
        if (height <= 0) height = 1;
        if (vm) vm.setStageSize(width, height);
    }
    turboModeEnabled() {
        return this.runtime.turboMode;
    }
    amountOfClones() {
        return this.runtime._cloneCounter;
    }
    getStageWidth() {
        return this.runtime.stageWidth;
    }
    getStageHeight() {
        return this.runtime.stageHeight;
    }
    getMaxFrameRate() {
        return this.runtime.frameLoop.framerate;
    }
    getIsClone(_, util) {
        return !(util.target.isOriginal);
    }
    setMaxFrameRate(args) {
        let frameRate = Number(args.FRAMERATE) || 1;
        if (frameRate <= 0) frameRate = 1;
        this.runtime.frameLoop.setFramerate(frameRate);
    }
    deleteSprite(args) {
        const target = this.runtime.getSpriteTargetByName(args.NAME);
        if (!target) return;
        vm.deleteSpriteInternal(target.id);
    }

    getDataOption(args, util) {
        switch (args.OPTION) {
            case "sprite": {
                const sprites = this.runtime.targets.filter(target => target.isOriginal);
                const sprite = sprites.filter(sprite => sprite.sprite.name === args.NAME)[0];
                if (!sprite) return "[]";
                return new Promise(resolve => {
                    vm.exportSprite(sprite.id).then(blob => {
                        blob.arrayBuffer().then(arrayBuffer => {
                            const array = BufferUtil.bufferToArray(arrayBuffer);
                            const stringified = JSON.stringify(array);
                            resolve(stringified);
                        }).catch(() => resolve("[]"));
                    }).catch(() => resolve("[]"));
                });
            }
            case "costume": {
                const costumes = util.target.getCostumes();
                const index = util.target.getCostumeIndexByName(args.NAME);
                if (!costumes[index]) return "[]";
                const costume = costumes[index];
                const data = costume.asset.data;

                const array = BufferUtil.bufferToArray(data.buffer);
                const stringified = JSON.stringify(array);
                return stringified;
            }
            case "sound": {
                const sounds = util.target.getSounds();
                const index = this.getIndexOfSound(args, util) - 1;
                if (!sounds[index]) return "[]";
                const sound = sounds[index];
                const data = sound.asset.data;

                const array = BufferUtil.bufferToArray(data.buffer);
                const stringified = JSON.stringify(array);
                return stringified;
            }
            default:
                return "[]";
        }
    }
    getDataUriOption(args, util) {
        switch (args.OPTION) {
            case "sprite": {
                const sprites = this.runtime.targets.filter(target => target.isOriginal);
                const sprite = sprites.filter(sprite => sprite.sprite.name === args.NAME)[0];
                if (!sprite) return "";
                return new Promise(resolve => {
                    vm.exportSprite(sprite.id).then(blob => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = () => resolve("");
                        reader.onabort = () => resolve("");
                        reader.readAsDataURL(blob);
                    }).catch(() => resolve(""));
                });
            }
            case "costume": {
                const costumes = util.target.getCostumes();
                const index = util.target.getCostumeIndexByName(args.NAME);
                if (!costumes[index]) return "";
                const costume = costumes[index];
                const data = costume.asset;

                return data.encodeDataURI();
            }
            case "sound": {
                const sounds = util.target.getSounds();
                const index = this.getIndexOfSound(args, util) - 1;
                if (!sounds[index]) return "";
                const sound = sounds[index];
                const data = sound.asset;

                return data.encodeDataURI();
            }
            default:
                return "";
        }
    }
    getAllSprites() {
        return JSON.stringify(this.runtime.targets.filter(target => target.isOriginal && !target.isStage).map(target => target.sprite.name));
    }
    getAllCostumes(_, util) {
        const costumes = util.target.getCostumes();
        return JSON.stringify(costumes.map(costume => costume.name));
    }
    getAllSounds(_, util) {
        const sounds = util.target.getSounds();
        return JSON.stringify(sounds.map(sound => sound.name));
    }

    getAllVariables(args, util) {
        switch (args.ALLSCOPE) {
            case "for all sprites": {
                const stage = this.runtime.getTargetForStage();
                if (!stage) return "[]";
                const variables = stage.variables;
                if (!variables) return "[]";
                return JSON.stringify(Object.values(variables).filter(v => v.type !== "list").map(v => v.name));
            }
            case "in every sprite": {
                const targets = this.runtime.targets;
                if (!targets) return "[]";
                const variables = targets.filter(t => t.isOriginal).map(t => t.variables);
                if (!variables) return "[]";
                return JSON.stringify(variables.map(v => Object.values(v)).map(v => v.filter(v => v.type !== "list").map(v => v.name)).flat(1));
            }
            case "in this sprite": {
                const target = util.target;
                if (!target) return "[]";
                const variables = target.variables;
                if (!variables) return "[]";
                return JSON.stringify(Object.values(variables).filter(v => v.type !== "list").map(v => v.name));
            }
            case "in the cloud": {
                const stage = this.runtime.getTargetForStage();
                if (!stage) return "[]";
                const variables = stage.variables;
                if (!variables) return "[]";
                return JSON.stringify(Object.values(variables).filter(v => v.type !== "list").filter(v => v.isCloud === true).map(v => v.name));
            }
            default:
                return "[]";
        }
    }
    getAllLists(args, util) {
        switch (args.ALLSCOPE) {
            case "for all sprites": {
                const stage = this.runtime.getTargetForStage();
                if (!stage) return "[]";
                const variables = stage.variables;
                if (!variables) return "[]";
                return JSON.stringify(Object.values(variables).filter(v => v.type === "list").map(v => v.name));
            }
            case "in every sprite": {
                const targets = this.runtime.targets;
                if (!targets) return "[]";
                const variables = targets.filter(t => t.isOriginal).map(t => t.variables);
                if (!variables) return "[]";
                return JSON.stringify(variables.map(v => Object.values(v)).map(v => v.filter(v => v.type === "list").map(v => v.name)).flat(1));
            }
            case "in this sprite": {
                const target = util.target;
                if (!target) return "[]";
                const variables = target.variables;
                if (!variables) return "[]";
                return JSON.stringify(Object.values(variables).filter(v => v.type === "list").map(v => v.name));
            }
            default:
                return "[]";
        }
    }

    // ShovelUtils
    getFrameRate() {
        return fps;
    }
    addSoundUrl(args, util) {
        const targetId = util.target.id;
        return new Promise((resolve) => {
            fetch(args.URL)
                .then((r) => r.arrayBuffer())
                .then((arrayBuffer) => {
                    const storage = this.runtime.storage;
                    const asset = new storage.Asset(
                        storage.AssetType.Sound,
                        null,
                        storage.DataFormat.MP3,
                        new Uint8Array(arrayBuffer),
                        true
                    );
                    resolve(vm.addSound({
                        md5: asset.assetId + '.' + asset.dataFormat,
                        asset: asset,
                        name: args.NAME
                    }, targetId));
                }).catch(resolve);
        })
    }

    // GameUtils
    addSpriteUrl(args) {
        return new Promise((resolve) => {
            fetch(args.URL).then(response => {
                response.arrayBuffer().then(arrayBuffer => {
                    vm.addSprite(arrayBuffer).finally(resolve);
                }).catch(resolve);
            }).catch(resolve);
        });
    }

    // variables
    variables_createVariable(args, util) {
        const variableName = args.NAME;
        switch (args.SCOPE) {
            case "all sprites": {
                return this.runtime.createNewGlobalVariable(variableName);
            }
            case "this sprite": {
                const id = this._generateScratchId();
                return util.target.createVariable(id, variableName, "");
            }
        }
    }
    variables_createCloudVariable(args) {
        const variableName = `☁ ${args.NAME}`;
        const stage = this.runtime.getTargetForStage();
        if (!stage) return;
        const id = this._generateScratchId();
        stage.createVariable(id, variableName, "", true);
    }
    variables_createList(args, util) {
        const variableName = args.NAME;
        switch (args.SCOPE) {
            case "all sprites": {
                return this.runtime.createNewGlobalVariable(variableName, null, "list");
            }
            case "this sprite": {
                const id = this._generateScratchId();
                return util.target.createVariable(id, variableName, "list");
            }
        }
    }
    variables_getVariable(args, util) {
        const variableName = args.NAME;
        let target;
        let isCloud = false;
        switch (args.SCOPE) {
            case "all sprites": {
                target = this.runtime.getTargetForStage();
                break;
            }
            case "this sprite": {
                target = util.target;
                break;
            }
            case "cloud": {
                target = this.runtime.getTargetForStage();
                isCloud = true;
                break;
            }
            default:
                return "";
        }
        const variables = Object.values(target.variables).filter(variable => variable.type !== "list").filter(variable => {
            if (variable.isCloud) {
                return String(variable.name).replace("☁ ", "") === variableName;
            }
            if (isCloud) return false; // above check should have already told us its a cloud variable
            return variable.name === variableName;
        });
        if (!variables) return "";
        const variable = variables[0];
        if (!variable) return "";
        return variable.value;
    }
    variables_getList(args, util) {
        const variableName = args.NAME;
        let target;
        switch (args.SCOPE) {
            case "all sprites": {
                target = this.runtime.getTargetForStage();
                break;
            }
            case "this sprite": {
                target = util.target;
                break;
            }
            default:
                return "[]";
        }
        const variables = Object.values(target.variables).filter(variable => variable.type === "list").filter(variable => variable.name === variableName);
        if (!variables) return "[]";
        const variable = variables[0];
        if (!variable) return "[]";
        return JSON.stringify(variable.value);
    }
    variables_deleteVariable(args, util) {
        const variableName = args.NAME;
        let target;
        let isCloud = false;
        switch (args.SCOPE) {
            case "all sprites": {
                target = this.runtime.getTargetForStage();
                break;
            }
            case "this sprite": {
                target = util.target;
                break;
            }
            case "cloud": {
                target = this.runtime.getTargetForStage();
                isCloud = true;
                break;
            }
            default:
                return;
        }
        const variables = Object.values(target.variables).filter(variable => variable.type !== "list").filter(variable => {
            if (variable.isCloud) {
                return String(variable.name).replace("☁ ", "") === variableName;
            }
            if (isCloud) return false; // above check should have already told us its a cloud variable
            return variable.name === variableName;
        });
        if (!variables) return;
        const variable = variables[0];
        if (!variable) return;
        return target.deleteVariable(variable.id);
    }
    variables_deleteList(args, util) {
        const variableName = args.NAME;
        let target;
        switch (args.SCOPE) {
            case "all sprites": {
                target = this.runtime.getTargetForStage();
                break;
            }
            case "this sprite": {
                target = util.target;
                break;
            }
            default:
                return;
        }
        const variables = Object.values(target.variables).filter(variable => variable.type === "list").filter(variable => variable.name === variableName);
        if (!variables) return;
        const variable = variables[0];
        if (!variable) return;
        return target.deleteVariable(variable.id);
    }
    variables_existsVariable(args, util) {
        const variableName = args.NAME;
        let target;
        let isCloud = false;
        switch (args.SCOPE) {
            case "all sprites": {
                target = this.runtime.getTargetForStage();
                break;
            }
            case "this sprite": {
                target = util.target;
                break;
            }
            case "cloud": {
                target = this.runtime.getTargetForStage();
                isCloud = true;
                break;
            }
            default:
                return false;
        }
        const variables = Object.values(target.variables).filter(variable => variable.type !== "list").filter(variable => {
            if (variable.isCloud) {
                return String(variable.name).replace("☁ ", "") === variableName;
            }
            if (isCloud) return false; // above check should have already told us its a cloud variable
            return variable.name === variableName;
        });
        if (!variables) return false;
        const variable = variables[0];
        if (!variable) return false;
        return true;
    }
    variables_existsList(args, util) {
        const variableName = args.NAME;
        let target;
        switch (args.SCOPE) {
            case "all sprites": {
                target = this.runtime.getTargetForStage();
                break;
            }
            case "this sprite": {
                target = util.target;
                break;
            }
            default:
                return false;
        }
        const variables = Object.values(target.variables).filter(variable => variable.type === "list").filter(variable => variable.name === variableName);
        if (!variables) return false;
        const variable = variables[0];
        if (!variable) return false;
        return true;
    }
}

module.exports = JgRuntimeBlocks;
