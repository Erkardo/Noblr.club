import { motion } from 'motion/react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';

export function TermsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-20"
    >
      <NoiseOverlay />
      <div className="relative z-10">
        <div className="font-caps text-[10px] tracking-[0.3em] text-accent uppercase mb-4">Membership Terms</div>
        <h1 className="font-display text-4xl md:text-5xl font-light text-text-main mb-10 leading-[1.05] tracking-tight">Гишүүнчлэлийн гэрээ</h1>

        <div className="font-serif font-light text-text-main/80 text-[15px] leading-[1.9] space-y-6">
          <p>
            Noblr (цаашид "Клуб") нь Улаанбаатарын мэргэжлийн түвшингийн хувь хүмүүсийг нэгтгэсэн хаалттай нийгэмлэг юм. Гишүүнчлэлд бүртгүүлэх нь та дараах нөхцөлийг хүлээн зөвшөөрч байгааг илэрхийлнэ.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">1. Шалгаруулалт</h2>
          <p>
            Өргөдөл гаргах нь гишүүнчлэл баталгаажсан гэсэн үг биш. Хаалттай хороо нь шалгуурын үндсэн дээр эцсийн шийдвэр гаргана. Шалгуур хангаагүй тохиолдолд ямар ч тайлбар өгөхгүй.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">2. Нууцлал ба зан үйл</h2>
          <p>
            Гишүүд бие биеийнхээ хувийн мэдээллийг гуравдагч этгээдтэй хуваалцахгүй. Танилцуулга, харилцаа бүхэнд ёс зүйт, бусдыг хүндэтгэсэн байдлыг шаардана.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">3. Зургийн хориг</h2>
          <p>
            Клубын арга хэмжээнд зураг авах, видео бичлэг хийхийг хориглоно. Нийгмийн сүлжээнд Клубын дотоод мэдээллийг ил гаргахыг мөн хориглоно.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">4. Гишүүнчлэл цуцлах</h2>
          <p>
            Хороо нь ямар ч үед, ямар ч тайлбаргүйгээр гишүүнчлэлийг түр зогсоох эсвэл бүрмөсөн цуцлах эрхтэй. Ийм тохиолдолд үлдэгдэл гишүүнчлэлийн төлбөр буцаан олгогдохгүй.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">5. Хариуцлага</h2>
          <p>
            Клуб нь гишүүдийн хоорондын харилцаа, уулзалтын үр дүнг хариуцахгүй. Гишүүд биечлэн уулзалт хийх, харилцаа үүсгэх шийдвэрийг өөрийн жолоодлого, аюулгүй байдлаар баталгаажуулна.
          </p>

          <p className="font-sans text-[12px] text-text-dim pt-10 border-t border-accent-20 mt-12">
            Гэрээ сүүлд шинэчлэгдсэн: 2026 оны 04 сар. Асуудал байвал <span className="text-accent">hello@noblr.club</span> хаяг руу хандана уу.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
