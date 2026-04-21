import { useState } from "react";
import Icon from "@/components/ui/icon";

type IconName = Parameters<typeof Icon>[0]["name"];

// ─── Types ───────────────────────────────────────────────────────────────────

type Section =
  | "dashboard"
  | "patients"
  | "doctors"
  | "appointments"
  | "records"
  | "lab"
  | "reports";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "М" | "Ж";
  phone: string;
  diagnosis: string;
  status: "active" | "discharged" | "critical";
  lastVisit: string;
  bloodType: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  phone: string;
  schedule: string;
  patients: number;
  status: "available" | "busy" | "off";
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  type: string;
}

interface LabResult {
  id: string;
  patientName: string;
  testName: string;
  date: string;
  result: string;
  norm: string;
  status: "normal" | "abnormal" | "critical";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PATIENTS: Patient[] = [
  { id: "P-0041", name: "Иванова Марина Сергеевна", age: 42, gender: "Ж", phone: "+7 (495) 123-45-67", diagnosis: "Гипертония I ст.", status: "active", lastVisit: "19.04.2026", bloodType: "A(II) Rh+" },
  { id: "P-0042", name: "Петров Андрей Николаевич", age: 57, gender: "М", phone: "+7 (495) 234-56-78", diagnosis: "Сахарный диабет II типа", status: "active", lastVisit: "18.04.2026", bloodType: "O(I) Rh−" },
  { id: "P-0043", name: "Сидорова Елена Вячеславовна", age: 31, gender: "Ж", phone: "+7 (495) 345-67-89", diagnosis: "ОРВИ", status: "discharged", lastVisit: "15.04.2026", bloodType: "B(III) Rh+" },
  { id: "P-0044", name: "Козлов Дмитрий Александрович", age: 68, gender: "М", phone: "+7 (495) 456-78-90", diagnosis: "ИБС, стенокардия", status: "critical", lastVisit: "21.04.2026", bloodType: "AB(IV) Rh+" },
  { id: "P-0045", name: "Новикова Ольга Павловна", age: 29, gender: "Ж", phone: "+7 (495) 567-89-01", diagnosis: "Аллергический ринит", status: "active", lastVisit: "20.04.2026", bloodType: "A(II) Rh−" },
  { id: "P-0046", name: "Морозов Игорь Степанович", age: 51, gender: "М", phone: "+7 (495) 678-90-12", diagnosis: "Остеохондроз", status: "active", lastVisit: "17.04.2026", bloodType: "O(I) Rh+" },
];

const DOCTORS: Doctor[] = [
  { id: "D-001", name: "Волков Сергей Петрович", specialty: "Кардиолог", department: "Кардиология", phone: "+7 (495) 111-22-33", schedule: "Пн–Пт 9:00–17:00", patients: 24, status: "available" },
  { id: "D-002", name: "Смирнова Наталья Юрьевна", specialty: "Терапевт", department: "Терапия", phone: "+7 (495) 222-33-44", schedule: "Пн–Пт 8:00–16:00", patients: 31, status: "busy" },
  { id: "D-003", name: "Кузнецов Алексей Михайлович", specialty: "Невролог", department: "Неврология", phone: "+7 (495) 333-44-55", schedule: "Вт, Чт, Сб 10:00–18:00", patients: 18, status: "available" },
  { id: "D-004", name: "Попова Ирина Дмитриевна", specialty: "Эндокринолог", department: "Эндокринология", phone: "+7 (495) 444-55-66", schedule: "Пн–Пт 9:00–15:00", patients: 22, status: "off" },
  { id: "D-005", name: "Захаров Виктор Олегович", specialty: "Хирург", department: "Хирургия", phone: "+7 (495) 555-66-77", schedule: "Пн–Пт 8:00–20:00", patients: 15, status: "busy" },
];

const APPOINTMENTS: Appointment[] = [
  { id: "A-1201", patientName: "Иванова М.С.", doctorName: "Волков С.П.", specialty: "Кардиология", date: "21.04.2026", time: "10:30", status: "scheduled", type: "Первичный приём" },
  { id: "A-1202", patientName: "Петров А.Н.", doctorName: "Попова И.Д.", specialty: "Эндокринология", date: "21.04.2026", time: "11:15", status: "completed", type: "Повторный приём" },
  { id: "A-1203", patientName: "Козлов Д.А.", doctorName: "Волков С.П.", specialty: "Кардиология", date: "21.04.2026", time: "12:00", status: "scheduled", type: "Консультация" },
  { id: "A-1204", patientName: "Сидорова Е.В.", doctorName: "Смирнова Н.Ю.", specialty: "Терапия", date: "20.04.2026", time: "14:30", status: "completed", type: "Осмотр" },
  { id: "A-1205", patientName: "Новикова О.П.", doctorName: "Кузнецов А.М.", specialty: "Неврология", date: "22.04.2026", time: "09:00", status: "scheduled", type: "Первичный приём" },
  { id: "A-1206", patientName: "Морозов И.С.", doctorName: "Захаров В.О.", specialty: "Хирургия", date: "19.04.2026", time: "16:00", status: "cancelled", type: "Операция" },
];

const LAB_RESULTS: LabResult[] = [
  { id: "L-3301", patientName: "Петров А.Н.", testName: "Глюкоза крови", date: "20.04.2026", result: "8.4 ммоль/л", norm: "3.9–6.1", status: "abnormal" },
  { id: "L-3302", patientName: "Козлов Д.А.", testName: "Тропонин I", date: "21.04.2026", result: "2.1 нг/мл", norm: "< 0.04", status: "critical" },
  { id: "L-3303", patientName: "Иванова М.С.", testName: "АД систолическое", date: "19.04.2026", result: "145 мм рт.ст.", norm: "< 130", status: "abnormal" },
  { id: "L-3304", patientName: "Новикова О.П.", testName: "ОАК (лейкоциты)", date: "18.04.2026", result: "5.8 × 10⁹/л", norm: "4.0–9.0", status: "normal" },
  { id: "L-3305", patientName: "Сидорова Е.В.", testName: "СРБ", date: "15.04.2026", result: "4.2 мг/л", norm: "< 5.0", status: "normal" },
  { id: "L-3306", patientName: "Морозов И.С.", testName: "МРТ позвоночника", date: "17.04.2026", result: "Протрузия L4–L5", norm: "—", status: "abnormal" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusLabel: Record<Patient["status"], string> = {
  active: "Активный",
  discharged: "Выписан",
  critical: "Критический",
};

const apptStatusLabel: Record<Appointment["status"], string> = {
  scheduled: "Запланирован",
  completed: "Завершён",
  cancelled: "Отменён",
};

const doctorStatusLabel: Record<Doctor["status"], string> = {
  available: "Свободен",
  busy: "Занят",
  off: "Не работает",
};

const labStatusLabel: Record<LabResult["status"], string> = {
  normal: "Норма",
  abnormal: "Отклонение",
  critical: "Критично",
};

function PatientBadge({ status }: { status: Patient["status"] }) {
  const cls = status === "active" ? "med-badge-green" : status === "critical" ? "med-badge-red" : "med-badge-gray";
  return <span className={cls}>{statusLabel[status]}</span>;
}

function DoctorBadge({ status }: { status: Doctor["status"] }) {
  const cls = status === "available" ? "med-badge-green" : status === "busy" ? "med-badge-blue" : "med-badge-gray";
  return <span className={cls}>{doctorStatusLabel[status]}</span>;
}

function ApptBadge({ status }: { status: Appointment["status"] }) {
  const cls = status === "completed" ? "med-badge-green" : status === "scheduled" ? "med-badge-blue" : "med-badge-red";
  return <span className={cls}>{apptStatusLabel[status]}</span>;
}

function LabBadge({ status }: { status: LabResult["status"] }) {
  const cls = status === "normal" ? "med-badge-green" : status === "critical" ? "med-badge-red" : "med-badge-yellow";
  return <span className={cls}>{labStatusLabel[status]}</span>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: Section; icon: string; label: string }[] = [
  { key: "dashboard", icon: "LayoutDashboard", label: "Дашборд" },
  { key: "patients", icon: "Users", label: "Пациенты" },
  { key: "doctors", icon: "Stethoscope", label: "Врачи" },
  { key: "appointments", icon: "CalendarCheck", label: "Приёмы" },
  { key: "records", icon: "FileText", label: "История болезни" },
  { key: "lab", icon: "FlaskConical", label: "Анализы и тесты" },
  { key: "reports", icon: "BarChart2", label: "Отчёты" },
];

function Sidebar({ active, onSelect }: { active: Section; onSelect: (s: Section) => void }) {
  return (
    <aside className="w-60 flex-shrink-0 sidebar-dark flex flex-col h-screen sticky top-0 scrollbar-thin overflow-y-auto">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--med-teal))" }}>
          <span className="cross-icon" />
        </div>
        <div>
          <div className="text-white font-semibold text-sm leading-tight">МедСистема</div>
          <div className="text-white/40 text-[10px] font-mono-med tracking-wider uppercase">v1.0.0</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <div className="text-white/30 text-[10px] uppercase tracking-widest px-3 mb-2 font-medium">Навигация</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`nav-item w-full text-left ${active === item.key ? "nav-item-active" : "nav-item-inactive"}`}
          >
            <Icon name={item.icon as IconName} size={16} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Icon name="UserRound" size={15} className="text-white/60" />
          </div>
          <div>
            <div className="text-white text-xs font-medium">Администратор</div>
            <div className="text-white/40 text-[10px]">admin@clinic.ru</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const stats = [
    { label: "Пациентов всего", value: "248", icon: "Users", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Приёмов сегодня", value: "34", icon: "CalendarCheck", color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Активных врачей", value: "12", icon: "Stethoscope", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Критических случаев", value: "3", icon: "AlertTriangle", color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Дашборд</h1>
        <p className="text-muted-foreground text-sm mt-1">Вторник, 21 апреля 2026</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <Icon name={s.icon as IconName} size={16} className={s.color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="med-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-foreground">Приёмы сегодня</h2>
            <span className="med-badge-blue">21.04.2026</span>
          </div>
          <div className="space-y-3">
            {APPOINTMENTS.filter(a => a.date === "21.04.2026").map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" size={14} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{a.patientName}</div>
                    <div className="text-xs text-muted-foreground">{a.doctorName} · {a.time}</div>
                  </div>
                </div>
                <ApptBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="med-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-foreground">Критические анализы</h2>
            <span className="med-badge-red">Требуют внимания</span>
          </div>
          <div className="space-y-3">
            {LAB_RESULTS.filter(l => l.status !== "normal").map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium text-foreground">{l.patientName}</div>
                  <div className="text-xs text-muted-foreground">{l.testName} · {l.result}</div>
                </div>
                <LabBadge status={l.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="med-card p-5">
        <h2 className="font-semibold text-sm text-foreground mb-4">Быстрые действия</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "UserPlus", label: "Новый пациент", color: "bg-blue-600 text-white" },
            { icon: "CalendarPlus", label: "Записать на приём", color: "bg-teal-600 text-white" },
            { icon: "FileText", label: "Создать справку", color: "bg-indigo-600 text-white" },
            { icon: "FlaskConical", label: "Назначить анализ", color: "bg-amber-500 text-white" },
            { icon: "Download", label: "Экспорт данных", color: "bg-gray-700 text-white" },
          ].map((a) => (
            <button key={a.label} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${a.color} hover:opacity-90 transition-opacity`}>
              <Icon name={a.icon as IconName} size={15} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Patients ─────────────────────────────────────────────────────────────────

function PatientsSection() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return (
      <div className="animate-fade-in space-y-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="ArrowLeft" size={16} />
          Назад к списку
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="med-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: "hsl(var(--med-blue))" }}>
                {selected.name[0]}
              </div>
              <div>
                <div className="font-semibold text-foreground">{selected.name}</div>
                <div className="text-sm text-muted-foreground">{selected.id}</div>
                <div className="mt-1"><PatientBadge status={selected.status} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Возраст", value: `${selected.age} лет` },
                { label: "Пол", value: selected.gender },
                { label: "Группа крови", value: selected.bloodType },
                { label: "Телефон", value: selected.phone },
                { label: "Последний визит", value: selected.lastVisit },
                { label: "Диагноз", value: selected.diagnosis },
              ].map((r) => (
                <div key={r.label}>
                  <div className="text-muted-foreground text-xs">{r.label}</div>
                  <div className="font-medium text-foreground">{r.value}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Icon name="FilePlus" size={15} />
                Создать справку
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors text-foreground">
                <Icon name="Pill" size={15} />
                Назначить лечение
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="med-card p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Icon name="Activity" size={16} className="text-primary" />
                История обращений
              </h3>
              <div className="space-y-3">
                {[
                  { date: "19.04.2026", type: "Плановый осмотр", doctor: "Волков С.П.", note: "АД 145/90, назначена корректировка дозы препарата" },
                  { date: "05.03.2026", type: "Повторный приём", doctor: "Волков С.П.", note: "Жалобы на головные боли. ЭКГ без патологий." },
                  { date: "12.01.2026", type: "Первичный приём", doctor: "Смирнова Н.Ю.", note: "Установлен диагноз. Направлена к кардиологу." },
                ].map((h, i) => (
                  <div key={i} className="flex gap-4 text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="text-muted-foreground font-mono-med text-xs w-24 flex-shrink-0 pt-0.5">{h.date}</div>
                    <div>
                      <div className="font-medium text-foreground">{h.type} — {h.doctor}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{h.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="med-card p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Icon name="Pill" size={16} className="text-teal-600" />
                Текущие назначения
              </h3>
              <div className="space-y-2">
                {[
                  { drug: "Лизиноприл", dose: "10 мг", schedule: "1 раз в сутки утром", duration: "Постоянно" },
                  { drug: "Амлодипин", dose: "5 мг", schedule: "1 раз в сутки вечером", duration: "3 месяца" },
                  { drug: "Аспирин кардио", dose: "100 мг", schedule: "1 раз в сутки", duration: "Постоянно" },
                ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 text-sm">
                    <div>
                      <span className="font-medium text-foreground">{d.drug}</span>
                      <span className="text-muted-foreground ml-2">{d.dose}</span>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{d.schedule}</div>
                      <div>{d.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Пациенты</h1>
          <p className="text-muted-foreground text-sm mt-1">{PATIENTS.length} записей</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Icon name="UserPlus" size={15} />
          Добавить пациента
        </button>
      </div>

      <div className="relative">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Поиск по имени или диагнозу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="med-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["ID", "Пациент", "Возраст", "Диагноз", "Последний визит", "Статус", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono-med text-xs text-muted-foreground">{p.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{p.name[0]}</div>
                    <div>
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.bloodType}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{p.age} лет</td>
                <td className="px-4 py-3 text-foreground max-w-[180px] truncate">{p.diagnosis}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono-med text-xs">{p.lastVisit}</td>
                <td className="px-4 py-3"><PatientBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelected(p)} className="text-primary hover:underline text-xs font-medium">
                    Открыть
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

function DoctorsSection() {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Врачи</h1>
          <p className="text-muted-foreground text-sm mt-1">{DOCTORS.length} специалистов</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Icon name="Plus" size={15} />
          Добавить врача
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DOCTORS.map((d) => (
          <div key={d.id} className="med-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: "hsl(var(--med-blue))" }}>
                  {d.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.id}</div>
                </div>
              </div>
              <DoctorBadge status={d.status} />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Icon name="Stethoscope" size={14} className="text-muted-foreground flex-shrink-0" />
                <span>{d.specialty} · {d.department}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Phone" size={14} className="flex-shrink-0" />
                <span>{d.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Clock" size={14} className="flex-shrink-0" />
                <span>{d.schedule}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Users" size={14} className="flex-shrink-0" />
                <span>Пациентов: <span className="text-foreground font-medium">{d.patients}</span></span>
              </div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-border">
              <button className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors">
                Расписание
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                Пациенты
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Appointments ─────────────────────────────────────────────────────────────

function AppointmentsSection() {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Приёмы</h1>
          <p className="text-muted-foreground text-sm mt-1">{APPOINTMENTS.length} записей</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Icon name="CalendarPlus" size={15} />
          Записать на приём
        </button>
      </div>

      <div className="med-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["№", "Пациент", "Врач / Специализация", "Дата и время", "Тип", "Статус"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {APPOINTMENTS.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono-med text-xs text-muted-foreground">{a.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-xs font-semibold text-teal-700">{a.patientName[0]}</div>
                    <span className="font-medium text-foreground">{a.patientName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{a.doctorName}</div>
                  <div className="text-xs text-muted-foreground">{a.specialty}</div>
                </td>
                <td className="px-4 py-3 font-mono-med text-xs">
                  <div className="text-foreground">{a.date}</div>
                  <div className="text-muted-foreground">{a.time}</div>
                </td>
                <td className="px-4 py-3 text-foreground">{a.type}</td>
                <td className="px-4 py-3"><ApptBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Medical Records ──────────────────────────────────────────────────────────

function RecordsSection() {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">История болезни</h1>
          <p className="text-muted-foreground text-sm mt-1">Электронные медицинские карты</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted text-foreground transition-colors">
          <Icon name="Download" size={15} />
          Экспорт документов
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {PATIENTS.map((p) => (
          <div key={p.id} className="med-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "hsl(var(--med-blue))" }}>
                  {p.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.id} · {p.age} лет · {p.bloodType}</div>
                </div>
              </div>
              <PatientBadge status={p.status} />
            </div>

            <div className="bg-muted/50 rounded-lg px-4 py-3 mb-4">
              <div className="text-xs text-muted-foreground mb-1">Основной диагноз</div>
              <div className="text-sm font-medium text-foreground">{p.diagnosis}</div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Icon name="FileText" size={13} />
                Карта
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors">
                <Icon name="Pill" size={13} />
                Назначения
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors">
                <Icon name="Download" size={13} />
                Справка PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Lab ──────────────────────────────────────────────────────────────────────

function LabSection() {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Анализы и тесты</h1>
          <p className="text-muted-foreground text-sm mt-1">{LAB_RESULTS.length} результатов</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Icon name="Plus" size={15} />
          Добавить результат
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Норма", count: LAB_RESULTS.filter(l => l.status === "normal").length, cls: "med-badge-green" },
          { label: "Отклонение", count: LAB_RESULTS.filter(l => l.status === "abnormal").length, cls: "med-badge-yellow" },
          { label: "Критично", count: LAB_RESULTS.filter(l => l.status === "critical").length, cls: "med-badge-red" },
        ].map((s) => (
          <div key={s.label} className="stat-card items-center text-center">
            <div className="text-2xl font-bold text-foreground">{s.count}</div>
            <span className={s.cls}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="med-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["№", "Пациент", "Тест / Анализ", "Результат", "Норма", "Дата", "Статус"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LAB_RESULTS.map((l) => (
              <tr key={l.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${l.status === "critical" ? "bg-red-50/50" : ""}`}>
                <td className="px-4 py-3 font-mono-med text-xs text-muted-foreground">{l.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{l.patientName}</td>
                <td className="px-4 py-3 text-foreground">{l.testName}</td>
                <td className="px-4 py-3 font-mono-med text-sm font-medium text-foreground">{l.result}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono-med text-xs">{l.norm}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono-med text-xs">{l.date}</td>
                <td className="px-4 py-3"><LabBadge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────

function ReportsSection() {
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
  const patientData = [42, 55, 61, 48, 70, 65];
  const maxVal = Math.max(...patientData);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Отчёты и статистика</h1>
          <p className="text-muted-foreground text-sm mt-1">2026 год · Данные по клинике</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted text-foreground transition-colors">
          <Icon name="Download" size={15} />
          Выгрузить отчёт
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Приёмов за апрель", value: "341", delta: "+12%", positive: true },
          { label: "Новых пациентов", value: "28", delta: "+5%", positive: true },
          { label: "Выписано", value: "19", delta: "−3%", positive: false },
          { label: "Средняя загрузка", value: "74%", delta: "+2%", positive: true },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
            <div className="text-3xl font-bold text-foreground">{s.value}</div>
            <span className={`text-xs font-medium ${s.positive ? "text-green-600" : "text-red-500"}`}>{s.delta} к пред. месяцу</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="med-card p-5">
          <h2 className="font-semibold text-sm text-foreground mb-5">Приёмы по месяцам</h2>
          <div className="flex items-end gap-3 h-40">
            {patientData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{v}</span>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(v / maxVal) * 100}%`,
                    background: i === months.length - 1 ? "hsl(var(--med-teal))" : "hsl(var(--med-blue))",
                    opacity: i === months.length - 1 ? 1 : 0.6,
                  }}
                />
                <span className="text-xs text-muted-foreground">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="med-card p-5">
          <h2 className="font-semibold text-sm text-foreground mb-4">Топ диагнозов</h2>
          <div className="space-y-3">
            {[
              { name: "Гипертония", count: 58, pct: 82 },
              { name: "Сахарный диабет II типа", count: 41, pct: 58 },
              { name: "ИБС", count: 29, pct: 41 },
              { name: "Остеохондроз", count: 25, pct: 35 },
              { name: "Аллергические заболевания", count: 18, pct: 25 },
            ].map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{d.name}</span>
                  <span className="text-muted-foreground font-mono-med">{d.count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: "hsl(var(--med-blue))" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="med-card p-5">
        <h2 className="font-semibold text-sm text-foreground mb-4">Загрузка отделений</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { dept: "Кардиология", load: 89, color: "hsl(var(--med-danger))" },
            { dept: "Терапия", load: 76, color: "hsl(var(--med-blue))" },
            { dept: "Неврология", load: 62, color: "hsl(var(--med-teal))" },
            { dept: "Эндокринология", load: 58, color: "hsl(var(--med-warning))" },
            { dept: "Хирургия", load: 44, color: "hsl(var(--med-success))" },
          ].map((d) => (
            <div key={d.dept} className="flex flex-col items-center gap-2">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                  <circle
                    cx="32" cy="32" r="26" fill="none"
                    stroke={d.color} strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - d.load / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                  {d.load}%
                </div>
              </div>
              <div className="text-xs text-center text-muted-foreground leading-tight">{d.dept}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function Index() {
  const [section, setSection] = useState<Section>("dashboard");

  const renderContent = () => {
    switch (section) {
      case "dashboard": return <Dashboard />;
      case "patients": return <PatientsSection />;
      case "doctors": return <DoctorsSection />;
      case "appointments": return <AppointmentsSection />;
      case "records": return <RecordsSection />;
      case "lab": return <LabSection />;
      case "reports": return <ReportsSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar active={section} onSelect={setSection} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-7">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}