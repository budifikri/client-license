const { exec } = require('child_process');
const os = require('os');

const REG_PATH = 'HKCU\\SOFTWARE\\Fikrisoftware_LICENSE';

exec(`reg delete "${REG_PATH}" /f`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Gagal menghapus key:\n${error.message}`);
    return;
  }
  console.log(`✅ Key berhasil dihapus:\n${stdout}`);
});

// Ambil data sistem
const data = {
  'Nama Komputer': os.hostname(),
  'User': os.userInfo().username,
  'Platform': os.platform(),
  'Arsitektur': os.arch(),
  'CPU': os.cpus()[0].model,
  'Memory': Math.round(os.totalmem() / 1024 / 1024).toString()+' MB'
};


// Fungsi untuk menulis satu value ke registry
function writeToRegistry(key, value) {
  const command = `reg add "${REG_PATH}" /v "${key}" /t REG_SZ /d "${value}" /f`;
  exec(command, (err) => {
    if (err) {
      console.error(`❌ Gagal menulis "${key}": ${err.message}`);
    } else {
      console.log(`✅ ${key} berhasil disimpan: ${value}`);
    }
  });
}

// Loop semua key-value dan tulis ke registry
for (const [key, value] of Object.entries(data)) {
  writeToRegistry(key, value);
}

exec(`reg query "${REG_PATH}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Gagal membaca registry:\n${error.message}`);
    return;
  }

  console.log('🪟 Output mentah reg query:');
  console.log(stdout);

  const lines = stdout.split('\n').filter(line => line.trim() !== '');
  const values = {};

  lines.forEach(line => {
    console.log('▶️ Baris:', line); // debug
    const parts = line.trim().split(/\s{2,}/); // <- ini penting

    if (parts.length >= 3 && parts[1] === 'REG_SZ') {
      const key = parts[0];
      const value = parts.slice(2).join(' ');
      values[key] = value;
      console.log('✅ Cocok:', key, '=', value);
    } else {
      console.log('❌ Tidak cocok:', line);
    }
  });

  console.log('📦 Hasil Registry (parsed):');
  console.log(JSON.stringify(values, null, 2));
  console.log('🧠 Hostname:', os.hostname());
console.log('👤 Username:', os.userInfo().username);
console.log('🖥️ Platform:', os.platform());
console.log('💻 Architecture:', os.arch());
console.log('🧱 CPU:', os.cpus()[0].model);
console.log('🗂️ Total Memory (MB):', Math.round(os.totalmem() / 1024 / 1024),' MB');

});
