import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  Container, Box, Typography, TextField, Button, 
  Paper, LinearProgress, Alert, MenuItem, Grid, Divider,
  FormControl, InputLabel, Select
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

// --- ICONS ---
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LanguageIcon from '@mui/icons-material/Language';
import EditNoteIcon from '@mui/icons-material/EditNote';

import logo from './logo.png'; 

// --- THEME CONFIGURATION ---
let theme = createTheme({
  palette: {
    primary: {
      main: '#F57C00', // Orange
      light: 'rgba(245, 124, 0, 0.1)',
    },
    secondary: {
      main: '#B31B1B', // Red
    },
    text: {
      primary: '#2c3e50',
      secondary: '#34495e',
    },
    background: {
      default: '#f8f9fa',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
    h1: {
      fontWeight: 700,
      color: '#B31B1B',
      textAlign: 'center',
      fontSize: '2.2rem',
    },
    h2: {
      fontWeight: 600,
      color: '#B31B1B',
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        }
      }
    }
  }
});
theme = responsiveFontSizes(theme);

const containerStyles = {
  padding: { xs: 2, sm: 3, md: 4 },
  margin: { xs: '1rem auto', md: '2rem auto' },
  borderRadius: '15px',
  backgroundColor: 'background.paper',
  border: '1px solid #e9ecef',
  maxWidth: { xs: '100%', sm: '700px', md: '900px' },
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

// --- DATA: QUESTIONS VARIANT B ---
const questionsB = [
  // --- MCQs (1-12) ---
  {
    id: 1,
    en: "Q1. Your team is excited about the premium launch, but service capacity is limited. A customer asks: “Can you guarantee fast service appointments?”",
    ur: "سوال 1: آپ کی ٹیم پریمیئم لانچ کے حوالے سے ُپرجوش ہے، مگر سروس کی گنجائش محدود ہے۔ ایک کسٹمر پوچھتا ہے: ”کیا آپ تیز سروس اپائنٹمنٹس کی ضمانت دے سکتے ہیں؟“",
    options: [
      { key: 'A', en: "You confidently promise priority service because premium customers expect it.", ur: "آپ پورے اعتماد سے ترجیحی سروس کا وعدہ کر دیتے ہیں کیونکہ پریمیئم کسٹمرز یہی توقع رکھتے ہیں۔" },
      { key: 'B', en: "You avoid the service discussion and keep focus on the vehicle and booking.", ur: "آپ سروس والی گفتگو سے گریز کرتے ہیں اور توجہ گاڑی اور بکنگ پر رکھتے ہیں۔" },
      { key: 'C', en: "You advise them to service at another location if they need speed.", ur: "اگر انہیں تیزی چاہیے ہو تو آپ انہیں مشورہ دیتے ہیں کہ وہ کسی اور جگہ سے سروس کروا لیں۔" },
      { key: 'D', en: "You set realistic expectations, explain service processes, and offer practical solutions (booking windows, escalation channel).", ur: "آپ حقیقت پسندانہ توقعات طے کرتے ہیں، سروس کے عمل کی وضاحت کرتے ہیں، اور عملی حل دیتے ہیں (بکنگ ونڈوز، اسکیلیشن چینل وغیرہ)۔" }
    ]
  },
  {
    id: 2,
    en: "Q2. A customer says: “I want the best deal. My cousin got a better price last month.” Your dealership has limited flexibility due to margins, but you can add small value items.",
    ur: "سوال 2: ایک کسٹمر کہتا ہے: ”مجھے سب سے بہترین ڈیل چاہیے۔ میرے کزن کو پچھلے مہینے زیادہ بہتر پرائس ملی تھی۔“ آپ کی ڈیلرشپ میں مارجن کی وجہ سے لچک محدود ہے، مگر آپ چھوٹی ویلیو ایڈ آئٹمز شامل کر سکتے ہیں۔",
    options: [
      { key: 'A', en: "You acknowledge their concern, ask what “best deal” means to them, and propose a value bundle aligned to their priorities.", ur: "آپ ان کی تشویش تسلیم کرتے ہیں، پوچھتے ہیں کہ ”بہترین ڈیل“ سے ان کی مراد کیا ہے، اور ان کی ترجیحات کے مطابق ویلیو بنڈل تجویز کرتے ہیں۔" },
      { key: 'B', en: "You explain the policy and pricing structure, and ask them to decide if the current price works for them.", ur: "آپ پالیسی اور پرائسنگ اسٹرکچر سمجھاتے ہیں اور پوچھتے ہیں کہ کیا موجودہ پرائس ان کے لیے قابلِ قبول ہے یا نہیں۔" },
      { key: 'C', en: "You ask for proof of the cousin’s deal first, then decide what you can do.", ur: "آپ پہلے کزن کی ڈیل کا ثبوت مانگتے ہیں، پھر فیصلہ کرتے ہیں کہ آپ کیا کر سکتے ہیں۔" },
      { key: 'D', en: "You show empathy and immediately offer the maximum discount you can, to keep momentum.", ur: "آپ ہمدردی دکھاتے ہوئے فوراً اپنی زیادہ سے زیادہ ڈسکاؤنٹ آفر کر دیتے ہیں تاکہ رفتار برقرار رہے۔" }
    ]
  },
  {
    id: 3,
    en: "Q3. A customer agrees to book but wants to “think overnight” before paying the booking amount. They also ask you not to follow up too much.",
    ur: "سوال 3: ایک کسٹمر بکنگ کرنے پر اصولی طور پر رضامند ہے، مگر بکنگ رقم دینے سے پہلے ”رات بھر سوچنا“ چاہتا ہے۔ وہ یہ بھی کہتا ہے کہ زیادہ فالو اَپ نہ کریں۔",
    options: [
      { key: 'A', en: "You call once later that night to confirm, since booking intent is highest now.", ur: "آپ اسی رات ایک بار کال کر کے کنفرم کرنے کی کوشش کرتے ہیں کیونکہ اسی وقت بکنگ کی نیت سب سے مضبوط ہوتی ہے۔" },
      { key: 'B', en: "You send one message in the evening and one in the morning to keep momentum without “too much” follow-up.", ur: "آپ شام میں ایک پیغام اور صبح ایک پیغام بھیجتے ہیں تاکہ رفتار برقرار رہے مگر ”زیادہ“ فالو اَپ بھی نہ ہو۔" },
      { key: 'C', en: "You agree, summarize the decision points, and set one specific follow-up time they choose.", ur: "آپ رضامندی ظاہر کرتے ہیں، فیصلہ کرنے کے نکات سمیٹتے ہیں، اور ان ہی کے منتخب کردہ ایک مخصوص وقت پر فالو اَپ طے کر لیتے ہیں۔" },
      { key: 'D', en: "You don’t follow up at all until they contact you, to respect their request.", ur: "آپ بالکل فالو اَپ نہیں کرتے اور صرف ان کے رابطہ کرنے کا انتظار کرتے ہیں تاکہ ان کی بات کی مکمل پاسداری ہو۔" }
    ]
  },
  {
    id: 4,
    en: "Q4. Your dealership receives a sudden instruction from DSM to prioritize a specific model mix this month. Your team feels it will hurt customer experience.",
    ur: "سوال 4: آپ کی ڈیلرشپ کو ڈی ایس ایم کی طرف سے اچانک ہدایت ملتی ہے کہ اس ماہ ایک مخصوص ماڈل مکس کو ترجیح دی جائے۔ آپ کی ٹیم کو لگتا ہے اس سے کسٹمر ایکسپیرینس متاثر ہوگا۔",
    options: [
      { key: 'A', en: "You align on the directive, but translate it into customer-friendly behaviors and tracking, then review weekly for course-correction.", ur: "آپ ہدایت کو سامنے رکھتے ہوئے اسے کسٹمر فرینڈلی روّیوں/اسکرپٹس اور ٹریکنگ میں تبدیل کرتے ہیں، اور ہفتہ وار جائزہ لے کر اصلاح کرتے رہتے ہیں۔" },
      { key: 'B', en: "You push back strongly to DSM and delay execution until you get flexibility.", ur: "آپ سختی سے واپس مؤقف رکھتے ہیں اور لچک ملنے تک عمل درآمد مؤخر کر دیتے ہیں۔" },
      { key: 'C', en: "You let each consultant decide how to balance it individually.", ur: "آپ ہر سیلز کنسلٹنٹ کو اپنی سمجھ کے مطابق توازن رکھنے دیتے ہیں، بغیر کسی واضح یکساں طریقے کے۔" },
      { key: 'D', en: "You tell the team to follow it as-is and focus on numbers.", ur: "آپ ٹیم کو کہتے ہیں کہ ہدایت جیسے کی تیسی فالو کریں اور صرف نمبرز پر فوکس رکھیں۔" }
    ]
  },
  {
    id: 5,
    en: "Q5. A high-intent premium customer asks for a test drive today, but the demo car has a minor issue and is not in perfect condition. You can still drive it, but the experience may feel “less premium.” Another demo can be arranged in 2–3 days.",
    ur: "سوال 5: ایک ہائی اِنٹینٹ پریمیئم کسٹمر آج ہی ٹیسٹ ڈرائیو مانگتا ہے، مگر دستیاب ڈیمو کار میں ہلکی سی کاسمیٹک خرابی ہے جو ”کم پریمیئم“ محسوس ہو سکتی ہے۔ دوسری ڈیمو کار 2–3 دن میں دستیاب ہو سکتی ہے۔",
    options: [
      { key: 'A', en: "You offer the test drive today but acknowledge the condition, and you suggest a second drive later for the best experience before final commitment.", ur: "آپ آج ہی ٹیسٹ ڈرائیو آفر کرتے ہیں مگر حالت واضح کر دیتے ہیں، اور ساتھ یہ آپشن دیتے ہیں کہ حتمی کمٹمنٹ سے پہلے بہترین تجربے کے لیے بعد میں دوبارہ ٹیسٹ ڈرائیو کر لی جائے۔" },
      { key: 'B', en: "You insist they wait for the other demo car, because a premium customer should only see the best version.", ur: "آپ اصرار کرتے ہیں کہ وہ دوسری ڈیمو کار کا انتظار کریں کیونکہ پریمیئم کسٹمر کو صرف بہترین حالت والی گاڑی دکھانی چاہیے۔" },
      { key: 'C', en: "You proceed with the test drive today without mentioning the issue, to protect momentum.", ur: "آپ خرابی کا ذکر کیے بغیر آج ہی ٹیسٹ ڈرائیو کروا دیتے ہیں تاکہ رفتار اور دلچسپی برقرار رہے۔" },
      { key: 'D', en: "You cancel the test drive and shift to a brochure/features discussion until the demo is ready.", ur: "آپ ٹیسٹ ڈرائیو منسوخ کر کے بروشر/فیچرز کی بات چیت تک محدود رہتے ہیں جب تک ڈیمو تیار نہ ہو۔" }
    ]
  },
  {
    id: 6,
    en: "Q6. A customer complains on social media: “This dealership wasted my time, no one responded properly.” The post is gaining attention. You suspect the customer may be exaggerating, but there could be truth.",
    ur: "سوال 6: ایک کسٹمر سوشل میڈیا پر شکایت کرتا ہے: ”اس ڈیلرشپ نے میرا وقت ضائع کیا، کسی نے ٹھیک سے جواب نہیں دیا۔“ پوسٹ پھیل رہی ہے۔ آپ کو لگتا ہے کسٹمر کچھ بڑھا چڑھا کر بھی کہہ سکتا ہے، مگر حقیقت بھی ہو سکتی ہے۔",
    options: [
      { key: 'A', en: "You avoid replying publicly to reduce visibility and call them directly to resolve it quietly.", ur: "آپ عوامی طور پر جواب نہیں دیتے تاکہ معاملہ زیادہ نہ پھیلے، اور خاموشی سے انہیں کال کر کے حل کرنے کی کوشش کرتے ہیں۔" },
      { key: 'B', en: "You reply publicly with empathy and invite them to DM, while internally reviewing CRM logs and ownership of the case.", ur: "آپ عوامی طور پر ہمدردانہ جواب دیتے ہیں اور انہیں ڈی ایم کی دعوت دیتے ہیں، ساتھ ہی اندرونی طور پر سی آر ایم لاگز اور کیس اونرشپ چیک کرتے ہیں۔" },
      { key: 'C', en: "You reply publicly with facts from your records to correct misinformation.", ur: "آپ عوامی طور پر اپنے ریکارڈ کے حقائق کے ساتھ جواب دے کر غلط بیانی درست کرتے ہیں۔" },
      { key: 'D', en: "You ask your team who handled it, and decide whether to respond after hearing their side.", ur: "آپ پہلے ٹیم سے معلوم کرتے ہیں کس نے ہینڈل کیا تھا، پھر ان کی رائے سن کر فیصلہ کرتے ہیں کہ جواب دینا ہے یا نہیں۔" }
    ]
  },
  {
    id: 7,
    en: "Q7. One of your consultants keeps calling leads repeatedly. Some leads convert, but you also see increasing complaints about “too many calls.”",
    ur: "سوال 7: آپ کے ایک کنسلٹنٹ کی عادت ہے کہ وہ لیڈز کو بار بار کال کرتا ہے۔ کچھ لیڈز کنورٹ بھی ہوتی ہیں، مگر ”بہت زیادہ کالز“ کی شکایات بڑھ رہی ہیں۔",
    options: [
      { key: 'A', en: "You review call patterns and outcomes, coach a structured follow-up cadence, and set a team standard.", ur: "آپ کال پیٹرنز اور نتائج کا جائزہ لیتے ہیں، ایک منظم فالو اَپ کیڈنس سکھاتے ہیں، اور ٹیم کے لیے واضح معیار طے کرتے ہیں۔" },
      { key: 'B', en: "You let it continue because results matter, and address complaints only if they increase further.", ur: "آپ اسے جاری رہنے دیتے ہیں کیونکہ نتائج آ رہے ہیں، اور شکایات بہت بڑھیں تو بعد میں دیکھیں گے۔" },
      { key: 'C', en: "You reassign their leads to someone else temporarily to protect customer experience.", ur: "آپ کسٹمر ایکسپیرینس بچانے کے لیے اس کی لیڈز عارضی طور پر کسی اور کو دے دیتے ہیں۔" },
      { key: 'D', en: "You tell them to reduce calls immediately without discussing details, to avoid complaints.", ur: "آپ فوراً کہہ دیتے ہیں کالز کم کر دو—مزید تفصیل یا کوچنگ کے بغیر۔" }
    ]
  },
  {
    id: 8,
    en: "Q8. It’s month-end, the dealership is busy, and you’ve had a tense interaction with a customer who accused your team of misleading them on delivery timelines. Right after that, a new walk-in customer arrives and says they were referred by a VIP client and expects “priority treatment.” Your team is watching your reaction.",
    ur: "سوال 8: مہینے کے اختتام پر ڈیلرشپ بہت مصروف ہے اور ابھی ایک کسٹمر نے آپ کی ٹیم پر ڈیلیوری ٹائم لائن کے حوالے سے غلط رہنمائی کا الزام لگایا ہے۔ اسی کے فوراً بعد ایک نیا واک اِن آتا ہے جو کہتا ہے اسے وی آئی پی ریفرنس ملا ہے اور وہ ”پرائرٹی ٹریٹمنٹ“ چاہتا ہے۔ ٹیم آپ کے ردِعمل کو دیکھ رہی ہے۔",
    options: [
      { key: 'A', en: "You ask a senior consultant to handle the new customer because you’re not in the right headspace, and you step away to cool off.", ur: "آپ کسی سینئر کنسلٹنٹ کو ہینڈل کرنے دیتے ہیں کیونکہ آپ ذہنی طور پر ٹھیک حالت میں نہیں، اور خود کچھ دیر کے لیے ہٹ جاتے ہیں۔" },
      { key: 'B', en: "You immediately engage the new customer with high energy to recover the situation, even if your tone feels slightly forced.", ur: "آپ فوراً بہت ہائی انرجی کے ساتھ نئے کسٹمر کو ہینڈل کرتے ہیں تاکہ ماحول سنبھل جائے، چاہے یہ مصنوعی لگے۔" },
      { key: 'C', en: "You take a brief moment to reset, delegate the immediate tasks calmly, and engage the new customer with steady professionalism.", ur: "آپ کچھ لمحے خود کو ری سیٹ کرتے ہیں، کام پرسکون انداز میں تقسیم کرتے ہیں، اور نئے کسٹمر کو متوازن پروفیشنل انداز میں ہینڈل کرتے ہیں۔" },
      { key: 'D', en: "You vent your frustration to your team about the earlier customer, then move on to the VIP referral with urgency.", ur: "آپ پہلے ٹیم کے ساتھ جھنجھالہٹ کا اظہار کرتے ہیں، پھر وی آئی پی ریفرنس کی طرف تیزی سے بڑھ جاتے ہیں۔" }
    ]
  },
  {
    id: 9,
    en: "Q9. Your dealership is particularly busy today, with several walk-in customers. A customer enters quietly, takes their time, and looks around without approaching anyone. You are in the middle of dealing with other customers.",
    ur: "سوال 9: آج آپ کی ڈیلرشپ خاصی مصروف ہے اور کئی واک اِن کسٹمرز موجود ہیں۔ ایک کسٹمر خاموشی سے آتا ہے، ادھر اُدھر دیکھتا ہے مگر کسی سے بات نہیں کرتا۔ آپ اس وقت دوسرے کسٹمرز کے ساتھ مصروف ہیں۔",
    options: [
      { key: 'A', en: "You acknowledge the customer’s presence with a warm greeting from a distance and wait for a moment to see if they need help, ensuring they don’t feel ignored.", ur: "آپ دور سے مسکرا کر مختصر سلام/اشارہ کرتے ہیں تاکہ وہ نظر انداز محسوس نہ کریں، پھر موقع ملتے ہی مختصر ضرورت جانچنے والا سوال کر کے شامل ہوتے ہیں۔" },
      { key: 'B', en: "You ignore the customer for now, believing that they will understand you are busy and that you will approach them once you are available.", ur: "آپ انہیں کہتے ہیں کچھ دیر انتظار کریں، پھر فارغ ہو کر واپس آتے ہیں۔" },
      { key: 'C', en: "You politely ask the customer to wait for a few minutes while you finish up with the other customers, offering them something to look at in the meantime.", ur: "آپ موجودہ کسٹمرز پر فوکس رکھتے ہیں اور سمجھتے ہیں وہ خود رابطہ کر لیں گے۔" },
      { key: 'D', en: "You continue focusing on the immediate customers, assuming that this customer will approach you when they’re ready, and don’t engage further.", ur: "آپ مکمل طور پر تب تک نظر انداز کرتے ہیں جب تک آپ بالکل فری نہ ہو جائیں۔" }
    ]
  },
  {
    id: 10,
    en: "Q10. A customer’s spouse is skeptical and keeps whispering that “Suzuki isn’t premium.” The main buyer stays polite but becomes quieter.",
    ur: "سوال 10: ایک کسٹمر کے شریکِ حیات بار بار سرگوشی کرتا ہے کہ ”سوزوکی پریمیئم نہیں ہے۔“ مرکزی خریدار شائستہ رہتا ہے مگر آہستہ آہستہ خاموش ہوتا جا رہا ہے۔",
    options: [
      { key: 'A', en: "You offer a comparison with competitors, emphasizing where your car is stronger.", ur: "آپ مقابل برانڈز سے براہِ راست موازنہ کر کے اپنی گاڑی کی برتری دکھاتے ہیں۔" },
      { key: 'B', en: "You acknowledge both perspectives, ask what “premium” means to them, and reframe the discussion around their specific standards.", ur: "آپ دونوں کے نقطۂ نظر کو تسلیم کرتے ہیں، پوچھتے ہیں کہ ان کے لیے ”پریمیئم“ کا مطلب کیا ہے، اور گفتگو کو ان کے معیار اور ضروریات کے مطابق فریم کرتے ہیں۔" },
      { key: 'C', en: "You respond by listing premium features quickly to counter the perception.", ur: "آپ فوراً پریمیئم فیچرز کی فہرست سنا کر اس تاثر کو توڑنے کی کوشش کرتے ہیں۔" },
      { key: 'D', en: "You focus only on the main buyer to avoid turning it into a debate with the spouse.", ur: "آپ صرف مرکزی خریدار پر فوکس کرتے ہیں تاکہ بات بحث میں نہ بدل جائے۔" }
    ]
  },
  {
    id: 11,
    en: "Q11. During a team huddle, one consultant says: “Premium customers are too difficult; let’s focus on easy sales.” Others nod.",
    ur: "سوال 11: ٹیم ہڈل میں ایک کنسلٹنٹ کہتا ہے: ”پریمیئم کسٹمرز بہت مشکل ہیں؛ آسان سیلز پر فوکس کریں۔“ باقی لوگ بھی اثبات میں سر ہلاتے ہیں۔",
    options: [
      { key: 'A', en: "You acknowledge the concern, reframe the opportunity, and set one concrete improvement action (skill + process) for the week.", ur: "آپ تشویش تسلیم کرتے ہیں، موقع کو ری فریم کرتے ہیں، اور ہفتے کے لیے ایک واضح بہتری والا قدم طے کرتے ہیں (مہارت + عمل)۔" },
      { key: 'B', en: "You challenge the comment sharply to stop negativity and reinforce standards.", ur: "آپ اس بات کو سختی سے چیلنج کرتے ہیں تاکہ منفی سوچ رکے اور معیار واضح ہو۔" },
      { key: 'C', en: "You speak to the consultant privately later, but don’t address the team mood now.", ur: "آپ بعد میں نجی طور پر اس کنسلٹنٹ سے بات کرتے ہیں مگر اسی وقت ٹیم کے موڈ کو ایڈریس نہیں کرتے۔" },
      { key: 'D', en: "You ignore it and continue the huddle to avoid creating tension.", ur: "آپ کشیدگی سے بچنے کے لیے ہڈل جاری رکھتے ہیں اور بات کو نظر انداز کر دیتے ہیں۔" }
    ]
  },
  {
    id: 12,
    en: "Q12. Two customers arrive at the same time: one is a walk-in family; the other is a scheduled premium customer who values privacy. Your staff is stretched.",
    ur: "سوال 12: دو کسٹمرز ایک ہی وقت میں آ جاتے ہیں: ایک واک اِن فیملی ہے، دوسرا شیڈولڈ پریمیئم کسٹمر ہے جو پرائیویسی کو اہمیت دیتا ہے۔ اسٹاف محدود ہے۔",
    options: [
      { key: 'A', en: "You ask the premium customer to wait briefly and offer refreshments, then start with the family.", ur: "آپ پریمیئم کسٹمر سے کہتے ہیں تھوڑی دیر انتظار کریں، ریفریشمنٹ آفر کرتے ہیں، پھر فیملی کو پہلے ہینڈل کرتے ہیں۔" },
      { key: 'B', en: "You handle the family first since they are physically present and more demanding in the moment.", ur: "آپ فیملی کو پہلے ہینڈل کرتے ہیں کیونکہ وہ اسی وقت زیادہ ”ڈیمانڈنگ“ ہیں۔" },
      { key: 'C', en: "You delegate clearly—assign one staff member to welcome and settle the family while you personally handle the premium customer.", ur: "آپ واضح طور پر کام تقسیم کرتے ہیں—ایک اسٹاف کو فیملی کو ویلکم/سیٹل کرنے دیتے ہیں جبکہ آپ خود پریمیئم کسٹمر کو ہینڈل کرتے ہیں۔" },
      { key: 'D', en: "You split your attention between both to ensure neither feels ignored.", ur: "آپ دونوں کے درمیان توجہ تقسیم کرتے ہیں تاکہ کسی کو بھی نظر انداز محسوس نہ ہو۔" }
    ]
  },
  // --- WRITTEN SECTION (13-15) ---
  {
    id: 13,
    type: 'text',
    en: "Q13. A high-potential salesperson is strong at closing but weak at listening and is starting to generate complaints. How would you coach them over the next two weeks? (Be specific.)",
    ur: "سوال 13: ایک ہائی پوٹینشل سیلز پرسن کلوزنگ میں مضبوط ہے مگر ”مشاورت/کنسلٹیٹو سیلنگ“ اور درست سوالات پوچھنے میں کمزور ہے۔ آپ اگلے دو ہفتوں میں اسے کیسے کوچ کریں گے؟ (واضح اور مخصوص رہیں)"
  },
  {
    id: 14,
    type: 'text',
    en: "Q14. A customer believes the “premium” positioning is mostly marketing. In 4–6 lines, how would you diagnose what premium means to them and guide the conversation without sounding defensive?",
    ur: "سوال 14: ایک کسٹمر سمجھتا ہے کہ ”پریمیئم“ پوزیشننگ زیادہ تر مارکیٹنگ ہے اور حقیقی قدر نہیں۔ آپ یہ جاننے کے لیے کیا سوالات کریں گے کہ ان کے لیے پریمیئم کا مطلب کیا ہے، اور گفتگو کو دفاعی لگے بغیر کیسے آگے بڑھائیں گے؟"
  },
  {
    id: 15,
    type: 'text',
    en: "Q15. Imagine you are facing supply chain issues that might delay deliveries of premium cars. How would you manage communication with customers who have made pre-bookings, especially in a high-demand situation for a model like the Fronx?",
    ur: "سوال 15: فرض کریں سپلائی چین کے مسائل کی وجہ سے پریمیئم گاڑیوں کی ڈیلیوری میں تاخیر ہو سکتی ہے۔ ایسی صورتحال میں، خاص طور پر فرونکس جیسے ہائی ڈیمانڈ ماڈل کی پری بکنگ کرنے والے کسٹمرز کے ساتھ آپ کمیونیکیشن کو کیسے منیج کریں گے؟"
  }
];

function App() {
  const [step, setStep] = useState('welcome'); // welcome, lang, assessment, paper, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '',
    cnic: '',
    city: '',
    dealership: ''
  });
  const [responses, setResponses] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState('en');
  const [participants, setParticipants] = useState([]);

  // --- LOAD CSV DATA ---
  useEffect(() => {
    Papa.parse('/data/participants.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const cleanData = results.data.map(row => {
          const newRow = {};
          Object.keys(row).forEach(key => {
            newRow[key.trim()] = row[key] ? row[key].trim() : '';
          });
          return newRow;
        });
        setParticipants(cleanData);
      },
      error: (err) => console.error("Error loading CSV:", err)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, currentQuestionIndex]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cnic') {
      let cleanVal = value.replace(/\D/g, '');
      if (cleanVal.length > 13) cleanVal = cleanVal.slice(0, 13);
      let formattedVal = cleanVal;
      if (cleanVal.length > 5) formattedVal = `${cleanVal.slice(0, 5)}-${cleanVal.slice(5)}`;
      if (cleanVal.length > 12) formattedVal = `${formattedVal.slice(0, 13)}-${formattedVal.slice(13)}`;
      setUserInfo({ ...userInfo, cnic: formattedVal });
      if(error) setError('');
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleStart = () => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(userInfo.cnic)) {
      setError('Invalid CNIC format. Use xxxxx-xxxxxxx-x');
      return;
    }

    const foundParticipant = participants.find(p => p.cnic === userInfo.cnic);
    if (!foundParticipant) {
      setError('Your CNIC number does not match our records. Access denied.');
      return;
    }

    setUserInfo(prev => ({
      ...prev,
      name: foundParticipant.name || prev.name,
      city: foundParticipant.region || prev.city,
      dealership: foundParticipant.dealership || prev.dealership
    }));

    setError('');
    setStep('lang');
  };

  const handleLangSelect = (selectedLang) => {
    setLang(selectedLang);
    setStep('assessment');
  };

  // --- SCORE HANDLER (ENFORCES UNIQUE SCORES) ---
  const handleScoreChange = (qId, optionKey, newScore) => {
    setResponses(prev => {
      const currentQ = prev[qId] || {};
      const updatedQ = { ...currentQ, [optionKey]: newScore };

      // Check for duplicates and clear the old one
      Object.keys(updatedQ).forEach(key => {
        if (key !== optionKey && updatedQ[key] === newScore) {
          updatedQ[key] = ''; // Clear the duplicate
        }
      });

      return { ...prev, [qId]: updatedQ };
    });
  };

  const validateCurrentQuestion = () => {
    const q = questionsB[currentQuestionIndex];
    // For MCQs, ensure all 4 options have a score
    const currentScores = responses[q.id] || {};
    const values = ['A', 'B', 'C', 'D'].map(key => currentScores[key]);
    
    // Check if all are filled
    const allFilled = values.every(v => v);
    
    // Check if unique (Set removes duplicates)
    const uniqueValues = new Set(values);
    
    return allFilled && uniqueValues.size === 4;
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      setError('');
      // If we are at Q12 (index 11), go to Paper Section
      if (currentQuestionIndex === 11) {
        setStep('paper');
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } else {
      setError(lang === 'en' ? 'Please assign a unique score (1-4) to each option.' : 'براہ کرم ہر آپشن کو ایک منفرد اسکور (1-4) دیں۔');
    }
  };

  const handlePrevious = () => {
    setError('');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting Data:", { userInfo, responses });

    try {
      // NOTE: Ensure this URL matches your deployed Variant B backend
      const response = await fetch('https://sjt-backend-b.onrender.com/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInfo, responses }),
      });

      if (response.ok) {
        setStep('results');
      } else {
        setError(lang === 'en' ? "Submission failed. Please try again." : "جمع کرانے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں۔");
      }
    } catch (err) {
      console.error(err);
      setError(lang === 'en' ? "Network error. Check connection." : "نیٹ ورک کی خرابی۔ کنکشن چیک کریں۔");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERERS ---

  const renderWelcome = () => (
    <Paper elevation={3} sx={containerStyles}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box component="img" src={logo} alt="Logo" sx={{ maxWidth: { xs: '100px', sm: '120px' }, height: 'auto' }} />
        <Typography variant="h1">Situational Judgement Test</Typography>
        <Typography variant="h2" sx={{fontSize: '1.2rem', color: 'text.secondary'}}>Variant B</Typography>
      </Box>
      
      <Box sx={{ maxWidth: { xs: '100%', sm: 500 }, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2, px: { xs: 1, sm: 0 } }}>
        <TextField 
          fullWidth 
          label="CNIC (xxxxx-xxxxxxx-x)" 
          name="cnic" 
          variant="outlined" 
          value={userInfo.cnic} 
          onChange={handleInputChange} 
          inputProps={{ maxLength: 15 }} 
          helperText="Enter your CNIC to verify registration."
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" size="large" color="primary" onClick={handleStart} startIcon={<RocketLaunchIcon />} sx={{ mt: 2, py: 1.5 }}>
          Start Assessment
        </Button>
      </Box>
    </Paper>
  );

  const renderLanguage = () => (
    <Paper elevation={3} sx={containerStyles}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <LanguageIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2">Select Language / زبان منتخب کریں</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button variant="contained" size="large" onClick={() => handleLangSelect('en')} sx={{ py: 2, px: 4, fontSize: '1.2rem' }}>
          English
        </Button>
        <Button variant="contained" color="secondary" size="large" onClick={() => handleLangSelect('ur')} sx={{ py: 2, px: 4, fontSize: '1.2rem', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>
          اردو
        </Button>
      </Box>
    </Paper>
  );

  const renderAssessment = () => {
    const q = questionsB[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / 12) * 100; // Progress based on 12 MCQs

    return (
      <Paper sx={containerStyles} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
            Question {currentQuestionIndex + 1} of 12
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: '8px', borderRadius: '4px', mb: 2 }} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {lang === 'en' ? q.en : q.ur}
          </Typography>

          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              {lang === 'en' 
                ? "Rate EACH option from 1 (Most Effective) to 4 (Least Effective)." 
                : "ہر آپشن کو 1 (سب سے زیادہ مؤثر) سے 4 (سب سے کم مؤثر) تک درجہ دیں۔"}
            </Alert>
            
            {q.options.map((opt) => (
              <Paper key={opt.key} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 2, backgroundColor: '#fafafa' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      <span style={{ color: '#F57C00', fontWeight: 'bold', marginRight: 8, marginLeft: 8 }}>{opt.key}.</span> 
                      {lang === 'en' ? opt.en : opt.ur}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small" sx={{ backgroundColor: 'white', minWidth: '140px' }}>
                      <InputLabel>{lang === 'en' ? "Score" : "اسکور"}</InputLabel>
                      <Select
                        value={responses[q.id]?.[opt.key] || ''}
                        label={lang === 'en' ? "Score" : "اسکور"}
                        onChange={(e) => handleScoreChange(q.id, opt.key, e.target.value)}
                      >
                        <MenuItem value={1}>1 - Best</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4 - Worst</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
            startIcon={lang === 'en' ? <ArrowBackIcon /> : <ArrowForwardIcon />}
          >
            {lang === 'en' ? "Previous" : "پچھلا"}
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNext}
            endIcon={lang === 'en' ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          >
            {lang === 'en' ? "Next" : "اگلا"}
          </Button>
        </Box>
      </Paper>
    );
  };

  // --- NEW: RENDER PAPER SECTION (Q13-15) ---
  const renderPaperSection = () => {
    // Get Q13, Q14, Q15
    const paperQuestions = questionsB.slice(12, 15);

    return (
      <Paper sx={containerStyles} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <EditNoteIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h2">
            {lang === 'en' ? "Written Section" : "تحریری حصہ"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {lang === 'en' 
              ? "Please write the answers to the following questions on your answer sheet." 
              : "براہ کرم درج ذیل سوالات کے جوابات اپنی جوابی شیٹ پر لکھیں۔"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {paperQuestions.map((q) => (
          <Box key={q.id} sx={{ mb: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 2, border: '1px solid #eee' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              {lang === 'en' ? `Question ${q.id}` : `سوال ${q.id}`}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              {lang === 'en' ? q.en : q.ur}
            </Typography>
          </Box>
        ))}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
          >
            {isSubmitting 
              ? (lang === 'en' ? "Submitting..." : "جمع ہو رہا ہے...") 
              : (lang === 'en' ? "Submit Test" : "ٹیسٹ جمع کروائیں")}
          </Button>
        </Box>
      </Paper>
    );
  };

  const renderResults = () => (
    <Paper sx={containerStyles}>
      <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
        <Box component="img" src={logo} alt="Logo" sx={{ height: 80, mb: 4 }} />
        <Typography variant="h1" sx={{ mb: 2, color: 'primary.main' }}>Thank You!</Typography>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>Your response has been recorded.</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
           <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50' }} />
        </Box>
      </Box>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
        {step === 'welcome' && renderWelcome()}
        {step === 'lang' && renderLanguage()}
        {step === 'assessment' && renderAssessment()}
        {step === 'paper' && renderPaperSection()}
        {step === 'results' && renderResults()}
      </Container>
    </ThemeProvider>
  );
}

export default App;