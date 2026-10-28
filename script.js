/* =========================================
   COMMUNITY LIBRARY MANAGEMENT SYSTEM
   JAVASCRIPT + LOCAL STORAGE
========================================= */


/* =========================================
   LOCAL STORAGE FUNCTIONS
========================================= */

function getBooks() {

    return JSON.parse(
        localStorage.getItem("libraryBooks")
    ) || [];
}


function saveBooks(books) {

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );
}


function getUsers() {

    return JSON.parse(
        localStorage.getItem("libraryUsers")
    ) || [];
}


function saveUsers(users) {

    localStorage.setItem(
        "libraryUsers",
        JSON.stringify(users)
    );
}


function getTransactions() {

    return JSON.parse(
        localStorage.getItem("libraryTransactions")
    ) || [];
}


function saveTransactions(transactions) {

    localStorage.setItem(
        "libraryTransactions",
        JSON.stringify(transactions)
    );
}


/* =========================================
   CREATE DEFAULT ADMIN
========================================= */

function createDefaultAdmin() {

    let users = getUsers();

    if (users.length === 0) {

        users.push({

            id: Date.now(),

            name: "Administrator",

            membershipId: "ADMIN001",

            role: "Admin",

            username: "admin",

            password: "admin123"

        });

        saveUsers(users);
    }
}


/* =========================================
   CHECK LOGIN
========================================= */

function checkLogin() {

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    const currentPage =
        window.location.pathname.split("/").pop();

    if (
        currentPage !== "index.html" &&
        currentPage !== "" &&
        !loggedInUser
    ) {

        window.location.href = "index.html";
    }
}


/* =========================================
   LOGIN
========================================= */

function setupLogin() {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) return;


    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document
                .getElementById("loginUsername")
                .value
                .trim();

            const password =
                document
                .getElementById("loginPassword")
                .value;


            const users = getUsers();


            const user = users.find(function(item) {

                return (
                    item.username === username &&
                    item.password === password
                );

            });


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (user) {

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(user)
                );

                message.textContent =
                    "Login successful!";

                message.className =
                    "message success-message";


                setTimeout(function() {

                    window.location.href =
                        "dashboard.html";

                }, 500);

            } else {

                message.textContent =
                    "Incorrect username or password.";

                message.className =
                    "message error-message";
            }

        }
    );
}


/* =========================================
   LOGOUT
========================================= */

function setupLogout() {

    const logoutLinks =
        document.querySelectorAll(
            ".logout-link"
        );


    logoutLinks.forEach(function(link) {

        link.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                localStorage.removeItem(
                    "loggedInUser"
                );

                window.location.href =
                    "index.html";
            }
        );

    });
}


/* =========================================
   SHOW CURRENT USER
========================================= */

function displayCurrentUser() {

    const element =
        document.getElementById(
            "currentUserName"
        );

    if (!element) return;


    const user =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (user) {

        element.textContent =
            user.name;
    }
}


/* =========================================
   ADD BOOK
========================================= */

function setupBookForm() {

    const form =
        document.getElementById("bookForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "bookId"
                ).value;


            const title =
                document.getElementById(
                    "bookTitle"
                ).value.trim();


            const author =
                document.getElementById(
                    "bookAuthor"
                ).value.trim();


            const genre =
                document.getElementById(
                    "bookGenre"
                ).value.trim();


            const isbn =
                document.getElementById(
                    "bookISBN"
                ).value.trim();


            const quantity =
                Number(
                    document.getElementById(
                        "bookQuantity"
                    ).value
                );


            let books = getBooks();


            /* UPDATE */

            if (id) {

                const book =
                    books.find(function(item) {

                        return item.id === Number(id);

                    });


                if (book) {

                    book.title = title;

                    book.author = author;

                    book.genre = genre;

                    book.isbn = isbn;

                    book.quantity = quantity;
                }


                saveBooks(books);

                showMessage(
                    "bookMessage",
                    "Book updated successfully!",
                    true
                );

            }


            /* ADD */

            else {

                const newBook = {

                    id: Date.now(),

                    title: title,

                    author: author,

                    genre: genre,

                    isbn: isbn,

                    quantity: quantity

                };


                books.push(newBook);

                saveBooks(books);


                showMessage(
                    "bookMessage",
                    "Book added successfully!",
                    true
                );
            }


            form.reset();

            document.getElementById(
                "bookId"
            ).value = "";


            document.getElementById(
                "bookFormTitle"
            ).textContent =
                "Add New Book";


            document.getElementById(
                "bookSubmitButton"
            ).textContent =
                "Add Book";


            document.getElementById(
                "cancelBookEdit"
            ).style.display =
                "none";


            displayBooks();

        }
    );


    const cancelButton =
        document.getElementById(
            "cancelBookEdit"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            cancelBookEdit
        );
    }
}


/* =========================================
   DISPLAY BOOKS
========================================= */

function displayBooks(
    searchTerm = ""
) {

    const tableBody =
        document.getElementById(
            "bookTableBody"
        );

    if (!tableBody) return;


    const books = getBooks();


    tableBody.innerHTML = "";


    const filteredBooks =
        books.filter(function(book) {

            const search =
                searchTerm.toLowerCase();


            return (
                book.title
                    .toLowerCase()
                    .includes(search) ||

                book.author
                    .toLowerCase()
                    .includes(search) ||

                book.genre
                    .toLowerCase()
                    .includes(search) ||

                book.isbn
                    .toLowerCase()
                    .includes(search)
            );

        });


    if (filteredBooks.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No books found.
                </td>
            </tr>
        `;

        return;
    }


    filteredBooks.forEach(function(book) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHTML(book.title)}</td>

            <td>${escapeHTML(book.author)}</td>

            <td>${escapeHTML(book.genre)}</td>

            <td>${escapeHTML(book.isbn)}</td>

            <td>${book.quantity}</td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn edit-btn"
                        onclick="editBook(${book.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteBook(${book.id})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


/* =========================================
   EDIT BOOK
========================================= */

function editBook(id) {

    const books = getBooks();


    const book =
        books.find(function(item) {

            return item.id === id;

        });


    if (!book) return;


    document.getElementById(
        "bookId"
    ).value = book.id;


    document.getElementById(
        "bookTitle"
    ).value = book.title;


    document.getElementById(
        "bookAuthor"
    ).value = book.author;


    document.getElementById(
        "bookGenre"
    ).value = book.genre;


    document.getElementById(
        "bookISBN"
    ).value = book.isbn;


    document.getElementById(
        "bookQuantity"
    ).value = book.quantity;


    document.getElementById(
        "bookFormTitle"
    ).textContent =
        "Update Book";


    document.getElementById(
        "bookSubmitButton"
    ).textContent =
        "Update Book";


    document.getElementById(
        "cancelBookEdit"
    ).style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   CANCEL BOOK EDIT
========================================= */

function cancelBookEdit() {

    document.getElementById(
        "bookForm"
    ).reset();


    document.getElementById(
        "bookId"
    ).value = "";


    document.getElementById(
        "bookFormTitle"
    ).textContent =
        "Add New Book";


    document.getElementById(
        "bookSubmitButton"
    ).textContent =
        "Add Book";


    document.getElementById(
        "cancelBookEdit"
    ).style.display =
        "none";
}


/* =========================================
   DELETE BOOK
========================================= */

function deleteBook(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmDelete) return;


    let books = getBooks();


    books =
        books.filter(function(book) {

            return book.id !== id;

        });


    saveBooks(books);


    displayBooks();

    loadTransactionBooks();

    updateDashboard();

}


/* =========================================
   BOOK SEARCH
========================================= */

function setupBookSearch() {

    const search =
        document.getElementById(
            "bookSearch"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        function() {

            displayBooks(
                search.value
            );

        }
    );
}


/* =========================================
   TRANSACTION BOOK DROPDOWN
========================================= */

function loadTransactionBooks() {

    const select =
        document.getElementById(
            "transactionBook"
        );


    if (!select) return;


    const books = getBooks();


    select.innerHTML = `
        <option value="">
            -- Select a book --
        </option>
    `;


    books.forEach(function(book) {

        const option =
            document.createElement(
                "option"
            );


        option.value = book.id;

        option.textContent =
            `${book.title} (${book.quantity} available)`;


        select.appendChild(option);

    });
}


/* =========================================
   TRANSACTIONS
========================================= */

function setupTransactionForm() {

    const form =
        document.getElementById(
            "transactionForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const bookId =
                Number(
                    document.getElementById(
                        "transactionBook"
                    ).value
                );


            const type =
                document.getElementById(
                    "transactionType"
                ).value;


            const quantity =
                Number(
                    document.getElementById(
                        "transactionQuantity"
                    ).value
                );


            let books = getBooks();


            const book =
                books.find(function(item) {

                    return item.id === bookId;

                });


            if (!book) {

                showMessage(
                    "transactionMessage",
                    "Please select a book.",
                    false
                );

                return;
            }


            if (quantity <= 0) {

                showMessage(
                    "transactionMessage",
                    "Quantity must be greater than zero.",
                    false
                );

                return;
            }


            /* BORROW */

            if (type === "Borrow") {

                if (book.quantity < quantity) {

                    showMessage(
                        "transactionMessage",
                        "Not enough copies available.",
                        false
                    );

                    return;
                }


                book.quantity -= quantity;

            }


            /* RETURN */

            else if (type === "Return") {

                book.quantity += quantity;

            }


            /* STOCK ADDED */

            else if (type === "Stock Added") {

                book.quantity += quantity;

            }


            saveBooks(books);


            /* Save transaction */

            const transactions =
                getTransactions();


            transactions.push({

                id: Date.now(),

                bookId: book.id,

                bookTitle: book.title,

                type: type,

                quantity: quantity,

                date:
                    new Date()
                    .toLocaleString()

            });


            saveTransactions(
                transactions
            );


            showMessage(
                "transactionMessage",
                "Transaction completed successfully!",
                true
            );


            form.reset();


            loadTransactionBooks();

            displayTransactions();

            updateDashboard();

        }
    );
}


/* =========================================
   DISPLAY TRANSACTIONS
========================================= */

function displayTransactions() {

    const tableBody =
        document.getElementById(
            "transactionTableBody"
        );


    if (!tableBody) return;


    const transactions =
        getTransactions();


    tableBody.innerHTML = "";


    if (transactions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No transactions yet.
                </td>
            </tr>
        `;

        return;
    }


    /* Latest transaction first */

    const reversed =
        [...transactions].reverse();


    reversed.forEach(function(transaction) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    transaction.bookTitle
                )}
            </td>

            <td>
                ${escapeHTML(
                    transaction.type
                )}
            </td>

            <td>
                ${transaction.quantity}
            </td>

            <td>
                ${escapeHTML(
                    transaction.date
                )}
            </td>

            <td>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


/* =========================================
   DELETE TRANSACTION
========================================= */

function deleteTransaction(id) {

    if (
        !confirm(
            "Delete this transaction from the history?"
        )
    ) {
        return;
    }


    let transactions =
        getTransactions();


    transactions =
        transactions.filter(
            function(transaction) {

                return transaction.id !== id;

            }
        );


    saveTransactions(
        transactions
    );


    displayTransactions();

    updateDashboard();
}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard(
    searchTerm = ""
) {

    const books = getBooks();

    const transactions =
        getTransactions();


    const totalBooks =
        document.getElementById(
            "totalBooks"
        );


    const totalCopies =
        document.getElementById(
            "totalCopies"
        );


    const lowStockBooks =
        document.getElementById(
            "lowStockBooks"
        );


    const totalTransactions =
        document.getElementById(
            "totalTransactions"
        );


    if (totalBooks) {

        totalBooks.textContent =
            books.length;
    }


    if (totalCopies) {

        const copies =
            books.reduce(
                function(total, book) {

                    return total +
                        Number(book.quantity);

                },
                0
            );


        totalCopies.textContent =
            copies;
    }


    if (lowStockBooks) {

        const lowStock =
            books.filter(
                function(book) {

                    return (
                        book.quantity < 2
                    );

                }
            );


        lowStockBooks.textContent =
            lowStock.length;
    }


    if (totalTransactions) {

        totalTransactions.textContent =
            transactions.length;
    }


    displayDashboardBooks(
        searchTerm
    );
}


/* =========================================
   DISPLAY DASHBOARD BOOKS
========================================= */

function displayDashboardBooks(
    searchTerm = ""
) {

    const tableBody =
        document.getElementById(
            "dashboardBookTable"
        );


    if (!tableBody) return;


    const books = getBooks();


    const search =
        searchTerm.toLowerCase();


    const filtered =
        books.filter(function(book) {

            return (

                book.title
                    .toLowerCase()
                    .includes(search) ||

                book.author
                    .toLowerCase()
                    .includes(search) ||

                book.genre
                    .toLowerCase()
                    .includes(search)

            );

        });


    tableBody.innerHTML = "";


    if (filtered.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No books found.
                </td>
            </tr>
        `;

        return;
    }


    filtered.forEach(function(book) {

        let status = "";

        let statusClass = "";


        if (book.quantity === 0) {

            status = "Out of Stock";

            statusClass = "out-stock";

        }

        else if (book.quantity < 2) {

            status = "Low Stock";

            statusClass = "low-stock";

        }

        else {

            status = "Available";

            statusClass = "in-stock";
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(book.title)}
            </td>

            <td>
                ${escapeHTML(book.author)}
            </td>

            <td>
                ${escapeHTML(book.genre)}
            </td>

            <td>
                ${escapeHTML(book.isbn)}
            </td>

            <td>
                ${book.quantity}
            </td>

            <td class="${statusClass}">
                ${status}
            </td>

        `;


        tableBody.appendChild(row);

    });
}


/* =========================================
   DASHBOARD SEARCH
========================================= */

function setupDashboardSearch() {

    const search =
        document.getElementById(
            "dashboardSearch"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        function() {

            updateDashboard(
                search.value
            );

        }
    );
}


/* =========================================
   USER MANAGEMENT
========================================= */

function setupUserForm() {

    const form =
        document.getElementById(
            "userForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "userId"
                ).value;


            const name =
                document.getElementById(
                    "userName"
                ).value.trim();


            const membershipId =
                document.getElementById(
                    "membershipId"
                ).value.trim();


            const role =
                document.getElementById(
                    "userRole"
                ).value;


            const username =
                document.getElementById(
                    "userUsername"
                ).value.trim();


            const password =
                document.getElementById(
                    "userPassword"
                ).value;


            let users = getUsers();


            /* UPDATE */

            if (id) {

                const user =
                    users.find(function(item) {

                        return item.id === Number(id);

                    });


                if (user) {

                    user.name = name;

                    user.membershipId =
                        membershipId;

                    user.role = role;

                    user.username =
                        username;

                    user.password =
                        password;
                }


                saveUsers(users);


                showMessage(
                    "userMessage",
                    "User updated successfully!",
                    true
                );

            }


          

            else {

                const usernameExists =
                    users.some(function(user) {

                        return (
                            user.username ===
                            username
                        );

                    });


                if (usernameExists) {

                    showMessage(
                        "userMessage",
                        "Username already exists.",
                        false
                    );

                    return;
                }


                users.push({

                    id: Date.now(),

                    name: name,

                    membershipId:
                        membershipId,

                    role: role,

                    username: username,

                    password: password

                });


                saveUsers(users);


                showMessage(
                    "userMessage",
                    "User added successfully!",
                    true
                );
            }


            form.reset();


            document.getElementById(
                "userId"
            ).value = "";


            document.getElementById(
                "userFormTitle"
            ).textContent =
                "Add User";


            document.getElementById(
                "cancelUserEdit"
            ).style.display =
                "none";


            displayUsers();

        }
    );


    const cancel =
        document.getElementById(
            "cancelUserEdit"
        );


    if (cancel) {

        cancel.addEventListener(
            "click",
            cancelUserEdit
        );
    }
}




function displayUsers(
    searchTerm = ""
) {

    const tableBody =
        document.getElementById(
            "userTableBody"
        );


    if (!tableBody) return;


    const users = getUsers();


    const search =
        searchTerm.toLowerCase();


    const filtered =
        users.filter(function(user) {

            return (

                user.name
                    .toLowerCase()
                    .includes(search) ||

                user.membershipId
                    .toLowerCase()
                    .includes(search) ||

                user.username
                    .toLowerCase()
                    .includes(search) ||

                user.role
                    .toLowerCase()
                    .includes(search)

            );

        });


    tableBody.innerHTML = "";


    if (filtered.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }


    filtered.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(user.name)}
            </td>

            <td>
                ${escapeHTML(
                    user.membershipId
                )}
            </td>

            <td>
                ${escapeHTML(user.role)}
            </td>

            <td>
                ${escapeHTML(user.username)}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn edit-btn"
                        onclick="editUser(${user.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteUser(${user.id})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });
}



function editUser(id) {

    const users = getUsers();


    const user =
        users.find(function(item) {

            return item.id === id;

        });


    if (!user) return;


    document.getElementById(
        "userId"
    ).value = user.id;


    document.getElementById(
        "userName"
    ).value = user.name;


    document.getElementById(
        "membershipId"
    ).value =
        user.membershipId;


    document.getElementById(
        "userRole"
    ).value = user.role;


    document.getElementById(
        "userUsername"
    ).value =
        user.username;


    document.getElementById(
        "userPassword"
    ).value =
        user.password;


    document.getElementById(
        "userFormTitle"
    ).textContent =
        "Update User";


    document.getElementById(
        "cancelUserEdit"
    ).style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



function cancelUserEdit() {

    document.getElementById(
        "userForm"
    ).reset();


    document.getElementById(
        "userId"
    ).value = "";


    document.getElementById(
        "userFormTitle"
    ).textContent =
        "Add User";


    document.getElementById(
        "cancelUserEdit"
    ).style.display =
        "none";
}



function deleteUser(id) {

    const users = getUsers();


    const user =
        users.find(function(item) {

            return item.id === id;

        });


    if (!user) return;


    /* Prevent deleting admin */

    if (user.username === "admin") {

        alert(
            "The default administrator cannot be deleted."
        );

        return;
    }


    if (
        !confirm(
            "Are you sure you want to delete this user?"
        )
    ) {
        return;
    }


    const updatedUsers =
        users.filter(
            function(item) {

                return item.id !== id;

            }
        );


    saveUsers(updatedUsers);


    displayUsers();
}




function setupUserSearch() {

    const search =
        document.getElementById(
            "userSearch"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        function() {

            displayUsers(
                search.value
            );

        }
    );
}




function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (!menuButton || !sidebar) return;


    menuButton.addEventListener(
        "click",
        function() {

            sidebar.classList.toggle(
                "show"
            );

        }
    );


    document.addEventListener(
        "click",
        function(event) {

            if (
                window.innerWidth <= 850 &&
                sidebar.classList.contains("show") &&
                !sidebar.contains(event.target) &&
                event.target !== menuButton
            ) {

                sidebar.classList.remove(
                    "show"
                );
            }

        }
    );
}



function showMessage(
    elementId,
    text,
    success
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) return;


    element.textContent = text;


    if (success) {

        element.className =
            "message success-message";

    } else {

        element.className =
            "message error-message";
    }


    setTimeout(function() {

        element.textContent = "";

    }, 3000);
}




function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}



document.addEventListener(
    "DOMContentLoaded",
    function() {

        createDefaultAdmin();

        checkLogin();

        setupLogin();

        setupLogout();

        setupMobileMenu();

        displayCurrentUser();

        setupBookForm();

        displayBooks();

        setupBookSearch();

        setupTransactionForm();

        loadTransactionBooks();

        displayTransactions();

        updateDashboard();

        setupDashboardSearch();

        setupUserForm();

        displayUsers();

        setupUserSearch();

    }
);