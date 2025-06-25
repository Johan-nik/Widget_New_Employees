document.addEventListener('DOMContentLoaded', function() {
    const reactionButtons = document.querySelectorAll('#reactionsButton');

    reactionButtons.forEach(button => {
        const card = button.closest('.widget__card');
        const cardId = card.dataset.cardId || 'card_' + Date.now();
        card.dataset.cardId = cardId;
        
        const svgPath = button.querySelector('.reaction-icon');
        const counter = card.querySelector('.reactions__counter p');
        
        // Восстановление состояния из localStorage
        if (localStorage.getItem(`welcome_${cardId}`) === 'true') {
            button.disabled = true;
            svgPath.style.fill = '#006FAC';
        }

        button.addEventListener('click', async function(event) {
            event.preventDefault();
            if (button.disabled) return;

            button.disabled = true;
            svgPath.style.fill = '#006FAC';
            const currentCount = parseInt(counter.textContent);
            counter.textContent = currentCount + 1;

            try {
                const response = await fetch('/api/welcome', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        cardId: cardId,
                        action: 'welcome'
                    }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка сервера');
                }

                // Сохраняем факт приветствия
                localStorage.setItem(`welcome_${cardId}`, 'true');

            } catch (error) {
                // Откатываем изменения при ошибке
                button.disabled = false;
                svgPath.style.fill = '';
                counter.textContent = currentCount;
                console.error('Ошибка при отправке:', error);
            }
        });
    });
});