document.addEventListener("DOMContentLoaded", function () { 
    const todoValue = document.getElementById('todoInput');
    const todoAlert = document.getElementById('Alert');
    const listItems = document.getElementById('list-items');
    const addToDo = document.getElementById('addBtn');

    let todo = JSON.parse(localStorage.getItem('todo-list')) || [];

    function setLocalStorage() {
        localStorage.setItem('todo-list', JSON.stringify(todo));
    }

    function setAlertMessage(message) {
        todoAlert.innerHTML = message;
    }

    // CREATE function
    function CreateToDoItems() {
        if (!todoValue.value.trim()) {
            todoAlert.style.color = "red";
            setAlertMessage("Please enter your to-do text!");
            todoValue.focus(); 
        } else {
            let IsPresent = todo.some((element) => element.item === todoValue.value.trim());

            if (IsPresent) {
                todoAlert.style.color = "red";
                setAlertMessage("Oops! This item already exists in the list!");
                return;
            }

            let li = document.createElement('li');
            li.classList.add('todo-item');
            const todoItems = `
                <div class="todo-text">
                    ${todoValue.value.trim()}
                </div>
                <div> 
                    <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/editBtn.png" />
                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/deleteBtn.png" /> 
                </div>
            `;
            li.innerHTML = todoItems; 
            listItems.appendChild(li);

            const itemList = { item: todoValue.value.trim(), isCompleted: false };
            todo.push(itemList);
            setLocalStorage();

            todoValue.value = "";
            todoAlert.style.color = "green";
            setAlertMessage("To-do item Created Successfully!");

            const itemTextDiv = li.querySelector(".todo-text");
            itemTextDiv.addEventListener("dblclick", function(event) {
                event.preventDefault();
                CompletedToDoItems(li);
            });
        }
    }

    todoValue.addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            CreateToDoItems();
        }
    });

    addToDo.addEventListener('click', CreateToDoItems);

    // READ function
    function ReadToDoItems() {
        listItems.innerHTML = ""; // Clear list before rendering
        todo.forEach((element) => {
            let li = document.createElement("li");
            li.classList.add("todo-item");
            let style = element.isCompleted ? "text-decoration: line-through" : "";
            const todoItems = `
                <div class="todo-text" style="${style}">
                    ${element.item}
                    ${element.isCompleted ? '<img class="checkmark todo-controls" src="images/checkmark.png" />' : ''}
                </div>
                <div>
                    ${!element.isCompleted ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/editBtn.png" />' : ''}
                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/deleteBtn.png" />
                </div>
            `;
            li.innerHTML = todoItems;
            listItems.appendChild(li);

            const itemTextDiv = li.querySelector(".todo-text");
            itemTextDiv.addEventListener("dblclick", function(event) {
                event.preventDefault();
                CompletedToDoItems(li);
            });
        });
    }
    ReadToDoItems();

    // COMPLETED/Undo function
    function CompletedToDoItems(itemElement) {
        const itemTextDiv = itemElement.querySelector(".todo-text");
        const itemText = itemTextDiv.innerText.trim();

        todo.forEach((element) => { 
            if (element.item === itemText && !element.isCompleted) {
                element.isCompleted = true;
                itemTextDiv.style.textDecoration = "line-through";

                if (!itemTextDiv.querySelector(".checkmark")) {
                    const checkmarkImg = document.createElement("img");
                    checkmarkImg.src = "images/checkmark.png";
                    checkmarkImg.className = "todo-controls checkmark";
                    itemTextDiv.appendChild(checkmarkImg);
                }

                const editBtn = itemElement.querySelector(".edit");
                if (editBtn) {
                     editBtn.remove();
                }

                todoAlert.style.color = "green";
                setAlertMessage("To-do item Completed Successfully! Keep it up :)");
            } 
            else if (element.item === itemText && element.isCompleted) {
                element.isCompleted = false;
                itemTextDiv.style.textDecoration = "";

                const checkmarkImg = itemTextDiv.querySelector(".checkmark");
                if (checkmarkImg) {
                    checkmarkImg.remove();
                }

                const controlsDiv = itemElement.querySelector("div:last-child");
                const editBtn = document.createElement("img");
                editBtn.src = "images/editBtn.png";
                editBtn.className = "edit todo-controls";
                editBtn.style.marginRight = "8px";
                editBtn.onclick = function() {
                    UpdateToDoItems(this);
                };
                const deleteBtn = controlsDiv.querySelector(".delete");
                controlsDiv.insertBefore(editBtn, deleteBtn);

                todoAlert.style.color = "gray";
                setAlertMessage("To-do item marked as Incomplete!");
            }
            setLocalStorage();
        });
    }
});

//4) DELETE (DONE):
// Delete the item from the list and local storage
//if user says ok on confirm box, then delete the item
//if user says cancel on confirm box, then do nothing
function DeleteToDoItems(e) {
    const todoValue=document.getElementById("todoInput");
    const todoAlert=document.getElementById('Alert');

    let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;

    if(confirm(`Are you sure you want to delete "${deleteValue}"?`)){
        e.parentElement.parentElement.setAttribute("class","deleted-item");
        todoValue.focus();

        const todo = JSON.parse(localStorage.getItem('todo-list'));

        const index=todo.findIndex((element) => element.item === deleteValue.trim());
        if(index > -1){
            todo.splice(index,1);
        }
            
        setTimeout(() => {
            e.parentElement.parentElement.remove();
        },1000);

        localStorage.setItem('todo-list', JSON.stringify(todo));
        todoAlert.style.color = "green";
        todoAlert.innerHTML="Item Deleted Successfully!";
    }
}

// UPDATE:
function UpdateToDoItems(e) {
    // Implement edit logic here
    alert("Edit function is not yet implemented.");
}
