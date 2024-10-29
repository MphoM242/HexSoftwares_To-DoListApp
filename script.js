document.addEventListener("DOMContentLoaded", function () { 
    const todoValue = document.getElementById('todoInput');
    const todoAlert = document.getElementById('Alert');
    const listItems = document.getElementById('list-items');
    const addToDo = document.getElementById('addBtn');

    addToDo.setAttribute("title", "Add item!");

    let todo = JSON.parse(localStorage.getItem('todo-list')) || [];
    let updateText = null; // Placeholder to track the item being updated
    let isUpdating = false; // Placeholder to track if the user is updating an item

    function setLocalStorage() {
        localStorage.setItem('todo-list', JSON.stringify(todo));
    }

    //Function to display alert message
    function setAlertMessage(message, color = "gray") {
        todoAlert.removeAttribute("class");
        todoAlert.style.color = color;
        todoAlert.innerText = message;
        setTimeout(() => {
          todoAlert.classList.add("toggleMe");
        }, 8000);
      }

    //Event listener for Enter key
    todoValue.addEventListener('keyup', function(event) { 
        if (event.key === "Enter") {
            if(isUpdating) {
                UpdateOnSelectionItems(); 
            }
            else{
                CreateToDoItems();
            }
            
        }
    });

    //Event listener for Add button
    addToDo.addEventListener('click', function() { 
        if(isUpdating) {
            UpdateOnSelectionItems(); 
        }
        else{
            CreateToDoItems();
        }
    });

    //1) CREATE function
    function CreateToDoItems() {
        if(isUpdating) {
            return; //Skip if we are updating an item
        }
        if (!todoValue.value.trim()) {
            setAlertMessage("Please enter your to-do text!","red");
            todoValue.focus(); 
        } else {
            let IsPresent = todo.some((element) => element.item === todoValue.value.trim());

            if (IsPresent) {
                setAlertMessage("Oops! This item already exists!","red");
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
            setAlertMessage("To-do item Created Successfully!", "green");

            const itemTextDiv = li.querySelector(".todo-text");
            itemTextDiv.addEventListener("dblclick", function(event) {
                event.preventDefault();
                CompletedToDoItems(li);
            });
        }
    }

    //2) READ function:
    function ReadToDoItems() {
        listItems.innerHTML = ""; // Clear list before rendering
        todo.forEach((element) => {
            let li = document.createElement("li");
            li.classList.add("todo-item");
            let style = element.isCompleted ? "text-decoration: line-through" : "";
            const todoItems = `
                <div class="todo-text" style="${style}">
                    ${element.item}
                    ${element.isCompleted ? '<img class="checkmark todo-controls" src="images/checkmark2.png" />' : ''}
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

    // Mark COMPLETED/Undo function
    function CompletedToDoItems(itemElement) {
        const itemTextDiv = itemElement.querySelector(".todo-text");
        const itemText = itemTextDiv.innerText.trim();

        todo.forEach((element) => { 
            if (element.item === itemText && !element.isCompleted) {
                element.isCompleted = true;
                itemTextDiv.style.textDecoration = "line-through";

                if (!itemTextDiv.querySelector(".checkmark")) {
                    const checkmarkImg = document.createElement("img");
                    checkmarkImg.src = "images/checkmark2.png";
                    checkmarkImg.className = "todo-controls checkmark";
                    itemTextDiv.appendChild(checkmarkImg);
                }

                const editBtn = itemElement.querySelector(".edit");
                if (editBtn) {
                     editBtn.remove();
                }

                setAlertMessage("To-do item Completed Successfully! Keep it up :)", "green");
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

                // Insert the edit button before the delete button
                const deleteBtn = controlsDiv.querySelector(".delete");
                controlsDiv.insertBefore(editBtn, deleteBtn);

                setAlertMessage("To-do item marked as Incomplete!", "gray");
            }
            setLocalStorage();
        });
    }

    //3) UPDATE function:
        function UpdateToDoItems(e) {
            setAlertMessage("", "gray");
            if (e.parentElement.parentElement.querySelector("div").style.textDecoration === "") {
                todoValue.value = e.parentElement.parentElement.querySelector("div").innerText;
                updateText = e.parentElement.parentElement.querySelector("div");
        
                isUpdating = true; // Set update mode to true
                //addToDo.setAttribute("onclick", "UpdateOnSelectionItems()");
                addToDo.setAttribute("src", "images/refresh.png");
                addToDo.setAttribute("title", "Press Enter key or click here to Update!");
        
                // Add a cancel button to allow the user to cancel the update
                let cancelBtn = document.createElement("img");
                cancelBtn.src = "images/crossBtn.png";
                cancelBtn.className = "cancel-btn";
                cancelBtn.title = "Cancel Update!";
                cancelBtn.onclick = CancelUpdate;

                addToDo.parentNode.insertBefore(cancelBtn, addToDo.nextSibling);
        
                todoValue.focus();
            }
        }

        function UpdateOnSelectionItems() {
            let isPresent = todo.some((element) => element.item === todoValue.value);
        
            if (isPresent) {
                setAlertMessage("This item already exists!", "red");
                return;
            }
        
            todo.forEach((element) => {
                if (element.item === updateText.innerText.trim()) {
                    element.item = todoValue.value;
                }
            });
            setLocalStorage();
        
            updateText.innerText = todoValue.value;
            setTimeout(() => {
                todoValue.value = ""; 
            }, 100); 
            setAlertMessage("To-do item Updated Successfully!", "green");
        
            isUpdating = false; // Exit update mode after successful update
            //addToDo.setAttribute("onclick", "CreateToDoItems()");
            addToDo.setAttribute("src", "images/addBtn.png");
            addToDo.setAttribute("title", "Press Enter key or click here to Add!");
        
            const cancelBtn = document.querySelector(".cancel-btn");
            if (cancelBtn) cancelBtn.remove();
        
            
        }

        function CancelUpdate() {
            todoValue.value = "";
            updateText = null;
        
            isUpdating = false; // Exit update mode
            //addToDo.setAttribute("onclick", "CreateToDoItems()");
            addToDo.setAttribute("src", "images/addBtn.png");
        
            const cancelBtn = document.querySelector(".cancel-btn");
            if (cancelBtn) cancelBtn.remove();
        
            setAlertMessage("Update canceled.", "gray");
        }
        

    //4) DELETE function:
    function DeleteToDoItems(e) {
        //const todoValue=document.getElementById("todoInput");
        //const todoAlert=document.getElementById('Alert');

        let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;

        if(confirm(`Are you sure you want to delete "${deleteValue}"?`)){
            e.parentElement.parentElement.setAttribute("class","deleted-item");
            todoValue.focus();

            //const todo = JSON.parse(localStorage.getItem('todo-list'));

            const index=todo.findIndex((element) => element.item === deleteValue.trim());
            if(index > -1){
                todo.splice(index,1);
            }
                
            setTimeout(() => {
                e.parentElement.parentElement.remove();
            },1000);

            setLocalStorage();
            setAlertMessage("Item Deleted Successfully!", "green");
        }
    }

    // Assign functions to the global scope
    window.UpdateToDoItems = UpdateToDoItems;
    window.UpdateOnSelectionItems = UpdateOnSelectionItems;
    window.DeleteToDoItems = DeleteToDoItems;
});

