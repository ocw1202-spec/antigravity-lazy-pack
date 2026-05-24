// Firebase Configuration for the "Reading and Thinking" App in "reading11504"
const firebaseConfig = {
  projectId: "reading11504",
  appId: "1:69978687596:web:8e211bf057d254746cb049",
  storageBucket: "reading11504.firebasestorage.app",
  apiKey: "AIzaSyBHsKFBACPwTIoevm30qOurWdcEaZsufG4",
  authDomain: "reading11504.firebaseapp.com",
  messagingSenderId: "69978687596",
  projectNumber: "69978687596"
};

// Initialize Firebase & Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const collectionName = "wordcloud_inputs";

// DOM Elements
const wordForm = document.getElementById("word-form");
const wordInput = document.getElementById("word-input");
const charCount = document.getElementById("char-count");
const totalWordsEl = document.getElementById("total-words");
const uniqueWordsEl = document.getElementById("unique-words");
const btnReset = document.getElementById("btn-reset");
const btnRefresh = document.getElementById("btn-refresh");
const btnDownload = document.getElementById("btn-download");
const canvas = document.getElementById("wordcloud-canvas");
const canvasOverlay = document.getElementById("canvas-overlay");
const overlayText = document.getElementById("overlay-text");

// Local State
let wordsData = [];
let redrawTimeout = null;

// Character count listener
wordInput.addEventListener("input", (e) => {
  charCount.textContent = e.target.value.length;
});

// Setup Canvas Sizing
function resizeCanvas() {
  const container = canvas.parentElement;
  // Account for padding
  const padding = 24 * 2;
  const width = container.clientWidth - padding;
  const height = container.clientHeight - padding;
  
  // Set canvas coordinate system to match physical screen size (supports Retina)
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
}

// Format and Draw Word Cloud
function drawWordCloud() {
  if (wordsData.length === 0) {
    showOverlay("目前無文字資料，請在左側輸入文字！", false);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  
  hideOverlay();
  
  // Aggregate frequencies
  const frequencies = {};
  wordsData.forEach(item => {
    const word = item.word.trim();
    if (word) {
      frequencies[word] = (frequencies[word] || 0) + 1;
    }
  });
  
  const totalCount = wordsData.length;
  const uniqueCount = Object.keys(frequencies).length;
  
  // Update stats cards
  totalWordsEl.textContent = totalCount;
  uniqueWordsEl.textContent = uniqueCount;
  
  // Convert frequencies map to WordCloud2 format: [ [word, weight], [word, weight], ... ]
  const maxFreq = Math.max(...Object.values(frequencies));
  const list = Object.entries(frequencies).map(([word, freq]) => {
    // Dynamic weight factor scaling based on relative frequency
    const weight = Math.round((freq / maxFreq) * 45) + 15; // Font size scale from 15px to 60px
    return [word, weight];
  });
  
  // Sort descending by weight so larger words are drawn first
  list.sort((a, b) => b[1] - a[1]);
  
  // Render Word Cloud
  try {
    const width = parseFloat(canvas.style.width);
    const height = parseFloat(canvas.style.height);
    
    WordCloud(canvas, {
      list: list,
      gridSize: Math.round(16 * (width / 1024)) + 4, // Grid resolution relative to viewport
      weightFactor: 1, // Already scaled in our list building
      fontFamily: "'Outfit', 'Inter', 'Noto Sans TC', sans-serif",
      fontWeight: '600',
      color: function () {
        // High-premium futuristic neon color scheme (purple, cyan, teal, pink, white)
        const colors = ['#a855f7', '#06b6d4', '#ec4899', '#22c55e', '#3b82f6', '#ffffff', '#e9d5ff', '#cffafe'];
        return colors[Math.floor(Math.random() * colors.length)];
      },
      rotateRatio: 0.35, // Comical 35% probability of drawing vertically
      rotationSteps: 2, // 0 and 90 degrees only
      backgroundColor: 'transparent',
      drawOutOfBound: false, // Ensure words stay within the canvas frame
      shrinkToFit: true,
      minSize: 12
    });
  } catch (error) {
    console.error("Error drawing word cloud:", error);
  }
}

// Overlay Handling
function showOverlay(message, showSpinner = true) {
  canvasOverlay.style.opacity = "1";
  canvasOverlay.style.pointerEvents = "all";
  overlayText.textContent = message;
  
  const spinner = canvasOverlay.querySelector(".spinner");
  if (showSpinner) {
    spinner.style.display = "block";
  } else {
    spinner.style.display = "none";
  }
}

function hideOverlay() {
  canvasOverlay.style.opacity = "0";
  canvasOverlay.style.pointerEvents = "none";
}

// Listen to Firestore real-time updates
showOverlay("正在連線至雲端資料庫...");
db.collection(collectionName)
  .orderBy("timestamp", "desc")
  .onSnapshot((snapshot) => {
    wordsData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.word) {
        wordsData.push({ id: doc.id, ...data });
      }
    });
    
    // Draw immediately
    resizeCanvas();
    drawWordCloud();
  }, (error) => {
    console.error("Firestore Listen error:", error);
    showOverlay("讀取資料失敗，請確認資料庫權限或網路連線！", false);
  });

// Handle word submission
wordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const word = wordInput.value.trim();
  if (!word) return;
  
  const submitBtn = wordForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  wordInput.disabled = true;
  
  try {
    await db.collection(collectionName).add({
      word: word,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Reset Form
    wordInput.value = "";
    charCount.textContent = "0";
  } catch (error) {
    console.error("Error writing to Firestore:", error);
    alert("送出失敗！請稍後再試！");
  } finally {
    submitBtn.disabled = false;
    wordInput.disabled = false;
    wordInput.focus();
  }
});

// Admin Button: Reset Database (Wipe All Words)
btnReset.addEventListener("click", async () => {
  if (!confirm("⚠️ 確定要清除資料庫中的所有文字嗎？這將會重置整片文字雲！此動作無法復原！")) {
    return;
  }
  
  showOverlay("正在清除雲端資料庫...");
  
  try {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error clearing database:", error);
    alert("清除失敗！請檢查權限設定！");
    hideOverlay();
  }
});

// Refresh Canvas Manual Redraw
btnRefresh.addEventListener("click", () => {
  resizeCanvas();
  drawWordCloud();
});

// Download Word Cloud Canvas as Image
btnDownload.addEventListener("click", () => {
  if (wordsData.length === 0) {
    alert("目前沒有文字，無法下載畫圖！");
    return;
  }
  
  // Build a temporary canvas to draw background for the image download
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");
  
  // Fill background matching website theme
  tempCtx.fillStyle = "#060410";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
  // Draw the current word cloud canvas content onto the temporary canvas
  tempCtx.drawImage(canvas, 0, 0);
  
  // Trigger download
  const link = document.createElement("a");
  link.download = `即時文字雲-${new Date().toISOString().slice(0,10)}.png`;
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
});

// Handle window resizing (debounced to avoid layout lags)
window.addEventListener("resize", () => {
  clearTimeout(redrawTimeout);
  redrawTimeout = setTimeout(() => {
    resizeCanvas();
    drawWordCloud();
  }, 300);
});
