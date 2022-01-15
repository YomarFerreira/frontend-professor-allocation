const tableBodyAllocation = document.getElementById("table-body-allocation");

const hiddenPk = document.getElementById("hiddenPk");

const dayOfWeek = document.getElementById("dayOfWeek");
const startHour = document.getElementById("startHour");
const endHour = document.getElementById("endHour");
const professor = document.getElementById("professor");
const course = document.getElementById("course");



function formatTime(time) {
    return time.split("+")[0];
}



async function searchAllocation() {

    const response = await fetch(
        `${URLbase}/allocations`, {
            method: "GET",
        }
    );

    if (response.ok) {
        setAllocationTableBody(response);
    } else {
        alert("Oops... Error to search allocations.")
    }

}


async function saveAllocation(event) {
    event.preventDefault();

    const allocationModal = document.getElementById("modalAllocation");
    const modal = bootstrap.Modal.getInstance(allocationModal);

    const allocation = {
        day: dayOfWeek.value,
        startHour: startHour.value + "+0000",
        endHour: endHour.value + "+0000",
        professorId: professor.value,
        courseId: course.value,
    };

    let response;

    const options = {
        body: JSON.stringify(allocation),
        headers: { "Content-Type": "application/json", },
        method: "POST",
    };

    if (hiddenPk.value) {
        response = await fetch(
            `${URLbase}/allocations/${hiddenPk.value}`, {
                ...options,
                method: "PUT",
            }
        );
    } else {
        response = await fetch(
            `${URLbase}/allocations`,
            options,

        );
    }

    if (response.ok) {
        await getAllocations();

        modal.hide();
    } else {
        const modalAlert = document.getElementById("modal-alert");

        modalAlert.classList.remove("d-none");
        modalAlert.innerText = `Time conflict in allocations.`
    }


}

async function removeAllocation(allocationId) {

    const allocationDelModal = document.getElementById("modalDeleteAllocation");
    const modalDelete = bootstrap.Modal.getInstance(allocationDelModal);

    const response = await fetch(
        `${URLbase}/allocations/${allocationId}`, {
            method: "DELETE",
        }
    );

    if (response.ok) {
        await getAllocations();

        modalDelete.hide();
    } else {
        alert("Oops... Error to delete allocation.")
    }


}

function openModalAllocation(title, button) {

    const modal = new bootstrap.Modal(document.getElementById('modalAllocation'), {})

    const modalAlert = document.getElementById("modal-alert");
    modalAlert.classList.add("d-none");

    document.querySelector("h5.modal-title").innerHTML = title;
    document.getElementById("buttonSave").innerHTML = button;

    hiddenPk.value = "";

    modal.show();
}

async function modalEditAllocation(allocationId) {

    openModalAllocation("Update Allocation", "Save Changes")

    hiddenPk.value = allocationId;

    const response = await fetch(
        `${URLbase}/allocations/${allocationId}`
    );

    const data = await response.json();

    dayOfWeek.value = data.day;
    startHour.value = formatTime(data.startHour);
    endHour.value = formatTime(data.endHour);
    professor.value = data.professor.id;
    course.value = data.course.id;
}

async function modalDeleteAllocation(allocationId, day, startHour) {

    const modalDelete = new bootstrap.Modal(document.getElementById('modalDeleteAllocation'), {})

    document.getElementById("NameAllocationLabel").innerHTML = `Are you sure you want to delete the <b> ` + day + `</b> allocation starting at <b> ` + startHour + `</b>`;


    hiddenPkDelete.value = allocationId;


    modalDelete.show();

}


//Show table of allocations
function setAllocationTableBody(rowsAllocation = []) {
    let body = "";

    rowsAllocation.forEach(function(rowAllocation) {
        body += `
  <tr>
      <td style="width:7%;">${rowAllocation.id}</td>
      <td style="width:10%;">${rowAllocation.day}</td>
      <td style="width:9%;">${formatTime(rowAllocation.startHour)}</td>
      <td style="width:8%;">${formatTime(rowAllocation.endHour)}</td>
      <td style="width:13%;">${rowAllocation.professor.name}</td>
      <td style="width:19%;">${rowAllocation.professor.department.name}</td>
      <td style="width:24%;">${rowAllocation.course.name}</td>
      <td style="width:9%;">
          <div class="dropdown">
          <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton-${rowAllocation.id}" data-bs-toggle="dropdown" aria-expanded="false">
              Actions
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton-${rowAllocation.id}">
              <li onclick="modalEditAllocation(${rowAllocation.id})"><a class="dropdown-item text-warning" href="#">Edit</a></li>
              <li onclick="modalDeleteAllocation('${rowAllocation.id}' , '${rowAllocation.day}' , '${formatTime(rowAllocation.startHour)}')"><a class="dropdown-item text-danger" href="#">Remove</a></li>
              </ul>
          </div>
      </td>
  </tr>
  `;
    });

    tableBodyAllocation.innerHTML = body;
}


function setOptionListAllocation(rows = [], elementId) {
    const element = document.getElementById(elementId);

    let body = "";

    rows.forEach(function(row) {
        body += `<option value="${row.id}">${row.name}</option>`;
    });

    element.innerHTML = body;

}

async function doFetch(...params) {

    const response = await fetch(...params);
    const data = response.json();
    return data;

}

async function getAllocations() {
    const response = await doFetch(`${URLbase}/allocations`);

    setAllocationTableBody(response);
}

async function getProfessorsAllocation() {
    const response = await doFetch(`${URLbase}/professors`);

    setOptionListAllocation(response, "professor");
}

async function getCoursesAllocation() {
    const response = await doFetch(`${URLbase}/courses`);

    setOptionListAllocation(response, "course");
}

async function getInitialData() {

    await Promise.all(
        [
            getAllocations(),
            getProfessorsAllocation(),
            getCoursesAllocation(),
        ]
    )

}


getInitialData();