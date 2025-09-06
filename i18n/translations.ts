import { Language } from '@/constants/languages';

type TranslationKeys = {
  common: {
    appName: string;
    loading: string;
    search: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    back: string;
    next: string;
    sum: string; // Uzbekistan currency
    expand: string;
    collapse: string;
    viewAll: string;
    showLess: string;
    welcomeGuestTitle: string;
    welcomeGuestText: string;
    loginRegisterCta: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    logout: string;
    guestMode: string;
  };
  home: {
    title: string;
    categories: string;
    popular: string;
    nearby: string;
    viewAll: string;
    recentlyVisited: string;
    recommendations: string;
    noRecentlyVisited: string;
    selectCity: string;
    myAppointments: string;
    noUpcomingAppointments: string;
    promotions: string;
    visitedAndFavorites: string;
  };
  categories: {
    hairSalon: string;
    barber: string;
    nailSalon: string;
    spa: string;
    massage: string;
    dental: string;
    fitness: string;
    football: string;
  };
  business: {
    about: string;
    services: string;
    reviews: string;
    address: string;
    workingHours: string;
    bookAppointment: string;
    noServices: string;
    employees: string;
    selectEmployee: string;
    closed: string;
    portfolio: string;
  };
  provider: {
    about: string;
    services: string;
    reviews: string;
    address: string;
    workingHours: string;
    bookAppointment: string;
    noServices: string;
    portfolio: string;
  };
  booking: {
    selectService: string;
    selectDate: string;
    selectTime: string;
    selectEmployee: string;
    duration: string;
    price: string;
    confirmBooking: string;
    bookingSuccess: string;
    bookingFailed: string;
    minutes: string;
  };
  profile: {
    title: string;
    appointments: string;
    upcoming: string;
    past: string;
    settings: string;
    editProfile: string;
    language: string;
    notifications: string;
    help: string;
    about: string;
    city: string;
    contactInfo: string;
    personalInfo: string;
    gender: string;
    birthday: string;
    address: string;
    male: string;
    female: string;
    other: string;
  };
  search: {
    title: string;
  };
  appointments: {
    title: string;
    noAppointments: string;
    status: {
      pending: string;
      confirmed: string;
      completed: string;
      cancelled: string;
    };
    cancel: string;
    reschedule: string;
  };
  days: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
};

type Translations = {
  [key in Language]: TranslationKeys;
};

export const translations: Translations = {
  en: {
    common: {
      appName: "Timely.uz",
      loading: "Loading...",
      search: "Search",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      back: "Back",
      next: "Next",
      sum: "UZS",
      expand: "Expand",
      collapse: "Collapse",
      viewAll: "View All",
      showLess: "Show Less",
      welcomeGuestTitle: "Welcome, Guest!",
      welcomeGuestText: "You're browsing in guest mode. Login or register to book appointments and access all features.",
      loginRegisterCta: "Login / Register",
    },
    auth: {
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      name: "Name",
      phone: "Phone",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account? Register",
      hasAccount: "Already have an account? Login",
      logout: "Logout",
      guestMode: "Try with Guest mode",
    },
    home: {
      title: "Find and book services",
      categories: "Service Types",
      popular: "Popular",
      nearby: "Nearby",
      viewAll: "View All",
      recentlyVisited: "Recently Visited",
      recommendations: "Recommendations",
      noRecentlyVisited: "No recently visited services",
      selectCity: "Select City",
      myAppointments: "My Appointments",
      noUpcomingAppointments: "No upcoming appointments",
      promotions: "Promotions and Discounts",
      visitedAndFavorites: "Visited and Favorites",
    },
    categories: {
      hairSalon: "Hair Salon",
      barber: "Barber",
      nailSalon: "Nail Salon",
      spa: "Spa",
      massage: "Massage",
      dental: "Dental",
      fitness: "Fitness",
      football: "Football",
    },
    business: {
      about: "About",
      services: "Services",
      reviews: "Reviews",
      address: "Address",
      workingHours: "Working Hours",
      bookAppointment: "Book Appointment",
      noServices: "No services available",
      employees: "Employees",
      selectEmployee: "Select Employee",
      closed: "Closed",
      portfolio: "Portfolio",
    },
    provider: {
      about: "About",
      services: "Services",
      reviews: "Reviews",
      address: "Address",
      workingHours: "Working Hours",
      bookAppointment: "Book Appointment",
      noServices: "No services available",
      portfolio: "Portfolio",
    },
    booking: {
      selectService: "Select Service",
      selectDate: "Select Date",
      selectTime: "Select Time",
      selectEmployee: "Select Employee",
      duration: "Duration",
      price: "Price",
      confirmBooking: "Confirm Booking",
      bookingSuccess: "Booking Successful!",
      bookingFailed: "Booking Failed",
      minutes: "min",
    },
    profile: {
      title: "Profile",
      appointments: "Appointments",
      upcoming: "Upcoming",
      past: "Past",
      settings: "Settings",
      editProfile: "Edit Profile",
      language: "Language",
      notifications: "Notifications",
      help: "Help & Support",
      about: "About",
      city: "City",
      contactInfo: "Contact Information",
      personalInfo: "Personal Information",
      gender: "Gender",
      birthday: "Birthday",
      address: "Address",
      male: "Male",
      female: "Female",
      other: "Other",
    },
    search: {
      title: "Search",
    },
    appointments: {
      title: "Appointments",
      noAppointments: "No appointments",
      status: {
        pending: "Pending",
        confirmed: "Confirmed",
        completed: "Completed",
        cancelled: "Cancelled",
      },
      cancel: "Cancel Appointment",
      reschedule: "Reschedule",
    },
    days: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
  },
  ru: {
    common: {
      appName: "Timely.uz",
      loading: "Загрузка...",
      search: "Поиск",
      cancel: "Отмена",
      confirm: "Подтвердить",
      save: "Сохранить",
      edit: "Изменить",
      delete: "Удалить",
      back: "Назад",
      next: "Далее",
      sum: "сум",
      expand: "Развернуть",
      collapse: "Свернуть",
      viewAll: "Показать все",
      showLess: "Показать меньше",
      welcomeGuestTitle: "Добро пожаловать, гость!",
      welcomeGuestText: "Вы просматриваете в гостевом режиме. Войдите или зарегистрируйтесь, чтобы бронировать и получить полный доступ.",
      loginRegisterCta: "Войти / Регистрация",
    },
    auth: {
      login: "Вход",
      register: "Регистрация",
      email: "Эл. почта",
      password: "Пароль",
      name: "Имя",
      phone: "Телефон",
      forgotPassword: "Забыли пароль?",
      noAccount: "Нет аккаунта? Зарегистрироваться",
      hasAccount: "Уже есть аккаунт? Войти",
      logout: "Выйти",
      guestMode: "Попробовать в гостевом режиме",
    },
    home: {
      title: "Найти и забронировать услуги",
      categories: "Типы услуг",
      popular: "Популярные",
      nearby: "Рядом",
      viewAll: "Показать все",
      recentlyVisited: "Недавно посещенные",
      recommendations: "Рекомендации",
      noRecentlyVisited: "Нет недавно посещенных услуг",
      selectCity: "Выбрать город",
      myAppointments: "Мои записи",
      noUpcomingAppointments: "Нет предстоящих записей",
      promotions: "Акции и скидки",
      visitedAndFavorites: "Посещенные и избранные",
    },
    categories: {
      hairSalon: "Парикмахерская",
      barber: "Барбершоп",
      nailSalon: "Маникюр",
      spa: "СПА",
      massage: "Массаж",
      dental: "Стоматология",
      fitness: "Фитнес",
      football: "Футбол",
    },
    business: {
      about: "О нас",
      services: "Услуги",
      reviews: "Отзывы",
      address: "Адрес",
      workingHours: "Часы работы",
      bookAppointment: "Записаться",
      noServices: "Нет доступных услуг",
      employees: "Сотрудники",
      selectEmployee: "Выбрать сотрудника",
      closed: "Закрыто",
      portfolio: "Портфолио",
    },
    provider: {
      about: "О нас",
      services: "Услуги",
      reviews: "Отзывы",
      address: "Адрес",
      workingHours: "Часы работы",
      bookAppointment: "Записаться",
      noServices: "Нет доступных услуг",
      portfolio: "Портфолио",
    },
    booking: {
      selectService: "Выберите услугу",
      selectDate: "Выберите дату",
      selectTime: "Выберите время",
      selectEmployee: "Выберите сотрудника",
      duration: "Продолжительность",
      price: "Цена",
      confirmBooking: "Подтвердить запись",
      bookingSuccess: "Запись успешно создана!",
      bookingFailed: "Ошибка при создании записи",
      minutes: "мин",
    },
    profile: {
      title: "Профиль",
      appointments: "Записи",
      upcoming: "Предстоящие",
      past: "Прошедшие",
      settings: "Настройки",
      editProfile: "Редактировать профиль",
      language: "Язык",
      notifications: "Уведомления",
      help: "Помощь и поддержка",
      about: "О приложении",
      city: "Город",
      contactInfo: "Контактная информация",
      personalInfo: "Личная информация",
      gender: "Пол",
      birthday: "День рождения",
      address: "Адрес",
      male: "Мужской",
      female: "Женский",
      other: "Другой",
    },
    search: {
      title: "Поиск",
    },
    appointments: {
      title: "Записи",
      noAppointments: "Нет записей",
      status: {
        pending: "Ожидание",
        confirmed: "Подтверждено",
        completed: "Завершено",
        cancelled: "Отменено",
      },
      cancel: "Отменить запись",
      reschedule: "Перенести",
    },
    days: {
      monday: "Понедельник",
      tuesday: "Вторник",
      wednesday: "Среда",
      thursday: "Четверг",
      friday: "Пятница",
      saturday: "Суббота",
      sunday: "Воскресенье",
    },
  },
  uz: {
    common: {
      appName: "Timely.uz",
      loading: "Yuklanmoqda...",
      search: "Qidirish",
      cancel: "Bekor qilish",
      confirm: "Tasdiqlash",
      save: "Saqlash",
      edit: "Tahrirlash",
      delete: "O'chirish",
      back: "Orqaga",
      next: "Keyingi",
      sum: "so'm",
      expand: "Yozib ko'rsatish",
      collapse: "Yig'ish",
      viewAll: "Hammasini ko'rish",
      showLess: "Kamroq ko'rsatish",
      welcomeGuestTitle: "Xush kelibsiz, mehmon!",
      welcomeGuestText: "Siz mehmon rejimidasiz. Band qilish va barcha imkoniyatlarga kirish uchun tizimga kiring yoki ro'yxatdan o'ting.",
      loginRegisterCta: "Kirish / Ro'yxatdan o'tish",
    },
    auth: {
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
      email: "Elektron pochta",
      password: "Parol",
      name: "Ism",
      phone: "Telefon",
      forgotPassword: "Parolni unutdingizmi?",
      noAccount: "Hisobingiz yo'qmi? Ro'yxatdan o'ting",
      hasAccount: "Hisobingiz bormi? Kiring",
      logout: "Chiqish",
      guestMode: "Mehmon rejimida sinab ko'ring",
    },
    home: {
      title: "Xizmatlarni toping va band qiling",
      categories: "Xizmat turlari",
      popular: "Mashhur",
      nearby: "Yaqin atrofda",
      viewAll: "Hammasini ko'rish",
      recentlyVisited: "Yaqinda tashrif buyurilgan",
      recommendations: "Tavsiyalar",
      noRecentlyVisited: "Yaqinda tashrif buyurilgan xizmatlar yo'q",
      selectCity: "Shaharni tanlang",
      myAppointments: "Mening bandlarim",
      noUpcomingAppointments: "Kelayotgan bandlar yo'q",
      promotions: "Aksiyalar va chegirmalar",
      visitedAndFavorites: "Tashrif buyurilgan va sevimlilar",
    },
    categories: {
      hairSalon: "Soch saloni",
      barber: "Sartarosh",
      nailSalon: "Tirnoq saloni",
      spa: "SPA",
      massage: "Massaj",
      dental: "Tish shifokori",
      fitness: "Fitness",
      football: "Futbol",
    },
    business: {
      about: "Haqida",
      services: "Xizmatlar",
      reviews: "Sharhlar",
      address: "Manzil",
      workingHours: "Ish vaqti",
      bookAppointment: "Band qilish",
      noServices: "Mavjud xizmatlar yo'q",
      employees: "Xodimlar",
      selectEmployee: "Xodimni tanlang",
      closed: "Yopiq",
      portfolio: "Portfolio",
    },
    provider: {
      about: "Haqida",
      services: "Xizmatlar",
      reviews: "Sharhlar",
      address: "Manzil",
      workingHours: "Ish vaqti",
      bookAppointment: "Band qilish",
      noServices: "Mavjud xizmatlar yo'q",
      portfolio: "Portfolio",
    },
    booking: {
      selectService: "Xizmatni tanlang",
      selectDate: "Sanani tanlang",
      selectTime: "Vaqtni tanlang",
      selectEmployee: "Xodimni tanlang",
      duration: "Davomiyligi",
      price: "Narxi",
      confirmBooking: "Bandni tasdiqlash",
      bookingSuccess: "Band qilish muvaffaqiyatli!",
      bookingFailed: "Band qilish muvaffaqiyatsiz",
      minutes: "daqiqa",
    },
    profile: {
      title: "Profil",
      appointments: "Bandlar",
      upcoming: "Kelayotgan",
      past: "O'tgan",
      settings: "Sozlamalar",
      editProfile: "Profilni tahrirlash",
      language: "Til",
      notifications: "Bildirishnomalar",
      help: "Yordam va qo'llab-quvvatlash",
      about: "Ilova haqida",
      city: "Shahar",
      contactInfo: "Aloqa ma'lumotlari",
      personalInfo: "Shaxsiy ma'lumotlar",
      gender: "Jinsi",
      birthday: "Tug'ilgan kun",
      address: "Manzil",
      male: "Erkak",
      female: "Ayol",
      other: "Boshqa",
    },
    search: {
      title: "Qidirish",
    },
    appointments: {
      title: "Bandlar",
      noAppointments: "Bandlar yo'q",
      status: {
        pending: "Kutilmoqda",
        confirmed: "Tasdiqlangan",
        completed: "Bajarilgan",
        cancelled: "Bekor qilingan",
      },
      cancel: "Bandni bekor qilish",
      reschedule: "Qayta rejalashtirish",
    },
    days: {
      monday: "Dushanba",
      tuesday: "Seshanba",
      wednesday: "Chorshanba",
      thursday: "Payshanba",
      friday: "Juma",
      saturday: "Shanba",
      sunday: "Yakshanba",
    },
  },
};

export const getTranslation = (language: Language) => {
  return translations[language];
};