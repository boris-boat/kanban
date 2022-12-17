
export class Column {
    name: string;
    _id?: string
    items: Item[];

    constructor(obj?: any) {
        this.name = (obj && obj.name) || "";
        this.items = (obj && obj.items) || [];
    }
}
export class Item {
    _id?: string
    text: string;
    constructor(obj?: any) {
        this.text = (obj && obj.text) || "";
    }
}

export class User {
    _id?: string
    username: string;
    password: string;
    columns: Column[];
    constructor(obj?: any) {
        this.username = (obj && obj.username) || "";
        this.password = (obj && obj.password) || "";
        this.columns = (obj && obj.columns) || [];
        this._id = (obj && obj._id)
    }
}