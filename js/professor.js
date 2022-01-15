const tableBodyProfessor = document.getElementById("table-body-professor");

const hiddenPk = document.getElementById("hiddenPk");

const name = document.getElementById("name");
const cpf = document.getElementById("cpf");
const department = document.getElementById("department");

async function searchProfessor() {




    data = [];
    data = await response.json();

    console.log(data);

    setProfessorTableBody(data);

}


async function saveProfessor(event) {
    event.preventDefault();

    const professorModal = document.getElementById("modalProfessor");
    const modal = bootstrap.Modal.getInstance(professorModal);

    const professor = {
        name: name.value,
        cpf: cpf.value,
        departmentId: department.value,
    };


    let response;

    const options = {
        body: JSON.stringify(professor),
        headers: { "Content-Type": "application/json", },
        method: "POST",
    };


    if (hiddenPk.value) {
        response = await fetch(
            `${URLbase}/professors/${hiddenPk.value}`, {
                ...options,
                method: "PUT",
            }
        );
    } else {
        response = await fetch(
            `${URLbase}/professors`,
            options,

        );
    }

    if (response.ok) {
        await getProfessors();

        modal.hide();
    } else {
        const modalAlert = document.getElementById("modal-alert");

        modalAlert.classList.remove("d-none");
        modalAlert.innerText = `CPF already exists.`
    }


}

async function removeProfessor(professorId) {

    const professorDelModal = document.getElementById("modalDeleteProfessor");
    const modalDelete = bootstrap.Modal.getInstance(professorDelModal);

    const response = await fetch(
        `${URLbase}/professors/${professorId}`, {
            method: "DELETE",
        }
    );

    if (response.ok) {
        await getProfessors();

        modalDelete.hide();
    } else {
        alert("Oops... Error to delete professor.")
    }


}

function openModalProfessor(title, button) {
    const modal = new bootstrap.Modal(document.getElementById('modalProfessor'), {})

    const modalAlert = document.getElementById("modal-alert");
    modalAlert.classList.add("d-none");

    document.querySelector("h5.modal-title").innerHTML = title;
    // ainda utilizando o querySelector poderia ser document.querySelector("h5#modalProfessorLabel") (# para id) (. para class)
    document.getElementById("buttonSave").innerHTML = button;

    hiddenPk.value = "";

    modal.show();
}

async function modalEditProfessor(professorId) {
    openModalProfessor("Update Professor", "Save Changes")

    hiddenPk.value = professorId;

    const response = await fetch(
        `${URLbase}/professors/${professorId}`
    );

    const data = await response.json();

    name.value = data.name;
    cpf.value = data.cpf;
    department.value = data.department.id;

}

async function modalDeleteProfessor(professorId, professorName) {

    const modalDelete = new bootstrap.Modal(document.getElementById('modalDeleteProfessor'), {})

    document.getElementById("NameProfessorLabel").innerHTML = `Are you sure you want to delete the professor <b> ` + professorName + `</b>`;


    hiddenPkDelete.value = professorId;


    modalDelete.show();

}


function formatCpf(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function setProfessorTableBody(professors = []) {
    let body = "";

    data.forEach(function(professor) {
        body += `
            <tr>
                <td style="width:7%;">${professor.id}</td>
                <td style="width:20%;">${formatCpf(professor.cpf)}</td>
                <td style="width:32%;">${professor.name}</td>
                <td style="width:32%;">${professor.department.name}</td>
                <td style="width:9%;">
                    <div class="dropdown">
                    <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton-${professor.id}" data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton-${professor.id}">
                        <li onclick="modalEditProfessor(${professor.id})"><a class="dropdown-item text-warning" href="#">Edit</a></li>
                        <li onclick="modalDeleteProfessor('${professor.id}' , '${professor.name}')"><a class="dropdown-item text-danger" href="#">Remove</a></li>
                        </ul>
                    </div>
                </td>
                </tr>
            `;
    });

    tableBodyProfessor.innerHTML = body;
}

function setDepartmentsOptionListProfessor(departments = []) {
    const department = document.getElementById("department");

    let body = "";

    departments.forEach(function(department) {
        body += `<option value="${department.id}">${department.name}</option>`;
    });

    department.innerHTML = body;

}

async function getProfessors(professorSearch) {

    let searchProf = ''

    if (professorSearch != null && professorSearch != undefined)
        searchProf = professorSearch;

    //const response = await fetch(`${URLbase}/professors`);
    const response = await fetch(`${URLbase}/professors?prof=` + searchProf);
    data = [];
    data = await response.json();

    console.log(data);

    setProfessorTableBody(data);
}

async function getDepartmentsProfessor() {
    const response = await fetch(`${URLbase}/departments`);

    const data = await response.json();

    setDepartmentsOptionListProfessor(data);
}


getProfessors();
getDepartmentsProfessor();