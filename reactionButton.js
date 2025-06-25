document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#reactionsButton').forEach(button => {
        const card = button.closest('.widget__card');
        const cardId = card.dataset.cardId || `card_${Date.now()}`;
        const svgPath = button.querySelector('.reaction-icon');
        const counter = card.querySelector('.reactions__counter p');

        // Восстановление состояния
        if (localStorage.getItem(`welcome_${cardId}`)) {
            button.disabled = true;
            button.classList.add('reactions__logo--disabled'); 
            svgPath.style.fill = '#006FAC';
        }

        button.addEventListener('click', async (event) => {
            event.preventDefault();
            if (button.disabled) return;

            // Оптимистичное обновление
            button.disabled = true;
            button.classList.add('reactions__logo--disabled'); 
            svgPath.style.fill = '#006FAC';
            const currentCount = parseInt(counter.textContent);
            counter.textContent = currentCount + 1;

            try {
                const response = await fetch('/api/welcome', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cardId })
                });

                if (!response.ok) throw new Error();
                localStorage.setItem(`welcome_${cardId}`, 'true');
            } catch (error) {
                button.disabled = false;
                button.classList.remove('reactions__logo--disabled'); 
                svgPath.style.fill = '';
                counter.textContent = currentCount;
            }
        });
    });
});