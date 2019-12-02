class Company {
  constructor() {
    this.departments = [];
  }

  addEmployee(username, salary, position, department) {
    if (
      [username, salary, position, department].some(
        x => x === undefined || x === null || x === ""
      ) ||
      salary < 0
    ) {
      throw new Error("Invalid input!");
    }

    if (!this.departments.some(x => x.department === department)) {
      this.departments.push({
        department,
        employees: [],
        getAverageSalary: function() {
          let totalSalary = this.employees.reduce((a, b) => a + b.salary, 0);
          let employeesCount = this.employees.length;
          return totalSalary / employeesCount;
        }
      });
    }

    this.departments
      .find(x => x.department === department)
      .employees.push({ username, salary, position });

    return `New employee is hired. Name: ${username}. Position: ${position}`;
  }

  bestDepartment() {
    let [bestDepartment] = Array.from(this.departments).sort(
      (a, b) => b.getAverageSalary() - a.getAverageSalary()
    );
    return (
      `Best Department is: ${
        bestDepartment.department
      }\nAverage salary: ${bestDepartment.getAverageSalary().toFixed(2)}\n` +
      bestDepartment.employees
        .sort(
          (a, b) => b.salary - a.salary || a.username.localeCompare(b.username)
        )
        .map(x => `${x.username} ${x.salary} ${x.position}`)
        .join("\n")
    );
  }
}

let c = new Company();
c.addEmployee("Stanimir", 2000, "engineer", "Construction");
c.addEmployee("Pesho", 1500, "electrical engineer", "Construction");
c.addEmployee("Slavi", 500, "dyer", "Construction");
c.addEmployee("Stan", 2000, "architect", "Construction");
c.addEmployee("Stanimir", 1200, "digital marketing manager", "Marketing");
c.addEmployee("Pesho", 1000, "graphical designer", "Marketing");
c.addEmployee("Gosho", 1350, "HR", "Human resources");
console.log(c.bestDepartment());
