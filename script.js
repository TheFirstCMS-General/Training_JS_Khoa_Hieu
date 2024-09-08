import studentDB from "./data/student.json" with { type: 'json' };
import paymentDB from "./data/payment.json" with { type: 'json'};
// import config from "./data/config.json" with { type: 'json'};
import { GetNumberInput } from "./helper.js";

//Init Data
var students = [...studentDB];
var payments = [...paymentDB];
var configs = [];
const tablePayment = document.querySelector(".tablePayment");
const tableStudent = document.querySelector('.tableStudent');
const modalbody = document.querySelector('.modal-body');
const exportExcelButton = document.getElementById('exportExcel');
const importExcelButton = document.getElementById('importExcel')
const addButton = document.getElementById('add');
const payButton = document.getElementById('pay');
const dropdownMenu = document.querySelector('.dropdown-menu');
var isConfig = false;
var numberOfPhase = 0;

//Init Event
exportExcelButton.addEventListener('click', ExportExcel);
importExcelButton.addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
});
addButton.addEventListener('click', AddStudent);
payButton.addEventListener('click', PayMonney);

//Init UI
initDataTable();

function initDataTable() {
    console.log(students);
    students.forEach(student => {
        let money = 0;
        let moneyArray = payments.filter(item => item.StudentID == student.ID)
            .map(item => item.Money)
        if (moneyArray.length != 0) {
            money = moneyArray.reduce((accumulator, currentValue) => accumulator + currentValue);
        }
        student.TotalMoney = money;
        AddRowToStudentTable(student)
    });
    // tablePayment.hidden = "true";
}

function AddRowToStudentTable(student) {
    const studentRow = document.createElement('tr');
    studentRow.className = `student${student.ID}`;
    studentRow.innerHTML = `
            <th scope="row">
                <input class = "content_row identify" value=${student.ID} readonly = "true">
            </th>
            <td >
                <input class = "content_row name" value=${student.Name}>
            </td>
            <td>
                <input class = "content_row gender" value=${student.Gender}>
            </td>
            <td>
                <input class = "content_row dateofbirth" value=${student.DateOfBirth}>
            </td>
            <td>
                <input class = "content_row address" value=${student.Address}>
            </td>
            <td>
                <input class = "content_row totalmoney " value=${student.TotalMoney}>
            </td>
            <td>
                <input class = "content_row status" value=${student.Status}>
            </td>
            <td>
                <div class = "functions" style = "display: flex">
                    <button class = "delete btn btn-primary">Delete</button>
                    <button class = "save btn btn-primary">Save</button>
                    <button class = "detail btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Detail</button>
                </div>
            </td>
    `;
    document.getElementById('body_table').appendChild(studentRow);
    initEvent(studentRow);
}

function initEvent(studentRow) {
    let deleteButton = studentRow.querySelectorAll('.delete');
    let saveButton = studentRow.querySelectorAll('.save');
    let detailButton = studentRow.querySelectorAll('.detail');

    deleteButton.forEach(item => {
        item.addEventListener('click', function (event) {
            const clickedElement = event.target;
            const parentElement = clickedElement.parentElement.parentElement.parentElement;
            let id = parentElement.querySelector('.identify').value;
            students = students.filter(item => item.ID != id);
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
            let dateofbirth = parentElement.querySelector('.dateofbirth').value;
            let address = parentElement.querySelector('.address').value;
            let totalmoney = parentElement.querySelector('.totalmoney').value;
            let status = parentElement.querySelector('.status').value;

            students.forEach(item => {
                if (item.ID == +id) {
                    item.Name = name;
                    item.Gender = gender;
                    item.DateOfBirth = dateofbirth;
                    item.Address = address;
                    item.TotalMoney = +totalmoney;
                    item.Status = status;
                }
            })
        });
    })
    detailButton.forEach(item => {
        item.addEventListener('click', function (event) {
            const clickedElement = event.target;
            const parentElement = clickedElement.parentElement.parentElement.parentElement;
            let id = parentElement.querySelector('.identify').value;

            let paymentStudent = payments.filter(item => item.StudentID == id);
            if (paymentStudent.length == 0) {
                modalbody.innerHTML = "Dong tien lol dau ma doi xem";
                return;
            }
            let message = "";
            paymentStudent.forEach(item => {
                message += "<div>" + item.Date + ", đóng tiền đợt " + item.Phase + " : " + item.Money + "</div>";
            })
            modalbody.innerHTML = message;
        });
    })
}

function removeParentElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}



// // THINKING ABOUT AWAIT
// async function saveDataToJsonFile(data) {
//     const jsonData = JSON.stringify(data);

//     try {
//         fs.writeFile('./data.json', jsonData);
//         console.log('Dữ liệu đã được ghi vào file data.json');
//     } catch (err) {
//         console.error(err);
//     }
// }

function AddStudent() {
    let id = GetNumberInput(3, "Enter your id");
    for (let i = 0; i < students.length; i++) {
        if (students[i].ID == id) {
            alert("Trùng ID với học sinh khác");
            return;
        }
    }
    let name = prompt("Enter your name:");
    let gender = prompt("Enter your gender:");
    let dateofbirth = prompt("Enter your dateofbirth:");
    let address = prompt("Enter your address:");
    let status = prompt("Enter your status:");

    let student = new Object();
    student.ID = +id;
    student.Name = name;
    student.Gender = gender;
    student.DateOfBirth = dateofbirth;
    student.Address = address;
    student.TotalMoney = 0;
    student.Status = status;

    AddRowToStudentTable(student);
    students.push(student);
}

function PayMonney() {
    if (!isConfig) {
        numberOfPhase = GetNumberInput(3, "Enter your total phase");
        if (numberOfPhase == undefined || numberOfPhase <= 0) {
            alert("Khong hop le");
            return;
        }
        let count = 1;
        while (count <= numberOfPhase) {
            let minimumMoney = GetNumberInput(3, `Enter your minimum money phase ${count}: `);
            if (minimumMoney == undefined) {
                configs = [];
                isConfig = false;
                return;
            }
            let deadline = prompt(`Enter your deadline phase ${count} (YYYY/MM/DD):`);

            let config = new Object();
            config.Phase = count;
            config.MinimumMoney = minimumMoney;
            config.Deadline = deadline;
            configs.push(config);
            count++;
        };
        isConfig = true;
        let count2 = 1;
        while (count2 <= numberOfPhase) {

            const phaseLI = document.createElement('li');
            phaseLI.className = `phase${count2}`;
            phaseLI.innerHTML = `<button class="dropdown-item">${count2}</button>`;
            dropdownMenu.appendChild(phaseLI);

            initEventPhaseElement(phaseLI);
            count2++;
        }
    }

    let id = +GetNumberInput(3, "Please enter your id student:");

    let student = students.find(item => item.ID == id);
    if (student == undefined) {
        alert("Can't find student with id: " + id);
        return;
    }

    let phase = +GetNumberInput(3, "Enter your phase");
    if (numberOfPhase == undefined || phase <= 0 || phase > numberOfPhase) {
        alert("Phase Khong hop le");
        return;
    }
    let money = +GetNumberInput(3, "Please enter your money:");
    if (money == undefined || money <= 0) {
        alert("Money Khong hop le");
        return;
    }
    let date = prompt(`Enter your date (YYYY/MM/DD):`);

    let paymentObj = payments.find(item => item.StudentID == id && item.Phase == phase);
    if (paymentObj == undefined) {
        let payment = new Object();
        payment.StudentID = +id;
        payment.Phase = +phase;
        payment.Money = +money;
        payment.Date = date;
        payments.push(payment);
    } else {
        payments.forEach(item => {
            if (item.StudentID == id && item.Phase == phase) {
                item.Money = +money;
                item.Date = date;
            }
        })
    }

    console.log(tableStudent);
    tableStudent.querySelector('.bodyoftable').innerHTML = "";
    initDataTable();
}

function initEventPhaseElement(phaseLI) {
    let dropdownItem = phaseLI.querySelector(".dropdown-item");
    dropdownItem.addEventListener("click", function (event) {
        // tableStudent.hidden = "true";
        // tablePayment.hidden = "false";

        let phase = +(dropdownItem.textContent);
        console.log(phase);
        let phaseConfig = configs.find(item => item.Phase == phase);
        console.log(phaseConfig);

        let paymentStudents = payments.filter(item => item.Phase == phase)
            .sort((item1, item2) => item1.Money < item2.Money);

        paymentStudents.forEach(paymentStudent => {
            const paymentRow = document.createElement('tr');
            paymentRow.className = `payment${paymentStudent.StudentID}`;
            paymentRow.innerHTML = `
                <th scope="row">
                    <input class = "content_row identify" value=${paymentStudent.StudentID} readonly = "true">
                </th>
                <td >
                    <input class = "content_row phase" value=${paymentStudent.Phase}>
                </td>
                <td>
                    <input class = "content_row money" value=${paymentStudent.Money}>
                </td>
                <td>
                    <input class = "content_row minimumMoney" value=${phaseConfig.MinimumMoney}>
                </td>
                <td>
                    <input class = "content_row date" value=${paymentStudent.Date}>
                </td>
                <td>
                    <input class = "content_row deadLine " value=${phaseConfig.Deadline}>
                </td>
        `;
            tablePayment.querySelector('.bodyoftable').appendChild(paymentRow);
        })
    })
}



fileInput.addEventListener('change', async (event) => {
    const studentBuffer = [...students];
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        try {
            students.clear();

            const workbook = new ExcelJS.Workbook();
            const arrayBuffer = await file.arrayBuffer();
            await workbook.xlsx.load(arrayBuffer);

            let worksheet;
            if (workbook.worksheets.length > 0) {
                worksheet = workbook.worksheets[0];
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber != 0) {
                        let obj = new Object();
                        obj.ID = row[1];
                        obj.Name = row[2];
                        obj.Gender = row[3];
                        obj.DateOfBirth = row[4];
                        obj.Address = row[5];
                        obj.TotalMoney = row[6];
                        obj.Status = row[7];
                        students.push(obj);
                    }
                });
            } else {
                console.log('Không có sheet nào trong workbook');
            }

        } catch (error) {
            students = [...studentBuffer];
            console.error('Lỗi khi đọc file:', error);
        }
    } else {
        console.error('Vui lòng chọn một file Excel (.xlsx)');
    }
});

async function ExportExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 25 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Gender', key: 'gender', width: 25 },
        { header: 'DateOfBirth', key: 'dateOfBirth', width: 25 },
        { header: 'Address', key: 'address', width: 25 },
        { header: 'TotalMoney', key: 'totalMoney', width: 25 },
        { header: 'Status', key: 'status', width: 25 }
    ];

    students.forEach(item => {
        worksheet.addRow({ id: item.ID, name: item.Name, gender: item.Gender, dateOfBirth: item.DateOfBirth, address: item.Address, totalMoney: item.TotalMoney, status: item.Status })
    })

    await workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Student.xlsx';
        link.click();

        URL.revokeObjectURL(link.href);
        link.remove();
    });
}


