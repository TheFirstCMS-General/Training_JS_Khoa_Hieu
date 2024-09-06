// import student from './data.json' with {type: 'json'};
// import detail_money from './detail_money.json' with {type: 'json'}

var student = [];
await fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        const arrayData = data.map(item => item);
        student.push(...arrayData);
    })
    .catch(error => console.error('Error:', error));

var detail_money = [];
await fetch('./detail_money.json')
    .then(response => response.json())
    .then(data => {
        const arrayData = data.map(item => item);
        detail_money.push(...arrayData);
    })
    .catch(error => console.error('Error:', error));

//Render Data Table
student.forEach(obj => {
    let money = 0;
    let DetailMoney = detail_money.find(item => item.Number == obj.Number).DetailMoney;
    DetailMoney.forEach(item => {
        money += item.Money;
    })
    obj.Money = money;
    AddElementToTable(obj)
});

function initEvent(tr) {
    let deleteButton = tr.querySelectorAll('.delete');
    let saveButton = tr.querySelectorAll('.save');
    let detailMoneyButton = tr.querySelectorAll('.detail_money');

    deleteButton.forEach(item => {
        item.addEventListener('click', function (event) {
            const clickedElement = event.target;
            const parentElement = clickedElement.parentElement.parentElement.parentElement;
            let id = parentElement.querySelector('.identify').value;
            student = student.filter(item => item.Number != id);
            removeParentElement(parentElement);
        });
    })
    saveButton.forEach(item => {
        item.addEventListener('click', function (event) {
            const clickedElement = event.target;
            const parentElement = clickedElement.parentElement.parentElement.parentElement;
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
    detailMoneyButton.forEach(item => {
        item.addEventListener('click', function (event) {
            const clickedElement = event.target;
            const parentElement = clickedElement.parentElement.parentElement;
            let id = parentElement.querySelector('.identify').value;
            
            let obj = detail_money.find(item => item.Number == id);
            console.log(obj);
            if(obj == undefined) {
                alert("Chua dong tien");
                return;
            }
            let DetailMoney = obj.DetailMoney;
            console.log(DetailMoney);
            let message = "";
            DetailMoney.forEach(item => {
                message += item.Phase + ": " + item.Money + ": " + item.Date + "\n";
            })
            alert(message)
        });
    })
}

function AddElementToTable(obj) {
    const tr = document.createElement('tr');
    tr.className = `tr${obj.Number}`;
    tr.innerHTML = `
            <th scope="row">
                <input class = "identify content_row number${obj.Number}" value=${obj.Number} readonly = "true">
            </th>
            <td >
                <input class = "content_row name" value=${obj.Name}>
            </td>
            <td>
                <input class = "content_row gender" value=${obj.Gender}>
            </td>
            <td>
                <input class = "content_row money money${obj.Number}" value=${obj.Money}>
                <button class = "detail_money">Detail</button>
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
                    <button class = "delete button_command">Delete</button>
                    <button class = "save button_command" >Save</button>
                </div>
            </td>
    `;
    document.getElementById('body_table').appendChild(tr);
    initEvent(tr);
}


const exportExcelButton = document.getElementById('exportExcelButton');
exportExcelButton.addEventListener('click', ExportExcel);

const addButton = document.getElementById('add');
addButton.addEventListener('click', AddStudent);

let payButton = document.getElementById('pay');
payButton.addEventListener('click', PayMonney);

//Add Button
function AddStudent() {
    let name = prompt("Enter your name:");
    let gender = prompt("Enter your gender:");
    let money = 0;
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
    console.log(detail_money);
}

function removeParentElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

function PayMonney() {
    let id = GetNumberInput(3, "Please enter your id student:");

    let obj = student.find(item => item.Number == id);
    if(obj == undefined) {
        alert("Can't find student with id: "+ id);
        return;
    }

    let money = GetNumberInput(3, "Please enter your money:");

    console.log(id);
    console.log(detail_money);
    let a = detail_money.find(item => item.Number = id);
    console.log(a);
    // if(!a) {
    //     let newDetailMoney = new Object();
    //     newDetailMoney.Number = id;
    //     let DetailMoney = [];
    //     DetailMoney.push({"Phase" : 1, "Money" : money, "Date": (new Date()).toDateString});
    //     newDetailMoney.DetailMoney = DetailMoney;
    //     console.log(newDetailMoney);
    //     detail_money.push(newDetailMoney);
    // }


    let tr = document.querySelector(`.money${id}`);
    tr.value = money;

    
}

async function saveDataToJsonFile(data) {
    const jsonData = JSON.stringify(data);
    console.log(data);
    const input = createReadStream('./data.json');
    input.pipe(output);

    input.on('data', (chunk) => {
        console.log('Data chunk received:', chunk.toString());
    });
    input.on('end', () => input.destroy());
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

function GetNumberInput(count, message) {
    let obj;
    while (true) {
        if (count == 0) {
            break;
        }
        obj = prompt(message);
        if (obj !== null && !isNaN(obj)) {
            break;
        }
        count--;
    }
    return obj;
}