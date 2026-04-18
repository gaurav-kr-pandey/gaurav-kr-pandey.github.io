document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('terminalTime');
    const logsDisplay = document.getElementById('terminalLogs');
    const terminalFooter = document.getElementById('terminalFooter');
    
    if (!timeDisplay || !logsDisplay || !terminalFooter) return;

    // Update Terminal Time
    function updateTerminalTime() {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        timeDisplay.textContent = formatter.format(now);
    }
    
    setInterval(updateTerminalTime, 1000);
    updateTerminalTime();

    // Fake Shell Boot Sequence
    const bootSequence = [
        "Initializing core systems...",
        "Loading architecture blueprints...",
        "Connecting to distributed nodes...",
        "Verifying system integrity...",
        "System ready. Awaiting command."
    ];

    let isBooting = false;

    terminalFooter.addEventListener('mouseenter', async () => {
        if (isBooting) return;
        isBooting = true;
        
        logsDisplay.innerHTML = '';
        
        for (let i = 0; i < bootSequence.length; i++) {
            const line = document.createElement('div');
            line.className = 'log-line';
            line.textContent = `> ${bootSequence[i]}`;
            logsDisplay.appendChild(line);
            
            // Random delay between 100ms and 300ms
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        }
        
        setTimeout(() => {
            isBooting = false;
        }, 5000); // Allow re-boot after 5 seconds
    });
    
    // Initial state
    logsDisplay.innerHTML = '<div class="log-line">> System ready. Hover to initialize diagnostics.</div>';
});
