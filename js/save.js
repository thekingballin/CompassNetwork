 const loadSaveBtn = document.getElementById('loadSaveBtn');
 const uploadInput = document.getElementById('uploadSave');

function exportLocalStorage() {
  let output = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    const safeKey = key.replace(/"/g, '\\"');
    const safeValue = value.replace(/"/g, '\\"');

    output += `"${safeKey}" = "${safeValue}" `;
  }

  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const filename = `compassnetworksave-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()}-${pad(now.getHours())}${pad(now.getMinutes())}.txt`;

  const blob = new Blob([output.trim()], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
      loadSaveBtn.addEventListener('click', () => {
        uploadInput.click();
      });

      uploadInput.addEventListener('change', () => {
        if (!uploadInput.files.length) return;

        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;

          const regex = /"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"/g;

          let match;
          while ((match = regex.exec(text)) !== null) {
            const key = match[1].replace(/\\"/g, '"');
            const value = match[2].replace(/\\"/g, '"');
            localStorage.setItem(key, value);
          }

          alert("Save loaded!");
          location.reload(); 
        };
        reader.readAsText(uploadInput.files[0]);

        uploadInput.value = '';
      });
