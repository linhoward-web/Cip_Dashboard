// 登入處理 - 更新決策管理層名稱
function handleLogin(name, initial, role, silent = false) {
    AppState.currentUser = { name, initial, role };
    AppState.userRole = role;
    AppState.isLoggedIn = true;
    
    // 更新界面
    document.getElementById('authLayer').classList.add('hidden-overlay');
    document.getElementById('mainDashboard').classList.remove('blurred');
    
    // 更新右上角使用者名稱
    document.getElementById('displayUserName').innerText = name;
    document.getElementById('dropdownUserName').innerText = name;
    document.getElementById('dropdownUserRole').innerText = role === 'staff' ? '一般業務專員' : '決策管理層';
    
    // 更新側邊欄使用者資訊
    document.getElementById('sidebarUserName').innerText = name;
    document.getElementById('sidebarUserRole').innerText = role === 'staff' ? '一般業務專員' : '決策管理層';
    document.getElementById('sidebarAvatar').innerHTML = `<span class="text-sm font-bold">${initial}</span>`;
    
    // 更新頭像
    const avatarCircle = document.getElementById('avatarCircle');
    avatarCircle.innerHTML = `<span class="text-sm font-bold text-blue-900">${initial}</span>`;
    avatarCircle.classList.add('bg-blue-50', 'border-blue-200');
    
    // 啟用 AI 按鈕
    const aiBtn = document.getElementById('aiToggleButton');
    aiBtn.classList.remove('disabled');
    
    // 更新 AI 狀態
    document.getElementById('aiStatusLabel').innerText = role === 'staff' ? '一般專員模式' : '決策層模式';
    
    // 儲存使用者資料
    localStorage.setItem('cip_current_user', JSON.stringify({ name, initial, role }));
    
    // 加入歡迎訊息
    if (!silent) {
        setTimeout(() => {
            addMessage('ai', `歡迎${role === 'staff' ? '專員' : '處長'} ${name}！智慧助手已就緒，隨時為您提供協助。`);
        }, 500);
    }
}