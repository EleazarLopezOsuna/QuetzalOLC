export class Environment{
    public dictionary: Map<string, Symbol>;
    public parent: Environment;
    public name: string;

    constructor(name: string, parent: Environment){
        this.parent = parent;
        this.name = name;
        this.dictionary = new Map<string, Symbol>();
    }

    public insert(name: string, symbol: Symbol):boolean{
        if(this.dictionary.has(name))
            return false;
        else
            this.dictionary.set(name, symbol);
        return true;
    }

    public search(name: string){
        for(let env:Environment = this; env != null; env = env.parent){
            env.dictionary.forEach((value: Symbol, key: string) => {
                if(key == name)
                    return value;
            });
        }
        return null;
    }

    public modify(name: string, symbol: Symbol):boolean{
        for(let env:Environment = this; env != null; env = env.parent){
            env.dictionary.forEach((value: Symbol, key: string) => {
                if(key == name)
                    env.dictionary.set(name, symbol);
                    return true;
            });
        }
        return false;
    }

}