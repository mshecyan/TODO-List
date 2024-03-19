//объект кнопки "Добавить"
let item_add_btn = document.getElementById("create");

//функция отметки выполнения
function SuccessCheck() {
    this.firstChild.classList.toggle("check");
    this.parentElement.classList.toggle("task-done");
}

//функция редактирования элемента
function ItemEdit() {
    let text = this.parentElement.previousSibling.lastChild.textContent;
    this.parentElement.previousSibling.lastChild.insertAdjacentHTML("beforebegin", "<input type=\"text\" class=\"item-text\" value=\"" + text + "\">");
    this.parentElement.previousSibling.lastChild.remove();
    this.parentElement.previousSibling.lastChild.focus();
    this.parentElement.previousSibling.lastChild.addEventListener("focusout", ItemEndEdit);
}

//функция завершения редактирования элемента
function ItemEndEdit() {
    let text = this.value;
    if (text != "") {
        this.insertAdjacentHTML("beforebegin", "<div class=\"item-text\">" + text + "</div>");
        this.remove();
    }
    else {
        this.parentElement.parentElement.remove();
    }
}

//функция удаления элемента из списка
function ItemDelete() {
    this.parentElement.parentElement.remove();
}

//функция вставки нового элемента в список
function ItemAdd(txt, status, edit) {
    let item_object = "<div class=\"item\">" +
        "<div class=\"item-box\">" + 
            "<div class=\"item-icon success-box\">" + 
                "<div class=\"non-check\"></div>" + 
            "</div>";
    
    if (edit) {
        item_object += "<input type=\"text\" placeholder=\"Начните писать...\" class=\"item-text\">";
    }
    else {
        item_object += "<div class=\"item-text\">" + txt + "</div>";
    }
    item_object += "</div>" +
            "<div class=\"item-control\">" +
                "<div class=\"item-icon\">" +
                    "<div class=\"edit\"></div>" +
                "</div>" +
                "<div class=\"item-icon\">" +
                    "<div class=\"delete\"></div>" +
                "</div>" +
            "</div>" +
        "</div>";

    item_add_btn.insertAdjacentHTML("beforebegin", item_object);

    current_elem = document.getElementsByClassName("success-box");
    current_elem[current_elem.length-1].addEventListener("click", SuccessCheck);
    if (status) {
        current_elem[current_elem.length-1].firstChild.classList.add("check");
        current_elem[current_elem.length-1].parentElement.classList.add("task-done");
    }

    current_edit = document.getElementsByClassName("edit");
    current_edit[current_edit.length-1].parentElement.addEventListener("click", ItemEdit);

    current_delete = document.getElementsByClassName("delete");
    current_delete[current_delete.length-1].parentElement.addEventListener("click", ItemDelete);

    if (edit) {
        current_text = document.getElementsByClassName("item-text");
        current_text[current_text.length-1].addEventListener("focusout", ItemEndEdit);
        current_text[current_text.length-1].focus();
    }
}

//обработка события нажатия на кнопку "Добавить"
function ItemAddEvent() {
    ItemAdd("", false, true);
}

//нажатие на кнопку "Добавить"
item_add_btn.addEventListener("click", ItemAddEvent);

//обработка события закрытия страницы
window.onunload = function() {
    let items = document.getElementsByClassName("item-text");
    let check = document.getElementsByClassName("non-check");
    let item_txt = Array();
    let check_box = Array();

    for (let i = 0; i < items.length; i++) {
        items[i].blur();
        item_txt.push(items[i].textContent);
        check_box.push(check[i].classList.contains("check"));
    }

    localStorage.setItem("todo_items", JSON.stringify(item_txt));
    localStorage.setItem("todo_items_check", JSON.stringify(check_box));
}

//обработка события загрузки страницы
window.onload = function() {
    let items = localStorage.getItem("todo_items");
    let check_box = localStorage.getItem("todo_items_check");
    item_txt = JSON.parse(items);
    check = JSON.parse(check_box);

    for (let i = 0; i < item_txt.length; i++) {
        ItemAdd(item_txt[i], check[i], false);
    }
}