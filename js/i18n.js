export const translations = {
  th: {
    navIntro: 'บทนำ',
    navSpecies: 'สายพันธุ์',
    navNutrition: 'โภชนาการ',
    navDisease: 'โรคพืช',
    navTimeline: 'วงจรชีวิต',
    navReferences: 'อ้างอิง',
    heroBadge: 'Global grain study',
    heroTitleA: 'ข้าวและธัญพืช',
    heroTitleB: 'เมล็ดพันธุ์แห่งความมั่นคงทางอาหารโลก',
    heroDescription: 'การศึกษาเชิงลึกเกี่ยวกับสายพันธุ์ธัญพืชที่หล่อเลี้ยงคนทั่วโลก พร้อมข้อมูลอ้างอิง การเปรียบเทียบทางโภชนาการ และแนวโน้มความยั่งยืนทางเกษตรกรรม',
    explore: 'สำรวจสายพันธุ์',
    report: 'ดาวน์โหลดรายงาน',
    introHeading: 'ธัญพืชเป็นรากฐานของระบบอาหารโลก',
    introText: 'ข้าว ข้าวสาลี และข้าวโอ๊ตไม่ใช่เพียงพืชทางการเกษตร แต่เป็นพลังงานเชิงโภชนาการที่ผสานเข้ากับวัฒนธรรมและเศรษฐกิจของมนุษย์มากกว่าครึ่งโลก',
    speciesHeading: 'สายพันธุ์ธัญพืชสำคัญ 6 ชนิด',
    filterAll: 'ทั้งหมด',
    filterRice: 'ข้าว',
    filterWheat: 'สาลี',
    filterOats: 'โอ๊ต',
    searchPlaceholder: 'ค้นหาสายพันธุ์...',
    seasonAll: 'ฤดูกาลทั้งหมด',
    compareTitle: 'Compare varieties',
    diseaseTitle: 'การเปรียบเทียบความต้านทานโรคพืช',
    referencesTitle: 'แหล่งอ้างอิงและทีมงาน'
  },
  en: {
    navIntro: 'Intro',
    navSpecies: 'Varieties',
    navNutrition: 'Nutrition',
    navDisease: 'Disease',
    navTimeline: 'Lifecycle',
    navReferences: 'References',
    heroBadge: 'Global grain study',
    heroTitleA: 'Rice and cereals',
    heroTitleB: 'Seeds of global food security',
    heroDescription: 'An in-depth review of the grain varieties feeding the world, presented with citations, nutritional comparisons, and sustainability insights.',
    explore: 'Explore varieties',
    report: 'Download report',
    introHeading: 'Crops are the foundation of global food security',
    introText: 'Rice, wheat, and oats are more than agricultural outputs; they are nutritional and cultural pillars for billions of people worldwide.',
    speciesHeading: 'Six major cereal varieties',
    filterAll: 'All',
    filterRice: 'Rice',
    filterWheat: 'Wheat',
    filterOats: 'Oats',
    searchPlaceholder: 'Search varieties...',
    seasonAll: 'All seasons',
    compareTitle: 'Compare varieties',
    diseaseTitle: 'Disease resistance comparison',
    referencesTitle: 'References and team'
  }
};

export function applyLanguage(lang) {
  const dictionary = translations[lang] || translations.th;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });
}
