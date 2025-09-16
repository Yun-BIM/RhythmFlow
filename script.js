document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有元素
    const tabButtons = document.querySelectorAll('.tab-button');
    const contentTabs = document.querySelectorAll('.content-tab');
    const musicUpload = document.getElementById('music-upload');
    const analyzeMusicBtn = document.getElementById('analyze-music-btn'); // 新增
    const generateMusicBtn = document.getElementById('generate-music-btn');
    const musicLoading = document.getElementById('music-loading');
    const analysisResultsDiv = document.getElementById('analysis-results'); // 新增
    const analysisContentDiv = document.getElementById('analysis-content'); // 新增
    const musicResultsDiv = document.getElementById('music-results'); // 新增
    const generatedContentDiv = document.getElementById('generated-content'); // 新增

    // Tab 切換邏輯
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            contentTabs.forEach(tab => tab.classList.remove('active'));
            button.classList.add('active');
            const targetTab = document.getElementById(button.dataset.tab + '-tab');
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // 處理「分析音樂結構」按鈕點擊事件
    analyzeMusicBtn.addEventListener('click', async () => {
        const file = musicUpload.files[0];
        if (!file) {
            alert('請先上傳一個音樂檔案！');
            return;
        }

        musicLoading.style.display = 'block';
        analyzeMusicBtn.disabled = true;
        generateMusicBtn.disabled = true;
        analysisResultsDiv.style.display = 'none';
        musicResultsDiv.style.display = 'none';

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Data = reader.result.split(',')[1];
            
            try {
                const workerUrl = 'rhythmflow-api.anna-622.workers.dev/analyze-music'; // 注意路徑
                
                const response = await fetch(workerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ music_file: base64Data })
                });

                if (!response.ok) throw new Error('音樂分析失敗');
                
                const analysisData = await response.json();
                
                analysisContentDiv.innerHTML = `
                    <p><strong>拍速 (BPM)：</strong> ${analysisData.bpm}</p>
                    <p><strong>小節總數：</strong> ${analysisData.bar_count}</p>
                    <p><strong>音樂結構：</strong></p>
                    <ul>
                        ${analysisData.structure.map(s => `<li><strong>${s.label}:</strong> ${s.duration} 秒</li>`).join('')}
                    </ul>
                `;
                analysisResultsDiv.style.display = 'block';

            } catch (error) {
                console.error('API 呼叫失敗:', error);
                alert(`發生錯誤：${error.message}`);
            } finally {
                musicLoading.style.display = 'none';
                analyzeMusicBtn.disabled = false;
                generateMusicBtn.disabled = false;
            }
        };
    });

    // 處理「生成類似旋律」按鈕點擊事件
    generateMusicBtn.addEventListener('click', async () => {
        const file = musicUpload.files[0];
        if (!file) {
            alert('請先上傳一個音樂檔案！');
            return;
        }

        musicLoading.style.display = 'block';
        analyzeMusicBtn.disabled = true;
        generateMusicBtn.disabled = true;
        analysisResultsDiv.style.display = 'none';
        musicResultsDiv.style.display = 'none';

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Data = reader.result.split(',')[1];
            
            try {
                const workerUrl = 'rhythmflow-api.anna-622.workers.dev/generate-music'; // 注意路徑
                
                const response = await fetch(workerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ music_file: base64Data })
                });

                if (!response.ok) throw new Error('音樂生成失敗');
                
                const resultData = await response.json();
                
                generatedContentDiv.innerHTML = '';
                resultData.music_urls.forEach((url, index) => {
                    const audioDiv = document.createElement('div');
                    audioDiv.className = 'audio-result';
                    audioDiv.innerHTML = `
                        <h4>旋律 ${index + 1}</h4>
                        <audio controls src="${url}"></audio>
                        <p>
                            <a href="${url}" download="generated_melody_${index + 1}.mp3">下載檔案</a>
                        </p>
                    `;
                    generatedContentDiv.appendChild(audioDiv);
                });
                musicResultsDiv.style.display = 'block';

            } catch (error) {
                console.error('API 呼叫失敗:', error);
                alert(`發生錯誤：${error.message}`);
            } finally {
                musicLoading.style.display = 'none';
                analyzeMusicBtn.disabled = false;
                generateMusicBtn.disabled = false;
            }
        };
    });

    // 這裡可以繼續放處理虛擬舞蹈按鈕的邏輯
    const danceUpload = document.getElementById('dance-upload');
    const danceStyle = document.getElementById('dance-style');
    const generateDanceBtn = document.getElementById('generate-dance-btn');
    const danceLoading = document.getElementById('dance-loading');
    const danceResultsDiv = document.getElementById('dance-results');

    generateDanceBtn.addEventListener('click', async () => {
        const file = danceUpload.files[0];
        const style = danceStyle.value;
        if (!file) {
            alert('請先上傳一個音樂檔案！');
            return;
        }

        danceLoading.style.display = 'block';
        generateDanceBtn.disabled = true;
        danceResultsDiv.style.display = 'none';

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Data = reader.result.split(',')[1];
            
            try {
                const workerUrl = 'rhythmflow-api.anna-622.workers.dev/generate-dance';
                
                const response = await fetch(workerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ music_file: base64Data, style: style })
                });

                if (!response.ok) throw new Error('舞蹈生成失敗');
                
                const resultData = await response.json();
                
                const danceContentDiv = document.getElementById('dance-content');
                danceContentDiv.innerHTML = `
                    <p>虛擬舞蹈數據已生成！</p>
                    <p>數據 URL: <a href="${resultData.dance_data_url}" target="_blank">下載數據</a></p>
                `;
                danceResultsDiv.style.display = 'block';

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
