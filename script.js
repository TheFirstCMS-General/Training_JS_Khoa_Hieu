//Get data form json
var student = [];
var data = await fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        const arrayData = data.map(item => item);
        student.push(...arrayData);
    })
    .catch(error => console.error('Error:', error));

const exportExcelButton = document.getElementById('exportExcelButton');
exportExcelButton.addEventListener('click', ExportExcel);

const addButton = document.getElementById('Add');
addButton.addEventListener('click', AddStudent);

student.forEach(obj => AddElementToTable(obj));

function AddElementToTable(obj) {
    const tr = document.createElement('tr');
    tr.className = `tr${obj.Number}`;
    tr.innerHTML = `
            <th scope="row">
                <input class = "content_row number${obj.Number} identify" value=${obj.Number} readonly = "true">
            </th>
            <td>
                <input class = "content_row name" value=${obj.Name}>
            </td>
            <td>
                <input class = "content_row gender" value=${obj.Gender}>
            </td>
            <td>
                <input class = "content_row money" value=${obj.Money}>
            </td>
            <td>
                <input class = "content_row status" value=${obj.Status}>
            </td>
            <td>
                <input class = "content_row dateofbirth" value=${obj.DateOfBirth}>
            </td>
            <td>
                <input class = "content_row address" value=${obj.Address}>
            </td>
            <td>
                <div class = "button_commands">
                    <button class = "delete button_command" >Delete</button>
                    <button class = "save button_command" >Save</button>
                </div>
            </td>
    `;
    document.getElementById('body_table').appendChild(tr);
}

let deleteButton = document.querySelectorAll('.delete');
deleteButton.forEach(item => {
    item.addEventListener('click', function (event) {
        const clickedElement = event.target;
        const parentElement = clickedElement.parentElement.parentElement;
        let id = parentElement.querySelector('.identify').value;
        student.remove(item => item.Number = id);
        removeParentElement(parentElement);
    });
})
function removeParentElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

let payButton = document.getElementById('pay');

payButton.addEventListener('click', function (event) {
    let id;
    while (true) {
        id = prompt("Please enter your id student:");
        if (id !== null && !isNaN(id)) {
            break;
        }
    }
    let money;
    while (true) {
        money = prompt("Please enter your id student:");
        if (money !== null && !isNaN(money)) {
            break;
        }
    }
    let idTr = document.querySelectorAll(`tr${id}`);
});

function removeParentElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

let saveButton = document.querySelectorAll('.save');
saveButton.forEach(item => {
    item.addEventListener('click', function (event) {
        const clickedElement = event.target;
        const parentElement = clickedElement.parentElement.parentElement;
        let id = parentElement.querySelector('.identify').value;
        let name = parentElement.querySelector('.name').value;
        let gender = parentElement.querySelector('.gender').value;
        let money = parentElement.querySelector('.money').value;
        let status = parentElement.querySelector('.status').value;
        let dateofbirth = parentElement.querySelector('.dateofbirth').value;
        let address = parentElement.querySelector('.address').value;

        student.forEach(item => {
            if (item.Number == id) {
                item.Name = name;
                item.Gender = gender;
                item.Money = money;
                item.Status = status;
                item.DateOfBirth = dateofbirth;
                item.Address = address;
            }
        })
        saveDataToJsonFile(student);
    });
})






async function saveDataToJsonFile(data) {
    const jsonData = JSON.stringify(data);

    try {
        fs.writeFile('./data.json', jsonData);
        console.log('Dữ liệu đã được ghi vào file data.json');
    } catch (err) {
        console.error(err);
    }
}

function AddStudent() {
    let name = prompt("Enter your name:");
    let gender = prompt("Enter your gender:");
    let money;
    while (true) {
        money = prompt("Please enter your money:");
        if (money !== null && !isNaN(money)) {
            break;
        }
    }
    let status = prompt("Enter your status:");
    let dateofbirth = prompt("Enter your date:");
    let address = prompt("Enter your address:");

    let obj = new Object();
    obj.Number = student.length + 1;
    obj.Name = name;
    obj.Gender = gender;
    obj.Money = money;
    obj.Status = status;
    obj.DateOfBirth = dateofbirth;
    obj.Address = address;

    AddElementToTable(obj);
    student.push(obj);
}

async function ExportExcel() {
    console.log("Start Export Excel");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Age', key: 'age', width: 10 }
    ];

    worksheet.addRow({ name: 'John Doe', email: '[john@example.com]', age: 30 });
    worksheet.addRow({ name: 'Jane Smith', email: '[jane@example.com]', age: 25 });

    await workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'example.xlsx';
        link.click();

        URL.revokeObjectURL(link.href);
        link.remove();
    });
}