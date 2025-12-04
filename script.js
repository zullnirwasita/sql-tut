// script.js untuk Belajar SQL Tutorial Website

// Fungsi untuk toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    
    sidebar.classList.toggle('active');
    main.classList.toggle('expanded');
    
    // Menyimpan status sidebar di localStorage
    if (sidebar.classList.contains('active')) {
        localStorage.setItem('sidebarState', 'open');
    } else {
        localStorage.setItem('sidebarState', 'closed');
    }
}

// Fungsi untuk menutup sidebar pada layar kecil
function closeSidebarOnSmallScreen() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        main.classList.add('expanded');
        localStorage.setItem('sidebarState', 'closed');
    }
}

// Fungsi untuk memuat status sidebar dari localStorage
function loadSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const sidebarState = localStorage.getItem('sidebarState');
    
    if (window.innerWidth > 768) {
        // Pada layar besar
        if (sidebarState === 'closed') {
            sidebar.classList.remove('active');
            main.classList.add('expanded');
        } else {
            sidebar.classList.add('active');
            main.classList.remove('expanded');
            // Default state untuk desktop
            if (!sidebarState) {
                localStorage.setItem('sidebarState', 'open');
            }
        }
    } else {
        // Pada layar kecil, sidebar default tertutup
        sidebar.classList.remove('active');
        main.classList.add('expanded');
        localStorage.setItem('sidebarState', 'closed');
    }
}

// Fungsi untuk highlight link aktif di sidebar
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Perbaikan: handle berbagai kemungkinan format URL
        const linkPage = link.getAttribute('href');
        const isCurrentPage = (
            linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html') ||
            (linkPage === './' && currentPage === 'index.html')
        );
        
        if (isCurrentPage) {
            link.classList.add('active');
        }
    });
}

// Fungsi untuk syntax highlighting SQL
function initSyntaxHighlighting() {
    const codeElements = document.querySelectorAll('.code-example pre');
    
    const keywords = [
        'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE',
        'DROP', 'ALTER', 'TABLE', 'DATABASE', 'VALUES', 'SET', 'INTO',
        'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON',
        'GROUP BY', 'ORDER BY', 'HAVING', 'AND', 'OR', 'NOT', 'NULL',
        'AS', 'DISTINCT', 'LIKE', 'IN', 'BETWEEN', 'EXISTS'
    ];
    
    const functions = [
        'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'UPPER', 'LOWER',
        'LENGTH', 'ROUND', 'NOW', 'DATE', 'CONCAT'
    ];
    
    codeElements.forEach(codeElement => {
        let code = codeElement.textContent;
        
        // Highlight keywords
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            code = code.replace(regex, `<span class="keyword">$&</span>`);
        });
        
        // Highlight functions
        functions.forEach(func => {
            const regex = new RegExp(`\\b${func}\\b`, 'gi');
            code = code.replace(regex, `<span class="function">$&</span>`);
        });
        
        // Highlight strings (dalam tanda kutip)
        code = code.replace(/'([^']*)'/g, `<span class="string">'$1'</span>`);
        code = code.replace(/"([^"]*)"/g, `<span class="string">"$1"</span>`);
        
        // Highlight numbers
        code = code.replace(/\b\d+\b/g, `<span class="number">$&</span>`);
        
        // Highlight comments
        code = code.replace(/--.*$/gm, `<span class="comment">$&</span>`);
        code = code.replace(/\/\*[\s\S]*?\*\//g, `<span class="comment">$&</span>`);
        
        codeElement.innerHTML = code;
    });
}

// Fungsi untuk copy code button
function initCopyCodeButtons() {
    // Tambahkan tombol copy ke setiap code example
    const codeExamples = document.querySelectorAll('.code-example');
    
    codeExamples.forEach((example, index) => {
        // Cek apakah sudah ada tombol copy
        if (!example.querySelector('.copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.dataset.target = `code-${index}`;
            
            const preElement = example.querySelector('pre');
            if (preElement) {
                preElement.id = `code-${index}`;
                example.appendChild(copyBtn);
            }
        }
    });
    
    // Event listener untuk tombol copy
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            const targetId = e.target.dataset.target;
            const codeElement = document.getElementById(targetId);
            
            if (codeElement) {
                const codeToCopy = codeElement.textContent;
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    // Feedback visual
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Copied!';
                    e.target.style.backgroundColor = '#1cc88a';
                    
                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.style.backgroundColor = '#4e73df';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    e.target.textContent = 'Failed!';
                    setTimeout(() => {
                        e.target.textContent = 'Copy';
                    }, 2000);
                });
            }
        }
    });
}

// Fungsi untuk SQL Editor
function initSQLEditor() {
    const sqlEditors = document.querySelectorAll('.sql-editor');
    
    sqlEditors.forEach((editor, index) => {
        const textarea = editor.querySelector('textarea');
        const runButton = editor.querySelector('button');
        const resultArea = editor.nextElementSibling;
        
        if (runButton && textarea) {
            runButton.addEventListener('click', function() {
                const sqlCode = textarea.value;
                
                // Simulasi hasil query (untuk demo)
                const sampleResults = [
                    { id: 1, name: 'John Doe', email: 'john@example.com' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
                    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
                ];
                
                if (resultArea && resultArea.classList.contains('result-table')) {
                    // Update tabel hasil
                    const tbody = resultArea.querySelector('tbody');
                    if (tbody) {
                        tbody.innerHTML = '';
                        sampleResults.forEach(row => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${row.id}</td>
                                <td>${row.name}</td>
                                <td>${row.email}</td>
                            `;
                            tbody.appendChild(tr);
                        });
                    }
                    
                    // Tampilkan tabel jika tersembunyi
                    resultArea.style.display = 'table';
                } else {
                    // Buat tabel hasil jika belum ada
                    const resultTable = document.createElement('table');
                    resultTable.className = 'result-table';
                    resultTable.innerHTML = `
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sampleResults.map(row => `
                                <tr>
                                    <td>${row.id}</td>
                                    <td>${row.name}</td>
                                    <td>${row.email}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    `;
                    
                    editor.parentNode.insertBefore(resultTable, editor.nextSibling);
                }
                
                // Highlight syntax di textarea
                highlightSQLTextarea(textarea);
            });
        }
        
        // Real-time syntax highlighting di textarea
        if (textarea) {
            textarea.addEventListener('input', function() {
                highlightSQLTextarea(this);
            });
        }
    });
}

// Fungsi untuk highlight SQL di textarea
function highlightSQLTextarea(textarea) {
    const sql = textarea.value;
    const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
    
    let highlighted = sql;
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        highlighted = highlighted.replace(regex, `<span style="color: #c678dd; font-weight: bold;">$&</span>`);
    });
    
    // Buat preview element untuk syntax highlighting
    const preview = document.createElement('div');
    preview.innerHTML = highlighted;
    preview.style.cssText = window.getComputedStyle(textarea);
    preview.style.position = 'absolute';
    preview.style.top = textarea.offsetTop + 'px';
    preview.style.left = textarea.offsetLeft + 'px';
    preview.style.width = textarea.offsetWidth + 'px';
    preview.style.height = textarea.offsetHeight + 'px';
    preview.style.overflow = 'auto';
    preview.style.whiteSpace = 'pre-wrap';
    preview.style.wordWrap = 'break-word';
    preview.style.zIndex = '-1';
    preview.style.pointerEvents = 'none';
    preview.style.backgroundColor = 'transparent';
    
    // Hapus preview sebelumnya
    const oldPreview = textarea.parentNode.querySelector('.sql-preview');
    if (oldPreview) {
        oldPreview.remove();
    }
    
    preview.className = 'sql-preview';
    textarea.parentNode.appendChild(preview);
}

// Fungsi untuk navigasi halaman berikutnya/sebelumnya
function initPageNavigation() {
    const prevBtn = document.querySelector('.page-nav a:first-child');
    const nextBtn = document.querySelector('.page-nav a:last-child');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            // Tambahkan animasi atau logika tambahan di sini
            console.log('Navigating to previous page');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            // Tambahkan animasi atau logika tambahan di sini
            console.log('Navigating to next page');
        });
    }
}

// Fungsi untuk back to top button
function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: #4e73df;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transition: opacity 0.3s, transform 0.3s;
    `;
    
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
            setTimeout(() => {
                backToTopButton.style.opacity = '1';
                backToTopButton.style.transform = 'scale(1)';
            }, 10);
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (backToTopButton.style.opacity === '0') {
                    backToTopButton.style.display = 'none';
                }
            }, 300);
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Event listener untuk menutup sidebar saat klik di luar area sidebar (untuk mobile)
function initCloseSidebarOnClickOutside() {
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.querySelector('.menu-btn');
        
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            (!menuBtn || !menuBtn.contains(event.target))) {
            toggleSidebar();
        }
    });
}

// Event listener untuk resize window
function initResponsiveBehavior() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            loadSidebarState();
            closeSidebarOnSmallScreen();
        }, 250);
    });
}

// Fungsi untuk menginisialisasi tooltips
function initTooltips() {
    const elementsWithTitle = document.querySelectorAll('[title]');
    
    elementsWithTitle.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.title;
            tooltip.style.cssText = `
                position: absolute;
                background: #2e3440;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 10000;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
            
            this.dataset.tooltipId = tooltip.id;
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Fungsi utama yang dijalankan saat halaman dimuat
function init() {
    console.log('SQL Tutorial Website initialized');
    
    // Inisialisasi semua fungsi
    loadSidebarState();
    setActiveNavLink();
    initSyntaxHighlighting();
    initCopyCodeButtons();
    initSQLEditor();
    initPageNavigation();
    initBackToTop();
    initCloseSidebarOnClickOutside();
    initResponsiveBehavior();
    initTooltips();
    
    // Menambahkan event listener untuk menu button
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleSidebar);
    }
    
    // Menambahkan keyboard shortcut (ESC untuk menutup sidebar)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        }
        
        // Ctrl/Cmd + / untuk toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            toggleSidebar();
        }
    });
    
    // Preload gambar (jika ada)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

// Jalankan fungsi init ketika DOM selesai dimuat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export fungsi untuk penggunaan modular (jika diperlukan)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleSidebar,
        setActiveNavLink,
        initSyntaxHighlighting,
        init
    };
}
