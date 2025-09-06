document.addEventListener('DOMContentLoaded', function() {
    // === THEME TOGGLE ===
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);

    // === NAVIGATION BUTTONS ===
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchSection(button.dataset.target);
            animateButton(button);
        });
    });

    // === START LEARNING BUTTON ===
    const startLearningBtn = document.getElementById('start-learning-btn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', () => {
            switchSection('courses');
            animateButton(startLearningBtn);
        });
    }

    // === CODE EDITOR FUNCTIONALITY ===
    const codeEditor = document.getElementById('code-editor');
    const runButton = document.getElementById('run-code-btn');
    
    if (codeEditor && runButton) {
        setupCodeEditor();
        runButton.addEventListener('click', () => {
            runCode();
            animateButton(runButton);
        });
        document.getElementById('language-select').addEventListener('change', updateEditorLanguage);
        codeEditor.addEventListener('input', updateLineNumbers);
        codeEditor.addEventListener('scroll', syncScroll);
    }

    // === BACK TO COURSES BUTTON ===
    const backToCoursesBtn = document.getElementById('back-to-courses');
    if (backToCoursesBtn) {
        backToCoursesBtn.addEventListener('click', () => {
            switchSection('courses');
        });
    }

    // === LOAD COURSES ===
    loadCourses();

    // === HELPER FUNCTIONS ===
    function toggleTheme() {
        document.body.setAttribute('data-theme', 
            document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        
        const icon = document.querySelector('.theme-toggle i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    }

    function switchSection(sectionId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === sectionId);
        });
        
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });
    }

    function animateButton(button) {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 300);
    }

    function setupCodeEditor() {
        updateEditorLanguage();
    }

    function updateEditorLanguage() {
        const language = document.getElementById('language-select').value;
        const editor = document.getElementById('code-editor');
        
        const defaultCodes = {
            'html': `<!DOCTYPE html>\n<html>\n<head>\n    <title>My Halaman</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            text-align: center;\n            padding: 50px;\n        }\n        h1 {\n            color: #6c5ce7;\n        }\n    </style>\n</head>\n<body>\n    <h1>Hello Pengangguran!</h1>\n    <p>Mending lu belajar dah daripada scroll pesbuk. VSCode lu nganggur kocak</p>\n    \n    <script>\n        // JavaScript code here\n        console.log('Hello from the console!');\n    </script>\n</body>\n</html>`,
            'css': `/* CSS code here */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f5f6fa;\n    color: #2d3436;\n    text-align: center;\n    padding: 50px;\n}\n\nh1 {\n    color: #6c5ce7;\n    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);\n}\n\n.box {\n    width: 100px;\n    height: 100px;\n    background: linear-gradient(45deg, #6c5ce7, #a29bfe);\n    margin: 30px auto;\n    border-radius: 10px;\n    transition: all 0.3s ease;\n}\n\n.box:hover {\n    transform: rotate(45deg) scale(1.1);\n}`,
            'js': `// JavaScript code here\nfunction greet(name) {\n    return \`Hello, \${name}!\`;\n}\n\n// Display output\nconst outputElement = document.createElement('div');\noutputElement.innerHTML = \`\n    <h1>\${greet('Pengangguran')}</h1>\n    <p>Tanggal terbaru: \${new Date().toLocaleDateString()}</p>\n    <button onclick="alert('Walah Jadi Suki Jir😹🧢!')">Pencet Wok</button>\n\`;\n\ndocument.body.appendChild(outputElement);\n\n// Console output\nconsole.log('This message appears in the console');\nconsole.log('Try writing some JavaScript code!');`,
            'python': `# Python code here (simulated)\nprint("Hello Pengangguran!")\n\ndef factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)\n\n# This is a simulated Python environment\nresult = factorial(5)\nprint(f"The factorial of 5 is {result}")\n\n# Note: This is running in a simulated Python environment\n# Some Python features may not work in the browser`
        };
        
        editor.value = defaultCodes[language] || '';
        updateLineNumbers();
    }

    function runCode() {
        const language = document.getElementById('language-select').value;
        const code = document.getElementById('code-editor').value;
        const outputFrame = document.getElementById('output-frame');
        const frameDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;
        
        frameDoc.open();
        frameDoc.close();
        
        if (language === 'html') {
            frameDoc.write(code);
        } else if (language === 'css') {
            frameDoc.write(`<!DOCTYPE html><html><head><style>${code}</style></head><body><h1>CSS Output</h1><div class="box"></div><p>This is a preview of your CSS code.</p></body></html>`);
        } else if (language === 'js') {
            frameDoc.write(`<!DOCTYPE html><html><head><title>JS Output</title><style>body {font-family: Arial, sans-serif; padding: 20px;}</style></head><body><script>${code}</script></body></html>`);
        } else if (language === 'python') {
            frameDoc.write(`<!DOCTYPE html><html><head><title>Python Output</title><style>body {font-family: monospace; white-space: pre-wrap; padding: 20px; background: #f5f5f5; color: #333;}</style></head><body><div id="output"></div><script>
                try {
                    let output = "";
                    const code = \`${code}\`;
                    if (code.includes('print(')) {
                        const prints = code.match(/print\\((['"])(.*?)\\1\\)/g);
                        if (prints) prints.forEach(p => output += p.match(/print\\(['"](.*?)['"]\\)/)[1] + "\\n");
                    }
                    document.getElementById('output').textContent = output || "Python code executed (simulated)";
                } catch (e) {
                    document.getElementById('output').textContent = "Error: " + e.message;
                }
            </script></body></html>`);
        }
    }

    function updateLineNumbers() {
        const editor = document.getElementById('code-editor');
        const lineNumbers = document.querySelector('.line-numbers');
        if (!editor || !lineNumbers) return;
        
        const lines = editor.value.split('\n').length;
        lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
    }

    function syncScroll() {
        const editor = document.getElementById('code-editor');
        const lineNumbers = document.querySelector('.line-numbers');
        if (editor && lineNumbers) lineNumbers.scrollTop = editor.scrollTop;
    }

    function loadCourses() {
        const courses = [
            {
                id: "html-dasar",
                title: "HTML Pemula😁",
                description: "Pelajari dasar-dasar HTML untuk membangun struktur website. agar struktur lu kaga acak-acakan",
                lessons: 12,
                duration: "4 jam",
                icon: "fab fa-html5",
                lessonsList: [
                    "Pengenalan HTML",
                    "Struktur Dokumen HTML",
                    "Heading & Paragraph",
                    "Format Teks",
                    "List (Ordered & Unordered)",
                    "Link & Anchor",
                    "Gambar & Multimedia",
                    "Tabel HTML",
                    "Formulir HTML",
                    "Semantic HTML",
                    "Latihan Projek Kecil",
                    "Quiz HTML Dasar"
                ]
            },
            {
                id: "css-modern",
                title: "CSS Modern🔥",
                description: "Kuasai CSS dengan Flexbox, Grid, dan Animasi Smooth, biar tampilan web dinamis lu makin kece. ",
                lessons: 15,
                duration: "6 jam",
                icon: "fab fa-css3-alt",
                lessonsList: [
                    "Pengenalan CSS",
                    "Selector & Specificity",
                    "Box Model",
                    "Flexbox",
                    "CSS Grid",
                    "Responsive Design",
                    "Transisi & Animasi",
                    "Transform",
                    "Variabel CSS",
                    "Pseudo-class & Pseudo-element",
                    "CSS Architecture",
                    "Preprocessor (SASS)",
                    "Framework CSS",
                    "Best Practices",
                    "Projek Akhir"
                ]
            },
            {
                id: "javascript-es6",
                title: "JavaScript ES6+🥶",
                description: "Belajar JavaScript modern dengan fitur ES6 terbaru. King JSHT.",
                lessons: 20,
                duration: "8 jam",
                icon: "fab fa-js",
                lessonsList: [
                    "Pengenalan JavaScript",
                    "Variabel & Tipe Data",
                    "Operator",
                    "Kondisional",
                    "Loop",
                    "Function",
                    "Array Methods",
                    "Object",
                    "ES6+ Features",
                    "Async/Await",
                    "Fetch API",
                    "DOM Manipulation",
                    "Event Handling",
                    "Local Storage",
                    "Modular JavaScript",
                    "Error Handling",
                    "OOP in JS",
                    "Functional Programming",
                    "Algoritma Dasar",
                    "Projek Akhir"
                ]
            },
            {
                id: "python-pemula",
                title: "Python Untuk Pemula😹",
                description: "Mulai belajar Python dari dasar hingga membuat program sederhana, contohnya bisa bikin game flappy bird.",
                lessons: 10,
                duration: "5 jam",
                icon: "fab fa-python",
                lessonsList: [
                    "Pengenalan Python",
                    "Variabel & Tipe Data",
                    "Operator",
                    "Kondisional",
                    "Loop",
                    "Function",
                    "List & Dictionary",
                    "File Handling",
                    "Error Handling",
                    "Projek Sederhana"
                ]
            },
            {
                id: "web-design",
                title: "Web Design🤤",
                description: "Prinsip-prinsip desain untuk pengembang web, ini biar web lu kaga kosongan ya mek!",
                lessons: 8,
                duration: "3 jam",
                icon: "fas fa-paint-brush",
                lessonsList: [
                    "Prinsip Desain",
                    "Color Theory",
                    "Typography",
                    "Layout & Spacing",
                    "UI/UX Dasar",
                    "Design Tools",
                    "Responsive Design",
                    "Case Study"
                ]
            },
            {
                id: "algoritma-dasar",
                title: "Algoritma Dasar😳",
                description: "Pahami konsep algoritma dan struktur data dasar.",
                lessons: 12,
                duration: "6 jam",
                icon: "fas fa-brain",
                lessonsList: [
                    "Pengenalan Algoritma",
                    "Pseudocode",
                    "Time Complexity",
                    "Searching Algorithms",
                    "Sorting Algorithms",
                    "Stack & Queue",
                    "Linked List",
                    "Tree & Graph",
                    "Recursion",
                    "Dynamic Programming",
                    "Problem Solving",
                    "Latihan Soal"
                ]
            }
        ];
        
        const courseGrid = document.getElementById('course-grid');
        if (!courseGrid) return;
        
        courseGrid.innerHTML = courses.map(course => `
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-image" style="background: linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})">
                    <i class="${course.icon}"></i>
                </div>
                <div class="course-info">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span><i class="fas fa-book-open"></i> ${course.lessons} Pelajaran</span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click event to course cards
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', () => {
                const courseId = card.dataset.courseId;
                const course = courses.find(c => c.id === courseId);
                if (course) showCourseDetail(course);
            });
        });
    }

    function showCourseDetail(course) {
        document.getElementById('detail-course-title').textContent = course.title;
        document.getElementById('detail-course-description').textContent = course.description;
        document.getElementById('detail-lesson-count').textContent = course.lessons;
        document.getElementById('detail-duration').textContent = course.duration;
        document.getElementById('detail-course-icon').innerHTML = `<i class="${course.icon}"></i>`;
        
        const lessonsList = document.getElementById('lessons-list');
        lessonsList.innerHTML = '';
        
        course.lessonsList.forEach((lesson, index) => {
            const lessonItem = document.createElement('div');
            lessonItem.className = 'lesson-item';
            lessonItem.innerHTML = `
                <div class="lesson-number">${index + 1}</div>
                <div>${lesson}</div>
            `;
            lessonsList.appendChild(lessonItem);
        });
        
        switchSection('course-detail');
    }

    function getRandomColor() {
        const colors = ['#6c5ce7', '#fd79a8', '#00b894', '#0984e3', '#fdcb6e', '#e17055'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
});