
export const TestimonialSection = () => {
  return (
    <section className="py-20 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="bg-card border rounded-lg p-8 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-4">
              <span className="text-lg font-bold">JD</span>
            </div>
            <div>
              <h4 className="font-semibold">Jane Doe</h4>
              <p className="text-sm text-muted-foreground">Dividend Investor</p>
            </div>
          </div>
          <p className="text-lg italic">
            "Dividnd has transformed the way I manage my dividend portfolio. 
            Its clean interface and real-time updates make tracking my passive income effortless. 
            I've achieved my dividend income goals faster than I expected!"
          </p>
        </div>
      </div>
    </section>
  );
};
