import { HeroBanner } from '../components/HeroBanner';
import { VideoRender } from '../components/dashboard/VideoRender';

function Home() {
  return (
    <section className='flex flex-col gap-3 min-h-screen h-[200vh]'>
      <div className="bg-img rounded-[50px] mx-1 mt-2 md:mx-10 md:mt-8 p-8 md:p-16">
        <HeroBanner />
      </div>
      <div className="bg-img rounded-[50px] mt-2 md:mx-10 md:mt-8 md:p-16">
        <VideoRender />
      </div>
    </section>
  );
}

export default Home;
