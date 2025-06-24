document.addEventListener('DOMContentLoaded', function() {
    const reactionButtons = document.querySelectorAll('#reactionsButton');

    reactionButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            event.preventDefault();
            
            const card = this.closest('.widget__card');
            const counter = card.querySelector('.reactions__counter p');
            const currentCount = parseInt(counter.textContent);

            // Оптимистичное обновление (счетчик меняется ДО запроса)
            counter.textContent = currentCount + 1;

            try {
                // Отправка данных на сервер
                const response = await fetch('https://ваш-бэкенд.ру/api/like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        currentCount: currentCount
                    }),
                });

                if (!response.ok) {
                    throw new Error('Сервер вернул ошибку');
                }

                // Если сервер возвращает актуальный счетчик (опционально)
                const data = await response.json();
                counter.textContent = data.newCount;

            } catch (error) {
                // Откат при ошибке
                counter.textContent = currentCount;
                console.error('Ошибка:', error);
                alert('Не удалось отправить реакцию. Проверьте подключение.');
            }
        });
    });
});