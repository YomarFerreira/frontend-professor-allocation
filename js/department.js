const tableBodyDepartment = document.getElementById("table-body-department");

const name = document.getElementById("name");
const hiddenPk = document.getElementById("hiddenPk");

async function saveDepartment(event) {
    event.preventDefault();

    const departmentModal = document.getElementById("modalDepartment");
    const modal = bootstrap.Modal.getInstance(departmentModal);

    const department = {
        name: name.value,
    };

    let response;

    const options = {
        body: JSON.stringify(department),
        headers: { "Content-Type": "application/json", },
        method: "POST",
    };

    if (hiddenPk.value) {
        response = await fetch(
            `${URLbase}/departments/${hiddenPk.value}`, {
                ...options,
                method: "PUT",
            }
        );
    } else {
        response = await fetch(
            `${URLbase}/departments`,
            options,

        );
    }

    if (response.ok) {
        await getDepartments();

        modal.hide();
    } else {
        const modalAlert = document.getElementById("modal-alert");

        modalAlert.classList.remove("d-none");
        modalAlert.innerText = `Departament already exists.`
    }
}

async function removeDepartment(departmentId) {

    const departmentDelModal = document.getElementById("modalDeleteDepartment");
    const modalDelete = bootstrap.Modal.getInstance(departmentDelModal);

    const response = await fetch(
        `${URLbase}/departments/${departmentId}`, {
            method: "DELETE",
        }
    );

    if (response.ok) {
        await getDepartments();

        modalDelete.hide();
    } else {
        alert("Oops... Error to delete department.")
    }


}

function openModalDepartment(title, button) {

    const modal = new bootstrap.Modal(document.getElementById('modalDepartment'), {})

    const modalAlert = document.getElementById("modal-alert");
    modalAlert.classList.add("d-none");

    document.querySelector("h5.modal-title").innerHTML = title;
    document.getElementById("buttonSave").innerHTML = button;

    hiddenPk.value = "";

    modal.show();
}

async function modalEditDepartment(departmentId) {

    openModalDepartment("Update Department", "Save Changes")

    hiddenPk.value = departmentId;

    const response = await fetch(
        `${URLbase}/departments/${departmentId}`
    );

    const data = await response.json();

    name.value = data.name;
}


async function modalDeleteDepartment(departmentId, departmentName) {

    const modalDelete = new bootstrap.Modal(document.getElementById('modalDeleteDepartment'), {})

    document.getElementById("NameDepartmentLabel").innerHTML = `Are you sure you want to delete the department <b> ` + departmentName + `</b>`;


    hiddenPkDelete.value = departmentId;


    modalDelete.show();

}


function setDepartmentTableBody(department = []) {
    let body = "";

    data.forEach(function(department) {
        body += `
      <tr>
          <td style="width:7%;">${department.id}</td>
          <td style="width:84%;">${department.name}</td>
          <td style="width:9%;">
              <div class="dropdown">
              <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton-${department.id}" data-bs-toggle="dropdown" aria-expanded="false">
                  Actions
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton-${department.id}">
                  <li onclick="modalEditDepartment(${department.id})"><a class="dropdown-item text-warning" href="#">Edit</a></li>
                  <li onclick="modalDeleteDepartment('${department.id}' , '${department.name}')"><a class="dropdown-item text-danger" href="#">Remove</a></li>
              </ul>
              </div>
          </td>
      </tr>
      `;
    });

    tableBodyDepartment.innerHTML = body;
}

async function getDepartments(departmentSearch) {

    let searchDepart = ''

    if (departmentSearch != null && departmentSearch != undefined)
        searchDepart = departmentSearch;

    //const response = await fetch(`${URLbase}/departments`);
    const response = await fetch(`${URLbase}/departments?depto=` + searchDepart);

    data = [];
    data = await response.json();

    console.log(data);

    setDepartmentTableBody(data);
}

getDepartments();