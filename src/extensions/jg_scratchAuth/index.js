const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const ProjectPermissionManager = require('../../util/project-permissions');
// const Cast = require('../../util/cast');

/**
 * Class for ScratchAuthenticate blocks
 * @constructor
 */
class JgScratchAuthenticateBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.keepAllowingAuthBlock = true;
        this.disableConfirmationShown = false;
    }

    
    /**
     * dummy function for reseting user provided permisions when a save is loaded
     */
    deserialize () {
        this.disableConfirmationShown = false;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'jgScratchAuthenticate',
            name: 'Scratch Auth',
            color1: '#FFA01C',
            color2: '#ff8c00',
            blocks: [
                {
                    opcode: 'authenticate',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.authenticate',
                        default: 'get scratch username and set sign in location name to [NAME]',
                        description: "Block that returns the user's name on Scratch."
                    }),
                    disableMonitor: true,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "PenguinMod" }
                    },
                    blockType: BlockType.REPORTER
                }
            ]
        };
    }
    authenticate (args) {
        if (!this.keepAllowingAuthBlock) { // user closed popup before it was finished
            if (!this.disableConfirmationShown) { // we didnt ask them to confirm yet or they only declined it once, so we let them know every time
                const areYouSure = ProjectPermissionManager.RequestPermission("scratchSignIn");
                if (!areYouSure) { // they clicked no, dont show confirmation again
                    this.disableConfirmationShown = true;
                    return "The user has declined the ability to authenticate.";
                }
            } else { // they already clicked no before
                return "The user has declined the ability to authenticate.";
            }
        }
        return new Promise((resolve, reject) => {
            const login = window.open(
                `https://auth.itinerary.eu.org/auth/?redirect=${btoa(window.location.origin)}&name=${String(args.NAME).length > 0 ? encodeURIComponent(String(args.NAME).substring(0, 256)) : "PenguinMod"}`,
                "Scratch Authentication",
                `scrollbars=yes,resizable=yes,status=no,location=yes,toolbar=no,menubar=no,width=768,height=512,left=200,top=200`
            );
            if (!login) {
                resolve("Authentication failed to appear."); // popup was blocked most likely
                // reminder for future me to make an iframe appear if the window failed to appear
            }
            let cantAccessAnymore = false;
            let finished = false; // finished will be set to true if we got the username or something went wrong
            let interval = null; // goofy activity
            interval = setInterval(() => {
                if (login?.closed && (!finished)) {
                    this.keepAllowingAuthBlock = false;
                    clearInterval(interval);
                    try {
                        login.close();
                    } catch {
                        // what a shame we couldnt close the window that doesnt exist anymore
                    }
                    resolve("");
                }
                try {
                    const query = login.location.search;
                    if (!cantAccessAnymore) return;
                    const parameters = new URLSearchParams(query);
                    const privateCode = parameters.get("privateCode");
                    if (!privateCode) {
                        finished = true;
                        clearInterval(interval);
                        login.close();
                        resolve("");
                    }
                    clearInterval(interval);
                    fetch(`https://pm-bapi.vercel.app/api/verifyToken?privateCode=${privateCode}`).then(res => res.json().then(json => {
                        finished = true;
                        login.close();
                        if (json.valid != true) {
                            resolve("");
                        }
                        resolve(String(json.username));
                    })
                        .catch(() => {
                            finished = true;
                            login.close();
                            resolve("");
                        }))
                        .catch(() => {
                            finished = true;
                            login.close();
                            resolve("");
                        });
                } catch {
                    // due to strange chrome bug, window still has the previous url on it so we need to wait until we switch to the auth site
                    cantAccessAnymore = true;
                    // now we cant access the location yet since the user hasnt left the authentication site
                }
            }, 10);
        });
    }
}

module.exports = JgScratchAuthenticateBlocks;
