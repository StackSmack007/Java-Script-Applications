import { fd_get, fd_post,} from "./fetcher.js";
import { createElementWithContent, } from "./domFunc.js";
const fds_get = fd_get.bind(undefined, undefined, undefined);
const fds_post = fd_post.bind(undefined, undefined, undefined);

const elements = {
  $tableBody: () => document.querySelector("#results > tbody"),
  $createBtn: () => document.getElementById("createBtn"),
  $createInputs: {
    firstName: () => document.getElementById("firstName"),
    lastName: () => document.getElementById("lastName"),
    facultyNumber: () => document.getElementById("facultyNumber"),
    grades: () => document.getElementById("grades")
  }
};

function makeStudentRow(student, index) {
  return createElementWithContent("tr", [
    createElementWithContent("td", index + 1),
    createElementWithContent("td", student.firstName),
    createElementWithContent("td", student.lastName),
    createElementWithContent("td", student.facultyNumber),
    createElementWithContent(
      "td",
      student.grades.reduce((a, b) => a + b, 0) / student.grades.length
    )
  ]);
}
function listAll() {
  fds_get("/students")
    .then(students => {
      const records = students.map((student, index) =>
        makeStudentRow(student, index)
      );
      elements.$tableBody().innerHTML = "";
      elements.$tableBody().append(...records);
    })
    .catch(e => console.log);
}

async function addRecord(evnt) {
  evnt.preventDefault();
  const inputs = elements.$createInputs;
  try {
      const newRecord = {
      firstName: inputs.firstName().value,
      lastName: inputs.lastName().value,
      facultyNumber: inputs.facultyNumber().value,
      grades: inputs
        .grades()
        .value.split(",")
        .map(Number)
    };
    if (Object.values(newRecord).some(x => x === null || x === "")) {
      throw new Error("Invalid Data Passed");
    }
    [...Object.values(inputs)].forEach(x => {
      x().value = "";
    });
    await fds_post("students", newRecord);
    await listAll();
  } catch (e) {
    console.log(e);
  }
}
(function() {
  elements.$createBtn().addEventListener("click", addRecord);
})();

listAll();
