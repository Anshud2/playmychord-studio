const App = {
  apiBase: '/api',
  token: localStorage.getItem('hf_token') || '',

  init() {
    this.bindEvents();
    this.loadToken();
  },

  bindEvents() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    document.getElementById('generate-btn').addEventListener('click', () => this.generate());
    document.getElementById('custom-generate-btn').addEventListener('click', () => this.customGenerate());
    document.getElementById('lyrics-btn').addEventListener('click', () => this.generateLyrics());
    document.getElementById('library-btn').addEventListener('click', () => this.getLibrary());
    document.getElementById('save-cookie-btn').addEventListener('click', () => this.saveToken());
    document.getElementById('test-cookie-btn').addEventListener('click', () => this.testToken());
    document.getElementById('get-limit-btn').addEventListener('click', () => this.getLimit());
  },

  switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));

    const navBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (navBtn) navBtn.classList.add('active');

    const mobileBtn = document.querySelector(`.mobile-nav-item[data-tab="${tabId}"]`);
    if (mobileBtn) mobileBtn.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    const tab = document.getElementById(`tab-${tabId}`);
    if (tab) tab.classList.add('active');
  },

  async generate() {
    const prompt = document.getElementById('prompt-input').value;
    const instrumental = document.getElementById('instrumental-check').checked;

    if (!prompt) {
      alert('Digite uma descrição!');
      return;
    }

    this.showLoading('generate-result', 'Gerando música com Hugging Face...');

    try {
      const response = await fetch(`${this.apiBase}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hf-token': this.token
        },
        body: JSON.stringify({
          prompt,
          make_instrumental: instrumental,
          wait_audio: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar');
      }

      this.displayResult('generate-result', data);
    } catch (error) {
      this.showError('generate-result', error.message);
    }
  },

  async customGenerate() {
    const title = document.getElementById('custom-title').value;
    const tags = document.getElementById('custom-tags').value;
    const lyrics = document.getElementById('custom-lyrics').value;

    if (!title || !lyrics) {
      alert('Preencha título e letras!');
      return;
    }

    this.showLoading('custom-result', 'Gerando música custom...');

    try {
      const response = await fetch(`${this.apiBase}/custom_generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hf-token': this.token
        },
        body: JSON.stringify({
          title,
          tags,
          lyrics,
          make_instrumental: false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar');
      }

      this.displayResult('custom-result', data);
    } catch (error) {
      this.showError('custom-result', error.message);
    }
  },

  async generateLyrics() {
    const prompt = document.getElementById('lyrics-prompt').value;

    if (!prompt) {
      alert('Digite uma descrição!');
      return;
    }

    this.showLoading('lyrics-result', 'Gerando letras...');

    try {
      const response = await fetch(`${this.apiBase}/generate_lyrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hf-token': this.token
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar');
      }

      this.displayResult('lyrics-result', data);
    } catch (error) {
      this.showError('lyrics-result', error.message);
    }
  },

  async getLibrary() {
    const ids = document.getElementById('music-ids').value;
    this.showLoading('library-result', 'Buscando músicas...');

    try {
      let url = `${this.apiBase}/get`;
      if (ids) url += `?ids=${encodeURIComponent(ids)}`;

      const response = await fetch(url, {
        headers: { 'x-hf-token': this.token }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar');
      }

      this.displayResult('library-result', data);
    } catch (error) {
      this.showError('library-result', error.message);
    }
  },

  saveToken() {
    const token = document.getElementById('cookie-input').value;

    if (!token) {
      alert('Cole o token!');
      return;
    }

    localStorage.setItem('hf_token', token);
    this.token = token;
    document.getElementById('settings-result').textContent = '✅ Token salvo!';
  },

  async testToken() {
    this.showLoading('settings-result', 'Testando token...');

    try {
      const response = await fetch(`${this.apiBase}/test-cookie`, {
        headers: { 'x-hf-token': this.token }
      });

      const data = await response.json();
      this.displayResult('settings-result', data);
    } catch (error) {
      this.showError('settings-result', error.message);
    }
  },

  async getLimit() {
    this.showLoading('limit-result', 'Verificando disponibilidade...');

    try {
      const response = await fetch(`${this.apiBase}/get_limit`, {
        headers: { 'x-hf-token': this.token }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar');
      }

      this.displayResult('limit-result', data);
    } catch (error) {
      this.showError('limit-result', error.message);
    }
  },

  loadToken() {
    const saved = localStorage.getItem('hf_token');
    if (saved) {
      document.getElementById('cookie-input').value = saved;
      this.token = saved;
    }
  },

  showLoading(elementId, message) {
    document.getElementById(elementId).textContent = message;
  },

  showError(elementId, message) {
    document.getElementById(elementId).textContent = '❌ Erro: ' + message;
  },

  displayResult(elementId, data) {
    document.getElementById(elementId).textContent = JSON.stringify(data, null, 2);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());