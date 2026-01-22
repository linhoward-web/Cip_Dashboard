// 組件相關功能

// 應用狀態管理
const AppState = {
    currentUser: null,
    chatHistory: [],
    isChatOpen: false,
    isLoggedIn: false,
    userRole: null,
    currentDashboard: 'household',
    settings: {
        theme: 'light',
        language: 'zh-TW',
        notifications: true
    }
};

// 模擬回應資料庫
const MockResponses = {
    staff: [
        "根據系統資料，原住民族總人口數為581,204人。您可以在左側的Power BI報表中查看詳細的人口分布圖。",
        "預算執行率目前為74.2%。如需詳細的執行項目，建議查看預算執行儀表板。",
        "若要申請資料導出權限，請填寫系統內的權限申請表，並由主管審核通過。",
        "系統提供三種報表類型：日報表、週報表和月報表。您可以在導航列中選擇需要的報表格式。"
    ],
    officer: [
        "從戰略角度分析，東部地區的人口增長率值得關注，建議加強相關基礎建設投資。",
        "預算執行率74.2%略低於預期，建議召開跨部門檢討會議，找出執行瓶頸。",
        "根據數據趨勢，明年應優先分配資源至偏鄉地區的教育與醫療服務。",
        "建議建立跨部門數據共享機制，以提升政策制定的整體效率。"
    ],
    common: [
        "這是一個模擬回應。在連線真實API後，我將能提供更精確的數據分析。",
        "目前處於離線演示模式，但基本功能都可以正常運作。",
        "您可以嘗試點擊下方的快速按鈕來快速提問。"
    ]
};

// 側邊欄控制
function toggleNav() {
    document.getElementById('sideNav').classList.toggle('open');
    document.getElementById('navOverlay').classList.toggle('show');
}

// 切換儀表板
function switchDashboard(dashboardType) {
    AppState.currentDashboard = dashboardType;
    
    // 更新側邊欄活動狀態
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 隱藏所有儀表板
    document.getElementById('householdDashboard').style.display = 'none';
    document.getElementById('budgetDashboard').style.display = 'none';
    document.getElementById('subsidyDashboard').style.display = 'none';
    
    // 顯示選中的儀表板
    if (dashboardType === 'household') {
        document.querySelector('.nav-item:nth-child(1)').classList.add('active');
        document.getElementById('householdDashboard').style.display = 'block';
        document.querySelector('.dashboard-title').innerText = '原住民族委員會戶役政儀表板';
    } else if (dashboardType === 'budget') {
        document.querySelector('.nav-item:nth-child(2)').classList.add('active');
        document.getElementById('budgetDashboard').style.display = 'flex';
        document.querySelector('.dashboard-title').innerText = '原住民族委員會預算執行儀表板';
    } else if (dashboardType === 'subsidy') {
        document.querySelector('.nav-item:nth-child(3)').classList.add('active');
        document.getElementById('subsidyDashboard').style.display = 'flex';
        document.querySelector('.dashboard-title').innerText = '原住民族委員會獎補助儀表板';
    }
    
    // 更新卡片數據（這裡可以連動PBI）
    updateMetricsForDashboard(dashboardType);
    
    // 關閉側邊欄（如果開啟的話）
    if (window.innerWidth < 1024) {
        toggleNav();
    }
}

// 更新關鍵指標卡片
function updateMetricsForDashboard(dashboardType) {
    // 這裡可以根據不同的儀表板更新卡片數據
    // 目前是靜態數據，未來可以從PBI或API獲取
    switch(dashboardType) {
        case 'household':
            // 戶役政相關指標
            document.querySelector('.metric-card:nth-child(1) .metric-value').innerText = '581,204';
            document.querySelector('.metric-card:nth-child(2) .metric-value').innerText = '74.2%';
            break;
        case 'budget':
            // 預算執行相關指標
            document.querySelector('.metric-card:nth-child(1) .metric-value').innerText = 'NT$ 2.34B';
            document.querySelector('.metric-card:nth-child(2) .metric-value').innerText = '81.5%';
            break;
        case 'subsidy':
            // 獎補助相關指標
            document.querySelector('.metric-card:nth-child(1) .metric-value').innerText = '12,847';
            document.querySelector('.metric-card:nth-child(2) .metric-value').innerText = 'NT$ 456M';
            break;
    }
}

// 設定功能
function openSettings() {
    document.getElementById('settingsModal').classList.add('show');
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('show');
    setTimeout(() => {
        document.getElementById('settingsModal').style.display = 'none';
    }, 300);
}

function saveSettings() {
    // 這裡可以保存設定到localStorage
    const theme = document.querySelector('.setting-input[type="select"]').value;
    const language = document.querySelector('.setting-input[type="select"]:nth-child(2)').value;
    const notifications = document.querySelector('.setting-input[type="checkbox"]').checked;
    
    AppState.settings = { theme, language, notifications };
    localStorage.setItem('cip_settings', JSON.stringify(AppState.settings));
    
    showNotification('設定已儲存', 'success');
    closeSettings();
}

// 載入設定
function loadSettings() {
    const savedSettings = localStorage.getItem('cip_settings');
    if (savedSettings) {
        AppState.settings = JSON.parse(savedSettings);
        // 更新設定表單
        document.querySelector('.setting-input[type="select"]').value = AppState.settings.theme;
        document.querySelector('.setting-input[type="select"]:nth-child(2)').value = AppState.settings.language;
        document.querySelector('.setting-input[type="checkbox"]').checked = AppState.settings.notifications;
    }
}

// 聊天功能
function toggleChat() {
    if (!AppState.isLoggedIn) {
        showNotification('請先登入系統以使用 AI 助手', 'error');
        return;
    }
    
    const chatBox = document.getElementById('chatBox');
    const isActive = chatBox.classList.toggle('active');
    AppState.isChatOpen = isActive;
    
    if (isActive) {
        document.getElementById('chatInput').focus();
        scrollToChatBottom();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    if (!AppState.isLoggedIn) {
        showNotification('請先登入系統以使用 AI 助手', 'error');
        return;
    }
    
    // 加入使用者訊息
    addMessage('user', text);
    input.value = '';
    
    // 顯示載入中
    const loader = document.getElementById('chatLoading');
    loader.classList.add('show');
    scrollToChatBottom();
    
    // 模擬 AI 回應（延遲 1-2 秒）
    const delay = 1000 + Math.random() * 1000;
    
    setTimeout(() => {
        loader.classList.remove('show');
        
        // 根據使用者角色選擇回應
        let responsePool = [];
        if (AppState.userRole === 'staff') {
            responsePool = [...MockResponses.staff, ...MockResponses.common];
        } else if (AppState.userRole === 'officer') {
            responsePool = [...MockResponses.officer, ...MockResponses.common];
        }
        
        // 隨機選擇一個回應
        const randomResponse = getRandomElement(responsePool);
        
        // 加入 AI 回應
        addMessage('ai', randomResponse);
        
        // 儲存到歷史記錄
        saveToHistory(text, randomResponse);
        
    }, delay);
}

function quickAsk(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

function addMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    if (sender === 'user') {
        messageDiv.className = 'chat-message message-user';
        messageDiv.innerHTML = `
            <div class="flex flex-col">
                <p class="text-white">${text}</p>
                <span class="text-xs opacity-75 mt-1 self-end">${AppState.currentUser?.name || '您'}</span>
            </div>
        `;
    } else if (sender === 'ai') {
        messageDiv.className = 'chat-message message-ai';
        messageDiv.innerHTML = `
            <div class="flex flex-col">
                <p class="text-gray-700">${text}</p>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500">AI 助理</span>
                    <button onclick="copyToClipboard('${text.replace(/'/g, "\\'")}')" class="text-xs text-blue-600 hover:text-blue-800">
                        <i class="far fa-copy mr-1"></i>複製
                    </button>
                </div>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    scrollToChatBottom();
}

function saveToHistory(userMessage, aiMessage) {
    AppState.chatHistory.push({
        user: userMessage,
        ai: aiMessage,
        timestamp: new Date().toISOString(),
        role: AppState.userRole
    });
    
    // 只保留最近的50條記錄
    if (AppState.chatHistory.length > 50) {
        AppState.chatHistory = AppState.chatHistory.slice(-50);
    }
    
    localStorage.setItem('cip_chat_history', JSON.stringify(AppState.chatHistory));
}

function renderChatHistory() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    if (AppState.chatHistory.length === 0) {
        addMessage('ai', '您好！我是原民會智慧助理。登入後，我可以協助您分析報表趨勢、查詢人口統計或解釋政策指標。請問有什麼我可以幫您的嗎？');
        return;
    }
    
    AppState.chatHistory.forEach(item => {
        addMessage('user', item.user);
        addMessage('ai', item.ai);
    });
}

// 清除聊天記錄（移到設定或其他地方）
function clearChatHistory() {
    if (!AppState.isLoggedIn) {
        showNotification('請先登入系統', 'error');
        return;
    }
    
    if (confirm('確定要清除所有聊天記錄嗎？此操作無法復原。')) {
        AppState.chatHistory = [];
        localStorage.removeItem('cip_chat_history');
        document.getElementById('chatMessages').innerHTML = '';
        
        // 加入系統訊息
        addMessage('ai', '對話記錄已清除。請問有什麼可以協助您的嗎？');
        
        showNotification('聊天記錄已清除', 'success');
    }
}