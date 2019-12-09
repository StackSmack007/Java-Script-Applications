function solve() {
  let contentDiv;
  let currentId = 0;
  let reports = [];

  function generateElement(id, author, description, severity, status = "open") {
    let wraperDiv = document.createElement("div");
    wraperDiv.classList.add("report");
    wraperDiv.id = "report_" + id;
    let div1 = document.createElement("div");
    div1.classList.add("body");
    let p1 = document.createElement("p");
    p1.innerText = description;

    let div2 = document.createElement("div");
    div2.classList.add("title");
    let span1 = document.createElement("span");
    span1.classList.add("author");
    span1.innerHTML = `Submitted by: ${author}`;
    let span2 = document.createElement("span");
    span2.classList.add(`status`);
    span2.innerHTML = `Open | ${severity}`;
    p1.innerText = description;
    div1.appendChild(p1);
    div2.appendChild(span1);
    div2.appendChild(span2);
    wraperDiv.appendChild(div1);
    wraperDiv.appendChild(div2);
    return wraperDiv;
  }

  function report(author, description, reproducible, severity) {
    let ID = currentId++;
    let element = generateElement(ID, author, description, severity);
    contentDiv.appendChild(element);

    reports.push({
      ID,
      author,
      description,
      reproducible,
      severity,
      status,
      element
    });
  }

  function setStatus(id, newStatus) {
    let obj = reports.find(x => x.ID === id);
    if (typeof obj === "undefined" || newStatus === "") {
      return;
    }
    let element = obj.element.querySelector("span.status");
    element.innerHTML = element.innerHTML.replace(obj.status, newStatus);
    obj.status = newStatus;
  }

  function remove(id) {
    let index = reports.findIndex(x => x.ID === id);
    if (index === -1) {
      return;
    }
    contentDiv.removeChild(reports[index].element);
    reports.splice(index, 1);
  }

  function sort(method) {
    if (method === "author") {
      reports = reports.sort((a, b) => a.author.localeCompare(b.author));
    } else {
      reports = reports.sort((a, b) => a[method] - b[method]);
    }
    contentDiv.innerHTML = "";
    reports.forEach(({ element }) => {
      contentDiv.appendChild(element);
    });
  }
  function output(selector) {
    contentDiv = document.querySelector(selector);
  }

  return { report, setStatus, remove, sort, output };
}

//Judge tests:
// tracker.output('#content');
// tracker.report('guy', 'report content', true, 5);
// tracker.report('second guy', 'report content 2', true, 3);
// tracker.report('abv', 'report content three', true, 4);
// let report = $('#report_0');

// console.log(report.find('.body p').text().includes('report content'));
// console.log(report.find('.title .author').text().includes('guy'));
// console.log(report.find('.title .status').text().includes('Open | 5'));

// report = $('#report_1');
// console.log(report.find('.body p').text().includes('report content 2'));
// console.log(report.find('.title .author').text().includes('second guy'));
// console.log(report.find('.title .status').text().includes('Open | 3'));

// report = $('#report_2');
// console.log(report.find('.body p').text().includes('report content three'));
// console.log(report.find('.title .author').text().includes('abv'));
// console.log(report.find('.title .status').text().includes('Open | 4'));

// //Test 4:
// let tracker = solve();

// tracker.output('#content');
// tracker.report('guy', 'report content', true, 5);
// tracker.report('second guy', 'report content 2', true, 3);
// tracker.report('abv', 'report content three', true, 4);

// tracker.sort('author');

// let reports = $('.report');

// console.log(reports.eq(0).attr('id')==='report_2');
// console.log(reports.eq(1).attr('id')==='report_0');
// console.log(reports.eq(2).attr('id')==='report_1');

// tracker.sort('severity');

// reports = $('.report');

// console.log(reports.eq(0).attr('id')==='report_1');
// console.log(reports.eq(1).attr('id')==='report_2');
// console.log(reports.eq(2).attr('id')==='report_0');

// tracker.sort('ID');

// reports = $('.report');

// console.log(reports.eq(0).attr('id')==='report_0');
// console.log(reports.eq(1).attr('id')==='report_1');
// console.log(reports.eq(2).attr('id')==='report_2');

// //Test 5:
// let tracker = solve();
// tracker.output('#content');
// tracker.report('guy', 'report content', true, 5);
// tracker.report('second guy', 'report content 2', true, 3);
// tracker.report('abv', 'report content three', true, 4);

// tracker.remove(1);

// let reports = $('.report');

// console.log(reports.eq(0).attr('id')==='report_0');
// console.log(reports.eq(1).attr('id')==='report_2');

// //Test 6:
// let tracker = solve();

// tracker.output('#content');
// tracker.report('guy', 'report content', true, 5);
// tracker.setStatus(0, 'Closed');

// let report = $('#report_0');
// console.log(report.find('.title .status').text().includes('Closed'));