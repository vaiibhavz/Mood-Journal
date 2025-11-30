document.addEventListener('DOMContentLoaded', function() {
    const moodRadios = document.querySelectorAll('.mood-radio');
    const journalText = document.getElementById('journal-text');
    const resetButton = document.querySelector('.controls .reset');
    const saveButton = document.querySelector('.controls .save');
    const refreshButton = document.querySelector('.refresh-button');

    resetButton.addEventListener('click', function() {
        moodRadios.forEach(radio => {
            radio.checked = false;
        });
        if (journalText) {
            if (journalText.tagName === 'TEXTAREA') {
                journalText.value = '';
            } else {
                journalText.innerHTML = '';
            }
        }
        
        if (journalText && journalText.contentEditable === 'true') {
            const toolbarButtons = document.querySelectorAll('.toolbar .tool[data-command]');
            toolbarButtons.forEach(button => {
                button.classList.remove('active');
            });
        }
    });

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
            alert('Entry saved!');
        } else {
            alert('Please select a mood and write something.');
        }
    });

    refreshButton.addEventListener('click', function() {
        if (journalText) {
            if (journalText.tagName === 'TEXTAREA') {
                journalText.value = '';
            } else {
                journalText.innerHTML = '';
            }
        }
    });

    if (journalText && journalText.contentEditable === 'true') {
        const toolbarButtons = document.querySelectorAll('.toolbar .tool[data-command]');
        const listButton = document.querySelector('.toolbar .tool[data-command="insertUnorderedList"]');
        
        function isSelectionInEditor() {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                return false;
            }
            
            const range = selection.getRangeAt(0);
            return journalText.contains(range.commonAncestorContainer) || journalText === range.commonAncestorContainer;
        }
        
        function updateButtonStates() {
            if (!isSelectionInEditor() && document.activeElement !== journalText) {
                toolbarButtons.forEach(button => {
                    button.classList.remove('active');
                });
                if (listButton) {
                    listButton.classList.remove('active');
                }
                return;
            }
            
            toolbarButtons.forEach(button => {
                const command = button.getAttribute('data-command');
                
                if (command === 'insertUnorderedList') {
                    return;
                }
                
                try {
                    if (document.queryCommandState(command)) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                } catch (e) {
                    button.classList.remove('active');
                }
            });
            
            if (listButton) {
                try {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        let node = range.commonAncestorContainer;
                        
                        while (node && node !== journalText) {
                            if (node.nodeType === 1) {
                                if (node.tagName === 'UL' || node.tagName === 'LI') {
                                    listButton.classList.add('active');
                                    return;
                                }
                            }
                            node = node.parentNode;
                        }
                    }
                    listButton.classList.remove('active');
                } catch (e) {
                    try {
                        if (document.queryCommandState('insertUnorderedList')) {
                            listButton.classList.add('active');
                        } else {
                            listButton.classList.remove('active');
                        }
                    } catch (e2) {
                        listButton.classList.remove('active');
                    }
                }
            }
        }

        journalText.addEventListener('input', updateButtonStates);
        journalText.addEventListener('keyup', updateButtonStates);
        journalText.addEventListener('mouseup', updateButtonStates);
        journalText.addEventListener('focus', updateButtonStates);
        journalText.addEventListener('blur', function() {
            toolbarButtons.forEach(button => {
                button.classList.remove('active');
            });
            if (listButton) {
                listButton.classList.remove('active');
            }
        });
        
        document.addEventListener('selectionchange', function() {
            if (isSelectionInEditor() || document.activeElement === journalText) {
                updateButtonStates();
            } else {
                toolbarButtons.forEach(button => {
                    button.classList.remove('active');
                });
                if (listButton) {
                    listButton.classList.remove('active');
                }
            }
        });

        toolbarButtons.forEach(button => {
            const command = button.getAttribute('data-command');
            
            if (command === 'insertUnorderedList') {
                return;
            }
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const cmd = this.getAttribute('data-command');
                
                if (!cmd) return;
                
                journalText.focus();
                
                try {
                    document.execCommand(cmd, false, null);
                } catch (e) {
                    console.error('Command failed:', cmd, e);
                }
                
                setTimeout(updateButtonStates, 10);
            });
        });

        if (listButton) {
            listButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                journalText.focus();
                
                try {
                    document.execCommand('insertUnorderedList', false, null);
                } catch (e) {
                    console.error('List command failed:', e);
                }
                
                setTimeout(updateButtonStates, 10);
            });
        }
    }
});
