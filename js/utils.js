// 工具函數

/**
 * 顯示通知
 * @param {string} message - 通知訊息
 * @param {string} type - 通知類型: 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    // 移除現有的通知
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `notification-toast fixed top-6 right-6 ${colors[type]} text-white px-4 py-3 rounded-xl shadow-2xl z-[1100] animate-slide-in-right flex items-center gap-3`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span class="text-sm font-medium">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // 3秒後自動移除
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-x-full', 'transition-all', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 滾動到聊天區域底部
 */
function scrollToChatBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

/**
 * 複製文字到剪貼簿
 * @param {string} text - 要複製的文字
 */
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('已複製到剪貼簿', 'success');
}

/**
 * 格式化數字（添加千分位分隔符）
 * @param {number} num - 要格式化的數字
 * @returns {string} 格式化後的字串
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 延遲函數
 * @param {number} ms - 延遲毫秒數
 * @returns {Promise} Promise物件
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 隨機選擇陣列中的一個元素
 * @param {Array} array - 輸入陣列
 * @returns {any} 隨機元素
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 添加動畫樣式到head
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out;
    }
`;
document.head.appendChild(animationStyle);