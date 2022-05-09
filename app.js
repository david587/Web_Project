
const host = 'http://localhost:3000/';
const addButton = document.querySelector('#addButton');
const nameElem = document.querySelector('#name');
const cityElem = document.querySelector('#city');
const salaryElem = document.querySelector('#salary');
const tableBody = document.querySelector('#tableBody');

const saveButton = document.querySelector('#saveButton');
const editIdElem = document.querySelector('#editId');
const editNameElem = document.querySelector('#editName');
const editCityElem = document.querySelector('#editCity');
const editSalaryElem = document.querySelector('#editSalary');

var actualTr = null;//ebbe tároljuk hog utanna tudjuk törölni

addButton.addEventListener('click', () => {
    const name = nameElem.value;
    const city = cityElem.value;
    const salary = salaryElem.value;
    addEmployee(name, city, salary);
});

getEmployees();

//betöltödésnél ez hajtódik végre
function getEmployees() {
    tableBody.innerHTML=""; //mielött betöltjük kiüresitjük
    let endpoint = "employees"
    let url=host+endpoint;
    fetch(url)
    .then(res => res.json())
    .then(res => {
        // console.log(res);
        renderEmployees(res);
    });
}

function renderEmployees(employees) {
    employees.forEach( employee => {
        let tr = document.createElement('tr');
        let tdId = document.createElement('td');
        let tdName = document.createElement('td');
        let tdCity = document.createElement('td');
        let tdSalary = document.createElement('td');

        let tdDelete = document.createElement('td');
        let delButton = document.createElement('button');
        delButton.classList.add("btn");
        delButton.classList.add("btn-warning");
        
        delButton.textContent = 'Törlés';
        setEvent(delButton, employee.id);
        tdDelete.appendChild(delButton);

        //szerkesztés ide
        let tdEdit =document.createElement("td");
        let editButton = document.createElement("button");


        editButton.classList.add("btn");
        editButton.classList.add("btn-primary");
        editButton.setAttribute('data-bs-toggle','modal');
        editButton.setAttribute('data-bs-target','#editModal');

        editButton.innerHTML ='Szerkesztés';
        setEditButtonEvent(editButton,employee);
        tdEdit.appendChild(editButton);

        tableBody.appendChild(tr);
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdCity);
        tr.appendChild(tdSalary);
        tr.appendChild(tdDelete);
        tr.appendChild(tdEdit);
        tdId.textContent = employee.id;
        tdName.textContent = employee.name;
        tdCity.textContent = employee.city;
        tdSalary.textContent = employee.salary;
        console.log(employee.city);
    });
}

function setEvent(delButton, id) {
    // delButton.setAttribute('data-id', id);
    delButton.addEventListener('click', () => {
        // console.log(delButton.dataset.id);
        console.log(id);
        delEmployee(id)
        actualTr =delButton.parentElement.parentElement;//tr elemet tároljuk el, ugy tudja kitörölni
        actualTr.parentNode.removeChild(actualTr);//önmagát adjuk meg
        //adatbázisból igy nem törli
    });
}

function setEditButtonEvent(editButton,employee){
    editButton.addEventListener("click",() => {
        console.log(employee.name);
        editIdElem.value = employee.id;
        editNameElem.value = employee.name;
        editCityElem.value = employee.city;
        editSalaryElem.value = employee.salary; //szerkesztés gomba beiirodik inputba amit kell szerkeszteni
        actualTr = editButton.parentElement.parentElement;//rámutatunk a sorra,melyik sorrol van szó


    });
}

saveButton.addEventListener("click",() =>{
    console.log("mentés")
    actualTr.childNodes[1].textContent=editNameElem.value;
    actualTr.childNodes[2].textContent=editCityElem.value;
    actualTr.childNodes[3].textContent=editSalaryElem.value;
    //mielött nullázuk azelött lementjük az adatbázisba
    updateEmployee();
    editIdElem="";
    editNameElem="";
    editCityElem="";
    editSalaryElem="";
});

//menti a szerkesztést
function  updateEmployee(){
    let endpoint="emloyees";
    let url = host + endpoint+"/"+editIdElem.value;
    fetch(url,{
        method: "put",
        body: JSON.stringify({
            name: editNameElem.value,
            city: editCityElem.value,
            salary: editSalaryElem.value
        }),//kulcsokat idézőjelbe teszi
        headers:{
            "content-Type": "application/json" //json formátumba teszi
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        
})
}

function delEmployee(id){
    let endpoint = "employees";
    let url =host+endpoint+"/"+id;
    fetch(url,{
        method: "delete"
    });

}


function addEmployee(name, city, salary) {
    let endpoint = "employees";
    let url = host+endpoint;
    fetch(url, {
        method: "post",
        body: JSON.stringify({
            name: name,
            city: city,
            salary: salary
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        getEmployees();//igy frissités nélkül hozzáadja
        nameElem.value="";
        cityElem.value="";
        salaryElem.value="";
    });
}