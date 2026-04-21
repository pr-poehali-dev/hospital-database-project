import { useState } from "react";
import Icon from "@/components/ui/icon";

type IconName = Parameters<typeof Icon>[0]["name"];

// ─── Types ────────────────────────────────────────────────────────────────────

type Section =
  | "dashboard" | "patients" | "doctors" | "appointments"
  | "records" | "lab" | "reports" | "reception" | "cabinet";

interface Patient {
  id: string;
  name: string;
  dob: string;
  age: number;
  gender: "М" | "Ж";
  phone: string;
  address: string;
  diagnosis: string;
  status: "active" | "discharged" | "critical" | "hospitalized";
  lastVisit: string;
  bloodType: string;
  allergies: string;
  policyNumber: string;
  examinations: Examination[];
  prescriptions: Prescription[];
}

interface Examination {
  id: string;
  date: string;
  doctor: string;
  type: string;
  complaint: string;
  objectiveStatus: string;
  conclusion: string;
  recommendations: string;
}

interface Prescription {
  drug: string;
  dose: string;
  schedule: string;
  duration: string;
  prescribed: string;
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
  category: string;
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

interface ReceptionEntry {
  id: string;
  patientName: string;
  arrivalTime: string;
  arrivalType: "ambulance" | "self" | "planned" | "transfer" | "emergency";
  complaint: string;
  triage: "red" | "yellow" | "green" | "blue";
  status: "waiting" | "in_exam" | "admitted" | "discharged" | "transferred";
  assignedDoctor: string;
  ward?: string;
  notes: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INIT_PATIENTS: Patient[] = [
  {
    id: "P-0041", name: "Иванова Марина Сергеевна", dob: "12.03.1984", age: 42, gender: "Ж",
    phone: "+7 (495) 123-45-67", address: "г. Москва, ул. Лесная, д. 15, кв. 42",
    diagnosis: "Гипертония I ст.", status: "active", lastVisit: "19.04.2026",
    bloodType: "A(II) Rh+", allergies: "Пенициллин", policyNumber: "7812 0012345678",
    examinations: [
      { id: "E-001", date: "19.04.2026", doctor: "Волков С.П.", type: "Плановый осмотр",
        complaint: "Головные боли, повышение АД до 155/95",
        objectiveStatus: "Общее состояние удовлетворительное. АД 145/90 мм рт.ст. ЧСС 78 уд/мин. Тоны сердца ясные.",
        conclusion: "Гипертония I ст. Целевое АД не достигнуто на текущей дозе.",
        recommendations: "Корректировка дозы лизиноприла до 20 мг. Контроль АД ежедневно." },
      { id: "E-002", date: "05.03.2026", doctor: "Волков С.П.", type: "Повторный приём",
        complaint: "Периодические головные боли в затылочной области",
        objectiveStatus: "АД 140/88 мм рт.ст. ЧСС 76 уд/мин. ЭКГ без патологий.",
        conclusion: "Стабилизация АД на фоне лечения. Продолжить терапию.",
        recommendations: "Диета с ограничением соли. Повторный осмотр через 6 недель." }
    ],
    prescriptions: [
      { drug: "Лизиноприл", dose: "10 мг", schedule: "1 раз/сутки утром", duration: "Постоянно", prescribed: "Волков С.П." },
      { drug: "Амлодипин", dose: "5 мг", schedule: "1 раз/сутки вечером", duration: "3 месяца", prescribed: "Волков С.П." },
    ]
  },
  {
    id: "P-0042", name: "Петров Андрей Николаевич", dob: "07.11.1969", age: 57, gender: "М",
    phone: "+7 (495) 234-56-78", address: "г. Москва, пр. Мира, д. 88, кв. 5",
    diagnosis: "Сахарный диабет II типа", status: "active", lastVisit: "18.04.2026",
    bloodType: "O(I) Rh−", allergies: "Нет", policyNumber: "7812 0098765432",
    examinations: [
      { id: "E-003", date: "18.04.2026", doctor: "Попова И.Д.", type: "Плановый осмотр",
        complaint: "Жажда, повышенная утомляемость, сухость кожи",
        objectiveStatus: "Состояние удовлетворительное. Сахар крови 8.4 ммоль/л. ИМТ 29.2.",
        conclusion: "СД II типа, субкомпенсация. Гликированный гемоглобин 8.1%.",
        recommendations: "Увеличить дозу метформина. Диабетическая диета. Физическая активность." }
    ],
    prescriptions: [
      { drug: "Метформин", dose: "1000 мг", schedule: "2 раза/сутки с едой", duration: "Постоянно", prescribed: "Попова И.Д." },
      { drug: "Глибенкламид", dose: "5 мг", schedule: "Утром перед едой", duration: "Постоянно", prescribed: "Попова И.Д." },
    ]
  },
  {
    id: "P-0043", name: "Сидорова Елена Вячеславовна", dob: "25.08.1995", age: 31, gender: "Ж",
    phone: "+7 (495) 345-67-89", address: "г. Москва, ул. Садовая, д. 3",
    diagnosis: "ОРВИ", status: "discharged", lastVisit: "15.04.2026",
    bloodType: "B(III) Rh+", allergies: "Нет", policyNumber: "7812 0011223344",
    examinations: [],
    prescriptions: []
  },
  {
    id: "P-0044", name: "Козлов Дмитрий Александрович", dob: "14.02.1958", age: 68, gender: "М",
    phone: "+7 (495) 456-78-90", address: "г. Москва, ул. Тверская, д. 22, кв. 10",
    diagnosis: "ИБС, стенокардия", status: "critical", lastVisit: "21.04.2026",
    bloodType: "AB(IV) Rh+", allergies: "Аспирин (непереносимость)", policyNumber: "7812 0055667788",
    examinations: [],
    prescriptions: [
      { drug: "Бисопролол", dose: "5 мг", schedule: "1 раз/сутки утром", duration: "Постоянно", prescribed: "Волков С.П." },
      { drug: "Аторвастатин", dose: "20 мг", schedule: "1 раз/сутки вечером", duration: "Постоянно", prescribed: "Волков С.П." },
    ]
  },
  {
    id: "P-0045", name: "Новикова Ольга Павловна", dob: "03.06.1997", age: 29, gender: "Ж",
    phone: "+7 (495) 567-89-01", address: "г. Москва, ул. Ленина, д. 7",
    diagnosis: "Аллергический ринит", status: "active", lastVisit: "20.04.2026",
    bloodType: "A(II) Rh−", allergies: "Пыльца берёзы, пыль", policyNumber: "7812 0099887766",
    examinations: [],
    prescriptions: []
  },
  {
    id: "P-0046", name: "Морозов Игорь Степанович", dob: "19.09.1975", age: 51, gender: "М",
    phone: "+7 (495) 678-90-12", address: "г. Москва, ул. Красная, д. 44",
    diagnosis: "Остеохондроз", status: "active", lastVisit: "17.04.2026",
    bloodType: "O(I) Rh+", allergies: "Нет", policyNumber: "7812 0044332211",
    examinations: [],
    prescriptions: []
  },
];

const DOCTORS: Doctor[] = [
  { id: "D-001", name: "Волков Сергей Петрович", specialty: "Кардиолог", department: "Кардиология", phone: "+7 (495) 111-22-33", schedule: "Пн–Пт 9:00–17:00", patients: 24, status: "available", category: "Высшая категория" },
  { id: "D-002", name: "Смирнова Наталья Юрьевна", specialty: "Терапевт", department: "Терапия", phone: "+7 (495) 222-33-44", schedule: "Пн–Пт 8:00–16:00", patients: 31, status: "busy", category: "Первая категория" },
  { id: "D-003", name: "Кузнецов Алексей Михайлович", specialty: "Невролог", department: "Неврология", phone: "+7 (495) 333-44-55", schedule: "Вт, Чт, Сб 10:00–18:00", patients: 18, status: "available", category: "Высшая категория" },
  { id: "D-004", name: "Попова Ирина Дмитриевна", specialty: "Эндокринолог", department: "Эндокринология", phone: "+7 (495) 444-55-66", schedule: "Пн–Пт 9:00–15:00", patients: 22, status: "off", category: "Вторая категория" },
  { id: "D-005", name: "Захаров Виктор Олегович", specialty: "Хирург", department: "Хирургия", phone: "+7 (495) 555-66-77", schedule: "Пн–Пт 8:00–20:00", patients: 15, status: "busy", category: "Высшая категория" },
];

const APPOINTMENTS: Appointment[] = [
  { id: "A-1201", patientName: "Иванова М.С.", doctorName: "Волков С.П.", specialty: "Кардиология", date: "21.04.2026", time: "10:30", status: "scheduled", type: "Первичный приём" },
  { id: "A-1202", patientName: "Петров А.Н.", doctorName: "Попова И.Д.", specialty: "Эндокринология", date: "21.04.2026", time: "11:15", status: "completed", type: "Повторный приём" },
  { id: "A-1203", patientName: "Козлов Д.А.", doctorName: "Волков С.П.", specialty: "Кардиология", date: "21.04.2026", time: "12:00", status: "scheduled", type: "Консультация" },
  { id: "A-1204", patientName: "Сидорова Е.В.", doctorName: "Смирнова Н.Ю.", specialty: "Терапия", date: "20.04.2026", time: "14:30", status: "completed", type: "Осмотр" },
  { id: "A-1205", patientName: "Новикова О.П.", doctorName: "Кузнецов А.М.", specialty: "Неврология", date: "22.04.2026", time: "09:00", status: "scheduled", type: "Первичный приём" },
];

const LAB_RESULTS: LabResult[] = [
  { id: "L-3301", patientName: "Петров А.Н.", testName: "Глюкоза крови", date: "20.04.2026", result: "8.4 ммоль/л", norm: "3.9–6.1", status: "abnormal" },
  { id: "L-3302", patientName: "Козлов Д.А.", testName: "Тропонин I", date: "21.04.2026", result: "2.1 нг/мл", norm: "< 0.04", status: "critical" },
  { id: "L-3303", patientName: "Иванова М.С.", testName: "АД систолическое", date: "19.04.2026", result: "145 мм рт.ст.", norm: "< 130", status: "abnormal" },
  { id: "L-3304", patientName: "Новикова О.П.", testName: "ОАК (лейкоциты)", date: "18.04.2026", result: "5.8 × 10⁹/л", norm: "4.0–9.0", status: "normal" },
  { id: "L-3305", patientName: "Сидорова Е.В.", testName: "СРБ", date: "15.04.2026", result: "4.2 мг/л", norm: "< 5.0", status: "normal" },
  { id: "L-3306", patientName: "Морозов И.С.", testName: "МРТ позвоночника", date: "17.04.2026", result: "Протрузия L4–L5", norm: "—", status: "abnormal" },
];

const INIT_RECEPTION: ReceptionEntry[] = [
  { id: "R-001", patientName: "Козлов Дмитрий Александрович", arrivalTime: "08:14", arrivalType: "ambulance", complaint: "Боли за грудиной, одышка, потливость", triage: "red", status: "admitted", assignedDoctor: "Волков С.П.", ward: "Кардиология, пал. 3", notes: "ЭКГ изменения — подозрение на ОКС" },
  { id: "R-002", patientName: "Белова Татьяна Игоревна", arrivalTime: "09:32", arrivalType: "self", complaint: "Температура 39.2, кашель 5 дней", triage: "yellow", status: "in_exam", assignedDoctor: "Смирнова Н.Ю.", notes: "Направлена в кабинет №4" },
  { id: "R-003", patientName: "Громов Виталий Павлович", arrivalTime: "10:05", arrivalType: "planned", complaint: "Плановая госпитализация — холецистэктомия", triage: "green", status: "admitted", assignedDoctor: "Захаров В.О.", ward: "Хирургия, пал. 7", notes: "" },
  { id: "R-004", patientName: "Фролова Анна Сергеевна", arrivalTime: "10:47", arrivalType: "self", complaint: "Головокружение, шум в ушах", triage: "yellow", status: "waiting", assignedDoctor: "Кузнецов А.М.", notes: "Ожидает у кабинета №8" },
  { id: "R-005", patientName: "Орлов Константин Витальевич", arrivalTime: "11:20", arrivalType: "emergency", complaint: "Травма — перелом лучевой кости", triage: "yellow", status: "in_exam", assignedDoctor: "Захаров В.О.", notes: "Рентген выполнен, ожидает репозиции" },
  { id: "R-006", patientName: "Никитина Светлана Борисовна", arrivalTime: "12:03", arrivalType: "transfer", complaint: "Перевод из ГКБ №5 — ЧМТ средней степени", triage: "red", status: "admitted", assignedDoctor: "Кузнецов А.М.", ward: "Нейрохирургия, пал. 2", notes: "Прибыла с медицинской документацией" },
];

// ─── Helpers & Badges ─────────────────────────────────────────────────────────

function Badge({ children, variant }: { children: React.ReactNode; variant: "green" | "blue" | "red" | "yellow" | "gray" | "purple" }) {
  const map = { green: "med-badge-green", blue: "med-badge-blue", red: "med-badge-red", yellow: "med-badge-yellow", gray: "med-badge-gray", purple: "bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2 py-0.5 rounded-full font-medium" };
  return <span className={map[variant]}>{children}</span>;
}

const arrivalTypeLabel: Record<ReceptionEntry["arrivalType"], string> = {
  ambulance: "Скорая помощь", self: "Самообращение", planned: "Плановая", transfer: "Перевод", emergency: "Экстренная"
};
const arrivalTypeVariant: Record<ReceptionEntry["arrivalType"], "red" | "blue" | "green" | "yellow" | "purple"> = {
  ambulance: "red", self: "blue", planned: "green", transfer: "purple", emergency: "yellow"
};
const triageLabel: Record<ReceptionEntry["triage"], string> = { red: "Красный", yellow: "Жёлтый", green: "Зелёный", blue: "Синий" };
const triageColor: Record<ReceptionEntry["triage"], string> = { red: "#dc2626", yellow: "#d97706", green: "#16a34a", blue: "#2563eb" };
const receptionStatusLabel: Record<ReceptionEntry["status"], string> = { waiting: "Ожидает", in_exam: "На осмотре", admitted: "Госпитализирован", discharged: "Выписан", transferred: "Переведён" };
const receptionStatusVariant: Record<ReceptionEntry["status"], "yellow" | "blue" | "green" | "gray" | "purple"> = { waiting: "yellow", in_exam: "blue", admitted: "green", discharged: "gray", transferred: "purple" };

function PatientBadge({ status }: { status: Patient["status"] }) {
  const map: Record<Patient["status"], { label: string; v: "green" | "red" | "gray" | "blue" }> = {
    active: { label: "Активный", v: "green" }, discharged: { label: "Выписан", v: "gray" },
    critical: { label: "Критический", v: "red" }, hospitalized: { label: "Госпитализирован", v: "blue" }
  };
  return <Badge variant={map[status].v}>{map[status].label}</Badge>;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(10,20,40,0.55)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground text-lg">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Add Patient Form ─────────────────────────────────────────────────────────

function AddPatientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Patient) => void }) {
  const [form, setForm] = useState({ name: "", dob: "", gender: "М" as "М" | "Ж", phone: "", address: "", diagnosis: "", bloodType: "", allergies: "", policyNumber: "" });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const now = new Date();
    const dob = form.dob ? new Date(form.dob) : null;
    const age = dob ? Math.floor((now.getTime() - dob.getTime()) / (365.25 * 24 * 3600 * 1000)) : 0;
    const id = "P-" + String(Math.floor(1000 + Math.random() * 9000));
    onAdd({ ...form, id, age, status: "active", lastVisit: now.toLocaleDateString("ru-RU"), examinations: [], prescriptions: [] } as Patient);
    onClose();
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>{children}</div>
  );
  const Input = ({ k, placeholder, type = "text" }: { k: keyof typeof form; placeholder?: string; type?: string }) => (
    <input type={type} className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={placeholder} value={form[k]} onChange={f(k)} />
  );

  return (
    <Modal title="Новый пациент" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field label="ФИО пациента *"><Input k="name" placeholder="Иванов Иван Иванович" /></Field>
        </div>
        <Field label="Дата рождения"><Input k="dob" type="date" /></Field>
        <Field label="Пол">
          <select className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" value={form.gender} onChange={f("gender")}>
            <option>М</option><option>Ж</option>
          </select>
        </Field>
        <Field label="Телефон"><Input k="phone" placeholder="+7 (___) ___-__-__" /></Field>
        <Field label="Группа крови"><Input k="bloodType" placeholder="A(II) Rh+" /></Field>
        <div className="col-span-2"><Field label="Адрес"><Input k="address" placeholder="г. Москва, ул. …" /></Field></div>
        <div className="col-span-2"><Field label="Диагноз / Причина обращения"><Input k="diagnosis" placeholder="Укажите диагноз или жалобу" /></Field></div>
        <Field label="Аллергии"><Input k="allergies" placeholder="Нет / Пенициллин …" /></Field>
        <Field label="Номер полиса ОМС"><Input k="policyNumber" placeholder="7812 0000000000" /></Field>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">Отмена</button>
        <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Сохранить пациента</button>
      </div>
    </Modal>
  );
}

// ─── Add Examination Form ─────────────────────────────────────────────────────

function AddExamModal({ patientName, onClose, onAdd }: { patientName: string; onClose: () => void; onAdd: (e: Examination) => void }) {
  const [form, setForm] = useState({ type: "Плановый осмотр", doctor: "", complaint: "", objectiveStatus: "", conclusion: "", recommendations: "" });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.doctor.trim() || !form.conclusion.trim()) return;
    onAdd({ id: "E-" + String(Math.floor(100 + Math.random() * 900)), date: new Date().toLocaleDateString("ru-RU"), ...form });
    onClose();
  };

  const TA = ({ k, rows = 3, placeholder }: { k: keyof typeof form; rows?: number; placeholder?: string }) => (
    <textarea rows={rows} className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder={placeholder} value={form[k]} onChange={f(k)} />
  );
  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>{children}</div>
  );

  return (
    <Modal title={`Новый осмотр — ${patientName}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <F label="Вид осмотра">
            <select className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" value={form.type} onChange={f("type")}>
              <option>Плановый осмотр</option><option>Первичный приём</option><option>Повторный приём</option>
              <option>Консультация</option><option>Экстренный осмотр</option><option>Предоперационный осмотр</option>
            </select>
          </F>
          <F label="Врач *">
            <select className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" value={form.doctor} onChange={f("doctor")}>
              <option value="">— выберите —</option>
              {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
          </F>
        </div>
        <F label="Жалобы пациента"><TA k="complaint" placeholder="Опишите жалобы…" /></F>
        <F label="Объективный статус"><TA k="objectiveStatus" placeholder="АД, ЧСС, состояние органов и систем…" /></F>
        <F label="Заключение *"><TA k="conclusion" rows={2} placeholder="Диагноз, оценка состояния…" /></F>
        <F label="Рекомендации"><TA k="recommendations" rows={2} placeholder="Назначения, следующий визит…" /></F>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">Отмена</button>
        <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Сохранить осмотр</button>
      </div>
    </Modal>
  );
}

// ─── Add Reception Entry ──────────────────────────────────────────────────────

function AddReceptionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (r: ReceptionEntry) => void }) {
  const [form, setForm] = useState({ patientName: "", arrivalTime: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }), arrivalType: "self" as ReceptionEntry["arrivalType"], complaint: "", triage: "yellow" as ReceptionEntry["triage"], assignedDoctor: "", notes: "" });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.patientName.trim()) return;
    onAdd({ id: "R-" + String(Math.floor(100 + Math.random() * 900)), ...form, status: "waiting" } as ReceptionEntry);
    onClose();
  };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>{children}</div>
  );
  const Sel = ({ k, children }: { k: keyof typeof form; children: React.ReactNode }) => (
    <select className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" value={form[k]} onChange={f(k)}>{children}</select>
  );
  const Inp = ({ k, placeholder }: { k: keyof typeof form; placeholder?: string }) => (
    <input className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder={placeholder} value={form[k]} onChange={f(k)} />
  );

  return (
    <Modal title="Регистрация поступления" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><F label="ФИО пациента *"><Inp k="patientName" placeholder="Фамилия Имя Отчество" /></F></div>
        <F label="Время поступления"><Inp k="arrivalTime" placeholder="ЧЧ:ММ" /></F>
        <F label="Тип поступления">
          <Sel k="arrivalType">
            <option value="ambulance">Скорая помощь</option>
            <option value="self">Самообращение</option>
            <option value="planned">Плановая госпитализация</option>
            <option value="emergency">Экстренная помощь</option>
            <option value="transfer">Перевод из другого ЛПУ</option>
          </Sel>
        </F>
        <F label="Сортировка (триаж)">
          <Sel k="triage">
            <option value="red">🔴 Красный — немедленно</option>
            <option value="yellow">🟡 Жёлтый — срочно</option>
            <option value="green">🟢 Зелёный — плановый</option>
            <option value="blue">🔵 Синий — наблюдение</option>
          </Sel>
        </F>
        <F label="Назначить врача">
          <Sel k="assignedDoctor">
            <option value="">— не назначен —</option>
            {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
          </Sel>
        </F>
        <div className="col-span-2">
          <F label="Жалобы / причина обращения">
            <textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Кратко опишите жалобы…" value={form.complaint} onChange={f("complaint")} />
          </F>
        </div>
        <div className="col-span-2">
          <F label="Примечания">
            <textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Дополнительная информация…" value={form.notes} onChange={f("notes")} />
          </F>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted">Отмена</button>
        <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Зарегистрировать</button>
      </div>
    </Modal>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV: { key: Section; icon: string; label: string; group?: string }[] = [
  { key: "dashboard", icon: "LayoutDashboard", label: "Дашборд", group: "Основное" },
  { key: "reception", icon: "BriefcaseMedical", label: "Приёмное отделение" },
  { key: "patients", icon: "Users", label: "Пациенты" },
  { key: "doctors", icon: "Stethoscope", label: "Врачи", group: "Управление" },
  { key: "appointments", icon: "CalendarCheck", label: "Приёмы" },
  { key: "records", icon: "FileText", label: "История болезни", group: "Данные" },
  { key: "lab", icon: "FlaskConical", label: "Анализы и тесты" },
  { key: "reports", icon: "BarChart2", label: "Отчёты" },
  { key: "cabinet", icon: "ShieldCheck", label: "Кабинет главврача", group: "Администрация" },
];

function Sidebar({ active, onSelect }: { active: Section; onSelect: (s: Section) => void }) {
  let lastGroup = "";
  return (
    <aside className="w-60 flex-shrink-0 sidebar-dark flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--med-teal))" }}>
          <span className="cross-icon" />
        </div>
        <div>
          <div className="text-white font-semibold text-sm">МедСистема</div>
          <div className="text-white/40 text-[10px] font-mono-med tracking-wider uppercase">МГК Клиника</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const showGroup = item.group && item.group !== lastGroup;
          if (item.group) lastGroup = item.group;
          return (
            <div key={item.key}>
              {showGroup && <div className="text-white/25 text-[10px] uppercase tracking-widest px-3 pt-4 pb-1.5 font-medium">{item.group}</div>}
              <button
                onClick={() => onSelect(item.key)}
                className={`nav-item w-full text-left ${active === item.key ? "nav-item-active" : "nav-item-inactive"}`}
              >
                <Icon name={item.icon as IconName} size={15} />
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "hsl(var(--med-teal))" }}>ГВ</div>
          <div>
            <div className="text-white text-xs font-semibold">Громов В.Б.</div>
            <div className="text-white/40 text-[10px]">Главный врач</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ patients, reception }: { patients: Patient[]; reception: ReceptionEntry[] }) {
  const critical = patients.filter(p => p.status === "critical").length;
  const waiting = reception.filter(r => r.status === "waiting").length;
  const stats = [
    { label: "Пациентов в базе", value: String(patients.length), icon: "Users", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "В приёмном сейчас", value: String(reception.filter(r => r.status !== "discharged").length), icon: "BriefcaseMedical", color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Ожидают осмотра", value: String(waiting), icon: "Clock", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Критических", value: String(critical), icon: "AlertTriangle", color: "text-red-600", bg: "bg-red-50" },
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
            <h2 className="font-semibold text-sm text-foreground">Приёмное отделение — сейчас</h2>
            <Badge variant="blue">{reception.filter(r => r.status !== "discharged").length} активных</Badge>
          </div>
          <div className="space-y-2">
            {reception.filter(r => r.status !== "discharged").slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: triageColor[r.triage] }} />
                  <span className="font-medium text-foreground">{r.patientName.split(" ")[0]} {r.patientName.split(" ")[1]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">{r.arrivalTime}</span>
                  <Badge variant={receptionStatusVariant[r.status]}>{receptionStatusLabel[r.status]}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="med-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-foreground">Критические анализы</h2>
            <Badge variant="red">Требуют внимания</Badge>
          </div>
          <div className="space-y-2">
            {LAB_RESULTS.filter(l => l.status !== "normal").map(l => (
              <div key={l.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                <div>
                  <div className="font-medium text-foreground">{l.patientName}</div>
                  <div className="text-xs text-muted-foreground">{l.testName} · {l.result}</div>
                </div>
                <Badge variant={l.status === "critical" ? "red" : "yellow"}>{l.status === "critical" ? "Критично" : "Отклонение"}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reception ────────────────────────────────────────────────────────────────

function ReceptionSection({ entries, onAdd }: { entries: ReceptionEntry[]; onAdd: (r: ReceptionEntry) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<"all" | ReceptionEntry["arrivalType"]>("all");

  const filtered = filter === "all" ? entries : entries.filter(r => r.arrivalType === filter);

  const typeCounts: Record<string, number> = {};
  entries.forEach(r => { typeCounts[r.arrivalType] = (typeCounts[r.arrivalType] || 0) + 1; });

  return (
    <div className="animate-fade-in space-y-5">
      {showModal && <AddReceptionModal onClose={() => setShowModal(false)} onAdd={onAdd} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Приёмное отделение</h1>
          <p className="text-muted-foreground text-sm mt-1">{entries.length} поступлений сегодня</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Icon name="Plus" size={15} />
          Зарегистрировать поступление
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
        {(["ambulance", "self", "planned", "emergency", "transfer"] as const).map(t => (
          <button key={t} onClick={() => setFilter(filter === t ? "all" : t)} className={`stat-card cursor-pointer transition-all ${filter === t ? "ring-2 ring-primary" : ""}`}>
            <div className="text-xl font-bold text-foreground">{typeCounts[t] || 0}</div>
            <Badge variant={arrivalTypeVariant[t]}>{arrivalTypeLabel[t]}</Badge>
          </button>
        ))}
      </div>

      {/* Triage legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Триаж:</span>
        {(["red", "yellow", "green", "blue"] as const).map(t => (
          <span key={t} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: triageColor[t] }} />
            {triageLabel[t]}
          </span>
        ))}
      </div>

      <div className="med-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Пациент", "Время", "Тип", "Жалобы", "Врач", "Статус", "Примечания"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${r.triage === "red" ? "bg-red-50/40" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: triageColor[r.triage] }} />
                    <div>
                      <div className="font-medium text-foreground leading-tight">{r.patientName}</div>
                      {r.ward && <div className="text-xs text-muted-foreground">{r.ward}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono-med text-xs text-foreground">{r.arrivalTime}</td>
                <td className="px-4 py-3"><Badge variant={arrivalTypeVariant[r.arrivalType]}>{arrivalTypeLabel[r.arrivalType]}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground text-xs max-w-[160px]">
                  <div className="truncate" title={r.complaint}>{r.complaint}</div>
                </td>
                <td className="px-4 py-3 text-xs text-foreground">{r.assignedDoctor || <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3"><Badge variant={receptionStatusVariant[r.status]}>{receptionStatusLabel[r.status]}</Badge></td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px]">
                  <div className="truncate" title={r.notes}>{r.notes || "—"}</div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">Нет записей</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Patients ─────────────────────────────────────────────────────────────────

function PatientsSection({ patients, setPatients }: { patients: Patient[]; setPatients: React.Dispatch<React.SetStateAction<Patient[]>> }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showExam, setShowExam] = useState(false);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase()));

  const handleAddPatient = (p: Patient) => setPatients(prev => [p, ...prev]);
  const handleAddExam = (exam: Examination) => {
    if (!selected) return;
    setPatients(prev => prev.map(p => p.id === selected.id ? { ...p, examinations: [exam, ...p.examinations] } : p));
    setSelected(prev => prev ? { ...prev, examinations: [exam, ...prev.examinations] } : null);
  };

  if (selected) {
    const pat = patients.find(p => p.id === selected.id) || selected;
    return (
      <div className="animate-fade-in space-y-5">
        {showExam && <AddExamModal patientName={pat.name} onClose={() => setShowExam(false)} onAdd={handleAddExam} />}
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="ArrowLeft" size={16} />Назад к списку
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left card */}
          <div className="med-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: "hsl(var(--med-blue))" }}>{pat.name[0]}</div>
              <div>
                <div className="font-semibold text-foreground leading-snug">{pat.name}</div>
                <div className="text-sm text-muted-foreground font-mono-med">{pat.id}</div>
                <div className="mt-1"><PatientBadge status={pat.status} /></div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {[
                ["Дата рождения", pat.dob || "—"],
                ["Возраст", `${pat.age} лет`],
                ["Пол", pat.gender],
                ["Группа крови", pat.bloodType],
                ["Полис ОМС", pat.policyNumber || "—"],
                ["Телефон", pat.phone],
                ["Адрес", pat.address || "—"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between gap-2">
                  <span className="text-muted-foreground text-xs">{l}</span>
                  <span className="font-medium text-foreground text-xs text-right">{v}</span>
                </div>
              ))}
              {pat.allergies && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
                  <div className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <Icon name="AlertTriangle" size={12} />Аллергии
                  </div>
                  <div className="text-xs text-red-700 mt-0.5">{pat.allergies}</div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <button onClick={() => setShowExam(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
                <Icon name="Plus" size={15} />Добавить осмотр
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted text-foreground">
                <Icon name="Download" size={15} />Экспорт справки PDF
              </button>
            </div>
          </div>

          {/* Right: tabs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Diagnosis */}
            <div className="med-card p-4">
              <div className="text-xs text-muted-foreground mb-1">Основной диагноз</div>
              <div className="font-semibold text-foreground">{pat.diagnosis}</div>
            </div>

            {/* Examinations */}
            <div className="med-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Icon name="Activity" size={15} className="text-primary" />Осмотры и заключения
                </h3>
                <span className="font-mono-med text-xs text-muted-foreground">{pat.examinations.length} записей</span>
              </div>
              {pat.examinations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">Осмотры не добавлены</div>
              ) : (
                <div className="space-y-4">
                  {pat.examinations.map(e => (
                    <div key={e.id} className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-sm text-foreground">{e.type}</span>
                          <span className="text-muted-foreground text-xs ml-2">— {e.doctor}</span>
                        </div>
                        <span className="font-mono-med text-xs text-muted-foreground">{e.date}</span>
                      </div>
                      {e.complaint && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-0.5">Жалобы</div>
                          <div className="text-sm text-foreground">{e.complaint}</div>
                        </div>
                      )}
                      {e.objectiveStatus && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-0.5">Объективный статус</div>
                          <div className="text-sm text-foreground">{e.objectiveStatus}</div>
                        </div>
                      )}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                        <div className="text-xs font-semibold text-blue-700 mb-0.5">Заключение</div>
                        <div className="text-sm text-blue-900">{e.conclusion}</div>
                      </div>
                      {e.recommendations && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                          <div className="text-xs font-semibold text-green-700 mb-0.5">Рекомендации</div>
                          <div className="text-sm text-green-900">{e.recommendations}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prescriptions */}
            {pat.prescriptions.length > 0 && (
              <div className="med-card p-5">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                  <Icon name="Pill" size={15} className="text-teal-600" />Текущие назначения
                </h3>
                <div className="space-y-2">
                  {pat.prescriptions.map((d, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/40 rounded-lg px-4 py-3 text-sm">
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
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} onAdd={handleAddPatient} />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Пациенты</h1>
          <p className="text-muted-foreground text-sm mt-1">{patients.length} записей</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
          <Icon name="UserPlus" size={15} />Добавить пациента
        </button>
      </div>
      <div className="relative">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Поиск по имени или диагнозу…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="med-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["ID", "Пациент", "Возраст", "Диагноз", "Последний визит", "Статус", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono-med text-xs text-muted-foreground">{p.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{p.name[0]}</div>
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
                  <button onClick={() => setSelected(p)} className="text-primary hover:underline text-xs font-medium">Открыть</button>
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
  const doctorStatusVariant: Record<Doctor["status"], "green" | "blue" | "gray"> = { available: "green", busy: "blue", off: "gray" };
  const doctorStatusLabel: Record<Doctor["status"], string> = { available: "Свободен", busy: "Занят", off: "Не работает" };
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Врачи</h1>
          <p className="text-muted-foreground text-sm mt-1">{DOCTORS.length} специалистов</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
          <Icon name="Plus" size={15} />Добавить врача
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DOCTORS.map(d => (
          <div key={d.id} className="med-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: "hsl(var(--med-blue))" }}>{d.name[0]}</div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.category}</div>
                </div>
              </div>
              <Badge variant={doctorStatusVariant[d.status]}>{doctorStatusLabel[d.status]}</Badge>
            </div>
            <div className="space-y-1.5 text-sm">
              {[
                { icon: "Stethoscope", val: `${d.specialty} · ${d.department}` },
                { icon: "Phone", val: d.phone },
                { icon: "Clock", val: d.schedule },
                { icon: "Users", val: `Пациентов: ${d.patients}` },
              ].map(row => (
                <div key={row.icon} className="flex items-center gap-2 text-muted-foreground">
                  <Icon name={row.icon as IconName} size={13} className="flex-shrink-0" />
                  <span>{row.val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1 border-t border-border">
              <button className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground">Расписание</button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">Пациенты</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Appointments ─────────────────────────────────────────────────────────────

function AppointmentsSection() {
  const apptV: Record<Appointment["status"], "green" | "blue" | "red"> = { completed: "green", scheduled: "blue", cancelled: "red" };
  const apptL: Record<Appointment["status"], string> = { completed: "Завершён", scheduled: "Запланирован", cancelled: "Отменён" };
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Приёмы</h1>
          <p className="text-muted-foreground text-sm mt-1">{APPOINTMENTS.length} записей</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
          <Icon name="CalendarPlus" size={15} />Записать на приём
        </button>
      </div>
      <div className="med-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["№", "Пациент", "Врач / Специализация", "Дата и время", "Тип", "Статус"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {APPOINTMENTS.map(a => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono-med text-xs text-muted-foreground">{a.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-700">{a.patientName[0]}</div>
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
                <td className="px-4 py-3"><Badge variant={apptV[a.status]}>{apptL[a.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Lab ──────────────────────────────────────────────────────────────────────

function LabSection() {
  const labV: Record<LabResult["status"], "green" | "yellow" | "red"> = { normal: "green", abnormal: "yellow", critical: "red" };
  const labL: Record<LabResult["status"], string> = { normal: "Норма", abnormal: "Отклонение", critical: "Критично" };
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Анализы и тесты</h1>
          <p className="text-muted-foreground text-sm mt-1">{LAB_RESULTS.length} результатов</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
          <Icon name="Plus" size={15} />Добавить результат
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {(["normal", "abnormal", "critical"] as const).map(s => (
          <div key={s} className="stat-card items-center text-center">
            <div className="text-2xl font-bold text-foreground">{LAB_RESULTS.filter(l => l.status === s).length}</div>
            <Badge variant={labV[s]}>{labL[s]}</Badge>
          </div>
        ))}
      </div>
      <div className="med-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["№", "Пациент", "Тест / Анализ", "Результат", "Норма", "Дата", "Статус"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LAB_RESULTS.map(l => (
              <tr key={l.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${l.status === "critical" ? "bg-red-50/40" : ""}`}>
                <td className="px-4 py-3 font-mono-med text-xs text-muted-foreground">{l.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{l.patientName}</td>
                <td className="px-4 py-3 text-foreground">{l.testName}</td>
                <td className="px-4 py-3 font-mono-med font-medium text-foreground">{l.result}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono-med text-xs">{l.norm}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono-med text-xs">{l.date}</td>
                <td className="px-4 py-3"><Badge variant={labV[l.status]}>{labL[l.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Records ──────────────────────────────────────────────────────────────────

function RecordsSection({ patients }: { patients: Patient[] }) {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">История болезни</h1>
          <p className="text-muted-foreground text-sm mt-1">Электронные медицинские карты</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted text-foreground">
          <Icon name="Download" size={15} />Экспорт документов
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {patients.map(p => (
          <div key={p.id} className="med-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "hsl(var(--med-blue))" }}>{p.name[0]}</div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.id} · {p.age} лет · {p.bloodType}</div>
                </div>
              </div>
              <PatientBadge status={p.status} />
            </div>
            <div className="bg-muted/40 rounded-lg px-3 py-2 mb-3">
              <div className="text-xs text-muted-foreground">Диагноз</div>
              <div className="text-sm font-medium text-foreground">{p.diagnosis}</div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>{p.examinations.length} осмотров · {p.prescriptions.length} назначений</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
                <Icon name="FileText" size={13} />Карта
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80">
                <Icon name="Pill" size={13} />Назначения
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80">
                <Icon name="Download" size={13} />PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────

function ReportsSection({ patients }: { patients: Patient[] }) {
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
  const data = [42, 55, 61, 48, 70, 65];
  const maxVal = Math.max(...data);
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Отчёты и статистика</h1>
          <p className="text-muted-foreground text-sm mt-1">2026 год</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted text-foreground">
          <Icon name="Download" size={15} />Выгрузить
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Приёмов за апрель", value: "341", delta: "+12%", pos: true },
          { label: "Новых пациентов", value: String(patients.length), delta: "+5%", pos: true },
          { label: "Выписано", value: String(patients.filter(p => p.status === "discharged").length), delta: "−3%", pos: false },
          { label: "Средняя загрузка", value: "74%", delta: "+2%", pos: true },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
            <div className="text-3xl font-bold text-foreground">{s.value}</div>
            <span className={`text-xs font-medium ${s.pos ? "text-green-600" : "text-red-500"}`}>{s.delta}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="med-card p-5">
          <h2 className="font-semibold text-sm text-foreground mb-5">Приёмы по месяцам</h2>
          <div className="flex items-end gap-3 h-40">
            {data.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{v}</span>
                <div className="w-full rounded-t-md" style={{ height: `${(v / maxVal) * 100}%`, background: i === data.length - 1 ? "hsl(var(--med-teal))" : "hsl(var(--med-blue))", opacity: i === data.length - 1 ? 1 : 0.6 }} />
                <span className="text-xs text-muted-foreground">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="med-card p-5">
          <h2 className="font-semibold text-sm text-foreground mb-4">Загрузка отделений</h2>
          <div className="flex justify-around">
            {[
              { dept: "Кардиология", load: 89, color: "hsl(var(--med-danger))" },
              { dept: "Терапия", load: 76, color: "hsl(var(--med-blue))" },
              { dept: "Неврология", load: 62, color: "hsl(var(--med-teal))" },
              { dept: "Хирургия", load: 44, color: "hsl(var(--med-success))" },
            ].map(d => (
              <div key={d.dept} className="flex flex-col items-center gap-2">
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke={d.color} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - d.load / 100)}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">{d.load}%</div>
                </div>
                <div className="text-xs text-center text-muted-foreground leading-tight w-16">{d.dept}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chief Cabinet ────────────────────────────────────────────────────────────

function CabinetSection({ patients, reception }: { patients: Patient[]; reception: ReceptionEntry[] }) {
  const kpis = [
    { label: "Пациентов в базе", value: patients.length, icon: "Users", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Госпитализировано сегодня", value: reception.filter(r => r.status === "admitted").length, icon: "BedDouble", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Критических случаев", value: patients.filter(p => p.status === "critical").length, icon: "AlertTriangle", color: "text-red-600", bg: "bg-red-50" },
    { label: "Врачей на смене", value: DOCTORS.filter(d => d.status !== "off").length, icon: "Stethoscope", color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: "hsl(var(--med-navy))" }}>ГВ</div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Кабинет главного врача</h1>
          <p className="text-muted-foreground text-sm">Громов Владимир Борисович · Главный врач</p>
        </div>
        <div className="ml-auto"><Badge variant="green">На рабочем месте</Badge></div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">{k.label}</span>
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                <Icon name={k.icon as IconName} size={15} className={k.color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Staff on duty */}
        <div className="med-card p-5">
          <h2 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
            <Icon name="UserCheck" size={15} className="text-primary" />Врачи на смене сегодня
          </h2>
          <div className="space-y-2">
            {DOCTORS.filter(d => d.status !== "off").map(d => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "hsl(var(--med-blue))" }}>{d.name[0]}</div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.specialty} · {d.patients} пациентов</div>
                  </div>
                </div>
                <Badge variant={d.status === "available" ? "green" : "blue"}>{d.status === "available" ? "Свободен" : "Занят"}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="med-card p-5">
          <h2 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
            <Icon name="Bell" size={15} className="text-red-500" />Оповещения и задачи
          </h2>
          <div className="space-y-2">
            {[
              { icon: "AlertCircle", color: "text-red-600 bg-red-50", title: "Критический анализ — Козлов Д.А.", desc: "Тропонин I: 2.1 нг/мл (норма < 0.04). Требует немедленного осмотра.", time: "08:42" },
              { icon: "UserPlus", color: "text-amber-600 bg-amber-50", title: "Новое поступление по скорой", desc: "Козлов Д.А. — ОКС, направлен в кардиологию.", time: "08:14" },
              { icon: "FileCheck", color: "text-blue-600 bg-blue-50", title: "Ожидает подписи — 3 документа", desc: "Выписные эпикризы готовы к подписанию главврача.", time: "07:00" },
              { icon: "ClipboardList", color: "text-green-600 bg-green-50", title: "Плановая проверка отделений", desc: "Запланирован обход в 14:00 — хирургия, кардиология.", time: "06:00" },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.color}`}>
                  <Icon name={a.icon as IconName} size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{a.desc}</div>
                </div>
                <div className="text-xs text-muted-foreground font-mono-med flex-shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin actions */}
      <div className="med-card p-5">
        <h2 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
          <Icon name="Settings" size={15} className="text-muted-foreground" />Административные действия
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "FilePlus2", label: "Создать приказ", color: "bg-slate-700 text-white" },
            { icon: "FileCheck", label: "Подписать документы", color: "bg-blue-600 text-white" },
            { icon: "BarChart2", label: "Сводный отчёт", color: "bg-indigo-600 text-white" },
            { icon: "UserCog", label: "Управление персоналом", color: "bg-teal-600 text-white" },
            { icon: "Download", label: "Экспорт данных", color: "bg-gray-600 text-white" },
            { icon: "ClipboardList", label: "Журнал событий", color: "bg-purple-600 text-white" },
          ].map(a => (
            <button key={a.label} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${a.color} hover:opacity-90 transition-opacity`}>
              <Icon name={a.icon as IconName} size={15} />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats table */}
      <div className="med-card p-5">
        <h2 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
          <Icon name="Table" size={15} className="text-muted-foreground" />Сводка по отделениям
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Отделение", "Зав. отделением", "Коек (занято/всего)", "Плановых приёмов", "Загрузка"].map(h => (
                <th key={h} className="pb-2 text-left text-xs font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Кардиология", "Волков С.П.", "18/20", "12", 89],
              ["Терапия", "Смирнова Н.Ю.", "22/30", "18", 76],
              ["Неврология", "Кузнецов А.М.", "13/20", "9", 62],
              ["Эндокринология", "Попова И.Д.", "9/15", "7", 58],
              ["Хирургия", "Захаров В.О.", "8/18", "5", 44],
            ].map(([dept, head, beds, plan, load]) => (
              <tr key={String(dept)} className="border-b border-border last:border-0">
                <td className="py-2.5 font-medium text-foreground">{dept}</td>
                <td className="py-2.5 text-muted-foreground">{head}</td>
                <td className="py-2.5 text-foreground">{beds}</td>
                <td className="py-2.5 text-foreground">{plan}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${load}%`, background: Number(load) > 80 ? "hsl(var(--med-danger))" : Number(load) > 60 ? "hsl(var(--med-warning))" : "hsl(var(--med-teal))" }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{load}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function Index() {
  const [section, setSection] = useState<Section>("dashboard");
  const [patients, setPatients] = useState<Patient[]>(INIT_PATIENTS);
  const [reception, setReception] = useState<ReceptionEntry[]>(INIT_RECEPTION);

  const addReception = (r: ReceptionEntry) => setReception(prev => [r, ...prev]);

  const renderContent = () => {
    switch (section) {
      case "dashboard": return <Dashboard patients={patients} reception={reception} />;
      case "reception": return <ReceptionSection entries={reception} onAdd={addReception} />;
      case "patients": return <PatientsSection patients={patients} setPatients={setPatients} />;
      case "doctors": return <DoctorsSection />;
      case "appointments": return <AppointmentsSection />;
      case "records": return <RecordsSection patients={patients} />;
      case "lab": return <LabSection />;
      case "reports": return <ReportsSection patients={patients} />;
      case "cabinet": return <CabinetSection patients={patients} reception={reception} />;
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
