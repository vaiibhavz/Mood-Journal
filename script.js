// Mood selection handling
document.addEventListener('DOMContentLoaded', function() {
    const moodRadios = document.querySelectorAll('.mood-radio');
    const journalText = document.getElementById('journal-text');
    const resetButton = document.querySelector('.controls .reset');
    const saveButton = document.querySelector('.controls .save');
    const refreshButton = document.querySelector('.refresh-button');

    // Reset functionality
    resetButton.addEventListener('click', function() {
        // Reset mood selection
        moodRadios.forEach(radio => {
            radio.checked = false;
        });
        // Set default to Normal
        document.getElementById('mood-normal').checked = true;
        // Clear textarea
        if (journalText) {
            if (journalText.tagName === 'TEXTAREA') {
                journalText.value = '';
            } else {
                journalText.innerHTML = '';
            }
        }
    });

    // Save functionality (placeholder)
    saveButton.addEventListener('click', function() {
        const selectedMood = document.querySelector('input[name="mood"]:checked');
        let text = '';
        if (journalText) {
            if (journalText.tagName === 'TEXTAREA') {
                text = journalText.value;
            } else {
                text = journalText.innerText || journalText.textContent;
            }
        }
        
        if (selectedMood && text.trim()) {
            console.log('Saving entry:', {
                mood: selectedMood.value,
                text: text
            });
            // Add your save logic here
            alert('Entry saved!');
        } else {
            alert('Please select a mood and write something.');
        }
    });

    // Refresh button functionality
    refreshButton.addEventListener('click', function() {
        if (journalText) {
            if (journalText.tagName === 'TEXTAREA') {
                journalText.value = '';
            } else {
                journalText.innerHTML = '';
            }
        }
    });

    // Rich text editor functionality
    if (journalText && journalText.contentEditable === 'true') {
        const toolbarButtons = document.querySelectorAll('.toolbar .tool[data-command]');
        
        // Update button states based on current formatting
        function updateButtonStates() {
            toolbarButtons.forEach(button => {
                const command = button.getAttribute('data-command');
                try {
                    if (document.queryCommandState(command)) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                } catch (e) {
                    // Command not supported
                }
            });
        }

        // Update states on selection change
        journalText.addEventListener('input', updateButtonStates);
        journalText.addEventListener('keyup', updateButtonStates);
        journalText.addEventListener('mouseup', updateButtonStates);
        document.addEventListener('selectionchange', updateButtonStates);

        // Toolbar button click handlers
        toolbarButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const command = this.getAttribute('data-command');
                
                if (!command) return;
                
                // Focus the editor
                journalText.focus();
                
                // Execute the formatting command
                try {
                    document.execCommand(command, false, null);
                } catch (e) {
                    console.error('Command failed:', command, e);
                }
                
                // Update button states
                updateButtonStates();
            });
        });

        // Handle list command specially
        const listButton = document.querySelector('.toolbar .tool[data-command="insertUnorderedList"]');
        if (listButton) {
            listButton.addEventListener('click', function(e) {
                e.preventDefault();
                journalText.focus();
                try {
                    document.execCommand('insertUnorderedList', false, null);
                } catch (e) {
                    console.error('List command failed:', e);
                }
                updateButtonStates();
            });
        }
    }
});
