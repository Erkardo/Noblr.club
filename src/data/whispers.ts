/**
 * Anonymized member whispers — testimonials displayed on Landing. The
 * point isn't proof-of-quality (anyone can fake a quote); the point is
 * to let a visitor mentally rehearse *being* inside, hearing people
 * like them describe their experience.
 *
 * Keep these in-voice: restrained, slightly reflective, specific. Avoid
 * superlatives, product-marketing verbs, and anything that sounds like
 * a testimonial generator.
 */

export interface Whisper {
  quote: string;
  attribution: string;    // masked member number + role
  sinceYear: number;
}

export const MEMBER_WHISPERS: Whisper[] = [
  {
    quote: 'Би Noblr-т орохоосоо өмнө өөрийгөө дунд нас руу ойртсон бизнесмэн гэж бодож байсан. Энд орсны дараа л, "Миний нас арай өөр хүмүүс хайх гэж ордог юм байна" гэдгээ ойлгосон.',
    attribution: 'Member No. 0089 · Founder',
    sinceYear: 2024,
  },
  {
    quote: 'Хоёр жилд гурван удаа л очсон Private Dinner. Гэхдээ тэр гурван уулзалт, миний сүүлийн арван жилд танилцсан хүн бүрээс илүү нөлөөтэй болсон.',
    attribution: 'Member No. 0034 · Principal',
    sinceYear: 2023,
  },
  {
    quote: 'Instagram дээр хүн танилцдаггүй. Энд танилцдаг. Хоёулаа ажил хийхийг хүсдэг хүмүүс хоёулаа ажилаа орхихыг хүсч байгаа хүмүүсийг уулзуулахгүй.',
    attribution: 'Member No. 0158 · Strategic Advisor',
    sinceYear: 2024,
  },
  {
    quote: 'Эхнэр бид хоёр Noblr-ээс танилцсан. Гурав дахь болзооныхоо үеэр бид хоёулаа чимээгүй болж, "Бид хоёрыг яг хэн хэрхэн танилцуулсныг мэдэхгүй ч, энэ нь зөв сонголт хийсэн байна" гэж хэлсэн.',
    attribution: 'Member No. 0012 · Managing Partner',
    sinceYear: 2023,
  },
  {
    quote: 'Энд ирсэн хүмүүсийн тухайд нэг зүйл нийтлэг байдаг: хэн ч ердийн биш. Гэхдээ хэн ч өөрийгөө ердийн бишээ харуулах гэж оролддоггүй.',
    attribution: 'Member No. 0204 · Curator',
    sinceYear: 2025,
  },
];
