import { getBannerSlides } from "@/lib/sos-api";
import { BannerSlider } from "./BannerSlider";

export async function AnnouncementBar() {
  const slides = await getBannerSlides();

  if (slides.length === 0) {
    return null;
  }

  return <BannerSlider slides={slides} />;
}
