const Cast = require('../util/cast');

class Scratch3ControlBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * The "counter" block value. For compatibility with 2.0.
         * @type {number}
         */
        this._counter = 0;

        this.runtime.on('RUNTIME_DISPOSED', this.clearCounter.bind(this));
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            control_repeat: this.repeat,
            control_repeat_until: this.repeatUntil,
            control_while: this.repeatWhile,
            control_for_each: this.forEach,
            control_forever: this.forever,
            control_wait: this.wait,
            control_waittick: this.waitTick,
            control_waitsecondsoruntil: this.waitOrUntil,
            control_wait_until: this.waitUntil,
            control_if: this.if,
            control_if_else: this.ifElse,
            control_stop: this.stop,
            control_stop_sprite: this.stopSprite,
            control_create_clone_of: this.createClone,
            control_delete_this_clone: this.deleteClone,
            control_delete_clones_of: this.deleteClonesOf,
            control_get_counter: this.getCounter,
            control_incr_counter: this.incrCounter,
            control_decr_counter: this.decrCounter,
            control_set_counter: this.setCounter,
            control_clear_counter: this.clearCounter,
            control_all_at_once: this.allAtOnce,
            control_backToGreenFlag: this.backToGreenFlag,
            control_if_return_else_return: this.if_return_else_return,
            control_javascript_command: this.runJavascript
        };
    }

    getMonitored () {
        return {
            control_get_counter: {
                getId: () => 'get_counter'
            }
        };
    }

    backToGreenFlag () {
        this.runtime.greenFlag();
    }

    if_return_else_return (args) {
        return args.boolean ? args.TEXT1 : args.TEXT2;
    }

    getHats () {
        return {
            control_start_as_clone: {
                restartExistingThreads: false
            }
        };
    }

    // eslint-disable-next-line no-unused-vars
    runJavascript (args, util, realBlockInfo) {
        const js = Cast.toString(args.JS);
        return eval(js);
    }

    repeat (args, util) {
        const times = Math.round(Cast.toNumber(args.TIMES));
        // Initialize loop
        if (typeof util.stackFrame.loopCounter === 'undefined') {
            util.stackFrame.loopCounter = times;
        }
        // Only execute once per frame.
        // When the branch finishes, `repeat` will be executed again and
        // the second branch will be taken, yielding for the rest of the frame.
        // Decrease counter
        util.stackFrame.loopCounter--;
        // If we still have some left, start the branch.
        if (util.stackFrame.loopCounter >= 0) {
            util.startBranch(1, true);
        }
    }

    repeatUntil (args, util) {
        const condition = Cast.toBoolean(args.CONDITION);
        // If the condition is false (repeat UNTIL), start the branch.
        if (!condition) {
            util.startBranch(1, true);
        }
    }

    repeatWhile (args, util) {
        const condition = Cast.toBoolean(args.CONDITION);
        // If the condition is true (repeat WHILE), start the branch.
        if (condition) {
            util.startBranch(1, true);
        }
    }

    forEach (args, util) {
        const variable = util.target.lookupOrCreateVariable(
            args.VARIABLE.id, args.VARIABLE.name);

        if (typeof util.stackFrame.index === 'undefined') {
            util.stackFrame.index = 0;
        }

        if (util.stackFrame.index < Number(args.VALUE)) {
            util.stackFrame.index++;
            variable.value = util.stackFrame.index;
            util.startBranch(1, true);
        }
    }

    waitUntil (args, util) {
        const condition = Cast.toBoolean(args.CONDITION);
        if (!condition) {
            util.yield();
        }
    }

    forever (args, util) {
        util.startBranch(1, true);
    }

    wait (args, util) {
        if (util.stackTimerNeedsInit()) {
            const duration = Math.max(0, 1000 * Cast.toNumber(args.DURATION));

            util.startStackTimer(duration);
            this.runtime.requestRedraw();
            util.yield();
        } else if (!util.stackTimerFinished()) {
            util.yield();
        }
    }
    
    waitTick (_, util) {
        util.yieldTick();
    }

    waitOrUntil (args, util) {
        const condition = Cast.toBoolean(args.CONDITION);
        if (!condition) {
            if (util.stackTimerNeedsInit()) {
                const duration = Math.max(0, 1000 * Cast.toNumber(args.DURATION));

                util.startStackTimer(duration);
                this.runtime.requestRedraw();
                util.yield();
                return;
            }
            if (!util.stackTimerFinished()) {
                util.yield();
            }
        }
    }

    if (args, util) {
        const condition = Cast.toBoolean(args.CONDITION);
        if (condition) {
            util.startBranch(1, false);
        }
    }

    ifElse (args, util) {
        const condition = Cast.toBoolean(args.CONDITION);
        if (condition) {
            util.startBranch(1, false);
        } else {
            util.startBranch(2, false);
        }
    }

    stop (args, util) {
        const option = args.STOP_OPTION;
        if (option === 'all') {
            util.stopAll();
        } else if (option === 'other scripts in sprite' ||
            option === 'other scripts in stage') {
            util.stopOtherTargetThreads();
        } else if (option === 'this script') {
            util.stopThisScript();
        }
    }

    stopSprite (args, util) {
        const option = args.STOP_OPTION;
        // Set target
        let target;
        if (option === '_myself_') {
            target = util.target;
        } else if (option === '_stage_') {
            target = this.runtime.getTargetForStage();
        } else {
            target = this.runtime.getSpriteTargetByName(option);
        }
        if (!target) return;
        this.runtime.stopForTarget(target);
    }

    createClone (args, util) {
        this._createClone(Cast.toString(args.CLONE_OPTION), util.target);
    }
    _createClone (cloneOption, target) { // used by compiler
        // Set clone target
        let cloneTarget;
        if (cloneOption === '_myself_') {
            cloneTarget = target;
        } else {
            cloneTarget = this.runtime.getSpriteTargetByName(cloneOption);
        }

        // If clone target is not found, return
        if (!cloneTarget) return;

        // Create clone
        const newClone = cloneTarget.makeClone();
        if (newClone) {
            this.runtime.addTarget(newClone);

            // Place behind the original target.
            newClone.goBehindOther(cloneTarget);
        }
    }

    deleteClone (args, util) {
        if (util.target.isOriginal) return;
        this.runtime.disposeTarget(util.target);
        this.runtime.stopForTarget(util.target);
    }

    deleteClonesOf (args, util) {
        const cloneOption = Cast.toString(args.CLONE_OPTION);
        // Set clone target
        let cloneTarget;
        if (cloneOption === '_myself_') {
            cloneTarget = util.target;
        } else {
            cloneTarget = this.runtime.getSpriteTargetByName(cloneOption);
        }

        // If clone target is not found, return
        if (!cloneTarget) return;
        const sprite = cloneTarget.sprite;
        if (!sprite) return;
        if (!sprite.clones) return;
        const cloneList = [].concat(sprite.clones);
        cloneList.forEach(clone => {
            if (clone.isOriginal) return;
            if (clone.isStage) return;
            this.runtime.disposeTarget(clone);
            this.runtime.stopForTarget(clone);
        })
    }

    getCounter () {
        return this._counter;
    }

    setCounter (args) {
        const num = Cast.toNumber(args.VALUE);
        this._counter = num;
    }

    clearCounter () {
        this._counter = 0;
    }

    incrCounter () {
        this._counter++;
    }
    
    decrCounter () {
        this._counter--;
    }

    allAtOnce (util) {
        util.thread.peekStackFrame().warpMode = false;
        util.startBranch(1, false);
        util.thread.peekStackFrame().warpMode = true;
    }
}

module.exports = Scratch3ControlBlocks;
