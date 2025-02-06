const apiUrl = 'https://jsonplaceholder.typicode.com/users';

// Elements
const userList = document.getElementById('user-list');
const userTableBody = document.getElementById('user-table-body');
const userForm = document.getElementById('user-form');
const userFormBody = document.getElementById('user-form-body');
const errorMessage = document.getElementById('error-message');

// Functions

// Show Error Message
function showError(message) {
    errorMessage.style.display = 'block';
    errorMessage.innerText = message;
}

// Clear Error Message
function clearError() {
    errorMessage.style.display = 'none';
}

// Fetch Users
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        const users = await response.json();
        renderUserList(users);
    } catch (error) {
        showError('Failed to fetch users. Please try again later.');
    }
}

let userArray = fetchUsers();

// Render User List
function renderUserList(users) {
    userTableBody.innerHTML = ''; // Clear existing users
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name.split(' ')[0]}</td>
            <td>${user.name.split(' ')[1]}</td>
            <td>${user.email}</td>
            <td>${user.company.name}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Add User
async function addUser(userData) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let newUser = await response.json();
        const response1 = await fetch(apiUrl);
        let users = await response1.json();
        newUser={
            id:users.length+1,
            ...newUser
        };
        users.push(newUser);
        console.log(users);
        //renderUserList(newUser);
        fetchUsers();
        showError('User added successfully.');
        //closeForm();
    } catch (error) {
        showError('Failed to add user.');
    }
}

// Edit User
async function editUser(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        const user = await response.json();
        document.getElementById('form-title').innerText = 'Edit User';
        document.getElementById('user-id').value = user.id;
        document.getElementById('first-name').value = user.name.split(' ')[0];
        document.getElementById('last-name').value = user.name.split(' ')[1];
        document.getElementById('email').value = user.email;
        document.getElementById('department').value = user.company.name;
        userForm.style.display = 'block';
    } catch (error) {
        showError('Failed to fetch user for editing.');
    }
}

// Update User
async function updateUser(id, userData) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        fetchUsers();
        closeForm();
    } catch (error) {
        showError('Failed to update user.');
    }
}

// Delete User
async function deleteUser(id) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        fetchUsers();
    } catch (error) {
        showError('Failed to delete user.');
    }
}

// Submit Form (Add or Edit)
userFormBody.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    const userData = {
        name: `${firstName} ${lastName}`,
        email: email,
        company: {
            name: department
        }
    };

    if (id) {
        updateUser(id, userData);
    } else {
        addUser(userData);
    }
});

// Close Form
document.getElementById('cancel-btn').addEventListener('click', closeForm);

function closeForm() {
    userForm.style.display = 'none';
    clearError();
}

// Initialize the app
fetchUsers();
