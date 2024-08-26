import HeroBanner from '../components/HeroBanner';
import VideoRender from '../components/dashboard/VideoRender';

function Home() {

  return (
    <section className='flex flex-col gap-3'>
      <section className="bg-img rounded-[50px] mx-1 mt-2 md:mx-10 md:mt-8 p-8 md:p-16">
        <HeroBanner />
      </section>
      <section className="bg-img rounded-[50px] mt-2 md:mx-10 md:mt-8 md:p-16">
        <VideoRender />
      </section>
    </section>
  );
}

export default Home;
