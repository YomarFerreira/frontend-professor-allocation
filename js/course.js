const tableBodyCourse = document.getElementById("table-body-course");

const name = document.getElementById("name");
const hiddenPk = document.getElementById("hiddenPk");

async function saveCourse(event) {
    event.preventDefault();

    const courseModal = document.getElementById("modalCourse");
    const modal = bootstrap.Modal.getInstance(courseModal);

    const course = {
        name: name.value,
    };

    let response;

    const options = {
        body: JSON.stringify(course),
        headers: { "Content-Type": "application/json", },
        method: "POST",
    };

    if (hiddenPk.value) {
        response = await fetch(
            `${URLbase}/courses/${hiddenPk.value}`, {
                ...options,
                method: "PUT",
            }
        );
    } else {
        response = await fetch(
            `${URLbase}/courses`,
            options,

        );
    }

    if (response.ok) {
        await getCourses();

        modal.hide();
    } else {
        const modalAlert = document.getElementById("modal-alert");

        modalAlert.classList.remove("d-none");
        modalAlert.innerText = `Course already exists.`
    }


}

async function removeCourse(courseId) {

    const courseDelModal = document.getElementById("modalDeleteCourse");
    const modalDelete = bootstrap.Modal.getInstance(courseDelModal);

    const response = await fetch(
        `${URLbase}/courses/${courseId}`, {
            method: "DELETE",
        }
    );

    if (response.ok) {
        await getCourses();

        modalDelete.hide();
    } else {
        alert("Oops... Error to delete course.")
    }


}

function openModalCourse(title, button) {

    const modal = new bootstrap.Modal(document.getElementById('modalCourse'), {})

    const modalAlert = document.getElementById("modal-alert");
    modalAlert.classList.add("d-none");

    document.querySelector("h5.modal-title").innerHTML = title;
    document.getElementById("buttonSave").innerHTML = button;

    hiddenPk.value = "";

    modal.show();
}

async function modalEditCourse(courseId) {

    openModalCourse("Update Course", "Save Changes")

    hiddenPk.value = courseId;

    const response = await fetch(
        `${URLbase}/courses/${courseId}`
    );

    const data = await response.json();

    name.value = data.name;
}


async function modalDeleteCourse(courseId, courseName) {

    const modalDelete = new bootstrap.Modal(document.getElementById('modalDeleteCourse'), {})

    document.getElementById("NameCourseLabel").innerHTML = `Are you sure you want to delete the course <b> ` + courseName + `</b>`;


    hiddenPkDelete.value = courseId;


    modalDelete.show();

}

function setCourseTableBody(course = []) {
    let body = "";

    data.forEach(function(course) {
        body += `
      <tr>
          <td style="width:7%;">${course.id}</td>
          <td style="width:84%;">${course.name}</td>
          <td style="width:9%;">
              <div class="dropdown">
              <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton-${course.id}" data-bs-toggle="dropdown" aria-expanded="false">
                  Actions
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton-${course.id}">
                  <li onclick="modalEditCourse(${course.id})"><a class="dropdown-item text-warning" href="#">Edit</a></li>
                  <li onclick="modalDeleteCourse('${course.id}' , '${course.name}')"><a class="dropdown-item text-danger" href="#">Remove</a></li>
              </ul>
              </div>
          </td>
      </tr>
      `;
    });

    tableBodyCourse.innerHTML = body;
}

async function getCourses(courseSearch) {

    let searchCours = ''

    if (courseSearch != null && courseSearch != undefined)
        searchCours = courseSearch;

    //const response = await fetch(`${URLbase}/courses`);
    const response = await fetch(`${URLbase}/courses?cours=` + searchCours);

    data = [];
    data = await response.json();

    console.log(data);

    setCourseTableBody(data);
}

getCourses();