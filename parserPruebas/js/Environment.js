export class Environment {
    constructor(name, parent) {
        this.parent = parent;
        this.name = name;
        this.dictionary = new Map();
    }
    insert(name, symbol) {
        if (this.dictionary.has(name))
            return false;
        else
            this.dictionary.set(name, symbol);
        return true;
    }
    search(name) {
        for (let env = this; env != null; env = env.parent) {
            env.dictionary.forEach((value, key) => {
                if (key == name)
                    return value;
            });
        }
        return null;
    }
    modify(name, symbol) {
        for (let env = this; env != null; env = env.parent) {
            env.dictionary.forEach((value, key) => {
                if (key == name)
                    env.dictionary.set(name, symbol);
                return true;
            });
        }
        return false;
    }
}
