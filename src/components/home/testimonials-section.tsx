import { TestimonialsCarousel } from '@/components/home/testimonials';
import { getHomeContent, getTestimonials } from '@/lib/cms/queries';

/** Client voices — copy and quotes from the CMS, carousel on the client. */
export async function Testimonials() {
  const [home, testimonials] = await Promise.all([getHomeContent(), getTestimonials()]);
  if (!testimonials.length) return null;
  return <TestimonialsCarousel section={home.testimonialsSection} testimonials={testimonials} />;
}
