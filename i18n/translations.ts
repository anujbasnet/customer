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
    services: string;
  };
  categories: {
    hairSalon: string;
    barber: string;
    nailSalon: string;
    spaAndMassage: string;
    dental: string;
    videogaming: string;
    football: string;
    others: string;
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
    myReviews: string;
    businessApp: string;
    exitGuestMode: string;
    confirmLogout: string;
    exitGuestModeConfirm: string;
    logoutConfirm: string;
    guestModeText: string;
    loginToAccess: string;
    loginRegisterPrompt: string;
    guestUser: string;
    defaultUser: string;
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
  settings: {
    title: string;
    loginSecurity: string;
    paymentSettings: string;
  };
  helpSupport: {
    title: string;
    howCanWeHelp: string;
    subtitle: string;
    emailHelp: string;
    telegramChat: string;
    writeHere: string;
    titlePlaceholder: string;
    detailsPlaceholder: string;
    contactsPlaceholder: string;
    send: string;
    missingInfo: string;
    missingInfoMessage: string;
    sent: string;
    sentMessage: string;
  };
  about: {
    title: string;
    appTitle: string;
    description: string;
    version: string;
  };
  businessApp: {
    title: string;
    appTitle: string;
    description: string;
    openWeb: string;
    appStore: string;
    playStore: string;
  };
  myReviews: {
    title: string;
    comingSoon: string;
    description: string;
  };
};

type Translations = {
  [key in Language]: TranslationKeys;
};

export const translations: Translations = {
  en: {
    common: {
      appName: "Rejaly.uz",
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
      services: "Services",
    },
    categories: {
      hairSalon: "Hair Salon",
      barber: "Barber",
      nailSalon: "Nail Salon",
      spaAndMassage: "Spa & Massage",
      dental: "Dental",
      videogaming: "Videogaming",
      football: "Football",
      others: "Others",
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
      myReviews: "My Reviews",
      businessApp: "Try Rejaly Business App",
      exitGuestMode: "Exit Guest Mode",
      confirmLogout: "Confirm Logout",
      exitGuestModeConfirm: "Are you sure you want to exit guest mode?",
      logoutConfirm: "Are you sure you want to log out?",
      guestModeText: "You're browsing in guest mode. Login to access all features.",
      loginToAccess: "Please login or register to view your profile and appointments",
      loginRegisterPrompt: "Login / Register",
      guestUser: "Guest User",
      defaultUser: "User",
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
    settings: {
      title: "Settings",
      loginSecurity: "Login & Security",
      paymentSettings: "Payment Settings",
    },
    helpSupport: {
      title: "Help & Support",
      howCanWeHelp: "How can we help?",
      subtitle: "Send us your suggestion or a problem you're facing and we will get back to you shortly.",
      emailHelp: "Email to help@rejaly.uz",
      telegramChat: "Open Telegram chat",
      writeHere: "Write here and we will contact you",
      titlePlaceholder: "Title",
      detailsPlaceholder: "Details",
      contactsPlaceholder: "Your contacts",
      send: "Send",
      missingInfo: "Missing info",
      missingInfoMessage: "Please fill all fields before sending.",
      sent: "Sent",
      sentMessage: "Thanks! We will contact you shortly.",
    },
    about: {
      title: "About",
      appTitle: "About Rejaly.uz",
      description: "Rejaly.uz helps you discover nearby beauty and wellness services, compare providers, and book appointments seamlessly.",
      version: "App version",
    },
    businessApp: {
      title: "Try Rejaly Business App",
      appTitle: "Rejaly Business",
      description: "If you are offering similar services, we can help you find customers and manage bookings. Write to us at support@rejaly.uz and check our app.",
      openWeb: "Open Web",
      appStore: "App Store (iOS)",
      playStore: "Play Store (Android)",
    },
    myReviews: {
      title: "My Reviews",
      comingSoon: "Coming Soon!",
      description: "This feature is coming soon! You will be able to view and manage all your reviews here.",
    },
  },
  ru: {
    common: {
      appName: "Rejaly.uz",
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
      services: "Услуги",
    },
    categories: {
      hairSalon: "Парикмахерская",
      barber: "Барбершоп",
      nailSalon: "Маникюр",
      spaAndMassage: "СПА и массаж",
      dental: "Стоматология",
      videogaming: "Видеоигры",
      football: "Футбол",
      others: "Другое",
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
      myReviews: "Мои отзывы",
      businessApp: "Попробовать Rejaly Business",
      exitGuestMode: "Выйти из гостевого режима",
      confirmLogout: "Подтвердить выход",
      exitGuestModeConfirm: "Вы уверены, что хотите выйти из гостевого режима?",
      logoutConfirm: "Вы уверены, что хотите выйти?",
      guestModeText: "Вы просматриваете в гостевом режиме. Войдите, чтобы получить доступ ко всем функциям.",
      loginToAccess: "Пожалуйста, войдите или зарегистрируйтесь, чтобы просмотреть свой профиль и записи",
      loginRegisterPrompt: "Войти / Регистрация",
      guestUser: "Гость",
      defaultUser: "Пользователь",
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
    settings: {
      title: "Настройки",
      loginSecurity: "Вход и безопасность",
      paymentSettings: "Настройки платежей",
    },
    helpSupport: {
      title: "Помощь и поддержка",
      howCanWeHelp: "Как мы можем помочь?",
      subtitle: "Отправьте нам ваше предложение или проблему, с которой вы столкнулись, и мы свяжемся с вами в ближайшее время.",
      emailHelp: "Написать на help@rejaly.uz",
      telegramChat: "Открыть чат в Telegram",
      writeHere: "Напишите здесь, и мы свяжемся с вами",
      titlePlaceholder: "Заголовок",
      detailsPlaceholder: "Подробности",
      contactsPlaceholder: "Ваши контакты",
      send: "Отправить",
      missingInfo: "Недостающая информация",
      missingInfoMessage: "Пожалуйста, заполните все поля перед отправкой.",
      sent: "Отправлено",
      sentMessage: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    },
    about: {
      title: "О приложении",
      appTitle: "О Rejaly.uz",
      description: "Rejaly.uz поможет вам найти ближайшие услуги красоты и здоровья, сравнить поставщиков и легко забронировать встречи.",
      version: "Версия приложения",
    },
    businessApp: {
      title: "Попробовать Rejaly Business",
      appTitle: "Rejaly Business",
      description: "Если вы предлагаете подобные услуги, мы можем помочь вам найти клиентов и управлять бронированием. Напишите нам на support@rejaly.uz и ознакомьтесь с нашим приложением.",
      openWeb: "Открыть веб-сайт",
      appStore: "App Store (iOS)",
      playStore: "Play Store (Android)",
    },
    myReviews: {
      title: "Мои отзывы",
      comingSoon: "Скоро!",
      description: "Эта функция скоро появится! Здесь вы сможете просматривать и управлять всеми своими отзывами.",
    },
  },
  uz: {
    common: {
      appName: "Rejaly.uz",
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
      services: "Xizmatlar",
    },
    categories: {
      hairSalon: "Soch saloni",
      barber: "Sartarosh",
      nailSalon: "Tirnoq saloni",
      spaAndMassage: "SPA va massaj",
      dental: "Tish shifokori",
      videogaming: "Video o'yinlar",
      football: "Futbol",
      others: "Boshqalar",
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
      myReviews: "Mening sharhlarim",
      businessApp: "Rejaly Business ilovasini sinab ko'ring",
      exitGuestMode: "Mehmon rejimidan chiqish",
      confirmLogout: "Chiqishni tasdiqlash",
      exitGuestModeConfirm: "Mehmon rejimidan chiqishni xohlaysizmi?",
      logoutConfirm: "Chiqishni xohlaysizmi?",
      guestModeText: "Siz mehmon rejimidasiz. Barcha imkoniyatlarga kirish uchun tizimga kiring.",
      loginToAccess: "Profilingiz va bandlaringizni ko'rish uchun tizimga kiring yoki ro'yxatdan o'ting",
      loginRegisterPrompt: "Kirish / Ro'yxatdan o'tish",
      guestUser: "Mehmon foydalanuvchi",
      defaultUser: "Foydalanuvchi",
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
    settings: {
      title: "Sozlamalar",
      loginSecurity: "Kirish va xavfsizlik",
      paymentSettings: "To'lov sozlamalari",
    },
    helpSupport: {
      title: "Yordam va qo'llab-quvvatlash",
      howCanWeHelp: "Qanday yordam bera olamiz?",
      subtitle: "Bizga taklifingizni yoki duch kelgan muammoingizni yuboring, biz tez orada siz bilan bog'lanamiz.",
      emailHelp: "help@rejaly.uz ga email yuboring",
      telegramChat: "Telegram chatini ochish",
      writeHere: "Bu yerga yozing, biz siz bilan bog'lanamiz",
      titlePlaceholder: "Sarlavha",
      detailsPlaceholder: "Tafsilotlar",
      contactsPlaceholder: "Sizning kontaktlaringiz",
      send: "Yuborish",
      missingInfo: "Ma'lumot yetishmayapti",
      missingInfoMessage: "Yuborishdan oldin barcha maydonlarni to'ldiring.",
      sent: "Yuborildi",
      sentMessage: "Rahmat! Biz tez orada siz bilan bog'lanamiz.",
    },
    about: {
      title: "Ilova haqida",
      appTitle: "Rejaly.uz haqida",
      description: "Rejaly.uz sizga yaqin atrofdagi go'zallik va salomatlik xizmatlarini topishga, provayderlarni solishtirishga va uchrashuvlarni oson band qilishga yordam beradi.",
      version: "Ilova versiyasi",
    },
    businessApp: {
      title: "Rejaly Business ilovasini sinab ko'ring",
      appTitle: "Rejaly Business",
      description: "Agar siz shunga o'xshash xizmatlarni taklif qilsangiz, biz sizga mijozlar topishga va bandlashni boshqarishga yordam bera olamiz. Bizga support@rejaly.uz manziliga yozing va ilovamizni tekshiring.",
      openWeb: "Veb-saytni ochish",
      appStore: "App Store (iOS)",
      playStore: "Play Store (Android)",
    },
    myReviews: {
      title: "Mening sharhlarim",
      comingSoon: "Tez orada!",
      description: "Bu funksiya tez orada paydo bo'ladi! Bu yerda barcha sharhlaringizni ko'rish va boshqarish imkoniyatiga ega bo'lasiz.",
    },
  },
};

export const getTranslation = (language: Language) => {
  return translations[language];
};