class Item {
    id?: number;
    name?: string;
}

class StoreManager {

    constructor(key: string) {
        this.key = key;
    }

    private key: string;

    add(itemList: Item[]) {
        localStorage.setItem(this.key, JSON.stringify(itemList));
    }

    remove(id: number) {
        let itemList = this.getAll();
        itemList = itemList.filter(item => item.id !== id);
        this.add(itemList);
    }

    getAll() {
        let data = <string>localStorage.getItem(this.key);
        if (data) {
            return <Item[]>JSON.parse(data);
        } else {
            return [];
        }
    }
}


let store = new StoreManager('store');

let storeSession = new StoreManager('storeSession');
debugger

let itemList: Item[] = [];
let counter = 0;
const elementInputField: HTMLInputElement = <HTMLInputElement>(document.querySelector('.todo-input-new-item'));

function addItem(name: string) {
    let item = { name: name, id: counter++ };
    itemList.push(item);
    store.add(itemList);
    return item;
}

function clearInputField() {
    elementInputField.value = '';
}

function removeItem(id: number) {
    itemList = itemList.filter(item => item.id === id);
    store.remove(id);
}

function onAddItem() {
    let name = elementInputField.value;
    addItemToDomAndList(name);
}

function addItemToDomAndList(name: string) {
    let item = addItem(name);
    addItemDom(item);
}

function addItemDom(item: Item) {
    let template = `
    <div class="todo-item" data-item-id="${item.id}">
      <div class="todo-item__name">
        ${item.name}
      </div>
      <div class="todo-item__close" data-id="${item.id}">
        X
      </div>
    </div>`;
    let wrapperList = <HTMLDivElement>document.querySelector('.todo-items');
    wrapperList.innerHTML = template + wrapperList.innerHTML;
    clearInputField();
}

function removeItemDoom(id: number) {
    let toRemove = <HTMLDivElement>document.querySelector(`[data-item-id="${id}"]`);
    toRemove.remove();
}

let btnSave = <HTMLButtonElement>document.querySelector('.todo-button-save');
btnSave.addEventListener("click", onAddItem);


document.addEventListener('click', function (e: MouseEvent) {
    let target = <HTMLElement>e.target;
    if (target && target.className === 'todo-item__close') {
        let id = <string>target.dataset.id;
        removeItem(+id);
        removeItemDoom(+id);
    }
});

function init() {
    store.getAll().forEach(item => {
        addItemToDomAndList(<string>item.name);
    });
}

init();

