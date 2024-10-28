document.addEventListener("DOMContentLoaded", function () {
    const todoValue = document.getElementById('todoInput');
    const todoAlert = document.getElementById('Alert');
    const listItems = document.getElementById('list-items');
    const addToDo = document.getElementById('addBtn');

    // Get todo list from local storage or create an empty array
    let todo = JSON.parse(localStorage.getItem('todo-list')) || [];

    // Function to update the local storage
    function setLocalStorage() {
        localStorage.setItem('todo-list', JSON.stringify(todo));
    }

    // Helper function to set alert messages
    function setAlertMessage(message) {
        todoAlert.innerHTML = message;
    }

    // CREATE function
    function CreateToDoItems() {
        if (!todoValue.value.trim()) {
            // If user tries to add an empty item
            todoAlert.style.color = "red";
            setAlertMessage("Please enter your to-do text!");
            todoValue.focus(); 
        } else {
            // Check if the entered item already exists in the list
            let IsPresent = todo.some((element) => element.item === todoValue.value.trim());

            if (IsPresent) {
                // Item exists already
                todoAlert.style.color = "red";
                setAlertMessage("Oops! This item already exists in the list!");
                return;
            }

            // Add the item to the list
            let li = document.createElement('li');
            li.classList.add('todo-item'); // Add a class for easy selection
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

            // Add the item to the local storage
            const itemList = { item: todoValue.value.trim(), isCompleted: false };
            todo.push(itemList);
            setLocalStorage();

            // Clear input and set success message
            todoValue.value = "";
            todoAlert.style.color = "green";
            setAlertMessage("To-do item Created Successfully!");

            // Add event listener for double-click completion
            const itemTextDiv = li.querySelector(".todo-text");
            itemTextDiv.addEventListener("dblclick", function(event) {
                event.preventDefault(); //Prevent text highlighting
                CompletedToDoItems(li); //Pass the li element to the function
            });
    
        }
    }
    //Listen for the enter key press
    todoValue.addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            CreateToDoItems();
        }
    });
    // Event listener for the add button
    addToDo.addEventListener('click', CreateToDoItems);

    //2) READ:
    function ReadToDoItems() {
       todo.forEach((element) => {
          let li = document.createElement("li");
          li.classList.add("todo-item");
          let style = element.isCompleted ? "text-decoration: line-through" : "";
          const todoItems = `
            <div class="todo-text" style="${style}">
                ${element.item}
                ${element.isCompleted ? '<img class="todo-controls" src="images/checkmark.png" />' : ''}
            </div>
            <div>
                ${!element.isCompleted ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/editBtn.png" />' : ''}
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/deleteBtn.png" />
            </div>
          `;
          li.innerHTML = todoItems;
          listItems.appendChild(li);

          // Add event listener for double-click completion
          const itemTextDiv = li.querySelector(".todo-text");
          itemTextDiv.addEventListener("dblclick", function(event) {
              event.preventDefault(); //Prevent text highlighting
              CompletedToDoItems(li);
          });
       });
    }
    ReadToDoItems(); //Display the items on page load

    // COMPLETED:
    function CompletedToDoItems(itemElement) {
        const itemTextDiv = itemElement.querySelector(".todo-text");
        const itemText = itemTextDiv.innerText.trim();
        
        // Find the todo item in the array and mark it as completed
        todo.forEach((element) => { 
            if (element.item === itemText) {
                element.isCompleted = true;
                // Add strikethrough and checkmark
                itemTextDiv.style.textDecoration = "line-through";
                const checkmarkImg = document.createElement("img");
                checkmarkImg.src = "images/checkmark.png";
                checkmarkImg.className = "todo-controls checkmark";
                itemTextDiv.appendChild(checkmarkImg);

                // Remove the edit button
                const editBtn = itemElement.querySelector(".edit"); // Find the edit button
                if (editBtn) {
                     editBtn.remove();
                }

                setLocalStorage();

                todoAlert.style.color = "green";
                setAlertMessage("To-do item Completed Successfully! Keep it up :)");
            }
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
        todoAlert.innerHTML="To-do item Deleted Successfully";
    }
}

// UPDATE:
function UpdateToDoItems(e) {
    // Implement edit logic here
    alert("Edit function is not yet implemented.");
}



