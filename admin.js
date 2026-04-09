// Admin Logic for Jagdeesh Refrigeration
let currentPin = '';

function checkPin() {
    const pin = document.getElementById('pinInput').value;
    if (pin === '1234') {
        currentPin = pin;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('uploadScreen').style.display = 'block';
        loadAdminGallery();
    } else {
        alert('Invalid Secret ID. Please try again.');
    }
}

function logout() {
    currentPin = '';
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('uploadScreen').style.display = 'none';
}

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = document.getElementById('fileInput').files[0];
    const caption = document.getElementById('captionInput').value;
    const status = document.getElementById('statusMessage');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');

    if (!file) return alert('Select a file first!');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('pin', currentPin); // Uses 'pin' for backend compatibility

    status.innerText = 'Uploading...';
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.success) {
            status.innerText = 'Successfully Added to Website!';
            progressBar.style.width = '100%';
            document.getElementById('uploadForm').reset();
            loadAdminGallery(); // Refresh management list
            setTimeout(() => {
                progressContainer.style.display = 'none';
                status.innerText = '';
            }, 3000);
        } else {
            status.innerText = 'Upload Failed: ' + (result.error || 'Unknown Error');
            status.style.color = 'red';
        }
    } catch (err) {
        status.innerText = 'Connection Error: ' + err.message;
        status.style.color = 'red';
    }
});

async function loadAdminGallery() {
    const gallery = document.getElementById('adminGallery');
    try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        gallery.innerHTML = '';
        
        data.forEach(item => {
            const div = document.createElement('div');
            div.style.position = 'relative';
            div.innerHTML = `
                ${item.type === 'video' ? '<i class="fas fa-video"></i>' : `<img src="${item.path}" style="width:100%; height:80px; object-fit:cover; border-radius:10px;">`}
                <button onclick="deleteItem(${item.id})" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px;">X</button>
            `;
            gallery.appendChild(div);
        });
    } catch (err) {
        console.error('Failed to load admin gallery');
    }
}

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this photo/video?')) return;
    
    try {
        const response = await fetch(`/api/gallery/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: currentPin })
        });
        
        const result = await response.json();
        if (result.success) {
            loadAdminGallery();
        } else {
            alert('Delete failed');
        }
    } catch (err) {
        alert('Error deleting item');
    }
}
