import { motion } from 'motion/react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';

export function AboutView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-24"
    >
      <NoiseOverlay />
      <div className="relative z-10">
        <div className="font-caps text-[10px] tracking-[0.4em] text-accent uppercase mb-4">On Noblr</div>
        <h1 className="font-display text-4xl md:text-6xl font-light text-text-main mb-12 leading-[1.05] tracking-[-0.015em]">
          Бид <span className="italic text-text-dim">swipe хийдэггүй.</span> Бид танилцуулагддаг.
        </h1>

        <div className="font-serif font-light text-text-main/85 text-[16px] leading-[1.9] space-y-7">
          <p>
            Noblr бол нийгмийн сүлжээний шуугианаас алслагдсан, сонгомол гишүүдийн дундаа л амьдардаг хаалттай нийгэмлэг юм. Хүн бүрт зориулагдаагүй. Хүн бүр орох боломжгүй.
          </p>

          <p>
            Биднийг урилгаар элсэх бусдаас юу ялгаруулдаг вэ? — Энд та swipe хийхгүй, хайхгүй, feed гүйлгэхгүй. Харин долоо хоногт нэг удаа, өглөөний 8 цагт, таны dossier-т яг таны үнэлэмжтэй ижил хэмжээний нэг хүний танилцуулга ирнэ. Ирэхдээ бодит нэр, мэргэжил, хүсэл сонирхлын талаар бидний хорооноос нягтлагдсан товч тайлбартай.
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-light text-text-main pt-10 pb-2">
            Бидний гурван зарчим
          </h2>

          <div className="space-y-6 pt-2">
            <Principle
              n="I"
              title="Хүлээлт бол хүндлэл"
              body="Хурдан биш, чанарлаг. Долоо хоногт нэг удаа танилцуулга. Шөнийн 22:00-с өглөөний 08:00 хүртэл quiet hours. Бид таны амралт, анхаарлыг үнэлдэг."
            />
            <Principle
              n="II"
              title="Chat биш, correspondence"
              body="Read receipt, online, typing гэх мэт signal-ууд байхгүй. Нэг удаа дипшч илгээнэ, хоёр тал зөвшөөрвөл бодит амьдрал дээр уулзана. Биднийг Messenger биш — бид захидлын хэв маягаар ажилладаг."
            />
            <Principle
              n="III"
              title="Нэр хүнд нь гишүүд хариуцна"
              body="Гишүүн бүрд ердөө 3 урилга. Амжилттай таньсан хүн бүрд 1 сэргэнэ. Муу шалгагч хурдан хоосрох системтэй. Curation-ийг curator нар хариуцна."
            />
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-light text-text-main pt-10 pb-2">
            Үүсгэгч нь хэн бэ
          </h2>

          <p>
            Үүсгэгч нь анонимоор үлдэж байгаа. Энэ нь брэндийн дуу хоолой нь тэр өөрөө биш, нийгэмлэг бүхэлдээ байхыг зорьсных. Raya-ийн 2015-аас явж ирсэн загвартай ижил. Бидний хувьд хэн үүсгэсэн биш, хэн гишүүн болохыг л харуулах гэсэн сонголт.
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-light text-text-main pt-10 pb-2">
            Бид хэнийг сонгодог вэ
          </h2>

          <p>
            Улаанбаатарт амьдардаг, ямар нэгэн салбарт гүнзгий тогтолцоотой, бодсоноо илэрхийлж чаддаг, бусдын цагийг үнэлдэг — эдгээр нь бидний хайдаг зүйл. Нас бол ≥26, боловсрол бол гол биш ч бие даан сэтгэдэг хэм хэмжээ. Мөнгөтэй эсэх нь хариугүй, харин юунд нөхцөлдөөд амьдарч байгаа нь чухал.
          </p>

          <div className="border-l-2 border-accent pl-6 py-3 my-10 font-serif italic text-[16px] text-text-main">
            "Noble isn't a profession. It's a disposition."
          </div>

          <p className="font-sans text-[11px] text-text-dim/60 pt-12 border-t border-accent-20 mt-16 tracking-wider leading-relaxed">
            Энэ нь харилцаа зуучлах платформ биш. Noblr бол санаатай, удаан, хичээнгүй уулзалтуудыг бий болгохыг зорьсон хаалттай хүрээлэн. Хэрвээ та оролцохыг хүсч байгаа бол дэлгэрэнгүй шалгуурыг нүүр хуудасны <span className="text-accent">"Two paths"</span> хэсгээс үзнэ үү.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Principle({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-5 items-start">
      <span className="font-display italic text-accent text-[22px] md:text-[28px] leading-none shrink-0 pt-1">{n}</span>
      <div>
        <div className="font-caps text-[11px] tracking-[0.25em] text-text-main uppercase mb-2">{title}</div>
        <div className="font-serif text-[14px] md:text-[15px] text-text-dim leading-relaxed">{body}</div>
      </div>
    </div>
  );
}
