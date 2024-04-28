document.addEventListener('DOMContentLoaded', function() {
    const stickers = document.querySelectorAll('.sticker');

    // Load saved stickers
    loadSelectedStickers();

    // Toggle selection on click and save changes
    stickers.forEach(sticker => {
        sticker.addEventListener('click', () => {
            sticker.classList.toggle('selected');
            saveSelectedStickers();
        });
    });
    
//POPUP
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('closePopup');

    // Check if popup has been shown before
    const hasPopupBeenShown = localStorage.getItem('popupShown');

    // If popup has not been shown, display it
    if (!hasPopupBeenShown) {
        popup.style.display = 'block';
        localStorage.setItem('popupShown', true);
    }

    // Close popup when close button is clicked
    closePopupBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Function to generate PDF of missing stickers
    window.generatePDF = function() {
        const jsPDF = window.jspdf.jsPDF;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
    
        // Change the font size here
        const fontSize = 7; // Set the font size to 6 points
    
        // Change the line spacing here
        const lineSpacing = 1; // Set the line spacing to 1 point
    
        const unselectedStickers = Array.from(stickers).filter(sticker => !sticker.classList.contains('selected'));
        const groupedStickers = unselectedStickers.reduce((acc, sticker) => {
            const countryCode = sticker.dataset.value.substring(0, 3);
            if (!acc[countryCode]) acc[countryCode] = [];
            acc[countryCode].push(sticker.dataset.value);
            return acc;
        }, {});
    
        let yPos = 10;
    
        for (const [country, stickers] of Object.entries(groupedStickers)) {
            // Set the font size before adding text
            doc.setFontSize(fontSize);
    
            let text = `${country}: ${stickers.join(', ')}`;
            let textWidth = doc.getTextWidth(text);
    
            if (textWidth > pageWidth - 20) {
                const words = stickers.join(', ').split(', ');
                let line = `${country}: `;
                words.forEach(word => {
                    let tempLine = line + word + ', ';
                    if (doc.getTextWidth(tempLine) < pageWidth - 20) {
                        line = tempLine;
                    } else {
                        doc.text(line, 10, yPos);
                        yPos += (fontSize / 2 + lineSpacing); // Adjust the line spacing here
                        line = word + ', ';
                    }
                });
                if (line) {
                    doc.text(line, 10, yPos);
                    yPos += (fontSize / 2 + lineSpacing); // Adjust the line spacing here
                }
            } else {
                doc.text(text, 10, yPos);
                yPos += (fontSize / 2 + lineSpacing); // Adjust the line spacing here
            }
        }
        doc.save('missing-stickers.pdf');
    };
    
    
    

    // Function to toggle visibility of elements
    window.toggleVisibility = function(id) {
        var content = document.getElementById(id);
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'flex'; // Change here to 'flex'
        } else {
            content.style.display = 'none';
        }
    };
});

function saveSelectedStickers() {
    const selectedStickers = [];
    document.querySelectorAll('.sticker.selected').forEach(sticker => {
        selectedStickers.push(sticker.dataset.value);
    });
    localStorage.setItem('selectedStickers', JSON.stringify(selectedStickers));
}

function loadSelectedStickers() {
    const savedStickers = JSON.parse(localStorage.getItem('selectedStickers'));
    document.querySelectorAll('.sticker').forEach(sticker => {
        if (savedStickers.includes(sticker.dataset.value)) {
            sticker.classList.add('selected');
        }
    });
}


