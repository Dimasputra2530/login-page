document.addEventListener("DOMContentLoaded", function () {
  // Mendapatkan referensi elemen-elemen HTML
  const loginForm = document.getElementById("login-form");
  const supplierForm = document.getElementById("supplier-form");
  const itemForm = document.getElementById("item-form");
  const transactionForm = document.getElementById("transaction-form");
  const loginSection = document.getElementById("login-section");
  const adminMenuSection = document.getElementById("admin-menu-section");
  const managerMenuSection = document.getElementById("manager-menu-section");
  const supplierSection = document.getElementById("supplier-section");
  const viewSupplierSection = document.getElementById("view-supplier-section");
  const masterDataSection = document.getElementById("master-data-section");
  const transactionsSection = document.getElementById("transactions-section");
  const reportsSection = document.getElementById("reports-section");
  const supplierList = document.getElementById("supplier-list");
  const viewSupplierList = document.getElementById("view-supplier-list");
  const itemList = document.getElementById("item-list");
  const transactionList = document.getElementById("transaction-list");
  const manageSuppliersAdminButton = document.getElementById(
    "manage-suppliers-admin"
  );
  const viewSuppliersManagerButton = document.getElementById(
    "view-suppliers-manager"
  );
  const masterDataAdminButton = document.getElementById("master-data-admin");
  const transactionsAdminButton = document.getElementById("transactions-admin");
  const reportsAdminButton = document.getElementById("reports-admin");
  const backToAdminMenuButton = document.getElementById("back-to-admin-menu");
  const backToAdminMenuFromMasterButton = document.getElementById(
    "back-to-admin-menu-from-master"
  );
  const backToAdminMenuFromTransactionsButton = document.getElementById(
    "back-to-admin-menu-from-transactions"
  );
  const backToAdminMenuFromReportsButton = document.getElementById(
    "back-to-admin-menu-from-reports"
  );
  const backToManagerMenuButton = document.getElementById(
    "back-to-manager-menu"
  );
  const adminLogoutButton = document.getElementById("admin-logout");
  const managerLogoutButton = document.getElementById("manager-logout");

  // Mendefinisikan array user dengan objek-objek yang memiliki username, password, dan role.
  const users = [
    { username: "admin", password: "admin", role: "admin" },
    { username: "manager", password: "manager", role: "manager" },
  ];

  // Mendapatkan daftar supplier, barang, dan transaksi dari localStorage, atau inisialisasi sebagai array kosong jika tidak ada.
  let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  let items = JSON.parse(localStorage.getItem("items")) || [];
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  // Event listener untuk form login
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      loginSection.style.display = "none";
      if (user.role === "admin") {
        adminMenuSection.style.display = "block";
      } else if (user.role === "manager") {
        managerMenuSection.style.display = "block";
      }
    } else {
      alert("Login gagal!");
    }
  });

  // Event listener untuk tombol "Laporan" oleh admin
  reportsAdminButton.addEventListener("click", function () {
    adminMenuSection.style.display = "none";
    reportsSection.style.display = "block";
  });

  // Event listener untuk tombol "Kembali ke Menu Admin" dari bagian Laporan
  backToAdminMenuFromReportsButton.addEventListener("click", function () {
    reportsSection.style.display = "none";
    adminMenuSection.style.display = "block";
  });

  // Event listener untuk tombol "View Suppliers" oleh manager
  viewSuppliersManagerButton.addEventListener("click", function () {
    managerMenuSection.style.display = "none";
    viewSupplierSection.style.display = "block";
    loadSuppliers(viewSupplierList, false); // false indicates manager view
  });

  // Event listener untuk tombol "Master Data" oleh admin
  masterDataAdminButton.addEventListener("click", function () {
    adminMenuSection.style.display = "none";
    masterDataSection.style.display = "block";
    loadItems(itemList);
  });

  // Event listener untuk tombol "Transactions" oleh admin
  transactionsAdminButton.addEventListener("click", function () {
    adminMenuSection.style.display = "none";
    transactionsSection.style.display = "block";
    loadTransactions(transactionList);
  });

  // Event listener untuk tombol "Laporan Barang Masuk"
  document
    .getElementById("inbound-report")
    .addEventListener("click", function () {
      const inboundReport = generateInboundReport(transactions);
      displayReport(inboundReport);
    });

  // Event listener untuk tombol "Laporan Barang Keluar"
  document
    .getElementById("outbound-report")
    .addEventListener("click", function () {
      const outboundReport = generateOutboundReport(transactions);
      displayReport(outboundReport);
    });

  // Event listener untuk tombol "Laporan Stok Gudang"
  document
    .getElementById("warehouse-stock-report")
    .addEventListener("click", function () {
      const warehouseStockReport = generateWarehouseStockReport(
        items,
        transactions
      );
      displayReport(warehouseStockReport);
    });

  // Event listener untuk tombol "Laporan Pemasok"
  document
    .getElementById("supplier-report")
    .addEventListener("click", function () {
      const supplierReport = generateSupplierReport(suppliers);
      displayReport(supplierReport);
    });

  // Fungsi untuk memuat daftar transaksi
  function loadTransactions(listElement) {
    listElement.innerHTML = "";
    transactions.forEach((transaction, index) => {
      const li = document.createElement("li");
      li.textContent = `${transaction.type === "in" ? "Masuk" : "Keluar"} - ${
        transaction.item
      } - ${transaction.quantity}`;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Hapus";
      deleteButton.addEventListener("click", function () {
        deleteTransaction(index);
      });
      li.appendChild(deleteButton);
      listElement.appendChild(li);
    });
  }

  // Fungsi untuk menghapus transaksi dari daftar
  function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    loadTransactions(transactionList); // Refresh the list
  }

  // Event listener untuk tombol "Back" dan "Logout"
  backToAdminMenuButton.addEventListener("click", function () {
    supplierSection.style.display = "none";
    adminMenuSection.style.display = "block";
  });

  backToAdminMenuFromMasterButton.addEventListener("click", function () {
    masterDataSection.style.display = "none";
    adminMenuSection.style.display = "block";
  });

  backToAdminMenuFromTransactionsButton.addEventListener("click", function () {
    transactionsSection.style.display = "none";
    adminMenuSection.style.display = "block";
  });

  backToAdminMenuFromReportsButton.addEventListener("click", function () {
    reportsSection.style.display = "none";
    adminMenuSection.style.display = "block";
  });

  backToManagerMenuButton.addEventListener("click", function () {
    viewSupplierSection.style.display = "none";
    managerMenuSection.style.display = "block";
  });

  adminLogoutButton.addEventListener("click", function () {
    adminMenuSection.style.display = "none";
    loginSection.style.display = "block";
  });

  managerLogoutButton.addEventListener("click", function () {
    managerMenuSection.style.display = "none";
    loginSection.style.display = "block";
  });

  // Event listener untuk form pemasok
  supplierForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("supplier-name").value;
    const address = document.getElementById("supplier-address").value;

    suppliers.push({ name, address });
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    loadSuppliers(supplierList, true); // true indicates admin view
    supplierForm.reset();
  });

  // Event listener untuk form barang
  itemForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("item-name").value;
    const type = document.getElementById("item-type").value;
    const unit = document.getElementById("item-unit").value;

    items.push({ name, type, unit });
    localStorage.setItem("items", JSON.stringify(items));
    loadItems(itemList);
    itemForm.reset();
  });

  // Event listener untuk form transaksi
  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const type = document.getElementById("transaction-type").value;
    const item = document.getElementById("transaction-item").value;
    const quantity = parseInt(
      document.getElementById("transaction-quantity").value,
      10
    );

    transactions.push({ type, item, quantity });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    loadTransactions(transactionList);
    transactionForm.reset();
  });

  // Fungsi untuk memuat daftar pemasok dengan opsi untuk menghapus
  function loadSuppliers(listElement, isAdmin) {
    listElement.innerHTML = "";
    suppliers.forEach((supplier, index) => {
      const li = document.createElement("li");
      li.textContent = `${supplier.name} - ${supplier.address}`;
      if (isAdmin) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus";
        deleteButton.addEventListener("click", function () {
          deleteSupplier(index);
        });
        li.appendChild(deleteButton);
      }
      listElement.appendChild(li);
    });
  }

  // Fungsi untuk menghapus pemasok dari daftar
  function deleteSupplier(index) {
    suppliers.splice(index, 1);
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    loadSuppliers(supplierList, true); // Refresh the list for admin view
    loadSuppliers(viewSupplierList, false); // Refresh the list for manager view
  }

  // Fungsi untuk memuat daftar barang dengan opsi untuk menghapus
  function loadItems(listElement) {
    listElement.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.type} - ${item.unit}`;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Hapus";
      deleteButton.addEventListener("click", function () {
        deleteItem(index);
      });
      li.appendChild(deleteButton);
      listElement.appendChild(li);
    });
  }

  // Fungsi untuk menghapus barang dari daftar
  function deleteItem(index) {
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    loadItems(itemList); // Refresh the list
  }

  // Fungsi untuk memuat daftar transaksi
  function loadTransactions(listElement) {
    listElement.innerHTML = "";
    transactions.forEach((transaction, index) => {
      const li = document.createElement("li");
      li.textContent = `${transaction.type === "in" ? "Masuk" : "Keluar"} - ${
        transaction.item
      } - ${transaction.quantity}`;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Hapus";
      deleteButton.addEventListener("click", function () {
        deleteTransaction(index);
      });
      li.appendChild(deleteButton);
      listElement.appendChild(li);
    });
  }

  // Fungsi untuk menghapus transaksi dari daftar
  function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    loadTransactions(transactionList); // Refresh the list
  }

  // Fungsi untuk menghasilkan laporan barang masuk
  function generateInboundReport(transactions) {
    return transactions.filter((transaction) => transaction.type === "in");
  }

  // Fungsi untuk menghasilkan laporan barang keluar
  function generateOutboundReport(transactions) {
    return transactions.filter((transaction) => transaction.type === "out");
  }

  // Fungsi untuk menghasilkan laporan stok gudang
  function generateWarehouseStockReport(items, transactions) {
    let stock = items.map((item) => ({
      ...item,
      stock: transactions
        .filter((transaction) => transaction.item === item.name)
        .reduce((total, transaction) => {
          return transaction.type === "in"
            ? total + transaction.quantity
            : total - transaction.quantity;
        }, 0),
    }));
    return stock;
  }

  // Fungsi untuk menghasilkan laporan pemasok
  function generateSupplierReport(suppliers) {
    return suppliers;
  }

  // Fungsi untuk menampilkan laporan
  function displayReport(report) {
    const reportSection = document.getElementById("report-section");
    const reportContent = document.getElementById("report-content");
    reportSection.style.display = "block";
    reportContent.innerHTML = JSON.stringify(report, null, 2);
  }
});
