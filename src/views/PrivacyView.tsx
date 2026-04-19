import { motion } from 'motion/react';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';

export function PrivacyView() {
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
        <div className="font-caps text-[10px] tracking-[0.3em] text-accent uppercase mb-4">Privacy Notice</div>
        <h1 className="font-display text-4xl md:text-5xl font-light text-text-main mb-10 leading-[1.05] tracking-tight">Нууцлалын бодлого</h1>

        <div className="font-serif font-light text-text-main/80 text-[15px] leading-[1.9] space-y-6">
          <p>
            Noblr (цаашид "Клуб") нь гишүүдийнхээ хувийн мэдээлэл, харилцаа, оролцооны түүхийг нарийн нууцаар хамгаална. Доорхи бодлого нь бидний цуглуулж буй мэдээлэл, түүний ашиглалт, хадгалалтын хэм хэмжээг тодорхойлно.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">Бид ямар мэдээлэл цуглуулдаг вэ?</h2>
          <p>
            Гишүүнчлэлийн өргөдөл гаргахад та нэр, нас, мэргэжил, LinkedIn профайл, хүсэлтийн мэдэгдэл зэргийг өөрөө сайн дураар үлдээнэ. Эдгээр мэдээлэл нь зөвхөн хорооны үнэлгээнд ашиглагдана.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">Хэрхэн хадгалагддаг вэ?</h2>
          <p>
            Бүх мэдээлэл шифрлэгдсэн системд хадгалагдана. Таны хүсэлтээр бид мэдээллийг устгах боломжтой. Гуравдагч этгээдэд дамжуулахгүй, зар сурталчилгаанд ашиглахгүй.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">Гишүүдийн хоорондын харилцаа</h2>
          <p>
            Танилцуулга хүлээн авсан хоёр тал харилцан зөвшөөрсөн үед л contact coordinates солилцдог. Харилцааны агуулгыг Клуб хянадаггүй, хадгалдаггүй.
          </p>

          <h2 className="font-display text-2xl text-text-main pt-8 mb-3">Таны эрх</h2>
          <p>
            Та өөрийн мэдээллийг харах, засах, устгах эрхтэй. Асуудал гарвал <span className="text-accent">privacy@noblr.club</span> хаяг руу хандана уу.
          </p>

          <p className="font-sans text-[12px] text-text-dim pt-10 border-t border-accent-20 mt-12">
            Энэхүү бодлого сүүлд шинэчлэгдсэн: 2026 оны 04 сар. Үндсэн шинэчлэл гарахад таныг мэдэгдэнэ.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
