"use strict";
// script.ts
// Function to generate an editable section with Edit and Save buttons
function generateEditableSection(title, content) {
    return `
      <div class="editable-section">
        <h2>${title}</h2>
        <p class="editable-content" contenteditable="false">${content}</p>
        <div class="button-group">
          <button class="edit-button">Edit</button>
          <button class="save-button hidden">Save</button>
        </div>
      </div>
    `;
}
// Function to generate an editable list section (for Skills)
function generateEditableListSection(title, items) {
    const listItems = items.map(item => `<li>${item.trim()}</li>`).join('');
    return `
      <div class="editable-section">
        <h2>${title}</h2>
        <ul class="editable-content" contenteditable="false">
          ${listItems}
        </ul>
        <div class="button-group">
          <button class="edit-button">Edit</button>
          <button class="save-button hidden">Save</button>
        </div>
      </div>
    `;
}
// Function to generate the personal information section with profile picture and Edit Picture button
function generatePersonalInfoSectionWithEdit(name, email, phone, profilePicSrc) {
    let imgHtml = '';
    if (profilePicSrc) {
        imgHtml = `
        <img src="${profilePicSrc}" alt="Profile Picture" id="profile-pic-output" />
        <div class="button-group">
          <button class="edit-profile-pic-button">Edit Picture</button>
        </div>
      `;
    }
    return `
      <div class="editable-section" id="personal-info-section">
        <h2>Personal Information</h2>
        ${imgHtml}
        <p class="editable-content" contenteditable="false"><strong>Name:</strong> ${name}</p>
        <p class="editable-content" contenteditable="false"><strong>Email:</strong> ${email}</p>
        <p class="editable-content" contenteditable="false"><strong>Phone:</strong> ${phone}</p>
        <div class="button-group">
          <button class="edit-button">Edit</button>
          <button class="save-button hidden">Save</button>
        </div>
      </div>
    `;
}
const form = document.getElementById('resume-form');
const resumeOutput = document.getElementById('resume-output');
// Sections for displaying the resume
const personalInfoOutput = document.getElementById('personal-info-output');
const educationOutput = document.getElementById('education-output');
const workExperienceOutput = document.getElementById('work-experience-output');
const skillsOutput = document.getElementById('skills-output');
// Handle form submission
form.addEventListener('submit', (event) => {
    var _a;
    event.preventDefault();
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const education = document.getElementById('education').value;
    const workExperience = document.getElementById('work-experience').value;
    const skills = document.getElementById('skills').value.split(',');
    const profilePicInput = document.getElementById('profile-pic');
    const profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
    // Function to handle profile picture upload
    const handleProfilePic = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject('Error reading profile picture.');
            };
            reader.readAsDataURL(file);
        });
    };
    // Function to populate the resume sections
    const populateResume = (profilePicSrc) => {
        // Populate personal information section
        personalInfoOutput.innerHTML = generatePersonalInfoSectionWithEdit(name, email, phone, profilePicSrc);
        // Populate other sections
        educationOutput.innerHTML = generateEditableSection('Education', education);
        workExperienceOutput.innerHTML = generateEditableSection('Work Experience', workExperience);
        skillsOutput.innerHTML = generateEditableListSection('Skills', skills);
        // Show the resume output
        resumeOutput.classList.remove('hidden');
        // Reset the form
        form.reset();
    };
    if (profilePicFile) {
        handleProfilePic(profilePicFile).then((profilePicSrc) => {
            populateResume(profilePicSrc);
        }).catch((error) => {
            console.error(error);
            populateResume(); // Proceed without profile picture on error
        });
    }
    else {
        populateResume();
    }
});
// Function to make content editable and toggle buttons
function toggleEditSave(button, saveButton, contentElement) {
    if (button.textContent === 'Edit') {
        // Switch to edit mode
        contentElement.setAttribute('contenteditable', 'true');
        contentElement.focus();
        button.classList.add('hidden');
        saveButton.classList.remove('hidden');
    }
}
// Function to save the edited content and toggle buttons
function saveContent(button, editButton, contentElement) {
    if (button.textContent === 'Save') {
        // Switch to view mode
        contentElement.setAttribute('contenteditable', 'false');
        button.classList.add('hidden');
        editButton.classList.remove('hidden');
    }
}
// Event delegation for handling edit/save and edit picture actions
document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('edit-button')) {
        const button = target;
        const parentSection = button.closest('.editable-section');
        if (parentSection) {
            const saveButton = parentSection.querySelector('.save-button');
            const contentElement = parentSection.querySelector('.editable-content');
            if (saveButton && contentElement) {
                toggleEditSave(button, saveButton, contentElement);
            }
        }
    }
    if (target.classList.contains('save-button')) {
        const button = target;
        const parentSection = button.closest('.editable-section');
        if (parentSection) {
            const editButton = parentSection.querySelector('.edit-button');
            const contentElement = parentSection.querySelector('.editable-content');
            if (editButton && contentElement) {
                saveContent(button, editButton, contentElement);
            }
        }
    }
    if (target.classList.contains('edit-profile-pic-button')) {
        const button = target;
        const parentSection = button.closest('.editable-section');
        if (parentSection) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = (e) => {
                const input = e.target;
                if (input.files && input.files[0]) {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = function () {
                        const imgElement = parentSection.querySelector('#profile-pic-output');
                        if (imgElement) {
                            imgElement.src = reader.result;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
            fileInput.click();
        }
    }
    if (target.id === 'print-resume') {
        window.print();
    }
});
