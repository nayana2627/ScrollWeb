document.addEventListener('DOMContentLoaded', () => {
    const backgroundImages = [
        'backgrounds/IMG_9193.PNG',
        'backgrounds/IMG_9194.PNG',
        'backgrounds/IMG_9195.PNG',
        'backgrounds/IMG_9196.PNG',
    ];

    const walkingFrames = Array.from({ length: 24 }, (_, i) => 
        `walking-frames/Layer_${i.toString().padStart(4, '0')}.png`
    );

    const cyclesPerMaxPosition = 2;

    const elements = {
        background: document.getElementById('background'),
        walker: document.getElementById('walker'),
        hotspot: document.getElementById('hotspot'),
        modal: document.getElementById('modal'),
        modalImage: document.getElementById('modal-image'),
        modalClose: document.getElementById('modal-close'),
        modalPrev: document.getElementById('modal-prev'),
        modalNext: document.getElementById('modal-next')
    };

    let currentState = {
        frame: 0,
        position: 0,
        currentPanel: 1,
        totalPanels: 6,
        totalWidth: 8000,
        viewportWidth: window.innerWidth,
        maxPosition: 8000 - window.innerWidth,
        isZoomed: false
    };

    backgroundImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        elements.background.appendChild(img);
    });

    function updateWalk(position) {
        position = Math.max(0, Math.min(position, currentState.maxPosition));
        elements.background.style.transform = `translateX(-${position}px)`;
        currentState.frame = Math.floor((position / currentState.maxPosition) * cyclesPerMaxPosition * 24) % 24;
        elements.walker.src = walkingFrames[currentState.frame];
        elements.hotspot.classList.toggle('active', 
            Math.floor(position / currentState.viewportWidth) === 1
        );
    }

    function showPanel(panelNumber) {
        currentState.currentPanel = panelNumber;
        elements.modalImage.src = `assets/${panelNumber}.png`;
        elements.modal.classList.add('visible');
        elements.modalPrev.style.display = panelNumber > 1 ? 'block' : 'none';
        elements.modalNext.style.display = panelNumber < currentState.totalPanels ? 'block' : 'none';
    }

    elements.hotspot.addEventListener('click', function() {
        if(!currentState.isZoomed) {
            this.classList.add('zoomed');
            currentState.isZoomed = true;
        } else {
            this.classList.remove('zoomed');
            showPanel(1);
            currentState.isZoomed = false;
        }
    });

    elements.modalNext.addEventListener('click', (e) => {
        e.preventDefault();
        if(currentState.currentPanel < currentState.totalPanels) showPanel(currentState.currentPanel + 1);
    });

    elements.modalPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if(currentState.currentPanel > 1) showPanel(currentState.currentPanel - 1);
    });

    elements.modalClose.addEventListener('click', (e) => {
        e.preventDefault();
        elements.hotspot.classList.remove('zoomed');
        currentState.isZoomed = false;
        elements.modal.classList.remove('visible');
    });

    window.addEventListener('wheel', e => {
        e.preventDefault();
        currentState.position += e.deltaY * 2;
        updateWalk(currentState.position);
    }, { passive: false });

    let touchY = 0;
    window.addEventListener('touchstart', e => 
        touchY = e.touches[0].clientY
    );
    window.addEventListener('touchmove', e => {
        e.preventDefault();
        const delta = e.touches[0].clientY - touchY;
        currentState.position += delta * 2;
        updateWalk(currentState.position);
        touchY = e.touches[0].clientY;
    }, { passive: false });

    updateWalk(0);
});