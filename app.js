// LÓGICA COMPLETA DO SISTEMA DE GESTÃO DE RH G4 (CORREÇÃO COMPLETA DA FILTRAGEM DE DADOS NOS RELATÓRIOS)

// DADOS DE DEMONSTRAÇÃO INICIAIS
const INITIAL_DATA = {
    employees: [
        {
            id: "emp_1",
            code: "MAT-2026-001",
            name: "Ana Paula Silva",
            cpf: "123.456.789-01",
            rg: "29.876.543-2",
            birthDate: "1994-08-12",
            address: "Av. Paulista, 1500 - Ap 52, São Paulo - SP",
            phone: "(11) 98765-4321",
            email: "ana.silva@empresa.com",
            role: "Analista de RH Senior",
            department: "Recursos Humanos",
            admissionDate: "2022-03-15",
            dismissalDate: "",
            salary: 5200.00,
            workload: "44h semanais",
            status: "Ativo"
        },
        {
            id: "emp_2",
            code: "MAT-2026-002",
            name: "Marcos Roberto Souza",
            cpf: "234.567.890-12",
            rg: "34.567.890-1",
            birthDate: "1988-08-25",
            address: "Rua Vergueiro, 800 - Bloco B, São Paulo - SP",
            phone: "(11) 99887-1122",
            email: "marcos.souza@empresa.com",
            role: "Gerente de Vendas",
            department: "Vendas & Comercial",
            admissionDate: "2020-08-10",
            dismissalDate: "",
            salary: 8900.00,
            workload: "44h semanais",
            status: "Ativo"
        },
        {
            id: "emp_3",
            code: "MAT-2026-003",
            name: "Juliana Costa",
            cpf: "345.678.901-23",
            rg: "41.234.567-8",
            birthDate: "1997-03-10",
            address: "Rua Augusta, 450 - Consolação, São Paulo - SP",
            phone: "(11) 97654-3210",
            email: "juliana.costa@empresa.com",
            role: "Desenvolvedora Fullstack",
            department: "Tecnologia da Informação",
            admissionDate: "2023-01-20",
            dismissalDate: "",
            salary: 7500.00,
            workload: "40h semanais",
            status: "Férias"
        },
        {
            id: "emp_4",
            code: "MAT-2026-004",
            name: "Lucas Fernando Oliveira",
            cpf: "456.789.012-34",
            rg: "18.765.432-0",
            birthDate: "1991-11-19",
            address: "Rua Funchal, 200 - Vila Olímpia, São Paulo - SP",
            phone: "(11) 96543-2109",
            email: "lucas.oliveira@empresa.com",
            role: "Analista Financeiro",
            department: "Financeiro & Contábil",
            admissionDate: "2021-11-05",
            dismissalDate: "",
            salary: 4800.00,
            workload: "44h semanais",
            status: "Ativo"
        },
        {
            id: "emp_5",
            code: "MAT-2026-005",
            name: "Patricia Mendes",
            cpf: "567.890.123-45",
            rg: "52.987.654-3",
            birthDate: "1995-08-04",
            address: "Alameda Santos, 900 - Jardins, São Paulo - SP",
            phone: "(11) 95432-1098",
            email: "patricia.mendes@empresa.com",
            role: "Coordenadora de Marketing",
            department: "Marketing",
            admissionDate: "2022-06-01",
            dismissalDate: "",
            salary: 6200.00,
            workload: "40h semanais",
            status: "Ativo"
        }
    ],
    vacations: [
        {
            id: "vac_1",
            employeeId: "emp_3",
            startDate: "2026-07-20",
            endDate: "2026-08-10",
            notes: "Férias regulamentares anuais de 20 dias."
        }
    ],
    evaluations: [
        {
            id: "eval_1",
            employeeId: "emp_1",
            date: "2026-06-15",
            rating: 5,
            strengths: "Excelente organização, proatividade e clima de equipe.",
            improvements: "Continuar capacitação em relatórios analíticos de pessoas."
        },
        {
            id: "eval_2",
            employeeId: "emp_2",
            date: "2026-05-10",
            rating: 4,
            strengths: "Atingiu 120% das metas comerciais no último semestre.",
            improvements: "Melhorar a integração com os setores operacionais."
        }
    ],
    attendance: [
        {
            id: "att_1",
            employeeId: "emp_2",
            type: "Falta Injustificada",
            date: "2026-06-10",
            notes: "Ausência sem justificativa prévia ou atestado médico."
        },
        {
            id: "att_2",
            employeeId: "emp_4",
            type: "Advertência Escrita",
            date: "2026-07-05",
            notes: "Advertência por atrasos reincidentes na jornada de trabalho."
        },
        {
            id: "att_3",
            employeeId: "emp_1",
            type: "Falta Justificada (Atestado)",
            date: "2026-05-18",
            notes: "Atestado médico de 1 dia apresentado ao setor de RH."
        }
    ]
};

// ESTADO GLOBAL DA APLICAÇÃO
let state = {
    employees: [],
    vacations: [],
    evaluations: [],
    attendance: [],
    isLoggedIn: false,
    viewMode: 'cards'
};

// CHAVES DO LOCALSTORAGE
const STORAGE_KEY = 'RH_SYSTEM_G4_DATA';
const SESSION_KEY = 'RH_SYSTEM_G4_SESSION';
const PASS_KEY = 'RH_SYSTEM_G4_ADMIN_PASS';
const RECOVERY_KEY_MASTER = 'ADMIN2026';
const ADMIN_EMAIL = 'admin@empresa.com';

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    checkSession();
    setupEventListeners();
    updatePassDisplay();
});

// MÁSCARA AUTOMÁTICA PARA CPF (000.000.000-00)
function applyCPFMask(value) {
    let clean = value.replace(/\D/g, '');
    if (clean.length > 11) clean = clean.slice(0, 11);

    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)}.${clean.slice(3)}`;
    if (clean.length <= 9) return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
}

// GERADOR AUTOMÁTICO DE MATRÍCULA
function generateNextMatricula() {
    const year = new Date().getFullYear();
    let maxNum = 0;

    state.employees.forEach(emp => {
        if (emp.code) {
            const parts = emp.code.split('-');
            if (parts.length === 3) {
                const num = parseInt(parts[2], 10);
                if (!isNaN(num) && num > maxNum) {
                    maxNum = num;
                }
            }
        }
    });

    const nextNum = maxNum + 1;
    const padded = String(nextNum).padStart(3, '0');
    return `MAT-${year}-${padded}`;
}

// OBTER SENHA ATUAL DO GESTOR
function getAdminPassword() {
    return localStorage.getItem(PASS_KEY) || '123456';
}

// ATUALIZAR DICA DE SENHA NA TELA DE LOGIN
function updatePassDisplay() {
    const displayEl = document.getElementById('display-current-pass');
    if (displayEl) {
        displayEl.textContent = getAdminPassword();
    }
}

// CARREGAR DADOS DO ARMAZENAMENTO LOCAL
function loadStateFromStorage() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
        try {
            const parsed = JSON.parse(rawData);
            state.employees = parsed.employees || [];
            state.vacations = parsed.vacations || [];
            state.evaluations = parsed.evaluations || [];
            state.attendance = parsed.attendance || [];

            let hasChanges = false;
            state.employees.forEach((emp, index) => {
                if (!emp.code) {
                    const padded = String(index + 1).padStart(3, '0');
                    emp.code = `MAT-2026-${padded}`;
                    hasChanges = true;
                }
                if (!emp.workload) {
                    emp.workload = '44h semanais';
                    hasChanges = true;
                }
                if (emp.dismissalDate === undefined) {
                    emp.dismissalDate = '';
                    hasChanges = true;
                }
            });
            if (hasChanges) {
                saveStateToStorage();
            }
        } catch (e) {
            console.error("Erro ao carregar dados salvos:", e);
            restoreInitialData();
        }
    } else {
        restoreInitialData();
    }
}

// SALVAR DADOS NO LOCALSTORAGE
function saveStateToStorage() {
    if (!requireAuth()) return;
    const dataToSave = {
        employees: state.employees,
        vacations: state.vacations,
        evaluations: state.evaluations,
        attendance: state.attendance
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    renderAll();
}

// RESTAURAR DADOS DE EXEMPLO INICIAIS
function restoreInitialData() {
    state.employees = JSON.parse(JSON.stringify(INITIAL_DATA.employees));
    state.vacations = JSON.parse(JSON.stringify(INITIAL_DATA.vacations));
    state.evaluations = JSON.parse(JSON.stringify(INITIAL_DATA.evaluations));
    state.attendance = JSON.parse(JSON.stringify(INITIAL_DATA.attendance));
    
    const dataToSave = {
        employees: state.employees,
        vacations: state.vacations,
        evaluations: state.evaluations,
        attendance: state.attendance
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    if (state.isLoggedIn) {
        renderAll();
    }
}

// BLOQUEIO DE SEGURANÇA E CHECAGEM DE SESSÃO
function requireAuth() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session !== 'true' || !state.isLoggedIn) {
        state.isLoggedIn = false;
        showLoginScreen();
        return false;
    }
    return true;
}

function checkSession() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session === 'true') {
        state.isLoggedIn = true;
        showAppShell();
    } else {
        state.isLoggedIn = false;
        showLoginScreen();
    }
}

// CONTROLE DE TELAS PRINCIPAIS
function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-shell').classList.add('hidden');
    updatePassDisplay();
}

function showAppShell() {
    if (!requireAuth()) return;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    renderAll();
}

// CONFIGURAÇÃO DOS EVENTOS DA INTERFACE
function setupEventListeners() {
    const cpfInput = document.getElementById('emp-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = applyCPFMask(e.target.value);
        });
    }

    const statusSelect = document.getElementById('emp-status');
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            const container = document.getElementById('dismissal-date-container');
            const dismissalInput = document.getElementById('emp-dismissal');
            if (e.target.value === 'Desligado') {
                container.classList.remove('hidden');
                if (!dismissalInput.value) {
                    dismissalInput.value = new Date().toISOString().split('T')[0];
                }
            } else {
                container.classList.add('hidden');
                dismissalInput.value = '';
            }
        });
    }

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value.trim();
        const currentPass = getAdminPassword();

        if (email === ADMIN_EMAIL && password === currentPass) {
            document.getElementById('login-error').classList.add('hidden');
            localStorage.setItem(SESSION_KEY, 'true');
            state.isLoggedIn = true;
            showAppShell();
            showToast('Bem-vindo(a), Gestor(a) de RH!');
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    });

    document.getElementById('btn-quick-login').addEventListener('click', () => {
        localStorage.setItem(SESSION_KEY, 'true');
        state.isLoggedIn = true;
        showAppShell();
        showToast('Acesso rápido realizado!');
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem(SESSION_KEY);
        state.isLoggedIn = false;
        showLoginScreen();
        showToast('Sessão encerrada com sucesso.');
    });

    document.getElementById('btn-forgot-password-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('form-recover-password').reset();
        document.getElementById('recover-error').classList.add('hidden');
        document.getElementById('modal-recover-password').classList.remove('hidden');
    });

    document.getElementById('form-recover-password').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('recover-email').value.trim().toLowerCase();
        const key = document.getElementById('recover-key').value.trim();
        const newPass = document.getElementById('recover-new-pass').value.trim();

        if (email === ADMIN_EMAIL && key.toUpperCase() === RECOVERY_KEY_MASTER) {
            localStorage.setItem(PASS_KEY, newPass);
            document.getElementById('recover-error').classList.add('hidden');
            document.getElementById('modal-recover-password').classList.add('hidden');
            document.getElementById('login-password').value = newPass;
            updatePassDisplay();
            showToast('Senha redefinida com sucesso!');
        } else {
            document.getElementById('recover-error').classList.remove('hidden');
        }
    });

    document.getElementById('btn-open-change-password').addEventListener('click', () => {
        if (!requireAuth()) return;
        document.getElementById('form-change-password').reset();
        document.getElementById('change-pass-error').classList.add('hidden');
        document.getElementById('modal-change-password').classList.remove('hidden');
    });

    document.getElementById('form-change-password').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!requireAuth()) return;

        const currentInput = document.getElementById('change-pass-current').value.trim();
        const newPass = document.getElementById('change-pass-new').value.trim();
        const confirmPass = document.getElementById('change-pass-confirm').value.trim();
        const actualPass = getAdminPassword();

        if (currentInput !== actualPass) {
            document.getElementById('change-pass-error').textContent = 'Senha atual incorreta!';
            document.getElementById('change-pass-error').classList.remove('hidden');
            return;
        }

        if (newPass !== confirmPass) {
            document.getElementById('change-pass-error').textContent = 'A nova senha e a confirmação não coincidem!';
            document.getElementById('change-pass-error').classList.remove('hidden');
            return;
        }

        localStorage.setItem(PASS_KEY, newPass);
        document.getElementById('change-pass-error').classList.add('hidden');
        document.getElementById('modal-change-password').classList.add('hidden');
        updatePassDisplay();
        showToast('Sua senha foi alterada com sucesso!');
    });

    document.getElementById('form-bi-filter').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!requireAuth()) return;
        renderDashboardBI();
        showToast('Filtro de período aplicado ao Dashboard!');
    });

    document.getElementById('btn-clear-bi-filter').addEventListener('click', () => {
        if (!requireAuth()) return;
        document.getElementById('filter-bi-month').value = '';
        document.getElementById('filter-bi-start').value = '';
        document.getElementById('filter-bi-end').value = '';

        renderDashboardBI();
        showToast('Mostrando todos os dados do sistema!');
    });

    document.getElementById('btn-open-modal-attendance').addEventListener('click', () => {
        if (!requireAuth()) return;
        openAttendanceModal();
    });
    document.getElementById('form-attendance').addEventListener('submit', handleAttendanceFormSubmit);

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!requireAuth()) return;
            const targetTab = item.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    document.querySelectorAll('.btn-goto-emp').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!requireAuth()) return;
            switchTab('tab-employees');
        });
    });

    const btnNewEmpTab = document.getElementById('btn-new-emp-tab');
    if (btnNewEmpTab) {
        btnNewEmpTab.addEventListener('click', () => {
            if (!requireAuth()) return;
            openEmployeeModal();
        });
    }

    document.getElementById('btn-new-emp-top').addEventListener('click', () => {
        if (!requireAuth()) return;
        openEmployeeModal();
    });

    document.getElementById('form-employee').addEventListener('submit', handleEmployeeFormSubmit);

    document.getElementById('search-employee').addEventListener('input', () => {
        if (requireAuth()) renderEmployees();
    });
    document.getElementById('filter-dept').addEventListener('change', () => {
        if (requireAuth()) renderEmployees();
    });
    document.getElementById('filter-status').addEventListener('change', () => {
        if (requireAuth()) renderEmployees();
    });

    document.getElementById('btn-toggle-view').addEventListener('click', () => {
        if (!requireAuth()) return;
        state.viewMode = state.viewMode === 'cards' ? 'table' : 'cards';
        document.getElementById('view-mode-text').textContent = state.viewMode === 'cards' ? 'Modo Tabela' : 'Modo Cartões';
        renderEmployees();
    });

    document.getElementById('btn-open-modal-vacation').addEventListener('click', () => {
        if (!requireAuth()) return;
        openVacationModal();
    });
    document.getElementById('form-vacation').addEventListener('submit', handleVacationFormSubmit);

    document.getElementById('btn-open-modal-eval').addEventListener('click', () => {
        if (!requireAuth()) return;
        openEvalModal();
    });
    document.getElementById('form-eval').addEventListener('submit', handleEvalFormSubmit);

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.add('hidden'));
        });
    });

    // EVENTOS DA CENTRAL DE RELATÓRIOS (ATUALIZAM INSTANTANEAMENTE A PRÉ-VISUALIZAÇÃO)
    document.getElementById('select-report-type').addEventListener('change', renderGeneratedReport);
    document.getElementById('select-report-month').addEventListener('change', renderGeneratedReport);
    document.getElementById('select-report-year').addEventListener('change', renderGeneratedReport);
    document.getElementById('select-report-start').addEventListener('change', renderGeneratedReport);
    document.getElementById('select-report-end').addEventListener('change', renderGeneratedReport);
    document.getElementById('select-subfilter-dept').addEventListener('change', renderGeneratedReport);
    document.getElementById('select-subfilter-role').addEventListener('change', renderGeneratedReport);

    const btnVisualize = document.getElementById('btn-visualize-report');
    if (btnVisualize) {
        btnVisualize.addEventListener('click', () => {
            if (!requireAuth()) return;
            renderGeneratedReport();
            showToast('Relatório atualizado com os filtros selecionados!');
        });
    }

    document.getElementById('btn-export-pdf-gen').addEventListener('click', printActiveGeneratedReport);
    document.getElementById('btn-export-excel-gen').addEventListener('click', exportActiveGeneratedReportCSV);

    document.getElementById('btn-export-data').addEventListener('click', exportBackupJSON);
    document.getElementById('btn-import-data').addEventListener('click', () => {
        if (!requireAuth()) return;
        document.getElementById('input-import-file').click();
    });
    document.getElementById('input-import-file').addEventListener('change', importBackupJSON);
    document.getElementById('btn-reset-data').addEventListener('click', () => {
        if (!requireAuth()) return;
        if (confirm('Tem certeza que deseja restaurar os dados de exemplo iniciais? Suas alterações atuais serão substituídas.')) {
            restoreInitialData();
            showToast('Dados restaurados para os exemplos originais!');
        }
    });
}

// TROCA DE TABS
function switchTab(tabId) {
    if (!requireAuth()) return;

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const navBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    const contentSec = document.getElementById(tabId);

    const topNewBtn = document.getElementById('btn-new-emp-top');
    if (tabId === 'tab-employees') {
        topNewBtn.classList.remove('hidden');
    } else {
        topNewBtn.classList.add('hidden');
    }

    if (navBtn && contentSec) {
        navBtn.classList.add('active');
        contentSec.classList.add('active');

        const titles = {
            'tab-dashboard': 'Painel & Visão Geral',
            'tab-employees': 'Gestão de Colaboradores',
            'tab-vacations': 'Controle de Férias e Ausências',
            'tab-attendance': 'Controle de Presença, Faltas & Advertências',
            'tab-performance': 'Avaliação de Desempenho (1-on-1)',
            'tab-reports': 'Relatórios & Cópia de Segurança'
        };
        document.getElementById('page-title').textContent = titles[tabId] || 'Gestão de RH';
    }
}

// RENDERIZAR TUDO DA TELA
function renderAll() {
    if (!requireAuth()) return;

    renderDashboardBI();
    renderEmployees();
    renderVacationsTable();
    renderAttendanceSection();
    renderEvaluationsGrid();
    populateReportSubfilterRoles();
    renderGeneratedReport();
}

// OBTER PERÍODO ATIVO DO DASHBOARD
function getActiveDashboardPeriod() {
    const startVal = document.getElementById('filter-bi-start').value;
    const endVal = document.getElementById('filter-bi-end').value;

    const monthVal = document.getElementById('filter-bi-month').value;
    const yearVal = document.getElementById('filter-bi-year').value || '2026';

    if (startVal || endVal) {
        const startDate = startVal || '1900-01-01';
        const endDate = endVal || '2099-12-31';
        return {
            isFiltered: true,
            type: 'RANGE',
            startDate: startDate,
            endDate: endDate,
            label: `Período: ${formatDate(startDate)} até ${formatDate(endDate)}`
        };
    }

    if (monthVal) {
        const m = parseInt(monthVal, 10);
        const y = parseInt(yearVal, 10);
        const lastDay = new Date(y, m, 0).getDate();
        const monthPad = String(m).padStart(2, '0');
        const startDate = `${y}-${monthPad}-01`;
        const endDate = `${y}-${monthPad}-${String(lastDay).padStart(2, '0')}`;

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return {
            isFiltered: true,
            type: 'MONTH_YEAR',
            startDate: startDate,
            endDate: endDate,
            label: `Mês: ${monthNames[m - 1]} / ${y}`
        };
    }

    return {
        isFiltered: false,
        type: 'ALL',
        startDate: '1900-01-01',
        endDate: '2099-12-31',
        label: 'Sem Filtro (Todos os Dados Cadastrados)'
    };
}

// RENDERIZAR DASHBOARD BI
function renderDashboardBI() {
    const period = getActiveDashboardPeriod();

    const badge = document.getElementById('bi-filter-badge');
    badge.textContent = period.label;
    badge.className = period.isFiltered ? 'badge badge-warning' : 'badge badge-info';

    let admissionsCount = 0;
    let dismissalsCount = 0;

    state.employees.forEach(emp => {
        if (emp.admissionDate) {
            if (!period.isFiltered || (emp.admissionDate >= period.startDate && emp.admissionDate <= period.endDate)) {
                admissionsCount++;
            }
        }

        if (emp.status === 'Desligado') {
            const disDate = emp.dismissalDate || emp.admissionDate;
            if (!period.isFiltered || (disDate >= period.startDate && disDate <= period.endDate)) {
                dismissalsCount++;
            }
        }
    });

    const snapshotEmployees = state.employees.filter(emp => {
        if (!period.isFiltered) return true;
        const admittedBeforeEnd = emp.admissionDate <= period.endDate;
        const notDismissedBeforeStart = !emp.dismissalDate || emp.dismissalDate >= period.startDate;
        return admittedBeforeEnd && notDismissedBeforeStart;
    });

    const activeSnapshot = snapshotEmployees.filter(e => e.status !== 'Desligado');
    const totalEmployees = activeSnapshot.length;
    const totalPayroll = activeSnapshot.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);

    document.getElementById('stat-total-employees').textContent = totalEmployees;
    document.getElementById('stat-active-sub').textContent = period.isFiltered ? `Retrato no fim do período` : `${totalEmployees} ativos no total`;
    document.getElementById('stat-total-payroll').textContent = formatCurrency(totalPayroll);
    document.getElementById('stat-admissions-count').textContent = admissionsCount;
    document.getElementById('stat-dismissals-count').textContent = dismissalsCount;

    renderDeptChartBI(activeSnapshot);
    renderRoleChartBI(activeSnapshot);
    renderRecentEmployeesBI(activeSnapshot);
}

// GRÁFICOS VISUAIS
function renderDeptChartBI(empList) {
    const container = document.getElementById('dept-distribution-container');
    container.innerHTML = '';

    const deptCounts = {};
    const total = empList.length;

    empList.forEach(emp => {
        const dept = emp.department || 'Outros';
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    if (total === 0) {
        container.innerHTML = '<p class="text-muted text-center py-3">Nenhum funcionário encontrado no retrato do período.</p>';
        return;
    }

    Object.keys(deptCounts).forEach(dept => {
        const count = deptCounts[dept];
        const percentage = Math.round((count / total) * 100);

        const html = `
            <div class="dept-item mb-3">
                <div class="dept-info flex-between mb-1">
                    <span style="font-weight:600; color:var(--text-primary);">🏢 ${dept}</span>
                    <span class="text-sm"><strong>${count}</strong> func. (${percentage}%)</span>
                </div>
                <div class="dept-bar-bg" style="height:10px; background:#f3e8ff; border-radius:5px; overflow:hidden;">
                    <div class="dept-bar-fill" style="width: ${percentage}%; height:100%; background:var(--primary); border-radius:5px;"></div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function renderRoleChartBI(empList) {
    const container = document.getElementById('role-distribution-container');
    container.innerHTML = '';

    const roleCounts = {};
    const total = empList.length;

    empList.forEach(emp => {
        const role = emp.role || 'Outros';
        roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    if (total === 0) {
        container.innerHTML = '<p class="text-muted text-center py-3">Nenhum cargo encontrado no retrato do período.</p>';
        return;
    }

    Object.keys(roleCounts).forEach(role => {
        const count = roleCounts[role];
        const percentage = Math.round((count / total) * 100);

        const html = `
            <div class="dept-item mb-3">
                <div class="dept-info flex-between mb-1">
                    <span style="font-weight:600; color:var(--text-primary);">👔 ${role}</span>
                    <span class="text-sm"><strong>${count}</strong> func. (${percentage}%)</span>
                </div>
                <div class="dept-bar-bg" style="height:10px; background:#ede9fe; border-radius:5px; overflow:hidden;">
                    <div class="dept-bar-fill" style="width: ${percentage}%; height:100%; background:var(--purple); border-radius:5px;"></div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function renderRecentEmployeesBI(empList) {
    const tbody = document.getElementById('recent-employees-tbody');
    tbody.innerHTML = '';

    const recents = empList.slice(-5).reverse();

    if (recents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhum colaborador no retrato do período.</td></tr>';
        return;
    }

    recents.forEach(emp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color:var(--primary);">${emp.code || '-'}</strong></td>
            <td><strong>${emp.name}</strong></td>
            <td>${emp.role}</td>
            <td>${emp.department}</td>
            <td>${formatDate(emp.admissionDate)}</td>
            <td>${formatCurrency(emp.salary)}</td>
            <td><span class="badge ${getStatusBadgeClass(emp.status)}">${emp.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function populateReportSubfilterRoles() {
    const select = document.getElementById('select-subfilter-role');
    if (!select) return;
    select.innerHTML = '<option value="TODOS">Todos os Cargos</option>';

    const rolesSet = new Set();
    state.employees.forEach(e => {
        if (e.role) rolesSet.add(e.role);
    });

    Array.from(rolesSet).sort().forEach(role => {
        const opt = document.createElement('option');
        opt.value = role;
        opt.textContent = role;
        select.appendChild(opt);
    });
}

// OBTER FILTRO DE DATA DOS RELATÓRIOS
function getReportDateFilter() {
    const monthVal = document.getElementById('select-report-month').value;
    const yearVal = document.getElementById('select-report-year').value;
    const startVal = document.getElementById('select-report-start').value;
    const endVal = document.getElementById('select-report-end').value;

    if (startVal || endVal) {
        return {
            type: 'RANGE',
            startDate: startVal || '1900-01-01',
            endDate: endVal || '2099-12-31'
        };
    }

    if (monthVal || yearVal) {
        return {
            type: 'MONTH_YEAR',
            month: monthVal ? parseInt(monthVal, 10) : null,
            year: yearVal ? parseInt(yearVal, 10) : null
        };
    }

    return { type: 'ALL' };
}

// CORREÇÃO: VERIFICAR SE O COLABORADOR ESTAVA ATIVO NO PERÍODO SELECIONADO
function employeeMatchesReportFilter(emp, dateFilter) {
    if (!dateFilter || dateFilter.type === 'ALL') return true;

    let periodStart = '1900-01-01';
    let periodEnd = '2099-12-31';

    if (dateFilter.type === 'RANGE') {
        periodStart = dateFilter.startDate || '1900-01-01';
        periodEnd = dateFilter.endDate || '2099-12-31';
    } else if (dateFilter.type === 'MONTH_YEAR') {
        const m = dateFilter.month;
        const y = dateFilter.year;

        if (m && y) {
            const lastDay = new Date(y, m, 0).getDate();
            const mPad = String(m).padStart(2, '0');
            periodStart = `${y}-${mPad}-01`;
            periodEnd = `${y}-${mPad}-${String(lastDay).padStart(2, '0')}`;
        } else if (y) {
            periodStart = `${y}-01-01`;
            periodEnd = `${y}-12-31`;
        } else if (m) {
            const mPad = String(m).padStart(2, '0');
            if (emp.admissionDate) {
                const parts = emp.admissionDate.split('-');
                if (parts.length === 3) {
                    const admMonth = parseInt(parts[1], 10);
                    if (admMonth <= m) return true;
                }
            }
            return true;
        }
    }

    const admittedOk = !emp.admissionDate || emp.admissionDate <= periodEnd;
    const notDismissedOk = !emp.dismissalDate || emp.dismissalDate >= periodStart;

    return admittedOk && notDismissedOk;
}

// VERIFICAR SE O REGISTRO DE FALTAS/PONTO CORRESPONDE AO PERÍODO
function attendanceMatchesReportFilter(att, dateFilter) {
    if (!dateFilter || dateFilter.type === 'ALL') return true;

    if (dateFilter.type === 'RANGE') {
        return att.date >= dateFilter.startDate && att.date <= dateFilter.endDate;
    }

    if (dateFilter.type === 'MONTH_YEAR') {
        if (!att.date) return true;
        const parts = att.date.split('-');
        if (parts.length === 3) {
            const attYear = parseInt(parts[0], 10);
            const attMonth = parseInt(parts[1], 10);

            const yearOk = !dateFilter.year || attYear === dateFilter.year;
            const monthOk = !dateFilter.month || attMonth === dateFilter.month;
            return yearOk && monthOk;
        }
    }

    return true;
}

// CENTRAL DE GERAÇÃO E PRÉ-VISUALIZAÇÃO DE RELATÓRIOS (COM DADOS CORRETAMENTE CARREGADOS)
function getActiveReportData() {
    const type = document.getElementById('select-report-type').value;
    const subDept = document.getElementById('select-subfilter-dept').value;
    const subRole = document.getElementById('select-subfilter-role').value;
    const dateFilter = getReportDateFilter();

    let title = '';
    let headers = [];
    let rows = [];

    if (type === 'GENERAL') {
        title = 'Lista Completa de Funcionários';
        headers = ['Matrícula', 'Nome Completo', 'CPF', 'RG', 'Cargo', 'Departamento', 'Admissão', 'Salário', 'Jornada', 'Status'];
        
        const filtered = state.employees.filter(emp => employeeMatchesReportFilter(emp, dateFilter));
        rows = filtered.map(emp => [
            emp.code || '-',
            emp.name,
            emp.cpf || '-',
            emp.rg || '-',
            emp.role,
            emp.department,
            formatDate(emp.admissionDate),
            formatCurrency(emp.salary),
            emp.workload || '44h semanais',
            emp.status
        ]);
    } else if (type === 'PAYROLL') {
        title = 'Relatório de Folha de Pagamento de Colaboradores';
        headers = ['Matrícula', 'Nome Completo', 'CPF', 'Cargo', 'Departamento', 'Jornada', 'Salário Mensal', 'Status'];

        const filtered = state.employees.filter(emp => employeeMatchesReportFilter(emp, dateFilter));
        rows = filtered.map(emp => [
            emp.code || '-',
            emp.name,
            emp.cpf || '-',
            emp.role,
            emp.department,
            emp.workload || '44h semanais',
            formatCurrency(emp.salary),
            emp.status
        ]);

        if (rows.length > 0) {
            const totalSalary = filtered.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
            rows.push([
                'TOTAL',
                `Custo Total da Folha (${filtered.length} func.)`,
                '-',
                '-',
                '-',
                '-',
                formatCurrency(totalSalary),
                'GERAL'
            ]);
        }
    } else if (type === 'BY_DEPT') {
        title = subDept === 'TODOS' ? 'Funcionários por Departamento (Todos)' : `Funcionários do Departamento: ${subDept}`;
        headers = ['Departamento', 'Matrícula', 'Nome Completo', 'Cargo', 'Data Admissão', 'Salário', 'Status'];

        const filtered = state.employees.filter(e => {
            const deptOk = subDept === 'TODOS' || e.department === subDept;
            const dateOk = employeeMatchesReportFilter(e, dateFilter);
            return deptOk && dateOk;
        });

        rows = filtered.map(emp => [
            emp.department,
            emp.code || '-',
            emp.name,
            emp.role,
            formatDate(emp.admissionDate),
            formatCurrency(emp.salary),
            emp.status
        ]);
    } else if (type === 'BY_ROLE') {
        title = subRole === 'TODOS' ? 'Funcionários por Cargo (Todos)' : `Funcionários com o Cargo: ${subRole}`;
        headers = ['Cargo', 'Matrícula', 'Nome Completo', 'Departamento', 'Data Admissão', 'Salário', 'Status'];

        const filtered = state.employees.filter(e => {
            const roleOk = subRole === 'TODOS' || e.role === subRole;
            const dateOk = employeeMatchesReportFilter(e, dateFilter);
            return roleOk && dateOk;
        });

        rows = filtered.map(emp => [
            emp.role,
            emp.code || '-',
            emp.name,
            emp.department,
            formatDate(emp.admissionDate),
            formatCurrency(emp.salary),
            emp.status
        ]);
    } else if (type === 'MONTHLY_ATTENDANCE') {
        title = 'Relatório de Frequência Mensal dos Funcionários';
        headers = ['Matrícula', 'Nome Completo', 'Cargo / Depto', 'Atestados / Justificadas', 'Faltas Injustificadas', 'Advertências / Observações'];

        const filteredEmp = state.employees.filter(emp => employeeMatchesReportFilter(emp, dateFilter));
        rows = filteredEmp.map(emp => {
            const empAtt = state.attendance.filter(a => a.employeeId === emp.id && attendanceMatchesReportFilter(a, dateFilter));
            const excused = empAtt.filter(a => a.type.includes('Justificada') || a.type.includes('Atestado')).length;
            const unexcused = empAtt.filter(a => a.type === 'Falta Injustificada').length;
            const warnings = empAtt.filter(a => a.type.includes('Advertência') || a.type.includes('Suspensão') || a.type.includes('Observação')).length;

            return [
                emp.code || '-',
                emp.name,
                `${emp.role} (${emp.department})`,
                `${excused} registro(s)`,
                `${unexcused} registro(s)`,
                `${warnings} registro(s)`
            ];
        });
    } else if (type === 'ATTENDANCE_LOGS') {
        title = 'Relatório de Registros de Ponto e Ocorrências';
        headers = ['Data', 'Matrícula', 'Nome Completo', 'Tipo de Ocorrência / Ponto', 'Motivo / Detalhes'];

        const filtered = state.attendance.filter(att => attendanceMatchesReportFilter(att, dateFilter));
        rows = filtered.slice().reverse().map(att => {
            const emp = state.employees.find(e => e.id === att.employeeId);
            return [
                formatDate(att.date),
                emp ? emp.code : '-',
                emp ? emp.name : 'Desconhecido',
                att.type,
                att.notes || '-'
            ];
        });
    }

    return { title, headers, rows, type };
}

function renderGeneratedReport() {
    const type = document.getElementById('select-report-type').value;

    const deptContainer = document.getElementById('subfilter-dept-container');
    const roleContainer = document.getElementById('subfilter-role-container');

    if (type === 'BY_DEPT') {
        deptContainer.classList.remove('hidden');
        roleContainer.classList.add('hidden');
    } else if (type === 'BY_ROLE') {
        roleContainer.classList.remove('hidden');
        deptContainer.classList.add('hidden');
    } else {
        deptContainer.classList.add('hidden');
        roleContainer.classList.add('hidden');
    }

    const { title, headers, rows } = getActiveReportData();

    document.getElementById('report-preview-title').textContent = title;
    const realCount = rows.filter(r => r[0] !== 'TOTAL').length;
    document.getElementById('report-preview-count').textContent = `${realCount} registros`;

    const thead = document.getElementById('report-preview-thead');
    thead.innerHTML = '';
    const trHead = document.createElement('tr');
    headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    const tbody = document.getElementById('report-preview-tbody');
    tbody.innerHTML = '';

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${headers.length}" class="text-center text-muted">Nenhum registro encontrado para este relatório com os filtros selecionados.</td></tr>`;
        return;
    }

    rows.forEach(row => {
        const tr = document.createElement('tr');
        const isTotalRow = row[0] === 'TOTAL';
        if (isTotalRow) {
            tr.style.background = '#f3e8ff';
            tr.style.fontWeight = 'bold';
        }

        row.forEach((cell, idx) => {
            const td = document.createElement('td');
            if (idx === 0 || isTotalRow) {
                td.innerHTML = `<strong>${cell}</strong>`;
            } else {
                td.textContent = cell;
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// IMPRIMIR / PDF DO RELATÓRIO ATIVO
function printActiveGeneratedReport() {
    if (!requireAuth()) return;

    const { title, headers, rows } = getActiveReportData();

    document.getElementById('print-report-subtitle').textContent = title;

    const dateSpan = document.getElementById('print-date');
    const now = new Date();
    dateSpan.textContent = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const printThead = document.getElementById('print-report-thead');
    printThead.innerHTML = '';
    const trHead = document.createElement('tr');
    headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        trHead.appendChild(th);
    });
    printThead.appendChild(trHead);

    const printTbody = document.getElementById('print-report-tbody');
    printTbody.innerHTML = '';

    if (rows.length === 0) {
        printTbody.innerHTML = `<tr><td colspan="${headers.length}" class="text-center">Nenhum registro encontrado.</td></tr>`;
    } else {
        rows.forEach(row => {
            const tr = document.createElement('tr');
            const isTotalRow = row[0] === 'TOTAL';
            if (isTotalRow) {
                tr.style.fontWeight = 'bold';
                tr.style.backgroundColor = '#f3e8ff';
            }

            row.forEach((cell, idx) => {
                const td = document.createElement('td');
                if (idx === 0 || isTotalRow) {
                    td.innerHTML = `<strong>${cell}</strong>`;
                } else {
                    td.textContent = cell;
                }
                tr.appendChild(td);
            });
            printTbody.appendChild(tr);
        });
    }

    window.print();
}

// EXPORTAR PARA EXCEL (CSV) DO RELATÓRIO ATIVO
function exportActiveGeneratedReportCSV() {
    if (!requireAuth()) return;

    const { title, headers, rows } = getActiveReportData();

    if (rows.length === 0) {
        showToast('Nenhum registro disponível para exportar.');
        return;
    }

    let csvContent = "\uFEFF";
    csvContent += headers.join(";") + "\n";

    rows.forEach(row => {
        const formattedRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`);
        csvContent += formattedRow.join(";") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_rh_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Relatório "${title}" exportado para Excel (CSV)!`);
}

// RENDERIZAR CONTROLE DE PRESENÇA E FALTAS
function renderAttendanceSection() {
    const tbody = document.getElementById('attendance-tbody');
    tbody.innerHTML = '';

    const unexcused = state.attendance.filter(a => a.type === 'Falta Injustificada').length;
    const warnings = state.attendance.filter(a => a.type.includes('Advertência') || a.type.includes('Suspensão')).length;
    const excused = state.attendance.filter(a => a.type.includes('Justificada') || a.type.includes('Atestado')).length;

    document.getElementById('stat-unexcused-absences').textContent = unexcused;
    document.getElementById('stat-warnings-count').textContent = warnings;
    document.getElementById('stat-excused-absences').textContent = excused;

    if (state.attendance.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-muted text-center">Nenhuma ocorrência ou falta registrada no sistema.</td></tr>';
        return;
    }

    state.attendance.slice().reverse().forEach(att => {
        const emp = state.employees.find(e => e.id === att.employeeId);
        const empName = emp ? `${emp.name} (${emp.code})` : 'Desconhecido';

        let badgeClass = 'badge-info';
        if (att.type === 'Falta Injustificada') badgeClass = 'badge-danger';
        else if (att.type.includes('Advertência') || att.type.includes('Suspensão')) badgeClass = 'badge-warning';
        else if (att.type.includes('Justificada')) badgeClass = 'badge-success';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${formatDate(att.date)}</strong></td>
            <td>${empName}</td>
            <td><span class="badge ${badgeClass}">${att.type}</span></td>
            <td>${att.notes || '-'}</td>
            <td class="text-right">
                <button class="btn btn-sm btn-danger" onclick="deleteAttendance('${att.id}')">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openAttendanceModal() {
    if (!requireAuth()) return;

    const select = document.getElementById('att-emp-id');
    select.innerHTML = '';

    if (state.employees.length === 0) {
        showToast('Cadastre um colaborador primeiro.');
        return;
    }

    state.employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `[${emp.code}] ${emp.name} - ${emp.role}`;
        select.appendChild(opt);
    });

    document.getElementById('form-attendance').reset();
    document.getElementById('att-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-attendance').classList.remove('hidden');
}

function handleAttendanceFormSubmit(e) {
    e.preventDefault();
    if (!requireAuth()) return;

    const attData = {
        id: `att_${Date.now()}`,
        employeeId: document.getElementById('att-emp-id').value,
        type: document.getElementById('att-type').value,
        date: document.getElementById('att-date').value,
        notes: document.getElementById('att-notes').value.trim()
    };

    state.attendance.push(attData);
    saveStateToStorage();
    document.getElementById('modal-attendance').classList.add('hidden');
    showToast('Ocorrência registrada no histórico do funcionário!');
}

window.deleteAttendance = function(attId) {
    if (!requireAuth()) return;

    if (confirm('Deseja excluir esta ocorrência?')) {
        state.attendance = state.attendance.filter(a => a.id !== attId);
        saveStateToStorage();
        showToast('Ocorrência removida.');
    }
};

// RENDERIZAR LISTA DE COLABORADORES
function renderEmployees() {
    if (!requireAuth()) return;

    const query = document.getElementById('search-employee').value.toLowerCase();
    const deptFilter = document.getElementById('filter-dept').value;
    const statusFilter = document.getElementById('filter-status').value;

    const filtered = state.employees.filter(emp => {
        const matchSearch = (emp.code && emp.code.toLowerCase().includes(query)) ||
                            emp.name.toLowerCase().includes(query) ||
                            emp.role.toLowerCase().includes(query) ||
                            (emp.cpf && emp.cpf.toLowerCase().includes(query)) ||
                            (emp.email && emp.email.toLowerCase().includes(query));
        const matchDept = deptFilter === 'TODOS' || emp.department === deptFilter;
        const matchStatus = statusFilter === 'TODOS' || emp.status === statusFilter;

        return matchSearch && matchDept && matchStatus;
    });

    const gridContainer = document.getElementById('employees-grid');
    const tableContainer = document.getElementById('employees-table-container');
    const tbody = document.getElementById('employees-tbody');

    if (state.viewMode === 'cards') {
        gridContainer.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        gridContainer.innerHTML = '';

        if (filtered.length === 0) {
            gridContainer.innerHTML = '<p class="text-muted col-12">Nenhum colaborador encontrado com os filtros selecionados.</p>';
            return;
        }

        filtered.forEach(emp => {
            const initials = emp.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            const card = document.createElement('div');
            card.className = 'card employee-card';
            card.innerHTML = `
                <div>
                    <div class="employee-card-header">
                        <div class="emp-avatar">${initials}</div>
                        <div class="emp-details">
                            <span class="badge badge-info mb-1" style="font-size:0.75rem;">${emp.code}</span>
                            <h4>${emp.name}</h4>
                            <div class="emp-role">${emp.role}</div>
                            <div class="emp-dept">${emp.department}</div>
                        </div>
                    </div>
                    <div class="employee-card-body">
                        <div><strong>CPF:</strong> ${emp.cpf || 'Não informado'}</div>
                        <div><strong>Salário:</strong> ${formatCurrency(emp.salary)} (${emp.workload || '44h semanais'})</div>
                        <div><strong>Admissão:</strong> ${formatDate(emp.admissionDate)}</div>
                        <div><strong>E-mail:</strong> ${emp.email || 'Não informado'}</div>
                        <div><strong>Telefone:</strong> ${emp.phone || 'Não informado'}</div>
                    </div>
                </div>
                <div>
                    <div class="flex-between mb-3">
                        <span class="badge ${getStatusBadgeClass(emp.status)}">${emp.status}</span>
                        <button class="btn btn-sm btn-outline" onclick="viewEmployee('${emp.id}')">📋 Ficha</button>
                    </div>
                    <div class="employee-card-actions">
                        <button class="btn btn-sm btn-secondary btn-block" onclick="openEmployeeModal('${emp.id}')">✏️ Editar</button>
                        <button class="btn btn-sm btn-danger btn-block" onclick="deleteEmployee('${emp.id}')">🗑️ Excluir</button>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    } else {
        gridContainer.classList.add('hidden');
        tableContainer.classList.remove('hidden');
        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-muted text-center">Nenhum colaborador encontrado.</td></tr>';
            return;
        }

        filtered.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="color:var(--primary);">${emp.code}</strong></td>
                <td><strong>${emp.name}</strong></td>
                <td>${emp.role}</td>
                <td>${emp.department}</td>
                <td>${formatCurrency(emp.salary)}</td>
                <td><span class="badge badge-info">${emp.workload || '44h semanais'}</span></td>
                <td>${formatDate(emp.admissionDate)}</td>
                <td>${emp.email || '-'}<br><small class="text-muted">${emp.phone || ''}</small></td>
                <td><span class="badge ${getStatusBadgeClass(emp.status)}">${emp.status}</span></td>
                <td class="text-right">
                    <button class="btn btn-sm btn-outline" onclick="viewEmployee('${emp.id}')">📋</button>
                    <button class="btn btn-sm btn-secondary" onclick="openEmployeeModal('${emp.id}')">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${emp.id}')">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function openEmployeeModal(empId = null) {
    if (!requireAuth()) return;

    const modal = document.getElementById('modal-employee');
    const form = document.getElementById('form-employee');
    const errBox = document.getElementById('emp-form-error');
    
    form.reset();
    errBox.classList.add('hidden');
    document.getElementById('dismissal-date-container').classList.add('hidden');

    if (empId) {
        document.getElementById('modal-employee-title').textContent = 'Editar Colaborador';
        const emp = state.employees.find(e => e.id === empId);
        if (emp) {
            document.getElementById('emp-id').value = emp.id;
            document.getElementById('emp-code').value = emp.code || generateNextMatricula();
            document.getElementById('emp-name').value = emp.name;
            document.getElementById('emp-cpf').value = emp.cpf || '';
            document.getElementById('emp-rg').value = emp.rg || '';
            document.getElementById('emp-birth').value = emp.birthDate || '';
            document.getElementById('emp-address').value = emp.address || '';
            document.getElementById('emp-phone').value = emp.phone || '';
            document.getElementById('emp-email').value = emp.email || '';
            
            document.getElementById('emp-role').value = emp.role;
            document.getElementById('emp-dept').value = emp.department;
            document.getElementById('emp-admission').value = emp.admissionDate;
            document.getElementById('emp-salary').value = emp.salary;
            document.getElementById('emp-workload').value = emp.workload || '44h semanais';
            document.getElementById('emp-status').value = emp.status;

            if (emp.status === 'Desligado') {
                document.getElementById('dismissal-date-container').classList.remove('hidden');
                document.getElementById('emp-dismissal').value = emp.dismissalDate || '';
            }
        }
    } else {
        document.getElementById('modal-employee-title').textContent = 'Novo Colaborador';
        document.getElementById('emp-id').value = '';
        document.getElementById('emp-code').value = generateNextMatricula();
        document.getElementById('emp-workload').value = '44h semanais';
    }

    modal.classList.remove('hidden');
}

function handleEmployeeFormSubmit(e) {
    e.preventDefault();
    if (!requireAuth()) return;

    const errBox = document.getElementById('emp-form-error');
    errBox.classList.add('hidden');

    const empId = document.getElementById('emp-id').value;
    const name = document.getElementById('emp-name').value.trim();
    const cpfRaw = document.getElementById('emp-cpf').value.trim();
    const rg = document.getElementById('emp-rg').value.trim();
    const birthDate = document.getElementById('emp-birth').value;
    const address = document.getElementById('emp-address').value.trim();
    const phone = document.getElementById('emp-phone').value.trim();
    const email = document.getElementById('emp-email').value.trim();

    const role = document.getElementById('emp-role').value.trim();
    const department = document.getElementById('emp-dept').value;
    const admissionDate = document.getElementById('emp-admission').value;
    const salaryInput = document.getElementById('emp-salary').value.trim();
    const workload = document.getElementById('emp-workload').value;
    const status = document.getElementById('emp-status').value;
    const dismissalDate = status === 'Desligado' ? (document.getElementById('emp-dismissal').value || new Date().toISOString().split('T')[0]) : '';

    if (!name || name.length < 3) {
        showFormError('Por favor, informe o Nome Completo do colaborador (mínimo 3 caracteres)!');
        return;
    }

    const cpfDigits = cpfRaw.replace(/\D/g, '');
    if (!cpfRaw || cpfDigits.length !== 11) {
        showFormError('O CPF é obrigatório e deve conter exatamente 11 números no formato 000.000.000-00!');
        return;
    }
    const formattedCPF = applyCPFMask(cpfDigits);

    if (!role) {
        showFormError('Por favor, informe o Cargo do colaborador!');
        return;
    }

    if (!department) {
        showFormError('Por favor, selecione um Departamento para o colaborador!');
        return;
    }

    if (!admissionDate) {
        showFormError('Por favor, informe uma Data de Admissão válida!');
        return;
    }

    const salaryNum = parseFloat(salaryInput);
    if (!salaryInput || isNaN(salaryNum) || salaryNum <= 0) {
        showFormError('O Salário Mensal é obrigatório, deve ser um valor numérico e maior que zero!');
        return;
    }

    const empData = {
        id: empId || `emp_${Date.now()}`,
        code: document.getElementById('emp-code').value || generateNextMatricula(),
        
        name: name,
        cpf: formattedCPF,
        rg: rg,
        birthDate: birthDate,
        address: address,
        phone: phone,
        email: email,

        role: role,
        department: department,
        admissionDate: admissionDate,
        dismissalDate: dismissalDate,
        salary: salaryNum,
        workload: workload,
        status: status
    };

    if (empId) {
        const index = state.employees.findIndex(e => e.id === empId);
        if (index !== -1) {
            state.employees[index] = empData;
            showToast('Colaborador atualizado com sucesso!');
        }
    } else {
        state.employees.push(empData);
        showToast(`Novo colaborador cadastrado! Matrícula: ${empData.code}`);
    }

    saveStateToStorage();
    document.getElementById('modal-employee').classList.add('hidden');
}

function showFormError(msg) {
    const errBox = document.getElementById('emp-form-error');
    errBox.textContent = `⚠️ ${msg}`;
    errBox.classList.remove('hidden');
    document.querySelector('.modal-body').scrollTop = 0;
}

window.viewEmployee = function(empId) {
    if (!requireAuth()) return;

    const emp = state.employees.find(e => e.id === empId);
    if (!emp) return;

    const modal = document.getElementById('modal-view-employee');
    const container = document.getElementById('view-employee-content');

    const empEvals = state.evaluations.filter(ev => ev.employeeId === emp.id);
    const empVacations = state.vacations.filter(v => v.employeeId === emp.id);
    const empAttendance = state.attendance.filter(a => a.employeeId === emp.id);

    let evalsHtml = empEvals.length > 0 ? empEvals.map(ev => `
        <div class="card mb-2" style="background:#fcfaff; padding:0.75rem; border-left:3px solid var(--primary);">
            <div><strong>Data:</strong> ${formatDate(ev.date)} | <strong>Nota:</strong> ${ev.rating} ⭐</div>
            <div><strong>Destaques:</strong> ${ev.strengths || '-'}</div>
            <div><strong>A melhorar:</strong> ${ev.improvements || '-'}</div>
        </div>
    `).join('') : '<p class="text-muted text-sm">Nenhuma avaliação realizada.</p>';

    let vacsHtml = empVacations.length > 0 ? empVacations.map(v => `
        <div class="card mb-2" style="background:#fcfaff; padding:0.75rem; border-left:3px solid var(--warning);">
            <div><strong>Período:</strong> ${formatDate(v.startDate)} até ${formatDate(v.endDate)}</div>
            <div><strong>Obs:</strong> ${v.notes || '-'}</div>
        </div>
    `).join('') : '<p class="text-muted text-sm">Nenhum registro de férias.</p>';

    let attHtml = empAttendance.length > 0 ? empAttendance.map(a => `
        <div class="card mb-2" style="background:#fcfaff; padding:0.75rem; border-left:3px solid var(--danger);">
            <div><strong>Data:</strong> ${formatDate(a.date)} | <strong>Tipo:</strong> ${a.type}</div>
            <div><strong>Detalhes:</strong> ${a.notes || '-'}</div>
        </div>
    `).join('') : '<p class="text-muted text-sm">Nenhuma falta ou ocorrência registrada.</p>';

    container.innerHTML = `
        <div style="margin-bottom: 1.5rem;" class="flex-between">
            <div>
                <span class="badge badge-info mb-1" style="font-size:0.85rem;">Matrícula: ${emp.code}</span>
                <h2 style="color: var(--primary); font-size:1.4rem;">${emp.name}</h2>
            </div>
            <span class="badge ${getStatusBadgeClass(emp.status)}">${emp.status}</span>
        </div>

        <h4 style="color:var(--primary); font-size:1.05rem;" class="mb-2">📌 Dados Pessoais</h4>
        <div class="card mb-3" style="background:#fcfaff; padding:1rem;">
            <div class="form-row mb-2">
                <div class="col-6"><strong>CPF:</strong> ${emp.cpf || 'Não informado'}</div>
                <div class="col-6"><strong>RG:</strong> ${emp.rg || 'Não informado'}</div>
            </div>
            <div class="form-row mb-2">
                <div class="col-6"><strong>Data de Nascimento:</strong> ${formatDate(emp.birthDate)}</div>
                <div class="col-6"><strong>Telefone / Whats:</strong> ${emp.phone || 'Não informado'}</div>
            </div>
            <div class="form-row mb-2">
                <div class="col-12"><strong>E-mail:</strong> ${emp.email || 'Não informado'}</div>
            </div>
            <div class="form-row">
                <div class="col-12"><strong>Endereço:</strong> ${emp.address || 'Não informado'}</div>
            </div>
        </div>

        <h4 style="color:var(--primary); font-size:1.05rem;" class="mb-2">💼 Dados Funcionais</h4>
        <div class="card mb-3" style="background:#fcfaff; padding:1rem;">
            <div class="form-row mb-2">
                <div class="col-6"><strong>Cargo:</strong> ${emp.role}</div>
                <div class="col-6"><strong>Departamento:</strong> ${emp.department}</div>
            </div>
            <div class="form-row mb-2">
                <div class="col-6"><strong>Data de Admissão:</strong> ${formatDate(emp.admissionDate)}</div>
                <div class="col-6"><strong>Jornada de Trabalho:</strong> ${emp.workload || '44h semanais'}</div>
            </div>
            <div class="form-row">
                <div class="col-6"><strong>Salário Mensal:</strong> <strong style="color:var(--success);">${formatCurrency(emp.salary)}</strong></div>
                <div class="col-6"><strong>Status Atual:</strong> ${emp.status} ${emp.dismissalDate ? '(' + formatDate(emp.dismissalDate) + ')' : ''}</div>
            </div>
        </div>

        <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border-light);">

        <h4 class="mb-2" style="color:var(--primary);">📋 Histórico de Faltas e Ocorrências</h4>
        ${attHtml}

        <h4 class="mb-2 mt-4" style="color:var(--primary);">⭐ Histórico de Avaliações</h4>
        ${evalsHtml}

        <h4 class="mb-2 mt-4" style="color:var(--primary);">🏖️ Histórico de Férias</h4>
        ${vacsHtml}
    `;

    modal.classList.remove('hidden');
};

window.deleteEmployee = function(empId) {
    if (!requireAuth()) return;

    const emp = state.employees.find(e => e.id === empId);
    if (!emp) return;

    if (confirm(`Tem certeza que deseja desativar ou remover o colaborador ${emp.name} (${emp.code})?`)) {
        state.employees = state.employees.filter(e => e.id !== empId);
        saveStateToStorage();
        showToast('Colaborador removido.');
    }
};

function renderVacationsTable() {
    const tbody = document.getElementById('vacations-tbody');
    tbody.innerHTML = '';

    if (state.vacations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-muted text-center">Nenhum registro de férias cadastrado.</td></tr>';
        return;
    }

    state.vacations.forEach(vac => {
        const emp = state.employees.find(e => e.id === vac.employeeId);
        const days = calcDaysBetween(vac.startDate, vac.endDate);
        const empName = emp ? `${emp.name} (${emp.code})` : 'Desconhecido';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${empName}</strong></td>
            <td>${emp ? emp.role + ' (' + emp.department + ')' : '-'}</td>
            <td>${formatDate(vac.startDate)}</td>
            <td>${formatDate(vac.endDate)}</td>
            <td>${days} dias</td>
            <td><span class="badge badge-warning">Agendado/Em Andamento</span></td>
            <td>${vac.notes || '-'}</td>
            <td class="text-right">
                <button class="btn btn-sm btn-danger" onclick="deleteVacation('${vac.id}')">🗑️ Cancelar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openVacationModal() {
    if (!requireAuth()) return;

    const select = document.getElementById('vac-emp-id');
    select.innerHTML = '';

    if (state.employees.length === 0) {
        showToast('Cadastre um colaborador primeiro.');
        return;
    }

    state.employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `[${emp.code}] ${emp.name} - ${emp.role}`;
        select.appendChild(opt);
    });

    document.getElementById('form-vacation').reset();
    document.getElementById('modal-vacation').classList.remove('hidden');
}

function handleVacationFormSubmit(e) {
    e.preventDefault();
    if (!requireAuth()) return;

    const vacData = {
        id: `vac_${Date.now()}`,
        employeeId: document.getElementById('vac-emp-id').value,
        startDate: document.getElementById('vac-start').value,
        endDate: document.getElementById('vac-end').value,
        notes: document.getElementById('vac-notes').value.trim()
    };

    state.vacations.push(vacData);
    
    const emp = state.employees.find(e => e.id === vacData.employeeId);
    if (emp) {
        emp.status = 'Férias';
    }

    saveStateToStorage();
    document.getElementById('modal-vacation').classList.add('hidden');
    showToast('Período de férias registrado!');
}

window.deleteVacation = function(vacId) {
    if (!requireAuth()) return;

    if (confirm('Deseja cancelar este registro de férias?')) {
        const vac = state.vacations.find(v => v.id === vacId);
        if (vac) {
            const emp = state.employees.find(e => e.id === vac.employeeId);
            if (emp && emp.status === 'Férias') {
                emp.status = 'Ativo';
            }
        }
        state.vacations = state.vacations.filter(v => v.id !== vacId);
        saveStateToStorage();
        showToast('Registro de férias removido.');
    }
};

function renderEvaluationsGrid() {
    const container = document.getElementById('evaluations-grid');
    container.innerHTML = '';

    if (state.evaluations.length === 0) {
        container.innerHTML = '<p class="text-muted col-12">Nenhuma avaliação de desempenho registrada.</p>';
        return;
    }

    state.evaluations.forEach(ev => {
        const emp = state.employees.find(e => e.id === ev.employeeId);
        const empName = emp ? emp.name : 'Colaborador';
        const empCode = emp && emp.code ? ` (${emp.code})` : '';
        const empRole = emp ? emp.role : '';

        const starsHtml = '⭐'.repeat(parseInt(ev.rating) || 1);

        const card = document.createElement('div');
        card.className = 'card eval-card';
        card.innerHTML = `
            <div class="flex-between mb-2">
                <div>
                    <strong>${empName}${empCode}</strong>
                    <div class="text-sm text-muted">${empRole}</div>
                </div>
                <div class="eval-stars">${starsHtml}</div>
            </div>
            <div class="text-sm mb-3"><strong>Data da Avaliação:</strong> ${formatDate(ev.date)}</div>

            <div class="mb-2">
                <strong class="text-sm">Pontos Fortes:</strong>
                <p class="text-sm text-secondary">${ev.strengths || 'Nenhum informado.'}</p>
            </div>

            <div>
                <strong class="text-sm">Pontos a Desenvolver:</strong>
                <p class="text-sm text-secondary">${ev.improvements || 'Nenhum informado.'}</p>
            </div>

            <div class="text-right mt-3">
                <button class="btn btn-sm btn-danger" onclick="deleteEval('${ev.id}')">🗑️ Excluir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function openEvalModal() {
    if (!requireAuth()) return;

    const select = document.getElementById('eval-emp-id');
    select.innerHTML = '';

    if (state.employees.length === 0) {
        showToast('Cadastre um colaborador primeiro.');
        return;
    }

    state.employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `[${emp.code}] ${emp.name} - ${emp.role}`;
        select.appendChild(opt);
    });

    document.getElementById('form-eval').reset();
    document.getElementById('eval-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-eval').classList.remove('hidden');
}

function handleEvalFormSubmit(e) {
    e.preventDefault();
    if (!requireAuth()) return;

    const evalData = {
        id: `eval_${Date.now()}`,
        employeeId: document.getElementById('eval-emp-id').value,
        date: document.getElementById('eval-date').value,
        rating: parseInt(document.getElementById('eval-rating').value) || 5,
        strengths: document.getElementById('eval-strengths').value.trim(),
        improvements: document.getElementById('eval-improvements').value.trim()
    };

    state.evaluations.push(evalData);
    saveStateToStorage();
    document.getElementById('modal-eval').classList.add('hidden');
    showToast('Avaliação de desempenho salva!');
}

window.deleteEval = function(evalId) {
    if (!requireAuth()) return;

    if (confirm('Deseja excluir esta avaliação?')) {
        state.evaluations = state.evaluations.filter(ev => ev.id !== evalId);
        saveStateToStorage();
        showToast('Avaliação excluída.');
    }
};

function exportBackupJSON() {
    if (!requireAuth()) return;

    const dataStr = JSON.stringify({
        employees: state.employees,
        vacations: state.vacations,
        evaluations: state.evaluations,
        attendance: state.attendance,
        exportDate: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `copia_rh_g4_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Cópia dos dados salva com sucesso!');
}

function importBackupJSON(e) {
    if (!requireAuth()) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = JSON.parse(evt.target.result);
            if (data.employees && Array.isArray(data.employees)) {
                state.employees = data.employees;
                state.vacations = data.vacations || [];
                state.evaluations = data.evaluations || [];
                state.attendance = data.attendance || [];
                saveStateToStorage();
                showToast('Cópia dos dados carregada com sucesso!');
            } else {
                alert('Arquivo de cópia inválido.');
            }
        } catch (err) {
            alert('Erro ao ler o arquivo de cópia.');
        }
    };
    reader.readAsText(file);
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'Ativo': return 'badge-success';
        case 'Férias': return 'badge-warning';
        case 'Desligado': return 'badge-danger';
        default: return 'badge-info';
    }
}

function calcDaysBetween(startStr, endStr) {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}
