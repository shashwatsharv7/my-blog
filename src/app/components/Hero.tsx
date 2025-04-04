export default function Hero() {
    return (
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-white mb-6 font-bold tracking-tight animate-[fadeIn_0.8s_ease-in]">
            Explore Mithila
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto animate-[fadeIn_1s_ease-in]">
            A curated collection of literary insights, book recommendations, and author perspectives on the great land of mithila
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[fadeIn_1.2s_ease-in]">
            <a href="#latest-posts" className="btn btn-primary">
              Discover Posts
            </a>
            <a href="/reference-texts" className="btn bg-white text-blue-600 hover:bg-gray-100">
              Browse References
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
    );
  }
  