document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    const weatherData = [
        { date: "April 20-22", location: "London", temp: "12-16°C (53-61°F)", notes: "Changeable spring weather, possible rain on Monday (20%)" },
        { date: "April 22-25", location: "Edinburgh", temp: "9-14°C (48-57°F)", notes: "Cool, potential for rain" },
        { date: "April 22-25", location: "Scottish Highlands", temp: "5-10°C (41-50°F)", notes: "Cooler, rain likely, potentially windy" },
        { date: "April 25-28", location: "Bristol", temp: "11-16°C (52-61°F)", notes: "Similar to London, possible showers" },
        { date: "April 28-May 5", location: "Bordeaux & Dordogne", temp: "14-19°C (57-66°F)", notes: "Pleasant spring weather, cool evenings" },
        { date: "May 5-6", location: "Bordeaux", temp: "14-19°C (57-66°F)", notes: "Similar conditions as before" },
        { date: "May 6-7", location: "La Rochelle", temp: "14-18°C (57-64°F)", notes: "Coastal weather, potentially breezy" },
        { date: "May 7-8", location: "London", temp: "13-17°C (55-63°F)", notes: "Changeable spring weather, possible showers" }
    ];

    // Try to load data from localStorage or use defaults
    let packingData = JSON.parse(localStorage.getItem('euroTripData')) || {
        "Cycling Gear": [
            { name: "Padded cycling shorts (2 pairs)", checked: false, sendBack: false },
            { name: "Moisture-wicking cycling tops (2-3)", checked: false, sendBack: false },
            { name: "Lightweight packable cycling jacket", checked: false, sendBack: false },
            { name: "Cycling gloves", checked: false, sendBack: false },
            { name: "Sunglasses", checked: false, sendBack: false },
            { name: "Small bike bag", checked: false, sendBack: false }
        ],
        "Multipurpose Items": [
            { name: "Athletic shoes (for cycling/walking)", checked: false, sendBack: false },
            { name: "Microfiber travel towel", checked: false, sendBack: false },
            { name: "Collapsible water bottle", checked: false, sendBack: false },
            { name: "Sunscreen", checked: false, sendBack: false },
            { name: "Slides", checked: false, sendBack: false },
            { name: "Travel-sized chamois cream", checked: false, sendBack: false }
        ],
        "Regular Clothing": [
            { name: "Casual outfits (2 versatile sets)", checked: false, sendBack: true },
            { name: "Light sweater or fleece", checked: false, sendBack: true },
            { name: "Packable rain jacket", checked: false, sendBack: false },
            { name: "Wedding attire", checked: false, sendBack: true },
            { name: "Socks", checked: false, sendBack: false },
            { name: "Bathing suit", checked: false, sendBack: false },
            { name: "Leggings", checked: false, sendBack: false },
            { name: "Sleep clothes", checked: false, sendBack: false }
        ],
        "Essentials": [
            { name: "Phone charger", checked: false, sendBack: false },
            { name: "UK adapter plug", checked: false, sendBack: true },
            { name: "Euro adapter plug", checked: false, sendBack: true },
            { name: "Charge brick", checked: false, sendBack: true },
            { name: "Mini first aid kit", checked: false, sendBack: false },
            { name: "Toiletries", checked: false, sendBack: false },
            { name: "Wallet", checked: false, sendBack: false },
            { name: "Passport", checked: false, sendBack: false },
            { name: "Skin care", checked: false, sendBack: false }
        ]
    };

    // Save data to localStorage whenever it changes
    function saveData() {
        localStorage.setItem('euroTripData', JSON.stringify(packingData));
        updateProgress();
        updateSendBackStats();
    }

    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Render weather data
    function renderWeatherData() {
        const weatherContainer = document.querySelector('.weather-cards');
        const template = document.getElementById('weather-card-template');
        
        weatherContainer.innerHTML = '';
        
        weatherData.forEach(data => {
            const clone = template.content.cloneNode(true);
            
            clone.querySelector('.location-name').textContent = data.location;
            clone.querySelector('.date-range').textContent = data.date;
            clone.querySelector('.temperature').textContent = data.temp;
            clone.querySelector('.weather-notes').textContent = data.notes;
            
            weatherContainer.appendChild(clone);
        });
    }

    // Render sections for packing list
    function renderPackingSections() {
        const sectionsContainer = document.querySelector('.sections-container');
        sectionsContainer.innerHTML = '';
        
        Object.entries(packingData).forEach(([sectionName, items]) => {
            const sectionTemplate = document.getElementById('section-template');
            const sectionClone = sectionTemplate.content.cloneNode(true);
            
            sectionClone.querySelector('.section-title').textContent = sectionName;
            const section = sectionClone.querySelector('.section');
            const itemList = sectionClone.querySelector('.item-list');
            
            // Add items to the section
            items.forEach((item, index) => {
                const itemTemplate = document.getElementById('item-template');
                const itemClone = itemTemplate.content.cloneNode(true);
                
                const itemText = itemClone.querySelector('.item-text');
                itemText.textContent = item.name;
                
                const checkIcon = itemClone.querySelector('.item-check i');
                if (item.checked) {
                    checkIcon.classList.remove('fa-regular', 'fa-circle');
                    checkIcon.classList.add('fa-solid', 'fa-check-circle');
                    itemText.classList.add('checked');
                }
                
                // Toggle checked status
                const itemElement = itemClone.querySelector('.item');
                const itemCheck = itemClone.querySelector('.item-check');
                
                itemCheck.addEventListener('click', (e) => {
                    e.stopPropagation(); // Add this line to prevent the click from bubbling up
                    packingData[sectionName][index].checked = !packingData[sectionName][index].checked;
                    renderPackingSections();
                    saveData();
                });
                
                // Edit item
                const editButton = itemClone.querySelector('.edit-button');
                editButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Replace item with edit form
                    const formTemplate = document.getElementById('edit-item-form-template');
                    const formClone = formTemplate.content.cloneNode(true);
                    const input = formClone.querySelector('.edit-item-input');
                    input.value = item.name;
                    
                    const parent = itemElement.parentNode;
                    parent.replaceChild(formClone, itemElement);
                    input.focus();
                    
                    // Save edited item
                    const saveButton = parent.querySelector('.save-edit-button');
                    saveButton.addEventListener('click', () => {
                        if (input.value.trim()) {
                            packingData[sectionName][index].name = input.value.trim();
                            saveData();
                            renderPackingSections();
                        }
                    });
                    
                    // Cancel editing
                    const cancelButton = parent.querySelector('.cancel-edit-button');
                    cancelButton.addEventListener('click', () => {
                        renderPackingSections();
                    });
                });
                
                // Delete item
                const deleteButton = itemClone.querySelector('.delete-button');
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    packingData[sectionName].splice(index, 1);
                    saveData();
                    renderPackingSections();
                });
                
                itemList.appendChild(itemClone);
            });
            
            // Add new item functionality
            const addButton = sectionClone.querySelector('.add-button');
            addButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Add this line
                
                const addItemTemplate = document.getElementById('add-item-form-template');
                const formClone = addItemTemplate.content.cloneNode(true);
                
                const addItemContainer = section.querySelector('.add-item-container');
                addItemContainer.innerHTML = '';
                addItemContainer.appendChild(formClone);
                
                const input = addItemContainer.querySelector('.new-item-input');
                input.focus();
                
                // Save new item
                const saveButton = addItemContainer.querySelector('.save-button');
                saveButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (input.value.trim()) {
                        packingData[sectionName].push({
                            name: input.value.trim(),
                            checked: false,
                            sendBack: false
                        });
                        saveData();
                        renderPackingSections();
                    }
                });
                
                // Cancel adding
                const cancelButton = addItemContainer.querySelector('.cancel-button');
                cancelButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    renderPackingSections();
                });
            });
            
            // Toggle section expansion
            const sectionHeader = sectionClone.querySelector('.section-header');
            sectionHeader.addEventListener('click', (e) => {
                // Only toggle if the click was directly on the header, not bubbled from children
                if (e.target === sectionHeader || e.target === sectionClone.querySelector('.section-title') || e.target === sectionClone.querySelector('.fa-chevron-down')) {
                    section.classList.toggle('expanded');
                }
            });            

    }

    // Render send back sections
    function renderSendBackSections() {
        const sectionsContainer = document.getElementById('sendback-sections');
        sectionsContainer.innerHTML = '';
        
        Object.entries(packingData).forEach(([sectionName, items]) => {
            const sectionTemplate = document.getElementById('section-template');
            const sectionClone = sectionTemplate.content.cloneNode(true);
            
            sectionClone.querySelector('.section-title').textContent = sectionName;
            const section = sectionClone.querySelector('.section');
            const itemList = sectionClone.querySelector('.item-list');
            
            // Remove add button for send back tab
            const addItemContainer = sectionClone.querySelector('.add-item-container');
            addItemContainer.remove();
            
            // Add items to the section
            items.forEach((item, index) => {
                const itemTemplate = document.getElementById('sendback-item-template');
                const itemClone = itemTemplate.content.cloneNode(true);
                
                itemClone.querySelector('.item-text').textContent = item.name;
                
                const toggleButton = itemClone.querySelector('.sendback-toggle');
                const toggleText = toggleButton.querySelector('.toggle-text');
                
                if (item.sendBack) {
                    toggleButton.classList.add('send-back');
                    toggleText.textContent = 'Send Back';
                } else {
                    toggleText.textContent = 'Keep';
                }
                
                // Toggle send back status
                toggleButton.addEventListener('click', (e) => {
                    old --> packingData[sectionName][index].sendBack = !packingData[sectionName][index].sendBack;
                    if (e.target === sectionHeader || e.target === sectionClone.querySelector('.section-title') || e.target === sectionClone.querySelector('.fa-chevron-down')) {
                        section.classList.toggle('expanded');
                    }
                    saveData();
                    renderSendBackSections();
                });
                
                itemList.appendChild(itemClone);
            });
            
            // Toggle section expansion
            const sectionHeader = sectionClone.querySelector('.section-header');
            sectionHeader.addEventListener('click', (e) => {
                // Only toggle if the click was directly on the header, not bubbled from children
                if (e.target === sectionHeader || e.target === sectionClone.querySelector('.section-title') || e.target === sectionClone.querySelector('.fa-chevron-down')) {
                    section.classList.toggle('expanded');
                }
            });
            
            sectionsContainer.appendChild(sectionClone);
        });
    }

    // Update progress percentage
    function updateProgress() {
        let totalItems = 0;
        let checkedItems = 0;
        
        Object.values(packingData).forEach(items => {
            totalItems += items.length;
            checkedItems += items.filter(item => item.checked).length;
        });
        
        const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
        
        document.getElementById('progress-percent').textContent = progressPercent;
        document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
    }

    // Update send back statistics
    function updateSendBackStats() {
        let sendBackCount = 0;
        let keepCount = 0;
        
        Object.values(packingData).forEach(items => {
            items.forEach(item => {
                if (item.sendBack) {
                    sendBackCount++;
                } else {
                    keepCount++;
                }
            });
        });
        
        document.getElementById('send-back-count').textContent = sendBackCount;
        document.getElementById('keep-count').textContent = keepCount;
    }

    // Initialize the UI
    renderWeatherData();
    renderPackingSections();
    renderSendBackSections();
    updateProgress();
    updateSendBackStats();

    // Expand first section in each tab by default
    document.querySelectorAll('.section').forEach((section, index) => {
        if (index === 0 || index === Object.keys(packingData).length) {
            section.classList.add('expanded');
        }
    });
});
