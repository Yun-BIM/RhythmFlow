document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有元素
    const tabButtons = document.querySelectorAll('.tab-button');
    const contentTabs = document.querySelectorAll('.content-tab');
    const musicUpload = document.getElementById('music-upload');
    const generateMusicBtn = document.getElementById('generate-music-btn');
    const musicLoading = document.getElementById('music-loading');
    const musicResults = document.getElementById('music-results');

    // Tab 切換邏輯
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按鈕和內容的 active 狀態
            tabButtons.forEach(btn => btn.classList.remove('active'));
            contentTabs.forEach(tab => tab.classList.remove('active'));

            // 為被點擊的按鈕和對應的內容區塊增加 active 狀態
            button.classList.add('active');
            const targetTab = document.getElementById(button.dataset.tab + '-tab');
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // 處理音樂生成按鈕點擊事件
    generateMusicBtn.addEventListener('click', async () => {
        const file = musicUpload.files[0];
        if (!file) {
            alert('請先上傳一個音樂檔案！');
            return;
        }

        musicLoading.style.display = 'block';
        generateMusicBtn.disabled = true;
        musicResults.innerHTML = ''; // 清空先前的結果

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Data = reader.result.split(',')[1];
            
            try {
                // 替換成你的 Cloudflare Worker URL
                const workerUrl = 'YOUR_CLOUDFLARE_WORKER_URL/generate-music';
                
                // 呼叫後端 API
                const response = await fetch(workerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ music_file: base64Data })
                });

                if (!response.ok) throw new Error('音樂生成失敗');
                
                const resultData = await response.json();
                
                // 顯示生成的音樂
                resultData.music_urls.forEach((url, index) => {
                    const audioDiv = document.createElement('div');
                    audioDiv.className = 'audio-result';
                    audioDiv.innerHTML = `
                        <h3>旋律 ${index + 1}</h3>
                        <audio controls src="${url}"></audio>
                        <p>
                            <a href="${url}" download="generated_melody_${index + 1}.mp3">下載檔案</a>
                        </p>
                    `;
                    musicResults.appendChild(audioDiv);
                });

            } catch (error) {
                console.error('API 呼叫失敗:', error);
                alert(`發生錯誤：${error.message}`);
            } finally {
                musicLoading.style.display = 'none';
                generateMusicBtn.disabled = false;
            }
        };
    });

    // 這裡可以加入處理虛擬舞蹈按鈕的事件監聽器，邏輯與音樂類似
    const danceUpload = document.getElementById('dance-upload');
    const danceStyle = document.getElementById('dance-style');
    const generateDanceBtn = document.getElementById('generate-dance-btn');
    const danceLoading = document.getElementById('dance-loading');
    const danceResults = document.getElementById('dance-results');

    generateDanceBtn.addEventListener('click', async () => {
        const file = danceUpload.files[0];
        const style = danceStyle.value;
        if (!file) {
            alert('請先上傳一個音樂檔案！');
            return;
        }

        danceLoading.style.display = 'block';
        generateDanceBtn.disabled = true;
        danceResults.innerHTML = ''; // 清空結果

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Data = reader.result.split(',')[1];
            
            try {
                // 替換成你的 Cloudflare Worker URL
                const workerUrl = 'YOUR_CLOUDFLARE_WORKER_URL/generate-dance';
                
                const response = await fetch(workerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ music_file: base64Data, style: style })
                });

                if (!response.ok) throw new Error('舞蹈生成失敗');
                
                const resultData = await response.json();
                
                // 這裡你需要載入 Three.js 等函式庫來渲染 3D 舞蹈
                const danceDiv = document.createElement('div');
                danceDiv.innerHTML = `
                    <p>虛擬舞蹈數據已生成！</p>
                    <p>數據 URL: <a href="${resultData.dance_data_url}" target="_blank">下載數據</a></p>
                `;
                danceResults.appendChild(danceDiv);

            } catch (error) {
                console.error('API 呼叫失敗:', error);
                alert(`發生錯誤：${error.message}`);
            } finally {
                danceLoading.style.display = 'none';
                generateDanceBtn.disabled = false;
            }
        };
    });
});
