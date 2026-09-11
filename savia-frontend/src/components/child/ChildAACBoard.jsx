import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, Plus, Trash2, Sparkles, ChevronLeft, ChevronRight, Search, Delete, Play, RotateCcw, X, Bot, Zap, ArrowRight, Wand2 } from 'lucide-react';
import { triggerHaptic, playEarcon, speakText } from '../../utils/audioAccessibility';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { predictNextAAC } from '../../api/agents';

// Brown's Stage III-IV Morphosyntactic Grammar Conjugations
const GRAMMAR_CONJUGATIONS = {
  want: {
    root: { en: 'Want', hi: 'चाहिए', phraseEn: 'I want', phraseHi: 'मुझे चाहिए' },
    continuous: { en: 'Wanting', hi: 'चाह रहा हूँ', phraseEn: 'I am really wanting this', phraseHi: 'मुझे यह बहुत चाहिए' },
    past: { en: 'Wanted', hi: 'चाहता था', phraseEn: 'I wanted that earlier', phraseHi: 'मुझे पहले वह चाहिए था' },
    negation: { en: "Don't Want", hi: 'नहीं चाहिए', phraseEn: 'I do not want this', phraseHi: 'मुझे यह बिल्कुल नहीं चाहिए' },
    question: { en: 'Can I have?', hi: 'क्या मिल सकता है?', phraseEn: 'Can I please have this?', phraseHi: 'क्या मुझे यह मिल सकता है?' }
  },
  eat: {
    root: { en: 'Eat', hi: 'खाना', phraseEn: 'I want to eat', phraseHi: 'मुझे खाना है' },
    continuous: { en: 'Eating', hi: 'खा रहा हूँ', phraseEn: 'I am eating right now', phraseHi: 'मैं अभी खा रहा हूँ' },
    past: { en: 'Ate', hi: 'खा लिया', phraseEn: 'I already ate my food', phraseHi: 'मैंने खाना खा लिया है' },
    negation: { en: "Don't Want to Eat", hi: 'नहीं खाना', phraseEn: 'I do not want to eat', phraseHi: 'मुझे खाना नहीं खाना है' },
    question: { en: 'Can I eat?', hi: 'क्या खाऊँ?', phraseEn: 'Can I eat a snack now please?', phraseHi: 'क्या मैं अब कुछ खा सकता हूँ?' }
  },
  rice: {
    root: { en: 'Eat Meal', hi: 'खाना खाना', phraseEn: 'I want to eat my meal', phraseHi: 'मुझे भोजन खाना है' },
    continuous: { en: 'Eating Meal', hi: 'खाना खा रहा हूँ', phraseEn: 'I am eating my meal', phraseHi: 'मैं भोजन खा रहा हूँ' },
    past: { en: 'Finished Meal', hi: 'खाना खा लिया', phraseEn: 'I finished my meal', phraseHi: 'मैंने भोजन समाप्त कर लिया' },
    negation: { en: 'Full / No Meal', hi: 'पेट भर गया', phraseEn: 'I am full, no more food', phraseHi: 'मेरा पेट भर गया है' },
    question: { en: 'Time for Meal?', hi: 'खाने का समय?', phraseEn: 'Is it time for lunch or dinner?', phraseHi: 'क्या भोजन का समय हो गया है?' }
  },
  water: {
    root: { en: 'Drink Water', hi: 'पानी पीना', phraseEn: 'I want to drink water', phraseHi: 'मुझे पानी पीना है' },
    continuous: { en: 'Drinking', hi: 'पी रहा हूँ', phraseEn: 'I am drinking water', phraseHi: 'मैं पानी पी रहा हूँ' },
    past: { en: 'Drank', hi: 'पी लिया', phraseEn: 'I already drank water', phraseHi: 'मैंने पानी पी लिया' },
    negation: { en: 'Not Thirsty', hi: 'प्यास नहीं', phraseEn: 'I am not thirsty', phraseHi: 'मुझे प्यास नहीं लगी है' },
    question: { en: 'More Water?', hi: 'और पानी?', phraseEn: 'Can I have more fresh water please?', phraseHi: 'क्या मुझे और पानी मिल सकता है?' }
  },
  go: {
    root: { en: 'Go', hi: 'जाना', phraseEn: 'I want to go', phraseHi: 'मुझे जाना है' },
    continuous: { en: 'Going', hi: 'जा रहा हूँ', phraseEn: 'I am going now', phraseHi: 'मैं जा रहा हूँ' },
    past: { en: 'Went', hi: 'गया था', phraseEn: 'I went there already', phraseHi: 'मैं वहाँ गया था' },
    negation: { en: "Don't Go / Stay", hi: 'रुकना है', phraseEn: 'I want to stay here, do not go', phraseHi: 'मुझे यहीं रुकना है, नहीं जाना' },
    question: { en: 'Where going?', hi: 'कहाँ जाना है?', phraseEn: 'Where are we going next?', phraseHi: 'हम आगे कहाँ जा रहे हैं?' }
  },
  help: {
    root: { en: 'Help', hi: 'मदद', phraseEn: 'Help me please', phraseHi: 'मेरी मदद करें' },
    continuous: { en: 'Helping', hi: 'मदद कर रहा हूँ', phraseEn: 'I am helping you', phraseHi: 'मैं मदद कर रहा हूँ' },
    past: { en: 'Helped', hi: 'मदद मिल गई', phraseEn: 'Thank you, you helped me', phraseHi: 'धन्यवाद, मुझे मदद मिल गई' },
    negation: { en: 'No Help / Myself', hi: 'खुद करूँगा', phraseEn: 'I can do it myself, no help needed', phraseHi: 'मैं खुद करूँगा, मदद नहीं चाहिए' },
    question: { en: 'Can you help?', hi: 'क्या मदद करेंगे?', phraseEn: 'Could you please help me with this?', phraseHi: 'क्या आप मेरी सहायता कर सकते हैं?' }
  },
  play: {
    root: { en: 'Play', hi: 'खेलना', phraseEn: 'I want to play', phraseHi: 'मुझे खेलना है' },
    continuous: { en: 'Playing', hi: 'खेल रहा हूँ', phraseEn: 'I am playing now', phraseHi: 'मैं खेल रहा हूँ' },
    past: { en: 'Played', hi: 'खेल लिया', phraseEn: 'I played with my toy', phraseHi: 'मैंने खिलौने से खेल लिया' },
    negation: { en: "Don't Play", hi: 'नहीं खेलना', phraseEn: 'I do not want to play right now', phraseHi: 'मुझे अभी नहीं खेलना है' },
    question: { en: 'Play together?', hi: 'साथ खेलें?', phraseEn: 'Do you want to play together with me?', phraseHi: 'क्या आप मेरे साथ खेलेंगे?' }
  },
  more: {
    root: { en: 'More', hi: 'और', phraseEn: 'I want more please', phraseHi: 'मुझे और चाहिए' },
    continuous: { en: 'Continuing', hi: 'जारी रखें', phraseEn: 'Keep going with more', phraseHi: 'और जारी रखें' },
    past: { en: 'Had Enough', hi: 'बहुत हो गया', phraseEn: 'I had enough more', phraseHi: 'मुझे पर्याप्त मिल गया' },
    negation: { en: 'No More', hi: 'और नहीं', phraseEn: 'No more please, all finished', phraseHi: 'अब और नहीं चाहिए, समाप्त' },
    question: { en: 'Can I have more?', hi: 'क्या और मिलेगा?', phraseEn: 'Can I please have a little more?', phraseHi: 'क्या मुझे थोड़ा और मिल सकता है?' }
  },
  stop: {
    root: { en: 'Stop', hi: 'रुको', phraseEn: 'Please stop', phraseHi: 'कृपया रुकें' },
    continuous: { en: 'Stopping', hi: 'रुक रहा हूँ', phraseEn: 'I am stopping now', phraseHi: 'मैं रुक रहा हूँ' },
    past: { en: 'Stopped', hi: 'रुक गया', phraseEn: 'Everything stopped', phraseHi: 'सब रुक गया है' },
    negation: { en: "Don't Stop", hi: 'मत रुको', phraseEn: 'Please do not stop, keep going', phraseHi: 'मत रुको, जारी रखो' },
    question: { en: 'Can we stop?', hi: 'क्या रुक सकते हैं?', phraseEn: 'Can we please stop this now?', phraseHi: 'क्या हम इसे अब रोक सकते हैं?' }
  }
};

const AAC_VOCABULARY = [
  // 1. Core Needs & Actions (8 cards)
  {
    id: 'want',
    category: 'Core',
    emoji: '💬',
    titles: {
      en: 'I want', hi: 'मुझे चाहिए', es: 'Quiero', mr: 'मला हवे आहे', ta: 'எனக்கு வேண்டும்', bn: 'আমার দরকার', fr: 'Je veux', de: 'Ich möchte'
    },
    phrases: {
      en: 'I want', hi: 'मुझे चाहिए', es: 'Yo quiero', mr: 'मला हवे आहे', ta: 'எனக்கு வேண்டும்', bn: 'আমার এটি দরকার', fr: 'Je veux s\'il vous plaît', de: 'Ich möchte bitte'
    },
    colorClass: 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-none'
  },
  {
    id: 'help',
    category: 'Core',
    emoji: '❓',
    titles: {
      en: 'Help Me', hi: 'मदद', es: 'Ayuda', mr: 'मदत करा', ta: 'உதவி', bn: 'সাহায্য', fr: 'Aide', de: 'Hilfe'
    },
    phrases: {
      en: 'I need help please!', hi: 'कृपया मेरी मदद करें!', es: '¡Por favor ayúdame!', mr: 'कृपया मला मदत करा!', ta: 'தயவுசெய்து எனக்கு உதவுங்கள்!', bn: 'দয়া করে সাহায্য করুন!', fr: 'Aidez-moi s\'il vous plaît !', de: 'Hilf mir bitte!'
    },
    colorClass: 'bg-blue-100 dark:bg-blue-950/80 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
  },
  {
    id: 'more',
    category: 'Core',
    emoji: '➕',
    titles: {
      en: 'More', hi: 'और चाहिए', es: 'Más', mr: 'आणखी', ta: 'மேலும்', bn: 'আরও', fr: 'Encore', de: 'Mehr'
    },
    phrases: {
      en: 'I want more please!', hi: 'मुझे और चाहिए!', es: '¡Quiero más por favor!', mr: 'मला आणखी हवे आहे!', ta: 'எனக்கு இன்னும் வேண்டும்!', bn: 'আমি আরও চাই!', fr: 'J\'en veux encore s\'il vous plaît !', de: 'Ich möchte mehr bitte!'
    },
    colorClass: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
  },
  {
    id: 'stop',
    category: 'Core',
    emoji: '🛑',
    titles: {
      en: 'Stop', hi: 'रुको', es: 'Parar', mr: 'थांबा', ta: 'நிறுத்து', bn: 'থামুন', fr: 'Arrêt', de: 'Stopp'
    },
    phrases: {
      en: 'Please stop now.', hi: 'कृपया अब रुकें।', es: 'Por favor para ahora.', mr: 'कृपया आता थांबा.', ta: 'தயவுசெய்து நிறுத்துங்கள்.', bn: 'দয়া করে থামুন।', fr: 'Arrêtez s\'il vous plaît.', de: 'Bitte jetzt aufhören.'
    },
    colorClass: 'bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-950 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
  },
  {
    id: 'yes',
    category: 'Core',
    emoji: '👍',
    titles: {
      en: 'Yes', hi: 'हाँ', es: 'Sí', mr: 'होय', ta: 'ஆம்', bn: 'হ্যাঁ', fr: 'Oui', de: 'Ja'
    },
    phrases: {
      en: 'Yes please!', hi: 'हाँ!', es: '¡Sí por favor!', mr: 'होय नक्की!', ta: 'ஆம் தயவுசெய்து!', bn: 'হ্যাঁ দয়া করে!', fr: 'Oui s\'il vous plaît !', de: 'Ja bitte!'
    },
    colorClass: 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'no',
    category: 'Core',
    emoji: '👎',
    titles: {
      en: 'No', hi: 'नहीं', es: 'No', mr: 'नाही', ta: 'இல்லை', bn: 'না', fr: 'Non', de: 'Nein'
    },
    phrases: {
      en: 'No thank you.', hi: 'नहीं!', es: 'No, gracias.', mr: 'नाही नको.', ta: 'இல்லை நன்றி.', bn: 'না, ধন্যবাদ।', fr: 'Non merci.', de: 'Nein danke.'
    },
    colorClass: 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
  },
  {
    id: 'go',
    category: 'Core',
    emoji: '🚶',
    titles: {
      en: 'Go', hi: 'चलो', es: 'Ir', mr: 'जा', ta: 'செல்', bn: 'যাওয়া', fr: 'Aller', de: 'Gehen'
    },
    phrases: {
      en: 'I want to go now.', hi: 'मुझे चलना है।', es: 'Quiero ir ahora.', mr: 'मला जायचे आहे.', ta: 'நான் இப்போது செல்ல வேண்டும்.', bn: 'আমি এখন যেতে চাই।', fr: 'Je veux y aller.', de: 'Ich möchte jetzt gehen.'
    },
    colorClass: 'bg-indigo-100 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-950 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
  },
  {
    id: 'finish',
    category: 'Core',
    emoji: '🏁',
    titles: {
      en: 'All Done', hi: 'समाप्त', es: 'Terminado', mr: 'झाले', ta: 'முடிந்தது', bn: 'সম্পন্ন', fr: 'Fini', de: 'Fertig'
    },
    phrases: {
      en: 'I am all finished!', hi: 'मेरा काम पूरा हो गया!', es: '¡Ya terminé!', mr: 'माझे काम पूर्ण झाले!', ta: 'நான் முடித்துவிட்டேன்!', bn: 'আমার কাজ শেষ!', fr: 'C\'est tout fini !', de: 'Ich bin fertig!'
    },
    colorClass: 'bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-950 dark:text-purple-200 border border-purple-200 dark:border-purple-800'
  },

  // 2. Food & Meals (8 cards)
  {
    id: 'water',
    category: 'Food',
    emoji: '🥤',
    titles: {
      en: 'Water', hi: 'पानी', es: 'Agua', mr: 'पाणी', ta: 'தண்ணீர்', bn: 'জল', fr: 'Eau', de: 'Wasser'
    },
    phrases: {
      en: 'I am thirsty, I want water please!', hi: 'मुझे प्यास लगी है, पानी चाहिए।', es: '¡Tengo sed, quiero agua por favor!', mr: 'मला तहान लागली आहे, पाणी हवे आहे.', ta: 'எனக்கு தாகமாக இருக்கிறது, தண்ணீர் வேண்டும்.', bn: 'আমার জল তেষ্টা পেয়েছে!', fr: 'J\'ai soif, de l\'eau s\'il vous plaît !', de: 'Ich habe Durst, bitte Wasser!'
    },
    colorClass: 'bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 dark:hover:bg-sky-900 text-sky-950 dark:text-sky-200 border border-sky-200 dark:border-sky-800'
  },
  {
    id: 'milk',
    category: 'Food',
    emoji: '🥛',
    titles: {
      en: 'Milk', hi: 'दूध', es: 'Leche', mr: 'दूध', ta: 'பால்', bn: 'দুধ', fr: 'Lait', de: 'Milch'
    },
    phrases: {
      en: 'I want a cup of milk please.', hi: 'मुझे दूध चाहिए।', es: 'Quiero un vaso de leche por favor.', mr: 'मला दूध हवे आहे.', ta: 'எனக்கு பால் வேண்டும்.', bn: 'আমাকে দুধ দিন।', fr: 'Je veux du lait s\'il vous plaît.', de: 'Ich möchte Milch bitte.'
    },
    colorClass: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
  },
  {
    id: 'rice',
    category: 'Food',
    emoji: '🍚',
    titles: {
      en: 'Meal / Rice', hi: 'खाना / चावल', es: 'Comida', mr: 'जेवण', ta: 'சாதம்', bn: 'ভাত / খাবার', fr: 'Repas', de: 'Essen'
    },
    phrases: {
      en: 'I am hungry, I want to eat my meal.', hi: 'मुझे भोजन खाना है।', es: 'Tengo hambre, quiero comer.', mr: 'मला भूक लागली आहे, जेवायचे आहे.', ta: 'எனக்கு பசிக்கிறது, சாப்பிட வேண்டும்.', bn: 'আমি খাবার খেতে চাই।', fr: 'J\'ai faim, je veux manger mon repas.', de: 'Ich habe Hunger, ich möchte essen.'
    },
    colorClass: 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
  },
  {
    id: 'bread',
    category: 'Food',
    emoji: '🍞',
    titles: {
      en: 'Roti / Bread', hi: 'रोटी / ब्रेड', es: 'Pan', mr: 'पोळी / ब्रेड', ta: 'ரொட்டி', bn: 'রুটি', fr: 'Pain', de: 'Brot'
    },
    phrases: {
      en: 'I want bread or roti please.', hi: 'मुझे रोटी या ब्रेड चाहिए।', es: 'Quiero pan por favor.', mr: 'मला पोळी किंवा ब्रेड हवे.', ta: 'எனக்கு ரொட்டி வேண்டும்.', bn: 'আমাকে রুটি দিন।', fr: 'Je veux du pain s\'il vous plaît.', de: 'Ich möchte Brot bitte.'
    },
    colorClass: 'bg-orange-100 dark:bg-orange-950/80 hover:bg-orange-200 dark:hover:bg-orange-900 text-orange-950 dark:text-orange-200 border border-orange-200 dark:border-orange-800'
  },
  {
    id: 'fruit',
    category: 'Food',
    emoji: '🍎',
    titles: {
      en: 'Fruit / Apple', hi: 'फल / सेब', es: 'Fruta', mr: 'फळ / सफरचंद', ta: 'பழம்', bn: 'ফল', fr: 'Fruit', de: 'Obst'
    },
    phrases: {
      en: 'I want fresh fruit please.', hi: 'मुझे फल खाना है।', es: 'Quiero fruta fresca por favor.', mr: 'मला फळे खायची आहेत.', ta: 'எனக்கு பழம் வேண்டும்.', bn: 'আমি তাজা ফল খেতে চাই।', fr: 'Je veux des fruits frais s\'il vous plaît.', de: 'Ich möchte Obst bitte.'
    },
    colorClass: 'bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-950 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
  },
  {
    id: 'juice',
    category: 'Food',
    emoji: '🧃',
    titles: {
      en: 'Juice', hi: 'जूस', es: 'Zumo', mr: 'रस / ज्यूस', ta: 'சாறு', bn: 'জুস', fr: 'Jus', de: 'Saft'
    },
    phrases: {
      en: 'I would like fruit juice please.', hi: 'मुझे जूस पीना है।', es: 'Me gustaría zumo por favor.', mr: 'मला ज्यूस प्यायचा आहे.', ta: 'எனக்கு சாறு வேண்டும்.', bn: 'আমি জুস পান করতে চাই।', fr: 'J\'aimerais du jus de fruit s\'il vous plaît.', de: 'Ich möchte Saft bitte.'
    },
    colorClass: 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
  },
  {
    id: 'snack',
    category: 'Food',
    emoji: '🍪',
    titles: {
      en: 'Biscuit / Snack', hi: 'बिस्कुट', es: 'Galleta', mr: 'बिस्कीट', ta: 'பிஸ்கட்', bn: 'বিস্কুট', fr: 'Biscuit', de: 'Keks'
    },
    phrases: {
      en: 'I want a biscuit snack.', hi: 'मुझे बिस्कुट खाना है।', es: 'Quiero una galleta por favor.', mr: 'मला बिस्कीट हवे आहे.', ta: 'எனக்கு பிஸ்கட் வேண்டும்.', bn: 'আমি বিস্কুট খেতে চাই।', fr: 'Je veux un biscuit s\'il vous plaît.', de: 'Ich möchte einen Keks.'
    },
    colorClass: 'bg-yellow-100 dark:bg-yellow-950/80 hover:bg-yellow-200 dark:hover:bg-yellow-900 text-yellow-950 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
  },
  {
    id: 'warm',
    category: 'Food',
    emoji: '🥣',
    titles: {
      en: 'Warm Food', hi: 'गरम खाना', es: 'Comida Caliente', mr: 'गरम अन्न', ta: 'சூடான உணவு', bn: 'গরম খাবার', fr: 'Chaud', de: 'Warmes Essen'
    },
    phrases: {
      en: 'Please warm up my food.', hi: 'कृपया मेरा खाना गरम करें।', es: 'Por favor calienta mi comida.', mr: 'कृपया माझे जेवण गरम करा.', ta: 'தயவுசெய்து என் உணவை சூடாக்கவும்.', bn: 'আমার খাবার গরম করুন।', fr: 'Chauffez mon plat s\'il vous plaît.', de: 'Bitte mein Essen aufwärmen.'
    },
    colorClass: 'bg-red-100 dark:bg-red-950/80 hover:bg-red-200 dark:hover:bg-red-900 text-red-950 dark:text-red-200 border border-red-200 dark:border-red-800'
  },

  // 3. Emotions & Sensory (8 cards)
  {
    id: 'happy',
    category: 'Emotions',
    emoji: '😊',
    titles: {
      en: 'Happy', hi: 'खुश', es: 'Feliz', mr: 'आनंदी', ta: 'மகிழ்ச்சி', bn: 'খুশি', fr: 'Heureux', de: 'Glücklich'
    },
    phrases: {
      en: 'I am feeling happy and good!', hi: 'मैं बहुत खुश हूँ!', es: '¡Me siento feliz y bien!', mr: 'मला खूप आनंद झाला आहे!', ta: 'நான் மகிழ்ச்சியாக இருக்கிறேன்!', bn: 'আমি খুব আনন্দিত!', fr: 'Je me sens heureux et bien !', de: 'Ich fühle mich glücklich!'
    },
    colorClass: 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'sad',
    category: 'Emotions',
    emoji: '😢',
    titles: {
      en: 'Sad', hi: 'उदास', es: 'Triste', mr: 'दुःखी', ta: 'வருத்தம்', bn: 'দুঃখিত', fr: 'Triste', de: 'Traurig'
    },
    phrases: {
      en: 'I feel sad right now.', hi: 'मुझे उदासी महसूस हो रही है।', es: 'Me siento triste ahora.', mr: 'मला वाईट वाटत आहे.', ta: 'நான் வருத்தமாக உணர்கிறேன்.', bn: 'আমার মন খারাপ।', fr: 'Je me sens triste en ce moment.', de: 'Ich bin traurig.'
    },
    colorClass: 'bg-blue-100 dark:bg-blue-950/80 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
  },
  {
    id: 'tired',
    category: 'Emotions',
    emoji: '😴',
    titles: {
      en: 'Tired / Sleepy', hi: 'थका हुआ', es: 'Cansado', mr: 'दमलो', ta: 'களைப்பு', bn: 'ক্লান্ত', fr: 'Fatigué', de: 'Müde'
    },
    phrases: {
      en: 'I am very tired and need to sleep.', hi: 'मैं बहुत थक गया हूँ, सोना चाहता हूँ।', es: 'Estoy cansado y quiero dormir.', mr: 'मी खूप थकलो आहे.', ta: 'நான் தூங்க வேண்டும்.', bn: 'আমি ঘুমাতে চাই।', fr: 'Je suis fatigué et j\'ai besoin de dormir.', de: 'Ich bin sehr müde.'
    },
    colorClass: 'bg-indigo-100 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-950 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
  },
  {
    id: 'scared',
    category: 'Emotions',
    emoji: '😨',
    titles: {
      en: 'Scared', hi: 'डरा हुआ', es: 'Asustado', mr: 'घाबरलो', ta: 'பயம்', bn: 'ভীত', fr: 'Effrayé', de: 'Ängstlich'
    },
    phrases: {
      en: 'I feel scared or anxious.', hi: 'मुझे डर लग रहा है।', es: 'Tengo miedo.', mr: 'मला भीती वाटत आहे.', ta: 'எனக்கு பயமாக இருக்கிறது.', bn: 'আমার ভয় লাগছে।', fr: 'J\'ai peur.', de: 'Ich habe Angst.'
    },
    colorClass: 'bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-950 dark:text-purple-200 border border-purple-200 dark:border-purple-800'
  },
  {
    id: 'angry',
    category: 'Emotions',
    emoji: '😡',
    titles: {
      en: 'Angry', hi: 'गुस्सा', es: 'Enojado', mr: 'राग', ta: 'கோபம்', bn: 'রাগান্বিত', fr: 'En colère', de: 'Wütend'
    },
    phrases: {
      en: 'I am feeling angry or frustrated.', hi: 'मुझे गुस्सा आ रहा है।', es: 'Estoy enfadado.', mr: 'मला राग येत आहे.', ta: 'எனக்கு கோபமாக வருகிறது.', bn: 'আমার রাগ হচ্ছে।', fr: 'Je suis en colère.', de: 'Ich bin wütend.'
    },
    colorClass: 'bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-950 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
  },
  {
    id: 'overwhelmed',
    category: 'Emotions',
    emoji: '🤯',
    titles: {
      en: 'Overwhelmed', hi: 'घबराहट', es: 'Abrumado', mr: 'गोंधळलो', ta: 'தவிப்பு', bn: 'বিহ্বল', fr: 'Débordé', de: 'Überfordert'
    },
    phrases: {
      en: 'Too much is happening, I feel overwhelmed.', hi: 'सब कुछ बहुत ज्यादा लग रहा है।', es: 'Es demasiado, me siento abrumado.', mr: 'मला अस्वस्थ वाटत आहे.', ta: 'அதிகமாக இருக்கிறது.', bn: 'আমি চাপ অনুভব করছি।', fr: 'C\'est trop pour moi.', de: 'Das ist mir zu viel.'
    },
    colorClass: 'bg-fuchsia-100 dark:bg-fuchsia-950/80 hover:bg-fuchsia-200 dark:hover:bg-fuchsia-900 text-fuchsia-950 dark:text-fuchsia-200 border border-fuchsia-200 dark:border-fuchsia-800'
  },
  {
    id: 'loud',
    category: 'Emotions',
    emoji: '🔊',
    titles: {
      en: 'Too Loud', hi: 'शोर है', es: 'Muy Ruidoso', mr: 'खूप आवाज', ta: 'அதிக சத்தம்', bn: 'বেশি আওয়াজ', fr: 'Trop Fort', de: 'Zu Laut'
    },
    phrases: {
      en: 'It is too noisy here, it hurts my ears.', hi: 'यहाँ बहुत तेज शोर है।', es: 'Hay mucho ruido aquí.', mr: 'येथे खूप आवाज आहे.', ta: 'இங்கு அதிக சத்தம் கேட்கிறது.', bn: 'এখানে খুব শব্দ হচ্ছে।', fr: 'C\'est trop bruyant ici.', de: 'Es ist hier zu laut.'
    },
    colorClass: 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
  },
  {
    id: 'bright',
    category: 'Emotions',
    emoji: '💡',
    titles: {
      en: 'Too Bright', hi: 'तेज रोशनी', es: 'Mucha Luz', mr: 'तीव्र प्रकाश', ta: 'அதிக வெளிச்சம்', bn: 'তীব্র আলো', fr: 'Trop Lumineux', de: 'Zu Hell'
    },
    phrases: {
      en: 'The lights are too bright for my eyes.', hi: 'रोशनी बहुत तेज है।', es: 'La luz es muy brillante.', mr: 'प्रकाश खूप डोळ्यांना लागतोय.', ta: 'வெளிச்சம் அதிகமாக உள்ளது.', bn: 'আলো খুব তীব্র।', fr: 'La lumière est trop vive.', de: 'Das Licht blendet mich.'
    },
    colorClass: 'bg-yellow-100 dark:bg-yellow-950/80 hover:bg-yellow-200 dark:hover:bg-yellow-900 text-yellow-950 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
  },

  // 4. People & Family (8 cards)
  {
    id: 'mom',
    category: 'People',
    emoji: '👩',
    titles: {
      en: 'Mom / Mummy', hi: 'मम्मी', es: 'Mamá', mr: 'आई', ta: 'அம்மா', bn: 'মা', fr: 'Maman', de: 'Mama'
    },
    phrases: {
      en: 'I want Mummy please.', hi: 'मुझे मम्मी के पास जाना है।', es: 'Quiero a mamá por favor.', mr: 'मला आईकडे जायचे आहे.', ta: 'எனக்கு அம்மா வேண்டும்.', bn: 'আমি মায়ের কাছে যেতে চাই।', fr: 'Je veux maman s\'il vous plaît.', de: 'Ich möchte zu Mama bitte.'
    },
    colorClass: 'bg-pink-100 dark:bg-pink-950/80 hover:bg-pink-200 dark:hover:bg-pink-900 text-pink-950 dark:text-pink-200 border border-pink-200 dark:border-pink-800'
  },
  {
    id: 'dad',
    category: 'People',
    emoji: '👨',
    titles: {
      en: 'Dad / Papa', hi: 'पापा', es: 'Papá', mr: 'बाबा', ta: 'அப்பா', bn: 'বাবা', fr: 'Papa', de: 'Papa'
    },
    phrases: {
      en: 'I want Papa please.', hi: 'मुझे पापा के पास जाना है।', es: 'Quiero a papá por favor.', mr: 'मला बाबांकडे जायचे आहे.', ta: 'எனக்கு அப்பா வேண்டும்.', bn: 'আমি বাবার কাছে যেতে চাই।', fr: 'Je veux papa s\'il vous plaît.', de: 'Ich möchte zu Papa bitte.'
    },
    colorClass: 'bg-blue-100 dark:bg-blue-950/80 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
  },
  {
    id: 'doctor',
    category: 'People',
    emoji: '👩‍⚕️',
    titles: {
      en: 'Doctor / Therapist', hi: 'डॉक्टर', es: 'Terapeuta', mr: 'डॉक्टर', ta: 'மருத்துவர்', bn: 'ডাক্তার', fr: 'Docteur', de: 'Therapeut'
    },
    phrases: {
      en: 'I want to see my therapist.', hi: 'मुझे डॉक्टर से मिलना है।', es: 'Quiero ver a mi terapeuta.', mr: 'मला डॉक्टरांना भेटायचे आहे.', ta: 'மருத்துவரை பார்க்க வேண்டும்.', bn: 'আমি ডাক্তারের সাথে দেখা করতে চাই।', fr: 'Je veux voir mon thérapeute.', de: 'Ich möchte zum Therapeuten.'
    },
    colorClass: 'bg-teal-100 dark:bg-teal-950/80 hover:bg-teal-200 dark:hover:bg-teal-900 text-teal-950 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
  },
  {
    id: 'teacher',
    category: 'People',
    emoji: '🧑‍🏫',
    titles: {
      en: 'Teacher', hi: 'शिक्षक', es: 'Profesor', mr: 'शिक्षक', ta: 'ஆசிரியர்', bn: 'শিক্ষক', fr: 'Professeur', de: 'Lehrer'
    },
    phrases: {
      en: 'I want to talk to my teacher.', hi: 'मुझे शिक्षक से बात करनी है।', es: 'Quiero hablar con mi profesor.', mr: 'मला शिक्षकांशी बोलायचे आहे.', ta: 'ஆசிரியரிடம் பேச வேண்டும்.', bn: 'আমি শিক্ষকের সাথে কথা বলতে চাই।', fr: 'Je veux parler à mon professeur.', de: 'Ich möchte mit meinem Lehrer sprechen.'
    },
    colorClass: 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'friend',
    category: 'People',
    emoji: '🤝',
    titles: {
      en: 'Friend', hi: 'दोस्त', es: 'Amigo', mr: 'मित्र', ta: 'நண்பர்', bn: 'বন্ধু', fr: 'Ami', de: 'Freund'
    },
    phrases: {
      en: 'I want to play with my friend.', hi: 'मुझे अपने दोस्त के साथ खेलना है।', es: 'Quiero jugar con mi amigo.', mr: 'मला मित्रासोबत खेळायचे आहे.', ta: 'நண்பருடன் விளையாட வேண்டும்.', bn: 'আমি বন্ধুর সাথে খেলতে চাই।', fr: 'Je veux jouer avec mon ami.', de: 'Ich möchte mit meinem Freund spielen.'
    },
    colorClass: 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
  },
  {
    id: 'grandma',
    category: 'People',
    emoji: '👵',
    titles: {
      en: 'Grandma', hi: 'दादी / नानी', es: 'Abuela', mr: 'आजी', ta: 'பாட்டி', bn: 'ঠাকুমা', fr: 'Grand-mère', de: 'Oma'
    },
    phrases: {
      en: 'I want Grandma please.', hi: 'मुझे दादी या नानी चाहिए।', es: 'Quiero a mi abuela por favor.', mr: 'मला आजी हवी आहे.', ta: 'பாட்டி வேண்டும்.', bn: 'আমি ঠাকুমার কাছে যাব।', fr: 'Je veux ma grand-mère s\'il vous plaît.', de: 'Ich möchte zu Oma bitte.'
    },
    colorClass: 'bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-950 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
  },
  {
    id: 'grandpa',
    category: 'People',
    emoji: '👴',
    titles: {
      en: 'Grandpa', hi: 'दादा / नाना', es: 'Abuelo', mr: 'आजोबा', ta: 'தாத்தா', bn: 'দাদু', fr: 'Grand-père', de: 'Opa'
    },
    phrases: {
      en: 'I want Grandpa please.', hi: 'मुझे दादा या नाना चाहिए।', es: 'Quiero a mi abuelo por favor.', mr: 'मला आजोबा हवे आहेत.', ta: 'தாத்தா வேண்டும்.', bn: 'আমি দাদুর কাছে যাব।', fr: 'Je veux mon grand-père s\'il vous plaît.', de: 'Ich möchte zu Opa bitte.'
    },
    colorClass: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
  },
  {
    id: 'sibling',
    category: 'People',
    emoji: '👧',
    titles: {
      en: 'Brother / Sister', hi: 'भाई / बहन', es: 'Hermano/a', mr: 'भाऊ / बहीण', ta: 'உடன்பிறப்பு', bn: 'ভাই / বোন', fr: 'Frère / Sœur', de: 'Geschwister'
    },
    phrases: {
      en: 'I want my brother or sister.', hi: 'मुझे भाई या बहन के साथ रहना है।', es: 'Quiero a mi hermano o hermana.', mr: 'मला भाऊ किंवा बहीण हवी.', ta: 'என் உடன்பிறப்புடன் இருக்க வேண்டும்.', bn: 'আমি ভাই বা বোনের সাথে থাকব।', fr: 'Je veux mon frère ou ma sœur.', de: 'Ich möchte meine Geschwister.'
    },
    colorClass: 'bg-violet-100 dark:bg-violet-950/80 hover:bg-violet-200 dark:hover:bg-violet-900 text-violet-950 dark:text-violet-200 border border-violet-200 dark:border-violet-800'
  },

  // 5. Activities & School (8 cards)
  {
    id: 'play',
    category: 'Activities',
    emoji: '🧸',
    titles: {
      en: 'Play Toys', hi: 'खिलौने', es: 'Juguetes', mr: 'खेळणी', ta: 'விளையாட்டு', bn: 'খেলনা', fr: 'Jouets', de: 'Spielzeug'
    },
    phrases: {
      en: 'I want to play with my toys.', hi: 'मुझे खिलौनों से खेलना है।', es: 'Quiero jugar con mis juguetes.', mr: 'मला खेळण्यांशी खेळायचे आहे.', ta: 'பொம்மைகளுடன் விளையாட வேண்டும்.', bn: 'আমি খেলনা দিয়ে খেলতে চাই।', fr: 'Je veux jouer avec mes jouets.', de: 'Ich möchte mit Spielzeug spielen.'
    },
    colorClass: 'bg-yellow-100 dark:bg-yellow-950/80 hover:bg-yellow-200 dark:hover:bg-yellow-900 text-yellow-950 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
  },
  {
    id: 'book',
    category: 'Activities',
    emoji: '📖',
    titles: {
      en: 'Read Book', hi: 'किताब', es: 'Libro', mr: 'पुस्तक', ta: 'புத்தகம்', bn: 'বই পড়া', fr: 'Livre', de: 'Buch'
    },
    phrases: {
      en: 'Let us read a storybook together.', hi: 'मुझे कहानी की किताब पढ़नी है।', es: 'Leamos un libro juntos.', mr: 'गोष्टीचे पुस्तक वाचूया.', ta: 'கதை புத்தகம் படிக்கலாம்.', bn: 'গল্পের বই পড়ি।', fr: 'Lisons un livre d\'histoire ensemble.', de: 'Lass uns ein Buch lesen.'
    },
    colorClass: 'bg-blue-100 dark:bg-blue-950/80 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
  },
  {
    id: 'crayons',
    category: 'Activities',
    emoji: '🎨',
    titles: {
      en: 'Draw & Color', hi: 'चित्रकारी', es: 'Dibujar', mr: 'चित्रे रंगवणे', ta: 'வரைதல்', bn: 'ছবি আঁকা', fr: 'Dessiner', de: 'Malen'
    },
    phrases: {
      en: 'I want to draw and color.', hi: 'मुझे रंग भरना और चित्र बनाना है।', es: 'Quiero dibujar y colorear.', mr: 'मला चित्रे काढायची आहेत.', ta: 'படம் வரைந்து வண்ணம் தீட்ட வேண்டும்.', bn: 'আমি ছবি আঁকতে চাই।', fr: 'Je veux dessiner et colorier.', de: 'Ich möchte malen und zeichnen.'
    },
    colorClass: 'bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-950 dark:text-purple-200 border border-purple-200 dark:border-purple-800'
  },
  {
    id: 'music',
    category: 'Activities',
    emoji: '🎵',
    titles: {
      en: 'Music / Song', hi: 'संगीत / गाना', es: 'Música', mr: 'गाणी', ta: 'இசை', bn: 'গান', fr: 'Musique', de: 'Musik'
    },
    phrases: {
      en: 'Please play my favorite music.', hi: 'कृपया मेरा पसंदीदा गाना बजाएं।', es: 'Por favor pon mi música favorita.', mr: 'माझे आवडते गाणे लावा.', ta: 'எனக்கு பிடித்த பாடலை இசைக்கவும்.', bn: 'আমার প্রিয় গান বাজান।', fr: 'Mettez ma musique préférée s\'il vous plaît.', de: 'Bitte spiel meine Lieblingsmusik.'
    },
    colorClass: 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'walk',
    category: 'Activities',
    emoji: '🌳',
    titles: {
      en: 'Outside Walk', hi: 'बाहर घूमना', es: 'Paseo', mr: 'बाहेर फिरायला', ta: 'நடைபயிற்சி', bn: 'বাইরে হাঁটা', fr: 'Promenade', de: 'Spaziergang'
    },
    phrases: {
      en: 'I want to go for a walk outside.', hi: 'मुझे बाहर पार्क में घूमना है।', es: 'Quiero salir a pasear.', mr: 'मला बाहेर फिरायला जायचे आहे.', ta: 'வெளியே செல்ல வேண்டும்.', bn: 'আমি বাইরে হাঁটতে যেতে চাই।', fr: 'Je veux aller me promener dehors.', de: 'Ich möchte draußen spazieren gehen.'
    },
    colorClass: 'bg-teal-100 dark:bg-teal-950/80 hover:bg-teal-200 dark:hover:bg-teal-900 text-teal-950 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
  },
  {
    id: 'tablet',
    category: 'Activities',
    emoji: '📱',
    titles: {
      en: 'Tablet / Video', hi: 'टैबलेट', es: 'Tablet', mr: 'टॅबलेट', ta: 'டேப்லெட்', bn: 'ট্যাবলেট', fr: 'Tablette', de: 'Tablet'
    },
    phrases: {
      en: 'I want to watch my video on tablet.', hi: 'मुझे टैबलेट देखना है।', es: 'Quiero ver mi video en la tablet.', mr: 'मला टॅबलेट बघायचे आहे.', ta: 'டேப்லெட்டில் வீடியோ பார்க்க வேண்டும்.', bn: 'আমি ট্যাবলেটে ভিডিও দেখব।', fr: 'Je veux regarder une vidéo sur la tablette.', de: 'Ich möchte mein Video auf dem Tablet schauen.'
    },
    colorClass: 'bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 dark:hover:bg-sky-900 text-sky-950 dark:text-sky-200 border border-sky-200 dark:border-sky-800'
  },
  {
    id: 'puzzle',
    category: 'Activities',
    emoji: '🧩',
    titles: {
      en: 'Puzzle Game', hi: 'पहेली', es: 'Puzle', mr: 'कोडे', ta: 'புதிர்', bn: 'ধাঁধা', fr: 'Puzzle', de: 'Puzzle'
    },
    phrases: {
      en: 'I want to build my puzzle.', hi: 'मुझे पहेली जोड़नी है।', es: 'Quiero armar mi puzle.', mr: 'मला कोडे सोडवायचे आहे.', ta: 'புதிர் விளையாட வேண்டும்.', bn: 'আমি ধাঁধা মেলাতে চাই।', fr: 'Je veux faire mon puzzle.', de: 'Ich möchte mein Puzzle machen.'
    },
    colorClass: 'bg-orange-100 dark:bg-orange-950/80 hover:bg-orange-200 dark:hover:bg-orange-900 text-orange-950 dark:text-orange-200 border border-orange-200 dark:border-orange-800'
  },
  {
    id: 'ball',
    category: 'Activities',
    emoji: '⚽',
    titles: {
      en: 'Ball Catch', hi: 'गेंद', es: 'Pelota', mr: 'चेंडू', ta: 'பந்து', bn: 'বল খেলা', fr: 'Ballon', de: 'Ball'
    },
    phrases: {
      en: 'Let us roll or kick the ball!', hi: 'मुझे गेंद से खेलना है।', es: '¡Juguemos a la pelota!', mr: 'चेंडूने खेळूया!', ta: 'பந்து விளையாடலாம்!', bn: 'বল দিয়ে খেলি!', fr: 'Jouons au ballon !', de: 'Lass uns mit dem Ball spielen!'
    },
    colorClass: 'bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-950 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
  },

  // 6. Physical Comfort & Needs (8 cards)
  {
    id: 'hug',
    category: 'Comfort',
    emoji: '🫂',
    titles: {
      en: 'Hug Me', hi: 'गले लगाओ', es: 'Abrazo', mr: 'मिठी मारा', ta: 'கட்டிப்பிடி', bn: 'জড়িয়ে ধরো', fr: 'Câlin', de: 'Umarmung'
    },
    phrases: {
      en: 'I need a comforting hug.', hi: 'मुझे गले लगाओ।', es: 'Necesito un abrazo reconfortante.', mr: 'मला मिठी मारा.', ta: 'எனக்கு கட்டிப்பிடிப்பு வேண்டும்.', bn: 'আমাকে জড়িয়ে ধরুন।', fr: 'J\'ai besoin d\'un câlin.', de: 'Ich brauche eine Umarmung.'
    },
    colorClass: 'bg-pink-100 dark:bg-pink-950/80 hover:bg-pink-200 dark:hover:bg-pink-900 text-pink-950 dark:text-pink-200 border border-pink-200 dark:border-pink-800'
  },
  {
    id: 'blanket',
    category: 'Comfort',
    emoji: '🛏️',
    titles: {
      en: 'Warm Blanket', hi: 'कंबल', es: 'Manta', mr: 'घोंगडी / पांघरूण', ta: 'போர்வை', bn: 'কম্বল', fr: 'Couverture', de: 'Decke'
    },
    phrases: {
      en: 'Please wrap me in my warm blanket.', hi: 'मुझे मेरा कंबल चाहिए।', es: 'Por favor tápame con mi manta suave.', mr: 'मला माझे पांघरूण द्या.', ta: 'எனக்கு போர்வை வேண்டும்.', bn: 'আমাকে কম্বল দিন।', fr: 'Enveloppez-moi dans ma couverture s\'il vous plaît.', de: 'Bitte gib mir meine Kuscheldecke.'
    },
    colorClass: 'bg-indigo-100 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-950 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
  },
  {
    id: 'bathroom_comfort',
    category: 'Comfort',
    emoji: '🚻',
    titles: {
      en: 'Bathroom', hi: 'शौचालय', es: 'Baño', mr: 'शौचालय', ta: 'கழிவறை', bn: 'টয়লেট', fr: 'Toilettes', de: 'Toilette'
    },
    phrases: {
      en: 'I need to use the bathroom please.', hi: 'मुझे शौचालय जाना है।', es: 'Necesito ir al baño por favor.', mr: 'मला वॉशरूमला जायचे आहे.', ta: 'கழிவறை செல்ல வேண்டும்.', bn: 'আমাকে টয়লেটে যেতে হবে।', fr: 'Je dois aller aux toilettes s\'il vous plaît.', de: 'Ich muss bitte auf die Toilette.'
    },
    colorClass: 'bg-teal-100 dark:bg-teal-950/80 hover:bg-teal-200 dark:hover:bg-teal-900 text-teal-950 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
  },
  {
    id: 'coldpack',
    category: 'Comfort',
    emoji: '🧊',
    titles: {
      en: 'Cold Pack', hi: 'बर्फ / सिकाई', es: 'Hielo', mr: 'बर्फ सिकाई', ta: 'பனிப்பொதி', bn: 'বরফ প্যাক', fr: 'Poche Froide', de: 'Kühlpack'
    },
    phrases: {
      en: 'I need a soothing cold ice pack.', hi: 'मुझे बर्फ या ठंडी सिकाई चाहिए।', es: 'Necesito una compresa fría.', mr: 'मला थंड सिकाई हवी आहे.', ta: 'குளிர் பொதி வேண்டும்.', bn: 'আমাকে বরফ দিন।', fr: 'J\'ai besoin d\'une poche de glace.', de: 'Ich brauche ein Kühlpack.'
    },
    colorClass: 'bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 dark:hover:bg-sky-900 text-sky-950 dark:text-sky-200 border border-sky-200 dark:border-sky-800'
  },
  {
    id: 'rest',
    category: 'Comfort',
    emoji: '🌙',
    titles: {
      en: 'Quiet Rest', hi: 'विश्राम', es: 'Descanso', mr: 'शांत विश्रांती', ta: 'ஓய்வு', bn: 'বিশ্রাম', fr: 'Repos', de: 'Ruhepause'
    },
    phrases: {
      en: 'I need to lie down and rest in quiet.', hi: 'मुझे शांत कमरे में आराम चाहिए।', es: 'Necesito descansar en silencio.', mr: 'मला शांत खोलीत विश्रांती हवी.', ta: 'அமைதியாக ஓய்வெடுக்க வேண்டும்.', bn: 'আমি শান্তিতে বিশ্রাম নিতে চাই।', fr: 'J\'ai besoin de me reposer au calme.', de: 'Ich brauche Ruhe.'
    },
    colorClass: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
  },
  {
    id: 'socks',
    category: 'Comfort',
    emoji: '🧦',
    titles: {
      en: 'Socks Off', hi: 'मोजे उतारो', es: 'Quitar Calcetines', mr: 'मोजे काढा', ta: 'சாக்ஸ் கழற்று', bn: 'মোজা খোলা', fr: 'Retirer Chaussettes', de: 'Socken Aus'
    },
    phrases: {
      en: 'My socks feel uncomfortable, please take them off.', hi: 'मेरे मोजे उतार दें, चुभ रहे हैं।', es: 'Mis calcetines me molestan, quítalos por favor.', mr: 'माझे मोजे काढा, टोचत आहेत.', ta: 'சாக்ஸ் உறுத்துகிறது, கழற்றுங்கள்.', bn: 'আমার মোজা খুলে দিন।', fr: 'Mes chaussettes me gênent, retirez-les s\'il vous plaît.', de: 'Bitte zieh mir die Socken aus.'
    },
    colorClass: 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
  },
  {
    id: 'headphones',
    category: 'Comfort',
    emoji: '🎧',
    titles: {
      en: 'Headphones', hi: 'हेडफोन', es: 'Auriculares', mr: 'हेडफोन', ta: 'ஹெட்போன்', bn: 'হেডফোন', fr: 'Casque', de: 'Kopfhörer'
    },
    phrases: {
      en: 'Please give me my noise canceling headphones.', hi: 'कृपया मुझे शोर कम करने वाले हेडफोन दें।', es: 'Por favor dame mis auriculares antirruido.', mr: 'कृपया मला हेडफोन द्या.', ta: 'எனக்கு ஹெட்போன் கொடுங்கள்.', bn: 'আমাকে হেডফোন দিন।', fr: 'Donnez-moi mon casque anti-bruit s\'il vous plaît.', de: 'Bitte gib mir meine Kopfhörer.'
    },
    colorClass: 'bg-blue-100 dark:bg-blue-950/80 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
  },
  {
    id: 'wash',
    category: 'Comfort',
    emoji: '🧼',
    titles: {
      en: 'Wash Face', hi: 'मुँह धोना', es: 'Lavar Cara', mr: 'तोंड धुणे', ta: 'முகம் கழுவு', bn: 'মুখ ধোয়া', fr: 'Laver Visage', de: 'Gesicht Waschen'
    },
    phrases: {
      en: 'I want to wash my face with cool water.', hi: 'मुझे हाथ और मुँह धोना है।', es: 'Quiero lavarme la cara con agua fresca.', mr: 'मला हात-तोंड धुवायचे आहे.', ta: 'முகம் கழுவ வேண்டும்.', bn: 'আমি মুখ ধুতে চাই।', fr: 'Je veux me laver le visage.', de: 'Ich möchte mein Gesicht waschen.'
    },
    colorClass: 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
  },
];

const ITEMS_PER_PAGE = 8;

export default function ChildAACBoard({ onSelectBreathe }) {
  const { language, speechCode, switchScanActive, logSession, t, getEffectiveVoicePersona } = useAccessibility();
  const { activeChild } = useAuth();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState('Core');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentenceStrip, setSentenceStrip] = useState([]);
  const [activeSpeech, setActiveSpeech] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);

  // Student Profile Isolation Namespace Slug
  const currentChildSlug = (activeChild?.firstName || 'reyansh').toLowerCase();

  // Morphosyntactic Grammar Modal State (Brown's Stage III-IV)
  const [grammarModalCard, setGrammarModalCard] = useState(null);

  // AI SLP Agent Predictive State
  const [aiPredictions, setAiPredictions] = useState([
    { id: 'water', title: 'Water', emoji: '💧', titleHi: 'पानी', category: 'Food', colorClass: 'bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 text-sky-950 dark:text-sky-200 border border-sky-200 dark:border-sky-800' },
    { id: 'eat', title: 'Eat Food', emoji: '🍎', titleHi: 'खाना', category: 'Food', colorClass: 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' },
    { id: 'help', title: 'Help Me', emoji: '❓', titleHi: 'मदद', category: 'Core', colorClass: 'bg-blue-100 dark:bg-blue-950/80 hover:bg-blue-200 text-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800' },
    { id: 'break', title: 'Break / Rest', emoji: '⏸️', titleHi: 'विश्राम', category: 'Core', colorClass: 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800' }
  ]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [expandedSentence, setExpandedSentence] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);

  // Custom User-Created AAC Cards (Namespace-Isolated per Student)
  const getCustomCardsForChild = (slug) => {
    try {
      const key = `savia_custom_aac_cards_${slug}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      if (slug === 'reyansh') {
        const legacy = localStorage.getItem('savia_custom_aac_cards');
        if (legacy) return JSON.parse(legacy);
      }
    } catch (e) {
      console.warn('Failed to load custom AAC cards', e);
    }
    return slug === 'ananya' ? [
      {
        id: 'custom_ananya_wheelchair',
        titles: { en: 'Wheelchair Switch', hi: 'व्हीलचेयर स्विच' },
        phrases: { en: 'Please adjust my wheelchair position.', hi: 'कृपया मेरी व्हीलचेयर को ठीक करें।' },
        title: 'Wheelchair Switch',
        emoji: '♿',
        category: 'Core',
        colorClass: 'bg-teal-100 dark:bg-teal-950/80 text-teal-950 dark:text-teal-200 border border-teal-300',
        isCustom: true
      }
    ] : slug === 'kabir' ? [
      {
        id: 'custom_kabir_apraxia',
        titles: { en: 'Slow Speech', hi: 'धीमी आवाज' },
        phrases: { en: 'Please speak slowly with me.', hi: 'कृपया मेरे साथ धीरे बोलें।' },
        title: 'Slow Speech',
        emoji: '🗣️',
        category: 'Core',
        colorClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-300',
        isCustom: true
      }
    ] : [];
  };

  const [customCards, setCustomCards] = useState(() => getCustomCardsForChild(currentChildSlug));

  // Sync custom cards when active classroom student switches
  useEffect(() => {
    setCustomCards(getCustomCardsForChild(currentChildSlug));
  }, [currentChildSlug]);

  // Form State for new card
  const [newTitle, setNewTitle] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [newEmoji, setNewEmoji] = useState('🍪');
  const [newCategory, setNewCategory] = useState('Food');
  const [useFitzgeraldKey, setUseFitzgeraldKey] = useState(false);
  const [onBoardSwitchScan, setOnBoardSwitchScan] = useState(false);
  const [scanSpeedMs, setScanSpeedMs] = useState(2000);

  // Assistive Hardware & Eye-Gaze Dwell-Time Selection Engine
  const [isDwellActive, setIsDwellActive] = useState(false);
  const [dwellTimeMs, setDwellTimeMs] = useState(900);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [dwellProgress, setDwellProgress] = useState(0);
  const dwellTimerRef = useRef(null);
  const dwellIntervalRef = useRef(null);

  // Cortical Visual Impairment (CVI) 2-Tile High-Contrast Mode
  const [cviMode, setCviMode] = useState(false);
  const [cviPairIndex, setCviPairIndex] = useState(0); // 0 = Want/Break, 1 = Yes/No, 2 = Help/More

  // Custom Photo & Parent Voice Banking State
  const [newCustomPhoto, setNewCustomPhoto] = useState(null);
  const [newCustomVoice, setNewCustomVoice] = useState(null);
  const [isRecordingCustomVoice, setIsRecordingCustomVoice] = useState(false);
  const customMediaRecorderRef = useRef(null);
  const customAudioChunksRef = useRef([]);

  const startCustomVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      customAudioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      customMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) customAudioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(customAudioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setNewCustomVoice(reader.result);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingCustomVoice(true);
      playEarcon('tap');
    } catch (err) {
      console.warn('Microphone recording error', err);
      toast.error('Microphone access denied for custom voice recording.');
    }
  };

  const stopCustomVoiceRecording = () => {
    if (customMediaRecorderRef.current && isRecordingCustomVoice) {
      customMediaRecorderRef.current.stop();
      setIsRecordingCustomVoice(false);
      playEarcon('success');
    }
  };

  // Client-Side Canvas Image Downsampler (Prevents 5MB LocalStorage Quota Exceeded)
  const compressImage = (file, maxWidth = 160, maxHeight = 160, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 160, 160, 0.8);
        setNewCustomPhoto(compressed);
        playEarcon('tap');
      } catch (err) {
        console.warn('Photo compression error', err);
        const reader = new FileReader();
        reader.onloadend = () => setNewCustomPhoto(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  // Emergency SOS State
  const [showSOSModal, setShowSOSModal] = useState(false);

  const getFitzgeraldColorClass = (category) => {
    switch (category) {
      case 'People':
        return 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600 shadow-xs';
      case 'Core':
      case 'Activities':
        return 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-2 border-emerald-400 dark:border-emerald-600 shadow-xs';
      case 'Emotions':
        return 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/80 text-blue-950 dark:text-blue-200 border-2 border-blue-400 dark:border-blue-600 shadow-xs';
      case 'Food':
        return 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/80 text-orange-950 dark:text-orange-200 border-2 border-orange-400 dark:border-orange-600 shadow-xs';
      case 'Comfort':
      default:
        return 'bg-fuchsia-100 hover:bg-fuchsia-200 dark:bg-fuchsia-950/80 text-fuchsia-950 dark:text-fuchsia-200 border-2 border-fuchsia-400 dark:border-fuchsia-600 shadow-xs';
    }
  };

  const categories = [
    { key: 'Core', label: t ? t('catCore', 'Core') : 'Core', emoji: '💬' },
    { key: 'Food', label: t ? t('catFood', 'Food') : 'Food', emoji: '🍎' },
    { key: 'Emotions', label: t ? t('catEmotions', 'Emotions') : 'Emotions', emoji: '😊' },
    { key: 'People', label: t ? t('catPeople', 'People') : 'People', emoji: '👩' },
    { key: 'Activities', label: t ? t('catActivities', 'Activities') : 'Activities', emoji: '🧸' },
    { key: 'Comfort', label: t ? t('catComfort', 'Comfort') : 'Comfort', emoji: '🫂' },
    { key: 'All', label: t ? t('allCategories', 'All') : 'All', emoji: '🎴' },
  ];

  // Merge default and custom cards
  const allCards = useMemo(() => {
    return [...AAC_VOCABULARY, ...customCards];
  }, [customCards]);

  // Filter cards by category and search
  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      const matchesCat = selectedCategory === 'All' || card.category === selectedCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const currentTitle = (card.titles?.[language] || card.titles?.en || card.title || '').toLowerCase();
      const currentPhrase = (card.phrases?.[language] || card.phrases?.en || card.soundTextEn || '').toLowerCase();
      return currentTitle.includes(q) || currentPhrase.includes(q);
    });
  }, [allCards, selectedCategory, searchQuery, language]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / ITEMS_PER_PAGE));
  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCards.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCards, currentPage]);

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
    setScanIndex(0);
  }, [selectedCategory, searchQuery]);

  // Single-Switch Scanning for Motor-Impaired Children (Cerebral Palsy / Switch Access)
  const isScanningActive = switchScanActive || onBoardSwitchScan;
  useEffect(() => {
    if (!isScanningActive || paginatedCards.length === 0) return;

    const timer = setInterval(() => {
      setScanIndex(prev => (prev + 1) % paginatedCards.length);
      playEarcon('tap');
    }, scanSpeedMs);

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        const currentCard = paginatedCards[scanIndex];
        if (currentCard) {
          handleCardTap(currentCard);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isScanningActive, paginatedCards, scanIndex, scanSpeedMs]);

  // Escape listener for showAddModal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showAddModal) {
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const getCardTitle = (card) => {
    if (card.titles && card.titles[language]) return card.titles[language];
    if (card.titles && card.titles.en) return card.titles.en;
    if (card.titleHi && language === 'hi') return card.titleHi;
    return card.title || 'Word';
  };

  const getCardPhrase = (card) => {
    if (card.phrases && card.phrases[language]) return card.phrases[language];
    if (card.phrases && card.phrases.en) return card.phrases.en;
    if (card.soundTextHi && language === 'hi') return card.soundTextHi;
    return card.soundTextEn || card.title || 'Word';
  };

  const handleCardTap = (card) => {
    const phrase = getCardPhrase(card);
    const title = getCardTitle(card);

    setActiveSpeech(phrase);
    setSentenceStrip(prev => [...prev, { id: Date.now() + Math.random(), card, title, phrase, emoji: card.emoji, customPhoto: card.customPhoto }]);
    triggerHaptic('tap');
    playEarcon('tap');

    // Priority to parent recorded voice banking audio, fallback to TTS
    if (card.customVoiceAudio) {
      try {
        const audio = new Audio(card.customVoiceAudio);
        audio.play();
      } catch (err) {
        speakText(phrase, { lang: speechCode || 'en-US', gender: getEffectiveVoicePersona(currentChildSlug) });
      }
    } else {
      speakText(phrase, { lang: speechCode || 'en-US', gender: getEffectiveVoicePersona(currentChildSlug) });
    }
  };

  // Dwell-Time Hover Enter / Leave Handlers for Eye-Tracking
  const handleCardMouseEnter = (card) => {
    if (!isDwellActive) return;
    setHoveredCardId(card.id);
    setDwellProgress(0);

    const stepMs = 30;
    const increment = (stepMs / dwellTimeMs) * 100;

    if (dwellIntervalRef.current) clearInterval(dwellIntervalRef.current);

    dwellIntervalRef.current = setInterval(() => {
      setDwellProgress(prev => {
        if (prev + increment >= 100) {
          clearInterval(dwellIntervalRef.current);
          handleCardTap(card);
          playEarcon('success');
          return 100;
        }
        return prev + increment;
      });
    }, stepMs);
  };

  const handleCardMouseLeave = () => {
    if (!isDwellActive) return;
    if (dwellIntervalRef.current) clearInterval(dwellIntervalRef.current);
    setHoveredCardId(null);
    setDwellProgress(0);
  };

  // SOS Emergency Alert Trigger
  const handleTriggerSOS = () => {
    setShowSOSModal(true);
    playEarcon('warning');
    triggerHaptic('warning');
    const emergencyMsg = language === 'hi'
      ? 'आपातकालीन सहायता: मेरा नाम रेयांश है। मैं बोल नहीं सकता। कृपया तुरंत मेरी मम्मी को 9876543210 पर कॉल करें।'
      : 'Emergency Assistance: My name is Reyansh. I am a non-verbal child. Please call my emergency guardian at 98765-43210 immediately.';
    speakText(emergencyMsg, { lang: speechCode || 'en-US', gender: getEffectiveVoicePersona(currentChildSlug), rate: 0.9, pitch: 1.0 });
  };

  const handleSpeakFullSentence = () => {
    if (sentenceStrip.length === 0) return;
    const fullText = sentenceStrip.map(item => item.title).join(' ');
    setActiveSpeech(fullText);
    playEarcon('success');
    triggerHaptic('success');
    speakText(fullText, { lang: speechCode || 'en-US', gender: getEffectiveVoicePersona(currentChildSlug) });
  };

  const handleRemoveLastTile = () => {
    setSentenceStrip(prev => prev.slice(0, -1));
    playEarcon('tap');
    triggerHaptic('tap');
  };

  const handleClearSentence = () => {
    setSentenceStrip([]);
    setActiveSpeech('');
    playEarcon('tap');
  };

  const handleLogAACPractice = () => {
    const wordsSpoken = sentenceStrip.length > 0 
      ? sentenceStrip.map(s => s.title).join(' + ') 
      : `${selectedCategory} category practice`;

    logSession({
      category: 'AAC',
      title: 'AAC Communication Drill',
      durationMinutes: 15,
      moodRating: 'HAPPY',
      provider: 'Speech / Self-Directed',
      milestones: `Sentence composed: "${wordsSpoken}"`,
      notes: `Used interactive AAC communicator in ${language.toUpperCase()}. Spoke ${sentenceStrip.length} communication chips.`
    });
    toast.clinical(
      language === 'hi' ? 'AAC अभ्यास सत्र लेज़र में रिकॉर्ड कर लिया गया!' : 'AAC practice drill logged to health ledger!',
      { title: 'AAC Drill Logged' }
    );
  };

  const handleAddCustomCard = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCard = {
      id: `custom_${Date.now()}`,
      titles: { [language]: newTitle.trim(), en: newTitle.trim() },
      phrases: { [language]: newPhrase.trim() || newTitle.trim(), en: newPhrase.trim() || newTitle.trim() },
      title: newTitle.trim(),
      emoji: newEmoji || '💬',
      customPhoto: newCustomPhoto,
      customVoiceAudio: newCustomVoice,
      category: newCategory,
      colorClass: 'bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-950 dark:text-purple-200 border border-purple-200 dark:border-purple-800',
      isCustom: true
    };

    const updated = [...customCards, newCard];
    setCustomCards(updated);
    try {
      localStorage.setItem(`savia_custom_aac_cards_${currentChildSlug}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage save warning', err);
      toast.error('Storage quota reached. Custom card preserved in live memory.');
    }

    setNewTitle('');
    setNewPhrase('');
    setNewCustomPhoto(null);
    setNewCustomVoice(null);
    setShowAddModal(false);
    playEarcon('success');
    toast.success(`Custom card "${newTitle.trim()}" created for ${activeChild?.firstName || 'Reyansh'}!`);
  };

  const handleDeleteCard = (id, e) => {
    e.stopPropagation();
    const updated = customCards.filter(c => c.id !== id);
    setCustomCards(updated);
    try {
      localStorage.setItem(`savia_custom_aac_cards_${currentChildSlug}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage delete warning', err);
    }
    toast.info('Custom card removed.');
  };

  // Real-time SLP Agent Predictive Inference Effect
  useEffect(() => {
    let isCurrent = true;
    const tokens = sentenceStrip.map(s => s.card?.id || s.title);
    
    async function runPredictiveSLP() {
      setIsPredicting(true);
      try {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const res = await predictNextAAC(tokens, 'CALM', timeNow);
        if (isCurrent && res && res.predicted_tiles && res.predicted_tiles.length > 0) {
          setAiPredictions(res.predicted_tiles);
          if (res.expanded_phrase_en) {
            setExpandedSentence({
              en: res.expanded_phrase_en,
              hi: res.expanded_phrase_hi,
              urgency: res.urgency || 'NORMAL'
            });
          }
        }
      } catch (e) {
        console.warn('AI prediction error', e);
      } finally {
        if (isCurrent) setIsPredicting(false);
      }
    }

    const timer = setTimeout(runPredictiveSLP, 200);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [sentenceStrip]);

  const handleAITileTap = (tile) => {
    const title = language === 'hi' && tile.titleHi ? tile.titleHi : tile.title;
    const phrase = language === 'hi' && tile.titleHi ? tile.titleHi : (tile.phrases?.[language] || tile.title);
    const colorClass = tile.colorClass || 'bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-200';
    
    setActiveSpeech(phrase);
    setSentenceStrip(prev => [...prev, {
      id: Date.now() + Math.random(),
      card: { ...tile, colorClass },
      title,
      phrase,
      emoji: tile.emoji || '💬'
    }]);
    triggerHaptic('tap');
    playEarcon('tap');
    speakText(phrase, { lang: speechCode || 'en-US', gender: getEffectiveVoicePersona(currentChildSlug) });
  };

  const handleSpeakAIExpanded = () => {
    if (!expandedSentence) return;
    const textToSpeak = language === 'hi' ? expandedSentence.hi : expandedSentence.en;
    setActiveSpeech(textToSpeak);
    playEarcon('success');
    triggerHaptic('success');
    speakText(textToSpeak, { lang: speechCode || 'en-US', gender: getEffectiveVoicePersona(currentChildSlug) });
    toast.clinical(
      language === 'hi' ? `AI प्राकृतिक वाक्य: "${textToSpeak}"` : `AI Polished Sentence: "${textToSpeak}"`,
      { title: 'SLP Agent Expanded Speech' }
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-150">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>🎴</span>
              <span>{t ? t('aacVoiceBoard', 'AAC Voice Board') : 'AAC Voice Board'}</span>
            </h3>
            {switchScanActive && (
              <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-full animate-pulse">
                🕹️ {t ? t('switchMode', 'Switch Mode') : 'Switch'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {t ? t('tapToSpeak', 'Tap cards to speak instantly or build a sentence') : 'Tap cards to speak instantly or build a sentence'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* SOS Emergency Broadcast Card */}
          <button
            onClick={handleTriggerSOS}
            title="1-Tap Emergency Broadcast & Guardian Medical Alert"
            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black flex items-center space-x-1 transition-all shadow-md shadow-rose-500/20 active:scale-95 animate-pulse"
          >
            <span>🚨</span>
            <span>SOS</span>
          </button>

          {/* Dwell-Time Eye Tracking Toggle */}
          <button
            onClick={() => {
              setIsDwellActive(prev => !prev);
              toast.info(!isDwellActive ? '👁️ Eye-Gaze Dwell Selection ON (Hover 900ms to speak)' : 'Dwell Selection OFF');
            }}
            title="Eye-Gaze Dwell Time Selection for Severe Motor Speech / Quadriplegic Users"
            className={`px-2.5 py-1.5 rounded-2xl text-xs font-black border flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 ${
              isDwellActive
                ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300 dark:ring-purple-700'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>👁️</span>
            <span className="hidden sm:inline">{isDwellActive ? 'Dwell: ON' : 'Dwell'}</span>
          </button>

          {/* Cortical Visual Impairment (CVI) 2-Tile Mode Toggle */}
          <button
            onClick={() => {
              setCviMode(prev => !prev);
              toast.info(!cviMode ? '🔲 CVI Mode ON (2-Tile High-Contrast Yellow/Black Layout)' : 'CVI Mode OFF (Standard Grid)');
            }}
            title="Low Cognitive Load & High-Contrast 2-Tile Mode for Cortical Visual Impairment"
            className={`px-2.5 py-1.5 rounded-2xl text-xs font-black border flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 ${
              cviMode
                ? 'bg-yellow-400 text-black border-yellow-500 ring-2 ring-yellow-300 font-extrabold'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>🔲</span>
            <span className="hidden sm:inline">{cviMode ? 'CVI: ON' : 'CVI'}</span>
          </button>

          {/* Switch Access Scanning Mode Toggle */}
          <button
            onClick={() => {
              setOnBoardSwitchScan(prev => !prev);
              toast.info(!onBoardSwitchScan ? '♿ Switch Auto-Scan Activated (Spacebar / Tap anywhere to select)' : 'Switch Auto-Scan Deactivated');
            }}
            title="Single-Switch Auto-Scanning for Motor Impairments / Cerebral Palsy"
            className={`px-2.5 py-1.5 rounded-2xl text-xs font-black border flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 ${
              isScanningActive
                ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 dark:ring-blue-700 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>♿</span>
            <span className="hidden sm:inline">{isScanningActive ? 'Scan: ON' : 'Switch'}</span>
          </button>

          {/* Fitzgerald Clinical Key Toggle */}
          <button
            onClick={() => {
              setUseFitzgeraldKey(prev => !prev);
              toast.info(!useFitzgeraldKey ? 'Switched to Modified Fitzgerald Key Clinical Standard Colors' : 'Switched to Default Pastel Colors');
            }}
            title="Toggle Modified Fitzgerald Key Clinical Standard Colors"
            className={`px-2.5 py-1.5 rounded-2xl text-xs font-black border flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 ${
              useFitzgeraldKey
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-400 ring-2 ring-amber-300 dark:ring-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>🎨</span>
            <span className="hidden sm:inline">{useFitzgeraldKey ? 'Fitzgerald ON' : 'Colors'}</span>
          </button>

          {/* Add Custom Tile Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#2563EB] dark:text-blue-300 rounded-2xl text-xs font-black border border-blue-200 dark:border-blue-800 flex items-center space-x-1 transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{t ? t('addTile', 'Tile') : 'Tile'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Sentence Builder Strip (Clinical Standard) */}
      <div className="bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 space-y-2.5 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1">
            <span>🗣️</span>
            <span>Sentence Builder / वाक्य पट्टी</span>
          </span>
          {sentenceStrip.length > 0 && (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleRemoveLastTile}
                title="Backspace"
                className="px-2 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 flex items-center space-x-1 transition-all"
              >
                <Delete className="w-3 h-3" />
                <span className="hidden sm:inline">{t ? t('backspace', 'Back') : 'Back'}</span>
              </button>
              <button
                onClick={handleClearSentence}
                title="Clear sentence"
                className="px-2 py-1 bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 flex items-center space-x-1 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">{t ? t('clear', 'Clear') : 'Clear'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Chips Container */}
        <div className="min-h-[48px] bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200/60 dark:border-slate-800 flex items-center flex-wrap gap-1.5">
          {sentenceStrip.length === 0 ? (
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 italic px-2">
              {t ? t('sentenceStripPlaceholder', 'Tap cards below to compose a sentence...') : 'Tap cards below to compose a sentence...'}
            </span>
          ) : (
            sentenceStrip.map((item, i) => (
              <span
                key={item.id || i}
                className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-[#2563EB] dark:text-blue-200 px-2.5 py-1 rounded-lg text-xs font-black shadow-2xs animate-in zoom-in-95 duration-100"
              >
                <span>{item.emoji}</span>
                <span>{item.title}</span>
              </span>
            ))
          )}
        </div>

        {/* Sentence Action Triggers */}
        {sentenceStrip.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleSpeakFullSentence}
                className="py-2.5 px-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t ? t('speakSentence', 'Speak Raw Sequence') : 'Speak Raw Sequence'}</span>
              </button>

              <button
                onClick={handleSpeakAIExpanded}
                className="py-2.5 px-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-sm shadow-indigo-500/20 transition-all active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span>{language === 'hi' ? '✨ AI प्राकृतिक वाक (SLP Agent)' : '✨ AI Polish & Speak (SLP)'}</span>
              </button>
            </div>

            {expandedSentence && (
              <div className="bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/80 rounded-xl p-2.5 flex items-center justify-between text-xs animate-in fade-in duration-150">
                <div className="flex items-center space-x-2 min-w-0">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-indigo-500 dark:text-indigo-400 block">
                      SLP Agent Synthesized Phrase
                    </span>
                    <span className="font-bold text-slate-800 dark:text-indigo-100 truncate block">
                      "{language === 'hi' ? expandedSentence.hi : expandedSentence.en}"
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-300/60 shrink-0">
                  {expandedSentence.urgency}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2.5. AI Predictive Next-Word Suggestion Rail (Autonomous SLP Agent) */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/80 dark:from-slate-850/80 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/60 dark:border-indigo-900/50 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'स्मार्ट AI सुझाव (SLP Agent)' : 'AI Predictive Next Words'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
            {isPredicting ? (
              <span className="inline-flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                <span>Predicting...</span>
              </span>
            ) : (
              <span>Dynamic SLP Graph</span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {aiPredictions.map((tile, idx) => {
            const displayTitle = language === 'hi' && tile.titleHi ? tile.titleHi : tile.title;
            return (
              <button
                key={tile.id || idx}
                onClick={() => handleAITileTap(tile)}
                className="p-2 bg-white/90 dark:bg-slate-900/90 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl flex items-center space-x-2 transition-all active:scale-95 text-left group shadow-2xs"
              >
                <span className="text-xl group-hover:scale-110 transition-transform shrink-0">
                  {tile.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 block truncate">
                    {displayTitle}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block truncate">
                    {tile.category || 'Quick Suggest'}
                  </span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Hospital-Grade AAC Command Bar (Search & Category Selector) */}
      <div className="space-y-2.5">
        {/* Row A: Prominent Clinical Search Input with Clear Button and Match Counter */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={t ? t('searchCards', 'Search cards (e.g. water, hungry, happy, mom)...') : 'Search cards (e.g. water, hungry, happy)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl pl-10 pr-24 py-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner"
          />
          <div className="absolute right-2.5 flex items-center space-x-1.5">
            {searchQuery ? (
              <>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hidden sm:inline px-1">
                {filteredCards.length} {selectedCategory} tiles
              </span>
            )}
          </div>
        </div>

        {/* Row B: Clean Horizontal Scrollable Category Pills with edge padding */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const count = allCards.filter(c => cat.key === 'All' || c.category === cat.key).length;
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  if (searchQuery) setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 select-none ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-blue-500/20 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-transparent'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive 
                    ? 'bg-blue-700/80 text-white' 
                    : 'bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Single-Switch Scanning Highlight Banner */}
      {isScanningActive && paginatedCards[scanIndex] && (
        <button
          onClick={() => handleCardTap(paginatedCards[scanIndex])}
          className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-2xl shadow-sm border border-amber-500 flex items-center justify-center space-x-2 transition-all active:scale-98"
        >
          <span>👉</span>
          <span>
            {language === 'hi' ? 'चयनित कार्ड बोलें:' : 'Select Highlighted:'}{' '}
            <strong>{paginatedCards[scanIndex].emoji} {getCardTitle(paginatedCards[scanIndex])}</strong> (Spacebar)
          </span>
        </button>
      )}

      {/* 5. CVI 2-Tile High-Contrast Mode OR 8-Tile Paginated Grid */}
      {cviMode ? (
        /* CVI High-Contrast 2-Tile Mode for Cortical Visual Impairment */
        <div className="space-y-3 bg-black p-4 rounded-3xl border-4 border-yellow-400">
          <div className="flex items-center justify-between text-yellow-400 text-xs font-black">
            <span>🔲 CVI HIGH-CONTRAST 2-TILE MODE</span>
            <button
              onClick={() => setCviPairIndex(p => (p + 1) % 3)}
              className="px-3 py-1 bg-yellow-400 text-black rounded-xl font-black text-xs hover:bg-yellow-300"
            >
              Switch Pair ({cviPairIndex === 0 ? 'Want/Break' : cviPairIndex === 1 ? 'Yes/No' : 'Help/More'}) 🔄
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              cviPairIndex === 0 
                ? { id: 'cvi_want', emoji: '💬', title: language === 'hi' ? 'मुझे चाहिए' : 'I WANT', phrase: language === 'hi' ? 'मुझे चाहिए' : 'I want please' }
                : cviPairIndex === 1 
                ? { id: 'cvi_yes', emoji: '👍', title: language === 'hi' ? 'हाँ' : 'YES', phrase: language === 'hi' ? 'हाँ' : 'Yes please' }
                : { id: 'cvi_help', emoji: '❓', title: language === 'hi' ? 'मदद' : 'HELP', phrase: language === 'hi' ? 'कृपया मदद करें' : 'Help me please' },
              cviPairIndex === 0 
                ? { id: 'cvi_break', emoji: '⏸️', title: language === 'hi' ? 'विश्राम' : 'BREAK', phrase: language === 'hi' ? 'मुझे आराम चाहिए' : 'I need a break please' }
                : cviPairIndex === 1 
                ? { id: 'cvi_no', emoji: '👎', title: language === 'hi' ? 'नहीं' : 'NO', phrase: language === 'hi' ? 'नहीं' : 'No thank you' }
                : { id: 'cvi_more', emoji: '➕', title: language === 'hi' ? 'और' : 'MORE', phrase: language === 'hi' ? 'मुझे और चाहिए' : 'More please' }
            ].map((cviCard) => (
              <button
                key={cviCard.id}
                onClick={() => handleCardTap(cviCard)}
                onMouseEnter={() => handleCardMouseEnter(cviCard)}
                onMouseLeave={handleCardMouseLeave}
                className="p-8 bg-black hover:bg-neutral-900 border-4 border-yellow-400 rounded-3xl flex flex-col items-center justify-center space-y-3 transition-transform active:scale-98 min-h-[220px] relative select-none"
              >
                {hoveredCardId === cviCard.id && isDwellActive && (
                  <div className="absolute inset-0 bg-yellow-400/20 backdrop-blur-2xs rounded-2xl flex items-center justify-center pointer-events-none">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle cx="32" cy="32" r="26" className="stroke-yellow-900" strokeWidth="6" fill="none" />
                        <circle cx="32" cy="32" r="26" className="stroke-yellow-400" strokeWidth="6" fill="none"
                          strokeDasharray="163.3" strokeDashoffset={163.3 - (163.3 * dwellProgress) / 100} />
                      </svg>
                      <span className="absolute text-xs font-black text-yellow-400">{Math.round(dwellProgress)}%</span>
                    </div>
                  </div>
                )}
                <span className="text-6xl">{cviCard.emoji}</span>
                <span className="text-2xl font-black text-yellow-400 tracking-wider">{cviCard.title}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Standard 8-Tile Paginated Grid */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {paginatedCards.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
              No cards found matching "{searchQuery}".
            </div>
          ) : (
            paginatedCards.map((card, idx) => {
              const isScanned = isScanningActive && idx === scanIndex;
              const displayTitle = getCardTitle(card);
              const cardColor = useFitzgeraldKey ? getFitzgeraldColorClass(card.category) : card.colorClass;
              const isDwellHovered = hoveredCardId === card.id && isDwellActive;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardTap(card)}
                  onMouseEnter={() => handleCardMouseEnter(card)}
                  onMouseLeave={handleCardMouseLeave}
                  className={`p-3 rounded-2xl text-center font-black text-xs cursor-pointer transition-all duration-150 active:scale-95 flex flex-col items-center justify-center space-y-1.5 min-h-[96px] relative group select-none ${cardColor} ${
                    isScanned ? 'ring-4 ring-blue-600 dark:ring-blue-400 ring-offset-2 scale-105 shadow-2xl bg-blue-50/90 dark:bg-blue-950/90 border-blue-500 text-blue-950 dark:text-white animate-pulse z-10' : ''
                  }`}
                >
                  {/* Eye-Tracking Dwell Progress Indicator */}
                  {isDwellHovered && (
                    <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-2xs rounded-2xl flex items-center justify-center pointer-events-none z-20">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 -rotate-90">
                          <circle cx="24" cy="24" r="20" className="stroke-slate-200/50 dark:stroke-slate-700/50" strokeWidth="4" fill="none" />
                          <circle cx="24" cy="24" r="20" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="4" fill="none"
                            strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * dwellProgress) / 100} />
                        </svg>
                        <span className="absolute text-[10px] font-black text-blue-600 dark:text-blue-300">{Math.round(dwellProgress)}%</span>
                      </div>
                    </div>
                  )}

                  {card.customPhoto ? (
                    <img src={card.customPhoto} alt={displayTitle} className="w-10 h-10 object-cover rounded-xl shadow-xs" />
                  ) : (
                    <span className="text-3xl leading-none transition-transform group-hover:scale-110">{card.emoji}</span>
                  )}
                  <span className="truncate w-full px-1 text-center font-extrabold">{displayTitle}</span>

                  {/* Brown's Stage III-IV Grammar Conjugation Trigger */}
                  {GRAMMAR_CONJUGATIONS[card.id] && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGrammarModalCard(card);
                        playEarcon('tap');
                      }}
                      title="Conjugate Verb / Morphosyntax (Brown's Stage III-IV)"
                      className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white/90 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-black shadow-xs transition-all opacity-85 hover:opacity-100 hover:scale-110 z-10"
                    >
                      ✨
                    </button>
                  )}

                  {card.isCustom && (
                    <button
                      onClick={(e) => handleDeleteCard(card.id, e)}
                      title="Delete custom card"
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/80 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900 text-slate-400 hover:text-rose-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 6. Professional Pagination Toolbar (Never Endless Scroll) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <div className="flex items-center space-x-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPage === p
                    ? 'bg-[#2563EB] text-white shadow-xs font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center space-x-1 transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Add Custom AAC Card Modal with Portal rendering */}
      {showAddModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <span>➕</span>
                <span>{t ? t('addTile', 'Add Custom AAC Card') : 'Add Custom AAC Card'}</span>
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                title="Return Back (Esc)"
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomCard} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Card Label (e.g. Biscuit, Grandma, Music)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biscuit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Spoken Phrase (Spoken Aloud)
                </label>
                <input
                  type="text"
                  placeholder="e.g. I want to eat my biscuit please!"
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Emoji Icon</label>
                  <div className="flex items-center space-x-1.5">
                    {['🍪', '🧸', '👵', '🧃', '🎨', '🎵'].map((emo) => (
                      <button
                        type="button"
                        key={emo}
                        onClick={() => setNewEmoji(emo)}
                        className={`text-xl p-1.5 rounded-lg border transition-all ${
                          newEmoji === emo ? 'bg-blue-100 dark:bg-blue-900 border-[#2563EB] scale-110' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Food">Food</option>
                    <option value="Comfort">Comfort</option>
                    <option value="People">People</option>
                    <option value="Emotions">Emotions</option>
                    <option value="Activities">Activities</option>
                  </select>
                </div>
              </div>

              {/* Real Object Photo Upload & Parent Voice Banking Studio */}
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#2563EB] dark:text-blue-300 uppercase tracking-wider flex items-center space-x-1">
                    <span>📸</span>
                    <span>Real-World Photo & Parent Voice Banking</span>
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">Autism Cognitive Aid</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Real Object Photo
                    </label>
                    <label className="cursor-pointer py-2 px-2 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-dashed border-blue-300 dark:border-blue-700 rounded-xl flex items-center justify-center space-x-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                      <span>📁</span>
                      <span className="truncate">{newCustomPhoto ? 'Photo Added ✅' : 'Choose Photo'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Parent Voice Memo Recorder */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Parent Voice Memo
                    </label>
                    {isRecordingCustomVoice ? (
                      <button
                        type="button"
                        onClick={stopCustomVoiceRecording}
                        className="w-full py-2 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-black animate-pulse flex items-center justify-center space-x-1"
                      >
                        <span>⏹️</span>
                        <span>Stop Rec</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startCustomVoiceRecording}
                        className={`w-full py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 border ${
                          newCustomVoice
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span>🎙️</span>
                        <span>{newCustomVoice ? 'Voice Saved ✅' : 'Record Voice'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {newCustomPhoto && (
                  <div className="flex items-center space-x-2 pt-1">
                    <img src={newCustomPhoto} alt="Preview" className="w-10 h-10 object-cover rounded-xl border border-blue-400" />
                    <button
                      type="button"
                      onClick={() => setNewCustomPhoto(null)}
                      className="text-[10px] font-bold text-rose-500 hover:underline"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all"
                >
                  ← {t ? t('cancel', 'Cancel') : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all"
                >
                  {t ? t('save', 'Save Card') : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* SOS Emergency Broadcast & Medical ID Modal */}
      {showSOSModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowSOSModal(false); }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-[99999] p-4 overflow-y-auto animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border-4 border-rose-500 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            {/* Emergency Header */}
            <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900 pb-3">
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-black text-sm sm:text-base">
                <span className="text-2xl animate-bounce">🚨</span>
                <span>EMERGENCY MEDICAL ID & BROADCAST</span>
              </div>
              <button 
                onClick={() => setShowSOSModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Bilingual Spoken Broadcast Banner */}
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-1.5">
              <p className="font-extrabold text-xs sm:text-sm text-rose-950 dark:text-rose-200">
                "My name is Reyansh. I am non-verbal. Please call my emergency guardian immediately."
              </p>
              <p className="text-xs text-rose-800 dark:text-rose-300 font-semibold">
                "मेरा नाम रेयांश है। मैं बोल नहीं सकता। कृपया तुरंत मेरी मम्मी को 98765-43210 पर कॉल करें।"
              </p>
            </div>

            {/* Emergency Medical & Guardian Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">Primary Guardian (Mother)</span>
                <span className="font-black text-slate-900 dark:text-white block">Sunita Sharma</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold block">+91 98765-43210</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">Lead Pediatric SLP</span>
                <span className="font-black text-slate-900 dark:text-white block">Dr. Neha Verma</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block">Rainbow Children's Hospital</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">Blood Group & Medical ID</span>
                <span className="font-black text-rose-600 dark:text-rose-400 block">O+ Positive • #P-9841</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">Critical Allergies / Alerts</span>
                <span className="font-black text-amber-600 dark:text-amber-400 block">Peanuts • Severe Latex</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <a 
                href="tel:9876543210"
                className="w-full sm:flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-center font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/30 active:scale-95 transition-all"
              >
                <span>📞 Call Guardian (+91 98765-43210)</span>
              </a>
              <button
                onClick={() => {
                  const emergencyMsg = language === 'hi'
                    ? 'आपातकालीन सहायता: मेरा नाम रेयांश है। मैं बोल नहीं सकता। कृपया तुरंत मेरी मम्मी को 9876543210 पर कॉल करें।'
                    : 'Emergency Assistance: My name is Reyansh. I am a non-verbal child. Please call my emergency guardian at 98765-43210 immediately.';
                  speakText(emergencyMsg, { lang: speechCode || 'en-US' });
                  playEarcon('warning');
                }}
                className="w-full sm:w-auto px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-all"
              >
                <span>🔊 Re-Broadcast</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Morphosyntactic Grammar & Verb Conjugation Modal (Brown's Stage III-IV) */}
      {grammarModalCard && GRAMMAR_CONJUGATIONS[grammarModalCard.id] && typeof document !== 'undefined' && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setGrammarModalCard(null); }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-[99999] p-4 overflow-y-auto animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 max-w-md w-full shadow-2xl border border-amber-300 dark:border-amber-700/80 space-y-4 my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl font-bold border border-amber-300">
                  {grammarModalCard.emoji}
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <span>{getCardTitle(grammarModalCard)}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-full">
                      Grammar Conjugation
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {language === 'hi' ? "ब्राउन स्टेज III-IV क्रिया रूप व वाक्य विस्तार" : "Brown's Stage III-IV Morphosyntactic Verb Inflections"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGrammarModalCard(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* 5 Grammatical Inflection Options */}
            <div className="space-y-2">
              {[
                { type: 'root', labelEn: 'Root Form', labelHi: 'मूल रूप', icon: '🌿', bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-900' },
                { type: 'continuous', labelEn: 'Present Continuous (-ing)', labelHi: 'वर्तमान जारी (-ing)', icon: '🔄', bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900' },
                { type: 'past', labelEn: 'Past Tense (-ed)', labelHi: 'भूतकाल (-ed)', icon: '⏳', bg: 'hover:bg-purple-50 dark:hover:bg-purple-950/50 border-purple-200 dark:border-purple-900' },
                { type: 'negation', labelEn: 'Negation / Refusal (No/Not)', labelHi: 'नकार / अस्वीकृति', icon: '🚫', bg: 'hover:bg-rose-50 dark:hover:bg-rose-950/50 border-rose-200 dark:border-rose-900' },
                { type: 'question', labelEn: 'Interrogative (Question)', labelHi: 'प्रश्न रूप', icon: '❓', bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/50 border-amber-200 dark:border-amber-900' }
              ].map(inf => {
                const conj = GRAMMAR_CONJUGATIONS[grammarModalCard.id];
                const item = conj?.[inf.type];
                if (!item) return null;
                const title = language === 'hi' ? item.hi : item.en;
                const phrase = language === 'hi' ? item.phraseHi : item.phraseEn;

                return (
                  <button
                    key={inf.type}
                    onClick={() => {
                      setActiveSpeech(phrase);
                      setSentenceStrip(prev => [
                        ...prev,
                        {
                          id: Date.now() + Math.random(),
                          card: grammarModalCard,
                          title,
                          phrase,
                          emoji: grammarModalCard.emoji,
                          inflected: true,
                          inflectionType: inf.type
                        }
                      ]);
                      speakText(phrase, { lang: speechCode || 'en-US', gender: getEffectiveVoicePersona(currentChildSlug) });
                      triggerHaptic('tap');
                      playEarcon('success');
                      setGrammarModalCard(null);
                      toast.clinical(phrase, { title: `${inf.labelEn} Applied` });
                    }}
                    className={`w-full p-2.5 rounded-2xl border bg-white dark:bg-slate-800/80 text-left flex items-center justify-between transition-all active:scale-98 ${inf.bg}`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">{inf.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-xs text-slate-900 dark:text-white font-black">{title}</strong>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                            ({language === 'hi' ? inf.labelHi : inf.labelEn})
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium block">
                          "{phrase}"
                        </span>
                      </div>
                    </div>
                    <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Cancel */}
            <button
              onClick={() => setGrammarModalCard(null)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all"
            >
              Cancel ✕
            </button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
