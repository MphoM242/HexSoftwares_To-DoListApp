/*const todoValue= document.getElementById('todoInput');
const todoAlert= document.getElementById('Alert');
const listItems= document.getElementById('list-items');
const addToDo= document.getElementById('addBtn');


//get todo list from local storage else create an empty array
let todo=JSON.parse(localStorage.getItem('todo-list'));
if(!todo){
    todo=[];
}

//add functions for CREATE, READ, UPDATE & DELETE

//1) CREATE:
function CreateToDoItems(){
    
    if(!todoValue.value){
        //if user tries to add an empty item
        todoAlert.style.color="red";
        todoAlert.innerHTML="Please enter your to-do text";
        todoValue.focus();
    }else{
        //check if the entered item already exists in the list
        let IsPresent=false;
        todo.forEach((element)=>{
            if(element.todoText==todoValue.value){
                IsPresent=true;
            }
        });
        
        if(IsPresent){ //item exists already
            todoAlert.style.color="red";
            setAlertMessage("Oops! This item already exists in the list!");
            return;
        }

        //Add the item to the list
        let li=document.createElement('li');
        const todoItems=`<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div>
        <div>
            <img class="edit todo-controls" onclick="EditToDoItems(this)" src="images/editBtn.png" />
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/deleteBtn.png" /> 
        </div></div>`;
        li.innerHTML=todoItems; 
        listItems.appendChild(li);

        //add the item to the local storage
        if(!todo){
            todo=[];
        }
        let itemList={item: todoValue.value, isCompleted: false};
        todo.push(itemList);
        setLocalStorage();
    }
    todoValue.value="";
    todoAlert.style.color="green";
    setAlertMessage("To-do item Created Successfully!");
}*/

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
        if (!todoValue.value) { //ADD: check if value is not just white space!!!
            //ADD: remove white space in the begginning and end of input before writing it in list
            // If user tries to add an empty item
            todoAlert.style.color = "red";
            setAlertMessage("Please enter your to-do text!");
            todoValue.focus();
        } else {
            // Check if the entered item already exists in the list
            let IsPresent = todo.some((element) => element.item === todoValue.value);

            if (IsPresent) {
                // Item exists already
                todoAlert.style.color = "red";
                setAlertMessage("Oops! This item already exists in the list!");
                return;
            }

            // Add the item to the list
            let li = document.createElement('li');
            const todoItems = `
                <div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">
                    ${todoValue.value}
                </div>
                <div>
                    <img class="edit todo-controls" onclick="EditToDoItems(this)" src="images/editBtn.png" />
                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/deleteBtn.png" /> 
                </div>
            `;
            li.innerHTML = todoItems; 
            listItems.appendChild(li);

            // Add the item to the local storage
            const itemList = { item: todoValue.value, isCompleted: false };
            todo.push(itemList);
            setLocalStorage();

            // Clear input and set success message
            todoValue.value = "";
            todoAlert.style.color = "green";
            setAlertMessage("To-do item Created Successfully!");
        }
    }
    // Event listener for the add button
    addToDo.addEventListener('click', CreateToDoItems);

    //2) READ:
    function ReadToDoItems() {
       /* todo.forEach((element) => {
          let li = document.createElement("li");
          let style = "";
          if (element.isCompleted) {
            style = "style='text-decoration: line-through'";
          }
          const todoItems = `<div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${
            element.item
          }
          ${
            style === ""
              ? ""
              : '<img class="todo-controls" src="/images/check-mark.png" />'
          }</div><div>
          ${
            style === ""
              ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" />'
              : ""
          }
          <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" /></div></div>`;
          li.innerHTML = todoItems;
          listItems.appendChild(li);
        });*/
      }
      //ReadToDoItems();

      
    //3)UPDATE/EDIT:
    function EditToDoItems(){

    }


    //4) DELETE:
    function DeleteToDoItems(){

    }
});
