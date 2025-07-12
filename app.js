// Load employees from localStorage or fallback to mockEmployees from data.js

if (!localStorage.getItem("employees")) {
  localStorage.setItem("employees", JSON.stringify(mockEmployees));
} else {
  mockEmployees = JSON.parse(localStorage.getItem("employees"));
}

let currentPage = 1;
let itemsPerPage = 5;

const employeeList = document.getElementById("employeeList");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filterName = document.getElementById("filterName");
const filterDept = document.getElementById("filterDept");
const filterRole = document.getElementById("filterRole");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const resetFilterBtn = document.getElementById("resetFilterBtn");

function renderEmployees(data = mockEmployees) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = data.slice(startIndex, endIndex);

  employeeList.innerHTML = "";

  if (paginatedEmployees.length === 0) {
    employeeList.innerHTML = "<p>No employees found.</p>";
    paginationContainer.innerHTML = "";
    return;
  }

  paginatedEmployees.forEach((emp) => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.innerHTML = `
      <h3>${emp.firstName} ${emp.lastName}</h3>
      <p><strong>ID:</strong> ${emp.id}</p>
      <p><strong>Email:</strong> ${emp.email}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Role:</strong> ${emp.role}</p>
      <button class="edit-btn" data-id="${emp.id}">Edit</button>
      <button class="delete-btn" data-id="${emp.id}">Delete</button>
    `;
    employeeList.appendChild(card);
  });

  attachEditDeleteListeners();
  renderPagination(data);
}

function attachEditDeleteListeners() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      window.location.href = `form.html?id=${id}`;
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      mockEmployees = mockEmployees.filter((emp) => emp.id !== id);
      localStorage.setItem("employees", JSON.stringify(mockEmployees));
      currentPage = 1;
      renderEmployees();
      showToast("Employee Deleted Successfully");
    });
  });
}

searchInput?.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = mockEmployees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(value) ||
      emp.lastName.toLowerCase().includes(value) ||
      emp.email.toLowerCase().includes(value)
  );
  currentPage = 1;
  renderEmployees(filtered);
});

function renderPagination(data) {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(data.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "pagination-btn" + (i === currentPage ? " active" : "");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderEmployees(data);
    });
    paginationContainer.appendChild(btn);
  }
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

applyFilterBtn?.addEventListener("click", () => {
  let filtered = [...mockEmployees];

  if (filterName?.value.trim()) {
    filtered = filtered.filter((emp) =>
      emp.firstName.toLowerCase().includes(filterName.value.toLowerCase())
    );
  }
  if (filterDept?.value.trim()) {
    filtered = filtered.filter((emp) =>
      emp.department.toLowerCase().includes(filterDept.value.toLowerCase())
    );
  }
  if (filterRole?.value.trim()) {
    filtered = filtered.filter((emp) =>
      emp.role.toLowerCase().includes(filterRole.value.toLowerCase())
    );
  }

  currentPage = 1;
  renderEmployees(filtered);
});

resetFilterBtn?.addEventListener("click", () => {
  filterName.value = "";
  filterDept.value = "";
  filterRole.value = "";
  renderEmployees();
});

sortSelect?.addEventListener("change", () => {
  const value = sortSelect.value;
  let sorted = [...mockEmployees];

  if (value === "firstName") {
    sorted.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (value === "department") {
    sorted.sort((a, b) => a.department.localeCompare(b.department));
  }

  currentPage = 1;
  renderEmployees(sorted);
});

renderEmployees();
